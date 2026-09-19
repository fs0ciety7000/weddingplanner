"use client";

import { useTransition } from "react";
import { Pin, Trash2, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteIdea, togglePinIdea } from "@/lib/actions/ideas";
import { cn } from "@/lib/utils";
import type { Idea } from "@/lib/types/database";

export function IdeaCard({ idea, authorName }: { idea: Idea; authorName: string | null }) {
  const [, startTransition] = useTransition();

  return (
    <Card className="break-inside-avoid">
      <CardContent className="space-y-2.5">
        <p className="whitespace-pre-wrap text-sm text-foreground">{idea.content}</p>
        {idea.link_url && (
          <a
            href={idea.link_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sage-deep hover:underline"
          >
            <LinkIcon className="h-3 w-3" strokeWidth={1.5} />
            Lien
          </a>
        )}
        <div className="flex items-center justify-between border-t border-line pt-2.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {idea.tag ?? "Autre"}
            </span>
            {authorName && <span className="text-xs text-muted-foreground">{authorName}</span>}
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={idea.pinned ? "Désépingler" : "Épingler"}
              onClick={() => startTransition(() => togglePinIdea(idea.id, !idea.pinned))}
              className={cn(idea.pinned && "text-gold")}
            >
              <Pin className="h-3.5 w-3.5" strokeWidth={1.5} fill={idea.pinned ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Supprimer"
              onClick={() => startTransition(() => deleteIdea(idea.id))}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
