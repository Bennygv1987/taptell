# TapTell – Go-Live-Checkliste

Stand: 21.11.2026 · Repo-Stand `c7e6e7b`

Ziel: TapTell produktiv schalten und den **Feedback-Funnel Holz Gehlen** ohne Unterbrechung von Onepage nach TapTell umziehen.
Legende: 👤 = machst du selbst (Accounts, Zahlungen, Secrets, DNS) · 🤖 = kann ich nach deiner Freigabe übernehmen.

---

## 0. Architektur in einem Satz

TapTell ist eine **statische Web-App** (Dashboard `index.html`, Funnel-Laufzeit `f.html`, `embed.js`, `config.js`, Landingpage `landing/`) plus **Supabase** (Datenbank, Logins, Edge Functions). Ein eigener Server wie **Render ist nicht nötig**: Es gibt keinen Node-/Python-Server. Alles Dynamische läuft über Supabase (RPCs, Row Level Security, Edge Functions). Ein zusätzlicher Server wäre nur Kosten und Wartung ohne Nutzen.

---

## 1. Hosting (Vercel empfohlen)

`vercel.json` ist vorbereitet: kurze Links `/:slug` und `/f/:slug` → `f.html`, CORS für `embed.js` und `config.js`. Netlify (`_redirects`) und Cloudflare Pages gingen auch, aber nur für Vercel ist alles fertig, auch die automatische Domain-Anlage in `domain-manage`.

| # | Schritt | Wer |
|---|---|---|
| 1.1 | Vercel-Account, Projekt aus dem GitHub-Repo `Bennygv1987/taptell` importieren (Framework: „Other“, kein Build-Befehl, Ausgabe = Repo-Wurzel) | 👤 |
| 1.2 | **Domain-Aufteilung festlegen:** `taptell.de` = Landingpage + kurze Funnel-Links (`taptell.de/gehlen`), `app.taptell.de` = Dashboard | 👤 entscheidet |
| 1.3 | `vercel.json` ergänzen: Auf `taptell.de` muss `/` die Landingpage zeigen (heute liefert `/` das Dashboard). Lösung: Rewrite mit `has: host = taptell.de` von `/` auf `/landing/index.html`. Die relativen Pfade `../src/…` der Landingpage funktionieren dort weiter | 🤖 |
| 1.4 | Reservierte Pfade prüfen: Der Slug-Rewrite schließt `index, f, src, assets, landing, design, supabase` aus. **Kein Funnel darf so heißen**, außerdem nicht `app`, `api`, `login` (beim Anlegen sperren) | 🤖 |
| 1.5 | `config.js` für Produktion füllen: `supabaseUrl: 'https://jxmxbqbustezeyqnxeei.supabase.co'`, `supabaseAnonKey` (öffentlicher anon/publishable key), `publicUrl: 'https://taptell.de'`. Den anon-Key darfst du mir geben, er ist öffentlich. **Nie den service_role-Key** | 👤 Key · 🤖 eintragen |
| 1.6 | Nicht öffentlich nötig: `design/`, `.claude/skills/`, `supabase/*.sql` werden mit ausgeliefert. Kein Geheimnis darin, aber sauberer ist ein Ausschluss per `.vercelignore` | 🤖 |
| 1.7 | supabase-js wird in `f.html` als `@supabase/supabase-js@2` (wandernde Version) vom CDN geladen → auf eine feste Version pinnen, damit ein Update keinen Live-Funnel bricht | 🤖 |

> ⚠️ **taptell.de zeigt heute auf Onepage.** Dort laufen Funnels mit gedruckten QR-Codes (bekannt: `/gehlen`, `/koelner-zoo`, `/gehlen-konfigurator-2`). Die DNS von taptell.de erst umstellen, wenn **jeder** Onepage-Slug in TapTell mit **identischem Slug** live ist (siehe Abschnitt 4). Bis dahin testet TapTell unter der Vercel-Adresse oder `app.taptell.de`.

---

## 2. Supabase (Projekt `jxmxbqbustezeyqnxeei`, eu-west-1)

Die SQL-Dateien liegen bewusst **außerhalb** von `supabase/migrations/`, damit die GitHub-Integration nichts automatisch einspielt.

