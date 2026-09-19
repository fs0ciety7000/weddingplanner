import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWedding } from "@/lib/actions/wedding";
import { getWeddingContext } from "@/lib/wedding";

export default async function OnboardingPage(props: PageProps<"/onboarding">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const { active } = await getWeddingContext();
  if (active) redirect("/");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-sage/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-gold/25 blur-3xl"
      />

      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-sage-deep/25 bg-card text-sage-deep shadow-sm">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Créons votre espace
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Quelques informations pour démarrer — vous pourrez tout modifier ensuite.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-lg shadow-black/[0.03] sm:p-8">
          <form action={createWedding} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom du mariage</Label>
              <Input id="name" name="name" placeholder="Le mariage de Camille & Alex" defaultValue="Notre mariage" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="wedding_date">Date envisagée</Label>
                <Input id="wedding_date" name="wedding_date" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guest_count_estimate">Invités (estimation)</Label>
                <Input id="guest_count_estimate" name="guest_count_estimate" type="number" min={0} placeholder="80" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="venue_city">Région / ville</Label>
                <Input id="venue_city" name="venue_city" placeholder="Provence" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget_total">Budget total (€)</Label>
                <Input id="budget_total" name="budget_total" type="number" min={0} step="100" placeholder="25000" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="theme_description">Ambiance recherchée</Label>
              <Textarea
                id="theme_description"
                name="theme_description"
                rows={3}
                placeholder="Champêtre chic, tons sauge et terracotta, ambiance conviviale..."
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Créer notre espace
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
