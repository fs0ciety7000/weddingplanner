import { Plus, Palette } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { MoodboardFields } from "@/components/moodboard/moodboard-fields";
import { MoodboardTile } from "@/components/moodboard/moodboard-tile";
import { createMoodboardItem } from "@/lib/actions/moodboard";
import { MOODBOARD_TYPE } from "@/lib/status";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function MoodboardPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const { data } = await supabase
    .from("moodboard_items")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("order_index", { ascending: true });

  const items = data ?? [];

  const addButton = (
    <FormDialog
      trigger={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Ajouter une inspiration
        </Button>
      }
      title="Ajouter au moodboard"
      action={createMoodboardItem.bind(null, wedding.id)}
      submitLabel="Ajouter"
    >
      <MoodboardFields />
    </FormDialog>
  );

  return (
    <div>
      <PageHeader
        title="Moodboard & inspirations"
        subtitle="Palette en hexadécimal, matières, typographies des faire-part, fleurs et scénographie."
        action={addButton}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Palette}
          title="Le moodboard est vide"
          description="Commencez par la palette, puis ajoutez matières, typographies et inspirations florales ou scénographiques."
          action={addButton}
        />
      ) : (
        <div className="space-y-10">
          {MOODBOARD_TYPE.map((section) => {
            const sectionItems = items.filter((i) => i.type === section.value);
            if (sectionItems.length === 0) return null;
            return (
              <section key={section.value}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-h3 text-foreground">{section.label}</h2>
                  <FormDialog
                    trigger={
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Ajouter
                      </Button>
                    }
                    title={`Ajouter — ${section.label}`}
                    action={createMoodboardItem.bind(null, wedding.id)}
                    submitLabel="Ajouter"
                  >
                    <MoodboardFields defaultType={section.value} />
                  </FormDialog>
                </div>
                <div
                  className={
                    section.value === "palette"
                      ? "grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6"
                      : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                  }
                >
                  {sectionItems.map((item) => (
                    <MoodboardTile key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
