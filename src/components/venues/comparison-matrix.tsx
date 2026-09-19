import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreCell } from "@/components/venues/score-cell";
import { adjustCriterionWeight, createCriterion, deleteCriterion } from "@/lib/actions/venues";
import { computeVenueScore } from "@/lib/venue-score";
import { cn } from "@/lib/utils";
import type { Criterion, Venue, VenueScore } from "@/lib/types/database";

type VenueWithScores = Venue & { venue_scores: VenueScore[] };

export function ComparisonMatrix({
  weddingId,
  venues,
  criteria,
}: {
  weddingId: string;
  venues: VenueWithScores[];
  criteria: Criterion[];
}) {
  const withScore = venues.map((venue) => ({
    venue,
    score: computeVenueScore(venue.venue_scores, criteria),
  }));

  withScore.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const best = Math.max(0, ...withScore.map((v) => v.score ?? 0));

  if (venues.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
        Ajoutez des lieux pour commencer à les comparer.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border border-line">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="min-w-44">Critère</TableHead>
              {withScore.map(({ venue, score }) => (
                <TableHead
                  key={venue.id}
                  className={cn("min-w-40 text-center", score === best && best > 0 && "bg-sage-pale")}
                >
                  <Link href={`/venues/${venue.id}`} className="font-heading text-base hover:text-sage-deep hover:underline">
                    {venue.name}
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((criterion) => (
              <TableRow key={criterion.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center justify-between gap-2">
                    <span>{criterion.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>poids</span>
                      <form action={adjustCriterionWeight.bind(null, criterion.id, -0.5)}>
                        <button type="submit" className="rounded border border-line-strong px-1 hover:bg-muted" aria-label="Diminuer le poids">
                          <Minus className="h-2.5 w-2.5" strokeWidth={2} />
                        </button>
                      </form>
                      <b className="tabular-nums">{criterion.weight}</b>
                      <form action={adjustCriterionWeight.bind(null, criterion.id, 0.5)}>
                        <button type="submit" className="rounded border border-line-strong px-1 hover:bg-muted" aria-label="Augmenter le poids">
                          <Plus className="h-2.5 w-2.5" strokeWidth={2} />
                        </button>
                      </form>
                      <form action={deleteCriterion.bind(null, criterion.id)}>
                        <button type="submit" className="ml-1 text-muted-foreground/60 hover:text-destructive" aria-label="Supprimer le critère">
                          <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </form>
                    </div>
                  </div>
                </TableCell>
                {withScore.map(({ venue, score }) => {
                  const existing = venue.venue_scores.find((s) => s.criterion_id === criterion.id);
                  return (
                    <TableCell key={venue.id} className={cn("text-center", score === best && best > 0 && "bg-sage-pale/50")}>
                      <ScoreCell venueId={venue.id} criterionId={criterion.id} value={existing?.score ?? null} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow className="bg-muted/40 font-semibold hover:bg-muted/40">
              <TableCell>Score pondéré</TableCell>
              {withScore.map(({ venue, score }) => (
                <TableCell key={venue.id} className={cn("text-center", score === best && best > 0 && "bg-sage-pale")}>
                  {score !== null ? (
                    <span className="text-h3 tabular-nums text-sage-deep">
                      {score}
                      <span className="text-xs font-normal text-muted-foreground">/100</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <form
        action={createCriterion.bind(null, weddingId)}
        className="flex flex-wrap items-end gap-2 rounded-md border border-dashed border-line p-3"
      >
        <div className="space-y-1">
          <label className="text-label text-muted-foreground" htmlFor="criterion-name">
            Nouveau critère
          </label>
          <Input id="criterion-name" name="name" placeholder="Ex. Lumière naturelle" className="w-56" required />
        </div>
        <div className="space-y-1">
          <label className="text-label text-muted-foreground" htmlFor="criterion-weight">
            Pondération
          </label>
          <Input id="criterion-weight" name="weight" type="number" step="0.5" min="0.5" defaultValue={1} className="w-24" />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Ajouter le critère
        </Button>
      </form>
    </div>
  );
}
