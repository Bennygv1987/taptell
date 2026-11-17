# TapTell – Mobile Funnels (Admin + Kundenportal)

Statische Web-App (keine Build-Pipeline nötig) + Supabase als Backend.

```
index.html          Dashboard: Admin-Bereich und Kundenportal (ein Login für beide)
f.html              Öffentliche Funnel-Seite → erreichbar unter /f/<slug>
config.js           Supabase-Zugangsdaten (leer = Demo-Modus im Browser)
_redirects          Rewrite /f/* → f.html (Netlify, Cloudflare Pages)
vercel.json         Dasselbe für Vercel
supabase/schema.sql Tabellen, Row Level Security, öffentliche Funktionen
supabase/functions/invite-user/index.ts   Kundenlogins einladen/löschen
```

## Rollen

| | Admin (du) | Kunde |
|---|---|---|
| Funnels bauen & bearbeiten | alle | – |
| Funnels sehen | alle | nur zugeordnete **und** freigeschaltete |
| Anfragen (Leads) | alle, löschen | seine, Status & Notizen ändern |
| Analytics | alle | seine Funnels |
| Kunden & Logins verwalten | ja | – |

Die Trennung erzwingt die Datenbank (Row Level Security), nicht nur die Oberfläche. Ein Kunde kommt auch über die API nicht an fremde Daten.

## Einrichtung (ca. 20 Minuten)

1. **Supabase-Projekt anlegen.** Region *Frankfurt (eu-central-1)* wegen DSGVO. Den AV-Vertrag in Supabase abschließen.
2. **Datenbank:** Im SQL-Editor den kompletten Inhalt von `supabase/schema.sql` ausführen.
3. **Auth-Einstellungen** (Authentication → Sign In / Providers / URL Configuration):
   - *Allow new users to sign up* → **aus**. Neue Logins entstehen nur per Einladung.
   - *Site URL* = deine App-URL, z. B. `https://app.taptell.de`. Dieselbe URL auch unter *Redirect URLs* eintragen.
   - *SMTP*: unter Authentication → Emails → SMTP Settings Resend eintragen (Host `smtp.resend.com`, Port 465, User `resend`, Passwort = API-Key). Der Supabase-Standardversand ist stark limitiert.
   - Optional: das Template *Invite user* auf Deutsch anpassen.
4. **Edge Function deployen** (Supabase CLI):
   ```bash
   supabase login
   supabase link --project-ref <dein-projekt-ref>
   supabase functions deploy invite-user
   ```
   Alternativ im Dashboard unter *Edge Functions → Create function* „invite-user“ anlegen und `index.ts` einfügen.
5. **Ersten Admin anlegen:** Unter Authentication → Users → *Add user* deine E-Mail und ein Passwort eintragen, *Auto Confirm* an. Danach im SQL-Editor:
   ```sql
   insert into public.profiles (id, role, email, name)
     select id, 'admin', email, 'Benjamin' from auth.users where email = 'deine@email.de'
     on conflict (id) do update set role = 'admin';
   ```
6. **`config.js` ausfüllen:** URL und Anon-/Publishable-Key aus *Project Settings → API*. Optional `publicUrl`, falls die Funnels unter einer anderen Domain laufen sollen als das Dashboard.
7. **Deployen:** Den Ordner auf Netlify, Vercel oder Cloudflare Pages ziehen (statisches Hosting, kein Build-Befehl). Eigene Domain verbinden, z. B. `app.taptell.de`.

Fertig. Melde dich an, lege unter **Kunden** einen Kunden an, ordne ihm Funnels zu, schalte sie frei und schicke unter **Logins** eine Einladung.

## Ablauf für Kunden

1. Der Kunde bekommt eine Einladungs-Mail und klickt auf den Link.
2. Er legt in der App sein Passwort fest.
3. Danach sieht er nur seine freigeschalteten Funnels mit Anfragen, Analytics und QR-Code.

Hat er das Passwort vergessen, nutzt er „Passwort vergessen?“ auf der Login-Seite. Du kannst ihm den Link auch aus dem Kunden-Dialog schicken.

## Live-Funnels

- Den Status eines Funnels auf **Live** stellen. Der Link lautet dann `https://<deine-domain>/f/<slug>`. Er steht unter „Veröffentlichen“, inklusive QR-Code und iFrame-Code.
- Jeder Aufruf, Start, Seitenwechsel und Abschluss wird anonym als Event gespeichert. Daraus entstehen Funnel-Verlauf, Drop-off und Conversion.
- UTM-Parameter (`?utm_source=flyer`) werden mit dem Lead gespeichert.
- Optional: Webhook pro Funnel (Make, n8n, Zapier) und Meta Pixel.

## Daten aus dem Demo-Modus übernehmen

Im Demo-Modus unter Einstellungen → *Backup kopieren*. Dann mit Supabase verbunden als Admin unter Einstellungen → *Importieren* einfügen. Funnels, Kunden und Leads werden hochgeladen. Logins müssen neu eingeladen werden.

## Bekannte Grenzen / nächste Schritte

- **Spam-Schutz:** `submit_lead` ist öffentlich, wie bei jedem Formular. Für den Produktivbetrieb empfehle ich Cloudflare Turnstile oder ein Rate-Limit über eine Edge Function.
- **Eigene Domains pro Kunde** (z. B. `feedback.kunde.de`): über Domain-Aliase beim Hoster möglich, ist aber noch nicht automatisiert.
- **Bilder** werden aktuell als Data-URL im Funnel gespeichert. Bei vielen großen Bildern lohnt sich der Umzug nach Supabase Storage.
- **E-Mail-Benachrichtigung bei neuem Lead:** per Database Webhook auf `leads` → Edge Function → Resend.
