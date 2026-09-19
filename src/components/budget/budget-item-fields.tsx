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
import { BUDGET_ITEM_STATUS } from "@/lib/status";
import type { BudgetCategory, BudgetItem, Vendor } from "@/lib/types/database";

export function BudgetItemFields({
  item,
  categories,
  vendors,
  defaultCategoryId,
}: {
  item?: BudgetItem;
  categories: BudgetCategory[];
  vendors: Vendor[];
  defaultCategoryId?: string;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="b-label">Libellé</Label>
        <Input id="b-label" name="label" required defaultValue={item?.label} placeholder="Acompte traiteur" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="b-category">Catégorie</Label>
          <Select name="category_id" defaultValue={item?.category_id ?? defaultCategoryId ?? undefined}>
            <SelectTrigger id="b-category" className="w-full">
              <SelectValue placeholder="Choisir" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-vendor">Prestataire lié</Label>
          <Select name="vendor_id" defaultValue={item?.vendor_id ?? undefined}>
            <SelectTrigger id="b-vendor" className="w-full">
              <SelectValue placeholder="Aucun" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="b-estimated">Estimé (€)</Label>
          <Input id="b-estimated" name="estimated_amount" type="number" min={0} step="10" defaultValue={item?.estimated_amount ?? 0} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-quote">Devis réel (€)</Label>
          <Input id="b-quote" name="quote_amount" type="number" min={0} step="10" defaultValue={item?.quote_amount ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-paid">Payé / acompte (€)</Label>
          <Input id="b-paid" name="paid_amount" type="number" min={0} step="10" defaultValue={item?.paid_amount ?? 0} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="b-status">Statut</Label>
          <Select name="status" defaultValue={item?.status ?? "a_prevoir"}>
            <SelectTrigger id="b-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_ITEM_STATUS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-due">Échéance</Label>
          <Input id="b-due" name="due_date" type="date" defaultValue={item?.due_date ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="b-notes">Notes</Label>
        <Textarea id="b-notes" name="notes" rows={2} defaultValue={item?.notes ?? ""} />
      </div>
    </>
  );
}
