-- =========================================================
-- Funnel Studio – Supabase-Schema (Admin + Kundenlogins)
-- Im Supabase SQL-Editor komplett ausführen. Mehrfach ausführbar.
-- =========================================================

create extension if not exists pgcrypto;

-- ---------- Tabellen ----------
create table if not exists public.clients (
  id          text primary key,
  name        text not null,
  logo        text,
  contact     text,
  created_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'client' check (role in ('admin','client')),
  client_id   text references public.clients(id) on delete set null,
  name        text,
  email       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.funnels (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  status      text not null default 'draft' check (status in ('draft','live')),
  client_id   text references public.clients(id) on delete set null,
  shared      boolean not null default false,
  overview_color text,
  theme       jsonb not null default '{}'::jsonb,
  settings    jsonb not null default '{}'::jsonb,
  pages       jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists funnels_client_idx on public.funnels(client_id);

create table if not exists public.leads (
  id          text primary key,
  funnel_id   text references public.funnels(id) on delete set null,
  funnel_name text,
  name        text,
  email       text,
  phone       text,
  total       numeric default 0,
  status      text not null default 'neu',
  notes       text not null default '',
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists leads_funnel_idx on public.leads(funnel_id, created_at desc);

create table if not exists public.events (
  id          bigint generated always as identity primary key,
  funnel_id   text references public.funnels(id) on delete cascade,
  type        text not null check (type in ('view','start','page','complete')),
  page_id     text,
  created_at  timestamptz not null default now()
);
create index if not exists events_funnel_idx on public.events(funnel_id, created_at);

create table if not exists public.app_settings (
  id    int primary key default 1 check (id = 1),
  data  jsonb not null default '{}'::jsonb
);
insert into public.app_settings(id) values (1) on conflict do nothing;

-- ---------- Hilfsfunktionen ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.my_client() returns text
language sql stable security definer set search_path = public as $$
  select client_id from profiles where id = auth.uid();
$$;

create or replace function public.can_see_funnel(fid text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists(
    select 1 from funnels f
    where f.id = fid and f.shared and f.client_id is not null and f.client_id = public.my_client()
  );
$$;

-- ---------- Row Level Security ----------
alter table public.clients      enable row level security;
alter table public.profiles     enable row level security;
alter table public.funnels      enable row level security;
alter table public.leads        enable row level security;
alter table public.events       enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "admin all" on public.clients;
create policy "admin all" on public.clients for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "client reads own" on public.clients;
create policy "client reads own" on public.clients for select using (id = public.my_client());

drop policy if exists "admin all" on public.profiles;
create policy "admin all" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using (id = auth.uid());

drop policy if exists "admin all" on public.funnels;
create policy "admin all" on public.funnels for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "client reads shared" on public.funnels;
create policy "client reads shared" on public.funnels for select using (shared and client_id is not null and client_id = public.my_client());

drop policy if exists "admin all" on public.leads;
create policy "admin all" on public.leads for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "client reads leads" on public.leads;
create policy "client reads leads" on public.leads for select using (public.can_see_funnel(funnel_id));
drop policy if exists "client updates leads" on public.leads;
create policy "client updates leads" on public.leads for update using (public.can_see_funnel(funnel_id)) with check (public.can_see_funnel(funnel_id));

drop policy if exists "admin all" on public.events;
create policy "admin all" on public.events for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "client reads events" on public.events;
create policy "client reads events" on public.events for select using (public.can_see_funnel(funnel_id));

drop policy if exists "read settings" on public.app_settings;
create policy "read settings" on public.app_settings for select to authenticated using (true);
drop policy if exists "admin writes settings" on public.app_settings;
create policy "admin writes settings" on public.app_settings for all using (public.is_admin()) with check (public.is_admin());

-- Kunden dürfen bei Leads nur Status und Notizen ändern
create or replace function public.leads_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    if new.id <> old.id
       or new.funnel_id is distinct from old.funnel_id
       or new.funnel_name is distinct from old.funnel_name
       or new.name is distinct from old.name
       or new.email is distinct from old.email
       or new.phone is distinct from old.phone
       or new.total is distinct from old.total
       or new.data is distinct from old.data
       or new.created_at is distinct from old.created_at then
      raise exception 'Nur Status und Notizen dürfen geändert werden';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists leads_guard on public.leads;
create trigger leads_guard before update on public.leads for each row execute function public.leads_guard();

-- ---------- Öffentliche Funktionen für Live-Funnels ----------
create or replace function public.get_public_funnel(p_slug text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', f.id, 'name', f.name, 'theme', f.theme, 'settings', f.settings, 'pages', f.pages,
    'fonts', coalesce((
      select jsonb_agg(x) from jsonb_array_elements(coalesce((select data->'fonts'->'uploaded' from app_settings where id = 1), '[]'::jsonb)) x
      where x->>'name' in (f.theme->>'font', f.theme->>'headingFont')
         or f.pages::text like '%"ff": "' || (x->>'name') || '"%'
    ), '[]'::jsonb)
  )
  from funnels f where f.slug = p_slug and f.status = 'live';
$$;

create or replace function public.submit_lead(p_slug text, p_lead jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare
  f   funnels;
  lid text := replace(gen_random_uuid()::text, '-', '');
begin
  select * into f from funnels where slug = p_slug and status = 'live';
  if not found then raise exception 'Funnel nicht gefunden'; end if;
  if octet_length(p_lead::text) > 3000000 then raise exception 'Daten zu groß'; end if;
  insert into leads(id, funnel_id, funnel_name, name, email, phone, total, status, data)
  values (lid, f.id, f.name,
          left(p_lead->>'name', 200), left(p_lead->>'email', 200), left(p_lead->>'phone', 60),
          coalesce(nullif(p_lead->>'total', '')::numeric, 0), 'neu',
          p_lead - 'name' - 'email' - 'phone' - 'total');
  insert into events(funnel_id, type) values (f.id, 'complete');
  return lid;
end $$;

create or replace function public.track_event(p_slug text, p_type text, p_page text default null) returns void
language plpgsql security definer set search_path = public as $$
declare fid text;
begin
  if p_type not in ('view','start','page') then return; end if;
  select id into fid from funnels where slug = p_slug and status = 'live';
  if fid is null then return; end if;
  insert into events(funnel_id, type, page_id) values (fid, p_type, left(p_page, 64));
end $$;

-- Statistiken für das Dashboard (respektiert RLS: Kunden sehen nur ihre Funnels)
create or replace function public.funnel_stats()
returns table(funnel_id text, views bigint, starts bigint, completes bigint, pages jsonb, daily jsonb)
language sql stable security invoker set search_path = public as $$
  select f.id,
    (select count(*) from events e where e.funnel_id = f.id and e.type = 'view'),
    (select count(*) from events e where e.funnel_id = f.id and e.type = 'start'),
    (select count(*) from events e where e.funnel_id = f.id and e.type = 'complete'),
    coalesce((select jsonb_object_agg(page_id, c) from (
      select page_id, count(*) c from events e where e.funnel_id = f.id and e.type = 'page' and page_id is not null group by page_id) p), '{}'::jsonb),
    coalesce((select jsonb_object_agg(d, jsonb_build_object('v', v, 'l', l)) from (
      select to_char(created_at at time zone 'Europe/Berlin', 'YYYY-MM-DD') d,
             count(*) filter (where type = 'view') v, count(*) filter (where type = 'complete') l
      from events e where e.funnel_id = f.id and e.created_at > now() - interval '90 days' group by 1) x), '{}'::jsonb)
  from funnels f;
$$;

revoke all on function public.get_public_funnel(text) from public;
revoke all on function public.submit_lead(text, jsonb) from public;
revoke all on function public.track_event(text, text, text) from public;
grant execute on function public.get_public_funnel(text) to anon, authenticated;
grant execute on function public.submit_lead(text, jsonb) to anon, authenticated;
grant execute on function public.track_event(text, text, text) to anon, authenticated;
grant execute on function public.funnel_stats() to authenticated;

-- ---------- Ersten Admin festlegen ----------
-- 1) Authentication → Users → "Add user" (E-Mail + Passwort, "Auto Confirm" an)
-- 2) Dann diese Zeile mit deiner E-Mail ausführen:
-- insert into public.profiles (id, role, email, name)
--   select id, 'admin', email, 'Benjamin' from auth.users where email = 'deine@email.de'
--   on conflict (id) do update set role = 'admin';
