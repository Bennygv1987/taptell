// Shared by the dashboard build and the Supabase mail sender.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function samplePrice(funnel) {
  if (+funnel.settings?.basePrice) return +funnel.settings.basePrice;
  for (const page of funnel.pages || []) {
    for (const block of page.blocks || []) {
      for (const option of block.props?.options || []) {
        if (+option.price || +option.unitPrice) return +option.price || +option.unitPrice;
      }
    }
  }
  return 0;
}

export function sampleLead(funnel) {
  const name = 'Max Mustermann', email = 'max@beispiel.de', phone = '+49 170 1234567';
  const values = {name, vorname:'Max', email, telefon:phone}, fields = [];
  for (const page of funnel.pages || []) for (const block of page.blocks || []) {
    const {key, label, question, inputType, options, def} = block.props || {};
    if (!key || !['choice','input','slider','rating','calendar','checkbox'].includes(block.type)) continue;
    const value = values[key] || (inputType === 'email' ? email : inputType === 'tel' ? phone : options?.[0]?.label || def || 'Beispiel');
    fields.push({key, label:label || question || page.name || key, type:block.type, inputType, value:String(value)});
  }
  return {id:'test',name,email,phone,total:samplePrice(funnel),status:'neu',created_at:new Date().toISOString(),data:{fields}};
}

const money = (n, cur = 'EUR') => new Intl.NumberFormat('de-DE', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n || 0);
export function varsFor(lead, funnel, origin) {
  const data = lead.data ?? {};
  const fields = data.fields ?? [];
  const v = Object.create(null);
  fields.forEach((f) => { if (f.key) v[f.key] = String(f.value ?? ''); });
  v.funnel = funnel.name ?? '';
  v.name = lead.name ?? v.name ?? '';
  v.vorname = v.vorname || String(lead.name ?? '').split(' ')[0] || '';
  v.email = lead.email ?? v.email ?? '';
  v.telefon = lead.phone ?? v.telefon ?? '';
  v.total = +lead.total ? money(+lead.total, funnel.settings?.currency) : '';
  v.datum = new Date(lead.created_at ?? Date.now()).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
  v.link = origin ? origin.replace(/\/$/, '') + '/#contacts' : '';
  return v;
}
export function renderText(tpl, vars) {
  return String(tpl ?? '').replace(/\{\{\s*([\w.-]+)\s*(?:\|([^}]*))?\}\}/g, (_m, k, fb) => (vars[k] ? vars[k] : (fb ?? '').trim()));
}
function assetUrl(src, origin) {
  if (!src) return '';
  try {
    const url = new URL(src, origin || undefined);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function mailRender(html, v, primary) {
  const P = primary || '#18181b';
  return String(html || '')
    .replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\{\{\s*([\w.-]+)\s*(?:\|([^}]*))?\}\}/g, (_m, k, fb) => esc(v[k] ? v[k] : String(fb ?? '').trim()))
    .replace(/<p>/g, '<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#3d424d">')
    .replace(/<h2>/g, '<h2 style="margin:0 0 10px;font-size:20px;line-height:1.3;color:#12141a">')
    .replace(/<h3>/g, '<h3 style="margin:0 0 8px;font-size:17px;line-height:1.35;color:#12141a">')
    .replace(/<(ul|ol)>/g, '<$1 style="margin:0 0 12px;padding-left:22px;font-size:15px;line-height:1.6;color:#3d424d">')
    .replace(/<hr>/g, '<hr style="border:0;border-top:1px solid #e6e8ec;margin:18px 0">')
    .replace(/<a data-btn="[^"]*" href="([^"]*)">|<a href="([^"]*)" data-btn="[^"]*">/g, (_m, h1, h2) => `<a href="${h1 || h2}" style="display:inline-block;background:${P};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 18px;border-radius:8px;margin:4px 0 12px">`)
    .replace(/<a href="([^"]*)">/g, `<a href="$1" style="color:${P}">`);
}

