/**
 * AI Feature Gating & Quota Rate Limiter (Wave 9)
 *
 * Implements:
 * 1. Plan-to-feature mapping:
 *    - basic: [] (AI disabled)
 *    - trial: ["ai_assistant"] (trial evaluation enabled)
 *    - premium: ["ai_assistant"] (enabled)
 *    - unlimited: ["ai_assistant", "unlimited_ai"] (enabled)
 * 2. requireAiFeature: Hono middleware rejecting Basic plan with HTTP 403
 * 3. checkAiQuota & logAiUsage: Tracks token consumption and protects against runaway costs
 */

import type { Context, Next } from "hono";
import { db } from "../../db/index";
import { aiUsageLogs } from "../../db/schema/ai";
import { checkSchoolLicense, resolveSchoolId } from "../licensing/middleware";
import type { LicensePlan } from "../licensing/types";
import type { UsageRecord } from "./types";
import { sql, eq, and, gte } from "drizzle-orm";

/**
 * Plan to features capability map
 */
export const PLAN_FEATURES_MAP: Record<LicensePlan, string[]> = {
  basic: [], // Basic plan has no AI access
  trial: ["ai_assistant"], // Full evaluation access during trial
  premium: ["ai_assistant"],
  unlimited: ["ai_assistant", "unlimited_ai"],
};

/**
 * Default Monthly AI Token Quota per School (protects against runaway API costs)
 */
export const DEFAULT_MONTHLY_TOKEN_QUOTA = 500_000;

// Fast in-memory token tracker to avoid querying DB on every sub-call
const memoryUsageTracker = new Map<string, { used: number; resetAt: number }>();

/**
 * Checks if a school has remaining AI token quota for the current 30-day window
 */
export async function checkAiQuota(
  schoolId: string,
  quotaLimit = DEFAULT_MONTHLY_TOKEN_QUOTA
): Promise<{ allowed: boolean; usedTokens: number; limit: number }> {
  const now = Date.now();
  const cached = memoryUsageTracker.get(schoolId);

  if (cached && cached.resetAt > now) {
    if (cached.used >= quotaLimit) {
      return { allowed: false, usedTokens: cached.used, limit: quotaLimit };
    }
    return { allowed: true, usedTokens: cached.used, limit: quotaLimit };
  }

  // Calculate sum of tokens used over past 30 days from PostgreSQL
  try {
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const [result] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${aiUsageLogs.totalTokens}), 0)`,
      })
      .from(aiUsageLogs)
      .where(
        and(
          eq(aiUsageLogs.schoolId, schoolId),
          gte(aiUsageLogs.createdAt, thirtyDaysAgo)
        )
      );

    const used = Number(result?.total || 0);
    memoryUsageTracker.set(schoolId, {
      used,
      resetAt: now + 5 * 60 * 1000, // 5 min cache
    });

    if (used >= quotaLimit) {
      return { allowed: false, usedTokens: used, limit: quotaLimit };
    }
    return { allowed: true, usedTokens: used, limit: quotaLimit };
  } catch (err) {
    // Graceful offline fallback
    const memUsed = cached?.used || 0;
    return { allowed: memUsed < quotaLimit, usedTokens: memUsed, limit: quotaLimit };
  }
}

/**
 * Record token consumption into the ai_usage_log table and in-memory tracker
 */
export async function logAiUsage(record: UsageRecord): Promise<void> {
  // 1. Update in-memory tracker
  const current = memoryUsageTracker.get(record.schoolId);
  const now = Date.now();
  if (current) {
    current.used += record.totalTokens;
  } else {
    memoryUsageTracker.set(record.schoolId, {
      used: record.totalTokens,
      resetAt: now + 5 * 60 * 1000,
    });
  }

  // 2. Insert into PostgreSQL (skipped in unit/integration test mode for speed & offline isolation)
  if (process.env.NODE_ENV === "test") {
    return;
  }

  try {
    await db.insert(aiUsageLogs).values({
      schoolId: record.schoolId,
      userId: record.userId || null,
      endpoint: record.endpoint,
      model: record.model,
      promptTokens: record.promptTokens,
      completionTokens: record.completionTokens,
      totalTokens: record.totalTokens,
      estimatedCostUsd: record.estimatedCostUsd || null,
    });
  } catch (err) {
    console.warn(`[AI Usage Log] DB insert warning for school ${record.schoolId}:`, err);
  }
}

/**
 * Reset memory token tracker (for test isolation)
 */
export function resetMemoryUsageTracker(): void {
  memoryUsageTracker.clear();
}

/**
 * Middleware: Verify school license plan includes AI access
 */
export async function requireAiFeature(c: Context, next: Next) {
  const schoolId = resolveSchoolId(c);

  if (!schoolId) {
    return c.json(
      {
        error: "Missing School Context",
        message: "A valid school ID must be supplied via x-school-id header or path to access AI services.",
      },
      400
    );
  }

  // Check License Plan via licensing-service's shared lookup
  let license: any = null;
  try {
    license = await checkSchoolLicense(schoolId, c.env);
  } catch {
    // Non-blocking in test mode
  }

  const plan: LicensePlan = license?.plan || "basic";
  const features = PLAN_FEATURES_MAP[plan] || [];

  if (!features.includes("ai_assistant")) {
    return c.json(
      {
        error: "Feature Not Available",
        message:
          "AI Assistant and Socratic Tutor are Premium tier features. Your school is currently on the Basic plan. Please upgrade to Premium or Unlimited to activate AI capabilities.",
        plan,
        requiredFeature: "ai_assistant",
      },
      403
    );
  }

  // Check Monthly Token Quota
  const quota = await checkAiQuota(schoolId);
  if (!quota.allowed) {
    return c.json(
      {
        error: "AI Token Quota Exceeded",
        message: `Your school has reached its monthly AI token allocation (${quota.usedTokens.toLocaleString()} / ${quota.limit.toLocaleString()} tokens). Please contact platform administration to increase your quota.`,
        usedTokens: quota.usedTokens,
        limit: quota.limit,
      },
      429
    );
  }

  return await next();
}
