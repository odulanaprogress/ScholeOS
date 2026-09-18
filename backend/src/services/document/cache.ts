/**
 * Document Cache Helper (Wave 7)
 *
 * Implements a two-tier cache:
 * - L1: Fast in-memory map (sub-millisecond lookups, works even when DB is offline)
 * - L2: PostgreSQL `generated_documents` table for persistent cross-instance storage
 */

import { db } from "../../db/index";
import { generatedDocuments } from "../../db/schema/documents";
import { eq, and } from "drizzle-orm";
import type { GeneratedDocumentType } from "./types";

interface CacheEntry {
  cloudinaryUrl: string;
  generatedAt: Date;
}

const memoryCache = new Map<string, CacheEntry>();

function getCacheKey(type: GeneratedDocumentType, referenceId: string): string {
  return `${type}:${referenceId}`;
}

export async function getCachedDocument(
  type: GeneratedDocumentType,
  referenceId: string
): Promise<CacheEntry | null> {
  const key = getCacheKey(type, referenceId);

  // 1. L1 In-Memory Check
  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }

  // 2. L2 PostgreSQL Check
  try {
    const [cachedDoc] = await db
      .select()
      .from(generatedDocuments)
      .where(
        and(
          eq(generatedDocuments.type, type),
          eq(generatedDocuments.referenceId, referenceId)
        )
      )
      .limit(1);

    if (cachedDoc) {
      const entry: CacheEntry = {
        cloudinaryUrl: cachedDoc.cloudinaryUrl,
        generatedAt: cachedDoc.generatedAt,
      };
      memoryCache.set(key, entry);
      return entry;
    }
  } catch (err) {
    // Gracefully continue if DB connection is unavailable (e.g. offline testing)
  }

  return null;
}

export async function saveCachedDocument(
  schoolId: string,
  type: GeneratedDocumentType,
  referenceId: string,
  cloudinaryUrl: string
): Promise<void> {
  const key = getCacheKey(type, referenceId);
  const now = new Date();

  // 1. Store in L1 In-Memory
  memoryCache.set(key, {
    cloudinaryUrl,
    generatedAt: now,
  });

  // 2. Store in L2 PostgreSQL
  try {
    await db.insert(generatedDocuments).values({
      schoolId,
      type,
      referenceId,
      cloudinaryUrl,
      generatedAt: now,
    });
  } catch (err) {
    // Gracefully continue if DB connection is unavailable (e.g. offline testing)
  }
}

export function clearMemoryDocCache(): void {
  memoryCache.clear();
}
