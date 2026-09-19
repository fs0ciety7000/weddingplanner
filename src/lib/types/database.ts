// Hand-written types mirroring supabase/migrations/*.sql.
// If the schema changes, update this file (or regenerate with
// `supabase gen types typescript` once the project is linked).

export type WeddingRole = "owner" | "collaborator";
export type VenueStatus =
  | "a_visiter"
  | "visite_planifiee"
  | "visite_faite"
  | "favori"
  | "ecarte"
  | "reserve";
export type AccommodationType = "sur_place" | "hotel" | "gite" | "airbnb" | "autre";
export type AccommodationDirection = "N" | "NE" | "E" | "SE" | "S" | "SO" | "O" | "NO";
export type BookingStatus = "a_contacter" | "option" | "reserve" | "annule";
export type RoomPayer = "nous" | "invites";
export type GuestSide = "marie1" | "marie2" | "les_deux";
export type RsvpStatus = "en_attente" | "confirme" | "decline";
export type CeremonyCategory =
  | "ceremonie_civile"
  | "ceremonie_engagement"
  | "temps_traditionnel"
  | "vin_honneur"
  | "diner"
  | "ouverture_bal"
  | "soiree"
  | "autre";
export type ProtocolType = "tenues" | "cortege" | "interventions" | "musique" | "autre";
export type VendorCategory =
  | "traiteur"
  | "photographe"
  | "videaste"
  | "dj_son"
  | "fleuriste"
  | "papeterie"
  | "autre";
export type VendorStatus =
  | "a_contacter"
  | "devis_recu"
  | "visite_call_planifie"
  | "valide"
  | "ecarte";
export type MoodboardType = "palette" | "matiere" | "typographie" | "papier" | "floral" | "scenographie";
export type BudgetItemStatus = "a_prevoir" | "devis" | "acompte_verse" | "solde_du" | "paye";

