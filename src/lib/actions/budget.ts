"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BudgetItemStatus } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number {
  const v = str(formData, key);
  return v === null ? 0 : Number(v);
}

function numOrNull(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  return v === null ? null : Number(v);
}

export async function createBudgetCategory(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const name = str(formData, "name");
  if (!name) return;

  const { count } = await supabase
    .from("budget_categories")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);

  await supabase.from("budget_categories").insert({
    wedding_id: weddingId,
    name,
    order_index: count ?? 0,
  });

  revalidatePath("/budget");
}

export async function deleteBudgetCategory(categoryId: string) {
  const supabase = await createClient();
  await supabase.from("budget_categories").delete().eq("id", categoryId);
  revalidatePath("/budget");
}

export async function createBudgetItem(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase.from("budget_items").insert({
    wedding_id: weddingId,
    category_id: str(formData, "category_id"),
    vendor_id: str(formData, "vendor_id"),
    label: str(formData, "label") ?? "Poste de dépense",
    estimated_amount: num(formData, "estimated_amount"),
    quote_amount: numOrNull(formData, "quote_amount"),
    paid_amount: num(formData, "paid_amount"),
    due_date: str(formData, "due_date"),
    status: (str(formData, "status") as BudgetItemStatus) ?? "a_prevoir",
    notes: str(formData, "notes"),
  });

  revalidatePath("/budget");
}

export async function updateBudgetItem(itemId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("budget_items")
    .update({
      category_id: str(formData, "category_id"),
      vendor_id: str(formData, "vendor_id"),
      label: str(formData, "label") ?? "Poste de dépense",
      estimated_amount: num(formData, "estimated_amount"),
      quote_amount: numOrNull(formData, "quote_amount"),
      paid_amount: num(formData, "paid_amount"),
      due_date: str(formData, "due_date"),
      status: (str(formData, "status") as BudgetItemStatus) ?? "a_prevoir",
      notes: str(formData, "notes"),
    })
    .eq("id", itemId);

  revalidatePath("/budget");
}

export async function deleteBudgetItem(itemId: string) {
  const supabase = await createClient();
  await supabase.from("budget_items").delete().eq("id", itemId);
  revalidatePath("/budget");
}
