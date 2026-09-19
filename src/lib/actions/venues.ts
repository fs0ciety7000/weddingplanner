"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { VenueStatus } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  return v === null ? null : Number(v);
}

export async function createVenue(weddingId: string, formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("venues")
    .insert({
      wedding_id: weddingId,
      name: str(formData, "name") ?? "Nouveau lieu",
      address: str(formData, "address"),
      website: str(formData, "website"),
      contact_name: str(formData, "contact_name"),
      contact_email: str(formData, "contact_email"),
      contact_phone: str(formData, "contact_phone"),
      capacity_seated: num(formData, "capacity_seated"),
      capacity_standing: num(formData, "capacity_standing"),
      price_gross: num(formData, "price_gross"),
      price_flat: num(formData, "price_flat"),
      sound_curfew: str(formData, "sound_curfew"),
      catering_exclusive: formData.get("catering_exclusive") === "on",
      onsite_lodging: formData.get("onsite_lodging") === "on",
      onsite_lodging_capacity: num(formData, "onsite_lodging_capacity"),
      status: (str(formData, "status") as VenueStatus) ?? "a_visiter",
      visit_date: str(formData, "visit_date"),
      notes: str(formData, "notes"),
    })
    .select("id")
    .single();

  revalidatePath("/venues");
  if (error || !data) return;
  redirect(`/venues/${data.id}`);
}

export async function updateVenue(venueId: string, formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from("venues")
    .update({
      name: str(formData, "name") ?? "Lieu sans nom",
      address: str(formData, "address"),
      website: str(formData, "website"),
      contact_name: str(formData, "contact_name"),
      contact_email: str(formData, "contact_email"),
      contact_phone: str(formData, "contact_phone"),
      capacity_seated: num(formData, "capacity_seated"),
      capacity_standing: num(formData, "capacity_standing"),
      price_gross: num(formData, "price_gross"),
      price_flat: num(formData, "price_flat"),
      sound_curfew: str(formData, "sound_curfew"),
      catering_exclusive: formData.get("catering_exclusive") === "on",
      onsite_lodging: formData.get("onsite_lodging") === "on",
      onsite_lodging_capacity: num(formData, "onsite_lodging_capacity"),
      status: (str(formData, "status") as VenueStatus) ?? "a_visiter",
      visit_date: str(formData, "visit_date"),
      notes: str(formData, "notes"),
    })
    .eq("id", venueId);

  revalidatePath("/venues");
  revalidatePath(`/venues/${venueId}`);
}

export async function deleteVenue(venueId: string, weddingId: string) {
  const supabase = await createClient();
  await supabase.from("venues").delete().eq("id", venueId);
  revalidatePath("/venues");
  void weddingId;
  redirect("/venues");
}

export async function setVenueScore(
  venueId: string,
  criterionId: string,
  score: number
) {
  const supabase = await createClient();
  await supabase
    .from("venue_scores")
    .upsert(
      { venue_id: venueId, criterion_id: criterionId, score },
      { onConflict: "venue_id,criterion_id" }
    );
  revalidatePath("/venues");
}

export async function createCriterion(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const name = str(formData, "name");
  if (!name) return;

  const { count } = await supabase
    .from("criteria")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);

  await supabase.from("criteria").insert({
    wedding_id: weddingId,
    name,
    weight: num(formData, "weight") ?? 1,
    order_index: count ?? 0,
  });

  revalidatePath("/venues");
}

export async function deleteCriterion(criterionId: string) {
  const supabase = await createClient();
  await supabase.from("criteria").delete().eq("id", criterionId);
  revalidatePath("/venues");
}

export async function adjustCriterionWeight(criterionId: string, delta: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("criteria")
    .select("weight")
    .eq("id", criterionId)
    .maybeSingle();
  if (!data) return;
  const next = Math.min(5, Math.max(0.5, Number(data.weight) + delta));
  await supabase.from("criteria").update({ weight: next }).eq("id", criterionId);
  revalidatePath("/venues");
}
