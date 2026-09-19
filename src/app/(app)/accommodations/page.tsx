import { Plus, BedDouble } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AccommodationFields } from "@/components/accommodations/accommodation-fields";
import { AccommodationCard } from "@/components/accommodations/accommodation-card";
import { DistanceMap } from "@/components/accommodations/distance-map";
import { createAccommodation } from "@/lib/actions/accommodations";
import { formatEUR } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function AccommodationsPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [{ data }, { data: venues }] = await Promise.all([
    supabase
      .from("accommodations")
      .select("*, rooms(*, room_assignments(id, guest_id))")
      .eq("wedding_id", wedding.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("venues")
      .select("name, status")
      .eq("wedding_id", wedding.id)
      .order("order_index", { ascending: true }),
  ]);

  const accommodations = data ?? [];
  const onsite = accommodations.filter((a) => a.type === "sur_place");
  const nearby = accommodations.filter((a) => a.type !== "sur_place");
  const venueName =
    venues?.find((v) => v.status === "reserve" || v.status === "favori")?.name ??
    venues?.[0]?.name ??
    "Le lieu";

  const allRooms = accommodations.flatMap((a) => a.rooms ?? []);
  const totalCapacity = allRooms.reduce((sum, r) => sum + r.capacity, 0);
  const placed = allRooms.reduce((sum, r) => sum + r.room_assignments.length, 0);
  const totalCost = allRooms.reduce((sum, r) => sum + (r.price_per_night ?? 0) * r.nights, 0);
  const ourCost = allRooms
    .filter((r) => r.payer !== "invites")
    .reduce((sum, r) => sum + (r.price_per_night ?? 0) * r.nights, 0);
  const nearCount = accommodations.filter(
    (a) => a.distance_minutes !== null && a.distance_minutes > 0 && a.distance_minutes <= 15
  ).length;

  const addButton = (
    <FormDialog
      trigger={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Ajouter un hébergement
        </Button>
      }
      title="Ajouter un hébergement"
      action={createAccommodation.bind(null, wedding.id)}
      submitLabel="Ajouter"
    >
      <AccommodationFields />
    </FormDialog>
  );

  return (
    <div>
      <PageHeader
        title="Hébergements & logistique"
        subtitle="Couchages sur place, hôtels et gîtes à proximité, avec attribution des chambres et coût par invité."
        action={addButton}
      />

      {accommodations.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="Aucun hébergement renseigné"
          description="Ajoutez les couchages sur place et les hôtels ou gîtes à moins de 15 minutes pour vos invités."
          action={addButton}
        />
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <CardContent>
                <p className="text-label text-muted-foreground">Couchages attribués</p>
                <p className="text-h2 mt-1 tabular-nums text-foreground">
                  {placed}
                  <span className="text-sm font-normal text-muted-foreground">/{totalCapacity}</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-label text-muted-foreground">Coût total estimé</p>
                <p className="text-h2 mt-1 tabular-nums text-foreground">{formatEUR(totalCost)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-label text-muted-foreground">À notre charge</p>
                <p className="text-h2 mt-1 tabular-nums text-foreground">{formatEUR(ourCost)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-label text-muted-foreground">Rayon 15 min</p>
                <p className="text-h2 mt-1 tabular-nums text-foreground">{nearCount}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <DistanceMap accommodations={accommodations} venueName={venueName} />
            </CardContent>
          </Card>

          {onsite.length > 0 && (
            <section>
              <h2 className="text-h3 mb-4 text-foreground">Sur place</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {onsite.map((a) => (
                  <AccommodationCard key={a.id} accommodation={a} />
                ))}
              </div>
            </section>
          )}

          {nearby.length > 0 && (
            <section>
              <h2 className="text-h3 mb-4 text-foreground">Hôtels & gîtes à proximité</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {nearby.map((a) => (
                  <AccommodationCard key={a.id} accommodation={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
