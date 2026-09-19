-- ============================================================================
-- Partner first names — used to replace the generic "Partenaire 1/2" labels
-- (guest side, task assignment) with the couple's actual names everywhere.
-- ============================================================================

alter table public.weddings
  add column if not exists partner1_name text,
  add column if not exists partner2_name text;
