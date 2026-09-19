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
import { PROTOCOL_TYPE } from "@/lib/status";
import type { CeremonyEvent, CeremonyProtocol } from "@/lib/types/database";

export function ProtocolFields({
  protocol,
  events,
}: {
  protocol?: CeremonyProtocol;
  events: CeremonyEvent[];
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="p-title">Titre de la fiche</Label>
        <Input id="p-title" name="title" required defaultValue={protocol?.title} placeholder="Tenues du cortège" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="p-type">Type</Label>
          <Select name="type" defaultValue={protocol?.type ?? "autre"}>
            <SelectTrigger id="p-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROTOCOL_TYPE.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-event">Moment lié</Label>
          <Select name="event_id" defaultValue={protocol?.event_id ?? undefined}>
            <SelectTrigger id="p-event" className="w-full">
              <SelectValue placeholder="Aucun" />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-content">Détails</Label>
        <Textarea id="p-content" name="content" rows={6} defaultValue={protocol?.content ?? ""} />
      </div>
    </>
  );
}
