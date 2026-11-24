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
import { automationMessage, sampleLead, varsFor, renderText } from '../_shared/automation-mail.mjs';
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
type MailOptions = {
  enabled?: boolean; subject?: string; body?: string; html?: string;
  format?: 'html' | 'plain'; plainBody?: string;
  fields?: boolean; total?: boolean; customLayout?: boolean; layoutHtml?: string;
  headingText?: string; footerText?: string; showLogo?: boolean;
};
type Automation = {
  notify?: MailOptions & { to?: string; lists?: string[]; ruleSubject?: boolean; buttonText?: string };
  confirm?: MailOptions & { replyTo?: string };
  rules?: Rule[];
  webhooks?: Hook[];
};

const env = (k: string) => Deno.env.get(k) ?? '';
const splitMails = (s?: string) => String(s ?? '').split(/[\s,;]+/).map((x) => x.trim().toLowerCase()).filter((x) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- E-Mail-Versand ----------
async function sendMail(to: string[], subject: string, message: { text: string } | { html: string }, replyTo?: string) {
  const key = env('RESEND_API_KEY');
  if (!key) return { status: 'skipped' as const, error: 'RESEND_API_KEY fehlt' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('MAIL_FROM') || 'TapTell <anfragen@taptell.de>', to, subject, ...message, ...(replyTo ? { reply_to: replyTo } : {}) }),
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
  const vars = varsFor(lead, funnel, env('APP_URL'));
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
      const subject = renderText(a.notify?.subject ?? 'Neue Anfrage: {{funnel}}', vars) + (ruleHits.length && a.notify?.ruleSubject !== false ? ' · ' + ruleHits.join(', ') : '');
      const message = automationMessage({ config:a.notify, vars, kind:'notify', fields, funnel, origin:env('APP_URL'), subject });
      await log('email', to.join(', '), await sendMail(to, subject, message, lead.email || undefined));
    }
  }

  // 2) Bestätigung an den Interessenten
  if ((!only && a.confirm?.enabled && lead.email) || only?.kind === 'confirm') {
    const target = only?.to?.[0] || lead.email;
    const subject = renderText(a.confirm?.subject ?? 'Danke für deine Anfrage, {{vorname|}}', vars);
    const message = automationMessage({ config:a.confirm, vars, kind:'confirm', fields, funnel, origin:env('APP_URL'), subject });
    await log('email', target, await sendMail([target], subject, message, a.confirm?.replyTo || undefined));
  }

  // 3) Webhooks
  if (!only || only.kind === 'webhook') {
    // Onepage-kompatibel: die beim Absenden berechnete Onepage-Struktur unverändert senden
    const onepage = funnel.settings?.webhookFormat === 'onepage' && lead.data?.onepage
      ? { ...lead.data.onepage, data: { ...lead.data.onepage.data, id: lead.data.onepage.data?.id || lead.id, source: { ...(lead.data.onepage.data?.source ?? {}), page: { ...(lead.data.onepage.data?.source?.page ?? {}), slug: '/' + (funnel.slug ?? '') } } } }
      : null;
    const payload = onepage ?? { event: 'lead.created', test: !!only, created_at: lead.created_at, funnel: { id: funnel.id, name: funnel.name, slug: funnel.slug },
      lead: { id: lead.id, name: lead.name, email: lead.email, phone: lead.phone, total: +lead.total || 0, status: lead.status, fields, values: lead.data?.values ?? {}, answers: lead.data?.answers ?? {}, items: lead.data?.items ?? [], utm: lead.data?.utm ?? {} } };
    for (const h of (a.webhooks ?? []).filter((h) => h.url && h.active !== false && (!only?.hookId || h.id === only.hookId))) {
      if (h.events && h.events.length && !h.events.includes('lead.created')) continue;
      await log('webhook', h.url, await sendHook(h, 'lead.created', payload));
    }
  }
  return results;
}

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
    const results = await processLead(admin, sampleLead(funnel), funnel, { kind: body.test, hookId: body.webhook_id, to });
    return json({ ok: true, results });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
