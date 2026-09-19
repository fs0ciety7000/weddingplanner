"use client";

import { useTransition } from "react";
import { setVenueScore } from "@/lib/actions/venues";
import { StarRatingControl } from "@/components/star-rating";

export function ScoreCell({
  venueId,
  criterionId,
  value,
}: {
  venueId: string;
  criterionId: string;
  value: number | null;
}) {
  const [, startTransition] = useTransition();

  return (
    <StarRatingControl
      value={value ?? 0}
      onChange={(score) => startTransition(() => setVenueScore(venueId, criterionId, score))}
    />
  );
}
