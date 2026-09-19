"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

function Stars({
  value,
  onPick,
  size = "h-4 w-4",
}: {
  value: number;
  onPick?: (n: number) => void;
  size?: string;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onPick}
          onClick={() => onPick?.(n === value ? 0 : n)}
          className={cn(
            "text-line-strong transition-colors",
            onPick && "cursor-pointer hover:text-gold",
            n <= value && "text-gold"
          )}
          aria-label={`${n} sur 5`}
        >
          <Star className={size} strokeWidth={1.5} fill={n <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </span>
  );
}

/** Read-only star display. */
export function StarRatingReadOnly({ value, size }: { value: number; size?: string }) {
  return <Stars value={value} size={size} />;
}

/** Interactive star picker for a live server value (calls onChange immediately). */
export function StarRatingControl({
  value,
  onChange,
  size,
}: {
  value: number;
  onChange: (n: number) => void;
  size?: string;
}) {
  return <Stars value={value} onPick={onChange} size={size} />;
}

/** Interactive star picker for use inside a <form>: exposes a hidden input. */
export function StarRatingField({ name, defaultValue = 0 }: { name: string; defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <span className="inline-flex items-center gap-2">
      <input type="hidden" name={name} value={value} />
      <Stars value={value} onPick={setValue} size="h-5 w-5" />
    </span>
  );
}
