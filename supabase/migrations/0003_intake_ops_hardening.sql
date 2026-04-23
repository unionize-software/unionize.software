alter table public.encrypted_intakes
add column if not exists expires_at timestamptz not null default (now() + interval '30 days');

alter table public.organizer_public_keys
add column if not exists fingerprint text null;

alter table public.organizer_public_keys
add column if not exists revoked_at timestamptz null;

create index if not exists encrypted_intakes_expires_at_idx
on public.encrypted_intakes (expires_at);

create index if not exists encrypted_intakes_deleted_at_idx
on public.encrypted_intakes (deleted_at);

