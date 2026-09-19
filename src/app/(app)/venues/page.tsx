import { Plus, Landmark } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VenueFields } from "@/components/venues/venue-fields";
import { VenueCard } from "@/components/venues/venue-card";
import { ComparisonMatrix } from "@/components/venues/comparison-matrix";
import { createVenue } from "@/lib/actions/venues";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function VenuesPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [{ data: venues }, { data: criteria }] = await Promise.all([
    supabase
      .from("venues")
      .select("*, venue_scores(*)")
      .eq("wedding_id", wedding.id)
      .order("order_index", { ascending: true }),
    supabase
      .from("criteria")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("order_index", { ascending: true }),
  ]);

  const venueList = venues ?? [];
  const criteriaList = criteria ?? [];

  const addButton = (
    <FormDialog
      trigger={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Ajouter un lieu
        </Button>
      }
      title="Ajouter un lieu"
      action={createVenue.bind(null, wedding.id)}
      submitLabel="Ajouter"
    >
      <VenueFields />
    </FormDialog>
  );

  return (
    <div>
      <PageHeader
        title="Lieux & réceptions"
        subtitle="Fiches détaillées, disponibilités et matrice de comparaison pour trancher sereinement."
        action={addButton}
      />

      {venueList.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="Aucun lieu pour l'instant"
          description="Ajoutez les domaines et salles que vous visitez pour suivre capacité, tarifs et contraintes au même endroit."
          action={addButton}
        />
      ) : (
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Lieux ({venueList.length})</TabsTrigger>
            <TabsTrigger value="matrix">Matrice de comparaison</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {venueList.map((venue) => (
                <VenueCard key={venue.id} venue={venue} criteria={criteriaList} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="mt-6">
            <ComparisonMatrix weddingId={wedding.id} venues={venueList} criteria={criteriaList} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
