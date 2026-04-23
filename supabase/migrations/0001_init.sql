create extension if not exists "pgcrypto";

create table if not exists public.encrypted_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ciphertext text not null,
  public_key_id text not null,
  urgency text not null check (urgency in ('low', 'medium', 'high', 'retaliation-risk')),
  coarse_region text null,
  work_type text null,
  status text not null default 'new',
  deleted_at timestamptz null
);

create table if not exists public.organizer_public_keys (
  id text primary key,
  label text not null,
  public_key text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  rotated_at timestamptz null
);

create table if not exists public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  jurisdiction text not null,
  last_reviewed date null,
  reviewer text null,
  review_status text not null,
  notes text null
);

