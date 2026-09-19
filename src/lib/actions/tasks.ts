"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { GuestSide } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

export async function createTask(weddingId: string, formData: FormData) {
  const title = str(formData, "title");
  if (!title) return;

  const supabase = await createClient();
  const { count } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);

  await supabase.from("tasks").insert({
    wedding_id: weddingId,
    title,
    due_date: str(formData, "due_date"),
    assigned_to: (str(formData, "assigned_to") as GuestSide) ?? "les_deux",
    area: str(formData, "area"),
    notes: str(formData, "notes"),
    order_index: count ?? 0,
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function updateTask(taskId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({
      title: str(formData, "title") ?? "Tâche",
      due_date: str(formData, "due_date"),
      assigned_to: (str(formData, "assigned_to") as GuestSide) ?? "les_deux",
      area: str(formData, "area"),
      notes: str(formData, "notes"),
    })
    .eq("id", taskId);

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function toggleTask(taskId: string, done: boolean) {
  const supabase = await createClient();
  await supabase.from("tasks").update({ done }).eq("id", taskId);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
