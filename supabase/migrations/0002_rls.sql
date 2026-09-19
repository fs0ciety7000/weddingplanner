-- ============================================================================
-- Row Level Security — every table is scoped to the weddings a user belongs to
-- ============================================================================

create or replace function public.is_wedding_member(target_wedding_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.wedding_members
    where wedding_id = target_wedding_id
      and user_id = auth.uid()
  );
$$;

grant execute on function public.is_wedding_member(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- weddings
-- ----------------------------------------------------------------------------

alter table public.weddings enable row level security;

create policy "members can read their weddings"
  on public.weddings for select
  using (public.is_wedding_member(id));

create policy "authenticated users can create a wedding"
  on public.weddings for insert
  with check (auth.uid() = created_by);

create policy "members can update their weddings"
  on public.weddings for update
  using (public.is_wedding_member(id));

create policy "owners can delete their weddings"
  on public.weddings for delete
  using (
    exists (
      select 1 from public.wedding_members
      where wedding_id = id and user_id = auth.uid() and role = 'owner'
    )
  );

-- ----------------------------------------------------------------------------
-- wedding_members
-- ----------------------------------------------------------------------------

alter table public.wedding_members enable row level security;

create policy "members can view co-members"
  on public.wedding_members for select
  using (public.is_wedding_member(wedding_id));

create policy "owner can add members"
  on public.wedding_members for insert
  with check (
    user_id = auth.uid()
    or exists (
      select 1 from public.wedding_members m
      where m.wedding_id = wedding_members.wedding_id
        and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

create policy "owner can remove members"
  on public.wedding_members for delete
  using (
    exists (
      select 1 from public.wedding_members m
      where m.wedding_id = wedding_members.wedding_id
        and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

-- ----------------------------------------------------------------------------
-- wedding_invites
-- ----------------------------------------------------------------------------

alter table public.wedding_invites enable row level security;

create policy "members can view invites"
  on public.wedding_invites for select
  using (public.is_wedding_member(wedding_id));

create policy "members can create invites"
  on public.wedding_invites for insert
  with check (public.is_wedding_member(wedding_id));

create policy "members can delete invites"
  on public.wedding_invites for delete
  using (public.is_wedding_member(wedding_id));

-- ----------------------------------------------------------------------------
-- Generic helper: apply the same "member of wedding_id" policy to every
-- remaining table that carries a direct wedding_id column.
-- ----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'criteria', 'venues', 'accommodations', 'guests',
    'ceremony_events', 'ceremony_protocols', 'vendors',
    'moodboard_items', 'budget_categories', 'budget_items',
    'tasks', 'ideas'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format(
      'create policy "members can select" on public.%I for select using (public.is_wedding_member(wedding_id));',
      t
    );
    execute format(
      'create policy "members can insert" on public.%I for insert with check (public.is_wedding_member(wedding_id));',
      t
    );
    execute format(
      'create policy "members can update" on public.%I for update using (public.is_wedding_member(wedding_id));',
      t
    );
    execute format(
      'create policy "members can delete" on public.%I for delete using (public.is_wedding_member(wedding_id));',
      t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Tables scoped through a parent (venue_scores -> venues, rooms/room_assignments
-- -> accommodations/guests)
-- ----------------------------------------------------------------------------

alter table public.venue_scores enable row level security;

create policy "members can select"
  on public.venue_scores for select
  using (exists (select 1 from public.venues v where v.id = venue_id and public.is_wedding_member(v.wedding_id)));

create policy "members can insert"
  on public.venue_scores for insert
  with check (exists (select 1 from public.venues v where v.id = venue_id and public.is_wedding_member(v.wedding_id)));

create policy "members can update"
  on public.venue_scores for update
  using (exists (select 1 from public.venues v where v.id = venue_id and public.is_wedding_member(v.wedding_id)));

create policy "members can delete"
  on public.venue_scores for delete
  using (exists (select 1 from public.venues v where v.id = venue_id and public.is_wedding_member(v.wedding_id)));

alter table public.rooms enable row level security;

create policy "members can select"
  on public.rooms for select
  using (exists (select 1 from public.accommodations a where a.id = accommodation_id and public.is_wedding_member(a.wedding_id)));

create policy "members can insert"
  on public.rooms for insert
  with check (exists (select 1 from public.accommodations a where a.id = accommodation_id and public.is_wedding_member(a.wedding_id)));

create policy "members can update"
  on public.rooms for update
  using (exists (select 1 from public.accommodations a where a.id = accommodation_id and public.is_wedding_member(a.wedding_id)));

create policy "members can delete"
  on public.rooms for delete
  using (exists (select 1 from public.accommodations a where a.id = accommodation_id and public.is_wedding_member(a.wedding_id)));

alter table public.room_assignments enable row level security;

create policy "members can select"
  on public.room_assignments for select
  using (exists (select 1 from public.rooms r join public.accommodations a on a.id = r.accommodation_id where r.id = room_id and public.is_wedding_member(a.wedding_id)));

create policy "members can insert"
  on public.room_assignments for insert
  with check (exists (select 1 from public.rooms r join public.accommodations a on a.id = r.accommodation_id where r.id = room_id and public.is_wedding_member(a.wedding_id)));

create policy "members can update"
  on public.room_assignments for update
  using (exists (select 1 from public.rooms r join public.accommodations a on a.id = r.accommodation_id where r.id = room_id and public.is_wedding_member(a.wedding_id)));

create policy "members can delete"
  on public.room_assignments for delete
  using (exists (select 1 from public.rooms r join public.accommodations a on a.id = r.accommodation_id where r.id = room_id and public.is_wedding_member(a.wedding_id)));
