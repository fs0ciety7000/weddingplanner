import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { QuickAddTask } from "@/components/tasks/quick-add-task";
import { TaskRow } from "@/components/tasks/task-row";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getGuestSideOptions } from "@/lib/status";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";
import type { GuestSide } from "@/lib/types/database";

export default async function TasksPage(props: PageProps<"/tasks">) {
  const searchParams = await props.searchParams;
  const who = typeof searchParams.who === "string" ? (searchParams.who as GuestSide) : null;
  const showDone = searchParams.done === "1";

  const { wedding } = await requireActiveWedding();
  const guestSideOptions = getGuestSideOptions(wedding);
  const supabase = await createClient();

  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("order_index", { ascending: true });

  const all = data ?? [];
  const filtered = who ? all.filter((t) => t.assigned_to === who) : all;
  const open = filtered.filter((t) => !t.done);
  const done = filtered.filter((t) => t.done);
  const pct = all.length ? Math.round((all.filter((t) => t.done).length / all.length) * 100) : 0;

  const filterChip = (value: GuestSide | null, label: string) => {
    const params = new URLSearchParams();
    if (value) params.set("who", value);
    if (showDone) params.set("done", "1");
    const qs = params.toString();
    return (
      <Link
        key={label}
        href={qs ? `/tasks?${qs}` : "/tasks"}
        className={cn(
          "chip rounded-full border px-3 py-1 text-sm font-medium transition-colors",
          who === value
            ? "border-sage-deep bg-sage-deep text-on-sage-deep"
            : "border-line-strong bg-card text-foreground hover:bg-muted"
        )}
      >
        {label}
      </Link>
    );
  };

  const toggleDoneParams = new URLSearchParams();
  if (who) toggleDoneParams.set("who", who);
  if (!showDone) toggleDoneParams.set("done", "1");
  const toggleDoneHref = `/tasks${toggleDoneParams.toString() ? `?${toggleDoneParams}` : ""}`;

  return (
    <div>
      <PageHeader
        title="Tâches"
        subtitle="Ce qu'il reste à faire, et pour qui."
        action={
          <div className="min-w-44">
            <p className="text-right text-xs text-muted-foreground">{pct} % terminé</p>
            <Progress value={pct} className="mt-1" />
          </div>
        }
      />

      <QuickAddTask wedding={wedding} />

      <div className="mb-6 flex flex-wrap gap-2">
        {filterChip(null, "Tous")}
        {guestSideOptions.map((s) => filterChip(s.value, s.label))}
      </div>

      {open.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">Rien à faire pour ce filtre.</p>
      ) : (
        <div className="rounded-md border border-line bg-card px-4">
          {open.map((task) => (
            <TaskRow key={task.id} task={task} wedding={wedding} />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="mt-6">
          <Link href={toggleDoneHref} className="text-sm font-medium text-sage-deep hover:underline">
            {showDone ? "Masquer" : "Voir"} les tâches terminées ({done.length})
          </Link>
          {showDone && (
            <div className="mt-3 rounded-md border border-line bg-card px-4">
              {done.map((task) => (
                <TaskRow key={task.id} task={task} wedding={wedding} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
