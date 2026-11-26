// Supabase Edge Function: Funnel per KI aus einer Beschreibung erstellen (nur für Admins)
// Deploy:  supabase functions deploy ai-funnel
// Secret:  supabase secrets set ANTHROPIC_API_KEY=…   (selbst setzen, nie in den Chat oder ins Repo)
//
// Antwort: { spec } im Format von FS_T.fromSpec (src/templates.js). Das Dashboard baut daraus den Funnel.
import Anthropic from 'npm:@anthropic-ai/sdk@1.8.0';
import { createClient } from 'npm:@supabase/supabase-js@2.119.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/* Muss zu IMG in src/templates.js und FP.ICONS in src/player.js passen */
const IMAGES = ['bath','bathTub','bathMarble','bathWc','bathDouble','roof','roofTiles','roofHouse','heatPump','heatPump2','houseModern','houseGlass','houseClassic','houseWood','kitchen','kitchenIsland','kitchenWood','kitchenBar','kitchenWhite','garden','gardenLawn','gardenPath','gardenWork','painter','painterWall','moving','movingBoxes','movingRoom','cleaning','cleaningOffice','cleaningVacuum','gym','gymBarbell','gymRopes','gymWoman','yoga','spa','spaMassage','spaProducts','spaFace','salon','wedding','weddingWalk','weddingHands','catering','cateringFood','restaurant','restaurantRed','cars','carLot','laptop','laptopDesk','consulting','meeting','signing','workshop','workshopTeam','plumber','nurse','nurse2','cabin','cabinSnow','terrace','solar','estate','coffee','construction'];
const ICONS = ['home','building','factory','sun','leaf','drop','flame','bolt','wrench','hammer','ruler','paint','tree','car','truck','calendar','clock','euro','piggy','chart','shield','star','heart','thumb','user','users','phone','mail','chat','map','key','box','gift','rocket','sparkle','check','x','question'];
const CATS = ['Konfigurator','Leads','Termine','Recruiting','Feedback','Verkauf','Handwerk','Dienstleistung','Gesundheit','Gastro & Events'];

const str = { type: 'string' };
const num = { type: 'number' };
const bool = { type: 'boolean' };
const obj = (properties: Record<string, unknown>, required: string[]) => ({ type: 'object', properties, required, additionalProperties: false });

const OPTION = obj({
  label: str, sub: str,
  image: { type: 'string', enum: ['', ...IMAGES] },
  icon: { type: 'string', enum: ['', ...ICONS] },
  price: num, unitPrice: num, unit: str,
}, ['label']);

const STEP = obj({
  type: { type: 'string', enum: ['cards', 'icons', 'slider', 'faces', 'calendar', 'text'] },
  name: str, title: str, desc: str, text: str,
  layout: { type: 'string', enum: ['list', 'grid'] },
  multi: bool, required: bool,
  options: { type: 'array', items: OPTION },
  min: num, max: num, step: num, def: num, unit: str, quantity: bool,
  placeholder: str, multiline: bool,
}, ['type', 'name', 'title']);

const SPEC_SCHEMA = obj({
  name: str, desc: str,
  cats: { type: 'array', items: { type: 'string', enum: CATS } },
  brand: str, logo: str,
  style: { type: 'string', enum: ['shadow', 'filled', 'outline', 'soft', 'glass'] },
  address: { type: 'string', enum: ['du', 'sie'] },
  start: obj({
    badge: str, title: str, text: str,
    image: { type: 'string', enum: ['', ...IMAGES] },
    cta: str, ctaSub: str,
    proof: obj({ type: { type: 'string', enum: ['reviews', 'avatars', 'none'] }, score: num, count: num, source: str, text: str }, ['type']),
  }, ['title', 'text', 'cta']),
  steps: { type: 'array', items: STEP },
  loader: obj({ title: str, text: str, lines: { type: 'array', items: str }, anim: { type: 'string', enum: ['cube', 'orbit', 'globe', 'helix', 'flip', 'stack', 'search', 'ring'] } }, ['title']),
  pricing: obj({ mode: { type: 'string', enum: ['exact', 'range', 'from'] }, prefix: str, title: str, cta: str, base: num, show: bool }, ['mode']),
  contact: obj({ title: str, text: str, button: str, phone: bool, zip: bool, message: bool }, ['title', 'button']),
  thanks: obj({ title: str, text: str, steps: { type: 'array', items: str }, recap: bool }, ['title', 'text']),
}, ['name', 'desc', 'cats', 'brand', 'logo', 'address', 'start', 'steps', 'contact', 'thanks']);

