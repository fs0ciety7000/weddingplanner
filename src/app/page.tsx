import { redirect } from "next/navigation";
import { getWeddingContext } from "@/lib/wedding";

export default async function RootPage() {
  const { active } = await getWeddingContext();
  redirect(active ? "/dashboard" : "/onboarding");
}
