(function(){
"use strict";
var T = window.FS_T, esc = FP.esc, uid = T.uid, clone = T.clone;
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

/* ---------- icons ---------- */
var IP = {
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', moon:'<path d="M20.5 14.5A8.5 8.5 0 019.5 3.5a8.5 8.5 0 1011 11z"/>',
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
  sidebar:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M9 4v16"/>',
  boxi:'<rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M7.5 9h9M7.5 12.5h9M7.5 16h5"/>', share2:'<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/>',
  history:'<path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  brush:'<path d="M14.5 4.5l5 5-7.5 7.5-5-5z"/><path d="M7 12l-2.6 2.6a2.4 2.4 0 000 3.4l.6.6c.9.9 2.5.9 3.4 0L11 16"/><path d="M17 2l5 5"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', minus:'<path d="M5 12h14"/>', fit:'<path d="M4 9V5a1 1 0 011-1h4M15 4h4a1 1 0 011 1v4M20 15v4a1 1 0 01-1 1h-4M9 20H5a1 1 0 01-1-1v-4"/>', logic:'<path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/>',
  fBold:'<path d="M7 5h6a3.5 3.5 0 010 7H7zM7 12h7a3.5 3.5 0 010 7H7z"/>',
  fItalic:'<path d="M10 5h8M6 19h8M14 5l-4 14"/>',
  fUnder:'<path d="M7 4v7a5 5 0 0010 0V4M5 20h14"/>',
  fHl:'<path d="M7 7h10M7 11h7"/><path d="M4 18c5-3.2 11-3.2 16 0"/>',
  inkDrop:'<path d="M12 3c-1.6 3.4-6.1 7.7-6.1 10.8a6.1 6.1 0 0 0 12.2 0C18.1 10.7 13.6 6.4 12 3Z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
  fAccent:'<path d="M6 16l6-12 6 12M8.5 11h7"/><path d="M4 20h16" stroke-width="3"/>',
  fMark:'<path d="M9 15l-4 4h6l1-1"/><path d="M14 4l6 6-8 8-6-6z"/>',
  fSmall:'<path d="M3 18l5-12 5 12M4.8 14h6.4"/><path d="M16 12h5"/>',
  fBig:'<path d="M3 18l5-12 5 12M4.8 14h6.4"/><path d="M18.5 9.5v5M16 12h5"/>',
  fLeft:'<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
  fCenter:'<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
  fRight:'<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
  fClear:'<path d="M6 5h12M12 5l-3 14M4 21L20 3"/>',
  arrowHint:'<path d="M5 5c7 0 12 4 12 13"/><path d="M13 15l4 4 3-5"/>',
  rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', x:'<path d="M18 6L6 18M6 6l12 12"/>',
  heading:'<path d="M6 4v16M18 4v16M6 12h12"/>', type:'<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  images:'<rect x="2" y="6" width="14" height="14" rx="2"/><path d="M6 2h14a2 2 0 012 2v12"/><circle cx="7.5" cy="11" r="1.5"/><path d="M16 17l-4-4-8 7"/>',
  compare:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 2v20"/><path d="M8.5 10 6.5 12l2 2M15.5 10l2 2-2 2"/>',
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
  copy:'<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2"/>', paste:'<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2M12 11v6M9 14l3 3 3-3"/>',
  dup:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 011-1h11"/>', branch:'<circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 7.5v9M18 10.5c0 4-6 3-11 6.5"/>'
};
var I = function(n, s){ return '<svg class="i" viewBox="0 0 24 24"'+(s?' style="width:'+s+'px;height:'+s+'px"':'')+'>'+(IP[n]||'')+'</svg>'; };

/* ---------- persistence ---------- */
var KEY = 'funnelstudio.v1';
var db;
function loadDb(){ try{ var s = localStorage.getItem(KEY); if(s) return JSON.parse(s); }catch(e){} return null; }
var saveT = null, saveWarned = false;
function save(now){
  clearTimeout(saveT); saveT = null;
  var go = REMOTE ? function(){ syncRemote(); } : function(){ try{ if(db && db.funnels) fixSlugs(); localStorage.setItem(KEY, JSON.stringify(db)); setSaved(true); }catch(e){ setSaved(false); if(!saveWarned){ saveWarned = true; toast('Lokaler Speicher voll oder gesperrt – Daten bleiben nur bis zum Neuladen erhalten.'); } } };
  setSaved(null);
  if(now) go(); else saveT = setTimeout(function(){ saveT = null; go(); }, REMOTE ? 1000 : 350);
}
var savedState = true;
function savedLabel(s){ return s === null ? 'Speichert …' : s === 'backup' ? 'Versionsbackup ausstehend' : s ? I('check',13)+' Gespeichert' : 'Nicht gespeichert'; }
function setSaved(s){ savedState = s; var el = $('#svst'); if(el) el.innerHTML = savedLabel(s); }

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
  /* Bausteine über ihren Feldnamen finden, nicht über die Position: Vorlagen ändern sich */
  var byKey = function(k){ return FP.allBlocks(f1).filter(function(b){ return b.props.key === k; })[0]; };
  var mat = byKey('material'), ex = byKey('extras'), when = byKey('zeitraum');
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
/* ================= Entwurf, Live-Stand und Versionen =================
   Autospeichern sichert den Entwurf. Online geht nur, was mit „Veröffentlichen“ als Live-Stand (f.published) übernommen wird.
   Dazu je Funnel wenige Backups (f.versions): bei jedem Veröffentlichen und automatisch alle 10 Minuten beim Bearbeiten. */
var HAS_PUB = !REMOTE_CFG(), HAS_VT = false, OPENED = {}, VSNAP = {}, VSAVED = {}; /* im Demo-Modus immer; mit Supabase erst nach versionen.sql */
function REMOTE_CFG(){ var c = window.FS_CONFIG || {}; return !!(c.supabaseUrl && c.supabaseAnonKey); }
function fState(f){ return {name:f.name, theme:clone(f.theme), settings:clone(f.settings), pages:clone(f.pages)}; }
function fSig(x){ return JSON.stringify([x.theme, x.settings, x.pages]); }
function pubDirty(f){ if(!f || f.status !== 'live' || !f.published) return false; if(f._dirty == null) f._dirty = fSig(f.published) !== fSig(f); return f._dirty; }
function addVersion(f, kind, label){
  f.versions = f.versions || [];
  var st = fState(f), last = f.versions[0];
  if(kind === 'auto' && last && fSig(last) === fSig(st)) return;
  f.versions.unshift(Object.assign({id:uid(), at:Date.now(), kind:kind, label:label || ''}, st));
  /* behalten: die 4 letzten Veröffentlichungen und die 8 letzten automatischen Stände */
  var pub = 0, auto = 0; f.versions = f.versions.filter(function(v){ return v.kind === 'publish' ? ++pub <= 4 : ++auto <= 8; });
}
function publishNow(f){
  addVersion(f, 'publish', 'Veröffentlicht');
  f.published = Object.assign({at:Date.now()}, fState(f)); f.status = 'live'; f._dirty = false; f.updatedAt = Date.now(); save(true);
}
function autoVersion(f){ if(!f) return; var now = Date.now(); if(f._av && now - f._av < 10 * 60000) return; f._av = now; addVersion(f, 'auto', 'Automatisch gesichert'); }
function restoreVersion(f, v, msg){
  addVersion(f, 'auto', 'Vor dem Wiederherstellen');
  f.theme = clone(v.theme); f.settings = clone(v.settings); f.pages = clone(v.pages); if(v.name) f.name = v.name;
  f._dirty = null; S.hist = []; S.fut = []; S.sel = null; S.pi = Math.min(S.pi, f.pages.length - 1); f.updatedAt = Date.now(); save(true);
  if(S.view === 'editor') renderEditor(); toast(msg || 'Version wiederhergestellt – noch nicht veröffentlicht');
}
function ago(ts){ var m = Math.round((Date.now() - ts) / 60000); if(m < 1) return 'gerade eben'; if(m < 60) return 'vor '+m+' Min.'; var h = Math.round(m / 60); if(h < 24) return 'vor '+h+' Std.'; var d = Math.round(h / 24); return d === 1 ? 'gestern' : 'vor '+d+' Tagen'; }
function fmtTs(ts){ var d = new Date(ts); return d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'})+', '+d.toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})+' Uhr'; }
function versionsModal(f){
  f = f || F(); if(!f) return;
  var body = function(){
    var vs = f.versions || [], h = '';
    if(f.published) h += '<div class="vrow live"><span class="vi">'+I('rocket',14)+'</span><div class="vt"><b>Aktueller Live-Stand</b><span>Veröffentlicht '+ago(f.published.at)+' · '+fmtTs(f.published.at)+'</span></div>'+(pubDirty(f) ? '<button class="btn sm" data-vlive>Änderungen verwerfen</button>' : '<span class="pill live">Online</span>')+'</div>';
    if(!vs.length) h += '<div class="hint" style="margin:8px 0 0">Noch keine Backups. Sie entstehen beim Veröffentlichen und automatisch alle 10 Minuten, während du arbeitest.</div>';
    h += vs.map(function(v, i){ return '<div class="vrow"><span class="vi '+v.kind+'">'+I(v.kind === 'publish' ? 'rocket' : 'history', 14)+'</span><div class="vt"><b>'+esc(v.label || (v.kind === 'publish' ? 'Veröffentlicht' : 'Automatisch gesichert'))+'</b><span>'+ago(v.at)+' · '+fmtTs(v.at)+' · '+v.pages.length+' Seiten</span></div><button class="btn sm" data-vres="'+i+'">'+I('undo',13)+'Wiederherstellen</button></div>'; }).join('');
    if(REMOTE_CFG() && HAS_PUB && !HAS_VT) h += '<div class="callout" style="margin-top:12px">'+I('info')+'<div>Backups liegen gerade nur in diesem Browser. Einmal <b>supabase/versionen-2.sql</b> in Supabase ausführen, dann werden sie auf dem Server gespeichert – ohne Zeitüberschreitung.</div></div>';
    if(REMOTE_CFG() && !HAS_PUB) h += '<div class="callout" style="margin-top:12px">'+I('info')+'<div>Damit Backups auch auf dem Server liegen und Änderungen erst nach „Veröffentlichen“ online gehen, einmal <b>supabase/versionen.sql</b> in Supabase ausführen. Bis dahin sind Backups nur in diesem Browser.</div></div>';
    return h;
  };
  modal({title:'Versionen', sub:'Backups von „'+f.name+'“. Wiederherstellen ändert nur den Entwurf – online geht es erst mit „Veröffentlichen“.', size:'mid', body:'<div id="vlist">'+(HAS_VT ? '<div class="hint">Backups werden geladen …</div>' : body())+'</div>',
    onOpen:function(el, close){
      if(HAS_VT) loadVersions(f).then(function(){ var vl = el.querySelector('#vlist'); if(vl) vl.innerHTML = body(); }).catch(function(e){ var vl = el.querySelector('#vlist'); if(vl) vl.innerHTML = '<div class="hint">Backups konnten nicht geladen werden: '+esc(e.message || e)+'</div>'; });
      el.addEventListener('click', function(e){
        var r = e.target.closest('[data-vres]'); if(r){ var v = (f.versions || [])[+r.getAttribute('data-vres')]; if(!v) return; confirmBox('Version wiederherstellen?', 'Der Entwurf wird auf den Stand von '+fmtTs(v.at)+' zurückgesetzt. Der jetzige Stand wird vorher gesichert.', 'Wiederherstellen', function(){ restoreVersion(f, v); close(); }); return; }
        if(e.target.closest('[data-vlive]')){ confirmBox('Änderungen verwerfen?', 'Der Entwurf wird auf den Live-Stand zurückgesetzt. Der jetzige Stand wird vorher gesichert.', 'Verwerfen', function(){ restoreVersion(f, f.published, 'Zurück auf dem Live-Stand'); close(); }, true); }
      });
    }});
}
function pubUi(){
  var f = F(); if(!f || S.view !== 'editor') return;
  var d = pubDirty(f), pill = $('.etop .pill'), btn = $('[data-a="publish"]');
  if(pill){ pill.className = 'pill '+(f.status === 'live' ? (d ? 'warn' : 'live') : 'draft'); pill.textContent = f.status === 'live' ? (d ? 'Live · Änderungen offen' : 'Live') : 'Entwurf'; pill.title = d ? 'Deine letzten Änderungen sind gespeichert, aber noch nicht online.' : ''; }
  if(btn) btn.classList.toggle('dirty', d);
}

function touch(){ var f = F(); if(f){ f.updatedAt = Date.now(); if(f.status === 'live') f._dirty = null; autoVersion(f); } save(); pubUi(); }

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
  var left = Math.min(window.innerWidth - w - 8, r.right - w), top = r.bottom + 6; if(top + h > window.innerHeight - 8){ top = r.top - h - 6; d.classList.add('up'); }
  d.style.left = Math.max(8,left) + 'px'; d.style.top = top + 'px';
  d.addEventListener('click', function(e){ var b = e.target.closest('[data-ddi]'); if(!b) return; var it = items.filter(function(x){ return x.k === b.getAttribute('data-ddi'); })[0]; closeDD(); if(it && it.fn) it.fn(); });
}
function modal(opts){
  var bg = document.createElement('div'); bg.className = 'mbg';
  bg.innerHTML = '<div class="modal '+(opts.size||'')+'"><div class="mh"><div><h2>'+esc(opts.title)+'</h2>'+(opts.sub?'<p>'+esc(opts.sub)+'</p>':'')+'</div><button class="btn ghost sm ic x" data-close>'+I('x')+'</button></div><div class="mb">'+opts.body+'</div>'+(opts.foot?'<div class="mf">'+opts.foot+'</div>':'')+'</div>';
  document.body.appendChild(bg);
  var close = function(){ bg.remove(); document.removeEventListener('keydown', onk); if(opts.onClose) opts.onClose(); };
  var onk = function(e){ if(e.key === 'Escape' && Array.from(document.querySelectorAll('.mbg')).pop() === bg) close(); };
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
function fmtMoney(n){ return FP.money(Math.round(n||0), 'EUR'); }
function fmtRel(ts){ var d = (Date.now()-ts)/1000; if(d < 60) return 'gerade eben'; if(d < 3600) return 'vor '+Math.floor(d/60)+' Min.'; if(d < 86400) return 'vor '+Math.floor(d/3600)+' Std.'; if(d < 86400*7) return 'vor '+Math.floor(d/86400)+' Tag'+(d>=172800?'en':''); return new Date(ts).toLocaleDateString('de-DE'); }
function fmtDT(ts){ return new Date(ts).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
var AVC = [['#e3e9ef','#1c2e3d'],['#e2eef6','#1f5c86'],['#e4f1ec','#2a6b52'],['#f4ede2','#7a5424'],['#f3e6e6','#8a3a3a'],['#ebe8f3','#4f437f'],['#f1e7ee','#7d3d66'],['#e3eff0','#2c6467']];
function avatar(name){ var n = name || '?', h = 0; for(var i=0;i<n.length;i++) h = (h*31 + n.charCodeAt(i))>>>0; return '<span class="avc" style="--h:'+AVC[h%AVC.length][1]+'">'+esc(n.split(' ').map(function(s){return s[0]||'';}).join('').slice(0,2).toUpperCase())+'</span>'; }
function conv(f){ var v = f.stats.views || 0; return v ? (f.stats.completes / v * 100) : 0; }
function leadsOf(fid){ return db.leads.filter(function(l){ return l.funnelId === fid; }); }
function readImage(file, maxW, cb){
  var rd = new FileReader();
  rd.onload = function(){
    if(/svg/.test(file.type)) return cb(rd.result);
    var img = new Image(); img.onload = function(){ var c = document.createElement('canvas'), sc = Math.min(1, maxW/img.width); c.width = img.width*sc; c.height = img.height*sc; c.getContext('2d').drawImage(img,0,0,c.width,c.height); cb(c.toDataURL(/png/.test(file.type)?'image/png':'image/jpeg', .82)); };
    img.onerror = function(){ toast('Dieses Bildformat konnte nicht geladen werden.'); };
    img.src = rd.result;
  };
  rd.onerror = function(){ toast('Bild konnte nicht gelesen werden.'); };
  rd.readAsDataURL(file);
}
function mediaServer(){ return REMOTE ? sb : null; }
function libraryButton(){
  return '<button type="button" class="btn sm" data-media-pick>'+I('images',13)+'Mediathek</button>';
}
function mediaModal(select){
  if(!isAdmin()) return;
  var page = 0, rows = [], request = 0;
  modal({title:'Mediathek', size:'mid', body:'<div class="media-tools"><label class="btn sm">'+I('upload',14)+'Bild hochladen<input type="file" accept="image/*" data-media-file></label></div><div class="media-items" aria-live="polite"></div><div class="media-nav"></div>',
    onOpen:function(el, close){
      var grid = el.querySelector('.media-items'), nav = el.querySelector('.media-nav');
      async function refresh(){
        var seq = ++request;
        grid.textContent = 'Bilder werden geladen …'; nav.innerHTML = '';
        try{
          var loaded = await TTMedia.list(mediaServer(),db,page);
          if(seq !== request || !el.isConnected) return;
          if(!loaded.length && page){ page--; return refresh(); }
          rows = loaded.slice(0,TTMedia.pageSize);
          grid.innerHTML = rows.map(function(row,i){
            var thumb = '<img loading="lazy" src="'+esc(row.src)+'" alt=""><span>'+esc(row.name)+'</span>';
            return '<div class="media-item">'+(select ? '<button type="button" class="media-thumb" data-use="'+i+'" title="Bild verwenden">'+thumb+'</button>' : '<div class="media-thumb">'+thumb+'</div>')
              +'<button type="button" class="btn sm ic" data-remove="'+i+'" aria-label="'+esc(row.name)+' aus der Mediathek entfernen">'+I('trash',14)+'</button></div>';
          }).join('') || '<p class="hint">Noch keine Bilder hochgeladen.</p>';
          nav.innerHTML = (page ? '<button type="button" class="btn sm" data-back>Zurück</button>' : '')+(loaded.length > rows.length ? '<button type="button" class="btn sm" data-next>Weitere Bilder</button>' : '');
        }catch(e){ if(seq === request){ grid.textContent = 'Mediathek konnte nicht geladen werden: '+e.message; } }
      }
      el.addEventListener('change',function(e){
        if(!e.target.matches('[data-media-file]') || !e.target.files[0]) return;
        var file = e.target.files[0]; e.target.value = '';
        readImage(file,1400,async function(src){
          try{ await TTMedia.storeImage(mediaServer(),file.name,src); page=0; await refresh(); }
          catch(err){ toast('Bild konnte nicht gespeichert werden: '+err.message); }
        });
      });
      el.addEventListener('click',function(e){
        var b = e.target.closest('button');
        if(!b) return;
        if(b.hasAttribute('data-back')){ page--; refresh(); }
        if(b.hasAttribute('data-next')){ page++; refresh(); }
        if(b.hasAttribute('data-use') && select){ var row=rows[+b.dataset.use]; close(); select(row.src); }
        if(b.hasAttribute('data-remove')){
          var item=rows[+b.dataset.remove];
          confirmBox('Bild aus Mediathek entfernen?', '„'+item.name+'“ bleibt in bestehenden Funnels sichtbar.', 'Entfernen', async function(){
            try{ await TTMedia.remove(mediaServer(),item.id); await refresh(); }
            catch(err){ toast('Bild konnte nicht entfernt werden: '+err.message); }
          },true);
        }
      });
      refresh();
    }});
}
function applyEditorImage(input,src){
  if(!isAdmin() || !input.isConnected) return;
  snap(true);
  if(input.hasAttribute('data-arrimg')){
    var k=input.dataset.arrimg, props=selBlock().props; props[k]=(props[k] || []).concat([src]); touch();
  } else if(input.hasAttribute('data-optimg')){
    selBlock().props.options[+input.dataset.optimg].img=src; touch();
  } else setScoped(input.dataset.scope,input.dataset.img,src);
  renderCanvas(true); renderRight();
}
function uploadAdminImage(file,width,apply){
  readImage(file,width,async function(src){
    // Existing upload fields remain usable while the media migration is pending.
    apply(src);
    try{ await TTMedia.storeImage(mediaServer(),file.name,src); }
    catch(e){ toast('Bild verwendet. Speichern in der Mediathek fehlgeschlagen: '+e.message); }
  });
}

/* Vorlagen-Galerie: beim Überfahren blättern die Seiten der Vorlage durch (nur mit Maus) */
var TPLPREV = {}, tplT = null, tplCard = null;
document.addEventListener('mouseover', function(e){
  var card = e.target.closest && e.target.closest('.tcard'); if(card === tplCard) return;
  clearInterval(tplT); if(tplCard){ var th0 = tplCard.querySelector('.thumb'), f0 = TPLPREV[tplCard.getAttribute('data-id')]; if(th0 && f0) th0.innerHTML = mini(f0, 0); }
  tplCard = card; if(!card || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var f = TPLPREV[card.getAttribute('data-id')], th = card.querySelector('.thumb'); if(!f || !th || f.pages.length < 2) return;
  var i = 0;
  tplT = setInterval(function(){
    if(!th.isConnected){ clearInterval(tplT); return; }
    i = (i + 1) % f.pages.length;
    var tmp = document.createElement('div'); tmp.innerHTML = mini(f, i); var nx = tmp.firstElementChild; nx.classList.add('nx');
    th.appendChild(nx); setTimeout(function(){ [].slice.call(th.querySelectorAll('.mini')).slice(0, -1).forEach(function(m){ m.remove(); }); nx.classList.remove('nx'); }, 320);
  }, 1100);
});
function mini(f, idx){ return '<div class="mini">'+FP.renderPage(f, idx||0, {noAnim:true, scope:true})+'</div>'; }

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
  if(S.scope === undefined){ try{ S.scope = localStorage.getItem('tt.scope') || ''; }catch(e){ S.scope = ''; } }
  if(S.scope && S.scope !== '-' && !clientById(S.scope)) S.scope = '';
  var vl = scopedLeads(), vf = scopedFunnels();
  var nLeadsNew = vl.filter(function(l){ return l.status === 'neu'; }).length;
  var cl = !isAdmin() ? clientById(myClientId()) : null;
  var nav = isAdmin()
    ? [['§','Arbeitsbereich'],['funnels','Funnels','funnel',vf.length],['contacts','Kontakte','users',nLeadsNew],['analytics','Analytics','chart'],['§','Verwaltung'],['customers','Kunden','folder',(db.clients||[]).length],['templates','Vorlagen','layout'],['settings','Einstellungen','settings']]
    : [['funnels','Übersicht','grid',vf.length],['contacts','Kontakte','users',nLeadsNew],['analytics','Analytics','chart']];
  var brand = cl ? '<div class="brand">'+(cl.logo?'<div class="lg" style="background:#fff center/contain no-repeat url(&quot;'+esc(cl.logo)+'&quot;);box-shadow:0 0 0 1px var(--line)"></div>':'<div class="lg">'+I('layers')+'</div>')+'<div>'+esc(cl.name)+'<small>Kundenportal · TapTell</small></div></div>'
    : '<div class="brand tt"><img class="lg-l" src="'+TT_LOGO+'" alt="TapTell"><img class="lg-d" src="'+TT_LOGO_W+'" alt="" aria-hidden="true"><small>'+(REMOTE?'Admin':'Admin · Demo-Modus')+'</small></div>';
  var html = '<div class="shell"><aside class="side">' + brand
    + (isAdmin() ? (function(){ var s = scopeId(), c = s && s !== '-' ? clientById(s) : null; return '<button class="scope" data-a="scope" title="Arbeitsbereich wechseln"><span class="sav">'+(c && c.logo ? '<i style="background:#fff center/contain no-repeat url(&quot;'+esc(c.logo)+'&quot;)"></i>' : I(!s?'grid':s==='-'?'layers':'folder',14))+'</span><span class="stx"><small>Arbeitsbereich</small><b>'+esc(scopeLabel())+'</b></span>'+I('chevDown',14)+'</button>'; })() : '')
    + nav.map(function(n){ if(n[0] === '§') return '<div class="sec">'+n[1]+'</div>'; return '<button class="nav'+(S.view===n[0]?' on':'')+'" data-a="nav" data-v="'+n[0]+'">'+I(n[2])+n[1]+(n[3]?'<span class="ct">'+n[3]+'</span>':'')+'</button>'; }).join('')
    + '<div class="foot"><div class="av">'+esc((S.user.name||S.user.email||'?')[0].toUpperCase())+'</div><div style="flex:1;min-width:0"><div style="color:var(--ink);font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(S.user.name||S.user.email)+'</div><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(S.user.role==='admin'?'Administrator':'Kunde')+'</div></div><button class="btn ghost sm ic" data-a="theme" title="Hell oder dunkel">'+I(document.documentElement.getAttribute('data-theme')==='dark'?'sun':'moon',15)+'</button><button class="btn ghost sm ic" data-a="logout" title="Abmelden">'+I('ext',15)+'</button></div></aside>'
    /* Handy: Kopfzeile + Tab-Leiste unten (die Seitenleiste ist dort ausgeblendet) */
    + '<header class="mtop">'+(cl ? '<b>'+esc(cl.name)+'</b>' : '<img class="lg-l" src="'+TT_LOGO+'" alt="TapTell"><img class="lg-d" src="'+TT_LOGO_W+'" alt="" aria-hidden="true">')+'<span style="flex:1"></span><button class="btn ghost sm ic" data-a="theme" title="Hell oder dunkel">'+I(document.documentElement.getAttribute('data-theme')==='dark'?'sun':'moon',16)+'</button><button class="btn ghost sm ic" data-a="logout" title="Abmelden">'+I('ext',16)+'</button></header>'
    + '<main class="main" id="main"></main>'
    + '<nav class="tabbar" aria-label="Navigation">' + nav.filter(function(n){ return n[0] !== '§' && n[0] !== 'templates'; }).slice(0,5).map(function(n){ return '<button class="'+(S.view===n[0]?'on':'')+'" data-a="nav" data-v="'+n[0]+'">'+I(n[2],20)+'<span>'+n[1]+'</span></button>'; }).join('') + '</nav></div>';
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
var OVERVIEW_COLORS = {blue:'Blau', green:'Grün', amber:'Bernstein', purple:'Violett', red:'Rot'};

function overviewColorPicker(f, anchor){
  if(!isAdmin()) return;
  var current = Object.hasOwn(OVERVIEW_COLORS, f.overviewColor) ? f.overviewColor : '';
  var options = [''].concat(Object.keys(OVERVIEW_COLORS)).map(function(key){
    return '<button type="button" class="btn" data-mark="'+key+'" aria-pressed="'+(current === key)+'"><i aria-hidden="true"></i>'+esc(OVERVIEW_COLORS[key] || 'Keine Farbe')+(current === key ? I('check',14) : '')+'</button>';
  }).join('');
  modal({title:'Übersichtsfarbe', sub:f.name, body:'<div class="overview-colors">'+options+'</div>',
    onClose:function(){ if(anchor.isConnected) anchor.focus(); },
    onOpen:function(el, close){
      var group = el.querySelector('.overview-colors');
      group.querySelector('[aria-pressed="true"]').focus();
      group.onclick = function(e){
        var button = e.target.closest('[data-mark]');
        if(!button || !isAdmin()) return;
        var color = button.dataset.mark;
        if(color !== current){
          f.overviewColor = color;
          save(true);
          var thumb = anchor.closest('.fcard').querySelector('.thumb');
          if(color) thumb.dataset.mark = color; else thumb.removeAttribute('data-mark');
          anchor.setAttribute('aria-label', overviewMenuLabel(f));
        }
        close();
      };
    }});
}
function overviewMenuLabel(f){
  return 'Optionen für '+f.name+(OVERVIEW_COLORS[f.overviewColor] ? ', Markierung '+OVERVIEW_COLORS[f.overviewColor] : '');
}
function viewFunnels(){
  var SF = scopedFunnels(), SL = scopedLeads();
  var fs = SF.filter(function(f){ return (S.filter === 'all' || f.status === S.filter) && (!S.q || f.name.toLowerCase().indexOf(S.q.toLowerCase()) >= 0) && (!S.fclient || (S.fclient === '-' ? !f.clientId : f.clientId === S.fclient)); });
  var views = 0, leads = SL.length, comp = 0; SF.forEach(function(f){ views += f.stats.views; comp += f.stats.completes; });
  var week = SL.filter(function(l){ return l.createdAt > Date.now() - 7*864e5; }).length;
  var live = SF.filter(function(f){ return f.status === 'live'; }).length;
  var h = '<div class="page"><div class="ph"><div><h1>Funnels</h1><p>'+(scopeId()?'Funnels von <b>'+esc(scopeLabel())+'</b>.':'Erstelle, gestalte und verwalte deine mobilen Funnels.')+'</p></div><div class="sp"></div><button class="btn pri" data-a="newFunnel">'+I('plus')+'Neuer Funnel</button></div>';
  h += '<div class="kpis">'
    + kpi('Aktive Funnels', live + ' / ' + SF.length, 'live geschaltet', 'funnel', SF.length ? live / SF.length * 100 : 0)
    + kpi('Aufrufe', fmtNum(views), 'gesamt', 'eye', series14(SF, 'v'))
    + kpi('Leads', fmtNum(leads), '<b>+'+week+'</b> in den letzten 7 Tagen', 'inbox', series14(SF, 'l'))
    + kpi('Ø Conversion', (views ? (comp/views*100) : 0).toFixed(1).replace('.',',') + ' %', 'Aufruf → Abschluss', 'percent', (function(){ var v = series14(SF, 'v'), l = series14(SF, 'l'); return v.map(function(x, i){ return x ? l[i] / x * 100 : 0; }); })()) + '</div>';
  h += '<div class="toolbar"><div class="seg">'+[['all','Alle'],['live','Live'],['draft','Entwurf']].map(function(x){ return '<button class="'+(S.filter===x[0]?'on':'')+'" data-a="ffilter" data-v="'+x[0]+'">'+x[1]+'</button>'; }).join('')+'</div><div style="flex:1"></div>'+(scopeId()?'':'<select class="inp" id="fcl" style="width:210px;height:36px"><option value="">Alle Kunden</option><option value="-"'+(S.fclient==='-'?' selected':'')+'>Ohne Kunde (intern)</option>'+(db.clients||[]).map(function(c){ return '<option value="'+c.id+'"'+(S.fclient===c.id?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('')+'</select>')+'<label class="search">'+I('search')+'<input id="fq" placeholder="Funnels durchsuchen …" value="'+esc(S.q)+'"></label></div>';
  h += '<div class="grid">';
  fs.forEach(function(f){
    var lc = leadsOf(f.id).length;
    h += '<div class="fcard" data-a="edit" data-id="'+f.id+'"><div class="menu"><button class="btn sm ic" data-a="fmenu" data-id="'+f.id+'" aria-label="'+esc(overviewMenuLabel(f))+'">'+I('more')+'</button></div><div class="thumb"'+(OVERVIEW_COLORS[f.overviewColor] ? ' data-mark="'+esc(f.overviewColor)+'"' : '')+'>'+mini(f)+'</div>'
      + '<div class="meta"><div class="nm"><span>'+esc(f.name)+'</span><span class="pill '+(f.status==='live'?'live':'draft')+'" style="flex:none">'+(f.status==='live'?'Live':'Entwurf')+'</span></div>'
      + '<div class="who">'+(f.clientId && clientById(f.clientId) ? I('folder',12)+'<span>'+esc(clientById(f.clientId).name)+'</span>'+(f.shared?'<span class="sh" title="Für den Kunden freigeschaltet">'+I('eye',12)+'</span>':'') : '<span>Intern</span>')+'<span class="dt">· '+fmtRel(f.updatedAt)+'</span></div>'
      + '<div class="fst"><div><b>'+fmtNum(f.stats.views)+'</b><small>Aufrufe</small></div><div><b>'+lc+'</b><small>Leads</small></div><div><b>'+conv(f).toFixed(1).replace('.',',')+' %</b><small>Conversion</small></div></div></div></div>';
  });
  h += '<button class="newcard" data-a="newFunnel"><div class="pl">'+I('plus',20)+'</div><b style="color:var(--ink)">Neuer Funnel</b><span style="font-size:var(--fs-13)">Aus Vorlage oder leer starten</span></button></div>';
  if(!fs.length && S.q) h += '<div class="empty" style="margin-top:16px">Keine Funnels gefunden.</div>';
  return h + '</div>';
}
/* Kennzahl: Label, Wert, Hinweis, optional Verlaufskurve (Zahlenreihe) */
function kpi(l, v, d, ic, series){ var vis = typeof series === 'number' ? '<div class="kbar"><i style="width:'+Math.max(0, Math.min(100, series))+'%"></i></div>' : (series && series.length > 1 ? spark(series) : ''); return '<div class="kpi"><div class="l">'+l+'</div><div class="v">'+v+'</div><div class="d">'+d+'</div>'+vis+'</div>'; }
function spark(vals){
  var w = 200, h = 30, mn = Math.min.apply(0, vals), mx = Math.max.apply(0, vals), rg = (mx - mn) || 1;
  var d = vals.map(function(x, i){ return (i ? 'L' : 'M') + (i / (vals.length - 1) * w).toFixed(1) + ' ' + (h - 3 - (x - mn) / rg * (h - 6)).toFixed(1); }).join(' ');
  var id = 'sp' + uid().slice(0,5);
  return '<svg class="spark" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".16"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path d="'+d+' L'+w+' '+h+' L0 '+h+'Z" fill="url(#'+id+')"/><path d="'+d+'" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
}
/* 14-Tage-Reihen aus den Tagesstatistiken mehrerer Funnels */
function series14(fs, key){ var out = []; for(var i = 13; i >= 0; i--){ var k = dayKey(Date.now() - i*864e5), t = 0; fs.forEach(function(f){ t += ((f.stats.daily||{})[k]||{})[key] || 0; }); out.push(t); } return out; }

function templateGallery(){
  var list = T.TEMPLATES.map(function(t){ var d = t.make(); return {id:t.id, d:d}; });
  var shown = list.filter(function(x){ return S.tcat === 'Alle' || x.d.cats.indexOf(S.tcat) >= 0 || x.id === 'blank'; });
  return '<div class="tfil">'+T.CATS.map(function(c){ return '<button class="chip'+(S.tcat===c?' on':'')+'" data-a="tcat" data-v="'+c+'">'+c+'</button>'; }).join('')+'</div><div class="tgrid">'
    + shown.map(function(x){ var f = {pages:x.d.pages, theme:x.d.theme, settings:x.d.settings||{}}; TPLPREV[x.id] = f; return '<div class="tcard" role="button" tabindex="0" data-a="useTpl" data-id="'+x.id+'"><div class="thumb">'+mini(f)+'</div><div class="tm"><b>'+esc(x.d.name)+'</b><span>'+esc(x.d.desc)+'</span><div class="tags">'+x.d.cats.map(function(c){ return '<span class="tag'+(c==='Konfigurator'?' a':'')+'">'+c+'</span>'; }).join('')+'<span class="tag">'+x.d.pages.length+' Seiten</span></div></div></div>'; }).join('')
    + '</div>';
}
function funnelMenu(btn, id){
  var f = getF(id);
  dropdown(btn, [
    {k:'e', l:'Bearbeiten', ic:'edit', fn:function(){ go('editor', id); }},
    {k:'p', l:'Vorschau', ic:'eye', fn:function(){ openPreview(f); }},
    {k:'r', l:'Umbenennen', ic:'type', fn:function(){ promptBox('Funnel umbenennen','Name',f.name,function(v){ f.name = v; save(); render(); }); }},
    {k:'color', l:'Übersichtsfarbe', ic:'palette', fn:function(){ overviewColorPicker(f, btn); }},
    {k:'d', l:'Duplizieren', ic:'dup', fn:function(){ duplicateFunnel(f); }},
    {k:'s', l:f.status==='live'?'Offline nehmen':'Live schalten', ic:'rocket', fn:function(){ f.status = f.status==='live'?'draft':'live'; save(); render(); toast(f.status==='live'?'Funnel ist live':'Funnel ist jetzt Entwurf'); }},
    {k:'x', l:'Exportieren / Einbetten', ic:'code', fn:function(){ publishModal(f); }},
    {k:'a', l:'Analytics', ic:'chart', fn:function(){ S.afid = id; go('analytics'); }},
    '-',
    {k:'del', l:'Löschen', ic:'trash', danger:true, fn:function(){ confirmBox('Funnel löschen?','„'+f.name+'“ wird dauerhaft gelöscht. Bestehende Kontakte bleiben erhalten.','Löschen',function(){ db.funnels = db.funnels.filter(function(x){ return x.id !== id; }); save(); render(); toast('Funnel gelöscht'); }, true); }}
  ]);
}
function duplicateFunnel(f){
  var c = clone(f); c.id = uid()+uid().slice(0,4); c.name = f.name + ' (Kopie)'; c.slug = uniqueSlug(c.name, c.id); c.status = 'draft'; c.published = null; c.versions = []; delete c._dirty; delete c._av; c.createdAt = c.updatedAt = Date.now(); c.stats = {views:0,starts:0,completes:0,pages:{},daily:{}}; delete c.demo;
  var map = {};
  c.pages.forEach(function(p){ var n = uid(); map[p.id] = n; p.id = n; p.blocks.forEach(function(b){ var nb = uid(); map[b.id] = nb; b.id = nb; }); });
  c.pages.forEach(function(p){ (p.logic||[]).forEach(function(r){ r.goto = map[r.goto] || ''; (r.cond||[]).forEach(function(cd){ cd.bid = map[cd.bid] || ''; }); }); });
  c.pages.forEach(function(p){ if(p.next) p.next = map[p.next] || ''; (p.scoreRoutes||[]).forEach(function(r){ r.goto = map[r.goto] || ''; }); p.blocks.forEach(function(b){ if(b.props.target) b.props.target = map[b.props.target] || ''; (b.props.options||[]).forEach(function(o){ if(o.goto) o.goto = map[o.goto] || ''; }); (b.props.routes||[]).forEach(function(r){ if(r.goto) r.goto = map[r.goto] || ''; }); }); });
  db.funnels.unshift(c); save(); render(); toast('Funnel dupliziert');
}

/* ---------- views: contacts ---------- */
function filteredLeads(){
  var q = S.cf.q.toLowerCase();
  return scopedLeads().filter(function(l){ return (S.cf.funnel === 'all' || l.funnelId === S.cf.funnel) && (S.cf.status === 'all' || l.status === S.cf.status) && (!q || [l.name,l.email,l.phone,l.funnelName].join(' ').toLowerCase().indexOf(q) >= 0); });
}
function viewContacts(){
  var ls = filteredLeads(), nSel = Object.keys(S.csel).filter(function(k){ return S.csel[k]; }).length;
  var VL = scopedLeads();
  var counts = {}; STATUSES.forEach(function(s){ counts[s[0]] = VL.filter(function(l){ return l.status === s[0]; }).length; });
  var won = VL.filter(function(l){ return l.status === 'gewonnen'; }).reduce(function(a,l){ return a + (l.total||0); }, 0);
  var pipe = VL.filter(function(l){ return l.status !== 'verloren' && l.status !== 'gewonnen'; }).reduce(function(a,l){ return a + (l.total||0); }, 0);
  var h = '<div class="page"><div class="ph"><div><h1>Kontakte</h1><p>Alle Leads aus deinen Funnels – mit Antworten, Preis und Status.</p></div><div class="sp"></div><button class="btn" data-a="csv">'+I('copy')+'CSV kopieren</button></div>';
  h += '<div class="kpis">'+kpi('Neue Leads', counts.neu, 'noch nicht bearbeitet', 'inbox')+kpi('In Bearbeitung', counts.kontaktiert + counts.angebot, 'kontaktiert oder Angebot', 'users')+kpi('Pipeline-Wert', FP.money(pipe), 'offene Anfragen', 'euro')+kpi('Gewonnen', FP.money(won), counts.gewonnen + ' Aufträge', 'target')+'</div>';
  h += '<div class="toolbar"><div class="seg"><button class="'+(S.cf.status==='all'?'on':'')+'" data-a="cstat" data-v="all">Alle <span style="color:var(--mut)">'+VL.length+'</span></button>'+STATUSES.map(function(s){ return '<button class="'+(S.cf.status===s[0]?'on':'')+'" data-a="cstat" data-v="'+s[0]+'">'+s[1]+' <span style="color:var(--mut)">'+counts[s[0]]+'</span></button>'; }).join('')+'</div><div style="flex:1"></div>'
    + '<select class="inp" style="width:200px;height:36px" id="cfun"><option value="all">Alle Funnels</option>'+scopedFunnels().map(function(f){ return '<option value="'+f.id+'"'+(S.cf.funnel===f.id?' selected':'')+'>'+esc(f.name)+'</option>'; }).join('')+'</select>'
    + '<label class="search" style="min-width:220px">'+I('search')+'<input id="cq" placeholder="Name, E-Mail, Telefon …" value="'+esc(S.cf.q)+'"></label></div>';
  if(nSel) h += '<div class="callout" style="align-items:center;margin-bottom:12px"><b>'+nSel+' ausgewählt</b><span style="flex:1"></span>Status setzen: '+STATUSES.map(function(s){ return '<button class="btn sm" data-a="bulk" data-v="'+s[0]+'">'+s[1]+'</button>'; }).join(' ')+''+(isAdmin()?'<button class="btn sm danger" data-a="bulkdel">'+I('trash',13)+'Löschen</button>':'')+'</div>';
  h += '<div class="card" style="overflow:auto">';
  if(!ls.length) h += '<div class="emptyp" style="padding:60px"><div class="ic">'+I('inbox',20)+'</div>Noch keine Kontakte'+(db.leads.length?' für diesen Filter':'')+'.<br><span style="font-size:var(--fs-12)">Teste einen Funnel in der Vorschau – die Einträge landen hier.</span></div>';
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
  var items = (l.items||[]).map(function(it){ return '<div>'+esc(it.label)+(it.detail?'<br><span style="font-size:var(--fs-12)">'+esc(it.detail)+'</span>':'')+'</div><div style="text-align:right;font-weight:550">'+FP.money(it.amount)+'</div>'; }).join('');
  d.innerHTML = '<div class="dh">'+avatar(l.name||l.email)+'<div style="flex:1;min-width:0"><div style="font-weight:650;font-size:var(--fs-16)">'+esc(l.name||'Unbekannt')+'</div><div style="color:var(--mut);font-size:var(--fs-13)">'+esc(l.funnelName)+' · '+fmtDT(l.createdAt)+'</div></div><button class="btn ghost sm ic" data-x>'+I('x')+'</button></div>'
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
/* 14-Tage-Balkendiagramm (Aufrufe hell, Leads kräftig) */
function chart14(days){
  var mx = Math.max.apply(null, days.map(function(d){ return d.v; }).concat([5]));
  var W = 640, H = 220, pad = 28, bw = (W - pad) / days.length;
  var svg = '<svg class="chart" viewBox="0 0 '+W+' '+(H+24)+'" style="width:100%;height:auto;display:block">';
  [0,.5,1].forEach(function(g){ var y = 10 + (H-20)*(1-g); svg += '<line x1="'+pad+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" class="cg"/><text class="ctx" x="'+(pad-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="10">'+Math.round(mx*g)+'</text>'; });
  days.forEach(function(d, ix){
    var x = pad + ix*bw + bw*0.18, w = bw*0.64, vh = (H-20) * d.v / mx, lh = (H-20) * d.l / mx;
    svg += '<rect x="'+x+'" y="'+(H-10-vh)+'" width="'+w+'" height="'+Math.max(vh,0)+'" rx="4" class="cv"><title>'+d.k+': '+d.v+' Aufrufe</title></rect>';
    svg += '<rect x="'+(x+w*0.2)+'" y="'+(H-10-lh)+'" width="'+(w*0.6)+'" height="'+Math.max(lh,0)+'" rx="3" class="cl"><title>'+d.k+': '+d.l+' Leads</title></rect>';
    if(ix % 2 === 0) svg += '<text x="'+(x+w/2)+'" y="'+(H+12)+'" text-anchor="middle" font-size="10" class="ctx">'+d.k.slice(8)+'.'+d.k.slice(5,7)+'.</text>';
  });
  return svg + '</svg>';
}
/* Gesamtansicht: alle Funnels des Arbeitsbereichs bzw. des Kunden zusammen */
function analyticsAll(VF, h){
  var t = {v:0, s:0, c:0}, rows = [], allLeads = [];
  VF.forEach(function(f){ var ls = leadsOf(f.id); t.v += f.stats.views; t.s += f.stats.starts; t.c += f.stats.completes; allLeads = allLeads.concat(ls); rows.push({f:f, ls:ls, val:ls.reduce(function(a,l){ return a + (l.total||0); }, 0)}); });
  var avg = allLeads.length ? allLeads.reduce(function(a,l){ return a + (l.total||0); }, 0) / allLeads.length : 0;
  h += '<div class="kpis" style="grid-template-columns:repeat(5,minmax(0,1fr))">'+kpi('Aufrufe', fmtNum(t.v), VF.length+' Funnels zusammen', 'eye', series14(VF,'v'))+kpi('Starts', fmtNum(t.s), (t.v?Math.round(t.s/t.v*100):0)+' % Start-Rate', 'play')+kpi('Leads', fmtNum(allLeads.length), 'alle Funnels', 'inbox', series14(VF,'l'))+kpi('Conversion', (t.v?(t.c/t.v*100):0).toFixed(1).replace('.',',')+' %', 'Aufruf → Abschluss', 'percent')+kpi('Ø Anfragewert', fmtMoney(avg), fmtMoney(allLeads.reduce(function(a,l){ return a + (l.total||0); }, 0))+' gesamt', 'receipt')+'</div>';
  var days = []; for(var i=13;i>=0;i--){ var k = dayKey(Date.now()-i*864e5), dv = 0, dl = 0; VF.forEach(function(f){ var x = (f.stats.daily||{})[k] || {}; dv += x.v || 0; dl += x.l || 0; }); days.push({k:k, v:dv, l:dl}); }
  h += '<div class="card" style="margin-bottom:16px"><div class="ch"><h3>Letzte 14 Tage</h3><p>alle Funnels</p><span style="flex:1"></span><div class="legend"><span><i class="lv"></i>Aufrufe</span><span><i class="ll"></i>Leads</span></div></div><div class="cb">'+chart14(days)+'</div></div>';
  rows.sort(function(a, b){ return b.ls.length - a.ls.length || b.f.stats.views - a.f.stats.views; });
  h += '<div class="card" style="overflow:auto"><div class="ch"><h3>Funnels im Vergleich</h3><p>Klick öffnet die Details</p></div><table class="t"><thead><tr><th>Funnel</th><th>Aufrufe</th><th>Starts</th><th>Leads</th><th>Conversion</th><th>Ø Wert</th><th style="width:140px">Trend (14 T.)</th></tr></thead><tbody>'
    + rows.map(function(r){ var f = r.f, cv = f.stats.views ? f.stats.completes / f.stats.views * 100 : 0; return '<tr data-a="afid" data-id="'+f.id+'"><td><div class="nm">'+esc(f.name)+'</div><div class="sub">'+(f.status==='live'?'<span class="pill live" style="background:none;padding:0">Live</span>':'Entwurf')+(f.clientId && isAdmin() && !scopeId() && clientById(f.clientId) ? ' · '+esc(clientById(f.clientId).name) : '')+'</div></td><td>'+fmtNum(f.stats.views)+'</td><td>'+fmtNum(f.stats.starts)+'</td><td><b>'+r.ls.length+'</b></td><td>'+cv.toFixed(1).replace('.',',')+' %</td><td>'+(r.ls.length ? fmtMoney(r.val / r.ls.length) : '–')+'</td><td class="trend">'+spark(series14([f],'v'))+'</td></tr>'; }).join('')
    + '</tbody></table></div>';
  return h + '</div>';
}
function viewAnalytics(){
  var VF = scopedFunnels(), multi = VF.length > 1;
  if(S.afid === 'all' && !multi) S.afid = null;
  if(S.afid !== 'all' && (!S.afid || VF.map(function(x){ return x.id; }).indexOf(S.afid) < 0)) S.afid = multi ? 'all' : (VF[0] || {}).id;
  var f = S.afid === 'all' ? null : getF(S.afid);
  var who = isAdmin() && scopeId() ? scopeLabel() : '';
  var h = '<div class="page"><div class="ph"><div><h1>Analytics'+(who?' <span style="color:var(--mut);font-weight:500">· '+esc(who)+'</span>':'')+'</h1><p>'+(S.afid==='all' ? 'Alle Funnels'+(who?' von '+esc(who):'')+' zusammen – und im Vergleich.' : 'Performance, Drop-off und Antwortverteilung pro Funnel.')+'</p></div><div class="sp"></div><select class="inp" style="width:240px;height:36px" id="afun">'+(multi?'<option value="all"'+(S.afid==='all'?' selected':'')+'>Alle Funnels ('+VF.length+')</option>':'')+VF.map(function(x){ return '<option value="'+x.id+'"'+(x.id===S.afid?' selected':'')+'>'+esc(x.name)+'</option>'; }).join('')+'</select></div>';
  if(!VF.length) return h + '<div class="empty">Noch keine Funnels vorhanden.</div></div>';
  if(S.afid === 'all') return analyticsAll(VF, h);
  var ls = leadsOf(f.id), st = f.stats;
  var avg = ls.length ? ls.reduce(function(a,l){ return a + (l.total||0); }, 0) / ls.length : 0;
  if(f.demo) h += '<div style="margin:-8px 0 16px"><span class="demo-note">'+I('info',13)+'Dieser Funnel enthält Demo-Daten zur Veranschaulichung.</span></div>';
  h += '<div class="kpis" style="grid-template-columns:repeat(5,1fr)">'+kpi('Aufrufe', fmtNum(st.views), 'Funnel geöffnet', 'eye')+kpi('Starts', fmtNum(st.starts), (st.views?Math.round(st.starts/st.views*100):0)+' % Start-Rate', 'play')+kpi('Abschlüsse', fmtNum(st.completes), 'Formular abgesendet', 'check')+kpi('Conversion', conv(f).toFixed(1).replace('.',',')+' %', 'Aufruf → Abschluss', 'percent')+kpi('Ø Anfragewert', avg?FP.money(avg):'–', ls.length+' Leads', 'euro')+'</div>';
  // daily chart
  var days = []; for(var i=13;i>=0;i--){ var k = dayKey(Date.now()-i*864e5); days.push({k:k, v:(st.daily[k]||{}).v||0, l:(st.daily[k]||{}).l||0}); }
  var svg = chart14(days);
  h += '<div class="charts"><div class="card"><div class="ch"><h3>Letzte 14 Tage</h3><span style="flex:1"></span><div class="legend"><span><i class="lv"></i>Aufrufe</span><span><i class="ll"></i>Leads</span></div></div><div class="cb">'+svg+'</div></div>';
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
      h += '<div><div style="font-weight:600;margin-bottom:12px;font-size:var(--fs-13)">'+esc(FP.stripInk(b.props.question||k).replace(/\*\*|==/g,''))+'</div><div class="dist">' + b.props.options.map(function(o){ var c = cnt[o.id]||0, pc = ls.length ? Math.round(c/ls.length*100) : 0; return '<div class="dr"><div class="top"><span>'+esc((o.icon?o.icon+' ':'')+o.label)+'</span><span style="color:var(--mut)">'+c+' · '+pc+' %</span></div><div class="tr"><i style="width:'+pc+'%"></i></div></div>'; }).join('') + '</div></div>';
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
  h += '<div class="card"><div class="ch">'+I('images')+'<h3>Mediathek</h3></div><div class="cb"><button class="btn" data-a="manageMedia">Bilder verwalten</button></div></div>';
  h += listsCard();
  h += '<div class="card"><div class="ch">'+I('file')+'<h3>Daten exportieren</h3></div><div class="cb"><p class="hint" style="margin:0 0 12px">Komplettes Backup (Funnels, Kontakte, Brand-Kit) als JSON.</p><button class="btn" data-a="exportAll">'+I('copy')+'Backup kopieren</button></div></div>';
  h += '<div class="card"><div class="ch">'+I('upload')+'<h3>Daten importieren</h3></div><div class="cb"><textarea class="inp" id="impj" placeholder="Backup- oder Funnel-JSON hier einfügen …" style="min-height:80px;font-family:ui-monospace,monospace;font-size:var(--fs-12)"></textarea><div style="display:flex;gap:8px;margin-top:10px"><button class="btn" data-a="importJ">Importieren</button><span style="flex:1"></span><button class="btn danger" data-a="resetAll">'+I('refresh',14)+'Zurücksetzen</button></div></div></div>';
  return h + '</div></div>';
}
/* Schnellfarben: jede gewählte Farbe landet in der Palette des Kunden (ohne Kunde: im Funnel) und steht in allen Farbfeldern bereit */
function swHost(){ var f = typeof F === 'function' ? F() : null; if(!f) return null; var c = f.clientId && clientById(f.clientId); if(c){ c.data = c.data || {}; return {o:c.data, who:c.name}; } f.theme = f.theme || {}; return {o:f.theme, who:''}; }
function swList(){ var h = swHost(); return h ? (h.o.swatches || []) : []; }
function swNorm(v){ v = String(v || '').trim().toLowerCase(); if(/^#[0-9a-f]{3}$/.test(v)) v = '#' + v[1]+v[1]+v[2]+v[2]+v[3]+v[3]; return /^#[0-9a-f]{6}$/.test(v) ? v : ''; }
function swAdd(v){
  var c = swNorm(v), h = swHost(); if(!c || !h) return;
  var t = (F().theme || {}), brand = [t.primary, t.primaryText, t.bg, t.surface, t.text, t.muted].map(swNorm);
  if(brand.indexOf(c) >= 0) return; /* Markenfarben stehen ohnehin vorne */
  var l = (h.o.swatches || []).filter(function(x){ return x !== c; }); l.unshift(c); h.o.swatches = l.slice(0, 14); save(); swRefresh();
}
function swHtml(cur){
  var f = typeof F === 'function' ? F() : null; if(!f) return '';
  var t = f.theme || {}, seen = {}, out = [];
  [[t.primary,'Markenfarbe'],[t.text,'Text'],[t.surface,'Flächen'],[t.bg,'Hintergrund']].forEach(function(x){ var c = swNorm(x[0]); if(c && !seen[c]){ seen[c] = 1; out.push([c, x[1], 1]); } });
  swList().forEach(function(c){ if(!seen[c]){ seen[c] = 1; out.push([c, c, 0]); } });
  var cv = swNorm(cur);
  return out.map(function(x, i){ return (i && x[2] === 0 && out[i-1][2] === 1 ? '<i></i>' : '') + '<button type="button" class="sw'+(x[0] === cv ? ' on' : '')+'" data-a="swPick" data-c="'+x[0]+'" style="--c:'+x[0]+'" title="'+esc(x[1])+'" aria-label="Farbe '+esc(x[1])+'"></button>'; }).join('');
}
function swRefresh(){ document.querySelectorAll('.swr').forEach(function(r){ var w = r.closest('.colw'), tx = w && w.querySelector('input[type=text]'); r.innerHTML = swHtml(tx ? tx.value : ''); }); }
function colAlpha(v){ var m = String(v || '').match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/); if(m) return Math.round(Math.max(0, Math.min(1, +m[1])) * 100); var h = String(v || '').match(/^#[0-9a-f]{6}([0-9a-f]{2})$/i); return h ? Math.round(parseInt(h[1], 16) / 2.55) : 100; }
function colMix(hex, a){ hex = toHex(hex || '#000000'); if(a >= 100) return hex; var n = parseInt(hex.slice(1), 16); return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+(Math.round(a)/100)+')'; }
function colorField(scope, k, v){ var al = colAlpha(v); return '<div class="colw"><div class="colr"><input type="color" data-'+scope+'="'+k+'" value="'+esc(toHex(v||'#ffffff'))+'"><input type="text" data-'+scope+'="'+k+'" value="'+esc(v)+'"><span class="alw" title="Deckkraft"><input type="range" class="alpha" min="0" max="100" step="1" value="'+al+'" data-alpha style="--c:'+esc(toHex(v||'#ffffff'))+'" aria-label="Deckkraft"><b>'+al+'%</b></span></div><div class="swr">'+swHtml(v)+'</div></div>'; }
/* Deckkraft-Regler und Farbwähler arbeiten zusammen: unter 100 % wird rgba() gespeichert */
document.addEventListener('input', function(e){
  var el = e.target; if(!el.closest) return; var w = el.closest('.colr'); if(!w) return;
  var tx = w.querySelector('input[type=text]'), cp = w.querySelector('input[type=color]'), al = w.querySelector('[data-alpha]'); if(!tx || !al) return;
  if(el === al){ e.stopPropagation(); var a = +al.value; al.nextElementSibling.textContent = a + '%'; tx.value = colMix(cp.value, a); tx.dispatchEvent(new Event('input', {bubbles:true})); return; }
  if(el === cp && +al.value < 100){ e.stopPropagation(); al.style.setProperty('--c', cp.value); tx.value = colMix(cp.value, +al.value); tx.dispatchEvent(new Event('input', {bubbles:true})); return; }
  if(el === cp) al.style.setProperty('--c', cp.value);
  if(el === tx){ var na = colAlpha(tx.value); if(+al.value !== na){ al.value = na; al.nextElementSibling.textContent = na + '%'; } }
}, true);
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
  heading:[['text','textarea','Text','Für einzelne Textfarben: Text im Handy doppelklicken, Wörter markieren und die Schriftfarbe wählen. **fett** · *kursiv* · ++unterstrichen++ · __Hervorhebung__ · ==Akzentfarbe== · [[Marker]] · {{name}}'],['hl','select','Stil der Hervorhebung',[['','Wie im Design-Tab']].concat(FP.HL_STYLES)],['hlColor','color','Farbe der Hervorhebung'],['level','seg','Größe',[[1,'H1'],[2,'H2'],[3,'H3']]],['row2','row',[['size','num','Schriftgröße (px)'],['lh','lh','Zeilenhöhe']]]],
  text:[['text','textarea','Text','Für einzelne Textfarben: Text im Handy doppelklicken, Wörter markieren und die Schriftfarbe wählen. **fett** · *kursiv* · ++unterstrichen++ · __Hervorhebung__ · ==Akzent== · [[Marker]] · {{name}}, {{total}}'],['hl','select','Stil der Hervorhebung',[['','Wie im Design-Tab']].concat(FP.HL_STYLES)],['hlColor','color','Farbe der Hervorhebung'],['row2','row',[['size','num','Schriftgröße (px)'],['lh','lh','Zeilenhöhe']]]],
  badge:[['text','text','Text'],['variant','seg','Stil',[['','Soft'],['filled','Gefüllt'],['outline','Rahmen'],['grey','Grau']]],['upper','toggle','Großbuchstaben']],
  compare:[['bleed','toggle','Volle Breite ohne Seitenrand'],['before','image','Vorher-Bild (links)'],['after','image','Nachher-Bild (rechts)'],['row2','row',[['labelBefore','text','Text links'],['labelAfter','text','Text rechts']]],['ratio','select','Seitenverhältnis',[['4:3','4:3'],['1:1','1:1'],['16:9','16:9'],['3:4','3:4 (hoch)']]],['start','range','Startposition',[5,95,1,'%']],['radius','range','Ecken',[0,40,1]]],
  image:[['src','image','Bild'],['bleed','toggle','Volle Breite ohne Seitenrand','Das Bild reicht bis an den Rand des Bildschirms. Die Höhe bestimmst du weiter unten.'],['ratio','select','Seitenverhältnis',[['','Feste Höhe'],['2:1','2:1'],['16:9','16:9'],['4:3','4:3'],['1:1','1:1'],['auto','Original']]],['height','range','Höhe',[80,420,10],function(p){ return !p.ratio; }],['radius','range','Ecken',[0,40,1]],['fit','seg','Darstellung',[['cover','Füllen'],['contain','Einpassen']]],['alt','text','Alt-Text'],
    ['_e','sec','Übergänge'],
    ['edgeTop','select','Oben',FP.EDGE_LIST],['edgeTopH','range','Höhe oben',[8,160,2,'px',40],function(p){ return !!p.edgeTop; }],['edgeTopFlip','toggle','Oben spiegeln',null,function(p){ return !!p.edgeTop && /slant|brush|torn|wave/.test(p.edgeTop); }],
    ['edgeBot','select','Unten',FP.EDGE_LIST],['edgeBotH','range','Höhe unten',[8,160,2,'px',40],function(p){ return !!p.edgeBot; }],['edgeBotFlip','toggle','Unten spiegeln',null,function(p){ return !!p.edgeBot && /slant|brush|torn|wave/.test(p.edgeBot); }],
    ['_eh','note','Am schönsten mit „Volle Breite ohne Seitenrand“ und Ecken auf 0. Der Hintergrund der Seite scheint durch.']],
  video:[['url','text','YouTube- oder Vimeo-Link','Wird im veröffentlichten Funnel eingebettet.'],['bleed','toggle','Volle Breite ohne Seitenrand'],['radius','range','Ecken',[0,40,1]]],
  list:[['items','strings','Punkte'],['icon','select','Symbol',[['check','Haken'],['number','Zahlen'],['star','Stern'],['heart','Herz'],['shield','Schild'],['bolt','Blitz'],['leaf','Blatt'],['clock','Uhr'],['euro','Euro'],['sparkle','Funkeln'],['thumb','Daumen']]]],
  testimonial:[['quote','textarea','Zitat'],['name','text','Name'],['role','text','Untertitel'],['stars','range','Sterne',[0,5,1]],['img','image','Foto']],
  trust:[['items','strings','Badges']],
  reviews:[['row2','row',[['score','num','Note (z. B. 4.9)'],['count','num','Anzahl']]],['source','text','Quelle (z. B. Google)'],['variant','seg','Darstellung',[['','Schlicht'],['card','Als Karte']]],['text','text','Eigener Text (optional)']],
  avatars:[['names','strings','Namen (ergeben die Initialen)'],['photos','imgstrings','Fotos (ersetzen die Initialen)'],['text','text','Text'],['more','text','Zusatz im letzten Kreis (z. B. +200)'],['stars','toggle','Sterne anzeigen']],
  logos:[['title','text','Überschrift'],['items','imgstrings','Logos','Firmennamen als Text oder Logos hochladen.'],['speed','range','Tempo',[10,60,2,' s']],['gray','toggle','Logos in Grau']],
  recap:[['title','text','Titel'],['showImage','toggle','Bild der gewählten Antwort zeigen'],['showPrice','toggle','Preis anzeigen'],['totalLabel','text','Preis-Text',null,function(p){ return p.showPrice !== false; }],['max','range','Höchstens Antworten',[2,10,1,'']]],
  steps:[['title','text','Titel'],['items','strings','Schritte','Format: Titel | Beschreibung. Der erste Schritt gilt als erledigt, der zweite als „läuft gerade“.']],
  arrow:[['text','text','Text'],['textSide','seg','Text-Position',[['start','Am Anfang'],['end','Am Ende'],['none','Ohne']]],['hand','toggle','Handschrift'],['style','seg','Form',[['curve','Bogen'],['swoop','Schwung'],['loop','Schleife'],['straight','Gerade']]],['size','range','Größe',[40,200,2]],['rotate','range','Drehung',[-180,180,5,'°']],['flip','toggle','Spiegeln'],['row2','row',[['x','num','Links / rechts (px)'],['y','num','Hoch / runter (px)']]],['_n','note','Tipp: Im Handy-Vorschaubild kannst du den Pfeil direkt mit der Maus ziehen. Mit den Pfeiltasten verschiebst du ihn fein, mit Umschalt in 10er-Schritten.'],['acolor','color','Farbe (leer = Akzentfarbe)'],['anim','select','Bewegung',[['bounce','Wippen'],['wiggle','Wackeln'],['draw','Einzeichnen beim Öffnen'],['none','Keine']]]],
  loader:[['anim','select','Animation',FP.LOADERS],['src','text','Lottie-Adresse (.json, z. B. von LottieFiles)',null,function(p){ return p.anim === 'custom'; }],['json','lottie','Oder Datei hochladen',null,function(p){ return p.anim === 'custom'; }],['duration','range','Dauer',[1,10,0.5,' s']],['size','range','Größe',[60,240,4]],['texts','strings','Wechselnde Hinweise','Wechseln gleichmäßig über die Dauer.'],['showBar','toggle','Ladebalken anzeigen'],['_n','note','Nach Ablauf geht es automatisch zur nächsten Seite. Wer zurückgeht, überspringt die Ladeseite.']],
  faq:[['items','faq','Fragen & Antworten']],
  countdown:[['label','text','Text darüber'],['minutes','num','Dauer in Minuten']],
  choice:[['question','textarea','Frage'],['desc','text','Beschreibung (optional)'],['layout','select','Layout',[['list','Liste mit Icons'],['checklist','Checkbox-Liste (kompakt)'],['grid','Kacheln'],['image','Bildkarten'],['cover','Bildkarten vollflächig'],['chips','Chips'],['scale','Skala (z. B. Emojis in einer Reihe)']]],['faceStyle','select','Smileys',[['','Emojis'],['flat','Flache Smileys mit Text']],function(p){ return p.layout==='scale'; }],['faceNoText','toggle','Text ausblenden (nur Smileys)',null,function(p){ return p.layout==='scale' && p.faceStyle==='flat'; }],['faceBare','toggle','Ohne Hintergrund',null,function(p){ return p.layout==='scale' && p.faceStyle==='flat'; }],['cols','seg','Bilder pro Reihe',[[2,'2'],[3,'3'],[4,'4'],[1,'1']],function(p){ return p.layout==='image'; }],['zoom','toggle','Lupe zum Vergrößern','Zeigt eine Lupe auf jedem Bild. Sie öffnet das Bild groß, mit Wischen zwischen den Antworten und direktem Auswählen.',function(p){ return p.layout==='image' || p.layout==='cover'; }],
    ['cols','seg','Karten pro Reihe',[[2,'2'],[3,'3'],[1,'1']],function(p){ return p.layout==='cover'; }],
    ['ratio','select','Kartenformat',[['','4:5 (Standard)'],['1:1','1:1 Quadrat'],['3:4','3:4 Hochformat'],['4:3','4:3 Quer'],['16:9','16:9 Breit']],function(p){ return p.layout==='cover'; }],
    ['coverFade','seg','Verlauf',[['white','Weiß'],['black','Schwarz'],['none','Ohne']],function(p){ return p.layout==='cover'; }],
    ['coverAlign','seg','Text',[['bottom','Unten'],['center','Mittig']],function(p){ return p.layout==='cover'; }],
    ['coverFadeS','range','Höhe des Verlaufs',[20,100,5,'%',55],function(p){ return p.layout==='cover' && p.coverFade !== 'none'; }],
    ['row2','row',[['coverTx','color','Textfarbe'],['coverSize','num','Schriftgröße (px)']],null,function(p){ return p.layout==='cover'; }],
    ['coverRad','range','Rundung',[0,40,1,'px',18],function(p){ return p.layout==='cover'; }],
    ['chipStyle','seg','Chip-Stil',[['tint','Getönt'],['outline','Rahmen'],['white','Weiß'],['solid','Gefüllt']],function(p){ return p.layout==='chips'; }],
    ['chipArr','seg','Anordnung',[['center','Mittig, versetzt'],['left','Links'],['scroll','Wischbar']],function(p){ return p.layout==='chips'; }],
    ['chipIcon','toggle','Icons zeigen',null,function(p){ return p.layout==='chips'; },true],
    ['chipGrad','toggle','Leichter Verlauf',null,function(p){ return p.layout==='chips'; }],
    ['chipSize','range','Größe',[11,24,1,'px',15],function(p){ return p.layout==='chips'; }],['chipRad','range','Rundung',[0,30,1,'px',30],function(p){ return p.layout==='chips'; }],
    ['_cn','note','Farben pro Chip: bei der Antwort auf das Zahnrad klicken. Icons ebenfalls dort.',null,function(p){ return p.layout==='chips'; }],['cols','seg','Spalten',[[2,'2'],[3,'3']],function(p){ return p.layout==='grid'; }],['ratio','select','Bildformat',[['','4:3 (Standard)'],['1:1','1:1 Quadrat'],['16:9','16:9 Breit'],['3:4','3:4 Hochformat']],function(p){ return p.layout==='image'; }],['colsD','seg','Pro Reihe auf Desktop',[[0,'Wie mobil'],[3,'3'],[4,'4']],function(p){ return p.layout==='image' || p.layout==='grid'; }],['colsD','seg','Spalten auf Desktop',[[0,'1'],[2,'2']],function(p){ return p.layout==='checklist'; }],['faceEnds','toggle','Text nur links und rechts zeigen',null,function(p){ return p.layout==='scale' && p.faceStyle==='flat' && p.faceNoText; }],['row2','row',[['minLabel','text','Label links'],['maxLabel','text','Label rechts']],null,function(p){ return p.layout==='scale' && (p.faceStyle!=='flat' || (p.faceNoText && p.faceEnds)); }],['options','options','Antworten'],['optAlign','seg','Text der Antworten',[['','Standard'],['left','Links'],['center','Mitte']],function(p){ return ['scale','chips','cover'].indexOf(p.layout) < 0; }],['optFw','seg','Titel',[['','Std'],[400,'400'],[500,'500'],[600,'600'],[700,'700'],[800,'800']],function(p){ return ['scale','chips','cover'].indexOf(p.layout) < 0; }],['optSubFw','seg','Untertitel',[['','Std'],[400,'400'],[500,'500'],[600,'600'],[700,'700']],function(p){ return ['scale','chips','cover'].indexOf(p.layout) < 0 && (p.options||[]).some(function(o){ return o.sub; }); }],['multi','toggle','Mehrfachauswahl'],['maxSelect','num','Max. Auswahl (optional)',null,function(p){ return p.multi; }],['autoNext','toggle','Automatisch weiter bei Auswahl',null,function(p){ return !p.multi; }],['required','toggle','Pflichtfeld'],['showPrices','toggle','Preise bei den Antworten zeigen','Aus: Preise zählen trotzdem für Endpreis, Angebot und Anfrage – sie sind nur für den Besucher unsichtbar.'],['key','key','Feld-Schlüssel']],
  input:[['label','text','Label'],['placeholder','text','Platzhalter'],['emoji','text','Emoji im Feld (optional)','z. B. ✉️ oder 📞 – ersetzt das Standard-Icon.'],['inputType','select','Feldtyp',[['text','Text'],['email','E-Mail'],['tel','Telefon'],['number','Zahl'],['date','Datum'],['textarea','Mehrzeilig']]],['isQuantity','toggle','Als Menge für Preisberechnung','Preise „pro Einheit“ werden mit diesem Wert multipliziert. Mehrere Mengenfelder werden miteinander multipliziert (z. B. Länge × Breite).',function(p){ return p.inputType==='number'; }],['row3','row',[['qtyFactor','num','Umrechnung ×'],['def','num','Wert, falls leer'],['unit','text','Einheit']],null,function(p){ return p.inputType==='number' && p.isQuantity; }],['rows','num','Zeilen (Höhe)',null,function(p){ return p.inputType==='textarea'; }],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  slider:[['label','text','Label'],['row3','row',[['min','num','Min'],['max','num','Max'],['step','num','Schritt']]],['row2','row',[['def','num','Startwert'],['unit','text','Einheit']]],['isQuantity','toggle','Als Menge für Preisberechnung','Preise „pro Einheit“ (z. B. €/m²) werden mit diesem Wert multipliziert.'],['key','key','Feld-Schlüssel']],
  rating:[['label','text','Frage'],['style','select','Darstellung',[['stars','Sterne'],['faces','Smileys flach mit Text'],['emoji','Emoji-Skala (Kacheln)'],['slider','Slider mit wechselndem Emoji'],['nps','NPS 0–10']]],['max','range','Anzahl Sterne',[3,10,1],function(p){ return !p.style || p.style==='stars'; }],['max','range','Stufen',[2,7,1],function(p){ return p.style==='emoji' && !String(p.emojis||'').trim(); }],['max','range','Stufen',[2,7,1],function(p){ return p.style==='faces'; }],['faceNoText','toggle','Text ausblenden (nur Smileys)',null,function(p){ return p.style==='faces'; }],['faceBare','toggle','Ohne Hintergrund',null,function(p){ return p.style==='faces'; }],['faceLabels','strings','Texte unter den Smileys','Leer lassen für: Sehr schlecht, Schlecht, Okay, Gut, Super.',function(p){ return p.style==='faces' && !p.faceNoText; }],['max','range','Skala bis',[3,10,1],function(p){ return p.style==='slider'; }],['emojis','emojis','Eigene Emojis',null,function(p){ return p.style==='emoji' || p.style==='slider'; }],['showValue','toggle','Zahl anzeigen',null,function(p){ return p.style==='slider'; }],['faceEnds','toggle','Text nur links und rechts zeigen',null,function(p){ return p.style==='faces' && p.faceNoText; }],['row2','row',[['minLabel','text','Label links'],['maxLabel','text','Label rechts']],null,function(p){ return p.style!=='faces' || (p.faceNoText && p.faceEnds); }],['autoNext','toggle','Automatisch weiter'],['routes','routes','Weiterleitung nach Bewertung'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  calendar:[['label','text','Label'],['calStyle','seg','Ansicht',[['','Monatskalender'],['strip','Tagesleiste']]],['row2','row',[['dur','text','Dauer (optional)'],['where','text','Ort (optional)']]],['row2','row',[['days','num','Buchbare Tage'],['offset','num','Frühestens in … Tagen']]],['excludeDays','days','Geschlossen an'],['slots','strings','Uhrzeiten'],['noHolidays','toggle','Feiertage ausschließen','Bundesweite Feiertage wie Ostern oder Weihnachten sind nicht buchbar.',null,true],['blocked','strings','Gesperrte Tage (z. B. 2026-12-24)'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel'],
    ['_g','sec','Gestaltung',null,function(p){ return p.calStyle !== 'strip'; }],
    ['row2','row',[['calAcc','color','Farbe der Kreise'],['calAccText','color','Text auf Farbe']],null,function(p){ return p.calStyle !== 'strip'; }],
    ['calShape','seg','Form',[['','Kreis'],['rounded','Abgerundet'],['square','Eckig'],['pill','Pillen']],function(p){ return p.calStyle !== 'strip'; }],
    ['calDays','seg','Freie Tage',[['','Getönt'],['solid','Kräftig'],['outline','Umrandet'],['plain','Nur Text']],function(p){ return p.calStyle !== 'strip'; }],
    ['calDayShadow','toggle','Schlagschatten an freien Tagen',null,function(p){ return p.calStyle !== 'strip'; }],
    ['calSelShadow','toggle','Leuchten unter der Auswahl',null,function(p){ return p.calStyle !== 'strip'; },true],
    ['slotStyle','seg','Uhrzeiten',[['','Umrandet'],['tint','Getönt'],['shadow','Mit Schatten']],function(p){ return p.calStyle !== 'strip'; }],
    ['slotCols','seg','Uhrzeiten pro Reihe',[[0,'3'],[2,'2'],[4,'4']],function(p){ return p.calStyle !== 'strip'; }],
    ['calCard','seg','Rahmen',[['','Karte'],['shadow','Schwebend'],['flat','Ohne']],function(p){ return p.calStyle !== 'strip'; }],
    ['row2','row',[['calBg','color','Hintergrund'],['calText','color','Textfarbe']],null,function(p){ return p.calStyle !== 'strip'; }],
    ['calRadius','range','Ecken der Karte',[0,32,1,'px',18],function(p){ return p.calStyle !== 'strip'; }]],
  upload:[['label','text','Label'],['cta','text','Button-Text'],['hint','text','Hinweis'],['accept','text','Dateitypen'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  signature:[['label','text','Label'],['hint','text','Hinweis im Feld'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  checkbox:[['text','textarea','Text','Link: Doppelklick auf den Text im Handy, Wort markieren, Link-Symbol – oder hier [Datenschutzerklärung](https://…) schreiben. Links öffnen sich in einem neuen Fenster.'],['size','num','Schriftgröße (px)'],['required','toggle','Pflichtfeld'],['key','key','Feld-Schlüssel']],
  button:[['label','text','Beschriftung'],['sub','text','Untertitel (optional)'],['subIn','toggle','Untertitel im Button anzeigen',null,function(p){ return !!p.sub; }],['radiusOn','toggle','Eigene Rundung (statt Theme)'],['radius','range','Ecken',[0,40,1],function(p){ return p.radiusOn; }],['action','select','Aktion',[['next','Nächste Seite'],['page','Zu Seite springen'],['submit','Absenden (Lead speichern)'],['url','Link öffnen'],['wa','WhatsApp-Chat öffnen']]],['waNumber','text','WhatsApp-Nummer',null,function(p){ return p.action==='wa'; }],['waText','textarea','Erste Nachricht (optional)','Steht beim Öffnen schon im Chat. Variablen wie {{vorname}} gehen auch.',function(p){ return p.action==='wa'; }],['target','page','Zielseite',null,function(p){ return p.action==='page' || p.action==='submit'; }],['url','text','URL',null,function(p){ return p.action==='url'; }],['variant','select','Stil',[['','Wie im Theme'],['filled','Gefüllt'],['gradient','Verlauf'],['soft','Soft'],['outline','Rahmen'],['ghost','Nur Text']]],['icon','select','Icon',[['arrow','→ Pfeil'],['chevron','› Chevron'],['send','Senden'],['check','Haken'],['calendar','Kalender'],['phone','Telefon'],['mail','E-Mail'],['download','Download'],['gift','Geschenk'],['star','Stern'],['heart','Herz'],['lock','Schloss'],['sparkle','Funkeln'],['whatsapp','WhatsApp (einfarbig)'],['br-whatsapp','WhatsApp (Original)'],['br-instagram','Instagram (Original)'],['br-facebook','Facebook (Original)'],['br-tiktok','TikTok (Original)'],['br-linkedin','LinkedIn (Original)'],['br-youtube','YouTube (Original)'],['br-x','X (Original)'],['br-telegram','Telegram (Original)'],['none','Kein Icon']]],['row2','row',[['bSize','num','Schriftgröße (px)'],['icColor','color','Icon-Farbe']]],['iconLeft','toggle','Icon links'],['row2','row',[['btnBg','color','Button-Farbe'],['btnColor','color','Textfarbe']]],['row2','row',[['btnBw','num','Rahmen (px)'],['btnBc','color','Rahmenfarbe']]],['full','toggle','Volle Breite'],['bpad','pad4','Innenabstand',{keys:['bpt','bpr','bpb','bpl'], ph:function(){ var t = F().theme || {}, y = t.btnPad!=null&&t.btnPad!==''?t.btnPad:16, x = t.btnPadX!=null&&t.btnPadX!==''?t.btnPadX:22; return [y,x,y,x]; }, hint:'Leer = Wert aus dem Theme.'}],['shadow','toggle','Schatten'],['pulse','toggle','Puls-Animation']],
  summary:[['variant','select','Darstellung',[['','Zusammenfassung'],['offer','Angebot (mit Datum & Gültigkeit)']],function(p){ return !p.compact; }],['validDays','num','Gültig (Tage)',null,function(p){ return p.variant==='offer' && !p.compact; }],['compact','toggle','Kompakt (nur Gesamtpreis)'],['title','text','Titel'],['totalLabel','text','Label Gesamt',null,function(p){ return !p.compact; }],['prefix','text','Präfix (z. B. „ab“)'],['note','text','Hinweis'],['showItems','toggle','Positionen anzeigen',null,function(p){ return !p.compact; }],['sticky','toggle','Unten fixieren','Bleibt beim Scrollen am unteren Rand sichtbar, solange das Element weiter unten auf der Seite steht.']],
  box:[['count','num','Enthält die nächsten … Elemente','Die Elemente direkt darunter liegen in der Box. Mit den Pfeilen in der Element-Leiste schiebst du Elemente hinein oder heraus.'],['bxStyle','seg','Stil',[['card','Karte'],['sand','Sand'],['tint','Getönt'],['outline','Rahmen'],['glass','Glas'],['soft','Soft UI'],['solid','Farbig'],['plain','Ohne']]],['_bh','note','Hintergrund, Rahmen, Schatten, Ecken und Innenabstand stellst du unten unter „Stil → Box“ ein.']],
  social:[['whatsapp','text','WhatsApp-Nummer'],['waText','text','Erste WhatsApp-Nachricht (optional)'],['instagram','text','Instagram-Link'],['facebook','text','Facebook-Link'],['tiktok','text','TikTok-Link'],['linkedin','text','LinkedIn-Link'],['youtube','text','YouTube-Link'],['x','text','X-Link'],['telegram','text','Telegram-Link'],['mail','text','E-Mail-Adresse'],['size','range','Größe',[24,72,2,'px',40]],['chip','toggle','Mit weißem Hintergrund & Schatten'],['labels','toggle','Namen anzeigen']],
  spacer:[['height','range','Höhe',[4,160,2]]],
  divider:[],
  html:[['code','code','HTML-Code','Wird 1:1 eingefügt (z. B. Embeds, Tracking, eigenes Styling).']]
};
var TEXTY = {box:1,social:1,recap:1,steps:1,reviews:1,avatars:1,loader:1,heading:1,text:1,badge:1,list:1,button:1,choice:1,input:1,testimonial:1,faq:1,trust:1,summary:1,checkbox:1,rating:1,calendar:1,countdown:1,slider:1,upload:1,signature:1};
var STYLE_KEYS = ['ff','fw','scale','lh','ls','tt','it','color','bgc','pad','padT','padR','padB','padL','brad','bwid','bc','shd','anim','delay','vis','iAcc','iAccText','iSurf','iMut','iRad','iLine','iBw','iShd','iShdC','iShdB','iShdS','iShdX','iShdY','iGap','inBg','inStyle','starColor','oCheck','oIcon','liStyle','oIconC','liColor'];
/* Innere Gestaltung: gilt für Antworten, Felder, Kacheln, Icons … innerhalb des Elements */
var INNER_T = {choice:1, rating:1, slider:1, input:1, checkbox:1, calendar:1, upload:1, signature:1, list:1, faq:1, testimonial:1, recap:1, summary:1, steps:1, countdown:1, reviews:1, avatars:1, badge:1, trust:1, loader:1, compare:1};
var SURF_T = {choice:1, rating:1, input:1, calendar:1, upload:1, signature:1, faq:1, testimonial:1, recap:1, summary:1, steps:1, countdown:1};
var STYLE_INNER = [
  ['row2','row',[['iAcc','color','Akzentfarbe'],['iAccText','color','Text auf Akzent']]],
  ['row2','row',[['iSurf','color','Flächen'],['iMut','color','Nebentext']]],
  ['row2','row',[['iLine','color','Rahmenfarbe'],['iBw','num','Rahmen (px)']]],
  ['iShd','seg','Schatten',[['','Theme'],['none','Kein'],['sm','S'],['md','M'],['lg','L'],['glow','Leuchten'],['custom','Eigen']]],
  ['row2','row',[['iShdC','color','Schattenfarbe'],['iShdB','num','Unschärfe (px)']],null,function(p){ return p.iShd === 'custom'; }],
  ['row3','row',[['iShdS','num','Ausweitung'],['iShdX','num','Versatz X'],['iShdY','num','Versatz Y']],null,function(p){ return p.iShd === 'custom'; }],
  ['row2','row',[['iRad','num','Ecken (px)'],['iGap','num','Abstand (px)']]]
];
var STYLE_EXTRA = {
  choice:[['oIconC','color','Icon-Farbe'],['oIcon','seg','Icons',[['','Normal'],['sm','Klein'],['lg','Groß'],['none','Aus']]],['oCheck','toggle','Auswahl-Kreis zeigen',null,null,true]],
  rating:[['starColor','color','Farbe der Sterne',null,function(p){ return !p.style || p.style === 'stars'; }]],
  list:[['liColor','color','Icon-Farbe'],['liStyle','seg','Icon-Hintergrund',[['','Getönt'],['solid','Gefüllt'],['ring','Ring'],['plain','Ohne']]]],
  input:[['inStyle','seg','Feld-Stil',[['','Theme'],['card','Karte'],['outline','Rahmen'],['filled','Gefüllt'],['soft','Soft UI'],['glass','Glas'],['line','Linie']]],['inBg','color','Feld-Hintergrund']],
  checkbox:[['inBg','color','Kästchen-Hintergrund']]
};
var STYLE_TYPO = [['ff','font','Schrift'],['fw','seg','Stärke',[['','Std'],[400,'400'],[500,'500'],[600,'600'],[700,'700'],[800,'800']]],['scale','range','Größe',[60,180,5,'%']],['row2','row',[['lh','num','Zeilenhöhe'],['ls','num','Laufweite']]],['tt','seg','Schreibweise',[['','Normal'],['uppercase','GROSS'],['lowercase','klein']]],['it','toggle','Kursiv'],['color','color','Textfarbe']];
var STYLE_BOX = [['bgc','color','Hintergrund'],['pad','pad4','Innenabstand',{keys:['padT','padR','padB','padL'], ph:function(p){ var v = +p.pad || 0; return [v,v,v,v]; }}],['brad','range','Ecken',[0,40,1]],['row2','row',[['bwid','num','Rahmen (px)'],['bc','color','Rahmenfarbe']]],['shd','seg','Schatten',[['','Kein'],['sm','S'],['md','M'],['lg','L']]]];
var STYLE_FX = [['anim','select','Einblenden',[['none','Keine'],['fade','Einblenden'],['up','Von unten'],['left','Von rechts'],['zoom','Zoom']]],['delay','range','Verzögerung',[0,1500,50,'ms']],['vis','seg','Sichtbar auf',[['all','Allen'],['mobile','Mobil'],['desktop','Desktop']]]];
var BNAME = {box:'Box',social:'Social Media',arrow:'Hinweis-Pfeil',loader:'Lade-Animation',recap:'Auswahl-Karte',steps:'Zeitleiste',reviews:'Bewertungs-Abzeichen',avatars:'Kundenstapel',logos:'Logo-Leiste',heading:'Überschrift',text:'Text',badge:'Badge',image:'Bild',compare:'Vorher/Nachher',video:'Video',list:'Liste',testimonial:'Bewertung',trust:'Trust-Badges',faq:'FAQ',countdown:'Countdown',choice:'Auswahl',input:'Eingabefeld',slider:'Schieberegler',rating:'Bewertung',calendar:'Terminwahl',upload:'Datei-Upload',signature:'Unterschrift',checkbox:'Einwilligung',button:'Button',summary:'Preisübersicht',spacer:'Abstand',divider:'Trennlinie',html:'HTML'};
var BICON = {box:'boxi',social:'share2',arrow:'arrowHint',loader:'refresh',recap:'receipt',steps:'list',reviews:'star',avatars:'users',logos:'layers',heading:'heading',text:'type',badge:'badge',image:'image',compare:'compare',video:'video',list:'list',testimonial:'quote',trust:'shield',faq:'help',countdown:'clock',choice:'choice',input:'cursor',slider:'sliders',rating:'star',calendar:'calendar',upload:'upload',signature:'pen',checkbox:'checkbox',button:'pointer',summary:'receipt',spacer:'space',divider:'minus',html:'code'};

/* Vorschau-Geräte: echte Bildschirmbreiten in CSS-Pixeln, damit die Vorschau dem Handy entspricht */
var DEVICES = [
  {k:'iphone15', n:'iPhone 15 / 16', w:393, h:852, notch:'island', sb:54},
  {k:'iphone16pro', n:'iPhone 16 Pro', w:402, h:874, notch:'island', sb:56},
  {k:'iphonemax', n:'iPhone 15 / 16 Pro Max', w:430, h:932, notch:'island', sb:56},
  {k:'iphone13', n:'iPhone 12 – 14', w:390, h:844, notch:'notch', sb:47},
  {k:'iphonese', n:'iPhone SE', w:375, h:667, notch:'none', sb:20},
  {k:'galaxy', n:'Samsung Galaxy S24', w:360, h:780, notch:'punch', sb:36},
  {k:'pixel', n:'Google Pixel 8', w:412, h:915, notch:'punch', sb:40}
];
function curDevice(){ var k = ''; try{ k = localStorage.getItem('tt-phone') || ''; }catch(e){} return DEVICES.filter(function(d){ return d.k === k; })[0] || DEVICES[0]; }
function phoneAttrs(desk){ if(desk) return 'class="phone desk"'; var d = curDevice(); return 'class="phone n-'+d.notch+'" style="width:'+(d.w+22)+'px;height:'+(d.h+22)+'px;--sbh:'+d.sb+'px"'; }
function lpOff(){ try{ return localStorage.getItem('tt-lp') === '0'; }catch(e){ return false; } }
function renderEditor(){
  var f = F(); if(!f){ go('funnels'); return; }
  /* Ältere Funnels aus Vorlagen: feste Werte aus dem eigenen CSS in die Einstellungen übernehmen (sieht gleich aus, ist aber einstellbar) */
  if(f.status === 'live' && !f.published){ f.published = Object.assign({at:f.updatedAt || Date.now()}, fState(f)); save(); } /* bisheriger Stand bleibt online, bis neu veröffentlicht wird */
  if(!OPENED[f.id]){
    OPENED[f.id] = 1;
    var latest = (f.versions || [])[0];
    f._av = latest ? latest.at : 0;
    autoVersion(f);
  }
  if(T.liftCss && T.liftCss(f.theme)) touch();
  fixSel();
  var h = '<div class="ed'+(lpOff()?' lp-off':'')+'"><header class="etop">'
    + '<button class="btn ghost sm ic" data-a="nav" data-v="funnels" title="Zurück zum Dashboard">'+I('left')+'</button>'
    + '<button class="btn ghost sm ic" data-a="lpToggle" title="Elemente ein- oder ausblenden ( [ )" aria-pressed="'+(!lpOff())+'">'+I('sidebar')+'</button>'
    + '<input class="nmin" id="fname" value="'+esc(f.name)+'" size="'+Math.max(8,f.name.length)+'">'
    + '<span class="pill '+(f.status==='live'?(pubDirty(f)?'warn':'live'):'draft')+'">'+(f.status==='live'?(pubDirty(f)?'Live · Änderungen offen':'Live'):'Entwurf')+'</span><span class="sv" id="svst">'+savedLabel(savedState)+'</span><button class="btn ghost sm ic" data-a="versions" title="Versionen & Backups">'+I('history')+'</button>'
    + '<div class="sp"></div>'
    + '<div class="seg"><button class="'+(S.device==='mobile'?'on':'')+'" data-a="device" data-v="mobile" title="Mobil">'+I('mobile',15)+'</button><button class="'+(S.device==='desk'?'on':'')+'" data-a="device" data-v="desk" title="Desktop">'+I('monitor',15)+'</button></div>'
    + (S.device !== 'desk' ? '<button class="btn ghost sm devpick" data-a="devPick" title="Handy für die Vorschau wählen">'+esc(curDevice().n)+'<span class="dvw">'+curDevice().w+' px</span>'+I('chevDown',12)+'</button>' : '')
    + '<div class="vr"></div><button class="btn ghost sm ic" data-a="undo" title="Rückgängig (⌘Z)"'+(S.hist.length?'':' disabled')+'>'+I('undo')+'</button><button class="btn ghost sm ic" data-a="redo" title="Wiederholen (⌘⇧Z)"'+(S.fut.length?'':' disabled')+'>'+I('redo')+'</button><div class="vr"></div>'
    + '<button class="btn sm" data-a="preview">'+I('play',14)+'Vorschau</button><button class="btn sm pri'+(pubDirty(f)?' dirty':'')+'" data-a="publish">'+I('rocket',14)+'Veröffentlichen</button></header>'
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
    if(!q || 'sektion'.indexOf(q) >= 0 || T.SECTIONS.some(function(s){ return s.n.toLowerCase().indexOf(q) >= 0; })) h += '<div class="libg"><h4>Fertige Seiten</h4><div class="lib">' + T.SECTIONS.filter(function(s){ return !q || s.n.toLowerCase().indexOf(q) >= 0 || 'sektion'.indexOf(q) >= 0; }).map(function(s){ return '<div class="li wide" draggable="true" data-lib="'+s.id+'" data-a="addLib" title="Klick: als neue Seite einfügen · Ziehen: Inhalte in die aktuelle Seite übernehmen">'+'<span class="lic">'+I(s.ic)+'</span>'+esc(s.n)+'<span class="li-new">'+I('plus',12)+'Seite</span></div>'; }).join('') + '</div></div>';
    Object.keys(groups).forEach(function(g){ h += '<div class="libg"><h4>'+g+'</h4><div class="lib">' + groups[g].map(function(l){ return '<div class="li" draggable="true" data-lib="'+l.id+'" data-a="addLib" title="Klicken oder ziehen"><span class="lic">'+I(l.ic)+'</span>'+esc(l.n)+'</div>'; }).join('') + '</div></div>'; });
    h += '<p class="hint" style="text-align:center">Ziehe Elemente auf das Handy oder klicke, um sie unter dem markierten Element einzufügen.</p>';
  } else {
    var EE = flowEdges(f), RR = flowReach(f);
    h += '<div class="plist">' + f.pages.map(function(p, i){
      var es = EE[i], sub = !es.length ? '<span class="pe end">Ende</span>' : es.length === 1 && es[0].kind === 'next' && es[0].to === i+1 ? '' : es.map(function(e){ var t = f.pages[e.to]; return '<span class="pe '+e.kind+(t?'':' bad')+'" title="'+esc(e.label)+'">'+I('right',10)+(t?(e.to+1)+' '+esc(t.name):'fehlt')+'</span>'; }).join('');
      return '<div class="pitem t'+(i===S.pi?' on':'')+(RR[i]?'':' un')+'" draggable="true" data-pidx="'+i+'" data-a="page" data-i="'+i+'"><div class="pth">'+mini(f, i)+'</div><div class="pm"><div class="pt"><span class="n">'+(i+1)+'</span><span class="t">'+esc(p.name)+'</span><button class="ibtn" data-a="pmenu" data-i="'+i+'">'+I('more')+'</button></div><div class="ps">'+(RR[i]?'':'<span class="pe bad">nicht erreichbar</span>')+sub+'</div><span class="c">'+p.blocks.length+' Elemente</span></div></div>'; }).join('') + '</div>'
      + '<button class="btn sm" style="width:100%;margin-top:10px;justify-content:center" data-a="addPage">'+I('plus',14)+'Seite hinzufügen</button>'
      + '<p class="hint" style="margin-top:14px">Seiten per Drag &amp; Drop sortieren. Elemente auf eine Seite ziehen, um sie dorthin zu verschieben.</p>';
  }
  lp.innerHTML = h + '</div>';
}
function renderCanvas(keepScroll){
  if(inl) inlFinish();
  var f = F(), cv = $('#canvas'); if(!cv) return;
  var oldScr = $('#scr'), st = oldScr ? oldScr.scrollTop : 0;
  var n = f.pages.length, E = flowEdges(f)[S.pi] || [], branches = E.filter(function(e){ return e.kind !== 'next'; }).length;
  var nav = '<div class="pnav"><button class="ibtn" data-a="pprev" title="Vorherige Seite"'+(S.pi?'':' disabled')+'>'+I('left',15)+'</button>'
    + '<button class="pcur" data-a="pjump" title="Seite wählen"><span class="n">'+(S.pi+1)+'</span><span class="t">'+esc(curPage().name)+'</span><span class="of">von '+n+'</span>'+I('chevDown',13)+'</button>'
    + '<button class="ibtn" data-a="pnext" title="Nächste Seite"'+(S.pi<n-1?'':' disabled')+'>'+I('right',15)+'</button><span class="vr"></span>'
    + '<button class="btn ghost sm" data-a="flow" title="Logik: Ablauf und Verzweigungen bearbeiten">'+I('branch',14)+'Logik'+(branches?'<span class="pill nos" style="padding:0 6px;margin-left:2px">'+branches+'</span>':'')+'</button>'
    + '<button class="btn ghost sm ic" data-a="addPage" title="Seite hinzufügen">'+I('plus',15)+'</button></div>';
  var t = f.theme;
  var html = FP.renderPage(f, S.pi, {edit:true, answers:{}});
  cv.innerHTML = nav
    + '<div '+phoneAttrs(S.device==='desk')+'><div class="notch"></div><div class="scr" id="scr" style="background:'+esc(t.bg)+'"><div class="sbar" style="color:'+esc(t.text)+';background:'+esc(curPage().bg||t.bg)+'"><span>9:41</span><i></i></div><div class="fp-host">'+html+'</div></div></div>'
    + '<div class="canvas-hint"><span><kbd>Entf</kbd> löschen</span><span><kbd>⌘D</kbd> duplizieren</span><span><kbd>⌘Z</kbd> rückgängig</span><span><kbd>↑</kbd><kbd>↓</kbd> verschieben</span></div>';
  var scr = $('#scr');
  if(keepScroll) scr.scrollTop = st;
  if(S.sel){ var el = scr.querySelector('.fp-b[data-bid="'+S.sel+'"]'); if(el){ el.classList.add('sel'); placeTool(el); if(!keepScroll){ var r = el.getBoundingClientRect(), sr = scr.getBoundingClientRect(); if(r.top < sr.top || r.bottom > sr.bottom) scr.scrollTop += r.top - sr.top - 80; placeTool(el); } } }
  scr.addEventListener('scroll', function(){ var el = S.sel && scr.querySelector('.fp-b.sel'); if(el) placeTool(el); });
  /* Fortschritt: beim Seitenwechsel im Editor weich vom alten zum neuen Stand laufen lassen (wie im Funnel) */
  var pgi = scr.querySelector('.fp-prog i'), pst = scr.querySelector('.fp-steps'), pk = f.id + ':' + S.pi;
  if(S._pp && S._pp.fid === f.id && S._pp.pi !== S.pi){
    if(pgi && S._pp.pct != null){ var to = pgi.style.width; pgi.style.transition = 'none'; pgi.style.width = S._pp.pct; void pgi.offsetWidth; pgi.style.transition = ''; requestAnimationFrame(function(){ pgi.style.width = to; }); }
    if(pst) pst.classList.add('demo');
  }
  S._pp = {fid:f.id, pi:S.pi, pct:pgi ? pgi.style.width : null};
  if(window.__ldStop){ window.__ldStop(); window.__ldStop = null; }
  if(scr.querySelector('[data-ld]')) window.__ldStop = FP.playLoaders(scr, f);
}
function placeTool(el){
  var scr = $('#scr'); if(!scr) return;
  var old = $('#btool'); if(old) old.remove();
  var b = selBlock(); if(!b) return;
  var tb = document.createElement('div'); tb.className = 'btool'; tb.id = 'btool';
  tb.innerHTML = '<span class="tl">'+esc(BNAME[b.type]||b.type)+'</span><button data-a="bup" title="Nach oben">'+I('chevUp')+'</button><button data-a="bdown" title="Nach unten">'+I('chevDown')+'</button><button data-a="bdup" title="Duplizieren (⌘D)">'+I('dup')+'</button><button data-a="bcopy" title="Kopieren (⌘C)">'+I('copy')+'</button><button data-a="fmtPaint" title="Format übertragen (⌥⌘C / ⌥⌘V)">'+I('brush')+'</button>'+(CLIP ? '<button data-a="bpaste" title="Kopiertes Element darunter einfügen (⌘V)">'+I('paste')+'</button>' : '')+'<button data-a="bdel" title="Löschen">'+I('trash')+'</button>';
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
  if(S.rtab === 'design') fillLogoColors();
}
function pageOptions(sel, emptyLabel){ var f = F(); return '<option value="">'+esc(emptyLabel||'– Standard –')+'</option>' + f.pages.map(function(p, i){ return '<option value="'+p.id+'"'+(p.id===sel?' selected':'')+'>'+(i+1)+'. '+esc(p.name)+'</option>'; }).join(''); }
var VARK = ['text','label','question','desc','sub','quote','title','note','placeholder'];
function varMenu(btn){
  var fld = btn.closest('.fld'), inp = fld && fld.querySelector('input.inp,textarea.inp'); if(!inp) return;
  var vars = FP.vars(F()), ic = {input:'cursor', choice:'choice', slider:'sliders', rating:'star', calendar:'calendar', calc:'euro'};
  var items = vars.map(function(v){ return {k:v.key, ic:ic[v.type]||'tag', l:v.label+'  ·  {{'+v.key+'}}', fn:function(){ insertVar(inp, v.key); }}; });
  if(!items.length) items = [{k:'none', ic:'info', l:'Noch keine Eingabefelder im Funnel', fn:function(){}}];
  dropdown(btn, items);
}
function insertVar(inp, key){
  var tok = '{{'+key+'}}', st = inp.selectionStart != null ? inp.selectionStart : inp.value.length, en = inp.selectionEnd != null ? inp.selectionEnd : st;
  var before = inp.value.slice(0, st), after = inp.value.slice(en);
  if(before && !/[\s(„"]$/.test(before)) tok = ' ' + tok;
  inp.value = before + tok + after; inp.focus(); var pos = (before + tok).length; inp.setSelectionRange(pos, pos);
  inp.dispatchEvent(new Event('input', {bubbles:true}));
}
function field(spec, p, scope){
  var k = spec[0], type = spec[1], label = spec[2], extra = spec[3], show = spec[4];
  if(show && !show(p)) return '';
  if(type === 'row') return '<div class="'+(label.length===3?'row3':'row2')+'">' + label.map(function(s){ return field(s, p, scope); }).join('') + '</div>';
  var v = p[k], a = 'data-'+scope+'="'+k+'"', hint = (typeof extra === 'string') ? '<div class="hint">'+esc(extra)+'</div>' : '';
  var ov = scope === 'p' && k && k.charAt(0) !== '_' && type !== 'pad4' && setVal(v) && (DESIGN_K[k] || STYLE_KEYS.indexOf(k) >= 0), ovb = ov ? '<button type="button" class="ovr" data-a="clearProp" data-scope="p" data-k="'+k+'" title="Für dieses Element geändert – zurück zum Theme" aria-label="Zurücksetzen"></button>' : '';
  var w = function(inner, noLabel){ return '<div class="fld'+(ov?' is-ov':'')+'">'+(noLabel?'':'<label>'+esc(label)+ovb+'</label>')+inner+hint+'</div>'; };
  var wv = function(inner){ return '<div class="fld"><div class="flh"><label>'+esc(label)+'</label><button class="varbtn" data-a="insVar" title="Eingabe des Besuchers einfügen, z. B. seinen Vornamen">'+I('user',12)+'Variable</button></div>'+inner+hint+'</div>'; };
  switch(type){
    case 'text': return VARK.indexOf(k) >= 0 && scope === 'p' ? wv('<input class="inp" '+a+' value="'+esc(v)+'">') : w('<input class="inp" '+a+' value="'+esc(v)+'">');
    case 'textarea': return VARK.indexOf(k) >= 0 && scope === 'p' ? wv('<textarea class="inp" '+a+' rows="3">'+esc(v)+'</textarea>') : w('<textarea class="inp" '+a+' rows="3">'+esc(v)+'</textarea>');
    case 'code': return w('<textarea class="inp" '+a+' rows="6" style="font-family:ui-monospace,monospace;font-size:var(--fs-12)">'+esc(v)+'</textarea>');
    case 'num': return w('<input class="inp" type="number" '+a+' data-num value="'+(v==null?'':esc(v))+'" step="any">');
    case 'lh': var lhd = b0lh(p); return w('<input class="inp" type="number" '+a+' data-num value="'+(v==null?'':esc(v))+'" step="0.05" min="0.8" max="3" placeholder="'+lhd+'">');
    case 'note': return '<div class="hint" style="margin:-2px 0 12px">'+esc(label)+'</div>';
    case 'lottie': return w('<div class="upl">'+(v ? '<span class="pill">Eigene Datei geladen</span>' : '')+'<label class="btn sm">'+I('upload',13)+(v ? 'Ersetzen' : 'Lottie-Datei (.json)')+'<input type="file" accept=".json,application/json" data-lottie="'+k+'"></label>'+(v ? '<button class="ibtn" data-a="clearProp" data-scope="'+scope+'" data-k="'+k+'" title="Entfernen">'+I('trash')+'</button>' : '')+'</div>');
    case 'imgstrings': return w((v||[]).map(function(x, i){ var isImg = /^(https?:|data:|\/)/.test(x); return '<div class="strl">'+(isImg ? '<span class="sthumb" style="background-image:url(&quot;'+esc(x)+'&quot;)"></span><input class="inp" value="'+(/^data:/.test(x) ? 'Hochgeladenes Bild' : esc(x))+'" disabled>' : '<input class="inp" data-arr="'+k+'" data-ai="'+i+'" value="'+esc(x)+'">')+'<button class="ibtn" data-a="arrDel" data-k="'+k+'" data-i="'+i+'" title="Entfernen">'+I('x')+'</button></div>'; }).join('')
      + '<div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-a="arrAdd" data-k="'+k+'">'+I('plus',13)+'Text</button><label class="btn sm">'+I('upload',13)+'Bild hochladen<input type="file" accept="image/*" data-arrimg="'+k+'"></label>'+libraryButton()+'</div>');
    case 'pad4':
      var pk = extra.keys, pph = typeof extra.ph === 'function' ? extra.ph(p) : (extra.ph || [0,0,0,0]), pnames = ['Oben','Rechts','Unten','Links'];
      var pset = pk.some(function(x){ return p[x] !== undefined && p[x] !== ''; });
      return '<div class="fld"><div class="flh"><label>'+esc(label)+'</label><button class="varbtn" data-a="padLink" data-scope="'+scope+'" data-keys="'+pk.join(',')+'" data-mode="'+(pset?'reset':'all')+'" title="'+(pset?'Alle Seiten zurücksetzen':'Oben auf alle Seiten übernehmen')+'">'+(pset?I('x',12)+'Zurücksetzen':I('link',12)+'Alle gleich')+'</button></div><div class="pad4">'
        + pk.map(function(x, i){ var pv = p[x]; return '<label><input class="inp" type="number" min="0" max="120" inputmode="numeric" data-'+scope+'="'+x+'" data-num value="'+(pv==null?'':esc(pv))+'" placeholder="'+esc(pph[i])+'" aria-label="'+esc(label)+' '+pnames[i]+'"><span>'+pnames[i]+'</span></label>'; }).join('')
        + '</div>'+(extra.hint?'<div class="hint">'+esc(extra.hint)+'</div>':'')+'</div>';
    case 'range': var un = extra[3] != null ? extra[3] : (k==='stars'||k==='max'?'':'px'), rdef = extra[4] == null ? extra[0] : (typeof extra[4] === 'function' ? extra[4]() : extra[4]); return w('<div class="rng"><input type="range" '+a+' data-num data-unit="'+un+'" min="'+extra[0]+'" max="'+extra[1]+'" step="'+extra[2]+'" value="'+(v==null||v===''?rdef:v)+'"><span>'+(v==null||v===''?rdef:v)+un+'</span></div>');
    case 'font': return w(fontSelect(scope, k, v || '', true));
    case 'select': return w('<select class="inp" '+a+' data-rp>'+extra.map(function(o){ return '<option value="'+o[0]+'"'+(String(v)===String(o[0])?' selected':'')+'>'+esc(o[1])+'</option>'; }).join('')+'</select>');
    case 'seg': return w('<div class="segf">'+extra.map(function(o){ return '<button data-a="seg" data-scope="'+scope+'" data-k="'+k+'" data-v="'+esc(o[0])+'" data-t="'+(typeof o[0])+'" class="'+(String(v==null?'':v)===String(o[0])?'on':'')+'">'+esc(o[1])+'</button>'; }).join('')+'</div>');
    case 'sec': return '<div class="flab fsec">'+esc(label)+'</div>';
    case 'color': return w('<div style="display:flex;gap:6px">'+colorField(scope, k, v||'')+(v?'<button class="ibtn" data-a="clearProp" data-scope="'+scope+'" data-k="'+k+'" title="Zurücksetzen">'+I('x')+'</button>':'')+'</div>');
    case 'toggle': var inv = spec[5] === true; return '<label class="tgl"><span>'+esc(label)+'</span><input type="checkbox" '+a+' data-bool data-rp'+(inv ? ' data-inv' : '')+((inv ? v !== false : v)?' checked':'')+'><span class="sw"></span></label>'+(hint?'<div style="margin:-6px 0 12px">'+hint+'</div>':'');
    case 'image': return w('<div class="upl"><div class="pv" style="'+(v?'background-image:url(&quot;'+esc(v)+'&quot;)':'')+'">'+(v?'':I('image'))+'</div><label class="btn sm">'+I('upload',13)+(v?'Ersetzen':'Hochladen')+'<input type="file" accept="image/*" data-img="'+k+'" data-scope="'+scope+'"></label>'+libraryButton()+(v?'<button class="ibtn" data-a="clearProp" data-scope="'+scope+'" data-k="'+k+'" title="Entfernen">'+I('trash')+'</button>':'')+'</div>');
    case 'key': return '<div class="fld"><label>'+esc(label)+'</label><input class="inp" '+a+' value="'+esc(v)+'" placeholder="automatisch" style="font-family:ui-monospace,monospace;font-size:var(--fs-12)"><div class="hint">Für Variablen ({{'+esc(v||'schluessel')+'}}), Webhook &amp; Export.</div></div>';
    case 'page': return w('<select class="inp" '+a+'>'+pageOptions(v, 'Nächste Seite (Standard)')+'</select>');
    case 'strings': return w((v||[]).map(function(s, i){ return '<div class="strl"><input class="inp" data-arr="'+k+'" data-ai="'+i+'" value="'+esc(s)+'"><button class="ibtn" data-a="arrDel" data-k="'+k+'" data-i="'+i+'">'+I('x')+'</button></div>'; }).join('') + '<button class="btn sm" data-a="arrAdd" data-k="'+k+'">'+I('plus',13)+'Hinzufügen</button>');
    case 'faq': return w((v||[]).map(function(it, i){ return '<div class="oped open" style="padding:8px"><div style="display:flex;gap:6px;margin-bottom:6px"><input class="inp" data-faq="'+i+'" data-fk="q" value="'+esc(it.q)+'" placeholder="Frage"><button class="ibtn" data-a="faqDel" data-i="'+i+'">'+I('x')+'</button></div><textarea class="inp" data-faq="'+i+'" data-fk="a" rows="2" placeholder="Antwort">'+esc(it.a)+'</textarea></div>'; }).join('') + '<button class="btn sm" data-a="faqAdd">'+I('plus',13)+'Frage hinzufügen</button>');
    case 'days': var wd = [[1,'Mo'],[2,'Di'],[3,'Mi'],[4,'Do'],[5,'Fr'],[6,'Sa'],[0,'So']]; return w('<div class="segf">'+wd.map(function(d){ return '<button data-a="dayTgl" data-v="'+d[0]+'" class="'+((v||[]).indexOf(d[0])>=0?'on':'')+'">'+d[1]+'</button>'; }).join('')+'</div>');
    case 'options': return w(optionsEditor(p));
    case 'emojis': var em = FP.emojiList(p); return w('<input class="inp emoji-in" '+a+' value="'+esc(v||'')+'" placeholder="'+esc(em.join(' '))+'"><div class="emo-pre">'+['😥 🙁 😐 🙂 😀','👎 👍','😡 😕 😐 😊 😍','🐒 🦁 🐘','⭐ ⭐⭐ ⭐⭐⭐'].map(function(x){ return '<button data-a="emoSet" data-v="'+esc(x)+'">'+esc(x)+'</button>'; }).join('')+'</div><div class="hint">Emojis mit Leerzeichen trennen – jedes steht für eine Stufe (links = schlechteste). Leer lassen für den Standard-Satz.</div>');
    case 'routes': var mxr = FP.rateMax(p); return w((v||[]).map(function(r, i){ return '<div class="strl" style="align-items:center"><span class="hint" style="margin:0">von</span><input class="inp" type="number" min="1" max="'+mxr+'" style="width:52px" data-rr="'+i+'" data-rk="min" value="'+r.min+'"><span class="hint" style="margin:0">bis</span><input class="inp" type="number" min="1" max="'+mxr+'" style="width:52px" data-rr="'+i+'" data-rk="max" value="'+r.max+'"><select class="inp" data-rr="'+i+'" data-rk="goto" style="flex:1;min-width:0">'+pageOptions(r.goto,'Seite wählen …')+'</select><button class="ibtn" data-a="rrDel" data-i="'+i+'">'+I('x')+'</button></div>'; }).join('') + '<button class="btn sm" data-a="rrAdd">'+I('plus',13)+'Regel hinzufügen</button><div class="hint">Z. B. 1–3 → Seite „Problem“, 4–'+mxr+' → „Das freut uns“. Ohne passende Regel geht es zur nächsten Seite.</div>');
  }
  return '';
}
function optionsEditor(p){
  var openSet = S.openOpts || {};
  return (p.options||[]).map(function(o, i){
    return '<div class="oped'+(openSet[o.id]?' open':'')+'"><div class="oh"><input class="em" data-o="icon" data-oi="'+i+'" value="'+esc(o.icon||'')+'" placeholder="😀" title="Emoji"><input class="ol" data-o="label" data-oi="'+i+'" value="'+esc(o.label)+'">'
      + (o.goto?'<span title="Springt zu Seite" style="color:var(--a)">'+I('branch',13)+'</span>':'')
      + ((+o.price||+o.unitPrice)?'<span class="opr" title="'+(p.showPrices?'Preis wird angezeigt':'Preis nur intern')+'">'+(+o.price?'+'+FP.money(o.price,(F().settings||{}).currency):FP.money(o.unitPrice,(F().settings||{}).currency)+'/'+(o.unitLabel||'Einh.'))+(p.showPrices?'':' '+I('eye',11))+'</span>':'')
      + '<button class="ibtn" data-a="optToggle" data-oid="'+o.id+'" title="Details, Preis & Logik">'+I('settings')+'</button><button class="ibtn" data-a="optMove" data-i="'+i+'" data-d="-1" title="Nach oben">'+I('chevUp')+'</button><button class="ibtn" data-a="optDel" data-i="'+i+'" title="Entfernen">'+I('x')+'</button></div>'
      + '<div class="ob"><div class="fld"><label>Untertitel</label><input class="inp" data-o="sub" data-oi="'+i+'" value="'+esc(o.sub||'')+'"></div>'
      + '<div class="row2"><div class="fld"><label>Festpreis (+)</label><input class="inp" type="number" data-o="price" data-oi="'+i+'" data-num value="'+(o.price||'')+'" placeholder="0"></div><div class="fld"><label>Preis pro Einheit</label><input class="inp" type="number" data-o="unitPrice" data-oi="'+i+'" data-num value="'+(o.unitPrice||'')+'" placeholder="0"></div></div>'
      + '<div class="row2"><div class="fld"><label>Einheit (Anzeige)</label><input class="inp" data-o="unitLabel" data-oi="'+i+'" value="'+esc(o.unitLabel||'')+'" placeholder="m²"></div><div class="fld"><label>Punkte (Quiz)</label><input class="inp" type="number" data-o="score" data-oi="'+i+'" data-num value="'+(o.score||'')+'" placeholder="0"></div></div>'
      + (openSet[o.id] ? '<div class="fld"><label>Icon</label><div class="icgrid">' + [''].concat(Object.keys(FP.ICONS)).map(function(nm){ return '<button class="icb'+((o.ic||'')===nm?' on':'')+'" data-a="optIc" data-i="'+i+'" data-v="'+nm+'" title="'+(nm||'Kein Icon')+'" aria-label="'+(nm||'Kein Icon')+'">'+(nm ? FP.ICONS[nm] : I('x',12))+'</button>'; }).join('') + '</div><div class="hint">Ersetzt das Emoji. Die Farbe kommt aus dem Theme.</div></div>' : '')
      + '<div class="fld"><label>Bei Auswahl springen zu</label><select class="inp" data-o="goto" data-oi="'+i+'">'+pageOptions(o.goto,'Keine Verzweigung')+'</select></div>'
      + ((p.layout==='image'||p.layout==='cover')&&o.img?'<div class="fld"><label>Bildausschnitt</label><select class="inp" data-o="pos" data-oi="'+i+'">'+[['','Mitte'],['top','Oben'],['bottom','Unten'],['left','Links'],['right','Rechts']].map(function(x){ return '<option value="'+x[0]+'"'+((o.pos||'')===x[0]?' selected':'')+'>'+x[1]+'</option>'; }).join('')+'</select></div>':'')
      + (p.layout==='chips'?'<div class="row3">'+[['col','Farbe'],['cbg','Hintergrund'],['ctx','Text']].map(function(x){ return '<div class="fld"><label>'+x[1]+'</label><div class="colr"><input type="color" data-o="'+x[0]+'" data-oi="'+i+'" value="'+esc(toHex(o[x[0]]||'#7c3aed'))+'"><input type="text" data-o="'+x[0]+'" data-oi="'+i+'" value="'+esc(o[x[0]]||'')+'" placeholder="Theme"></div></div>'; }).join('')+'</div><div class="hint" style="margin:-4px 0 10px">„Farbe“ färbt Icon und Text und ergibt einen hellen Hintergrund. Hintergrund und Text überschreiben das einzeln.</div>':'')
      + ((p.layout==='image'||p.layout==='cover')?'<div class="fld"><label>Bild</label><div class="upl"><div class="pv" style="'+(o.img?'background-image:url(&quot;'+esc(o.img)+'&quot;)':'')+'">'+(o.img?'':I('image'))+'</div><label class="btn sm">'+I('upload',13)+'Hochladen<input type="file" accept="image/*" data-optimg="'+i+'"></label>'+libraryButton()+(o.img?'<button class="ibtn" data-a="optImgDel" data-i="'+i+'">'+I('trash')+'</button>':'')+'</div></div>':'')
      + '</div></div>';
  }).join('') + '<button class="btn sm" data-a="optAdd">'+I('plus',13)+'Antwort hinzufügen</button>';
}
/* ================= Element-Panel: Inhalt · Design · Mehr =================
   Inhalt = was drinsteht. Design = wie es aussieht (aufklappbare Abschnitte, jeder Regler nur einmal).
   Mehr = Verhalten, Sichtbarkeit, Feld-Schlüssel. Leere Werte kommen aus dem Theme, geänderte zeigen einen Punkt mit Zurücksetzen. */
var DESIGN_K = {};
('hl level size lh variant upper bleed ratio height radius fit edgeTop edgeTopH edgeTopFlip edgeBot edgeBotH edgeBotFlip icon iconLeft btnBg btnColor btnBw btnBc bSize icColor full bpad shadow pulse radiusOn '
 + 'faceStyle faceNoText faceBare faceEnds cols colsD optAlign optFw optSubFw zoom coverFade coverAlign coverFadeS coverTx coverSize coverRad chipStyle chipArr chipIcon chipGrad chipRad chipSize '
 + 'calStyle calAcc calAccText calShape calDays calDayShadow calSelShadow slotStyle slotCols calCard calBg calText calRadius bxStyle chip labels gray speed acolor hand flip rotate textSide showBar showValue').split(' ').forEach(function(k){ DESIGN_K[k] = 1; });
var DESIGN_T = {social:{size:1}, arrow:{size:1, style:1, anim:1}, loader:{size:1, anim:1}};
var ACC = (function(){ try{ return JSON.parse(localStorage.getItem('tt-acc') || '{}'); }catch(e){ return {}; } })();
function isDesignKey(k, type){ return !!(DESIGN_K[k] || (DESIGN_T[type] && DESIGN_T[type][k]) || STYLE_KEYS.indexOf(k) >= 0 || k === 'align' || k === 'half' || k === 'mt' || k === 'mb'); }
function specKeys(sp){ if(!sp) return []; if(sp[1] === 'row') return sp[2].map(function(x){ return x[0]; }); if(sp[1] === 'pad4') return (sp[3] && sp[3].keys) || []; return [sp[0]]; }
function setVal(v){ return v !== undefined && v !== null && v !== ''; }
function overrides(list, p){ var n = 0; list.forEach(function(sp){ specKeys(sp).forEach(function(k){ if(k.charAt(0) !== '_' && setVal(p[k])) n++; }); }); return n; }
function splitFields(list, type){
  var out = {c:[], d:[], a:[]}, last = 'c', kOf = function(sp){ return sp[1] === 'row' ? sp[2][0][0] : sp[0]; };
  list.forEach(function(sp, i){
    var g;
    if(sp[1] === 'sec'){ var nx = list[i + 1]; g = nx && isDesignKey(kOf(nx), type) ? 'd' : 'c'; }
    else if(sp[1] === 'note') g = last;
    else { var k = kOf(sp); g = k === 'key' ? 'a' : (DESIGN_K[k] || (DESIGN_T[type] && DESIGN_T[type][k])) ? 'd' : 'c'; }
    out[g].push(sp); last = g;
  });
  return out;
}
function accSec(id, title, inner, n, defOpen){
  if(!inner) return '';
  var open = ACC[id] != null ? ACC[id] : !!defOpen;
  return '<section class="acc'+(open ? ' open' : '')+'" data-acc="'+id+'"><button type="button" class="acch" data-a="accT" data-id="'+id+'" aria-expanded="'+open+'"><span class="acct">'+title+'</span>'+(n ? '<span class="accn" title="'+n+' Wert'+(n > 1 ? 'e' : '')+' für dieses Element geändert">'+n+'</span>' : '')+I('chevDown',14)+'</button><div class="accb"><div class="acci">'+inner+'</div></div></section>';
}
function panelElement(b){
  if(!b) return '<div class="emptyp"><div class="ic">'+I('pointer',20)+'</div>Wähle ein Element auf dem Handy aus, um es zu bearbeiten.</div>';
  var p = b.props, tab = S.etab || 'c', fs = splitFields(FIELDS[b.type] || [], b.type), F_ = function(list, vals){ return list.map(function(sp){ return field(sp, vals || p, 'p'); }).join(''); };
  var h = '<div class="bhead"><span class="lic">'+I(BICON[b.type]||'grid')+'</span><div><b>'+esc(BNAME[b.type]||b.type)+'</b><small>Seite '+(S.pi+1)+' · '+esc(curPage().name)+'</small></div><span style="flex:1"></span><button class="ibtn" data-a="bdup" title="Duplizieren (⌘D)">'+I('dup')+'</button><button class="ibtn" data-a="bcopy" title="Kopieren (⌘C)">'+I('copy')+'</button><button class="ibtn" data-a="bdel" title="Löschen">'+I('trash')+'</button></div>';
  var tabs = [['c','Inhalt'],['d','Design'],['a','Mehr']];
  h += '<div class="etabs" role="tablist" style="--i:'+tabs.map(function(t){ return t[0]; }).indexOf(tab)+'">'+tabs.map(function(t){ return '<button role="tab" aria-selected="'+(tab===t[0])+'" class="'+(tab===t[0]?'on':'')+'" data-a="etab" data-v="'+t[0]+'">'+t[1]+'</button>'; }).join('')+'<i class="etab-ind" aria-hidden="true"></i></div>';
  if(tab === 'c'){
    h += '<div class="epane">' + (fs.c.length ? F_(fs.c) : '<p class="hint">Dieses Element hat keinen eigenen Inhalt. Aussehen und Verhalten findest du unter „Design“ und „Mehr“.</p>');
    if(b.type === 'choice' || b.type === 'button') h += '<div class="einfo">'+I('branch',13)+'<span>'+(b.type==='choice'?'Verzweigung, Preis und Punkte stellst du pro Antwort über '+I('settings',11)+' ein.':'„Absenden“ speichert die Anfrage und leitet zur Zielseite weiter.')+'</span></div>';
    return h + '</div>';
  }
  if(tab === 'd'){
    var txt = b.type === 'heading' || b.type === 'text', chipsOrCover = b.type === 'choice' && (p.layout === 'chips' || p.layout === 'cover');
    var typo = STYLE_TYPO.filter(function(sp){ return !((txt || b.type === 'button') && sp[0] === 'scale'); }).map(function(sp){ return txt && sp[0] === 'row2' && sp[2][0][0] === 'lh' ? ['ls','num','Laufweite'] : sp; });
    var inner = STYLE_INNER.filter(function(sp){ return sp && !(sp[0] === 'row2' && sp[2][0][0] === 'iSurf' && !SURF_T[b.type]); }).map(function(sp){ return chipsOrCover && sp[0] === 'row2' && sp[2][0][0] === 'iRad' ? ['iGap','num','Abstand zwischen den Antworten (px)'] : sp; }).concat(STYLE_EXTRA[b.type] || []);
    var place = [['align','seg','Ausrichtung',[['left','Links'],['center','Mitte'],['right','Rechts']]],['half','toggle','Halbe Breite (2 Elemente nebeneinander)'],['row2','row',[['mt','num','Abstand oben'],['mb','num','Abstand unten']]]];
    var boxOn = setVal(p.bgc) || +p.bwid > 0 || setVal(p.shd);
    var boxMain = [STYLE_BOX[0], STYLE_BOX[3], STYLE_BOX[4]], boxDep = [STYLE_BOX[1], STYLE_BOX[2]];
    var dv = Object.assign({}, p, {scale: p.scale || 100, pad: p.pad || 0, brad: p.brad == null || p.brad === '' ? 0 : p.brad});
    h += '<div class="epane"><div class="ethm">'+I('palette',13)+'<span>Leer = aus dem Theme. Geänderte Werte haben einen Punkt – ein Klick setzt sie zurück.</span><button class="lnk" data-a="rtab" data-v="design">Theme</button></div>';
    h += accSec('el-'+b.type, esc(BNAME[b.type]||'Element'), F_(fs.d), overrides(fs.d, p), true);
    h += accSec('place', 'Anordnung & Abstände', F_(place), overrides(place, p), false);
    if(TEXTY[b.type]) h += accSec('typo', 'Schrift', F_(typo, dv), overrides(typo, p), false);
    if(INNER_T[b.type]) h += accSec('inner', b.type === 'choice' ? 'Antworten: Farben & Flächen' : 'Farben & Flächen', F_(inner), overrides(inner, p), false);
    if(b.type !== 'button' && b.type !== 'box') h += accSec('box', 'Hintergrund & Rahmen', F_(boxMain, dv) + '<div class="dimw'+(boxOn ? '' : ' dim')+'">'+F_(boxDep, dv)+(boxOn ? '' : '<div class="hint" style="margin:-4px 0 4px">Ecken und Innenabstand wirken, sobald Hintergrund, Rahmen oder Schatten gesetzt ist.</div>')+'</div>', overrides(STYLE_BOX, p), false);
    if(b.type === 'box') h += accSec('box', 'Hintergrund, Rahmen & Schatten', F_(STYLE_BOX, dv), overrides(STYLE_BOX, p), true);
    return h + '</div>';
  }
  var hasStyle = STYLE_KEYS.some(function(k){ return setVal(p[k]) && p[k] !== false && !(k==='anim' && p[k]==='none') && !(k==='vis' && p[k]==='all') && !(k==='scale' && +p[k]===100); });
  var fx = Object.assign({}, p, {delay: p.delay || 0, anim: p.anim || 'none', vis: p.vis || 'all'});
  h += '<div class="epane">';
  h += accSec('fx', 'Einblenden & Sichtbarkeit', STYLE_FX.map(function(sp){ return field(sp, fx, 'p'); }).join(''), 0, true);
  if(fs.a.length) h += accSec('adv', 'Daten', F_(fs.a), 0, true);
  h += accSec('fmt', 'Format', '<div class="fmtbar"><button class="btn sm" data-a="fmtCopy">'+I('brush',13)+'Kopieren</button><button class="btn sm" data-a="fmtPaste"'+(FCLIP ? ' title="Format von „'+esc(BNAME[FCLIP.type]||FCLIP.type)+'“ übertragen"' : ' disabled')+'>'+I('paste',13)+'Einfügen</button></div>' + (hasStyle ? '<button class="btn sm ghost" data-a="styleReset" style="width:100%;justify-content:center;margin-top:8px">'+I('undo',13)+'Gesamte Gestaltung zurücksetzen</button>' : ''), 0, true);
  return h + '</div>';
}
/* Kartenstil: Auswahl mit kleiner Vorschau (zwei Kacheln, die rechte ist gewählt) */
var OPT_STYLES = [['filled','Gefüllt'],['outline','Rahmen'],['shadow','Karte'],['glass','Glas'],['soft','Soft UI']];
function optStylePicker(v){
  return '<div class="fld"><label>Karten & Auswahl</label><div class="ostyles" role="radiogroup" aria-label="Kartenstil">'
    + OPT_STYLES.map(function(o){ return '<button class="osw'+(v===o[0]?' on':'')+'" role="radio" aria-checked="'+(v===o[0])+'" data-a="seg" data-scope="t" data-k="optStyle" data-v="'+o[0]+'" data-t="string"><span class="osp os-'+o[0]+'"><i></i><i class="sel"></i></span><span class="osl">'+o[1]+'</span></button>'; }).join('')
    + '</div><div class="hint">Gilt für Antworten, Smileys, Bildkacheln, NPS, Termine und Checkboxen.'+(v==='soft'?' Wirkt am stärksten auf hellgrauem Hintergrund.':v==='glass'?' Wirkt am stärksten über Farbe oder einem Hintergrundbild.':'')+'</div></div>';
}
function panelPage(){
  var f = F(), pg = curPage();
  var h = '<div class="psec"><h5>Seite '+(S.pi+1)+' von '+f.pages.length+'</h5>'
    + '<div class="fld"><label>Name</label><input class="inp" data-pp="name" value="'+esc(pg.name)+'"></div>'
    + (f.theme.split ? field(['splitImg','image','Bild am Rechner (nur diese Seite)'], pg, 'pp') : '')
    + '<label class="tgl"><span>Breites Layout auf Desktop</span><input type="checkbox" data-pp="wide" data-bool'+(pg.wide?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Inhalt vertikal zentrieren</span><input type="checkbox" data-pp="vcenter" data-bool'+(pg.vcenter?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Fortschrittsbalken ausblenden</span><input type="checkbox" data-pp="hideProgress" data-bool'+(pg.hideProgress?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Logo ausblenden</span><input type="checkbox" data-pp="hideLogo" data-bool'+(pg.hideLogo?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Konfetti nach erfolgreicher Anfrage</span><input type="checkbox" data-pp="confetti" data-bool'+(pg.confetti?' checked':'')+'><span class="sw"></span></label>'+(pg.confetti?'<div class="hint" style="margin:-6px 0 12px">Fällt von oben, wenn diese Seite nach dem Absenden erscheint – z. B. auf der Danke-Seite.</div>':'')
    + '<label class="tgl"><span>Lead beim Öffnen speichern</span><input type="checkbox" data-pp="submitOnEnter" data-bool'+(pg.submitOnEnter?' checked':'')+'><span class="sw"></span></label>'
    + '<label class="tgl"><span>Zurück-Button erlauben</span><input type="checkbox" data-pp="allowBack" data-bool data-inv'+(pg.allowBack===false?'':' checked')+'><span class="sw"></span></label>'
    + (FP.hasButton(pg) || S.pi === f.pages.length-1 ? '' : '<label class="tgl"><span>Automatischer Weiter-Button</span><input type="checkbox" data-pp="autoButton" data-bool data-inv data-rp'+(pg.autoButton===false?'':' checked')+'><span class="sw"></span></label>' + (pg.autoButton===false?'':'<div class="fld"><label>Button-Text</label><input class="inp" data-pp="buttonLabel" value="'+esc(pg.buttonLabel||'')+'" placeholder="'+esc(f.theme.nextLabel||'Weiter')+'"></div>'))
    + '</div>';
  var lgN = (pg.logic||[]).filter(function(r){ return r.goto; }).length;
  h += '<div class="psec"><h5>'+I('branch',13)+'Weiterleitung</h5><button class="btn sm" data-a="flow" style="width:100%;justify-content:center;margin-bottom:10px">'+I('branch',13)+(lgN ? 'Logik bearbeiten ('+lgN+(lgN===1?' Regel':' Regeln')+')' : 'Logik-Builder öffnen')+'</button><div class="fld"><label>Nach dieser Seite</label><select class="inp" data-pp="next">'+pageOptions(pg.next,'Nächste Seite (Standard)')+'</select><div class="hint">Regeln aus dem Logik-Builder und Antwort-Verzweigungen haben Vorrang.</div></div>'
    + '<div class="flab">Weiterleitung nach Punktzahl (Quiz)</div>' + (pg.scoreRoutes||[]).map(function(r, i){ return '<div class="strl" style="align-items:center"><input class="inp" type="number" style="width:58px" data-sr="'+i+'" data-sk="min" value="'+r.min+'" title="von"><span style="color:var(--mut)">–</span><input class="inp" type="number" style="width:58px" data-sr="'+i+'" data-sk="max" value="'+r.max+'" title="bis"><select class="inp" data-sr="'+i+'" data-sk="goto">'+pageOptions(r.goto,'Seite wählen')+'</select><button class="ibtn" data-a="srDel" data-i="'+i+'">'+I('x')+'</button></div>'; }).join('')
    + '<button class="btn sm" data-a="srAdd">'+I('plus',13)+'Regel hinzufügen</button><div class="hint">Summe der Punkte aller gewählten Antworten.</div></div>';
  h += '<div class="psec"><h5>Hintergrund</h5><div class="fld"><label>Hintergrundfarbe (nur diese Seite)</label><div style="display:flex;gap:6px">'+colorField('pp','bg',pg.bg||'')+(pg.bg?'<button class="ibtn" data-a="clearProp" data-scope="pp" data-k="bg">'+I('x')+'</button>':'')+'</div></div>'
    + field(['bgImage','image','Hintergrundbild (nur diese Seite)'], pg, 'pp') + '</div>';
  if(CLIP) h += '<div class="psec"><button class="btn sm" data-a="bpaste" style="width:100%;justify-content:center">'+I('paste',13)+esc(BNAME[CLIP.type]||'Element')+' hier einfügen</button></div>';
  h += '<div class="psec" style="display:flex;gap:8px"><button class="btn sm" data-a="pdup" data-i="'+S.pi+'">'+I('dup',13)+'Duplizieren</button><button class="btn sm danger" data-a="pdel" data-i="'+S.pi+'"'+(f.pages.length<2?' disabled':'')+'>'+I('trash',13)+'Löschen</button></div>';
  return h;
}
var SP_KEYS = ['spTop','spHead','spContent','spBlock','spBottom'];  /* Seitenrand (pad) gehört zum Theme und bleibt beim Zurücksetzen */
/* Stil-Pakete: Form, Schrift und Kartenstil – die Markenfarben (primary, Text) bleiben */
var STYLE_PACKS = {
  minimal:  {n:'Minimal',   d:'Inter, kleine Schrift, weiße Karten mit weichem Schatten', t:{font:'Inter', headingFont:'Inter', headingWeight:650, headingLs:-2, scale:92, lineHeight:1.5, radius:12, btnRadius:12, btnPad:15, btnPadX:22, btnWeight:600, optStyle:'shadow', inputStyle:'outline', progress:'bar', progressTop:true}},
  editorial:{n:'Editorial', d:'Serifen-Überschriften, feine Linien, viel Ruhe', t:{font:'DM Sans', headingFont:'Fraunces', headingWeight:500, headingLs:-1, scale:96, lineHeight:1.6, radius:6, btnRadius:40, btnPad:15, btnPadX:26, btnWeight:500, optStyle:'outline', inputStyle:'line', progress:'bar', progressTop:false}},
  bold:     {n:'Kräftig',   d:'Fette Überschriften, große Buttons, gefüllte Karten', t:{font:'Plus Jakarta Sans', headingFont:'Plus Jakarta Sans', headingWeight:800, headingLs:-3, scale:100, lineHeight:1.5, radius:18, btnRadius:16, btnPad:18, btnPadX:24, btnWeight:700, optStyle:'filled', inputStyle:'filled', progress:'bar', progressTop:true}},
  soft:     {n:'Soft',      d:'Soft UI auf hellgrauem Grund, runde Formen', t:{font:'Manrope', headingFont:'Manrope', headingWeight:700, headingLs:-2, scale:94, lineHeight:1.55, radius:20, btnRadius:40, btnPad:16, btnPadX:24, btnWeight:650, optStyle:'soft', inputStyle:'filled', progress:'bar', progressTop:true, bg:'#eef0f3', surface:'#e4e7ec', bgGrad:false}},
  glass:    {n:'Glas',      d:'Milchglas-Karten über einem Verlauf in deiner Farbe', t:{font:'Inter', headingFont:'Inter', headingWeight:700, headingLs:-2, scale:94, lineHeight:1.5, radius:16, btnRadius:14, btnPad:16, btnPadX:22, btnWeight:600, optStyle:'glass', inputStyle:'outline', progress:'bar', progressTop:true, bg:'#ffffff', bgGrad:true, bgAngle:160}}
};
function hexMix(a, b, w){ var pa = toHex(a).slice(1), pb = toHex(b).slice(1); var c = function(h, i){ return parseInt(h.substr(i, 2), 16) || 0; }; var o = '#'; for(var i = 0; i < 6; i += 2) o += ('0' + Math.round(c(pa, i) * w + c(pb, i) * (1 - w)).toString(16)).slice(-2); return o; }
function packOn(t){ var hit = ''; Object.keys(STYLE_PACKS).forEach(function(k){ var pt = STYLE_PACKS[k].t; if(!hit && ['headingFont','font','optStyle','radius','btnRadius'].every(function(x){ return String(t[x]) === String(pt[x]); })) hit = k; }); return hit; }
/* Hell/dunkel für Text auf einer Farbe (WCAG-Luminanz) */
function onColor(hex){ var h = toHex(hex).slice(1), l = [0,2,4].map(function(i){ var c = parseInt(h.substr(i,2),16)/255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); }); return (.2126*l[0] + .7152*l[1] + .0722*l[2]) > .45 ? '#111113' : '#ffffff'; }
/* Markenfarben aus dem Logo lesen: kräftige Farben zählen, Weiß, Schwarz und Grau zählen nicht (außer das Logo hat keine Farbe) */
var LOGO_COLS = {};
function logoColors(src, done){
  if(LOGO_COLS[src]) return done(LOGO_COLS[src]);
  var img = new Image(); img.crossOrigin = 'anonymous';
  img.onload = function(){
    try{
      var c = document.createElement('canvas'), n = 64; c.width = n; c.height = n;
      var x = c.getContext('2d', {willReadFrequently:true}); x.drawImage(img, 0, 0, n, n);
      var d = x.getImageData(0, 0, n, n).data, buckets = {}, dark = {};
      for(var i = 0; i < d.length; i += 4){
        if(d[i+3] < 200) continue;
        var r = d[i], g = d[i+1], b = d[i+2], mx = Math.max(r,g,b), mn = Math.min(r,g,b), l = (mx+mn)/510, s = mx === mn ? 0 : (mx-mn)/(255 - Math.abs(mx+mn-255));
        var key = (r>>4)+','+(g>>4)+','+(b>>4);
        if(s < .2 || l < .1 || l > .86){ if(l < .35){ var dk = dark[key] || (dark[key] = {n:0,r:0,g:0,b:0}); dk.n++; dk.r += r; dk.g += g; dk.b += b; } continue; }
        var bk = buckets[key] || (buckets[key] = {n:0,w:0,r:0,g:0,b:0}); bk.n++; bk.w += .4 + s; bk.r += r; bk.g += g; bk.b += b;
      }
      var hex = function(o){ return '#' + [o.r/o.n, o.g/o.n, o.b/o.n].map(function(v){ return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); };
      var list = Object.keys(buckets).map(function(k){ return buckets[k]; }).sort(function(a, b){ return b.w - a.w; }), out = [];
      var dist = function(a, b){ var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); return Math.abs((pa>>16)-(pb>>16)) + Math.abs((pa>>8&255)-(pb>>8&255)) + Math.abs((pa&255)-(pb&255)); };
      list.forEach(function(o){ var hx = hex(o); if(out.length < 4 && o.n > 6 && out.every(function(y){ return dist(y, hx) > 90; })) out.push(hx); });
      var dl = Object.keys(dark).map(function(k){ return dark[k]; }).sort(function(a, b){ return b.n - a.n; })[0];
      if(dl && dl.n > 20 && out.length < 4) out.push(hex(dl));
      LOGO_COLS[src] = out; done(out);
    }catch(e){ done([]); }
  };
  img.onerror = function(){ done([]); };
  img.src = src;
}
function fillLogoColors(){
  var box = $('#logocols'), t = F() && F().theme; if(!box || !t || !t.logoImg) return;
  logoColors(t.logoImg, function(cols){
    if(!box.isConnected) return;
    box.innerHTML = cols.length ? cols.map(function(c){ var on = toHex(t.primary) === c; return '<button class="lcol'+(on?' on':'')+'" data-a="logoColor" data-v="'+c+'" title="Als Primärfarbe übernehmen" aria-label="Farbe '+c+' übernehmen"><i style="background:'+c+'"></i><span>'+c.toUpperCase()+'</span></button>'; }).join('')
      : '<span class="hint" style="margin:0">Im Logo wurden keine klaren Farben gefunden.</span>';
  });
}
/* Seitenübergänge: Kachel mit Mini-Seite; mit Maus spielt sie beim Überfahren den echten Übergang, ein Klick zeigt ihn im Handy */
var PAGE_ANIMS = [['slide','Slide'],['spring','Federnd'],['fade','Fade'],['blur','Blur'],['up','Aufwärts'],['stagger','Gestaffelt'],['zoom','Zoom'],['tilt','Kippen'],['wipe','Wischen'],['none','Keine']];
function animPicker(v, chat){
  return '<div class="fld"><label>Seitenübergang</label><div class="anims" role="radiogroup" aria-label="Seitenübergang">'
    + PAGE_ANIMS.map(function(o){ return '<button class="anw'+(v===o[0]?' on':'')+'" role="radio" aria-checked="'+(v===o[0])+'" data-a="pageAnim" data-v="'+o[0]+'"><span class="anp"><span class="fp-anim-'+o[0]+'"><i></i><i></i><i></i></span></span><span class="anl">'+o[1]+'</span></button>'; }).join('')
    + '</div><div class="hint">'+(chat ? 'Im Chat-Modus erscheinen Seiten als Nachrichten, der Übergang gilt dann nur für Seiten ohne Text. ' : '')+'Klick zeigt den Übergang direkt im Handy. Wer am Gerät weniger Bewegung eingestellt hat, sieht immer eine sanfte Einblendung.</div></div>';
}
/* Hervorhebung __Wort__: Kacheln mit echter Vorschau (gleiche Klassen wie im Funnel) */
function hlPicker(v){
  return '<div class="fld"><label>Hervorhebung <span class="kbd-h">__Wort__</span></label><div class="hlstyles" role="radiogroup" aria-label="Stil der Hervorhebung">'
    + FP.HL_STYLES.map(function(o){ return '<button class="hlw'+(v===o[0]?' on':'')+'" role="radio" aria-checked="'+(v===o[0])+'" data-a="seg" data-scope="t" data-k="hlStyle" data-v="'+o[0]+'" data-t="string"><span class="hlp hl-'+o[0]+'">'+FP.md('__Wort__')+'</span><span class="hll">'+o[1]+'</span></button>'; }).join('')
    + '</div><div class="hint">Gilt für alle Überschriften und Texte. Pro Element unter „Stil der Hervorhebung“ änderbar.</div></div>';
}
function panelDesign(){
  var t = F().theme;
  var seg = function(k, l, opts){ return field([k,'seg',l,opts], t, 't'); };
  var tgl = function(k, l, hint){ return field([k,'toggle',l,hint||null], t, 't'); };
  var rng = function(k, l, a){ return field([k,'range',l,a], Object.assign({}, t, (function(){ var o = {}; o[k] = t[k] == null || t[k] === '' ? a[4] : t[k]; return o; })()), 't'); };
  var pk = packOn(t);
  var h = '<div class="psec"><h5>Stil-Pakete</h5><div class="packs">' + Object.keys(STYLE_PACKS).map(function(k){ var P0 = STYLE_PACKS[k], pv = P0.t;
      return '<button class="pack'+(pk===k?' on':'')+'" data-a="pack" data-v="'+k+'" title="'+esc(P0.d)+'"><span class="pkp pk-'+k+'"><b style="font-family:'+esc(FP.fontStack(pv.headingFont))+';font-weight:'+pv.headingWeight+'">Aa</b><i style="border-radius:'+Math.min(+pv.btnRadius, 10)+'px"></i></span><span class="pkl">'+esc(P0.n)+'</span></button>'; }).join('')
    + '</div><div class="hint">Schrift, Rundungen, Kartenstil und Abstände in einem Klick. Deine Farben bleiben.</div></div>';
  h += '<div class="psec"><h5>Themes</h5><div class="presets">' + Object.keys(T.THEMES).map(function(k){ var th = T.THEMES[k], on = th.primary===t.primary && th.bg===t.bg; return '<button class="preset'+(on?' on':'')+'" data-a="preset" data-v="'+k+'"><div class="sw" style="background:'+th.bg+';border:1px solid rgba(0,0,0,.06)"><i style="background:'+th.primary+'"></i><i style="background:'+th.surface+'"></i><i style="background:'+th.text+'"></i></div><span style="font-family:\''+th.headingFont+'\'">'+th.name+'</span></button>'; }).join('') + '</div></div>';
  var swl = swList(), swh = swHost();
  h += '<div class="psec"><h5>Schnellfarben'+(swh && swh.who ? '<span class="pill nos" style="margin-left:6px">'+esc(swh.who)+'</span>' : '')+'</h5><div class="hint" style="margin:-4px 0 10px">'+(swh && swh.who ? 'Gelten für alle Funnels dieses Kunden.' : 'Gelten für diesen Funnel. Mit einem Kunden verknüpft, teilen sich alle seine Funnels die Palette.')+' Jede Farbe, die du irgendwo wählst, landet automatisch hier.</div>'
    + (swl.length ? '<div class="swmgr">' + swl.map(function(c){ return '<span class="swi"><span class="sw" style="--c:'+c+'"></span><code>'+c+'</code><button class="ibtn" data-a="swDel" data-c="'+c+'" title="Entfernen">'+I('x',12)+'</button></span>'; }).join('') + '</div>' : '<div class="hint" style="margin:0">Noch keine eigenen Farben.</div>') + '</div>';
  h += '<div class="psec"><h5>Farben</h5>' + (t.logoImg ? '<div class="fld"><label>Aus deinem Logo</label><div class="logocols" id="logocols" data-src="'+esc(t.logoImg.length > 200 ? 'data' : t.logoImg)+'"><span class="hint" style="margin:0">Farben werden gelesen …</span></div></div>' : '') + '<div class="row2"><div class="fld"><label>Primär / Akzent</label>'+colorField('t','primary',t.primary)+'</div><div class="fld"><label>Text auf Primär</label>'+colorField('t','primaryText',t.primaryText)+'</div></div>'
    + '<div class="row2"><div class="fld"><label>Hintergrund</label>'+colorField('t','bg',t.bg)+'</div><div class="fld"><label>Flächen / Karten</label>'+colorField('t','surface',t.surface)+'</div></div>'
    + '<div class="row2"><div class="fld"><label>Text</label>'+colorField('t','text',t.text)+'</div><div class="fld"><label>Text sekundär</label>'+colorField('t','muted',t.muted)+'</div></div>'
    + tgl('bgGrad','Hintergrund als Verlauf') + (t.bgGrad ? '<div class="row2"><div class="fld"><label>Verlauf bis</label>'+colorField('t','bg2',t.bg2||'#eef0ff')+'</div>'+rng('bgAngle','Winkel',[0,360,5,'°',180])+'</div>' : '') + '</div>';
  h += '<div class="psec"><h5>Typografie</h5><div class="fld"><label>Überschriften</label>'+fontSelect('t','headingFont',t.headingFont)+'</div><div class="fld"><label>Fließtext</label>'+fontSelect('t','font',t.font)+'</div>'
    + '<div class="fontbar"><button class="btn sm" data-a="fontAdd">'+I('plus',13)+'Google Font</button><label class="btn sm">'+I('upload',13)+'Schrift hochladen<input type="file" accept=".woff2,.woff,.ttf,.otf" data-fontup></label></div>'
    + rng('scale','Schriftgröße gesamt',[80,125,5,'%',100])
    + seg('headingWeight','Stärke Überschriften',[[400,'400'],[500,'500'],[600,'600'],[700,'700'],[800,'800']])
    + '<div class="row2">' + rng('headingLs','Laufweite Überschr.',[-6,10,1,'',-2]) + rng('lineHeight','Zeilenhöhe Text',[1.2,2,0.05,'',1.55]) + '</div><div class="row2">' + rng('headingLh','Zeilenhöhe Überschr.',[0.9,1.8,0.05,'',1.15]) + '<span></span></div>'
    + tgl('headingUpper','Überschriften in Großbuchstaben') + hlPicker(t.hlStyle || 'swoosh') + '</div>';
  h += '<div class="psec"><h5>Buttons</h5>' + field(['btnVariant','select','Standard-Stil',[['filled','Gefüllt'],['gradient','Verlauf'],['soft','Soft'],['outline','Rahmen']]], t, 't')
    + '<div class="row2">' + rng('btnPad','Innen oben/unten',[4,28,1,'px',16]) + rng('btnPadX','Innen links/rechts',[8,48,1,'px',22]) + '</div>'
    + rng('btnRadius','Ecken',[0,40,1,'px',12])
    + seg('btnWeight','Schriftstärke',[[500,'500'],[600,'600'],[700,'700'],[800,'800']])
    + tgl('btnUpper','Button-Text in Großbuchstaben') + tgl('stickyCta','Button unten fixieren (Sticky CTA)','Der letzte Button jeder Seite bleibt am unteren Bildschirmrand sichtbar.') + '</div>';
  h += '<div class="psec"><h5>Felder & Antwortkarten</h5>' + rng('radius','Ecken',[0,28,1,'px',14])
    + seg('inputStyle','Eingabefelder',[['outline','Rahmen'],['filled','Gefüllt'],['line','Linie']])
    + optStylePicker(t.optStyle || 'filled') + '</div>';
  h += '<div class="psec"><h5>Header & Navigation</h5><div class="fld"><label>Logo-Text</label><input class="inp" data-t="logoText" value="'+esc(t.logoText)+'" placeholder="Firmenname"></div>' + field(['logoImg','image','Logo (Bild, ersetzt Text)'], t, 't')
    + seg('logoAlign','Logo-Position',[['center','Mitte'],['left','Links']])
    + field(['logoLink','select','Klick aufs Logo',[['','Nichts'],['start','Zur ersten Seite des Funnels'],['url','Link öffnen (z. B. Website)']]], t, 't')
    + (t.logoLink === 'url' ? '<div class="fld"><label>Adresse</label><input class="inp" data-t="logoUrl" value="'+esc(t.logoUrl||'')+'" placeholder="https://www.firma.de" inputmode="url" spellcheck="false"></div>' + tgl('logoNewTab','In neuem Tab öffnen','Sonst verlässt der Besucher den Funnel.') : '')
    + (t.logoLink === 'start' ? '<div class="hint" style="margin:-4px 0 12px">Bereits gegebene Antworten bleiben erhalten.</div>' : '')
    + (t.logoImg ? rng('logoH','Logo-Höhe',[20,80,1,'px',28]) : '')
    + seg('progress','Fortschritt',[['bar','Balken'],['steps','Schritte'],['none','Aus']])
    + (t.progress !== 'none' ? seg('progFill','Füllung',[['solid','Voll'],['gradient','Verlauf'],['glow','Leuchten'],['shimmer','Schimmer']])
      + '<div class="row2">' + rng('progH','Höhe',[2,12,1,'px',t.progressTop?6:5]) + rng('progRadius','Ecken',[0,12,1,'px',t.progressTop?0:9]) + '</div>'
      + seg('progAnim','Bewegung zur nächsten Seite',[['smooth','Weich'],['spring','Federnd'],['none','Ohne']])
      + field(['progLabel','select','Beschriftung',[['','Keine'],['steps','„Schritt 2 von 6“'],['percent','„40 %“'],['left','„Noch 3 Schritte“']]], t, 't') : '')
    + tgl('progressTop','Fortschrittsbalken ganz oben (über dem Logo)')
    + tgl('backButton','Zurück-Button anzeigen')
    + '<div class="fld"><label>Standard-Text „Weiter“-Button</label><input class="inp" data-t="nextLabel" value="'+esc(t.nextLabel||'Weiter')+'"></div></div>';
  var spSet = SP_KEYS.some(function(k){ return t[k] != null && t[k] !== ''; });
  h += '<div class="psec"><h5>Abstände</h5>'
    + rng('spTop','Abstand oben',[0,48,1,'px',t.progressTop?14:16])
    + rng('spHead',t.progressTop?'Fortschritt bis Logo':'Logo bis Fortschritt',[0,40,1,'px',t.progressTop?22:12])
    + rng('spContent','Kopfbereich bis Inhalt',[0,48,1,'px',14])
    + rng('spBlock','Zwischen Elementen',[0,40,1,'px',16])
    + rng('spBottom','Abstand unten',[0,64,1,'px',32])
    + rng('pad','Seitenrand links/rechts',[8,40,1,'px',20])
    + '<div class="sphint"><span class="hint">Gilt für alle Seiten. Eigene Abstände einzelner Elemente haben Vorrang.</span>' + (spSet ? '<button class="btn ghost sm" data-a="spReset">'+I('refresh',13)+'Zurücksetzen</button>' : '') + '</div></div>';
  h += '<div class="psec"><h5>Desktop</h5>' + tgl('split','Geteilter Bildschirm am Rechner','Ein großes Bild auf einer Seite, die Fragen auf der anderen. Auf dem Handy bleibt alles wie gewohnt.')
    + (t.split ? field(['splitImg','image','Bild (pro Seite im Tab „Seite“ änderbar)'], t, 't') + seg('splitSide','Bild auf der',[['left','Linken Seite'],['right','Rechten Seite']]) : '') + '</div>';
  h += '<div class="psec"><h5>Kontakt-Knopf</h5>' + tgl('fab','Anruf- und WhatsApp-Knopf zeigen','Schwebt in der Ecke. Mit einer Nummer öffnet er direkt, mit beiden ein kleines Menü. Nicht bei Einbettung in fremde Websites.')
    + (t.fab ? '<div class="row2"><div class="fld"><label>Telefon</label><input class="inp" data-t="fabPhone" value="'+esc(t.fabPhone||'')+'" placeholder="+49 221 123456" inputmode="tel"></div><div class="fld"><label>WhatsApp</label><input class="inp" data-t="fabWa" value="'+esc(t.fabWa||'')+'" placeholder="+49 151 1234567" inputmode="tel"></div></div>'
      + '<div class="fld"><label>Erste WhatsApp-Nachricht (optional)</label><input class="inp" data-t="fabText" value="'+esc(t.fabText||'')+'" placeholder="Hallo, ich habe eine Frage zu …"></div>'
      + '<div class="fld"><label>Hinweis neben dem Knopf (optional)</label><input class="inp" data-t="fabLabel" value="'+esc(t.fabLabel||'')+'" placeholder="Fragen? Ruf uns an"></div>'
      + seg('fabStyle','Aussehen',[['white','Weiß'],['green','WhatsApp-Grün'],['brand','Markenfarbe']]) + '<div class="row2">' + seg('fabSide','Position',[['right','Rechts'],['left','Links']]) + seg('fabSize','Größe',[['','Normal'],['sm','Klein']]) + '</div>'
      + field(['fabImg','image','Foto im Knopf (optional)'], t, 't') : '') + '</div>';
  h += '<div class="psec"><h5>Chat-Modus</h5>' + tgl('chat','Funnel als Chat anzeigen','Überschriften und Texte erscheinen als Nachrichten, davor kurz „schreibt …“. Bisherige Antworten stehen als Verlauf darüber.')
    + (t.chat ? '<div class="row2"><div class="fld"><label>Name</label><input class="inp" data-t="chatName" value="'+esc(t.chatName||'')+'" placeholder="z. B. Lisa"></div><div class="fld"><label>Untertitel</label><input class="inp" data-t="chatRole" value="'+esc(t.chatRole||'')+'" placeholder="Antwortet in der Regel sofort"></div></div>' + field(['chatAvatar','image','Foto (sonst Initialen)'], t, 't') : '') + '</div>';
  h += '<div class="psec"><h5>Animation & Hintergrund</h5>'
    + animPicker(t.animation || 'slide', !!t.chat)
    + tgl('morph','Bild-Übergang zwischen Seiten','Das gewählte Antwortbild wächst ins Titelbild der nächsten Seite. Funktioniert in Chrome, Edge und Safari; sonst normaler Übergang.')
    + field(['bgImage','image','Hintergrundbild (alle Seiten)'], t, 't') + (t.bgImage?'<div class="fld"><label>Overlay</label>'+colorField('t','overlay',t.overlay)+'<div class="hint">z. B. rgba(0,0,0,0.4) für bessere Lesbarkeit</div></div>':'')
    + '<div class="fld"><label>Footer-Text</label><input class="inp" data-t="footer" value="'+esc(t.footer||'')+'" placeholder="Impressum · Datenschutz"></div></div>';
  h += '<div class="psec"><h5>'+I('code',13)+'Eigenes CSS</h5><textarea class="inp" data-t="customCss" rows="5" style="font-family:ui-monospace,monospace;font-size:var(--fs-12)" placeholder=".fp-btn{letter-spacing:.02em}\n.fp-h1{font-size:32px}">'+esc(t.customCss||'')+'</textarea><div class="hint">Klassen: .fp-h1/.fp-h2 (Überschriften), .fp-txt, .fp-btn, .fp-opt, .fp-in, .fp-badge, .fp-prog</div></div>';
  return h;
}
function panelSettings(){
  var f = F(), s = f.settings;
  var keys = []; FP.allBlocks(f).forEach(function(b){ if(['choice','input','slider','rating','calendar','checkbox','upload','signature'].indexOf(b.type) >= 0 && b.props.key) keys.push(b.props.key); });
  ensureSlug(f);
  var h = '<div class="psec"><h5>Allgemein</h5><div class="fld"><label>Funnel-Name</label><input class="inp" data-fn value="'+esc(f.name)+'"></div>'
    + '<label class="tgl"><span>„Weitermachen, wo du aufgehört hast“</span><input type="checkbox" data-s="resume" data-bool data-inv'+(s.resume===false?'':' checked')+'><span class="sw"></span></label><div class="hint" style="margin:-6px 0 12px">Wer abbricht und wiederkommt, kann weitermachen. Gespeichert werden nur Auswahl-Antworten, keine Kontaktdaten, nur auf dem Gerät des Besuchers.</div>'
    + '<div class="fld"><label>Link-Adresse</label><div class="slugf"><span>/</span><input data-fslug value="'+esc(f.slug)+'" spellcheck="false"></div><div class="hint" id="fslugh">'+esc(publicUrl(f))+'</div></div>'
    + '<div class="fld"><label>Status</label><div class="segf"><button data-a="fstatus" data-v="draft" class="'+(f.status!=='live'?'on':'')+'">Entwurf</button><button data-a="fstatus" data-v="live" class="'+(f.status==='live'?'on':'')+'">Live</button></div></div></div>';
  h += '<div class="psec"><h5>'+I('folder',13)+'Kunde & Freigabe</h5><div class="fld"><label>Kunde</label><select class="inp" data-fclient>'+'<option value="">– Intern (kein Kunde) –</option>'+(db.clients||[]).map(function(c){ return '<option value="'+c.id+'"'+(f.clientId===c.id?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('')+'</select></div>'
    + (f.clientId ? '<label class="tgl"><span>Für den Kunden freigeschaltet</span><input type="checkbox" data-fshare'+(f.shared?' checked':'')+'><span class="sw"></span></label><div class="hint">Freigeschaltet sieht der Kunde in seinem Login den Funnel, alle Kontakte und die Analytics. Bearbeiten kannst nur du.</div>' : '<div class="hint">Ordne den Funnel einem Kunden zu, um ihn für dessen Login freizuschalten.</div>') + '</div>';
  h += '<div class="psec"><h5>'+I('receipt',13)+'Preisberechnung</h5><div class="row2"><div class="fld"><label>Währung</label><select class="inp" data-s="currency">'+['EUR','CHF','USD','GBP'].map(function(c){ return '<option'+(s.currency===c?' selected':'')+'>'+c+'</option>'; }).join('')+'</select></div><div class="fld"><label>Grundpreis</label><input class="inp" type="number" data-s="basePrice" data-num value="'+(s.basePrice||'')+'" placeholder="0"></div></div>'
    + '<div class="fld"><label>Bezeichnung Grundpreis</label><input class="inp" data-s="baseLabel" value="'+esc(s.baseLabel||'Grundpreis')+'"></div>'
    + '<div class="fld"><label>Preis-Anzeige für Besucher</label><div class="segf">'+[['exact','Exakt'],['range','Spanne'],['from','ab-Preis']].map(function(x){ return '<button data-a="seg" data-scope="s" data-k="priceMode" data-v="'+x[0]+'" data-t="string" class="'+((s.priceMode||'exact')===x[0]?'on':'')+'">'+x[1]+'</button>'; }).join('')+'</div></div>'
    + '<div class="row2">'+((s.priceMode||'exact')==='range'?'<div class="fld"><label>Spanne ± %</label><input class="inp" type="number" data-s="priceRange" data-num value="'+(s.priceRange!=null&&s.priceRange!==''?s.priceRange:10)+'"></div>':'')+'<div class="fld"><label>Runden auf (€)</label><input class="inp" type="number" data-s="priceRound" data-num value="'+(s.priceRound||'')+'" placeholder="z. B. 50"></div></div>'
    + '<div class="hint">Formel: Grundpreis + Festpreise + (Preise pro Einheit × Menge). Die Menge kommt aus Schiebereglern oder Zahlenfeldern mit „Als Menge für Preisberechnung“. Intern und in der Anfrage wird immer der exakte Preis gespeichert.</div></div>';
  h += '<div class="psec"><h5>'+I('send',13)+'Automationen</h5><div class="ausum">' + autoSummary(f).map(function(x){ return '<div class="aus'+(x[3]?' on':'')+'">'+I(x[0],13)+'<span>'+x[1]+'</span><b>'+esc(x[2])+'</b></div>'; }).join('') + '</div><button class="btn sm" style="width:100%;justify-content:center;margin-top:8px" data-a="autoOpen">'+I('settings',13)+'Automationen bearbeiten</button><div class="hint">E-Mails nach jeder Anfrage, Regeln wie Sofort-Alarm, Webhooks und eigene Domain.</div></div>';
  h += '<div class="psec"><h5>'+I('zap',13)+'Integrationen</h5><div class="fld"><label>Webhook-URL (aus dem Browser)</label><input class="inp" data-s="webhook" value="'+esc(s.webhook||'')+'" placeholder="https://hook.eu1.make.com/…"><div class="hint">Leads werden beim Absenden als JSON gesendet (Make, Zapier, n8n, Supabase Edge Function).</div></div>'
    + '<div class="fld"><label>Webhook-Format</label><div class="segf">'+[['taptell','TapTell'],['onepage','Onepage-kompatibel']].map(function(x){ return '<button data-a="seg" data-scope="s" data-k="webhookFormat" data-v="'+x[0]+'" data-t="string" class="'+((s.webhookFormat||'taptell')===x[0]?'on':'')+'">'+x[1]+'</button>'; }).join('')+'</div><div class="hint">Onepage-kompatibel sendet dieselbe Struktur wie ein Onepage-Webhook („lead.created“ mit data.fields und data.fieldsMap). Empfänger, die bisher Onepage auswerten, funktionieren ohne Umbau. Die Feld-Schlüssel müssen den Onepage-Slugs entsprechen.</div></div>'
    + (s.webhookFormat === 'onepage' ? '<div class="fld"><label>Formularname (wie in Onepage)</label><input class="inp" data-s="onepageForm" value="'+esc(s.onepageForm||'')+'" placeholder="'+esc(f.name)+'"><div class="hint">Erscheint in data.leadInfo und data.source.page.title.</div></div>' : '')
    + '<div class="fld"><label>Weiterleitung nach Absenden (optional)</label><input class="inp" data-s="redirect" value="'+esc(s.redirect||'')+'" placeholder="https://deine-seite.de/danke"></div>'
    + '<div class="fld"><label>Meta Pixel ID (optional)</label><input class="inp" data-s="pixel" value="'+esc(s.pixel||'')+'" placeholder="123456789012345"><div class="hint">Feuert „PageView“ und „Lead“ im exportierten Funnel.</div></div>'
    + '<div class="fld"><label>Anrede in Hinweisen</label><div class="segf">'+[['du','Du'],['sie','Sie']].map(function(x){ return '<button data-a="seg" data-scope="s" data-k="address" data-v="'+x[0]+'" data-t="string" class="'+((s.address||'du')===x[0]?'on':'')+'">'+x[1]+'</button>'; }).join('')+'</div><div class="hint">Gilt für Fehlermeldungen wie „Bitte wähle eine Option“.</div></div></div>';
  /* Cookie-Banner (DSGVO): ein-/ausschaltbar, Texte, Farben, Kategorien */
  var ccT = f.theme || {}, ccTg = function(k, label){ return '<label class="tgl"><span>'+label+'</span><input type="checkbox" data-s="'+k+'" data-bool data-inv'+(s[k] !== false ? ' checked' : '')+'><span class="sw"></span></label>'; };
  h += '<div class="psec"><h5>'+I('shield',13)+'Cookie-Banner</h5><label class="tgl"><span>Banner beim Öffnen anzeigen</span><input type="checkbox" data-s="ccOn" data-bool data-rp'+(s.ccOn?' checked':'')+'><span class="sw"></span></label>'
    + (s.ccOn ? '<div class="fld"><label>Überschrift</label><input class="inp" data-s="ccTitle" value="'+esc(s.ccTitle||'')+'" placeholder="Wir verwenden Cookies"></div>'
      + '<div class="fld"><label>Text</label><textarea class="inp" rows="4" data-s="ccText" placeholder="Wir setzen Cookies ein, wie in unserer Datenschutzerklärung beschrieben …">'+esc(s.ccText||'')+'</textarea><div class="hint">Leer lassen für den Standardtext. **fett** und [Link](https://…) sind möglich.</div></div>'
      + '<div class="row2"><div class="fld"><label>Button Zustimmen</label><input class="inp" data-s="ccAccept" value="'+esc(s.ccAccept||'')+'" placeholder="Alle akzeptieren"></div><div class="fld"><label>Button Ablehnen</label><input class="inp" data-s="ccDecline" value="'+esc(s.ccDecline||'')+'" placeholder="Ablehnen"></div></div>'
      + '<div class="row2"><div class="fld"><label>Button Bearbeiten</label><input class="inp" data-s="ccEdit" value="'+esc(s.ccEdit||'')+'" placeholder="Bearbeiten"></div><div class="fld"><label>Button Speichern</label><input class="inp" data-s="ccSave" value="'+esc(s.ccSave||'')+'" placeholder="Auswahl speichern"></div></div>'
      + '<div class="fld"><label>Link zur Datenschutzerklärung</label><input class="inp" data-s="ccPrivacy" value="'+esc(s.ccPrivacy||'')+'" placeholder="https://kunde.de/datenschutz"></div>'
      + '<div class="row2"><div class="fld"><label>Button-Farbe</label>'+colorField('s','ccBtnBg', s.ccBtnBg || ccT.primary || '#111111')+'</div><div class="fld"><label>Button-Schrift</label>'+colorField('s','ccBtnText', s.ccBtnText || ccT.primaryText || '#ffffff')+'</div></div>'
      + '<div class="row2"><div class="fld"><label>Hintergrund</label>'+colorField('s','ccBg', s.ccBg || '#ffffff')+'</div><div class="fld"><label>Schrift</label>'+colorField('s','ccInk', s.ccInk || '#1d1d1f')+'</div></div>'
      + '<div class="flab" style="margin-top:4px">Kategorien (Essentielle ist immer dabei)</div>' + ccTg('ccFun','Funktionale') + ccTg('ccPerf','Performance') + ccTg('ccMkt','Marketing')
      + '<button class="btn sm" style="width:100%;justify-content:center" data-a="ccPreview">'+I('eye',13)+'Banner-Vorschau</button><div class="hint">Meta-Pixel und Analyse-Skripte starten erst nach Einwilligung. Die Entscheidung wird mit jeder Anfrage gespeichert. Unten im Funnel erscheint „Cookie-Einstellungen“ zum Widerrufen.</div>'
      : '<div class="hint" style="margin-top:-4px">Nötig, sobald der Funnel Meta-Pixel, Google Analytics oder andere Dienste nutzt, die Cookies setzen.</div>') + '</div>';
  h += '<div class="psec"><h5>'+I('user',13)+'Personalisierung</h5><p class="hint" style="margin:0 0 10px">Wiederhole Eingaben des Besuchers in späteren Texten, z. B. „Danke, {{vorname}}!“. In jedem Textfeld fügst du sie über <b>Variable</b> ein. Mit <code>{{vorname|du}}</code> legst du fest, was erscheint, wenn das Feld leer bleibt.</p><div class="varrows">' + FP.vars(f).map(function(v){ return '<button class="varrow" data-a="copyVar" data-v="{{'+esc(v.key)+'}}" title="Kopieren"><span>'+esc(v.label)+'</span><code>{{'+esc(v.key)+'}}</code></button>'; }).join('') + '</div></div>';
  return h;
}

/* ---- editor mutations ---- */
function insertBlocks(blocks, pageIdx, at){
  var f = F(), pg = f.pages[pageIdx];
  if(at == null || at < 0 || at > pg.blocks.length) at = pg.blocks.length;
  snap(true);
  var hostBox = at > 0 ? (pg.blocks[at - 1].type === 'box' ? {b:pg.blocks[at - 1]} : boxOf(pg, at - 1)) : null; /* hinter einem Element in einer Box eingefügt → gehört dazu */
  if(hostBox && hostBox.b.type === 'box' && (hostBox.end == null || at - 1 <= hostBox.end)) hostBox.b.props.count = (+hostBox.b.props.count || 0) + blocks.length;
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
var SECTION_PAGE = {'s-loader':{name:'Laden', extra:{hideProgress:true, vcenter:true, allowBack:false}}, 's-thanks':{name:'Danke', extra:{allowBack:false, autoButton:false, confetti:true}}, 's-hero':{name:'Start'}, 's-contact':{name:'Kontakt'}, 's-book':{name:'Termin'}};
function addSectionPage(id){
  var f = F(), sp = SECTION_PAGE[id] || {name:'Neue Seite'}; snap(true);
  var p = T.P(sp.name, makeFromLib(id), Object.assign({}, sp.extra||{}));
  var at = S.pi + 1; f.pages.splice(at, 0, p); S.pi = at; S.sel = null; S.rtab = 'page';
  touch(); renderLeft(); renderCanvas(); renderRight();
  toast('Neue Seite „'+sp.name+'“ nach Seite '+at+' eingefügt');
}
function addFromLibClick(id){
  if(/^s-/.test(id)) return addSectionPage(id); /* ganze Seiten nie in die offene Seite mischen */
  var blocks = makeFromLib(id), pg = curPage(), at = pg.blocks.length;
  if(S.sel){ var ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel); if(ix >= 0) at = ix + 1; }
  else { var lb = pg.blocks.length ? pg.blocks[pg.blocks.length-1] : null; if(lb && lb.type === 'button') at = pg.blocks.length - 1; }
  insertBlocks(blocks, S.pi, at);
}
/* ---- Box: umschließt die nächsten n Elemente. Verschieben, Einfügen und Löschen halten die Box stimmig ---- */
function boxOf(pg, ix){ /* Box, deren Bereich das Element an ix enthält (nicht die Box selbst) */
  for(var j = ix - 1; j >= 0; j--){ var b = pg.blocks[j]; if(b.type === 'box'){ var n = +b.props.count || 0; if(ix <= j + n) return {b:b, at:j, end:j + n}; } }
  return null;
}
function moveBlock(dir){
  var pg = curPage(), ids = pg.blocks.map(function(b){ return b.id; }), ix = ids.indexOf(S.sel); if(ix < 0) return;
  var b = pg.blocks[ix];
  snap(true);
  if(b.type === 'box'){ /* Box wandert mit ihrem Inhalt */
    var n = Math.min(+b.props.count || 0, pg.blocks.length - ix - 1), grp = pg.blocks.splice(ix, n + 1), to = dir < 0 ? Math.max(0, ix - 1) : Math.min(pg.blocks.length, ix + 1);
    Array.prototype.splice.apply(pg.blocks, [to, 0].concat(grp)); touch(); renderCanvas(true); return;
  }
  var own = boxOf(pg, ix);
  if(dir < 0){
    if(own && ix === own.at + 1){ pg.blocks.splice(ix, 1); pg.blocks.splice(own.at, 0, b); own.b.props.count = Math.max(0, (+own.b.props.count || 0) - 1); touch(); renderCanvas(true); toast('Aus der Box genommen'); return; }
    var prev = ix > 0 ? boxOf(pg, ix - 1) : null, prevIsBox = ix > 0 && pg.blocks[ix - 1].type === 'box' && !(+pg.blocks[ix - 1].props.count);
    if(prev && prev.end === ix - 1 && (!own || own.b !== prev.b)){ prev.b.props.count = (+prev.b.props.count || 0) + 1; touch(); renderCanvas(true); toast('In die Box verschoben'); return; }
    if(prevIsBox){ pg.blocks[ix - 1].props.count = 1; touch(); renderCanvas(true); toast('In die Box verschoben'); return; }
  } else {
    if(own && ix === own.end){ own.b.props.count = Math.max(0, (+own.b.props.count || 0) - 1); touch(); renderCanvas(true); toast('Aus der Box genommen'); return; }
    var nx = pg.blocks[ix + 1];
    if(nx && nx.type === 'box'){ pg.blocks.splice(ix, 1); pg.blocks.splice(ix + 1, 0, b); nx.props.count = (+nx.props.count || 0) + 1; touch(); renderCanvas(true); toast('In die Box verschoben'); return; }
  }
  var ni = ix + dir; if(ni < 0 || ni >= pg.blocks.length){ touch(); return; }
  pg.blocks.splice(ix, 1); pg.blocks.splice(ni, 0, b); touch(); renderCanvas(true);
}
function dupBlock(){
  var pg = curPage(), ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel); if(ix < 0) return;
  snap(true); var src0 = pg.blocks[ix], grpN = src0.type === 'box' ? Math.min(+src0.props.count || 0, pg.blocks.length - ix - 1) : 0, own0 = boxOf(pg, ix);
  var cs = pg.blocks.slice(ix, ix + grpN + 1).map(function(x){ var c1 = clone(x); c1.id = uid(); if(c1.props.options) c1.props.options.forEach(function(o){ o.id = uid(); }); if(c1.props.key) c1.props.key = uniqueKey(c1.props.key); return c1; }), c = cs[0];
  if(own0) own0.b.props.count = (+own0.b.props.count || 0) + cs.length;
  Array.prototype.splice.apply(pg.blocks, [ix + grpN + 1, 0].concat(cs)); S.sel = c.id; touch(); renderLeft(); renderCanvas(true); renderRight();
}
/* Element kopieren und auf einer beliebigen Seite (auch in einem anderen Funnel) einfügen.
   Die Zwischenablage liegt im Speicher und zusätzlich im Browser, damit sie Seitenwechsel und neue Tabs übersteht. */
var CLIP = null;
try{ CLIP = JSON.parse(localStorage.getItem('tt-clip') || 'null'); }catch(x){}
function copyBlock(){
  var b = selBlock(); if(!b) return;
  CLIP = clone(b); try{ localStorage.setItem('tt-clip', JSON.stringify(CLIP)); }catch(x){}
  toast((BNAME[b.type]||'Element')+' kopiert – auf einer anderen Seite mit ⌘V einfügen');
  var selEl = $('#scr .fp-b.sel'); if(selEl) placeTool(selEl);
  if(S.rtab === 'page') renderRight();
}
function pasteBlock(){
  if(!CLIP){ toast('Noch nichts kopiert. Element markieren und ⌘C drücken.'); return; }
  var c = clone(CLIP); c.id = uid(); if(c.props && c.props.options) c.props.options.forEach(function(o){ o.id = uid(); }); if(c.props && c.props.key) c.props.key = uniqueKey(c.props.key);
  var pg = curPage(), at = pg.blocks.length;
  if(S.sel){ var ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel); if(ix >= 0) at = ix + 1; }
  else { var lb = pg.blocks[pg.blocks.length-1]; if(lb && lb.type === 'button' && c.type !== 'button') at = pg.blocks.length - 1; }
  insertBlocks([c], S.pi, at);
  toast((BNAME[c.type]||'Element')+' auf Seite '+(S.pi+1)+' eingefügt');
}
function delBlock(){
  var pg = curPage(), ix = pg.blocks.map(function(b){ return b.id; }).indexOf(S.sel); if(ix < 0) return;
  snap(true); var own1 = boxOf(pg, ix); if(own1) own1.b.props.count = Math.max(0, (+own1.b.props.count || 0) - 1); pg.blocks.splice(ix,1); S.sel = null; S.rtab = 'page'; touch(); renderLeft(); renderCanvas(true); renderRight();
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
    f.pages.forEach(function(p){ if(p.next === id) p.next = ''; (p.logic||[]).forEach(function(r){ if(r.goto === id) r.goto = ''; }); (p.scoreRoutes||[]).forEach(function(r){ if(r.goto === id) r.goto = ''; }); p.blocks.forEach(function(b){ if(b.props.target === id) b.props.target = ''; (b.props.options||[]).forEach(function(o){ if(o.goto === id) o.goto = ''; }); (b.props.routes||[]).forEach(function(r){ if(r.goto === id) r.goto = ''; }); }); });
    S.pi = Math.max(0, Math.min(i, f.pages.length-1)); S.sel = null; touch(); renderLeft(); renderCanvas(); renderRight();
  }, true);
}
function selectPage(i){ if(i === S.pi) return; S.pi = i; S.sel = null; if(S.rtab === 'el') S.rtab = 'page'; renderLeft(); renderCanvas(); renderRight(); }
/* Hinweis-Pfeil im Vorschaubild mit der Maus ziehen */
document.addEventListener('pointerdown', function(e){
  var a = e.target.closest && e.target.closest('#scr .fp-arw'); if(!a || e.button > 0) return;
  var blk = a.closest('.fp-b[data-bid]'); if(!blk) return;
  var id = blk.getAttribute('data-bid'); if(S.sel !== id) selectBlock(id);
  var b = selBlock(); if(!b || b.type !== 'arrow') return;
  e.preventDefault(); e.stopPropagation();
  var sx = e.clientX, sy = e.clientY, ox = +b.props.x || 0, oy = +b.props.y || 0, moved = false, nx = ox, ny = oy;
  try{ a.setPointerCapture(e.pointerId); }catch(x){}
  a.classList.add('dragging'); var tool = $('#btool'); if(tool) tool.style.opacity = '0';
  var mv = function(ev){ var dx = ev.clientX - sx, dy = ev.clientY - sy; if(!moved && Math.abs(dx) + Math.abs(dy) < 3) return; moved = true; nx = Math.round(ox + dx); ny = Math.round(oy + dy); a.style.setProperty('--ax', nx + 'px'); a.style.setProperty('--ay', ny + 'px'); };
  var up = function(){ a.removeEventListener('pointermove', mv); a.removeEventListener('pointerup', up); a.removeEventListener('pointercancel', up); a.classList.remove('dragging'); if(tool) tool.style.opacity = '';
    if(moved){ snap(true); b.props.x = nx; b.props.y = ny; touch(); renderCanvas(true); renderRight(); } };
  a.addEventListener('pointermove', mv); a.addEventListener('pointerup', up); a.addEventListener('pointercancel', up);
}, true);
/* ================= Text direkt im Vorschaubild bearbeiten =================
   Doppelklick auf Überschrift, Text, Badge, Button oder Frage – oder ein zweiter Klick auf ein markiertes Element.
   Formatierung über die schwebende Leiste oder ⌘B / ⌘I / ⌘U. Gespeichert wird im gewohnten Text-Format (**fett**, *kursiv*, ++unterstrichen++, __Hervorhebung__, ==Akzent==, [[Marker]]). */
var INL = {heading:{sel:'.fp-h1,.fp-h2,.fp-h3', k:'text', multi:true}, text:{sel:'.fp-txt', k:'text', multi:true}, badge:{sel:'.fp-badge', k:'text'}, button:{sel:'.fp-btn .ln,.fp-btn>span:first-child', k:'label'}, choice:{sel:'.fp-q', k:'question', multi:true}, checkbox:{sel:'.fp-cb > span:last-child', k:'text', multi:true}};
var inl = null;
function inlTarget(blk, b){ var c = b && INL[b.type]; if(!c || !blk) return null; var el = blk.querySelector(c.sel); return el ? {el:el, cfg:c} : null; }
/* HTML aus dem Bearbeitungsfeld zurück ins Text-Format */
function htmlToMd(root){
  var walk = function(n){
    if(n.nodeType === 3){
      var text = n.nodeValue.replace(/ /g, ' ');
      for(var parent = n.parentElement; parent && parent !== root; parent = parent.parentElement){
        var color = parent.style.color || (parent.tagName === 'FONT' && parent.getAttribute('color'));
        if(color) return '{farbe:'+toHex(color)+'}'+text+'{/farbe}';
      }
      return text;
    }
    if(n.nodeType !== 1) return '';
    var tag = n.tagName.toLowerCase(), cl = n.classList;
    if(tag === 'svg' || cl.contains('rq') || cl.contains('fp-var-x')) return '';
    if(tag === 'br') return '\n';
    var inner = [].map.call(n.childNodes, walk).join(''), st = n.style || {};
    if(!inner.replace(/\n/g, '').trim()) return inner;
    var a = '', z = '';
    if(cl.contains('fp-ul')){ a = z = '__'; }
    else if(cl.contains('fp-hl')){ a = z = '=='; }
    else if(tag === 'mark' || cl.contains('fp-mk')){ a = '[['; z = ']]'; }
    else if(tag === 'a'){ a = '['; z = '](' + (n.getAttribute('href') || '') + ')'; }
    var b = tag === 'b' || tag === 'strong' || st.fontWeight === 'bold' || +st.fontWeight >= 600;
    var i = tag === 'i' || tag === 'em' || st.fontStyle === 'italic';
    var u = tag === 'u' || /underline/.test(st.textDecoration || '');
    if(u) inner = '++' + inner + '++';
    if(i) inner = '*' + inner + '*';
    if(b) inner = '**' + inner + '**';
    var out = a + inner + z;
    return (tag === 'div' || tag === 'p') ? '\n' + out : out;
  };
  return [].map.call(root.childNodes, walk).join('').replace(/^\n/, '').replace(/\*\*\*\*/g, '').replace(/\n{3,}/g, '\n\n');
}
function inlStart(bid, x, y){
  var b = selBlock(); if(!b || b.id !== bid) return;
  var blk = $('#scr .fp-b[data-bid="'+bid+'"]'), t = inlTarget(blk, b); if(!t) return;
  if(inl) inlFinish();
  snap(true);
  var raw = String(b.props[t.cfg.k] || '');
  t.el.innerHTML = FP.md(raw) || '';
  t.el.querySelectorAll('svg').forEach(function(sv){ sv.setAttribute('contenteditable', 'false'); });
  t.el.setAttribute('contenteditable', 'true'); t.el.setAttribute('spellcheck', 'true');
  blk.classList.add('editing'); blk.removeAttribute('draggable');
  inl = {bid:bid, b:b, el:t.el, k:t.cfg.k, multi:!!t.cfg.multi, blk:blk};
  t.el.addEventListener('input', inlInput);
  t.el.addEventListener('keydown', inlKey);
  t.el.addEventListener('paste', inlPaste);
  t.el.focus();
  /* Cursor dorthin, wo geklickt wurde – sonst ans Ende */
  var r = null;
  if(x != null && document.caretRangeFromPoint) r = document.caretRangeFromPoint(x, y);
  if(!r || !t.el.contains(r.startContainer)){ r = document.createRange(); r.selectNodeContents(t.el); r.collapse(false); }
  var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
  var tool = $('#btool'); if(tool) tool.style.visibility = 'hidden';
  inlBar();
}
function inlInput(){ if(!inl) return; inl.b.props[inl.k] = htmlToMd(inl.el); touch(); var f = $('#rp [data-p="'+inl.k+'"]'); if(f && document.activeElement !== f) f.value = inl.b.props[inl.k]; inlPlace(); }
function inlKey(e){
  if(e.key === 'Escape'){ e.preventDefault(); inlStop(); return; }
  if(e.key === 'Enter'){ e.preventDefault(); if(inl.multi && !e.metaKey && !e.ctrlKey) document.execCommand('insertLineBreak'); else inlStop(); return; }
  var mod = e.metaKey || e.ctrlKey, k = e.key.toLowerCase();
  if(mod && (k === 'b' || k === 'i' || k === 'u')){ e.preventDefault(); inlCmd(k === 'b' ? 'bold' : k === 'i' ? 'italic' : 'underline'); }
  if(mod && k === 'z'){ e.stopPropagation(); }
}
function inlPaste(e){ e.preventDefault(); var t = (e.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, inl && !inl.multi ? t.replace(/\s*\n\s*/g, ' ') : t); }
/* Speichern ohne Neuaufbau (z. B. kurz bevor die Vorschau ohnehin neu gezeichnet wird) */
function inlFinish(){
  if(!inl) return; var it = inl; inl = null;
  it.b.props[it.k] = htmlToMd(it.el); touch();
  it.el.removeEventListener('input', inlInput); it.el.removeEventListener('keydown', inlKey); it.el.removeEventListener('paste', inlPaste);
  var bar = $('#inlbar'); if(bar) bar.remove();
  var tool = $('#btool'); if(tool) tool.style.visibility = '';
}
function inlStop(){ if(!inl) return; inlFinish(); renderCanvas(true); renderRight(); }
/* Fett, kursiv, unterstrichen als echte Tags setzen – execCommand würde bei fetten Überschriften das Fett entfernen */
var INL_TAG = {bold:['strong','strong,b'], italic:['em','em,i'], underline:['u','u']};
function inlCmd(cmd){ if(!inl) return; inl.el.focus(); var t = INL_TAG[cmd]; inlWrap(t[1], t[0]); }
/* Markierten Text mit Hervorhebung, Akzent oder Marker versehen (oder wieder entfernen) */
function inlWrap(match, tag){
  var cls = /^[\w-]+$/.test(match) && match.indexOf('fp-') === 0 ? match : '', q = cls ? '.' + cls : match;
  if(!inl) return; var sel = getSelection(); if(!sel.rangeCount) return; var r = sel.getRangeAt(0);
  var node = r.commonAncestorContainer; node = node.nodeType === 1 ? node : node.parentNode;
  var hit = node.closest(q);
  if(hit && inl.el.contains(hit)){
    hit.querySelectorAll('svg').forEach(function(sv){ sv.remove(); });
    while(hit.firstChild) hit.parentNode.insertBefore(hit.firstChild, hit); hit.remove();
  } else {
    if(r.collapsed) return;
    var w = document.createElement(tag); if(cls) w.className = cls; w.appendChild(r.extractContents());
    w.querySelectorAll(q).forEach(function(x){ while(x.firstChild) x.parentNode.insertBefore(x.firstChild, x); x.remove(); });
    if(cls === 'fp-ul'){ var tmp = document.createElement('div'); tmp.innerHTML = FP.md('__x__'); tmp.querySelectorAll('svg').forEach(function(sv){ sv.setAttribute('contenteditable', 'false'); w.appendChild(sv); }); }
    r.insertNode(w); sel.removeAllRanges(); var nr = document.createRange(); nr.selectNodeContents(w); sel.addRange(nr);
  }
  inlInput(); inlState();
}
function inlClear(){ if(!inl) return; var sel = getSelection(); if(!sel.rangeCount || sel.getRangeAt(0).collapsed){ inl.el.textContent = inl.el.textContent; } else { document.execCommand('removeFormat'); var r = sel.getRangeAt(0), node = r.commonAncestorContainer; node = node.nodeType === 1 ? node : node.parentNode; var hit = node.closest('.fp-ul,.fp-hl,mark'); if(hit && inl.el.contains(hit)){ hit.querySelectorAll('svg').forEach(function(sv){ sv.remove(); }); while(hit.firstChild) hit.parentNode.insertBefore(hit.firstChild, hit); hit.remove(); } } inlInput(); inlState(); }
function inlSize(d){
  if(!inl) return; var b = inl.b, cur = +b.props.size || Math.round(parseFloat(getComputedStyle(inl.el).fontSize));
  var nv = Math.max(10, Math.min(72, cur + d)); b.props.size = nv; inl.el.style.fontSize = nv + 'px'; touch(); inlPlace();
  var f = $('#rp [data-p="size"]'); if(f) f.value = nv;
}
/* Der native Farbdialog kann den Fokus und die aktuelle Textauswahl übernehmen. */
function inlPickInk(picker){
  var sel = getSelection(), range = sel.rangeCount ? sel.getRangeAt(0) : null;
  if(!range || !inl.el.contains(range.commonAncestorContainer)) range = inl.lastRange;
  if(!range || range.collapsed){ toast('Markiere zuerst den Text, den du einfärben möchtest'); return; }
  inl.inkRange = range.cloneRange();
  var start = range.startContainer;
  picker.value = toHex(getComputedStyle(start.nodeType === 1 ? start : start.parentElement).color);
  picker.click();
}
function inlApplyInk(picker){
  var range = inl && inl.inkRange;
  if(!range || !inl.el.contains(range.commonAncestorContainer)) return;
  inl.inkRange = null;
  inl.el.focus();
  var sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
  document.execCommand('foreColor', false, picker.value);
  inlInput(); inlState();
}
function inlAlign(v){ if(!inl) return; inl.b.props.align = v; inl.blk.style.textAlign = v; touch(); inlState(); inlPlace(); }
function inlBar(){
  var scr = $('#scr'); if(!scr || !inl) return;
  var old = $('#inlbar'); if(old) old.remove();
  var bar = document.createElement('div'); bar.className = 'inlbar'; bar.id = 'inlbar';
  var B = function(a, ic, t, v){ return '<button type="button" data-inl="'+a+'"'+(v ? ' data-v="'+v+'"' : '')+' title="'+t+'" aria-label="'+t+'">'+I(ic, 15)+'</button>'; };
  var sizeable = inl.b.type === 'heading' || inl.b.type === 'text' || inl.b.type === 'checkbox';
  bar.innerHTML = B('bold','fBold','Fett (⌘B)') + B('italic','fItalic','Kursiv (⌘I)') + B('underline','fUnder','Unterstrichen (⌘U)') + '<i></i>'
    + B('hl','fHl','Hervorheben (Stil im Design-Tab)') + B('accent','fAccent','Akzentfarbe') + B('ink','inkDrop','Schriftfarbe für markierten Text') + '<input type="color" class="inl-ink-picker" tabindex="-1" aria-label="Schriftfarbe wählen">' + B('mark','fMark','Marker') + B('link','link','Link') + '<i></i>'
    + (sizeable ? B('small','fSmall','Kleiner') + B('big','fBig','Größer') + '<i></i>' : '')
    + B('align','fLeft','Links','left') + B('align','fCenter','Mitte','center') + B('align','fRight','Rechts','right') + '<i></i>'
    + B('clear','fClear','Formatierung entfernen') + '<button type="button" class="ok" data-inl="done" title="Fertig (Esc)">Fertig</button>';
  var picker = bar.querySelector('.inl-ink-picker');
  picker.addEventListener('change', function(){ inlApplyInk(picker); });
  bar.addEventListener('mousedown', function(e){ e.preventDefault(); }); /* Markierung im Text behalten */
  bar.addEventListener('click', function(e){
    var btn = e.target.closest('[data-inl]'); if(!btn) return; var a = btn.getAttribute('data-inl');
    if(a === 'bold' || a === 'italic' || a === 'underline') inlCmd(a);
    else if(a === 'hl') inlWrap('fp-ul', 'span');
    else if(a === 'ink') inlPickInk(picker);
    else if(a === 'accent') inlWrap('fp-hl', 'span');
    else if(a === 'mark') inlWrap('fp-mk', 'mark');
    else if(a === 'small') inlSize(-2); else if(a === 'big') inlSize(2);
    else if(a === 'align') inlAlign(btn.getAttribute('data-v'));
    else if(a === 'clear') inlClear();
    else if(a === 'done') inlStop();
    else if(a === 'link'){
      var sel = getSelection(), r = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null; if(!r || r.collapsed){ toast('Markiere zuerst den Text für den Link'); return; }
      promptBox('Link einfügen', 'Adresse (https://…)', 'https://', function(u){ if(!inl) return; inl.el.focus(); var s2 = getSelection(); s2.removeAllRanges(); s2.addRange(r); if(/^(https?:\/\/|mailto:)/.test(u)) document.execCommand('createLink', false, u); inlInput(); });
    }
  });
  document.body.appendChild(bar);
  if(!scr._inlScroll){ scr._inlScroll = true; scr.addEventListener('scroll', inlPlace, {passive:true}); }
  inlPlace(); inlState();
}
/* Leiste über der Markierung, sonst über dem Text; unter dem Text, wenn oben kein Platz ist */
function inlPlace(){
  var bar = $('#inlbar'), scr = $('#scr'); if(!bar || !scr || !inl) return;
  var sel = getSelection(), rr = null;
  if(sel.rangeCount && !sel.getRangeAt(0).collapsed && inl.el.contains(sel.getRangeAt(0).commonAncestorContainer)) rr = sel.getRangeAt(0).getBoundingClientRect();
  /* Feste Position im Fenster, damit die Leiste breiter als das Handy sein darf */
  var r = rr && rr.width ? rr : inl.el.getBoundingClientRect(), sr = scr.getBoundingClientRect();
  var top = r.top - bar.offsetHeight - 10, below = false;
  if(top < Math.max(8, sr.top - 40)){ top = r.bottom + 10; below = true; }
  bar.classList.toggle('below', below);
  bar.style.top = top + 'px';
  bar.style.left = Math.max(8, Math.min(innerWidth - bar.offsetWidth - 8, r.left + r.width / 2 - bar.offsetWidth / 2)) + 'px';
}
function inlState(){
  var bar = $('#inlbar'); if(!bar || !inl) return;
  var sel = getSelection(), node = sel.rangeCount ? sel.getRangeAt(0).commonAncestorContainer : null; node = node && (node.nodeType === 1 ? node : node.parentNode);
  if(node && inl.el.contains(node)){
    inl.lastRange = sel.getRangeAt(0).cloneRange();
    bar.querySelector('[data-inl="ink"]').style.setProperty('--ink-swatch', getComputedStyle(node).color);
  }
  [['bold','strong,b'],['italic','em,i'],['underline','u'],['hl','.fp-ul'],['accent','.fp-hl'],['mark','mark']].forEach(function(x){ var b2 = bar.querySelector('[data-inl="'+x[0]+'"]'); if(b2) b2.classList.toggle('on', !!(node && inl.el.contains(node) && node.closest(x[1]))); });
  var al = inl.b.props.align || 'left'; bar.querySelectorAll('[data-inl="align"]').forEach(function(b2){ b2.classList.toggle('on', b2.getAttribute('data-v') === al); });
}
document.addEventListener('selectionchange', function(){ if(inl){ inlState(); inlPlace(); } });
window.addEventListener('resize', function(){ if(inl) inlPlace(); });
/* Doppelklick startet die Bearbeitung, ein zweiter Klick auf ein markiertes Element ebenso; Klick daneben beendet sie */
document.addEventListener('dblclick', function(e){
  var blk = e.target.closest && e.target.closest('#scr .fp-b[data-bid]'); if(!blk || inl && inl.blk === blk) return;
  var id = blk.getAttribute('data-bid'); if(S.sel !== id) selectBlock(id);
  var b = selBlock(); if(!b || !INL[b.type]) return;
  e.preventDefault(); inlStart(id, e.clientX, e.clientY);
});
document.addEventListener('mousedown', function(e){
  if(!inl) return;
  if(e.target.closest('#inlbar') || inl.el.contains(e.target) || e.target.closest('.mbg')) return;
  inlStop();
}, true);
document.addEventListener('click', function(e){
  if(inl || S.paint) return;
  var blk = e.target.closest && e.target.closest('#scr .fp-b[data-bid]'); if(!blk || e.target.closest('#btool')) return;
  var id = blk.getAttribute('data-bid'); if(S.sel !== id || e.detail > 1) return;
  var b = selBlock(), t = inlTarget(blk, b); if(!t) return;
  var r = t.el.getBoundingClientRect();
  if(e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom){ e.stopPropagation(); setTimeout(function(){ if(!inl) inlStart(id, e.clientX, e.clientY); }, 0); }
}, true);

/* Zeilenhöhe, die gerade gilt (Theme oder Vorlage), als Platzhalter */
function b0lh(p){ var t = (F() && F().theme) || {}, b = selBlock(); if(b && b.type === 'heading'){ var m = /\.fp-h1,\.fp-h2,\.fp-h3\{line-height:([\d.]+)/.exec(t.customCss || ''); return t.headingLh || (m ? m[1] : 1.15); } return t.lineHeight || 1.55; }
/* ================= Format übertragen (wie der Pinsel in Word) =================
   Kopiert alle Gestaltungs-Eigenschaften eines Elements – ohne Inhalt – und überträgt sie auf ein anderes, auch auf anderen Seiten.
   Gleicher Typ: sieht danach genauso aus. Anderer Typ: Stil, Abstände, Ausrichtung (bei Texten auch Größe und Zeilenhöhe). */
var FMT_SKIP = {id:1, text:1, label:1, question:1, desc:1, sub:1, options:1, items:1, src:1, photos:1, names:1, quote:1, name:1, role:1, img:1, url:1, before:1, after:1, labelBefore:1, labelAfter:1, alt:1, key:1, required:1, action:1, target:1, waNumber:1, waText:1, placeholder:1, inputType:1, min:1, max:1, step:1, def:1, unit:1, isQuantity:1, qtyFactor:1, routes:1, slots:1, blocked:1, excludeDays:1, days:1, offset:1, dur:1, where:1, code:1, score:1, count:1, source:1, title:1, totalLabel:1, prefix:1, note:1, cta:1, hint:1, accept:1, minutes:1, texts:1, json:1, emojis:1, faceLabels:1, minLabel:1, maxLabel:1, multi:1, maxSelect:1, autoNext:1, showPrices:1, validDays:1, more:1, rows:1, x:1, y:1, duration:1, start:1, logic:1, pos:1, noHolidays:1, showItems:1, faq:1};
var FMT_CROSS = {align:1, mt:1, mb:1, half:1};
var FMT_TEXTY = {heading:1, text:1};
var FCLIP = null;
try{ FCLIP = JSON.parse(localStorage.getItem('tt-fclip') || 'null'); }catch(x){}
function fmtCopy(paint){
  var b = selBlock(); if(!b) return;
  var pr = {}; Object.keys(b.props || {}).forEach(function(k){ if(!FMT_SKIP[k]) pr[k] = clone(b.props[k]); });
  FCLIP = {type:b.type, props:pr}; try{ localStorage.setItem('tt-fclip', JSON.stringify(FCLIP)); }catch(x){}
  if(paint){ S.paint = true; document.body.classList.add('painting'); toast('Format kopiert – klicke auf ein Element, um es zu übertragen (Esc bricht ab)'); }
  else toast('Format von „'+(BNAME[b.type]||b.type)+'“ kopiert – mit ⌥⌘V auf ein anderes Element übertragen');
  renderRight();
}
function fmtStop(){ S.paint = false; document.body.classList.remove('painting'); }
function fmtKeyOk(k, same, texty){ return same ? !FMT_SKIP[k] : (STYLE_KEYS.indexOf(k) >= 0 || FMT_CROSS[k] || (texty && (k === 'size' || k === 'lh' || k === 'hl'))); }
function fmtApply(b){
  if(!FCLIP || !b) return;
  var same = b.type === FCLIP.type, texty = FMT_TEXTY[b.type] && FMT_TEXTY[FCLIP.type];
  snap(true);
  /* zuerst alte Gestaltung entfernen, damit es danach wirklich gleich aussieht */
  Object.keys(b.props).forEach(function(k){ if(fmtKeyOk(k, same, texty) && !(k in FCLIP.props)) delete b.props[k]; });
  Object.keys(FCLIP.props).forEach(function(k){ if(fmtKeyOk(k, same, texty)) b.props[k] = clone(FCLIP.props[k]); });
  touch(); renderCanvas(true); renderRight();
  toast(same ? 'Format übertragen' : 'Stil übertragen (anderer Element-Typ: Schrift, Farben, Box und Abstände)');
}
/* Klick im Pinsel-Modus überträgt das Format auf das angeklickte Element */
document.addEventListener('click', function(e){
  if(!S.paint) return;
  if(e.target.closest && e.target.closest('#btool')) return;
  var blk = e.target.closest && e.target.closest('#scr .fp-b[data-bid]');
  if(!blk){ if(e.target.closest && e.target.closest('#scr')) fmtStop(); return; } /* Seitenwechsel & Menüs lassen den Pinsel aktiv */
  e.preventDefault(); e.stopPropagation();
  var id = blk.getAttribute('data-bid'), b = curPage().blocks.filter(function(x){ return x.id === id; })[0];
  fmtStop(); S.sel = id; S.rtab = 'el'; fmtApply(b); renderLeft();
}, true);

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
      + '<div '+phoneAttrs(dev==='desk')+'><div class="notch"></div><div class="scr" data-fp-scroll style="background:'+esc(f.theme.bg)+'"><div class="sbar" style="color:'+esc(f.theme.text)+';background:'+esc(f.theme.bg)+'"><span>9:41</span><i></i></div><div class="fp-host" id="pvhost"></div></div></div>'
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
  /* Meta-Pixel: mit aktivem Cookie-Banner erst nach Einwilligung in Marketing */
  var pixel = s.pixel ? '<script>window.__ttPixel=function(){if(window.fbq)return;!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","'+String(s.pixel).replace(/[^0-9]/g,'')+'");fbq("track","PageView");};'+(s.ccOn?'':'window.__ttPixel();')+'<\/script>' : '';
  var init = 'var F=' + data + ';\n'
    + 'var W=F.settings.webhook||"";\n'
    + 'var Q={};try{new URLSearchParams(location.search).forEach(function(v,k){Q[k]=v;});}catch(e){}\n'
    + 'function send(type,payload){if(!W)return;try{fetch(W,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(Object.assign({type:type,funnelId:F.id,funnel:F.name,ts:new Date().toISOString(),url:location.href,utm:Q},payload||{}))}).catch(function(){});}catch(e){}}\n'
    + 'FP.mount(document.getElementById("funnel"),F,{live:true,history:true,\n'
    + ' onConsent:function(v){if(v&&v.mkt&&window.__ttPixel)window.__ttPixel();},\n'
    + ' onSubmit:function(lead){if(FP.consentOn(F))lead.consent=FP.getConsent(F);if(lead.onepage){if(W){try{fetch(W,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(lead.onepage)}).catch(function(){});}catch(e){}}}else send("lead",{lead:lead});if(window.fbq)fbq("track","Lead",{value:lead.total||0,currency:F.settings.currency||"EUR"});if(F.settings.redirect)setTimeout(function(){location.href=F.settings.redirect;},1200);},\n'
    + ' onEvent:function(t,d){if(F.settings.trackEvents)send("event",{event:t,data:d});}\n'
    + '});';
  return '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>' + esc(f.name) + '</title>\n<meta name="theme-color" content="' + esc(f.theme.bg) + '">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' + fontLinks + '\n'
    + '<style>html,body{margin:0;min-height:100%;background:' + esc(f.theme.bg) + '}html{-webkit-text-size-adjust:100%;overscroll-behavior-y:none}#funnel{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;max-width:560px;margin:0 auto;padding-top:env(safe-area-inset-top)}#funnel>.fp{flex:1}\n' + css + '</style>\n' + pixel + '\n</head>\n<body>\n<div id="funnel"></div>\n<script>\n' + js + '\n<\/script>\n<script>\n' + init + '\n<\/script>\n</body>\n</html>';
}
/* ---- Funnel anlegen: Assistent (Vorlage → Details) ---- */
function uniqueName(n){ var names = db.funnels.map(function(f){ return f.name; }); if(names.indexOf(n) < 0) return n; for(var i = 2; ; i++){ var c = n + ' (' + i + ')'; if(names.indexOf(c) < 0) return c; } }
/* Reservierte Adressen: kollidieren mit Seiten von TapTell selbst. Dieselbe Liste landet per build.py in vercel.json. */
var RESERVED_SLUGS = ['index','f','src','assets','landing','design','docs','supabase','app','api','admin','auth','login','logout','signup','register','account','settings','dashboard','embed','config','www','impressum','datenschutz','agb','kontakt','preise','hilfe','support','status','static','public'];
function slugReserved(s){ return RESERVED_SLUGS.indexOf(s) >= 0; }
function slugTaken(s, exceptId){ return slugReserved(s) || db.funnels.some(function(f){ return f.slug === s && f.id !== exceptId; }); }
function slugError(s, exceptId){ return !s ? 'Bitte gib eine Adresse ein.' : slugReserved(s) ? 'Diese Adresse ist für TapTell reserviert.' : slugTaken(s, exceptId) ? 'Diese Adresse ist schon vergeben.' : ''; }
function uniqueSlug(base, exceptId){ base = slug(base).slice(0, 48) || 'funnel'; var s = base, i = 2; while(slugTaken(s, exceptId)) s = base + '-' + (i++); return s; }
function linkBase(){ return publicUrl({slug:''}).replace(/\/$/, '') + '/'; }
function loadFontsFor(f){ FP.usedFonts(f).forEach(function(n){ var u = FP.fontLink(n); if(!u || document.querySelector('link[data-ff="'+n+'"]')) return; var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; l.setAttribute('data-ff', n); document.head.appendChild(l); }); }
function newFunnelModal(){
  var W = {step:1, tpl:null, d:null, name:'', slug:'', slugEdited:false, clientId:'', shared:false, q:'', ai:{prompt:'', company:'', brand:'', address:'du', busy:false, err:'', note:''}};
  var tplList = T.TEMPLATES.map(function(t){ return {id:t.id, d:t.make()}; });
  var m = modal({title:'Neuen Funnel erstellen', size:'wide wiz', body:'', foot:'<span></span>'});
  var el = m.el, mb = el.querySelector('.mb'), mf = el.querySelector('.mf'), mh = el.querySelector('.mh > div');
  var steps = function(){ var cur = W.step === 'ai' ? 1 : W.step; return '<div class="wsteps">'+[['1', W.step === 'ai' || W.tpl === 'ai' ? 'Mit KI beschreiben' : 'Vorlage wählen'],['2','Details & Vorschau']].map(function(s, i){ return '<span class="ws'+(cur===i+1?' on':'')+(cur>i+1?' done':'')+'"><b>'+(cur>i+1?I('check',12):s[0])+'</b>'+s[1]+'</span>'; }).join('<i></i>')+'</div>'; };
  function grid(){
    var q = W.q.toLowerCase();
    var shown = tplList.filter(function(x){ return (S.tcat === 'Alle' || x.d.cats.indexOf(S.tcat) >= 0 || x.id === 'blank') && (!q || (x.d.name+' '+x.d.desc).toLowerCase().indexOf(q) >= 0); });
    return shown.length ? '<div class="tgrid">' + shown.map(function(x){ var f = {pages:x.d.pages, theme:x.d.theme, settings:x.d.settings||{}}; TPLPREV[x.id] = f; return '<div class="tcard" role="button" tabindex="0" data-w="pick" data-id="'+x.id+'"><div class="thumb">'+mini(f)+'</div><div class="tm"><b>'+esc(x.d.name)+'</b><span>'+esc(x.d.desc)+'</span><div class="tags">'+x.d.cats.map(function(c){ return '<span class="tag'+(c==='Konfigurator'?' a':'')+'">'+c+'</span>'; }).join('')+'<span class="tag">'+x.d.pages.length+' Seiten</span></div></div></div>'; }).join('') + '</div>'
      : '<div class="wempty">Keine Vorlage gefunden. <button class="btn sm" data-w="pick" data-id="blank">Leer starten</button></div>';
  }
  function render(){
    mh.innerHTML = '<h2>Neuen Funnel erstellen</h2>' + steps();
    if(W.step === 'ai'){ renderAi(); return; }
    if(W.step === 1){
      mb.innerHTML = '<button class="aicard" data-w="ai"><span class="aic">'+I('sparkles',20)+'</span><span class="ait"><b>Mit KI erstellen</b><span>Beschreibe in einem Satz, was der Funnel können soll. Fragen, Texte, Logik, Bilder und Design entstehen automatisch.</span></span>'+I('right',16)+'</button>'
        + '<div class="wbar"><label class="search" style="min-width:0;flex:1;max-width:320px;height:36px">'+I('search')+'<input id="wq" placeholder="Vorlage suchen …" value="'+esc(W.q)+'"></label><div class="tfil" style="margin:0">'+T.CATS.map(function(c){ return '<button class="chip'+(S.tcat===c?' on':'')+'" data-w="cat" data-v="'+c+'">'+c+'</button>'; }).join('')+'</div></div><div id="wgrid">'+grid()+'</div>';
      mf.innerHTML = '<span class="hint" style="margin:0 auto 0 0">Inhalte, Design und Logik kannst du danach frei anpassen.</span><button class="btn" data-close>Abbrechen</button>';
      var qi = mb.querySelector('#wq'); qi.oninput = function(){ W.q = qi.value; mb.querySelector('#wgrid').innerHTML = grid(); }; setTimeout(function(){ qi.focus(); }, 30);
      return;
    }
    var d = W.d, f = {pages:d.pages, theme:d.theme, settings:d.settings||{}};
    var serr = slugError(W.slug);
    mb.innerHTML = '<div class="wz2"><div class="wzprev"><div class="wzph"><span>'+I('play',13)+'Vorschau – klick dich durch</span><button class="btn ghost sm" data-w="restart">'+I('refresh',13)+'Neu starten</button></div><div class="phone wzphone"><div class="notch"></div><div class="scr" data-fp-scroll style="background:'+esc(d.theme.bg)+'"><div class="sbar" style="color:'+esc(d.theme.text)+'"><span>9:41</span><i></i></div><div class="fp-host" id="wzhost"></div></div></div></div>'
      + '<div class="wzform"><div class="wztpl"><span class="tag a">'+(W.tpl === 'ai' ? 'KI-Entwurf' : 'Vorlage')+'</span><b>'+esc(d.name)+'</b><p>'+esc(d.desc)+'</p><div class="wzpages">'+d.pages.map(function(p, i){ return '<span>'+(i+1)+' · '+esc(p.name)+'</span>'; }).join('')+'</div></div>'
      + '<div class="fld"><label>Name des Funnels</label><input class="inp" id="wname" value="'+esc(W.name)+'" placeholder="z. B. Tischkonfigurator Frühjahr"><div class="hint">Nur intern sichtbar – im Dashboard und im Kundenportal.</div></div>'
      + '<div class="fld"><label>Kunde</label><select class="inp" id="wclient"><option value="">– Intern (kein Kunde) –</option>'+(db.clients||[]).map(function(c){ return '<option value="'+c.id+'"'+(W.clientId===c.id?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('')+'</select>'
      + (W.clientId ? '<label class="tgl" style="margin-top:8px"><span>Direkt im Kundenportal freischalten</span><input type="checkbox" id="wshare"'+(W.shared?' checked':'')+'><span class="sw"></span></label>' : '<div class="hint">Optional. Zugeordnete Funnels kann der Kunde in seinem Login sehen, sobald du sie freischaltest.</div>') + '</div>'
      + '<div class="fld"><label>Link-Adresse</label><div class="slugf'+(serr?' err':'')+'"><span>'+esc(linkBase())+'</span><input id="wslug" value="'+esc(W.slug)+'" spellcheck="false"></div><div class="hint'+(serr?' errt':'')+'">'+(serr || 'Unter dieser Adresse ist der Funnel erreichbar, sobald er live ist.')+'</div></div></div></div>';
    mf.innerHTML = '<button class="btn" data-w="back" style="margin-right:auto">'+I('left',14)+(W.tpl === 'ai' ? 'Neu beschreiben' : 'Andere Vorlage')+'</button><button class="btn" data-close>Abbrechen</button><button class="btn pri" data-w="create"'+(serr||!W.name.trim()?' disabled':'')+'>Funnel erstellen'+I('right',14)+'</button>';
    mountPreview();
    var ni = mb.querySelector('#wname'), si = mb.querySelector('#wslug'), ci = mb.querySelector('#wclient'), sh = mb.querySelector('#wshare');
    var refreshState = function(){ var e = slugError(W.slug); si.parentNode.classList.toggle('err', !!e); var h = si.parentNode.nextElementSibling; h.classList.toggle('errt', !!e); h.textContent = e || 'Unter dieser Adresse ist der Funnel erreichbar, sobald er live ist.'; mf.querySelector('[data-w="create"]').disabled = !!e || !W.name.trim(); };
    ni.oninput = function(){ W.name = ni.value; if(!W.slugEdited){ W.slug = uniqueSlug(W.name); si.value = W.slug; } refreshState(); };
    ni.onkeydown = function(e){ if(e.key === 'Enter') create(); };
    si.oninput = function(){ W.slugEdited = true; var v = slug(si.value); W.slug = v; refreshState(); };
    si.onblur = function(){ si.value = W.slug; };
    ci.onchange = function(){ W.clientId = ci.value; if(!W.clientId) W.shared = false; render(); };
    if(sh) sh.onchange = function(){ W.shared = sh.checked; };
    setTimeout(function(){ ni.focus(); ni.select(); }, 30);
  }
  /* ---- KI-Erstellung: Beschreibung → Entwurf (Supabase-Funktion ai-funnel, sonst passende Vorlage) ---- */
  var AI_EX = ['Konfigurator für Carports aus Holz oder Alu, Preise ab 3.900 €, mit Kontaktformular','Feedback-Funnel für ein Café: Zufriedene zu Google, Kritik an uns','Bewerbung für Elektriker in 60 Sekunden, ohne Lebenslauf','Terminbuchung für eine Physiotherapie-Praxis mit Wunschtermin'];
  function renderAi(){
    var A = W.ai;
    if(A.busy){
      mb.innerHTML = '<div class="aibusy"><div class="fp" style="--p:var(--acc);--tx:var(--ink);--mt:var(--mut);background:transparent">'+FP.renderBlock({id:'aild', type:'loader', props:{anim:'orbit', size:140, duration:9, texts:['Struktur planen …','Fragen formulieren …','Antworten und Logik festlegen …','Bilder und Farben wählen …','Texte auf Conversion trimmen …'], showBar:true}}, {f:{theme:{}, settings:{}, pages:[]}, answers:{}})+'</div><b>Dein Funnel entsteht</b><span>Das dauert meist 20 bis 60 Sekunden.</span></div>';
      mf.innerHTML = '<span></span>';
      FP.playLoaders(mb, {theme:{}});
      return;
    }
    mb.innerHTML = '<div class="aiform">'
      + '<div class="fld"><label>Was soll der Funnel können?</label><textarea class="inp" id="aiprompt" rows="4" placeholder="z. B. Konfigurator für Badsanierungen mit Preisspanne, für Hausbesitzer im Raum Köln. Am Ende Rückruf anfragen.">'+esc(A.prompt)+'</textarea>'
      + '<div class="aiex">'+AI_EX.map(function(x){ return '<button class="chip" data-w="aiex" data-v="'+esc(x)+'">'+esc(x.length > 46 ? x.slice(0, 44) + ' …' : x)+'</button>'; }).join('')+'</div></div>'
      + '<div class="row2"><div class="fld"><label>Firmenname (optional)</label><input class="inp" id="aicompany" value="'+esc(A.company)+'" placeholder="z. B. Bad & Raum GmbH"></div>'
      + '<div class="fld"><label>Markenfarbe (optional)</label><div style="display:flex;gap:8px"><input type="color" id="aibrandc" value="'+esc(A.brand || '#2563eb')+'" class="aicolor"><input class="inp" id="aibrand" value="'+esc(A.brand)+'" placeholder="Automatisch"></div></div></div>'
      + '<div class="fld"><label>Anrede</label><div class="segf" style="max-width:240px"><button data-w="aiaddr" data-v="du" class="'+(A.address !== 'sie' ? 'on' : '')+'">Du</button><button data-w="aiaddr" data-v="sie" class="'+(A.address === 'sie' ? 'on' : '')+'">Sie</button></div></div>'
      + (A.err ? '<div class="aierr">'+I('help',15)+'<div><b>'+esc(A.err)+'</b><span>Du kannst stattdessen eine passende Vorlage als Entwurf verwenden.</span><button class="btn sm" data-w="aifallback">Passende Vorlage verwenden</button></div></div>' : '')
      + (!REMOTE ? '<div class="hint" style="margin-top:4px">Demo-Modus: Ohne KI-Anbindung wird die passende Branchen-Vorlage mit deinen Angaben angepasst.</div>' : '')
      + '</div>';
    mf.innerHTML = '<button class="btn" data-w="aiback" style="margin-right:auto">'+I('left',14)+'Zu den Vorlagen</button><button class="btn" data-close>Abbrechen</button><button class="btn pri" data-w="aigo"'+(A.prompt.trim().length < 8 ? ' disabled' : '')+'>'+I('sparkles',14)+'Funnel erstellen</button>';
    var pi = mb.querySelector('#aiprompt'), ci = mb.querySelector('#aicompany'), bi = mb.querySelector('#aibrand'), bc = mb.querySelector('#aibrandc');
    pi.oninput = function(){ A.prompt = pi.value; mf.querySelector('[data-w="aigo"]').disabled = A.prompt.trim().length < 8; };
    pi.onkeydown = function(e){ if(e.key === 'Enter' && (e.metaKey || e.ctrlKey) && A.prompt.trim().length >= 8) aiGenerate(); };
    ci.oninput = function(){ A.company = ci.value; };
    bi.oninput = function(){ var v = bi.value.trim(); A.brand = /^#[0-9a-f]{6}$/i.test(v) ? v : ''; if(A.brand) bc.value = A.brand; };
    bc.oninput = function(){ A.brand = bc.value; bi.value = bc.value; };
    setTimeout(function(){ pi.focus(); }, 30);
  }
  function aiApply(spec, note){
    var d = T.fromSpec(spec);
    W.tpl = 'ai'; W.d = d; W.ai.note = note || ''; W.name = uniqueName(d.name); W.slug = uniqueSlug(W.name); W.slugEdited = false; W.step = 2; render(); mb.scrollTop = 0;
    if(note) toast(note);
  }
  function aiUseFallback(){ var A = W.ai, r = T.aiFallback(A.prompt, A); aiApply(r.spec, r.matched ? 'Entwurf aus der passenden Vorlage erstellt' : 'Keine passende Branche erkannt – Entwurf aus einer allgemeinen Vorlage'); }
  async function aiGenerate(){
    var A = W.ai; if(A.busy || A.prompt.trim().length < 8) return;
    if(!REMOTE || !sb){ aiUseFallback(); return; }
    A.busy = true; A.err = ''; render();
    try{
      var r = await sb.functions.invoke('ai-funnel', {body:{prompt:A.prompt, company:A.company, brand:A.brand, address:A.address}});
      if(r.error){ var msg = ''; try{ msg = (await r.error.context.json()).error; }catch(x){} throw new Error(msg || 'Die KI ist gerade nicht erreichbar.'); }
      if(!r.data || !r.data.spec) throw new Error('Die KI hat keinen Entwurf geliefert.');
      A.busy = false;
      if(!el.isConnected) return;
      aiApply(r.data.spec, '');
    }catch(e){ A.busy = false; A.err = e.message || 'Die KI ist gerade nicht erreichbar.'; if(el.isConnected) render(); }
  }
  function mountPreview(){
    var old = mb.querySelector('#wzhost'); if(!old) return;
    var host = document.createElement('div'); host.className = 'fp-host'; host.id = 'wzhost'; old.replaceWith(host); /* frisches Element: keine doppelten Klick-Handler */
    var f = T.clone({pages:W.d.pages, theme:W.d.theme, settings:W.d.settings||{}});
    loadFontsFor(f); injectUploaded();
    FP.mount(host, f, {live:false});
  }
  function pick(id){ W.tpl = id; W.d = tplList.filter(function(x){ return x.id === id; })[0].d; W.name = uniqueName(W.d.name); W.slug = uniqueSlug(W.name); W.slugEdited = false; W.step = 2; render(); mb.scrollTop = 0; }
  function create(){
    if(!W.name.trim() || !W.slug || slugTaken(W.slug)) return;
    var ov = {name:W.name.trim(), slug:W.slug, clientId:W.clientId || null, shared:!!(W.clientId && W.shared)};
    var f = W.tpl === 'ai' ? T.newFunnelFrom(T.clone(W.d), 'ai', ov) : T.newFunnel(W.tpl, ov);
    if(db.defaults && db.defaults.webhook && !f.settings.webhook) f.settings.webhook = db.defaults.webhook;
    db.funnels.unshift(f); save(true);
    m.close();
    toast('Funnel „'+f.name+'“ erstellt');
    go('editor', f.id);
  }
  el.addEventListener('click', function(e){
    var w = e.target.closest('[data-w]'); if(!w) return;
    var a = w.getAttribute('data-w');
    if(a === 'cat'){ S.tcat = w.getAttribute('data-v'); $$('[data-w="cat"]', el).forEach(function(b){ b.classList.toggle('on', b === w); }); mb.querySelector('#wgrid').innerHTML = grid(); }
    else if(a === 'pick') pick(w.getAttribute('data-id'));
    else if(a === 'back'){ W.step = W.tpl === 'ai' ? 'ai' : 1; render(); }
    else if(a === 'ai'){ W.step = 'ai'; W.ai.err = ''; render(); }
    else if(a === 'aiback'){ W.step = 1; render(); }
    else if(a === 'aiex'){ W.ai.prompt = w.getAttribute('data-v'); render(); }
    else if(a === 'aiaddr'){ W.ai.address = w.getAttribute('data-v'); $$('[data-w="aiaddr"]', el).forEach(function(b){ b.classList.toggle('on', b === w); }); }
    else if(a === 'aigo') aiGenerate();
    else if(a === 'aifallback') aiUseFallback();
    else if(a === 'restart') mountPreview();
    else if(a === 'create') create();
  });
  el.addEventListener('keydown', function(e){ if(e.key === 'Enter' && W.step === 1){ var c = e.target.closest('[data-w="pick"]'); if(c) pick(c.getAttribute('data-id')); } });
  render();
}
function createFromTpl(id){
  var f = T.newFunnel(id, {name:uniqueName(T.TEMPLATES.filter(function(t){ return t.id === id; })[0].make().name)});
  f.slug = uniqueSlug(f.name);
  if(db.defaults && db.defaults.webhook && !f.settings.webhook) f.settings.webhook = db.defaults.webhook;
  db.funnels.unshift(f); save(true);
  toast('Funnel „'+f.name+'“ erstellt');
  go('editor', f.id);
}

/* ---- Ablauf: Kanten, Erreichbarkeit, Übersicht ---- */
function flowEdges(f){
  var ids = f.pages.map(function(p){ return p.id; }), n = f.pages.length;
  return f.pages.map(function(p, i){
    var out = [], idx = function(id){ return ids.indexOf(id); }, coversAll = false;
    (p.logic||[]).forEach(function(r){ if(r.goto && (r.cond||[]).some(function(c){ return c.bid; })) out.push({to:idx(r.goto), label:lgRuleLabel(f, r), kind:'if', logic:true}); });
    p.blocks.forEach(function(b){
      var pr = b.props || {};
      if(b.type === 'choice' && !pr.multi){
        var opts = pr.options || [], routed = opts.filter(function(o){ return o.goto; });
        routed.forEach(function(o){ out.push({to:idx(o.goto), label:'Wenn „'+o.label+'“', kind:'if'}); });
        if(routed.length && routed.length === opts.length) coversAll = true;
      }
      if(b.type === 'button' && pr.action === 'page' && pr.target) out.push({to:idx(pr.target), label:'Button „'+(pr.label||'')+'“', kind:'btn'});
      if(b.type === 'button' && pr.action === 'submit' && pr.target) out.push({to:idx(pr.target), label:'Nach Absenden', kind:'btn'});
      if(b.type === 'rating' && (pr.routes||[]).length){
        var rmx = FP.rateMax(pr), cov = {};
        pr.routes.forEach(function(r){ if(!r.goto) return; out.push({to:idx(r.goto), label:'Bewertung '+r.min+(+r.max!==+r.min?'–'+r.max:''), kind:'if'}); for(var q=+r.min;q<=+r.max;q++) cov[q] = 1; });
        var all = true; for(var q2=1;q2<=rmx;q2++) if(!cov[q2]) all = false; if(all) coversAll = true;
      }
    });
    (p.scoreRoutes||[]).forEach(function(r){ if(r.goto) out.push({to:idx(r.goto), label:'Punkte '+r.min+'–'+r.max, kind:'if'}); });
    if(!coversAll){
      if(p.next) out.push({to:idx(p.next), label:out.length ? 'Sonst' : 'Danach', kind:'next'});
      else if(i < n - 1) out.push({to:i + 1, label:out.length ? 'Sonst' : 'Weiter', kind:'next'});
    }
    return out;
  });
}
function flowReach(f){
  var E = flowEdges(f), seen = {0:true}, q = [0];
  while(q.length){ var i = q.shift(); (E[i]||[]).forEach(function(e){ if(e.to >= 0 && !seen[e.to]){ seen[e.to] = true; q.push(e.to); } }); }
  return seen;
}
/* ================= Logik-Builder =================
   Alle Seiten als Karten mit Verbindungslinien. Klick auf eine Seite: „Falls … gehe zu …, sonst …“.
   Regeln liegen pro Seite in page.logic = [{cond:[{bid, op, val}], join:'and'|'or', goto:pageId}] und haben Vorrang vor allen anderen Verzweigungen. */
var LQ = {choice:1, rating:1, slider:1, input:1, checkbox:1, date:1, calendar:1, upload:0};
function logicFields(f, upto){
  var out = [];
  f.pages.forEach(function(p, i){ if(upto != null && i > upto) return; p.blocks.forEach(function(b){ if(LQ[b.type]) out.push({b:b, pi:i}); }); });
  return out;
}
function lgBlock(f, id){ return FP.allBlocks(f).filter(function(x){ return x.id === id; })[0] || null; }
function lgName(b){ var p = (b && b.props) || {}; return String(p.question || p.label || p.text || p.key || (b ? BNAME[b.type] : '') || 'Feld').replace(/[*_=+\[\]{}|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 70) || (b ? BNAME[b.type] : 'Feld'); }
var LOPS = {choice:[['is','ist'],['isnot','ist nicht']], num:[['eq','ist gleich'],['gte','mindestens'],['lte','höchstens'],['gt','größer als'],['lt','kleiner als']], text:[['is','ist'],['isnot','ist nicht'],['contains','enthält'],['filled','ist ausgefüllt'],['empty','ist leer']]};
function lgKind(b){ return !b ? 'text' : b.type === 'choice' ? 'choice' : (b.type === 'rating' || b.type === 'slider') ? 'num' : 'text'; }
function lgOpName(k, op){ var o = (LOPS[k] || []).filter(function(x){ return x[0] === op; })[0]; return o ? o[1] : op; }
function lgValName(b, c){ if(c.op === 'filled' || c.op === 'empty') return ''; if(b && b.type === 'choice'){ var o = (b.props.options || []).filter(function(x){ return x.id === c.val; })[0]; return o ? '„' + o.label + '“' : '…'; } return c.val === '' || c.val == null ? '…' : String(c.val); }
function lgRuleLabel(f, r){
  var cs = r.cond || [], c = cs[0]; if(!c) return 'Regel ohne Bedingung';
  var b = lgBlock(f, c.bid), s = b && b.type === 'choice' && c.val ? 'Falls ' + (c.op === 'isnot' ? 'nicht ' : '') + lgValName(b, c) : 'Falls ' + (b ? lgName(b) : 'Feld fehlt') + ' ' + lgOpName(lgKind(b), c.op) + (lgValName(b, c) ? ' ' + lgValName(b, c) : '');
  return cs.length > 1 ? s + (r.join === 'or' ? ' oder …' : ' und …') : s;
}
/* Ebenen von oben nach unten (längster Weg ab der Startseite); Sprünge über mehrere Ebenen und Rücksprünge laufen über seitliche Bahnen */
function lgLayout(f){
  var E = flowEdges(f), n = f.pages.length, depth = [], i, mxd = 0;
  for(i = 0; i < n; i++) depth[i] = i ? -1 : 0;
  for(i = 0; i < n; i++){
    if(depth[i] < 0) depth[i] = mxd + 1; /* nicht erreichbar oder nur per Rücksprung: darunter einreihen */
    mxd = Math.max(mxd, depth[i]);
    (E[i] || []).forEach(function(e){ if(e.to > i) depth[e.to] = Math.max(depth[e.to], depth[i] + 1); });
  }
  var rows = {}, pos = [], W = 190, H = 46, GX = 40, GY = 56, maxRow = 0, R, L = 0, Rn = 0, edges = [];
  for(i = 0; i < n; i++){ rows[depth[i]] = rows[depth[i]] || []; rows[depth[i]].push(i); }
  Object.keys(rows).forEach(function(d){ maxRow = Math.max(maxRow, rows[d].length); });
  E.forEach(function(es, i){ es.forEach(function(e){ if(e.to < 0) return; var kind = depth[e.to] === depth[i] + 1 ? 'adj' : depth[e.to] > depth[i] ? 'skip' : 'back'; edges.push({from:i, to:e.to, e:e, route:kind, lane:kind === 'skip' ? Rn++ : kind === 'back' ? L++ : 0}); }); });
  var inner = Math.max(1, maxRow) * (W + GX) - GX, left = 40 + L * 16, width = left + inner + 40 + Rn * 16;
  Object.keys(rows).forEach(function(d){ R = rows[d]; var rw = R.length * (W + GX) - GX; R.forEach(function(pi, k){ pos[pi] = {x:left + (inner - rw) / 2 + k * (W + GX), y:40 + d * (H + GY)}; }); });
  var maxD = Math.max.apply(null, depth);
  return {E:E, pos:pos, W:W, H:H, width:width, height:40 + (maxD + 1) * (H + GY) + 20, edges:edges, laneL:left - 24, laneR:left + inner + 24};
}
function logicModal(focus){
  var f = F(); if(!f) return;
  var L = {pi:focus != null ? focus : S.pi, open:false, z:1};
  var drawCanvas = function(){
    var g = lgLayout(f), reach = flowReach(f), c = L.el.querySelector('#lgc'), W = g.W, H = g.H;
    var paths = '', labels = '';
    g.edges.forEach(function(ed){
      var e = ed.e, a = g.pos[ed.from], b = g.pos[ed.to]; if(!a || !b) return;
      var d, mx, my, r = 8;
      if(ed.route === 'adj'){
        /* eckig mit runden Kurven: runter, quer, runter */
        var sx = a.x + W / 2, sy = a.y + H, tx = b.x + W / 2, ty = b.y, midY = sy + (ty - sy) / 2;
        if(Math.abs(tx - sx) < 1){ d = 'M'+sx+' '+sy+' V'+(ty-6); }
        else { var hs = tx > sx ? 1 : -1, rr = Math.min(r, Math.abs(tx - sx) / 2); d = 'M'+sx+' '+sy+' V'+(midY - rr)+' Q'+sx+' '+midY+' '+(sx + hs*rr)+' '+midY+' H'+(tx - hs*rr)+' Q'+tx+' '+midY+' '+tx+' '+(midY + rr)+' V'+(ty-6); }
        mx = (sx + tx) / 2; my = midY; if(Math.abs(tx - sx) < 1){ my = (sy + ty) / 2; }
      } else {
        /* rechts nach unten, links nach oben – mit runden Ecken */
        var right = ed.route === 'skip', lx = right ? g.laneR + ed.lane * 16 : g.laneL - ed.lane * 16, sgn = right ? 1 : -1;
        var sx2 = right ? a.x + W : a.x, sy2 = a.y + H / 2, tx2 = right ? b.x + W : b.x, ty2 = b.y + H / 2, vd = ty2 > sy2 ? 1 : -1;
        d = 'M'+sx2+' '+sy2+' H'+(lx - sgn*r)+' Q'+lx+' '+sy2+' '+lx+' '+(sy2 + vd*r)+' V'+(ty2 - vd*r)+' Q'+lx+' '+ty2+' '+(lx - sgn*r)+' '+ty2+' H'+(tx2 + sgn*6);
        mx = lx; my = (sy2 + ty2) / 2;
      }
      paths += '<path class="lge '+e.kind+'" d="'+d+'" marker-end="url(#lgm-'+e.kind+')"/>';
      if(e.kind === 'if' || e.kind === 'btn') labels += '<span class="lgl '+e.kind+'" style="left:'+mx+'px;top:'+my+'px" title="'+esc(e.label)+'">'+esc(e.label.length > 30 ? e.label.slice(0, 29) + '…' : e.label)+'</span>';
    });
    var mk = function(k){ return '<marker id="lgm-'+k+'" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5L8 5L1 8.5" class="lgmk '+k+'"/></marker>'; };
    var nodes = f.pages.map(function(p, i){
      var es = g.E[i] || [], rules = (p.logic || []).filter(function(r){ return r.goto; }).length, un = !reach[i], end = !es.length, branched = es.some(function(e){ return e.kind !== 'next'; });
      var tip = un ? 'Nicht erreichbar' : end ? 'Ende des Funnels' : rules ? rules + (rules === 1 ? ' Regel' : ' Regeln') : branched ? 'Verzweigt' : 'Weiter zu ' + (es[0].to + 1);
      return '<button type="button" class="lgn'+(i === L.pi && L.open ? ' on' : '')+(un ? ' un' : '')+(end ? ' end' : '')+'" data-lgn="'+i+'" title="'+esc(p.name+' · '+tip)+'" style="left:'+g.pos[i].x+'px;top:'+g.pos[i].y+'px;width:'+W+'px;height:'+H+'px"><span class="n">'+(end ? I('flag',12) : i+1)+'</span><b>'+esc(p.name)+'</b>'+(rules || branched ? '<span class="lgi'+(rules ? ' on' : '')+'">'+I('logic',13)+'</span>' : '')+(un ? '<span class="lgi warn">'+I('info',13)+'</span>' : '')+'</button>';
    }).join('');
    L.g = g;
    c.innerHTML = '<div class="lgz" style="width:'+(g.width*L.z)+'px;height:'+(g.height*L.z)+'px"><div class="lgs" style="width:'+g.width+'px;height:'+g.height+'px;transform:scale('+L.z+')"><svg class="lgsv" width="'+g.width+'" height="'+g.height+'" aria-hidden="true"><defs>'+mk('if')+mk('next')+mk('btn')+'</defs>'+paths+'</svg>'+nodes+labels+'<div class="lgpop" id="lgp" hidden></div></div></div>';
  };
  var fieldOpts = function(sel){
    var by = {}, order = [];
    logicFields(f, L.pi).forEach(function(x){ if(!by[x.pi]){ by[x.pi] = []; order.push(x.pi); } by[x.pi].push(x.b); });
    if(!order.length) return '<option value="">Noch keine Fragen bis hier</option>';
    return '<option value="">Feld wählen …</option>' + order.map(function(pi){ return '<optgroup label="'+(pi+1)+'. '+esc(f.pages[pi].name)+'">' + by[pi].map(function(b){ return '<option value="'+b.id+'"'+(b.id === sel ? ' selected' : '')+'>'+esc(lgName(b))+'</option>'; }).join('') + '</optgroup>'; }).join('');
  };
  var drawPanel = function(){
    var p = f.pages[L.pi], el = L.el.querySelector('#lgp'); if(!el) return; if(!p || !L.open){ el.hidden = true; el.innerHTML = ''; return; }
    var rules = p.logic || [];
    var h = '<div class="lgph"><span class="n">'+(L.pi+1)+'</span><b>'+esc(p.name)+'</b><button type="button" class="ibtn" data-lga="closePop" title="Schließen (Esc)">'+I('x',13)+'</button></div>';
    h += rules.map(function(r, ri){
      var cs = r.cond && r.cond.length ? r.cond : [{bid:'', op:'is', val:''}];
      return '<div class="lgrule"><button type="button" class="ibtn lgdel" data-lga="delRule" data-ri="'+ri+'" title="Regel löschen">'+I('trash',13)+'</button>'
        + cs.map(function(c, ci){
            var b = lgBlock(f, c.bid), k = lgKind(b), noVal = c.op === 'filled' || c.op === 'empty', val;
            if(!b || noVal) val = '';
            else if(k === 'choice') val = '<select class="inp" data-lgf="val" data-ri="'+ri+'" data-ci="'+ci+'"><option value="">Antwort wählen …</option>'+(b.props.options || []).map(function(o){ return '<option value="'+o.id+'"'+(o.id === c.val ? ' selected' : '')+'>'+esc(o.label)+'</option>'; }).join('')+'</select>';
            else val = '<input class="inp" '+(k === 'num' ? 'type="number" step="any"' : 'type="text"')+' data-lgf="val" data-ri="'+ri+'" data-ci="'+ci+'" value="'+esc(c.val == null ? '' : c.val)+'" placeholder="Wert">';
            return (ci ? '<div class="lgrow"><span></span><div class="lgjoin"><button type="button" class="'+(r.join !== 'or' ? 'on' : '')+'" data-lga="join" data-v="and" data-ri="'+ri+'">und</button><button type="button" class="'+(r.join === 'or' ? 'on' : '')+'" data-lga="join" data-v="or" data-ri="'+ri+'">oder</button></div></div>' : '')
              + '<div class="lgrow"><span class="lgw">'+(ci ? '' : 'Falls')+'</span><div class="lgcond"><select class="inp" data-lgf="bid" data-ri="'+ri+'" data-ci="'+ci+'">'+fieldOpts(c.bid)+'</select>'
              + (b ? '<div class="lgcr"><select class="inp" data-lgf="op" data-ri="'+ri+'" data-ci="'+ci+'">'+LOPS[k].map(function(o){ return '<option value="'+o[0]+'"'+(o[0] === c.op ? ' selected' : '')+'>'+o[1]+'</option>'; }).join('')+'</select>'+val+'</div>' : '')
              + (cs.length > 1 ? '<button type="button" class="ibtn lgx" data-lga="delCond" data-ri="'+ri+'" data-ci="'+ci+'" title="Bedingung entfernen">'+I('x',12)+'</button>' : '') + '</div></div>';
          }).join('')
        + '<div class="lgrow"><span class="lgw">Gehe zu</span><select class="inp" data-lgf="goto" data-ri="'+ri+'">'+pageOptions(r.goto, 'Seite wählen …')+'</select></div>'
        + '<div class="lgrow"><span></span><button type="button" class="lglink" data-lga="addCond" data-ri="'+ri+'">'+I('plus',12)+'Bedingung hinzufügen</button></div></div>';
    }).join('');
    h += '<button type="button" class="lgadd" data-lga="addRule">'+I('branch',13)+'Regel hinzufügen</button>';
    h += '<div class="lgrow lgelse"><span class="lgw">'+(rules.length ? 'Sonst' : 'Danach')+'</span><select class="inp" data-lgf="next">'+pageOptions(p.next, L.pi < f.pages.length - 1 ? 'Nächste Seite ('+(L.pi+2)+'. '+f.pages[L.pi+1].name+')' : 'Ende – Anfrage absenden')+'</select></div>';
    var other = (flowEdges(f)[L.pi] || []).filter(function(e){ return !e.logic && e.kind !== 'next'; });
    if(other.length) h += '<div class="lgoth"><div class="flab">Weitere Verzweigungen auf dieser Seite</div>' + other.map(function(e){ var t = f.pages[e.to]; return '<div class="lgo">'+esc(e.label)+I('right',12)+(t ? (e.to+1)+'. '+esc(t.name) : 'Seite fehlt')+'</div>'; }).join('') + '<div class="hint">Diese stellst du direkt am Element ein (z. B. bei den Antworten). Regeln oben haben Vorrang.</div></div>';
    h += '<button type="button" class="lglink lgopen" data-lga="open">'+I('pen',12)+'Seite im Editor öffnen</button>';
    el.innerHTML = h; el.hidden = false;
    /* neben der Karte, sonst links davon; nie über den Rand */
    var g = L.g, ps = g.pos[L.pi], pw = 400, x = ps.x + g.W + 14;
    if(x + pw > g.width + 200 && ps.x - pw - 14 > 0) x = ps.x - pw - 14;
    el.style.left = x + 'px'; el.style.top = Math.max(8, ps.y - 8) + 'px';
  };
  var redraw = function(panel){ drawCanvas(); if(panel !== false) drawPanel(); };
  var rule = function(ri){ var p = f.pages[L.pi]; p.logic = p.logic || []; return p.logic[+ri]; };
  modal({title:'Logik', sub:'Klicke auf eine Seite und lege fest, wohin es je nach Antwort weitergeht. Regeln haben Vorrang vor „Sonst“.', size:'logic',
    body:'<div class="lgb"><div class="lgc" id="lgc"></div><div class="lgctl"><button type="button" class="ibtn" data-lga="zin" title="Vergrößern">'+I('plus',14)+'</button><button type="button" class="ibtn" data-lga="zout" title="Verkleinern">'+I('minus',14)+'</button><button type="button" class="ibtn" data-lga="zfit" title="Einpassen">'+I('fit',14)+'</button></div></div>',
    onOpen:function(el, close){
      L.el = el; redraw();
      var fit = function(){ var c = el.querySelector('#lgc'); L.z = Math.max(.4, Math.min(1, (c.clientWidth - 24) / L.g.width, (c.clientHeight - 24) / L.g.height)); redraw(); };
      if(L.g.height > el.querySelector('#lgc').clientHeight || L.g.width > el.querySelector('#lgc').clientWidth) fit();
      /* Esc schließt zuerst das Regel-Fenster, dann den Dialog */
      var onEsc = function(e){ if(e.key === 'Escape' && L.open && document.body.contains(el)){ e.stopImmediatePropagation(); L.open = false; redraw(); } };
      document.addEventListener('keydown', onEsc, true); L.offEsc = function(){ document.removeEventListener('keydown', onEsc, true); };
      el.addEventListener('click', function(e){
        var n = e.target.closest('[data-lgn]'); if(n){ var ni = +n.getAttribute('data-lgn'); L.open = !(L.open && L.pi === ni); L.pi = ni; redraw(); return; }
        var a = e.target.closest('[data-lga]');
        if(!a){ if(L.open && e.target.closest('#lgc') && !e.target.closest('#lgp')){ L.open = false; redraw(); } return; }
        var act = a.getAttribute('data-lga'), ri = a.getAttribute('data-ri'), p = f.pages[L.pi];
        if(act === 'zin'){ L.z = Math.min(1.6, +(L.z + .15).toFixed(2)); redraw(); return; }
        if(act === 'zout'){ L.z = Math.max(.4, +(L.z - .15).toFixed(2)); redraw(); return; }
        if(act === 'zfit'){ fit(); return; }
        if(act === 'closePop'){ L.open = false; redraw(); return; }
        if(act === 'open'){ close(); S.ltab = 'pages'; selectPage(L.pi); renderLeft(); return; }
        snap(true);
        if(act === 'addRule'){ var fl = logicFields(f, L.pi), last = fl[fl.length - 1]; p.logic = (p.logic || []).concat([{cond:[{bid:last ? last.b.id : '', op:last ? LOPS[lgKind(last.b)][0][0] : 'is', val:''}], join:'and', goto:''}]); }
        else if(act === 'delRule'){ p.logic.splice(+ri, 1); }
        else if(act === 'addCond'){ var r = rule(ri); r.cond = (r.cond || []).concat([{bid:'', op:'is', val:''}]); }
        else if(act === 'delCond'){ rule(ri).cond.splice(+a.getAttribute('data-ci'), 1); }
        else if(act === 'join'){ rule(ri).join = a.getAttribute('data-v'); }
        touch(); redraw();
      });
      var upd = function(e, live){
        var x = e.target, k = x.getAttribute && x.getAttribute('data-lgf'); if(!k) return; var p = f.pages[L.pi];
        if(k === 'next'){ snap(true); p.next = x.value; touch(); redraw(); return; }
        var r = rule(x.getAttribute('data-ri')); if(!r) return;
        if(k === 'goto'){ snap(true); r.goto = x.value; touch(); redraw(); return; }
        r.cond = r.cond && r.cond.length ? r.cond : [{bid:'', op:'is', val:''}];
        var c = r.cond[+x.getAttribute('data-ci')]; if(!c) return;
        if(k === 'val'){ snap(); c.val = x.type === 'number' && x.value !== '' ? +x.value : x.value; touch(); if(!live) redraw(); return; } /* beim Tippen nichts neu zeichnen, sonst ginge der Fokus verloren */
        snap(true);
        if(k === 'bid'){ c.bid = x.value; var b = lgBlock(f, c.bid); c.op = LOPS[lgKind(b)][0][0]; c.val = ''; }
        if(k === 'op') c.op = x.value;
        touch(); redraw();
      };
      el.addEventListener('change', function(e){ upd(e, false); });
      el.addEventListener('input', function(e){ if(e.target.matches('input[data-lgf="val"]')) upd(e, true); });
    },
    onClose:function(){ if(L.offEsc) L.offEsc(); renderLeft(); renderCanvas(true); renderRight(); }
  });
}
function flowModal(){ logicModal(); }
function pageJump(anchor){
  var f = F();
  dropdown(anchor, f.pages.map(function(p, i){ return {k:'p'+i, ic:i===S.pi?'check':'file', l:(i+1)+' · '+p.name, fn:function(){ selectPage(i); }}; }).concat(['-', {k:'add', ic:'plus', l:'Seite hinzufügen', fn:addPage}, {k:'flow', ic:'branch', l:'Logik öffnen', fn:flowModal}]));
}

/* ---- Veröffentlichen: Checkliste → Live → Teilen ---- */
function funnelChecks(f){
  var all = FP.allBlocks(f), ids = f.pages.map(function(p){ return p.id; }), out = [];
  var pname = function(i){ return (i+1)+' · '+f.pages[i].name; };
  var broken = [];
  flowEdges(f).forEach(function(es, i){ es.forEach(function(e){ if(e.to < 0 && broken.indexOf(i) < 0) broken.push(i); }); });
  if(broken.length) out.push({lvl:'err', t:'Sprungziel fehlt', d:'Eine Weiterleitung zeigt auf eine gelöschte Seite: '+broken.map(pname).join(', ')+'.', page:broken[0]});
  var reach = flowReach(f), un = f.pages.map(function(p, i){ return i; }).filter(function(i){ return !reach[i]; });
  if(un.length) out.push({lvl:'warn', t:'Nicht erreichbare Seiten', d:un.map(pname).join(', ')+' – keine Antwort oder Weiterleitung führt dorthin.', page:un[0]});
  var contact = all.some(function(b){ return b.type === 'input' && (b.props.inputType === 'email' || b.props.inputType === 'tel'); });
  out.push(contact ? {lvl:'ok', t:'Kontaktdaten werden abgefragt'} : {lvl:'warn', t:'Kein E-Mail- oder Telefonfeld', d:'Ohne Kontaktfeld kannst du auf Anfragen nicht antworten.'});
  var consent = all.some(function(b){ return b.type === 'checkbox'; });
  if(contact) out.push(consent ? {lvl:'ok', t:'Datenschutz-Einwilligung vorhanden'} : {lvl:'warn', t:'Keine Datenschutz-Checkbox', d:'Für Kontaktformulare in der EU empfohlen (DSGVO).'});
  var noImg = [];
  f.pages.forEach(function(p, i){ p.blocks.forEach(function(b){ if((b.type === 'image' && !b.props.src) || (b.type === 'choice' && b.props.layout === 'image' && (b.props.options||[]).some(function(o){ return !o.img; }))) if(noImg.indexOf(i) < 0) noImg.push(i); }); });
  if(noImg.length) out.push({lvl:'warn', t:'Bilder fehlen', d:'Platzhalter ohne Bild auf: '+noImg.map(pname).join(', ')+'.', page:noImg[0]});
  if(REMOTE) out.push({lvl:'ok', t:'Anfragen landen im Dashboard'+(f.settings.webhook?' und am Webhook':'')});
  else out.push(f.settings.webhook ? {lvl:'ok', t:'Webhook für Anfragen hinterlegt'} : {lvl:'warn', t:'Demo-Modus: kein Ziel für Anfragen', d:'Ohne Supabase oder Webhook gehen Anfragen aus dem HTML-Export verloren. Hinterlege einen Webhook unter Funnel → Integrationen.', tab:'set'});
  var c = f.clientId && clientById(f.clientId);
  out.push(c ? (f.shared ? {lvl:'ok', t:'Für '+c.name+' freigeschaltet'} : {lvl:'info', t:c.name+' sieht den Funnel noch nicht', d:'Schalte ihn unter Funnel → Kunde & Freigabe frei, wenn der Kunde ihn sehen soll.', tab:'set'}) : {lvl:'info', t:'Keinem Kunden zugeordnet', d:'Interner Funnel.', tab:'set'});
  return out;
}
function publishModal(f){
  var adv = REMOTE ? 'qr' : 'html', open = false, share = 'link', em = {mode:'inline', width:'', offset:'', label:'Jetzt starten'};
  /* Einbetten-Code: Container + Skript – der Funnel erscheint direkt im Seiteninhalt (Shadow DOM, kein iFrame) */
  var embedCode = function(){
    var at = em.mode === 'popup' ? ' data-mode="popup" data-label="'+esc(em.label||'Jetzt starten')+'"' : em.mode === 'iframe' ? ' data-mode="iframe"' : '';
    if(em.mode !== 'popup' && +em.width) at += ' data-max-width="'+(+em.width)+'"';
    if(em.mode === 'inline' && +em.offset) at += ' data-offset="'+(+em.offset)+'"';
    return '<div data-taptell="'+(f.slug||slug(f.name))+'"'+at+'></div>\n<script src="'+linkBase()+'/embed.js" async><\/script>';
  };
  var shareBody = function(){
    var tabs = '<div class="seg sharetabs">'+[['link','TapTell-Link','link'],['domain','Kundendomain','globe'],['embed','Auf Website einbinden','code']].map(function(x){ return '<button class="'+(share===x[0]?'on':'')+'" data-share="'+x[0]+'">'+I(x[2],13)+x[1]+'</button>'; }).join('')+'</div>';
    var url = publicUrl(f), t = '';
    if(share === 'link'){
      t = '<div class="share"><div class="slugf ro"><span>'+esc(url)+'</span></div><button class="btn sm" data-copyurl>'+I('copy',13)+'Kopieren</button>'+(REMOTE?'<a class="btn sm" href="'+esc(url)+'" target="_blank" rel="noopener">'+I('ext',13)+'Öffnen</a>':'')+'</div>'
        + '<p class="hint">Kurzer Link für WhatsApp, E-Mail, Social Ads und QR-Codes. Die Adresse änderst du unter <b>Funnel → Link-Adresse</b>.'+(REMOTE?'':' Im Demo-Modus ist der Link noch nicht erreichbar.')+'</p>';
    } else if(share === 'domain'){
      t = '<div class="optcards"><div class="optc"><b>'+I('globe',14)+'Eigene Subdomain</b><span>z. B. <code>konfigurator.kunde.de</code> – der Funnel läuft unter der Adresse des Kunden, inklusive SSL. Der Kunde setzt einmal einen DNS-Eintrag (CNAME).</span><button class="btn sm" data-share-domain>'+I('settings',13)+'Domain verbinden</button></div>'
        + '<div class="optc"><b>'+I('link',14)+'Pfad auf der Kunden-Website</b><span>z. B. <code>kunde.de/konfigurator</code> – dafür den Funnel auf dieser Seite <b>einbinden</b> oder die Seite auf den TapTell-Link weiterleiten.</span><button class="btn sm" data-share="embed">'+I('code',13)+'Einbinden</button></div></div>';
    } else {
      t = '<div class="modes">'+[['inline','Im Seiteninhalt','Fügt sich nahtlos in die Website ein – wie bei Tischtrend. Empfohlen.'],['popup','Button mit Popup','Ein Button öffnet den Funnel als Fenster, auf dem Handy als Vollbild.'],['iframe','iFrame','Klassisch, passt die Höhe automatisch an. Für Baukästen ohne Skripte.']].map(function(x){ return '<button class="mode'+(em.mode===x[0]?' on':'')+'" data-emode="'+x[0]+'"><b>'+x[1]+'</b><span>'+x[2]+'</span></button>'; }).join('')+'</div>'
        + '<div class="row3" style="margin-top:12px">'+(em.mode==='popup' ? '<div class="fld" style="grid-column:1/-1"><label>Button-Text</label><input class="inp" data-em="label" value="'+esc(em.label)+'"></div>' : '<div class="fld"><label>Max. Breite (px)</label><input class="inp" type="number" data-em="width" value="'+esc(em.width)+'" placeholder="volle Breite"></div>'+(em.mode==='inline'?'<div class="fld"><label>Abstand oben (px)</label><input class="inp" type="number" data-em="offset" value="'+esc(em.offset)+'" placeholder="16"><div class="hint">Höhe einer fixen Kopfzeile</div></div>':''))+'</div>'
        + '<textarea class="code" readonly id="embcode" style="height:74px">'+esc(embedCode())+'</textarea><div style="display:flex;align-items:center;gap:8px;margin-top:8px"><span class="hint" style="margin:0;flex:1">WordPress: Block „Individuelles HTML“ · Wix/Jimdo: Element „HTML/Code einbetten“.</span><button class="btn sm" data-embcopy>'+I('copy',13)+'Code kopieren</button></div>';
    }
    return tabs + '<div id="shareb">' + t + '</div>';
  };
  var advBody = function(){
    var html = exportHtml(f), kb = Math.round(html.length/1024);
    var t = '<div class="tabs2"><button class="'+(adv==='qr'?'on':'')+'" data-pt="qr">QR-Code</button><button class="'+(adv==='html'?'on':'')+'" data-pt="html">Eigene Domain (HTML)</button><button class="'+(adv==='hook'?'on':'')+'" data-pt="hook">Webhook-Daten</button><button class="'+(adv==='json'?'on':'')+'" data-pt="json">JSON</button></div>';
    if(adv === 'qr'){ var qu = REMOTE ? publicUrl(f) : (f.settings.hostedUrl || ''); t += '<div class="qrwrap"><div id="qrbox" class="qrbox">'+(qu?'':'<span>Link eingeben</span>')+'</div><div style="flex:1"><div class="fld"><label>Ziel-URL</label><input class="inp" id="qrurl" value="'+esc(qu)+'" placeholder="https://funnels.deine-domain.de/f/…"'+(REMOTE?' readonly':'')+'><div class="hint">'+(REMOTE?'Der QR-Code führt direkt zum Live-Funnel.':'Im Demo-Modus: die Adresse, unter der du die exportierte HTML-Datei hostest.')+'</div></div><p class="hint">Ideal für Flyer, Rechnungen, Aufsteller oder NFC-Tags. Tipp: Hänge <code>?utm_source=flyer</code> an, um Quellen zu unterscheiden.</p><div id="qrdl"></div></div></div>'; }
    else if(adv === 'html') t += '<div class="callout">'+I('info')+'<div>Eigenständige Datei ('+kb+' KB) mit Design, Logik und Preisberechnung. Als <b>index.html</b> auf Netlify, Vercel, Cloudflare Pages oder deinen Webspace legen. '+(f.settings.webhook?'Anfragen gehen an deinen Webhook.':'<b>Tipp:</b> Hinterlege unter „Funnel → Integrationen“ einen Webhook, damit Anfragen ankommen.')+'</div></div><textarea class="code" readonly id="pubcode" style="height:200px">'+esc(html)+'</textarea><div style="display:flex;justify-content:flex-end;margin-top:8px"><button class="btn sm" data-pcopy>'+I('copy',13)+'HTML kopieren</button></div>';
    else if(adv === 'embed'){ var eu = REMOTE ? publicUrl(f) : 'https://deine-domain.de/'+slug(f.name)+'/'; t += '<p style="margin:0 0 10px;color:var(--ink2)">Per iFrame in eine bestehende Website einbinden:</p><textarea class="code" readonly id="pubcode" style="height:90px">&lt;iframe src="'+esc(eu)+'" style="width:100%;height:100vh;border:0" allow="fullscreen"&gt;&lt;/iframe&gt;</textarea><div style="display:flex;justify-content:flex-end;margin-top:8px"><button class="btn sm" data-pcopy>'+I('copy',13)+'Code kopieren</button></div>'; }
    else if(adv === 'hook'){
      var sample = {type:'lead', funnelId:f.id, funnel:f.name, ts:new Date().toISOString(), url:'https://deine-domain.de/'+slug(f.name)+'/?utm_source=facebook', utm:{utm_source:'facebook'}, lead:{name:'Max Mustermann', email:'max@beispiel.de', phone:'+49 170 1234567', total:4250, score:0, answers:{'…':'…'}, fields:[{key:'material', label:'Welches Material wünschst du dir?', value:'WPC-Dielen'}], items:[{label:'WPC-Dielen', amount:2225, detail:'89 €/m² × 25 m²'}], durationSec:74}};
      t += '<p style="margin:0 0 10px;color:var(--ink2)">JSON-Body, den dein Webhook beim Absenden erhält (POST, <code>text/plain</code>):</p><textarea class="code" readonly id="pubcode" style="height:200px">'+esc(JSON.stringify(sample, null, 2))+'</textarea>';
    }
    else t += '<p style="margin:0 0 10px;color:var(--ink2)">Funnel-Definition zum Sichern oder Importieren:</p><textarea class="code" readonly id="pubcode" style="height:200px">'+esc(JSON.stringify({id:f.id,name:f.name,theme:f.theme,settings:f.settings,pages:f.pages}, null, 2))+'</textarea><div style="display:flex;justify-content:flex-end;margin-top:8px"><button class="btn sm" data-pcopy>'+I('copy',13)+'JSON kopieren</button></div>';
    return t;
  };
  var body = function(){
    var checks = funnelChecks(f), errs = checks.filter(function(c){ return c.lvl === 'err'; }).length, warns = checks.filter(function(c){ return c.lvl === 'warn'; }).length, live = f.status === 'live';
    var ic = {ok:'check', warn:'info', err:'x', info:'info'};
    var h = '<div class="pubstep"><div class="psh"><span class="pn'+(errs?' bad':warns?' warn':' ok')+'">1</span><div><b>Prüfen</b><span>'+(errs?errs+' Problem'+(errs>1?'e':'')+' muss behoben werden':warns?warns+' Hinweis'+(warns>1?'e':'')+' – Live schalten ist trotzdem möglich':'Alles bereit')+'</span></div></div>'
      + '<div class="checks">' + checks.map(function(c){ return '<div class="pchk '+c.lvl+'"><span class="ci">'+I(ic[c.lvl],12)+'</span><div class="ct"><b>'+esc(c.t)+'</b>'+(c.d?'<span>'+esc(c.d)+'</span>':'')+'</div>'+(c.page!=null?'<button class="btn ghost sm" data-goto="'+c.page+'">Zur Seite</button>':c.tab?'<button class="btn ghost sm" data-gotab="'+c.tab+'">Öffnen</button>':'')+'</div>'; }).join('') + '</div></div>';
    var dirty = pubDirty(f);
    h += '<div class="pubstep"><div class="psh"><span class="pn'+(live&&!dirty?' ok':dirty?' warn':'')+'">2</span><div><b>'+(live?'Veröffentlichen':'Live schalten')+'</b><span>'+(live?(dirty?'Deine Änderungen sind gespeichert, aber noch nicht online.':'Online ist der aktuelle Stand'+(f.published?' vom '+fmtTs(f.published.at):'')+'.'):'Erst im Live-Modus ist der Funnel erreichbar und zählt Aufrufe und Anfragen.')+'</span></div></div>'
      + '<div class="golive '+(live?'on':'')+(dirty?' dirty':'')+'">'+(live
        ? (dirty ? '<span class="dot"></span><div style="flex:1"><b>Änderungen offen</b><span>Online bleibt der Stand '+(f.published?'vom '+fmtTs(f.published.at):'von vorher')+', bis du veröffentlichst.</span></div><button class="btn pri" data-ps="publish"'+(errs?' disabled':'')+'>'+I('rocket',14)+'Änderungen veröffentlichen</button>'
          : '<span class="dot"></span><div style="flex:1"><b>Live</b><span>Alles online. Neue Änderungen werden erst mit „Veröffentlichen“ übernommen.</span></div>') + '<button class="btn sm" data-ps="draft">Offline nehmen</button>'
        : '<div style="flex:1"><b>Entwurf</b><span>'+(errs?'Behebe zuerst die markierten Probleme.':'Bereit zum Veröffentlichen.')+'</span></div><button class="btn pri" data-ps="live"'+(errs?' disabled':'')+'>'+I('rocket',14)+'Jetzt live schalten</button>')+'</div></div>';
    h += '<div class="pvl"><button class="btn ghost sm" data-pvers>'+I('history',13)+'Versionen & Backups'+((f.versions||[]).length?' ('+f.versions.length+')':'')+'</button></div>';
    h += '<div class="pubstep"><div class="psh"><span class="pn'+(live?' ok':'')+'">3</span><div><b>Teilen</b><span>Per Link, unter der Domain des Kunden oder direkt auf seiner Website.</span></div></div>';
    h += '<div id="sharewrap">' + shareBody() + '</div>' + (REMOTE && !live ? '<div class="hint" style="margin-top:6px">Link und Einbindung funktionieren, sobald der Funnel live ist.</div>' : '');
    h += '<details class="advx"'+(open?' open':'')+'><summary>'+I('code',13)+'Erweitert: '+(REMOTE?'QR-Code, ':'QR-Code, ')+'HTML-Export, Webhook, JSON</summary><div id="advb">'+advBody()+'</div></details></div>';
    return h;
  };
  var m = modal({title:'Veröffentlichen', sub:'„'+f.name+'“ prüfen, live schalten und teilen.', size:'mid', body:'<div id="pubb">'+body()+'</div>', foot:'<button class="btn" data-close>Fertig</button>',
    onOpen:function(el, close){
      var rerender = function(){ el.querySelector('#pubb').innerHTML = body(); if(open && adv === 'qr') drawQR(el.querySelector('#qrurl') && el.querySelector('#qrurl').value); };
      el.addEventListener('toggle', function(e){ if(e.target.classList && e.target.classList.contains('advx')){ open = e.target.open; if(open && adv === 'qr') drawQR(el.querySelector('#qrurl').value); } }, true);
      el.addEventListener('input', function(e){ var k = e.target.getAttribute && e.target.getAttribute('data-em'); if(k){ em[k] = e.target.value; var c = el.querySelector('#embcode'); if(c) c.value = embedCode(); } });
      el.addEventListener('click', function(e){
        var pt = e.target.closest('[data-pt]'); if(pt){ adv = pt.getAttribute('data-pt'); el.querySelector('#advb').innerHTML = advBody(); if(adv === 'qr') drawQR(el.querySelector('#qrurl').value); return; }
        var ps = e.target.closest('[data-ps]'); if(ps){ var pv = ps.getAttribute('data-ps'), was = f.status; if(pv === 'draft'){ f.status = 'draft'; save(true); toast('Funnel ist offline (Entwurf)'); } else { publishNow(f); toast(was === 'live' ? 'Änderungen sind online' : 'Funnel ist live'); } pubUi(); rerender(); return; }
        if(e.target.closest('[data-pvers]')){ close(); versionsModal(f); return; }
        var g = e.target.closest('[data-goto]'); if(g){ close(); if(S.view === 'editor' && S.fid === f.id){ selectPage(+g.getAttribute('data-goto')); } else { go('editor', f.id); S.pi = +g.getAttribute('data-goto'); renderEditor(); } return; }
        var gt = e.target.closest('[data-gotab]'); if(gt){ close(); if(!(S.view === 'editor' && S.fid === f.id)) go('editor', f.id); S.rtab = 'set'; renderRight(); return; }
        var sh = e.target.closest('[data-share]'); if(sh){ share = sh.getAttribute('data-share'); el.querySelector('#sharewrap').innerHTML = shareBody(); return; }
        var emb = e.target.closest('[data-emode]'); if(emb){ em.mode = emb.getAttribute('data-emode'); el.querySelector('#sharewrap').innerHTML = shareBody(); return; }
        if(e.target.closest('[data-embcopy]')){ copyText(embedCode(), 'Einbinde-Code kopiert'); return; }
        if(e.target.closest('[data-share-domain]')){ close(); autoModal(f, 'domain'); return; }
        if(e.target.closest('[data-copyurl]')) copyText(publicUrl(f), 'Link kopiert');
        if(e.target.closest('[data-pcopy]')) copyText(el.querySelector('#pubcode').value, adv==='html'?'HTML kopiert – als index.html speichern':'Kopiert');
      });
    }});
  return m;
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

/* ================= AUTOMATIONEN (E-Mails, Regeln, Webhooks, Domain) ================= */
function auto(f){ f.settings.automation = f.settings.automation || {}; var a = f.settings.automation; a.notify = a.notify || {enabled:false, to:'', lists:[], subject:'Neue Anfrage: {{funnel}}', body:'Es ist eine neue Anfrage über „{{funnel}}“ eingegangen.'}; a.confirm = a.confirm || {enabled:false, subject:'Danke für deine Anfrage, {{vorname|}}', body:'Wir haben deine Anfrage erhalten und melden uns in Kürze bei dir.', replyTo:''}; a.rules = a.rules || []; a.webhooks = a.webhooks || []; return a; }
function lists(){ db.lists = db.lists || []; return db.lists; }
function genSecret(){ var a = new Uint8Array(24); (window.crypto || window.msCrypto).getRandomValues(a); return 'whsec_' + Array.prototype.map.call(a, function(b){ return ('0'+b.toString(16)).slice(-2); }).join(''); }
function splitMails(s){ return String(s||'').split(/[\s,;]+/).map(function(x){ return x.trim(); }).filter(function(x){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x); }); }
function autoSummary(f){
  var a = auto(f), n = splitMails(a.notify.to).length + (a.notify.lists||[]).reduce(function(s, id){ var l = lists().filter(function(x){ return x.id === id; })[0]; return s + (l ? l.emails.length : 0); }, 0);
  return [
    ['mail', 'E-Mail an Betrieb', a.notify.enabled ? (n ? n + ' Empfänger' : 'aktiv – Empfänger fehlen') : 'aus', a.notify.enabled && n],
    ['send', 'Bestätigung an Interessent', a.confirm.enabled ? 'aktiv' : 'aus', a.confirm.enabled],
    ['branch', 'Regeln', a.rules.length ? a.rules.length + ' aktiv' : 'keine', a.rules.length],
    ['zap', 'Webhooks', a.webhooks.filter(function(h){ return h.url && h.active !== false; }).length ? a.webhooks.filter(function(h){ return h.url && h.active !== false; }).length + ' aktiv' : 'keine', a.webhooks.length],
    ['globe', 'Eigene Domain', (f.settings.domain && f.settings.domain.hostname) ? f.settings.domain.hostname : 'keine', f.settings.domain && f.settings.domain.status === 'active']
  ];
}
/* ================= E-MAIL-EDITOR (formatierbar, Emojis, Platzhalter) =================
   Gespeichert wird bereinigtes HTML mit {{platzhalter}} (Positivliste: p, br, b/strong, i/em, u, a, ul/ol/li, h2/h3, hr).
   mailRender() macht daraus E-Mail-taugliches HTML mit Inline-Styles – identisch in der Edge Function. */
var MAIL_EMOJI = ['😊','🙌','🎉','✅','👍','🙏','👋','⭐','💚','❤️','🔥','🚀','✨','💡','👉','📞','📧','💬','📅','⏰','📍','🏠','🛠️','🪵','🌿','☀️','💶','📝','🤝','📎','🎁','🏆'];
function mailVars(f){
  var out = [{key:'vorname', label:'Vorname'},{key:'name', label:'Name'},{key:'email', label:'E-Mail'},{key:'telefon', label:'Telefon'},{key:'funnel', label:'Funnel-Name'},{key:'total', label:'Preis'},{key:'datum', label:'Datum'},{key:'link', label:'Link zum Dashboard'}];
  FP.vars(f).forEach(function(v){ if(v.type !== 'calc' && !out.some(function(x){ return x.key === v.key; })) out.push({key:v.key, label:v.label}); });
  return out;
}
function mailSanitize(html){
  var box = document.createElement('div'); box.innerHTML = html || '';
  var ok = {P:1, BR:1, B:1, STRONG:1, I:1, EM:1, U:1, A:1, UL:1, OL:1, LI:1, H2:1, H3:1, HR:1};
  (function walk(n){ Array.prototype.slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType === 3) return;
    if(c.nodeType !== 1){ c.remove(); return; }
    walk(c);
    var tag = c.tagName;
    if(tag === 'DIV'){ var pp = document.createElement('p'); while(c.firstChild) pp.appendChild(c.firstChild); c.replaceWith(pp); return; }
    if(!ok[tag]){ while(c.firstChild) c.parentNode.insertBefore(c.firstChild, c); c.remove(); return; }
    Array.prototype.slice.call(c.attributes).forEach(function(at){ if(!(tag === 'A' && (at.name === 'href' || at.name === 'data-btn'))) c.removeAttribute(at.name); });
    if(tag === 'A' && !/^(https?:|mailto:|tel:|\{\{)/i.test(c.getAttribute('href') || '')) c.removeAttribute('href');
  }); })(box);
  return box.innerHTML.replace(/<p><br><\/p>$/,'').trim();
}
/* {{schluessel}} im Text als nicht editierbaren Chip anzeigen */
function mailToEditor(html, f){
  var labels = {}; mailVars(f).forEach(function(v){ labels[v.key] = v.label; });
  var box = document.createElement('div'); box.innerHTML = html || '';
  var re = /\{\{\s*([\w.-]+)\s*(?:\|([^}]*))?\}\}/g;
  (function walk(n){ Array.prototype.slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType === 1){ walk(c); return; }
    if(c.nodeType !== 3 || !re.test(c.nodeValue)) return; re.lastIndex = 0;
    var frag = document.createDocumentFragment(), txt = c.nodeValue, last = 0, m;
    while((m = re.exec(txt))){ frag.appendChild(document.createTextNode(txt.slice(last, m.index))); var sp = document.createElement('span'); sp.className = 'rv'; sp.contentEditable = 'false'; sp.setAttribute('data-v', m[1] + (m[2] != null ? '|' + m[2] : '')); sp.textContent = labels[m[1]] || m[1]; frag.appendChild(sp); last = m.index + m[0].length; }
    frag.appendChild(document.createTextNode(txt.slice(last))); c.replaceWith(frag);
  }); })(box);
  return box.innerHTML;
}
function mailFromEditor(ed){
  var box = ed.cloneNode(true);
  box.querySelectorAll('span.rv').forEach(function(sp){ sp.replaceWith(document.createTextNode('{{' + sp.getAttribute('data-v') + '}}')); });
  return mailSanitize(box.innerHTML);
}
function mailTextFromHtml(html){
  var box = document.createElement('div'); box.innerHTML = html;
  box.querySelectorAll('p,div,h2,h3,li').forEach(function(block){
    if(block.childNodes.length === 1 && block.firstChild.nodeName === 'BR') block.firstChild.remove();
    block.appendChild(document.createTextNode('\n'));
  });
  box.querySelectorAll('br').forEach(function(br){ br.replaceWith(document.createTextNode('\n')); });
  return box.textContent.replace(/\n$/, '');
}
function insertMailChip(ed, range, variable){
  ed.focus();
  if(!range || !ed.contains(range.commonAncestorContainer)){
    range = document.createRange();
    var lastLine = ed.lastElementChild;
    var end = lastLine && lastLine === ed.lastChild && lastLine.matches('p,div,h2,h3,li') ? lastLine : ed;
    range.selectNodeContents(end);
    range.collapse(false);
    if(end.lastChild && end.lastChild.nodeName === 'BR') range.setStartBefore(end.lastChild);
    range.collapse(true);
  }
  var chip = document.createElement('span');
  chip.className = 'rv'; chip.contentEditable = 'false';
  chip.setAttribute('data-v',variable.key); chip.textContent = variable.label;
  range.deleteContents(); range.insertNode(chip);
  range.setStartAfter(chip); range.collapse(true);
  restoreSel(range);
}
function plainToMail(t){ return t ? '<p>' + esc(t).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') + '</p>' : ''; }
function rte(path, html, f){
  var b = function(cmd, ic, title, extra){ return '<button type="button" class="rtb'+(extra||'')+'" data-rc="'+cmd+'" title="'+title+'" tabindex="-1">'+ic+'</button>'; };
  return '<div class="rte" data-rte="'+path+'"><div class="rte-tb">'
    + b('bold','<b>B</b>','Fett (⌘B)') + b('italic','<i>I</i>','Kursiv (⌘I)') + b('underline','<u>U</u>','Unterstrichen') + '<span class="rsep"></span>'
    + b('h2','<b>Ü</b>','Überschrift') + b('ul',I('list',14),'Liste') + b('ol','1.','Nummerierte Liste') + '<span class="rsep"></span>'
    + b('link',I('link',14),'Link') + b('btn',I('pointer',14),'Button einfügen') + b('hr',I('minus',14),'Trennlinie') + '<span class="rsep"></span>'
    + b('emoji','😊','Emoji', ' emo') + b('var',I('user',13)+'<span>Platzhalter</span>','Eingabe des Interessenten einfügen', ' var')
    + '</div><div class="rte-ed" contenteditable="true" spellcheck="true">'+mailToEditor(html, f)+'</div></div>';
}
function saveSel(ed){ var sl = window.getSelection(); if(!sl || !sl.rangeCount) return null; var rg = sl.getRangeAt(0); return ed && !ed.contains(rg.commonAncestorContainer) ? null : rg.cloneRange(); }
function restoreSel(rg){ if(!rg) return; var sl = window.getSelection(); sl.removeAllRanges(); sl.addRange(rg); }
/* Emoji-Auswahl: wächst aus dem Knopf, schließt bei Klick daneben oder Esc */
function emojiPop(btn, fn){
  var old = document.querySelector('.emopop'); if(old){ old.remove(); if(old._for === btn) return; }
  var p = document.createElement('div'); p.className = 'emopop'; p._for = btn;
  p.innerHTML = MAIL_EMOJI.map(function(e){ return '<button type="button" data-em="'+e+'">'+e+'</button>'; }).join('');
  document.body.appendChild(p);
  var r = btn.getBoundingClientRect(), w = p.offsetWidth, x = Math.min(Math.max(8, r.left), innerWidth - w - 8), up = r.bottom + p.offsetHeight + 12 > innerHeight;
  p.style.left = x + 'px'; p.style.top = (up ? r.top - p.offsetHeight - 6 : r.bottom + 6) + 'px';
  p.style.transformOrigin = (r.left + r.width/2 - x) + 'px ' + (up ? '100%' : '0');
  var close = function(){ p.remove(); document.removeEventListener('mousedown', out, true); document.removeEventListener('keydown', esc_); };
  var out = function(e){ if(!p.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close(); };
  var esc_ = function(e){ if(e.key === 'Escape') close(); };
  p.addEventListener('mousedown', function(e){ e.preventDefault(); });
  p.addEventListener('click', function(e){ var b = e.target.closest('[data-em]'); if(b){ fn(b.getAttribute('data-em')); close(); } });
  setTimeout(function(){ document.addEventListener('mousedown', out, true); document.addEventListener('keydown', esc_); }, 0);
}
function btnBox(cb){
  modal({title:'Button einfügen', sub:'Erscheint in der Mail als farbiger Button in deiner Funnel-Farbe.', body:'<div class="fld"><label>Beschriftung</label><input class="inp" id="bbl" placeholder="Zu unserer Website"></div><div class="fld"><label>Ziel-Adresse</label><input class="inp" id="bbu" placeholder="https://… , mailto:… oder tel:…"></div>',
    foot:'<button class="btn" data-close>Abbrechen</button><button class="btn pri" data-bbok>Einfügen</button>',
    onOpen:function(el, close){ setTimeout(function(){ el.querySelector('#bbl').focus(); }, 30); el.querySelector('[data-bbok]').onclick = function(){ var l = el.querySelector('#bbl').value.trim(), u = el.querySelector('#bbu').value.trim(); if(!l || !u) return toast('Bitte Beschriftung und Adresse eingeben'); if(!/^(https?:|mailto:|tel:)/i.test(u)) u = 'https://' + u; close(); cb(l, u); }; }});
}
function emailPreview(f, kind){
  var c = auto(f)[kind], lead = TTMail.sampleLead(f), vars = TTMail.varsFor(lead,f,location.origin);
  var subject = TTMail.renderText(c.subject,vars);
  var message = TTMail.automationMessage({config:c, vars:vars, kind:kind, fields:lead.data.fields, funnel:f, origin:location.origin, subject:subject});
  var html = message.html ?? '<pre style="white-space:pre-wrap;overflow-wrap:anywhere;font:inherit"><span>'+esc(message.text)+'</span></pre>';
  return {subject:subject, html:html};
}
function autoModal(f, tab){
  tab = tab || 'notify';
  var a = auto(f);
  var fld = function(label, inner, hint){ return '<div class="fld"><label>'+label+'</label>'+inner+(hint?'<div class="hint">'+hint+'</div>':'')+'</div>'; };
  var fldv = function(label, inner, hint){ return '<div class="fld"><div class="flh"><label>'+label+'</label><button class="varbtn" data-a="insVar">'+I('user',12)+'Variable</button></div>'+inner+(hint?'<div class="hint">'+hint+'</div>':'')+'</div>'; };
  var flds = function(label, inner){ return '<div class="fld"><div class="flh"><label>'+label+'</label><span style="display:flex;gap:4px"><button class="varbtn" data-subj-emoji title="Emoji einfügen">😊</button><button class="varbtn" data-a="insVar">'+I('user',12)+'Variable</button></span></div>'+inner+'</div>'; };
  var tgl = function(k, on, label){ return '<label class="tgl"><span>'+label+'</span><input type="checkbox" data-au="'+k+'" data-bool'+(on?' checked':'')+'><span class="sw"></span></label>'; };
  function messageEditor(kind){
    var c = a[kind], plain = c.format === 'plain';
    var format = fld('E-Mail-Format', '<select class="inp" data-au="'+kind+'.format"><option value="html"'+(plain?'':' selected')+'>Formatiert</option><option value="plain"'+(plain?' selected':'')+'>Klartext</option></select>');
    if(!plain) return format + fld('Nachricht', rte(kind, c.html ?? plainToMail(c.body), f));
    return format + '<div class="fld"><div class="flh"><label for="plain-mail-'+kind+'">Nachricht</label><button type="button" class="varbtn" data-mail-var>Platzhalter</button></div>'
      + '<textarea class="inp" rows="8" id="plain-mail-'+kind+'" data-au="'+kind+'.plainBody">'+esc((c.plainBody ?? c.body ?? '').replace(/^\n/,'\n\n'))+'</textarea></div>';
  }
  function layoutControls(kind){
    var c = a[kind];
    function textOption(key,label,fallback){
      return fld(label,'<input class="inp" data-au="'+kind+'.'+key+'" value="'+esc(c[key] ?? fallback)+'">','Zum Ausblenden leer lassen.');
    }
    var ruleSubject = kind === 'notify' && a.rules.length ? tgl('notify.ruleSubject', c.ruleSubject !== false, 'Passende Regeln im Betreff nennen') : '';
    if(c.format === 'plain') return ruleSubject;
    return tgl(kind+'.fields', c.fields !== false, 'Antworten anhängen')
      + tgl(kind+'.total', c.total ?? (c.fields !== false), 'Gesamtpreis anhängen')
      + ruleSubject
      + tgl(kind+'.customLayout', !!c.customLayout, 'Eigenes HTML-Layout verwenden')
      + (!c.customLayout ? tgl(kind+'.showLogo',c.showLogo !== false,'Funnel-Logo anzeigen')
        + textOption('headingText','Überschrift','{{betreff}}')
        + textOption('footerText','Fußzeile',kind === 'confirm' ? '{{funnel}}' : 'Gesendet mit TapTell')
        + (kind === 'notify' ? textOption('buttonText','Dashboard-Button','Im Dashboard öffnen') : '') : '')
      + (c.customLayout ? fld('HTML der gesamten E-Mail', '<textarea class="inp" rows="8" data-au="'+kind+'.layoutHtml">'+esc(c.layoutHtml ?? '{{nachricht_html}}')+'</textarea>',
        'Eigene Texte, Links, Bilder und Inline-CSS. Verfügbar sind deine Variablen sowie {{betreff}}, {{nachricht_html}}, {{antworten_html}} und {{preis_html}}. Nur eingefügte Bausteine erscheinen.') : '');
  }
  var listChips = function(sel, path){ return lists().length ? '<div class="chips-l">'+lists().map(function(l){ var on = (sel||[]).indexOf(l.id) >= 0; return '<button class="chip'+(on?' on':'')+'" data-a="auList" data-path="'+path+'" data-id="'+l.id+'">'+esc(l.name)+' <span style="opacity:.6">('+l.emails.length+')</span></button>'; }).join('')+'</div>' : '<div class="hint" style="margin:0">Noch keine Listen. Lege sie unter <b>Einstellungen → Empfängerlisten</b> an.</div>'; };
  var demoNote = REMOTE ? '' : '<div class="callout" style="margin-bottom:14px">'+I('info')+'<div><b>Demo-Modus:</b> Du kannst alles einrichten und als Vorschau ansehen. Echt versendet wird, sobald TapTell mit Supabase verbunden ist.</div></div>';
  var body = function(){
    var h = '<div class="tabs2">'+[['notify','E-Mail an Betrieb'],['confirm','Bestätigung'],['rules','Regeln'],['hooks','Webhooks'],['domain','Domain']].map(function(x){ return '<button class="'+(tab===x[0]?'on':'')+'" data-at="'+x[0]+'">'+x[1]+'</button>'; }).join('')+'</div>' + demoNote;
    if(tab === 'notify'){
      h += '<div class="au2"><div>' + tgl('notify.enabled', a.notify.enabled, 'Bei jeder neuen Anfrage eine E-Mail senden')
        + fld('Empfänger', '<input class="inp" data-au="notify.to" value="'+esc(a.notify.to||'')+'" placeholder="info@firma.de, vertrieb@firma.de">', 'Mehrere Adressen mit Komma trennen.')
        + fld('Empfängerlisten', listChips(a.notify.lists, 'notify.lists'))
        + flds('Betreff', '<input class="inp" data-au="notify.subject" value="'+esc(a.notify.subject||'')+'">')
        + messageEditor('notify')
        + layoutControls('notify')
        + '<div style="display:flex;gap:8px"><button class="btn sm" data-a="auTest" data-k="email">'+I('send',13)+'Testmail an mich</button></div></div>'
        + '<div class="au-prev"><div class="au-subj">'+I('mail',13)+'<span>'+esc(emailPreview(f,'notify').subject)+'</span></div><iframe sandbox="" title="Vorschau" data-prev="notify"></iframe></div></div>';
    } else if(tab === 'confirm'){
      h += '<div class="au2"><div>' + tgl('confirm.enabled', a.confirm.enabled, 'Interessent erhält eine Bestätigung')
        + flds('Betreff', '<input class="inp" data-au="confirm.subject" value="'+esc(a.confirm.subject||'')+'">')
        + messageEditor('confirm')
        + layoutControls('confirm')
        + fld('Antworten gehen an', '<input class="inp" data-au="confirm.replyTo" value="'+esc(a.confirm.replyTo||'')+'" placeholder="info@firma.de">', 'Wenn der Interessent auf die Mail antwortet.')
        + '<div class="hint">Wird nur verschickt, wenn im Funnel ein E-Mail-Feld ausgefüllt wurde.</div>'
        + '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-a="auTest" data-k="confirm">'+I('send',13)+'Testmail an mich</button></div></div>'
        + '<div class="au-prev"><div class="au-subj">'+I('mail',13)+'<span>'+esc(emailPreview(f,'confirm').subject)+'</span></div><iframe sandbox="" title="Vorschau" data-prev="confirm"></iframe></div></div>';
    } else if(tab === 'rules'){
      var vars = FP.vars(f).filter(function(x){ return x.key !== 'total_exakt' && x.key !== 'total'; }).concat([{key:'total', label:'Gesamtpreis (€)'}]);
      h += '<p class="hint" style="margin:0 0 12px">Zusätzliche Empfänger, wenn eine Bedingung zutrifft – z. B. <b>Sofort-Alarm</b> an den Chef bei schlechter Bewertung oder an die Verkaufsleitung ab einem bestimmten Preis. Der Betreff erhält dann einen Hinweis.</p>'
        + (a.rules.length ? '' : '<div class="emptyp" style="padding:18px">'+I('branch',18)+'<div>Noch keine Regeln.</div></div>')
        + a.rules.map(function(r, i){ return '<div class="rule"><div class="rule-r"><span class="rl">Wenn</span><select class="inp" data-ar="'+i+'" data-rk="field">'+vars.map(function(x){ return '<option value="'+esc(x.key)+'"'+(r.field===x.key?' selected':'')+'>'+esc(x.label)+'</option>'; }).join('')+'</select>'
          + '<select class="inp" data-ar="'+i+'" data-rk="op" style="width:150px">'+[['lte','kleiner/gleich'],['gte','größer/gleich'],['eq','ist gleich'],['contains','enthält'],['any','ausgefüllt']].map(function(o){ return '<option value="'+o[0]+'"'+(r.op===o[0]?' selected':'')+'>'+o[1]+'</option>'; }).join('')+'</select>'
          + (r.op !== 'any' ? '<input class="inp" data-ar="'+i+'" data-rk="value" value="'+esc(r.value||'')+'" placeholder="Wert" style="width:110px">' : '') + '<button class="ibtn" data-a="auRuleDel" data-i="'+i+'" title="Regel löschen">'+I('trash')+'</button></div>'
          + '<div class="rule-r"><span class="rl">dann an</span><input class="inp" data-ar="'+i+'" data-rk="to" value="'+esc(r.to||'')+'" placeholder="chef@firma.de"><select class="inp" data-ar="'+i+'" data-rk="list" style="width:190px"><option value="">+ Liste (optional)</option>'+lists().map(function(l){ return '<option value="'+l.id+'"'+((r.lists||[])[0]===l.id?' selected':'')+'>'+esc(l.name)+'</option>'; }).join('')+'</select></div>'
          + '<div class="rule-r"><span class="rl">Hinweis</span><input class="inp" data-ar="'+i+'" data-rk="label" value="'+esc(r.label||'')+'" placeholder="z. B. Schlechte Bewertung"></div></div>'; }).join('')
        + '<button class="btn sm" data-a="auRuleAdd">'+I('plus',13)+'Regel hinzufügen</button>';
    } else if(tab === 'hooks'){
      h += '<p class="hint" style="margin:0 0 12px">Jede neue Anfrage wird als JSON an diese Adressen gesendet – z. B. an Make, Zapier, n8n oder dein CRM. Mit Signatur, 3 Zustellversuchen und Protokoll.</p>'
        + (a.webhooks.length ? '' : '<div class="emptyp" style="padding:18px">'+I('zap',18)+'<div>Noch keine Webhooks.</div></div>')
        + a.webhooks.map(function(w, i){ return '<div class="rule"><div class="rule-r"><input class="inp" data-aw="'+i+'" data-wk="name" value="'+esc(w.name||'')+'" placeholder="Name, z. B. Make – CRM" style="width:180px"><input class="inp" data-aw="'+i+'" data-wk="url" value="'+esc(w.url||'')+'" placeholder="https://hook.eu1.make.com/…"><label class="tgl" style="margin:0;flex:none"><input type="checkbox" data-aw="'+i+'" data-wk="active" data-bool'+(w.active!==false?' checked':'')+'><span class="sw"></span></label><button class="ibtn" data-a="auHookDel" data-i="'+i+'" title="Webhook löschen">'+I('trash')+'</button></div>'
          + '<div class="rule-r"><span class="rl">Signatur</span><code class="sec">'+esc(w.secret ? w.secret.slice(0,10)+'••••••••'+w.secret.slice(-4) : '–')+'</code><button class="btn ghost sm" data-a="auSecCopy" data-i="'+i+'">'+I('copy',13)+'Kopieren</button><button class="btn ghost sm" data-a="auSecNew" data-i="'+i+'">'+I('refresh',13)+'Neu</button><span style="flex:1"></span><button class="btn sm" data-a="auTest" data-k="webhook" data-i="'+i+'"'+(w.url?'':' disabled')+'>'+I('play',13)+'Testen</button></div></div>'; }).join('')
        + '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-a="auHookAdd">'+I('plus',13)+'Webhook hinzufügen</button><button class="btn ghost sm" data-a="auLog">'+I('list',13)+'Zustell-Protokoll</button></div>'
        + '<details class="advx"><summary>'+I('code',13)+'Signatur prüfen (für Entwickler)</summary><pre class="code" style="font-size:var(--fs-12);white-space:pre-wrap">Header:  X-TapTell-Signature: t=&lt;timestamp&gt;,v1=&lt;hmac&gt;\nPrüfung: hmac_sha256(secret, t + "." + rohe_body) == v1\nEvent:   X-TapTell-Event: lead.created</pre></details>';
    } else {
      var d = f.settings.domain || {}, tgt = 'cname.vercel-dns.com';
      h += '<p class="hint" style="margin:0 0 12px">Zeige den Funnel unter einer eigenen Adresse, z. B. <b>konfigurator.firma.de</b>. Nach dem Verbinden muss beim Domain-Anbieter ein DNS-Eintrag gesetzt werden – TapTell prüft ihn und das SSL-Zertifikat wird automatisch ausgestellt.</p>';
      if(!d.hostname) h += '<div class="fld"><label>Domain</label><div style="display:flex;gap:8px"><input class="inp" id="audom" placeholder="konfigurator.firma.de"><button class="btn pri sm" data-a="auDomAdd">Verbinden</button></div><div class="hint">Am besten eine Subdomain verwenden, damit die Firmen-Website unverändert bleibt.</div></div>';
      else h += '<div class="dombox"><div class="domh"><b>'+esc(d.hostname)+'</b><span class="pill '+(d.status==='active'?'live':'draft')+'">'+(d.status==='active'?'Aktiv':'Wartet auf DNS')+'</span></div>'
        + '<table class="dnst"><tr><th>Typ</th><th>Name</th><th>Ziel</th></tr><tr><td>CNAME</td><td><code>'+esc(d.hostname.split('.').slice(0,-2).join('.') || '@')+'</code></td><td><code>'+esc(d.target || tgt)+'</code> <button class="ibtn" data-a="auDnsCopy" title="Ziel kopieren">'+I('copy',12)+'</button></td></tr></table>'
        + (d.note ? '<div class="hint">'+esc(d.note)+'</div>' : '<div class="hint">Diesen Eintrag beim Domain-Anbieter des Kunden setzen (z. B. IONOS, Strato, All-Inkl). Änderungen brauchen meist wenige Minuten, selten bis zu 24 Stunden.</div>')
        + '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-a="auDomCheck">'+I('refresh',13)+'Jetzt prüfen</button><button class="btn ghost sm danger" data-a="auDomDel">Entfernen</button></div></div>';
    }
    return h;
  };
  var m = modal({title:'Automationen', sub:'„'+f.name+'“ – was nach einer neuen Anfrage passiert.', size:'wide au-modal', body:'<div id="aub">'+body()+'</div>', foot:'<span class="hint" style="margin:0 auto 0 0">Änderungen werden automatisch gespeichert.</span><button class="btn pri" data-close>Fertig</button>',
    onOpen:function(el){
      var rerender = function(keepFocus){ var act = document.activeElement, sel = act && (act.getAttribute('data-au') || act.getAttribute('data-ar') || act.getAttribute('data-aw')) ? act : null, key = sel ? ['data-au','data-ar','data-aw','data-rk','data-wk'].map(function(k){ return sel.getAttribute(k); }).join('|') : null, pos = sel && sel.selectionStart;
        el.querySelector('#aub').innerHTML = body(); paint();
        if(key){ var n = Array.prototype.filter.call(el.querySelectorAll('input,textarea,select'), function(x){ return ['data-au','data-ar','data-aw','data-rk','data-wk'].map(function(k){ return x.getAttribute(k); }).join('|') === key; })[0]; if(n){ n.focus(); try{ n.setSelectionRange(pos, pos); }catch(e){} } } };
      var paint = function(){ var fr = el.querySelector('iframe[data-prev]'); if(fr){ fr.srcdoc = emailPreview(f, fr.getAttribute('data-prev')).html; } var s = el.querySelector('.au-subj span'); if(s) s.textContent = emailPreview(f, tab === 'confirm' ? 'confirm' : 'notify').subject; };
      var setPath = function(path, val){ var p = path.split('.'), o = a; for(var i=0;i<p.length-1;i++) o = o[p[i]]; o[p[p.length-1]] = val; };
      var changed = function(full){ touch(); if(S.view === 'editor') renderRight(); if(full) rerender(); else paint(); };
      paint();
      /* Editor: speichern, Werkzeugleiste, Emojis, Platzhalter */
      var rteSave = function(ed){ var k = ed.closest('[data-rte]').getAttribute('data-rte'); a[k].html = mailFromEditor(ed); a[k].body = ed.innerText.trim(); changed(false); };
      var caret = new WeakMap();
      function rememberCaret(e){
        var ed = e.target.closest && e.target.closest('.rte-ed');
        if(ed){ var r = saveSel(ed); if(r) caret.set(ed,r); }
      }
      ['keyup','pointerup','input','focusout'].forEach(function(type){ el.addEventListener(type,rememberCaret); });
      el.addEventListener('focusin', function(e){ if(e.target.classList && e.target.classList.contains('rte-ed')){ try{ document.execCommand('defaultParagraphSeparator', false, 'p'); }catch(x){} } });
      el.addEventListener('mousedown', function(e){ if(e.target.closest('.rtb,[data-mail-var]') || e.target.closest('.emopop')) e.preventDefault(); });
      el.addEventListener('keydown', function(e){ if(e.target.classList && e.target.classList.contains('rte-ed') && (e.metaKey || e.ctrlKey) && /^[biu]$/i.test(e.key)){ setTimeout(function(){ rteSave(e.target); }, 0); } });
      el.addEventListener('click', function(e){
        var plainVar = e.target.closest('[data-mail-var]');
        if(plainVar){
          e.stopPropagation();
          var field = plainVar.closest('.fld').querySelector('textarea');
          var start = field.selectionStart, end = field.selectionEnd;
          dropdown(plainVar, mailVars(f).map(function(v,i){ return {k:String(i), ic:'user', l:v.label, fn:function(){
            field.focus(); field.setRangeText('{{'+v.key+'}}',start,end,'end');
            field.dispatchEvent(new Event('input',{bubbles:true}));
          }}; }));
          return;
        }
        var sj = e.target.closest('[data-subj-emoji]');
        if(sj){ e.stopPropagation(); var inp = sj.closest('.fld').querySelector('input.inp'); emojiPop(sj, function(em){ var st = inp.selectionStart != null ? inp.selectionStart : inp.value.length; inp.value = inp.value.slice(0, st) + em + inp.value.slice(inp.selectionEnd != null ? inp.selectionEnd : st); inp.focus(); inp.setSelectionRange(st + em.length, st + em.length); inp.dispatchEvent(new Event('input', {bubbles:true})); }); return; }
        var rb = e.target.closest('[data-rc]'); if(!rb) return;
        e.stopPropagation(); /* sonst schließt der Dokument-Klick das Platzhalter-Menü sofort wieder */
        var ed = rb.closest('[data-rte]').querySelector('.rte-ed'), c = rb.getAttribute('data-rc'), r = saveSel(ed) || caret.get(ed);
        ed.focus(); restoreSel(r);
        var ins = function(htm){ ed.focus(); restoreSel(r); document.execCommand('insertHTML', false, htm); rteSave(ed); };
        if(c === 'bold' || c === 'italic' || c === 'underline') document.execCommand(c);
        else if(c === 'h2'){ var blk = String(document.queryCommandValue('formatBlock') || ''); document.execCommand('formatBlock', false, /h2/i.test(blk) ? 'p' : 'h2'); }
        else if(c === 'ul') document.execCommand('insertUnorderedList');
        else if(c === 'ol') document.execCommand('insertOrderedList');
        else if(c === 'hr') document.execCommand('insertHTML', false, '<hr><p><br></p>');
        else if(c === 'link'){ var txt = r ? r.toString() : ''; promptBox('Link einfügen', 'Adresse (https://, mailto: oder tel:)', 'https://', function(u){ u = String(u||'').trim(); if(!u || u === 'https://') return; if(!/^(https?:|mailto:|tel:)/i.test(u)) u = 'https://' + u; if(txt){ ed.focus(); restoreSel(r); document.execCommand('createLink', false, u); rteSave(ed); } else ins('<a href="'+esc(u)+'">'+esc(u.replace(/^(https?:\/\/|mailto:|tel:)/,''))+'</a>&nbsp;'); }); return; }
        else if(c === 'btn'){ btnBox(function(label, url){ ins('<p><a data-btn="1" href="'+esc(url)+'">'+esc(label)+'</a></p><p><br></p>'); }); return; }
        else if(c === 'emoji'){ emojiPop(rb, function(em){ ed.focus(); restoreSel(r); document.execCommand('insertText', false, em); r = saveSel(ed); rteSave(ed); }); return; }
        else if(c === 'var'){
          dropdown(rb, mailVars(f).map(function(v,i){ return {k:String(i), ic:'user', l:v.label, fn:function(){
            insertMailChip(ed,r,v); caret.set(ed,saveSel(ed)); rteSave(ed);
          }}; }));
          return;
        }
        rteSave(ed);
      });
      el.addEventListener('input', function(e){
        var t = e.target;
        if(t.classList && t.classList.contains('rte-ed')){ rteSave(t); return; }
        if(t.hasAttribute('data-au')){
          var path = t.getAttribute('data-au');
          if(path.endsWith('.fields') && a[tab].total == null) a[tab].total = a[tab].fields !== false;
          if(path.endsWith('.format') && t.value === 'plain' && a[tab].plainBody == null){
            a[tab].plainBody = a[tab].html != null ? mailTextFromHtml(a[tab].html) : (a[tab].body || '');
          }
          setPath(path, t.hasAttribute('data-bool') ? t.checked : t.value);
          changed(path.endsWith('.customLayout') || path.endsWith('.format'));
        }
        else if(t.hasAttribute('data-ar')){ var r = a.rules[+t.getAttribute('data-ar')], rk = t.getAttribute('data-rk'); if(rk === 'list') r.lists = t.value ? [t.value] : []; else r[rk] = t.value; changed(rk === 'op'); }
        else if(t.hasAttribute('data-aw')){ var w = a.webhooks[+t.getAttribute('data-aw')], wk = t.getAttribute('data-wk'); w[wk] = t.hasAttribute('data-bool') ? t.checked : t.value.trim(); changed(false); if(wk === 'url'){ var tb = t.closest('.rule').querySelector('[data-a="auTest"]'); if(tb) tb.disabled = !w.url; } }
      });
      el.addEventListener('change', function(e){ var t = e.target; if(t.tagName === 'SELECT' || t.type === 'checkbox') t.dispatchEvent(new Event('input', {bubbles:true})); });
      el.addEventListener('click', function(e){
        var at = e.target.closest('[data-at]'); if(at){ tab = at.getAttribute('data-at'); rerender(); return; }
        var b = e.target.closest('[data-a]'); if(!b || !el.contains(b)) return; var act = b.getAttribute('data-a'), i = +b.getAttribute('data-i');
        if(act === 'auList'){ e.stopPropagation(); var path = b.getAttribute('data-path'), id = b.getAttribute('data-id'), arr = (path === 'notify.lists' ? a.notify.lists : []) || []; var ix = arr.indexOf(id); if(ix >= 0) arr.splice(ix, 1); else arr.push(id); a.notify.lists = arr; changed(true); }
        else if(act === 'auRuleAdd'){ var v0 = FP.vars(f).filter(function(x){ return x.type === 'rating'; })[0]; a.rules.push({id:uid(), field:v0 ? v0.key : 'total', op:v0 ? 'lte' : 'gte', value:v0 ? '3' : '3000', to:'', lists:[], label:v0 ? 'Schlechte Bewertung' : 'Großer Auftrag'}); changed(true); }
        else if(act === 'auRuleDel'){ a.rules.splice(i, 1); changed(true); }
        else if(act === 'auHookAdd'){ a.webhooks.push({id:uid(), name:'', url:'', active:true, secret:genSecret(), events:['lead.created']}); changed(true); }
        else if(act === 'auHookDel'){ confirmBox('Webhook löschen?', 'Dieser Webhook erhält danach keine Anfragen mehr.', 'Löschen', function(){ a.webhooks.splice(i, 1); changed(true); }, true); }
        else if(act === 'auSecCopy'){ copyText(a.webhooks[i].secret, 'Signatur-Geheimnis kopiert'); }
        else if(act === 'auSecNew'){ confirmBox('Neues Geheimnis erzeugen?', 'Der Empfänger muss danach das neue Geheimnis zur Prüfung verwenden.', 'Erzeugen', function(){ a.webhooks[i].secret = genSecret(); changed(true); }); }
        else if(act === 'auTest'){ autoTest(f, b.getAttribute('data-k'), a.webhooks[i]); }
        else if(act === 'auLog'){ deliveryLog(f); }
        else if(act === 'auDomAdd'){ domainAdd(f, el.querySelector('#audom').value, rerender); }
        else if(act === 'auDomCheck'){ domainCheck(f, rerender); }
        else if(act === 'auDomDel'){ confirmBox('Domain entfernen?', 'Der Funnel ist danach nur noch unter seinem TapTell-Link erreichbar.', 'Entfernen', function(){ domainRemove(f, rerender); }, true); }
        else if(act === 'auDnsCopy'){ copyText((f.settings.domain||{}).target || 'cname.vercel-dns.com', 'DNS-Ziel kopiert'); }
      }, true);
    }});
  return m;
}
function autoTest(f, kind, hook){
  if(!REMOTE){
    if(kind === 'webhook'){ toast('Demo-Modus: Webhook-Test geht erst mit Supabase. Beispiel-Daten stehen unter Veröffentlichen → Erweitert.'); return; }
    var pv = emailPreview(f, kind === 'confirm' ? 'confirm' : 'notify');
    modal({title:'Test-E-Mail (Vorschau)', sub:'Im Demo-Modus wird nichts versendet – so käme die Mail an.', size:'mid', body:'<div class="au-subj">'+I('mail',13)+'<span>'+esc(pv.subject)+'</span></div><iframe sandbox="" class="au-big" title="Vorschau" srcdoc="'+esc(pv.html)+'"></iframe>', foot:'<button class="btn pri" data-close>Schließen</button>'});
    return;
  }
  toast(kind === 'webhook' ? 'Sende Test an Webhook …' : 'Sende Testmail …');
  sb.functions.invoke('lead-notify', {body:{test:kind, funnel_id:f.id, webhook_id:hook && hook.id, automation:auto(f)}}).then(function(r){
    var err = r.error || (r.data && r.data.error); if(err) return toast('Test fehlgeschlagen: ' + (err.message || err));
    var res = (r.data && r.data.results) || []; if(!res.length) return toast('Nichts gesendet – prüfe Empfänger bzw. URL.');
    var bad = res.filter(function(x){ return x.status !== 'ok' && x.status !== 'test'; });
    toast(bad.length ? 'Fehler: ' + (bad[0].error || bad[0].status) : (kind === 'webhook' ? 'Webhook antwortet ' + (res[0].http || 'OK') : 'Testmail verschickt an ' + res[0].target));
  });
}
function deliveryLog(f){
  var draw = function(rows){ return rows.length ? '<table class="t"><thead><tr><th>Zeit</th><th>Art</th><th>Ziel</th><th>Status</th></tr></thead><tbody>'+rows.map(function(r){ return '<tr><td>'+fmtDT(new Date(r.created_at).getTime())+'</td><td>'+(r.kind==='email'?'E-Mail':'Webhook')+'</td><td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r.target)+'</td><td><span class="pill '+(r.status==='ok'||r.status==='test'?'live':'draft')+'">'+(r.status==='ok'?'zugestellt':r.status==='test'?'Test':r.status==='skipped'?'übersprungen':'fehlgeschlagen')+(r.http_status?' · '+r.http_status:'')+'</span>'+(r.error?'<div class="sub">'+esc(r.error.slice(0,120))+'</div>':'')+(r.attempts>1?'<div class="sub">'+r.attempts+' Versuche</div>':'')+'</td></tr>'; }).join('')+'</tbody></table>' : '<div class="emptyp">'+I('list',18)+'<div>Noch keine Zustellungen.</div></div>'; };
  var m = modal({title:'Zustell-Protokoll', sub:'Die letzten 50 E-Mails und Webhooks von „'+f.name+'“.', size:'mid', body:'<div id="dlog">'+(REMOTE?'<div class="emptyp">Lädt …</div>':'<div class="emptyp">'+I('info',18)+'<div>Das Protokoll füllt sich, sobald TapTell mit Supabase verbunden ist.</div></div>')+'</div>', foot:'<button class="btn pri" data-close>Schließen</button>'});
  if(REMOTE) sb.from('deliveries').select('*').eq('funnel_id', f.id).order('created_at', {ascending:false}).limit(50).then(function(r){ var box = m.el.querySelector('#dlog'); if(box) box.innerHTML = r.error ? '<div class="emptyp">'+esc(r.error.message)+'</div>' : draw(r.data || []); });
}
function domainAdd(f, host, done){
  host = String(host||'').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  if(!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return toast('Bitte eine gültige Domain eingeben, z. B. konfigurator.firma.de');
  if(!REMOTE){ f.settings.domain = {hostname:host, status:'pending', target:'cname.vercel-dns.com'}; touch(); done(); return; }
  sb.functions.invoke('domain-manage', {body:{action:'add', hostname:host, funnel_id:f.id}}).then(function(r){ var err = r.error || (r.data && r.data.error); if(err) return toast(err.message || err); var d = r.data.domain; f.settings.domain = {id:d.id, hostname:d.hostname, status:d.status, target:((d.detail||{}).dns||{}).value}; touch(); done(); });
}
function domainCheck(f, done){
  var d = f.settings.domain || {};
  if(!REMOTE){ d.note = 'Demo-Modus: Die Prüfung läuft, sobald TapTell mit Supabase verbunden ist.'; touch(); done(); return; }
  toast('Prüfe DNS …');
  sb.functions.invoke('domain-manage', {body:{action:'verify', id:d.id}}).then(function(r){ var err = r.error || (r.data && r.data.error); if(err) return toast(err.message || err); d.status = r.data.status; d.note = r.data.note; touch(); done(); toast(d.status === 'active' ? 'Domain ist aktiv' : r.data.note); });
}
function domainRemove(f, done){
  var d = f.settings.domain || {};
  var fin = function(){ delete f.settings.domain; touch(); done(); };
  if(!REMOTE || !d.id) return fin();
  sb.functions.invoke('domain-manage', {body:{action:'remove', id:d.id}}).then(function(r){ var err = r.error || (r.data && r.data.error); if(err) return toast(err.message || err); fin(); });
}
/* Empfängerlisten in den Einstellungen */
function listsCard(){
  return '<div class="card"><div class="ch">'+I('users')+'<h3>Empfängerlisten</h3></div><div class="cb"><p class="hint" style="margin:0 0 12px">Gruppen von E-Mail-Adressen, die du in jedem Funnel für Benachrichtigungen und Regeln auswählen kannst – z. B. „Vertrieb Gehlen“ oder „Geschäftsführung“.</p>'
    + (lists().length ? lists().map(function(l, i){ return '<div class="rule"><div class="rule-r"><input class="inp" data-ll="'+i+'" data-lk="name" value="'+esc(l.name)+'" placeholder="Name der Liste" style="width:200px"><select class="inp" data-ll="'+i+'" data-lk="clientId" style="width:200px"><option value="">Alle Kunden</option>'+(db.clients||[]).map(function(c){ return '<option value="'+c.id+'"'+(l.clientId===c.id?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('')+'</select><span style="flex:1"></span><button class="ibtn" data-a="listDel" data-i="'+i+'" title="Liste löschen">'+I('trash')+'</button></div><textarea class="inp" rows="2" data-ll="'+i+'" data-lk="emails" placeholder="a@firma.de, b@firma.de">'+esc(l.emails.join(', '))+'</textarea></div>'; }).join('') : '<div class="emptyp" style="padding:16px">'+I('users',18)+'<div>Noch keine Listen.</div></div>')
    + '<button class="btn sm" data-a="listAdd">'+I('plus',13)+'Liste anlegen</button></div></div>';
}
function listToRow(l){ return {id:l.id, client_id:l.clientId || null, name:l.name || 'Liste', emails:l.emails || []}; }
function rowToList(r){ return {id:r.id, clientId:r.client_id || '', name:r.name, emails:r.emails || []}; }

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
/* Arbeitsbereich (Kunden-Umschalter): '' = alle, '-' = intern, sonst clientId */
function scopeId(){ return isAdmin() ? (S.scope || '') : ''; }
function inScope(f){ var s = scopeId(); return !s || (s === '-' ? !f.clientId : f.clientId === s); }
function scopedFunnels(){ return visibleFunnels().filter(inScope); }
function scopedLeads(){ var ids = scopedFunnels().map(function(f){ return f.id; }); return visibleLeads().filter(function(l){ return ids.indexOf(l.funnelId) >= 0; }); }
function scopeLabel(){ var s = scopeId(); return !s ? 'Alle Kunden' : s === '-' ? 'Intern' : ((clientById(s)||{}).name || 'Kunde'); }
function setScope(v){ S.scope = v || ''; S.fclient = ''; S.cf.funnel = 'all'; S.afid = null; try{ localStorage.setItem('tt.scope', S.scope); }catch(e){} render(); }
function scopeMenu(btn){
  var items = [{k:'all', ic:!scopeId()?'check':'grid', l:'Alle Kunden', fn:function(){ setScope(''); }}, {k:'int', ic:scopeId()==='-'?'check':'layers', l:'Intern (ohne Kunde)', fn:function(){ setScope('-'); }}];
  if((db.clients||[]).length) items.push('-');
  (db.clients||[]).forEach(function(c){ items.push({k:'c'+c.id, ic:scopeId()===c.id?'check':'folder', l:c.name, fn:function(){ setScope(c.id); }}); });
  items.push('-', {k:'new', ic:'plus', l:'Neuer Kunde', fn:function(){ newClient(); }}, {k:'mng', ic:'settings', l:'Kunden verwalten', fn:function(){ S.view = 'customers'; render(); }});
  dropdown(btn, items);
}
function visibleLeads(){ if(isAdmin()) return db.leads; var ids = visibleFunnels().map(function(f){ return f.id; }); return db.leads.filter(function(l){ return ids.indexOf(l.funnelId) >= 0; }); }
function linkBase(){ return ((CONFIG && CONFIG.publicUrl) || (location.origin + location.pathname.replace(/[^/]*$/, ''))).replace(/\/$/, ''); }
/* Öffentlicher Link: kurz (taptell.de/funnelname); mit publicUrl in config.js die eigene Basis-Domain */
function publicUrl(f){ return linkBase() + '/' + (f.slug || ''); }
function ensureSlug(f){ if(!f.slug) f.slug = slug(f.name).slice(0, 40) + '-' + f.id.slice(0, 5); return f.slug; }
function fixSlugs(){
  var seen = {}, fixed = 0;
  db.funnels.slice().sort(function(a, b){ return (a.createdAt || 0) - (b.createdAt || 0); }).forEach(function(f){
    ensureSlug(f);
    if(seen[f.slug]){ f.slug = uniqueSlug(f.name, f.id); fixed++; }
    seen[f.slug] = 1;
  });
  return fixed;
}

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
  var h = '<div class="page"><div class="ph"><div><h1>Hallo'+(S.user && S.user.name && !S.as ? ', '+esc(S.user.name.split(' ')[0]) : '')+'</h1><p>Deine Funnels, Anfragen und Auswertungen für '+esc(c.name||'dein Unternehmen')+'.</p></div></div>';
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
  var since30 = Date.now() - 30*864e5, mrr = 0, liveC = 0, leads30 = 0;
  cs.forEach(function(c){ mrr += +((c.data||{}).price) || 0; db.funnels.forEach(function(f){ if(f.clientId === c.id && f.status === 'live') liveC++; }); db.leads.forEach(function(l){ var f = getF(l.funnelId); if(f && f.clientId === c.id && l.createdAt > since30) leads30++; }); });
  h += '<div class="kpis">' + kpi('Kunden', cs.length, cs.filter(function(c){ return (db.users||[]).some(function(u){ return u.clientId === c.id; }); }).length + ' mit eigenem Login', 'folder')
    + kpi('Live-Funnels', liveC, 'für Kunden veröffentlicht', 'funnel')
    + kpi('Anfragen', fmtNum(leads30), 'letzte 30 Tage', 'inbox')
    + kpi('Umsatz / Monat', fmtNum(mrr) + ' €', 'aus hinterlegten Paketen', 'percent') + '</div>';
  h += '<div class="card" style="overflow:auto"><table class="t"><thead><tr><th>Kunde</th><th>Paket</th><th>Funnels</th><th>Logins</th><th>Anfragen (30 T.)</th><th>Seit</th><th></th></tr></thead><tbody>';
  cs.forEach(function(c){
    var fs = db.funnels.filter(function(f){ return f.clientId === c.id; }), sh = fs.filter(function(f){ return f.shared; });
    var us = (db.users||[]).filter(function(u){ return u.clientId === c.id; });
    var ls = db.leads.filter(function(l){ return sh.some(function(f){ return f.id === l.funnelId; }); });
    var cd = c.data || {}, live = fs.filter(function(f){ return f.status === 'live'; }).length, l30 = db.leads.filter(function(l){ return l.createdAt > since30 && fs.some(function(f){ return f.id === l.funnelId; }); }).length;
    h += '<tr data-a="openClient" data-id="'+c.id+'"><td><div class="who">'+(c.logo?'<span class="avc" style="background:#fff center/contain no-repeat url(&quot;'+esc(c.logo)+'&quot;);box-shadow:0 0 0 1px var(--line)"></span>':avatar(c.name))+'<div><div class="nm">'+esc(c.name)+'</div><div class="sub">'+esc([cd.industry, cd.city].filter(Boolean).join(' · ') || c.contact || '–')+'</div></div></div></td>'
      + '<td>'+(cd.plan || +cd.price ? '<div class="nm" style="font-weight:500">'+esc(cd.plan||'Individuell')+'</div><div class="sub">'+(+cd.price ? fmtNum(+cd.price)+' € / Monat' : '–')+'</div>' : '<span class="sub">–</span>')+'</td>'
      + '<td>'+(fs.length ? '<span class="pill live nos">'+live+' live</span> <span class="sub">von '+fs.length+'</span>' : '<span class="sub">–</span>')+'</td><td>'+us.length+'</td><td>'+l30+'</td><td class="sub">'+new Date(cd.since || c.createdAt || Date.now()).toLocaleDateString('de-DE')+'</td>'
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
      t += fs.length ? fs.map(function(f){ return '<div class="crow"><div style="flex:1;min-width:0"><b>'+esc(f.name)+'</b><div class="sub">'+f.pages.length+' Seiten · '+leadsOf(f.id).length+' Anfragen · '+(f.status==='live'?'Live':'Entwurf')+'</div></div><label class="tgl" style="margin:0;gap:10px"><span style="font-size:var(--fs-13);color:var(--ink2)">'+(f.shared?'Freigeschaltet':'Gesperrt')+'</span><input type="checkbox" data-cshare="'+f.id+'"'+(f.shared?' checked':'')+'><span class="sw"></span></label><button class="ibtn" data-cedit="'+f.id+'" title="Bearbeiten">'+I('edit')+'</button><button class="ibtn" data-cunassign="'+f.id+'" title="Zuordnung entfernen">'+I('x')+'</button></div>'; }).join('') : '<p style="color:var(--mut);margin:0 0 12px">Diesem Kunden ist noch kein Funnel zugeordnet.</p>';
      t += '<div style="display:flex;gap:8px;margin-top:14px"><select class="inp" id="cassign"><option value="">Funnel zuordnen …</option>'+free.map(function(f){ return '<option value="'+f.id+'">'+esc(f.name)+'</option>'; }).join('')+'</select><button class="btn" data-cassign>'+I('plus',14)+'Zuordnen</button></div><p class="hint">Nur freigeschaltete Funnels samt Anfragen und Analytics sind im Kundenlogin sichtbar. Bearbeiten kannst nur du als Admin.</p>';
    } else if(tab === 'users'){
      t += us.length ? us.map(function(u){ return '<div class="crow">'+avatar(u.name||u.email)+'<div style="flex:1;min-width:0"><b>'+esc(u.name||'–')+'</b><div class="sub">'+esc(u.email)+(REMOTE?'':' · Passwort: <code>'+esc(u.password)+'</code>')+'</div></div>'+(REMOTE?'<button class="btn sm" data-ureset="'+u.id+'">Passwort-Link senden</button>':'')+'<button class="ibtn" data-udel="'+u.id+'" title="Zugang löschen">'+I('trash')+'</button></div>'; }).join('') : '<p style="color:var(--mut);margin:0 0 12px">Noch keine Logins für diesen Kunden.</p>';
      t += '<div class="dsec">Neuen Login anlegen</div><div class="row2"><div class="fld"><label>Name</label><input class="inp" id="uname" placeholder="Max Mustermann"></div><div class="fld"><label>E-Mail</label><input class="inp" id="umail" type="email" placeholder="max@kunde.de"></div></div><button class="btn pri" data-uadd>'+I(REMOTE?'send':'plus',14)+(REMOTE?'Einladung senden':'Login anlegen')+'</button><p class="hint">'+(REMOTE?'Der Kunde erhält eine E-Mail und legt beim ersten Login sein Passwort fest.':'Demo-Modus: Es wird ein Passwort erzeugt, das du dem Kunden mitteilst.')+'</p>';
    } else {
      var d = c.data || {}, fi = function(k, label, ph, type){ return '<div class="fld"><label>'+label+'</label><input class="inp" data-cd="'+k+'" value="'+esc(d[k]||'')+'" placeholder="'+esc(ph||'')+'"'+(type?' type="'+type+'"':'')+'></div>'; };
      t += '<div class="dsec" style="margin-top:0">Firma</div><div class="row2"><div class="fld"><label>Firmenname</label><input class="inp" data-cf="name" value="'+esc(c.name)+'"></div><div class="fld"><label>Branche</label><select class="inp" data-cd="industry"><option value="">Bitte wählen</option>'+INDUSTRIES.map(function(x){ return '<option'+(d.industry===x?' selected':'')+'>'+x+'</option>'; }).join('')+'</select></div></div>'
        + '<div class="dsec">Kontakt</div><div class="row2">'+fi('person','Ansprechpartner','Max Mustermann')+'<div class="fld"><label>E-Mail</label><input class="inp" data-cf="contact" type="email" value="'+esc(c.contact||'')+'" placeholder="info@kunde.de"></div></div><div class="row2">'+fi('phone','Telefon','+49 …','tel')+fi('website','Website','https://kunde.de','url')+'</div>'
        + '<div class="dsec">Anschrift</div>'+fi('street','Straße und Hausnummer','Musterstraße 1')+'<div class="row2" style="grid-template-columns:120px minmax(0,1fr)">'+fi('zip','PLZ','12345')+fi('city','Ort','Musterstadt')+'</div>'
        + '<div class="dsec">Vertrag</div><div class="row3"><div class="fld"><label>Paket</label><select class="inp" data-cd="plan"><option value="">–</option>'+PLANS.map(function(x){ return '<option'+(d.plan===x?' selected':'')+'>'+x+'</option>'; }).join('')+'</select></div>'+fi('price','Preis / Monat (€)','0','number')+fi('since','Vertragsbeginn','','date')+'</div>'
        + '<div class="fld"><label>Notizen (nur für dich)</label><textarea class="inp" data-cd="notes" rows="3" placeholder="z. B. Ansprechpartner im Urlaub bis …">'+esc(d.notes||'')+'</textarea></div>'
        + '<div class="fld"><label>Logo (erscheint im Kundenportal)</label><div class="upl"><div class="pv" style="'+(c.logo?'background:#fff center/contain no-repeat url(&quot;'+esc(c.logo)+'&quot;)':'')+'">'+(c.logo?'':I('image'))+'</div><label class="btn sm">'+I('upload',13)+'Hochladen<input type="file" accept="image/*" data-clogo></label>'+libraryButton()+'</div></div>'
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
        if(e.target.closest('[data-media-pick]')){ mediaModal(function(src){ c.logo=src; save(); re(); }); return; }
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
        if(x.hasAttribute('data-clogo') && x.files[0]) uploadAdminImage(x.files[0], 400, function(url){ c.logo = url; save(); re(); });
      });
      el.addEventListener('input', function(e){ var x = e.target; if(x.hasAttribute('data-cf')){ c[x.getAttribute('data-cf')] = x.value; save(); } else if(x.hasAttribute('data-cd')){ c.data = c.data || {}; c.data[x.getAttribute('data-cd')] = x.value; save(); } });
    }});
}
var INDUSTRIES = ['Schreinerei & Tischlerei','Bau & Ausbau','Garten- & Landschaftsbau','Solar & Energie','Sanitär, Heizung, Klima','Elektro','Möbel & Einrichtung','Immobilien','Gastronomie','Hotellerie','Freizeit & Tourismus','Einzelhandel','Gesundheit & Pflege','Beauty & Wellness','Fitness & Sport','Automobil','Dienstleistung','Agentur','Sonstige'];
var PLANS = ['Starter','Business','Premium','Individuell'];
function newClient(){
  modal({title:'Neuer Kunde', sub:'Die übrigen Stammdaten kannst du danach ergänzen.', body:'<div class="fld"><label>Firmenname</label><input class="inp" id="ncn" placeholder="Holz Gehlen GmbH" autofocus></div><div class="fld"><label>Branche</label><select class="inp" id="nci"><option value="">Bitte wählen</option>'+INDUSTRIES.map(function(x){ return '<option>'+x+'</option>'; }).join('')+'</select></div><div class="fld"><label>E-Mail (optional)</label><input class="inp" id="ncm" type="email" placeholder="info@kunde.de"></div>',
    foot:'<button class="btn" data-close>Abbrechen</button><button class="btn pri" data-ncok>'+I('plus',14)+'Kunde anlegen</button>',
    onOpen:function(el, close){
      var ok = function(){ var v = el.querySelector('#ncn').value.trim(); if(!v) return toast('Bitte einen Firmennamen eingeben'); var c = {id:uid(), name:v, contact:el.querySelector('#ncm').value.trim(), logo:'', data:{industry:el.querySelector('#nci').value}, createdAt:Date.now()}; db.clients = (db.clients||[]).concat([c]); save(); close(); render(); clientModal(c.id, 'data'); };
      el.querySelector('[data-ncok]').onclick = ok;
      el.querySelector('#ncn').onkeydown = function(e){ if(e.key === 'Enter') ok(); };
      setTimeout(function(){ el.querySelector('#ncn').focus(); }, 30);
    }});
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
function emptyDb(){ return {version:2, funnels:[], leads:[], clients:[], users:[], lists:[], brand:T.theme('clean'), defaults:{webhook:''}, fonts:{google:[], uploaded:[]}}; }
/* supabase-js fest gepinnt: ein neues Release ändert nichts ungeprüft. Beim Aktualisieren URL und Hash gemeinsam tauschen (auch in src/build.py). */
var SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js', SUPABASE_JS_SRI = 'sha384-uteMfOloLDGt042uDz+xHGF3ym63/WQ6rFq7murQRG8Ih7QrXGEGNtWd8688sb4O';
function loadScript(src, sri){ return new Promise(function(res, rej){ var s = document.createElement('script'); s.src = src; if(sri){ s.integrity = sri; s.crossOrigin = 'anonymous'; } s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
var SNAP = {funnels:{}, leads:{}, clients:{}, settings:''}, syncing = false, syncAgain = false;
function funnelToRow(f){ ensureSlug(f); var r = {id:f.id, name:f.name, slug:f.slug, status:f.status, client_id:f.clientId || null, shared:!!f.shared, theme:f.theme, settings:f.settings, pages:f.pages, created_at:new Date(f.createdAt||Date.now()).toISOString(), updated_at:new Date(f.updatedAt||Date.now()).toISOString()}; if(HAS_PUB) r.published = f.published || null; return r; }
function rowToFunnel(r, st){ return {id:r.id, name:r.name, slug:r.slug, overviewColor:r.overview_color || '', status:r.status, clientId:r.client_id, shared:r.shared, published:r.published || null, versions:HAS_VT ? [] : (r.versions || []), theme:Object.assign({}, T.THEME_BASE, r.theme||{}), settings:r.settings||{}, pages:r.pages||[], createdAt:Date.parse(r.created_at), updatedAt:Date.parse(r.updated_at), stats:st || {views:0, starts:0, completes:0, pages:{}, daily:{}}}; }
var LEAD_COLS = ['id','funnelId','funnelName','name','email','phone','total','status','notes','createdAt'];
function leadToRow(l){ var data = {}; Object.keys(l).forEach(function(k){ if(LEAD_COLS.indexOf(k) < 0) data[k] = l[k]; }); return {id:l.id, funnel_id:l.funnelId || null, funnel_name:l.funnelName || '', name:l.name || null, email:l.email || null, phone:l.phone || null, total:l.total || 0, status:l.status || 'neu', notes:l.notes || '', data:data, created_at:new Date(l.createdAt||Date.now()).toISOString()}; }
function rowToLead(r){ return Object.assign({}, r.data || {}, {id:r.id, funnelId:r.funnel_id, funnelName:r.funnel_name, name:r.name, email:r.email, phone:r.phone, total:+r.total || 0, status:r.status, notes:r.notes || '', createdAt:Date.parse(r.created_at)}); }
function clientToRow(c){ return {id:c.id, name:c.name, logo:c.logo || null, contact:c.contact || null, data:c.data || {}, created_at:new Date(c.createdAt||Date.now()).toISOString()}; }
function rowToClient(r){ return {id:r.id, name:r.name, logo:r.logo || '', contact:r.contact || '', data:r.data || {}, createdAt:Date.parse(r.created_at)}; }
function settingsPayload(){ return {brand:db.brand, defaults:db.defaults, fonts:db.fonts}; }

async function afterLogin(u){
  clearTimeout(timeoutRetry); timeoutRetry = null; lastSaveError = ''; setSaved(true);
  var pr = await sb.from('profiles').select('*').eq('id', u.id).maybeSingle();
  if(pr.error || !pr.data){ await sb.auth.signOut(); toast('Für dieses Konto ist kein Zugang eingerichtet.'); S.user = null; return render(); }
  S.user = {id:u.id, email:u.email, name:pr.data.name || '', role:pr.data.role, clientId:pr.data.client_id};
  try{ await loadRemote(); }catch(e){ toast('Daten konnten nicht geladen werden: ' + (e.message || e)); }
  if(S.view === 'editor' && !getF(S.fid)) S.view = 'funnels';
  render();
}
async function loadRemote(){
  var q = await Promise.all([sb.from('clients').select('*'), sb.from('funnels').select('*'), sb.from('leads').select('*').order('created_at', {ascending:false}).limit(10000), sb.rpc('funnel_stats'), sb.from('app_settings').select('data').eq('id', 1).maybeSingle(), realAdmin() ? sb.from('profiles').select('*') : Promise.resolve({data:[]}), realAdmin() ? sb.from('recipient_lists').select('*') : Promise.resolve({data:[]})]);
  if(q[6].error){ console.warn('recipient_lists:', q[6].error.message); q[6] = {data:[]}; } /* Tabelle erst nach automation.sql vorhanden */
  q.forEach(function(r){ if(r.error) throw r.error; });
  var stats = {}; (q[3].data || []).forEach(function(r){ stats[r.funnel_id] = {views:+r.views || 0, starts:+r.starts || 0, completes:+r.completes || 0, pages:r.pages || {}, daily:r.daily || {}}; });
  var set = (q[4].data && q[4].data.data) || {};
  db = emptyDb();
  var pubProbe = await sb.from('funnels').select('published').limit(0); HAS_PUB = !pubProbe.error;
  var vtProbe = await sb.from('funnel_versions').select('id').limit(0); HAS_VT = !vtProbe.error; /* Tabelle aus versionen-2.sql */ /* Spalten aus versionen.sql vorhanden? */
  db.clients = (q[0].data || []).map(rowToClient);
  savedOverviewColors.clear();
  (q[1].data || []).forEach(function(r){ if(r.overview_color) savedOverviewColors.set(r.id, r.overview_color); });
  db.funnels = (q[1].data || []).map(function(r){ return rowToFunnel(r, stats[r.id]); }).sort(function(a, b){ return b.updatedAt - a.updatedAt; });
  db.leads = (q[2].data || []).map(rowToLead);
  db.lists = (q[6].data || []).map(rowToList);
  db.users = (q[5].data || []).map(function(p){ return {id:p.id, email:p.email, name:p.name, role:p.role, clientId:p.client_id}; });
  if(set.brand) db.brand = set.brand; if(set.defaults) db.defaults = set.defaults; if(set.fonts) db.fonts = set.fonts;
  SNAP = {funnels:{}, leads:{}, clients:{}, recipient_lists:{}, settings:JSON.stringify(settingsPayload())};
  db.lists.forEach(function(l){ SNAP.recipient_lists[l.id] = JSON.stringify(listToRow(l)); });
  db.funnels.forEach(function(f){ SNAP.funnels[f.id] = JSON.stringify(funnelToRow(f)); VSNAP[f.id] = JSON.stringify((f.versions || []).map(function(v){ return v.id; })); });
  db.leads.forEach(function(l){ SNAP.leads[l.id] = JSON.stringify(leadToRow(l)); });
  db.clients.forEach(function(c){ SNAP.clients[c.id] = JSON.stringify(clientToRow(c)); });
  ensureFonts();
}
/* Bestehende Datensätze gezielt aktualisieren: Live-Stand und eingebettete Bilder
   gehören nur in den Request, wenn sich die jeweilige Spalte geändert hat. */
async function syncFunnels(){
  var snapshots = SNAP.funnels;
  for(var f of db.funnels){
    var row = funnelToRow(f), id = row.id, next = JSON.stringify(row);
    if(next === snapshots[id]) continue;
    var result;
    if(snapshots[id]){
      var previous = JSON.parse(snapshots[id]), patch = {};
      Object.keys(row).forEach(function(key){
        if(JSON.stringify(previous[key]) !== JSON.stringify(row[key])) patch[key] = row[key];
      });
      result = await sb.from('funnels').update(patch).eq('id', id).select('id').single();
    } else {
      result = await sb.from('funnels').upsert(row);
    }
    if(result.error) throw result.error;
    snapshots[id] = next;
  }
  var seen = new Set(db.funnels.map(function(f){ return f.id; }));
  var removed = Object.keys(snapshots).filter(function(id){ return !seen.has(id); });
  if(removed.length){
    var deleted = await sb.from('funnels').delete().in('id', removed);
    if(deleted.error) throw deleted.error;
    removed.forEach(function(id){ delete snapshots[id]; delete VSNAP[id]; savedOverviewColors.delete(id); });
  }
}
async function syncVersions(){
  if(!HAS_VT) return; /* ohne Tabelle bleiben Backups lokal – kein großes Schreiben mehr in eine Zelle (Timeout) */
  for(var f of db.funnels){
    var fresh = (f.versions || []).filter(function(v){ return !VSAVED[v.id] && !v._remote; });
    if(!fresh.length) continue;
    var rows = fresh.map(function(v){ return {id:v.id, funnel_id:f.id, at:new Date(v.at).toISOString(), kind:v.kind === 'publish' ? 'publish' : 'auto', label:v.label || null, data:{name:v.name, theme:v.theme, settings:v.settings, pages:v.pages}}; });
    for(var i = 0; i < rows.length; i++){ var ins = await sb.from('funnel_versions').upsert(rows[i]); if(ins.error) throw ins.error; VSAVED[rows[i].id] = 1; }
    /* behalten: 4 Veröffentlichungen + 8 automatische Stände */
    var list = await sb.from('funnel_versions').select('id,kind').eq('funnel_id', f.id).order('at', {ascending:false});
    if(list.error) throw list.error;
    var pub = 0, auto = 0, drop = (list.data || []).filter(function(v){ return v.kind === 'publish' ? ++pub > 4 : ++auto > 8; }).map(function(v){ return v.id; });
    if(drop.length){ var del = await sb.from('funnel_versions').delete().in('id', drop); if(del.error) throw del.error; }
  }
}
async function loadVersions(f){
  if(!HAS_VT || !sb) return f.versions || [];
  var r = await sb.from('funnel_versions').select('*').eq('funnel_id', f.id).order('at', {ascending:false}).limit(12);
  if(r.error) throw r.error;
  var remote = (r.data || []).map(function(x){ VSAVED[x.id] = 1; return Object.assign({id:x.id, at:Date.parse(x.at), kind:x.kind, label:x.label || '', _remote:true}, x.data || {}); });
  var local = (f.versions || []).filter(function(v){ return !remote.some(function(x){ return x.id === v.id; }); });
  f.versions = local.concat(remote).sort(function(a, b){ return b.at - a.at; });
  return f.versions;
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
/* Separater PATCH: Eine Markierung berührt weder den Entwurf noch den Live-Stand. */
var savedOverviewColors = new Map();
async function syncOverviewColors(){
  for(var f of db.funnels){
    var color = f.overviewColor || '';
    if(color === (savedOverviewColors.get(f.id) || '')) continue;
    var result = await sb.from('funnels').update({overview_color:color || null}).eq('id', f.id).select('id').single();
    if(result.error) throw result.error;
    if(color) savedOverviewColors.set(f.id, color); else savedOverviewColors.delete(f.id);
  }
}
var lastSaveError = '', timeoutRetry = null;
async function syncRemote(){
  if(!sb || !S.user) return;
  if(syncing){ syncAgain = true; return; }
  syncing = true; setSaved(null);
  var stage = 'Kontakte';
  try{
    if(realAdmin()){
      await syncTable('clients', db.clients || [], clientToRow);
      if(fixSlugs()) toast('Doppelte Link-Adresse korrigiert – die Kopie hat jetzt eine eigene Adresse');
      stage = 'Funnel-Entwurf'; await syncFunnels();
      stage = 'App-Einstellungen';
      var sp = JSON.stringify(settingsPayload()); if(sp !== SNAP.settings){ var r = await sb.from('app_settings').upsert({id:1, data:settingsPayload()}); if(r.error) throw r.error; SNAP.settings = sp; }
      stage = 'Leads'; await syncTable('leads', db.leads, leadToRow);
      try{ await syncTable('recipient_lists', lists(), listToRow); }catch(e){ console.warn('recipient_lists:', e.message || e); }
      stage = 'Übersichtsfarben'; await syncOverviewColors();
      if(HAS_PUB){ stage = 'Versionsbackup'; await syncVersions(); }
    } else {
      await syncTable('leads', visibleLeads(), leadToRow, ['status','notes']);
    }
    if(!syncAgain && !saveT) setSaved(true);
    lastSaveError = ''; clearTimeout(timeoutRetry); timeoutRetry = null;
  }catch(e){
    setSaved(stage === 'Versionsbackup' ? 'backup' : false);
    var message = stage + ': ' + (e.message || e);
    if(message !== lastSaveError) toast('Speichern fehlgeschlagen – ' + message);
    if((e.code === '57014' || /statement timeout/i.test(e.message)) && timeoutRetry === null){
      var owner = S.user, sessionDb = db;
      timeoutRetry = setTimeout(function(){
        if(S.user === owner && db === sessionDb) syncRemote();
      }, 5000);
    }
    lastSaveError = message;
  }
  syncing = false;
  if(syncAgain){ syncAgain = false; syncRemote(); }
}
async function bootRemote(){
  $('#app').innerHTML = '<div class="login"><div style="color:var(--mut)">Lädt …</div></div>';
  try{ await loadScript(SUPABASE_JS, SUPABASE_JS_SRI); }catch(e){ $('#app').innerHTML = '<div class="login"><div class="lcard">Supabase konnte nicht geladen werden.</div></div>'; return; }
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
  ccPreview:function(){ FP.showConsent(F(), {preview:true}); },
  afid:function(el){ S.afid = el.getAttribute('data-id'); render(); },
  theme:function(){ var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', t); try{ localStorage.setItem('tt-theme', t); }catch(e){} render(); },
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
  scope:function(el){ scopeMenu(el); },
  useTpl:function(el){ createFromTpl(el.getAttribute('data-id')); },
  tcat:function(el){ S.tcat = el.getAttribute('data-v'); render(); },
  manageMedia:function(){ mediaModal(); },
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
  devPick:function(el, e){ if(e) e.stopPropagation(); var cur = curDevice().k; dropdown(el, DEVICES.map(function(d){ return {k:d.k, l:d.n+' · '+d.w+' × '+d.h, ic:d.k === cur ? 'check' : 'mobile', fn:function(){ try{ localStorage.setItem('tt-phone', d.k); }catch(x){} renderEditor(); }}; })); },
  lpToggle:function(){ var off = !lpOff(); try{ localStorage.setItem('tt-lp', off ? '0' : '1'); }catch(x){} var ed = $('.ed'); if(ed) ed.classList.toggle('lp-off', off); var b = $('[data-a="lpToggle"]'); if(b) b.setAttribute('aria-pressed', !off); setTimeout(function(){ var el = S.sel && $('#scr .fp-b.sel'); if(el) placeTool(el); }, 280); },
  undo:undo, redo:redo,
  preview:function(){ openPreview(F(), S.pi); },
  publish:function(){ publishModal(F()); },
  versions:function(){ versionsModal(F()); },
  addLib:function(el){ addFromLibClick(el.getAttribute('data-lib')); },
  page:function(el, e){ if(e.target.closest('[data-a="pmenu"]')) return; selectPage(+el.getAttribute('data-i')); },
  pmenu:function(el, e){ e.stopPropagation(); var i = +el.getAttribute('data-i'), f = F(); dropdown(el, [
    {k:'r', l:'Umbenennen', ic:'type', fn:function(){ promptBox('Seite umbenennen','Name',f.pages[i].name,function(v){ snap(true); f.pages[i].name = v; touch(); renderLeft(); renderCanvas(true); renderRight(); }); }},
    {k:'d', l:'Duplizieren', ic:'dup', fn:function(){ dupPage(i); }},
    {k:'p', l:'Ab hier testen', ic:'play', fn:function(){ openPreview(f, i); }},
    '-', {k:'x', l:'Löschen', ic:'trash', danger:true, fn:function(){ delPage(i); }}]); },
  addPage:addPage,
  autoOpen:function(){ autoModal(F()); },
  listAdd:function(){ lists().push({id:uid(), name:'Neue Liste', clientId:'', emails:[]}); save(); render(); },
  listDel:function(el){ var i = +el.getAttribute('data-i'); confirmBox('Liste löschen?', '„'+lists()[i].name+'“ wird aus allen Funnels entfernt.', 'Löschen', function(){ var id = lists()[i].id; lists().splice(i,1); db.funnels.forEach(function(f){ var a = f.settings.automation; if(!a) return; if(a.notify && a.notify.lists) a.notify.lists = a.notify.lists.filter(function(x){ return x !== id; }); (a.rules||[]).forEach(function(r){ r.lists = (r.lists||[]).filter(function(x){ return x !== id; }); }); }); save(); render(); }, true); },
  emoSet:function(el){ var b = selBlock(); if(!b) return; snap(true); b.props.emojis = el.getAttribute('data-v'); touch(); renderCanvas(true); renderRight(); },
  rrAdd:function(){ var b = selBlock(); if(!b) return; snap(true); var mx = FP.rateMax(b.props), r = b.props.routes || []; b.props.routes = r.concat([r.length ? {min:Math.min(mx, (+r[r.length-1].max||0)+1), max:mx, goto:''} : {min:1, max:Math.max(1, Math.floor(mx*0.6)), goto:''}]); touch(); renderRight(); renderLeft(); renderCanvas(true); },
  rrDel:function(el){ var b = selBlock(); if(!b) return; snap(true); b.props.routes.splice(+el.getAttribute('data-i'),1); touch(); renderRight(); renderLeft(); renderCanvas(true); },
  insVar:function(el){ varMenu(el); },
  flow:function(){ flowModal(); },
  pprev:function(){ if(S.pi > 0) selectPage(S.pi - 1); },
  pnext:function(){ if(S.pi < F().pages.length - 1) selectPage(S.pi + 1); },
  pjump:function(el){ pageJump(el); },
  pdup:function(el){ dupPage(+el.getAttribute('data-i')); },
  pdel:function(el){ delPage(+el.getAttribute('data-i')); },
  bup:function(){ moveBlock(-1); }, bdown:function(){ moveBlock(1); }, bdup:dupBlock, bcopy:copyBlock, bpaste:pasteBlock, bdel:delBlock,
  seg:function(el){
    var scope = el.getAttribute('data-scope'), k = el.getAttribute('data-k'), v = el.getAttribute('data-v'); if(el.getAttribute('data-t') === 'number') v = +v;
    snap(true); setScoped(scope, k, v); renderCanvas(true); renderRight();
  },
  pack:function(el){ var f = F(), P0 = STYLE_PACKS[el.getAttribute('data-v')]; if(!P0) return; snap(true); Object.keys(P0.t).forEach(function(k){ f.theme[k] = P0.t[k]; });
    if(el.getAttribute('data-v') === 'glass'){ f.theme.bg = hexMix(f.theme.primary || '#4b4bf0', '#ffffff', .06); f.theme.bg2 = hexMix(f.theme.primary || '#4b4bf0', '#ffffff', .28); f.theme.surface = hexMix(f.theme.primary || '#4b4bf0', '#ffffff', .08); }
    else if(el.getAttribute('data-v') !== 'soft' && (f.theme.bg === '#eef0f3' || f.theme.bgGrad)){ f.theme.bg = '#ffffff'; f.theme.surface = '#f4f4f5'; f.theme.bgGrad = false; }
    ensureFonts(); touch(); renderCanvas(true); renderRight(); },
  logoColor:function(el){ var t = F().theme, c = el.getAttribute('data-v'); snap(true); t.primary = c; t.primaryText = onColor(c); touch(); renderCanvas(true); renderRight(); },
  pageAnim:function(el){
    var v = el.getAttribute('data-v'); snap(true); setScoped('t', 'animation', v); renderCanvas(true); renderRight();
    /* Vorschau im Handy: Klasse kurz setzen, damit der Übergang einmal abläuft */
    var pg = $('#canvas .fp-page'); if(!pg || v === 'none') return;
    pg.classList.add('fp-anim-' + v); clearTimeout(window.__animDemo); window.__animDemo = setTimeout(function(){ pg.classList.remove('fp-anim-' + v); }, 900);
  },
  optIc:function(el){ var b = selBlock(), o = b && b.props.options[+el.getAttribute('data-i')], v = el.getAttribute('data-v'); if(!o) return; snap(true); if(v) o.ic = v; else delete o.ic; touch(); renderCanvas(true); renderRight(); },
  spReset:function(){ var t = F().theme; snap(true); SP_KEYS.forEach(function(k){ delete t[k]; }); touch(); renderCanvas(true); renderRight(); },
  etab:function(el){ S.etab = el.getAttribute('data-v'); renderRight(); },
  accT:function(el){ var sec = el.closest('.acc'), id = el.getAttribute('data-id'), on = !sec.classList.contains('open'); sec.classList.toggle('open', on); el.setAttribute('aria-expanded', on); ACC[id] = on; try{ localStorage.setItem('tt-acc', JSON.stringify(ACC)); }catch(e){} },
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
  padLink:function(el){ var scope = el.getAttribute('data-scope'), keys = el.getAttribute('data-keys').split(','), tgt = scope==='p'?selBlock().props:scope==='t'?F().theme:null; if(!tgt) return; snap(true);
    if(el.getAttribute('data-mode') === 'reset') keys.forEach(function(k){ delete tgt[k]; });
    else { var inp = el.closest('.fld').querySelector('input'), v = inp && inp.value !== '' ? +inp.value : +(inp && inp.placeholder) || 0; keys.forEach(function(k){ tgt[k] = v; }); }
    touch(); renderCanvas(true); renderRight(); },
  fmtPaint:function(){ fmtCopy(true); },
  fmtCopy:function(){ fmtCopy(false); },
  fmtPaste:function(){ var b = selBlock(); if(b) fmtApply(b); },
  swPick:function(el){ var w = el.closest('.colw'), tx = w && w.querySelector('.colr input[type=text]'); if(!tx) return; tx.value = el.getAttribute('data-c'); tx.dispatchEvent(new Event('input', {bubbles:true})); tx.dispatchEvent(new Event('change', {bubbles:true})); w.querySelectorAll('.sw').forEach(function(s){ s.classList.toggle('on', s === el); }); },
  swDel:function(el){ var h = swHost(); if(!h) return; h.o.swatches = (h.o.swatches || []).filter(function(x){ return x !== el.getAttribute('data-c'); }); save(); renderRight(); },
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
  var mediaPick = e.target.closest('[data-media-pick]');
  if(mediaPick && !mediaPick.closest('#cmb')){
    var imageInput = mediaPick.parentElement.querySelector('input[type=file]');
    mediaModal(function(src){ applyEditorImage(imageInput,src); }); return;
  }
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
  if(e.target.closest('#canvas') && !e.target.closest('.phone .fp-b') && !e.target.closest('.pnav') && !e.target.closest('#btool') && S.sel){ S.sel = null; if(S.rtab === 'el') S.rtab = 'page'; $$('#scr .fp-b.sel').forEach(function(x){ x.classList.remove('sel'); }); var tb = $('#btool'); if(tb) tb.remove(); renderRight(); }
});

function readVal(el){ if(el.hasAttribute('data-bool')){ var c = el.checked; return el.hasAttribute('data-inv') ? (c ? undefined : false) : c; } if(el.hasAttribute('data-num')) return el.value === '' ? '' : +el.value; return el.value; }
document.addEventListener('input', function(e){
  var el = e.target;
  if(el.id === 'fq'){ S.q = el.value; var pos = el.selectionStart; render(); var n = $('#fq'); n.focus(); n.setSelectionRange(pos,pos); return; }
  if(el.id === 'cq'){ S.cf.q = el.value; var p2 = el.selectionStart; render(); var n2 = $('#cq'); n2.focus(); n2.setSelectionRange(p2,p2); return; }
  if(el.id === 'qrurl'){ var pf = F() || null; clearTimeout(window.__qrT); window.__qrT = setTimeout(function(){ drawQR(el.value.trim()); var pc = $('#pubcode'); if(pc) pc.value = el.value.trim(); }, 300); if(pf){ pf.settings.hostedUrl = el.value.trim(); save(); } return; }
  if(el.id === 'libq'){ S.libq = el.value; var p3 = el.selectionStart; renderLeft(); var n3 = $('#libq'); n3.focus(); n3.setSelectionRange(p3,p3); return; }
  if(el.hasAttribute('data-ll')){ var lo = lists()[+el.getAttribute('data-ll')], lk = el.getAttribute('data-lk'); if(!lo) return; lo[lk] = lk === 'emails' ? splitMails(el.value) : el.value; save(); return; }
  if(el.hasAttribute('data-fslug')){ var sf = F(), sv = slug(el.value), hint = $('#fslugh'), serr = slugError(sv, sf.id), bad = !!serr; el.parentNode.classList.toggle('err', bad); if(hint){ hint.classList.toggle('errt', bad); hint.textContent = serr || publicUrl({slug:sv}); } if(!bad){ sf.slug = sv; touch(); } return; }
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
    if(scope === 'pp' && k === 'confetti'){ renderRight(); if(v && $('#scr')) FP.confetti($('#scr'), F(), {contained:true}); } /* Vorschau direkt im Handy */
    if(el.hasAttribute('data-rp')) renderRight();
    return;
  }
  if(el.hasAttribute('data-o')){ var b = selBlock(), i = +el.getAttribute('data-oi'), ok = el.getAttribute('data-o'); snap(el.tagName === 'SELECT'); b.props.options[i][ok] = readVal(el); touch(); renderCanvas(true); if(ok === 'goto'){ renderLeft(); renderRight(); } return; }
  if(el.hasAttribute('data-arr')){ var b2 = selBlock(); snap(); b2.props[el.getAttribute('data-arr')][+el.getAttribute('data-ai')] = el.value; touch(); renderCanvas(true); return; }
  if(el.hasAttribute('data-faq')){ var b3 = selBlock(); snap(); b3.props.items[+el.getAttribute('data-faq')][el.getAttribute('data-fk')] = el.value; touch(); renderCanvas(true); return; }
  if(el.hasAttribute('data-rr')){ var rb = selBlock(), rr = rb && rb.props.routes[+el.getAttribute('data-rr')], rk = el.getAttribute('data-rk'); if(!rr) return; snap(el.tagName === 'SELECT'); rr[rk] = rk === 'goto' ? el.value : +el.value; touch(); renderLeft(); renderCanvas(true); return; }
  if(el.hasAttribute('data-sr')){ var pg = curPage(), r = pg.scoreRoutes[+el.getAttribute('data-sr')], sk = el.getAttribute('data-sk'); snap(el.tagName === 'SELECT'); r[sk] = sk === 'goto' ? el.value : +el.value; touch(); renderLeft(); return; }
});
function syncColor(el, scope, k, v){ var w = el.closest('.colr'); if(!w) return; $$('input', w).forEach(function(x){ if(x === el || x.type === 'range') return; if(x.type === 'color') x.value = toHex(v); else x.value = v; }); var al = w.querySelector('[data-alpha]'); if(al){ al.style.setProperty('--c', toHex(v)); if(el.type === 'text'){ var na = colAlpha(v); al.value = na; al.nextElementSibling.textContent = na + '%'; } } }
function rangeLabel(el){ if(el.type === 'range'){ var s = el.parentNode.querySelector('span'); if(s) s.textContent = el.value + (el.hasAttribute('data-unit') ? el.getAttribute('data-unit') : 'px'); } }

document.addEventListener('change', function(e){
  var el = e.target;
  /* gewählte Farbe in die Schnellfarben übernehmen (Farbwähler geschlossen oder Hex-Wert bestätigt) */
  if(S.view === 'editor' && el.closest && el.closest('.colr') && (el.type === 'color' || el.type === 'text')) swAdd(el.value);
  if(el.id === 'cfun'){ S.cf.funnel = el.value; S.csel = {}; render(); return; }
  if(el.id === 'afun'){ S.afid = el.value; render(); return; }
  if(el.id === 'fcl'){ S.fclient = el.value; render(); return; }
  if(el.hasAttribute && el.hasAttribute('data-fclient')){ var f0 = F(); snap(true); f0.clientId = el.value || null; if(!f0.clientId) f0.shared = false; touch(); renderRight(); toast(f0.clientId ? 'Kunde zugeordnet' : 'Zuordnung entfernt'); return; }
  if(el.hasAttribute && el.hasAttribute('data-fshare')){ var f1 = F(); f1.shared = el.checked; touch(); toast(f1.shared ? 'Für den Kunden freigeschaltet' : 'Freigabe entfernt'); return; }
  if(el.getAttribute && el.getAttribute('data-a') === 'lstat'){ var l = db.leads.filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; l.status = el.value; el.className = 'stsel s-'+el.value; save(); return; }
  if(el.hasAttribute && el.hasAttribute('data-lottie') && el.files[0]){
    var lf = el.files[0]; if(lf.size > 1.5e6){ toast('Lottie-Datei zu groß (max. 1,5 MB)'); return; }
    var lr = new FileReader(); lr.onload = function(){ try{ var j = JSON.parse(lr.result); if(!j.layers) throw 0; snap(true); setScoped('p', el.getAttribute('data-lottie'), lr.result); renderCanvas(true); renderRight(); toast('Animation geladen'); }catch(x){ toast('Das ist keine gültige Lottie-Datei'); } };
    lr.readAsText(lf); return;
  }
  if(el.matches && el.matches('input[data-arrimg],input[data-img],input[data-optimg]') && el.files[0]){
    var size = el.hasAttribute('data-optimg') ? 900 : el.hasAttribute('data-arrimg') || el.dataset.img === 'logoImg' ? 600 : 1400;
    uploadAdminImage(el.files[0],size,function(src){ applyEditorImage(el,src); });
    return;
  }
  if(el.hasAttribute && el.hasAttribute('data-fontup') && el.files[0]){
    var file = el.files[0]; if(file.size > 1.2e6){ toast('Schriftdatei zu groß (max. 1,2 MB) – bitte WOFF2 verwenden'); return; }
    var rd = new FileReader(); rd.onload = function(){ var name = file.name.replace(/\.(woff2?|ttf|otf)$/i,'').replace(/[-_]+/g,' ').replace(/\b(regular|webfont)\b/ig,'').trim() || 'Eigene Schrift';
      promptBox('Schrift benennen','Name der Schrift', name, function(n){ db.fonts.uploaded = (db.fonts.uploaded||[]).filter(function(x){ return x.name !== n; }).concat([{name:n, data:rd.result}]); injectUploaded(); save(); toast('„'+n+'“ hochgeladen'); renderRight(); }); };
    rd.readAsDataURL(file); return;
  }

});

document.addEventListener('keydown', function(e){
  if(S.view !== 'editor' || $('.mbg') || $('.pvw')) return;
  var tag = (e.target.tagName||'').toLowerCase(), typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
  var mod = e.metaKey || e.ctrlKey;
  if(mod && e.key.toLowerCase() === 'z' && !typing){ e.preventDefault(); if(e.shiftKey) redo(); else undo(); return; }
  if(mod && e.key.toLowerCase() === 'y' && !typing){ e.preventDefault(); redo(); return; }
  if(e.key === '[' && !typing && !mod){ e.preventDefault(); ACT.lpToggle(); return; }
  if(e.key === 'Escape' && S.paint){ e.preventDefault(); fmtStop(); toast('Format übertragen abgebrochen'); return; }
  if(mod && e.altKey && !typing && (e.code === 'KeyC' || e.code === 'KeyV')){ e.preventDefault(); if(e.code === 'KeyC') fmtCopy(false); else { var fb = selBlock(); if(fb) fmtApply(fb); else toast('Erst ein Element markieren'); } return; }
  var textSel = getSelection && String(getSelection()).length > 0;
  if(mod && !e.shiftKey && e.key.toLowerCase() === 'v' && !typing){ e.preventDefault(); pasteBlock(); return; }
  /* Ohne markiertes Element: ←/→ oder A/D blättern durch die Seiten */
  if(!typing && !S.sel && !mod && !e.altKey && !inl && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd' || e.key === 'A' || e.key === 'D')){
    var dir = (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') ? 1 : -1, ni = S.pi + dir;
    if(ni >= 0 && ni < F().pages.length){ e.preventDefault(); selectPage(ni); } return;
  }
  if(typing || !S.sel) return;
  if(mod && e.key.toLowerCase() === 'c' && !textSel){ e.preventDefault(); copyBlock(); return; }
  if(e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); delBlock(); }
  else if(mod && e.key.toLowerCase() === 'd'){ e.preventDefault(); dupBlock(); }
  else if(/^Arrow/.test(e.key) && !mod && selBlock() && selBlock().type === 'arrow'){
    /* Hinweis-Pfeil fein verschieben (Umschalt = 10 px) */
    e.preventDefault(); var ab = selBlock(), st0 = e.shiftKey ? 10 : 1; snap();
    if(e.key === 'ArrowLeft') ab.props.x = (+ab.props.x||0) - st0; else if(e.key === 'ArrowRight') ab.props.x = (+ab.props.x||0) + st0;
    else if(e.key === 'ArrowUp') ab.props.y = (+ab.props.y||0) - st0; else ab.props.y = (+ab.props.y||0) + st0;
    touch(); renderCanvas(true); clearTimeout(window.__arT); window.__arT = setTimeout(renderRight, 250);
  }
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
