// Supabase Edge Function „lead-notify“
// Wird bei jedem neuen Lead per Datenbank-Trigger aufgerufen (siehe supabase/automation.sql)
// und vom Dashboard für Testversand (nur Admins).
//
// Aufgaben: E-Mail an den Betrieb (inkl. Empfängerlisten & Regeln), Bestätigung an den
// Interessenten, Webhooks mit HMAC-Signatur und Wiederholung, Protokoll in „deliveries“.
//
// Secrets (supabase secrets set …):
//   RESEND_API_KEY        – API-Key von resend.com (ohne: E-Mails werden als „skipped“ protokolliert)
//   MAIL_FROM             – z. B. "TapTell <anfragen@taptell.de>"
//   LEAD_NOTIFY_SECRET    – gleicher Wert wie im Vault „lead_notify_secret“
//   APP_URL               – z. B. https://app.taptell.de (für Bilder & Dashboard-Link)
// Deploy: supabase functions deploy lead-notify --no-verify-jwt
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-taptell-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

type Field = { key: string; label: string; value: string; type?: string; inputType?: string; image?: string };
type Rule = { id?: string; field: string; op: 'lte' | 'gte' | 'eq' | 'contains' | 'any'; value?: string; to?: string; lists?: string[]; label?: string };
type Hook = { id: string; url: string; secret?: string; active?: boolean; events?: string[]; name?: string };
type Automation = {
  notify?: { enabled?: boolean; to?: string; lists?: string[]; subject?: string; body?: string };
  confirm?: { enabled?: boolean; subject?: string; body?: string; replyTo?: string };
  rules?: Rule[];
  webhooks?: Hook[];
};

