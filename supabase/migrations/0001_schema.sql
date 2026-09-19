-- ============================================================================
-- Wedding Planner — core schema
-- ============================================================================

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Weddings & membership
-- ----------------------------------------------------------------------------

create table public.weddings (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Notre mariage',
  wedding_date date,
  venue_city text,
  budget_total numeric(12,2),
  guest_count_estimate integer,
  theme_description text,
  cover_image_url text,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.weddings
  for each row execute function public.set_updated_at();

create table public.wedding_members (
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'collaborator' check (role in ('owner', 'collaborator')),
  display_name text,
  created_at timestamptz not null default now(),
  primary key (wedding_id, user_id)
);

create table public.wedding_invites (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  email text not null,
  role text not null default 'collaborator' check (role in ('owner', 'collaborator')),
  token uuid not null default gen_random_uuid(),
  invited_by uuid references auth.users (id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (wedding_id, email)
);

-- ----------------------------------------------------------------------------
-- Decision criteria (used for the venue comparison matrix, evolutive)
-- ----------------------------------------------------------------------------

create table public.criteria (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  weight numeric(4,2) not null default 1,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Venues & scoring
-- ----------------------------------------------------------------------------

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  address text,
  website text,
  contact_name text,
  contact_email text,
  contact_phone text,
  capacity_seated integer,
  capacity_standing integer,
  price_gross numeric(12,2),
  price_flat numeric(12,2),
  sound_curfew time,
  catering_exclusive boolean not null default false,
  onsite_lodging boolean not null default false,
  onsite_lodging_capacity integer,
  status text not null default 'a_visiter'
    check (status in ('a_visiter', 'visite_planifiee', 'visite_faite', 'favori', 'ecarte', 'reserve')),
  visit_date date,
  notes text,
  photos text[] not null default '{}',
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.venues
  for each row execute function public.set_updated_at();

create table public.venue_scores (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues (id) on delete cascade,
  criterion_id uuid not null references public.criteria (id) on delete cascade,
  score smallint not null check (score between 0 and 5),
  unique (venue_id, criterion_id)
);

-- ----------------------------------------------------------------------------
-- Accommodations & room assignment
-- ----------------------------------------------------------------------------

create table public.accommodations (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  venue_id uuid references public.venues (id) on delete set null,
  type text not null default 'hotel'
    check (type in ('sur_place', 'hotel', 'gite', 'airbnb', 'autre')),
  name text not null,
  address text,
  distance_minutes integer,
  direction text check (direction in ('N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO')),
  total_rooms integer,
  total_capacity integer,
  price_per_night numeric(12,2),
  booking_status text not null default 'a_contacter'
    check (booking_status in ('a_contacter', 'option', 'reserve', 'annule')),
  website text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.accommodations
  for each row execute function public.set_updated_at();

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  accommodation_id uuid not null references public.accommodations (id) on delete cascade,
  name text not null,
  capacity integer not null default 2,
  price_per_night numeric(12,2),
  nights integer not null default 1,
  payer text not null default 'nous' check (payer in ('nous', 'invites')),
  notes text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  first_name text not null,
  last_name text,
  group_label text,
  side text check (side in ('marie1', 'marie2', 'les_deux')),
  plus_one boolean not null default false,
  children_count integer not null default 0,
  rsvp_status text not null default 'en_attente'
    check (rsvp_status in ('en_attente', 'confirme', 'decline')),
  dietary_restrictions text,
  needs_lodging boolean not null default false,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.room_assignments (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  guest_id uuid not null references public.guests (id) on delete cascade,
  nights integer,
  created_at timestamptz not null default now(),
  unique (room_id, guest_id)
);

-- ----------------------------------------------------------------------------
-- Ceremony timeline & protocol sheets
-- ----------------------------------------------------------------------------

create table public.ceremony_events (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  title text not null,
  category text not null default 'autre'
    check (category in ('ceremonie_civile', 'ceremonie_engagement', 'temps_traditionnel', 'vin_honneur', 'diner', 'ouverture_bal', 'soiree', 'autre')),
  start_time time,
  duration_minutes integer,
  location text,
  music text,
  outfits text,
  cortege text,
  speeches text,
  notes text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.ceremony_protocols (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  event_id uuid references public.ceremony_events (id) on delete set null,
  type text not null default 'autre'
    check (type in ('tenues', 'cortege', 'interventions', 'musique', 'autre')),
  title text not null,
  content text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.ceremony_protocols
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Vendors (kanban)
-- ----------------------------------------------------------------------------

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  category text not null default 'autre'
    check (category in ('traiteur', 'photographe', 'videaste', 'dj_son', 'fleuriste', 'papeterie', 'autre')),
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  website text,
  status text not null default 'a_contacter'
    check (status in ('a_contacter', 'devis_recu', 'visite_call_planifie', 'valide', 'ecarte')),
  next_contact_date date,
  quote_amount numeric(12,2),
  deposit_amount numeric(12,2),
  deposit_paid boolean not null default false,
  rating smallint check (rating between 0 and 5),
  notes text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.vendors
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Moodboard
-- ----------------------------------------------------------------------------

create table public.moodboard_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  type text not null default 'scenographie'
    check (type in ('palette', 'matiere', 'typographie', 'papier', 'floral', 'scenographie')),
  title text,
  color_hex text,
  image_url text,
  link_url text,
  tags text[] not null default '{}',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Budget
-- ----------------------------------------------------------------------------

create table public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  category_id uuid references public.budget_categories (id) on delete set null,
  vendor_id uuid references public.vendors (id) on delete set null,
  label text not null,
  estimated_amount numeric(12,2) not null default 0,
  quote_amount numeric(12,2),
  paid_amount numeric(12,2) not null default 0,
  due_date date,
  status text not null default 'a_prevoir'
    check (status in ('a_prevoir', 'devis', 'acompte_verse', 'solde_du', 'paye')),
  notes text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.budget_items
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Tasks
-- ----------------------------------------------------------------------------

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  title text not null,
  due_date date,
  assigned_to text not null default 'les_deux' check (assigned_to in ('marie1', 'marie2', 'les_deux')),
  area text,
  done boolean not null default false,
  notes text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Ideas
-- ----------------------------------------------------------------------------

create table public.ideas (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  content text not null,
  tag text,
  author_id uuid references auth.users (id) on delete set null,
  link_url text,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------

create index on public.wedding_members (user_id);
create index on public.criteria (wedding_id);
create index on public.venues (wedding_id);
create index on public.venue_scores (venue_id);
create index on public.accommodations (wedding_id);
create index on public.rooms (accommodation_id);
create index on public.guests (wedding_id);
create index on public.room_assignments (room_id);
create index on public.room_assignments (guest_id);
create index on public.ceremony_events (wedding_id);
create index on public.ceremony_protocols (wedding_id);
create index on public.vendors (wedding_id);
create index on public.moodboard_items (wedding_id);
create index on public.budget_categories (wedding_id);
create index on public.budget_items (wedding_id);
create index on public.budget_items (category_id);
create index on public.tasks (wedding_id);
create index on public.ideas (wedding_id);