### 2.1 Datenbank (SQL-Editor, genau in dieser Reihenfolge, alle mehrfach ausführbar)
| # | Datei | Inhalt | Wer |
|---|---|---|---|
| 1 | `supabase/schema.sql` | Tabellen clients, profiles, funnels, leads, events, app_settings · RLS · `get_public_funnel`, `submit_lead`, `track_event`, `funnel_stats` | 👤 ausführen (oder 🤖 nach Freigabe per CLI) |
| 2 | `supabase/automation.sql` | Empfängerlisten, Zustell-Protokoll, Domains, `resolve_domain`, **sichere** `get_public_funnel` (ohne Automations-Daten), Trigger „neuer Lead → lead-notify“ | 👤 / 🤖 |
| 3 | `supabase/kunden-v2.sql` | Spalte `clients.data` (Stammdaten, Paket, Preis) | 👤 / 🤖 |

`automation.sql` muss **nach** `schema.sql` laufen, weil sie `get_public_funnel` absichert. Sonst wären Empfänger und Webhook-Daten öffentlich lesbar.

### 2.2 Login
| # | Schritt | Wer |
|---|---|---|
| 2.2.1 | Authentication → Users: deinen Admin-Nutzer anlegen | 👤 |
| 2.2.2 | In `profiles` für diesen Nutzer `role = 'admin'` setzen | 👤 (SQL: `update profiles set role='admin' where id='<deine User-ID>';`) |
| 2.2.3 | Authentication → URL Configuration: Site URL `https://app.taptell.de`, Redirect-URLs inkl. Vercel-Vorschau | 👤 |
| 2.2.4 | E-Mail-Vorlagen (Einladung, Passwort) auf Deutsch anpassen, Absender über SMTP (Resend) statt Supabase-Standard (der ist stark limitiert) | 👤 |

### 2.3 Edge Functions (Supabase CLI: `supabase login`, `supabase link --project-ref jxmxbqbustezeyqnxeei`)
| Function | Deploy | Zweck |
|---|---|---|
| `lead-notify` | `supabase functions deploy lead-notify --no-verify-jwt` | E-Mails bei neuem Lead, Bestätigung, Regeln, **Webhooks (inkl. Onepage-Format, server-seitig)** |
| `invite-user` | `supabase functions deploy invite-user` | Kunden-Logins einladen/löschen |
| `domain-manage` | `supabase functions deploy domain-manage` | Kundendomains anlegen/prüfen |

Deploy erst nach deiner Freigabe 🤖. `supabase login` führst du selbst im Terminal aus 👤.

### 2.4 Secrets (👤 selbst setzen, nie in den Chat)
| Secret | Wo | Wert |
|---|---|---|
| `RESEND_API_KEY` | Edge Function Secrets | aus Resend |
| `MAIL_FROM` | Edge Function Secrets | z. B. `TapTell <anfragen@taptell.de>` |
| `LEAD_NOTIFY_SECRET` | Edge Function Secrets | zufälliger langer Wert |
| `lead_notify_secret` | **Vault** (`select vault.create_secret('<derselbe Wert>', 'lead_notify_secret');`) | **identisch** zu `LEAD_NOTIFY_SECRET` |
| `APP_URL` | Edge Function Secrets | `https://app.taptell.de` (Bilder in Mails, Link „Im Dashboard öffnen“) |
| `DOMAIN_TARGET` | Edge Function Secrets | `cname.vercel-dns.com` |
| `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID` | optional | automatische Kundendomains inkl. SSL |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` stellt Supabase den Functions automatisch bereit. Die musst du nicht setzen.

### 2.5 Bilder/Storage
Für den Start reicht `assets/` im Repo (Vercel-CDN). Im Editor hochgeladene Bilder werden als Data-URL im Funnel gespeichert. Das funktioniert, macht große Funnels aber schwer. **Später:** Supabase Storage-Bucket `funnel-assets` (öffentlich lesbar) und den Upload darauf umstellen 🤖.

---

## 3. E-Mail (Resend)

| # | Schritt | Wer |
|---|---|---|
| 3.1 | Resend-Account, Domain `taptell.de` hinzufügen, DNS-Einträge (SPF, DKIM, optional DMARC) beim Domain-Anbieter setzen | 👤 |
| 3.2 | API-Key erzeugen → als `RESEND_API_KEY` in Supabase eintragen | 👤 |
| 3.3 | Dieselbe Resend-Domain als SMTP für Supabase Auth (Einladungs-/Passwort-Mails) | 👤 |
| 3.4 | Testmail aus dem Dashboard (Automationen → „Testmail an mich“) | 🤖 nach Freigabe |

Alternativen: Brevo, Postmark oder Mailjet gehen auch. Dann muss nur `sendMail()` in `lead-notify` angepasst werden 🤖. Resend ist am einfachsten und hat einen EU-Datenstandort.

---

## 4. Umzug Gehlen-Feedback (Onepage → TapTell)

Vorbereitet: Vorlage **„Feedback-Funnel Holz Gehlen“** (`gehlen-feedback`). Logik, Texte, Bilder und Feldnamen sind identisch zu den Onepage-Slugs, Webhook-Format „Onepage-kompatibel“ ist voreingestellt, Seitenreihenfolge und Antwort-IDs wie bei Onepage (gleiche `Step N.`-Schlüssel).

### 4.1 Vorbereiten (ohne Kundenwirkung)
| # | Schritt | Wer |
|---|---|---|
| 4.1.1 | Kunde „Holz Gehlen“ im Dashboard anlegen (Stammdaten, Logo, ggf. Login) | 🤖 / 👤 |
| 4.1.2 | Funnel aus der Vorlage anlegen, **Slug exakt `gehlen`**, Kunde zuordnen | 🤖 |
| 4.1.3 | Inhalte prüfen: Google-Bewertungslink (`placeid=ChIJ5ZAgh3VMv0cR9rNQ9QeRkV0`), Texte, Bilder | 👤 kurz ansehen |
| 4.1.4 | Cookie-Banner nur einschalten, wenn Meta-Pixel o. Ä. genutzt wird. Ohne Tracking braucht der Funnel kein Banner (keine Cookies) | 👤 entscheidet |
| 4.1.5 | **Webhook server-seitig einrichten:** Automationen → Webhooks → `https://taptell.info/api/public/webhooks/onepage?customer_id=gehlen`. Den Browser-Webhook (Funnel → Integrationen) **leer lassen** | 🤖 |

