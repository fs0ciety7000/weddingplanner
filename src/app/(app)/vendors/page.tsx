import { Plus, Handshake } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { VendorFields } from "@/components/vendors/vendor-fields";
import { KanbanBoard } from "@/components/vendors/kanban-board";
import { createVendor } from "@/lib/actions/vendors";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function VendorsPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const { data } = await supabase
    .from("vendors")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("order_index", { ascending: true });

  const vendors = data ?? [];

  const addButton = (
    <FormDialog
      trigger={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Ajouter un prestataire
        </Button>
      }
      title="Ajouter un prestataire"
      action={createVendor.bind(null, wedding.id)}
      submitLabel="Ajouter"
    >
      <VendorFields />
    </FormDialog>
  );

  return (
    <div>
      <PageHeader
        title="Prestataires"
        subtitle="Traiteur, photographe, DJ, fleuriste, papeterie — glissez les cartes pour suivre chaque contact."
        action={addButton}
      />

      {vendors.length === 0 ? (
        <EmptyState
          icon={Handshake}
          title="Aucun prestataire pour l'instant"
          description="Ajoutez vos premiers contacts et suivez leur avancement, de la prise de contact à la validation."
          action={addButton}
        />
      ) : (
        <KanbanBoard vendors={vendors} />
      )}
    </div>
  );
}
