alter table public.encrypted_intakes enable row level security;
alter table public.organizer_public_keys enable row level security;
alter table public.content_reviews enable row level security;

create policy "anon_insert_encrypted_intakes"
on public.encrypted_intakes
for insert
to anon
with check (true);

create policy "authenticated_insert_encrypted_intakes"
on public.encrypted_intakes
for insert
to authenticated
with check (true);

create policy "authenticated_select_organizer_public_keys"
on public.organizer_public_keys
for select
to authenticated
using (true);

create policy "authenticated_select_content_reviews"
on public.content_reviews
for select
to authenticated
using (true);