**Warum server-seitig:** Der Browser-Webhook schickt `text/plain`, damit keine CORS-Prüfung nötig ist. Ob dein Empfänger auf taptell.info das annimmt, ist ungetestet, und Werbeblocker können Browser-Anfragen verhindern. `lead-notify` schickt dieselbe Onepage-Struktur als `application/json` vom Server, mit Wiederholung und Protokoll, genau wie Onepage.

### 4.2 Testen (Parallelbetrieb, Onepage bleibt live)
| # | Schritt | Wer |
|---|---|---|
| 4.2.1 | Funnel live schalten und unter der Vorschau-/App-Adresse aufrufen (taptell.de zeigt noch auf Onepage) | 🤖 |
| 4.2.2 | **Test-Lead absenden**, alle drei Wege (positiv → Google, negativ ohne Kontakt, negativ mit Kontakt), nur mit Testdaten | 🤖 nach Freigabe |
| 4.2.3 | Im Dashboard taptell.info prüfen, ob alle Felder ankommen | 👤 / 🤖 |
| 4.2.4 | **Feldzuordnung in taptell.info korrigieren**, gilt auch für Onepage-Leads: `Step 7. Was hat gut gefallen -> lob_kommentar` → **Step 6**. Nicht existierende Pfade ersetzen: `Grundstimmung` → `data.fieldsMap.Step 1. Grundstimmung -> Grundstimmung`, `answers.problemgrund` → `Problemgrund`, `Kommentar Zum Grund` → `data.fieldsMap.Step 2. Problem -> Kommentar zum Grund`, `Kontakt gewünscht.Kontaktwunsch` → `Kontaktwunsch`, `Email Adresse` → `data.fieldsMap.Step 5. Kontakt ja -> email-adresse`, `answers.lob` → `Lob` | 👤 |
| 4.2.5 | Folgefragen für Holz Gehlen in taptell.info auf die echten Gründe setzen: Beratung nicht hilfreich · Zu lange gewartet · Produkt nicht gefunden · Preise unklar/zu hoch · Auswahl nicht passend · Sonstiges | 👤 |
| 4.2.6 | Test-Leads in taptell.info und TapTell löschen | 👤 |

### 4.3 Umschalten
| # | Schritt | Wer |
|---|---|---|
| 4.3.1 | **Inventur aller Onepage-Slugs mit QR-Codes/Links** (mindestens `gehlen`, `koelner-zoo`, `gehlen-konfigurator-2`). Jeder Slug braucht vor dem DNS-Wechsel ein TapTell-Gegenstück, sonst landen gedruckte QR-Codes im Leeren | 👤 + 🤖 |
| 4.3.2 | Alternative ohne Komplettumzug: Nur einzelne Pfade umleiten geht bei Onepage nicht, deshalb **DNS-Wechsel von taptell.de erst, wenn alle Slugs bereit sind**. Bis dahin kann der Gehlen-Funnel z. B. unter `app.taptell.de/gehlen` laufen. Eine neue QR-Druckseite ist laut dir unproblematisch | 👤 entscheidet |
| 4.3.3 | DNS von taptell.de auf Vercel (A/CNAME laut Vercel), in Vercel die Domain hinzufügen, SSL abwarten | 👤 |
| 4.3.4 | Sofort danach: `taptell.de/gehlen` mit dem Handy öffnen, einen Test-Lead senden und in taptell.info prüfen | 🤖 / 👤 |
| 4.3.5 | Onepage-Webhook der Liste „Gehlen“ deaktivieren, **erst nachdem** TapTell-Leads nachweislich ankommen, sonst entstehen doppelte Leads | 👤 |

