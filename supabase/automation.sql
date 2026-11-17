-- =========================================================
-- TapTell – Automationen: E-Mails nach Lead-Eingang, Empfängerlisten,
-- Regeln, Webhooks mit Protokoll, eigene Domains.
-- Voraussetzung: supabase/schema.sql wurde bereits ausgeführt.
-- Im Supabase SQL-Editor komplett ausführen. Mehrfach ausführbar.
--
-- Konfiguration pro Funnel liegt in funnels.settings->'automation'
-- (wird unten aus der öffentlichen Auslieferung herausgefiltert).
-- =========================================================

create extension if not exists pg_net;

-- ---------- Empfängerlisten (nur Admin) ----------
create table if not exists public.recipient_lists (
  id          text primary key,
  client_id   text references public.clients(id) on delete cascade,
  name        text not null,
  emails      text[] not null default '{}',
  created_at  timestamptz not null default now()
);
alter table public.recipient_lists enable row level security;
drop policy if exists "admin all" on public.recipient_lists;
create policy "admin all" on public.recipient_lists for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Zustell-Protokoll für E-Mails & Webhooks ----------
create table if not exists public.deliveries (
  id           bigint generated always as identity primary key,
  lead_id      text references public.leads(id) on delete cascade,
  funnel_id    text references public.funnels(id) on delete cascade,
  kind         text not null check (kind in ('email','webhook')),
  target       text not null,
  status       text not null check (status in ('ok','failed','skipped','test')),
  http_status  int,
  error        text,
  attempts     int not null default 1,
  created_at   timestamptz not null default now()
);
create index if not exists deliveries_funnel_idx on public.deliveries(funnel_id, created_at desc);
alter table public.deliveries enable row level security;
drop policy if exists "admin all" on public.deliveries;
create policy "admin all" on public.deliveries for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Eigene Domains ----------
create table if not exists public.domains (
  id           text primary key,
  hostname     text not null unique check (hostname ~ '^[a-z0-9.-]+\.[a-z]{2,}$'),
  funnel_id    text references public.funnels(id) on delete cascade,
  client_id    text references public.clients(id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending','active','error')),
  detail       jsonb not null default '{}'::jsonb,
  checked_at   timestamptz,
  created_at   timestamptz not null default now()
);
alter table public.domains enable row level security;
drop policy if exists "admin all" on public.domains;
create policy "admin all" on public.domains for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "client reads own domains" on public.domains;
create policy "client reads own domains" on public.domains for select using (client_id is not null and client_id = public.my_client());

-- Öffentlich: Domain → Funnel-Slug (nur aktive Domains & Live-Funnels)
create or replace function public.resolve_domain(p_host text) returns text
language sql stable security definer set search_path = public as $$
  select f.slug from domains d join funnels f on f.id = d.funnel_id
  where d.hostname = lower(p_host) and d.status = 'active' and f.status = 'live';
$$;
revoke all on function public.resolve_domain(text) from public;
grant execute on function public.resolve_domain(text) to anon, authenticated;

-- ---------- Öffentliche Auslieferung ohne interne Einstellungen ----------
-- Empfänger, Regeln und Webhook-Geheimnisse dürfen nie an Besucher gehen.
create or replace function public.get_public_funnel(p_slug text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', f.id, 'name', f.name, 'theme', f.theme, 'settings', f.settings - 'automation', 'pages', f.pages,
    'fonts', coalesce((
      select jsonb_agg(x) from jsonb_array_elements(coalesce((select data->'fonts'->'uploaded' from app_settings where id = 1), '[]'::jsonb)) x
      where x->>'name' in (f.theme->>'font', f.theme->>'headingFont')
         or f.pages::text like '%"ff": "' || (x->>'name') || '"%'
    ), '[]'::jsonb)
  )
  from funnels f where f.slug = p_slug and f.status = 'live';
$$;

-- ---------- Neuer Lead → Edge Function „lead-notify“ ----------
-- Das gemeinsame Geheimnis liegt im Supabase Vault (Name: lead_notify_secret)
-- und als Edge-Function-Secret LEAD_NOTIFY_SECRET. Beides einmalig setzen:
--   select vault.create_secret('<zufälliger Wert>', 'lead_notify_secret');
--   supabase secrets set LEAD_NOTIFY_SECRET=<derselbe Wert>
create or replace function public.notify_new_lead() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  secret text;
  base   text := 'https://jxmxbqbustezeyqnxeei.supabase.co';
begin
  select decrypted_secret into secret from vault.decrypted_secrets where name = 'lead_notify_secret' limit 1;
  if secret is null then return new; end if; -- noch nicht eingerichtet: still überspringen
  perform net.http_post(
    url     := base || '/functions/v1/lead-notify',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-taptell-secret', secret),
    body    := jsonb_build_object('lead_id', new.id)
  );
  return new;
end $$;
drop trigger if exists leads_notify on public.leads;
create trigger leads_notify after insert on public.leads for each row execute function public.notify_new_lead();
