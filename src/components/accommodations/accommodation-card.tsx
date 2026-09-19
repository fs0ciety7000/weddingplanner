import Link from "next/link";
import { Pencil, Clock, BedDouble, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";
import { FormDialog } from "@/components/form-dialog";
import { AccommodationFields } from "@/components/accommodations/accommodation-fields";
import { updateAccommodation } from "@/lib/actions/accommodations";
import { formatEUR } from "@/lib/format";
import { bookingStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Accommodation } from "@/lib/types/database";

export function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  const status = bookingStatusMeta(accommodation.booking_status);
  const close = accommodation.distance_minutes !== null && accommodation.distance_minutes <= 15;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
          <h3 className="text-h3 mt-2 text-foreground">{accommodation.name}</h3>
          {accommodation.address && (
            <p className="text-small mt-0.5 text-muted-foreground">{accommodation.address}</p>
          )}
        </div>
        <FormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Modifier">
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Button>
          }
          title="Modifier l'hébergement"
          action={updateAccommodation.bind(null, accommodation.id)}
        >
          <AccommodationFields accommodation={accommodation} />
        </FormDialog>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {accommodation.distance_minutes !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                close && "text-sage-deep"
              )}
            >
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {accommodation.distance_minutes} min de route
            </span>
          )}
          {accommodation.total_rooms !== null && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5" strokeWidth={1.5} />
              {accommodation.total_rooms} chambres
              {accommodation.total_capacity ? ` · ${accommodation.total_capacity} places` : ""}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line pt-3">
          <p className="text-body-strong text-foreground">
            {accommodation.price_per_night ? (
              <>
                {formatEUR(accommodation.price_per_night)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">/ nuit</span>
              </>
            ) : (
              <span className="text-sm font-normal text-muted-foreground">Tarif non renseigné</span>
            )}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-sage-deep hover:text-sage-deep"
            render={
              <Link href={`/accommodations/${accommodation.id}`}>
                Gérer les chambres
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
