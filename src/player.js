(function(){
"use strict";
var FP = {};
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
var UL = '<svg class="fp-ulsv" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8.5C20 4 38 3 56 4.6S84 8 98 4" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>';
var md = function(s){ return esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/==(.+?)==/g,'<span class="fp-hl">$1</span>').replace(/__(.+?)__/g,'<span class="fp-ul">$1'+UL+'</span>').replace(/\[\[(.+?)\]\]/g,'<mark class="fp-mk">$1</mark>').replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\n/g,'<br>'); };
FP.esc = esc; FP.md = md;

var IC = {
  check:'<svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36 6.3 20.36l1.09-6.35-4.62-4.5 6.38-.93z"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>',
  img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};
var BI = function(d){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>'; };
FP.BTN_ICONS = {
  arrow:BI('<path d="M5 12h14M13 6l6 6-6 6"/>'), chevron:BI('<path d="M9 6l6 6-6 6"/>'), send:BI('<path d="M21.5 2.5L10.5 13.5"/><path d="M21.5 2.5l-7 19-4-8-8-4z"/>'),
  check:BI('<path d="M5 12.5l4.5 4.5L19 7.5"/>'), calendar:BI('<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
  phone:BI('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>'), download:BI('<path d="M12 4v12M6 10l6 6 6-6"/><path d="M4 20h16"/>'),
  star:BI('<path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36 6.3 20.36l1.09-6.35-4.62-4.5 6.38-.93z"/>'), heart:BI('<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/>'),
  gift:BI('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5"/>'), lock:BI('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>'),
  sparkle:BI('<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/>'), mail:BI('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>')
};
FP.IC = IC;

var W5 = '400;500;600;700;800', W4 = '400;500;600;700';
FP.FONT_META = {
  'Inter':['sans',W5],'Inter Tight':['sans',W5],'Onest':['sans',W5],'Geist':['sans',W5],'Plus Jakarta Sans':['sans',W5],'DM Sans':['sans',W5],'Manrope':['sans',W5],'Outfit':['sans',W5],'Poppins':['sans',W5],
  'Montserrat':['sans',W5],'Open Sans':['sans',W5],'Roboto':['sans',W5],'Nunito':['sans',W5],'Raleway':['sans',W5],'Work Sans':['sans',W5],'Rubik':['sans',W5],'Lexend':['sans',W5],
  'Figtree':['sans',W5],'Sora':['sans',W5],'Archivo':['sans',W5],'Barlow':['sans',W5],'Lato':['sans','400;700'],'Space Grotesk':['sans',W4],'Bricolage Grotesque':['sans',W5],'Syne':['sans',W5],
  'Fraunces':['serif',W5],'Playfair Display':['serif',W5],'Lora':['serif',W4],'Cormorant Garamond':['serif',W4],'Libre Baskerville':['serif','400;700'],'Instrument Serif':['serif',''],'DM Serif Display':['serif',''],
  'Bebas Neue':['display',''],'Caveat':['display',W4],'Pacifico':['display','']
};
FP.FONTS = Object.keys(FP.FONT_META);
FP.SYSTEM_FONTS = {'System':"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"};
FP.fontLink = function(f){ if(!f || FP.SYSTEM_FONTS[f]) return ''; var m = FP.FONT_META[f]; return 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g,'+') + (m && m[1] ? ':wght@' + m[1] : '') + '&display=swap'; };
FP.fontsUrl = function(list){ return FP.fontLink((list||[]).filter(Boolean)[0]); };
FP.fontStack = function(f){ return FP.SYSTEM_FONTS[f] || ("'"+f+"',system-ui,sans-serif"); };
FP.usedFonts = function(f){ var t = f.theme || {}, out = [t.font, t.headingFont]; FP.allBlocks(f).forEach(function(b){ if(b.props && b.props.ff) out.push(b.props.ff); }); return out.filter(function(x, i, a){ return x && a.indexOf(x) === i; }); };

FP.themeVars = function(t){
  t = t || {};
  return '--p:'+(t.primary||'#4353ff')+';--pt:'+(t.primaryText||'#fff')+';--bg:'+(t.bg||'#fff')+';--sf:'+(t.surface||'#f4f5f7')+';--tx:'+(t.text||'#111318')+';--mt:'+(t.muted||'#6b7280')+';--r:'+(t.radius!=null?t.radius:14)+'px;--br:'+(t.btnRadius!=null?t.btnRadius:12)+'px;--ff:'+FP.fontStack(t.font||'Inter')+';--hf:'+FP.fontStack(t.headingFont||t.font||'Inter')+';'
    +'--sc:'+((+t.scale||100)/100)+';--hw:'+(t.headingWeight||700)+';--hls:'+((t.headingLs!=null&&t.headingLs!==''?+t.headingLs:-2)/100)+'em;--htt:'+(t.headingUpper?'uppercase':'none')+';--lh:'+(t.lineHeight||1.55)+';--bpy:'+(t.btnPad!=null&&t.btnPad!==''?t.btnPad:16)+'px;--bw:'+(t.btnWeight||600)+';--btt:'+(t.btnUpper?'uppercase':'none')+';--bls:'+(t.btnUpper?'.05em':'normal')+';--pad:'+(t.pad!=null&&t.pad!==''?t.pad:20)+'px;';
};

FP.allBlocks = function(f){ var out=[]; (f.pages||[]).forEach(function(p){ (p.blocks||[]).forEach(function(b){ out.push(b); }); }); return out; };
var keyOf = function(b){ return (b.props && b.props.key) || b.id; };
FP.keyOf = keyOf;

FP.money = function(n, cur){
  try { return new Intl.NumberFormat('de-DE',{style:'currency',currency:cur||'EUR',maximumFractionDigits:0}).format(n||0); }
  catch(e){ return Math.round(n||0) + ' €'; }
};
var WD = ['So','Mo','Di','Mi','Do','Fr','Sa'];
var fmtDate = function(iso){ if(!iso) return ''; var d = new Date(iso+'T12:00:00'); return WD[d.getDay()]+', '+d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}); };
FP.fmtDate = fmtDate;

FP.computeTotal = function(f, answers){
  var s = f.settings || {}, items = [], fixed = 0, unitSum = 0, qty = null, unit = '', score = 0;
  if(+s.basePrice){ fixed += +s.basePrice; items.push({label:s.baseLabel||'Grundpreis', amount:+s.basePrice}); }
  var unitItems = [];
  FP.allBlocks(f).forEach(function(b){
    var v = answers[keyOf(b)];
    if(b.type === 'choice' && v != null){
      [].concat(v).forEach(function(id){
        var o = (b.props.options||[]).filter(function(o){ return o.id === id; })[0];
        if(!o) return;
        if(+o.score) score += +o.score;
        if(+o.price){ fixed += +o.price; items.push({label:o.label, amount:+o.price}); }
        if(+o.unitPrice){ unitSum += +o.unitPrice; unitItems.push(o); }
      });
    }
    if((b.type === 'slider' || (b.type === 'input' && b.props.inputType === 'number')) && b.props.isQuantity){
      var raw = v != null && v !== '' && !isNaN(+v) ? +v : +b.props.def || 0, fac = +b.props.qtyFactor || 1, qv = raw * fac;
      qty = qty == null ? qv : qty * qv; if(b.props.unit && !unit) unit = b.props.unit;
    }
  });
  if(qty != null) qty = Math.round(qty * 100) / 100;
  var q = qty == null ? 1 : qty;
  unitItems.forEach(function(o){ items.push({label:o.label, amount:o.unitPrice*q, detail: FP.money(o.unitPrice, s.currency)+(unit?'/'+unit:'')+(qty!=null?' × '+q.toLocaleString('de-DE')+' '+unit:'')}); });
  return {items:items, total: fixed + unitSum*q, qty:qty, unit:unit, score:score};
};

