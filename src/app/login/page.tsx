import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;
  const message = typeof searchParams.message === "string" ? searchParams.message : null;
  const next = typeof searchParams.next === "string" ? searchParams.next : "/";

  return (
    <AuthShell
      title="Bon retour"
      subtitle="Connecte-toi pour continuer l'organisation."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form action={signIn} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="toi@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        {message && (
          <p className="rounded-md bg-sage-pale px-3 py-2 text-sm text-sage-deep">{message}</p>
        )}

        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </AuthShell>
  );
}
