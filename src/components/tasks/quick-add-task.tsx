"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/lib/actions/tasks";
import { getGuestSideOptions } from "@/lib/status";
import type { Wedding } from "@/lib/types/database";

export function QuickAddTask({ wedding }: { wedding: Wedding }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const guestSideOptions = getGuestSideOptions(wedding);

  return (
    <form
      ref={formRef}
      action={(formData) => startTransition(async () => {
        await createTask(wedding.id, formData);
        formRef.current?.reset();
      })}
      className="mb-6 flex flex-wrap items-center gap-2"
    >
      <Input name="title" placeholder="Nouvelle tâche…" required maxLength={200} className="min-w-56 flex-1" />
      <Input name="due_date" type="date" className="w-auto" />
      <Select name="assigned_to" defaultValue="les_deux">
        <SelectTrigger className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {guestSideOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isPending} className="gap-1.5">
        <Plus className="h-4 w-4" strokeWidth={1.5} />
        Ajouter
      </Button>
    </form>
  );
}