/* Preisanzeige nach außen: exakt, Spanne oder „ab“ – intern bleibt der exakte Wert */
FP.roundPrice = function(n, r){ r = +r || 0; return r > 0 ? Math.round(n / r) * r : n; };
FP.priceText = function(f, total){
  var s = f.settings || {}, cur = s.currency, r = s.priceRound, mode = s.priceMode || 'exact';
  if(mode === 'range'){ var pct = s.priceRange != null && s.priceRange !== '' ? +s.priceRange : 10; return FP.money(FP.roundPrice(total * (1 - pct/100), r), cur) + ' – ' + FP.money(FP.roundPrice(total * (1 + pct/100), r), cur); }
  if(mode === 'from') return 'ab ' + FP.money(FP.roundPrice(total, r), cur);
  return FP.money(FP.roundPrice(total, r), cur);
};
FP.readable = function(f, answers){
  var out = [];
  (f.pages||[]).forEach(function(pg){ (pg.blocks||[]).forEach(function(b){
    var k = keyOf(b), v = answers[k], p = b.props || {};
    if(v == null || v === '' || (Array.isArray(v) && !v.length)) return;
    var label = p.question || p.label || (b.type === 'input' && p.placeholder ? String(p.placeholder).replace(/\s*\(optional\)\s*$/i,'') : '') || pg.name || k, val = v, extra = null;
    if(b.type === 'choice') val = [].concat(v).map(function(id){ var o=(p.options||[]).filter(function(o){return o.id===id;})[0]; return o?o.label:''; }).filter(Boolean).join(', ');
    else if(b.type === 'slider') val = v + (p.unit ? ' ' + p.unit : '');
    else if(b.type === 'rating') val = p.style === 'nps' ? v + ' / 10' : p.style === 'emoji' || p.style === 'slider' ? v + ' / ' + FP.rateMax(p) + ' ' + FP.faceFor(p, +v) : v + ' / ' + (p.max||5) + ' ★';
    else if(b.type === 'calendar') val = fmtDate(v.date) + (v.time ? ' · ' + v.time + ' Uhr' : '');
    else if(b.type === 'checkbox'){ label = 'Einwilligung'; val = v ? 'Ja' : 'Nein'; }
    else if(b.type === 'signature'){ val = 'Unterschrieben'; extra = v; }
    else if(b.type === 'upload'){ val = v.name; extra = v.data || null; }
    else if(typeof v === 'object') return;
    out.push({key:k, label:String(label).replace(/\*\*|==/g,''), value:String(val), type:b.type, image:extra, inputType:p.inputType});
  }); });
  return out;
};