const SYSTEM = `Du entwirfst mobile Lead-Funnels für kleine und mittelständische Betriebe in Deutschland. Ein Funnel stellt eine Frage pro Seite, sammelt am Ende Kontaktdaten und soll möglichst viele Besucher bis zum Absenden bringen.

So baust du einen Funnel, der konvertiert:
- Startseite: konkretes Nutzenversprechen in der Überschrift (höchstens 9 Wörter), 1–3 Wörter mit __doppelten Unterstrichen__ hervorgehoben. Ein kurzer Satz darunter, ein Button mit Verb ("Kosten berechnen", "Jetzt prüfen"), ctaSub wie "Kostenlos & unverbindlich". Badge mit Zeit- oder Vorteilsversprechen ("Preis in 60 Sekunden").
- 3 bis 5 Fragen. Die erste ist leicht und visuell (type "cards" mit Bildern, wenn passende Bilder existieren, sonst "icons" mit layout "grid"). Danach einfache Einzelauswahl, Schieberegler für Mengen/Flächen, höchstens eine Mehrfachauswahl. Fragen kurz und konkret, Antworten 1–4 Wörter, optional ein kurzer Untertitel.
- type "faces" nur für Zufriedenheit, "calendar" für Terminwünsche, "text" nur wenn eine freie Angabe nötig ist.
- Preise nur bei Konfiguratoren oder wenn der Nutzer Preise nennt: dann pricing setzen (mode "range" oder "from"), Optionen mit price (Festpreis) oder unitPrice + unit (pro m², Stück …) und einen slider mit quantity true für die Menge.
- loader nur bei Rechnern, Checks oder Bewertungen ("Wir berechnen …"), 2–3 kurze lines.
- Kontaktseite: Titel als Frage ("Wohin dürfen wir dein Angebot senden?"), zip nur bei Vor-Ort-Leistungen, message nur wenn sinnvoll.
- Danke-Seite: persönlicher Titel (darf {{vorname|dir}} enthalten), 3–4 steps im Format "Titel | Beschreibung" als nächste Schritte.
- Sprache: Deutsch, kurz, konkret, keine Emojis, keine Floskeln. Anrede nach Vorgabe ("du" oder "sie") durchgehend gleich.
- brand: passende Markenfarbe als Hex (#RRGGBB) mit gutem Kontrast zu Weiß, wenn keine vorgegeben ist. logo: Firmenname (oder ein plausibler Platzhalter).
- Bilder nur aus der erlaubten Liste und nur, wenn sie wirklich zur Branche passen, sonst leer lassen. Icons nur aus der erlaubten Liste.
- name: kurzer interner Name des Funnels, desc: ein Satz, was er tut. cats: 1–3 passende Kategorien.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) return json({ error: 'KI ist noch nicht eingerichtet (ANTHROPIC_API_KEY fehlt).' }, 503);

    // Nur angemeldete Admins
    const caller = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: 'Nicht angemeldet' }, 401);
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'admin') return json({ error: 'Keine Berechtigung' }, 403);

    const body = await req.json();
    const prompt = String(body.prompt ?? '').trim().slice(0, 2000);
    if (prompt.length < 8) return json({ error: 'Bitte beschreibe den Funnel etwas genauer.' }, 400);
    const company = String(body.company ?? '').trim().slice(0, 80);
    const brand = /^#[0-9a-f]{6}$/i.test(String(body.brand ?? '')) ? String(body.brand) : '';
    const address = body.address === 'sie' ? 'sie' : 'du';

    const userText = [
      `Beschreibung des Funnels: ${prompt}`,
      company ? `Firmenname: ${company}` : '',
      brand ? `Markenfarbe: ${brand}` : '',
      `Anrede: ${address}`,
    ].filter(Boolean).join('\n');

    const client = new Anthropic({ apiKey });
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: SPEC_SCHEMA } },
      messages: [{ role: 'user', content: userText }],
    });

    if (response.stop_reason === 'refusal') return json({ error: 'Diese Beschreibung kann die KI nicht umsetzen. Bitte formuliere sie anders.' }, 422);
    if (response.stop_reason === 'max_tokens') return json({ error: 'Die Antwort der KI war zu lang. Bitte beschreibe den Funnel kürzer.' }, 502);
    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') return json({ error: 'Die KI hat keinen Entwurf geliefert.' }, 502);

    const spec = JSON.parse(text.text);
    // Grenzen absichern, falls die KI über das Ziel hinausschießt
    spec.steps = (spec.steps ?? []).slice(0, 8).map((s: { options?: unknown[] }) => ({ ...s, options: (s.options ?? []).slice(0, 8) }));
    if (company) spec.logo = company;
    if (brand) spec.brand = brand;
    spec.address = address;
    return json({ spec });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: 'Gerade sind zu viele Anfragen unterwegs. Bitte in einer Minute erneut versuchen.' }, 429);
    if (e instanceof Anthropic.AuthenticationError) return json({ error: 'Der KI-Schlüssel ist ungültig.' }, 502);
    if (e instanceof Anthropic.APIError) return json({ error: `KI-Fehler (${e.status}): ${e.message}` }, 502);
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
