create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 100),
  email text not null check (length(email) between 3 and 254 and email = lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  message text not null check (length(btrim(message)) between 10 and 3000),
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
alter table public.contact_messages enable row level security;
grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;
drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages" on public.contact_messages for insert to anon, authenticated with check (true);
drop policy if exists "Only school admins can read contact messages" on public.contact_messages;
create policy "Only school admins can read contact messages" on public.contact_messages for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'school_admin');

create or replace function public.limit_contact_message_rate()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(pg_catalog.lower(new.email), 0));
  if (select count(*) from public.contact_messages where email = pg_catalog.lower(new.email) and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Contact submission limit reached. Try again later.' using errcode = 'P0001';
  end if;
  new.email := pg_catalog.lower(new.email);
  return new;
end;
$$;
revoke all on function public.limit_contact_message_rate() from public, anon, authenticated;
drop trigger if exists contact_message_rate_limit on public.contact_messages;
create trigger contact_message_rate_limit before insert on public.contact_messages for each row execute function public.limit_contact_message_rate();
