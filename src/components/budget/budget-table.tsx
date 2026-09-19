import { Fragment } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import { BudgetItemFields } from "@/components/budget/budget-item-fields";
import { deleteBudgetItem, updateBudgetItem } from "@/lib/actions/budget";
import { formatEUR, formatDateShortFr, daysUntil } from "@/lib/format";
import { computeBudget } from "@/lib/budget-calc";
import { cn } from "@/lib/utils";
import type { BudgetCategory, BudgetItem, Vendor } from "@/lib/types/database";

export function BudgetTable({
  categories,
  items,
  vendors,
}: {
  categories: BudgetCategory[];
  items: BudgetItem[];
  vendors: Vendor[];
}) {
  const { rows } = computeBudget(items, null);
  const uncategorized = items.filter((i) => !i.category_id).length > 0;
  const groups = [
    ...categories.map((c) => ({ category: c, rows: rows.filter((r) => r.item.category_id === c.id) })),
    ...(uncategorized
      ? [{ category: { id: "none", name: "Sans catégorie" } as BudgetCategory, rows: rows.filter((r) => !r.item.category_id) }]
      : []),
  ].filter((g) => g.rows.length > 0);

  const totalEstimated = rows.reduce((s, r) => s + r.item.estimated_amount, 0);
  const totalQuoted = rows.reduce((s, r) => s + (r.hasQuote ? (r.item.quote_amount as number) : 0), 0);
  const totalPaid = rows.reduce((s, r) => s + r.paid, 0);
  const totalBalance = rows.reduce((s, r) => s + r.balance, 0);

  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead>Poste</TableHead>
            <TableHead className="text-right">Estimé</TableHead>
            <TableHead className="text-right">Devis réel</TableHead>
            <TableHead className="text-right">Acompte payé</TableHead>
            <TableHead className="text-right">Solde restant</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map(({ category, rows: catRows }) => {
            const catEstimated = catRows.reduce((s, r) => s + r.item.estimated_amount, 0);
            const catQuoted = catRows.reduce((s, r) => s + (r.hasQuote ? (r.item.quote_amount as number) : 0), 0);
            const catPaid = catRows.reduce((s, r) => s + r.paid, 0);
            const catBalance = catRows.reduce((s, r) => s + r.balance, 0);
            return (
              <Fragment key={category.id}>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableCell className="font-semibold">{category.name}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatEUR(catEstimated)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatEUR(catQuoted)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatEUR(catPaid)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatEUR(catBalance)}</TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
                {catRows.map(({ item, hasQuote, paid, balance }) => {
                  const overdue = item.due_date && balance > 0 && (daysUntil(item.due_date) ?? 0) < 0;
                  const soon = item.due_date && balance > 0 && !overdue && (daysUntil(item.due_date) ?? 99) <= 30;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">{item.label}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatEUR(item.estimated_amount)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {hasQuote ? formatEUR(item.quote_amount) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatEUR(paid)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatEUR(balance)}</TableCell>
                      <TableCell>
                        {item.due_date ? (
                          <span className={cn("text-xs", overdue && "text-destructive", soon && "text-warn")}>
                            {formatDateShortFr(item.due_date)}
                            {overdue ? " · en retard" : soon ? " · bientôt" : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <FormDialog
                            trigger={
                              <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </Button>
                            }
                            title="Modifier la ligne"
                            action={updateBudgetItem.bind(null, item.id)}
                          >
                            <BudgetItemFields item={item} categories={categories} vendors={vendors} />
                          </FormDialog>
                          <form action={deleteBudgetItem.bind(null, item.id)}>
                            <Button variant="ghost" size="icon-sm" type="submit" aria-label="Supprimer">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-muted/60 font-semibold hover:bg-muted/60">
            <TableCell>Total</TableCell>
            <TableCell className="text-right tabular-nums">{formatEUR(totalEstimated)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatEUR(totalQuoted)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatEUR(totalPaid)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatEUR(totalBalance)}</TableCell>
            <TableCell colSpan={2} />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
