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
import { ACCOMMODATION_TYPE, ACCOMMODATION_DIRECTION, BOOKING_STATUS } from "@/lib/status";
import type { Accommodation } from "@/lib/types/database";

export function AccommodationFields({ accommodation }: { accommodation?: Accommodation }) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required defaultValue={accommodation?.name} placeholder="Auberge du Vieux Puits" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={accommodation?.type ?? "hotel"}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCOMMODATION_TYPE.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="booking_status">Statut de réservation</Label>
          <Select name="booking_status" defaultValue={accommodation?.booking_status ?? "a_contacter"}>
            <SelectTrigger id="booking_status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_STATUS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" defaultValue={accommodation?.address ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="distance_minutes">Distance (min)</Label>
          <Input id="distance_minutes" name="distance_minutes" type="number" min={0} defaultValue={accommodation?.distance_minutes ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="direction">Direction depuis le lieu</Label>
          <Select name="direction" defaultValue={accommodation?.direction ?? undefined}>
            <SelectTrigger id="direction" className="w-full">
              <SelectValue placeholder="Auto" />
            </SelectTrigger>
            <SelectContent>
              {ACCOMMODATION_DIRECTION.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="total_rooms">Chambres</Label>
          <Input id="total_rooms" name="total_rooms" type="number" min={0} defaultValue={accommodation?.total_rooms ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="total_capacity">Capacité totale</Label>
          <Input id="total_capacity" name="total_capacity" type="number" min={0} defaultValue={accommodation?.total_capacity ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price_per_night">Prix / nuit (€)</Label>
        <Input id="price_per_night" name="price_per_night" type="number" min={0} step="5" defaultValue={accommodation?.price_per_night ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="website">Site web</Label>
          <Input id="website" name="website" type="url" defaultValue={accommodation?.website ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" defaultValue={accommodation?.phone ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={accommodation?.notes ?? ""} />
      </div>
    </>
  );
}
