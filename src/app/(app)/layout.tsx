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

  const { count: openTasksCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("wedding_id", active.wedding.id)
    .eq("done", false);

  return (
    <AppShell
      wedding={active.wedding}
      memberships={memberships}
      userEmail={user.email ?? ""}
      openTasksCount={openTasksCount ?? undefined}
    >
      {children}
    </AppShell>
  );
}
