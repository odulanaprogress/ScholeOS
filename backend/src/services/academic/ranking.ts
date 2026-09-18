/**
 * Standard Competition Ranking (1224 Ranking) Algorithm
 *
 * Requirements:
 * - Sort descending by total score.
 * - Items with identical totals share the same position rank.
 * - The subsequent rank skips accordingly (e.g. 1st, 2nd, 2nd, 4th).
 */

export interface RankableEntity {
  total: number;
}

export function computeStandardCompetitionRanks<T extends RankableEntity>(
  items: T[]
): Array<T & { position: number }> {
  if (items.length === 0) return [];

  // 1. Sort descending by total
  const sorted = [...items].sort((a, b) => b.total - a.total);

  // 2. Assign standard competition ranks
  const ranked: Array<T & { position: number }> = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i]!;

    if (i === 0) {
      ranked.push({ ...current, position: 1 });
    } else {
      const prev = sorted[i - 1]!;
      const prevRanked = ranked[i - 1]!;

      if (current.total === prev.total) {
        // Tied with previous item: share same position
        ranked.push({ ...current, position: prevRanked.position });
      } else {
        // Different total: rank matches 1-based index (i + 1), skipping ties
        ranked.push({ ...current, position: i + 1 });
      }
    }
  }

  return ranked;
}

/**
 * Format position number with ordinal suffix (e.g. 1 -> "1st", 2 -> "2nd", 3 -> "3rd")
 */
export function formatOrdinalPosition(position: number): string {
  const mod10 = position % 10;
  const mod100 = position % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${position}st`;
  }
  if (mod10 === 2 && mod100 !== 12) {
    return `${position}nd`;
  }
  if (mod10 === 3 && mod100 !== 13) {
    return `${position}rd`;
  }
  return `${position}th`;
}
