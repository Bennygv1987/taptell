# Umzug Onepage → TapTell auf taptell.de

Stand: 26.11.2026 · Ziel: Die Holz-Gehlen-Funnels laufen ohne Unterbrechung über TapTell statt Onepage, unter denselben Adressen. Der Feedback-Funnel liefert weiter dieselben Webhook-Daten an das Dashboard auf taptell.info.

**Grundsatz:** Alles wird vorher fertig gebaut und unter `taptell.vercel.app` getestet. Der eigentliche Umzug ist **eine einzige DNS-Änderung** bei United Domains, ausgelöst erst auf dein Kommando **„START UMZUG“**. Der Rückweg ist dieselbe Änderung rückwärts und wirkt in etwa 10 Minuten.

> ⚠️ **Frist: Die Onepage-Kündigung wird am 4. Dezember 2026 wirksam** (Hinweis im Onepage-Konto). Danach sind die Onepage-Seiten vermutlich offline. Das letzte Wochenende davor ist **28./29. November**. Alternativ ein Abend unter der Woche bis spätestens 3. Dezember, oder die Kündigung in Onepage verschieben, falls mehr Zeit nötig ist (👤 entscheidet).

Legende: 👤 du · 🤖 ich (nach deiner Freigabe) · ✅ erledigt · ⏳ offen · ❓ Frage an dich

---

## 1. Ist-Stand (geprüft am 26.11., nur lesend)

### Live-Seiten auf Onepage (Ordner „Gehlen“, Projekt „TapTell Feedback Funnel“)
| Adresse | Inhalt | Webhook | TapTell-Gegenstück |
|---|---|---|---|
| `taptell.de/gehlen` | Feedback („Wie war Ihr Besuch bei uns?“) | ✅ `https://taptell.info/api/public/webhooks/onepage?customer_id=gehlen` (Liste „Gehlen“, ohne Secret) | ✅ Vorlage `gehlen-feedback`, Onepage-Webhook-Format eingestellt |
| `taptell.de/gehlen-konfigurator` | Massivholztisch-Konfigurator | – (Benachrichtigung richtest du nach dem Umzug neu ein) | ⚠️ Vorlage `gehlen-tisch` vorhanden |
| `taptell.de/gehlen-angebot` | Konfigurator-Variante: Startseite mit freiwilligem Vor- und Nachnamen, ohne Kontaktseite, Danke-Text „Deine Anfrage ist in Bearbeitung!“ | – (wie oben) | ⏳ **baust du selbst** aus dem Konfigurator, am besten vor „START UMZUG“, sonst ist die Adresse kurz „nicht verfügbar“ |
| `taptell.de/gehlen-montagebericht` | Montagebericht, erreichbar, aber noch nicht im Einsatz | – | **zieht nicht mit um**, du baust ihn danach in TapTell nach (Screens gesichert). Nach dem Umzug zeigt die Adresse bis dahin „nicht verfügbar“ |
| `taptell.de/` | „Coming Soon“ | – | ✅ TapTell zeigt dort die Landingpage |

Andere Onepage-Adressen gibt es nicht (`koelner-zoo`, `gehlen-konfigurator-2` → 404).

### Weitere Einstellungen in Onepage
- **Make-Integration** an der Liste „Gehlen“ (zusätzlich zum Webhook). Nach dem Umzug kommt dort nichts mehr an. ❓ Wird das Make-Szenario noch gebraucht?
- **E-Mail-Integration** an der Liste „Gehlen Konfigurator“, verbunden mit `info@gehlen-holz.de`. Laut dir wird die Benachrichtigung für Konfigurator und Angebot nach dem Umzug neu eingerichtet. Bis dahin landen diese Anfragen nur im TapTell-Dashboard.
- Google Tag, Facebook-Pixel und Cookie-Banner sind im Projekt **aus**. Im Quelltext der Seiten steht trotzdem ein GTM-Container (`GTM-TXX5Q3WD`), vermutlich von Onepage selbst. ❓ Nutzt du diesen Container? Wenn nicht, braucht TapTell kein GTM und kein Cookie-Banner für die Funnels.
- Eigener Code im Kopf: nur das Talko-Chat-Widget aus Clientflow → **entfällt** (laut dir).

### Dashboard „TapTell Insights“ (Lovable, taptell.info), Code gelesen am 26.11.
Insights bleibt unverändert auf taptell.info. Der DNS-Wechsel von taptell.de betrifft es nicht. Für den Umzug relevant ist nur der Feedback-Empfänger `…/api/public/webhooks/onepage`:
- Den Kunden erkennt er an `?customer_id=gehlen`; der Schlüssel wählt auch den Feedback-Funnel des Kunden.
- Er wertet `data.fields[].label`, `Step N.label` und die Feldzuordnungen pro Funnel aus. Die Bewertung 1–5 nimmt er aus Feldern wie „Grundstimmung“.
- Er nimmt JSON an, auch als `text/plain`. Das Onepage-Format, das TapTell sendet, passt dazu. Die Feldbeschriftungen müssen exakt wie in Onepage heißen (so angelegt).
- Bei 1–2 Sternen verschickt Insights selbst die Hinweis-Mail an den Kunden.
- (Daneben gibt es einen Angebots-Empfänger `…/api/public/offers/submit`. Er wird laut dir derzeit nicht genutzt.)

### DNS bei United Domains (taptell.de)
| Typ | Name | Wert | TTL | Beim Umzug |
|---|---|---|---|---|
| A | `taptell.de` | `216.162.200.200` (Onepage) | 600 s | **ändern → Vercel** |
| CNAME | `www` | `taptell.de` | 600 s | bleibt (folgt automatisch) |
| MX | `taptell.de` | `mx00.udag.de` (10), `mx01.udag.de` (20) | 3600 s | **nicht anfassen** (deine E-Mail) |
| TXT | `taptell.de`, `_dmarc`, `uddkim-202310._domainkey` | SPF, DMARC, DKIM | – | **nicht anfassen** |

