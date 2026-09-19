"use client";

import { useTransition } from "react";
import { Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import { TaskFields } from "@/components/tasks/task-fields";
import { toggleTask, updateTask } from "@/lib/actions/tasks";
import { formatDateFr, daysUntil } from "@/lib/format";
import { guestSideLabel } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types/database";

export function TaskRow({ task }: { task: Task }) {
  const [, startTransition] = useTransition();
  const overdue = !task.done && task.due_date && (daysUntil(task.due_date) ?? 0) < 0;

  return (
    <div className="flex items-start gap-3 border-b border-line py-3 last:border-b-0">
      <Checkbox
        checked={task.done}
        onCheckedChange={(checked) => startTransition(() => toggleTask(task.id, checked))}
        className="mt-0.5"
        aria-label={task.title}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm text-foreground", task.done && "text-muted-foreground line-through")}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {task.due_date && (
            <span className={overdue ? "text-destructive" : undefined}>
              {formatDateFr(task.due_date)}
              {overdue ? " · en retard" : ""}
            </span>
          )}
          <span className="rounded-full bg-muted px-2 py-0.5">{guestSideLabel(task.assigned_to)}</span>
          {task.area && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-gold-ink">{task.area}</span>}
        </div>
      </div>
      <FormDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
        }
        title="Modifier la tâche"
        action={updateTask.bind(null, task.id)}
      >
        <TaskFields task={task} />
      </FormDialog>
    </div>
  );
}
