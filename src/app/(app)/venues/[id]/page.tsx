import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Users,
  Volume2,
  ChefHat,
  BedDouble,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/status-pill";
import { FormDialog } from "@/components/form-dialog";
import { VenueFields } from "@/components/venues/venue-fields";
import { deleteVenue, updateVenue } from "@/lib/actions/venues";
import { formatEUR, formatDateFr } from "@/lib/format";
import { venueStatusMeta } from "@/lib/status";
import { computeVenueScore } from "@/lib/venue-score";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function VenueDetailPage(props: PageProps<"/venues/[id]">) {
  const { id } = await props.params;
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [{ data: venue }, { data: criteria }] = await Promise.all([
    supabase
      .from("venues")
      .select("*, venue_scores(*)")
      .eq("id", id)
      .eq("wedding_id", wedding.id)
      .maybeSingle(),
    supabase.from("criteria").select("*").eq("wedding_id", wedding.id),
  ]);

  if (!venue) notFound();

  const status = venueStatusMeta(venue.status);
  const score = computeVenueScore(venue.venue_scores, criteria ?? []);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/venues"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Tous les lieux
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <StatusPill tone={status.tone}>{status.label}</StatusPill>
            {venue.visit_date && (
              <span className="text-xs text-muted-foreground">Visite le {formatDateFr(venue.visit_date)}</span>
            )}
          </div>
          <h1 className="text-display mt-2 text-foreground">{venue.name}</h1>
          {venue.address && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
              {venue.address}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-start gap-3">
          {score !== null && (
            <span className="text-display text-sage-deep" title="Score pondéré">
              {score}
              <span className="text-xs font-sans font-normal text-muted-foreground">/100</span>
            </span>
          )}
          <FormDialog
            trigger={
              <Button variant="outline" className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                Modifier
              </Button>
            }
            title="Modifier le lieu"
            action={updateVenue.bind(null, venue.id)}
          >
            <VenueFields venue={venue} />
          </FormDialog>
          <form action={deleteVenue.bind(null, venue.id, wedding.id)}>
            <Button variant="outline" size="icon" aria-label="Supprimer le lieu" type="submit">
              <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.5} />
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={Users} label="Assis" value={venue.capacity_seated ?? "—"} />
        <StatTile icon={Users} label="Debout" value={venue.capacity_standing ?? "—"} />
        <StatTile
          icon={Volume2}
          label="Sono jusqu'à"
          value={venue.sound_curfew ? venue.sound_curfew.slice(0, 5).replace(":", " h ") : "—"}
        />
        <StatTile icon={BedDouble} label="Couchages" value={venue.onsite_lodging_capacity ?? "—"} />
      </div>

      <Card className="mt-6">
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-label text-muted-foreground">Location brute</span>
            <span className="text-body-strong">{formatEUR(venue.price_gross)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label text-muted-foreground">Forfait tout compris</span>
            <span className="text-body-strong">{formatEUR(venue.price_flat)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {venue.catering_exclusive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <ChefHat className="h-3.5 w-3.5" strokeWidth={1.5} />
                Traiteur exclusif imposé
              </span>
            )}
            {venue.onsite_lodging && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <BedDouble className="h-3.5 w-3.5" strokeWidth={1.5} />
                Couchages sur place
              </span>
            )}
          </div>

          {(venue.contact_name || venue.contact_email || venue.contact_phone || venue.website) && (
            <div className="space-y-2 border-t border-line pt-4">
              <span className="text-label text-muted-foreground">Contact</span>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground">
                {venue.contact_name && <span>{venue.contact_name}</span>}
                {venue.contact_email && (
                  <a href={`mailto:${venue.contact_email}`} className="inline-flex items-center gap-1.5 hover:text-sage-deep">
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {venue.contact_email}
                  </a>
                )}
                {venue.contact_phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {venue.contact_phone}
                  </span>
                )}
                {venue.website && (
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-sage-deep"
                  >
                    <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Site web
                  </a>
                )}
              </div>
            </div>
          )}

          {venue.notes && (
            <div className="space-y-1.5 border-t border-line pt-4">
              <span className="text-label text-muted-foreground">Notes</span>
              <p className="whitespace-pre-wrap text-sm text-foreground">{venue.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-line bg-card p-3.5">
      <Icon className="h-4 w-4 text-sage-deep" strokeWidth={1.5} />
      <p className="mt-2 text-lg font-medium tabular-nums text-foreground">{value}</p>
      <p className="text-small text-muted-foreground">{label}</p>
    </div>
  );
}