Nameserver bleiben bei United Domains. Die TTL von 600 s heißt: Änderung und Rückweg wirken nach höchstens etwa 10 Minuten.

### TapTell
✅ Vercel (`taptell.vercel.app`) · ✅ Datenbank komplett · ✅ Admin-Login · ⏳ Edge Functions nicht deployt (ohne `lead-notify` kein Server-Webhook) · ⏳ Resend (E-Mail-Versand) nicht eingerichtet

---

## 2. Was vor dem Umzug fertig sein muss

| # | Aufgabe | Wer | Status |
|---|---|---|---|
| 2.1 | Webhook-URL für `gehlen` | 🤖 | ✅ ausgelesen |
| 2.2 | `gehlen-angebot` aus dem Konfigurator ableiten (Namensfelder auf der Startseite, ohne Kontaktseite, anderer Danke-Text), Adresse exakt `gehlen-angebot` | 👤 | ⏳ |
| 2.3 | Konfigurator gegen das Original prüfen (Texte, Bilder, Felder) | 🤖 | ⏳ |
| 2.4 | `gehlen-montagebericht`: nach dem Umzug (du) | 👤 | später |
| 2.5 | Edge Functions deployen (CLI-Login von dir: `npx supabase@3.1.0 login`) und den Server-Webhook für `gehlen` in TapTell anlegen. Alternative ohne Deploy: der Browser-Webhook im Funnel, den Insights ebenfalls annimmt | 👤 Login · 🤖 | ⏳ |
| 2.6 | Kunde „Holz Gehlen“ und alle Funnels mit **exakt denselben Adressen** anlegen und veröffentlichen | 🤖 | ⏳ |
| 2.7 | In Vercel `taptell.de` und `www.taptell.de` als Domains hinzufügen. Ohne DNS-Änderung passiert dabei nichts, Vercel zeigt nur den Wert, der bei United Domains einzutragen ist | 🤖 | ⏳ |
| 2.8 | Resend und E-Mail-Benachrichtigungen für Konfigurator und Angebot: nach dem Umzug (laut dir) | 👤 / 🤖 | später |
| 2.9 | GTM/Cookie-Banner: nur falls du den Container nutzt | 🤖 | ❓ |

---

## 3. Generalprobe (Tage vorher, Onepage bleibt live)

1. Alle Funnels unter `taptell.vercel.app/<adresse>` auf dem Handy durchklicken, Design mit dem Original vergleichen. 🤖 / 👤
2. Im Feedback-Funnel **eine** Test-Anfrage mit Testdaten senden. 🤖 nach Freigabe
3. In taptell.info prüfen: Kommen alle Felder an der richtigen Stelle an, gleich wie bei Onepage-Leads? 👤 / 🤖
4. Test-Anfrage in TapTell und taptell.info löschen. 👤 / 🤖

Erst wenn das stimmt, ist das System bereit für „START UMZUG“.

---

## 4. START UMZUG (abends, ca. 30 Minuten)

Vorher: Du schreibst **„START UMZUG“**. Bis dahin ändere ich bei United Domains nichts.

| Min | Schritt | Wer |
|---|---|---|
| 0 | Alten A-Wert notieren (`216.162.200.200`), Bildschirmfoto der DNS-Seite | 🤖 |
| 1 | United Domains: A-Eintrag `taptell.de` von `216.162.200.200` auf den Vercel-Wert ändern (Vercel zeigt ihn in 2.7 an). **Nur dieser eine Eintrag**, MX und TXT bleiben | 🤖 |
| 2–10 | Warten, bis die Änderung sichtbar ist, und von außen prüfen; Vercel stellt das SSL-Zertifikat aus. In diesen Minuten sehen manche Besucher noch Onepage, manche schon TapTell. Beides funktioniert | 🤖 |
| 10 | Alle Adressen und `www.taptell.de/gehlen` mit HTTPS aufrufen: TapTell, gültiges Zertifikat | 🤖 |
| 12 | `config.js`: `publicUrl` auf `https://taptell.de` (Links und QR-Codes im Dashboard), pushen. Supabase: Site URL und `APP_URL` prüfen | 🤖 |
| 15 | Eine Test-Anfrage im Feedback-Funnel, in taptell.info prüfen und löschen | 🤖 / 👤 |
| 20 | Fertig-Meldung an dich | 🤖 |

**Onepage danach nicht sofort abschalten.** Wer die alte Adresse noch zwischengespeichert hat, landet bis zu 10 Minuten (in seltenen Fällen länger) bei Onepage und sendet dort ab. Doppelte Leads entstehen dabei nicht, denn jeder Besucher sendet nur auf einer der beiden Seiten. Onepage läuft ohnehin bis zum 4.12. weiter.

## 5. Rückweg

Wenn etwas nicht stimmt: A-Eintrag `taptell.de` zurück auf `216.162.200.200`. Nach etwa 10 Minuten läuft wieder alles über Onepage. Das geht nur bis zum 4.12., danach ist Onepage gekündigt. 🤖 auf Zuruf

---

## 6. Offene Fragen an dich

1. **Termin:** in den nächsten Tagen, spätestens bis 3.12. Du gibst „START UMZUG“, sobald es passt; bis dahin halte ich alles startklar.
2. Make-Integration an der Liste „Gehlen“: noch in Gebrauch?
3. GTM-Container `GTM-TXX5Q3WD`: deiner oder der von Onepage?
