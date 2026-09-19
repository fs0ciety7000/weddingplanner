"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

export async function createIdea(weddingId: string, formData: FormData) {
  const content = str(formData, "content");
  if (!content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("ideas").insert({
    wedding_id: weddingId,
    content,
    tag: str(formData, "tag"),
    link_url: str(formData, "link_url"),
    author_id: user?.id ?? null,
  });

  revalidatePath("/ideas");
  revalidatePath("/dashboard");
}

export async function deleteIdea(ideaId: string) {
  const supabase = await createClient();
  await supabase.from("ideas").delete().eq("id", ideaId);
  revalidatePath("/ideas");
  revalidatePath("/dashboard");
}

export async function togglePinIdea(ideaId: string, pinned: boolean) {
  const supabase = await createClient();
  await supabase.from("ideas").update({ pinned }).eq("id", ideaId);
  revalidatePath("/ideas");
}
