-- TapTell: Entwurf / Live-Stand und Versionen (Backups) pro Funnel
-- Einmal im Supabase SQL-Editor ausführen. Danach gilt:
--   • Autospeichern sichert nur den Entwurf (Spalten theme, settings, pages).
--   • Online geht nur der Live-Stand (Spalte published), der mit „Veröffentlichen“ gesetzt wird.
--   • Spalte versions hält wenige Backups (letzte 4 Veröffentlichungen + 8 automatische Stände).
-- Bestehende Live-Funnels bleiben unverändert online: ihr jetziger Stand wird als Live-Stand übernommen.

alter table public.funnels add column if not exists published jsonb;
alter table public.funnels add column if not exists versions  jsonb not null default '[]'::jsonb;

update public.funnels
   set published = jsonb_build_object('at', (extract(epoch from now()) * 1000)::bigint, 'name', name, 'theme', theme, 'settings', settings, 'pages', pages)
 where status = 'live' and published is null;

-- Öffentlicher Abruf: Live-Stand, falls vorhanden (sonst wie bisher die Arbeitsfassung).
-- Ersetzt die Fassung aus automation.sql (gleiches Verhalten, plus Live-Stand). Benachrichtigungen lesen weiter die Arbeitsfassung.
create or replace function public.get_public_funnel(p_slug text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', f.id, 'name', f.name,
    'theme',    coalesce(f.published->'theme', f.theme),
    'settings', coalesce(f.published->'settings', f.settings) - 'automation', -- Empfänger, Regeln, Geheimnisse nie an Besucher
    'pages',    coalesce(f.published->'pages', f.pages),
    'fonts', coalesce((
      select jsonb_agg(x) from jsonb_array_elements(coalesce((select data->'fonts'->'uploaded' from app_settings where id = 1), '[]'::jsonb)) x
      where x->>'name' in (coalesce(f.published->'theme', f.theme)->>'font', coalesce(f.published->'theme', f.theme)->>'headingFont')
         or coalesce(f.published->'pages', f.pages)::text like '%"ff": "' || (x->>'name') || '"%'
    ), '[]'::jsonb)
  )
  from funnels f where f.slug = p_slug and f.status = 'live';
$$;

revoke all on function public.get_public_funnel(text) from public;
grant execute on function public.get_public_funnel(text) to anon, authenticated;