const env = (k: string) => Deno.env.get(k) ?? '';
const splitMails = (s?: string) => String(s ?? '').split(/[\s,;]+/).map((x) => x.trim().toLowerCase()).filter((x) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x));
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const money = (n: number, cur = 'EUR') => new Intl.NumberFormat('de-DE', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n || 0);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Variablen & Vorlagen ----------
function varsFor(lead: any, funnel: any): Record<string, string> {
  const data = lead.data ?? {};
  const fields: Field[] = data.fields ?? [];
  const v: Record<string, string> = {};
  fields.forEach((f) => { if (f.key) v[f.key] = String(f.value ?? ''); });
  v.funnel = funnel.name ?? '';
  v.name = lead.name ?? v.name ?? '';
  v.vorname = v.vorname || String(lead.name ?? '').split(' ')[0] || '';
  v.email = lead.email ?? v.email ?? '';
  v.telefon = lead.phone ?? v.telefon ?? '';
  v.total = +lead.total ? money(+lead.total, funnel.settings?.currency) : '';
  v.datum = new Date(lead.created_at ?? Date.now()).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
  v.link = env('APP_URL') ? env('APP_URL').replace(/\/$/, '') + '/#contacts' : '';
  return v;
}
function render(tpl: string | undefined, vars: Record<string, string>) {
  return String(tpl ?? '').replace(/\{\{\s*([\w.-]+)\s*(?:\|([^}]*))?\}\}/g, (_m, k, fb) => (vars[k] ? vars[k] : (fb ?? '').trim()));
}
const absUrl = (u?: string) => {
  if (!u || u.startsWith('data:')) return '';
  if (/^https?:\/\//.test(u)) return u;
  return env('APP_URL') ? env('APP_URL').replace(/\/$/, '') + (u.startsWith('/') ? u : '/' + u) : '';
};
function optionImages(funnel: any): Record<string, string> {
  const map: Record<string, string> = {};
  (funnel.pages ?? []).forEach((p: any) => (p.blocks ?? []).forEach((b: any) => (b.props?.options ?? []).forEach((o: any) => { if (o.img && o.label) map[o.label] = absUrl(o.img); })));
  return map;
}

// ---------- E-Mail-Layout ----------
function emailHtml(opts: { funnel: any; title: string; intro: string; fields?: Field[]; total?: string; cta?: { label: string; url: string }; footer?: string }) {
  const t = opts.funnel.theme ?? {}, p = t.primary || '#1c2e3d', logo = absUrl(t.logoImg);
  const imgs = optionImages(opts.funnel);
  const rows = (opts.fields ?? []).filter((f) => f.value && f.type !== 'signature').map((f) => {
    const first = String(f.value).split(', ')[0], img = imgs[first];
    return `<tr><td style="padding:10px 0;border-bottom:1px solid #eef0f3;color:#737985;font-size:13px;width:42%;vertical-align:top">${esc(f.label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eef0f3;font-size:14px;color:#12141a;vertical-align:top">${img ? `<img src="${esc(img)}" width="44" height="44" style="border-radius:6px;object-fit:cover;vertical-align:middle;margin-right:8px" alt="">` : ''}${esc(f.value)}</td></tr>`;
  }).join('');
  return `<!doctype html><html><body style="margin:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:32px 12px"><tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e8ec">
    <tr><td style="height:4px;background:${esc(p)}"></td></tr>
    <tr><td style="padding:28px 32px 8px">${logo ? `<img src="${esc(logo)}" height="36" alt="" style="display:block;margin-bottom:20px">` : ''}
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:#12141a">${esc(opts.title)}</h1>
      <p style="margin:0;font-size:15px;line-height:1.55;color:#3d424d;white-space:pre-line">${esc(opts.intro)}</p></td></tr>
    ${rows ? `<tr><td style="padding:16px 32px 4px"><table width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>` : ''}
    ${opts.total ? `<tr><td style="padding:12px 32px 0"><div style="background:#f5f6f8;border-radius:8px;padding:12px 14px;font-size:14px;color:#3d424d">Gesamt: <b style="color:#12141a">${esc(opts.total)}</b></div></td></tr>` : ''}
    ${opts.cta && opts.cta.url ? `<tr><td style="padding:24px 32px 0"><a href="${esc(opts.cta.url)}" style="display:inline-block;background:${esc(p)};color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 18px;border-radius:8px">${esc(opts.cta.label)}</a></td></tr>` : ''}
    <tr><td style="padding:28px 32px 28px;font-size:12px;color:#9aa0ab">${esc(opts.footer ?? 'Gesendet mit TapTell')}</td></tr>
  </table></td></tr></table></body></html>`;
}

async function sendMail(to: string[], subject: string, html: string, replyTo?: string) {
  const key = env('RESEND_API_KEY');
  if (!key) return { status: 'skipped' as const, error: 'RESEND_API_KEY fehlt' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('MAIL_FROM') || 'TapTell <anfragen@taptell.de>', to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  return r.ok ? { status: 'ok' as const, http: r.status } : { status: 'failed' as const, http: r.status, error: (await r.text()).slice(0, 500) };
}

// ---------- Regeln ----------
function ruleMatches(rule: Rule, vars: Record<string, string>, lead: any): boolean {
  const raw = rule.field === 'total' ? String(lead.total ?? '') : (vars[rule.field] ?? '');
  if (rule.op === 'any') return raw !== '';
  const num = parseFloat(String(raw).replace(/\./g, '').replace(',', '.').match(/-?\d+(\.\d+)?/)?.[0] ?? 'NaN');
  const cmp = parseFloat(String(rule.value ?? '').replace(',', '.'));
  if (rule.op === 'lte') return !isNaN(num) && num <= cmp;
  if (rule.op === 'gte') return !isNaN(num) && num >= cmp;
  if (rule.op === 'eq') return String(raw).trim().toLowerCase() === String(rule.value ?? '').trim().toLowerCase();
  if (rule.op === 'contains') return String(raw).toLowerCase().includes(String(rule.value ?? '').trim().toLowerCase());
  return false;
}

// ---------- Webhooks ----------
async function hmac(secret: string, msg: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function sendHook(h: Hook, event: string, payload: unknown) {
  const body = JSON.stringify(payload), ts = Math.floor(Date.now() / 1000).toString();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'User-Agent': 'TapTell-Webhooks/1.0', 'X-TapTell-Event': event };
  if (h.secret) headers['X-TapTell-Signature'] = `t=${ts},v1=${await hmac(h.secret, ts + '.' + body)}`;
  let last: { status: 'ok' | 'failed'; http?: number; error?: string; attempts: number } = { status: 'failed', attempts: 0 };
  for (let i = 1; i <= 3; i++) {
    try {
      const r = await fetch(h.url, { method: 'POST', headers, body, signal: AbortSignal.timeout(8000) });
      last = r.ok ? { status: 'ok', http: r.status, attempts: i } : { status: 'failed', http: r.status, error: (await r.text()).slice(0, 300), attempts: i };
      if (r.ok || r.status < 500) break; // 4xx: nicht wiederholen
    } catch (e) { last = { status: 'failed', error: String((e as Error).message ?? e), attempts: i }; }
    await sleep(i === 1 ? 500 : 2000);
  }
  return last;
}

// ---------- Ablauf ----------
async function processLead(admin: any, lead: any, funnel: any, only?: { kind: string; hookId?: string; to?: string[] }) {
  const a: Automation = funnel.settings?.automation ?? {};
  const vars = varsFor(lead, funnel);
  const fields: Field[] = lead.data?.fields ?? [];
  const results: any[] = [];
  const log = async (kind: 'email' | 'webhook', target: string, r: any) => {
    const status = only ? 'test' : r.status;
    results.push({ kind, target, ...r });
    await admin.from('deliveries').insert({ lead_id: lead.id && !only ? lead.id : null, funnel_id: funnel.id, kind, target, status: r.status === 'ok' ? status : r.status, http_status: r.http ?? null, error: r.error ?? null, attempts: r.attempts ?? 1 });
  };

  // 1) Betrieb benachrichtigen (+ Regeln)
  if (!only || only.kind === 'email') {
    const lists: Record<string, string[]> = {};
    const { data: ls } = await admin.from('recipient_lists').select('id, emails');
    (ls ?? []).forEach((l: any) => { lists[l.id] = l.emails ?? []; });
    const fromLists = (ids?: string[]) => (ids ?? []).flatMap((id) => lists[id] ?? []);
    let to = only?.to?.length ? only.to : (a.notify?.enabled ? [...splitMails(a.notify.to), ...fromLists(a.notify.lists)] : []);
    const ruleHits: string[] = [];
    if (!only) (a.rules ?? []).forEach((r) => { if (ruleMatches(r, vars, lead)) { to = to.concat(splitMails(r.to), fromLists(r.lists)); ruleHits.push(r.label || r.field); } });
    to = [...new Set(to.map((x) => x.toLowerCase()))];
    if (to.length) {
      const subject = render(a.notify?.subject || 'Neue Anfrage: {{funnel}}', vars) + (ruleHits.length ? ' · ' + ruleHits.join(', ') : '');
      const intro = render(a.notify?.body || 'Es ist eine neue Anfrage über „{{funnel}}“ eingegangen.', vars);
      const html = emailHtml({ funnel, title: subject, intro, fields, total: vars.total, cta: { label: 'Im Dashboard öffnen', url: vars.link } });
      await log('email', to.join(', '), await sendMail(to, subject, html, lead.email || undefined));
    }
  }

  // 2) Bestätigung an den Interessenten
  if ((!only && a.confirm?.enabled && lead.email) || only?.kind === 'confirm') {
    const target = only?.to?.[0] || lead.email;
    const subject = render(a.confirm?.subject || 'Danke für deine Anfrage, {{vorname|}}', vars);
    const intro = render(a.confirm?.body || 'Wir haben deine Anfrage erhalten und melden uns in Kürze bei dir.', vars);
    const html = emailHtml({ funnel, title: subject, intro, fields: fields.filter((f) => f.inputType !== 'email' && f.inputType !== 'tel' && f.type !== 'checkbox'), total: vars.total, footer: funnel.name });
    await log('email', target, await sendMail([target], subject, html, a.confirm?.replyTo || undefined));
  }

  // 3) Webhooks
  if (!only || only.kind === 'webhook') {
    const payload = { event: 'lead.created', test: !!only, created_at: lead.created_at, funnel: { id: funnel.id, name: funnel.name, slug: funnel.slug },
      lead: { id: lead.id, name: lead.name, email: lead.email, phone: lead.phone, total: +lead.total || 0, status: lead.status, fields, values: lead.data?.values ?? {}, answers: lead.data?.answers ?? {}, items: lead.data?.items ?? [], utm: lead.data?.utm ?? {} } };
    for (const h of (a.webhooks ?? []).filter((h) => h.url && h.active !== false && (!only?.hookId || h.id === only.hookId))) {
      if (h.events && h.events.length && !h.events.includes('lead.created')) continue;
      await log('webhook', h.url, await sendHook(h, 'lead.created', payload));
    }
  }
  return results;
}

const SAMPLE = (funnel: any) => ({
  id: 'test', name: 'Max Mustermann', email: 'max@beispiel.de', phone: '+49 170 1234567', total: 2490, status: 'neu', created_at: new Date().toISOString(),
  data: { fields: [{ key: 'beispiel', label: 'Beispiel-Frage', value: 'Beispiel-Antwort' }, { key: 'vorname', label: 'Vorname', value: 'Max', type: 'input' }, { key: 'email', label: 'E-Mail', value: 'max@beispiel.de', type: 'input', inputType: 'email' }] },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = env('SUPABASE_URL'), service = env('SUPABASE_SERVICE_ROLE_KEY'), anon = env('SUPABASE_ANON_KEY');
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const body = await req.json().catch(() => ({}));

    // a) Aufruf durch den Datenbank-Trigger
    const secret = req.headers.get('x-taptell-secret');
    if (secret) {
      if (!env('LEAD_NOTIFY_SECRET') || secret !== env('LEAD_NOTIFY_SECRET')) return json({ error: 'Ungültig' }, 401);
      const { data: lead } = await admin.from('leads').select('*').eq('id', body.lead_id).single();
      if (!lead) return json({ error: 'Lead nicht gefunden' }, 404);
      if (lead.data?.test) return json({ ok: true, skipped: 'Testlead' });
      const { data: funnel } = await admin.from('funnels').select('*').eq('id', lead.funnel_id).single();
      if (!funnel) return json({ error: 'Funnel nicht gefunden' }, 404);
      return json({ ok: true, results: await processLead(admin, lead, funnel) });
    }

    // b) Testversand aus dem Dashboard (nur Admins)
    const caller = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: 'Nicht angemeldet' }, 401);
    const { data: me } = await admin.from('profiles').select('role, email').eq('id', user.id).single();
    if (me?.role !== 'admin') return json({ error: 'Keine Berechtigung' }, 403);
    const { data: funnel } = await admin.from('funnels').select('*').eq('id', body.funnel_id).single();
    if (!funnel) return json({ error: 'Funnel nicht gefunden – erst speichern' }, 404);
    if (body.automation) funnel.settings = { ...(funnel.settings ?? {}), automation: body.automation }; // ungespeicherte Änderungen testen
    const to = splitMails(body.to || me.email);
    const results = await processLead(admin, SAMPLE(funnel), funnel, { kind: body.test, hookId: body.webhook_id, to });
    return json({ ok: true, results });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
