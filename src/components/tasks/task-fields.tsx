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
import { getGuestSideOptions, TASK_AREAS } from "@/lib/status";
import type { Task, Wedding } from "@/lib/types/database";

export function TaskFields({ task, wedding }: { task?: Task; wedding: Wedding }) {
  const guestSideOptions = getGuestSideOptions(wedding);

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="t-title">Tâche</Label>
        <Input id="t-title" name="title" required defaultValue={task?.title} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="t-due">Échéance</Label>
          <Input id="t-due" name="due_date" type="date" defaultValue={task?.due_date ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="t-who">Qui ?</Label>
          <Select name="assigned_to" defaultValue={task?.assigned_to ?? "les_deux"}>
            <SelectTrigger id="t-who" className="w-full">
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
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-area">Thème</Label>
        <Select name="area" defaultValue={task?.area ?? "Autre"}>
          <SelectTrigger id="t-area" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASK_AREAS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-notes">Notes</Label>
        <Textarea id="t-notes" name="notes" rows={2} defaultValue={task?.notes ?? ""} />
      </div>
    </>
  );
}
