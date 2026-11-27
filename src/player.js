(function(){
"use strict";
var FP = {};
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
/* Hervorhebung __Wort__: Schwung (wie Onepage: flacher Bogen, feine Linie) und Kreis als SVG; Marker, Fläche, Rahmen usw. per CSS (Klasse hl-* am Element) */
var UL = '<svg class="fp-ulsv u" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path vector-effect="non-scaling-stroke" d="M 0,30 q 50,-35 100,0"/></svg><svg class="fp-ulsv c" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path vector-effect="non-scaling-stroke" d="M 54,4 C 82,3 99,10 98,21 C 97,33 74,38 48,37 C 20,36 2,30 3,19 C 4,9 22,3 44,4 C 50,4 57,6 62,8"/></svg>';
function stripInk(text){ return String(text).replace(/\{farbe:#[0-9a-f]{6}\}|\{\/farbe\}/gi, '').replace(/\{anim:@?[\w-]{1,40}(?:\*[\d.]{1,4})?\}\s?/g, ''); }
FP.stripInk = stripInk;
/* Nur Textknoten einfärben. Generierte Linkattribute und SVGs bleiben intakt. */
function renderInk(html){
  if(html.indexOf('{farbe:') < 0) return html;
  var ink = '';
  return html.split(/(<[^>]+>)/g).map(function(part){
    if(part.charAt(0) === '<') return part;
    return part.split(/(\{farbe:#[0-9a-f]{6}\}|\{\/farbe\})/gi).map(function(run){
      if(/^\{farbe:#[0-9a-f]{6}\}$/i.test(run)){ ink = run.slice(7, -1); return ''; }
      if(run === '{/farbe}'){ ink = ''; return ''; }
      return ink && run ? '<span style="color:'+ink+'">'+run+'</span>' : run;
    }).join('');
  }).join('');
}
var md = function(s){ return renderInk(esc(s).replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*\w])\*(?![\s*])([^*\n]+?)\*(?![*\w])/g,'$1<em>$2</em>').replace(/\+\+(.+?)\+\+/g,'<u>$1</u>').replace(/==(.+?)==/g,'<span class="fp-hl">$1</span>').replace(/__(.+?)__/g,'<span class="fp-ul">$1'+UL+'</span>').replace(/\[\[(.+?)\]\]/g,'<mark class="fp-mk">$1</mark>').replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\{anim:(@?[\w-]{1,40})(?:\*(\d(?:\.\d{1,2})?))?\}/g, animTok).replace(/\n/g,'<br>')); };
FP.esc = esc; FP.md = md;

/* Animierte Icons im Text, eingefügt wie ein Emoji: {anim:herz}. Eingebaute Icons sind SVG mit CSS-Animation
   (Akzentfarbe, so groß wie der Text), {anim:@id} spielt eine eigene Lottie-Datei aus theme.anims ab. */
var AI_SVG = function(body){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>'; };
FP.ANIM_ICONS = {
  check:['Haken', '<circle cx="12" cy="12" r="9" opacity=".25"/><path class="ai-draw" pathLength="20" d="M7.5 12.5l3 3 6-6.5"/>'],
  herz:['Herz', '<path fill="currentColor" stroke="none" d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/>'],
  stern:['Stern', '<path fill="currentColor" stroke-width="1.2" d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36 6.3 20.36l1.09-6.35-4.62-4.5 6.38-.93z"/>'],
  funkeln:['Funkeln', '<path class="ai-s1" fill="currentColor" stroke="none" d="M11 2l1.9 5.1L18 9l-5.1 1.9L11 16l-1.9-5.1L4 9l5.1-1.9z"/><path class="ai-s2" fill="currentColor" stroke="none" d="M18.5 13.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>'],
  glocke:['Glocke', '<g class="ai-bell"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></g>'],
  pfeil:['Pfeil', '<path class="ai-arr" d="M5 12h14M13 6l6 6-6 6"/>'],
  daumen:['Daumen hoch', '<g class="ai-thumb"><path d="M7 10v11H3V10h4z"/><path d="M7 10l4-8a3 3 0 013 3v4h5.5a2 2 0 012 2.3l-1.4 8a2 2 0 01-2 1.7H7"/></g>'],
  feuer:['Feuer', '<path class="ai-flame" fill="currentColor" fill-opacity=".18" d="M12 22c4 0 7-2.7 7-7 0-4-3-6.5-4-9.5-1 2.5-2.5 3.5-4 4 0-2.5-1-5-3-7.5C8 6 5 9.5 5 15c0 4.3 3 7 7 7z"/>'],
  uhr:['Uhr', '<circle cx="12" cy="12" r="9"/><path class="ai-hand" d="M12 12V6.5"/><path d="M12 12l3 2"/>'],
  geschenk:['Geschenk', '<g class="ai-gift"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5"/></g>'],
  blitz:['Blitz', '<path class="ai-bolt" fill="currentColor" fill-opacity=".2" d="M13 2L4 14h7l-1 8 9-12h-7z"/>'],
  rakete:['Rakete', '<g class="ai-rocket"><path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 00-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 012-4A12.9 12.9 0 0122 2c0 2.7-.8 7.5-6 11a22 22 0 01-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/></g>'],
  punkt:['Live-Punkt', '<circle class="ai-ring" cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>']
};
/* Größe als Faktor zur Textgröße: {anim:herz*2} = doppelt so groß (0,5 bis 4) */
function animTok(all, name, scale){
  var sc = scale ? Math.max(0.5, Math.min(4, +scale)) : 1, da = name + (sc !== 1 ? '*' + sc : ''), sty = sc !== 1 ? ' style="--ais:'+sc+'"' : '';
  if(name.charAt(0) === '@') return '<span class="fp-ai fp-ail" data-ai="'+da+'" data-ail="'+esc(name.slice(1))+'"'+sty+' contenteditable="false" aria-hidden="true"></span>';
  var ic = FP.ANIM_ICONS[name]; if(!ic) return all;
  return '<span class="fp-ai ai-'+name+'" data-ai="'+da+'"'+sty+' contenteditable="false" role="img" aria-label="'+ic[0]+'">'+AI_SVG(ic[1])+'</span>';
}

/* Lottie im Block „Animation“ und als Icon im Text abspielen. Gibt eine Aufräumfunktion zurück. */
FP.playAnims = function(root, f){
  var anims = [], reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, lib = (f && f.theme && f.theme.anims) || [];
  var parse = function(raw){ if(!raw) return null; try{ return typeof raw === 'string' ? JSON.parse(raw) : raw; }catch(e){ return null; } };
  var load = function(el, data, src, loop, speed){
    if(!data && !src) return;
    FP.lottieLib(function(L){
      if(!el.isConnected || el.getAttribute('data-on')) return;
      try{ var a = L.loadAnimation({container:el, renderer:'svg', loop:loop, autoplay:!reduce, animationData:data || undefined, path:data ? undefined : src}); if(speed && speed !== 1) a.setSpeed(speed); anims.push(a); el.setAttribute('data-on', '1'); }catch(e){}
    });
  };
  root.querySelectorAll('[data-lot]').forEach(function(el){ load(el, parse(el.getAttribute('data-json')), el.getAttribute('data-src'), el.getAttribute('data-loop') !== '0', +el.getAttribute('data-speed') || 1); });
  root.querySelectorAll('[data-ail]').forEach(function(el){ var it = lib.filter(function(x){ return x.id === el.getAttribute('data-ail'); })[0]; if(it) load(el, parse(it.json), it.src, true, 1); });
  return function(){ anims.forEach(function(a){ try{ a.destroy(); }catch(e){} }); };
};
/* Stile für die Hervorhebung __Wort__ (Design-Tab und pro Überschrift) */
FP.HL_STYLES = [['swoosh','Schwung'],['line','Linie'],['marker','Marker'],['half','Textmarker'],['marker-tilt','Marker schräg'],['half-tilt','Textmarker schräg'],['brush-ink','Breitpinsel'],['brush-dry','Trockenpinsel'],['pill','Fläche'],['stroke','Rahmen'],['circle','Kreis'],['color','Farbe']];


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
/* Icon-Set für Antworten und Listen: schlichte Strich-Icons, Farbe aus dem Theme */
var SI = function(d){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'; };
FP.ICONS = {
  home:SI('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
  building:SI('<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>'),
  factory:SI('<path d="M3 21V10l6 3.5V10l6 3.5V6l6 3v12z"/><path d="M7 17h2M12 17h2M17 17h1"/>'),
  sun:SI('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  leaf:SI('<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15z"/><path d="M5 19 13 11"/>'),
  drop:SI('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
  flame:SI('<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 0 2 1 3 2 3 0-3-1-5.5.5-8z"/>'),
  bolt:SI('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  wrench:SI('<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>'),
  hammer:SI('<path d="M14 6 4 16l4 4 10-10"/><path d="M13 3h4l4 4v3l-3-1-5-5z"/>'),
  ruler:SI('<rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4"/>'),
  paint:SI('<rect x="4" y="3" width="13" height="6" rx="1.5"/><path d="M17 6h2.5v5H11v3"/><rect x="9.5" y="14" width="3" height="7" rx="1"/>'),
  tree:SI('<path d="M12 21v-5"/><path d="M12 3 6 11h3l-4 5h14l-4-5h3z"/>'),
  car:SI('<path d="M5 16h14M3.5 16v-4l2-5h13l2 5v4"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>'),
  truck:SI('<path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8"/><circle cx="6" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/>'),
  calendar:SI('<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
  clock:SI('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  euro:SI('<path d="M17 6.5A6.5 6.5 0 1 0 17 17.5"/><path d="M4 10h9M4 14h9"/>'),
  piggy:SI('<path d="M5 11a7 6 0 0 1 12-3h2l-1 3 2 1v3h-2.5L16 18h-2l-.5-1.5h-4L9 18H7l-.5-2.5A6 6 0 0 1 5 11z"/><circle cx="15" cy="10.5" r=".6"/>'),
  chart:SI('<path d="M4 20V4M4 20h16"/><path d="M8 15l3-4 3 2 5-6"/>'),
  shield:SI('<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>'),
  star:SI('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
  heart:SI('<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z"/>'),
  thumb:SI('<path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7"/>'),
  user:SI('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  users:SI('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a6 6 0 0 1 3.5 6.5"/>'),
  phone:SI('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  mail:SI('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/>'),
  chat:SI('<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5A8 8 0 1 1 21 12z"/>'),
  map:SI('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  key:SI('<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>'),
  box:SI('<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'),
  gift:SI('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'),
  rocket:SI('<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15 6 12l2-4h5l3-3c2-2 5-2 5-2s0 3-2 5l-3 3v5l-4 2z"/><circle cx="15" cy="9" r="1.5"/>'),
  sparkle:SI('<path d="M12 3c.7 4.2 2.8 6.3 7 7-4.2.7-6.3 2.8-7 7-.7-4.2-2.8-6.3-7-7 4.2-.7 6.3-2.8 7-7z"/><path d="M19 15.5c.3 1.6 1 2.3 2.5 2.5-1.6.3-2.3 1-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.6-.3 2.3-1 2.5-2.5z"/>'),
  check:SI('<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'),
  x:SI('<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>'),
  question:SI('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>')
};
/* Flache Smileys für die Bewertungsskala (feste, freundliche Farben – unabhängig vom Theme) */
var FC = function(bg, d){ return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="'+bg+'"/><g fill="none" stroke="#2b211e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+d+'</g></svg>'; };
FP.FACES = [
  FC('#E8786B','<path d="M13.5 15.5l7 3M34.5 15.5l-7 3"/><circle cx="18" cy="21.5" r="1.2" fill="#2b211e"/><circle cx="30" cy="21.5" r="1.2" fill="#2b211e"/><path d="M16 34c4.5-5.5 11.5-5.5 16 0"/>'),
  FC('#EFA24C','<circle cx="17.5" cy="20" r="1.6" fill="#2b211e"/><circle cx="30.5" cy="20" r="1.6" fill="#2b211e"/><path d="M16.5 33c4-4.5 11-4.5 15 0"/>'),
  FC('#F5C451','<circle cx="17.5" cy="20" r="1.6" fill="#2b211e"/><circle cx="30.5" cy="20" r="1.6" fill="#2b211e"/><path d="M17 30.5h14"/>'),
  FC('#A9D58F','<circle cx="17.5" cy="19.5" r="1.6" fill="#2b211e"/><circle cx="30.5" cy="19.5" r="1.6" fill="#2b211e"/><path d="M16 27.5c4.5 5.5 11.5 5.5 16 0"/>'),
  FC('#8ED1AC','<path d="M17.5 13.6l1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5z" fill="#3a9a6e" stroke="none"/><path d="M30.5 13.6l1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5z" fill="#3a9a6e" stroke="none"/><path d="M14.5 27h19c0 6-4.3 9.5-9.5 9.5S14.5 33 14.5 27z" fill="#2b211e" stroke="none"/>')
];
FP.FACE_LABELS = ['Sehr schlecht','Schlecht','Okay','Gut','Super'];
FP.faceIdx = function(n, i){ return n > 1 ? Math.round(i * 4 / (n - 1)) : 4; };

/* WhatsApp-Logo (gefüllt) und Link-Helfer: Nummer in internationales Format, erste Nachricht vorbefüllt */
FP.WA = '<svg class="wa" viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none"><path d="M12 2.2a9.8 9.8 0 00-8.4 14.8l-1.3 4.8 4.9-1.3A9.8 9.8 0 1012 2.2zm0 17.9a8.1 8.1 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 1112 20.1zm4.5-6c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.6 6.6 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';
FP.waUrl = function(num, text){ var n = String(num || '').replace(/\D/g, '').replace(/^00/, '').replace(/^0/, '49'); return n ? 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '') : ''; };
/* ---------- Marken-Icons in Originalfarben (für Buttons und die Social-Media-Leiste) ---------- */
FP.BRANDS = {
  whatsapp:{n:'WhatsApp', c:'#25D366', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 1.6a10.3 10.3 0 00-8.9 15.6L1.7 22.4l5.3-1.4A10.4 10.4 0 1012 1.6z"/><path fill="#fff" d="M17.1 14.3c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.9 1.1-.3.2-.6.1a7.2 7.2 0 01-3.6-3.1c-.3-.5.3-.5.8-1.5.1-.2 0-.3 0-.5l-.8-2c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 00-.8.4 3.2 3.2 0 00-1 2.4 5.6 5.6 0 001.2 3 12.8 12.8 0 004.9 4.3c1.8.8 2.5.8 3.4.7a2.9 2.9 0 001.9-1.3 2.4 2.4 0 00.2-1.4c-.1-.1-.3-.2-.6-.4z"/></svg>'},
  instagram:{n:'Instagram', c:'#E4405F', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id="tt-ig" cx="30%" cy="107%" r="150%"><stop offset="0" stop-color="#fdf497"/><stop offset=".05" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#tt-ig)"/><rect x="6" y="6" width="12" height="12" rx="3.6" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="16.3" cy="7.7" r="1" fill="#fff"/></svg>'},
  facebook:{n:'Facebook', c:'#1877F2', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#1877F2"/><path fill="#fff" d="M15.3 8.4h-1.6c-.7 0-.9.4-.9 1v1.5h2.4l-.4 2.5h-2V22a10.6 10.6 0 01-2.8 0v-8.6H8v-2.5h2V9.1c0-2.1 1.2-3.3 3.1-3.3.9 0 1.8.1 2.2.2z"/></svg>'},
  tiktok:{n:'TikTok', c:'#000000', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#000"/><path fill="#25F4EE" d="M14.6 4.6c.3 1.9 1.5 3.2 3.4 3.4v2.5a5.7 5.7 0 01-3.3-1.1v5a4.5 4.5 0 11-4.5-4.5h.5v2.5a2 2 0 102 2V4.6z" transform="translate(-.6 -.5)"/><path fill="#FE2C55" d="M14.6 4.6c.3 1.9 1.5 3.2 3.4 3.4v2.5a5.7 5.7 0 01-3.3-1.1v5a4.5 4.5 0 11-4.5-4.5h.5v2.5a2 2 0 102 2V4.6z" transform="translate(.6 .5)"/><path fill="#fff" d="M14.6 4.6c.3 1.9 1.5 3.2 3.4 3.4v2.5a5.7 5.7 0 01-3.3-1.1v5a4.5 4.5 0 11-4.5-4.5h.5v2.5a2 2 0 102 2V4.6z"/></svg>'},
  linkedin:{n:'LinkedIn', c:'#0A66C2', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#0A66C2"/><rect x="6" y="9.6" width="2.6" height="8.4" fill="#fff"/><circle cx="7.3" cy="6.8" r="1.5" fill="#fff"/><path fill="#fff" d="M10.6 9.6h2.5v1.2c.4-.7 1.3-1.4 2.7-1.4 2.5 0 3 1.6 3 3.8V18h-2.6v-4.3c0-1-.1-2.3-1.5-2.3s-1.6 1.1-1.6 2.2V18h-2.5z"/></svg>'},
  youtube:{n:'YouTube', c:'#FF0000', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="4.8" width="22" height="14.4" rx="4.3" fill="#FF0000"/><path fill="#fff" d="M9.8 8.7v6.6l5.7-3.3z"/></svg>'},
  x:{n:'X', c:'#000000', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#000"/><path fill="#fff" d="M6.6 6.5h3.5l2.8 3.9 3.4-3.9h1.4l-4.2 4.8 4.9 6.7h-3.5l-3-4.2-3.7 4.2H6.8l4.5-5.1z"/></svg>'},
  telegram:{n:'Telegram', c:'#229ED9', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#229ED9"/><path fill="#fff" d="M5.4 11.7l11.2-4.3c.5-.2 1 .1.8.9l-1.9 9c-.1.6-.5.8-1 .5l-2.8-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-2.9 5.3-4.8c.2-.2 0-.3-.3-.1L8.4 13.6l-2.8-.9c-.6-.2-.6-.6.1-.9z"/></svg>'},
  mail:{n:'E-Mail', c:'#6B7280', svg:'<svg class="br" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#6B7280"/><rect x="5.5" y="7.5" width="13" height="9" rx="1.6" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M6 8.3l6 4.4 6-4.4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'}
};
FP.SOCIAL_ORDER = ['whatsapp','instagram','facebook','tiktok','linkedin','youtube','x','telegram','mail'];
/* Moderne Duotone-Icons (gefüllt, Farbe aus currentColor, helle Fläche mit 35 % Deckkraft) */
var DI = function(d){ return '<svg viewBox="0 0 24 24" class="dt" fill="currentColor" aria-hidden="true">'+d+'</svg>'; };
Object.assign(FP.ICONS, {
  'd-coffee':DI('<path d="M4 9h12v4.5A5.5 5.5 0 0110.5 19h-1A5.5 5.5 0 014 13.5z"/><path d="M16 10.5h1.2a2.8 2.8 0 010 5.6h-1.6v-2h1.6a.8.8 0 000-1.6H16z"/><path class="o" d="M3 20.5h14V22H3z"/><path class="o" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 3c-.8 1 .8 2 0 3.2M12 3c-.8 1 .8 2 0 3.2"/>'),
  'd-music':DI('<path class="o" d="M9 5.5L20 3v3.5L9 9z"/><path d="M9 5.5V17a3 3 0 11-2-2.8V5.5zM20 3v11.5a3 3 0 11-2-2.8V3.5z"/>'),
  'd-bike':DI('<circle class="o" cx="6" cy="16" r="4"/><circle class="o" cx="18" cy="16" r="4"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 16l3.5-7h5l3.5 7M9.5 9L12 16l2.5-7M13 6h3"/><circle cx="6" cy="16" r="1.6"/><circle cx="18" cy="16" r="1.6"/>'),
  'd-palette':DI('<path class="o" d="M12 3a9 9 0 000 18c1.4 0 2-1 2-2 0-1.5-1.2-1.6-1.2-2.8 0-1 .8-1.7 1.8-1.7H17a4 4 0 004-4C21 6.5 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.6"/><circle cx="10" cy="7" r="1.6"/><circle cx="14.5" cy="7" r="1.6"/><circle cx="17" cy="10.5" r="1.4"/>'),
  'd-ball':DI('<circle class="o" cx="12" cy="12" r="9"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.5 9.5c5 .5 10.5 3.5 14 10M8 3.8c4 4 6 9 6.2 16.9M20.6 9.5c-4.5-.8-9.2.5-15.5 7.5"/>'),
  'd-glove':DI('<path d="M7 4h7a5 5 0 015 5v3a4 4 0 01-4 4H8a3 3 0 01-3-3V6a2 2 0 012-2z"/><path class="o" d="M7 16h8v4a1 1 0 01-1 1H8a1 1 0 01-1-1z"/><path class="o" d="M5 9h-.5A1.5 1.5 0 003 10.5v1A1.5 1.5 0 004.5 13H5z"/>'),
  'd-design':DI('<path d="M15.5 3.5l5 5-11 11H4.5v-5z"/><path class="o" d="M3 7l4-4 4 4-1.5 1.5L8 7 6.5 8.5 8 10 7 11 5.5 9.5 4 11zM13 17l4-4 4 4-4 4z"/>'),
  'd-heart':DI('<path d="M12 20.5s-8-4.6-8-10.4A4.6 4.6 0 0112 7.2a4.6 4.6 0 018 2.9c0 5.8-8 10.4-8 10.4z"/><path class="o" d="M7.2 8.2a2.6 2.6 0 00-1.4 2.3h1.6a1 1 0 01.6-.9z"/>'),
  'd-star':DI('<path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z"/>'),
  'd-home':DI('<path class="o" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M9.5 21v-6a1 1 0 011-1h3a1 1 0 011 1v6z"/>'),
  'd-sun':DI('<circle cx="12" cy="12" r="4.5"/><path class="o" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>'),
  'd-leaf':DI('<path class="o" d="M20 4C10 4 4 8.5 4 15a5 5 0 005 5c6.5 0 11-6 11-16z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 20c3-5 7-8 11-10"/>'),
  'd-drop':DI('<path d="M12 3s-6.5 7-6.5 11.2a6.5 6.5 0 0013 0C18.5 10 12 3 12 3z"/>'),
  'd-bolt':DI('<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z"/>'),
  'd-flame':DI('<path class="o" d="M12 2.5s6.5 5 6.5 11a6.5 6.5 0 01-13 0c0-3 1.5-5 3-6.5 0 2 1 3.5 2.5 3.5C11 7.5 12 2.5 12 2.5z"/><path d="M12 13s3 2 3 4.3a3 3 0 01-6 0c0-1.5 1-2.6 3-4.3z"/>'),
  'd-camera':DI('<path class="o" d="M3 8a2 2 0 012-2h2.5l1.5-2h6l1.5 2H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="12" cy="13" r="4"/>'),
  'd-gift':DI('<path class="o" d="M4 11h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M3 7.5h18V11H3zM11 7.5h2V21h-2z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 7.5C10 3.5 6.5 4.5 7.5 6.5S12 7.5 12 7.5zm0 0c2-4 5.5-3 4.5-1S12 7.5 12 7.5z"/>'),
  'd-car':DI('<path class="o" d="M5 11l1.6-4.2A2 2 0 018.5 5.5h7a2 2 0 011.9 1.3L19 11z"/><path d="M3 12.5A1.5 1.5 0 014.5 11h15a1.5 1.5 0 011.5 1.5V17a1 1 0 01-1 1h-1v1.5a1.5 1.5 0 01-3 0V18H8v1.5a1.5 1.5 0 01-3 0V18H4a1 1 0 01-1-1z"/>'),
  'd-plane':DI('<path class="o" d="M9 12l2.5 6.5L21 3z"/><path d="M3 10l18-7-12 9z"/>'),
  'd-cart':DI('<path class="o" d="M6 6h15l-2 8H8z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M2.5 3.5H5l3 11h10"/><circle cx="9.5" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/>'),
  'd-chat':DI('<path class="o" d="M4 5h12a2 2 0 012 2v7a2 2 0 01-2 2H9l-4 3.5V16H4a2 2 0 01-2-2V7a2 2 0 012-2z"/><path d="M20 8.5a2 2 0 012 2V16a2 2 0 01-2 2h-1v3l-3.5-3H11a2 2 0 01-1.7-1H16a3 3 0 003-3V8.5z"/>'),
  'd-calendar':DI('<path class="o" d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M5 4.5h14a2 2 0 012 2V9H3V6.5a2 2 0 012-2zM7 2.5h2v4H7zM15 2.5h2v4h-2zM7 12.5h3v3H7z"/>'),
  'd-clock':DI('<circle class="o" cx="12" cy="12" r="9"/><path d="M11 6.5h2V12l3.5 2.2-1 1.7L11 13z"/>'),
  'd-check':DI('<circle class="o" cx="12" cy="12" r="9"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 12.3l2.7 2.7L16 9.5"/>'),
  'd-sparkle':DI('<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><path class="o" d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
  'd-rocket':DI('<path class="o" d="M7 14l-3 1 2-4 3-1zM10 17l-1 3 4-2 1-3z"/><path d="M20.5 3.5S15 3 11 7.5L8.5 12l3.5 3.5 4.5-2.5C21 9 20.5 3.5 20.5 3.5z"/>'),
  'd-crown':DI('<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5z"/><path class="o" d="M5 19.5h14V21H5z"/>'),
  'd-diamond':DI('<path class="o" d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18l-9 11z"/>'),
  'd-paw':DI('<ellipse cx="6.5" cy="10" rx="1.9" ry="2.5"/><ellipse cx="10.2" cy="6.3" rx="1.9" ry="2.5"/><ellipse cx="13.8" cy="6.3" rx="1.9" ry="2.5"/><ellipse cx="17.5" cy="10" rx="1.9" ry="2.5"/><path class="o" d="M12 12c-3 0-5.5 3.5-5.5 5.5 0 2 2 2.5 3 2s1.5-.5 2.5-.5 1.5.5 2.5.5 3 0 3-2C17.5 15.5 15 12 12 12z"/>'),
  'd-tree':DI('<path class="o" d="M12 2.5l6 8h-3l4 5.5H5l4-5.5H6z"/><path d="M11 15h2v6.5h-2z"/>'),
  'd-food':DI('<path d="M6 3v6a2 2 0 002 2v10h1.6V11a2 2 0 002-2V3h-1.3v5H9.4V3H8.2v5H7.3V3z"/><path class="o" d="M16 3c2 0 3 2.5 3 6s-1 4-2 4v8h-2V3z"/>'),
  'd-fitness':DI('<path d="M2.5 10h2v4h-2zM19.5 10h2v4h-2zM5 7.5h2.5v9H5zM16.5 7.5H19v9h-2.5z"/><path class="o" d="M7.5 11h9v2h-9z"/>'),
  'd-book':DI('<path class="o" d="M4 4.5A1.5 1.5 0 015.5 3H18a1 1 0 011 1v13H6a2 2 0 00-2 2z"/><path d="M6 17h14v3H6a1.5 1.5 0 010-3z"/>'),
  'd-work':DI('<path class="o" d="M3 9a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 4.5h6a1 1 0 011 1V7h-2v-.5h-4V7H8V5.5a1 1 0 011-1zM3 11.5l9 3 9-3V13l-9 3-9-3z"/>'),
  'd-tool':DI('<path d="M20.5 7a5 5 0 01-6.6 4.7L6.5 19a2 2 0 01-2.8-2.8l7.3-7.4A5 5 0 0116.9 2.3L14 5.2l.8 3.2 3.2.8z"/>'),
  'd-roller':DI('<path d="M4 3.5h12a1 1 0 011 1V8a1 1 0 01-1 1H4a1 1 0 01-1-1V4.5a1 1 0 011-1z"/><path class="o" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M17 6h3v5.5l-8 1.5v2"/><path d="M10.5 15h3v6.5h-3z"/>'),
  'd-key':DI('<circle class="o" cx="8" cy="15" r="5"/><path d="M11.5 11.8L19 4.3 20.7 6l-1.6 1.6 1.6 1.6-1.6 1.6-1.6-1.6-4.3 4.3z"/>'),
  'd-shield':DI('<path class="o" d="M12 2.5l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8.5 12l2.5 2.5 4.5-5"/>'),
  'd-euro':DI('<circle class="o" cx="12" cy="12" r="9"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15.5 8.2A4.5 4.5 0 008.5 12a4.5 4.5 0 007 3.8M7 10.8h6M7 13.2h6"/>'),
  'd-phone':DI('<path d="M6.6 3h3l1.6 4.5-2.1 1.3a11 11 0 006.1 6.1l1.3-2.1L21 14.4v3A2.6 2.6 0 0118.4 20 15.4 15.4 0 014 5.6 2.6 2.6 0 016.6 3z"/>'),
  'd-mail':DI('<path class="o" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M3.5 7.2l8.5 6 8.5-6V9l-8.5 6-8.5-6z"/>'),
  'd-user':DI('<circle cx="12" cy="8" r="4"/><path class="o" d="M4 20a8 8 0 0116 0v1H4z"/>')
});
/* Button-Icon: Linien-Icon, Marke, Emoji oder Bild (3D-Icon / eigenes Bild, als data-URL im Funnel gespeichert) */
FP.btnIcon = function(p){
  var ic = p.icon != null && p.icon !== '' ? p.icon : (p.action === 'wa' ? 'whatsapp' : p.arrow === false ? 'none' : 'arrow');
  if(ic === 'emoji') return p.iconEmoji ? '<span class="bie" aria-hidden="true">'+esc(String(p.iconEmoji).slice(0, 16))+'</span>' : '';
  if(ic === 'img') return p.iconImg && /^(data:image\/|https:\/\/)/.test(p.iconImg) ? '<img class="bii" src="'+esc(p.iconImg)+'" alt="" aria-hidden="true">' : '';
  if(ic === 'whatsapp') return FP.WA;
  if(/^br-/.test(ic) && FP.BRANDS[ic.slice(3)]) return FP.BRANDS[ic.slice(3)].svg;
  return ic !== 'none' && FP.BTN_ICONS[ic] ? FP.BTN_ICONS[ic] : '';
};
/* Mit Icon: Raster aus drei Spalten, damit der Text genau in der Mitte bleibt.
   Das Icon steht neben dem Text oder (iconEdge) am Rand des Buttons. */
FP.btnIcCls = function(icH, p){ return icH ? ' hic'+(p && p.iconLeft ? ' il' : '')+(p && p.iconEdge ? ' ie' : '') : ''; };
FP.BTN_ICONS = {
  arrow:BI('<path d="M5 12h14M13 6l6 6-6 6"/>'), chevron:BI('<path d="M9 6l6 6-6 6"/>'), send:BI('<path d="M21.5 2.5L10.5 13.5"/><path d="M21.5 2.5l-7 19-4-8-8-4z"/>'),
  check:BI('<path d="M5 12.5l4.5 4.5L19 7.5"/>'), calendar:BI('<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
  phone:BI('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>'), download:BI('<path d="M12 4v12M6 10l6 6 6-6"/><path d="M4 20h16"/>'),
  star:BI('<path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36 6.3 20.36l1.09-6.35-4.62-4.5 6.38-.93z"/>'), heart:BI('<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/>'),
  gift:BI('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5"/>'), lock:BI('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>'),
  sparkle:BI('<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/>'), mail:BI('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>'),
  plane:'<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:currentColor"><path opacity=".55" d="M13 43c-.2 0 4.05-17.3 4.05-17.3.1-.33.37-.59.71-.67a1 1 0 01.95.26l7 7a1 1 0 01-.11 1.51l-12 9a1 1 0 01-.6.2z"/><path d="M36 45a1 1 0 01-.6-.2l-32-24a1 1 0 01.23-1.73l40-16a1 1 0 011.35 1.13l-8 40a1 1 0 01-.98.8z"/></svg>',
  google:'<svg class="bi-g" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.6-.21-2.36H12v4.47h6.46a5.52 5.52 0 01-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.73z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0012 24z"/><path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 010-4.58v-3.1H1.28a12 12 0 000 10.78z"/><path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.94 11.94 0 0012 0 12 12 0 001.28 6.61l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77z"/></svg>'
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
/* Lizenzpflichtige Schriften: kommen aus eigenen Dateien (Upload) oder einem Adobe-Fonts-Projekt.
   Der zweite Name ist der Familienname, unter dem Adobe Fonts die Schrift bereitstellt. */
FP.FONT_ALIAS = {'Proxima Nova':'proxima-nova'};
FP.fontWeightOf = function(n){ n = String(n).toLowerCase().replace(/[-_]+/g, ' '); return /thin|hairline/.test(n) ? 100 : /(extra|ultra) ?light/.test(n) ? 200 : /light/.test(n) ? 300 : /medium/.test(n) ? 500 : /(semi|demi) ?bold/.test(n) ? 600 : /(extra|ultra) ?bold/.test(n) ? 800 : /black|heavy/.test(n) ? 900 : /bold/.test(n) ? 700 : 400; };
FP.fontFaceCss = function(list){
  list = list || [];
  return list.filter(function(x){ return x.css; }).map(function(x){ return '@import url("' + String(x.css).replace(/"/g, '') + '");'; })
    .concat(list.filter(function(x){ return !x.css && x.data; }).map(function(x){ return "@font-face{font-family:'" + String(x.name).replace(/'/g, '') + "';src:url(" + x.data + ");font-weight:" + (+x.weight || 400) + ";font-style:" + (x.style === 'italic' ? 'italic' : 'normal') + ";font-display:swap}"; })).join('\n');
};
FP.fontLink = function(f){ if(!f || FP.SYSTEM_FONTS[f] || FP.FONT_ALIAS[f]) return ''; var m = FP.FONT_META[f]; return 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g,'+') + (m && m[1] ? ':wght@' + m[1] : '') + '&display=swap'; };
FP.fontsUrl = function(list){ return FP.fontLink((list||[]).filter(Boolean)[0]); };
FP.fontStack = function(f){ return FP.SYSTEM_FONTS[f] || ("'"+f+"'"+(FP.FONT_ALIAS[f] ? ",'"+FP.FONT_ALIAS[f]+"'" : '')+",system-ui,sans-serif"); };
FP.usedFonts = function(f){ var t = f.theme || {}, out = [t.font, t.headingFont]; FP.allBlocks(f).forEach(function(b){ if(b.props && b.props.ff) out.push(b.props.ff); if(b.type === 'arrow' && b.props && b.props.hand !== false && b.props.textSide !== 'none') out.push('Caveat'); }); return out.filter(function(x, i, a){ return x && a.indexOf(x) === i; }); };

FP.themeVars = function(t){
  t = t || {};
  return '--p:'+(t.primary||'#4353ff')+';--pt:'+(t.primaryText||'#fff')+';--bg:'+(t.bg||'#fff')+';--sf:'+(t.surface||'#f4f5f7')+';--tx:'+(t.text||'#111318')+';--mt:'+(t.muted||'#6b7280')+';--r:'+(t.radius!=null?t.radius:14)+'px;--br:'+(t.btnRadius!=null?t.btnRadius:12)+'px;--ff:'+FP.fontStack(t.font||'Inter')+';--hf:'+FP.fontStack(t.headingFont||t.font||'Inter')+';'+(t.btnG1?'--g1:'+t.btnG1+';':'')+(t.btnG2?'--g2:'+t.btnG2+';':'')+(t.btnGAng!=null&&t.btnGAng!==''?'--ga:'+(+t.btnGAng)+'deg;':'')
    +'--sc:'+((+t.scale||100)/100)+';--hw:'+(t.headingWeight||700)+';--hls:'+((t.headingLs!=null&&t.headingLs!==''?+t.headingLs:-2)/100)+'em;--htt:'+(t.headingUpper?'uppercase':'none')+';--lh:'+(t.lineHeight||1.55)+';'+(t.headingLh?'--hlh:'+t.headingLh+';':'')+'--bpy:'+(t.btnPad!=null&&t.btnPad!==''?t.btnPad:16)+'px;--bpx:'+(t.btnPadX!=null&&t.btnPadX!==''?t.btnPadX:22)+'px;--bw:'+(t.btnWeight||600)+';--btt:'+(t.btnUpper?'uppercase':'none')+';--bls:'+(t.btnUpper?'.05em':'normal')+';--pad:'+(t.pad!=null&&t.pad!==''?t.pad:20)+'px;'
    + [['spTop','tpt'],['spHead','hg'],['spContent','cg'],['spBlock','bk'],['spBottom','bpb']].map(function(x){ var v = t[x[0]]; return v != null && v !== '' ? '--'+x[1]+':'+(+v)+'px;' : ''; }).join('')
    /* kleineres Logo → flacherer Kopf (Mindesthöhe sonst 30px für den Zurück-Button) */
    + (t.logoImg && +t.logoH ? '--hmh:'+Math.min(30, +t.logoH)+'px;' : '')
    /* Dauer des Seitenübergangs (0,1–2 s), sonst der Standard der jeweiligen Animation */
    + (+t.animDur ? '--pgd:'+Math.min(2, Math.max(.1, +t.animDur))+'s;' : '');
};

/* Logik-Regeln: Bedingungen auf beliebige frühere Antworten (und/oder) */
FP.logicTest = function(rule, f, answers){
  var cs = (rule.cond || []).filter(function(c){ return c.bid; }); if(!cs.length) return false;
  var res = cs.map(function(c){
    var b = FP.allBlocks(f).filter(function(x){ return x.id === c.bid; })[0]; if(!b) return false;
    var v = answers[(b.props && b.props.key) || b.id], arr = [].concat(v == null ? [] : v), filled = arr.length > 0 && arr.some(function(x){ return x !== '' && x !== false; });
    var n = +v, cv = c.val, num = +cv;
    switch(c.op){
      case 'is': return arr.some(function(x){ return String(x).trim().toLowerCase() === String(cv == null ? '' : cv).trim().toLowerCase(); });
      case 'isnot': return !arr.some(function(x){ return String(x).trim().toLowerCase() === String(cv == null ? '' : cv).trim().toLowerCase(); });
      case 'contains': return arr.some(function(x){ return String(x).toLowerCase().indexOf(String(cv || '').toLowerCase()) >= 0; });
      case 'filled': return filled;
      case 'empty': return !filled;
      case 'eq': return v != null && v !== '' && n === num;
      case 'gt': return v != null && v !== '' && n > num;
      case 'lt': return v != null && v !== '' && n < num;
      case 'gte': return v != null && v !== '' && n >= num;
      case 'lte': return v != null && v !== '' && n <= num;
    }
    return false;
  });
  return rule.join === 'or' ? res.some(Boolean) : res.every(Boolean);
};
FP.allBlocks = function(f){ var out=[]; (f.pages||[]).forEach(function(p){ (p.blocks||[]).forEach(function(b){ out.push(b); }); }); return out; };
var keyOf = function(b){ return (b.props && b.props.key) || b.id; };
FP.keyOf = keyOf;

FP.money = function(n, cur){
  try { return new Intl.NumberFormat('de-DE',{style:'currency',currency:cur||'EUR',maximumFractionDigits:0}).format(n||0); }
  catch(e){ return Math.round(n||0) + ' €'; }
};
var WD = ['So','Mo','Di','Mi','Do','Fr','Sa'];
var hv0 = function(x){ return x != null && x !== ''; };
var fmtDate = function(iso){ if(!iso) return ''; var d = new Date(iso+'T12:00:00'); return WD[d.getDay()]+', '+d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}); };
FP.fmtDate = fmtDate;
/* ---------- Übergänge an Bildkanten (wie Shape-Divider): Maske oben/unten, die Seite scheint durch ---------- */
FP.EDGE_LIST = [['','Keiner'],['slant','Schräg'],['curve','Rund nach außen'],['curveIn','Rund nach innen'],['wave','Welle'],['peak','Spitze'],['valley','Kerbe'],['zigzag','Zickzack'],['brush','Pinselstrich'],['torn','Gerissen']];
FP.edgePath = function(kind){
  var rnd = (function(seed){ return function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; })(kind === 'torn' ? 7 : 42), d, i, n;
  switch(kind){
    case 'slant': return 'M0 10 L100 0 V10 Z';
    case 'curve': return 'M0 10 C25 0 75 0 100 10 Z';
    case 'curveIn': return 'M0 0 C25 10 75 10 100 0 V10 H0 Z';
    case 'wave': return 'M0 5 Q12.5 0 25 5 T50 5 T75 5 T100 5 V10 H0 Z';
    case 'peak': return 'M0 10 L50 0 L100 10 Z';
    case 'valley': return 'M0 0 L50 10 L100 0 V10 H0 Z';
    case 'zigzag': d = 'M0 10'; n = 16; for(i = 0; i <= n; i++) d += ' L' + (i * 100 / n).toFixed(2) + ' ' + (i % 2 ? 0 : 10); return d + ' L100 10 Z';
    case 'brush': /* weiche, wellige Kante wie ein Pinselstrich, mit vereinzelten feinen Borsten */
      d = 'M0 10'; n = 160;
      for(i = 0; i <= n; i++){
        var x = i * 100 / n, y = 4.2 + 1.5 * Math.sin(x * .085 + 1.3) + .9 * Math.sin(x * .27 + .4) + rnd() * .7;
        if(rnd() < .07){ d += ' L' + x.toFixed(2) + ' ' + Math.min(9.6, y + 2 + rnd() * 2.6).toFixed(2); continue; } /* feine Borste */
        d += ' L' + x.toFixed(2) + ' ' + Math.max(.3, Math.min(9.4, y)).toFixed(2);
      }
      return d + ' L100 10 Z';
    case 'torn': /* wenige große Risse wie gerissenes Papier */
      d = 'M0 10 L0 ' + (2 + rnd() * 4).toFixed(2); n = 26;
      for(i = 1; i <= n; i++) d += ' L' + (i * 100 / n - rnd() * 1.5).toFixed(2) + ' ' + (1 + rnd() * 7).toFixed(2);
      return d + ' L100 10 Z';
  }
  return '';
};
FP.edgeMask = function(p){
  var top = p.edgeTop && FP.edgePath(p.edgeTop), bot = p.edgeBot && FP.edgePath(p.edgeBot); if(!top && !bot) return '';
  var svg = function(path, flipV, flipH){ var tr = (flipH ? 'translate(100 0) scale(-1 1) ' : '') + (flipV ? 'translate(0 10) scale(1 -1)' : ''); return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none"><path fill="#000" d="' + path + '"' + (tr ? ' transform="' + tr.trim() + '"' : '') + '/></svg>') + '")'; };
  var th = top ? Math.max(4, +p.edgeTopH || 40) : 0, bh = bot ? Math.max(4, +p.edgeBotH || 40) : 0, layers = [];
  if(top) layers.push(svg(top, false, !!p.edgeTopFlip) + ' 0 0/100% ' + (th + 1) + 'px no-repeat');
  layers.push('linear-gradient(#000 0 0) 0 ' + th + 'px/100% calc(100% - ' + (th + bh) + 'px) no-repeat');
  if(bot) layers.push(svg(bot, true, !!p.edgeBotFlip) + ' 0 100%/100% ' + (bh + 1) + 'px no-repeat');
  var m = layers.join(',');
  return '-webkit-mask:' + m + ';mask:' + m + ';';
};
/* ---------- Termin: Monatskalender wie bei Calendly, danach die Uhrzeiten des Tages ---------- */
FP.calView = {}; FP.calAnim = {};
var isoOf = function(x){ return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
/* Bundesweite Feiertage (inkl. Ostern-abhängiger Tage), damit sie nicht buchbar sind */
FP.holidays = function(y){
  var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  var mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1, easter = new Date(y, mo - 1, da, 12);
  var rel = function(n){ var x = new Date(easter); x.setDate(x.getDate() + n); return isoOf(x); };
  return [y+'-01-01', rel(-2), rel(1), y+'-05-01', rel(39), rel(50), y+'-10-03', y+'-12-25', y+'-12-26'];
};
FP.calDays = function(p){
  var out = [], d = new Date(), ex = p.excludeDays || [0], bl = (p.blocked || []).map(function(s){ return String(s).trim(); }), n = Math.max(1, Math.min(120, +p.days || 20)), guard = 0;
  d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + (p.offset != null && p.offset !== '' ? +p.offset : 1));
  var hol = {}; if(p.noHolidays !== false){ var y0 = d.getFullYear(); FP.holidays(y0).concat(FP.holidays(y0 + 1)).forEach(function(x){ hol[x] = 1; }); }
  while(out.length < n && guard++ < 500){ var iso = isoOf(d); if(ex.indexOf(d.getDay()) < 0 && bl.indexOf(iso) < 0 && !hol[iso]) out.push(iso); d.setDate(d.getDate() + 1); }
  return out;
};
FP.calMonth = function(b, p, v, ctx, label){
  var avail = FP.calDays(p), cv = v || {}, set = {}; avail.forEach(function(x){ set[x] = 1; });
  var selDate = cv.date || (ctx.edit && avail[0]) || '';
  var first = avail[0] || isoOf(new Date()), last = avail[avail.length - 1] || first;
  var view = FP.calView[b.id] || (selDate || first).slice(0, 7);
  if(view < first.slice(0, 7)) view = first.slice(0, 7); if(view > last.slice(0, 7)) view = last.slice(0, 7);
  var y = +view.slice(0, 4), m = +view.slice(5, 7) - 1, start = new Date(y, m, 1, 12), lead = (start.getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate(), today = isoOf(new Date());
  var anim = FP.calAnim[b.id] || ''; FP.calAnim[b.id] = '';
  var cells = '';
  for(var i = 0; i < lead; i++) cells += '<span></span>';
  for(var dd = 1; dd <= dim; dd++){
    var iso = view + '-' + String(dd).padStart(2, '0'), on = !!set[iso], sel = iso === selDate;
    cells += on ? '<button type="button" class="cd'+(sel ? ' sel' : '')+(iso === today ? ' td' : '')+'" data-act="day" data-bid="'+b.id+'" data-v="'+iso+'" aria-pressed="'+sel+'" aria-label="'+esc(new Date(iso+'T12:00:00').toLocaleDateString('de-DE',{weekday:'long', day:'numeric', month:'long'}))+'">'+dd+'</button>'
      : '<span class="cd off'+(iso === today ? ' td' : '')+'">'+dd+'</span>';
  }
  var mName = start.toLocaleDateString('de-DE', {month:'long', year:'numeric'});
  var canPrev = view > first.slice(0, 7), canNext = view < last.slice(0, 7);
  var chev = function(dir){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="'+(dir < 0 ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6')+'"/></svg>'; };
  var meta = (p.dur ? '<span>'+FP.ICONS.clock+esc(p.dur)+'</span>' : '') + (p.where ? '<span>'+(/video|zoom|teams|online|meet/i.test(p.where) ? FP.ICONS.chat : /telefon|anruf/i.test(p.where) ? FP.ICONS.phone : FP.ICONS.map)+esc(p.where)+'</span>' : '');
  /* Gestaltung: Farben, Form, Stil der Tage und Uhrzeiten, Karte, Schatten */
  var cst = (p.calAcc ? '--ca:'+esc(p.calAcc)+';' : '') + (p.calAccText ? '--cat:'+esc(p.calAccText)+';' : '') + (p.calBg ? '--cbg:'+esc(p.calBg)+';' : '') + (p.calText ? '--ctx:'+esc(p.calText)+';' : '') + (p.calRadius != null && p.calRadius !== '' ? '--cr:'+(+p.calRadius)+'px;' : '') + (+p.slotCols ? '--scol:'+(+p.slotCols)+';' : '');
  var ccl = ' cs-'+(p.calShape || 'circle')+' cd-'+(p.calDays || 'tint')+' cc-'+(p.calCard || 'card')+' ss-'+(p.slotStyle || 'outline')+(p.calDayShadow ? ' dsh' : '')+(p.calSelShadow === false ? ' nosh' : '');
  var h = label(p.label) + '<div class="fp-cal'+ccl+'" data-cal="'+b.id+'"'+(cst ? ' style="'+cst+'"' : '')+'>'
    + (meta ? '<div class="fp-calm">'+meta+'</div>' : '')
    + '<div class="fp-calh"><b>'+esc(mName)+'</b><div><button type="button" class="cn" data-act="calnav" data-bid="'+b.id+'" data-v="-1" aria-label="Voriger Monat"'+(canPrev ? '' : ' disabled')+'>'+chev(-1)+'</button><button type="button" class="cn" data-act="calnav" data-bid="'+b.id+'" data-v="1" aria-label="Nächster Monat"'+(canNext ? '' : ' disabled')+'>'+chev(1)+'</button></div></div>'
    + '<div class="fp-calw"><span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span></div>'
    + '<div class="fp-calg'+(anim === 'n' || anim === 'p' ? ' in-'+anim : '')+'">'+cells+'</div>';
  if(selDate){
    var slots = p.slots || [], dl = new Date(selDate+'T12:00:00').toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long'});
    h += '<div class="fp-calt'+(anim === 'd' ? ' in' : '')+'"><p class="fp-calth">'+esc(dl)+'</p><div class="fp-slots2">' + slots.map(function(sl, k){ return '<button type="button" class="fp-slot'+(cv.time === sl && cv.date === selDate ? ' sel' : '')+'" data-act="slot" data-bid="'+b.id+'" data-v="'+esc(sl)+'" style="--k:'+Math.min(k, 9)+'">'+esc(sl)+'</button>'; }).join('') + '</div></div>';
  } else h += '<p class="fp-calhint">Wähle einen Tag, dann siehst du die freien Uhrzeiten.</p>';
  if(cv.date && cv.time) h += '<div class="fp-calok">'+IC.ok+'<span>'+esc(fmtDate(cv.date))+' · '+esc(cv.time)+' Uhr</span></div>';
  return h + '</div>';
};

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
    else if(b.type === 'rating') val = p.style === 'faces' ? v + ' / ' + FP.rateMax(p) + ' (' + ((p.faceLabels||[])[v-1] || FP.FACE_LABELS[FP.faceIdx(FP.rateMax(p), v-1)]) + ')' : p.style === 'nps' ? v + ' / 10' : p.style === 'emoji' || p.style === 'slider' ? v + ' / ' + FP.rateMax(p) + ' ' + FP.faceFor(p, +v) : v + ' / ' + (p.max||5) + ' ★';
    else if(b.type === 'calendar') val = fmtDate(v.date) + (v.time ? ' · ' + v.time + ' Uhr' : '');
    else if(b.type === 'checkbox'){ label = 'Einwilligung'; val = v ? 'Ja' : 'Nein'; }
    else if(b.type === 'signature'){ val = 'Unterschrieben'; extra = v; }
    else if(b.type === 'upload'){ val = v.name; extra = v.data || null; }
    else if(typeof v === 'object') return;
    out.push({key:k, label:stripInk(label).replace(/\*\*|==/g,''), value:String(val), type:b.type, image:extra, inputType:p.inputType});
  }); });
  return out;
};

/* Webhook-Werte im Klartext, pro Feld-Schlüssel (kompatibel zu Onepage-Feldern):
   Bewertung/Zahl → Zahl · Einfachauswahl → Text · Mehrfachauswahl → Liste · Einwilligung → Einwilligungstext
   Schlüssel mit Punkt werden verschachtelt: name.firstName + name.lastName → {name:{firstName, lastName}} */
FP.values = function(f, answers){
  var out = {};
  var put = function(k, val){
    var parts = String(k).split('.'), o = out;
    for(var i = 0; i < parts.length - 1; i++){ if(typeof o[parts[i]] !== 'object' || o[parts[i]] === null) o[parts[i]] = {}; o = o[parts[i]]; }
    o[parts[parts.length-1]] = val;
  };
  (f.pages||[]).forEach(function(pg){ (pg.blocks||[]).forEach(function(b){
    var p = b.props || {}; if(!p.key) return;
    var v = answers[p.key];
    if(v == null || v === '' || (Array.isArray(v) && !v.length)) return;
    var label = function(id){ var o = (p.options||[]).filter(function(o){ return o.id === id; })[0]; return o ? (o.value != null && o.value !== '' ? o.value : o.label) : ''; };
    if(b.type === 'choice') put(p.key, p.multi ? [].concat(v).map(label).filter(Boolean) : label([].concat(v)[0]));
    else if(b.type === 'rating' || b.type === 'slider') put(p.key, +v);
    else if(b.type === 'checkbox') put(p.key, v ? stripInk(p.text||'').replace(/\*\*|==|__|\[\[|\]\]/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1') : '');
    else if(b.type === 'calendar') put(p.key, (v.date||'') + (v.time ? ' ' + v.time : ''));
    else if(b.type === 'upload') put(p.key, v.name || '');
    else if(b.type === 'signature') put(p.key, 'Unterschrieben');
    else if(typeof v !== 'object') put(p.key, b.type === 'input' && p.inputType === 'number' ? +v : String(v));
  }); });
  return out;
};

/* Webhook im Onepage-Format (für Empfänger, die bisher Onepage-Leads auswerten).
   Aufbau wie der Onepage-Webhook „lead.created“:
   {type, data:{id, formId, siteId, status, createdAt, updatedAt, source, fields:[{step,label,value,fieldType}], fieldsMap:{"Step N. Schritt -> slug": value}, leadInfo}}
   Step N = Position der Seite im Funnel (1-basiert), label = Feld-Schlüssel, nur besuchte Seiten in Besuchsreihenfolge.
   Auswahl → [{_id, value[, description]}] · Name (name.firstName/lastName) → {firstName, lastName, middleName} */
FP.onepagePayload = function(f, answers, path, meta){
  meta = meta || {};
  var s = f.settings || {}, pages = f.pages || [], now = new Date().toISOString();
  var plain = function(t){ return stripInk(t||'').replace(/\*\*|==|__|\[\[|\]\]/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1'); };
  var opt = function(o){ var r = {_id: o.oid || o.id, value: o.value != null && o.value !== '' ? o.value : o.label}; if(o.odesc !== undefined) r.description = o.odesc; else if(o.sub) r.description = o.sub; return r; };
  var fields = [], map = {};
  var show = function(v){ return Array.isArray(v) ? v.map(function(x){ return x && x.value; }).join(', ') : v && typeof v === 'object' ? [v.firstName, v.middleName, v.lastName].filter(Boolean).join(' ') : (v == null ? '' : String(v)); };
  var add = function(pg, label, value, type){
    var no = pg.opStep || pages.indexOf(pg) + 1; /* Onepage-Schrittnummer, falls bekannt (kann Lücken haben) */
    fields.push({step:pg.name, label:label, value:value, fieldType:type});
    map['Step ' + no + '. ' + pg.name + ' -> ' + label] = value;
  };
  (path || []).forEach(function(pid){
    var pg = pages.filter(function(p){ return p.id === pid; })[0]; if(!pg) return;
    var names = {};
    (pg.blocks||[]).forEach(function(b){
      var p = b.props || {}, k = p.key; if(!k) return;
      var v = answers[k];
      var dot = String(k).indexOf('.');
      if(b.type === 'input' && dot > 0){ /* name.firstName → ein Feld „name“ */
        var base = k.slice(0, dot), sub = k.slice(dot + 1);
        if(!names[base]){ names[base] = {firstName:'', lastName:'', middleName:''}; add(pg, base, names[base], 'form-name'); }
        names[base][sub] = v == null ? '' : String(v);
        return;
      }
      if(b.type === 'choice'){
        var sel = [].concat(v == null ? [] : v);
        add(pg, k, (p.options||[]).filter(function(o){ return sel.indexOf(o.id) >= 0; }).map(opt), 'form-select');
      } else if(b.type === 'rating' || b.type === 'slider'){
        add(pg, k, v == null ? null : +v, b.type === 'rating' ? 'form-option-scale' : 'form-range');
      } else if(b.type === 'checkbox'){
        add(pg, k, v ? [{_id: p.oid || b.id, value: plain(p.text)}] : [], 'form-select');
      } else if(b.type === 'input'){
        var it = p.inputType || 'text';
        add(pg, k, v == null ? '' : (it === 'number' && v !== '' ? +v : String(v)), it === 'email' ? 'form-email' : it === 'tel' ? 'form-phone' : it === 'textarea' ? 'form-textarea' : it === 'number' ? 'form-number' : it === 'date' ? 'form-date' : 'form-input');
      } else if(b.type === 'calendar'){
        add(pg, k, v ? (v.date||'') + (v.time ? ' ' + v.time : '') : '', 'form-date');
      }
    });
  });
  var ua = meta.userAgent || '';
  return {type:'lead.created', data:{
    id: meta.id, formId: s.onepageFormId || f.id, siteId: s.onepageSiteId || '', status:'new', createdAt: now, updatedAt: now,
    source: {device: /Mobi|Android|iPhone/i.test(ua) ? 'Mobile' : /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Desktop', os: /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iOS/i.test(ua) ? 'iOS' : /Mac OS/i.test(ua) ? 'macOS' : /Windows/i.test(ua) ? 'Windows' : '', browser: /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? (/Mobi/.test(ua) ? 'Mobile Chrome' : 'Chrome') : /Safari\//.test(ua) ? (/Mobi/.test(ua) ? 'Mobile Safari' : 'Safari') : /Firefox\//.test(ua) ? 'Firefox' : '',
      page: {id: f.id, title: s.onepageForm || f.name, slug: meta.slug ? '/' + String(meta.slug).replace(/^\//,'') : ''}},
    fields: fields, fieldsMap: map, leadInfo: fields.map(function(x){ return (s.onepageForm || f.name) + ' -> ' + x.step + ' -> ' + x.label + ': ' + show(x.value); }).join(' ')}};
};

/* Personalisierung: {{schluessel}} oder {{schluessel|Ersatztext}} */
FP.VAR_RE = /\{\{\s*([\w.-]+)\s*(?:\|([^}]*))?\}\}/g;
FP.vars = function(f){
  var out = [], seen = {}, add = function(k, l, t){ if(!k || seen[k]) return; seen[k] = 1; out.push({key:k, label:l, type:t}); };
  (f.pages||[]).forEach(function(pg){ (pg.blocks||[]).forEach(function(b){
    var p = b.props || {}; if(!p.key || ['choice','input','slider','rating','calendar'].indexOf(b.type) < 0) return;
    add(p.key, stripInk(p.label || p.question || pg.name || p.key).replace(/\*\*|==|__|\[\[|\]\]/g,'').replace(/\{\{[^}]*\}\}/g,'…').trim(), b.type);
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
/* ---------- Hinweis-Pfeil: handgezeichnete Pfeile (zeigen in der Grundstellung nach unten) ---------- */
FP.ARROWS = {
  curve:{d:'M28 10 C 64 12, 92 40, 74 98'},
  loop:{d:'M18 12 C 66 2, 92 38, 62 50 C 38 58, 42 30, 62 34 C 88 40, 86 76, 70 100'},
  straight:{d:'M60 8 C 57 38, 63 68, 60 100'},
  swoop:{d:'M12 30 C 30 6, 70 4, 84 30 C 94 50, 86 78, 66 98'}
};
/* Pfeilspitze exakt aus der Richtung am Linienende berechnen: zwei gleich lange Schenkel, symmetrisch zur Tangente */
FP.arrowHead = function(d){
  var n = String(d).match(/-?\d+(?:\.\d+)?/g).map(Number), k = n.length;
  var ex = n[k-2], ey = n[k-1], cx = n[k-4], cy = n[k-3], a = Math.atan2(ey - cy, ex - cx), L = 15, s = 32 * Math.PI / 180;
  var pt = function(t){ return (ex - L * Math.cos(a + t)).toFixed(1) + ' ' + (ey - L * Math.sin(a + t)).toFixed(1); };
  return 'M' + pt(-s) + ' L' + ex + ' ' + ey + ' L' + pt(s);
};

/* ---------- Ladeseite: eigene Lottie-Animationen (Farbe [1,0,1] wird zur Primärfarbe) ---------- */
FP.LOTTIE = {"ring":{"v":"5.7.4","fr":60,"ip":0,"op":90,"w":200,"h":200,"nm":"ring","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[1],"y":[1]},"o":{"x":[0],"y":[0]}},{"t":90,"s":[360]}]},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[120,120]},"p":{"a":0,"k":[0,0]}},{"ty":"tm","s":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":30,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":90,"s":[100]}]},"e":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":90,"s":[100]}]},"o":{"a":0,"k":0},"m":1},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":12},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":90,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[120,120]},"p":{"a":0,"k":[0,0]}},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":16},"w":{"a":0,"k":12},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":90,"st":0,"bm":0}]},"dots":{"v":"5.7.4","fr":60,"ip":0,"op":60,"w":200,"h":200,"nm":"dots","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"sr":1,"ks":{"o":{"a":1,"k":[{"t":0,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":0,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":14,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":28,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[45]}]},"r":{"a":0,"k":0},"p":{"a":1,"k":[{"t":0,"s":[62,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":0,"s":[62,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":14,"s":[62,86,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":28,"s":[62,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[62,108,0]}]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[22,22]},"p":{"a":0,"k":[0,0]}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":60,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"sr":1,"ks":{"o":{"a":1,"k":[{"t":0,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":8,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":22,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":36,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[45]}]},"r":{"a":0,"k":0},"p":{"a":1,"k":[{"t":0,"s":[100,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":8,"s":[100,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":22,"s":[100,86,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":36,"s":[100,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[100,108,0]}]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[22,22]},"p":{"a":0,"k":[0,0]}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":60,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"sr":1,"ks":{"o":{"a":1,"k":[{"t":0,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":16,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":30,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":44,"s":[45],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[45]}]},"r":{"a":0,"k":0},"p":{"a":1,"k":[{"t":0,"s":[138,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":16,"s":[138,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":30,"s":[138,86,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":44,"s":[138,108,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[138,108,0]}]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[22,22]},"p":{"a":0,"k":[0,0]}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":60,"st":0,"bm":0}]},"pulse":{"v":"5.7.4","fr":60,"ip":0,"op":100,"w":200,"h":200,"nm":"pulse","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"t":0,"s":[100,100,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":50,"s":[112,112,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":100,"s":[100,100,100]}]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[30,30]},"p":{"a":0,"k":[0,0]}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":100,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":1,"k":[{"t":0,"s":[30,30],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":0,"s":[30,30],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":50,"s":[170,170],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":100,"s":[170,170]}]},"p":{"a":0,"k":[0,0]}},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":0,"s":[70],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":50,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":100,"s":[0]}]},"w":{"a":0,"k":6},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":100,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":1,"k":[{"t":0,"s":[30,30],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":50,"s":[30,30],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":100,"s":[170,170]}]},"p":{"a":0,"k":[0,0]}},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":50,"s":[70],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":100,"s":[0]}]},"w":{"a":0,"k":6},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":100,"st":0,"bm":0}]},"search":{"v":"5.7.4","fr":60,"ip":0,"op":120,"w":200,"h":200,"nm":"search","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":30,"s":[8],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[-6],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":90,"s":[6],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":120,"s":[0]}]},"p":{"a":1,"k":[{"t":0,"s":[88,92,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":30,"s":[118,80,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":60,"s":[108,112,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":90,"s":[80,104,0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":120,"s":[88,92,0]}]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[56,56]},"p":{"a":0,"k":[0,0]}},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":10},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]},{"ty":"gr","it":[{"ty":"sh","ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[20,20],[46,46]],"c":false}}},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":10},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":120,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[120,8]},"p":{"a":0,"k":[0,58]},"r":{"a":0,"k":4}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":14},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":120,"st":0,"bm":0}]},"bars":{"v":"5.7.4","fr":60,"ip":0,"op":72,"w":200,"h":200,"nm":"bars","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"sr":1,"ks":{"o":{"a":1,"k":[{"t":0,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":0,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":18,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":36,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[55]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[58,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"t":0,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":0,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":18,"s":[100,110,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":36,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[100,40,100]}]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[18,70]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":9}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":72,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"sr":1,"ks":{"o":{"a":1,"k":[{"t":0,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":9,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":27,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":45,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[55]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[86,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"t":0,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":9,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":27,"s":[100,110,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":45,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[100,40,100]}]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[18,70]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":9}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":72,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"sr":1,"ks":{"o":{"a":1,"k":[{"t":0,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":18,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":36,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":54,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[55]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[114,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"t":0,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":18,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":36,"s":[100,110,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":54,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[100,40,100]}]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[18,70]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":9}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":72,"st":0,"bm":0},{"ddd":0,"ind":4,"ty":4,"sr":1,"ks":{"o":{"a":1,"k":[{"t":0,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":27,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":45,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":63,"s":[55],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[55]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[142,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"t":0,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":27,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":45,"s":[100,110,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":63,"s":[100,40,100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":72,"s":[100,40,100]}]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[18,70]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":9}},{"ty":"fl","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":72,"st":0,"bm":0}]},"check":{"v":"5.7.4","fr":60,"ip":0,"op":150,"w":200,"h":200,"nm":"check","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":-90},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[130,130]},"p":{"a":0,"k":[0,0]}},{"ty":"tm","s":{"a":0,"k":0},"e":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":55,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":150,"s":[100]}]},"o":{"a":0,"k":0},"m":1},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":10},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":150,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"sh","ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-30,2],[-9,23],[32,-20]],"c":false}}},{"ty":"tm","s":{"a":0,"k":0},"e":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":55,"s":[0],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":80,"s":[100],"i":{"x":[0.3],"y":[1]},"o":{"x":[0.5],"y":[0]}},{"t":150,"s":[100]}]},"o":{"a":0,"k":0},"m":1},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":12},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":150,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","d":1,"s":{"a":0,"k":[130,130]},"p":{"a":0,"k":[0,0]}},{"ty":"st","c":{"a":0,"k":[1,0,1,1]},"o":{"a":0,"k":14},"w":{"a":0,"k":10},"lc":2,"lj":2,"ml":4},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":150,"st":0,"bm":0}]}};
FP.LOADERS = [['cube','3D · Würfel'],['orbit','3D · Orbit'],['globe','3D · Globus'],['helix','3D · Helix'],['flip','3D · Karten'],['stack','3D · Ebenen'],['ring','Kreis'],['dots','Punkte'],['pulse','Puls'],['search','Suche'],['bars','Balken'],['check','Fertig'],['custom','Eigene Lottie-Datei']];
/* 3D-Ladeanimationen: echte 3D-Szenen in CSS (Perspektive, preserve-3d), Farbe aus dem Theme, kein Script nötig */
FP.ld3d = function(kind){
  var rep = function(n, fn){ var o = ''; for(var i = 0; i < n; i++) o += fn(i); return o; };
  switch(kind){
    case 'cube': return '<div class="l3 l3-cube"><div class="c3">'+rep(6, function(i){ return '<i class="f'+(i+1)+'"></i>'; })+'</div><span class="l3sh"></span></div>';
    case 'orbit': return '<div class="l3 l3-orbit"><div class="o3"><b class="core"></b>'+rep(3, function(i){ return '<i class="r'+(i+1)+'"><u></u></i>'; })+'</div></div>';
    case 'globe': return '<div class="l3 l3-globe"><div class="g3">'+rep(6, function(i){ return '<i style="--a:'+i+'"></i>'; })+'<s style="--z:-1.6em;--r:.79"></s><s style="--z:0em;--r:1"></s><s style="--z:1.6em;--r:.79"></s><b></b></div><span class="l3sh"></span></div>';
    case 'helix': return '<div class="l3 l3-helix"><div class="h3">'+rep(14, function(i){ return '<i style="--i:'+i+'"><b></b><b></b></i>'; })+'</div></div>';
    case 'flip': return '<div class="l3 l3-flip"><div class="fl3">'+rep(3, function(i){ return '<i style="--k:'+i+'"></i>'; })+'</div><span class="l3sh"></span></div>';
    case 'stack': return '<div class="l3 l3-stack"><div class="s3">'+rep(3, function(i){ return '<i style="--k:'+i+'"></i>'; })+'</div></div>';
  }
  return '';
};
var lottieQ = null;
FP.lottieLib = function(cb){
  if(window.lottie) return cb(window.lottie);
  if(lottieQ){ lottieQ.push(cb); return; }
  lottieQ = [cb];
  var sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js'; sc.async = true;
  sc.onload = function(){ var q = lottieQ; lottieQ = null; q.forEach(function(f){ try{ f(window.lottie); }catch(e){} }); };
  sc.onerror = function(){ lottieQ = null; }; /* ohne Bibliothek bleibt der CSS-Kreisel sichtbar */
  document.head.appendChild(sc);
};
FP.hexRgb = function(hex){ var h = String(hex||'').replace('#',''); if(h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h.slice(0,6), 16); return isNaN(n) ? [0.26,0.33,1] : [(n>>16&255)/255, (n>>8&255)/255, (n&255)/255]; };
/* Lade-Animationen auf einer Seite starten (Funnel und Editor-Vorschau). Gibt eine Aufräumfunktion zurück. */
FP.playLoaders = function(root, f){
  var anims = [], timers = [];
  root.querySelectorAll('[data-ld]').forEach(function(box){
    var holder = box.querySelector('.fp-ld-a'), kind = box.getAttribute('data-anim') || 'ring', cs = getComputedStyle(box).getPropertyValue('--p') || (f.theme||{}).primary;
    var tx = box.querySelector('.fp-ld-t'), lines = []; try{ lines = JSON.parse(box.getAttribute('data-lines') || '[]'); }catch(e){}
    var dur = +box.getAttribute('data-dur') || 3;
    if(tx && lines.length > 1){ var k = 0; timers.push(setInterval(function(){ k = (k + 1) % lines.length; tx.classList.remove('in'); void tx.offsetWidth; tx.textContent = lines[k]; tx.classList.add('in'); }, Math.max(900, dur * 1000 / lines.length))); }
    if(!holder) return;
    var data = null, src = box.getAttribute('data-src') || '';
    if(kind === 'custom'){ var raw = box.getAttribute('data-json'); if(raw){ try{ data = JSON.parse(raw); }catch(e){} } }
    else if(FP.LOTTIE[kind]){ var c = FP.hexRgb(String(cs).trim() || '#4353ff'); data = JSON.parse(JSON.stringify(FP.LOTTIE[kind]).replace(/\[1,0,1,1\]/g, '['+c.map(function(v){ return +v.toFixed(3); }).join(',')+',1]')); }
    if(!data && !src) return;
    FP.lottieLib(function(L){
      if(!holder.isConnected) return;
      try{ anims.push(L.loadAnimation({container:holder, renderer:'svg', loop:true, autoplay:!matchMedia('(prefers-reduced-motion: reduce)').matches, animationData:data || undefined, path:data ? undefined : src})); holder.classList.add('on'); }catch(e){}
    });
  });
  return function(){ anims.forEach(function(a){ try{ a.destroy(); }catch(e){} }); timers.forEach(clearInterval); };
};
FP.loaderOf = function(page){ return ((page && page.blocks) || []).filter(function(b){ return b.type === 'loader'; })[0] || null; };

/* Unscharfe Vorschau: winzige Version des Fotos als Hintergrund, bis das scharfe Bild geladen ist (Unsplash/imgix kann das per URL) */
FP.lqSrc = function(src){ src = String(src || ''); if(!/^https:\/\/images\.unsplash\.com\//.test(src)) return ''; return src.replace(/([?&])w=\d+/, '$1w=24').replace(/([?&])q=\d+/, '$1q=30') + (/[?&]w=/.test(src) ? '' : (src.indexOf('?') < 0 ? '?' : '&') + 'w=24&q=30') + '&blur=40'; };
FP.lqStyle = function(src){ var lq = FP.lqSrc(src); return lq ? ' style="background-image:url(&quot;'+lq+'&quot;)"' : ''; };

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
      h = '<h'+lv+' class="fp-h'+lv+'" style="'+(p.color?'color:'+p.color+';':'')+(p.size?'font-size:'+p.size+'px;':'')+(p.lh?'line-height:'+p.lh+';':'')+'">'+T(p.text)+'</h'+lv+'>';
      break;
    case 'text':
      h = '<p class="fp-txt" style="'+(p.color?'color:'+p.color+';':'')+(p.size?'font-size:'+p.size+'px;':'')+(p.lh?'line-height:'+p.lh+';':'')+'">'+T(p.text)+'</p>';
      break;
    case 'badge':
      h = '<span class="fp-badge '+(p.variant||'')+(p.upper?' up':'')+'">'+T(p.text)+'</span>';
      break;
    case 'recap':
      /* Danke-Seite: Karte mit dem Bild der gewählten Antwort, den Antworten und dem Preis */
      var rrows = FP.readable(ctx.f, a).filter(function(x){ return ['choice','slider','rating','calendar'].indexOf(x.type) >= 0; }).slice(0, +p.max || 6), rimg = '';
      FP.allBlocks(ctx.f).some(function(bb){ if(bb.type !== 'choice') return false; var vv = [].concat(a[keyOf(bb)] == null ? [] : a[keyOf(bb)]); var oo = (bb.props.options || []).filter(function(o){ return vv.indexOf(o.id) >= 0 && o.img; })[0]; if(oo){ rimg = oo.img; return true; } return false; });
      /* Kurze Beschriftung: Name der Seite (z. B. „Material“) statt der ganzen Frage */
      var rpn = {}; (ctx.f.pages || []).forEach(function(pg){ (pg.blocks || []).forEach(function(bb){ if(pg.name && !/^seite \d+$/i.test(pg.name)) rpn[keyOf(bb)] = pg.name; }); });
      if(ctx.edit && !rrows.length) rrows = [{label:'Deine Antworten', value:'erscheinen hier'}, {label:'zum Beispiel', value:'Material, Fläche, Extras'}];
      var rtot = FP.computeTotal(ctx.f, a), rexact = ((ctx.f.settings||{}).priceMode || 'exact') === 'exact';
      h = '<div class="fp-recap">' + (p.showImage !== false && rimg ? '<div class="ri" style="background-image:url(&quot;'+esc(rimg)+'&quot;)"></div>' : '')
        + '<div class="rb"><div class="rh">'+T(p.title || 'Deine Auswahl')+'</div>'
        + rrows.map(function(x){ return '<div class="rr"><span>'+esc(rpn[x.key] || x.label)+'</span><b>'+esc(x.value)+'</b></div>'; }).join('')
        + (p.showPrice !== false && (rtot.total > 0 || ctx.edit) ? '<div class="rt"><span>'+esc(p.totalLabel || 'Geschätzter Preis')+'</span><b>'+(rexact && p.prefix ? esc(p.prefix)+' ' : '')+esc(FP.priceText(ctx.f, rtot.total))+'</b></div>' : '')
        + '</div></div>';
      break;
    case 'steps':
      /* Zeitleiste „So geht's weiter“: erster Schritt erledigt, zweiter läuft, Rest folgt */
      h = (p.title ? '<p class="fp-tlh">'+T(p.title)+'</p>' : '') + '<ol class="fp-tl">' + (p.items || []).map(function(it, i){ var pr = String(it).split('|'); return '<li class="'+(i===0?'done':i===1?'now':'')+'"><span class="dt">'+(i===0?IC.check:'')+'</span><div><b>'+T(pr[0].trim())+'</b>'+(pr[1] ? '<small>'+T(pr.slice(1).join('|').trim())+'</small>' : '')+'</div></li>'; }).join('') + '</ol>';
      break;
    case 'reviews':
      /* Bewertungs-Abzeichen: Sterne (anteilig gefüllt), Note, Anzahl und Quelle */
      var rsc = Math.max(0, Math.min(5, +String(p.score || 4.9).replace(',', '.'))), rstars = '<span class="sb">'+'<svg viewBox="0 0 24 24"><path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36 6.3 20.36l1.09-6.35-4.62-4.5 6.38-.93z"/></svg>'.repeat(5)+'</span>';
      h = '<div class="fp-rev'+(p.variant === 'card' ? ' card' : '')+'"><span class="rs" aria-label="'+rsc.toLocaleString('de-DE')+' von 5 Sternen">'+rstars+'<span class="sf" style="width:'+(rsc/5*100)+'%">'+rstars+'</span></span><b>'+rsc.toLocaleString('de-DE', {minimumFractionDigits:1, maximumFractionDigits:1})+'</b><span class="rc">'+esc(p.text || ((p.count ? Number(p.count).toLocaleString('de-DE') + ' Bewertungen' : 'Bewertungen') + (p.source ? ' auf ' + p.source : '')))+'</span></div>';
      break;
    case 'avatars':
      /* Kundenstapel: Fotos oder Initialen, dazu Sterne und ein Satz */
      var avl = (p.photos || []).filter(Boolean).slice(0, 5), avn = (p.names || ['Anna K.','Markus T.','Sabine L.','Jonas W.']).slice(0, 5), avc = avl.length || avn.length;
      h = '<div class="fp-avs"><div class="as">' + (avl.length ? avl.map(function(u){ return '<span class="av" style="background-image:url(&quot;'+esc(u)+'&quot;)"></span>'; }) : avn.map(function(n, i){ return '<span class="av ini" style="--k:'+(i*18)+'%">'+esc(initials(n))+'</span>'; })).join('') + (p.more ? '<span class="av more">'+esc(p.more)+'</span>' : '') + '</div>'
        + '<div class="at">'+(p.stars !== false ? '<span class="ast">'+'★★★★★'+'</span>' : '')+'<span>'+T(p.text || 'Über 200 zufriedene Kunden')+'</span></div></div>';
      break;
    case 'logos':
      /* Logo-Leiste: läuft langsam durch (bei reduzierter Bewegung steht sie still) */
      var lgs = (p.items || []).filter(function(x){ return String(x).trim(); });
      var lgi = function(x){ return /^(https?:|data:|\/)/.test(x) ? '<span class="lg"><img src="'+esc(x)+'" alt="" loading="lazy"></span>' : '<span class="lg tx">'+esc(x)+'</span>'; };
      h = (p.title ? '<p class="fp-lgt">'+T(p.title)+'</p>' : '') + '<div class="fp-logos'+(p.gray !== false ? ' gray' : '')+'" style="--ls:'+Math.max(10, +p.speed || 28)+'s"><div class="lr">' + lgs.map(lgi).join('') + '<span class="dup" aria-hidden="true">'+lgs.map(lgi).join('')+'</span></div></div>';
      break;
    case 'arrow':
      /* Liegt über dem Inhalt (nimmt keinen Platz ein), frei verschiebbar über x/y, klickt nicht im Weg */
      var aw = FP.ARROWS[p.style] || FP.ARROWS.curve, asz = Math.max(30, Math.min(260, +p.size || 90)), aside = p.textSide || 'start';
      var atx = aside === 'none' || !p.text ? '' : '<span class="at'+(p.hand !== false ? ' hand' : '')+'">'+T(p.text)+'</span>';
      var asvg = '<span class="ar" style="transform:rotate('+(+p.rotate||0)+'deg)'+(p.flip ? ' scaleX(-1)' : '')+'"><svg viewBox="0 0 120 120" width="'+asz+'" height="'+asz+'" aria-hidden="true"><path class="ap" pathLength="1" d="'+aw.d+'"/><path class="ah" pathLength="1" d="'+FP.arrowHead(aw.d)+'"/></svg></span>';
      h = '<div class="fp-arw a-'+esc(p.anim || 'bounce')+'" role="note" style="--ax:'+(+p.x||0)+'px;--ay:'+(+p.y||0)+'px;--asz:'+asz+'px'+(p.acolor ? ';--ac:'+esc(p.acolor) : '')+'">'+(aside === 'end' ? asvg + atx : atx + asvg)+'</div>';
      break;
    case 'lottie':
      /* Block „Animation“: eigene Lottie-Datei (Upload) oder Link zu einer .json-Datei */
      var lsz2 = Math.max(24, Math.min(640, +p.size || 160)), lsrc = /^https?:\/\//.test(p.src || '') ? p.src : '';
      h = p.json || lsrc ? '<div class="fp-lot" data-lot="'+b.id+'"'+(p.json ? ' data-json="'+esc(p.json)+'"' : ' data-src="'+esc(lsrc)+'"')+' data-loop="'+(p.loop === false ? 0 : 1)+'" data-speed="'+(+p.speed || 1)+'"'+(p.alt ? ' role="img" aria-label="'+esc(p.alt)+'"' : ' aria-hidden="true"')+' style="width:'+lsz2+'px;aspect-ratio:1"></div>'
        : (ctx.edit ? '<div class="fp-lot empty" style="width:'+lsz2+'px;height:'+lsz2+'px"><span>Lottie-Datei hochladen<br>oder Link einfügen</span></div>' : '');
      break;
    case 'loader':
      /* Ladeseite: Animation, wechselnde Hinweise, Balken über die eingestellte Zeit; danach geht es automatisch weiter */
      var lines = (p.texts || []).filter(function(x){ return String(x).trim(); }), dur = Math.max(1, Math.min(20, +p.duration || 3)), lsz = Math.max(48, Math.min(260, +p.size || 120));
      h = '<div class="fp-ld" data-ld="'+b.id+'" data-anim="'+esc(p.anim || 'ring')+'" data-dur="'+dur+'" data-lines="'+esc(JSON.stringify(lines))+'"'+(p.anim === 'custom' && p.src ? ' data-src="'+esc(p.src)+'"' : '')+(p.anim === 'custom' && p.json ? ' data-json="'+esc(p.json)+'"' : '')+' style="--ld-d:'+dur+'s">'
        + (FP.ld3d(p.anim) ? '<div class="fp-ld-a on" style="width:'+lsz+'px;height:'+lsz+'px;font-size:'+(lsz/10)+'px" aria-hidden="true">'+FP.ld3d(p.anim)+'</div>' : '<div class="fp-ld-a" style="width:'+lsz+'px;height:'+lsz+'px" aria-hidden="true"></div>')
        + (lines.length ? '<p class="fp-ld-t in" role="status" aria-live="polite">'+esc(lines[0])+'</p>' : '')
        + (p.showBar !== false ? '<div class="fp-ld-bar'+(ctx.edit || ctx.noAnim ? ' still' : '')+'"><i></i></div>' : '') + '</div>';
      break;
    case 'compare':
      /* Vorher/Nachher: Nachher-Bild liegt oben und wird ab --x freigeschnitten; Ziehen, Tippen oder Pfeiltasten */
      var cr = p.ratio ? String(p.ratio).replace(':','/') : '4/3', cx = Math.max(0, Math.min(100, p.start != null && p.start !== '' ? +p.start : 50));
      var cim = function(src, cls){ return src ? '<img class="'+cls+'" src="'+esc(src)+'" alt="" draggable="false" decoding="async"'+FP.lqStyle(src)+'>' : '<span class="'+cls+' fp-ph"></span>'; };
      h = '<div class="fp-cmp" data-cmp="'+b.id+'" role="slider" tabindex="0" aria-label="Vorher-Nachher-Vergleich" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+cx+'" style="--x:'+cx+'%;aspect-ratio:'+esc(cr)+';border-radius:'+(p.radius!=null?p.radius:14)+'px">'
        + cim(p.before, 'bf') + '<div class="af">'+cim(p.after, 'ai')+'</div>'
        + (p.labelBefore ? '<span class="fp-tag l">'+esc(p.labelBefore)+'</span>' : '') + (p.labelAfter ? '<span class="fp-tag r">'+esc(p.labelAfter)+'</span>' : '')
        + '<span class="hd" aria-hidden="true"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg></i></span></div>';
      break;
    case 'image':
      var ih = p.ratio ? 'aspect-ratio:'+esc(String(p.ratio).replace(':','/'))+';height:auto;' : p.height ? 'height:'+p.height+'px;' : '';
      var ilq = p.fit === 'contain' ? '' : FP.lqSrc(p.src);
      h = p.src ? '<img class="fp-img" src="'+esc(p.src)+'" alt="'+esc(p.alt)+'" decoding="async" style="border-radius:'+(p.radius!=null?p.radius:14)+'px;'+ih+(p.fit==='contain'?'object-fit:contain;':'')+(p.pos?'object-position:'+esc(p.pos)+';':'')+(ilq?'background-image:url(&quot;'+ilq+'&quot;);':'')+FP.edgeMask(p).replace(/"/g,'&quot;')+'">'
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
      var icH = FP.btnIcon(p);
      var cls = 'fp-btn ' + bv + (p.shadow!==false?' shadow':'') + (p.full===false?' auto':'') + (p.pulse?' pulse'+(p.pulseI?' pl-'+(p.pulseI==='strong'?'strong':'soft'):''):'');
      var bst = (p.btnBg ? '--p:'+p.btnBg+';' : '') + (p.btnColor ? '--pt:'+p.btnColor+';' : '') + (p.radiusOn ? '--br:'+(+p.radius||0)+'px;' : '');
      if(bv === 'gradient'){ if(p.gradA) bst += '--g1:'+esc(p.gradA)+';'; if(p.gradB) bst += '--g2:'+esc(p.gradB)+';'; if(p.gradAng != null && p.gradAng !== '') bst += '--ga:'+(+p.gradAng)+'deg;'; }
      if(+p.bSize) bst += 'font-size:'+(+p.bSize)+'px;';
      if(p.icColor) bst += '--bic:'+esc(p.icColor)+';';
      if(+p.btnBw || p.btnBc) bst += 'border:'+(p.btnBw !== '' && p.btnBw != null ? +p.btnBw : 1)+'px solid '+esc(p.btnBc || 'color-mix(in srgb,currentColor 25%,transparent)')+';'; /* eigener Rahmen, z. B. weißer Button mit feiner Linie */
      var bpd = FP.padSides(p, ['bpt','bpr','bpb','bpl']); if(bpd) bst += bpd + 'min-height:0;'; /* eigener Innenabstand schlägt Mindesthöhen aus Vorlagen-CSS */
      var subIn = p.sub && p.subIn;
      var lbl = subIn ? '<span class="tx"><span class="ln">'+T(p.label||'Weiter')+'</span><span class="sb">'+T(p.sub)+'</span></span>' : '<span>'+T(p.label||'Weiter')+'</span>';
      if(subIn) cls += ' two';
      h = '<button class="'+cls+FP.btnIcCls(icH, p)+'" style="'+bst+'" data-act="btn" data-bid="'+b.id+'">'+(p.iconLeft?icH+lbl:lbl+icH)+'</button>' + (p.sub && !subIn ? '<span class="fp-sub">'+T(p.sub)+'</span>' : '');
      break;
    case 'choice':
      var sel = [].concat(v == null ? [] : v), lay = p.layout || 'list';
      var cntH = p.multi ? '<span class="fp-cnt'+(sel.length?' on':'')+'" data-cnt="'+b.id+'">'+(sel.length ? sel.length+' gewählt' : '')+'</span>' : '';
      h = (p.question ? '<p class="fp-q">'+T(p.question)+rq+cntH+'</p>' : cntH) + (p.desc ? '<p class="fp-qd">'+T(p.desc)+'</p>' : '');
      if(lay === 'scale' && p.faceStyle === 'flat'){
        var sop = p.options || [];
        h += '<div class="fp-faces'+(p.faceBare?' bare':'')+(p.faceNoText?' notext':'')+'" style="--n:'+sop.length+'">' + sop.map(function(o, i){ return '<button class="fp-fc'+(sel.indexOf(o.id)>=0?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'" aria-label="'+esc(o.label)+'"><span class="fc">'+FP.FACES[FP.faceIdx(sop.length, i)]+'</span>'+(p.faceNoText ? '' : '<span class="fl">'+esc(o.label)+'</span>')+'</button>'; }).join('') + '</div>';
        if(p.faceNoText && p.faceEnds && sop.length) h += '<div class="fp-rlab"><span>'+esc(p.minLabel || sop[0].label)+'</span><span>'+esc(p.maxLabel || sop[sop.length-1].label)+'</span></div>';
        break;
      }
      if(lay === 'scale'){
        h += '<div class="fp-scale">' + (p.options||[]).map(function(o){ return '<button class="fp-sopt'+(sel.indexOf(o.id)>=0?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'" title="'+esc(o.label)+'">'+(o.icon?'<span class="si">'+esc(o.icon)+'</span>':'<span class="sl">'+esc(o.label)+'</span>')+'</button>'; }).join('') + '</div>';
        if(p.minLabel || p.maxLabel) h += '<div class="fp-rlab"><span>'+esc(p.minLabel)+'</span><span>'+esc(p.maxLabel)+'</span></div>';
        break;
      }
      if(lay === 'chips'){
        /* Chips: Pillen mit optionalem Icon, Farbe pro Antwort, versetzte oder wischbare Reihen */
        h += '<div class="fp-opts fp-chips ca-'+esc(p.chipArr||'center')+' cs-'+esc(p.chipStyle||'tint')+(p.chipGrad?' cg':'')+'" style="'+(hv0(p.chipRad)?'--chr:'+(+p.chipRad)+'px;':'')+(+p.chipSize?'--chs:'+(+p.chipSize)+'px;':'')+'">';
        (p.options||[]).forEach(function(o){
          var on = sel.indexOf(o.id) >= 0, cst = (o.col?'--cc:'+esc(o.col)+';':'')+(o.cbg?'--cbg:'+esc(o.cbg)+';':'')+(o.ctx?'--ctx2:'+esc(o.ctx)+';':'');
          var ci = p.chipIcon === false ? '' : (o.ic && FP.ICONS[o.ic] ? '<span class="ci">'+FP.ICONS[o.ic]+'</span>' : o.icon ? '<span class="ci e">'+esc(o.icon)+'</span>' : '');
          var pr0 = p.showPrices && (+o.price || +o.unitPrice) ? '<small>'+(+o.price ? '+ '+FP.money(o.price,cur) : FP.money(o.unitPrice,cur))+'</small>' : '';
          h += '<button class="fp-chip'+(on?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'" aria-pressed="'+on+'"'+(cst?' style="'+cst+'"':'')+'>'+ci+'<span>'+esc(o.label)+'</span>'+pr0+'</button>';
        });
        h += '</div>';
        break;
      }
      if(lay === 'cover'){
        /* Bildkarten vollflächig: Bild füllt die Karte, Text unten auf einem weißen oder schwarzen Verlauf */
        var cvr = p.ratio ? String(p.ratio).replace(':','/') : '4/5';
        h += '<div class="fp-opts fp-cover cc'+(+p.cols||2)+' fd-'+esc(p.coverFade||'white')+' cva-'+esc(p.coverAlign||'bottom')+'" style="--cvr:'+esc(cvr)+';'+(hv0(p.coverRad)?'--cvrad:'+(+p.coverRad)+'px;':'')+(p.coverTx?'--cvt:'+esc(p.coverTx)+';':'')+(+p.coverSize?'--cvs:'+(+p.coverSize)+'px;':'')+(hv0(p.coverFadeS)?'--cvf:'+(+p.coverFadeS)+'%;':'')+'">';
        (p.options||[]).forEach(function(o){
          var on = sel.indexOf(o.id) >= 0, clq = o.img ? FP.lqSrc(o.img) : '';
          var bg = o.img ? 'background-image:url(&quot;'+o.img+'&quot;)'+(clq?',url(&quot;'+clq+'&quot;)':'')+(o.pos?';background-position:'+esc(o.pos):'') : 'background:linear-gradient(135deg,color-mix(in srgb,var(--p) 22%,var(--sf)),var(--sf))';
          var pr1 = p.showPrices && (+o.price || +o.unitPrice) ? '<span class="pr">'+(+o.price ? '+ '+FP.money(o.price,cur) : FP.money(o.unitPrice,cur)+(o.unitLabel?' / '+esc(o.unitLabel):''))+'</span>' : '';
          h += '<button class="fp-cv'+(on?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'" aria-pressed="'+on+'"><span class="cvi" style="'+bg+'"></span><span class="cvo"></span>'
            + (o.img && p.zoom ? '<span class="zm" role="button" tabindex="0" data-act="zoom" data-bid="'+b.id+'" data-oid="'+o.id+'" aria-label="Bild vergrößern"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5"/></svg></span>' : '')
            + '<span class="cvl"><b>'+esc(o.label)+'</b>'+(o.sub?'<span>'+esc(o.sub)+'</span>':'')+pr1+'</span><span class="chk'+(p.multi?' sq':'')+'">'+IC.check+'</span></button>';
        });
        h += '</div>';
        break;
      }
      var ratio = lay==='image' && p.ratio ? String(p.ratio).replace(':','/') : '';
      h += '<div class="fp-opts '+lay+((lay==='image'&&p.cols===1)?' one':'')+((lay==='image'&&(p.cols===3||p.cols===4))?' c'+p.cols:'')+((lay==='grid'&&p.cols===3)?' grid3':'')+((lay==='image'||lay==='grid'||lay==='checklist')&&+p.colsD>1?' cd'+(+p.colsD):'')+(p.optAlign?' ta-'+(p.optAlign==='center'?'c':'l'):'')+(p.optFw?' ofw':'')+(p.optSubFw?' osfw':'')+'"'+((ratio||p.optFw||p.optSubFw)?' style="'+(ratio?'--ir:'+esc(ratio)+';':'')+(p.optFw?'--ofw:'+(+p.optFw)+';':'')+(p.optSubFw?'--osfw:'+(+p.optSubFw)+';':'')+'"':'')+'>';
      (p.options||[]).forEach(function(o){
        var on = sel.indexOf(o.id) >= 0;
        var price = p.showPrices && (+o.price || +o.unitPrice) ? '<span class="pr">'+(+o.price ? '+ '+FP.money(o.price,cur) : FP.money(o.unitPrice,cur)+(o.unitLabel?' / '+esc(o.unitLabel):''))+'</span>' : '';
        var chk = '<span class="chk'+(p.multi?' sq':'')+'">'+IC.check+'</span>';
        if(lay === 'image'){
          var olq = o.img ? FP.lqSrc(o.img) : '';
          var bg = o.img ? 'background-image:url(&quot;'+o.img+'&quot;)'+(olq?',url(&quot;'+olq+'&quot;)':'')+(o.pos?';background-position:'+esc(o.pos):'') :'background:linear-gradient(135deg,color-mix(in srgb,var(--p) 18%,var(--sf)),var(--sf))';
          h += '<button class="fp-opt'+(on?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'"><span class="im'+(!o.img && o.ic && FP.ICONS[o.ic] ? ' ic' : '')+'" style="'+bg+'">'+(o.img?'':(o.ic && FP.ICONS[o.ic] ? FP.ICONS[o.ic] : esc(o.icon||'')))+(o.img && p.zoom ? '<span class="zm" role="button" tabindex="0" data-act="zoom" data-bid="'+b.id+'" data-oid="'+o.id+'" aria-label="Bild vergrößern"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5"/></svg></span>' : '')+'</span><span class="lbl">'+esc(o.label)+(o.sub?'<span class="sub">'+esc(o.sub)+'</span>':'')+price+'</span>'+chk+'</button>';
        } else {
          h += '<button class="fp-opt'+(on?' sel':'')+'" data-act="opt" data-bid="'+b.id+'" data-oid="'+o.id+'">'+(o.ic && FP.ICONS[o.ic] ? '<span class="ico ic">'+FP.ICONS[o.ic]+'</span>' : o.icon?'<span class="ico">'+esc(o.icon)+'</span>':'')+'<span class="lbl">'+esc(o.label)+(o.sub?'<span class="sub">'+esc(o.sub)+'</span>':'')+price+'</span>'+chk+'</button>';
        }
      });
      h += '</div>';
      break;
    case 'input':
      var it = p.inputType || 'text', icon = p.emoji ? '<span class="ie">'+esc(p.emoji)+'</span>' : it==='email'?IC.mail:it==='tel'?IC.phone:p.icon==='user'?IC.user:'';
      var val = v == null ? '' : esc(v);
      var field = it === 'textarea' ? '<textarea class="fp-in" data-key="'+esc(k)+'" data-bid="'+b.id+'"'+(+p.rows>0?' rows="'+(+p.rows)+'"':'')+' placeholder="'+esc(ctx.edit?p.placeholder:FP.interp(p.placeholder, ctx.f, a))+'">'+val+'</textarea>'
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
      } else if(p.style === 'faces'){
        var fn = Math.max(2, Math.min(7, +p.max || 5)), fl = (p.faceLabels || []).filter(function(x){ return String(x).trim(); });
        h = label(p.label) + '<div class="fp-faces'+(p.faceBare?' bare':'')+(p.faceNoText?' notext':'')+'" style="--n:'+fn+'">';
        for(var fi = 0; fi < fn; fi++){ var fx = FP.faceIdx(fn, fi), ftxt = fl[fi] != null ? fl[fi] : FP.FACE_LABELS[fx]; h += '<button class="fp-fc'+(v===fi+1?' on':'')+(v!=null&&v!==fi+1?' dim':'')+'" data-act="rate" data-bid="'+b.id+'" data-v="'+(fi+1)+'" aria-label="'+esc(ftxt)+'"><span class="fc">'+FP.FACES[fx]+'</span>'+(p.faceNoText ? '' : '<span class="fl">'+esc(ftxt)+'</span>')+'</button>'; }
        h += '</div>';
        /* Ohne Text unter den Smileys: optional nur links und rechts beschriften */
        if(p.faceNoText && p.faceEnds) h += '<div class="fp-rlab"><span>'+esc(p.minLabel || fl[0] || FP.FACE_LABELS[0])+'</span><span>'+esc(p.maxLabel || fl[fn-1] || FP.FACE_LABELS[4])+'</span></div>';
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
      h = label(p.label) + '<div class="fp-sig'+(v?' has':'')+'" data-sig="'+b.id+'"><canvas data-key="'+esc(k)+'" data-bid="'+b.id+'"></canvas><div class="line"></div><div class="fp-sigh">'+esc(p.hint||'Hier mit dem Finger unterschreiben')+'</div><button class="clr" data-act="sigclr" data-bid="'+b.id+'">Löschen</button></div>';
      break;
    case 'checkbox':
      h = '<div class="fp-cb'+(v?' on':'')+'" role="checkbox" tabindex="0" aria-checked="'+(!!v)+'" data-act="cb" data-bid="'+b.id+'"><span class="box">'+IC.check+'</span><span'+(+p.size > 0 && isFinite(+p.size) ? ' style="font-size:'+(+p.size)+'px"' : '')+'>'+T(p.text)+rq+'</span></div>';
      break;
    case 'box':
      /* Box: umschließt die nächsten Elemente (sie bleiben normale Elemente der Seite) */
      h = '<div class="fp-boxin">' + (ctx.boxKids || (ctx.edit ? '<div class="fp-boxph">Leere Box – Elemente darunter einfügen oder bei „Enthält“ erhöhen</div>' : '')) + '</div>';
      break;
    case 'social':
      var sn = FP.SOCIAL_ORDER.filter(function(k){ return p[k]; }), ssz = Math.max(24, Math.min(72, +p.size || 40));
      var shref = function(k){ var v = String(p[k] || '').trim(); if(k === 'whatsapp') return FP.waUrl(v, p.waText); if(k === 'mail') return 'mailto:' + v.replace(/^mailto:/, ''); return /^https?:\/\//.test(v) ? v : 'https://' + v.replace(/^\/+/, ''); };
      h = '<div class="fp-soc'+(p.chip ? ' fp-socc' : '')+'" style="--ssz:'+ssz+'px">' + (sn.length ? sn.map(function(k){ var B2 = FP.BRANDS[k]; return '<a class="si" href="'+esc(shref(k))+'" target="_blank" rel="noopener" aria-label="'+esc(B2.n)+'">'+B2.svg+(p.labels ? '<span>'+esc(B2.n)+'</span>' : '')+'</a>'; }).join('') : (ctx.edit ? '<span class="fp-boxph">Links rechts eintragen</span>' : '')) + '</div>';
      break;
    case 'spacer':
      h = '<div style="height:'+(p.height||24)+'px"></div>';
      break;
    case 'divider':
      h = '<hr class="fp-hr">';
      break;
    case 'list':
      h = '<ul class="fp-list'+(p.icon !== 'check' && FP.ICONS[p.icon] ? ' sic' : '')+'">' + (p.items||[]).map(function(it, i){ return '<li><span class="fp-li">'+(p.icon==='number'?(i+1):p.icon==='emoji'?'':p.icon !== 'check' && FP.ICONS[p.icon] ? FP.ICONS[p.icon] : IC.check)+'</span><span>'+T(it)+'</span></li>'; }).join('') + '</ul>';
      if(p.icon==='emoji') h = h.replace(/<span class="fp-li"><\/span>/g,'');
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
        h = '<div class="fp-sum compact" data-sum="'+b.id+'"><div class="lab">'+esc(p.title||'Geschätzter Preis')+'</div><b data-tot="'+t.total+'" data-pre="'+(p.prefix && exact ? esc(p.prefix)+' ' : '')+'">'+tot+'</b>'+(p.note?'<div class="nt">'+T(p.note)+'</div>':'')+'</div>';
      } else if(p.variant === 'offer'){
        var d = new Date(), vd = +p.validDays || 14, until = new Date(d.getTime() + vd*864e5);
        h = '<div class="fp-sum offer" data-sum="'+b.id+'"><div class="oh"><div><h4>'+T(p.title||'Dein persönliches Angebot')+'</h4><div class="od">Erstellt am '+d.toLocaleDateString('de-DE')+' · gültig bis '+until.toLocaleDateString('de-DE')+'</div></div>'+IC.check.replace('<svg','<svg class="ok"')+'</div>';
        if(p.showItems !== false){ if(!t.items.length) h += '<div class="row"><span>Noch keine Auswahl</span><span>–</span></div>'; t.items.forEach(function(it){ h += row(it); }); }
        h += '<div class="tot"><span>'+esc(p.totalLabel||'Gesamtpreis')+'</span><b data-tot="'+t.total+'" data-pre="'+(p.prefix && exact ? esc(p.prefix)+' ' : '')+'">'+tot+'</b></div><div class="nt">'+(p.note?T(p.note):(exact?'Inkl. MwSt. · unverbindlich':'Unverbindliche Preisspanne – das genaue Angebot erhältst du nach kurzer Prüfung.'))+'</div></div>';
      } else {
        h = '<div class="fp-sum" data-sum="'+b.id+'"><h4>'+T(p.title||'Deine Zusammenfassung')+'</h4>';
        if(p.showItems !== false){ if(!t.items.length) h += '<div class="row"><span>Noch keine Auswahl</span><span>–</span></div>'; t.items.forEach(function(it){ h += row(it); }); }
        h += '<div class="tot"><span>'+esc(p.totalLabel||'Gesamt')+'</span><b data-tot="'+t.total+'" data-pre="'+(p.prefix && exact ? esc(p.prefix)+' ' : '')+'">'+tot+'</b></div>'+(p.note?'<div class="nt">'+T(p.note)+'</div>':'')+'</div>';
      }
      break;
    case 'trust':
      h = '<div class="fp-trust">' + (p.items||[]).map(function(it){ return '<span>'+esc(it)+'</span>'; }).join('') + '</div>';
      break;
    case 'calendar':
      if(p.calStyle !== 'strip'){ h = FP.calMonth(b, p, v, ctx, label); break; }
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
  var t0 = (ctx.f && ctx.f.theme) || {}, cl0 = '';
  if(b.type === 'heading' || b.type === 'text') cl0 += ' hl-' + (p.hl || t0.hlStyle || 'swoosh');
  if(b.type === 'box') cl0 += ' fp-box bx-' + esc(p.bxStyle || 'card');
  if(hv0(p.oIconC)) cl0 += ' oic-c';
  var st = 'text-align:'+(p.align||'left')+';margin-top:'+(+p.mt||0)+'px;margin-bottom:'+(p.mb!=null&&p.mb!==''?+p.mb+'px':'var(--bk,16px)')+';';
  if(p.hlColor && /^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([\d.,%\s]+\))$/i.test(p.hlColor)) st += '--hl-ink:'+p.hlColor+';';
  if(p.ff) st += '--ff:'+FP.fontStack(p.ff)+';--hf:'+FP.fontStack(p.ff)+';font-family:var(--ff);';
  if(p.fw) st += '--hw:'+p.fw+';--tw:'+p.fw+';--bw:'+p.fw+';font-weight:'+p.fw+';';
  if(p.scale && +p.scale !== 100) st += '--sc:'+((+t0.scale||100)/100*(+p.scale/100))+';';
  if(p.ls !== undefined && p.ls !== '' && p.ls !== null) st += '--hls:'+(p.ls/100)+'em;--bls:'+(p.ls/100)+'em;letter-spacing:'+(p.ls/100)+'em;';
  if(p.lh) st += '--lh:'+p.lh+';line-height:'+p.lh+';';
  if(p.tt) st += '--htt:'+p.tt+';--btt:'+p.tt+';text-transform:'+p.tt+';';
  if(p.it) st += 'font-style:italic;';
  /* Innere Gestaltung pro Element: überschreibt die Theme-Variablen nur für dieses Element */
  var hv = function(x){ return x != null && x !== ''; };
  if(hv(p.iAcc)) st += '--p:'+esc(p.iAcc)+';';
  if(hv(p.iAccText)) st += '--pt:'+esc(p.iAccText)+';';
  if(hv(p.iSurf)){ st += '--sf:'+esc(p.iSurf)+';--tile:'+esc(p.iSurf)+';--tile-on:color-mix(in srgb,var(--p) 16%,'+esc(p.iSurf)+');'; cl0 += ' ix-surf'; }
  if(hv(p.iMut)) st += '--mt:'+esc(p.iMut)+';';
  if(hv(p.iRad)){ st += '--r:'+(+p.iRad)+'px;'; cl0 += ' ix-rad'; }
  if(hv(p.iLine) || hv(p.iBw)){ st += (hv(p.iLine) ? '--iline:'+esc(p.iLine)+';' : '') + (hv(p.iBw) ? '--ibw:'+(+p.iBw)+'px;' : ''); cl0 += ' ix-line'; }
  if(p.iShd) cl0 += ' ix-sh-'+esc(p.iShd);
  if(p.iShd === 'custom') st += '--ishd:'+(+p.iShdX||0)+'px '+(hv(p.iShdY)?+p.iShdY:6)+'px '+(hv(p.iShdB)?+p.iShdB:18)+'px '+(+p.iShdS||0)+'px '+esc(p.iShdC||'rgba(0,0,0,.18)')+';';
  if(p.inStyle) cl0 += ' ins-'+esc(p.inStyle);
  if(hv(p.iGap)){ st += '--igap:'+(+p.iGap)+'px;'; cl0 += ' ix-gap'; }
  if(hv(p.inBg)){ st += '--inbg:'+esc(p.inBg)+';'; cl0 += ' ix-inbg'; }
  if(hv(p.starColor)) st += '--star:'+esc(p.starColor)+';';
  if(hv(p.oIconC)) st += '--oic:'+esc(p.oIconC)+';';
  if(hv(p.liColor)) st += '--lic:'+esc(p.liColor)+';';
  if(p.oCheck === false) cl0 += ' nochk';
  if(p.oIcon) cl0 += ' oic-'+esc(p.oIcon);
  if(p.liStyle) cl0 += ' li-'+esc(p.liStyle);
  if(p.color && b.type !== 'heading' && b.type !== 'text'){ st += '--tx:'+p.color+';--mt:'+p.color+';color:'+p.color+';--uc:'+p.color+';'; cl0 += ' uc'; } /* --uc: auch Elemente, die ihre Schriftfarbe sonst aus der Markenfarbe nehmen (Badge, Button) */
  var boxed = p.bgc || +p.bwid || p.shd;
  if(p.bgc) st += 'background:'+p.bgc+';';
  if(+p.pad) st += 'padding:'+p.pad+'px;';
  st += FP.padSides(p, ['padT','padR','padB','padL']);
  if(boxed || (p.brad !== undefined && p.brad !== '')) st += 'border-radius:'+(p.brad !== undefined && p.brad !== '' ? p.brad+'px' : 'var(--r)')+';';
  if(+p.bwid) st += 'border:'+p.bwid+'px solid '+(p.bc||'color-mix(in srgb,var(--tx) 14%,transparent)')+';';
  if(p.shd) st += 'box-shadow:'+({sm:'0 1px 3px rgba(0,0,0,.08)',md:'0 8px 24px -8px rgba(0,0,0,.18)',lg:'0 20px 50px -14px rgba(0,0,0,.3)'}[p.shd]||'none')+';';
  if(ctx.chat){ if(FP.CHAT_BOT[b.type]){ cl0 += ' bot'; st += '--d:'+(ctx.chat.i++)+';'; } else cl0 += ' ans'; }
  var cl = 'fp-b'+cl0+(p.bleed && (b.type==='image'||b.type==='compare'||b.type==='video') ? ' bleed' : '')+(err?' fp-err':'')+(b.type==='summary'&&p.sticky&&!ctx.edit?' fp-stk':'')+(p.half?' half':'')+(p.vis&&p.vis!=='all'?' fp-vis-'+p.vis:'');
  if(p.anim && p.anim !== 'none' && !ctx.edit && !ctx.noAnim){ cl += ' fp-ea-'+p.anim; if(+p.delay) st += 'animation-delay:'+p.delay+'ms;'; }
  return '<div class="'+cl+'" data-bid="'+b.id+'" data-type="'+b.type+'" style="'+st+'"'+(ctx.edit && b.type !== 'arrow' ?' draggable="true"':'')+'>'+h+(err?'<div class="fp-errmsg">'+esc(err)+'</div>':'')+'</div>';
};

/* Innenabstand pro Seite: nur gesetzte Werte überschreiben den Standard (leer = Theme bzw. „alle Seiten“) */
FP.padSides = function(p, keys){ var out = '', side = ['top','right','bottom','left']; keys.forEach(function(k, i){ var v = p[k]; if(v !== undefined && v !== null && v !== '' && isFinite(+v)) out += 'padding-'+side[i]+':'+Math.max(0, +v)+'px;'; }); return out; };

/* Chat-Modus: diese Elemente erscheinen als Nachricht des Betriebs, alles andere als Antwortbereich */
FP.CHAT_BOT = {heading:1, text:1, badge:1, image:1, video:1, list:1};
FP.chatIni = function(n){ return String(n || 'Team').trim().split(/\s+/).map(function(w){ return w[0]; }).join('').slice(0, 2).toUpperCase(); };

FP.hasButton = function(page){ return (page.blocks||[]).some(function(b){ return b.type==='button' || b.type==='loader' || (b.type==='choice' && b.props.autoNext && !b.props.multi) || (b.type==='rating' && b.props.autoNext); }); };

FP.renderShell = function(f, idx, inner, opts){
  opts = opts || {};
  var t = f.theme || {}, n = f.pages.length, page = f.pages[idx] || {};
  var bgImg = page.bgImage || t.bgImage;
  var baseBg = page.bg || t.bg || '#fff';
  var style = FP.themeVars(t) + (t.progH ? '--prh:'+(+t.progH)+'px;' : '') + (t.progRadius != null && t.progRadius !== '' ? '--prr:'+(+t.progRadius)+'px;' : '') + (bgImg ? 'background-image:url(&quot;'+bgImg+'&quot;);' : (t.bgGrad ? 'background-image:linear-gradient('+(t.bgAngle||180)+'deg,'+baseBg+','+(t.bg2||baseBg)+');' : '')) + (page.bg ? 'background-color:'+page.bg+';--sbg:'+page.bg+';' : '');
  var showProg = t.progress !== 'none' && !page.hideProgress;
  var pct = n > 1 ? Math.round(idx/(n-1)*100) : 100;
  var prog = '';
  if(showProg){
    var pf = t.progFill && t.progFill !== 'solid' ? ' pf-'+t.progFill : '', pa = ' pa-'+(t.progAnim || 'smooth');
    if(t.progress === 'steps'){ prog = '<div class="fp-steps'+pf+pa+'">'; for(var i=0;i<n;i++) prog += '<i class="'+(i<=idx?'on':'')+(i===idx?' cur':'')+'"></i>'; prog += '</div>'; }
    else prog = '<div class="fp-prog'+pf+pa+'" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i data-pct="'+Math.max(pct,4)+'" style="width:'+Math.max(pct,4)+'%"></i></div>';
    /* Beschriftung: „Schritt 2 von 6“, „40 %“ oder „Noch 3 Schritte“ */
    var left = n - 1 - idx, pl = t.progLabel === 'steps' ? 'Schritt '+(idx+1)+' von '+n : t.progLabel === 'percent' ? pct+' %' : t.progLabel === 'left' ? (left <= 0 ? 'Geschafft' : left === 1 ? 'Noch 1 Schritt' : 'Noch '+left+' Schritte') : '';
    if(pl) prog = '<div class="fp-progw"><span class="fp-progl">'+pl+'</span>'+prog+'</div>';
  }
  var logoIn = t.logoImg ? '<img src="'+t.logoImg+'" alt="'+esc(t.logoText||'Logo')+'"'+(+t.logoH?' style="max-height:'+(+t.logoH)+'px;max-width:'+(+t.logoH*5)+'px"':'')+'>' : t.logoText ? esc(t.logoText) : '';
  /* Klick aufs Logo: zur ersten Seite des Funnels oder zu einer Adresse (z. B. Website des Betriebs) */
  var logo = !logoIn ? '' : opts.edit || !t.logoLink ? '<div class="fp-logo">'+logoIn+'</div>'
    : t.logoLink === 'url' && t.logoUrl ? '<a class="fp-logo fp-logo-l" href="'+esc(t.logoUrl)+'"'+(t.logoNewTab?' target="_blank" rel="noopener"':'')+'>'+logoIn+'</a>'
    : t.logoLink === 'start' ? '<button type="button" class="fp-logo fp-logo-l" data-act="logo" aria-label="Zur Startseite">'+logoIn+'</button>' : '<div class="fp-logo">'+logoIn+'</div>';
  if(t.chat){
    var cav = t.chatAvatar ? 'background-image:url(&quot;'+esc(t.chatAvatar)+'&quot;)' : '';
    logo = '<div class="fp-chathd"><span class="av" style="'+cav+'">'+(t.chatAvatar ? '' : esc(FP.chatIni(t.chatName)))+'</span><span class="nm"><b>'+esc(t.chatName || t.logoText || 'Dein Team')+'</b><small>'+esc(t.chatRole || 'Antwortet in der Regel sofort')+'</small></span></div>';
    style += t.chatAvatar ? '--cav:url(&quot;'+esc(t.chatAvatar)+'&quot;);--cini:&quot;&quot;;' : '--cini:&quot;'+esc(FP.chatIni(t.chatName))+'&quot;;';
  }
  if(page.hideLogo && !t.chat) logo = ''; /* Logo nur auf dieser Seite ausblenden */
  var head = (logo || opts.back) ? '<div class="fp-head'+(t.chat?' left':'')+(t.logoAlign==='left'?' left':'')+(opts.back?' hb':'')+'">'+(opts.back?'<button class="fp-back" data-act="back" aria-label="Zurück">'+IC.back+'</button>':'')+logo+'</div>' : '';
  var ov = bgImg ? '<div class="fp-ov" style="background:'+(t.overlay||'rgba(0,0,0,.35)')+'"></div>' : '';
  var top = (head || prog) ? '<div class="fp-top">'+(t.progressTop?prog+head:head+prog)+'</div>' : '<div style="height:var(--tpt,10px)"></div>';
  var foot = FP.footer(f, opts.edit);
  var cls = 'fp'+(opts.edit?' is-edit':'')+(page.wide?' wide':'')+(t.inputStyle&&t.inputStyle!=='outline'?' in-'+t.inputStyle:'')+(t.optStyle&&t.optStyle!=='filled'?' opt-'+t.optStyle:'')+(t.progressTop?' prog-top':'');
  /* Eigenes CSS: im Live-Funnel global; in Vorschauen (mehrere Funnels auf einer Seite) auf diesen Funnel begrenzt */
  var fsid = opts.scope ? String(f.id || 'f').replace(/[^\w-]/g,'') : '';
  var raw = t.customCss ? String(t.customCss).replace(/<\/style/gi,'') : '';
  var css = raw ? '<style>'+(fsid ? '@scope ([data-fs="'+fsid+'"]) {\n'+raw+'\n}' : raw)+'</style>' : '';
  /* Schwebender Kontakt-Knopf (Anruf / WhatsApp) – nicht bei Einbettung in fremde Websites */
  if(t.fab && !opts.noFab && (t.fabPhone || t.fabWa)){
    var tel = String(t.fabPhone || '').replace(/[^\d+]/g, ''), wa = String(t.fabWa || '').replace(/\D/g, '').replace(/^0+/, '49');
    var waUrl = wa ? 'https://wa.me/' + wa + (t.fabText ? '?text=' + encodeURIComponent(t.fabText) : '') : '';
    var fabFace = t.fabImg ? '<span class="fp-ph" style="background-image:url(&quot;'+esc(t.fabImg)+'&quot;)"></span>' : (tel && !wa ? FP.ICONS.phone : wa && !tel ? FP.WA : FP.ICONS.chat);
    var one = !(tel && wa), lnk = tel ? 'tel:' + tel : waUrl;
    opts.fab = '<div class="fp-fabw'+(t.stickyCta ? ' up' : '')+(t.fabSide === 'left' ? ' left' : '')+' fs-'+(t.fabStyle || 'brand')+(t.fabSize === 'sm' ? ' sm' : '')+'"><div class="fp-fab" data-fab>'
      + (one ? '' : '<div class="fp-fabm"><a class="fp-fabo" href="tel:'+esc(tel)+'">'+FP.ICONS.phone+'<span>Anrufen</span></a><a class="fp-fabo" href="'+esc(waUrl)+'" target="_blank" rel="noopener">'+FP.WA+'<span>WhatsApp</span></a></div>')
      + (t.fabLabel ? '<span class="fp-fabl">'+esc(t.fabLabel)+'</span>' : '')
      + (one ? '<a class="fp-fabb" href="'+esc(lnk)+'"'+(tel ? '' : ' target="_blank" rel="noopener"')+' aria-label="'+(tel ? 'Anrufen' : 'WhatsApp')+'">'+fabFace+'</a>' : '<button type="button" class="fp-fabb" data-act="fab" aria-expanded="false" aria-label="Kontakt aufnehmen">'+fabFace+'</button>')
      + '</div></div>';
  }
  /* Desktop: geteilter Bildschirm – Bild fest auf einer Seite, Fragen auf der anderen (auf dem Handy unsichtbar) */
  var spImg = !t.chat && t.split ? (page.splitImg || t.splitImg || '') : '';
  if(spImg){
    var slq = FP.lqSrc(spImg);
    return '<div class="'+cls+' split'+(t.splitSide === 'right' ? ' sp-r' : '')+'"'+(fsid?' data-fs="'+fsid+'"':'')+' style="'+style+'">'+css+'<div class="fp-sp"><div class="fp-spm" style="background-image:url(&quot;'+esc(spImg)+'&quot;)'+(slq?',url(&quot;'+slq+'&quot;)':'')+'"></div><div class="fp-spc">'+ov+top+'<div class="fp-body">'+inner+'</div>'+foot+'</div></div>'+(opts.fab||'')+(opts.overlay||'')+'</div>';
  }
  return '<div class="'+cls+'"'+(fsid?' data-fs="'+fsid+'"':'')+' style="'+style+'">'+css+ov+top+'<div class="fp-body">'+inner+'</div>'+foot+(opts.fab||'')+(opts.overlay||'')+'</div>';
};

/* ---------- Konfetti: fällt von oben, nach erfolgreicher Anfrage auf der Danke-Seite ---------- */
FP.confetti = function(host, f, opt){
  opt = opt || {}; if(!host) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = (f && f.theme) || {}, cols = [t.primary || '#3A86FF', '#FFC700', '#FF4D6D', '#2EC4B6', '#3A86FF', '#8338EC', '#FB5607', t.primary || '#2EC4B6'];
  var cv = document.createElement('canvas'), ctx = cv.getContext('2d'); if(!ctx) return;
  cv.className = 'fp-conf' + (opt.contained ? ' in' : ''); cv.setAttribute('aria-hidden', 'true');
  host.appendChild(cv); if(opt.contained) cv.style.top = (host.scrollTop || 0) + 'px'; /* im Editor: sichtbarer Bereich des Handys */
  var dpr = Math.min(2, window.devicePixelRatio || 1), W, H;
  var size = function(){ var r = opt.contained ? host.getBoundingClientRect() : {width:innerWidth, height:innerHeight}; W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size();
  var n = reduce ? 36 : Math.round(Math.min(180, Math.max(90, W / 2.6))), ps = [];
  for(var i = 0; i < n; i++) ps.push({x:Math.random() * W, y:-20 - Math.random() * H * .45, w:6 + Math.random() * 6, h:8 + Math.random() * 10, c:cols[i % cols.length], vy:reduce ? 1 + Math.random() : 2 + Math.random() * 3, vx:(Math.random() - .5) * 1.4, r:Math.random() * 6.3, vr:(Math.random() - .5) * .25, sw:Math.random() * 6.3, k:Math.random() < .22 ? 'c' : 'r'});
  var start = performance.now(), dur = reduce ? 2200 : 4200, raf;
  var tick = function(now){
    var el = now - start, fade = el > dur - 700 ? Math.max(0, (dur - el) / 700) : 1;
    ctx.clearRect(0, 0, W, H);
    ps.forEach(function(p){
      p.vy = Math.min(p.vy + (reduce ? .01 : .045), reduce ? 2.2 : 5.2); p.y += p.vy; p.sw += .045; p.x += p.vx + Math.sin(p.sw) * (reduce ? .3 : .9); p.r += reduce ? 0 : p.vr;
      if(p.y > H + 20) return;
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      if(p.k === 'c'){ ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.283); ctx.fill(); }
      else { ctx.scale(1, Math.cos(p.sw * 2)); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); } /* Drehen um die eigene Achse wirkt räumlich */
      ctx.restore();
    });
    if(el < dur && cv.isConnected) raf = requestAnimationFrame(tick); else cv.remove();
  };
  raf = requestAnimationFrame(tick);
  return function(){ cancelAnimationFrame(raf); cv.remove(); };
};
FP.renderPage = function(f, idx, ctx){
  var page = f.pages[idx]; if(!page) return '';
  ctx = ctx || {}; ctx.f = f; ctx.answers = ctx.answers || {};
  var t = f.theme || {};
  var blocks = page.blocks || [], stickyId = null, last = blocks[blocks.length-1];
  if(t.stickyCta && last && last.type === 'button') stickyId = last.id;
  var chat = !!t.chat, nBot = chat ? blocks.filter(function(b){ return FP.CHAT_BOT[b.type]; }).length : 0;
  if(chat) ctx.chat = {i:0};
  var one = function(b, c){ var r = FP.renderBlock(b, c || ctx); return b.id === stickyId ? '<div class="fp-sticky">'+r+'</div>' : r; };
  /* Box-Elemente umschließen die nächsten n Elemente (auch verschachtelt) */
  var list = function(arr){ var out = '', i = 0; while(i < arr.length){ var b = arr[i]; if(b.type === 'box' && !chat){ var n = Math.max(0, Math.min(+b.props.count || 0, arr.length - i - 1)); out += one(b, Object.assign({}, ctx, {boxKids:list(arr.slice(i + 1, i + 1 + n))})); i += n + 1; } else { out += one(b); i++; } } return out; };
  var inner = list(blocks);
  /* Chat-Modus: bisherige Antworten als Verlauf, beim ersten Öffnen einer Seite kurz „schreibt …“ */
  var chatIn = chat && nBot > 0 && !ctx.edit && !ctx.noAnim;
  if(chat && !ctx.edit && (ctx.chatHist||[]).length) inner = '<div class="fp-chist">' + ctx.chatHist.map(function(x){ return (x.q ? '<div class="q">'+esc(x.q)+'</div>' : '') + '<div class="a">'+esc(x.a)+'</div>'; }).join('') + '</div>' + (chatIn ? '<div class="fp-typing" aria-hidden="true"><i></i><i></i><i></i></div>' : '') + inner;
  else if(chatIn) inner = '<div class="fp-typing" aria-hidden="true"><i></i><i></i><i></i></div>' + inner;
  if(!FP.hasButton(page) && idx < f.pages.length - 1 && page.autoButton !== false){
    var av = t.btnVariant && t.btnVariant !== 'filled' ? t.btnVariant : '';
    var ab = '<div class="fp-b fp-auto" style="margin-top:6px"><button class="fp-btn shadow hic '+av+'" data-act="next"><span>'+esc(page.buttonLabel||t.nextLabel||'Weiter')+'</span>'+FP.BTN_ICONS.arrow+'</button></div>';
    inner += t.stickyCta ? '<div class="fp-sticky">'+ab+'</div>' : ab;
  }
  if(ctx.edit && !(page.blocks||[]).length) inner = '<div class="fp-empty-drop">Elemente hierher ziehen</div>' + inner;
  /* „Weitermachen“: Banner wie eine iOS-Mitteilung, fährt von oben ein, nach oben wegwischbar */
  var resume = '';
  if(ctx.resume){
    var rt = f.theme || {}, rIcon = rt.logoImg ? '<span class="ri" style="background-image:url(&quot;'+esc(rt.logoImg)+'&quot;)"></span>' : '<span class="ri ri-t">'+esc(String(rt.logoText || f.name || 'T').trim().charAt(0).toUpperCase() || 'T')+'</span>';
    resume = '<div class="fp-resume" role="dialog" aria-live="polite" aria-label="Weitermachen" data-rsw><div class="rc">'+rIcon+'<div class="rt"><b>Willkommen zurück</b><span>Mach dort weiter, wo du aufgehört hast.</span></div></div><div class="ra"><button type="button" class="fp-rsx" data-act="fresh">Neu starten</button><button type="button" class="fp-rsb" data-act="resume">Weitermachen</button></div><i class="rg" aria-hidden="true"></i></div>';
  }
  var anim = ctx.edit || ctx.noAnim || chatIn ? '' : (t.animation === 'none' ? '' : ' fp-anim-' + (t.animation||'slide') + (ctx.dir==='back'?' back':''));
  var body = '<div class="fp-page'+(page.vcenter?' v-center':'')+anim+(chat?' chat':'')+(chatIn?' chat-in':'')+'" data-page="'+page.id+'"'+(chat?' style="--dn:'+nBot+'"':'')+'>'+inner+'</div>';
  return FP.renderShell(f, idx, body, {edit:ctx.edit, back:ctx.back && !FP.loaderOf(page), scope:ctx.scope, noFab:ctx.noFab, overlay:resume});
};

/* ---------- interactive runtime ---------- */
/* ================= Cookie-Banner (DSGVO) =================
   Einstellungen in f.settings (flach): ccOn, ccTitle, ccText, ccAccept, ccDecline, ccEdit, ccSave, ccPrivacy,
   ccBtnBg, ccBtnText, ccBg, ccInk, ccFun/ccPerf/ccMkt (Kategorie anzeigen, Standard an).
   Entscheidung je Funnel im localStorage: {ess:true, fun, perf, mkt, ts}. Marketing (z. B. Meta-Pixel) und
   Performance (Analyse-Skripte) laufen erst nach Einwilligung. */
FP.CC_CATS = [
  {k:'ess', l:'Essentielle', d:'Nötig, damit der Funnel funktioniert, z. B. das Speichern deiner Auswahl. Immer aktiv.'},
  {k:'fun', l:'Funktionale', s:'ccFun', d:'Komfort-Funktionen wie eingebettete Inhalte und Schriften externer Anbieter.'},
  {k:'perf', l:'Performance', s:'ccPerf', d:'Anonyme Auswertung, wie der Funnel genutzt wird, um ihn zu verbessern.'},
  {k:'mkt', l:'Marketing', s:'ccMkt', d:'Messung von Werbekampagnen, z. B. Meta-Pixel oder Google Ads.'}
];
/* Fußzeile: Impressum · Datenschutz · Cookies verwalten, darunter das TapTell-Abzeichen (ausblendbar).
   Im Editor nur Text, damit ein Klick nichts öffnet. */
FP.TT_MARK = '<img class="fp-ttl" alt="" width="26" height="26" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAYKADAAQAAAABAAAAYAAAAAD/wAARCABgAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBAMDAwQFBAQEBAUGBQUFBQUGCAYGBgYGBggICAgICAgICQkJCQkJCwsLCwsMDAwMDAwMDAwM/9sAQwECAgIDAwMFAwMFDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/90ABAAG/9oADAMBAAIRAxEAPwD9/KQ0ucVSu7pbaPc3U9BTSbdkKUlFXZZyOtM8yP8AvD8xXKzag0hJLfhWe94x6GuqOEkzzqmYQi9DufOiHV1/MVTm1SzhOC5dvRBn9elcQ87darNK7dTW8MBfdnHVzeyskddLrbniGML7uc/oP8aovqV05+a4K+y4ArlpJWH1NUpZm9a64YGPQ4p5vPqdtHqlzGf9dv8AZ8HP49a3bLUIrwED5ZFGSuf1HqK8daV89asWOp3NpOskbkFTxnkVVXK7xbW4YfPOWaUloezGisvTdTj1GHfja6/eX+o9q0icV4s04vle59ZTqRnFTi9Gf//Q/ey+uxaQ7+rscKPU/wCArjrm4lkbMjFj1JrR1mYm62HoiDH1br/SsN2G7mvTw1JJJ9zwcwxDcnHohpJPWm9KaWphavQS6I8d1dAY1AxI6VPHFNcOIrdGkc9l7fU9vxrp7Dw3GuJNRbef+ean5R9T3/lUVK8KS956l0MJVxD9xad+hytrp97qT7bWPIHBc8IPx/oKra5p39k3MVu0nmtJHvJxjByRjvXryLHEojjAVV4AAwBXl3jgn+2Lb0Nsf/QzWWExc6tdR6HXmGW06GFlPeWmpyMhwKpmQgjmpJnHQVTc96+ijG58pKVjutAvDFcRHPDHa30NelKc14npE+JkXP8AEP517LA2RXzOa0eWdz7XIq/PSauf/9H9xdbBW6z2dB+hx/hWDI/NdNry5iWQfwHB+h4/wrjJZtrED1r3cIuaCPlsz92b8ycvgZNbunaJJdIlxdP5cTgMqryzA9PpmuTeQspGcfjVnTX8X6XF9qtEF5ZdRbSN85U94u4+n6VriFJR9xpHLgnCVT95FteX6nqNtBBaR+VbIEXvjv7k96sb65LR/FWmawTFExgul+/bTDbKpHXAPX8K3zLXizpyT95an1FOtFxXI9C9vqpd2tpfxGC8jWVD2I5HuD1B+lRebXN654v0rQ/3MzNPdtwlrAN8rE9OB93Pqf1p06UnJKC1FVrQUX7R6eZz2u+EpLOOS909/MgjBZ434dVHJIPRgPzrz+RwQMV0muP451e0N7dxCy0/G5rWJv3oXrmbufcdB3FccWwOtfX5Zzyp/vJJvy/U+DzaNJVv3UHFPv8AoammzYvIvd1/nXudsxI4r58tZGFzGc/xDHtzXu+nTebbpKP4lBrzs9hZxke1wzPScT//0v3a1SLzYHj7spx9e1eXTSEOQeua9YvRxXjl9IUuJMf32/nXu5Wua6Pl8991RkOeQlSOlW9O1fxNpcPnSWzX2nJ0AwJVUd07sB7j8RWG0xKkU6z8YXelFbbU4jNbL8qyR/fQDpkdGA/A/WvTxGHcoWjG/wDXQ8bB14xneUnH+up2En/CM+M4RPE3+kx9HQ+XcREeo68fiPQ1TGp+JPDZ2agjavYjpPEMXEY/21/i+v61TuNP0TxCo1TTJ/Iuhytxbna4Po68c+ucGq6+ItY0HEXiOE3FuOBfW4z9PMQdD+X4156pX9xa+T3+X9fI9d1UnzS0f8y2fqv69TQfU/E/iY+XpkbaPYHrcyjM8g77F7fX9alRfCvgeI3MzZupMkyOfMuZieu0defbA9TWM/iPWdfYw+GoDBbHhr+5GAP+uaHqfz+gqW30zQfDanVtXuDPdZybq5O5i3pGvPPpjJqvY2XJLRfyrd+v9fISqpvnjq/5nsvRf16lLWdd8W6vameCzfT9LcEMDgzOp7v3VT7DHua5QvhQK0tV8dXmqb7TSoTDbOCryyj946nggDooP4n6Vz5fjnrXv5fQlCnZwUf66ng4+calW8ZuXr+hctpCbqL/AHx/Ovc9Al3W7Rd42/Ruf55rwO1bN1F/vr/OvatCk2XeztIhH4ryP0zXBnkLxR62Qy5Zux//0/3jvOma8U1T5ZpP99s/nXtl393NeP8AiCExXcq44J3D6GvdyeSU2mfOcQQbpJrocwZcVBIUkGGGajd8E1CW9a+qUD4e7NjwpHHb6pdmMY3Qr+jV3UtwkcbPMyrGBlixwoHuTxivKrfV5NHuZbiODz/Mj2Bd23BByCeDxWPeXGqa3Jv1OX92DlYU+WNfw7n3OTXBXwM6tZvZaHsYbHRpUFHdnY6n46RSbXQoxOw485gREv8Aujq36D61xjw3N/N9r1OZriU93PC+yjoB7Cpo4o4RtVaczE16WHwVOl8KOStiKlX43p2F+WMYQYphamFqb9a7GrGG+xctDm6ix/fX+dezaMC9/Ft/gVmP5Y/rXkGkQma/iGMqh3H8K910SzNujSyjEkmOP7oHQf1NfN57USsvI+jyGi5Nvpc//9T96blcrXB6/pwvIzt4kX7p9fY16HIARzWBeQZya7MNVcJKSOPF0FUg4y2Z4BewS28rLKpUrWe0gyc816tq+jC5HmJgOPXoR6GuLn0zyT++iC/UcfnX2GGzCE4q+58JissnSm7bHLswbk1GXA4rpRYxOcBQx9AM1YTRi/SFVHq3H6V1fXacdzKGDn0OOLA98U3cDwDXdroMP8ag/wC6MCrA0a0AwIl/EVLzamtkbLLKr3Z58kLPV63055mCRgsx9K7tNItxjEK/lmtu0sFjxtUD2GBXJWzdJe6jtoZTd2kyr4d0WLT0DsA0zclvT2Feg2wxisy1g24zW3Eu0V8tiq8qsnKTPrcHh40oKMUf/9k=">';
FP.footLinks = function(f, edit){
  var t = f.theme || {}, s = f.settings || {}, out = [];
  var a = function(href, label){ return edit ? '<span class="fp-fl">'+label+'</span>' : '<a class="fp-fl" href="'+esc(href)+'" target="_blank" rel="noopener">'+label+'</a>'; };
  if(/^(https?:|mailto:)/.test(t.footImp || '')) out.push(a(t.footImp, 'Impressum'));
  var priv = t.footPriv || s.ccPrivacy; if(/^(https?:|mailto:)/.test(priv || '')) out.push(a(priv, 'Datenschutz'));
  if(FP.consentOn(f) && t.footCc !== false) out.push(edit ? '<span class="fp-fl">Cookies verwalten</span>' : '<button type="button" class="fp-fl fp-ccre" data-act="consent">Cookies verwalten</button>');
  return out;
};
FP.footer = function(f, edit){
  var t = f.theme || {}, links = FP.footLinks(f, edit);
  var badge = t.footBadge ? (edit ? '<span class="fp-tt">' : '<a class="fp-tt" href="https://taptell.de/?ref=funnel" target="_blank" rel="noopener">') + FP.TT_MARK + '<span>Erstellt mit <b class="wm"><b>TAP</b>TELL</b></span>' + (edit ? '</span>' : '</a>') : '';
  if(!t.footer && !links.length && !badge) return '';
  return '<div class="fp-foot">' + (t.footer ? '<div class="fp-ft">'+md(t.footer)+'</div>' : '') + (links.length ? '<nav class="fp-fls" aria-label="Rechtliches">'+links.join('<span class="fp-fsep" aria-hidden="true">·</span>')+'</nav>' : '') + badge + '</div>';
};
FP.consentOn = function(f){ return !!(f && f.settings && f.settings.ccOn); };
FP.getConsent = function(f){ try{ return JSON.parse(localStorage.getItem('tt-consent-' + (f.id || 'f'))); }catch(e){ return null; } };
FP.allowed = function(f, cat){ if(!FP.consentOn(f)) return true; var c = FP.getConsent(f); return !!(c && c[cat]); };
FP.showConsent = function(f, opts, done){
  opts = opts || {};
  var s = f.settings || {}, t = f.theme || {}, prev = FP.getConsent(f) || {};
  var cats = FP.CC_CATS.filter(function(c){ return !c.s || s[c.s] !== false; });
  var val = {ess:true}; cats.forEach(function(c){ if(c.k !== 'ess') val[c.k] = !!prev[c.k]; });
  var old = document.querySelector('.fp-cc[data-fid="' + (f.id || 'f') + '"]'); if(old) old.remove();
  var host = document.createElement('div');
  host.className = 'fp-cc' + (opts.container ? ' inl' : ''); host.setAttribute('data-fid', f.id || 'f');
  host.style.cssText = '--cc-bg:' + (s.ccBg || '#ffffff') + ';--cc-ink:' + (s.ccInk || '#1d1d1f') + ';--cc-btn:' + (s.ccBtnBg || t.primary || '#111') + ';--cc-btnt:' + (s.ccBtnText || t.primaryText || '#fff') + ';--cc-r:' + (t.btnRadius != null ? t.btnRadius : 10) + 'px;--cc-ff:' + FP.fontStack(t.font || 'Inter');
  var edit = false;
  var paint = function(){
    host.innerHTML = '<div class="cc-bd"></div><div class="cc-card" role="dialog" aria-modal="true" aria-labelledby="cc-t-' + (f.id||'f') + '">'
      + '<div class="cc-in"><h3 id="cc-t-' + (f.id||'f') + '">' + esc(s.ccTitle || 'Wir verwenden Cookies') + '</h3>'
      + '<p class="cc-tx">' + md(s.ccText || 'Wir setzen Cookies ein, wie in unserer Datenschutzerklärung beschrieben. Einige sind technisch erforderlich, andere helfen uns, den Funnel zu verbessern oder Werbung zu messen. Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.') + '</p></div>'
      + '<div class="cc-cats' + (edit ? ' ed' : '') + '">' + cats.map(function(c){ var on = c.k === 'ess' || val[c.k]; return '<div class="cc-cat"><button type="button" class="cc-sw' + (on ? ' on' : '') + '" role="switch" aria-checked="' + on + '" data-cc-cat="' + c.k + '"' + (c.k === 'ess' ? ' disabled' : '') + '><i></i></button><span><b>' + c.l + '</b>' + (edit ? '<small>' + c.d + '</small>' : '') + '</span></div>'; }).join('') + '</div>'
      + '<div class="cc-acts"><button type="button" class="cc-b pri" data-cc="all">' + esc(s.ccAccept || 'Alle akzeptieren') + '</button><button type="button" class="cc-b" data-cc="none">' + esc(s.ccDecline || 'Ablehnen') + '</button>'
      + (edit ? '<button type="button" class="cc-b" data-cc="save">' + esc(s.ccSave || 'Auswahl speichern') + '</button>' : '<button type="button" class="cc-b" data-cc="edit">' + esc(s.ccEdit || 'Bearbeiten') + '</button>') + '</div>'
      + (function(){ var imp = t.footImp, priv = s.ccPrivacy || t.footPriv, l = []; if(/^(https?:|mailto:)/.test(imp || '')) l.push('<a class="cc-link" href="' + esc(imp) + '" target="_blank" rel="noopener">Impressum</a>'); if(/^(https?:|mailto:)/.test(priv || '')) l.push('<a class="cc-link" href="' + esc(priv) + '" target="_blank" rel="noopener">Datenschutzerklärung</a>'); return l.length ? '<div class="cc-links">' + l.join('') + '</div>' : ''; })() + '</div>';
  };
  var finish = function(v){
    v.ts = Date.now();
    if(!opts.preview){ try{ localStorage.setItem('tt-consent-' + (f.id || 'f'), JSON.stringify(v)); }catch(e){} }
    host.classList.add('out'); setTimeout(function(){ host.remove(); }, 220);
    if(done) done(v);
  };
  host.addEventListener('click', function(e){
    var sw = e.target.closest('[data-cc-cat]'); if(sw && !sw.disabled){ var k = sw.getAttribute('data-cc-cat'); val[k] = !val[k]; sw.classList.toggle('on', val[k]); sw.setAttribute('aria-checked', val[k]); return; }
    var b = e.target.closest('[data-cc]'); if(!b) return;
    var a = b.getAttribute('data-cc');
    if(a === 'edit'){ edit = true; paint(); return; }
    if(a === 'all'){ var v = {ess:true}; cats.forEach(function(c){ v[c.k] = true; }); return finish(v); }
    if(a === 'none'){ var n = {ess:true}; cats.forEach(function(c){ if(c.k !== 'ess') n[c.k] = false; }); return finish(n); }
    if(a === 'save') return finish(val);
  });
  paint();
  (opts.container || document.body).appendChild(host);
  var first = host.querySelector('.cc-b.pri'); if(first && !opts.noFocus) try{ first.focus({preventScroll:true}); }catch(e){}
  return host;
};

FP.mount = function(root, f, opts){
  opts = opts || {};
  var st = {i:0, hist:[], answers:{}, errors:{}, dir:'fwd', started:false, done:false, startedAt:Date.now()};
  /* Ausgeblendete Seiten (Auge in der Seitenleiste) gibt es im laufenden Funnel nicht.
     Sprünge auf eine ausgeblendete Seite landen auf der nächsten sichtbaren danach. */
  var HIDDEN = {};
  if(f.pages.some(function(p){ return p.hidden; }) && f.pages.some(function(p){ return !p.hidden; })){
    f.pages.forEach(function(p, i){ if(!p.hidden) return; var n = null; for(var j = i + 1; j < f.pages.length; j++) if(!f.pages[j].hidden){ n = f.pages[j].id; break; } HIDDEN[p.id] = n; });
    f = Object.assign({}, f, {pages:f.pages.filter(function(p){ return !p.hidden; })});
  }
  var pages = f.pages;
  var hasSubmit = FP.allBlocks(f).some(function(b){ return b.type==='button' && b.props.action==='submit'; });
  var emit = function(t, d){ if(opts.onEvent) try{ opts.onEvent(t, d||{}); }catch(e){} };
  var timer = null;
  emit('view'); emit('page', {pageId:pages[0] && pages[0].id, index:0});

  function blockById(id){ var r=null; pages.forEach(function(p){ p.blocks.forEach(function(b){ if(b.id===id) r=b; }); }); return r; }
  function scroller(){ return opts.scrollEl || root.closest && root.closest('[data-fp-scroll]') || document.scrollingElement; }

  /* stay = gleiche Seite neu zeichnen (ohne Einblend-Animation, Scrollposition bleibt) */
  var ldStop = null, ldTimer = null, aiStop = null;
  function render(stay, quiet){
    var page = pages[st.i];
    /* Zurück auf eine Ladeseite: überspringen, sonst ginge es sofort wieder vorwärts */
    if(FP.loaderOf(page) && st.dir === 'back' && st.hist.length){
      if(opts.history && history.state && history.state.fpD === st.hist.length){ history.back(); return; }
      st.i = st.hist.pop(); return render(stay, quiet);
    }
    page.blocks.forEach(function(b){ if(b.type === 'slider' && st.answers[keyOf(b)] == null) st.answers[keyOf(b)] = +(b.props.def != null ? b.props.def : b.props.min); });
    var sc = stay ? scroller() : null, top = sc ? sc.scrollTop : 0;
    root.innerHTML = FP.renderPage(f, st.i, {noFab:!!opts.inline, resume:!!(st.resume && st.i === 0 && !st.started), chatHist:chatHist(), answers:st.answers, errors:st.errors, dir:st.dir, live:opts.live, noAnim:!!stay || !!opts.still || !!quiet, scope:!!opts.scope, back: st.hist.length>0 && !st.done && page.allowBack!==false && (f.theme||{}).backButton!==false, startedAt:st.startedAt});
    if(sc) sc.scrollTop = top;
    initSignatures(); initCountdown();
    /* Fortschritt läuft weich vom alten zum neuen Stand */
    var pi = root.querySelector('.fp-prog i');
    if(pi){ var to = +pi.getAttribute('data-pct'); if(st.lastPct != null && st.lastPct !== to && !opts.still && !stay){ pi.style.transition = 'none'; pi.style.width = st.lastPct + '%'; void pi.offsetWidth; pi.style.transition = ''; requestAnimationFrame(function(){ pi.style.width = to + '%'; }); } st.lastPct = to; }
    if(aiStop){ aiStop(); aiStop = null; }
    if(root.querySelector('[data-lot],[data-ail]')) aiStop = FP.playAnims(root, f);
    if(ldStop){ ldStop(); ldStop = null; } clearTimeout(ldTimer);
    if(root.querySelector('[data-ld]')){
      ldStop = FP.playLoaders(root, f);
      var ldb = FP.loaderOf(page);
      if(ldb && !stay && (opts.live || opts.scrollEl)) ldTimer = setTimeout(function(){ if(root.isConnected && pages[st.i] === page) go(null, true); }, Math.max(1, Math.min(20, +ldb.props.duration || 3)) * 1000);
    }
    if(!stay && !opts.still) root.querySelectorAll('[data-tot]').forEach(function(el){ countTo(el, st.lastTot != null ? st.lastTot : 0); });
    var lt = root.querySelector('[data-tot]'); if(lt) st.lastTot = +lt.getAttribute('data-tot');
    /* Konfetti nur nach erfolgreich gesendeter Anfrage, einmal pro Seite */
    if(!stay && page.confetti && st.done && !opts.still && !(st.confDone || {})[page.id]){ st.confDone = st.confDone || {}; st.confDone[page.id] = 1; setTimeout(function(){ if(root.isConnected) FP.confetti(root.querySelector('.fp') || root, f); }, 250); }
  }
  /* Auswahl direkt im DOM markieren – kein Neuaufbau, kein Flackern */
  function clearErr(b){ var w = root.querySelector('.fp-b[data-bid="'+b.id+'"]'); if(w && w.classList.contains('fp-err')){ w.classList.remove('fp-err'); var m = w.querySelector('.fp-errmsg'); if(m) m.remove(); } }
  function markSelection(b){
    var v = st.answers[keyOf(b)], sel = [].concat(v == null ? [] : v);
    if(b.type === 'choice'){
      root.querySelectorAll('[data-act="opt"][data-bid="'+b.id+'"]').forEach(function(el){ el.classList.toggle('sel', sel.indexOf(el.getAttribute('data-oid')) >= 0); });
      var cn = root.querySelector('[data-cnt="'+b.id+'"]'); if(cn){ cn.textContent = sel.length ? sel.length + ' gewählt' : ''; cn.classList.toggle('on', !!sel.length); cn.classList.remove('pop'); void cn.offsetWidth; if(sel.length) cn.classList.add('pop'); }
    } else if(b.type === 'rating'){
      root.querySelectorAll('[data-act="rate"][data-bid="'+b.id+'"]').forEach(function(el){
        var n = +el.getAttribute('data-v');
        if(el.classList.contains('fp-star')) el.classList.toggle('on', v >= n);
        else { el.classList.toggle('on', v === n); if(b.props.style === 'emoji' || b.props.style === 'faces') el.classList.toggle('dim', v != null && v !== n); }
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
    var M = (f.settings||{}).address === 'sie'
      ? {email:'Bitte geben Sie eine gültige E-Mail-Adresse ein.', tel:'Bitte geben Sie eine gültige Telefonnummer ein.', choice:'Bitte wählen Sie eine Option.', checkbox:'Bitte bestätigen Sie dies, um fortzufahren.', signature:'Bitte unterschreiben Sie hier.', calendar:'Bitte wählen Sie Tag und Uhrzeit.'}
      : {email:'Bitte gib eine gültige E-Mail-Adresse ein.', tel:'Bitte gib eine gültige Telefonnummer ein.', choice:'Bitte wähle eine Option.', checkbox:'Bitte bestätige dies, um fortzufahren.', signature:'Bitte unterschreibe hier.', calendar:'Bitte wähle Tag und Uhrzeit.'};
    page.blocks.forEach(function(b){
      var p = b.props||{}, v = st.answers[keyOf(b)];
      if(b.type === 'input' && v && p.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){ errs[b.id] = M.email; ok = false; return; }
      if(b.type === 'input' && v && p.inputType === 'tel' && String(v).replace(/\D/g,'').length < 6){ errs[b.id] = M.tel; ok = false; return; }
      if(!p.required) return;
      var empty = v == null || v === '' || v === false || (Array.isArray(v) && !v.length);
      if(b.type === 'calendar' && v && !v.time) empty = true;
      if(b.type === 'slider') empty = false;
      if(empty){ ok = false; errs[b.id] = p.errorText || M[b.type] || 'Dieses Feld ist erforderlich.'; }
    });
    st.errors = errs;
    return ok;
  }

  function resolveTarget(target){
    var page = pages[st.i];
    if(target) return target;
    var lg = page.logic || [];
    for(var li = 0; li < lg.length; li++){ if(lg[li].goto && FP.logicTest(lg[li], f, st.answers)) return lg[li].goto; }
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
    var tid = resolveTarget(target); if(tid && HIDDEN.hasOwnProperty(tid)) tid = HIDDEN[tid] || '__end';
    var ni = tid ? pages.map(function(p){return p.id;}).indexOf(tid) : st.i + 1;
    if(ni < 0 || ni >= pages.length){ if(!st.done && !hasSubmit) submit(); return true; }
    st.hist.push(st.i); st.i = ni; st.dir = 'fwd'; st.resume = null;
    pushHist(); saveResume();
    emit('page', {pageId:pages[ni].id, index:ni});
    if((ni === pages.length-1 || pages[ni].submitOnEnter) && !st.done) submit(true);
    var mo = morphFrom(ni);
    var paint = function(){
      render(false, !!mo);
      /* Eingebettet (inline): nur bis zum Funnel-Anfang scrollen, nie die ganze Seite nach oben */
      if(opts.inline){ var rt = root.getBoundingClientRect(); if(rt.top < 0) window.scrollTo({top: window.scrollY + rt.top - (opts.scrollOffset || 16), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); }
      else { var sc = scroller(); if(sc) sc.scrollTop = 0; }
    };
    if(mo){
      /* Fließender Seitenwechsel: das gewählte Antwortbild wächst ins Titelbild der nächsten Seite (View Transitions) */
      mo.style.viewTransitionName = 'fp-hero';
      var vt = document.startViewTransition(function(){ paint(); var hi = root.querySelector('.fp-img'); if(hi) hi.style.viewTransitionName = 'fp-hero'; });
      var clr = function(){ var hi = root.querySelector('.fp-img'); if(hi) hi.style.viewTransitionName = ''; };
      vt.finished.then(clr, clr); if(vt.ready) vt.ready.catch(function(){}); if(vt.updateCallbackDone) vt.updateCallbackDone.catch(function(){});
    } else paint();
    return true;
  }
  /* Chat-Verlauf: die letzten zwei beantworteten Seiten als Frage und Antwort-Blase */
  function chatHist(){
    if(!(f.theme || {}).chat) return null;
    return st.hist.slice(-2).map(function(i){
      var pg = pages[i], q = ''; if(!pg) return null;
      (pg.blocks || []).some(function(b){ var pp = b.props || {}; if(b.type === 'heading' && pp.text){ q = pp.text; return true; } if(pp.question){ q = pp.question; return true; } return false; });
      var a = FP.readable({pages:[pg]}, st.answers).map(function(x){ return x.value; }).join(', ');
      q = stripInk(FP.interp(q, f, st.answers)).replace(/\*\*|==|__|~~|\n/g, ' ').replace(/\s+/g, ' ').trim();
      return a ? {q: q.length > 90 ? q.slice(0, 88) + ' …' : q, a: a.length > 120 ? a.slice(0, 118) + ' …' : a} : null;
    }).filter(Boolean);
  }
  function morphFrom(ni){
    var t = f.theme || {};
    if(!t.morph || t.chat || !opts.live || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    if(root.getRootNode && root.getRootNode() !== document) return null; /* Shadow DOM (Einbettung): normaler Übergang */
    var src = root.querySelector('.fp-opt.sel .im'); if(!src || !src.style.backgroundImage) return null;
    return (pages[ni].blocks || []).some(function(b){ return b.type === 'image' && b.props && b.props.src; }) ? src : null;
  }
  function back(){ if(!st.hist.length) return; if(opts.history && history.state && history.state.fpD === st.hist.length){ history.back(); return; } st.i = st.hist.pop(); st.dir = 'back'; st.errors = {}; render(); }
  /* Zur ersten Seite (Logo-Klick): Antworten bleiben, „Zurück“ führt wieder hierher */
  function toStart(){ if(st.i === 0) return; clearTimeout(timer); st.hist.push(st.i); st.i = 0; st.dir = 'back'; st.errors = {}; pushHist(); emit('page', {pageId:pages[0].id, index:0}); render(); var sc = scroller(); if(sc && !opts.inline) sc.scrollTop = 0; }
  /* Browser-Zurück: jede Funnel-Seite ist ein Eintrag im Verlauf (nur auf der eigenen Funnel-Seite, nicht bei Einbettung auf fremden Websites) */
  function pushHist(){ if(!opts.history) return; try{ history.pushState(Object.assign({}, history.state, {fpI:st.i, fpD:st.hist.length}), ''); }catch(e){} }
  if(opts.history){
    try{ history.replaceState(Object.assign({}, history.state, {fpI:0, fpD:0}), ''); }catch(e){}
    window.addEventListener('popstate', function(e){
      var s0 = e.state; if(!s0 || s0.fpI == null || !root.isConnected) return;
      clearTimeout(timer); st.errors = {};
      if(s0.fpD < st.hist.length){ while(st.hist.length > s0.fpD) st.i = st.hist.pop(); st.dir = 'back'; }
      else if(s0.fpD > st.hist.length && pages[s0.fpI]){ st.hist.push(st.i); st.i = s0.fpI; st.dir = 'fwd'; }
      else return;
      emit('page', {pageId:pages[st.i].id, index:st.i}); render();
      var sc = scroller(); if(sc) sc.scrollTop = 0;
    });
  }

  function submit(silent){
    if(st.done) return;
    st.done = true; clearTimeout(rsT); try{ localStorage.removeItem(resumeKey); }catch(e){}
    var r = FP.readable(f, st.answers), tot = FP.computeTotal(f, st.answers);
    var path = st.hist.concat([st.i]).map(function(i){ return pages[i] && pages[i].id; }).filter(Boolean);
    var lead = {answers: JSON.parse(JSON.stringify(st.answers)), values: FP.values(f, st.answers), path: path, fields:r, total:tot.total, items:tot.items, score:tot.score, durationSec: Math.round((Date.now()-st.startedAt)/1000)};
    r.forEach(function(x){
      if(x.inputType === 'email' && !lead.email) lead.email = x.value;
      else if(x.inputType === 'tel' && !lead.phone) lead.phone = x.value;
      else if(/name/i.test(x.key) && x.type==='input' && x.inputType!=='email') lead.name = lead.name ? lead.name + ' ' + x.value : x.value;
    });
    if((f.settings||{}).webhookFormat === 'onepage'){
      var hex = ''; for(var hx = 0; hx < 24; hx++) hex += '0123456789abcdef'[Math.floor(Math.random()*16)];
      lead.onepage = FP.onepagePayload(f, st.answers, path, {id: hex, slug: f.slug, userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) || ''});
    }
    emit('complete', lead);
    if(opts.onSubmit) opts.onSubmit(lead);
    if(!silent && st.i === pages.length-1){ root.innerHTML = FP.renderShell(f, st.i, '<div class="fp-done"><div class="ok">'+IC.ok+'</div><h2 class="fp-h2">Vielen Dank!</h2><p class="fp-txt">Deine Angaben sind bei uns eingegangen.</p></div>', {}); }
  }

  function setAns(b, val){ st.answers[keyOf(b)] = val; if(st.errors[b.id]){ delete st.errors[b.id]; } saveResume(); }
  /* „Weiter, wo du aufgehört hast“: nur Auswahl-Antworten, keine Kontaktdaten, nur auf diesem Gerät, 14 Tage */
  var resumeKey = 'tt-resume-' + (f.id || 'f'), resumeOn = !!opts.live && (f.settings || {}).resume !== false, rsT = null;
  function saveResume(){
    if(!resumeOn || st.done) return; clearTimeout(rsT);
    rsT = setTimeout(function(){
      var keep = {}; FP.allBlocks(f).forEach(function(b){ if(['choice','slider','rating','calendar'].indexOf(b.type) >= 0 && st.answers[keyOf(b)] != null) keep[keyOf(b)] = st.answers[keyOf(b)]; });
      try{ if(st.i > 0) localStorage.setItem(resumeKey, JSON.stringify({i:st.i, hist:st.hist, answers:keep, ts:Date.now()})); }catch(e){}
    }, 300);
  }
  if(resumeOn){ try{ var rsv = JSON.parse(localStorage.getItem(resumeKey) || 'null'); if(rsv && rsv.i > 0 && pages[rsv.i] && !FP.loaderOf(pages[rsv.i]) && rsv.i < pages.length - 1 && Date.now() - rsv.ts < 14 * 864e5) st.resume = rsv; }catch(e){} }

  function refreshSums(){
    root.querySelectorAll('[data-sum]').forEach(function(el){
      var b = blockById(el.getAttribute('data-sum')); if(!b) return;
      var ob = el.querySelector('[data-tot]'), from = ob ? +(ob.getAttribute('data-shown') || ob.getAttribute('data-tot')) : null;
      var tmp = document.createElement('div'); tmp.innerHTML = FP.renderBlock(b, {f:f, answers:st.answers});
      var n = tmp.querySelector('[data-sum]'); if(n){ el.replaceWith(n); if(from != null) countTo(n.querySelector('[data-tot]'), from); }
    });
  }
  /* Preis zählt weich zum neuen Wert, statt hart zu springen (ease-out, 450 ms; bei reduzierter Bewegung sofort) */
  function countTo(el, from){
    if(!el) return; var to = +el.getAttribute('data-tot'), pre = el.getAttribute('data-pre') || '';
    if(from === to || !isFinite(from) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var t0 = performance.now(), dur = Math.min(700, 380 + Math.abs(to - from) / 40);
    el.classList.add('fp-ticking');
    (function step(now){
      if(!el.isConnected) return;
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = from + (to - from) * e;
      el.setAttribute('data-shown', v); el.textContent = pre + FP.priceText(f, k < 1 ? Math.round(v) : to);
      if(k < 1) requestAnimationFrame(step); else { el.removeAttribute('data-shown'); el.classList.remove('fp-ticking'); }
    })(t0);
  }

  root.addEventListener('click', function(e){
    if(e.target.closest('a[href]')) return;
    var el = e.target.closest('[data-act]'); if(!el || !root.contains(el)) return;
    var act = el.getAttribute('data-act'), b = blockById(el.getAttribute('data-bid'));
    if(act === 'consent') return; /* eigener Handler unten */
    if(act === 'cb' && e.target.closest('a')) return; /* Link in der Einwilligung öffnet sich, ohne das Häkchen zu setzen */
    if(!b && ['next','back','logo','fab','resume','fresh'].indexOf(act) < 0) return; /* Element gehört nicht (mehr) zu diesem Funnel */
    if(act !== 'sigclr') e.preventDefault();
    if(act === 'next') go();
    else if(act === 'back') back();
    else if(act === 'logo') toStart();
    else if(act === 'fab'){ var fb = el.closest('[data-fab]'), op = !fb.classList.contains('open'); fb.classList.toggle('open', op); el.setAttribute('aria-expanded', op); }
    else if((act === 'resume' || act === 'fresh') && !el.__rsGo && rsOut(function(){ el.__rsGo = 1; el.click(); })){}
    else if(act === 'resume' && st.resume){ var rs = st.resume; st.resume = null; Object.assign(st.answers, rs.answers || {}); st.hist = (rs.hist || []).filter(function(x){ return pages[x]; }); st.i = rs.i; st.started = true; st.dir = 'fwd'; emit('page', {pageId:pages[st.i].id, index:st.i}); render(); }
    else if(act === 'fresh'){ st.resume = null; try{ localStorage.removeItem(resumeKey); }catch(x){} render(true); }
    else if(act === 'btn'){
      var p = b.props, a = p.action || 'next';
      if(a === 'url' || a === 'wa') emit('click', {pageId:(pages[st.i] || {}).id, label:FP.stripInk(p.label || '').replace(/\*\*|==|__/g, '').slice(0, 80), url:a === 'wa' ? 'WhatsApp' : String(p.url || '').slice(0, 300)});
      if(a === 'url'){ if(opts.onUrl) opts.onUrl(p.url); else window.location.href = p.url; }
      else if(a === 'wa'){ var wu = FP.waUrl(p.waNumber, FP.interp(p.waText || '', f, st.answers || {})); if(wu) window.open(wu, '_blank', 'noopener'); }
      else if(a === 'submit'){ if(st.busy) return; if(!validate()){ render(true); var e2 = root.querySelector('.fp-err'); if(e2 && e2.scrollIntoView) e2.scrollIntoView({block:'center',behavior:'smooth'}); return; }
        /* Absenden: Lead sofort speichern, Button zeigt kurz Laden und Haken, dann weiter */
        submit(); st.busy = true; el.classList.add('busy'); el.setAttribute('aria-busy', 'true');
        setTimeout(function(){ el.classList.remove('busy'); el.classList.add('ok'); }, 380);
        setTimeout(function(){ st.busy = false; go(p.target || null, true); }, 820); }
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
    else if(act === 'cb'){ setAns(b, !st.answers[keyOf(b)]); markSelection(b); var cbe = root.querySelector('.fp-cb[data-bid="'+b.id+'"]'); if(cbe) cbe.setAttribute('aria-checked', !!st.answers[keyOf(b)]); }
    else if(act === 'zoom'){ e.stopPropagation(); lightbox(b, el.getAttribute('data-oid')); }
    else if(act === 'day'){ var cv = st.answers[keyOf(b)] || {}, nd = el.getAttribute('data-v'); if(cv.date !== nd) FP.calAnim[b.id] = 'd'; FP.calView[b.id] = nd.slice(0, 7); setAns(b, b.props.calStyle === 'strip' ? {date:nd, time:cv.time} : {date:nd}); render(true); }
    else if(act === 'slot'){ var cv2 = st.answers[keyOf(b)] || {}; if(!cv2.date) return; setAns(b, {date:cv2.date, time:el.getAttribute('data-v')}); render(true); }
    else if(act === 'calnav'){ var cur = FP.calView[b.id] || ((st.answers[keyOf(b)] || {}).date || FP.calDays(b.props)[0] || '').slice(0, 7), dir = +el.getAttribute('data-v'); if(!cur) return; var dt = new Date(+cur.slice(0, 4), +cur.slice(5, 7) - 1 + dir, 1, 12); FP.calView[b.id] = dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0'); FP.calAnim[b.id] = dir > 0 ? 'n' : 'p'; render(true); }
    else if(act === 'sigclr'){ e.preventDefault(); delete st.answers[keyOf(b)]; render(true); }
  });

  /* Lightbox für Bildkarten: großes Bild, Wischen/Pfeile zwischen den Antworten, direkt auswählen */
  function lightbox(b, oid){
    var opts2 = (b.props.options || []).filter(function(o){ return o.img; }), i = Math.max(0, opts2.map(function(o){ return o.id; }).indexOf(oid)), cur2 = (f.settings || {}).currency;
    var old = root.querySelector('.fp-lb'); if(old) old.remove();
    var lb = document.createElement('div'); lb.className = 'fp-lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    var draw = function(dir){
      var o = opts2[i], sel = [].concat(st.answers[keyOf(b)] == null ? [] : st.answers[keyOf(b)]).indexOf(o.id) >= 0;
      var price = b.props.showPrices && (+o.price || +o.unitPrice) ? '<span class="pr">'+(+o.price ? '+ '+FP.money(o.price, cur2) : FP.money(o.unitPrice, cur2)+(o.unitLabel?' / '+esc(o.unitLabel):''))+'</span>' : '';
      lb.innerHTML = '<div class="lbbg" data-lb="close"></div><div class="lbc"><button type="button" class="lbx" data-lb="close" aria-label="Schließen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
        + '<div class="lbi'+(dir ? ' in-'+dir : '')+'"><img src="'+esc(o.img)+'" alt="'+esc(o.label)+'"></div>'
        + '<div class="lbt"><div><b>'+esc(o.label)+'</b>'+(o.sub ? '<span>'+esc(o.sub)+'</span>' : '')+price+'</div><button type="button" class="lbs'+(sel ? ' on' : '')+'" data-lb="sel">'+(sel ? IC.check+'Ausgewählt' : 'Auswählen')+'</button></div>'
        + (opts2.length > 1 ? '<button type="button" class="lbn p" data-lb="prev" aria-label="Vorheriges Bild">'+IC.back+'</button><button type="button" class="lbn n" data-lb="next" aria-label="Nächstes Bild">'+IC.back+'</button><div class="lbd">'+(i+1)+' / '+opts2.length+'</div>' : '')
        + '</div>';
    };
    var step = function(d){ if(opts2.length < 2) return; i = (i + d + opts2.length) % opts2.length; draw(d > 0 ? 'n' : 'p'); };
    var close = function(){ lb.classList.add('out'); document.removeEventListener('keydown', key, true); setTimeout(function(){ lb.remove(); }, 180); };
    var key = function(e){ if(e.key === 'Escape'){ e.preventDefault(); close(); } else if(e.key === 'ArrowRight'){ step(1); } else if(e.key === 'ArrowLeft'){ step(-1); } };
    lb.addEventListener('click', function(e){
      var a = e.target.closest('[data-lb]'); if(!a) return; e.stopPropagation(); var k = a.getAttribute('data-lb');
      if(k === 'close') close(); else if(k === 'prev') step(-1); else if(k === 'next') step(1);
      else if(k === 'sel'){ var ob = root.querySelector('[data-act="opt"][data-bid="'+b.id+'"][data-oid="'+opts2[i].id+'"]'); close(); if(ob && !ob.classList.contains('sel')) ob.click(); }
    });
    var sx = null; lb.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){ if(sx == null) return; var dx = e.changedTouches[0].clientX - sx; if(Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); sx = null; });
    document.addEventListener('keydown', key, true);
    draw(); (root.querySelector('.fp') || root).appendChild(lb); /* innerhalb von .fp, damit Farben und Schriften des Funnels gelten */ var bx = lb.querySelector('.lbs'); if(bx) bx.focus({preventScroll:true});
  }
  root.addEventListener('keydown', function(e){ var t2 = e.target; if((e.key === 'Enter' || e.key === ' ') && t2.getAttribute && (t2.getAttribute('data-act') === 'cb' || t2.getAttribute('data-act') === 'zoom')){ e.preventDefault(); t2.click(); } });
  /* Klicks auf Links im Funnel (Text-Links, Social-Icons, Kontakt-Knopf) für die Auswertung */
  root.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]'); if(!a || !root.contains(a)) return;
    var href = a.getAttribute('href') || ''; if(href.charAt(0) === '#') return;
    emit('click', {pageId:(pages[st.i] || {}).id, label:(a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80), url:/wa\.me|whatsapp/.test(href) ? 'WhatsApp' : href.slice(0, 300)});
  });
  /* Weitermachen-Banner: erst ausfahren lassen, dann handeln; nach oben wischen blendet es aus */
  function rsOut(then){
    var bn = root.querySelector('.fp-resume'); if(!bn || bn.classList.contains('out')) return false;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    bn.style.transform = ''; bn.classList.add('out'); setTimeout(then, reduce ? 0 : 200); return true;
  }
  root.addEventListener('pointerdown', function(e){
    var bn = e.target.closest('[data-rsw]'); if(!bn || e.target.closest('button') || bn.classList.contains('out')) return;
    var y0 = e.clientY, t0 = Date.now(), dy = 0, id = e.pointerId;
    bn.style.transition = 'none';
    var mv = function(ev){ if(ev.pointerId !== id) return; dy = ev.clientY - y0; bn.style.transform = 'translateY(' + (dy < 0 ? dy : dy * 0.25) + 'px)'; };
    var up = function(ev){ if(ev.pointerId !== id) return; window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      bn.style.transition = ''; var v = -dy / Math.max(1, Date.now() - t0);
      if(dy < -40 || v > 0.11){ st.resume = null; bn.style.transform = ''; bn.classList.add('out'); setTimeout(function(){ if(bn.parentNode) bn.remove(); }, 220); } else bn.style.transform = ''; };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  });
  root.addEventListener('click', function(e){ var o = root.querySelector('[data-fab].open'); if(o && !o.contains(e.target)){ o.classList.remove('open'); var ob = o.querySelector('[data-act="fab"]'); if(ob) ob.setAttribute('aria-expanded', 'false'); } }, true);
  root.addEventListener('change', function(e){
    var el = e.target; if(!el || el.type !== 'range') return;
    var b = blockById(el.getAttribute('data-bid')); if(!b || b.type !== 'rating' || !b.props.autoNext) return;
    clearTimeout(timer); timer = setTimeout(function(){ go(); }, 450);
  });
  root.addEventListener('input', function(e){
    var el = e.target, k = el.getAttribute && el.getAttribute('data-key'); if(!k) return;
    var b = blockById(el.getAttribute('data-bid')); if(!b) return;
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

  /* Vorher/Nachher-Regler: waagerecht ziehen bewegt den Regler, senkrecht scrollt die Seite weiter (touch-action: pan-y) */
  function cmpSet(c, pct, anim){ pct = Math.max(0, Math.min(100, pct)); c.classList.toggle('anim', !!anim); c.style.setProperty('--x', pct + '%'); c.setAttribute('aria-valuenow', Math.round(pct)); }
  root.addEventListener('pointerdown', function(e){
    var c = e.target.closest && e.target.closest('[data-cmp]'); if(!c || !root.contains(c) || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var r = c.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, drag = false, moved = false;
    var at = function(ev){ return (ev.clientX - r.left) / r.width * 100; };
    var mv = function(ev){
      if(!drag){ var dx = Math.abs(ev.clientX - sx), dy = Math.abs(ev.clientY - sy); if(dx < 4 && dy < 4) return; moved = true; if(dx <= dy) return end(); drag = true; c.classList.add('drag'); try{ c.setPointerCapture(e.pointerId); }catch(x){} }
      cmpSet(c, at(ev), false);
    };
    var end = function(ev){ c.removeEventListener('pointermove', mv); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', end); c.classList.remove('drag'); };
    var up = function(ev){ if(!moved) cmpSet(c, at(ev), true); end(); };
    c.addEventListener('pointermove', mv); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', end);
  });
  root.addEventListener('keydown', function(e){
    var c = e.target.closest && e.target.closest('[data-cmp]'); if(!c) return;
    var cur = parseFloat(c.style.getPropertyValue('--x')) || 50, step = e.shiftKey ? 20 : 5;
    var nv = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? cur - step : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? cur + step : e.key === 'Home' ? 0 : e.key === 'End' ? 100 : null;
    if(nv == null) return; e.preventDefault(); cmpSet(c, nv, true);
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
  /* Cookie-Banner: im Live-Funnel bis zur Entscheidung, in der Vorschau auf Wunsch */
  var ccContainer = opts.inline ? root.parentNode : null;
  if(ccContainer && getComputedStyle(ccContainer).position === 'static') ccContainer.style.position = 'relative';
  var ccDone = function(v){ if(opts.onConsent) try{ opts.onConsent(v); }catch(e){} };
  if(FP.consentOn(f) && (opts.consentPreview || (opts.live && !FP.getConsent(f)))) FP.showConsent(f, {container:ccContainer, preview:!!opts.consentPreview}, ccDone);
  else if(FP.consentOn(f) && opts.live) ccDone(FP.getConsent(f));
  root.addEventListener('click', function(e){ var r = e.target.closest('[data-act="consent"]'); if(r){ e.preventDefault(); FP.showConsent(f, {container:ccContainer, preview:!opts.live}, ccDone); } });
  return { state: st, restart: function(){ st.i=0; st.hist=[]; st.answers={}; st.errors={}; st.done=false; st.started=false; st.startedAt=Date.now(); render(); }, goTo: function(i){ st.i=i; st.hist=[]; render(); } };
};

window.FP = FP;
})();
