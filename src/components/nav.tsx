"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Landmark,
  BedDouble,
  CalendarHeart,
  Handshake,
  Palette,
  Wallet,
  UsersRound,
  CheckSquare,
  Lightbulb,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/venues", label: "Lieux & réceptions", icon: Landmark },
  { href: "/accommodations", label: "Hébergements", icon: BedDouble },
  { href: "/ceremony", label: "Cérémonie & déroulé", icon: CalendarHeart },
  { href: "/vendors", label: "Prestataires", icon: Handshake },
  { href: "/moodboard", label: "Moodboard", icon: Palette },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/guests", label: "Invités", icon: UsersRound },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
  { href: "/ideas", label: "Idées", icon: Lightbulb },
] as const;

export function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sage-pale text-sage-deep"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto pt-2">
        <Link
          href="/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-sage-pale text-sage-deep"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          Réglages
        </Link>
      </div>
    </nav>
  );
}
