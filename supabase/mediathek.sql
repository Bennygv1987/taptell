-- Admin-Mediathek; jedes Bild bleibt separat in den verwendenden Funnels eingebettet.
create table if not exists public.media_images (
  id text primary key,
  name text not null,
  src text,
  added_at timestamptz not null default now()
);
alter table public.media_images enable row level security;
revoke all on public.media_images from public, anon, authenticated;
grant select, insert, update on public.media_images to authenticated;
drop policy if exists "admin media" on public.media_images;
create policy "admin media" on public.media_images to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Vorhandene Admin-Uploads aus Arbeitsständen, Veröffentlichungen und Kundenlogos.
-- Keine Einsendungen durchsuchen. Gelöschte Einträge behalten nur ihren Hash.
with sources(label, doc) as (
  select name, jsonb_build_array(theme,pages,published,versions) from public.funnels
  union all select name, to_jsonb(logo) from public.clients
  union all select 'Brand-Kit', data->'brand' from public.app_settings
), images as (
  select label, item #>> '{}' as src from sources
  cross join lateral jsonb_path_query(doc, 'strict $.** ? (@.type() == "string" && @ like_regex "^data:image/[^;,]+;base64," flag "i")') as item
)
insert into public.media_images(id,name,src,added_at)
select encode(sha256(convert_to(src,'UTF8')),'hex'),label,src,'epoch'::timestamptz from images
on conflict (id) do nothing;
