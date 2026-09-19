import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CEREMONY_CATEGORY } from "@/lib/status";
import type { CeremonyEvent } from "@/lib/types/database";

function toTimeInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventFields({ event }: { event?: CeremonyEvent }) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="title">Intitulé</Label>
        <Input id="title" name="title" required defaultValue={event?.title} placeholder="Vin d'honneur" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Catégorie</Label>
        <Select name="category" defaultValue={event?.category ?? "autre"}>
          <SelectTrigger id="category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CEREMONY_CATEGORY.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start_time">Heure de début</Label>
          <Input id="start_time" name="start_time" type="time" defaultValue={toTimeInput(event?.start_time ?? null)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration_minutes">Durée (minutes)</Label>
          <Input id="duration_minutes" name="duration_minutes" type="number" min={0} step="5" defaultValue={event?.duration_minutes ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="location">Lieu sur le domaine</Label>
          <Input id="location" name="location" defaultValue={event?.location ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="music">Musique d&apos;entrée</Label>
          <Input id="music" name="music" defaultValue={event?.music ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="outfits">Tenues</Label>
        <Textarea id="outfits" name="outfits" rows={2} defaultValue={event?.outfits ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cortege">Cortège</Label>
        <Textarea id="cortege" name="cortege" rows={2} defaultValue={event?.cortege ?? ""} placeholder="Ordre d'entrée, accompagnants…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="speeches">Interventions</Label>
        <Textarea id="speeches" name="speeches" rows={2} defaultValue={event?.speeches ?? ""} placeholder="Qui parle, combien de temps…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={event?.notes ?? ""} />
      </div>
    </>
  );
}
