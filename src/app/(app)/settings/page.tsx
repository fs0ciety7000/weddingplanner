import { Mail } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateWedding, inviteMember } from "@/lib/actions/wedding";
import { createClient } from "@/lib/supabase/server";
import { getWeddingContext } from "@/lib/wedding";

export default async function SettingsPage() {
  const { active } = await getWeddingContext();
  if (!active) return null;
  const { wedding } = active;

  const supabase = await createClient();
  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase.from("wedding_members").select("*").eq("wedding_id", wedding.id),
    supabase.from("wedding_invites").select("*").eq("wedding_id", wedding.id).is("accepted_at", null),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Réglages" subtitle="Les informations générales de votre mariage." />

      <Card>
        <CardContent className="space-y-5">
          <form action={updateWedding.bind(null, wedding.id)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom du mariage</Label>
              <Input id="name" name="name" defaultValue={wedding.name} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="wedding_date">Date du mariage</Label>
                <Input id="wedding_date" name="wedding_date" type="date" defaultValue={wedding.wedding_date ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guest_count_estimate">Invités estimés</Label>
                <Input
                  id="guest_count_estimate"
                  name="guest_count_estimate"
                  type="number"
                  min={0}
                  defaultValue={wedding.guest_count_estimate ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="venue_city">Région / ville</Label>
                <Input id="venue_city" name="venue_city" defaultValue={wedding.venue_city ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget_total">Budget total (€)</Label>
                <Input
                  id="budget_total"
                  name="budget_total"
                  type="number"
                  min={0}
                  step="100"
                  defaultValue={wedding.budget_total ?? ""}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="theme_description">Ambiance recherchée</Label>
              <Textarea id="theme_description" name="theme_description" rows={3} defaultValue={wedding.theme_description ?? ""} />
            </div>

            <Button type="submit">Enregistrer</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="space-y-4">
          <h2 className="text-h3 text-foreground">Collaborateurs</h2>
          <ul className="space-y-2">
            {(members ?? []).map((m) => (
              <li key={m.user_id} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                <span>{m.display_name || "Membre"}</span>
                <span className="text-xs text-muted-foreground">{m.role === "owner" ? "Propriétaire" : "Collaborateur"}</span>
              </li>
            ))}
            {(invites ?? []).map((i) => (
              <li key={i.id} className="flex items-center justify-between rounded-md border border-dashed border-line px-3 py-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {i.email}
                </span>
                <span className="text-xs">Invitation envoyée</span>
              </li>
            ))}
          </ul>

          <form action={inviteMember.bind(null, wedding.id)} className="flex gap-2">
            <Input name="email" type="email" placeholder="email@exemple.com" required className="flex-1" />
            <Button type="submit" variant="outline">
              Inviter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
