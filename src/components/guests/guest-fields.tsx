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
import { getGuestSideOptions, RSVP_STATUS } from "@/lib/status";
import type { Guest, Wedding } from "@/lib/types/database";

export function GuestFields({ guest, wedding }: { guest?: Guest; wedding: Wedding }) {
  const guestSideOptions = getGuestSideOptions(wedding);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">Prénom</Label>
          <Input id="first_name" name="first_name" required defaultValue={guest?.first_name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Nom</Label>
          <Input id="last_name" name="last_name" defaultValue={guest?.last_name ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="group_label">Groupe</Label>
          <Input id="group_label" name="group_label" placeholder="Famille, témoins…" defaultValue={guest?.group_label ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="side">Côté</Label>
          <Select name="side" defaultValue={guest?.side ?? undefined}>
            <SelectTrigger id="side" className="w-full">
              <SelectValue placeholder="Choisir" />
            </SelectTrigger>
            <SelectContent>
              {guestSideOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rsvp_status">RSVP</Label>
          <Select name="rsvp_status" defaultValue={guest?.rsvp_status ?? "en_attente"}>
            <SelectTrigger id="rsvp_status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RSVP_STATUS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="children_count">Enfants accompagnants</Label>
          <Input id="children_count" name="children_count" type="number" min={0} defaultValue={guest?.children_count ?? 0} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox name="plus_one" defaultChecked={guest?.plus_one} />
          Vient accompagné·e (+1)
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox name="needs_lodging" defaultChecked={guest?.needs_lodging} />
          A besoin d&apos;un hébergement
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={guest?.email ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" defaultValue={guest?.phone ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dietary_restrictions">Régime alimentaire</Label>
        <Input id="dietary_restrictions" name="dietary_restrictions" placeholder="Végétarien, allergies…" defaultValue={guest?.dietary_restrictions ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={guest?.notes ?? ""} />
      </div>
    </>
  );
}