export type Wedding = {
  id: string;
  name: string;
  wedding_date: string | null;
  venue_city: string | null;
  budget_total: number | null;
  guest_count_estimate: number | null;
  theme_description: string | null;
  cover_image_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type WeddingMember = {
  wedding_id: string;
  user_id: string;
  role: WeddingRole;
  display_name: string | null;
  created_at: string;
}

export type WeddingInvite = {
  id: string;
  wedding_id: string;
  email: string;
  role: WeddingRole;
  token: string;
  invited_by: string | null;
  accepted_at: string | null;
  created_at: string;
}

export type Criterion = {
  id: string;
  wedding_id: string;
  name: string;
  weight: number;
  order_index: number;
  created_at: string;
}

export type Venue = {
  id: string;
  wedding_id: string;
  name: string;
  address: string | null;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  capacity_seated: number | null;
  capacity_standing: number | null;
  price_gross: number | null;
  price_flat: number | null;
  sound_curfew: string | null;
  catering_exclusive: boolean;
  onsite_lodging: boolean;
  onsite_lodging_capacity: number | null;
  status: VenueStatus;
  visit_date: string | null;
  notes: string | null;
  photos: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type VenueScore = {
  id: string;
  venue_id: string;
  criterion_id: string;
  score: number;
}

export type Accommodation = {
  id: string;
  wedding_id: string;
  venue_id: string | null;
  type: AccommodationType;
  name: string;
  address: string | null;
  distance_minutes: number | null;
  direction: AccommodationDirection | null;
  total_rooms: number | null;
  total_capacity: number | null;
  price_per_night: number | null;
  booking_status: BookingStatus;
  website: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type Room = {
  id: string;
  accommodation_id: string;
  name: string;
  capacity: number;
  price_per_night: number | null;
  nights: number;
  payer: RoomPayer;
  notes: string | null;
  order_index: number;
  created_at: string;
}

export type Guest = {
  id: string;
  wedding_id: string;
  first_name: string;
  last_name: string | null;
  group_label: string | null;
  side: GuestSide | null;
  plus_one: boolean;
  children_count: number;
  rsvp_status: RsvpStatus;
  dietary_restrictions: string | null;
  needs_lodging: boolean;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export type RoomAssignment = {
  id: string;
  room_id: string;
  guest_id: string;
  nights: number | null;
  created_at: string;
}

export type CeremonyEvent = {
  id: string;
  wedding_id: string;
  title: string;
  category: CeremonyCategory;
  start_time: string | null;
  duration_minutes: number | null;
  location: string | null;
  music: string | null;
  outfits: string | null;
  cortege: string | null;
  speeches: string | null;
  notes: string | null;
  order_index: number;
  created_at: string;
}

export type CeremonyProtocol = {
  id: string;
  wedding_id: string;
  event_id: string | null;
  type: ProtocolType;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type Vendor = {
  id: string;
  wedding_id: string;
  category: VendorCategory;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  status: VendorStatus;
  next_contact_date: string | null;
  quote_amount: number | null;
  deposit_amount: number | null;
  deposit_paid: boolean;
  rating: number | null;
  notes: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type MoodboardItem = {
  id: string;
  wedding_id: string;
  type: MoodboardType;
  title: string | null;
  color_hex: string | null;
  image_url: string | null;
  link_url: string | null;
  tags: string[];
  order_index: number;
  created_at: string;
}

export type BudgetCategory = {
  id: string;
  wedding_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export type BudgetItem = {
  id: string;
  wedding_id: string;
  category_id: string | null;
  vendor_id: string | null;
  label: string;
  estimated_amount: number;
  quote_amount: number | null;
  paid_amount: number;
  due_date: string | null;
  status: BudgetItemStatus;
  notes: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type Task = {
  id: string;
  wedding_id: string;
  title: string;
  due_date: string | null;
  assigned_to: GuestSide;
  area: string | null;
  done: boolean;
  notes: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type Idea = {
  id: string;
  wedding_id: string;
  content: string;
  tag: string | null;
  author_id: string | null;
  link_url: string | null;
  pinned: boolean;
  created_at: string;
}

type Rel<
  FkName extends string,
  Columns extends readonly string[],
  RefRelation extends string,
  RefColumns extends readonly string[],
> = {
  foreignKeyName: FkName;
  columns: Columns;
  isOneToOne: false;
  referencedRelation: RefRelation;
  referencedColumns: RefColumns;
};

// Only outgoing FKs (columns that live on this table) need to be listed —
// postgrest-js resolves both directions (parent embeds children, child
// embeds its parent) from this single, owning-side declaration.
type TableDef<Row, Insert, Relationships extends readonly unknown[] = [], Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export interface Database {
  public: {
    Tables: {
      weddings: TableDef<Wedding, Partial<Wedding> & { name: string; created_by: string }>;
      wedding_members: TableDef<
        WeddingMember,
        Partial<WeddingMember> & { wedding_id: string; user_id: string },
        [Rel<"wedding_members_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      wedding_invites: TableDef<
        WeddingInvite,
        Partial<WeddingInvite> & { wedding_id: string; email: string },
        [Rel<"wedding_invites_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      criteria: TableDef<
        Criterion,
        Partial<Criterion> & { wedding_id: string; name: string },
        [Rel<"criteria_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      venues: TableDef<
        Venue,
        Partial<Venue> & { wedding_id: string; name: string },
        [Rel<"venues_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      venue_scores: TableDef<
        VenueScore,
        Partial<VenueScore> & { venue_id: string; criterion_id: string; score: number },
        [
          Rel<"venue_scores_venue_id_fkey", ["venue_id"], "venues", ["id"]>,
          Rel<"venue_scores_criterion_id_fkey", ["criterion_id"], "criteria", ["id"]>,
        ]
      >;
      accommodations: TableDef<
        Accommodation,
        Partial<Accommodation> & { wedding_id: string; name: string },
        [
          Rel<"accommodations_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>,
          Rel<"accommodations_venue_id_fkey", ["venue_id"], "venues", ["id"]>,
        ]
      >;
      rooms: TableDef<
        Room,
        Partial<Room> & { accommodation_id: string; name: string },
        [Rel<"rooms_accommodation_id_fkey", ["accommodation_id"], "accommodations", ["id"]>]
      >;
      guests: TableDef<
        Guest,
        Partial<Guest> & { wedding_id: string; first_name: string },
        [Rel<"guests_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      room_assignments: TableDef<
        RoomAssignment,
        Partial<RoomAssignment> & { room_id: string; guest_id: string },
        [
          Rel<"room_assignments_room_id_fkey", ["room_id"], "rooms", ["id"]>,
          Rel<"room_assignments_guest_id_fkey", ["guest_id"], "guests", ["id"]>,
        ]
      >;
      ceremony_events: TableDef<
        CeremonyEvent,
        Partial<CeremonyEvent> & { wedding_id: string; title: string },
        [Rel<"ceremony_events_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      ceremony_protocols: TableDef<
        CeremonyProtocol,
        Partial<CeremonyProtocol> & { wedding_id: string; title: string },
        [
          Rel<"ceremony_protocols_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>,
          Rel<"ceremony_protocols_event_id_fkey", ["event_id"], "ceremony_events", ["id"]>,
        ]
      >;
      vendors: TableDef<
        Vendor,
        Partial<Vendor> & { wedding_id: string; name: string },
        [Rel<"vendors_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      moodboard_items: TableDef<
        MoodboardItem,
        Partial<MoodboardItem> & { wedding_id: string },
        [Rel<"moodboard_items_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      budget_categories: TableDef<
        BudgetCategory,
        Partial<BudgetCategory> & { wedding_id: string; name: string },
        [Rel<"budget_categories_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      budget_items: TableDef<
        BudgetItem,
        Partial<BudgetItem> & { wedding_id: string; label: string },
        [
          Rel<"budget_items_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>,
          Rel<"budget_items_category_id_fkey", ["category_id"], "budget_categories", ["id"]>,
          Rel<"budget_items_vendor_id_fkey", ["vendor_id"], "vendors", ["id"]>,
        ]
      >;
      tasks: TableDef<
        Task,
        Partial<Task> & { wedding_id: string; title: string },
        [Rel<"tasks_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
      ideas: TableDef<
        Idea,
        Partial<Idea> & { wedding_id: string; content: string },
        [Rel<"ideas_wedding_id_fkey", ["wedding_id"], "weddings", ["id"]>]
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
