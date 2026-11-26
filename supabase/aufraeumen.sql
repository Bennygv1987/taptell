-- TapTell: Datenbank nach den großen Bild-Speicherungen aufräumen (26.11.2026)
-- Hintergrund: Ein Funnel mit eingebetteten PNG-Fotos (6,8 MB) wurde viele Male gespeichert.
-- Übrig sind aufgeblähte Tabellen (funnels ~35 MB statt <1 MB, funnel_versions ~70 MB),
-- die der kleine Supabase-Server in den Arbeitsspeicher laden muss → langsam, Abbrüche (500/507/525).
--
-- So ausführen (Supabase → SQL Editor):
--   Schritt 1 als eine Abfrage ausführen.
--   Schritt 2: jede VACUUM-Zeile EINZELN ausführen (VACUUM läuft nicht zusammen mit anderen Befehlen).
--   Schritt 3 im Dashboard: Project Settings → General → „Restart project“ (1–2 Minuten nicht erreichbar).

-- ---------- Schritt 1: übergroße Backups entfernen ----------
-- Entfernt nur Backups, die größer als 2 MB sind – das sind die alten Stände mit den unkomprimierten Fotos.
-- Aktuelle Funnels, Live-Stände und alle normalen Backups bleiben unberührt.
-- Vorher anzeigen, was entfernt würde:
select v.id, f.name, v.kind, v.at, pg_size_pretty(pg_column_size(v.data)::bigint) as groesse
  from public.funnel_versions v left join public.funnels f on f.id = v.funnel_id
 where pg_column_size(v.data) > 2000000
 order by v.at desc;

-- Dann entfernen:
delete from public.funnel_versions where pg_column_size(data) > 2000000;

-- ---------- Schritt 2: Speicher zurückgeben (jede Zeile einzeln ausführen) ----------
vacuum full analyze public.funnels;
vacuum full analyze public.funnel_versions;
vacuum full analyze public.media_images;

-- ---------- Kontrolle: Tabellengrößen danach ----------
select relname as tabelle, pg_size_pretty(pg_total_relation_size(relid)) as groesse
  from pg_catalog.pg_statio_user_tables
 where schemaname = 'public'
 order by pg_total_relation_size(relid) desc
 limit 8;
