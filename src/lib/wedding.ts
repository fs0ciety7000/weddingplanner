import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Wedding, WeddingRole } from "@/lib/types/database";

const ACTIVE_WEDDING_COOKIE = "active_wedding_id";

export interface WeddingMembership {
  wedding: Wedding;
  role: WeddingRole;
}

/**
 * Returns every wedding the current user belongs to, and the one that
 * should be treated as "active" (cookie preference, else the first one).
 * Returns `active: null` when the user has not created/joined any wedding
 * yet, so the caller can route to onboarding.
 */
export async function getWeddingContext(): Promise<{
  memberships: WeddingMembership[];
  active: WeddingMembership | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { memberships: [], active: null };

  const { data, error } = await supabase
    .from("wedding_members")
    .select("role, weddings(*)")
    .eq("user_id", user.id);

  if (error || !data) return { memberships: [], active: null };

  const memberships: WeddingMembership[] = data
    .filter((row) => row.weddings)
    .map((row) => ({
      wedding: row.weddings as unknown as Wedding,
      role: row.role as WeddingRole,
    }));

  if (memberships.length === 0) return { memberships, active: null };

  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_WEDDING_COOKIE)?.value;
  const active =
    memberships.find((m) => m.wedding.id === preferredId) ?? memberships[0];

  return { memberships, active };
}

export async function requireActiveWedding(): Promise<WeddingMembership> {
  const { active } = await getWeddingContext();
  if (!active) {
    throw new Error("NO_ACTIVE_WEDDING");
  }
  return active;
}

export { ACTIVE_WEDDING_COOKIE };
