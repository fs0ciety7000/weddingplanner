import type { PillTone } from "@/components/status-pill";
import type {
  AccommodationDirection,
  AccommodationType,
  BookingStatus,
  BudgetItemStatus,
  CeremonyCategory,
  GuestSide,
  MoodboardType,
  ProtocolType,
  RoomPayer,
  RsvpStatus,
  VendorCategory,
  VendorStatus,
  VenueStatus,
} from "@/lib/types/database";

interface StatusMeta<T extends string> {
  value: T;
  label: string;
  tone: PillTone;
}

function asOptions<T extends string>(list: StatusMeta<T>[]) {
  return list;
}

export const VENUE_STATUS: StatusMeta<VenueStatus>[] = asOptions([
  { value: "a_visiter", label: "À visiter", tone: "neutral" },
  { value: "visite_planifiee", label: "Visite planifiée", tone: "warn" },
  { value: "visite_faite", label: "Visite faite", tone: "neutral" },
  { value: "favori", label: "Coup de cœur", tone: "gold" },
  { value: "ecarte", label: "Écarté", tone: "danger" },
  { value: "reserve", label: "Réservé", tone: "sage" },
]);

export const BOOKING_STATUS: StatusMeta<BookingStatus>[] = asOptions([
  { value: "a_contacter", label: "À contacter", tone: "neutral" },
  { value: "option", label: "En option", tone: "warn" },
  { value: "reserve", label: "Réservé", tone: "sage" },
  { value: "annule", label: "Annulé", tone: "danger" },
]);

export const ACCOMMODATION_TYPE: { value: AccommodationType; label: string }[] = [
  { value: "sur_place", label: "Sur place" },
  { value: "hotel", label: "Hôtel" },
  { value: "gite", label: "Gîte" },
  { value: "airbnb", label: "Location" },
  { value: "autre", label: "Autre" },
];

export const ACCOMMODATION_DIRECTION: { value: AccommodationDirection; label: string }[] = [
  { value: "N", label: "Nord" },
  { value: "NE", label: "Nord-est" },
  { value: "E", label: "Est" },
  { value: "SE", label: "Sud-est" },
  { value: "S", label: "Sud" },
  { value: "SO", label: "Sud-ouest" },
  { value: "O", label: "Ouest" },
  { value: "NO", label: "Nord-ouest" },
];

export const ROOM_PAYER: { value: RoomPayer; label: string }[] = [
  { value: "nous", label: "Nous" },
  { value: "invites", label: "Les invités" },
];

export const TASK_AREAS = ["Lieu", "Déco", "Menu", "Musique", "Cérémonie", "Tenues", "Autre"] as const;
export const IDEA_TAGS = TASK_AREAS;

export const VENDOR_CATEGORY: { value: VendorCategory; label: string }[] = [
  { value: "traiteur", label: "Traiteur" },
  { value: "photographe", label: "Photographe" },
  { value: "videaste", label: "Vidéaste" },
  { value: "dj_son", label: "DJ / Sonorisation" },
  { value: "fleuriste", label: "Fleuriste" },
  { value: "papeterie", label: "Papeterie" },
  { value: "autre", label: "Autre" },
];

export const VENDOR_STATUS: StatusMeta<VendorStatus>[] = asOptions([
  { value: "a_contacter", label: "À contacter", tone: "neutral" },
  { value: "devis_recu", label: "Devis reçu", tone: "warn" },
  { value: "visite_call_planifie", label: "Visite / call planifié", tone: "warn" },
  { value: "valide", label: "Validé", tone: "sage" },
  { value: "ecarte", label: "Écarté", tone: "danger" },
]);

export const CEREMONY_CATEGORY: { value: CeremonyCategory; label: string }[] = [
  { value: "ceremonie_civile", label: "Cérémonie civile" },
  { value: "ceremonie_engagement", label: "Cérémonie d'engagement" },
  { value: "temps_traditionnel", label: "Temps traditionnel" },
  { value: "vin_honneur", label: "Vin d'honneur" },
  { value: "diner", label: "Dîner" },
  { value: "ouverture_bal", label: "Ouverture de bal" },
  { value: "soiree", label: "Soirée" },
  { value: "autre", label: "Autre" },
];

