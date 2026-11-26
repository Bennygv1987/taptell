-- TapTell: Backups (Versionen) in eigener Tabelle statt in funnels.versions
-- Grund: Bisher wurde bei jeder Speicherung die komplette Liste (bis zu 12 Funnel-Kopien) in eine Zelle geschrieben
-- → „canceling statement due to statement timeout“. Jetzt wird jedes Backup einmal einzeln eingefügt.
-- Einmal im Supabase SQL-Editor ausführen (nach versionen.sql).

create table if not exists public.funnel_versions (
  id         text primary key,
  funnel_id  text not null references public.funnels(id) on delete cascade,
  at         timestamptz not null default now(),
  kind       text not null default 'auto' check (kind in ('auto','publish')),
  label      text,
  data       jsonb not null
);
create index if not exists funnel_versions_funnel_at on public.funnel_versions (funnel_id, at desc);

alter table public.funnel_versions enable row level security;
drop policy if exists "admin all" on public.funnel_versions;
create policy "admin all" on public.funnel_versions for all using (public.is_admin()) with check (public.is_admin());

-- Bisherige Backups übernehmen und die alte Spalte leeren (macht das Laden des Dashboards wieder leicht)
insert into public.funnel_versions (id, funnel_id, at, kind, label, data)
select v->>'id', f.id,
       to_timestamp(coalesce((v->>'at')::bigint, (extract(epoch from now()) * 1000)::bigint) / 1000.0),
       case when v->>'kind' = 'publish' then 'publish' else 'auto' end,
       v->>'label',
       jsonb_build_object('name', v->'name', 'theme', v->'theme', 'settings', v->'settings', 'pages', v->'pages')
  from public.funnels f, jsonb_array_elements(coalesce(f.versions, '[]'::jsonb)) v
 where v ? 'id'
on conflict (id) do nothing;

update public.funnels set versions = '[]'::jsonb where versions is distinct from '[]'::jsonb;
