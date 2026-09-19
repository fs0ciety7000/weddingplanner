"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_WEDDING_COOKIE } from "@/lib/wedding";

export async function createWedding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim() || "Notre mariage";
  const weddingDate = String(formData.get("wedding_date") ?? "") || null;
  const venueCity = String(formData.get("venue_city") ?? "").trim() || null;
  const budgetTotal = formData.get("budget_total");
  const guestCount = formData.get("guest_count_estimate");

  const { data, error } = await supabase
    .from("weddings")
    .insert({
      name,
      wedding_date: weddingDate,
      venue_city: venueCity,
      budget_total: budgetTotal ? Number(budgetTotal) : null,
      guest_count_estimate: guestCount ? Number(guestCount) : null,
      created_by: user!.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/onboarding?error=${encodeURIComponent(error?.message ?? "Erreur inconnue")}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_WEDDING_COOKIE, data.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function setActiveWedding(formData: FormData) {
  const weddingId = String(formData.get("wedding_id") ?? "");
  if (!weddingId) return;

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_WEDDING_COOKIE, weddingId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
}

export async function updateWedding(weddingId: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const weddingDate = String(formData.get("wedding_date") ?? "") || null;
  const venueCity = String(formData.get("venue_city") ?? "").trim() || null;
  const budgetTotal = formData.get("budget_total");
  const guestCount = formData.get("guest_count_estimate");
  const themeDescription = String(formData.get("theme_description") ?? "").trim() || null;

  await supabase
    .from("weddings")
    .update({
      name: name || "Notre mariage",
      wedding_date: weddingDate,
      venue_city: venueCity,
      budget_total: budgetTotal ? Number(budgetTotal) : null,
      guest_count_estimate: guestCount ? Number(guestCount) : null,
      theme_description: themeDescription,
    })
    .eq("id", weddingId);

  revalidatePath("/", "layout");
}

export async function inviteMember(weddingId: string, formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("wedding_invites").insert({
    wedding_id: weddingId,
    email,
    invited_by: user?.id ?? null,
  });

  revalidatePath("/settings");
}
