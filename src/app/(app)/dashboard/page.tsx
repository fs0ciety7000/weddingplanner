import Link from "next/link";
import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoupleName } from "@/components/couple-name";
import { computeBudget } from "@/lib/budget-calc";
import { formatEUR, formatDateFr, formatDateShortFr, formatTimeOfDay, daysUntil } from "@/lib/format";
import { VENDOR_STATUS, vendorStatusMeta } from "@/lib/status";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function DashboardPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [
    { data: budgetItems },
    { data: vendors },
    { data: tasks },
    { data: venues },
    { data: events },
    { data: ideas },
  ] = await Promise.all([
    supabase.from("budget_items").select("*").eq("wedding_id", wedding.id),
    supabase.from("vendors").select("*").eq("wedding_id", wedding.id),
    supabase.from("tasks").select("*").eq("wedding_id", wedding.id),
    supabase.from("venues").select("name, status").eq("wedding_id", wedding.id).order("order_index"),
    supabase
      .from("ceremony_events")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("start_time", { ascending: true, nullsFirst: false })
      .limit(7),
    supabase.from("ideas").select("*").eq("wedding_id", wedding.id).order("created_at", { ascending: false }).limit(4),
  ]);

  const calc = computeBudget(budgetItems ?? [], wedding.budget_total);
  const vendorList = vendors ?? [];
  const taskList = tasks ?? [];
  const bookedVendors = vendorList.filter((v) => v.status === "valide").length;
  const doneTasks = taskList.filter((t) => t.done).length;
  const chosenVenue = venues?.find((v) => v.status === "reserve" || v.status === "favori");

  const days = daysUntil(wedding.wedding_date);
  const countLabel =
    days === null ? null : days > 0 ? `${days} jours` : days === 0 ? "C'est aujourd'hui" : "Félicitations !";

  type UpcomingEvent = { date: string; label: string; kind: string; amount?: number };
  const upcoming: UpcomingEvent[] = [
    ...taskList
      .filter((t) => !t.done && t.due_date)
      .map((t) => ({ date: t.due_date as string, label: t.title, kind: "Tâche" })),
    ...calc.rows
      .filter((r) => r.balance > 0 && r.item.due_date)
      .map((r) => ({ date: r.item.due_date as string, label: r.item.label, kind: "Paiement", amount: r.balance })),
    ...vendorList
      .filter((v) => v.next_contact_date && v.status !== "valide")
      .map((v) => ({ date: v.next_contact_date as string, label: v.name, kind: "Rendez-vous" })),
  ]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 7);

  const budgetPct = wedding.budget_total ? Math.min((calc.engaged / wedding.budget_total) * 100, 100) : 0;

  return (
    <div>
      <section className="relative overflow-hidden rounded-lg border border-line bg-card px-6 py-8 sm:px-10 sm:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-sage-pale/70 blur-2xl"
        />
        <p className="text-label text-muted-foreground">Notre mariage</p>
        <h1 className="text-display mt-2 text-foreground">
          <CoupleName name={wedding.name} />
        </h1>
        <div className="relative z-10 mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {wedding.wedding_date ? (
            <>
              <span className="text-h2 text-sage-deep">{countLabel}</span>
              <span className="text-sm text-muted-foreground">{formatDateFr(wedding.wedding_date)}</span>
              {wedding.venue_city && <span className="text-sm text-muted-foreground">{wedding.venue_city}</span>}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">La date n&apos;est pas encore fixée.</span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            render={
              <Link href="/settings">
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                {wedding.wedding_date ? "Modifier" : "Choisir la date"}
              </Link>
            }
          />
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Budget engagé</p>
            <p className="text-h2 mt-1 tabular-nums text-foreground">{formatEUR(calc.engaged)}</p>
            <p className="text-small mt-0.5 text-muted-foreground">sur {formatEUR(wedding.budget_total)}</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted">
              <div className="h-full rounded-full bg-sage" style={{ width: `${budgetPct}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Prestataires validés</p>
            <p className="text-h2 mt-1 tabular-nums text-foreground">
              {bookedVendors}
              <span className="text-sm font-normal text-muted-foreground">/{vendorList.length}</span>
            </p>
            <p className="text-small mt-0.5 text-muted-foreground">
              {vendorList.filter((v) => v.status === "devis_recu").length} devis à comparer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Tâches faites</p>
            <p className="text-h2 mt-1 tabular-nums text-foreground">
              {doneTasks}
              <span className="text-sm font-normal text-muted-foreground">/{taskList.length}</span>
            </p>
            <p className="text-small mt-0.5 text-muted-foreground">{taskList.length - doneTasks} restantes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-label text-muted-foreground">Lieu</p>
            <p className="text-h3 mt-1 truncate text-foreground">{chosenVenue?.name ?? "À choisir"}</p>
            <p className="text-small mt-0.5 text-muted-foreground">{venues?.length ?? 0} pistes comparées</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="text-h2 text-foreground">Prochaines échéances</h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Rien de planifié pour l&apos;instant.</p>
            ) : (
              <div className="mt-2 divide-y divide-line">
                {upcoming.map((e, i) => {
                  const late = daysUntil(e.date) !== null && (daysUntil(e.date) as number) < 0;
                  return (
                    <div key={i} className="flex items-center gap-3 py-2.5 text-sm">
                      <span className={late ? "w-16 tabular-nums text-destructive" : "w-16 tabular-nums text-foreground"}>
                        {formatDateShortFr(e.date)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-foreground">{e.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.kind}
                          {late ? " · en retard" : ""}
                        </p>
                      </div>
                      {e.amount && <span className="tabular-nums text-foreground">{formatEUR(e.amount)}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-foreground">Le jour J</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-sage-deep hover:text-sage-deep"
                render={<Link href="/ceremony">Déroulé</Link>}
              />
            </div>
            {!events || events.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Le déroulé reste à écrire.</p>
            ) : (
              <div className="mt-2 divide-y divide-line">
                {events.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 py-2.5">
                    <span className="text-h3 w-20 tabular-nums text-sage-deep">{formatTimeOfDay(m.start_time)}</span>
                    <span className="text-sm text-foreground">{m.title}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-foreground">Prestataires</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-sage-deep hover:text-sage-deep"
                render={<Link href="/vendors">Kanban</Link>}
              />
            </div>
            <div className="mt-2 divide-y divide-line">
              {VENDOR_STATUS.filter((s) => s.value !== "ecarte").map((s) => {
                const count = vendorList.filter((v) => v.status === s.value).length;
                const meta = vendorStatusMeta(s.value);
                return (
                  <div key={s.value} className="flex items-center gap-3 py-2.5 text-sm">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          meta.tone === "sage"
                            ? "var(--sage-deep)"
                            : meta.tone === "gold"
                              ? "var(--gold)"
                              : meta.tone === "warn"
                                ? "var(--warn)"
                                : "var(--line-strong)",
                      }}
                    />
                    <span className="flex-1 text-foreground">{s.label}</span>
                    <span className="tabular-nums text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-foreground">Idées récentes</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-sage-deep hover:text-sage-deep"
                render={<Link href="/ideas">Toutes</Link>}
              />
            </div>
            {!ideas || ideas.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Notez vos premières idées dans la rubrique Idées.</p>
            ) : (
              <div className="mt-2 divide-y divide-line">
                {ideas.map((idea) => (
                  <div key={idea.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="flex-1 truncate text-foreground">{idea.content}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {idea.tag ?? "Autre"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
