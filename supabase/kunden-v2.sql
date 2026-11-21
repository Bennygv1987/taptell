-- =========================================================
-- TapTell – Kunden-Stammdaten v2
-- Ansprechpartner, Telefon, Website, Anschrift, Branche, Paket, Preis, Vertragsbeginn, Notizen
-- liegen als JSON in clients.data. Voraussetzung: schema.sql wurde ausgeführt.
-- Im Supabase SQL-Editor ausführen. Mehrfach ausführbar.
-- =========================================================
alter table public.clients add column if not exists data jsonb not null default '{}'::jsonb;

-- Lesen dürfen Kunden ihre eigenen Stammdaten bereits über die Policy „client reads own“ aus schema.sql.
