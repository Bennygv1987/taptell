-- Farbmarkierung der Funnelkarte in der Admin-Übersicht.
alter table public.funnels add column if not exists overview_color text;
