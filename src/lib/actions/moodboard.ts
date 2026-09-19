"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MoodboardType } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function tags(formData: FormData): string[] {
  const raw = str(formData, "tags");
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createMoodboardItem(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("moodboard_items")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);

  await supabase.from("moodboard_items").insert({
    wedding_id: weddingId,
    type: (str(formData, "type") as MoodboardType) ?? "scenographie",
    title: str(formData, "title"),
    color_hex: str(formData, "color_hex"),
    image_url: str(formData, "image_url"),
    link_url: str(formData, "link_url"),
    tags: tags(formData),
    order_index: count ?? 0,
  });

  revalidatePath("/moodboard");
}

export async function updateMoodboardItem(itemId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("moodboard_items")
    .update({
      type: (str(formData, "type") as MoodboardType) ?? "scenographie",
      title: str(formData, "title"),
      color_hex: str(formData, "color_hex"),
      image_url: str(formData, "image_url"),
      link_url: str(formData, "link_url"),
      tags: tags(formData),
    })
    .eq("id", itemId);

  revalidatePath("/moodboard");
}

export async function deleteMoodboardItem(itemId: string) {
  const supabase = await createClient();
  await supabase.from("moodboard_items").delete().eq("id", itemId);
  revalidatePath("/moodboard");
}
