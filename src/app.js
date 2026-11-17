(function(){
"use strict";
var T = window.FS_T, esc = FP.esc, uid = T.uid, clone = T.clone;
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

/* ---------- icons ---------- */
var IP = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M21.5 20a6.5 6.5 0 00-4-6"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  layout:'<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M9 21V9"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>',
  trash:'<path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
  down:'<path d="M12 4v12M6 10l6 6 6-6"/><path d="M4 20h16"/>', up:'<path d="M12 20V8M6 14l6-6 6 6"/><path d="M4 4h16"/>',
  left:'<path d="M15 18l-6-6 6-6"/>', right:'<path d="M9 18l6-6-6-6"/>',
  chevUp:'<path d="M18 15l-6-6-6 6"/>', chevDown:'<path d="M6 9l6 6 6-6"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>', redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>',
  mobile:'<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>', monitor:'<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', x:'<path d="M18 6L6 18M6 6l12 12"/>',
  heading:'<path d="M6 4v16M18 4v16M6 12h12"/>', type:'<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  images:'<rect x="2" y="6" width="14" height="14" rx="2"/><path d="M6 2h14a2 2 0 012 2v12"/><circle cx="7.5" cy="11" r="1.5"/><path d="M16 17l-4-4-8 7"/>',
  video:'<rect x="2" y="5" width="15" height="14" rx="2.5"/><path d="M17 10l5-3v10l-5-3"/>',
  badge:'<path d="M12 2l2.4 2.1 3.2-.3.8 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.8 3.1-3.2-.3L12 22l-2.4-2.1-3.2.3-.8-3.1L2.8 15.5l1.2-3-1.2-3 2.8-1.6.8-3.1 3.2.3z"/>',
  list:'<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
  choice:'<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><circle cx="7" cy="7" r="1" /><circle cx="7" cy="17" r="1"/>',
  checks:'<path d="M3 7l2 2 4-4M3 17l2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/>',
  cursor:'<path d="M17 4h-2a3 3 0 00-3 3v10a3 3 0 003 3h2M7 4h2a3 3 0 013 3v10a3 3 0 01-3 3H7"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
  tel:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
  align:'<path d="M4 6h16M4 10h16M4 14h10M4 18h12"/>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  star:'<path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36 6.3 20.36l1.09-6.35-4.62-4.5 6.38-.93z"/>',
  gauge:'<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1117.4 0"/>',
  calendar:'<rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>',
  pen:'<path d="M3 21c3-1 5-3 6-6"/><path d="M15 4l5 5-9.5 9.5-5 1 1-5z"/><path d="M14 20h7"/>',
  checkbox:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>',
  pointer:'<path d="M5 3l14 8-6 2-2 6z"/>', send:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  receipt:'<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  tag:'<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  quote:'<path d="M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6"/>', shield:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  space:'<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>', minus:'<path d="M4 12h16"/>', code:'<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
  grip:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  link:'<path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7"/>',
  palette:'<circle cx="13.5" cy="6.5" r="1.2"/><circle cx="17.5" cy="10.5" r="1.2"/><circle cx="8.5" cy="7.5" r="1.2"/><circle cx="6.5" cy="12.5" r="1.2"/><path d="M12 2a10 10 0 000 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0022 9.8C22 5.5 17.5 2 12 2z"/>',
  file:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>',
  layers:'<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  sparkles:'<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
  zap:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>', ext:'<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>',
  refresh:'<path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/>', funnel:'<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', percent:'<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  euro:'<path d="M17 6.5A7 7 0 107 17.5 7 7 0 0017 17.5"/><path d="M4 10h9M4 14h9"/>', play:'<path d="M7 4.5v15l13-7.5z"/>',
  folder:'<path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>', info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  dup:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 011-1h11"/>', branch:'<circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 7.5v9M18 10.5c0 4-6 3-11 6.5"/>'
};
var I = function(n, s){ return '<svg class="i" viewBox="0 0 24 24"'+(s?' style="width:'+s+'px;height:'+s+'px"':'')+'>'+(IP[n]||'')+'</svg>'; };

/* ---------- persistence ---------- */
var KEY = 'funnelstudio.v1';
var db;
function loadDb(){ try{ var s = localStorage.getItem(KEY); if(s) return JSON.parse(s); }catch(e){} return null; }
var saveT = null, saveWarned = false;
function save(now){
  clearTimeout(saveT);
  var go = REMOTE ? function(){ syncRemote(); } : function(){ try{ localStorage.setItem(KEY, JSON.stringify(db)); setSaved(true); }catch(e){ setSaved(false); if(!saveWarned){ saveWarned = true; toast('Lokaler Speicher voll oder gesperrt – Daten bleiben nur bis zum Neuladen erhalten.'); } } };
  setSaved(null);
  if(now) go(); else saveT = setTimeout(function(){ saveT = null; go(); }, 350);
}
function setSaved(s){ var el = $('#svst'); if(!el) return; el.innerHTML = s === null ? 'Speichert …' : s ? I('check',13)+' Gespeichert' : 'Nicht gespeichert'; }

var NAMES = ['Lena Hoffmann','Jonas Becker','Sophie Wagner','Felix Schulz','Marie Koch','Paul Richter','Anna Klein','Lukas Wolf','Laura Neumann','Tim Schwarz','Julia Zimmermann','David Krüger','Sarah Hartmann','Max Lange','Nina Werner','Jan Schmitt','Hannah Braun','Leon Fischer'];
var STATUSES = [['neu','Neu'],['kontaktiert','Kontaktiert'],['angebot','Angebot'],['gewonnen','Gewonnen'],['verloren','Verloren']];
var dayKey = function(ts){ var d = new Date(ts); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };

function seed(){
  var d = {version:2, funnels:[], leads:[], clients:[], users:[], brand:T.theme('clean'), defaults:{webhook:''}, fonts:{google:[], uploaded:[]}, createdAt:Date.now()};
  var c1 = {id:uid(), name:'Muster Holzbau GmbH', contact:'info@musterholzbau.de', logo:'', createdAt:Date.now()-25*864e5};
  var c2 = {id:uid(), name:'Sonnig Solar KG', contact:'kontakt@sonnig-solar.de', logo:'', createdAt:Date.now()-12*864e5};
  d.clients = [c1, c2];
  d.users = [{id:uid(), email:'admin@demo.de', password:'demo', name:'Benjamin', role:'admin'}, {id:uid(), email:'kunde@musterholzbau.de', password:'demo', name:'Thomas Muster', role:'client', clientId:c1.id}];
  var f1 = T.newFunnel('terrasse'); f1.status = 'live'; f1.createdAt = Date.now() - 20*864e5;
  var f2 = T.newFunnel('strategy'); f2.createdAt = Date.now() - 9*864e5;
  var f3 = T.newFunnel('abnahme'); f3.status = 'live'; f3.createdAt = Date.now() - 30*864e5;
  f1.clientId = c1.id; f1.shared = true; f3.clientId = c1.id; f3.shared = false;
  d.funnels = [f1, f2, f3];
  // demo stats + leads for f1
  var rnd = function(a,b){ return a + Math.floor(Math.random()*(b-a+1)); };
  var mat = f1.pages[1].blocks[1], size = f1.pages[2].blocks[2], ex = f1.pages[3].blocks[0], when = f1.pages[4].blocks[0];
  var nPages = f1.pages.length, totalViews = 0, totalLeads = 0;
  for(var i=13;i>=0;i--){
    var ts = Date.now() - i*864e5, v = rnd(28,64), l = rnd(1,Math.max(2,Math.round(v*0.09)));
    f1.stats.daily[dayKey(ts)] = {v:v, l:l}; totalViews += v; totalLeads += l;
    for(var k=0;k<Math.min(l,2);k++){
      var ans = {};
      ans.material = mat.props.options[rnd(0,3)].id; ans.flaeche = rnd(12,60);
      ans.extras = ex.props.options.filter(function(){ return Math.random() < .4; }).map(function(o){ return o.id; });
      ans.zeitraum = when.props.options[rnd(0,3)].id;
      var name = NAMES[rnd(0,NAMES.length-1)];
      ans.name = name; ans.email = name.toLowerCase().replace(/ä/g,'ae').replace(/ü/g,'ue').replace(/ö/g,'oe').replace(' ','.')+'@beispiel.de'; ans.telefon = '+49 17'+rnd(0,9)+' '+rnd(1000000,9999999); ans.einwilligung = true;
      var tot = FP.computeTotal(f1, ans);
      d.leads.push({id:uid(), funnelId:f1.id, funnelName:f1.name, createdAt:ts - rnd(0,8e7), name:name, email:ans.email, phone:ans.telefon, answers:ans, fields:FP.readable(f1, ans), total:tot.total, items:tot.items, status:['neu','neu','kontaktiert','angebot','gewonnen','verloren'][rnd(0,5)], notes:'', demo:true});
    }
  }
  f1.stats.views = totalViews; f1.stats.starts = Math.round(totalViews*0.62); f1.stats.completes = totalLeads;
  var c = f1.stats.views, fac = [1,.64,.9,.89,.9,.88,.85]; f1.pages.forEach(function(p, ix){ c = Math.round(c * (fac[ix]||.85)); f1.stats.pages[p.id] = c; });
  f1.pages.slice(-1).forEach(function(p){ f1.stats.pages[p.id] = totalLeads; });
  f1.demo = true;
  d.leads.sort(function(a,b){ return b.createdAt - a.createdAt; });
  return d;
}

/* ---------- app state ---------- */
var S = {view:'funnels', fid:null, pi:0, sel:null, rtab:'page', ltab:'elements', device:'mobile', filter:'all', q:'', cf:{funnel:'all', status:'all', q:''}, csel:{}, afid:null, tcat:'Alle', hist:[], fut:[], lastSnap:0, libq:''};
function F(){ return db.funnels.filter(function(f){ return f.id === S.fid; })[0]; }
function getF(id){ return db.funnels.filter(function(f){ return f.id === id; })[0]; }
function curPage(){ var f = F(); return f && f.pages[S.pi]; }
function selBlock(){ var p = curPage(); if(!p || !S.sel) return null; return p.blocks.filter(function(b){ return b.id === S.sel; })[0] || null; }
function findBlock(f, id){ var r = null; f.pages.forEach(function(p, pi){ p.blocks.forEach(function(b, bi){ if(b.id === id) r = {page:p, pi:pi, bi:bi, b:b}; }); }); return r; }
function touch(){ var f = F(); if(f) f.updatedAt = Date.now(); save(); }

/* history */
function snap(force){
  var f = F(); if(!f) return;
  var now = Date.now();
  if(!force && now - S.lastSnap < 900) { S.lastSnap = now; return; }
  S.lastSnap = now;
  S.hist.push(JSON.stringify({pages:f.pages, theme:f.theme, settings:f.settings, name:f.name}));
  if(S.hist.length > 80) S.hist.shift();
  S.fut = [];
  updUndo();
}
function restore(json){ var f = F(), o = JSON.parse(json); f.pages = o.pages; f.theme = o.theme; f.settings = o.settings; f.name = o.name; }
function undo(){ var f = F(); if(!S.hist.length) return; S.fut.push(JSON.stringify({pages:f.pages, theme:f.theme, settings:f.settings, name:f.name})); restore(S.hist.pop()); S.lastSnap = 0; fixSel(); touch(); renderEditor(); }
function redo(){ var f = F(); if(!S.fut.length) return; S.hist.push(JSON.stringify({pages:f.pages, theme:f.theme, settings:f.settings, name:f.name})); restore(S.fut.pop()); S.lastSnap = 0; fixSel(); touch(); renderEditor(); }
function updUndo(){ var u = $('[data-a="undo"]'), r = $('[data-a="redo"]'); if(u) u.disabled = !S.hist.length; if(r) r.disabled = !S.fut.length; }
function fixSel(){ var f = F(); if(S.pi >= f.pages.length) S.pi = f.pages.length - 1; if(S.sel && !selBlock()) S.sel = null; }

/* ---------- ui helpers ---------- */
function toast(msg){ var w = $('.toasts'); if(!w){ w = document.createElement('div'); w.className = 'toasts'; document.body.appendChild(w); } var t = document.createElement('div'); t.className = 'toast'; t.innerHTML = I('check',15) + esc(msg); w.appendChild(t); setTimeout(function(){ t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function(){ t.remove(); }, 300); }, 2600); }
function closeDD(){ $$('.dd').forEach(function(d){ d.remove(); }); }
function dropdown(anchor, items){
  closeDD();
  var d = document.createElement('div'); d.className = 'dd';
  d.innerHTML = items.map(function(it){ return it === '-' ? '<hr>' : '<button class="'+(it.danger?'danger':'')+'" data-ddi="'+it.k+'">'+I(it.ic)+esc(it.l)+'</button>'; }).join('');
  document.body.appendChild(d);
  var r = anchor.getBoundingClientRect(), w = d.offsetWidth, h = d.offsetHeight;
  var left = Math.min(window.innerWidth - w - 8, r.right - w), top = r.bottom + 6; if(top + h > window.innerHeight - 8) top = r.top - h - 6;
  d.style.left = Math.max(8,left) + 'px'; d.style.top = top + 'px';
  d.addEventListener('click', function(e){ var b = e.target.closest('[data-ddi]'); if(!b) return; var it = items.filter(function(x){ return x.k === b.getAttribute('data-ddi'); })[0]; closeDD(); if(it && it.fn) it.fn(); });
}
function modal(opts){
  var bg = document.createElement('div'); bg.className = 'mbg';
  bg.innerHTML = '<div class="modal '+(opts.size||'')+'"><div class="mh"><div><h2>'+esc(opts.title)+'</h2>'+(opts.sub?'<p>'+esc(opts.sub)+'</p>':'')+'</div><button class="btn ghost sm ic x" data-close>'+I('x')+'</button></div><div class="mb">'+opts.body+'</div>'+(opts.foot?'<div class="mf">'+opts.foot+'</div>':'')+'</div>';
  document.body.appendChild(bg);
  var close = function(){ bg.remove(); document.removeEventListener('keydown', onk); if(opts.onClose) opts.onClose(); };
  var onk = function(e){ if(e.key === 'Escape') close(); };
  document.addEventListener('keydown', onk);
  bg.addEventListener('mousedown', function(e){ if(e.target === bg) close(); });
  bg.addEventListener('click', function(e){ if(e.target.closest('[data-close]')) close(); });
  if(opts.onOpen) opts.onOpen(bg, close);
  return {el:bg, close:close};
}
function confirmBox(title, text, okLabel, fn, danger){
  modal({title:title, body:'<p style="margin:0;color:var(--ink2)">'+esc(text)+'</p>', foot:'<button class="btn" data-close>Abbrechen</button><button class="btn '+(danger?'dark':'pri')+'" data-ok>'+esc(okLabel)+'</button>',
    onOpen:function(el, close){ el.querySelector('[data-ok]').onclick = function(){ close(); fn(); }; }});
}
function promptBox(title, label, val, fn){
  modal({title:title, body:'<div class="fld"><label>'+esc(label)+'</label><input class="inp" id="pbx" value="'+esc(val)+'"></div>', foot:'<button class="btn" data-close>Abbrechen</button><button class="btn pri" data-ok>Speichern</button>',
    onOpen:function(el, close){ var i = el.querySelector('#pbx'); setTimeout(function(){ i.focus(); i.select(); }, 30); var ok = function(){ var v = i.value.trim(); if(!v) return; close(); fn(v); }; el.querySelector('[data-ok]').onclick = ok; i.onkeydown = function(e){ if(e.key === 'Enter') ok(); }; }});
}
function copyText(text, msg){
  var done = function(){ toast(msg || 'In die Zwischenablage kopiert'); };
  try{ navigator.clipboard.writeText(text).then(done, fallback); }catch(e){ fallback(); }
  function fallback(){ var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); done(); }catch(x){ toast('Kopieren nicht möglich – bitte manuell markieren'); } ta.remove(); }
}
function fmtNum(n){ return (n||0).toLocaleString('de-DE'); }
function fmtRel(ts){ var d = (Date.now()-ts)/1000; if(d < 60) return 'gerade eben'; if(d < 3600) return 'vor '+Math.floor(d/60)+' Min.'; if(d < 86400) return 'vor '+Math.floor(d/3600)+' Std.'; if(d < 86400*7) return 'vor '+Math.floor(d/86400)+' Tag'+(d>=172800?'en':''); return new Date(ts).toLocaleDateString('de-DE'); }
function fmtDT(ts){ return new Date(ts).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
var AVC = ['#1c2e3d','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'];
function avatar(name){ var n = name || '?', h = 0; for(var i=0;i<n.length;i++) h = (h*31 + n.charCodeAt(i))>>>0; return '<span class="avc" style="background:'+AVC[h%AVC.length]+'">'+esc(n.split(' ').map(function(s){return s[0]||'';}).join('').slice(0,2).toUpperCase())+'</span>'; }
function conv(f){ var v = f.stats.views || 0; return v ? (f.stats.completes / v * 100) : 0; }
function leadsOf(fid){ return db.leads.filter(function(l){ return l.funnelId === fid; }); }
function readImage(file, maxW, cb){
  var rd = new FileReader();
  rd.onload = function(){
    if(/svg/.test(file.type)) return cb(rd.result);
    var img = new Image(); img.onload = function(){ var c = document.createElement('canvas'), sc = Math.min(1, maxW/img.width); c.width = img.width*sc; c.height = img.height*sc; c.getContext('2d').drawImage(img,0,0,c.width,c.height); cb(c.toDataURL(/png/.test(file.type)?'image/png':'image/jpeg', .82)); };
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
}
function mini(f, idx){ return '<div class="mini">'+FP.renderPage(f, idx||0, {noAnim:true})+'</div>'; }

/* ---------- routing ---------- */
function go(view, fid){
  if(!isAdmin() && ['editor','templates','settings','customers'].indexOf(view) >= 0) view = 'funnels';
  S.view = view;
  if(view === 'editor'){ S.fid = fid; S.pi = 0; S.sel = null; S.rtab = 'page'; S.hist = []; S.fut = []; }
  var h = view === 'editor' ? 'edit-' + fid : view;
  if(location.hash.slice(1) !== h){ try{ history.replaceState(null,'','#'+h); }catch(e){ location.hash = h; } }
  render();
}
function fromHash(){
  var h = location.hash.slice(1);
  if(/^edit-/.test(h) && getF(h.slice(5))){ S.view = 'editor'; S.fid = h.slice(5); }
  else if(['funnels','contacts','analytics','templates','settings','customers'].indexOf(h) >= 0) S.view = h;
  else S.view = 'funnels';
}

function render(){
  closeDD();
  if(!S.user) return renderLogin();
  if(S.needPw) return renderSetPassword();
  if(!isAdmin() && ['editor','templates','settings','customers'].indexOf(S.view) >= 0) S.view = 'funnels';
  if(S.view === 'editor') return renderEditor();
  var vl = visibleLeads(), vf = visibleFunnels();
  var nLeadsNew = vl.filter(function(l){ return l.status === 'neu'; }).length;
  var cl = !isAdmin() ? clientById(myClientId()) : null;
  var nav = isAdmin()
    ? [['funnels','Funnels','funnel',db.funnels.length],['customers','Kunden','folder',(db.clients||[]).length],['contacts','Kontakte','users',nLeadsNew],['analytics','Analytics','chart'],['templates','Vorlagen','layout'],['settings','Einstellungen','settings']]
    : [['funnels','Übersicht','grid',vf.length],['contacts','Kontakte','users',nLeadsNew],['analytics','Analytics','chart']];
  var brand = cl ? '<div class="brand">'+(cl.logo?'<div class="lg" style="background:#fff center/contain no-repeat url(&quot;'+esc(cl.logo)+'&quot;);box-shadow:0 0 0 1px var(--line)"></div>':'<div class="lg">'+I('layers')+'</div>')+'<div>'+esc(cl.name)+'<small>Kundenportal · TapTell</small></div></div>'
    : '<div class="brand tt"><img src="'+TT_LOGO+'" alt="TapTell"><small>'+(REMOTE?'Admin':'Admin · Demo-Modus')+'</small></div>';
  var html = '<div class="shell"><aside class="side">' + brand
    + nav.map(function(n){ return '<button class="nav'+(S.view===n[0]?' on':'')+'" data-a="nav" data-v="'+n[0]+'">'+I(n[2])+n[1]+(n[3]?'<span class="ct">'+n[3]+'</span>':'')+'</button>'; }).join('')
    + (isAdmin() ? '<div class="sec">Schnellzugriff</div>' + db.funnels.slice(0,5).map(function(f){ return '<button class="nav" data-a="edit" data-id="'+f.id+'"><span style="width:7px;height:7px;border-radius:50%;background:'+(f.status==='live'?'var(--ok)':'#c4c7d0')+';margin:0 4px 0 5px;flex:none"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name)+'</span></button>'; }).join('') : '')
    + '<div class="foot"><div class="av">'+esc((S.user.name||S.user.email||'?')[0].toUpperCase())+'</div><div style="flex:1;min-width:0"><div style="color:var(--ink);font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(S.user.name||S.user.email)+'</div><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(S.user.role==='admin'?'Administrator':'Kunde')+'</div></div><button class="btn ghost sm ic" data-a="logout" title="Abmelden">'+I('ext',15)+'</button></div></aside><main class="main" id="main"></main></div>';
  $('#app').innerHTML = html;
  var m = $('#main');
  var banner = S.as ? '<div class="asbar">'+I('eye',15)+'<span>Du siehst das Portal so, wie <b>'+esc((clientById(S.as)||{}).name||'der Kunde')+'</b> es sieht.</span><span style="flex:1"></span><button class="btn sm" data-a="endAs">Zurück zur Admin-Ansicht</button></div>' : '';
  if(S.view === 'funnels') m.innerHTML = banner + (isAdmin() ? viewFunnels() : viewPortal());
  else if(S.view === 'customers') m.innerHTML = viewCustomers();
  else if(S.view === 'contacts') m.innerHTML = banner + viewContacts();
  else if(S.view === 'analytics') m.innerHTML = banner + viewAnalytics();
  else if(S.view === 'templates') m.innerHTML = '<div class="page"><div class="ph"><div><h1>Vorlagen</h1><p>Starte mit einer bewährten Struktur und passe alles individuell an.</p></div></div>'+templateGallery()+'</div>';
  else if(S.view === 'settings') m.innerHTML = viewSettings();
}

/* ---------- views: funnels ---------- */
function viewFunnels(){
  var fs = db.funnels.filter(function(f){ return (S.filter === 'all' || f.status === S.filter) && (!S.q || f.name.toLowerCase().indexOf(S.q.toLowerCase()) >= 0) && (!S.fclient || (S.fclient === '-' ? !f.clientId : f.clientId === S.fclient)); });
  var views = 0, leads = db.leads.length, comp = 0; db.funnels.forEach(function(f){ views += f.stats.views; comp += f.stats.completes; });
  var week = db.leads.filter(function(l){ return l.createdAt > Date.now() - 7*864e5; }).length;
  var live = db.funnels.filter(function(f){ return f.status === 'live'; }).length;
  var h = '<div class="page"><div class="ph"><div><h1>Funnels</h1><p>Erstelle, gestalte und verwalte deine mobilen Funnels.</p></div><div class="sp"></div><button class="btn pri" data-a="newFunnel">'+I('plus')+'Neuer Funnel</button></div>';
  h += '<div class="kpis">'
    + kpi('Aktive Funnels', live + ' / ' + db.funnels.length, 'live geschaltet', 'funnel')
    + kpi('Aufrufe', fmtNum(views), 'gesamt', 'eye')
    + kpi('Leads', fmtNum(leads), '<b>+'+week+'</b> in den letzten 7 Tagen', 'inbox')
    + kpi('Ø Conversion', (views ? (comp/views*100) : 0).toFixed(1).replace('.',',') + ' %', 'Aufruf → Abschluss', 'percent') + '</div>';
  h += '<div class="toolbar"><div class="seg">'+[['all','Alle'],['live','Live'],['draft','Entwurf']].map(function(x){ return '<button class="'+(S.filter===x[0]?'on':'')+'" data-a="ffilter" data-v="'+x[0]+'">'+x[1]+'</button>'; }).join('')+'</div><div style="flex:1"></div><select class="inp" id="fcl" style="width:210px;height:36px"><option value="">Alle Kunden</option><option value="-"'+(S.fclient==='-'?' selected':'')+'>Ohne Kunde (intern)</option>'+(db.clients||[]).map(function(c){ return '<option value="'+c.id+'"'+(S.fclient===c.id?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('')+'</select><label class="search">'+I('search')+'<input id="fq" placeholder="Funnels durchsuchen …" value="'+esc(S.q)+'"></label></div>';
  h += '<div class="grid">';
  fs.forEach(function(f){
    var lc = leadsOf(f.id).length;
    h += '<div class="fcard" data-a="edit" data-id="'+f.id+'"><div class="menu"><button class="btn sm ic" data-a="fmenu" data-id="'+f.id+'">'+I('more')+'</button></div><div class="thumb">'+mini(f)+'</div>'
      + '<div class="meta"><div class="nm"><span>'+esc(f.name)+'</span><span class="pill '+(f.status==='live'?'live':'draft')+'" style="flex:none">'+(f.status==='live'?'Live':'Entwurf')+'</span></div>'
      + '<div class="st"><span><b>'+fmtNum(f.stats.views)+'</b>Aufrufe</span><span><b>'+lc+'</b>Leads</span><span><b>'+conv(f).toFixed(1).replace('.',',')+'%</b>CR</span></div>'
      + '<div class="st" style="margin-top:4px">'+f.pages.length+' Seiten · bearbeitet '+fmtRel(f.updatedAt)+'</div>'
      + '<div class="cchip">'+(f.clientId && clientById(f.clientId) ? I('folder',12)+'<span>'+esc(clientById(f.clientId).name)+'</span>'+(f.shared?'<span class="pill live nos" style="margin-left:auto">'+I('eye',11)+' freigeschaltet</span>':'<span class="pill draft nos" style="margin-left:auto">nicht freigeschaltet</span>') : '<span style="color:var(--mut)">Intern · keinem Kunden zugeordnet</span>')+'</div></div></div>';
  });
  h += '<button class="newcard" data-a="newFunnel"><div class="pl">'+I('plus',20)+'</div><b style="color:var(--ink)">Neuer Funnel</b><span style="font-size:12.5px">Aus Vorlage oder leer starten</span></button></div>';
  if(!fs.length && S.q) h += '<div class="empty" style="margin-top:16px">Keine Funnels gefunden.</div>';
  return h + '</div>';
}
function kpi(l, v, d, ic){ return '<div class="kpi"><div class="l">'+I(ic,14)+l+'</div><div class="v">'+v+'</div><div class="d">'+d+'</div></div>'; }

function templateGallery(){
  var list = T.TEMPLATES.map(function(t){ var d = t.make(); return {id:t.id, d:d}; });
  var shown = list.filter(function(x){ return S.tcat === 'Alle' || x.d.cats.indexOf(S.tcat) >= 0 || x.id === 'blank'; });
  return '<div class="tfil">'+T.CATS.map(function(c){ return '<button class="chip'+(S.tcat===c?' on':'')+'" data-a="tcat" data-v="'+c+'">'+c+'</button>'; }).join('')+'</div><div class="tgrid">'
    + shown.map(function(x){ var f = {pages:x.d.pages, theme:x.d.theme, settings:x.d.settings||{}}; return '<div class="tcard" role="button" tabindex="0" data-a="useTpl" data-id="'+x.id+'"><div class="thumb">'+mini(f)+'</div><div class="tm"><b>'+esc(x.d.name)+'</b><span>'+esc(x.d.desc)+'</span><div class="tags">'+x.d.cats.map(function(c){ return '<span class="tag'+(c==='Konfigurator'?' a':'')+'">'+c+'</span>'; }).join('')+'<span class="tag">'+x.d.pages.length+' Seiten</span></div></div></div>'; }).join('')
    + '</div>';
}
function newFunnelModal(){
  modal({title:'Neuen Funnel erstellen', sub:'Wähle eine Vorlage – Inhalte, Design und Logik kannst du danach frei anpassen.', size:'wide', body:'<div id="tplwrap">'+templateGallery()+'</div>',
    onOpen:function(el, close){ el.addEventListener('click', function(e){ var c = e.target.closest('[data-a="tcat"]'); if(c){ e.stopPropagation(); S.tcat = c.getAttribute('data-v'); el.querySelector('#tplwrap').innerHTML = templateGallery(); } var u = e.target.closest('[data-a="useTpl"]'); if(u){ e.stopPropagation(); close(); createFromTpl(u.getAttribute('data-id')); } }, true); }});
}
function createFromTpl(id){
  var f = T.newFunnel(id);
  if(db.defaults && db.defaults.webhook && !f.settings.webhook) f.settings.webhook = db.defaults.webhook;
  db.funnels.unshift(f); save(true);
  toast('Funnel „'+f.name+'“ erstellt');
  go('editor', f.id);
}
function funnelMenu(btn, id){
  var f = getF(id);
  dropdown(btn, [
    {k:'e', l:'Bearbeiten', ic:'edit', fn:function(){ go('editor', id); }},
    {k:'p', l:'Vorschau', ic:'eye', fn:function(){ openPreview(f); }},
    {k:'r', l:'Umbenennen', ic:'type', fn:function(){ promptBox('Funnel umbenennen','Name',f.name,function(v){ f.name = v; save(); render(); }); }},
    {k:'d', l:'Duplizieren', ic:'dup', fn:function(){ duplicateFunnel(f); }},
    {k:'s', l:f.status==='live'?'Offline nehmen':'Live schalten', ic:'rocket', fn:function(){ f.status = f.status==='live'?'draft':'live'; save(); render(); toast(f.status==='live'?'Funnel ist live':'Funnel ist jetzt Entwurf'); }},
    {k:'x', l:'Exportieren / Einbetten', ic:'code', fn:function(){ publishModal(f); }},
    {k:'a', l:'Analytics', ic:'chart', fn:function(){ S.afid = id; go('analytics'); }},
    '-',
    {k:'del', l:'Löschen', ic:'trash', danger:true, fn:function(){ confirmBox('Funnel löschen?','„'+f.name+'“ wird dauerhaft gelöscht. Bestehende Kontakte bleiben erhalten.','Löschen',function(){ db.funnels = db.funnels.filter(function(x){ return x.id !== id; }); save(); render(); toast('Funnel gelöscht'); }, true); }}
  ]);
}
function duplicateFunnel(f){
  var c = clone(f); c.id = uid()+uid().slice(0,4); c.name = f.name + ' (Kopie)'; c.status = 'draft'; c.createdAt = c.updatedAt = Date.now(); c.stats = {views:0,starts:0,completes:0,pages:{},daily:{}}; delete c.demo;
  var map = {};
  c.pages.forEach(function(p){ var n = uid(); map[p.id] = n; p.id = n; p.blocks.forEach(function(b){ b.id = uid(); }); });
  c.pages.forEach(function(p){ if(p.next) p.next = map[p.next] || ''; (p.scoreRoutes||[]).forEach(function(r){ r.goto = map[r.goto] || ''; }); p.blocks.forEach(function(b){ if(b.props.target) b.props.target = map[b.props.target] || ''; (b.props.options||[]).forEach(function(o){ if(o.goto) o.goto = map[o.goto] || ''; }); }); });
  db.funnels.unshift(c); save(); render(); toast('Funnel dupliziert');
}

/* ---------- views: contacts ---------- */
function filteredLeads(){
  var q = S.cf.q.toLowerCase();
  return visibleLeads().filter(function(l){ return (S.cf.funnel === 'all' || l.funnelId === S.cf.funnel) && (S.cf.status === 'all' || l.status === S.cf.status) && (!q || [l.name,l.email,l.phone,l.funnelName].join(' ').toLowerCase().indexOf(q) >= 0); });
}
function viewContacts(){
  var ls = filteredLeads(), nSel = Object.keys(S.csel).filter(function(k){ return S.csel[k]; }).length;
  var VL = visibleLeads();
  var counts = {}; STATUSES.forEach(function(s){ counts[s[0]] = VL.filter(function(l){ return l.status === s[0]; }).length; });
  var won = VL.filter(function(l){ return l.status === 'gewonnen'; }).reduce(function(a,l){ return a + (l.total||0); }, 0);
  var pipe = VL.filter(function(l){ return l.status !== 'verloren' && l.status !== 'gewonnen'; }).reduce(function(a,l){ return a + (l.total||0); }, 0);
  var h = '<div class="page"><div class="ph"><div><h1>Kontakte</h1><p>Alle Leads aus deinen Funnels – mit Antworten, Preis und Status.</p></div><div class="sp"></div><button class="btn" data-a="csv">'+I('copy')+'CSV kopieren</button></div>';
  h += '<div class="kpis">'+kpi('Neue Leads', counts.neu, 'noch nicht bearbeitet', 'inbox')+kpi('In Bearbeitung', counts.kontaktiert + counts.angebot, 'kontaktiert oder Angebot', 'users')+kpi('Pipeline-Wert', FP.money(pipe), 'offene Anfragen', 'euro')+kpi('Gewonnen', FP.money(won), counts.gewonnen + ' Aufträge', 'target')+'</div>';
  h += '<div class="toolbar"><div class="seg"><button class="'+(S.cf.status==='all'?'on':'')+'" data-a="cstat" data-v="all">Alle <span style="color:var(--mut)">'+VL.length+'</span></button>'+STATUSES.map(function(s){ return '<button class="'+(S.cf.status===s[0]?'on':'')+'" data-a="cstat" data-v="'+s[0]+'">'+s[1]+' <span style="color:var(--mut)">'+counts[s[0]]+'</span></button>'; }).join('')+'</div><div style="flex:1"></div>'
    + '<select class="inp" style="width:200px;height:36px" id="cfun"><option value="all">Alle Funnels</option>'+visibleFunnels().map(function(f){ return '<option value="'+f.id+'"'+(S.cf.funnel===f.id?' selected':'')+'>'+esc(f.name)+'</option>'; }).join('')+'</select>'
    + '<label class="search" style="min-width:220px">'+I('search')+'<input id="cq" placeholder="Name, E-Mail, Telefon …" value="'+esc(S.cf.q)+'"></label></div>';
  if(nSel) h += '<div class="callout" style="align-items:center;margin-bottom:12px"><b>'+nSel+' ausgewählt</b><span style="flex:1"></span>Status setzen: '+STATUSES.map(function(s){ return '<button class="btn sm" data-a="bulk" data-v="'+s[0]+'">'+s[1]+'</button>'; }).join(' ')+''+(isAdmin()?'<button class="btn sm danger" data-a="bulkdel">'+I('trash',13)+'Löschen</button>':'')+'</div>';
  h += '<div class="card" style="overflow:auto">';
  if(!ls.length) h += '<div class="emptyp" style="padding:60px"><div class="ic">'+I('inbox',20)+'</div>Noch keine Kontakte'+(db.leads.length?' für diesen Filter':'')+'.<br><span style="font-size:12px">Teste einen Funnel in der Vorschau – die Einträge landen hier.</span></div>';
  else {
    h += '<table class="t"><thead><tr><th style="width:36px"><input type="checkbox" class="cbx" data-a="callsel"'+(nSel && nSel===ls.length?' checked':'')+'></th><th>Kontakt</th><th>Telefon</th><th>Funnel</th><th>Wert</th><th>Status</th><th>Eingang</th></tr></thead><tbody>';
    ls.forEach(function(l){
      h += '<tr data-a="lead" data-id="'+l.id+'"><td data-stop><input type="checkbox" class="cbx" data-a="csel" data-id="'+l.id+'"'+(S.csel[l.id]?' checked':'')+'></td>'
        + '<td><div class="who">'+avatar(l.name||l.email)+'<div><div class="nm">'+esc(l.name||'Unbekannt')+(l.demo?' <span class="tag">Demo</span>':'')+(l.test?' <span class="tag a">Test</span>':'')+'</div><div class="sub">'+esc(l.email||'–')+'</div></div></div></td>'
        + '<td>'+esc(l.phone||'–')+'</td><td><span class="sub" style="color:var(--ink2)">'+esc(l.funnelName)+'</span></td><td style="font-weight:600">'+(l.total?FP.money(l.total):'–')+'</td>'
        + '<td data-stop><select class="stsel s-'+l.status+'" data-a="lstat" data-id="'+l.id+'">'+STATUSES.map(function(s){ return '<option value="'+s[0]+'"'+(l.status===s[0]?' selected':'')+'>'+s[1]+'</option>'; }).join('')+'</select></td>'
        + '<td class="sub">'+fmtRel(l.createdAt)+'</td></tr>';
    });
    h += '</tbody></table>';
  }
  return h + '</div></div>';
}
function openLead(id){
  var l = db.leads.filter(function(x){ return x.id === id; })[0]; if(!l) return;
  $$('.drw,.drwbg').forEach(function(x){ x.remove(); });
  var bg = document.createElement('div'); bg.className = 'drwbg'; bg.style.cssText = 'position:fixed;inset:0;z-index:155;background:rgba(15,17,23,.18)';
  var d = document.createElement('div'); d.className = 'drw';
  var rows = (l.fields||[]).map(function(x){ return '<div>'+esc(x.label)+'</div><div>'+(x.type==='signature' && x.image ? '<img src="'+x.image+'" alt="Unterschrift">' : esc(x.value) + (x.image && x.type==='upload' ? '<br><img src="'+x.image+'" alt="" style="margin-top:6px">' : ''))+'</div>'; }).join('');
  var items = (l.items||[]).map(function(it){ return '<div>'+esc(it.label)+(it.detail?'<br><span style="font-size:11.5px">'+esc(it.detail)+'</span>':'')+'</div><div style="text-align:right;font-weight:550">'+FP.money(it.amount)+'</div>'; }).join('');
  d.innerHTML = '<div class="dh">'+avatar(l.name||l.email)+'<div style="flex:1;min-width:0"><div style="font-weight:650;font-size:15px">'+esc(l.name||'Unbekannt')+'</div><div style="color:var(--mut);font-size:12.5px">'+esc(l.funnelName)+' · '+fmtDT(l.createdAt)+'</div></div><button class="btn ghost sm ic" data-x>'+I('x')+'</button></div>'
    + '<div class="db"><div class="row2" style="margin-bottom:6px"><div class="fld"><label>Status</label><select class="inp" id="dst">'+STATUSES.map(function(s){ return '<option value="'+s[0]+'"'+(l.status===s[0]?' selected':'')+'>'+s[1]+'</option>'; }).join('')+'</select></div><div class="fld"><label>Wert</label><div class="inp" style="display:flex;align-items:center;font-weight:650">'+(l.total?FP.money(l.total):'–')+'</div></div></div>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap">'+(l.email?'<a class="btn sm" href="mailto:'+esc(l.email)+'">'+I('mail',14)+esc(l.email)+'</a>':'')+(l.phone?'<a class="btn sm" href="tel:'+esc(l.phone.replace(/\s/g,''))+'">'+I('tel',14)+esc(l.phone)+'</a>':'')+'</div>'
    + '<div class="dsec">Antworten</div>'+(rows?'<div class="kv">'+rows+'</div>':'<p style="color:var(--mut)">Keine Antworten gespeichert.</p>')
    + (items?'<div class="dsec">Preisberechnung</div><div class="kv">'+items+'<div style="font-weight:650;color:var(--ink)">Gesamt</div><div style="text-align:right;font-weight:700;color:var(--a)">'+FP.money(l.total)+'</div></div>':'')
    + '<div class="dsec">Notizen</div><textarea class="inp" id="dnote" placeholder="Interne Notiz …" style="min-height:90px">'+esc(l.notes||'')+'</textarea>'
    + (l.durationSec?'<p class="hint">Ausfülldauer: '+l.durationSec+' Sek.</p>':'')
    + '<div style="margin-top:20px;display:flex;gap:8px"><button class="btn sm" data-copyj>'+I('copy',13)+'Als JSON kopieren</button><span style="flex:1"></span>'+(isAdmin()?'<button class="btn sm danger" data-del>'+I('trash',13)+'Löschen</button>':'')+'</div></div>';
  document.body.appendChild(bg); document.body.appendChild(d);
  var close = function(){ d.remove(); bg.remove(); if(S.view === 'contacts') render(); };
  bg.onclick = close; d.querySelector('[data-x]').onclick = close;
  d.querySelector('#dst').onchange = function(e){ l.status = e.target.value; save(); };
  d.querySelector('#dnote').oninput = function(e){ l.notes = e.target.value; save(); };
  d.querySelector('[data-copyj]').onclick = function(){ copyText(JSON.stringify(l, null, 2), 'Lead als JSON kopiert'); };
  if(d.querySelector('[data-del]')) d.querySelector('[data-del]').onclick = function(){ confirmBox('Kontakt löschen?','Dieser Kontakt wird dauerhaft entfernt.','Löschen',function(){ db.leads = db.leads.filter(function(x){ return x.id !== id; }); save(); close(); toast('Kontakt gelöscht'); }, true); };
}
function leadsCsv(){
  var ls = filteredLeads(), keys = [];
  ls.forEach(function(l){ (l.fields||[]).forEach(function(f){ if(f.type !== 'signature' && keys.indexOf(f.label) < 0) keys.push(f.label); }); });
  var q = function(v){ v = String(v == null ? '' : v); return /[;"\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; };
  var head = ['Eingang','Funnel','Status','Name','E-Mail','Telefon','Wert'].concat(keys);
  var rows = ls.map(function(l){ var m = {}; (l.fields||[]).forEach(function(f){ m[f.label] = f.value; }); return [fmtDT(l.createdAt), l.funnelName, l.status, l.name, l.email, l.phone, l.total||''].concat(keys.map(function(k){ return m[k]; })).map(q).join(';'); });
  return [head.map(q).join(';')].concat(rows).join('\n');
}

/* ---------- views: analytics ---------- */
function viewAnalytics(){
  var VF = visibleFunnels();
  if(!S.afid || VF.map(function(x){ return x.id; }).indexOf(S.afid) < 0) S.afid = (VF.filter(function(f){ return f.stats.views; })[0] || VF[0] || {}).id;
  var f = getF(S.afid);
  var h = '<div class="page"><div class="ph"><div><h1>Analytics</h1><p>Performance, Drop-off und Antwortverteilung pro Funnel.</p></div><div class="sp"></div><select class="inp" style="width:240px;height:36px" id="afun">'+VF.map(function(x){ return '<option value="'+x.id+'"'+(x.id===S.afid?' selected':'')+'>'+esc(x.name)+'</option>'; }).join('')+'</select></div>';
  if(!f) return h + '<div class="empty">Noch keine Funnels vorhanden.</div></div>';
  var ls = leadsOf(f.id), st = f.stats;
  var avg = ls.length ? ls.reduce(function(a,l){ return a + (l.total||0); }, 0) / ls.length : 0;
  if(f.demo) h += '<div style="margin:-8px 0 16px"><span class="demo-note">'+I('info',13)+'Dieser Funnel enthält Demo-Daten zur Veranschaulichung.</span></div>';
  h += '<div class="kpis" style="grid-template-columns:repeat(5,1fr)">'+kpi('Aufrufe', fmtNum(st.views), 'Funnel geöffnet', 'eye')+kpi('Starts', fmtNum(st.starts), (st.views?Math.round(st.starts/st.views*100):0)+' % Start-Rate', 'play')+kpi('Abschlüsse', fmtNum(st.completes), 'Formular abgesendet', 'check')+kpi('Conversion', conv(f).toFixed(1).replace('.',',')+' %', 'Aufruf → Abschluss', 'percent')+kpi('Ø Anfragewert', avg?FP.money(avg):'–', ls.length+' Leads', 'euro')+'</div>';
  // daily chart
  var days = []; for(var i=13;i>=0;i--){ var k = dayKey(Date.now()-i*864e5); days.push({k:k, v:(st.daily[k]||{}).v||0, l:(st.daily[k]||{}).l||0}); }
  var mx = Math.max.apply(null, days.map(function(d){ return d.v; }).concat([5]));
  var W = 640, H = 220, pad = 28, bw = (W - pad) / days.length;
  var svg = '<svg viewBox="0 0 '+W+' '+(H+24)+'" style="width:100%;height:auto;display:block">';
  [0,.5,1].forEach(function(g){ var y = 10 + (H-20)*(1-g); svg += '<line x1="'+pad+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="#eef0f3"/><text x="'+(pad-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="10" fill="#9aa0ad">'+Math.round(mx*g)+'</text>'; });
  days.forEach(function(d, ix){
    var x = pad + ix*bw + bw*0.18, w = bw*0.64, vh = (H-20) * d.v / mx, lh = (H-20) * d.l / mx;
    svg += '<rect x="'+x+'" y="'+(H-10-vh)+'" width="'+w+'" height="'+Math.max(vh,0)+'" rx="4" fill="#d9e1e8"><title>'+d.k+': '+d.v+' Aufrufe</title></rect>';
    svg += '<rect x="'+(x+w*0.2)+'" y="'+(H-10-lh)+'" width="'+(w*0.6)+'" height="'+Math.max(lh,0)+'" rx="3" fill="#1c2e3d"><title>'+d.k+': '+d.l+' Leads</title></rect>';
    if(ix % 2 === 0) svg += '<text x="'+(x+w/2)+'" y="'+(H+12)+'" text-anchor="middle" font-size="10" fill="#9aa0ad">'+d.k.slice(8)+'.'+d.k.slice(5,7)+'.</text>';
  });
  svg += '</svg>';
  h += '<div class="charts"><div class="card"><div class="ch"><h3>Letzte 14 Tage</h3><span style="flex:1"></span><div class="legend"><span><i style="background:#d9e1e8"></i>Aufrufe</span><span><i style="background:#1c2e3d"></i>Leads</span></div></div><div class="cb">'+svg+'</div></div>';
  // dropoff
  var first = st.pages[f.pages[0].id] || st.views || 0;
  h += '<div class="card"><div class="ch"><h3>Funnel-Verlauf</h3><p>Besucher pro Seite</p></div><div class="cb bars">';
  if(!first) h += '<p style="color:var(--mut);margin:0">Noch keine Daten. Öffne die Vorschau, um Testdaten zu erzeugen.</p>';
  else f.pages.forEach(function(p, ix){ var c = st.pages[p.id] || 0, pc = first ? Math.round(c/first*100) : 0; h += '<div class="br"><span class="lb">'+(ix+1)+'. '+esc(p.name)+'</span><div class="tr"><i style="width:'+pc+'%"></i>'+(pc>12?'<span>'+pc+' %</span>':'')+'</div><span class="vv"><b>'+fmtNum(c)+'</b></span></div>'; });
  h += '</div></div></div>';
  // answer distribution
  var chs = FP.allBlocks(f).filter(function(b){ return b.type === 'choice'; });
  if(chs.length){
    h += '<div class="card"><div class="ch"><h3>Antwortverteilung</h3><p>Basierend auf '+ls.length+' Leads</p></div><div class="cb" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:28px">';
    chs.forEach(function(b){
      var k = FP.keyOf(b), cnt = {}, tot = 0;
      ls.forEach(function(l){ var v = l.answers && l.answers[k]; if(v == null) return; [].concat(v).forEach(function(id){ cnt[id] = (cnt[id]||0) + 1; tot++; }); });
      h += '<div><div style="font-weight:600;margin-bottom:12px;font-size:13px">'+esc(String(b.props.question||k).replace(/\*\*|==/g,''))+'</div><div class="dist">' + b.props.options.map(function(o){ var c = cnt[o.id]||0, pc = ls.length ? Math.round(c/ls.length*100) : 0; return '<div class="dr"><div class="top"><span>'+esc((o.icon?o.icon+' ':'')+o.label)+'</span><span style="color:var(--mut)">'+c+' · '+pc+' %</span></div><div class="tr"><i style="width:'+pc+'%"></i></div></div>'; }).join('') + '</div></div>';
    });
    h += '</div></div>';
  }
  return h + '</div>';
}

/* ---------- views: settings ---------- */
function viewSettings(){
  var b = db.brand;
  var h = '<div class="page" style="max-width:980px"><div class="ph"><div><h1>Einstellungen</h1><p>Brand-Kit, Integrationen und Datenverwaltung.</p></div></div><div class="setgrid">';
  h += '<div class="card"><div class="ch">'+I('palette')+'<h3>Brand-Kit</h3></div><div class="cb"><p class="hint" style="margin:0 0 14px">Standard-Design für neue Funnels. Mit einem Klick auf bestehende Funnels übertragbar.</p>'
    + '<div class="row2"><div class="fld"><label>Primärfarbe</label>'+colorField('brand','primary',b.primary)+'</div><div class="fld"><label>Hintergrund</label>'+colorField('brand','bg',b.bg)+'</div></div>'
    + '<div class="row2"><div class="fld"><label>Schrift</label>'+fontSelect('brand','font',b.font)+'</div><div class="fld"><label>Überschriften</label>'+fontSelect('brand','headingFont',b.headingFont)+'</div></div>'
    + '<div class="fld"><label>Logo-Text</label><input class="inp" data-brand="logoText" value="'+esc(b.logoText)+'" placeholder="Dein Firmenname"></div>'
    + '<div class="fld"><label>Ecken-Radius</label><div class="rng"><input type="range" min="0" max="28" data-brand="radius" data-num value="'+b.radius+'"><span>'+b.radius+'px</span></div></div>'
    + '<button class="btn" data-a="brandApply">'+I('refresh')+'Auf alle Funnels anwenden</button></div></div>';
  h += '<div class="card"><div class="ch">'+I('zap')+'<h3>Integrationen</h3></div><div class="cb">'
    + '<div class="fld"><label>Standard-Webhook für neue Funnels</label><input class="inp" data-def="webhook" value="'+esc(db.defaults.webhook||'')+'" placeholder="https://hook.eu1.make.com/…"></div>'
    + '<p class="hint" style="margin-top:-6px">Jeder exportierte Funnel sendet Leads als JSON per POST an diese URL – z. B. an Make, Zapier, n8n oder eine Supabase Edge Function.</p>'
    + '<div class="callout" style="margin-top:14px">'+I('info')+'<div>Leads aus dem Live-Funnel kommen über den Webhook in dein System. In diesem Dashboard landen Leads aus der Vorschau sowie importierte Daten.</div></div></div></div>';
  h += '<div class="card"><div class="ch">'+I('file')+'<h3>Daten exportieren</h3></div><div class="cb"><p class="hint" style="margin:0 0 12px">Komplettes Backup (Funnels, Kontakte, Brand-Kit) als JSON.</p><button class="btn" data-a="exportAll">'+I('copy')+'Backup kopieren</button></div></div>';
  h += '<div class="card"><div class="ch">'+I('upload')+'<h3>Daten importieren</h3></div><div class="cb"><textarea class="inp" id="impj" placeholder="Backup- oder Funnel-JSON hier einfügen …" style="min-height:80px;font-family:ui-monospace,monospace;font-size:11.5px"></textarea><div style="display:flex;gap:8px;margin-top:10px"><button class="btn" data-a="importJ">Importieren</button><span style="flex:1"></span><button class="btn danger" data-a="resetAll">'+I('refresh',14)+'Zurücksetzen</button></div></div></div>';
  return h + '</div></div>';
}
function colorField(scope, k, v){ return '<div class="colr"><input type="color" data-'+scope+'="'+k+'" value="'+esc(toHex(v||'#ffffff'))+'"><input type="text" data-'+scope+'="'+k+'" value="'+esc(v)+'"></div>'; }
function fontSelect(scope, k, v, allowEmpty){
  var groups = {sans:'Sans Serif', serif:'Serif', display:'Display & Handschrift'}, F_ = db.fonts || {google:[], uploaded:[]};
  var opt = function(n){ return '<option value="'+esc(n)+'"'+(n===v?' selected':'')+' style="font-family:'+esc(FP.fontStack(n))+'">'+esc(n)+'</option>'; };
  var h = allowEmpty ? '<option value=""'+(!v?' selected':'')+'>Wie im Theme</option>' : '';
  Object.keys(groups).forEach(function(g){ h += '<optgroup label="'+groups[g]+'">' + FP.FONTS.filter(function(n){ return FP.FONT_META[n][0] === g; }).map(opt).join('') + '</optgroup>'; });
  var ex = F_.google || [], up = (F_.uploaded || []).map(function(x){ return x.name; });
  if(ex.length) h += '<optgroup label="Weitere Google Fonts">' + ex.map(opt).join('') + '</optgroup>';
  if(up.length) h += '<optgroup label="Eigene Schriften">' + up.map(opt).join('') + '</optgroup>';
  h += '<optgroup label="System">' + opt('System') + '</optgroup>';
  if(v && FP.FONTS.indexOf(v) < 0 && ex.indexOf(v) < 0 && up.indexOf(v) < 0 && v !== 'System') h += opt(v);
  return '<select class="inp fontsel" data-'+scope+'="'+k+'" style="font-family:'+esc(FP.fontStack(v||'Inter'))+'">'+h+'</select>';
}
function toHex(v){ v = String(v||''); if(/^#[0-9a-f]{6}$/i.test(v)) return v; if(/^#[0-9a-f]{3}$/i.test(v)) return '#'+v[1]+v[1]+v[2]+v[2]+v[3]+v[3]; var m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); if(m) return '#'+[m[1],m[2],m[3]].map(function(x){ return (+x).toString(16).padStart(2,'0'); }).join(''); return '#000000'; }

/* ================= EDITOR ================= */
var FIELDS = {
  heading:[['text','textarea','Text','**fett** · ==Akzentfarbe== · __handgezeichnet unterstrichen__ · [[Marker]] · Variablen: {{name}}'],['level','seg','Größe',[[1,'H1'],[2,'H2'],[3,'H3']]],['size','num','Schriftgröße (px, optional)']],
  text:[['text','textarea','Text','**fett** · ==Akzent== · __unterstrichen__ · [[Marker]] · {{name}}, {{total}}'],['size','num','Schriftgröße (px, optional)']],
  badge:[['text','text','Text'],['variant','seg','Stil',[['','Soft'],['filled','Gefüllt'],['outline','Rahmen'],['grey','Grau']]],['upper','toggle','Großbuchstaben']],
  image:[['src','image','Bild'],['height','range','Höhe',[80,420,10]],['radius','range','Ecken',[0,40,1]],['fit','seg','Darstellung',[['cover','Füllen'],['contain','Einpassen']]],['alt','text','Alt-Text']],
  video:[['url','text','YouTube- oder Vimeo-Link','Wird im veröffentlichten Funnel eingebettet.'],['radius','range','Ecken',[0,40,1]]],
  list:[['items','strings','Punkte'],['icon','seg','Symbol',[['check','Haken'],['number','Zahlen']]]],
  testimonial:[['quote','textarea','Zitat'],['name','text','Name'],['role','text','Untertitel'],['stars','range','Sterne',[0,5,1]],['img','image','Foto']],
  trust:[['items','strings','Badges']],
  faq:[['items','faq','Fragen & Antworten']],
  countdown:[['label','text','Text darüber'],['minutes','num','Dauer in Minuten']],
  choice:[['question','textarea','Frage'],['desc','text','Beschreibung (optional)'],['layout','select','Layout',[['list','Liste mit Icons'],['checklist','Checkbox-Liste (kompakt)'],['grid','Kacheln'],['image','Bildkarten'],['scale','Skala (z. B. Emojis in einer Reihe)']]],['cols','seg','Bilder pro Reihe',[[2,'2'],[1,'1']],function(p){ return p.layout==='image'; }],['cols','seg','Spalten',[[2,'2'],[3,'3']],function(p){ return p.layout==='grid'; }],['row2','row',[['minLabel','text','Label links'],['maxLabel','text','Label rechts']],null,function(p){ return p.layout==='scale'; }],['options','options','Antworten'],['multi','toggle','Mehrfachauswahl'],['maxSelect','num','Max. Auswahl (optional)',null,function(p){ return p.multi; }],['autoNext','toggle','Automatisch weiter bei Auswahl',null,function(p){ return !p.multi; }],['required','toggle','Pflichtfeld'],['showPrices','toggle','Preise anzeigen'],['key','key','Feld-Schlüssel']],
  input:[['label','text','Label'],['placeholder','text','Platzhalter'],['inputType','select','Feldtyp',[['text','Text'],['email','E-Mail'],['tel','Telefon'],['number','Zahl'],['date','Datum'],['textarea','Mehrzeilig']]],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  slider:[['label','text','Label'],['row3','row',[['min','num','Min'],['max','num','Max'],['step','num','Schritt']]],['row2','row',[['def','num','Startwert'],['unit','text','Einheit']]],['isQuantity','toggle','Als Menge für Preisberechnung','Preise „pro Einheit“ (z. B. €/m²) werden mit diesem Wert multipliziert.'],['key','key','Feld-Schlüssel']],
  rating:[['label','text','Frage'],['style','seg','Typ',[['stars','Sterne'],['nps','NPS 0–10']]],['max','range','Anzahl Sterne',[3,10,1],function(p){ return p.style!=='nps'; }],['row2','row',[['minLabel','text','Label links'],['maxLabel','text','Label rechts']]],['autoNext','toggle','Automatisch weiter'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  calendar:[['label','text','Label'],['row2','row',[['days','num','Anzahl Tage'],['offset','num','Ab Tag (+)']]],['excludeDays','days','Ausgeschlossene Wochentage'],['slots','strings','Uhrzeiten'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  upload:[['label','text','Label'],['cta','text','Button-Text'],['hint','text','Hinweis'],['accept','text','Dateitypen'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  signature:[['label','text','Label'],['hint','text','Hinweis im Feld'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  checkbox:[['text','textarea','Text'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  button:[['label','text','Beschriftung'],['sub','text','Text darunter (optional)'],['action','select','Aktion',[['next','Nächste Seite'],['page','Zu Seite springen'],['submit','Absenden (Lead speichern)'],['url','Link öffnen']]],['target','page','Zielseite',null,function(p){ return p.action==='page' || p.action==='submit'; }],['url','text','URL',null,function(p){ return p.action==='url'; }],['variant','select','Stil',[['','Wie im Theme'],['filled','Gefüllt'],['gradient','Verlauf'],['soft','Soft'],['outline','Rahmen'],['ghost','Nur Text']]],['icon','select','Icon',[['arrow','→ Pfeil'],['chevron','› Chevron'],['send','Senden'],['check','Haken'],['calendar','Kalender'],['phone','Telefon'],['mail','E-Mail'],['download','Download'],['gift','Geschenk'],['star','Stern'],['heart','Herz'],['lock','Schloss'],['sparkle','Funkeln'],['none','Kein Icon']]],['iconLeft','toggle','Icon links'],['row2','row',[['btnBg','color','Button-Farbe'],['btnColor','color','Textfarbe']]],['full','toggle','Volle Breite'],['shadow','toggle','Schatten'],['pulse','toggle','Puls-Animation']],
  summary:[['compact','toggle','Kompakt (nur Gesamtpreis)'],['title','text','Titel'],['totalLabel','text','Label Gesamt',null,function(p){ return !p.compact; }],['prefix','text','Präfix (z. B. „ab“)'],['note','text','Hinweis'],['showItems','toggle','Positionen anzeigen',null,function(p){ return !p.compact; }]],
  spacer:[['height','range','Höhe',[4,160,2]]],
  divider:[],
  html:[['code','code','HTML-Code','Wird 1:1 eingefügt (z. B. Embeds, Tracking, eigenes Styling).']]
};
var TEXTY = {heading:1,text:1,badge:1,list:1,button:1,choice:1,input:1,testimonial:1,faq:1,trust:1,summary:1,checkbox:1,rating:1,calendar:1,countdown:1,slider:1,upload:1,signature:1};
var STYLE_KEYS = ['ff','fw','scale','lh','ls','tt','it','color','bgc','pad','brad','bwid','bc','shd','anim','delay','vis'];
var STYLE_TYPO = [['ff','font','Schrift'],['fw','seg','Stärke',[['','Std'],[400,'400'],[500,'500'],[600,'600'],[700,'700'],[800,'800']]],['scale','range','Größe',[60,180,5,'%']],['row2','row',[['lh','num','Zeilenhöhe'],['ls','num','Laufweite']]],['tt','seg','Schreibweise',[['','Normal'],['uppercase','GROSS'],['lowercase','klein']]],['it','toggle','Kursiv'],['color','color','Textfarbe']];
var STYLE_BOX = [['bgc','color','Hintergrund'],['pad','range','Innenabstand',[0,48,1]],['brad','range','Ecken',[0,40,1]],['row2','row',[['bwid','num','Rahmen (px)'],['bc','color','Rahmenfarbe']]],['shd','seg','Schatten',[['','Kein'],['sm','S'],['md','M'],['lg','L']]]];
var STYLE_FX = [['anim','select','Einblenden',[['none','Keine'],['fade','Einblenden'],['up','Von unten'],['left','Von rechts'],['zoom','Zoom']]],['delay','range','Verzögerung',[0,1500,50,'ms']],['vis','seg','Sichtbar auf',[['all','Allen'],['mobile','Mobil'],['desktop','Desktop']]]];
var BNAME = {heading:'Überschrift',text:'Text',badge:'Badge',image:'Bild',video:'Video',list:'Liste',testimonial:'Bewertung',trust:'Trust-Badges',faq:'FAQ',countdown:'Countdown',choice:'Auswahl',input:'Eingabefeld',slider:'Schieberegler',rating:'Bewertung',calendar:'Terminwahl',upload:'Datei-Upload',signature:'Unterschrift',checkbox:'Einwilligung',button:'Button',summary:'Preisübersicht',spacer:'Abstand',divider:'Trennlinie',html:'HTML'};
var BICON = {heading:'heading',text:'type',badge:'badge',image:'image',video:'video',list:'list',testimonial:'quote',trust:'shield',faq:'help',countdown:'clock',choice:'choice',input:'cursor',slider:'sliders',rating:'star',calendar:'calendar',upload:'upload',signature:'pen',checkbox:'checkbox',button:'pointer',summary:'receipt',spacer:'space',divider:'minus',html:'code'};

function renderEditor(){
  var f = F(); if(!f){ go('funnels'); return; }
  fixSel();
  var h = '<div class="ed"><header class="etop">'
    + '<button class="btn ghost sm ic" data-a="nav" data-v="funnels" title="Zurück zum Dashboard">'+I('left')+'</button>'
    + '<input class="nmin" id="fname" value="'+esc(f.name)+'" size="'+Math.max(8,f.name.length)+'">'
    + '<span class="pill '+(f.status==='live'?'live':'draft')+'">'+(f.status==='live'?'Live':'Entwurf')+'</span><span class="sv" id="svst">'+I('check',13)+' Gespeichert</span>'
    + '<div class="sp"></div>'
    + '<div class="seg"><button class="'+(S.device==='mobile'?'on':'')+'" data-a="device" data-v="mobile" title="Mobil">'+I('mobile',15)+'</button><button class="'+(S.device==='desk'?'on':'')+'" data-a="device" data-v="desk" title="Desktop">'+I('monitor',15)+'</button></div>'
    + '<div class="vr"></div><button class="btn ghost sm ic" data-a="undo" title="Rückgängig (⌘Z)"'+(S.hist.length?'':' disabled')+'>'+I('undo')+'</button><button class="btn ghost sm ic" data-a="redo" title="Wiederholen (⌘⇧Z)"'+(S.fut.length?'':' disabled')+'>'+I('redo')+'</button><div class="vr"></div>'
    + '<button class="btn sm" data-a="preview">'+I('play',14)+'Vorschau</button><button class="btn sm pri" data-a="publish">'+I('rocket',14)+'Veröffentlichen</button></header>'
    + '<div class="ebody"><aside class="lp" id="lp"></aside><section class="canvas" id="canvas"></section><aside class="rp" id="rp"></aside></div></div>';
  $('#app').innerHTML = h;
  ensureFonts();
  renderLeft(); renderCanvas(); renderRight();
}
function renderLeft(){
  var f = F(), lp = $('#lp'); if(!lp) return;
  var h = '<div class="ptabs"><button class="'+(S.ltab==='elements'?'on':'')+'" data-a="ltab" data-v="elements">'+I('plus',14)+'Elemente</button><button class="'+(S.ltab==='pages'?'on':'')+'" data-a="ltab" data-v="pages">'+I('file',14)+'Seiten <span class="pill nos" style="padding:0 6px">'+f.pages.length+'</span></button></div><div class="pscroll">';
  if(S.ltab === 'elements'){
    var q = S.libq.toLowerCase();
    h += '<label class="search libsearch" style="min-width:0;height:34px;box-shadow:none">'+I('search')+'<input id="libq" placeholder="Element suchen …" value="'+esc(S.libq)+'"></label>';
    var groups = {}; T.LIB.forEach(function(l){ if(q && l.n.toLowerCase().indexOf(q) < 0) return; (groups[l.g] = groups[l.g] || []).push(l); });
    if(!q || 'sektion'.indexOf(q) >= 0 || T.SECTIONS.some(function(s){ return s.n.toLowerCase().indexOf(q) >= 0; })) h += '<div class="libg"><h4>Fertige Sektionen</h4><div class="lib">' + T.SECTIONS.filter(function(s){ return !q || s.n.toLowerCase().indexOf(q) >= 0 || 'sektion'.indexOf(q) >= 0; }).map(function(s){ return '<div class="li wide" draggable="true" data-lib="'+s.id+'" data-a="addLib" title="Klicken oder ziehen">'+'<span class="lic">'+I(s.ic)+'</span>'+esc(s.n)+'</div>'; }).join('') + '</div></div>';
    Object.keys(groups).forEach(function(g){ h += '<div class="libg"><h4>'+g+'</h4><div class="lib">' + groups[g].map(function(l){ return '<div class="li" draggable="true" data-lib="'+l.id+'" data-a="addLib" title="Klicken oder ziehen"><span class="lic">'+I(l.ic)+'</span>'+esc(l.n)+'</div>'; }).join('') + '</div></div>'; });
    h += '<p class="hint" style="text-align:center">Ziehe Elemente auf das Handy oder klicke, um sie unter dem markierten Element einzufügen.</p>';
  } else {
    h += '<div class="plist">' + f.pages.map(function(p, i){ var link = p.next ? f.pages.filter(function(x){ return x.id===p.next; })[0] : null, routes = (p.scoreRoutes||[]).length, br = p.blocks.some(function(b){ return (b.props.options||[]).some(function(o){ return o.goto; }) || (b.type==='button' && b.props.action==='page'); });
      return '<div class="pitem'+(i===S.pi?' on':'')+'" draggable="true" data-pidx="'+i+'" data-a="page" data-i="'+i+'"><span class="n">'+(i+1)+'</span><span class="t">'+esc(p.name)+'</span>'+((link||routes||br)?'<span class="go" title="Hat Logik/Sprünge">'+I('branch',12)+'</span>':'')+'<span class="c">'+p.blocks.length+'</span><button class="ibtn" data-a="pmenu" data-i="'+i+'">'+I('more')+'</button></div>'; }).join('') + '</div>'
      + '<button class="btn sm" style="width:100%;margin-top:10px;justify-content:center" data-a="addPage">'+I('plus',14)+'Seite hinzufügen</button>'
      + '<p class="hint" style="margin-top:14px">Seiten per Drag &amp; Drop sortieren. Elemente auf eine Seite ziehen, um sie dorthin zu verschieben.</p>';
  }
  lp.innerHTML = h + '</div>';
}
function renderCanvas(keepScroll){
  var f = F(), cv = $('#canvas'); if(!cv) return;
  var oldScr = $('#scr'), st = oldScr ? oldScr.scrollTop : 0;
  var chips = f.pages.map(function(p, i){ return '<div class="pchip'+(i===S.pi?' on':'')+'" draggable="true" data-pidx="'+i+'" data-a="page" data-i="'+i+'"><span class="n">'+(i+1)+'</span><span class="t">'+esc(p.name)+'</span></div>'; }).join('');
  var t = f.theme;
  var html = FP.renderPage(f, S.pi, {edit:true, answers:{}});
  cv.innerHTML = '<div class="pstrip">'+chips+'<button class="pchip add" data-a="addPage" title="Seite hinzufügen">'+I('plus',14)+'</button></div>'
    + '<div class="phone '+(S.device==='desk'?'desk':'')+'"><div class="notch"></div><div class="scr" id="scr" style="background:'+esc(t.bg)+'"><div class="sbar" style="color:'+esc(t.text)+';background:'+esc(curPage().bg||t.bg)+'"><span>9:41</span><i></i></div><div class="fp-host">'+html+'</div></div></div>'
    + '<div class="canvas-hint"><span><kbd>Entf</kbd> löschen</span><span><kbd>⌘D</kbd> duplizieren</span><span><kbd>⌘Z</kbd> rückgängig</span><span><kbd>↑</kbd><kbd>↓</kbd> verschieben</span></div>';
  var scr = $('#scr');
  if(keepScroll) scr.scrollTop = st;
  if(S.sel){ var el = scr.querySelector('.fp-b[data-bid="'+S.sel+'"]'); if(el){ el.classList.add('sel'); placeTool(el); if(!keepScroll){ var r = el.getBoundingClientRect(), sr = scr.getBoundingClientRect(); if(r.top < sr.top || r.bottom > sr.bottom) scr.scrollTop += r.top - sr.top - 80; placeTool(el); } } }
  scr.addEventListener('scroll', function(){ var el = S.sel && scr.querySelector('.fp-b.sel'); if(el) placeTool(el); });
}
function placeTool(el){
  var scr = $('#scr'); if(!scr) return;
  var old = $('#btool'); if(old) old.remove();
  var b = selBlock(); if(!b) return;
  var tb = document.createElement('div'); tb.className = 'btool'; tb.id = 'btool';
  tb.innerHTML = '<span class="tl">'+esc(BNAME[b.type]||b.type)+'</span><button data-a="bup" title="Nach oben">'+I('chevUp')+'</button><button data-a="bdown" title="Nach unten">'+I('chevDown')+'</button><button data-a="bdup" title="Duplizieren">'+I('dup')+'</button><button data-a="bdel" title="Löschen">'+I('trash')+'</button>';
  scr.appendChild(tb);
  var r = el.getBoundingClientRect(), sr = scr.getBoundingClientRect();
  var top = r.top - sr.top + scr.scrollTop - 38;
  if(top < scr.scrollTop + 46) top = r.bottom - sr.top + scr.scrollTop + 8;
  tb.style.top = top + 'px';
  tb.style.left = Math.max(6, Math.min(sr.width - tb.offsetWidth - 6, r.right - sr.left - tb.offsetWidth + 4)) + 'px';
}

/* ---- right panel ---- */
function renderRight(){
  var rp = $('#rp'); if(!rp) return;
  var b = selBlock();
  if(S.rtab === 'el' && !b) S.rtab = 'page';
  var tabs = [['el','Element','pointer'],['page','Seite','file'],['design','Design','palette'],['set','Funnel','settings']];
  var h = '<div class="ptabs">' + tabs.map(function(t){ return '<button class="'+(S.rtab===t[0]?'on':'')+'" data-a="rtab" data-v="'+t[0]+'"'+(t[0]==='el'&&!b?' style="opacity:.45"':'')+'>'+t[1]+'</button>'; }).join('') + '</div><div class="pscroll" id="rps">';
  if(S.rtab === 'el') h += panelElement(b);
  else if(S.rtab === 'page') h += panelPage();
  else if(S.rtab === 'design') h += panelDesign();
  else h += panelSettings();
  var sc = $('#rps'), st = sc ? sc.scrollTop : 0;
  rp.innerHTML = h + '</div>';
  $('#rps').scrollTop = st;
}
function pageOptions(sel, emptyLabel){ var f = F(); return '<option value="">'+esc(emptyLabel||'– Standard –')+'</option>' + f.pages.map(function(p, i){ return '<option value="'+p.id+'"'+(p.id===sel?' selected':'')+'>'+(i+1)+'. '+esc(p.name)+'</option>'; }).join(''); }
function field(spec, p, scope){
  var k = spec[0], type = spec[1], label = spec[2], extra = spec[3], show = spec[4];
  if(show && !show(p)) return '';
  if(type === 'row') return '<div class="'+(label.length===3?'row3':'row2')+'">' + label.map(function(s){ return field(s, p, scope); }).join('') + '</div>';
  var v = p[k], a = 'data-'+scope+'="'+k+'"', hint = (typeof extra === 'string') ? '<div class="hint">'+esc(extra)+'</div>' : '';
  var w = function(inner, noLabel){ return '<div class="fld">'+(noLabel?'':'<label>'+esc(label)+'</label>')+inner+hint+'</div>'; };
  switch(type){
    case 'text': return w('<input class="inp" '+a+' value="'+esc(v)+'">');
    case 'textarea': return w('<textarea class="inp" '+a+' rows="3">'+esc(v)+'</textarea>');
    case 'code': return w('<textarea class="inp" '+a+' rows="6" style="font-family:ui-monospace,monospace;font-size:12px">'+esc(v)+'</textarea>');
    case 'num': return w('<input class="inp" type="number" '+a+' data-num value="'+(v==null?'':esc(v))+'">');
    case 'range': var un = extra[3] != null ? extra[3] : (k==='stars'||k==='max'?'':'px'); return w('<div class="rng"><input type="range" '+a+' data-num data-unit="'+un+'" min="'+extra[0]+'" max="'+extra[1]+'" step="'+extra[2]+'" value="'+(v==null||v===''?extra[0]:v)+'"><span>'+(v==null||v===''?extra[0]:v)+un+'</span></div>');
    case 'font': return w(fontSelect(scope, k, v || '', true));
    case 'select': return w('<select class="inp" '+a+' data-rp>'+extra.map(function(o){ return '<option value="'+o[0]+'"'+(String(v)===String(o[0])?' selected':'')+'>'+esc(o[1])+'</option>'; }).join('')+'</select>');
    case 'seg': return w('<div class="segf">'+extra.map(function(o){ return '<button data-a="seg" data-scope="'+scope+'" data-k="'+k+'" data-v="'+esc(o[0])+'" data-t="'+(typeof o[0])+'" class="'+(String(v==null?'':v)===String(o[0])?'on':'')+'">'+esc(o[1])+'</button>'; }).join('')+'</div>');
    case 'color': return w('<div style="display:flex;gap:6px">'+colorField(scope, k, v||'')+(v?'<button class="ibtn" data-a="clearProp" data-scope="'+scope+'" data-k="'+k+'" title="Zurücksetzen">'+I('x')+'</button>':'')+'</div>');
    case 'toggle': return '<label class="tgl"><span>'+esc(label)+'</span><input type="checkbox" '+a+' data-bool data-rp'+(v?' checked':'')+'><span class="sw"></span></label>'+(hint?'<div style="margin:-6px 0 12px">'+hint+'</div>':'');
    case 'image': return w('<div class="upl"><div class="pv" style="'+(v?'background-image:url(&quot;'+esc(v)+'&quot;)':'')+'">'+(v?'':I('image'))+'</div><label class="btn sm">'+I('upload',13)+(v?'Ersetzen':'Hochladen')+'<input type="file" accept="image/*" data-img="'+k+'" data-scope="'+scope+'"></label>'+(v?'<button class="ibtn" data-a="clearProp" data-scope="'+scope+'" data-k="'+k+'" title="Entfernen">'+I('trash')+'</button>':'')+'</div>');
    case 'key': return '<div class="fld"><label>'+esc(label)+'</label><input class="inp" '+a+' value="'+esc(v)+'" placeholder="automatisch" style="font-family:ui-monospace,monospace;font-size:12px"><div class="hint">Für Variablen ({{'+esc(v||'schluessel')+'}}), Webhook &amp; Export.</div></div>';
    case 'page': return w('<select class="inp" '+a+'>'+pageOptions(v, 'Nächste Seite (Standard)')+'</select>');
    case 'strings': return w((v||[]).map(function(s, i){ return '<div class="strl"><input class="inp" data-arr="'+k+'" data-ai="'+i+'" value="'+esc(s)+'"><button class="ibtn" data-a="arrDel" data-k="'+k+'" data-i="'+i+'">'+I('x')+'</button></div>'; }).join('') + '<button class="btn sm" data-a="arrAdd" data-k="'+k+'">'+I('plus',13)+'Hinzufügen</button>');
    case 'faq': return w((v||[]).map(function(it, i){ return '<div class="oped open" style="padding:8px"><div style="display:flex;gap:6px;margin-bottom:6px"><input class="inp" data-faq="'+i+'" data-fk="q" value="'+esc(it.q)+'" placeholder="Frage"><button class="ibtn" data-a="faqDel" data-i="'+i+'">'+I('x')+'</button></div><textarea class="inp" data-faq="'+i+'" data-fk="a" rows="2" placeholder="Antwort">'+esc(it.a)+'</textarea></div>'; }).join('') + '<button class="btn sm" data-a="faqAdd">'+I('plus',13)+'Frage hinzufügen</button>');
    case 'days': var wd = [[1,'Mo'],[2,'Di'],[3,'Mi'],[4,'Do'],[5,'Fr'],[6,'Sa'],[0,'So']]; return w('<div class="segf">'+wd.map(function(d){ return '<button data-a="dayTgl" data-v="'+d[0]+'" class="'+((v||[]).indexOf(d[0])>=0?'on':'')+'">'+d[1]+'</button>'; }).join('')+'</div>');
    case 'options': return w(optionsEditor(p));
  }
  return '';
}
function optionsEditor(p){
  var openSet = S.openOpts || {};
  return (p.options||[]).map(function(o, i){
    return '<div class="oped'+(openSet[o.id]?' open':'')+'"><div class="oh"><input class="em" data-o="icon" data-oi="'+i+'" value="'+esc(o.icon||'')+'" placeholder="😀" title="Emoji"><input class="ol" data-o="label" data-oi="'+i+'" value="'+esc(o.label)+'">'
      + (o.goto?'<span title="Springt zu Seite" style="color:var(--a)">'+I('branch',13)+'</span>':'')
      + '<button class="ibtn" data-a="optToggle" data-oid="'+o.id+'" title="Details, Preis & Logik">'+I('settings')+'</button><button class="ibtn" data-a="optMove" data-i="'+i+'" data-d="-1" title="Nach oben">'+I('chevUp')+'</button><button class="ibtn" data-a="optDel" data-i="'+i+'" title="Entfernen">'+I('x')+'</button></div>'
      + '<div class="ob"><div class="fld"><label>Untertitel</label><input class="inp" data-o="sub" data-oi="'+i+'" value="'+esc(o.sub||'')+'"></div>'
      + '<div class="row2"><div class="fld"><label>Festpreis (+)</label><input class="inp" type="number" data-o="price" data-oi="'+i+'" data-num value="'+(o.price||'')+'" placeholder="0"></div><div class="fld"><label>Preis pro Einheit</label><input class="inp" type="number" data-o="unitPrice" data-oi="'+i+'" data-num value="'+(o.unitPrice||'')+'" placeholder="0"></div></div>'
      + '<div class="row2"><div class="fld"><label>Einheit (Anzeige)</label><input class="inp" data-o="unitLabel" data-oi="'+i+'" value="'+esc(o.unitLabel||'')+'" placeholder="m²"></div><div class="fld"><label>Punkte (Quiz)</label><input class="inp" type="number" data-o="score" data-oi="'+i+'" data-num value="'+(o.score||'')+'" placeholder="0"></div></div>'
      + '<div class="fld"><label>Bei Auswahl springen zu</label><select class="inp" data-o="goto" data-oi="'+i+'">'+pageOptions(o.goto,'Keine Verzweigung')+'</select></div>'
      + (p.layout==='image'?'<div class="fld"><label>Bild</label><div class="upl"><div class="pv" style="'+(o.img?'background-image:url(&quot;'+esc(o.img)+'&quot;)':'')+'">'+(o.img?'':I('image'))+'</div><label class="btn sm">'+I('upload',13)+'Hochladen<input type="file" accept="image/*" data-optimg="'+i+'"></label>'+(o.img?'<button class="ibtn" data-a="optImgDel" data-i="'+i+'">'+I('trash')+'</button>':'')+'</div></div>':'')
      + '</div></div>';
  }).join('') + '<button class="btn sm" data-a="optAdd">'+I('plus',13)+'Antwort hinzufügen</button>';
}
function panelElement(b){
  if(!b) return '<div class="emptyp"><div class="ic">'+I('pointer',20)+'</div>Wähle ein Element auf dem Handy aus, um es zu bearbeiten.</div>';
  var p = b.props;
  var h = '<div class="bhead"><span class="lic">'+I(BICON[b.type]||'grid')+'</span><div><b>'+esc(BNAME[b.type]||b.type)+'</b><small>Seite '+(S.pi+1)+' · '+esc(curPage().name)+'</small></div><span style="flex:1"></span><button class="ibtn" data-a="bdup" title="Duplizieren">'+I('dup')+'</button><button class="ibtn" data-a="bdel" title="Löschen">'+I('trash')+'</button></div>';
  h += '<div class="psec"><h5>Inhalt</h5>' + (FIELDS[b.type]||[]).map(function(s){ return field(s, p, 'p'); }).join('') + '</div>';
  if(b.type === 'choice' || b.type === 'button'){
    h += '<div class="psec"><h5>'+I('branch',13)+'Logik</h5><p class="hint" style="margin:0">'+(b.type==='choice'?'Pro Antwort kannst du unter '+I('settings',11)+' eine Zielseite festlegen (Verzweigung), Preise für den Konfigurator und Punkte für Quiz-Auswertungen.':'Absenden speichert den Lead, sendet ihn an den Webhook und leitet zur Zielseite weiter.')+'</p></div>';
  }
  h += '<div class="psec"><h5>Layout</h5>' + field(['align','seg','Ausrichtung',[['left','Links'],['center','Mitte'],['right','Rechts']]], p, 'p')
    + field(['half','toggle','Halbe Breite (2 Elemente nebeneinander)'], p, 'p')
    + '<div class="row2">' + field(['mt','num','Abstand oben'], p, 'p') + field(['mb','num','Abstand unten'], {mb: p.mb != null ? p.mb : 16}, 'p') + '</div></div>';
  var dv = Object.assign({}, p, {scale: p.scale || 100, delay: p.delay || 0, pad: p.pad || 0, brad: p.brad == null || p.brad === '' ? 0 : p.brad, anim: p.anim || 'none', vis: p.vis || 'all'});
  var hasStyle = STYLE_KEYS.some(function(k){ return p[k] !== undefined && p[k] !== '' && p[k] !== false && !(k==='anim' && p[k]==='none') && !(k==='vis' && p[k]==='all') && !(k==='scale' && +p[k]===100); });
  h += '<div class="psec"><h5>'+I('palette',13)+'Stil'+(hasStyle?'<span style="flex:1"></span><button class="btn sm ghost" data-a="styleReset" style="height:24px;text-transform:none;letter-spacing:0">Zurücksetzen</button>':'')+'</h5>';
  if(TEXTY[b.type]) h += '<div class="subh">Typografie</div>' + STYLE_TYPO.map(function(sp){ return field(sp, dv, 'p'); }).join('');
  h += '<div class="subh">Box</div>' + STYLE_BOX.map(function(sp){ return field(sp, dv, 'p'); }).join('');
  h += '<div class="subh">Effekte & Sichtbarkeit</div>' + STYLE_FX.map(function(sp){ return field(sp, dv, 'p'); }).join('') + '</div>';
  return h;
}
function panelPage(){
  var f = F(), pg = curPage();
  var h = '<div class="psec"><h5>Seite '+(S.pi+1)+' von '+f.pages.length+'</h5>'
    + '<div class="fld"><label>Name</label><input class="inp" data-pp="name" value="'+esc(pg.name)+'"></div>'
    + '<label class="tgl"><span>Inhalt vertikal zentrieren</span><input type="checkbox" data-pp="vcenter" data-bool'+(pg.vcenter?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Fortschrittsbalken ausblenden</span><input type="checkbox" data-pp="hideProgress" data-bool'+(pg.hideProgress?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Lead beim Öffnen speichern</span><input type="checkbox" data-pp="submitOnEnter" data-bool'+(pg.submitOnEnter?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Zurück-Button erlauben</span><input type="checkbox" data-pp="allowBack" data-bool data-inv'+(pg.allowBack===false?'':' checked')+'><span class="sw"></span></label>'
    + (FP.hasButton(pg) || S.pi === f.pages.length-1 ? '' : '<label class="tgl"><span>Automatischer Weiter-Button</span><input type="checkbox" data-pp="autoButton" data-bool data-inv data-rp'+(pg.autoButton===false?'':' checked')+'><span class="sw"></span></label>' + (pg.autoButton===false?'':'<div class="fld"><label>Button-Text</label><input class="inp" data-pp="buttonLabel" value="'+esc(pg.buttonLabel||'')+'" placeholder="'+esc(f.theme.nextLabel||'Weiter')+'"></div>'))
    + '</div>';
  h += '<div class="psec"><h5>'+I('branch',13)+'Weiterleitung</h5><div class="fld"><label>Nach dieser Seite</label><select class="inp" data-pp="next">'+pageOptions(pg.next,'Nächste Seite (Standard)')+'</select><div class="hint">Antwort-Verzweigungen haben Vorrang.</div></div>'
    + '<div class="flab">Weiterleitung nach Punktzahl (Quiz)</div>' + (pg.scoreRoutes||[]).map(function(r, i){ return '<div class="strl" style="align-items:center"><input class="inp" type="number" style="width:58px" data-sr="'+i+'" data-sk="min" value="'+r.min+'" title="von"><span style="color:var(--mut)">–</span><input class="inp" type="number" style="width:58px" data-sr="'+i+'" data-sk="max" value="'+r.max+'" title="bis"><select class="inp" data-sr="'+i+'" data-sk="goto">'+pageOptions(r.goto,'Seite wählen')+'</select><button class="ibtn" data-a="srDel" data-i="'+i+'">'+I('x')+'</button></div>'; }).join('')
    + '<button class="btn sm" data-a="srAdd">'+I('plus',13)+'Regel hinzufügen</button><div class="hint">Summe der Punkte aller gewählten Antworten.</div></div>';
  h += '<div class="psec"><h5>Hintergrund</h5><div class="fld"><label>Hintergrundfarbe (nur diese Seite)</label><div style="display:flex;gap:6px">'+colorField('pp','bg',pg.bg||'')+(pg.bg?'<button class="ibtn" data-a="clearProp" data-scope="pp" data-k="bg">'+I('x')+'</button>':'')+'</div></div>'
    + field(['bgImage','image','Hintergrundbild (nur diese Seite)'], pg, 'pp') + '</div>';
  h += '<div class="psec" style="display:flex;gap:8px"><button class="btn sm" data-a="pdup" data-i="'+S.pi+'">'+I('dup',13)+'Duplizieren</button><button class="btn sm danger" data-a="pdel" data-i="'+S.pi+'"'+(f.pages.length<2?' disabled':'')+'>'+I('trash',13)+'Löschen</button></div>';
  return h;
}
function panelDesign(){
  var t = F().theme;
  var seg = function(k, l, opts){ return field([k,'seg',l,opts], t, 't'); };
  var tgl = function(k, l, hint){ return field([k,'toggle',l,hint||null], t, 't'); };
  var rng = function(k, l, a){ return field([k,'range',l,a], Object.assign({}, t, (function(){ var o = {}; o[k] = t[k] == null || t[k] === '' ? a[4] : t[k]; return o; })()), 't'); };
  var h = '<div class="psec"><h5>Themes</h5><div class="presets">' + Object.keys(T.THEMES).map(function(k){ var th = T.THEMES[k], on = th.primary===t.primary && th.bg===t.bg; return '<button class="preset'+(on?' on':'')+'" data-a="preset" data-v="'+k+'"><div class="sw" style="background:'+th.bg+';border:1px solid rgba(0,0,0,.06)"><i style="background:'+th.primary+'"></i><i style="background:'+th.surface+'"></i><i style="background:'+th.text+'"></i></div><span style="font-family:\''+th.headingFont+'\'">'+th.name+'</span></button>'; }).join('') + '</div></div>';
  h += '<div class="psec"><h5>Farben</h5><div class="row2"><div class="fld"><label>Primär / Akzent</label>'+colorField('t','primary',t.primary)+'</div><div class="fld"><label>Text auf Primär</label>'+colorField('t','primaryText',t.primaryText)+'</div></div>'
    + '<div class="row2"><div class="fld"><label>Hintergrund</label>'+colorField('t','bg',t.bg)+'</div><div class="fld"><label>Flächen / Karten</label>'+colorField('t','surface',t.surface)+'</div></div>'
    + '<div class="row2"><div class="fld"><label>Text</label>'+colorField('t','text',t.text)+'</div><div class="fld"><label>Text sekundär</label>'+colorField('t','muted',t.muted)+'</div></div>'
    + tgl('bgGrad','Hintergrund als Verlauf') + (t.bgGrad ? '<div class="row2"><div class="fld"><label>Verlauf bis</label>'+colorField('t','bg2',t.bg2||'#eef0ff')+'</div>'+rng('bgAngle','Winkel',[0,360,5,'°',180])+'</div>' : '') + '</div>';
  h += '<div class="psec"><h5>Typografie</h5><div class="fld"><label>Überschriften</label>'+fontSelect('t','headingFont',t.headingFont)+'</div><div class="fld"><label>Fließtext</label>'+fontSelect('t','font',t.font)+'</div>'
    + '<div class="fontbar"><button class="btn sm" data-a="fontAdd">'+I('plus',13)+'Google Font</button><label class="btn sm">'+I('upload',13)+'Schrift hochladen<input type="file" accept=".woff2,.woff,.ttf,.otf" data-fontup></label></div>'
    + rng('scale','Schriftgröße gesamt',[80,125,5,'%',100])
    + seg('headingWeight','Stärke Überschriften',[[400,'400'],[500,'500'],[600,'600'],[700,'700'],[800,'800']])
    + '<div class="row2">' + rng('headingLs','Laufweite Überschr.',[-6,10,1,'',-2]) + rng('lineHeight','Zeilenhöhe Text',[1.2,2,0.05,'',1.55]) + '</div>'
    + tgl('headingUpper','Überschriften in Großbuchstaben') + '</div>';
  h += '<div class="psec"><h5>Buttons</h5>' + field(['btnVariant','select','Standard-Stil',[['filled','Gefüllt'],['gradient','Verlauf'],['soft','Soft'],['outline','Rahmen']]], t, 't')
    + '<div class="row2">' + rng('btnRadius','Ecken',[0,40,1,'px',12]) + rng('btnPad','Höhe',[10,24,1,'px',16]) + '</div>'
    + seg('btnWeight','Schriftstärke',[[500,'500'],[600,'600'],[700,'700'],[800,'800']])
    + tgl('btnUpper','Button-Text in Großbuchstaben') + tgl('stickyCta','Button unten fixieren (Sticky CTA)','Der letzte Button jeder Seite bleibt am unteren Bildschirmrand sichtbar.') + '</div>';
  h += '<div class="psec"><h5>Felder & Antwortkarten</h5>' + rng('radius','Ecken',[0,28,1,'px',14])
    + seg('inputStyle','Eingabefelder',[['outline','Rahmen'],['filled','Gefüllt'],['line','Linie']])
    + seg('optStyle','Antwortkarten',[['filled','Gefüllt'],['outline','Rahmen'],['shadow','Schatten']]) + '</div>';
  h += '<div class="psec"><h5>Header & Navigation</h5><div class="fld"><label>Logo-Text</label><input class="inp" data-t="logoText" value="'+esc(t.logoText)+'" placeholder="Firmenname"></div>' + field(['logoImg','image','Logo (Bild, ersetzt Text)'], t, 't')
    + seg('logoAlign','Logo-Position',[['center','Mitte'],['left','Links']])
    + seg('progress','Fortschritt',[['bar','Balken'],['steps','Schritte'],['none','Aus']])
    + tgl('progressTop','Fortschrittsbalken ganz oben (über dem Logo)')
    + tgl('backButton','Zurück-Button anzeigen')
    + '<div class="fld"><label>Standard-Text „Weiter“-Button</label><input class="inp" data-t="nextLabel" value="'+esc(t.nextLabel||'Weiter')+'"></div></div>';
  h += '<div class="psec"><h5>Layout & Animation</h5>' + rng('pad','Seitenabstand',[8,40,1,'px',20])
    + '<div class="fld"><label>Seitenübergang</label><select class="inp" data-t="animation">'+[['slide','Slide'],['fade','Fade'],['up','Von unten'],['zoom','Zoom'],['none','Keine']].map(function(o){ return '<option value="'+o[0]+'"'+(t.animation===o[0]?' selected':'')+'>'+o[1]+'</option>'; }).join('')+'</select></div>'
    + field(['bgImage','image','Hintergrundbild (alle Seiten)'], t, 't') + (t.bgImage?'<div class="fld"><label>Overlay</label>'+colorField('t','overlay',t.overlay)+'<div class="hint">z. B. rgba(0,0,0,0.4) für bessere Lesbarkeit</div></div>':'')
    + '<div class="fld"><label>Footer-Text</label><input class="inp" data-t="footer" value="'+esc(t.footer||'')+'" placeholder="Impressum · Datenschutz"></div></div>';
  h += '<div class="psec"><h5>'+I('code',13)+'Eigenes CSS</h5><textarea class="inp" data-t="customCss" rows="5" style="font-family:ui-monospace,monospace;font-size:11.5px" placeholder=".fp-btn{letter-spacing:.02em}\n.fp-h1{font-size:32px}">'+esc(t.customCss||'')+'</textarea><div class="hint">Klassen: .fp-h1/.fp-h2 (Überschriften), .fp-txt, .fp-btn, .fp-opt, .fp-in, .fp-badge, .fp-prog</div></div>';
  return h;
}
function panelSettings(){
  var f = F(), s = f.settings;
  var keys = []; FP.allBlocks(f).forEach(function(b){ if(['choice','input','slider','rating','calendar','checkbox','upload','signature'].indexOf(b.type) >= 0 && b.props.key) keys.push(b.props.key); });
  var h = '<div class="psec"><h5>Allgemein</h5><div class="fld"><label>Funnel-Name</label><input class="inp" data-fn value="'+esc(f.name)+'"></div>'
    + '<div class="fld"><label>Status</label><div class="segf"><button data-a="fstatus" data-v="draft" class="'+(f.status!=='live'?'on':'')+'">Entwurf</button><button data-a="fstatus" data-v="live" class="'+(f.status==='live'?'on':'')+'">Live</button></div></div></div>';
  h += '<div class="psec"><h5>'+I('folder',13)+'Kunde & Freigabe</h5><div class="fld"><label>Kunde</label><select class="inp" data-fclient>'+'<option value="">– Intern (kein Kunde) –</option>'+(db.clients||[]).map(function(c){ return '<option value="'+c.id+'"'+(f.clientId===c.id?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('')+'</select></div>'
    + (f.clientId ? '<label class="tgl"><span>Für den Kunden freigeschaltet</span><input type="checkbox" data-fshare'+(f.shared?' checked':'')+'><span class="sw"></span></label><div class="hint">Freigeschaltet sieht der Kunde in seinem Login den Funnel, alle Kontakte und die Analytics. Bearbeiten kannst nur du.</div>' : '<div class="hint">Ordne den Funnel einem Kunden zu, um ihn für dessen Login freizuschalten.</div>') + '</div>';
  h += '<div class="psec"><h5>'+I('receipt',13)+'Preisberechnung</h5><div class="row2"><div class="fld"><label>Währung</label><select class="inp" data-s="currency">'+['EUR','CHF','USD','GBP'].map(function(c){ return '<option'+(s.currency===c?' selected':'')+'>'+c+'</option>'; }).join('')+'</select></div><div class="fld"><label>Grundpreis</label><input class="inp" type="number" data-s="basePrice" data-num value="'+(s.basePrice||'')+'" placeholder="0"></div></div>'
    + '<div class="fld"><label>Bezeichnung Grundpreis</label><input class="inp" data-s="baseLabel" value="'+esc(s.baseLabel||'Grundpreis')+'"></div>'
    + '<div class="hint">Formel: Grundpreis + Festpreise + (Preise pro Einheit × Menge). Die Menge kommt aus einem Schieberegler mit „Als Menge für Preisberechnung“.</div></div>';
  h += '<div class="psec"><h5>'+I('zap',13)+'Integrationen</h5><div class="fld"><label>Webhook-URL</label><input class="inp" data-s="webhook" value="'+esc(s.webhook||'')+'" placeholder="https://hook.eu1.make.com/…"><div class="hint">Leads werden beim Absenden als JSON gesendet (Make, Zapier, n8n, Supabase Edge Function).</div></div>'
    + '<div class="fld"><label>Weiterleitung nach Absenden (optional)</label><input class="inp" data-s="redirect" value="'+esc(s.redirect||'')+'" placeholder="https://deine-seite.de/danke"></div>'
    + '<div class="fld"><label>Meta Pixel ID (optional)</label><input class="inp" data-s="pixel" value="'+esc(s.pixel||'')+'" placeholder="123456789012345"><div class="hint">Feuert „PageView“ und „Lead“ im exportierten Funnel.</div></div></div>';
  h += '<div class="psec"><h5>Personalisierung</h5><p class="hint" style="margin:0 0 6px">Verfügbare Variablen für Texte und Überschriften (klicken zum Kopieren):</p><div class="varlist">' + keys.concat(['vorname','total','score']).filter(function(k, i, a){ return a.indexOf(k) === i; }).map(function(k){ return '<code data-a="copyVar" data-v="{{'+esc(k)+'}}">{{'+esc(k)+'}}</code>'; }).join('') + '</div></div>';
  return h;
}

/* ---- editor mutations ---- */
function insertBlocks(blocks, pageIdx, at){
  var f = F(), pg = f.pages[pageIdx];
  if(at == null || at < 0 || at > pg.blocks.length) at = pg.blocks.length;
  snap(true);
  Array.prototype.splice.apply(pg.blocks, [at, 0].concat(blocks));
  S.pi = pageIdx; S.sel = blocks[blocks.length-1].id; S.rtab = 'el';
  touch(); renderLeft(); renderCanvas(true); renderRight();
}
function makeFromLib(id){
  var sec = T.SECTIONS.filter(function(s){ return s.id === id; })[0];
  if(sec) return sec.make();
  var b = T.fromLib(id);
  if(b.props.hasOwnProperty('key') && !b.props.key && b.type !== 'input') b.props.key = autoKey(b);
  else if(b.type === 'input') b.props.key = uniqueKey(b.props.key || 'feld');
  else if(b.props.key) b.props.key = uniqueKey(b.props.key);
  return [b];
}
function autoKey(b){ return uniqueKey(b.type === 'choice' ? 'frage' : b.type === 'slider' ? 'wert' : b.type); }
function uniqueKey(base){ var f = F(), keys = FP.allBlocks(f).map(function(b){ return b.props.key; }); if(keys.indexOf(base) < 0) return base; var i = 2; while(keys.indexOf(base+i) >= 0) i++; return base + i; }
function addFromLibClick(id){
  var blocks = makeFromLib(id), pg = curPage(), at = pg.blocks.length;
  if(S.sel){ var ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel); if(ix >= 0) at = ix + 1; }
  else { var lb = pg.blocks.length ? pg.blocks[pg.blocks.length-1] : null; if(lb && lb.type === 'button') at = pg.blocks.length - 1; }
  insertBlocks(blocks, S.pi, at);
}
function moveBlock(dir){
  var pg = curPage(), ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel), ni = ix + dir;
  if(ix < 0 || ni < 0 || ni >= pg.blocks.length) return;
  snap(true); var b = pg.blocks.splice(ix,1)[0]; pg.blocks.splice(ni,0,b); touch(); renderCanvas(true);
}
function dupBlock(){
  var pg = curPage(), ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel); if(ix < 0) return;
  snap(true); var c = clone(pg.blocks[ix]); c.id = uid(); if(c.props.options) c.props.options.forEach(function(o){ o.id = uid(); }); if(c.props.key) c.props.key = uniqueKey(c.props.key);
  pg.blocks.splice(ix+1, 0, c); S.sel = c.id; touch(); renderLeft(); renderCanvas(true); renderRight();
}
function delBlock(){
  var pg = curPage(), ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel); if(ix < 0) return;
  snap(true); pg.blocks.splice(ix,1); S.sel = pg.blocks[Math.min(ix, pg.blocks.length-1)] ? null : null; S.rtab = 'page'; touch(); renderLeft(); renderCanvas(true); renderRight();
}
function addPage(){
  var f = F(); snap(true);
  var p = T.P('Seite '+(f.pages.length+1), [T.B('heading',{text:'Neue Seite', level:2}), T.B('text',{})]);
  var at = S.pi + 1; f.pages.splice(at, 0, p); S.pi = at; S.sel = null; S.rtab = 'page';
  touch(); renderLeft(); renderCanvas(); renderRight();
}
function dupPage(i){
  var f = F(); snap(true); var c = clone(f.pages[i]); c.id = uid(); c.name += ' (Kopie)'; c.blocks.forEach(function(b){ b.id = uid(); if(b.props.options) b.props.options.forEach(function(o){ o.id = uid(); }); if(b.props.key) b.props.key = uniqueKey(b.props.key); });
  f.pages.splice(i+1, 0, c); S.pi = i+1; S.sel = null; touch(); renderLeft(); renderCanvas(); renderRight();
}
function delPage(i){
  var f = F(); if(f.pages.length < 2) return;
  confirmBox('Seite löschen?','„'+f.pages[i].name+'“ und alle Elemente darauf werden gelöscht.','Löschen',function(){
    snap(true); var id = f.pages[i].id; f.pages.splice(i,1);
    f.pages.forEach(function(p){ if(p.next === id) p.next = ''; (p.scoreRoutes||[]).forEach(function(r){ if(r.goto === id) r.goto = ''; }); p.blocks.forEach(function(b){ if(b.props.target === id) b.props.target = ''; (b.props.options||[]).forEach(function(o){ if(o.goto === id) o.goto = ''; }); }); });
    S.pi = Math.max(0, Math.min(i, f.pages.length-1)); S.sel = null; touch(); renderLeft(); renderCanvas(); renderRight();
  }, true);
}
function selectPage(i){ if(i === S.pi) return; S.pi = i; S.sel = null; if(S.rtab === 'el') S.rtab = 'page'; renderLeft(); renderCanvas(); renderRight(); }
function selectBlock(id){ S.sel = id; S.rtab = 'el'; S.openOpts = {}; $$('#scr .fp-b.sel').forEach(function(e){ e.classList.remove('sel'); }); var el = $('#scr .fp-b[data-bid="'+id+'"]'); if(el){ el.classList.add('sel'); placeTool(el); } renderRight(); }

/* ---- fonts ---- */
var fontsLoaded = {};
function ensureFonts(){
  FP.FONTS.concat((db.fonts && db.fonts.google) || []).forEach(function(n){ if(fontsLoaded[n]) return; fontsLoaded[n] = 1; var u = FP.fontLink(n); if(!u) return; var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; document.head.appendChild(l); });
  injectUploaded();
}
function fontFace(x){ return "@font-face{font-family:'"+String(x.name).replace(/'/g,'')+"';src:url("+x.data+");font-display:swap}"; }
function injectUploaded(){ var st = document.getElementById('fs-uf'); if(!st){ st = document.createElement('style'); st.id = 'fs-uf'; document.head.appendChild(st); } st.textContent = ((db.fonts && db.fonts.uploaded) || []).map(fontFace).join('\n'); }

/* ---- preview ---- */
function trackEvent(f, t, d){
  var st = f.stats, k = dayKey(Date.now()); st.daily[k] = st.daily[k] || {v:0, l:0};
  if(t === 'view'){ st.views++; st.daily[k].v++; }
  else if(t === 'start') st.starts++;
  else if(t === 'page'){ st.pages[d.pageId] = (st.pages[d.pageId]||0) + 1; }
  else if(t === 'complete'){ st.completes++; st.daily[k].l++; }
  save();
}
function openPreview(f, startIdx){
  var dev = S.device === 'desk' ? 'desk' : 'mobile';
  var w = document.createElement('div'); w.className = 'pvw';
  var build = function(){
    w.innerHTML = '<div class="pbar"><b style="margin-right:8px">'+esc(f.name)+'</b><div class="seg"><button class="'+(dev==='mobile'?'on':'')+'" data-pd="mobile">'+I('mobile',14)+'</button><button class="'+(dev==='desk'?'on':'')+'" data-pd="desk">'+I('monitor',14)+'</button></div><button class="btn sm" data-prs>'+I('refresh',14)+'Neu starten</button><button class="btn sm" data-pcl>'+I('x',14)+'Schließen</button></div>'
      + '<div class="phone '+(dev==='desk'?'desk':'')+'"><div class="notch"></div><div class="scr" data-fp-scroll style="background:'+esc(f.theme.bg)+'"><div class="sbar" style="color:'+esc(f.theme.text)+';background:'+esc(f.theme.bg)+'"><span>9:41</span><i></i></div><div class="fp-host" id="pvhost"></div></div></div>'
      + '<div class="note">Testmodus · Eingaben landen als „Test“ in deinen Kontakten · Videos werden nur im veröffentlichten Funnel abgespielt</div>';
    var host = w.querySelector('#pvhost');
    var inst = FP.mount(host, f, {scrollEl: w.querySelector('.scr'), onEvent:function(t, d){ if(isAdmin()) trackEvent(f, t, d); },
      onSubmit:function(lead){ if(!isAdmin()){ toast('Vorschau – es wurde nichts gespeichert'); return; } db.leads.unshift(Object.assign({id:uid(), funnelId:f.id, funnelName:f.name, createdAt:Date.now(), status:'neu', notes:'', test:true}, lead)); save(); toast('Test-Lead gespeichert'); },
      onUrl:function(u){ toast('Link: ' + u); }});
    if(startIdx) inst.goTo(startIdx);
    w.querySelector('[data-prs]').onclick = function(){ startIdx = 0; build(); };
    w.querySelector('[data-pcl]').onclick = close;
    $$('[data-pd]', w).forEach(function(b){ b.onclick = function(){ dev = b.getAttribute('data-pd'); build(); }; });
  };
  var close = function(){ w.remove(); document.removeEventListener('keydown', onk); if(S.view !== 'editor') render(); };
  var onk = function(e){ if(e.key === 'Escape') close(); };
  document.addEventListener('keydown', onk);
  document.body.appendChild(w); build();
}

/* ---- publish / export ---- */
function exportHtml(f){
  var data = JSON.stringify({id:f.id, name:f.name, theme:f.theme, settings:f.settings, pages:f.pages}).replace(/</g,'\\u003c').split(String.fromCharCode(8232)).join('\\u2028').split(String.fromCharCode(8233)).join('\\u2029');
  var css = $('#player-css').textContent, js = $('#player-js').textContent, s = f.settings || {};
  var up = (db.fonts && db.fonts.uploaded) || [], used = FP.usedFonts(f);
  var fontLinks = used.filter(function(n){ return !up.some(function(x){ return x.name === n; }); }).map(function(n){ var u = FP.fontLink(n); return u ? '<link rel="stylesheet" href="'+u+'">' : ''; }).join('\n');
  css = up.filter(function(x){ return used.indexOf(x.name) >= 0; }).map(fontFace).join('\n') + '\n' + css;
  var pixel = s.pixel ? '<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","'+String(s.pixel).replace(/[^0-9]/g,'')+'");fbq("track","PageView");<\/script>' : '';
  var init = 'var F=' + data + ';\n'
    + 'var W=F.settings.webhook||"";\n'
    + 'var Q={};try{new URLSearchParams(location.search).forEach(function(v,k){Q[k]=v;});}catch(e){}\n'
    + 'function send(type,payload){if(!W)return;try{fetch(W,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(Object.assign({type:type,funnelId:F.id,funnel:F.name,ts:new Date().toISOString(),url:location.href,utm:Q},payload||{}))}).catch(function(){});}catch(e){}}\n'
    + 'FP.mount(document.getElementById("funnel"),F,{live:true,\n'
    + ' onSubmit:function(lead){send("lead",{lead:lead});if(window.fbq)fbq("track","Lead",{value:lead.total||0,currency:F.settings.currency||"EUR"});if(F.settings.redirect)setTimeout(function(){location.href=F.settings.redirect;},1200);},\n'
    + ' onEvent:function(t,d){if(F.settings.trackEvents)send("event",{event:t,data:d});}\n'
    + '});';
  return '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>' + esc(f.name) + '</title>\n<meta name="theme-color" content="' + esc(f.theme.bg) + '">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' + fontLinks + '\n'
    + '<style>html,body{margin:0;min-height:100%;background:' + esc(f.theme.bg) + '}#funnel{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;max-width:560px;margin:0 auto;padding-top:env(safe-area-inset-top)}#funnel>.fp{flex:1}\n' + css + '</style>\n' + pixel + '\n</head>\n<body>\n<div id="funnel"></div>\n<script>\n' + js + '\n<\/script>\n<script>\n' + init + '\n<\/script>\n</body>\n</html>';
}
function publishModal(f){
  var tab = REMOTE ? 'link' : 'html';
  var body = function(){
    var html = exportHtml(f);
    var kb = Math.round(html.length/1024);
    var t = '<div class="tabs2">'+(REMOTE?'<button class="'+(tab==='link'?'on':'')+'" data-pt="link">Öffentlicher Link</button>':'')+'<button class="'+(tab==='qr'?'on':'')+'" data-pt="qr">QR-Code</button><button class="'+(tab==='html'?'on':'')+'" data-pt="html">Eigene Domain (HTML)</button><button class="'+(tab==='embed'?'on':'')+'" data-pt="embed">Einbetten</button><button class="'+(tab==='hook'?'on':'')+'" data-pt="hook">Webhook-Daten</button><button class="'+(tab==='json'?'on':'')+'" data-pt="json">JSON</button></div>';
    if(tab === 'link'){ var url = publicUrl(f); t += (f.status!=='live'?'<div class="callout" style="background:var(--warnS);border-color:#f6dfae;color:#8a5a00">'+I('info')+'<div>Der Funnel ist noch ein Entwurf. Schalte ihn oben auf <b>Live</b>, damit der Link funktioniert.</div></div>':'')+'<div class="fld"><label>Link zum Funnel</label><div style="display:flex;gap:8px"><input class="inp" readonly id="pubcode" value="'+esc(url)+'"><a class="btn" href="'+esc(url)+'" target="_blank" rel="noopener">'+I('ext',14)+'Öffnen</a></div><div class="hint">Leads und Statistiken landen automatisch in diesem Dashboard'+(f.clientId?' und im Portal des Kunden':'')+'.</div></div><div class="fld"><label>Einbetten (iFrame)</label><textarea class="code" readonly style="min-height:70px;height:70px">&lt;iframe src="'+esc(url)+'" style="width:100%;height:100vh;border:0"&gt;&lt;/iframe&gt;</textarea></div>'; }
    else if(tab === 'qr'){ var qu = REMOTE ? publicUrl(f) : (f.settings.hostedUrl || ''); t += '<div class="qrwrap"><div id="qrbox" class="qrbox">'+(qu?'':'<span>Link eingeben</span>')+'</div><div style="flex:1"><div class="fld"><label>Ziel-URL</label><input class="inp" id="qrurl" value="'+esc(qu)+'" placeholder="https://funnels.deine-domain.de/f/…"'+(REMOTE?' readonly':'')+'><div class="hint">'+(REMOTE?'Der QR-Code führt direkt zum Live-Funnel.':'Im Demo-Modus: die Adresse, unter der du die exportierte HTML-Datei hostest.')+'</div></div><p class="hint">Ideal für Montage-Rechnungen, Flyer, Aufkleber am Produkt oder NFC/QR-Aufsteller. Tipp: Hänge <code>?utm_source=flyer</code> an, um Quellen in den Analytics zu unterscheiden.</p><div id="qrdl"></div></div></div><input type="hidden" id="pubcode" value="'+esc(qu)+'">'; setTimeout(function(){ drawQR(qu); }, 0); }
    else if(tab === 'html') t += '<div class="callout">'+I('info')+'<div>Komplett eigenständige Datei ('+kb+' KB) inkl. Design, Logik und Preisberechnung – ohne Abhängigkeiten. Als <b>index.html</b> auf Netlify, Vercel, Cloudflare Pages, Lovable oder deinen Webspace legen. '+(f.settings.webhook?'Leads gehen an deinen Webhook.':'<b>Tipp:</b> Hinterlege unter „Funnel → Integrationen“ eine Webhook-URL, damit Leads ankommen.')+'</div></div><textarea class="code" readonly id="pubcode" style="height:260px">'+esc(html)+'</textarea>';
    else if(tab === 'embed') t += '<p style="margin:0 0 10px;color:var(--ink2)">Lade die HTML-Datei auf deine Domain hoch und binde sie per iFrame in bestehende Websites ein:</p><textarea class="code" readonly id="pubcode" style="height:120px">&lt;iframe src="https://deine-domain.de/'+esc(slug(f.name))+'/" style="width:100%;height:100vh;border:0" allow="fullscreen"&gt;&lt;/iframe&gt;</textarea><p class="hint">Für Popups oder Buttons kannst du die URL auch direkt verlinken.</p>';
    else if(tab === 'hook'){
      var sample = {type:'lead', funnelId:f.id, funnel:f.name, ts:new Date().toISOString(), url:'https://deine-domain.de/'+slug(f.name)+'/?utm_source=facebook', utm:{utm_source:'facebook'}, lead:{name:'Max Mustermann', email:'max@beispiel.de', phone:'+49 170 1234567', total:4250, score:0, answers:{'…':'…'}, fields:[{key:'material', label:'Welches Material wünschst du dir?', value:'WPC-Dielen'}], items:[{label:'WPC-Dielen', amount:2225, detail:'89 €/m² × 25 m²'}], durationSec:74}};
      t += '<p style="margin:0 0 10px;color:var(--ink2)">So sieht der JSON-Body aus, den dein Webhook beim Absenden erhält (POST, <code>text/plain</code> → kein CORS-Preflight nötig):</p><textarea class="code" readonly id="pubcode" style="height:260px">'+esc(JSON.stringify(sample, null, 2))+'</textarea>';
    }
    else t += '<p style="margin:0 0 10px;color:var(--ink2)">Funnel-Definition – zum Sichern, Versionieren oder Importieren in einen anderen Workspace:</p><textarea class="code" readonly id="pubcode" style="height:260px">'+esc(JSON.stringify({id:f.id,name:f.name,theme:f.theme,settings:f.settings,pages:f.pages}, null, 2))+'</textarea>';
    return t;
  };
  modal({title:'Veröffentlichen', sub:'„'+f.name+'“ live schalten und auf deiner Domain ausspielen.', size:'mid',
    body:'<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;margin-bottom:16px"><div style="flex:1"><b>Status</b><div class="hint" style="margin:0">Live-Funnels werden im Dashboard als aktiv geführt.</div></div><div class="segf" style="width:200px"><button data-ps="draft" class="'+(f.status!=='live'?'on':'')+'">Entwurf</button><button data-ps="live" class="'+(f.status==='live'?'on':'')+'">Live</button></div></div><div id="pubb">'+body()+'</div>',
    foot:'<button class="btn" data-close>Schließen</button><button class="btn pri" data-pcopy>'+I('copy',14)+'Kopieren</button>',
    onOpen:function(el){
      el.addEventListener('click', function(e){
        var pt = e.target.closest('[data-pt]'); if(pt){ tab = pt.getAttribute('data-pt'); el.querySelector('#pubb').innerHTML = body(); }
        var ps = e.target.closest('[data-ps]'); if(ps){ f.status = ps.getAttribute('data-ps'); save(); $$('[data-ps]', el).forEach(function(b){ b.classList.toggle('on', b === ps); }); if(S.view === 'editor'){ var pill = $('.etop .pill'); if(pill){ pill.className = 'pill '+(f.status==='live'?'live':'draft'); pill.textContent = f.status==='live'?'Live':'Entwurf'; } } toast(f.status==='live'?'Funnel ist live':'Funnel ist Entwurf'); }
        if(e.target.id === 'qrurl'){ }
        if(e.target.closest('[data-pcopy]')) copyText(el.querySelector('#pubcode').value, tab==='html'?'HTML kopiert – als index.html speichern':'Kopiert');
      });
    }});
}
var qrLoading = null;
function drawQR(url){
  var box = $('#qrbox'); if(!box) return;
  if(!url){ box.innerHTML = '<span>Link eingeben</span>'; return; }
  if(!qrLoading) qrLoading = loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');
  qrLoading.then(function(){
    box.innerHTML = ''; new window.QRCode(box, {text:url, width:200, height:200, colorDark:'#1c2e3d', colorLight:'#ffffff', correctLevel:window.QRCode.CorrectLevel.M});
    var dl = $('#qrdl'); if(!dl) return;
    var inFrame = false; try{ inFrame = window.self !== window.top; }catch(e){ inFrame = true; }
    setTimeout(function(){ var c = box.querySelector('canvas'); if(!c) return; dl.innerHTML = inFrame ? '<p class="hint">Rechtsklick auf den Code → „Bild speichern unter …“</p>' : '<a class="btn sm" download="qr-code.png" href="'+c.toDataURL('image/png')+'">'+I('down',13)+'Als PNG speichern</a>'; }, 60);
  }, function(){ box.innerHTML = '<span>QR-Bibliothek konnte nicht geladen werden</span>'; });
}
function slug(s){ return String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

/* ================= TENANTS, AUTH & REMOTE ================= */
var TT_LOGO = '%%TT_LOGO%%', TT_LOGO_W = '%%TT_LOGO_W%%';
var CONFIG = window.FS_CONFIG || null;
var REMOTE = !!(CONFIG && CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
var sb = null;
function isAdmin(){ return !!(S.user && S.user.role === 'admin' && !S.as); }
function realAdmin(){ return !!(S.user && S.user.role === 'admin'); }
function myClientId(){ return S.as || (S.user && S.user.clientId) || null; }
function clientById(id){ return (db.clients||[]).filter(function(c){ return c.id === id; })[0] || null; }
function visibleFunnels(){ if(isAdmin()) return db.funnels; var c = myClientId(); return db.funnels.filter(function(f){ return c && f.clientId === c && f.shared; }); }
function visibleLeads(){ if(isAdmin()) return db.leads; var ids = visibleFunnels().map(function(f){ return f.id; }); return db.leads.filter(function(l){ return ids.indexOf(l.funnelId) >= 0; }); }
function publicUrl(f){ var base = (CONFIG && CONFIG.publicUrl) || (location.origin + location.pathname.replace(/[^/]*$/, '')); return base.replace(/\/$/, '') + '/f/' + (f.slug || ''); }
function ensureSlug(f){ if(!f.slug) f.slug = slug(f.name).slice(0, 40) + '-' + f.id.slice(0, 5); return f.slug; }

/* ---------- login ---------- */
function renderLogin(){
  var demo = !REMOTE;
  var users = demo ? (db.users||[]) : [];
  $('#app').innerHTML = '<div class="login"><div class="lcard"><div class="lbrand"><img src="'+TT_LOGO+'" alt="TapTell"><span>'+(demo?'Demo-Modus':'Mobile Funnels')+'</span></div>'
    + '<h2>Willkommen zurück</h2><p class="lsub">Melde dich mit deinem Zugang an.</p>'
    + '<form id="lform"><div class="fld"><label>E-Mail</label><input class="inp" id="lmail" type="email" autocomplete="username" required></div><div class="fld"><label>Passwort</label><input class="inp" id="lpw" type="password" autocomplete="current-password" required></div>'
    + '<div id="lerr" class="lerr"></div><button class="btn pri" style="width:100%;justify-content:center;height:40px" type="submit">Anmelden</button></form>'
    + (demo ? '' : '<button class="btn ghost sm" data-a="forgot" style="margin:12px auto 0;display:flex">Passwort vergessen?</button>')
    + (demo ? '<div class="ldemo"><div class="flab">Demo-Zugänge (Passwort: demo)</div>' + users.map(function(u){ return '<button class="btn sm" data-a="demoLogin" data-id="'+u.id+'" style="width:100%;justify-content:flex-start;margin-bottom:6px">'+I(u.role==='admin'?'settings':'user',14)+'<span style="flex:1;text-align:left">'+esc(u.email)+'</span><span class="tag'+(u.role==='admin'?' a':'')+'">'+(u.role==='admin'?'Admin':esc((clientById(u.clientId)||{}).name||'Kunde'))+'</span></button>'; }).join('') + '<p class="hint" style="margin-top:8px">Im Demo-Modus liegt alles nur in diesem Browser. Mit Supabase verbunden werden daraus echte Logins.</p></div>' : '')
    + '</div></div>';
  setTimeout(function(){ var m = $('#lmail'); if(m) m.focus(); }, 30);
  $('#lform').onsubmit = function(e){
    e.preventDefault();
    var email = $('#lmail').value.trim().toLowerCase(), pw = $('#lpw').value, err = $('#lerr');
    if(demo){
      var u = (db.users||[]).filter(function(x){ return x.email.toLowerCase() === email && x.password === pw; })[0];
      if(!u){ err.textContent = 'E-Mail oder Passwort falsch.'; return; }
      loginLocal(u);
    } else {
      err.textContent = ''; var btn = e.target.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Anmelden …';
      sb.auth.signInWithPassword({email:email, password:pw}).then(function(r){
        if(r.error){ err.textContent = r.error.message === 'Invalid login credentials' ? 'E-Mail oder Passwort falsch.' : r.error.message; btn.disabled = false; btn.textContent = 'Anmelden'; return; }
        afterLogin(r.data.user);
      });
    }
  };
}
function loginLocal(u){
  S.user = {id:u.id, email:u.email, name:u.name, role:u.role, clientId:u.clientId || null}; S.as = null;
  try{ sessionStorage.setItem('fs.session', u.id); }catch(e){}
  S.view = 'funnels'; render();
}
function renderSetPassword(){
  $('#app').innerHTML = '<div class="login"><div class="lcard"><div class="lbrand"><img src="'+TT_LOGO+'" alt="TapTell"><span>Zugang einrichten</span></div><h2>Passwort festlegen</h2><p class="lsub">Lege ein Passwort für <b>'+esc(S.user.email)+'</b> fest.</p><form id="pform"><div class="fld"><label>Neues Passwort</label><input class="inp" id="pw1" type="password" minlength="8" autocomplete="new-password" required></div><div class="fld"><label>Wiederholen</label><input class="inp" id="pw2" type="password" minlength="8" autocomplete="new-password" required></div><div id="lerr" class="lerr"></div><button class="btn pri" style="width:100%;justify-content:center;height:40px" type="submit">Speichern & weiter</button></form></div></div>';
  $('#pform').onsubmit = function(e){
    e.preventDefault(); var a = $('#pw1').value, b = $('#pw2').value, err = $('#lerr');
    if(a.length < 8){ err.textContent = 'Mindestens 8 Zeichen.'; return; }
    if(a !== b){ err.textContent = 'Die Passwörter stimmen nicht überein.'; return; }
    sb.auth.updateUser({password:a}).then(function(r){ if(r.error){ err.textContent = r.error.message; return; } S.needPw = false; try{ history.replaceState(null,'','#funnels'); }catch(x){} toast('Passwort gespeichert'); render(); });
  };
}
function logout(){
  S.user = null; S.as = null; S.view = 'funnels';
  try{ sessionStorage.removeItem('fs.session'); }catch(e){}
  if(REMOTE && sb){ sb.auth.signOut().then(function(){ db = emptyDb(); render(); }); } else render();
}

/* ---------- client portal ---------- */
function viewPortal(){
  var fs = visibleFunnels(), ls = visibleLeads(), c = clientById(myClientId()) || {};
  var views = 0, comp = 0; fs.forEach(function(f){ views += f.stats.views || 0; comp += f.stats.completes || 0; });
  var week = ls.filter(function(l){ return l.createdAt > Date.now() - 7*864e5; }).length;
  var h = '<div class="page"><div class="ph"><div><h1>Hallo'+(S.user && S.user.name && !S.as ? ', '+esc(S.user.name.split(' ')[0]) : '')+' 👋</h1><p>Deine Funnels, Anfragen und Auswertungen für '+esc(c.name||'dein Unternehmen')+'.</p></div></div>';
  h += '<div class="kpis">' + kpi('Aktive Funnels', fs.filter(function(f){ return f.status==='live'; }).length + ' / ' + fs.length, 'freigeschaltet', 'funnel') + kpi('Aufrufe', fmtNum(views), 'gesamt', 'eye') + kpi('Anfragen', fmtNum(ls.length), '<b>+'+week+'</b> in den letzten 7 Tagen', 'inbox') + kpi('Ø Conversion', (views ? comp/views*100 : 0).toFixed(1).replace('.',',') + ' %', 'Aufruf → Anfrage', 'percent') + '</div>';
  if(!fs.length) return h + '<div class="empty">Für dich wurden noch keine Funnels freigeschaltet.</div></div>';
  h += '<div class="grid">';
  fs.forEach(function(f){
    var lc = leadsOf(f.id).length, nNew = leadsOf(f.id).filter(function(l){ return l.status==='neu'; }).length;
    h += '<div class="fcard" data-a="portalPreview" data-id="'+f.id+'"><div class="thumb">'+mini(f)+'</div><div class="meta"><div class="nm"><span>'+esc(f.name)+'</span><span class="pill '+(f.status==='live'?'live':'draft')+'" style="flex:none">'+(f.status==='live'?'Live':'Pausiert')+'</span></div>'
      + '<div class="st"><span><b>'+fmtNum(f.stats.views)+'</b>Aufrufe</span><span><b>'+lc+'</b>Anfragen</span><span><b>'+conv(f).toFixed(1).replace('.',',')+'%</b>CR</span></div>'
      + '<div style="display:flex;gap:6px;margin-top:12px"><button class="btn sm" data-a="portalLeads" data-id="'+f.id+'">'+I('inbox',13)+'Anfragen'+(nNew?' <span class="pill live nos" style="padding:0 6px">'+nNew+' neu</span>':'')+'</button><button class="btn sm" data-a="portalStats" data-id="'+f.id+'">'+I('chart',13)+'Analytics</button>'+(REMOTE && f.status==='live'?'<button class="btn sm ic" data-a="portalLink" data-id="'+f.id+'" title="Link kopieren">'+I('link',13)+'</button><button class="btn sm ic" data-a="portalQR" data-id="'+f.id+'" title="QR-Code">'+I('grid',13)+'</button>':'')+'</div></div></div>';
  });
  return h + '</div></div>';
}

/* ---------- customers (admin) ---------- */
function viewCustomers(){
  var cs = db.clients || [];
  var h = '<div class="page"><div class="ph"><div><h1>Kunden</h1><p>Lege Kunden an, vergib Logins und schalte Funnels inkl. aller Daten frei.</p></div><div class="sp"></div><button class="btn pri" data-a="newClient">'+I('plus')+'Neuer Kunde</button></div>';
  if(!cs.length) return h + '<div class="empty">Noch keine Kunden. Lege deinen ersten Kunden an, um Funnels für ihn freizuschalten.</div></div>';
  h += '<div class="card" style="overflow:auto"><table class="t"><thead><tr><th>Kunde</th><th>Funnels</th><th>Freigeschaltet</th><th>Logins</th><th>Anfragen</th><th>Seit</th><th></th></tr></thead><tbody>';
  cs.forEach(function(c){
    var fs = db.funnels.filter(function(f){ return f.clientId === c.id; }), sh = fs.filter(function(f){ return f.shared; });
    var us = (db.users||[]).filter(function(u){ return u.clientId === c.id; });
    var ls = db.leads.filter(function(l){ return sh.some(function(f){ return f.id === l.funnelId; }); });
    h += '<tr data-a="openClient" data-id="'+c.id+'"><td><div class="who">'+(c.logo?'<span class="avc" style="background:#fff center/contain no-repeat url(&quot;'+esc(c.logo)+'&quot;);box-shadow:0 0 0 1px var(--line)"></span>':avatar(c.name))+'<div><div class="nm">'+esc(c.name)+'</div><div class="sub">'+esc(c.contact||'–')+'</div></div></div></td>'
      + '<td>'+fs.length+'</td><td>'+(sh.length?'<span class="pill live nos">'+sh.length+'</span>':'<span class="sub">–</span>')+'</td><td>'+us.length+'</td><td>'+ls.length+'</td><td class="sub">'+new Date(c.createdAt||Date.now()).toLocaleDateString('de-DE')+'</td>'
      + '<td style="text-align:right;white-space:nowrap"><button class="btn sm" data-a="viewAs" data-id="'+c.id+'">'+I('eye',13)+'Portal ansehen</button></td></tr>';
  });
  return h + '</tbody></table></div><p class="hint" style="margin-top:12px">„Portal ansehen“ zeigt dir exakt, was der Kunde nach dem Login sieht.</p></div>';
}
function clientModal(id, tab){
  var c = clientById(id); if(!c) return;
  tab = tab || 'funnels';
  var body = function(){
    var fs = db.funnels.filter(function(f){ return f.clientId === c.id; }), free = db.funnels.filter(function(f){ return !f.clientId; });
    var us = (db.users||[]).filter(function(u){ return u.clientId === c.id; });
    var t = '<div class="tabs2"><button class="'+(tab==='funnels'?'on':'')+'" data-ct="funnels">Funnels & Freigabe</button><button class="'+(tab==='users'?'on':'')+'" data-ct="users">Logins ('+us.length+')</button><button class="'+(tab==='data'?'on':'')+'" data-ct="data">Stammdaten</button></div>';
    if(tab === 'funnels'){
      t += fs.length ? fs.map(function(f){ return '<div class="crow"><div style="flex:1;min-width:0"><b>'+esc(f.name)+'</b><div class="sub">'+f.pages.length+' Seiten · '+leadsOf(f.id).length+' Anfragen · '+(f.status==='live'?'Live':'Entwurf')+'</div></div><label class="tgl" style="margin:0;gap:10px"><span style="font-size:12.5px;color:var(--ink2)">'+(f.shared?'Freigeschaltet':'Gesperrt')+'</span><input type="checkbox" data-cshare="'+f.id+'"'+(f.shared?' checked':'')+'><span class="sw"></span></label><button class="ibtn" data-cedit="'+f.id+'" title="Bearbeiten">'+I('edit')+'</button><button class="ibtn" data-cunassign="'+f.id+'" title="Zuordnung entfernen">'+I('x')+'</button></div>'; }).join('') : '<p style="color:var(--mut);margin:0 0 12px">Diesem Kunden ist noch kein Funnel zugeordnet.</p>';
      t += '<div style="display:flex;gap:8px;margin-top:14px"><select class="inp" id="cassign"><option value="">Funnel zuordnen …</option>'+free.map(function(f){ return '<option value="'+f.id+'">'+esc(f.name)+'</option>'; }).join('')+'</select><button class="btn" data-cassign>'+I('plus',14)+'Zuordnen</button></div><p class="hint">Nur freigeschaltete Funnels samt Anfragen und Analytics sind im Kundenlogin sichtbar. Bearbeiten kannst nur du als Admin.</p>';
    } else if(tab === 'users'){
      t += us.length ? us.map(function(u){ return '<div class="crow">'+avatar(u.name||u.email)+'<div style="flex:1;min-width:0"><b>'+esc(u.name||'–')+'</b><div class="sub">'+esc(u.email)+(REMOTE?'':' · Passwort: <code>'+esc(u.password)+'</code>')+'</div></div>'+(REMOTE?'<button class="btn sm" data-ureset="'+u.id+'">Passwort-Link senden</button>':'')+'<button class="ibtn" data-udel="'+u.id+'" title="Zugang löschen">'+I('trash')+'</button></div>'; }).join('') : '<p style="color:var(--mut);margin:0 0 12px">Noch keine Logins für diesen Kunden.</p>';
      t += '<div class="dsec">Neuen Login anlegen</div><div class="row2"><div class="fld"><label>Name</label><input class="inp" id="uname" placeholder="Max Mustermann"></div><div class="fld"><label>E-Mail</label><input class="inp" id="umail" type="email" placeholder="max@kunde.de"></div></div><button class="btn pri" data-uadd>'+I(REMOTE?'send':'plus',14)+(REMOTE?'Einladung senden':'Login anlegen')+'</button><p class="hint">'+(REMOTE?'Der Kunde erhält eine E-Mail und legt beim ersten Login sein Passwort fest.':'Demo-Modus: Es wird ein Passwort erzeugt, das du dem Kunden mitteilst.')+'</p>';
    } else {
      t += '<div class="fld"><label>Firmenname</label><input class="inp" data-cf="name" value="'+esc(c.name)+'"></div><div class="fld"><label>Kontakt-E-Mail</label><input class="inp" data-cf="contact" value="'+esc(c.contact||'')+'"></div>'
        + '<div class="fld"><label>Logo (erscheint im Kundenportal)</label><div class="upl"><div class="pv" style="'+(c.logo?'background:#fff center/contain no-repeat url(&quot;'+esc(c.logo)+'&quot;)':'')+'">'+(c.logo?'':I('image'))+'</div><label class="btn sm">'+I('upload',13)+'Hochladen<input type="file" accept="image/*" data-clogo></label></div></div>'
        + '<div style="border-top:1px solid var(--line2);margin-top:18px;padding-top:14px;display:flex;justify-content:space-between;align-items:center"><span class="hint" style="margin:0">Funnels bleiben beim Löschen erhalten, die Zuordnung wird entfernt.</span><button class="btn sm danger" data-cdel>'+I('trash',13)+'Kunde löschen</button></div>';
    }
    return t;
  };
  modal({title:c.name, sub:'Kunde verwalten', size:'mid', body:'<div id="cmb">'+body()+'</div>', foot:'<button class="btn" data-viewas>'+I('eye',14)+'Portal ansehen</button><span style="flex:1"></span><button class="btn pri" data-close>Fertig</button>',
    onClose:function(){ if(S.view === 'customers') render(); },
    onOpen:function(el, close){
      var re = function(){ el.querySelector('#cmb').innerHTML = body(); };
      el.addEventListener('click', function(e){
        var x;
        if((x = e.target.closest('[data-ct]'))){ tab = x.getAttribute('data-ct'); re(); }
        else if((x = e.target.closest('[data-cedit]'))){ close(); go('editor', x.getAttribute('data-cedit')); }
        else if((x = e.target.closest('[data-cunassign]'))){ var f = getF(x.getAttribute('data-cunassign')); f.clientId = null; f.shared = false; save(); re(); }
        else if(e.target.closest('[data-cassign]')){ var v = el.querySelector('#cassign').value; if(!v) return; var f2 = getF(v); f2.clientId = c.id; f2.shared = true; save(); toast('„'+f2.name+'“ zugeordnet und freigeschaltet'); re(); }
        else if(e.target.closest('[data-viewas]')){ close(); viewAs(c.id); }
        else if(e.target.closest('[data-uadd]')){ addUser(c, el.querySelector('#uname').value.trim(), el.querySelector('#umail').value.trim().toLowerCase(), re); }
        else if((x = e.target.closest('[data-udel]'))){ var uid_ = x.getAttribute('data-udel'); confirmBox('Login löschen?','Der Zugang wird dauerhaft entfernt.','Löschen',function(){ removeUser(uid_, re); }, true); }
        else if((x = e.target.closest('[data-ureset]'))){ var u = (db.users||[]).filter(function(y){ return y.id === x.getAttribute('data-ureset'); })[0]; sb.auth.resetPasswordForEmail(u.email, {redirectTo:location.origin + location.pathname}).then(function(r){ toast(r.error ? r.error.message : 'Link an '+u.email+' gesendet'); }); }
        else if(e.target.closest('[data-cdel]')){ confirmBox('Kunde löschen?','„'+c.name+'“ und alle Logins dieses Kunden werden gelöscht.','Löschen',function(){ db.funnels.forEach(function(f){ if(f.clientId === c.id){ f.clientId = null; f.shared = false; } }); var users = (db.users||[]).filter(function(u){ return u.clientId === c.id; }); users.forEach(function(u){ removeUser(u.id); }); db.clients = db.clients.filter(function(y){ return y.id !== c.id; }); save(); close(); toast('Kunde gelöscht'); }, true); }
      });
      el.addEventListener('change', function(e){
        var x = e.target;
        if(x.hasAttribute('data-cshare')){ var f = getF(x.getAttribute('data-cshare')); f.shared = x.checked; save(); toast(f.shared ? 'Freigeschaltet' : 'Freigabe entfernt'); re(); }
        if(x.hasAttribute('data-clogo') && x.files[0]) readImage(x.files[0], 400, function(url){ c.logo = url; save(); re(); });
      });
      el.addEventListener('input', function(e){ var x = e.target; if(x.hasAttribute('data-cf')){ c[x.getAttribute('data-cf')] = x.value; save(); } });
    }});
}
function newClient(){
  promptBox('Neuer Kunde','Firmenname','',function(v){ var c = {id:uid(), name:v, contact:'', logo:'', createdAt:Date.now()}; db.clients = (db.clients||[]).concat([c]); save(); render(); clientModal(c.id, 'funnels'); });
}
function genPw(){ var a = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = ''; for(var i=0;i<10;i++) s += a[Math.floor(Math.random()*a.length)]; return s; }
function addUser(c, name, email, cb){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast('Bitte gültige E-Mail eingeben');
  if((db.users||[]).some(function(u){ return u.email.toLowerCase() === email; })) return toast('Diese E-Mail hat bereits einen Zugang');
  if(!REMOTE){ var u = {id:uid(), email:email, name:name, role:'client', clientId:c.id, password:genPw()}; db.users.push(u); save(); toast('Login angelegt'); if(cb) cb(); return; }
  sb.functions.invoke('invite-user', {body:{email:email, name:name, client_id:c.id, redirectTo:location.origin + location.pathname}}).then(function(r){
    var err = r.error || (r.data && r.data.error); if(err) return toast('Einladung fehlgeschlagen: ' + (err.message || err));
    var p = r.data.profile; db.users.push({id:p.id, email:p.email, name:p.name, role:'client', clientId:p.client_id}); toast('Einladung an '+email+' gesendet'); if(cb) cb();
  });
}
function removeUser(id, cb){
  var done = function(){ db.users = db.users.filter(function(u){ return u.id !== id; }); if(!REMOTE) save(); if(cb) cb(); };
  if(!REMOTE) return done();
  sb.functions.invoke('invite-user', {body:{action:'delete', user_id:id}}).then(function(r){ var err = r.error || (r.data && r.data.error); if(err) return toast('Löschen fehlgeschlagen: ' + (err.message || err)); done(); toast('Login gelöscht'); });
}
function viewAs(cid){ S.as = cid; S.view = 'funnels'; S.cf = {funnel:'all', status:'all', q:''}; S.afid = null; render(); }

/* ---------- remote (Supabase) ---------- */
function emptyDb(){ return {version:2, funnels:[], leads:[], clients:[], users:[], brand:T.theme('clean'), defaults:{webhook:''}, fonts:{google:[], uploaded:[]}}; }
function loadScript(src){ return new Promise(function(res, rej){ var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
var SNAP = {funnels:{}, leads:{}, clients:{}, settings:''}, syncing = false, syncAgain = false;
function funnelToRow(f){ ensureSlug(f); return {id:f.id, name:f.name, slug:f.slug, status:f.status, client_id:f.clientId || null, shared:!!f.shared, theme:f.theme, settings:f.settings, pages:f.pages, created_at:new Date(f.createdAt||Date.now()).toISOString(), updated_at:new Date(f.updatedAt||Date.now()).toISOString()}; }
function rowToFunnel(r, st){ return {id:r.id, name:r.name, slug:r.slug, status:r.status, clientId:r.client_id, shared:r.shared, theme:Object.assign({}, T.THEME_BASE, r.theme||{}), settings:r.settings||{}, pages:r.pages||[], createdAt:Date.parse(r.created_at), updatedAt:Date.parse(r.updated_at), stats:st || {views:0, starts:0, completes:0, pages:{}, daily:{}}}; }
var LEAD_COLS = ['id','funnelId','funnelName','name','email','phone','total','status','notes','createdAt'];
function leadToRow(l){ var data = {}; Object.keys(l).forEach(function(k){ if(LEAD_COLS.indexOf(k) < 0) data[k] = l[k]; }); return {id:l.id, funnel_id:l.funnelId || null, funnel_name:l.funnelName || '', name:l.name || null, email:l.email || null, phone:l.phone || null, total:l.total || 0, status:l.status || 'neu', notes:l.notes || '', data:data, created_at:new Date(l.createdAt||Date.now()).toISOString()}; }
function rowToLead(r){ return Object.assign({}, r.data || {}, {id:r.id, funnelId:r.funnel_id, funnelName:r.funnel_name, name:r.name, email:r.email, phone:r.phone, total:+r.total || 0, status:r.status, notes:r.notes || '', createdAt:Date.parse(r.created_at)}); }
function clientToRow(c){ return {id:c.id, name:c.name, logo:c.logo || null, contact:c.contact || null, created_at:new Date(c.createdAt||Date.now()).toISOString()}; }
function rowToClient(r){ return {id:r.id, name:r.name, logo:r.logo || '', contact:r.contact || '', createdAt:Date.parse(r.created_at)}; }
function settingsPayload(){ return {brand:db.brand, defaults:db.defaults, fonts:db.fonts}; }

async function afterLogin(u){
  var pr = await sb.from('profiles').select('*').eq('id', u.id).maybeSingle();
  if(pr.error || !pr.data){ await sb.auth.signOut(); toast('Für dieses Konto ist kein Zugang eingerichtet.'); S.user = null; return render(); }
  S.user = {id:u.id, email:u.email, name:pr.data.name || '', role:pr.data.role, clientId:pr.data.client_id};
  try{ await loadRemote(); }catch(e){ toast('Daten konnten nicht geladen werden: ' + (e.message || e)); }
  if(S.view === 'editor' && !getF(S.fid)) S.view = 'funnels';
  render();
}
async function loadRemote(){
  var q = await Promise.all([sb.from('clients').select('*'), sb.from('funnels').select('*'), sb.from('leads').select('*').order('created_at', {ascending:false}).limit(10000), sb.rpc('funnel_stats'), sb.from('app_settings').select('data').eq('id', 1).maybeSingle(), realAdmin() ? sb.from('profiles').select('*') : Promise.resolve({data:[]})]);
  q.forEach(function(r){ if(r.error) throw r.error; });
  var stats = {}; (q[3].data || []).forEach(function(r){ stats[r.funnel_id] = {views:+r.views || 0, starts:+r.starts || 0, completes:+r.completes || 0, pages:r.pages || {}, daily:r.daily || {}}; });
  var set = (q[4].data && q[4].data.data) || {};
  db = emptyDb();
  db.clients = (q[0].data || []).map(rowToClient);
  db.funnels = (q[1].data || []).map(function(r){ return rowToFunnel(r, stats[r.id]); }).sort(function(a, b){ return b.updatedAt - a.updatedAt; });
  db.leads = (q[2].data || []).map(rowToLead);
  db.users = (q[5].data || []).map(function(p){ return {id:p.id, email:p.email, name:p.name, role:p.role, clientId:p.client_id}; });
  if(set.brand) db.brand = set.brand; if(set.defaults) db.defaults = set.defaults; if(set.fonts) db.fonts = set.fonts;
  SNAP = {funnels:{}, leads:{}, clients:{}, settings:JSON.stringify(settingsPayload())};
  db.funnels.forEach(function(f){ SNAP.funnels[f.id] = JSON.stringify(funnelToRow(f)); });
  db.leads.forEach(function(l){ SNAP.leads[l.id] = JSON.stringify(leadToRow(l)); });
  db.clients.forEach(function(c){ SNAP.clients[c.id] = JSON.stringify(clientToRow(c)); });
  ensureFonts();
}
async function syncTable(table, list, toRow, onlyCols){
  var snap = SNAP[table], seen = {}, ups = [], pend = {};
  list.forEach(function(o){ var r = toRow(o), h = JSON.stringify(r); seen[r.id] = 1; if(snap[r.id] !== h){ ups.push(r); pend[r.id] = h; } });
  var dels = onlyCols ? [] : Object.keys(snap).filter(function(id){ return !seen[id]; });
  if(ups.length){
    if(onlyCols){ for(var i=0;i<ups.length;i++){ var patch = {}; onlyCols.forEach(function(k){ patch[k] = ups[i][k]; }); var r1 = await sb.from(table).update(patch).eq('id', ups[i].id); if(r1.error) throw r1.error; } }
    else { var r2 = await sb.from(table).upsert(ups); if(r2.error) throw r2.error; }
    Object.keys(pend).forEach(function(id){ snap[id] = pend[id]; });
  }
  if(dels.length){ var r3 = await sb.from(table).delete().in('id', dels); if(r3.error) throw r3.error; dels.forEach(function(id){ delete snap[id]; }); }
}
async function syncRemote(){
  if(!sb || !S.user) return;
  if(syncing){ syncAgain = true; return; }
  syncing = true; setSaved(null);
  try{
    if(realAdmin()){
      await syncTable('clients', db.clients || [], clientToRow);
      await syncTable('funnels', db.funnels, funnelToRow);
      var sp = JSON.stringify(settingsPayload()); if(sp !== SNAP.settings){ var r = await sb.from('app_settings').upsert({id:1, data:settingsPayload()}); if(r.error) throw r.error; SNAP.settings = sp; }
      await syncTable('leads', db.leads, leadToRow);
    } else {
      await syncTable('leads', visibleLeads(), leadToRow, ['status','notes']);
    }
    setSaved(true);
  }catch(e){ setSaved(false); toast('Speichern fehlgeschlagen: ' + (e.message || e)); }
  syncing = false;
  if(syncAgain){ syncAgain = false; syncRemote(); }
}
async function bootRemote(){
  $('#app').innerHTML = '<div class="login"><div style="color:var(--mut)">Lädt …</div></div>';
  try{ await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'); }catch(e){ $('#app').innerHTML = '<div class="login"><div class="lcard">Supabase konnte nicht geladen werden.</div></div>'; return; }
  sb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  var invite = /type=(invite|recovery|signup)/.test(location.hash + location.search);
  sb.auth.onAuthStateChange(function(ev){ if(ev === 'PASSWORD_RECOVERY'){ S.needPw = true; render(); } });
  var r = await sb.auth.getSession(), session = r.data && r.data.session;
  if(/access_token|type=/.test(location.hash)){ try{ history.replaceState(null, '', location.pathname + '#funnels'); }catch(e){} }
  if(session){ if(invite) S.needPw = true; await afterLogin(session.user); } else render();
}
window.addEventListener('beforeunload', function(e){ if(REMOTE && (syncing || saveT)){ e.preventDefault(); e.returnValue = ''; } });


/* ================= EVENTS ================= */
var ACT = {
  logout:function(){ logout(); },
  demoLogin:function(el){ var u = (db.users||[]).filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; if(u) loginLocal(u); },
  forgot:function(){ promptBox('Passwort zurücksetzen','Deine E-Mail-Adresse', ($('#lmail')||{}).value || '', function(v){ sb.auth.resetPasswordForEmail(v, {redirectTo:location.origin + location.pathname}).then(function(r){ toast(r.error ? r.error.message : 'Falls ein Zugang existiert, ist der Link unterwegs.'); }); }); },
  endAs:function(){ S.as = null; S.view = 'customers'; render(); },
  viewAs:function(el){ viewAs(el.getAttribute('data-id')); },
  newClient:function(){ newClient(); },
  openClient:function(el){ clientModal(el.getAttribute('data-id')); },
  portalPreview:function(el, e){ if(e.target.closest('[data-a]') !== el) return; openPreview(getF(el.getAttribute('data-id'))); },
  portalLeads:function(el){ S.cf = {funnel:el.getAttribute('data-id'), status:'all', q:''}; go('contacts'); },
  portalStats:function(el){ S.afid = el.getAttribute('data-id'); go('analytics'); },
  portalQR:function(el){ var f = getF(el.getAttribute('data-id')); modal({title:'QR-Code', sub:f.name, body:'<div class="qrwrap"><div id="qrbox" class="qrbox"></div><div style="flex:1"><p class="hint" style="margin-top:0">Scannen öffnet den Funnel direkt. Für Flyer, Rechnungen oder Aufsteller.</p><div id="qrdl"></div></div></div>', onOpen:function(){ drawQR(publicUrl(f)); }}); },
  portalLink:function(el){ copyText(publicUrl(getF(el.getAttribute('data-id'))), 'Link kopiert'); },
  nav:function(el){ go(el.getAttribute('data-v')); },
  edit:function(el){ go('editor', el.getAttribute('data-id')); },
  newFunnel:function(){ newFunnelModal(); },
  useTpl:function(el){ createFromTpl(el.getAttribute('data-id')); },
  tcat:function(el){ S.tcat = el.getAttribute('data-v'); render(); },
  fmenu:function(el){ funnelMenu(el, el.getAttribute('data-id')); },
  ffilter:function(el){ S.filter = el.getAttribute('data-v'); render(); },
  cstat:function(el){ S.cf.status = el.getAttribute('data-v'); S.csel = {}; render(); },
  lead:function(el){ openLead(el.getAttribute('data-id')); },
  csv:function(){ copyText(leadsCsv(), 'CSV kopiert – in Excel/Numbers einfügen'); },
  bulk:function(el){ var v = el.getAttribute('data-v'); db.leads.forEach(function(l){ if(S.csel[l.id]) l.status = v; }); S.csel = {}; save(); render(); toast('Status aktualisiert'); },
  bulkdel:function(){ var n = Object.keys(S.csel).filter(function(k){ return S.csel[k]; }).length; confirmBox(n+' Kontakte löschen?','Die ausgewählten Kontakte werden dauerhaft entfernt.','Löschen',function(){ db.leads = db.leads.filter(function(l){ return !S.csel[l.id]; }); S.csel = {}; save(); render(); }, true); },
  brandApply:function(){ confirmBox('Brand-Kit anwenden?','Farben, Schriften, Radius und Logo-Text werden auf alle Funnels übertragen.','Anwenden',function(){ db.funnels.forEach(function(f){ ['primary','bg','font','headingFont','logoText','radius'].forEach(function(k){ f.theme[k] = db.brand[k]; }); }); save(); toast('Brand-Kit angewendet'); }); },
  exportAll:function(){ copyText(JSON.stringify(db), 'Backup kopiert'); },
  importJ:function(){ var v = ($('#impj')||{}).value; if(!v) return; try{ var o = JSON.parse(v);
      if(o.funnels && o.leads){ confirmBox('Backup importieren?','Alle aktuellen Daten werden durch das Backup ersetzt.','Importieren',function(){ db = o; save(true); render(); toast('Backup importiert'); }); }
      else if(o.pages && o.theme){ o.id = uid()+uid().slice(0,4); o.status = 'draft'; o.createdAt = o.updatedAt = Date.now(); o.stats = {views:0,starts:0,completes:0,pages:{},daily:{}}; o.settings = o.settings || {currency:'EUR'}; db.funnels.unshift(o); save(); toast('Funnel importiert'); go('funnels'); }
      else toast('Unbekanntes Format');
    }catch(e){ toast('Ungültiges JSON'); } },
  resetAll:function(){ confirmBox('Alles zurücksetzen?','Alle Funnels und Kontakte werden gelöscht und durch Demo-Daten ersetzt.','Zurücksetzen',function(){ db = seed(); save(true); render(); }, true); },
  // editor
  ltab:function(el){ S.ltab = el.getAttribute('data-v'); renderLeft(); },
  rtab:function(el){ var v = el.getAttribute('data-v'); if(v === 'el' && !selBlock()) return; S.rtab = v; renderRight(); },
  device:function(el){ S.device = el.getAttribute('data-v'); renderEditor(); },
  undo:undo, redo:redo,
  preview:function(){ openPreview(F(), S.pi); },
  publish:function(){ publishModal(F()); },
  addLib:function(el){ addFromLibClick(el.getAttribute('data-lib')); },
  page:function(el, e){ if(e.target.closest('[data-a="pmenu"]')) return; selectPage(+el.getAttribute('data-i')); },
  pmenu:function(el, e){ e.stopPropagation(); var i = +el.getAttribute('data-i'), f = F(); dropdown(el, [
    {k:'r', l:'Umbenennen', ic:'type', fn:function(){ promptBox('Seite umbenennen','Name',f.pages[i].name,function(v){ snap(true); f.pages[i].name = v; touch(); renderLeft(); renderCanvas(true); renderRight(); }); }},
    {k:'d', l:'Duplizieren', ic:'dup', fn:function(){ dupPage(i); }},
    {k:'p', l:'Ab hier testen', ic:'play', fn:function(){ openPreview(f, i); }},
    '-', {k:'x', l:'Löschen', ic:'trash', danger:true, fn:function(){ delPage(i); }}]); },
  addPage:addPage,
  pdup:function(el){ dupPage(+el.getAttribute('data-i')); },
  pdel:function(el){ delPage(+el.getAttribute('data-i')); },
  bup:function(){ moveBlock(-1); }, bdown:function(){ moveBlock(1); }, bdup:dupBlock, bdel:delBlock,
  seg:function(el){
    var scope = el.getAttribute('data-scope'), k = el.getAttribute('data-k'), v = el.getAttribute('data-v'); if(el.getAttribute('data-t') === 'number') v = +v;
    snap(true); setScoped(scope, k, v); renderCanvas(true); renderRight();
  },
  clearProp:function(el){ snap(true); setScoped(el.getAttribute('data-scope'), el.getAttribute('data-k'), ''); renderCanvas(true); renderRight(); },
  preset:function(el){ var f = F(), th = T.THEMES[el.getAttribute('data-v')]; snap(true); Object.keys(th).forEach(function(k){ if(k !== 'name') f.theme[k] = th[k]; }); if(!th.primaryText) f.theme.primaryText = '#ffffff'; f.theme.progress = th.progress || 'bar'; touch(); renderCanvas(true); renderRight(); },
  arrAdd:function(el){ var b = selBlock(), k = el.getAttribute('data-k'); snap(true); b.props[k] = (b.props[k]||[]).concat([k==='slots'?'18:00':'Neuer Eintrag']); touch(); renderCanvas(true); renderRight(); },
  arrDel:function(el){ var b = selBlock(), k = el.getAttribute('data-k'); snap(true); b.props[k].splice(+el.getAttribute('data-i'),1); touch(); renderCanvas(true); renderRight(); },
  faqAdd:function(){ var b = selBlock(); snap(true); b.props.items.push({q:'Neue Frage?', a:'Antwort'}); touch(); renderCanvas(true); renderRight(); },
  faqDel:function(el){ var b = selBlock(); snap(true); b.props.items.splice(+el.getAttribute('data-i'),1); touch(); renderCanvas(true); renderRight(); },
  dayTgl:function(el){ var b = selBlock(), d = +el.getAttribute('data-v'), ex = (b.props.excludeDays||[]).slice(), ix = ex.indexOf(d); snap(true); if(ix >= 0) ex.splice(ix,1); else ex.push(d); b.props.excludeDays = ex; touch(); renderCanvas(true); renderRight(); },
  optAdd:function(){ var b = selBlock(); snap(true); var o = T.O('Neue Antwort', ''); b.props.options.push(o); touch(); renderCanvas(true); renderRight(); var ins = $$('#rp .ol'); if(ins.length){ ins[ins.length-1].focus(); ins[ins.length-1].select(); } },
  optDel:function(el){ var b = selBlock(); if(b.props.options.length < 2) return toast('Mindestens eine Antwort erforderlich'); snap(true); b.props.options.splice(+el.getAttribute('data-i'),1); touch(); renderCanvas(true); renderRight(); },
  optMove:function(el){ var b = selBlock(), i = +el.getAttribute('data-i'), d = +el.getAttribute('data-d'), n = i + d; if(n < 0 || n >= b.props.options.length) return; snap(true); var o = b.props.options.splice(i,1)[0]; b.props.options.splice(n,0,o); touch(); renderCanvas(true); renderRight(); },
  optToggle:function(el){ S.openOpts = S.openOpts || {}; var id = el.getAttribute('data-oid'); S.openOpts[id] = !S.openOpts[id]; renderRight(); },
  optImgDel:function(el){ var b = selBlock(); snap(true); b.props.options[+el.getAttribute('data-i')].img = ''; touch(); renderCanvas(true); renderRight(); },
  srAdd:function(){ var pg = curPage(); snap(true); pg.scoreRoutes = (pg.scoreRoutes||[]).concat([{min:0, max:5, goto:''}]); touch(); renderRight(); renderLeft(); },
  srDel:function(el){ var pg = curPage(); snap(true); pg.scoreRoutes.splice(+el.getAttribute('data-i'),1); touch(); renderRight(); renderLeft(); },
  fstatus:function(el){ var f = F(); f.status = el.getAttribute('data-v'); touch(); renderEditor(); toast(f.status==='live'?'Funnel ist live':'Funnel ist Entwurf'); },
  styleReset:function(){ var b = selBlock(); if(!b) return; snap(true); STYLE_KEYS.forEach(function(k){ delete b.props[k]; }); touch(); renderCanvas(true); renderRight(); },
  fontAdd:function(){ promptBox('Google Font hinzufügen','Exakter Name wie auf fonts.google.com (z. B. „Josefin Sans“)','',function(v){
    v = v.replace(/\s+/g,' ').trim(); if(FP.FONTS.indexOf(v) >= 0 || (db.fonts.google||[]).indexOf(v) >= 0){ toast('Schrift ist schon verfügbar'); return; }
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FP.fontLink(v);
    l.onload = function(){ db.fonts.google.push(v); fontsLoaded[v] = 1; save(); toast('„'+v+'“ hinzugefügt'); if(S.view === 'editor') renderRight(); };
    l.onerror = function(){ l.remove(); toast('„'+v+'“ wurde bei Google Fonts nicht gefunden'); };
    document.head.appendChild(l);
  }); },
  copyVar:function(el){ copyText(el.getAttribute('data-v'), 'Variable kopiert'); }
};

function setScoped(scope, k, v){
  var f = F();
  if(scope === 'p'){ var b = selBlock(); if(b) b.props[k] = v; }
  else if(scope === 'pp'){ curPage()[k] = v; }
  else if(scope === 't'){ f.theme[k] = v; }
  else if(scope === 's'){ f.settings[k] = v; }
  else if(scope === 'brand'){ db.brand[k] = v; save(); return; }
  touch();
}

document.addEventListener('click', function(e){
  if(!e.target.closest('.dd') && !e.target.closest('[data-a="fmenu"]') && !e.target.closest('[data-a="pmenu"]')) closeDD();
  // table row checkboxes / selects should not open lead
  var stop = e.target.closest('[data-stop]');
  var cb = e.target.closest('[data-a="csel"]'); if(cb){ S.csel[cb.getAttribute('data-id')] = cb.checked; render(); return; }
  var ca = e.target.closest('[data-a="callsel"]'); if(ca){ var on = ca.checked; S.csel = {}; if(on) filteredLeads().forEach(function(l){ S.csel[l.id] = true; }); render(); return; }
  if(stop) return;
  // canvas selection
  var blk = e.target.closest('#scr .fp-b[data-bid]');
  if(blk && !e.target.closest('#btool')){ selectBlock(blk.getAttribute('data-bid')); return; }
  var el = e.target.closest('[data-a]');
  if(el && ACT[el.getAttribute('data-a')] && !(el.closest('.modal') && ['useTpl','tcat'].indexOf(el.getAttribute('data-a'))>=0)){ if(el.tagName === 'A') return; ACT[el.getAttribute('data-a')](el, e); return; }
  if(e.target.closest('#canvas') && !e.target.closest('.phone .fp-b') && !e.target.closest('.pstrip') && !e.target.closest('#btool') && S.sel){ S.sel = null; if(S.rtab === 'el') S.rtab = 'page'; $$('#scr .fp-b.sel').forEach(function(x){ x.classList.remove('sel'); }); var tb = $('#btool'); if(tb) tb.remove(); renderRight(); }
});

function readVal(el){ if(el.hasAttribute('data-bool')){ var c = el.checked; return el.hasAttribute('data-inv') ? (c ? undefined : false) : c; } if(el.hasAttribute('data-num')) return el.value === '' ? '' : +el.value; return el.value; }
document.addEventListener('input', function(e){
  var el = e.target;
  if(el.id === 'fq'){ S.q = el.value; var pos = el.selectionStart; render(); var n = $('#fq'); n.focus(); n.setSelectionRange(pos,pos); return; }
  if(el.id === 'cq'){ S.cf.q = el.value; var p2 = el.selectionStart; render(); var n2 = $('#cq'); n2.focus(); n2.setSelectionRange(p2,p2); return; }
  if(el.id === 'qrurl'){ var pf = F() || null; clearTimeout(window.__qrT); window.__qrT = setTimeout(function(){ drawQR(el.value.trim()); var pc = $('#pubcode'); if(pc) pc.value = el.value.trim(); }, 300); if(pf){ pf.settings.hostedUrl = el.value.trim(); save(); } return; }
  if(el.id === 'libq'){ S.libq = el.value; var p3 = el.selectionStart; renderLeft(); var n3 = $('#libq'); n3.focus(); n3.setSelectionRange(p3,p3); return; }
  if(el.id === 'fname' || el.hasAttribute('data-fn')){ var f = F(); snap(); f.name = el.value || 'Unbenannt'; touch(); if(el.id === 'fname') el.size = Math.max(8, el.value.length); else { var fn = $('#fname'); if(fn) fn.value = f.name; } return; }
  if(el.hasAttribute('data-brand')){ var k0 = el.getAttribute('data-brand'), v0 = readVal(el); db.brand[k0] = v0; syncColor(el, 'brand', k0, v0); rangeLabel(el); save(); return; }
  if(el.hasAttribute('data-def')){ db.defaults[el.getAttribute('data-def')] = el.value; save(); return; }
  var scope = ['p','pp','t','s'].filter(function(s){ return el.hasAttribute('data-'+s); })[0];
  if(scope){
    var k = el.getAttribute('data-'+scope), v = readVal(el);
    if(el.type === 'color' || (el.type === 'text' && el.parentNode.classList.contains('colr'))){ if(el.type === 'text' && !/^(#[0-9a-f]{3,8}|rgba?\(.+\))$/i.test(v.trim())) return; syncColor(el, scope, k, v); }
    if(el.type === 'checkbox' || el.tagName === 'SELECT') snap(true); else snap();
    if(v === undefined){ var tgt = scope==='p'?selBlock().props:scope==='pp'?curPage():scope==='t'?F().theme:F().settings; delete tgt[k]; touch(); }
    else setScoped(scope, k, v);
    rangeLabel(el);
    if(el.classList.contains('fontsel')) el.style.fontFamily = FP.fontStack(v || 'Inter');
    renderCanvas(true);
    if(scope === 'pp' && k === 'name'){ renderLeft(); }
    if(scope === 'pp' && (k === 'next')) renderLeft();
    if(el.hasAttribute('data-rp')) renderRight();
    return;
  }
  if(el.hasAttribute('data-o')){ var b = selBlock(), i = +el.getAttribute('data-oi'), ok = el.getAttribute('data-o'); snap(el.tagName === 'SELECT'); b.props.options[i][ok] = readVal(el); touch(); renderCanvas(true); if(ok === 'goto'){ renderLeft(); renderRight(); } return; }
  if(el.hasAttribute('data-arr')){ var b2 = selBlock(); snap(); b2.props[el.getAttribute('data-arr')][+el.getAttribute('data-ai')] = el.value; touch(); renderCanvas(true); return; }
  if(el.hasAttribute('data-faq')){ var b3 = selBlock(); snap(); b3.props.items[+el.getAttribute('data-faq')][el.getAttribute('data-fk')] = el.value; touch(); renderCanvas(true); return; }
  if(el.hasAttribute('data-sr')){ var pg = curPage(), r = pg.scoreRoutes[+el.getAttribute('data-sr')], sk = el.getAttribute('data-sk'); snap(el.tagName === 'SELECT'); r[sk] = sk === 'goto' ? el.value : +el.value; touch(); renderLeft(); return; }
});
function syncColor(el, scope, k, v){ var w = el.closest('.colr'); if(!w) return; $$('input', w).forEach(function(x){ if(x !== el){ if(x.type === 'color') x.value = toHex(v); else x.value = v; } }); }
function rangeLabel(el){ if(el.type === 'range'){ var s = el.parentNode.querySelector('span'); if(s) s.textContent = el.value + (el.hasAttribute('data-unit') ? el.getAttribute('data-unit') : 'px'); } }

document.addEventListener('change', function(e){
  var el = e.target;
  if(el.id === 'cfun'){ S.cf.funnel = el.value; S.csel = {}; render(); return; }
  if(el.id === 'afun'){ S.afid = el.value; render(); return; }
  if(el.id === 'fcl'){ S.fclient = el.value; render(); return; }
  if(el.hasAttribute && el.hasAttribute('data-fclient')){ var f0 = F(); snap(true); f0.clientId = el.value || null; if(!f0.clientId) f0.shared = false; touch(); renderRight(); toast(f0.clientId ? 'Kunde zugeordnet' : 'Zuordnung entfernt'); return; }
  if(el.hasAttribute && el.hasAttribute('data-fshare')){ var f1 = F(); f1.shared = el.checked; touch(); toast(f1.shared ? 'Für den Kunden freigeschaltet' : 'Freigabe entfernt'); return; }
  if(el.getAttribute && el.getAttribute('data-a') === 'lstat'){ var l = db.leads.filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; l.status = el.value; el.className = 'stsel s-'+el.value; save(); return; }
  if(el.hasAttribute && el.hasAttribute('data-img') && el.files[0]){
    var k = el.getAttribute('data-img'), scope = el.getAttribute('data-scope');
    readImage(el.files[0], k === 'logoImg' ? 600 : 1400, function(url){ snap(true); setScoped(scope, k, url); renderCanvas(true); renderRight(); toast('Bild hochgeladen'); });
    return;
  }
  if(el.hasAttribute && el.hasAttribute('data-fontup') && el.files[0]){
    var file = el.files[0]; if(file.size > 1.2e6){ toast('Schriftdatei zu groß (max. 1,2 MB) – bitte WOFF2 verwenden'); return; }
    var rd = new FileReader(); rd.onload = function(){ var name = file.name.replace(/\.(woff2?|ttf|otf)$/i,'').replace(/[-_]+/g,' ').replace(/\b(regular|webfont)\b/ig,'').trim() || 'Eigene Schrift';
      promptBox('Schrift benennen','Name der Schrift', name, function(n){ db.fonts.uploaded = (db.fonts.uploaded||[]).filter(function(x){ return x.name !== n; }).concat([{name:n, data:rd.result}]); injectUploaded(); save(); toast('„'+n+'“ hochgeladen'); renderRight(); }); };
    rd.readAsDataURL(file); return;
  }
  if(el.hasAttribute && el.hasAttribute('data-optimg') && el.files[0]){
    var i = +el.getAttribute('data-optimg');
    readImage(el.files[0], 900, function(url){ snap(true); selBlock().props.options[i].img = url; touch(); renderCanvas(true); renderRight(); });
  }
});

document.addEventListener('keydown', function(e){
  if(S.view !== 'editor' || $('.mbg') || $('.pvw')) return;
  var tag = (e.target.tagName||'').toLowerCase(), typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
  var mod = e.metaKey || e.ctrlKey;
  if(mod && e.key.toLowerCase() === 'z' && !typing){ e.preventDefault(); if(e.shiftKey) redo(); else undo(); return; }
  if(mod && e.key.toLowerCase() === 'y' && !typing){ e.preventDefault(); redo(); return; }
  if(typing || !S.sel) return;
  if(e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); delBlock(); }
  else if(mod && e.key.toLowerCase() === 'd'){ e.preventDefault(); dupBlock(); }
  else if(e.key === 'ArrowUp' && e.altKey === false && mod === false){ e.preventDefault(); moveBlock(-1); }
  else if(e.key === 'ArrowDown' && mod === false){ e.preventDefault(); moveBlock(1); }
  else if(e.key === 'Escape'){ S.sel = null; S.rtab = 'page'; renderCanvas(true); renderRight(); }
});

/* ---- drag & drop ---- */
var drag = null;
function clearDrop(){ $$('.dropline').forEach(function(d){ d.remove(); }); $$('.dragover').forEach(function(d){ d.classList.remove('dragover'); }); }
document.addEventListener('dragstart', function(e){
  var li = e.target.closest && e.target.closest('[data-lib]');
  if(li){ drag = {kind:'new', lib:li.getAttribute('data-lib')}; e.dataTransfer.effectAllowed = 'copy'; try{ e.dataTransfer.setData('text/plain', drag.lib); }catch(x){} return; }
  var blk = e.target.closest && e.target.closest('#scr .fp-b[data-bid]');
  if(blk){ drag = {kind:'move', id:blk.getAttribute('data-bid')}; e.dataTransfer.effectAllowed = 'move'; try{ e.dataTransfer.setData('text/plain', drag.id); }catch(x){} setTimeout(function(){ blk.classList.add('dragging'); }, 0); var tb = $('#btool'); if(tb) tb.remove(); return; }
  var pg = e.target.closest && e.target.closest('[data-pidx]');
  if(pg){ drag = {kind:'page', idx:+pg.getAttribute('data-pidx')}; e.dataTransfer.effectAllowed = 'move'; try{ e.dataTransfer.setData('text/plain', 'page'); }catch(x){} }
});
function dropIndex(scr, y){
  var blocks = $$('.fp-page > .fp-b[data-bid]', scr), idx = blocks.length;
  for(var i=0;i<blocks.length;i++){ var r = blocks[i].getBoundingClientRect(); if(y < r.top + r.height/2){ idx = i; break; } }
  return {idx:idx, blocks:blocks};
}
document.addEventListener('dragover', function(e){
  if(!drag) return;
  var scr = e.target.closest && e.target.closest('#scr');
  var pt = e.target.closest && e.target.closest('[data-pidx]');
  if(pt){
    e.preventDefault(); clearDrop(); pt.classList.add('dragover');
    e.dataTransfer.dropEffect = drag.kind === 'new' ? 'copy' : 'move'; return;
  }
  if(scr && drag.kind !== 'page'){
    e.preventDefault(); e.dataTransfer.dropEffect = drag.kind === 'new' ? 'copy' : 'move';
    var d = dropIndex(scr, e.clientY), line = $('.dropline', scr);
    if(!line){ clearDrop(); line = document.createElement('div'); line.className = 'dropline'; scr.appendChild(line); }
    var sr = scr.getBoundingClientRect(), y;
    if(!d.blocks.length){ var pgEl = $('.fp-page', scr); y = pgEl.getBoundingClientRect().top + 10; }
    else if(d.idx < d.blocks.length) y = d.blocks[d.idx].getBoundingClientRect().top - 8;
    else { var lr = d.blocks[d.blocks.length-1].getBoundingClientRect(); y = lr.bottom + 4; }
    line.style.top = (y - sr.top + scr.scrollTop) + 'px';
    // autoscroll
    if(e.clientY < sr.top + 60) scr.scrollTop -= 12; else if(e.clientY > sr.bottom - 60) scr.scrollTop += 12;
    return;
  }
  clearDrop();
});
document.addEventListener('drop', function(e){
  if(!drag) return;
  var d0 = drag; drag = null;
  var scr = e.target.closest && e.target.closest('#scr'), pt = e.target.closest && e.target.closest('[data-pidx]');
  var f = F(); if(!f){ clearDrop(); return; }
  e.preventDefault();
  if(pt){
    var ti = +pt.getAttribute('data-pidx');
    clearDrop();
    if(d0.kind === 'page'){ if(ti === d0.idx) return; snap(true); var curId = f.pages[S.pi].id; var p = f.pages.splice(d0.idx,1)[0]; f.pages.splice(ti,0,p); S.pi = f.pages.map(function(x){ return x.id; }).indexOf(curId); touch(); renderLeft(); renderCanvas(); renderRight(); return; }
    if(d0.kind === 'new'){ var blocks = makeFromLib(d0.lib); insertBlocks(blocks, ti, null); toast('Zu „'+f.pages[ti].name+'“ hinzugefügt'); return; }
    if(d0.kind === 'move'){ var fb = findBlock(f, d0.id); if(!fb || fb.pi === ti) { renderCanvas(true); return; } snap(true); fb.page.blocks.splice(fb.bi,1); f.pages[ti].blocks.push(fb.b); S.pi = ti; S.sel = fb.b.id; touch(); renderLeft(); renderCanvas(); renderRight(); toast('Nach „'+f.pages[ti].name+'“ verschoben'); return; }
  }
  if(scr && d0.kind !== 'page'){
    var di = dropIndex(scr, e.clientY).idx; clearDrop();
    if(d0.kind === 'new'){ insertBlocks(makeFromLib(d0.lib), S.pi, di); return; }
    var pg = curPage(), from = pg.blocks.map(function(b){ return b.id; }).indexOf(d0.id);
    if(from < 0) return;
    if(di > from) di--;
    if(di === from){ renderCanvas(true); return; }
    snap(true); var bb = pg.blocks.splice(from,1)[0]; pg.blocks.splice(di,0,bb); S.sel = bb.id; touch(); renderCanvas(true); renderRight();
    return;
  }
  clearDrop();
});
document.addEventListener('dragend', function(){ drag = null; clearDrop(); $$('.fp-b.dragging').forEach(function(b){ b.classList.remove('dragging'); }); if(S.view === 'editor' && S.sel){ var el = $('#scr .fp-b.sel'); if(el) placeTool(el); } });

window.addEventListener('hashchange', function(){ var prev = S.view + S.fid; fromHash(); if(S.view + S.fid !== prev){ if(S.view === 'editor'){ S.pi = 0; S.sel = null; S.hist = []; S.fut = []; } render(); } });
window.addEventListener('resize', function(){ if(S.view === 'editor' && S.sel){ var el = $('#scr .fp-b.sel'); if(el) placeTool(el); } });

/* ---- boot ---- */
if(REMOTE){ db = emptyDb(); fromHash(); bootRemote(); }
else {
  db = loadDb();
  if(!db || !db.funnels){ db = seed(); }
  db.defaults = db.defaults || {webhook:''}; db.brand = db.brand || T.theme('clean'); db.fonts = db.fonts || {google:[], uploaded:[]};
  db.clients = db.clients || []; db.users = db.users || [];
  if(!db.users.some(function(u){ return u.role === 'admin'; })) db.users.unshift({id:uid(), email:'admin@demo.de', password:'demo', name:'Benjamin', role:'admin'});
  if(!db.clients.length && db.version !== 2){ var dc = {id:uid(), name:'Muster Holzbau GmbH', contact:'info@musterholzbau.de', logo:'', createdAt:Date.now()}; db.clients.push(dc); db.users.push({id:uid(), email:'kunde@musterholzbau.de', password:'demo', name:'Thomas Muster', role:'client', clientId:dc.id}); }
  db.version = 2; save(true);
  try{ var sid = sessionStorage.getItem('fs.session'), su = db.users.filter(function(x){ return x.id === sid; })[0]; if(su) S.user = {id:su.id, email:su.email, name:su.name, role:su.role, clientId:su.clientId || null}; }catch(e){}
  ensureFonts(); fromHash(); render();
}
window.FS = {db:function(){ return db; }, S:S, exportHtml:exportHtml, loginAs:function(email){ var u = db.users.filter(function(x){ return x.email === email; })[0]; if(u) loginLocal(u); }};
})();
