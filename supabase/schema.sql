create extension if not exists pgcrypto;

create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists signups_email_unique_lower
  on public.signups (lower(email));

alter table public.signups enable row level security;

-- No public policies are needed. The application accesses this table only
-- through server-side routes using the Supabase service-role key.
