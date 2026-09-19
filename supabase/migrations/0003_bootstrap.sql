-- ============================================================================
-- Bootstrap: auto-membership + sensible defaults when a wedding is created
-- ============================================================================

create or replace function public.handle_new_wedding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wedding_members (wedding_id, user_id, role)
  values (new.id, new.created_by, 'owner');

  insert into public.criteria (wedding_id, name, weight, order_index)
  values
    (new.id, 'Coup de cœur', 1.5, 0),
    (new.id, 'Budget', 1.5, 1),
    (new.id, 'Flexibilité', 1, 2),
    (new.id, 'Accessibilité pour les proches', 1, 3);

  insert into public.budget_categories (wedding_id, name, order_index)
  values
    (new.id, 'Lieu & réception', 0),
    (new.id, 'Traiteur', 1),
    (new.id, 'Hébergement', 2),
    (new.id, 'Photographe / Vidéaste', 3),
    (new.id, 'DJ / Sonorisation', 4),
    (new.id, 'Fleuriste', 5),
    (new.id, 'Papeterie', 6),
    (new.id, 'Tenues & beauté', 7),
    (new.id, 'Divers', 8);

  return new;
end;
$$;

create trigger on_wedding_created
  after insert on public.weddings
  for each row execute function public.handle_new_wedding();

-- ----------------------------------------------------------------------------
-- Storage: one bucket for all wedding media (venue photos, moodboard images,
-- cover picture), private, scoped by a {wedding_id}/... path prefix.
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('wedding-media', 'wedding-media', false)
on conflict (id) do nothing;

create policy "members can read wedding media"
  on storage.objects for select
  using (
    bucket_id = 'wedding-media'
    and public.is_wedding_member(((storage.foldername(name))[1])::uuid)
  );

create policy "members can upload wedding media"
  on storage.objects for insert
  with check (
    bucket_id = 'wedding-media'
    and public.is_wedding_member(((storage.foldername(name))[1])::uuid)
  );

create policy "members can update wedding media"
  on storage.objects for update
  using (
    bucket_id = 'wedding-media'
    and public.is_wedding_member(((storage.foldername(name))[1])::uuid)
  );

create policy "members can delete wedding media"
  on storage.objects for delete
  using (
    bucket_id = 'wedding-media'
    and public.is_wedding_member(((storage.foldername(name))[1])::uuid)
  );
