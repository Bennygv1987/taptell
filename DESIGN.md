# TapTell Design-System

Gilt für das Dashboard (`src/app.css`, `src/app.js`). Die Funnels selbst gestaltet jeder Kunde über sein Theme – dafür gilt dieses Dokument nicht.

Alle Werte liegen als CSS-Variablen in `:root` am Anfang von `src/app.css`. **Keine festen Pixel- oder Hex-Werte in neuen Styles** – immer ein Token verwenden. Fehlt etwas, erst hier ein Token ergänzen.

## Grundsätze

- **Ruhig statt kastig.** Struktur entsteht über Abstand, Schriftgröße und Haarlinien, nicht über viele Kästen. Kennzahlen stehen in einer gemeinsamen Leiste.
- **Eine Akzentfarbe.** Fast alles ist neutrales Zink-Grau. Primäre Aktionen sind fast schwarz (im Dunkelmodus fast weiß), der blaue Akzent (`--acc`) markiert Fokus, Auswahl, eingeschaltete Schalter und Diagramme.
- **Farbe heißt Bedeutung.** Grün = live/erfolgreich, Gelb = Hinweis, Rot = Fehler/Löschen, Violett = Angebot. Status als Punkt mit Text, nicht als bunte Fläche.
- **Hell und dunkel.** Jede Farbe kommt aus einem Token; `data-theme` auf `<html>` schaltet um (folgt dem System, Wahl wird gemerkt). Kein festes `#fff` für Flächen – nur Funnel-Vorschauen, QR-Codes und Schalter-Knöpfe bleiben bewusst weiß.
- **Keine Emojis in der Oberfläche.** Icons kommen aus dem Icon-Set in `app.js` (`I('name')`).
- **Texte:** kurz, konkret, per Du. Sagen, was passiert und was der Nutzer davon hat.
- **Jeder Bildschirm braucht** einen leeren Zustand mit Nutzen-Satz und nächster Aktion.
- **Handy:** Kopfzeile oben, Tab-Leiste unten (Safe Area beachten), Raster immer mit `minmax(0,1fr)`.

## Farben

| Token | Hell / Dunkel | Einsatz |
|---|---|---|
| `--n0` … `--n900` | Zink, im Dunkelmodus umgekehrt | Neutrale Stufen |
| `--bg` / `--side` / `--card` / `--raise` | Hintergrund / Seitenleiste / Karten / schwebende Flächen | Flächen |
| `--hover` / `--press` | transparente Überlagerung | Hover- und Druckzustände |
| `--line` / `--line2` | Haarlinien | Rahmen / feine Trennlinien |
| `--ink` / `--ink2` / `--mut` | Text: Haupt, Sekundär, Hinweis | Schrift |
| `--a` / `--a2` / `--pt` | fast schwarz (dunkel: fast weiß) / Hover / Schrift darauf | Primärbutton, aktive Nummern |
| `--acc` / `--accS` / `--accL` (`--aS`, `--aL`) | Blau / sehr hell / Rahmen | Fokus, Auswahl, Schalter, Diagramme |
| `--ok` `--warn` `--bad` `--info` `--pur` (+ `S` Fläche, `T` Text) | Status | Live, Hinweis, Fehler, Logik, Angebot |

## Schrift

Geist, Grundgröße 14 px. Nur diese Größen:

| Token | Einsatz |
|---|---|
| `--fs-11` | Abschnitts-Labels (Großbuchstaben), Tags |
| `--fs-12` | Hinweise, Metadaten, Tabellenköpfe |
| `--fs-13` | Bedienelemente, Tabellen, Panels |
| `--fs-14` | Fließtext, Buttons |
| `--fs-16` / `--fs-18` | Zwischenüberschriften |
| `--fs-22` | Seitentitel |
| `--fs-28` | Kennzahlen (KPIs) |

Strichstärken: 400 Text, 550 Bedienelemente, 600 Hervorhebung, 650 Titel und Kennzahlen. Zahlen in Tabellen und KPIs mit `font-variant-numeric: tabular-nums`.

## Radien

`--r-xs` 4 · `--r-sm` 6 (kleine Elemente, Tags) · `--r-md` 8 (Buttons, Eingabefelder, Menüs) · `--r-lg` 12 (Karten) · `--r-xl` 16 (Modals) · `--r-pill` (Status-Pills, Chips)

## Schatten

`--sh` für Karten (kaum sichtbar) · `--sh-md` für schwebende Elemente · `--sh2` für Modals und Dropdowns · `--ring` als Fokus-Ring (Tastaturbedienung) und für fokussierte Eingabefelder.

## Komponenten (Klassen)

- **Buttons:** `.btn`, `.btn.pri` (Primär, max. einer pro Bereich), `.btn.ghost`, `.btn.sm`, `.btn.ic`, `.btn.danger`
- **Eingaben:** `.inp`, `.fld` mit `label`, `.hint`, Umschalter `.tgl`, Segmente `.segf`
- **Flächen:** `.card` mit `.ch` (Kopf) und `.cb` (Inhalt), `.kpi`, `.modal`, `.dd` (Dropdown)
- **Status:** `.pill.live`, `.pill.draft`, `.tag`, `.chip`
- **Leere Zustände:** `.empty`, `.emptyp`

## Bewegung

Grundlage sind die Emil-Kowalski-Skills in `.claude/skills/` (siehe `CLAUDE.md`). Tokens in `src/app.css` und `src/player.css`:

| Token | Wert | Einsatz |
|---|---|---|
| `--ease-out` | `cubic-bezier(.23,1,.32,1)` | Ein- und Ausblenden, Druck-Feedback (Standard) |
| `--ease-in-out` | `cubic-bezier(.77,0,.175,1)` | Bewegung auf dem Bildschirm (Fortschrittsbalken, Größenwechsel) |
| `--ease-drawer` | `cubic-bezier(.32,.72,0,1)` | Schubladen / Seitenleisten |
| `--dur-press` | 160 ms | Druck-Feedback `scale(.97)` |
| `--dur-fast` / `--dur-pop` | 150 / 200 ms | Farbwechsel, Dropdowns, Hover |
| `--dur-modal` | 260 ms | Modals (Toasts: 400 ms `ease`) |

Hover-Bewegung nur mit Maus, Dropdowns wachsen aus dem Auslöser, bei „Bewegung reduzieren“ sanfte Einblendung statt Bewegung.
