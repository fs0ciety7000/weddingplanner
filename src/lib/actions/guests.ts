"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { GuestSide, RsvpStatus } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number {
  const v = str(formData, key);
  return v === null ? 0 : Number(v);
}

export async function createGuest(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase.from("guests").insert({
    wedding_id: weddingId,
    first_name: str(formData, "first_name") ?? "Invité·e",
    last_name: str(formData, "last_name"),
    group_label: str(formData, "group_label"),
    side: (str(formData, "side") as GuestSide) ?? null,
    plus_one: formData.get("plus_one") === "on",
    children_count: num(formData, "children_count"),
    rsvp_status: (str(formData, "rsvp_status") as RsvpStatus) ?? "en_attente",
    dietary_restrictions: str(formData, "dietary_restrictions"),
    needs_lodging: formData.get("needs_lodging") === "on",
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    notes: str(formData, "notes"),
  });
  revalidatePath("/guests");
  revalidatePath("/accommodations");
}

export async function updateGuest(guestId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("guests")
    .update({
      first_name: str(formData, "first_name") ?? "Invité·e",
      last_name: str(formData, "last_name"),
      group_label: str(formData, "group_label"),
      side: (str(formData, "side") as GuestSide) ?? null,
      plus_one: formData.get("plus_one") === "on",
      children_count: num(formData, "children_count"),
      rsvp_status: (str(formData, "rsvp_status") as RsvpStatus) ?? "en_attente",
      dietary_restrictions: str(formData, "dietary_restrictions"),
      needs_lodging: formData.get("needs_lodging") === "on",
      email: str(formData, "email"),
      phone: str(formData, "phone"),
      notes: str(formData, "notes"),
    })
    .eq("id", guestId);
  revalidatePath("/guests");
  revalidatePath("/accommodations");
}

export async function deleteGuest(guestId: string) {
  const supabase = await createClient();
  await supabase.from("guests").delete().eq("id", guestId);
  revalidatePath("/guests");
  revalidatePath("/accommodations");
}
