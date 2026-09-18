/**
 * Licensing Two-Tier Cache (Wave 8)
 *
 * Implements low-latency, short-lived caching for school license status:
 * - L1: Fast in-process Map with 5-minute TTL (sub-millisecond lookups, handles offline DB)
 * - L2: Cloudflare Workers KV (`env.LICENSES_KV`) when bound in edge deployment
 * - Explicit cache invalidation upon administrative plan/status updates
 */

import type { SchoolLicenseDTO, LicenseStatus, LicensePlan } from "./types";

interface CacheEntry {
  license: SchoolLicenseDTO;
  expiresAt: number;
}

const MEMORY_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL
const memoryCache = new Map<string, CacheEntry>();

/**
 * Format raw database license record into standardized SchoolLicenseDTO with computed flags
 */
export function formatLicenseDTO(record: any, schoolName?: string): SchoolLicenseDTO {
  const now = new Date();
  const trialEndsAt = record.trialEndsAt ? new Date(record.trialEndsAt) : null;
  const renewalDate = record.renewalDate ? new Date(record.renewalDate) : null;
  const gracePeriodEndsAt = record.gracePeriodEndsAt ? new Date(record.gracePeriodEndsAt) : null;

  // Calculate days remaining in active or trial period
  let daysRemaining = 0;
  if (record.status === "trial" && trialEndsAt) {
    const diff = trialEndsAt.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  } else if (record.status === "active" && renewalDate) {
    const diff = renewalDate.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  } else if (record.status === "grace_period" && gracePeriodEndsAt) {
    const diff = gracePeriodEndsAt.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const status = record.status as LicenseStatus;
  const plan = record.plan as LicensePlan;

  return {
    id: record.id,
    schoolId: record.schoolId,
    schoolName: schoolName || record.schoolName,
    plan,
    status,
    trialEndsAt: trialEndsAt ? trialEndsAt.toISOString() : null,
    gracePeriodEndsAt: gracePeriodEndsAt ? gracePeriodEndsAt.toISOString() : null,
    renewalDate: renewalDate ? renewalDate.toISOString() : null,
    studentCountLimit: record.studentCountLimit ?? null,
    daysRemaining,
    isTrial: status === "trial",
    isGracePeriod: status === "grace_period",
    isSuspended: status === "suspended",
    isActive: status === "active" || status === "trial",
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt || new Date().toISOString()),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt || new Date().toISOString()),
  };
}

/**
 * Retrieve license from cache (L1 Memory Map -> L2 Cloudflare KV)
 */
export async function getCachedLicense(
  schoolId: string,
  env?: any
): Promise<SchoolLicenseDTO | null> {
  const now = Date.now();

  // 1. Check L1 Memory Cache
  const memoryEntry = memoryCache.get(schoolId);
  if (memoryEntry && memoryEntry.expiresAt > now) {
    return memoryEntry.license;
  }
  if (memoryEntry && memoryEntry.expiresAt <= now) {
    memoryCache.delete(schoolId);
  }

  // 2. Check L2 Cloudflare KV (if bound)
  if (env?.LICENSES_KV) {
    try {
      const kvData = await env.LICENSES_KV.get(schoolId, "json");
      if (kvData) {
        // Backfill L1
        memoryCache.set(schoolId, {
          license: kvData,
          expiresAt: now + MEMORY_TTL_MS,
        });
        return kvData as SchoolLicenseDTO;
      }
    } catch {
      // Gracefully continue to DB on KV error
    }
  }

  return null;
}

/**
 * Store license in cache (L1 Memory Map + L2 Cloudflare KV)
 */
export async function setCachedLicense(
  schoolId: string,
  license: SchoolLicenseDTO,
  env?: any
): Promise<void> {
  const now = Date.now();

  // 1. Set L1 Memory Cache
  memoryCache.set(schoolId, {
    license,
    expiresAt: now + MEMORY_TTL_MS,
  });

  // 2. Set L2 Cloudflare KV (if bound)
  if (env?.LICENSES_KV) {
    try {
      await env.LICENSES_KV.put(schoolId, JSON.stringify(license), {
        expirationTtl: 300, // 5 minutes
      });
    } catch {
      // Gracefully continue if KV unavailable
    }
  }
}

/**
 * Invalidate license cache upon administrative updates
 */
export async function invalidateLicenseCache(
  schoolId: string,
  env?: any
): Promise<void> {
  // 1. Delete from L1 Memory
  memoryCache.delete(schoolId);

  // 2. Delete from L2 KV
  if (env?.LICENSES_KV) {
    try {
      await env.LICENSES_KV.delete(schoolId);
    } catch {
      // Gracefully continue if KV unavailable
    }
  }
}

/**
 * Reset memory cache (useful for automated test runs)
 */
export function clearMemoryLicenseCache(): void {
  memoryCache.clear();
}