/* Personalisierung: {{schluessel}} oder {{schluessel|Ersatztext}} */
FP.VAR_RE = /\{\{\s*([\w.-]+)\s*(?:\|([^}]*))?\}\}/g;
FP.vars = function(f){
  var out = [], seen = {}, add = function(k, l, t){ if(!k || seen[k]) return; seen[k] = 1; out.push({key:k, label:l, type:t}); };
  (f.pages||[]).forEach(function(pg){ (pg.blocks||[]).forEach(function(b){
    var p = b.props || {}; if(!p.key || ['choice','input','slider','rating','calendar'].indexOf(b.type) < 0) return;
    add(p.key, String(p.label || p.question || pg.name || p.key).replace(/\*\*|==|__|\[\[|\]\]/g,'').replace(/\{\{[^}]*\}\}/g,'…').trim(), b.type);
  }); });
  if(seen.name && !seen.vorname) add('vorname', 'Vorname (aus Name)', 'input');
  add('total', 'Gesamtpreis (wie angezeigt)', 'calc'); add('total_exakt', 'Gesamtpreis (exakt)', 'calc'); add('score', 'Punktzahl', 'calc');
  return out;
};
FP.varValue = function(k, f, answers, map){
  if(k === 'total') return FP.priceText(f, FP.computeTotal(f, answers).total);
  if(k === 'total_exakt') return FP.money(FP.computeTotal(f, answers).total, (f.settings||{}).currency);
  if(k === 'score') return String(FP.computeTotal(f, answers).score);
  if(k === 'vorname' && !map.vorname && map.name) return String(map.name).split(' ')[0];
  return map[k] != null ? String(map[k]) : '';
};
FP.interp = function(text, f, answers){
  if(!text || String(text).indexOf('{{') < 0) return text;
  var map = {}, empty = false;
  FP.readable(f, answers || {}).forEach(function(x){ map[x.key] = x.value; });
  var out = String(text).replace(FP.VAR_RE, function(m, k, fb){
    var v = FP.varValue(k, f, answers || {}, map);
    if(v === '' && fb != null) v = fb.trim();
    if(v === '') empty = true;
    return v;
  });
  /* leere Variablen ohne Ersatztext: Satzzeichen aufräumen („Danke, !“ → „Danke!“) */
  if(empty && /^\s*\{\{/.test(text)) out = out.replace(/^[ ,]+/, '').replace(/^\S/, function(c){ return c.toUpperCase(); });
  if(empty) out = out.replace(/[ \t]+([,.!?:;])/g, '$1').replace(/,([!?.])/g, '$1').replace(/[ \t]{2,}/g, ' ').replace(/^[ ,]+/, '');
  return out;
};
/* Im Editor: Variablen als sichtbare Marken statt leerem Text */
FP.interpEdit = function(text, f){
  if(!text || String(text).indexOf('{{') < 0) return {text:text, tokens:[]};
  var vars = FP.vars(f), tokens = [];
  var out = String(text).replace(FP.VAR_RE, function(m, k, fb){
    var v = vars.filter(function(x){ return x.key === k; })[0];
    tokens.push({label:v ? v.label : k, missing:!v, fb:fb});
    return '\u0001' + (tokens.length - 1) + '\u0002';
  });
  return {text:out, tokens:tokens};
};

function ytId(u){ var m = String(u||'').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; }
function vimeoId(u){ var m = String(u||'').match(/vimeo\.com\/(?:video\/)?(\d+)/); return m ? m[1] : null; }

function initials(n){ return String(n||'?').split(' ').map(function(s){return s[0];}).join('').slice(0,2).toUpperCase(); }

/* Bewertung: Emoji-Sätze */
FP.EMO_SETS = {2:['👎','👍'], 3:['🙁','😐','😀'], 4:['😥','🙁','🙂','😀'], 5:['😥','🙁','😐','🙂','😀'], 6:['😫','😥','🙁','🙂','😀','🤩'], 7:['😫','😥','🙁','😐','🙂','😀','🤩']};
FP.emojiList = function(p){
  var custom = String(p.emojis || '').trim().split(/\s+/).filter(Boolean);
  if(custom.length >= 2) return custom;
  var n = Math.max(2, Math.min(7, +p.max || 5)); return FP.EMO_SETS[n] || FP.EMO_SETS[5];
};
FP.rateMax = function(p){ return p.style === 'emoji' ? FP.emojiList(p).length : p.style === 'nps' ? 10 : (+p.max || (p.style === 'slider' ? 10 : 5)); };
FP.faceFor = function(p, v){ var list = FP.emojiList(p), mx = FP.rateMax(p), mn = p.style === 'nps' ? 0 : 1; var t = mx > mn ? (v - mn) / (mx - mn) : 0; return list[Math.max(0, Math.min(list.length - 1, Math.round(t * (list.length - 1))))]; };
FP.renderBlock = function(b, ctx){
  var p = b.props || {}, a = ctx.answers || {}, k = keyOf(b), err = ctx.errors && ctx.errors[b.id], v = a[k], cur = (ctx.f.settings||{}).currency, h = '';
  var T = function(s){
    if(!ctx.edit) return md(FP.interp(s, ctx.f, a));
    var r = FP.interpEdit(s, ctx.f);
    return md(r.text).replace(/\u0001(\d+)\u0002/g, function(m, i){ var t = r.tokens[+i]; return '<span class="fp-var'+(t.missing?' miss':'')+'" title="'+(t.missing?'Unbekannte Variable':'Wird durch die Eingabe ersetzt')+(t.fb?' · sonst „'+esc(t.fb)+'“':'')+'">'+esc(t.label)+'</span>'; });
  };
  var rq = p.required ? '<span class="rq">*</span>' : '';
  var label = function(t){ return t ? '<label class="fp-lbl">'+T(t)+rq+'</label>' : ''; };
  switch(b.type){
    case 'heading':
      var lv = p.level || 1;
      h = '<h'+lv+' class="fp-h'+lv+'" style="'+(p.color?'color:'+p.color+';':'')+(p.size?'font-size:'+p.size+'px;':'')+'">'+T(p.text)+'</h'+lv+'>';
      break;
    case 'text':
      h = '<p class="fp-txt" style="'+(p.color?'color:'+p.color+';':'')+(p.size?'font-size:'+p.size+'px;':'')+'">'+T(p.text)+'</p>';
      break;
    case 'badge':
      h = '<span class="fp-badge '+(p.variant||'')+(p.upper?' up':'')+'">'+T(p.text)+'</span>';
      break;
    case 'image':
      var ih = p.ratio ? 'aspect-ratio:'+esc(String(p.ratio).replace(':','/'))+';height:auto;' : p.height ? 'height:'+p.height+'px;' : '';
      h = p.src ? '<img class="fp-img" src="'+esc(p.src)+'" alt="'+esc(p.alt)+'" style="border-radius:'+(p.radius!=null?p.radius:14)+'px;'+ih+(p.fit==='contain'?'object-fit:contain;':'')+'">'
        : '<div class="fp-ph" style="border-radius:'+(p.radius!=null?p.radius:14)+'px;height:'+(p.height||180)+'px">'+IC.img+'Bild hochladen</div>';
      break;
    case 'video':
      var id = ytId(p.url), vid = vimeoId(p.url), src = id ? 'https://www.youtube-nocookie.com/embed/'+id+'?rel=0&modestbranding=1' : vid ? 'https://player.vimeo.com/video/'+vid : '';
      h = '<div class="fp-vid" style="border-radius:'+(p.radius!=null?p.radius:14)+'px">' + (ctx.live && src ? '<iframe src="'+src+'" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
        : '<div class="play"><span>'+IC.play+'</span></div><div class="cap">'+esc(src ? (id?'YouTube':'Vimeo')+' · wird im Live-Funnel abgespielt' : 'YouTube- oder Vimeo-Link einfügen')+'</div>') + '</div>';
      break;
    case 'button':
      var th = ctx.f.theme || {}, bv = p.variant || th.btnVariant || '';
      if(bv === 'filled') bv = '';
      var ic = p.icon != null && p.icon !== '' ? p.icon : (p.arrow === false ? 'none' : 'arrow'), icH = ic !== 'none' && FP.BTN_ICONS[ic] ? FP.BTN_ICONS[ic] : '';
      var cls = 'fp-btn ' + bv + (p.shadow!==false?' shadow':'') + (p.full===false?' auto':'') + (p.pulse?' pulse':'');
      var bst = (p.btnBg ? '--p:'+p.btnBg+';' : '') + (p.btnColor ? '--pt:'+p.btnColor+';' : '') + (p.radiusOn ? '--br:'+(+p.radius||0)+'px;' : '');
      var subIn = p.sub && p.subIn;
      var lbl = subIn ? '<span class="tx"><span class="ln">'+T(p.label||'Weiter')+'</span><span class="sb">'+T(p.sub)+'</span></span>' : '<span>'+T(p.label||'Weiter')+'</span>';
      if(subIn) cls += ' two';
      h = '<button class="'+cls+'" style="'+bst+'" data-act="btn" data-bid="'+b.id+'">'+(p.iconLeft?icH+lbl:lbl+icH)+'</button>' + (p.sub && !subIn ? '<span class="fp-sub">'+T(p.sub)+'</span>' : '');
      break;
    case 'choice':
      var sel = [].concat(v == null ? [] : v), lay = p.layout || 'list';
      h = (p.question ? '<p class="fp-q">'+T(p.question)+rq+'</p>' : '') + (p.desc ? '<p class="fp-qd">'+T(p.desc)+'</p>' : '');
      if(lay === 'scale'){
        h += '<div class="fp-scale">' + (p.options||[]).map(function(o){ return '<button class="fp-sopt'+(sel.indexOf(o.id)>=0?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'" title="'+esc(o.label)+'">'+(o.icon?'<span class="si">'+esc(o.icon)+'</span>':'<span class="sl">'+esc(o.label)+'</span>')+'</button>'; }).join('') + '</div>';
        if(p.minLabel || p.maxLabel) h += '<div class="fp-rlab"><span>'+esc(p.minLabel)+'</span><span>'+esc(p.maxLabel)+'</span></div>';
        break;
      }
      var ratio = lay==='image' && p.ratio ? String(p.ratio).replace(':','/') : '';
      h += '<div class="fp-opts '+lay+((lay==='image'&&p.cols===1)?' one':'')+((lay==='grid'&&p.cols===3)?' grid3':'')+((lay==='image'||lay==='grid')&&+p.colsD>1?' cd'+(+p.colsD):'')+'"'+(ratio?' style="--ir:'+esc(ratio)+'"':'')+'>';
      (p.options||[]).forEach(function(o){
        var on = sel.indexOf(o.id) >= 0;
        var price = p.showPrices && (+o.price || +o.unitPrice) ? '<span class="pr">'+(+o.price ? '+ '+FP.money(o.price,cur) : FP.money(o.unitPrice,cur)+(o.unitLabel?' / '+esc(o.unitLabel):''))+'</span>' : '';
        var chk = '<span class="chk'+(p.multi?' sq':'')+'">'+IC.check+'</span>';
        if(lay === 'image'){
          var bg = o.img ? 'background-image:url(&quot;'+o.img+'&quot;)'+(o.pos?';background-position:'+esc(o.pos):'') :'background:linear-gradient(135deg,color-mix(in srgb,var(--p) 18%,var(--sf)),var(--sf))';
          h += '<button class="fp-opt'+(on?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'"><span class="im" style="'+bg+'">'+(o.img?'':esc(o.icon||''))+'</span><span class="lbl">'+esc(o.label)+(o.sub?'<span class="sub">'+esc(o.sub)+'</span>':'')+price+'</span>'+chk+'</button>';
        } else {
          h += '<button class="fp-opt'+(on?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'">'+(o.icon?'<span class="ico">'+esc(o.icon)+'</span>':'')+'<span class="lbl">'+esc(o.label)+(o.sub?'<span class="sub">'+esc(o.sub)+'</span>':'')+price+'</span>'+chk+'</button>';
        }
      });
      h += '</div>';
      break;
    case 'input':
      var it = p.inputType || 'text', icon = it==='email'?IC.mail:it==='tel'?IC.phone:p.icon==='user'?IC.user:'';
      var val = v == null ? '' : esc(v);
      var field = it === 'textarea' ? '<textarea class="fp-in" data-key="'+esc(k)+'" data-bid="'+b.id+'" placeholder="'+esc(ctx.edit?p.placeholder:FP.interp(p.placeholder, ctx.f, a))+'">'+val+'</textarea>'
        : '<div class="fp-iw">'+(icon?'<span class="ii">'+icon+'</span>':'')+'<input class="fp-in" type="'+(it==='tel'?'tel':it==='email'?'email':it==='number'?'number':it==='date'?'date':'text')+'" data-key="'+esc(k)+'" data-bid="'+b.id+'" placeholder="'+esc(ctx.edit?p.placeholder:FP.interp(p.placeholder, ctx.f, a))+'" value="'+val+'" autocomplete="'+(it==='email'?'email':it==='tel'?'tel':/name/i.test(k)?'name':'on')+'"></div>';
      h = '<div class="fp-field">'+label(p.label)+field+'</div>';
      break;
    case 'slider':
      var sv = v != null ? +v : +(p.def != null ? p.def : p.min);
      var pct = ((sv - p.min) / ((p.max - p.min) || 1)) * 100;
      h = label(p.label) + '<div class="fp-rv"><span data-rv="'+b.id+'">'+sv.toLocaleString('de-DE')+'</span><small>'+esc(p.unit)+'</small></div>'
        + '<input type="range" class="fp-range" data-key="'+esc(k)+'" data-bid="'+b.id+'" min="'+p.min+'" max="'+p.max+'" step="'+(p.step||1)+'" value="'+sv+'" style="--fill:'+pct+'%">'
        + '<div class="fp-rl"><span>'+(+p.min).toLocaleString('de-DE')+' '+esc(p.unit)+'</span><span>'+(+p.max).toLocaleString('de-DE')+' '+esc(p.unit)+'</span></div>';
      break;
    case 'rating':
      if(p.style === 'nps'){
        h = label(p.label) + '<div class="fp-nps">';
        for(var n=0;n<=10;n++) h += '<button class="'+(v===n?'on':'')+'" data-act="rate" data-bid="'+b.id+'" data-v="'+n+'">'+n+'</button>';
        h += '</div><div class="fp-rlab"><span>'+esc(p.minLabel||'Unwahrscheinlich')+'</span><span>'+esc(p.maxLabel||'Sehr wahrscheinlich')+'</span></div>';
      } else if(p.style === 'emoji'){
        var el2 = FP.emojiList(p);
        h = label(p.label) + '<div class="fp-emo n'+el2.length+'">' + el2.map(function(e, i){ return '<button class="'+(v===i+1?'on':'')+(v!=null&&v!==i+1?' dim':'')+'" data-act="rate" data-bid="'+b.id+'" data-v="'+(i+1)+'" aria-label="'+(i+1)+' von '+el2.length+'">'+esc(e)+'</button>'; }).join('') + '</div>'
          + (p.minLabel||p.maxLabel ? '<div class="fp-rlab"><span>'+esc(p.minLabel)+'</span><span>'+esc(p.maxLabel)+'</span></div>' : '');
      } else if(p.style === 'slider'){
        var smx = FP.rateMax(p), sv2 = v != null ? +v : Math.round((1 + smx) / 2), pc2 = smx > 1 ? (sv2 - 1) / (smx - 1) * 100 : 0;
        h = label(p.label) + '<div class="fp-face'+(v==null?' idle':'')+'" data-face="'+b.id+'">'+esc(FP.faceFor(p, sv2))+'</div>'
          + (p.showValue !== false ? '<div class="fp-rv fp-rv-c"><span data-rv="'+b.id+'">'+(v==null?'–':sv2)+'</span><small>/ '+smx+'</small></div>' : '')
          + '<input type="range" class="fp-range fp-rate" data-key="'+esc(k)+'" data-bid="'+b.id+'" min="1" max="'+smx+'" step="1" value="'+sv2+'" style="--fill:'+pc2+'%" aria-label="Bewertung">'
          + (p.minLabel||p.maxLabel ? '<div class="fp-rlab"><span>'+esc(p.minLabel)+'</span><span>'+esc(p.maxLabel)+'</span></div>' : '')
          + (v==null && !ctx.edit ? '<div class="fp-hint-c">Regler bewegen</div>' : '');
      } else {
        var mx = p.max || 5;
        h = label(p.label) + '<div class="fp-stars">';
        for(var s=1;s<=mx;s++) h += '<button class="fp-star'+(v>=s?' on':'')+'" data-act="rate" data-bid="'+b.id+'" data-v="'+s+'" aria-label="'+s+' Sterne">'+IC.star+'</button>';
        h += '</div>' + (p.minLabel||p.maxLabel ? '<div class="fp-rlab"><span>'+esc(p.minLabel)+'</span><span>'+esc(p.maxLabel)+'</span></div>' : '');
      }
      break;
    case 'signature':
      h = label(p.label) + '<div class="fp-sig'+(v?' has':'')+'" data-sig="'+b.id+'"><canvas data-key="'+esc(k)+'" data-bid="'+b.id+'"></canvas><div class="line"></div><div class="hint">'+esc(p.hint||'Hier mit dem Finger unterschreiben')+'</div><button class="clr" data-act="sigclr" data-bid="'+b.id+'">Löschen</button></div>';
      break;
    case 'checkbox':
      h = '<button class="fp-cb'+(v?' on':'')+'" data-act="cb" data-bid="'+b.id+'"><span class="box">'+IC.check+'</span><span>'+T(p.text)+rq+'</span></button>';
      break;
    case 'spacer':
      h = '<div style="height:'+(p.height||24)+'px"></div>';
      break;
    case 'divider':
      h = '<hr class="fp-hr">';
      break;
    case 'list':
      h = '<ul class="fp-list">' + (p.items||[]).map(function(it, i){ return '<li><span class="li">'+(p.icon==='number'?(i+1):p.icon==='emoji'?'':IC.check)+'</span><span>'+T(it)+'</span></li>'; }).join('') + '</ul>';
      if(p.icon==='emoji') h = h.replace(/<span class="li"><\/span>/g,'');
      break;
    case 'testimonial':
      h = '<div class="fp-testi">'+(p.stars?'<div class="st">'+'★★★★★'.slice(0,p.stars)+'</div>':'')+(p.quote?'<p>'+T(p.quote)+'</p>':'')+'<div class="au"><div class="av" style="'+(p.img?'background-image:url(&quot;'+p.img+'&quot;)':'')+'">'+(p.img?'':esc(initials(p.name)))+'</div><div><div class="nm">'+esc(p.name)+'</div><div class="ro">'+esc(p.role)+'</div></div></div></div>';
      break;
    case 'faq':
      h = '<div class="fp-faq">' + (p.items||[]).map(function(it){ return '<details><summary>'+esc(it.q)+'</summary><p>'+md(it.a)+'</p></details>'; }).join('') + '</div>';
      break;
    case 'summary':
      var t = FP.computeTotal(ctx.f, a), sset = ctx.f.settings || {}, exact = (sset.priceMode||'exact') === 'exact';
      var tot = (p.prefix && exact ? esc(p.prefix)+' ' : '') + esc(FP.priceText(ctx.f, t.total));
      var row = function(it){ return '<div class="row"><span>'+esc(it.label)+(it.detail && exact?'<small>'+esc(it.detail)+'</small>':'')+'</span><span>'+(exact?FP.money(it.amount,cur):IC.check)+'</span></div>'; };
      if(p.compact){
        h = '<div class="fp-sum compact" data-sum="'+b.id+'"><div class="lab">'+esc(p.title||'Geschätzter Preis')+'</div><b>'+tot+'</b>'+(p.note?'<div class="nt">'+T(p.note)+'</div>':'')+'</div>';
      } else if(p.variant === 'offer'){
        var d = new Date(), vd = +p.validDays || 14, until = new Date(d.getTime() + vd*864e5);
        h = '<div class="fp-sum offer" data-sum="'+b.id+'"><div class="oh"><div><h4>'+T(p.title||'Dein persönliches Angebot')+'</h4><div class="od">Erstellt am '+d.toLocaleDateString('de-DE')+' · gültig bis '+until.toLocaleDateString('de-DE')+'</div></div>'+IC.check.replace('<svg','<svg class="ok"')+'</div>';
        if(p.showItems !== false){ if(!t.items.length) h += '<div class="row"><span>Noch keine Auswahl</span><span>–</span></div>'; t.items.forEach(function(it){ h += row(it); }); }
        h += '<div class="tot"><span>'+esc(p.totalLabel||'Gesamtpreis')+'</span><b>'+tot+'</b></div><div class="nt">'+(p.note?T(p.note):(exact?'Inkl. MwSt. · unverbindlich':'Unverbindliche Preisspanne – das genaue Angebot erhältst du nach kurzer Prüfung.'))+'</div></div>';
      } else {
        h = '<div class="fp-sum" data-sum="'+b.id+'"><h4>'+T(p.title||'Deine Zusammenfassung')+'</h4>';
        if(p.showItems !== false){ if(!t.items.length) h += '<div class="row"><span>Noch keine Auswahl</span><span>–</span></div>'; t.items.forEach(function(it){ h += row(it); }); }
        h += '<div class="tot"><span>'+esc(p.totalLabel||'Gesamt')+'</span><b>'+tot+'</b></div>'+(p.note?'<div class="nt">'+T(p.note)+'</div>':'')+'</div>';
      }
      break;
    case 'trust':
      h = '<div class="fp-trust">' + (p.items||[]).map(function(it){ return '<span>'+esc(it)+'</span>'; }).join('') + '</div>';
      break;
    case 'calendar':
      var days = [], d = new Date(), ex = p.excludeDays || [0];
      d.setDate(d.getDate() + (+p.offset || 1));
      while(days.length < (+p.days || 10)){ if(ex.indexOf(d.getDay()) < 0) days.push(new Date(d)); d.setDate(d.getDate()+1); }
      var cv = v || {};
      h = label(p.label) + '<div class="fp-days">' + days.map(function(x){ var iso = x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); return '<button class="fp-day'+(cv.date===iso?' sel':'')+'" data-act="day" data-bid="'+b.id+'" data-v="'+iso+'"><small>'+WD[x.getDay()]+'</small><b>'+x.getDate()+'</b><small>'+x.toLocaleDateString('de-DE',{month:'short'}).replace('.','')+'</small></button>'; }).join('') + '</div>';
      if(cv.date || ctx.edit) h += '<div class="fp-slots">' + (p.slots||[]).map(function(sl){ return '<button class="fp-slot'+(cv.time===sl?' sel':'')+'" data-act="slot" data-bid="'+b.id+'" data-v="'+esc(sl)+'">'+esc(sl)+'</button>'; }).join('') + '</div>';
      break;
    case 'upload':
      h = label(p.label) + '<label class="fp-up">' + (v && v.data ? '<img src="'+v.data+'" alt="">' : IC.up) + '<b>'+esc(v ? v.name : (p.cta||'Datei auswählen'))+'</b><span>'+esc(v ? 'Tippen zum Ersetzen' : (p.hint||'JPG, PNG oder PDF'))+'</span><input type="file" data-up="'+b.id+'" accept="'+esc(p.accept||'image/*,.pdf')+'"></label>';
      break;
    case 'countdown':
      var end = ctx.startedAt ? ctx.startedAt + (+p.minutes||15)*60000 : Date.now() + (+p.minutes||15)*60000;
      var left = Math.max(0, end - Date.now()), mm = Math.floor(left/60000), ss = Math.floor(left%60000/1000);
      h = (p.label ? '<p class="fp-txt" style="margin-bottom:10px">'+T(p.label)+'</p>' : '') + '<div class="fp-cd" data-cd="'+end+'"><div><b data-mm>'+String(mm).padStart(2,'0')+'</b><small>Min</small></div><div><b data-ss>'+String(ss).padStart(2,'0')+'</b><small>Sek</small></div></div>';
      break;
    case 'html':
      h = '<div class="fp-html">'+(p.code||'')+'</div>';
      break;
    default: h = '';
  }
  var t0 = (ctx.f && ctx.f.theme) || {};
  var st = 'text-align:'+(p.align||'left')+';margin-top:'+(+p.mt||0)+'px;margin-bottom:'+(p.mb!=null&&p.mb!==''?+p.mb:16)+'px;';
  if(p.ff) st += '--ff:'+FP.fontStack(p.ff)+';--hf:'+FP.fontStack(p.ff)+';font-family:var(--ff);';
  if(p.fw) st += '--hw:'+p.fw+';--tw:'+p.fw+';--bw:'+p.fw+';font-weight:'+p.fw+';';
  if(p.scale && +p.scale !== 100) st += '--sc:'+((+t0.scale||100)/100*(+p.scale/100))+';';
  if(p.ls !== undefined && p.ls !== '' && p.ls !== null) st += '--hls:'+(p.ls/100)+'em;--bls:'+(p.ls/100)+'em;letter-spacing:'+(p.ls/100)+'em;';
  if(p.lh) st += '--lh:'+p.lh+';line-height:'+p.lh+';';
  if(p.tt) st += '--htt:'+p.tt+';--btt:'+p.tt+';text-transform:'+p.tt+';';
  if(p.it) st += 'font-style:italic;';
  if(p.color && b.type !== 'heading' && b.type !== 'text') st += '--tx:'+p.color+';--mt:'+p.color+';color:'+p.color+';';
  var boxed = p.bgc || +p.bwid || p.shd;
  if(p.bgc) st += 'background:'+p.bgc+';';
  if(+p.pad) st += 'padding:'+p.pad+'px;';
  if(boxed || (p.brad !== undefined && p.brad !== '')) st += 'border-radius:'+(p.brad !== undefined && p.brad !== '' ? p.brad+'px' : 'var(--r)')+';';
  if(+p.bwid) st += 'border:'+p.bwid+'px solid '+(p.bc||'color-mix(in srgb,var(--tx) 14%,transparent)')+';';
  if(p.shd) st += 'box-shadow:'+({sm:'0 1px 3px rgba(0,0,0,.08)',md:'0 8px 24px -8px rgba(0,0,0,.18)',lg:'0 20px 50px -14px rgba(0,0,0,.3)'}[p.shd]||'none')+';';
  var cl = 'fp-b'+(err?' fp-err':'')+(p.half?' half':'')+(p.vis&&p.vis!=='all'?' fp-vis-'+p.vis:'');
  if(p.anim && p.anim !== 'none' && !ctx.edit && !ctx.noAnim){ cl += ' fp-ea-'+p.anim; if(+p.delay) st += 'animation-delay:'+p.delay+'ms;'; }
  return '<div class="'+cl+'" data-bid="'+b.id+'" data-type="'+b.type+'" style="'+st+'"'+(ctx.edit?' draggable="true"':'')+'>'+h+(err?'<div class="fp-errmsg">'+esc(err)+'</div>':'')+'</div>';
};

FP.hasButton = function(page){ return (page.blocks||[]).some(function(b){ return b.type==='button' || (b.type==='choice' && b.props.autoNext && !b.props.multi) || (b.type==='rating' && b.props.autoNext); }); };

FP.renderShell = function(f, idx, inner, opts){
  opts = opts || {};
  var t = f.theme || {}, n = f.pages.length, page = f.pages[idx] || {};
  var bgImg = page.bgImage || t.bgImage;
  var baseBg = page.bg || t.bg || '#fff';
  var style = FP.themeVars(t) + (bgImg ? 'background-image:url(&quot;'+bgImg+'&quot;);' : (t.bgGrad ? 'background-image:linear-gradient('+(t.bgAngle||180)+'deg,'+baseBg+','+(t.bg2||baseBg)+');' : '')) + (page.bg ? 'background-color:'+page.bg+';--sbg:'+page.bg+';' : '');
  var showProg = t.progress !== 'none' && !page.hideProgress;
  var pct = n > 1 ? Math.round(idx/(n-1)*100) : 100;
  var prog = '';
  if(showProg){
    if(t.progress === 'steps'){ prog = '<div class="fp-steps">'; for(var i=0;i<n;i++) prog += '<i class="'+(i<=idx?'on':'')+'"></i>'; prog += '</div>'; }
    else prog = '<div class="fp-prog"><i style="width:'+Math.max(pct,4)+'%"></i></div>';
  }
  var logo = t.logoImg ? '<div class="fp-logo"><img src="'+t.logoImg+'" alt=""'+(+t.logoH?' style="max-height:'+(+t.logoH)+'px;max-width:'+(+t.logoH*5)+'px"':'')+'></div>' : t.logoText ? '<div class="fp-logo">'+esc(t.logoText)+'</div>' : '';
  var head = (logo || opts.back) ? '<div class="fp-head'+(t.logoAlign==='left'?' left':'')+(opts.back?' hb':'')+'">'+(opts.back?'<button class="fp-back" data-act="back" aria-label="Zurück">'+IC.back+'</button>':'')+logo+'</div>' : '';
  var ov = bgImg ? '<div class="fp-ov" style="background:'+(t.overlay||'rgba(0,0,0,.35)')+'"></div>' : '';
  var top = (head || prog) ? '<div class="fp-top">'+(t.progressTop?prog+head:head+prog)+'</div>' : '<div style="height:10px"></div>';
  var foot = t.footer ? '<div class="fp-foot">'+md(t.footer)+'</div>' : '';
  var cls = 'fp'+(opts.edit?' is-edit':'')+(page.wide?' wide':'')+(t.inputStyle&&t.inputStyle!=='outline'?' in-'+t.inputStyle:'')+(t.optStyle&&t.optStyle!=='filled'?' opt-'+t.optStyle:'')+(t.progressTop?' prog-top':'');
  var css = t.customCss ? '<style>'+String(t.customCss).replace(/<\/style/gi,'')+'</style>' : '';
  return '<div class="'+cls+'" style="'+style+'">'+css+ov+top+'<div class="fp-body">'+inner+'</div>'+foot+'</div>';
};

FP.renderPage = function(f, idx, ctx){
  var page = f.pages[idx]; if(!page) return '';
  ctx = ctx || {}; ctx.f = f; ctx.answers = ctx.answers || {};
  var t = f.theme || {};
  var blocks = page.blocks || [], stickyId = null, last = blocks[blocks.length-1];
  if(t.stickyCta && last && last.type === 'button') stickyId = last.id;
  var inner = blocks.map(function(b){ var r = FP.renderBlock(b, ctx); return b.id === stickyId ? '<div class="fp-sticky">'+r+'</div>' : r; }).join('');
  if(!FP.hasButton(page) && idx < f.pages.length - 1 && page.autoButton !== false){
    var av = t.btnVariant && t.btnVariant !== 'filled' ? t.btnVariant : '';
    var ab = '<div class="fp-b fp-auto" style="margin-top:6px"><button class="fp-btn shadow '+av+'" data-act="next"><span>'+esc(page.buttonLabel||t.nextLabel||'Weiter')+'</span>'+FP.BTN_ICONS.arrow+'</button></div>';
    inner += t.stickyCta ? '<div class="fp-sticky">'+ab+'</div>' : ab;
  }
  if(ctx.edit && !(page.blocks||[]).length) inner = '<div class="fp-empty-drop">Elemente hierher ziehen</div>' + inner;
  var anim = ctx.edit || ctx.noAnim ? '' : (t.animation === 'none' ? '' : ' fp-anim-' + (t.animation||'slide') + (ctx.dir==='back'?' back':''));
  var body = '<div class="fp-page'+(page.vcenter?' v-center':'')+anim+'" data-page="'+page.id+'">'+inner+'</div>';
  return FP.renderShell(f, idx, body, {edit:ctx.edit, back:ctx.back});
};

/* ---------- interactive runtime ---------- */
FP.mount = function(root, f, opts){
  opts = opts || {};
  var st = {i:0, hist:[], answers:{}, errors:{}, dir:'fwd', started:false, done:false, startedAt:Date.now()};
  var pages = f.pages;
  var hasSubmit = FP.allBlocks(f).some(function(b){ return b.type==='button' && b.props.action==='submit'; });
  var emit = function(t, d){ if(opts.onEvent) try{ opts.onEvent(t, d||{}); }catch(e){} };
  var timer = null;
  emit('view'); emit('page', {pageId:pages[0] && pages[0].id, index:0});

  function blockById(id){ var r=null; pages.forEach(function(p){ p.blocks.forEach(function(b){ if(b.id===id) r=b; }); }); return r; }
  function scroller(){ return opts.scrollEl || root.closest && root.closest('[data-fp-scroll]') || document.scrollingElement; }

  /* stay = gleiche Seite neu zeichnen (ohne Einblend-Animation, Scrollposition bleibt) */
  function render(stay){
    var page = pages[st.i];
    page.blocks.forEach(function(b){ if(b.type === 'slider' && st.answers[keyOf(b)] == null) st.answers[keyOf(b)] = +(b.props.def != null ? b.props.def : b.props.min); });
    var sc = stay ? scroller() : null, top = sc ? sc.scrollTop : 0;
    root.innerHTML = FP.renderPage(f, st.i, {answers:st.answers, errors:st.errors, dir:st.dir, live:opts.live, noAnim:!!stay, back: st.hist.length>0 && !st.done && page.allowBack!==false && (f.theme||{}).backButton!==false, startedAt:st.startedAt});
    if(sc) sc.scrollTop = top;
    initSignatures(); initCountdown();
  }
  /* Auswahl direkt im DOM markieren – kein Neuaufbau, kein Flackern */
  function clearErr(b){ var w = root.querySelector('.fp-b[data-bid="'+b.id+'"]'); if(w && w.classList.contains('fp-err')){ w.classList.remove('fp-err'); var m = w.querySelector('.fp-errmsg'); if(m) m.remove(); } }
  function markSelection(b){
    var v = st.answers[keyOf(b)], sel = [].concat(v == null ? [] : v);
    if(b.type === 'choice'){
      root.querySelectorAll('[data-act="opt"][data-bid="'+b.id+'"]').forEach(function(el){ el.classList.toggle('sel', sel.indexOf(el.getAttribute('data-oid')) >= 0); });
    } else if(b.type === 'rating'){
      root.querySelectorAll('[data-act="rate"][data-bid="'+b.id+'"]').forEach(function(el){
        var n = +el.getAttribute('data-v');
        if(el.classList.contains('fp-star')) el.classList.toggle('on', v >= n);
        else { el.classList.toggle('on', v === n); if(b.props.style === 'emoji') el.classList.toggle('dim', v != null && v !== n); }
      });
    } else if(b.type === 'checkbox'){
      var cb = root.querySelector('[data-act="cb"][data-bid="'+b.id+'"]'); if(cb) cb.classList.toggle('on', !!v);
    }
    clearErr(b); refreshSums(); refreshVars();
  }
  /* Texte mit {{variablen}} auf derselben Seite live nachziehen */
  function refreshVars(){
    var page = pages[st.i]; if(!page) return;
    page.blocks.forEach(function(b){
      var p = b.props || {}, uses = ['text','label','question','desc','sub','title','note','quote'].some(function(k){ return typeof p[k] === 'string' && p[k].indexOf('{{') >= 0; });
      if(!uses || ['choice','rating','checkbox','input'].indexOf(b.type) >= 0) return;
      var w = root.querySelector('.fp-b[data-bid="'+b.id+'"]'); if(!w) return;
      var tmp = document.createElement('div'); tmp.innerHTML = FP.renderBlock(b, {f:f, answers:st.answers, errors:st.errors, live:opts.live, noAnim:true});
      var n = tmp.firstElementChild; if(n && n.innerHTML !== w.innerHTML) w.innerHTML = n.innerHTML;
    });
  }

  function validate(){
    var page = pages[st.i], errs = {}, ok = true;
    page.blocks.forEach(function(b){
      var p = b.props||{}, v = st.answers[keyOf(b)];
      if(b.type === 'input' && v && p.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){ errs[b.id] = 'Bitte gib eine gültige E-Mail-Adresse ein.'; ok = false; return; }
      if(b.type === 'input' && v && p.inputType === 'tel' && String(v).replace(/\D/g,'').length < 6){ errs[b.id] = 'Bitte gib eine gültige Telefonnummer ein.'; ok = false; return; }
      if(!p.required) return;
      var empty = v == null || v === '' || v === false || (Array.isArray(v) && !v.length);
      if(b.type === 'calendar' && v && !v.time) empty = true;
      if(b.type === 'slider') empty = false;
      if(empty){ ok = false; errs[b.id] = p.errorText || (b.type==='choice'?'Bitte wähle eine Option.':b.type==='checkbox'?'Bitte bestätige dies, um fortzufahren.':b.type==='signature'?'Bitte unterschreibe hier.':b.type==='calendar'?'Bitte wähle Tag und Uhrzeit.':'Dieses Feld ist erforderlich.'); }
    });
    st.errors = errs;
    return ok;
  }

  function resolveTarget(target){
    var page = pages[st.i];
    if(target) return target;
    var routed = null;
    page.blocks.forEach(function(b){
      if(b.type==='choice' && !b.props.multi){
        var v = st.answers[keyOf(b)], o = (b.props.options||[]).filter(function(o){return o.id===v;})[0];
        if(o && o.goto) routed = o.goto;
      }
    });
    if(!routed) page.blocks.forEach(function(b){
      if(b.type === 'rating' && (b.props.routes||[]).length){
        var rv = st.answers[keyOf(b)]; if(rv == null) return;
        (b.props.routes||[]).forEach(function(r){ if(!routed && r.goto && rv >= +r.min && rv <= +r.max) routed = r.goto; });
      }
    });
    if(routed) return routed;
    if(page.scoreRoutes && page.scoreRoutes.length){
      var sc = FP.computeTotal(f, st.answers).score;
      for(var i=0;i<page.scoreRoutes.length;i++){ var r = page.scoreRoutes[i]; if(sc >= +r.min && sc <= +r.max && r.goto) return r.goto; }
    }
    if(page.next) return page.next;
    return null;
  }

  function go(target, skipValidate){
    if(!skipValidate && !validate()){ render(true); var e = root.querySelector('.fp-err'); if(e && e.scrollIntoView) e.scrollIntoView({block:'center',behavior:'smooth'}); return false; }
    st.errors = {};
    if(!st.started){ st.started = true; emit('start'); }
    var tid = resolveTarget(target), ni = tid ? pages.map(function(p){return p.id;}).indexOf(tid) : st.i + 1;
    if(ni < 0 || ni >= pages.length){ if(!st.done && !hasSubmit) submit(); return true; }
    st.hist.push(st.i); st.i = ni; st.dir = 'fwd';
    emit('page', {pageId:pages[ni].id, index:ni});
    if((ni === pages.length-1 || pages[ni].submitOnEnter) && !st.done) submit(true);
    render(); var sc = scroller(); if(sc) sc.scrollTop = 0;
    return true;
  }
  function back(){ if(!st.hist.length) return; st.i = st.hist.pop(); st.dir = 'back'; st.errors = {}; render(); }

  function submit(silent){
    if(st.done) return;
    st.done = true;
    var r = FP.readable(f, st.answers), tot = FP.computeTotal(f, st.answers);
    var lead = {answers: JSON.parse(JSON.stringify(st.answers)), fields:r, total:tot.total, items:tot.items, score:tot.score, durationSec: Math.round((Date.now()-st.startedAt)/1000)};
    r.forEach(function(x){
      if(x.inputType === 'email' && !lead.email) lead.email = x.value;
      else if(x.inputType === 'tel' && !lead.phone) lead.phone = x.value;
      else if(/name/i.test(x.key) && x.type==='input' && x.inputType!=='email') lead.name = lead.name ? lead.name + ' ' + x.value : x.value;
    });
    emit('complete', lead);
    if(opts.onSubmit) opts.onSubmit(lead);
    if(!silent && st.i === pages.length-1){ root.innerHTML = FP.renderShell(f, st.i, '<div class="fp-done"><div class="ok">'+IC.ok+'</div><h2 class="fp-h2">Vielen Dank!</h2><p class="fp-txt">Deine Angaben sind bei uns eingegangen.</p></div>', {}); }
  }

  function setAns(b, val){ st.answers[keyOf(b)] = val; if(st.errors[b.id]){ delete st.errors[b.id]; } }

  function refreshSums(){
    root.querySelectorAll('[data-sum]').forEach(function(el){
      var b = blockById(el.getAttribute('data-sum')); if(!b) return;
      var tmp = document.createElement('div'); tmp.innerHTML = FP.renderBlock(b, {f:f, answers:st.answers});
      var n = tmp.querySelector('[data-sum]'); if(n) el.replaceWith(n);
    });
  }

  root.addEventListener('click', function(e){
    if(e.target.closest('a[href]')) return;
    var el = e.target.closest('[data-act]'); if(!el || !root.contains(el)) return;
    var act = el.getAttribute('data-act'), b = blockById(el.getAttribute('data-bid'));
    if(act !== 'sigclr') e.preventDefault();
    if(act === 'next') go();
    else if(act === 'back') back();
    else if(act === 'btn'){
      var p = b.props, a = p.action || 'next';
      if(a === 'url'){ if(opts.onUrl) opts.onUrl(p.url); else window.location.href = p.url; }
      else if(a === 'submit'){ if(!validate()){ render(true); var e2 = root.querySelector('.fp-err'); if(e2 && e2.scrollIntoView) e2.scrollIntoView({block:'center',behavior:'smooth'}); return; } submit(); go(p.target || null, true); }
      else if(a === 'page') go(p.target);
      else go();
    }
    else if(act === 'opt'){
      var oid = el.getAttribute('data-oid'), k = keyOf(b);
      if(b.props.multi){
        var arr = [].concat(st.answers[k] || []), ix = arr.indexOf(oid);
        if(ix >= 0) arr.splice(ix,1); else { if(b.props.maxSelect && arr.length >= +b.props.maxSelect) arr.shift(); arr.push(oid); }
        setAns(b, arr); markSelection(b);
      } else {
        setAns(b, oid); markSelection(b);
        if(b.props.autoNext){ clearTimeout(timer); timer = setTimeout(function(){ go(); }, 260); }
      }
    }
    else if(act === 'rate'){ setAns(b, +el.getAttribute('data-v')); markSelection(b); if(b.props.autoNext){ clearTimeout(timer); timer = setTimeout(function(){ go(); }, 300);} }
    else if(act === 'cb'){ setAns(b, !st.answers[keyOf(b)]); markSelection(b); }
    else if(act === 'day'){ var cv = st.answers[keyOf(b)] || {}; setAns(b, {date:el.getAttribute('data-v'), time: cv.time}); render(true); }
    else if(act === 'slot'){ var cv2 = st.answers[keyOf(b)] || {}; if(!cv2.date) return; setAns(b, {date:cv2.date, time:el.getAttribute('data-v')}); render(true); }
    else if(act === 'sigclr'){ e.preventDefault(); delete st.answers[keyOf(b)]; render(true); }
  });

  root.addEventListener('change', function(e){
    var el = e.target; if(!el || el.type !== 'range') return;
    var b = blockById(el.getAttribute('data-bid')); if(!b || b.type !== 'rating' || !b.props.autoNext) return;
    clearTimeout(timer); timer = setTimeout(function(){ go(); }, 450);
  });
  root.addEventListener('input', function(e){
    var el = e.target, k = el.getAttribute && el.getAttribute('data-key'); if(!k) return;
    var b = blockById(el.getAttribute('data-bid'));
    if(el.type === 'range' && b && b.type === 'rating'){
      var rv0 = +el.value, rmx = FP.rateMax(b.props); setAns(b, rv0);
      el.style.setProperty('--fill', (rmx > 1 ? (rv0 - 1) / (rmx - 1) * 100 : 0) + '%');
      var fc = root.querySelector('[data-face="'+b.id+'"]'); if(fc){ var nf = FP.faceFor(b.props, rv0); if(fc.textContent !== nf){ fc.textContent = nf; fc.classList.remove('pop'); void fc.offsetWidth; fc.classList.add('pop'); } fc.classList.remove('idle'); }
      var rvv = root.querySelector('[data-rv="'+b.id+'"]'); if(rvv) rvv.textContent = rv0;
      var hn = el.parentNode.querySelector('.fp-hint-c'); if(hn) hn.remove();
      var er = el.closest('.fp-b'); if(er && er.classList.contains('fp-err')){ er.classList.remove('fp-err'); var em = er.querySelector('.fp-errmsg'); if(em) em.remove(); }
      return;
    }
    if(el.type === 'range'){
      var v = +el.value; st.answers[k] = v;
      var pct = ((v - b.props.min) / ((b.props.max - b.props.min)||1)) * 100; el.style.setProperty('--fill', pct+'%');
      var rv = root.querySelector('[data-rv="'+b.id+'"]'); if(rv) rv.textContent = v.toLocaleString('de-DE');
      refreshSums();
    } else {
      st.answers[k] = el.value;
      if(st.errors[b.id]){ delete st.errors[b.id]; var w = el.closest('.fp-b'); if(w){ w.classList.remove('fp-err'); var m = w.querySelector('.fp-errmsg'); if(m) m.remove(); } }
      if(b && b.props.isQuantity) refreshSums();
    }
  });

  root.addEventListener('change', function(e){
    var el = e.target; if(!el.getAttribute || !el.getAttribute('data-up')) return;
    var b = blockById(el.getAttribute('data-up')), file = el.files && el.files[0]; if(!file) return;
    if(/^image\//.test(file.type) && file.size < 6e6){
      var rd = new FileReader();
      rd.onload = function(){
        var img = new Image(); img.onload = function(){
          var c = document.createElement('canvas'), sc = Math.min(1, 1000/Math.max(img.width,img.height)); c.width = img.width*sc; c.height = img.height*sc;
          c.getContext('2d').drawImage(img,0,0,c.width,c.height);
          setAns(b, {name:file.name, size:file.size, type:file.type, data:c.toDataURL('image/jpeg',.78)}); render(true);
        }; img.src = rd.result;
      };
      rd.readAsDataURL(file);
    } else { setAns(b, {name:file.name, size:file.size, type:file.type}); render(true); }
  });

  root.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && e.target.tagName === 'INPUT'){ e.preventDefault(); var page = pages[st.i]; var btn = page.blocks.filter(function(b){return b.type==='button';})[0]; if(btn){ var bel = root.querySelector('[data-act="btn"][data-bid="'+btn.id+'"]'); if(bel) bel.click(); } else go(); }
  });

  function initSignatures(){
    root.querySelectorAll('.fp-sig canvas').forEach(function(cv){
      var b = blockById(cv.getAttribute('data-bid')), k = keyOf(b), wrap = cv.parentNode;
      var r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      cv.width = Math.max(1, r.width*dpr); cv.height = Math.max(1, r.height*dpr);
      var ctx = cv.getContext('2d'); ctx.scale(dpr,dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 2.4;
      ctx.strokeStyle = getComputedStyle(wrap).color || '#111';
      if(st.answers[k]){ var im = new Image(); im.onload = function(){ ctx.drawImage(im,0,0,r.width,r.height); }; im.src = st.answers[k]; }
      var drawing = false, last = null;
      var pos = function(ev){ var rr = cv.getBoundingClientRect(); return {x:ev.clientX-rr.left, y:ev.clientY-rr.top}; };
      cv.addEventListener('pointerdown', function(ev){ drawing = true; last = pos(ev); try{cv.setPointerCapture(ev.pointerId);}catch(x){} wrap.classList.add('has'); ctx.beginPath(); ctx.arc(last.x,last.y,1.1,0,7); ctx.fillStyle = ctx.strokeStyle; ctx.fill(); });
      cv.addEventListener('pointermove', function(ev){ if(!drawing) return; var p = pos(ev); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.quadraticCurveTo(last.x,last.y,p.x,p.y); ctx.stroke(); last = p; });
      var end = function(){ if(!drawing) return; drawing = false; st.answers[k] = cv.toDataURL('image/png'); if(st.errors[b.id]){ delete st.errors[b.id]; var w = cv.closest('.fp-b'); w.classList.remove('fp-err'); var m=w.querySelector('.fp-errmsg'); if(m) m.remove(); } };
      cv.addEventListener('pointerup', end); cv.addEventListener('pointerleave', end); cv.addEventListener('pointercancel', end);
    });
  }
  var cdTimer = null;
  function initCountdown(){
    clearInterval(cdTimer);
    var els = root.querySelectorAll('[data-cd]'); if(!els.length) return;
    cdTimer = setInterval(function(){
      if(!root.isConnected){ clearInterval(cdTimer); return; }
      els.forEach(function(el){ var left = Math.max(0, +el.getAttribute('data-cd') - Date.now()); el.querySelector('[data-mm]').textContent = String(Math.floor(left/60000)).padStart(2,'0'); el.querySelector('[data-ss]').textContent = String(Math.floor(left%60000/1000)).padStart(2,'0'); });
    }, 1000);
  }

  render();
  return { state: st, restart: function(){ st.i=0; st.hist=[]; st.answers={}; st.errors={}; st.done=false; st.started=false; st.startedAt=Date.now(); render(); }, goTo: function(i){ st.i=i; st.hist=[]; render(); } };
};

window.FP = FP;
})();