### 4.4 Rückfallplan
Die DNS von taptell.de auf Onepage zurückstellen (alte Werte vorher notieren!). Onepage-Funnels und -Webhook bleiben bis zum Ende der Testphase unverändert. Die TTL des DNS-Eintrags einen Tag vorher auf 300 s senken, dann wirkt der Wechsel in Minuten.

> ⚠️ Den **Gehlen-Konfigurator nie testweise bis zum Ende absenden**, das löst eine E-Mail an den Kunden aus.

---

## 5. Rechtliches vor dem Livegang

| # | Punkt | Wer |
|---|---|---|
| 5.1 | Impressum, Datenschutzerklärung, AGB für taptell.de. In `landing/index.html` sind die Links noch `#` | 👤 Texte · 🤖 Seiten/Links |
| 5.2 | Kontaktadresse: `CONTACT_URL` in `landing/index.html` ist ein Platzhalter (`kontakt@taptell.de`) | 👤 sagt die Adresse · 🤖 trägt ein |
| 5.3 | AV-Verträge (DPA): Supabase, Resend, Vercel abschließen. Gegenüber deinen Kunden bist du Auftragsverarbeiter → eigene AVV-Vorlage für Kunden | 👤 |
| 5.4 | Datenschutzerklärung der **Funnels**: Jeder Kunde braucht einen Hinweis auf TapTell als Dienstleister. Link im Cookie-Banner bzw. Funnel-Fußzeile setzen | 👤 je Kunde |
| 5.5 | Löschkonzept für Leads (z. B. nach 24 Monaten) | 👤 entscheidet · 🤖 umsetzbar |

---

## 6. Offene Platzhalter und Risiken im Code

| Punkt | Auswirkung | Lösung |
|---|---|---|
| `config.js` leer | App läuft im **Demo-Modus** (Daten nur im Browser) | Abschnitt 1.5 |
| `/` liefert das Dashboard statt der Landingpage | taptell.de würde das Login zeigen | Abschnitt 1.3 |
| supabase-js ungepinnt (`@2`) | Ein CDN-Update könnte Live-Funnels brechen | Abschnitt 1.7 |
| Browser-Webhook `text/plain` | Empfänger nimmt es evtl. nicht an, Werbeblocker | Server-Webhook (4.1.5) |
| `lead-notify` mit Editor-HTML, Onepage-Format und `values` **nicht deployed und nicht typgeprüft** (Deno fehlte lokal) | Fehler erst beim Deploy sichtbar | Beim Deploy `deno check` laufen lassen, Testmail und Test-Webhook senden |
| Reservierte Slugs nicht gesperrt | Funnel „app“ oder „landing“ wäre unerreichbar | Abschnitt 1.4 |
| Bilder als Data-URL | große Funnel-Datensätze | Storage-Bucket (2.5), nach dem Start |
| Demo-Daten im Browser (localStorage) | Test-Kunden/Listen aus dem Demo-Modus werden nicht übernommen | im Echtbetrieb neu anlegen |
| `supabase/kunden-v2.sql` nicht eingespielt | Kunden-Stammdaten könnten nicht gespeichert werden | Abschnitt 2.1 |

---

## 7. Reihenfolge auf einen Blick

1. 👤 Vercel, Resend und DNS-Zugang bereitstellen, anon-Key nennen
2. 👤/🤖 SQL einspielen (schema → automation → kunden-v2), Admin-Rolle setzen
3. 👤 Secrets setzen · 🤖 Edge Functions deployen (nach Freigabe)
4. 🤖 `config.js`, `vercel.json` (Landing auf `/`), Slug-Sperre, supabase-js pinnen, `.vercelignore` → Commit nach Freigabe
5. 🤖 Holz Gehlen + Funnel `gehlen` anlegen, Server-Webhook, Test-Leads (nach Freigabe)
6. 👤 Feldzuordnung und Folgefragen in taptell.info korrigieren
7. 👤 Rechtstexte, AVV, Kontaktadresse
8. 👤 Inventur der Onepage-Slugs → alle in TapTell nachbauen → DNS taptell.de umstellen
9. 👤 Onepage-Webhook deaktivieren, Onepage nach ein paar Wochen kündigen