export function renderAutomationEmail({config = {}, vars, kind, fields = [], funnel, origin, subject}) {
  const p = funnel.theme?.primary || '#1c2e3d';
  const logo = assetUrl(funnel.theme?.logoImg, origin);
  const images = new Map();
  for (const page of funnel.pages || []) for (const block of page.blocks || []) {
    for (const option of block.props?.options || []) if (option.img) images.set(option.label, assetUrl(option.img, origin));
  }
  const defaultBody = kind === 'confirm' ? 'Wir haben deine Anfrage erhalten und melden uns in Kürze bei dir.' : 'Es ist eine neue Anfrage über „{{funnel}}“ eingegangen.';
  const plain = config.body ?? defaultBody;
  const introHtml = mailRender(config.html ?? esc(plain).replace(/\n/g,'<br>'), vars, p);
  if (config.fields === false) fields = [];
  if (kind === 'confirm') fields = fields.filter(f => !['email','tel'].includes(f.inputType) && f.type !== 'checkbox');
  const rows = fields.filter((f) => f.value && f.type !== 'signature').map((f) => {
    const first = String(f.value).split(', ')[0], img = images.get(first);
    return `<tr><td style="padding:10px 0;border-bottom:1px solid #eef0f3;color:#737985;font-size:13px;width:42%;vertical-align:top">${esc(f.label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eef0f3;font-size:14px;color:#12141a;vertical-align:top">${img ? `<img src="${esc(img)}" width="44" height="44" style="border-radius:6px;object-fit:cover;vertical-align:middle;margin-right:8px" alt="">` : ''}${esc(f.value)}</td></tr>`;
  }).join('');
  const answerTable = rows ? `<table width="100%" cellpadding="0" cellspacing="0">${rows}</table>` : '';
  const total = (config.total ?? (config.fields !== false)) ? vars.total : '';
  const totalBlock = total ? `<div style="background:#f5f6f8;border-radius:8px;padding:12px 14px;font-size:14px;color:#3d424d">Gesamt: <b style="color:#12141a">${esc(total)}</b></div>` : '';
  if (config.customLayout) {
    const slots = {nachricht_html:introHtml, antworten_html:answerTable, preis_html:totalBlock};
    return String(config.layoutHtml ?? '{{nachricht_html}}').replace(/\{\{\s*([\w.-]+)\s*(?:\|([^}]*))?\}\}/g,
      (_, key, fallback) => Object.hasOwn(slots, key) ? slots[key] : esc(key === 'betreff' ? subject : (vars[key] || (fallback || '').trim())));
  }
  const layoutVars = {...vars, betreff:subject};
  const heading = renderText(config.headingText ?? '{{betreff}}', layoutVars);
  const footer = renderText(config.footerText ?? (kind === 'confirm' ? '{{funnel}}' : 'Gesendet mit TapTell'), layoutVars);
  const button = renderText(config.buttonText ?? 'Im Dashboard öffnen', layoutVars);
  return `<!doctype html><html><body style="margin:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:32px 12px"><tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e8ec">
    <tr><td style="height:4px;background:${esc(p)}"></td></tr>
    <tr><td style="padding:28px 32px 8px">${logo && config.showLogo !== false ? `<img src="${esc(logo)}" height="36" alt="" style="display:block;margin-bottom:20px">` : ''}
      ${heading ? `<h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:#12141a">${esc(heading)}</h1>` : ''}
      <div style="font-size:15px;line-height:1.6;color:#3d424d">${introHtml}</div></td></tr>
    ${answerTable ? `<tr><td style="padding:16px 32px 4px">${answerTable}</td></tr>` : ''}
    ${totalBlock ? `<tr><td style="padding:12px 32px 0">${totalBlock}</td></tr>` : ''}
    ${kind === 'notify' && button && vars.link ? `<tr><td style="padding:24px 32px 0"><a href="${esc(vars.link)}" style="display:inline-block;background:${esc(p)};color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 18px;border-radius:8px">${esc(button)}</a></td></tr>` : ''}
    ${footer ? `<tr><td style="padding:28px 32px;font-size:12px;color:#9aa0ab">${esc(footer)}</td></tr>` : ''}
  </table></td></tr></table></body></html>`;
}


export function automationMessage(options) {
  const config = options.config || {};
  if (config.format === 'plain') {
    return {text:renderText(config.plainBody ?? config.body ?? '', options.vars)};
  }
  return {html:renderAutomationEmail(options)};
}
