import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { getWeddingContext } from "@/lib/wedding";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { active, memberships } = await getWeddingContext();
  if (!active) redirect("/onboarding");

  return (
    <AppShell wedding={active.wedding} memberships={memberships} userEmail={user.email ?? ""}>
      {children}
    </AppShell>
  );
}
