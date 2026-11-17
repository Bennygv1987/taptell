// Supabase Edge Function „domain-manage“ – eigene Domains für Funnels (nur Admins)
// Aktionen: add { hostname, funnel_id } · verify { id } · remove { id }
//
// Funktioniert ohne Hoster-Zugang: TapTell zeigt den nötigen DNS-Eintrag (CNAME) und prüft ihn
// per DNS-over-HTTPS. Liegt ein Vercel-Token vor, wird die Domain zusätzlich automatisch im
// Vercel-Projekt angelegt (inkl. SSL-Zertifikat durch Vercel).
//
// Secrets (supabase secrets set …):
//   DOMAIN_TARGET      – Ziel des CNAME, z. B. cname.vercel-dns.com oder app.taptell.de
//   VERCEL_TOKEN       – optional, Vercel Access Token
//   VERCEL_PROJECT_ID  – optional, ID des Vercel-Projekts der App
//   VERCEL_TEAM_ID     – optional, falls das Projekt in einem Team liegt
// Deploy: supabase functions deploy domain-manage
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const env = (k: string) => Deno.env.get(k) ?? '';
const target = () => (env('DOMAIN_TARGET') || 'cname.vercel-dns.com').toLowerCase().replace(/\.$/, '');

async function vercel(path: string, init: RequestInit = {}) {
  const team = env('VERCEL_TEAM_ID') ? `${path.includes('?') ? '&' : '?'}teamId=${env('VERCEL_TEAM_ID')}` : '';
  const r = await fetch(`https://api.vercel.com${path}${team}`, { ...init, headers: { Authorization: `Bearer ${env('VERCEL_TOKEN')}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) } });
  return { ok: r.ok, status: r.status, body: await r.json().catch(() => ({})) };
}
const useVercel = () => !!(env('VERCEL_TOKEN') && env('VERCEL_PROJECT_ID'));

async function dnsCname(host: string): Promise<string[]> {
  const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(host)}&type=CNAME`);
  const j = await r.json().catch(() => ({}));
  return (j.Answer ?? []).filter((a: any) => a.type === 5).map((a: any) => String(a.data).toLowerCase().replace(/\.$/, ''));
}
const instructions = (host: string) => ({ type: 'CNAME', name: host.split('.').slice(0, -2).join('.') || '@', host, value: target() });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = env('SUPABASE_URL'), anon = env('SUPABASE_ANON_KEY'), service = env('SUPABASE_SERVICE_ROLE_KEY');
    const caller = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: 'Nicht angemeldet' }, 401);
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'admin') return json({ error: 'Keine Berechtigung' }, 403);

    const body = await req.json();

    if (body.action === 'add') {
      const host = String(body.hostname ?? '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return json({ error: 'Bitte eine gültige Domain eingeben, z. B. konfigurator.firma.de' }, 400);
      const { data: f } = await admin.from('funnels').select('id, client_id').eq('id', body.funnel_id).single();
      if (!f) return json({ error: 'Funnel nicht gefunden – erst speichern' }, 404);
      let detail: Record<string, unknown> = { dns: instructions(host) };
      if (useVercel()) {
        const v = await vercel(`/v10/projects/${env('VERCEL_PROJECT_ID')}/domains`, { method: 'POST', body: JSON.stringify({ name: host }) });
        if (!v.ok && v.body?.error?.code !== 'domain_already_in_use') return json({ error: 'Vercel: ' + (v.body?.error?.message ?? v.status) }, 400);
        detail = { ...detail, vercel: { verified: !!v.body?.verified, verification: v.body?.verification ?? [] } };
      }
      const row = { id: crypto.randomUUID().replace(/-/g, '').slice(0, 16), hostname: host, funnel_id: f.id, client_id: f.client_id, status: 'pending', detail };
      const { error } = await admin.from('domains').upsert(row, { onConflict: 'hostname' });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, domain: row });
    }

    const { data: d } = await admin.from('domains').select('*').eq('id', body.id).single();
    if (!d) return json({ error: 'Domain nicht gefunden' }, 404);

    if (body.action === 'verify') {
      const cn = await dnsCname(d.hostname);
      let ok = cn.includes(target()), note = ok ? 'DNS-Eintrag korrekt' : (cn.length ? `CNAME zeigt auf ${cn.join(', ')} statt ${target()}` : 'Noch kein CNAME-Eintrag gefunden (DNS-Änderungen brauchen manchmal bis zu einige Stunden)');
      const detail: Record<string, unknown> = { ...d.detail, cname: cn };
      if (useVercel()) {
        const v = await vercel(`/v9/projects/${env('VERCEL_PROJECT_ID')}/domains/${d.hostname}`);
        const c = await vercel(`/v6/domains/${d.hostname}/config`);
        const vOk = !!v.body?.verified && c.body?.misconfigured === false;
        detail.vercel = { verified: !!v.body?.verified, misconfigured: c.body?.misconfigured, verification: v.body?.verification ?? [] };
        ok = ok || vOk; if (vOk) note = 'Domain aktiv, SSL wird von Vercel bereitgestellt';
      }
      const status = ok ? 'active' : 'pending';
      await admin.from('domains').update({ status, detail: { ...detail, note }, checked_at: new Date().toISOString() }).eq('id', d.id);
      return json({ ok: true, status, note, detail });
    }

    if (body.action === 'remove') {
      if (useVercel()) await vercel(`/v9/projects/${env('VERCEL_PROJECT_ID')}/domains/${d.hostname}`, { method: 'DELETE' });
      await admin.from('domains').delete().eq('id', d.id);
      return json({ ok: true });
    }

    return json({ error: 'Unbekannte Aktion' }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