export const PROTOCOL_TYPE: { value: ProtocolType; label: string }[] = [
  { value: "tenues", label: "Tenues" },
  { value: "cortege", label: "Cortège" },
  { value: "interventions", label: "Interventions" },
  { value: "musique", label: "Musique d'entrée" },
  { value: "autre", label: "Autre" },
];

export const MOODBOARD_TYPE: { value: MoodboardType; label: string }[] = [
  { value: "palette", label: "Palette" },
  { value: "matiere", label: "Matières" },
  { value: "typographie", label: "Typographies" },
  { value: "papier", label: "Faire-part" },
  { value: "floral", label: "Inspirations florales" },
  { value: "scenographie", label: "Scénographie" },
];

export const BUDGET_ITEM_STATUS: StatusMeta<BudgetItemStatus>[] = asOptions([
  { value: "a_prevoir", label: "À prévoir", tone: "neutral" },
  { value: "devis", label: "Devis", tone: "warn" },
  { value: "acompte_verse", label: "Acompte versé", tone: "gold" },
  { value: "solde_du", label: "Solde dû", tone: "danger" },
  { value: "paye", label: "Payé", tone: "sage" },
]);

/**
 * "Côté" labels depend on the couple's actual first names, so these are
 * functions rather than a static list — pass the active wedding (or just
 * its two partner name fields) to get "Nicolas" / "Gratia" instead of the
 * generic "Partenaire 1" / "Partenaire 2" fallback.
 */
type PartnerNames = { partner1_name: string | null; partner2_name: string | null };

export function getGuestSideOptions(
  wedding: PartnerNames
): { value: GuestSide; label: string }[] {
  return [
    { value: "marie1", label: wedding.partner1_name?.trim() || "Partenaire 1" },
    { value: "marie2", label: wedding.partner2_name?.trim() || "Partenaire 2" },
    { value: "les_deux", label: "Les deux" },
  ];
}

export function guestSideLabel(side: GuestSide, wedding: PartnerNames): string {
  const options = getGuestSideOptions(wedding);
  return options.find((o) => o.value === side)?.label ?? side;
}

export const RSVP_STATUS: StatusMeta<RsvpStatus>[] = asOptions([
  { value: "en_attente", label: "En attente", tone: "neutral" },
  { value: "confirme", label: "Confirmé", tone: "sage" },
  { value: "decline", label: "Décliné", tone: "danger" },
]);

function buildLookup<T extends string>(list: StatusMeta<T>[]) {
  const map = new Map(list.map((item) => [item.value, item]));
  return (value: T): StatusMeta<T> =>
    map.get(value) ?? { value, label: value, tone: "neutral" };
}

export const venueStatusMeta = buildLookup(VENUE_STATUS);
export const bookingStatusMeta = buildLookup(BOOKING_STATUS);
export const vendorStatusMeta = buildLookup(VENDOR_STATUS);
export const budgetItemStatusMeta = buildLookup(BUDGET_ITEM_STATUS);
export const rsvpStatusMeta = buildLookup(RSVP_STATUS);

function buildLabelLookup<T extends string>(list: { value: T; label: string }[]) {
  const map = new Map(list.map((item) => [item.value, item.label]));
  return (value: T): string => map.get(value) ?? value;
}

export const vendorCategoryLabel = buildLabelLookup(VENDOR_CATEGORY);
export const accommodationTypeLabel = buildLabelLookup(ACCOMMODATION_TYPE);
export const accommodationDirectionLabel = buildLabelLookup(ACCOMMODATION_DIRECTION);
export const roomPayerLabel = buildLabelLookup(ROOM_PAYER);
export const ceremonyCategoryLabel = buildLabelLookup(CEREMONY_CATEGORY);
export const protocolTypeLabel = buildLabelLookup(PROTOCOL_TYPE);
export const moodboardTypeLabel = buildLabelLookup(MOODBOARD_TYPE);
