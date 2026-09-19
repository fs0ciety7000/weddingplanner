import { format } from "date-fns";
import { fr } from "date-fns/locale";

const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurFormatterCents = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

/** "12 400 €" — no decimals unless cents actually matter. */
export function formatEUR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return Number.isInteger(amount) ? eurFormatter.format(amount) : eurFormatterCents.format(amount);
}

/** "sam. 12 juin 2027" */
export function formatDateFr(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = dateStr.length <= 10 ? new Date(dateStr + "T00:00:00") : new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "EEE d MMMM yyyy", { locale: fr });
}

/** "12 juin" — short form for dense layouts (timelines, tables). */
export function formatDateShortFr(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = dateStr.length <= 10 ? new Date(dateStr + "T00:00:00") : new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "d MMMM", { locale: fr });
}

/** "12 juin 2027" — no weekday, for compact headers like the sidebar. */
export function formatDateLongFr(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = dateStr.length <= 10 ? new Date(dateStr + "T00:00:00") : new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "d MMMM yyyy", { locale: fr });
}

/** "17 h 30" (or "17 h" on the hour) */
export function formatTimeFr(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  const h = date.getHours();
  const m = date.getMinutes();
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

/** "17 h 30" from a plain "HH:MM" or "HH:MM:SS" time-of-day string. */
export function formatTimeOfDay(time: string | null | undefined): string {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return "—";
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

/** Adds `minutes` to a plain "HH:MM" or "HH:MM:SS" time-of-day string. */
export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = ((h * 60 + m + minutes) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}
