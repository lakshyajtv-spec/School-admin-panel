create table if not exists public.school_site_content (
  id text primary key default 'published',
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
create index if not exists school_site_content_updated_at_idx on public.school_site_content (updated_at desc);
alter table public.school_site_content enable row level security;
create policy "Public can read school content" on public.school_site_content for select to anon, authenticated using (id = 'published');
create policy "School admins can manage content" on public.school_site_content for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'school_admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'school_admin');
grant select on public.school_site_content to anon, authenticated;
grant insert, update, delete on public.school_site_content to authenticated;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('school-media','school-media',true,5242880,array['image/jpeg','image/png','image/webp','image/avif']) on conflict (id) do nothing;
create policy "Public may view school media" on storage.objects for select to anon, authenticated using (bucket_id = 'school-media');
create policy "School admins manage school media" on storage.objects for all to authenticated using (bucket_id = 'school-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'school_admin') with check (bucket_id = 'school-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'school_admin');
