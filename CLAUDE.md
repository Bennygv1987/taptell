# TapTell – Hinweise für Claude

TapTell ist ein SaaS für mobile Funnels (Konfiguratoren, Feedback, Leads) für kleine und mittelständische Betriebe. Ziel ist ein hochwertiges Produkt – kein generischer Baukasten-Look.

## Aufbau & Build

- Quellcode liegt in `src/` (`app.js`, `app.css`, `player.js`, `player.css`, `templates.js`).
- `app.html` (Dashboard fürs Hosting), `index.html` (lokale Kopie, gitignored) und `f.html` im Root werden **erzeugt**: nach jeder Änderung in `src/` `python3 src/build.py` ausführen.
- Lokal testen: `python3 -m http.server 8080` im Root, dann `http://localhost:8080` (Demo-Modus, Login `admin@demo.de` / `demo`).

## Design

- Dashboard-Styles nur über die Tokens aus `DESIGN.md` / `:root` in `src/app.css` – keine festen Pixel- oder Hex-Werte.
- Texte kurz, konkret, per Du, keine Emojis in der Oberfläche.

## UI, Interaktion & Animation: Emil-Kowalski-Skills verwenden

Bei **jeder** Änderung an Dashboard oder Funnel-Player die Skills aus `.claude/skills/` anwenden – auch ohne ausdrückliche Aufforderung:

- `emil-design-eng` für Feinschliff von Komponenten und Interaktionen
- `review-animations` / `improve-animations` zum Prüfen und Verbessern von Bewegung
- `animate`, `choreograph`, `find-animation-opportunities`, `learn-taste` je nach Aufgabe

Kernregeln (Details in `.claude/skills/review-animations/STANDARDS.md`):

- Bewegungs-Tokens nutzen: `--ease-out`, `--ease-in-out`, `--ease-drawer` und die Dauern in `src/app.css` / `src/player.css`.
- UI-Bewegung unter 300 ms (Modals, Toasts, Schubladen ausgenommen), nie `ease-in`, nie `transition: all`, nie `scale(0)`.
- Druck-Feedback `transform: scale(.97)` auf `:active` für alles Klickbare.
- Hover-Bewegung nur in `@media (hover: hover) and (pointer: fine)`.
- Popover/Dropdowns wachsen aus ihrem Auslöser (`transform-origin`), Modals bleiben zentriert.
- `prefers-reduced-motion`: Bewegung durch sanfte Einblendung ersetzen, nicht komplett abschalten.
- Änderungen an der UI im Format der Skills berichten: Tabelle mit **Vorher | Nachher | Warum**.
