-- ============================================================
-- GOVT. BOYS H. S. SCHOOL CANTT, GUNA — Supabase Schema (v2)
-- Run once: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ---------- 1) site_sections ----------
-- Normalized content: one row per language (en/hi/global) per top-level
-- section (hero, about, principal, vocational, ...). No single JSON blob.
create table if not exists public.site_sections (
  lang       text not null check (lang in ('en', 'hi', 'global')),
  key        text not null,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (lang, key)
);
create index if not exists site_sections_lang_idx on public.site_sections (lang);

-- ---------- 2) site_settings ----------
-- Single row 'main' = branding/contact/socials; 'publishedAt' = last publish.
create table if not exists public.site_settings (
  key        text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- 3) teachers ----------
create table if not exists public.teachers (
  id            text primary key,
  name          text not null default '',
  subject       text not null default '',
  qualification text not null default '',
  experience    text not null default '',
  designation   text not null default '',
  photo_url     text not null default '',
  sort_order    integer not null default 0 check (sort_order >= 0),
  created_at    timestamptz not null default now()
);
create index if not exists teachers_sort_idx on public.teachers (sort_order);

-- ---------- 4) notices ----------
create table if not exists public.notices (
  id           text primary key,
  tag          text not null default '',
  date         text not null default '',
  title        text not null default '',
  body         text not null default '',
  pinned       boolean not null default false,
  important    boolean not null default false,
  status       text not null default 'published' check (status in ('draft', 'published')),
  publish_date text not null default '',
  expiry_date  text not null default '',
  created_at   timestamptz not null default now()
);
create index if not exists notices_status_idx on public.notices (status);
create index if not exists notices_pinned_idx on public.notices (pinned desc);
create index if not exists notices_dates_idx on public.notices (publish_date, expiry_date);

-- ---------- 5) gallery ----------
create table if not exists public.gallery (
  id         text primary key,
  src        text not null default '',
  title      text not null default '',
  caption    text not null default '',
  category   text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);
create index if not exists gallery_sort_idx on public.gallery (sort_order);
create index if not exists gallery_category_idx on public.gallery (category);

-- ============================================================
-- ROW LEVEL SECURITY
-- Reads are public (the website renders for everyone).
-- Writes are open to anon for zero-setup local development.
-- PRODUCTION HARDENING (recommended):
--   * Enable Supabase Auth, then replace the write policies below with:
--     using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated')
-- ============================================================
alter table public.site_sections enable row level security;
alter table public.site_settings  enable row level security;
alter table public.teachers       enable row level security;
alter table public.notices        enable row level security;
alter table public.gallery        enable row level security;

create policy "public read site_sections" on public.site_sections for select using (true);
create policy "public write site_sections" on public.site_sections for all using (true) with check (true);

create policy "public read site_settings" on public.site_settings for select using (true);
create policy "public write site_settings" on public.site_settings for all using (true) with check (true);

create policy "public read teachers" on public.teachers for select using (true);
create policy "public write teachers" on public.teachers for all using (true) with check (true);

create policy "public read notices" on public.notices for select using (true);
create policy "public write notices" on public.notices for all using (true) with check (true);

create policy "public read gallery" on public.gallery for select using (true);
create policy "public write gallery" on public.gallery for all using (true) with check (true);

-- ============================================================
-- STORAGE — public 'school-images' bucket + policies
-- ============================================================
insert into storage.buckets (id, name, public)
values ('school-images', 'school-images', true)
on conflict (id) do nothing;

create policy "public read school-images" on storage.objects
  for select using (bucket_id = 'school-images');
create policy "public insert school-images" on storage.objects
  for insert with check (bucket_id = 'school-images');
create policy "public update school-images" on storage.objects
  for update using (bucket_id = 'school-images');
create policy "public delete school-images" on storage.objects
  for delete using (bucket_id = 'school-images');

-- ============================================================
-- SEED DATA
-- ============================================================
insert into public.site_settings (key, data) values
  ('main', '{"logo":"","favicon":"","themeColor":"#0F4C81","principalPhoto":"","address":"Cantt Area, Guna, Madhya Pradesh – 473001","phone":"+91 XXXXX XXXXX","email":"office@gbhss-guna.example","socialLinks":[{"label":"Website","url":""},{"label":"YouTube","url":""},{"label":"Instagram","url":""}]}'::jsonb),
  ('publishedAt', 'null'::jsonb)
on conflict (key) do nothing;

insert into public.notices (id, tag, date, title, body, pinned, important, status) values
  ('seed-notice-1', 'Latest Notice', 'Current Session', 'Parent–Teacher Meeting', 'Parents are requested to visit the school as per the notified date to discuss student progress.', false, false, 'published'),
  ('seed-notice-2', 'Exam Schedule', 'Current Session', 'Half-Yearly & Board Exam Timetable', 'Examination timetables are displayed on the school notice board and shared with class teachers.', false, false, 'published'),
  ('seed-notice-3', 'Holiday List', 'Current Session', 'Government Holiday Calendar', 'The school follows the holiday calendar issued by the Madhya Pradesh School Education Department.', false, false, 'published'),
  ('seed-notice-4', 'Vocational', 'Current Session', 'Vocational Trade Selection for Class 9', 'Students entering Class 9 may choose between IT/ITES and Electronics & Hardware as their vocational trade.', true, true, 'published')
on conflict (id) do nothing;
