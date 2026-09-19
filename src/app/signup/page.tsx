import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/actions/auth";

export default async function SignupPage(props: PageProps<"/signup">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <AuthShell
      title="Créer votre espace"
      subtitle="Un compte pour vous deux, pour tout organiser ensemble."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form action={signUp} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="displayName">Prénom</Label>
          <Input id="displayName" name="displayName" autoComplete="given-name" placeholder="Comment on t'appelle" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="toi@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">8 caractères minimum.</p>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full">
          Créer mon compte
        </Button>
      </form>
    </AuthShell>
  );
}
