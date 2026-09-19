import Link from "next/link";
import { Pencil, Users, Volume2, ChefHat, BedDouble, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";
import { FormDialog } from "@/components/form-dialog";
import { VenueFields } from "@/components/venues/venue-fields";
import { updateVenue } from "@/lib/actions/venues";
import { formatEUR } from "@/lib/format";
import { venueStatusMeta } from "@/lib/status";
import { computeVenueScore } from "@/lib/venue-score";
import type { Criterion, Venue, VenueScore } from "@/lib/types/database";

export function VenueCard({
  venue,
  criteria,
}: {
  venue: Venue & { venue_scores: VenueScore[] };
  criteria: Criterion[];
}) {
  const status = venueStatusMeta(venue.status);
  const score = computeVenueScore(venue.venue_scores, criteria);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
          <h3 className="text-h3 mt-2 text-foreground">{venue.name}</h3>
          {venue.address && <p className="text-small mt-0.5 text-muted-foreground">{venue.address}</p>}
        </div>
        <div className="flex shrink-0 items-start gap-1">
          {score !== null && (
            <span className="text-display text-sage-deep" title="Score pondéré">
              {score}
              <span className="text-xs font-sans font-normal text-muted-foreground">/100</span>
            </span>
          )}
          <FormDialog
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Modifier le lieu">
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Button>
            }
            title="Modifier le lieu"
            action={updateVenue.bind(null, venue.id)}
          >
            <VenueFields venue={venue} />
          </FormDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {(venue.capacity_seated || venue.capacity_standing) && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {venue.capacity_seated ?? "—"} assis / {venue.capacity_standing ?? "—"} debout
            </span>
          )}
          {venue.sound_curfew && (
            <span className="inline-flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              Sono jusqu&apos;à {venue.sound_curfew.slice(0, 5).replace(":", " h ")}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {venue.catering_exclusive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              <ChefHat className="h-3 w-3" strokeWidth={1.5} />
              Traiteur exclusif
            </span>
          )}
          {venue.onsite_lodging && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              <BedDouble className="h-3 w-3" strokeWidth={1.5} />
              Couchages sur place
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line pt-3">
          <div className="text-sm">
            {venue.price_gross || venue.price_flat ? (
              <div className="space-y-0.5">
                {venue.price_gross && (
                  <p>
                    <span className="text-muted-foreground">Brute </span>
                    <span className="text-body-strong text-foreground">{formatEUR(venue.price_gross)}</span>
                  </p>
                )}
                {venue.price_flat && (
                  <p>
                    <span className="text-muted-foreground">Forfait </span>
                    <span className="text-body-strong text-foreground">{formatEUR(venue.price_flat)}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Tarif non renseigné</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-sage-deep hover:text-sage-deep"
            render={
              <Link href={`/venues/${venue.id}`}>
                Voir la fiche
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
