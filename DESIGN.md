# TapTell Design-System

Gilt für das Dashboard (`src/app.css`, `src/app.js`). Die Funnels selbst gestaltet jeder Kunde über sein Theme – dafür gilt dieses Dokument nicht.

Alle Werte liegen als CSS-Variablen in `:root` am Anfang von `src/app.css`. **Keine festen Pixel- oder Hex-Werte in neuen Styles** – immer ein Token verwenden. Fehlt etwas, erst hier ein Token ergänzen.

## Grundsätze

- **Ruhig statt bunt.** Fast alles ist Grau. Das Marken-Navy (`--a`) markiert nur die wichtigste Aktion eines Bildschirms und den aktiven Zustand.
- **Farbe heißt Bedeutung.** Grün = live/erfolgreich, Gelb = Hinweis, Rot = Fehler/Löschen, Blau = Logik/Verzweigung. Nie zur Dekoration.
- **Keine Emojis in der Oberfläche.** Icons kommen aus dem Icon-Set in `app.js` (`I('name')`).
- **Texte:** kurz, konkret, per Du. Sagen, was passiert und was der Nutzer davon hat.
- **Jeder Bildschirm braucht** einen leeren Zustand mit Nutzen-Satz und nächster Aktion.

## Farben

| Token | Wert | Einsatz |
|---|---|---|
| `--n0` … `--n900` | Weiß bis fast Schwarz | Neutrale Stufen (25, 50, 100, 150, 200, 300, 400, 500, 700, 900) |
| `--bg` | `--n50` | Seitenhintergrund |
| `--card` | `--n0` | Karten, Panels, Modals |
| `--line` / `--line2` | `--n150` / `--n100` | Rahmen / feine Trennlinien |
| `--ink` / `--ink2` / `--mut` | `--n900` / `--n700` / `--n500` | Text: Haupt, Sekundär, Hinweis |
| `--a` / `--a2` / `--aS` / `--aL` | Navy, dunkler, sehr hell, hell | Primäraktion, Hover, aktive Hintergründe, aktive Rahmen |
| `--ok` `--okS` `--okT` | Grün: Fläche / Hintergrund / Text | Live, Erfolg |
| `--warn` `--warnS` `--warnT` | Gelb | Hinweise |
| `--bad` `--badS` `--badT` | Rot | Fehler, Löschen |
| `--info` `--infoS` `--infoT` | Blau | Logik, Verzweigungen, „Neu“ |

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
