"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CeremonyCategory, ProtocolType } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  return v === null ? null : Number(v);
}

export async function createEvent(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("ceremony_events")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);

  await supabase.from("ceremony_events").insert({
    wedding_id: weddingId,
    title: str(formData, "title") ?? "Moment",
    category: (str(formData, "category") as CeremonyCategory) ?? "autre",
    start_time: str(formData, "start_time"),
    duration_minutes: num(formData, "duration_minutes"),
    location: str(formData, "location"),
    music: str(formData, "music"),
    outfits: str(formData, "outfits"),
    cortege: str(formData, "cortege"),
    speeches: str(formData, "speeches"),
    notes: str(formData, "notes"),
    order_index: count ?? 0,
  });

  revalidatePath("/ceremony");
}

export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("ceremony_events")
    .update({
      title: str(formData, "title") ?? "Moment",
      category: (str(formData, "category") as CeremonyCategory) ?? "autre",
      start_time: str(formData, "start_time"),
      duration_minutes: num(formData, "duration_minutes"),
      location: str(formData, "location"),
      music: str(formData, "music"),
      outfits: str(formData, "outfits"),
      cortege: str(formData, "cortege"),
      speeches: str(formData, "speeches"),
      notes: str(formData, "notes"),
    })
    .eq("id", eventId);

  revalidatePath("/ceremony");
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  await supabase.from("ceremony_events").delete().eq("id", eventId);
  revalidatePath("/ceremony");
}

export async function createProtocol(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("ceremony_protocols")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);

  await supabase.from("ceremony_protocols").insert({
    wedding_id: weddingId,
    event_id: str(formData, "event_id"),
    type: (str(formData, "type") as ProtocolType) ?? "autre",
    title: str(formData, "title") ?? "Fiche",
    content: str(formData, "content"),
    order_index: count ?? 0,
  });

  revalidatePath("/ceremony");
}

export async function updateProtocol(protocolId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("ceremony_protocols")
    .update({
      event_id: str(formData, "event_id"),
      type: (str(formData, "type") as ProtocolType) ?? "autre",
      title: str(formData, "title") ?? "Fiche",
      content: str(formData, "content"),
    })
    .eq("id", protocolId);

  revalidatePath("/ceremony");
}

export async function deleteProtocol(protocolId: string) {
  const supabase = await createClient();
  await supabase.from("ceremony_protocols").delete().eq("id", protocolId);
  revalidatePath("/ceremony");
}
