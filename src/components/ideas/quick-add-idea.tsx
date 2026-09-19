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
import { createIdea } from "@/lib/actions/ideas";
import { IDEA_TAGS } from "@/lib/status";

export function QuickAddIdea({ weddingId }: { weddingId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => startTransition(async () => {
        await createIdea(weddingId, formData);
        formRef.current?.reset();
      })}
      className="mb-6 flex flex-wrap items-center gap-2"
    >
      <Input name="content" placeholder="Une idée, un lien, une envie…" required maxLength={600} className="min-w-56 flex-1" />
      <Select name="tag" defaultValue="Autre">
        <SelectTrigger className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {IDEA_TAGS.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isPending} className="gap-1.5">
        <Plus className="h-4 w-4" strokeWidth={1.5} />
        Noter l&apos;idée
      </Button>
    </form>
  );
}
