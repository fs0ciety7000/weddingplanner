import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VENUE_STATUS } from "@/lib/status";
import type { Venue } from "@/lib/types/database";

export function VenueFields({ venue }: { venue?: Venue }) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom du lieu</Label>
        <Input id="name" name="name" required defaultValue={venue?.name} placeholder="Domaine des Charmes" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" defaultValue={venue?.address ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status">Statut</Label>
          <Select name="status" defaultValue={venue?.status ?? "a_visiter"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VENUE_STATUS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="visit_date">Date de visite</Label>
          <Input id="visit_date" name="visit_date" type="date" defaultValue={venue?.visit_date ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="website">Site web</Label>
        <Input id="website" name="website" type="url" defaultValue={venue?.website ?? ""} placeholder="https://…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="capacity_seated">Capacité assise</Label>
          <Input id="capacity_seated" name="capacity_seated" type="number" min={0} defaultValue={venue?.capacity_seated ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="capacity_standing">Capacité debout</Label>
          <Input id="capacity_standing" name="capacity_standing" type="number" min={0} defaultValue={venue?.capacity_standing ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price_gross">Location brute (€)</Label>
          <Input id="price_gross" name="price_gross" type="number" min={0} step="50" defaultValue={venue?.price_gross ?? ""} />
          <p className="text-xs text-muted-foreground">Salle et domaine seuls</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price_flat">Forfait tout compris (€)</Label>
          <Input id="price_flat" name="price_flat" type="number" min={0} step="50" defaultValue={venue?.price_flat ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="sound_curfew">Heure limite de sonorisation</Label>
          <Input id="sound_curfew" name="sound_curfew" type="time" defaultValue={venue?.sound_curfew ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="onsite_lodging_capacity">Couchages sur place (places)</Label>
          <Input
            id="onsite_lodging_capacity"
            name="onsite_lodging_capacity"
            type="number"
            min={0}
            defaultValue={venue?.onsite_lodging_capacity ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox name="catering_exclusive" defaultChecked={venue?.catering_exclusive} />
          Traiteur exclusif imposé
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox name="onsite_lodging" defaultChecked={venue?.onsite_lodging} />
          Couchages sur place
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contact_name">Contact</Label>
          <Input id="contact_name" name="contact_name" defaultValue={venue?.contact_name ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_email">Email</Label>
          <Input id="contact_email" name="contact_email" type="email" defaultValue={venue?.contact_email ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">Téléphone</Label>
          <Input id="contact_phone" name="contact_phone" defaultValue={venue?.contact_phone ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={venue?.notes ?? ""} />
      </div>
    </>
  );
}
