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
import { ROOM_PAYER } from "@/lib/status";
import type { Room } from "@/lib/types/database";

export function RoomFields({ room }: { room?: Room }) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="room-name">Nom de la chambre</Label>
        <Input id="room-name" name="name" required defaultValue={room?.name} placeholder="Suite nuptiale" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="room-capacity">Capacité</Label>
          <Input id="room-capacity" name="capacity" type="number" min={1} defaultValue={room?.capacity ?? 2} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="room-price">Prix / nuit (€)</Label>
          <Input id="room-price" name="price_per_night" type="number" min={0} step="5" defaultValue={room?.price_per_night ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="room-nights">Nuitées</Label>
          <Input id="room-nights" name="nights" type="number" min={1} defaultValue={room?.nights ?? 1} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="room-payer">Qui règle ?</Label>
        <Select name="payer" defaultValue={room?.payer ?? "nous"}>
          <SelectTrigger id="room-payer" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROOM_PAYER.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="room-notes">Notes</Label>
        <Textarea id="room-notes" name="notes" rows={2} defaultValue={room?.notes ?? ""} />
      </div>
    </>
  );
}
