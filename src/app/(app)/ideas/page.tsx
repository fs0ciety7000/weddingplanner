import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { QuickAddIdea } from "@/components/ideas/quick-add-idea";
import { IdeaCard } from "@/components/ideas/idea-card";
import { EmptyState } from "@/components/empty-state";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { IDEA_TAGS } from "@/lib/status";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function IdeasPage(props: PageProps<"/ideas">) {
  const searchParams = await props.searchParams;
  const tag = typeof searchParams.tag === "string" ? searchParams.tag : null;

  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [{ data: ideas }, { data: members }] = await Promise.all([
    supabase
      .from("ideas")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("wedding_members").select("user_id, display_name").eq("wedding_id", wedding.id),
  ]);

  const authorNames = new Map((members ?? []).map((m) => [m.user_id, m.display_name]));
  const all = ideas ?? [];
  const filtered = tag ? all.filter((i) => i.tag === tag) : all;

  return (
    <div>
      <PageHeader title="Idées" subtitle="Tout ce qui vous passe par la tête : on trie plus tard." />

      <QuickAddIdea weddingId={wedding.id} />

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/ideas"
          className={cn(
            "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
            !tag ? "border-sage-deep bg-sage-deep text-on-sage-deep" : "border-line-strong bg-card text-foreground hover:bg-muted"
          )}
        >
          Toutes
        </Link>
        {IDEA_TAGS.map((t) => (
          <Link
            key={t}
            href={`/ideas?tag=${encodeURIComponent(t)}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              tag === t ? "border-sage-deep bg-sage-deep text-on-sage-deep" : "border-line-strong bg-card text-foreground hover:bg-muted"
            )}
          >
            {t}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Lightbulb} title="Aucune idée pour ce filtre" description="Notez tout ce qui vous inspire, on organisera plus tard." />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} authorName={authorNames.get(idea.author_id ?? "") ?? null} />
          ))}
        </div>
      )}
    </div>
  );
}
