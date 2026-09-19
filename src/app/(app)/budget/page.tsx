import { Plus, Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BudgetItemFields } from "@/components/budget/budget-item-fields";
import { BudgetTable } from "@/components/budget/budget-table";
import { createBudgetCategory, createBudgetItem } from "@/lib/actions/budget";
import { computeBudget } from "@/lib/budget-calc";
import { formatEUR, formatDateShortFr, daysUntil } from "@/lib/format";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function BudgetPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [{ data: categories }, { data: items }, { data: vendors }] = await Promise.all([
    supabase.from("budget_categories").select("*").eq("wedding_id", wedding.id).order("order_index"),
    supabase.from("budget_items").select("*").eq("wedding_id", wedding.id).order("order_index"),
    supabase.from("vendors").select("*").eq("wedding_id", wedding.id).order("name"),
  ]);

  const categoryList = categories ?? [];
  const itemList = items ?? [];
  const vendorList = vendors ?? [];
  const calc = computeBudget(itemList, wedding.budget_total);
  const total = wedding.budget_total ?? 0;
  const margin = total - calc.engaged;
  const scale = Math.max(total, calc.engaged, 1);

  const addButton = (
    <FormDialog
      trigger={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Ajouter une ligne
        </Button>
      }
      title="Ajouter une ligne de budget"
      action={createBudgetItem.bind(null, wedding.id)}
      submitLabel="Ajouter"
    >
      <BudgetItemFields categories={categoryList} vendors={vendorList} />
    </FormDialog>
  );

  if (itemList.length === 0) {
    return (
      <div>
        <PageHeader title="Budget & échéancier" subtitle="Estimé, devis réels, acomptes payés et solde restant." action={addButton} />
        <EmptyState icon={Wallet} title="Aucune ligne de budget" description="Ajoutez vos premiers postes de dépense." action={addButton} />
      </div>
    );
  }

  const dueRows = calc.rows
    .filter((r) => r.balance > 0)
    .sort((a, b) => (a.item.due_date ?? "9999") < (b.item.due_date ?? "9999") ? -1 : 1);
  const byMonth = new Map<string, typeof dueRows>();
  for (const row of dueRows) {
    const key = row.item.due_date ? row.item.due_date.slice(0, 7) : "sans-echeance";
    byMonth.set(key, [...(byMonth.get(key) ?? []), row]);
  }
  const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

  const catBars = categoryList
    .map((c) => {
      const rows = calc.rows.filter((r) => r.item.category_id === c.id);
      const estimated = rows.reduce((s, r) => s + r.item.estimated_amount, 0);
      const engaged = rows.reduce((s, r) => s + r.engaged, 0);
      const paid = rows.reduce((s, r) => s + r.paid, 0);
      return { name: c.name, estimated, engaged, paid };
    })
    .filter((c) => c.engaged > 0 || c.estimated > 0);
  const catMax = Math.max(1, ...catBars.map((c) => Math.max(c.estimated, c.engaged)));

  return (
    <div>
      <PageHeader
        title="Budget & échéancier"
        subtitle="Estimé, devis réels, acomptes payés et solde restant, avec les dates à ne pas manquer."
        action={addButton}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Budget total</p>
            <p className="text-h2 mt-1 tabular-nums text-foreground">{formatEUR(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Estimé</p>
            <p className="text-h2 mt-1 tabular-nums text-foreground">{formatEUR(calc.estimated)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Engagé</p>
            <p className="text-h2 mt-1 tabular-nums text-foreground">{formatEUR(calc.engaged)}</p>
            {calc.unquoted > 0 && (
              <p className="text-small mt-0.5 text-muted-foreground">{formatEUR(calc.unquoted)} pas encore chiffrés</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Acomptes payés</p>
            <p className="text-h2 mt-1 tabular-nums text-foreground">{formatEUR(calc.paid)}</p>
            <p className="text-small mt-0.5 text-muted-foreground">{formatEUR(calc.balance)} de solde restant</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">{margin < 0 ? "Dépassement" : "Marge"}</p>
            <p className={cn("text-h2 mt-1 tabular-nums text-foreground", margin < 0 && "text-destructive")}>
              {total ? formatEUR(Math.abs(margin)) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent>
          <div className="flex h-3.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-sage-deep" style={{ width: `${Math.min((calc.paid / scale) * 100, 100)}%` }} />
            <div
              className="h-full bg-sage"
              style={{ width: `${Math.min((Math.max(calc.engaged - calc.paid, 0) / scale) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sage-deep" />
              Payé {formatEUR(calc.paid)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sage" />
              Engagé restant {formatEUR(Math.max(calc.engaged - calc.paid, 0))}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-line-strong bg-muted" />
              Disponible {total ? formatEUR(Math.max(margin, 0)) : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-foreground">Postes de dépense</h2>
          <form action={createBudgetCategory.bind(null, wedding.id)} className="flex gap-2">
            <Input name="name" placeholder="Nouvelle catégorie" className="w-44" required />
            <Button type="submit" variant="outline" size="sm">
              Ajouter
            </Button>
          </form>
        </div>
        <BudgetTable categories={categoryList} items={itemList} vendors={vendorList} />
      </section>

      {catBars.length > 0 && (
        <section className="mt-10">
          <h2 className="text-h3 mb-4 text-foreground">Par catégorie</h2>
          <Card>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sage-deep" />
                  Payé
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sage" />
                  Engagé
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-1 rounded-sm bg-gold" />
                  Estimé
                </span>
              </div>
              {catBars.map((c) => (
                <div key={c.name} className="grid grid-cols-[110px_1fr_90px] items-center gap-3">
                  <span className="truncate text-sm text-foreground">{c.name}</span>
                  <div className="relative h-2.5 rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-sage"
                      style={{ width: `${(c.engaged / catMax) * 100}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-sage-deep"
                      style={{ width: `${(Math.min(c.paid, c.engaged) / catMax) * 100}%` }}
                    />
                    <div
                      className="absolute -top-1 h-[18px] w-0.5 bg-gold"
                      style={{ left: `${Math.min((c.estimated / catMax) * 100, 99.5)}%` }}
                    />
                  </div>
                  <span className="text-right text-sm tabular-nums text-foreground">{formatEUR(c.engaged)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-h3 mb-4 text-foreground">Échéancier</h2>
        {byMonth.size === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun solde à régler.</p>
        ) : (
          <div className="space-y-3">
            {[...byMonth.entries()].map(([key, rows]) => {
              const title =
                key === "sans-echeance"
                  ? "Sans échéance"
                  : monthFormatter.format(new Date(key + "-01T00:00:00")).replace(/^./, (c) => c.toUpperCase());
              const monthTotal = rows.reduce((s, r) => s + r.balance, 0);
              return (
                <Card key={key}>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-body-strong text-foreground">{title}</span>
                      <span className="text-body-strong tabular-nums">{formatEUR(monthTotal)}</span>
                    </div>
                    <div className="mt-2 divide-y divide-line">
                      {rows.map((r) => {
                        const overdue = r.item.due_date && (daysUntil(r.item.due_date) ?? 0) < 0;
                        return (
                          <div key={r.item.id} className="flex items-center justify-between py-2 text-sm">
                            <div className="flex items-center gap-3">
                              <span className={cn("w-16 tabular-nums", overdue && "text-destructive")}>
                                {r.item.due_date ? formatDateShortFr(r.item.due_date) : "—"}
                              </span>
                              <span className="text-foreground">{r.item.label}</span>
                            </div>
                            <span className="tabular-nums text-foreground">{formatEUR(r.balance)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
