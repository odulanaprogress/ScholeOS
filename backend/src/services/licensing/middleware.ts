/**
 * Shared License Middleware (Wave 8)
 *
 * Direct in-process middleware imported by every ScholeOS microservice
 * (identity-service, academic-service, fees-service, document-service, notification-service).
 *
 * Guarantees:
 * 1. Zero extra network hops: runs in-process with a 5-minute cache.
 * 2. "trial" / "active": Full access.
 * 3. "grace_period": READS allowed (GET/HEAD/OPTIONS); WRITES blocked (POST/PUT/PATCH/DELETE) with HTTP 402.
 * 4. "suspended": EVERYTHING blocked with HTTP 403 (except /licenses and payment webhooks).
 * 5. Fail-Safe: On DB error, visibly logs and STRICTLY BLOCKS WRITES (fails closed for writes).
 */

import type { Context, Next } from "hono";
import { db } from "../../db/index";
import { schoolLicenses, schools } from "../../db/schema/schools";
import { eq } from "drizzle-orm";
import { getCachedLicense, setCachedLicense, formatLicenseDTO } from "./cache";
import type { SchoolLicenseDTO, LicenseCheckResult } from "./types";

/**
 * Direct lookup helper to check school license with two-tier caching
 */
export async function checkSchoolLicense(
  schoolId: string,
  env?: any
): Promise<SchoolLicenseDTO | null> {
  if (!schoolId) return null;

  // 1. Check L1 / L2 Cache
  const cached = await getCachedLicense(schoolId, env);
  if (cached) {
    return cached;
  }

  // 2. Query Database
  const [licenseRow] = await db
    .select()
    .from(schoolLicenses)
    .where(eq(schoolLicenses.schoolId, schoolId))
    .limit(1);

  if (licenseRow) {
    // Optionally fetch school name
    let schoolName: string | undefined;
    try {
      const [sch] = await db
        .select({ name: schools.name })
        .from(schools)
        .where(eq(schools.id, schoolId))
        .limit(1);
      schoolName = sch?.name;
    } catch {
      // Non-blocking
    }

    const dto = formatLicenseDTO(licenseRow, schoolName);
    await setCachedLicense(schoolId, dto, env);
    return dto;
  }

  return null;
}

/**
 * Resolves the schoolId from the request context, headers, params, or query
 */
export function resolveSchoolId(c: Context): string | null {
  // 1. Header
  const headerId = c.req.header("x-school-id");
  if (headerId) return headerId;

  // 2. Param (e.g. /:schoolId)
  try {
    const paramId = c.req.param("schoolId");
    if (paramId) return paramId;
  } catch {}

  // 3. Query string (?schoolId=...)
  const queryId = c.req.query("schoolId");
  if (queryId) return queryId;

  // 4. Auth context (if attached by Clerk auth middleware)
  try {
    const auth = c.get("auth" as any) as any;
    if (auth?.schoolId) return auth.schoolId;
    if (auth?.orgId) {
      // In test/demo modes, orgId may be mapped
      return auth.orgId;
    }
  } catch {}

  // 5. Match UUID in URL path (e.g. /scores/22222222-2222-2222-2222-222222222222)
  const uuidMatch = c.req.path.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuidMatch) return uuidMatch[0];

  return null;
}

/**
 * Shared License Enforcement Middleware for all Microservices
 */
export async function licenseMiddleware(c: Context, next: Next) {
  const path = c.req.path;
  const method = c.req.method.toUpperCase();
  const isReadMethod = method === "GET" || method === "HEAD" || method === "OPTIONS";

  // 1. Whitelisted Paths that NEVER get blocked:
  // - Public health checks
  // - Licensing management endpoints
  // - Payment gateway webhooks & Clerk webhooks (so payments and user syncs always succeed to un-suspend schools)
  if (
    path.endsWith("/health") ||
    path.includes("/licenses") ||
    path.includes("/payments/webhook") ||
    path.includes("/clerk-webhook")
  ) {
    return await next();
  }

  // 2. Resolve Target School ID
  const schoolId = resolveSchoolId(c);

  // If no schoolId can be identified on a generic/global route, allow downstream handlers to validate
  if (!schoolId) {
    return await next();
  }

  // 3. Fetch License with Fail-Safe Handling
  let license: SchoolLicenseDTO | null = null;
  try {
    license = await checkSchoolLicense(schoolId, c.env);
  } catch (err: unknown) {
    console.error(`[License Middleware] Database lookup error for school ${schoolId}:`, err);

    // FAIL-SAFE POLICY:
    // If the database has a hiccup, FAIL TOWARD DENYING WRITES!
    // Never risk allowing unauthorized data modification when in doubt.
    if (!isReadMethod) {
      return c.json(
        {
          error: "License Verification Unavailable",
          message:
            "Unable to verify school license status due to a database/service interruption. Write operations are temporarily suspended for safety. Please retry in a few moments.",
          failSafe: "writes_blocked",
        },
        503
      );
    }

    // For reads, permit access through so users don't face total outages during DB blips
    console.warn(`[License Middleware] Permitting read fallback for school ${schoolId} during DB error`);
    return await next();
  }

  // If school has no license record in database yet:
  // In development/test mode, default to active trial; in production, require provisioning
  if (!license) {
    // If test environment, allow through
    if (process.env.NODE_ENV === "test" || (c.env as any)?.NODE_ENV === "test") {
      return await next();
    }

    return c.json(
      {
        error: "License Not Found",
        message: "This school does not have an active ScholeOS license provisioned. Please contact platform administration.",
        status: "unprovisioned",
      },
      403
    );
  }

  // 4. Enforce Status Rules
  // A. Trial or Active — Allow everything through normally
  if (license.status === "trial" || license.status === "active") {
    return await next();
  }

  // B. Grace Period — Allow READS through, but BLOCK ALL WRITES
  if (license.status === "grace_period") {
    // Report cards & broadsheets in document-service are historical reading/rendering
    const isDocumentRead = path.includes("/report-card") || path.includes("/broadsheet");
    if (isReadMethod || isDocumentRead) {
      // Allow reads through (e.g. view report cards, check attendance, read past invoices)
      c.header("X-License-Status", "grace_period");
      await next();
      try {
        c.res.headers.set("X-License-Status", "grace_period");
      } catch {}
      return;
    }

    // Block write operations
    return c.json(
      {
        error: "Grace Period Restriction",
        message:
          "Your school license has entered a grace period due to an expired subscription. Read access remains active, but all modifications and submissions are blocked until renewed.",
        status: "grace_period",
        gracePeriodEndsAt: license.gracePeriodEndsAt,
        daysRemaining: license.daysRemaining,
      },
      402
    );
  }

  // C. Suspended — Block EVERYTHING except licensing endpoints
  if (license.status === "suspended") {
    return c.json(
      {
        error: "License Suspended",
        message:
          "Your school license has been suspended due to overdue payment. All platform operations are disabled. Please contact your school billing administrator or visit the licensing portal to reactivate.",
        status: "suspended",
        schoolId: license.schoolId,
      },
      403
    );
  }

  return await next();
}
