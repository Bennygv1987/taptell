-- TapTell: detaillierte Auswertung (Klicks, Absprünge, Verweildauer, Geräte, Quellen)
-- Einmal im Supabase SQL-Editor ausführen. Bestehende Zählungen bleiben unverändert.
-- Ohne diese Datei funktioniert alles weiter wie bisher, nur ohne die neuen Auswertungen.
-- Wird schema.sql später noch einmal ausgeführt, danach auch diese Datei erneut ausführen.

-- 1) Ereignisse: Besuchs-ID (nur pro Seitenaufruf, kein Cookie) und Zusatzinfo
alter table public.events add column if not exists sid text;
alter table public.events add column if not exists meta text;
alter table public.events drop constraint if exists events_type_check;
alter table public.events add constraint events_type_check
  check (type in ('view','start','page','complete','click','lead'));
create index if not exists events_sid_idx on public.events (funnel_id, sid, created_at) where sid is not null;

-- 2) Zählen: neue Signatur mit Standardwerten, alte Aufrufe mit 3 Parametern funktionieren weiter
drop function if exists public.track_event(text, text, text);
create or replace function public.track_event(p_slug text, p_type text, p_page text default null, p_meta text default null, p_sid text default null)
returns void language plpgsql security definer set search_path = public as $$
declare fid text;
begin
  if p_type not in ('view','start','page','click','lead') then return; end if;
  select id into fid from funnels where slug = p_slug and status = 'live';
  if fid is null then return; end if;
  insert into events(funnel_id, type, page_id, meta, sid)
  values (fid, p_type, left(p_page, 64), left(p_meta, 400), left(p_sid, 24));
end $$;
revoke all on function public.track_event(text, text, text, text, text) from public;
grant execute on function public.track_event(text, text, text, text, text) to anon, authenticated;

-- 3) Auswertung pro Funnel (respektiert RLS: Kunden sehen nur ihre eigenen Funnels)
create or replace function public.funnel_insights(p_funnel text, p_days int default 90)
returns jsonb language sql stable security invoker set search_path = public as $$
with ev as (
  select type, page_id, meta, sid, created_at from events
  where funnel_id = p_funnel and created_at > now() - make_interval(days => greatest(1, least(coalesce(p_days, 90), 365)))
), pg as (
  select sid, page_id, created_at,
         lead(created_at) over (partition by sid order by created_at) as nxt,
         row_number() over (partition by sid order by created_at desc) as rn
  from ev where type = 'page' and sid is not null
), done as (
  select distinct sid from ev where type = 'lead' and sid is not null
)
select jsonb_build_object(
  'sessions', (select count(distinct sid) from ev where sid is not null),
  'reach',  coalesce((select jsonb_object_agg(page_id, c) from (select page_id, count(distinct sid) c from pg group by page_id) x), '{}'::jsonb),
  'exits',  coalesce((select jsonb_object_agg(page_id, c) from (select page_id, count(*) c from pg where rn = 1 and sid not in (select sid from done) group by page_id) x), '{}'::jsonb),
  'secs',   coalesce((select jsonb_object_agg(page_id, s) from (select page_id, round(avg(extract(epoch from (nxt - created_at))))::int s from pg where nxt is not null and nxt - created_at < interval '10 minutes' group by page_id) x), '{}'::jsonb),
  'clicks', coalesce((select jsonb_agg(jsonb_build_object('page', page_id, 'meta', meta, 'n', n) order by n desc) from (select page_id, meta, count(*) n from ev where type = 'click' group by page_id, meta order by count(*) desc limit 50) x), '[]'::jsonb),
  'devices', coalesce((select jsonb_object_agg(d, c) from (select split_part(meta, '|', 1) d, count(*) c from ev where type = 'view' and meta like '%|%' group by 1) x), '{}'::jsonb),
  'sources', coalesce((select jsonb_object_agg(s, c) from (select coalesce(nullif(split_part(meta, '|', 2), ''), 'direkt') s, count(*) c from ev where type = 'view' and meta like '%|%' group by 1 order by count(*) desc limit 12) x), '{}'::jsonb),
  'hours',  coalesce((select jsonb_object_agg(h, c) from (select extract(hour from created_at at time zone 'Europe/Berlin')::int h, count(*) c from ev where type = 'view' group by 1) x), '{}'::jsonb)
);
$$;
revoke all on function public.funnel_insights(text, int) from public;
grant execute on function public.funnel_insights(text, int) to authenticated;
