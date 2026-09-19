import { cn } from "@/lib/utils";

export type PillTone = "neutral" | "sage" | "gold" | "warn" | "danger";

const TONE_CLASSES: Record<PillTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  sage: "bg-sage-pale text-sage-deep",
  gold: "bg-gold/15 text-gold-ink",
  warn: "bg-warn/15 text-warn",
  danger: "bg-destructive/10 text-destructive",
};

/** A status pill that always carries a word, never colour alone. */
export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
