-- Abu Hassan Wedding — Supabase schema
-- Run in Supabase SQL Editor after creating project

-- Gallery images metadata
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text not null,
  caption text,
  sort_order int default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Naqoot (groom tipping) entries
create table if not exists public.naqoot_entries (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null check (char_length(donor_name) between 1 and 80),
  amount numeric(10, 2) not null check (amount > 0),
  message text check (message is null or char_length(message) <= 200),
  created_at timestamptz not null default now()
);

-- Leaderboard view (aggregated by donor name)
create or replace view public.naqoot_leaderboard as
select
  donor_name,
  sum(amount)::numeric(10, 2) as total_amount,
  count(*)::int as entries_count
from public.naqoot_entries
group by donor_name
order by total_amount desc;

-- Row Level Security
alter table public.gallery_images enable row level security;
alter table public.naqoot_entries enable row level security;

-- Public read published gallery
create policy "Public can read published gallery"
  on public.gallery_images for select
  using (is_published = true);

-- Authenticated admin can manage gallery
create policy "Admin can insert gallery"
  on public.gallery_images for insert
  to authenticated
  with check (true);

create policy "Admin can update gallery"
  on public.gallery_images for update
  to authenticated
  using (true);

create policy "Admin can delete gallery"
  on public.gallery_images for delete
  to authenticated
  using (true);

-- Anyone can submit naqoot (anon)
create policy "Public can insert naqoot"
  on public.naqoot_entries for insert
  to anon, authenticated
  with check (true);

-- Public read naqoot for leaderboard (via view inherits from base table select)
create policy "Public can read naqoot"
  on public.naqoot_entries for select
  to anon, authenticated
  using (true);

-- Storage bucket: create "gallery" bucket in Supabase Dashboard (public read)
-- Policies: public read, authenticated upload/delete
