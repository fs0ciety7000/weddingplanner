"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, ChevronDown, LogOut, Check } from "lucide-react";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth";
import { setActiveWedding } from "@/lib/actions/wedding";
import type { Wedding } from "@/lib/types/database";
import { daysUntil } from "@/lib/format";

export function AppShell({
  wedding,
  memberships,
  userEmail,
  children,
}: {
  wedding: Wedding;
  memberships: { wedding: Wedding }[];
  userEmail: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const days = daysUntil(wedding.wedding_date);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar py-6 md:flex">
        <BrandHeader wedding={wedding} />
        <Nav />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0 pt-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <BrandHeader wedding={wedding} />
          <Nav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {memberships.length > 1 ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="gap-1.5 px-2 font-heading text-base">
                      {wedding.name}
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Mes mariages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {memberships.map((m) => (
                    <form key={m.wedding.id} action={setActiveWedding}>
                      <input type="hidden" name="wedding_id" value={m.wedding.id} />
                      <DropdownMenuItem
                        render={
                          <button type="submit" className="flex w-full items-center justify-between">
                            {m.wedding.name}
                            {m.wedding.id === wedding.id && <Check className="h-4 w-4 text-sage-deep" />}
                          </button>
                        }
                      />
                    </form>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="hidden font-heading text-base text-foreground sm:inline">
                {wedding.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {days !== null && (
              <span className="hidden rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-ink sm:inline-block">
                {days > 0 ? `J-${days}` : days === 0 ? "C'est aujourd'hui !" : "Félicitations !"}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <span className="max-w-32 truncate">{userEmail}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href="/settings">Réglages du mariage</Link>} />
                <DropdownMenuSeparator />
                <form action={signOut}>
                  <DropdownMenuItem
                    variant="destructive"
                    render={
                      <button type="submit" className="flex w-full items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </button>
                    }
                  />
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function BrandHeader({ wedding }: { wedding: Wedding }) {
  return (
    <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-6">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-pale text-sage-deep">
        <Heart className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <span className="font-heading text-lg font-semibold leading-tight text-foreground">
        {wedding.name}
      </span>
    </Link>
  );
}
