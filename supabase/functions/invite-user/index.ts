// Supabase Edge Function: Kundenlogins einladen / löschen (nur für Admins)
// Deploy: supabase functions deploy invite-user
import { createClient } from 'npm:@supabase/supabase-js@2.119.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Aufrufer prüfen
    const caller = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: 'Nicht angemeldet' }, 401);

    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'admin') return json({ error: 'Keine Berechtigung' }, 403);

    const body = await req.json();

    if (body.action === 'delete') {
      if (!body.user_id) return json({ error: 'user_id fehlt' }, 400);
      if (body.user_id === user.id) return json({ error: 'Das eigene Konto kann nicht gelöscht werden' }, 400);
      const { error } = await admin.auth.admin.deleteUser(body.user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    const email = String(body.email ?? '').trim().toLowerCase();
    if (!email || !body.client_id) return json({ error: 'E-Mail und Kunde sind erforderlich' }, 400);

    const { data: client } = await admin.from('clients').select('id').eq('id', body.client_id).single();
    if (!client) return json({ error: 'Kunde existiert nicht' }, 400);

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: body.redirectTo,
      data: { name: body.name ?? '' },
    });
    if (error) return json({ error: error.message }, 400);

    const profile = { id: data.user.id, role: 'client', client_id: body.client_id, name: body.name ?? '', email };
    const { error: e2 } = await admin.from('profiles').upsert(profile);
    if (e2) return json({ error: e2.message }, 400);

    return json({ ok: true, profile });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
