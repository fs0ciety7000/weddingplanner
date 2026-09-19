"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, LogOut, Check } from "lucide-react";
import { Nav } from "@/components/nav";
import { CoupleName } from "@/components/couple-name";
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
import { daysUntil, formatDateLongFr } from "@/lib/format";

export function AppShell({
  wedding,
  memberships,
  userEmail,
  openTasksCount,
  children,
}: {
  wedding: Wedding;
  memberships: { wedding: Wedding }[];
  userEmail: string;
  openTasksCount?: number;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar py-6 md:flex">
        <SidebarBrand wedding={wedding} memberships={memberships} />
        <Nav openTasksCount={openTasksCount} />
        <AccountFooter userEmail={userEmail} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-64 flex-col bg-sidebar p-0 pt-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SidebarBrand wedding={wedding} memberships={memberships} />
          <Nav onNavigate={() => setMobileOpen(false)} openTasksCount={openTasksCount} />
          <AccountFooter userEmail={userEmail} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-heading text-base text-foreground">
            <CoupleName name={wedding.name} />
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarBrand({ wedding, memberships }: { wedding: Wedding; memberships: { wedding: Wedding }[] }) {
  const days = daysUntil(wedding.wedding_date);
  const countdown =
    days === null ? null : days > 0 ? `J-${days}` : days === 0 ? "C'est aujourd'hui !" : "Félicitations !";

  return (
    <div className="mb-6 px-6">
      {memberships.length > 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex w-full items-center justify-between gap-1 text-left">
                <span className="font-heading text-xl leading-tight text-foreground">
                  <CoupleName name={wedding.name} />
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
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
        <Link href="/dashboard" className="block font-heading text-xl leading-tight text-foreground">
          <CoupleName name={wedding.name} />
        </Link>
      )}

      {(wedding.wedding_date || countdown) && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {wedding.wedding_date && formatDateLongFr(wedding.wedding_date)}
          {wedding.wedding_date && countdown && " · "}
          {countdown && <span className="font-medium text-gold-ink">{countdown}</span>}
        </p>
      )}
    </div>
  );
}

function AccountFooter({ userEmail }: { userEmail: string }) {
  return (
    <div className="mt-2 border-t border-border px-3 pt-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <span className="truncate">{userEmail}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            </button>
          }
        />
        <DropdownMenuContent align="start" className="w-56">
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
  );
}
