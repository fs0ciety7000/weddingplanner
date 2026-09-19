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
import { StarRatingField } from "@/components/star-rating";
import { VENDOR_CATEGORY, VENDOR_STATUS } from "@/lib/status";
import type { Vendor } from "@/lib/types/database";

export function VendorFields({
  vendor,
  defaultStatus,
}: {
  vendor?: Vendor;
  defaultStatus?: string;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="v-name">Nom</Label>
        <Input id="v-name" name="name" required defaultValue={vendor?.name} placeholder="Atelier Fleur de Lin" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="v-category">Catégorie</Label>
          <Select name="category" defaultValue={vendor?.category ?? "autre"}>
            <SelectTrigger id="v-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VENDOR_CATEGORY.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="v-status">Statut</Label>
          <Select name="status" defaultValue={vendor?.status ?? defaultStatus ?? "a_contacter"}>
            <SelectTrigger id="v-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VENDOR_STATUS.map((s) => (
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
          <Label htmlFor="v-contact_name">Contact</Label>
          <Input id="v-contact_name" name="contact_name" defaultValue={vendor?.contact_name ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="v-website">Site web</Label>
          <Input id="v-website" name="website" type="url" defaultValue={vendor?.website ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="v-contact_email">Email</Label>
          <Input id="v-contact_email" name="contact_email" type="email" defaultValue={vendor?.contact_email ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="v-contact_phone">Téléphone</Label>
          <Input id="v-contact_phone" name="contact_phone" defaultValue={vendor?.contact_phone ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="v-quote_amount">Devis (€)</Label>
          <Input id="v-quote_amount" name="quote_amount" type="number" min={0} step="10" defaultValue={vendor?.quote_amount ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="v-deposit_amount">Acompte (€)</Label>
          <Input id="v-deposit_amount" name="deposit_amount" type="number" min={0} step="10" defaultValue={vendor?.deposit_amount ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="v-next_contact_date">Prochaine visite / call</Label>
        <Input id="v-next_contact_date" name="next_contact_date" type="date" defaultValue={vendor?.next_contact_date ?? ""} />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox name="deposit_paid" defaultChecked={vendor?.deposit_paid} />
          Acompte versé
        </label>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Coup de cœur</Label>
          <StarRatingField name="rating" defaultValue={vendor?.rating ?? 0} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="v-notes">Notes</Label>
        <Textarea id="v-notes" name="notes" rows={3} defaultValue={vendor?.notes ?? ""} />
      </div>
    </>
  );
}
