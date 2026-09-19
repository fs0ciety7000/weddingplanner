import { Pencil, Trash2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import { MoodboardFields } from "@/components/moodboard/moodboard-fields";
import { deleteMoodboardItem, updateMoodboardItem } from "@/lib/actions/moodboard";
import type { MoodboardItem } from "@/lib/types/database";

export function MoodboardTile({ item }: { item: MoodboardItem }) {
  return (
    <div className="group relative overflow-hidden rounded-t-arch rounded-b-lg border border-line bg-card">
      <div className="absolute top-2.5 right-2.5 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <FormDialog
          trigger={
            <Button variant="secondary" size="icon-sm" aria-label="Modifier">
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Button>
          }
          title="Modifier l'élément"
          action={updateMoodboardItem.bind(null, item.id)}
        >
          <MoodboardFields item={item} />
        </FormDialog>
        <form action={deleteMoodboardItem.bind(null, item.id)}>
          <Button variant="secondary" size="icon-sm" type="submit" aria-label="Supprimer">
            <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />
          </Button>
        </form>
      </div>

      <TileVisual item={item} />

      <div className="space-y-1.5 p-3.5">
        {item.title && <p className="text-body-strong text-foreground">{item.title}</p>}
        {item.type === "palette" && item.color_hex && (
          <p className="text-small font-mono text-muted-foreground uppercase">{item.color_hex}</p>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        {item.link_url && (
          <a
            href={item.link_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-sage-deep hover:underline"
          >
            <LinkIcon className="h-3 w-3" strokeWidth={1.5} />
            Source
          </a>
        )}
      </div>
    </div>
  );
}

function TileVisual({ item }: { item: MoodboardItem }) {
  if (item.type === "palette") {
    return <div className="aspect-square w-full" style={{ backgroundColor: item.color_hex ?? "#ccc" }} />;
  }

  if (item.type === "typographie") {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-sage-pale">
        <span className="text-display text-sage-deep">Ag</span>
      </div>
    );
  }

  if (item.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.image_url} alt={item.title ?? ""} className="aspect-square w-full object-cover" />;
  }

  return (
    <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
      <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
    </div>
  );
}
