import type { Criterion, VenueScore } from "@/lib/types/database";

/** Weighted score out of 100, or null when nothing has been scored yet. */
export function computeVenueScore(scores: VenueScore[], criteria: Criterion[]): number | null {
  if (criteria.length === 0) return null;
  let weighted = 0;
  let totalWeight = 0;
  for (const criterion of criteria) {
    const score = scores.find((s) => s.criterion_id === criterion.id);
    weighted += (score?.score ?? 0) * criterion.weight;
    totalWeight += 5 * criterion.weight;
  }
  if (totalWeight === 0) return null;
  const hasAnyScore = scores.length > 0;
  return hasAnyScore ? Math.round((weighted / totalWeight) * 100) : null;
}
