-- CryptoPulse Phase 2: historical price snapshots
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> Run).

create table if not exists price_snapshots (
  id bigint generated always as identity primary key,
  coin_id text not null,
  symbol text not null,
  price numeric not null,
  market_cap numeric,
  captured_at timestamptz not null default now()
);

create index if not exists price_snapshots_coin_id_captured_at_idx
  on price_snapshots (coin_id, captured_at desc);

-- Row Level Security: data is public read-only (crypto prices aren't sensitive),
-- writes only happen from the Edge Function using the service role key, which
-- bypasses RLS entirely -- so no INSERT policy is needed for anon/public roles.
alter table price_snapshots enable row level security;

create policy "Public read access"
  on price_snapshots for select
  to anon
  using (true);
