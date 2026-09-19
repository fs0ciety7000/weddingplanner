"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AccommodationDirection, AccommodationType, BookingStatus, RoomPayer } from "@/lib/types/database";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  return v === null ? null : Number(v);
}

export async function createAccommodation(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accommodations")
    .insert({
      wedding_id: weddingId,
      type: (str(formData, "type") as AccommodationType) ?? "hotel",
      name: str(formData, "name") ?? "Nouvel hébergement",
      address: str(formData, "address"),
      distance_minutes: num(formData, "distance_minutes"),
      direction: (str(formData, "direction") as AccommodationDirection) ?? null,
      total_rooms: num(formData, "total_rooms"),
      total_capacity: num(formData, "total_capacity"),
      price_per_night: num(formData, "price_per_night"),
      booking_status: (str(formData, "booking_status") as BookingStatus) ?? "a_contacter",
      website: str(formData, "website"),
      phone: str(formData, "phone"),
      notes: str(formData, "notes"),
    })
    .select("id")
    .single();

  revalidatePath("/accommodations");
  if (error || !data) return;
  redirect(`/accommodations/${data.id}`);
}

export async function updateAccommodation(accommodationId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("accommodations")
    .update({
      type: (str(formData, "type") as AccommodationType) ?? "hotel",
      name: str(formData, "name") ?? "Hébergement",
      address: str(formData, "address"),
      distance_minutes: num(formData, "distance_minutes"),
      direction: (str(formData, "direction") as AccommodationDirection) ?? null,
      total_rooms: num(formData, "total_rooms"),
      total_capacity: num(formData, "total_capacity"),
      price_per_night: num(formData, "price_per_night"),
      booking_status: (str(formData, "booking_status") as BookingStatus) ?? "a_contacter",
      website: str(formData, "website"),
      phone: str(formData, "phone"),
      notes: str(formData, "notes"),
    })
    .eq("id", accommodationId);

  revalidatePath("/accommodations");
  revalidatePath(`/accommodations/${accommodationId}`);
}

export async function deleteAccommodation(accommodationId: string) {
  const supabase = await createClient();
  await supabase.from("accommodations").delete().eq("id", accommodationId);
  revalidatePath("/accommodations");
  redirect("/accommodations");
}

export async function createRoom(accommodationId: string, formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("rooms")
    .select("id", { count: "exact", head: true })
    .eq("accommodation_id", accommodationId);

  await supabase.from("rooms").insert({
    accommodation_id: accommodationId,
    name: str(formData, "name") ?? "Chambre",
    capacity: num(formData, "capacity") ?? 2,
    price_per_night: num(formData, "price_per_night"),
    nights: num(formData, "nights") ?? 1,
    payer: (str(formData, "payer") as RoomPayer) ?? "nous",
    notes: str(formData, "notes"),
    order_index: count ?? 0,
  });

  revalidatePath("/accommodations");
}

export async function updateRoom(roomId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("rooms")
    .update({
      name: str(formData, "name") ?? "Chambre",
      capacity: num(formData, "capacity") ?? 2,
      price_per_night: num(formData, "price_per_night"),
      nights: num(formData, "nights") ?? 1,
      payer: (str(formData, "payer") as RoomPayer) ?? "nous",
      notes: str(formData, "notes"),
    })
    .eq("id", roomId);

  revalidatePath("/accommodations");
}

export async function deleteRoom(roomId: string) {
  const supabase = await createClient();
  await supabase.from("rooms").delete().eq("id", roomId);
  revalidatePath("/accommodations");
}

export async function assignGuestToRoom(roomId: string, formData: FormData) {
  const guestId = str(formData, "guest_id");
  if (!guestId) return;
  const supabase = await createClient();
  await supabase.from("room_assignments").insert({ room_id: roomId, guest_id: guestId });
  revalidatePath("/accommodations");
}

export async function unassignGuestFromRoom(assignmentId: string) {
  const supabase = await createClient();
  await supabase.from("room_assignments").delete().eq("id", assignmentId);
  revalidatePath("/accommodations");
}
