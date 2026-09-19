"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { VendorCategory, VendorStatus } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  return v === null ? null : Number(v);
}

export async function createVendor(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const status = (str(formData, "status") as VendorStatus) ?? "a_contacter";

  const { count } = await supabase
    .from("vendors")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId)
    .eq("status", status);

  await supabase.from("vendors").insert({
    wedding_id: weddingId,
    category: (str(formData, "category") as VendorCategory) ?? "autre",
    name: str(formData, "name") ?? "Nouveau prestataire",
    contact_name: str(formData, "contact_name"),
    contact_email: str(formData, "contact_email"),
    contact_phone: str(formData, "contact_phone"),
    website: str(formData, "website"),
    status,
    next_contact_date: str(formData, "next_contact_date"),
    quote_amount: num(formData, "quote_amount"),
    deposit_amount: num(formData, "deposit_amount"),
    deposit_paid: formData.get("deposit_paid") === "on",
    rating: num(formData, "rating"),
    notes: str(formData, "notes"),
    order_index: count ?? 0,
  });

  revalidatePath("/vendors");
  revalidatePath("/budget");
}

export async function updateVendor(vendorId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("vendors")
    .update({
      category: (str(formData, "category") as VendorCategory) ?? "autre",
      name: str(formData, "name") ?? "Prestataire",
      contact_name: str(formData, "contact_name"),
      contact_email: str(formData, "contact_email"),
      contact_phone: str(formData, "contact_phone"),
      website: str(formData, "website"),
      status: (str(formData, "status") as VendorStatus) ?? "a_contacter",
      next_contact_date: str(formData, "next_contact_date"),
      quote_amount: num(formData, "quote_amount"),
      deposit_amount: num(formData, "deposit_amount"),
      deposit_paid: formData.get("deposit_paid") === "on",
      rating: num(formData, "rating"),
      notes: str(formData, "notes"),
    })
    .eq("id", vendorId);

  revalidatePath("/vendors");
  revalidatePath("/budget");
}

export async function deleteVendor(vendorId: string) {
  const supabase = await createClient();
  await supabase.from("vendors").delete().eq("id", vendorId);
  revalidatePath("/vendors");
  revalidatePath("/budget");
}

export async function moveVendor(vendorId: string, status: VendorStatus) {
  const supabase = await createClient();
  await supabase.from("vendors").update({ status }).eq("id", vendorId);
  revalidatePath("/vendors");
}
