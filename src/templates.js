(function(){
"use strict";
var uid = function(){ return Math.random().toString(36).slice(2,10); };
var clone = function(o){ return JSON.parse(JSON.stringify(o)); };

var THEME_BASE = {primary:'#4b4bf0',primaryText:'#ffffff',bg:'#ffffff',surface:'#f4f5f8',text:'#0f1117',muted:'#6b7080',font:'Inter',headingFont:'Inter',radius:14,btnRadius:12,progress:'bar',animation:'slide',logoText:'',logoImg:'',bgImage:'',overlay:'rgba(0,0,0,0.35)',footer:'',backButton:true,nextLabel:'Weiter',scale:100,headingWeight:700,headingLs:-2,headingUpper:false,lineHeight:1.55,btnVariant:'filled',btnPad:16,btnWeight:600,btnUpper:false,stickyCta:false,inputStyle:'outline',optStyle:'filled',pad:20,logoAlign:'center',progressTop:false,bgGrad:false,bg2:'#eef0ff',bgAngle:180,customCss:''};
var THEMES = {
  clean:   {name:'Clean',   primary:'#4b4bf0',bg:'#ffffff',surface:'#f4f5f8',text:'#0f1117',muted:'#6b7080',font:'Inter',headingFont:'Inter',radius:14,btnRadius:12},
  midnight:{name:'Midnight',primary:'#8b8cff',primaryText:'#0b0c12',bg:'#0b0c12',surface:'#181a26',text:'#f3f4f8',muted:'#9aa0b4',font:'Geist',headingFont:'Geist',radius:16,btnRadius:14},
  forest:  {name:'Forest',  primary:'#2f6b4f',bg:'#f7f5ef',surface:'#ebe8dc',text:'#1d2a22',muted:'#66705f',font:'DM Sans',headingFont:'Fraunces',radius:12,btnRadius:40},
  sunset:  {name:'Sunset',  primary:'#ff5a36',bg:'#fffaf6',surface:'#fbeee6',text:'#22140f',muted:'#8a6e62',font:'Plus Jakarta Sans',headingFont:'Plus Jakarta Sans',radius:18,btnRadius:16},
  mono:    {name:'Mono',    primary:'#111111',bg:'#ffffff',surface:'#f2f2f2',text:'#111111',muted:'#707070',font:'Space Grotesk',headingFont:'Space Grotesk',radius:6,btnRadius:6,progress:'steps'},
  ocean:   {name:'Ocean',   primary:'#0b84ff',bg:'#f4f9ff',surface:'#e5effb',text:'#0a1b2e',muted:'#5f7189',font:'Manrope',headingFont:'Manrope',radius:16,btnRadius:14},
  luxe:    {name:'Luxe',    primary:'#c19a5b',primaryText:'#141210',bg:'#141210',surface:'#221f1b',text:'#f5efe6',muted:'#a99f90',font:'Figtree',headingFont:'Playfair Display',radius:4,btnRadius:2},
  candy:   {name:'Candy',   primary:'#e0338a',bg:'#fff5fa',surface:'#fde6f1',text:'#2b0f1d',muted:'#93617a',font:'Outfit',headingFont:'Outfit',radius:20,btnRadius:40},
  solar:   {name:'Solar',   primary:'#f4b400',primaryText:'#1a1400',bg:'#ffffff',surface:'#fff6da',text:'#1a1400',muted:'#7a6f50',font:'Sora',headingFont:'Sora',radius:14,btnRadius:12}
};
var theme = function(key, extra){ var t = Object.assign({}, THEME_BASE, THEMES[key] || {}, extra || {}); delete t.name; return t; };

function art(emoji, c1, c2){
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="660" cy="110" r="190" fill="#fff" opacity=".13"/><circle cx="110" cy="560" r="230" fill="#fff" opacity=".09"/><text x="400" y="330" font-size="230" text-anchor="middle" dominant-baseline="middle">'+emoji+'</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* ---------- block catalogue ---------- */
var O = function(label, icon, extra){ return Object.assign({id:uid(), label:label, icon:icon||''}, extra||{}); };
var DEF = {
  heading:     function(){ return {text:'Deine Überschrift', level:1}; },
  text:        function(){ return {text:'Beschreibe hier kurz, worum es geht und was der Nutzer davon hat.'}; },
  badge:       function(){ return {text:'✨ Kostenlos & unverbindlich', align:'center'}; },
  image:       function(){ return {src:'', radius:14, height:200, alt:''}; },
  compare:     function(){ return {before:'https://images.unsplash.com/photo-1710579682386-aeff3f831b7d?auto=format&fit=crop&w=900&q=75', after:'https://images.unsplash.com/photo-1787491581115-1d9a0e9f11ec?auto=format&fit=crop&w=900&q=75', labelBefore:'Vorher', labelAfter:'Nachher', start:50, ratio:'4:3', radius:14}; },
  video:       function(){ return {url:'', radius:14}; },
  lottie:      function(){ return {src:'', json:'', size:160, speed:1, loop:true, align:'center'}; },
  list:        function(){ return {items:['Erster Vorteil','Zweiter Vorteil','Dritter Vorteil'], icon:'check'}; },
  testimonial: function(){ return {quote:'„Super Beratung, schnelle Umsetzung – absolut empfehlenswert!“', name:'Julia Schneider', role:'Kundin aus Düsseldorf', stars:5, img:''}; },
  trust:       function(){ return {items:['⭐ 4,9 bei Google','✓ 500+ Kunden','🔒 DSGVO-konform'], align:'center'}; },
  reviews:     function(){ return {score:4.9, count:127, source:'Google', variant:'', align:'center'}; },
  avatars:     function(){ return {names:['Anna K.','Markus T.','Sabine L.','Jonas W.'], photos:[], text:'Über **200** zufriedene Kunden', stars:true, more:'', align:'center'}; },
  logos:       function(){ return {title:'Wir verbauen Qualität von', items:['Kährs','Osmo','Bauhaus','Hornbach','Remmers'], speed:28, gray:true}; },
  recap:       function(){ return {title:'Deine Auswahl', showImage:true, showPrice:true, totalLabel:'Geschätzter Preis', prefix:'', max:6}; },
  steps:       function(){ return {title:'So geht es weiter', items:['Anfrage eingegangen | Gerade eben','Persönlicher Rückruf | Innerhalb von 24 Stunden','Dein Angebot | Passend zu deiner Auswahl']}; },
  arrow:       function(){ return {text:'Hier klicken', style:'curve', textSide:'end', hand:true, size:80, rotate:180, flip:true, x:60, y:4, anim:'bounce', acolor:''}; },
  loader:      function(){ return {anim:'search', duration:3, size:120, texts:['Wir prüfen deine Angaben …','Wir vergleichen die Preise …','Gleich geschafft …'], showBar:true, align:'center'}; },
  faq:         function(){ return {items:[{q:'Ist das Angebot kostenlos?', a:'Ja, die Anfrage ist komplett kostenlos und unverbindlich.'},{q:'Wie schnell meldet ihr euch?', a:'In der Regel innerhalb von 24 Stunden an Werktagen.'}]}; },
  countdown:   function(){ return {minutes:15, label:'Dein Angebot ist reserviert für', align:'center'}; },
  choice:      function(){ return {question:'Deine Frage?', desc:'', key:'', layout:'list', multi:false, autoNext:true, required:true, showPrices:false, options:[O('Option A','👍'),O('Option B','✌️'),O('Option C','🙌')]}; },
  input:       function(){ return {label:'Dein Name', placeholder:'Max Mustermann', inputType:'text', key:'name', required:true}; },
  slider:      function(){ return {label:'Wie viel?', min:0, max:100, step:1, def:50, unit:'', key:'', isQuantity:false, align:'left'}; },
  rating:      function(){ return {label:'Wie zufrieden bist du?', max:5, style:'stars', key:'bewertung', required:true, autoNext:false, align:'center', minLabel:'', maxLabel:''}; },
  calendar:    function(){ return {label:'Wähle deinen Wunschtermin', days:30, offset:1, excludeDays:[0,6], slots:['09:00','10:30','12:00','14:00','15:30','17:00'], dur:'30 Min', where:'Telefon', key:'termin', required:true}; },
  upload:      function(){ return {label:'Foto hochladen', cta:'Datei auswählen', hint:'JPG, PNG oder PDF', accept:'image/*,.pdf', key:'upload', required:false}; },
  signature:   function(){ return {label:'Unterschrift', hint:'Hier mit dem Finger unterschreiben', key:'unterschrift', required:true}; },
  checkbox:    function(){ return {text:'Ich stimme der **Datenschutzerklärung** zu und möchte kontaktiert werden.', key:'einwilligung', required:true}; },
  button:      function(){ return {label:'Weiter', action:'next', target:'', url:'', variant:'', full:true, shadow:true, arrow:true, pulse:false, sub:''}; },
  summary:     function(){ return {title:'Deine Konfiguration', totalLabel:'Geschätzter Gesamtpreis', note:'Unverbindliche Schätzung inkl. MwSt.', showItems:true, compact:false, prefix:''}; },
  spacer:      function(){ return {height:24}; },
  box:         function(){ return {count:0, bxStyle:'sand', align:'center'}; },
  social:      function(){ return {instagram:'', facebook:'', whatsapp:'', size:40, align:'center'}; },
  divider:     function(){ return {mt:4, mb:20}; },
  html:        function(){ return {code:'<div style="padding:16px;border-radius:12px;background:#f4f5f8;text-align:center">Eigener HTML-Code</div>'}; }
};

var LIB = [
  {id:'heading', type:'heading', n:'Überschrift', ic:'heading', g:'Inhalt'},
  {id:'text', type:'text', n:'Text', ic:'type', g:'Inhalt'},
  {id:'image', type:'image', n:'Bild', ic:'image', g:'Inhalt'},
  {id:'compare', type:'compare', n:'Vorher/Nachher', ic:'compare', g:'Inhalt'},
  {id:'video', type:'video', n:'Video', ic:'video', g:'Inhalt'},
  {id:'lottie', type:'lottie', n:'Animation', ic:'sparkles', g:'Inhalt'},
  {id:'arrow', type:'arrow', n:'Hinweis-Pfeil', ic:'arrowHint', g:'Inhalt'},
  {id:'badge', type:'badge', n:'Badge', ic:'badge', g:'Inhalt'},
  {id:'list', type:'list', n:'Liste', ic:'list', g:'Inhalt'},
  {id:'choice', type:'choice', n:'Auswahl', ic:'choice', g:'Fragen'},
  {id:'multi', type:'choice', n:'Mehrfach', ic:'checks', g:'Fragen', over:{question:'Was trifft zu? (Mehrfachauswahl)', multi:true, autoNext:false}},
  {id:'cards', type:'choice', n:'Kacheln', ic:'grid', g:'Fragen', over:{layout:'grid'}},
  {id:'imgchoice', type:'choice', n:'Bildauswahl', ic:'images', g:'Fragen', over:{layout:'image'}},
  {id:'input', type:'input', n:'Textfeld', ic:'cursor', g:'Fragen'},
  {id:'email', type:'input', n:'E-Mail', ic:'mail', g:'Fragen', over:{label:'E-Mail-Adresse', placeholder:'max@beispiel.de', inputType:'email', key:'email'}},
  {id:'phone', type:'input', n:'Telefon', ic:'tel', g:'Fragen', over:{label:'Telefonnummer', placeholder:'+49 170 1234567', inputType:'tel', key:'telefon'}},
  {id:'textarea', type:'input', n:'Freitext', ic:'align', g:'Fragen', over:{label:'Deine Nachricht', placeholder:'Erzähl uns mehr …', inputType:'textarea', key:'nachricht', required:false}},
  {id:'slider', type:'slider', n:'Schieberegler', ic:'sliders', g:'Fragen'},
  {id:'rating', type:'rating', n:'Sterne', ic:'star', g:'Fragen'},
  {id:'smiley', type:'rating', n:'Smiley-Skala', ic:'star', g:'Fragen', over:{label:'Wie zufrieden bist du?', style:'emoji', max:5, key:'zufriedenheit', autoNext:true, align:'center', minLabel:'nicht so gut', maxLabel:'mega zufrieden'}},
  {id:'smslider', type:'rating', n:'Smiley-Slider', ic:'sliders', g:'Fragen', over:{label:'Wie zufrieden bist du?', style:'slider', max:10, key:'zufriedenheit', align:'center', minLabel:'gar nicht', maxLabel:'total'}},
  {id:'nps', type:'rating', n:'NPS-Skala', ic:'gauge', g:'Fragen', over:{label:'Wie wahrscheinlich empfiehlst du uns weiter?', style:'nps', key:'nps', align:'left'}},
  {id:'calendar', type:'calendar', n:'Terminwahl', ic:'calendar', g:'Fragen'},
  {id:'upload', type:'upload', n:'Datei-Upload', ic:'upload', g:'Fragen'},
  {id:'signature', type:'signature', n:'Unterschrift', ic:'pen', g:'Fragen'},
  {id:'checkbox', type:'checkbox', n:'Einwilligung', ic:'checkbox', g:'Fragen'},
  {id:'button', type:'button', n:'Button', ic:'pointer', g:'Aktion & Preis'},
  {id:'submit', type:'button', n:'Absenden', ic:'send', g:'Aktion & Preis', over:{label:'Jetzt absenden', action:'submit'}},
  {id:'summary', type:'summary', n:'Preisübersicht', ic:'receipt', g:'Aktion & Preis'},
  {id:'liveprice', type:'summary', n:'Live-Preis', ic:'tag', g:'Aktion & Preis', over:{compact:true, title:'Geschätzter Preis', prefix:'ab', note:''}},
  {id:'testimonial', type:'testimonial', n:'Bewertung', ic:'quote', g:'Vertrauen'},
  {id:'trust', type:'trust', n:'Trust-Badges', ic:'shield', g:'Vertrauen'},
  {id:'reviews', type:'reviews', n:'Bewertungs-Abzeichen', ic:'star', g:'Vertrauen'},
  {id:'avatars', type:'avatars', n:'Kundenstapel', ic:'users', g:'Vertrauen'},
  {id:'logos', type:'logos', n:'Logo-Leiste', ic:'layers', g:'Vertrauen'},
  {id:'recap', type:'recap', n:'Auswahl-Karte', ic:'receipt', g:'Aktion & Preis'},
  {id:'steps', type:'steps', n:'Zeitleiste', ic:'list', g:'Aktion & Preis'},
  {id:'loader', type:'loader', n:'Lade-Animation', ic:'refresh', g:'Aktion & Preis'},
  {id:'faces', type:'rating', n:'Smileys flach', ic:'star', g:'Fragen', over:{label:'Wie zufrieden bist du?', style:'faces', max:5, key:'zufriedenheit', autoNext:true, align:'center'}},
  {id:'faq', type:'faq', n:'FAQ', ic:'help', g:'Vertrauen'},
  {id:'countdown', type:'countdown', n:'Countdown', ic:'clock', g:'Vertrauen'},
  {id:'box', type:'box', n:'Box', ic:'boxi', g:'Layout'},
  {id:'social', type:'social', n:'Social Media', ic:'share2', g:'Inhalt'},
  {id:'spacer', type:'spacer', n:'Abstand', ic:'space', g:'Layout'},
  {id:'divider', type:'divider', n:'Trennlinie', ic:'minus', g:'Layout'},
  {id:'html', type:'html', n:'HTML / Code', ic:'code', g:'Layout'}
];

var B = function(type, props){ return {id:uid(), type:type, props:Object.assign(DEF[type](), props||{})}; };
var P = function(name, blocks, extra){ return Object.assign({id:uid(), name:name, blocks:blocks}, extra||{}); };
var fromLib = function(libId){ var l = LIB.filter(function(x){return x.id===libId;})[0]; var b = B(l.type, clone(l.over||{})); if(b.props.options) b.props.options.forEach(function(o){ o.id = uid(); }); return b; };

var SECTIONS = [
  {id:'s-contact', n:'Kontaktformular', ic:'user', make:function(){ return [B('heading',{text:'Fast geschafft! Wohin dürfen wir dein Angebot senden?', level:2}), B('input',{label:'Vor- und Nachname', placeholder:'Max Mustermann', key:'name', icon:'user'}), B('input',{label:'E-Mail-Adresse', placeholder:'max@beispiel.de', inputType:'email', key:'email'}), B('input',{label:'Telefonnummer', placeholder:'+49 170 1234567', inputType:'tel', key:'telefon'}), B('checkbox',{}), B('button',{label:'Jetzt anfragen', action:'submit'})]; }},
  {id:'s-hero', n:'Hero / Start', ic:'sparkles', make:function(){ return [B('badge',{}), B('heading',{text:'Finde in 60 Sekunden das ==perfekte Angebot==', align:'center'}), B('text',{text:'Beantworte ein paar kurze Fragen und erhalte sofort eine persönliche Einschätzung.', align:'center'}), B('button',{label:'Jetzt starten', sub:'Dauert nur 60 Sekunden'}), B('trust',{})]; }},
  {id:'s-thanks', n:'Danke-Seite', ic:'check', make:function(){ return [B('heading',{text:'Vielen Dank, {{vorname}}! 🎉', align:'center'}), B('text',{text:'Wir haben deine Anfrage erhalten und melden uns innerhalb von 24 Stunden.', align:'center'}), B('list',{items:['Wir prüfen deine Angaben','Du erhältst dein persönliches Angebot','Gemeinsam besprechen wir die Details'], icon:'number'})]; }},
  {id:'s-loader', n:'Ladeseite', ic:'refresh', make:function(){ return [B('loader',{}), B('heading',{text:'Einen Moment …', level:2, align:'center', mb:6}), B('text',{text:'Der beste Preis wird gerade für dich gesucht.', align:'center'})]; }},
  {id:'s-book', n:'Terminbuchung', ic:'calendar', make:function(){ return [B('heading',{text:'Wann passt es dir am besten?', level:2}), B('calendar',{}), B('button',{label:'Termin auswählen'})]; }}
];

/* ---------- templates ---------- */
var CATS = ['Alle','Konfigurator','Leads','Termine','Recruiting','Feedback','Verkauf','Handwerk','Dienstleistung','Gesundheit','Gastro & Events'];

/* ---------- Moderne Vorlagen ----------
   Clean wie die Onepage-Importe: Inter, kleinere Schrift (scale 92 %), ruhige Neutraltöne,
   echte Fotos (Unsplash, frei für kommerzielle Nutzung), keine Emoji-Platzhalter. */
var U = function(id, w){ return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 1200) + '&q=75'; };
var OK_IMG = '/assets/common/success.svg';
function modern(extra){
  return theme('clean', Object.assign({morph:true, font:'Inter', headingFont:'Inter', headingWeight:650, headingLs:-2, lineHeight:1.5, scale:92,
    radius:12, btnRadius:12, pad:22, bg:'#ffffff', surface:'#f4f4f5', text:'#111113', muted:'#6e6e73', btnWeight:600, btnPad:15,
    progress:'bar', progressTop:true, backButton:true, logoAlign:'center'}, extra || {}));
}
var hero = function(id, extra){ return B('image', Object.assign({src:U(id), ratio:'16:10', radius:16, mb:24, alt:''}, extra || {})); };
var done = function(title, text, more){ return [B('image', {src:OK_IMG, alt:'', height:100, fit:'contain', radius:0, mb:6}), B('heading', {text:title, align:'center', level:2, mb:8}), B('text', {text:text, align:'center'})].concat(more || []); };
var contact = function(title, sub, btn, extra){
  return [B('heading', {text:title, level:2, mb:sub ? 6 : 18}), sub ? B('text', {text:sub, mb:20}) : null,
    B('input', {label:'Vor- und Nachname', placeholder:'Max Mustermann', key:'name'}),
    B('input', {label:'E-Mail-Adresse', placeholder:'max@beispiel.de', inputType:'email', key:'email'}),
    B('input', {label:'Telefonnummer', placeholder:'+49 170 1234567', inputType:'tel', key:'telefon', required:false})]
    .concat(extra || []).concat([B('checkbox', {text:'Ich stimme der **Datenschutzerklärung** zu und möchte kontaktiert werden.', key:'einwilligung'}), B('button', {label:btn, action:'submit'})]).filter(Boolean);
};

function tTerrasse(){
  var mat = B('choice',{question:'Welches Material wünschst du dir?', key:'material', layout:'image', ratio:'4:3', showPrices:true, options:[
    O('WPC-Dielen','',{sub:'Pflegeleicht & splitterfrei', unitPrice:89, unitLabel:'m²', img:U('1790633419052-d8a074f04c48',600)}),
    O('Bangkirai','',{sub:'Edles Hartholz', unitPrice:119, unitLabel:'m²', img:U('1632359552106-2599db65f51c',600)}),
    O('Lärche','',{sub:'Natürlich & regional', unitPrice:79, unitLabel:'m²', img:U('1710579682386-aeff3f831b7d',600)}),
    O('Keramik','',{sub:'Modern & robust', unitPrice:139, unitLabel:'m²', img:U('1662557499709-a8d7ef6d7d5e',600)})]});
  var size = B('slider',{label:'', min:5, max:100, step:1, def:25, unit:'m²', key:'flaeche', isQuantity:true});
  var extras = B('choice',{question:'Welche Extras sollen dazu?', desc:'Mehrfachauswahl möglich', key:'extras', layout:'checklist', multi:true, autoNext:false, required:false, showPrices:true, options:[
    O('Alu-Unterkonstruktion','',{unitPrice:25, unitLabel:'m²'}), O('LED-Beleuchtung','',{price:890}), O('Treppe / Stufen','',{price:650}), O('Sichtschutz','',{price:1200}), O('Montage durch Fachbetrieb','',{unitPrice:35, unitLabel:'m²'})]});
  var when = B('choice',{question:'Wann soll es losgehen?', key:'zeitraum', options:[O('So schnell wie möglich'),O('In 1–3 Monaten'),O('In 3–6 Monaten'),O('Ich informiere mich nur')]});
  return {name:'Terrassen-Konfigurator', desc:'Material, Fläche & Extras wählen – mit Live-Preis und Angebotsanfrage.', cats:['Konfigurator','Leads','Handwerk'],
    theme:modern({primary:'#2f5d46', logoText:'Terrassenbau Muster'}), settings:{currency:'EUR', basePrice:0},
    pages:[
      P('Start',[hero('1787491581115-1d9a0e9f11ec'), B('badge',{text:'Preis in 60 Sekunden', align:'left'}), B('heading',{text:'Konfiguriere deine ==Traumterrasse==', level:1}), B('text',{text:'Wähle Material, Größe und Extras – und erhalte sofort eine unverbindliche Preisschätzung.', mb:22}), B('button',{label:'Jetzt konfigurieren', sub:'Kostenlos & unverbindlich'}), B('reviews',{score:4.9, count:127, source:'Google', align:'center'})]),
      P('Material',[mat]),
      P('Größe',[B('image',{src:U('1787491581115-1d9a0e9f11ec',900), ratio:'16:9', radius:14, alt:''}), B('heading',{text:'Wie groß soll deine Terrasse werden?', level:2}), B('text',{text:'Grobe Schätzung reicht – wir messen vor Ort genau aus.', mb:20}), size, B('spacer',{height:8}), B('summary',{compact:true, title:'Geschätzter Preis', prefix:'ab', note:''})]),
      P('Extras',[extras, B('summary',{compact:true, sticky:true, title:'Aktueller Preis', prefix:'', note:''})]),
      P('Zeitraum',[when]),
      P('Berechnung',[B('loader',{anim:'search', duration:3.2, texts:['Wir prüfen deine Auswahl …','Wir suchen den besten Preis …','Fast fertig …']}), B('heading',{text:'Einen Moment …', level:2, align:'center', mb:6}), B('text',{text:'Der beste Preis für deine Terrasse wird berechnet.', align:'center'})], {hideProgress:true, vcenter:true, allowBack:false}),
      P('Zusammenfassung',[B('heading',{text:'Deine Wunschterrasse', level:2}), B('summary',{}), B('button',{label:'Angebot anfordern'})]),
      P('Kontakt', contact('Wohin dürfen wir dein Angebot senden?', '', 'Angebot anfordern')),
      P('Danke', done('Danke, {{vorname|dir}}!', 'Deine Anfrage über **{{total}}** ist eingegangen. Wir melden uns innerhalb von 24 Stunden mit deinem Angebot.', [B('recap',{title:'Deine Wunschterrasse', mt:8, mb:22}), B('steps',{items:['Anfrage eingegangen | Gerade eben','Persönlicher Rückruf | Innerhalb von 24 Stunden','Kostenloses Aufmaß vor Ort | Zum Wunschtermin','Dein verbindliches Angebot | Passend zu deiner Auswahl']})]), {hideProgress:true, allowBack:false})
    ]};
}

function tSolar(){
  return {name:'Solar-Angebot', desc:'Hausart, Dach & Verbrauch abfragen – qualifizierte Solar-Leads.', cats:['Leads','Termine','Handwerk'],
    theme:modern({primary:'#0f6fd6', logoText:'SonnenPlus'}), settings:{currency:'EUR'},
    pages:[
      P('Start',[hero('1655300256486-4ec7251bf84e'), B('badge',{text:'Kostenloser Solar-Check', align:'left'}), B('heading',{text:'Wie viel kannst du mit Solar ==sparen==?'}), B('text',{text:'In 4 kurzen Schritten prüfen, ob sich eine Photovoltaik-Anlage für dein Haus lohnt.', mb:22}), B('button',{label:'Ersparnis berechnen', sub:'Dauert nur 60 Sekunden'})]),
      P('Hausart',[B('choice',{question:'Um welches Gebäude handelt es sich?', key:'hausart', layout:'image', ratio:'4:3', options:[O('Einfamilienhaus','',{img:U('1698345388734-93016ebbae35',600)}),O('Doppelhaushälfte','',{img:U('1780072493603-c8f8df59730a',600)}),O('Mehrfamilienhaus','',{img:U('1624204386084-dd8c05e32226',600)}),O('Gewerbe','',{img:U('1781919293919-693ee10fb06c',600)})]})]),
      P('Dach',[B('choice',{question:'Welche Dachform hast du?', key:'dachform', layout:'grid', options:[O('Satteldach'),O('Flachdach'),O('Pultdach'),O('Walmdach')]})]),
      P('Verbrauch',[B('heading',{text:'Wie hoch ist dein Stromverbrauch?', level:2}), B('text',{text:'Steht auf deiner Jahresabrechnung – eine Schätzung reicht.', mb:22}), B('slider',{label:'', min:1500, max:12000, step:250, def:4000, unit:'kWh/Jahr', key:'verbrauch'})]),
      P('Speicher',[B('choice',{question:'Interessierst du dich für einen Stromspeicher?', key:'speicher', options:[O('Ja, unbedingt'),O('Vielleicht'),O('Nein')]})]),
      P('PLZ',[B('heading',{text:'Wo befindet sich das Gebäude?', level:2}), B('input',{label:'Postleitzahl', placeholder:'41516', key:'plz', inputType:'number'})]),
      P('Kontakt', [B('badge',{text:'Deine Region wird beliefert', align:'left'})].concat(contact('Wohin dürfen wir deine Berechnung senden?', '', 'Berechnung anfordern'))),
      P('Danke', done('Perfekt, {{vorname|danke}}!', 'Ein Solar-Experte meldet sich innerhalb von 24 Stunden mit deiner persönlichen Berechnung.', [B('recap',{title:'Deine Angaben', mt:8, mb:22}), B('steps',{items:['Anfrage eingegangen | Gerade eben','Rückruf vom Solar-Experten | Innerhalb von 24 Stunden','Deine persönliche Berechnung | Mit Förderung und Ertrag']})]), {hideProgress:true, allowBack:false})
    ]};
}

function tImmo(){
  return {name:'Immobilienbewertung', desc:'Kostenlose Werteinschätzung als Lead-Magnet für Makler.', cats:['Leads'],
    theme:modern({primary:'#1d3a5f', logoText:'Immo Rheinland'}), settings:{currency:'EUR'},
    pages:[
      P('Start',[hero('1771366260867-7e07094579d7'), B('badge',{text:'Kostenlos in 2 Minuten', align:'left'}), B('heading',{text:'Was ist deine Immobilie ==wirklich wert==?'}), B('text',{text:'Kostenlose Wertermittlung auf Basis aktueller Marktdaten – unverbindlich und diskret.', mb:22}), B('button',{label:'Jetzt Wert ermitteln'}), B('testimonial',{quote:'„Schnell, transparent und am Ende sogar über dem erwarteten Preis verkauft.“', name:'Familie Becker', role:'Verkauf in Neuss', stars:5})]),
      P('Objektart',[B('choice',{question:'Was möchtest du bewerten lassen?', key:'objekt', layout:'image', ratio:'4:3', options:[O('Wohnung','',{img:U('1771287490603-fbf9b6211cc3',600)}),O('Haus','',{img:U('1698345388734-93016ebbae35',600)}),O('Grundstück','',{img:U('1773215023063-e662ea91a69c',600)}),O('Gewerbe','',{img:U('1781919293919-693ee10fb06c',600)})]})]),
      P('Fläche',[B('heading',{text:'Wie groß ist die Wohnfläche?', level:2, mb:24}), B('slider',{min:20, max:400, step:5, def:120, unit:'m²', key:'wohnflaeche'})]),
      P('Baujahr',[B('choice',{question:'Wann wurde die Immobilie gebaut?', key:'baujahr', options:[O('Vor 1950'),O('1950 – 1979'),O('1980 – 1999'),O('2000 – 2015'),O('Nach 2015')]})]),
      P('Zustand',[B('choice',{question:'Wie ist der Zustand?', key:'zustand', layout:'grid', options:[O('Neuwertig'),O('Gepflegt'),O('Renovierungsbedürftig'),O('Sanierungsbedürftig')]})]),
      P('Verkauf',[B('choice',{question:'Planst du einen Verkauf?', key:'verkauf', options:[O('Ja, in den nächsten 3 Monaten'),O('Ja, in 6–12 Monaten'),O('Nein, nur Interesse')]})]),
      P('Kontakt', contact('Wohin dürfen wir die Bewertung senden?', 'Deine Daten behandeln wir vertraulich.', 'Bewertung anfordern')),
      P('Danke', done('Danke, {{vorname|dir}}!', 'Deine Wertermittlung ist in Arbeit und kommt in Kürze per E-Mail.', [B('steps',{mt:12, items:['Angaben eingegangen | Gerade eben','Marktanalyse | Mit aktuellen Vergleichsdaten','Deine Wertermittlung | Per E-Mail, meist am selben Tag']})]), {hideProgress:true, allowBack:false})
    ]};
}

function tStrategy(){
  return {name:'Strategiegespräch', desc:'Video + Qualifizierung + Terminwahl – für Coaches & Agenturen.', cats:['Termine','Verkauf'],
    theme:modern({primary:'#111113', bg:'#ffffff', logoText:'Growth Lab'}), settings:{currency:'EUR'},
    pages:[
      P('Video',[B('badge',{text:'Kostenloses Video-Training', align:'center'}), B('heading',{text:'Wie wir Agenturen zu ==planbaren Neukunden== verhelfen', align:'center', level:2}), B('video',{url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}), B('button',{label:'Kostenloses Erstgespräch sichern', sub:'Nur 4 Termine pro Woche'})]),
      P('Umsatz',[B('choice',{question:'Wie hoch ist dein aktueller Monatsumsatz?', key:'umsatz', options:[O('Unter 10.000 €','',{score:1}),O('10.000 – 30.000 €','',{score:2}),O('30.000 – 100.000 €','',{score:3}),O('Über 100.000 €','',{score:4})]})]),
      P('Herausforderung',[B('choice',{question:'Was ist aktuell deine größte Herausforderung?', desc:'Mehrfachauswahl möglich', key:'herausforderung', layout:'checklist', multi:true, autoNext:false, options:[O('Zu wenig Anfragen'),O('Unplanbarer Umsatz'),O('Keine Zeit für Vertrieb'),O('Team & Prozesse')]}), B('button',{label:'Weiter'})]),
      P('Termin',[B('heading',{text:'Wähle deinen Wunschtermin', level:2}), B('text',{text:'Kostenloses Erstgespräch – such dir einfach einen freien Termin aus.'}), B('calendar',{label:'', dur:'30 Min', where:'Zoom-Call'})]),
      P('Kontakt', contact('Fast geschafft!', 'Wohin dürfen wir die Einladung senden?', 'Termin verbindlich buchen')),
      P('Bestätigung', done('Termin bestätigt', 'Wir sehen uns am **{{termin}}**. Die Einladung kommt per E-Mail.', [B('faq',{items:[{q:'Wie bereite ich mich vor?', a:'Notiere dir deine wichtigsten Ziele für die nächsten 12 Monate.'},{q:'Kann ich den Termin verschieben?', a:'Ja, über den Link in deiner Bestätigungsmail.'}]})]), {hideProgress:true, allowBack:false})
    ]};
}

function tRecruiting(){
  return {name:'Express-Bewerbung', desc:'Bewerbung in 60 Sekunden – ohne Anschreiben und Lebenslauf.', cats:['Recruiting'],
    theme:modern({primary:'#e4572e', logoText:'Muster Haustechnik'}), settings:{currency:'EUR'},
    pages:[
      P('Job',[hero('1676210134188-4c05dd172f89'), B('badge',{text:'Neuss · Vollzeit · ab sofort', align:'left'}), B('heading',{text:'Anlagenmechaniker SHK (m/w/d) gesucht', level:2}), B('list',{items:['Übertarifliche Bezahlung + Weihnachtsgeld','Neuer Firmenwagen – auch privat','4-Tage-Woche möglich','Familiäres Team, feste Baustellen in der Region']}), B('button',{label:'In 60 Sekunden bewerben', sub:'Ohne Anschreiben & Lebenslauf'})]),
      P('Ausbildung',[B('choice',{question:'Hast du eine abgeschlossene Ausbildung im SHK-Bereich?', key:'ausbildung', options:[O('Ja'),O('Nein, aber Berufserfahrung'),O('Nein')]})]),
      P('Erfahrung',[B('choice',{question:'Wie viele Jahre Berufserfahrung hast du?', key:'erfahrung', layout:'grid', options:[O('0–2 Jahre'),O('3–5 Jahre'),O('6–10 Jahre'),O('10+ Jahre')]})]),
      P('Start',[B('choice',{question:'Wann könntest du starten?', key:'start', options:[O('Sofort'),O('In 1 Monat'),O('In 2–3 Monaten'),O('Später')]})]),
      P('Kontakt',[B('heading',{text:'Wie erreichen wir dich?', level:2}), B('input',{label:'Name', placeholder:'Max Mustermann', key:'name'}), B('input',{label:'Telefon / WhatsApp', inputType:'tel', key:'telefon', placeholder:'+49 170 1234567'}), B('input',{label:'E-Mail', inputType:'email', key:'email', placeholder:'max@beispiel.de', required:false}), B('checkbox',{text:'Ich stimme der **Datenschutzerklärung** zu.', key:'einwilligung'}), B('button',{label:'Bewerbung absenden', action:'submit'})]),
      P('Danke', done('Danke für deine Bewerbung, {{vorname|danke}}!', 'Wir melden uns innerhalb von 48 Stunden telefonisch bei dir.'), {hideProgress:true, allowBack:false})
    ]};
}

function tQuiz(){
  var res = function(name, title, img, text){ return P(name,[B('badge',{text:'Dein Ergebnis', align:'center'}), B('heading',{text:title, align:'center', level:2}), B('image',{src:U(img), ratio:'4:3', radius:16, mb:18}), B('text',{text:text, align:'center', mb:18}), B('button',{label:'Zum Produkt', action:'url', url:'https://example.com'})],{hideProgress:true}); };
  var r1 = res('Ergebnis: Kompakt', 'Die Kompakte', '1607273177127-47ec33b5be3f', 'Schnell, unkompliziert und platzsparend – perfekt für deinen Alltag.');
  var r2 = res('Ergebnis: Allrounder', 'Der Vollautomat', '1707241358597-bafcc8a8e73d', 'Vielfalt auf Knopfdruck – von Espresso bis Latte macchiato.');
  var r3 = res('Ergebnis: Barista', 'Die Siebträger-Maschine', '1776548736734-0654a4d8b7ec', 'Für echte Genießer, die volle Kontrolle über jede Tasse wollen.');
  var mail = P('E-Mail',[B('heading',{text:'Dein Ergebnis ist fertig', level:2, align:'center'}), B('text',{text:'Wohin dürfen wir dir deine Empfehlung und 10 % Gutschein senden?', align:'center', mb:18}), B('input',{label:'', placeholder:'Deine E-Mail-Adresse', inputType:'email', key:'email'}), B('checkbox',{text:'Ich möchte den Newsletter erhalten und stimme der **Datenschutzerklärung** zu.', key:'einwilligung'}), B('button',{label:'Ergebnis anzeigen'})]);
  mail.scoreRoutes = [{min:0, max:4, goto:r1.id},{min:5, max:7, goto:r2.id},{min:8, max:99, goto:r3.id}];
  return {name:'Produktfinder-Quiz', desc:'Punktebasiertes Quiz mit individuellen Ergebnisseiten.', cats:['Leads','Verkauf'],
    theme:modern({primary:'#6b3f24', logoText:'brewly'}), settings:{currency:'EUR'},
    pages:[
      P('Start',[hero('1760175445000-0e01e193d1cd'), B('heading',{text:'Welche Kaffeemaschine ==passt zu dir==?', align:'center'}), B('text',{text:'3 Fragen – 30 Sekunden – deine perfekte Empfehlung.', align:'center', mb:22}), B('button',{label:'Quiz starten'})]),
      P('Tassen',[B('choice',{question:'Wie viele Tassen trinkst du am Tag?', key:'tassen', layout:'grid', cols:3, options:[O('1','',{score:1}),O('2–3','',{score:2}),O('4+','',{score:3})]})]),
      P('Wichtig',[B('choice',{question:'Was ist dir am wichtigsten?', key:'prioritaet', options:[O('Geschwindigkeit','',{score:1}),O('Vielfalt','',{score:2}),O('Perfekter Geschmack','',{score:3})]})]),
      P('Budget',[B('choice',{question:'Wie hoch ist dein Budget?', key:'budget', options:[O('Bis 200 €','',{score:1}),O('200 – 600 €','',{score:2}),O('Über 600 €','',{score:3})]})]),
      mail, r1, r2, r3
    ]};
}

function tFeedback(){
  return {name:'Kundenfeedback', desc:'Sterne, NPS und Freitext – mit Weiterleitung zu Google bei 5 Sternen.', cats:['Feedback','Gesundheit'],
    theme:modern({primary:'#111113', logoText:'Salon Mia'}), settings:{currency:'EUR'},
    pages:[
      P('Bewertung',[hero('1600948836101-f9ffda59d250'), B('heading',{text:'Wie war dein Besuch bei uns?', align:'center', level:2}), B('text',{text:'Dein Feedback hilft uns, jeden Tag besser zu werden.', align:'center', mb:22}), B('rating',{label:'', autoNext:true, minLabel:'Schlecht', maxLabel:'Hervorragend'})]),
      P('NPS',[B('rating',{label:'Wie wahrscheinlich empfiehlst du uns weiter?', style:'nps', key:'nps', align:'left', required:true}), B('button',{label:'Weiter'})]),
      P('Freitext',[B('input',{label:'Was können wir besser machen?', inputType:'textarea', key:'feedback', placeholder:'Dein Feedback …', required:false}), B('input',{label:'Name (optional)', key:'name', required:false}), B('button',{label:'Feedback senden', action:'submit'})]),
      P('Danke', done('Danke für dein Feedback!', 'Hat es dir gefallen? Wir freuen uns sehr über eine Google-Bewertung.', [B('button',{label:'Auf Google bewerten', action:'url', url:'https://g.page/r/', icon:'google', iconLeft:true, mt:12})]), {hideProgress:true, allowBack:false})
    ]};
}

function tAbnahme(){
  return {name:'Montage-Abnahme', desc:'Digitales Abnahmeprotokoll mit Checkliste, Foto & Unterschrift.', cats:['Feedback','Handwerk'],
    theme:modern({primary:'#111113', logoText:'Abnahmeprotokoll'}), settings:{currency:'EUR'},
    pages:[
      P('Auftrag',[hero('1786204697642-328c597b6f05', {ratio:'21:9', mb:20}), B('heading',{text:'Montage-Abnahme', level:2}), B('text',{text:'Bitte gemeinsam mit dem Kunden ausfüllen.', mb:16}), B('input',{label:'Auftragsnummer', placeholder:'A-2026-0142', key:'auftrag'}), B('input',{label:'Name des Kunden', placeholder:'Max Mustermann', key:'name'}), B('input',{label:'Datum der Montage', inputType:'date', key:'datum'}), B('button',{label:'Weiter'})]),
      P('Checkliste',[B('choice',{question:'Folgende Punkte wurden geprüft:', key:'checkliste', layout:'checklist', multi:true, autoNext:false, required:true, options:[O('Montage vollständig'),O('Funktion getestet'),O('Baustelle gereinigt'),O('Einweisung erfolgt'),O('Unterlagen übergeben')]}), B('button',{label:'Weiter'})]),
      P('Zufriedenheit',[B('rating',{label:'Wie zufrieden ist der Kunde mit der Ausführung?'}), B('input',{label:'Festgestellte Mängel', inputType:'textarea', key:'maengel', placeholder:'Keine', required:false}), B('upload',{label:'Foto der Montage', key:'foto'}), B('button',{label:'Weiter'})]),
      P('Unterschrift',[B('heading',{text:'Abnahme bestätigen', level:2}), B('text',{text:'Hiermit bestätigt der Kunde die ordnungsgemäße Ausführung der Arbeiten.', mb:16}), B('signature',{label:'Unterschrift Kunde'}), B('checkbox',{text:'Ich bestätige die Richtigkeit der Angaben.', key:'bestaetigung'}), B('button',{label:'Abnahme abschließen', action:'submit'})]),
      P('Fertig', done('Abnahme gespeichert', 'Das Protokoll für Auftrag **{{auftrag}}** wurde übermittelt.'), {hideProgress:true, allowBack:false})
    ]};
}

function tFreebie(){
  return {name:'Lead-Magnet', desc:'Freebie / Checkliste gegen E-Mail – einfach & schnell.', cats:['Leads'],
    theme:modern({primary:'#8a6a3d', logoText:'Atelier Nord'}), settings:{currency:'EUR'},
    pages:[
      P('Freebie',[hero('1672627170267-fca17bb54156'), B('badge',{text:'Kostenlose PDF-Checkliste', align:'left'}), B('heading',{text:'Die 7 größten Fehler beim Hausbau'}), B('text',{text:'Was Bauherren am meisten Geld kostet – und wie du es vermeidest.', mb:16}), B('list',{items:['Versteckte Kosten erkennen','Den richtigen Partner finden','Zeitplan realistisch planen']}), B('input',{label:'', placeholder:'Deine E-Mail-Adresse', inputType:'email', key:'email'}), B('checkbox',{text:'Ich stimme der **Datenschutzerklärung** zu.', key:'einwilligung'}), B('button',{label:'Checkliste kostenlos erhalten', action:'submit'})]),
      P('Danke', done('Check dein Postfach', 'Die Checkliste ist auf dem Weg zu dir.'), {hideProgress:true, allowBack:false})
    ]};
}

function tMontage(){
  var A = '/assets/gehlen-feedback/';
  var start = P('Bewertung',[]), pos = P('Positiv',[]), neg = P('Negativ',[]), back = P('Rückmeldung',[]), cont = P('Kontakt',[]), thanks = P('Danke',[],{hideProgress:true, allowBack:false});
  var face = function(e, l, sc, g){ return O(l, e, {score:sc, goto:g}); };
  start.blocks = [
    B('badge',{text:'Es dauert nur 1 Minute', variant:'filled', align:'center', mb:22}),
    hero('1505798577917-a65157d3320a', {mb:26}),
    B('heading',{text:'Wie zufrieden waren Sie mit unserer __Montage__?', level:2, align:'center', mb:24}),
    B('choice',{question:'', key:'zufriedenheit', layout:'scale', faceStyle:'flat', autoNext:true, required:true, minLabel:'sehr schlecht', maxLabel:'sehr gut', options:[face('😥','Sehr schlecht',1,neg.id),face('🙁','Schlecht',2,neg.id),face('😐','Okay',3,neg.id),face('🙂','Gut',4,pos.id),face('😀','Sehr gut',5,pos.id)]})
  ];
  pos.blocks = [
    B('badge',{text:'Nur eine Frage', variant:'filled', align:'center', mb:18}),
    B('heading',{text:'Das freut uns sehr!\nWas hat Ihnen besonders gut gefallen?', level:2, align:'center', mb:24}),
    B('choice',{question:'', key:'positiv', layout:'checklist', multi:true, autoNext:false, required:true, options:[O('Tolle Beratung'),O('Montageteam vor Ort'),O('Sauberkeit der Baustelle'),O('Kommunikation & Terminplanung'),O('Sonstiges','',{sub:'Bitte geben Sie uns unten hierzu Details'})]}),
    B('input',{label:'', placeholder:'Könnten Sie uns kurz mehr dazu sagen?', inputType:'textarea', key:'details_positiv', required:false}),
    B('button',{label:'Anonym abschicken', action:'submit', target:thanks.id, variant:'gradient', btnBg:'#000000', icon:'plane', iconLeft:true})
  ];
  neg.blocks = [
    B('heading',{text:'Was lief nicht so gut?', level:1, align:'center', mb:8}),
    B('text',{text:'Konkretes Feedback ist sehr wichtig für uns, damit wir uns in diesen Bereichen verbessern können.', align:'center', mb:26}),
    B('choice',{question:'', key:'negativ', layout:'checklist', multi:true, autoNext:false, required:true, options:[O('Montagequalität'),O('Sauberkeit der Baustelle'),O('Kommunikation'),O('Terminverzug'),O('Funktion nicht wie erwartet'),O('Sonstiges','',{sub:'Bitte gehen Sie unten weiter darauf ein.'})]}),
    B('badge',{text:'Details zu Ihrem Anliegen', variant:'grey', upper:true, align:'center', mt:8, mb:6}),
    B('text',{text:'Dies ist optional, hilft uns aber enorm weiter', align:'center', mb:12}),
    B('input',{label:'', placeholder:'Bitte schildern Sie uns kurz, was passiert ist.', inputType:'textarea', key:'details_negativ', required:false}),
    B('button',{label:'Weiter geht\'s', icon:'arrow'})
  ];
  back.blocks = [
    B('badge',{text:'Nur noch 1 Schritt. Versprochen', variant:'filled', align:'center', mb:18}),
    B('heading',{text:'Wir würden das gerne wieder gut machen.', level:2, align:'center', mb:10}),
    B('text',{text:'Dürfen wir uns persönlich bei Ihnen melden und eine Lösung finden?', align:'center', mb:26}),
    B('choice',{question:'', key:'rueckmeldung', layout:'image', ratio:'4:3', options:[O('Ja, gerne!','',{img:A+'kontakt-ja.jpg', goto:cont.id}),O('Nein, das passt schon …','',{sub:'Ihr Feedback wird anonym abgesendet.', img:A+'kontakt-nein.png', pos:'75% 50%', goto:thanks.id})]})
  ];
  cont.blocks = [
    B('image',{src:A+'kontakt.jpg', alt:'', ratio:'2:1', radius:12, mb:24}),
    B('heading',{text:'Hinterlassen Sie uns bitte kurz Ihre Kontaktdaten und wir melden uns bei Ihnen.', level:2, align:'center', mb:10}),
    B('text',{text:'Ihre Daten werden **ausschließlich** zur Kontaktaufnahme bezüglich Ihres Feedbacks verwendet.', align:'center', mb:22}),
    B('input',{label:'', placeholder:'Vorname', key:'vorname', half:true, mb:12}),
    B('input',{label:'', placeholder:'Nachname', key:'nachname', half:true, mb:12, required:false}),
    B('input',{label:'', placeholder:'Ihre E-Mail-Adresse', inputType:'email', key:'email'}),
    B('checkbox',{text:'Ich stimme zu, dass wir Sie zu Ihrem Feedback per E-Mail kontaktieren dürfen.', key:'einwilligung'}),
    B('button',{label:'Mein Feedback absenden', action:'submit', target:thanks.id, variant:'gradient', btnBg:'#000000', icon:'plane', iconLeft:true})
  ];
  thanks.blocks = done('Vielen Dank für Ihr Feedback!', 'Ihre Rückmeldung hilft uns, jeden Tag ein Stück besser zu werden.');
  return {name:'Montage-Feedback', desc:'Emoji-Bewertung mit Verzweigung: positiv → Lob, negativ → Rückruf-Angebot.', cats:['Feedback','Handwerk'],
    theme:modern({primary:'#5b8c2a', logoText:'Ihr Logo', backButton:false}), settings:{currency:'EUR', address:'sie'}, pages:[start, pos, neg, back, cont, thanks]};
}

/* Massivholztisch-Konfigurator – 1:1-Nachbau des Onepage-Funnels von Holz Gehlen */
function tGehlen(){
  var A = '/assets/gehlen/';
  var img = function(n, extra){ return Object.assign({src:A+n, radius:16, ratio:'2:1', mb:40}, extra||{}); };
  var q = function(text, extra){ return B('heading',Object.assign({text:text, level:1, size:32, fw:500, align:'center', mb:80}, extra||{})); };
  var card = function(label, file, extra){ return O(label, '', Object.assign({img:A+file}, extra||{})); };
  var pill = function(text, extra){ return B('badge',Object.assign({text:text, variant:'filled', align:'center', scale:80, fw:400, mb:24}, extra||{})); };

  var pAussen = P('Aussengestell',[
    B('image',img('bild-gestell.jpg')),
    q('Welches Aussengestell gefällt Dir?', {fw:700, mb:56}),
    B('choice',{question:'', key:'aussengestell', layout:'image', ratio:'4:3', colsD:4, options:[
      card('Octo','aussengestell-octo.jpg',{sub:'Markant & stabil'}), card('X-Gestell','aussengestell-x-gestell.jpg',{sub:'Klassisch & kraftvoll', pos:'left top'}),
      card('U-Gestell','aussengestell-u-gestell.jpg',{sub:'Schlicht & modern'}), card('A-Gestell','aussengestell-a-gestell.jpg',{sub:'Offen & leicht'}),
      card('Trapez','aussengestell-trapez.jpg',{sub:'Elegant & geradlinig'}), card('Straight','gestell-aussengestell.jpg',{sub:'Schlicht & Zeitlos'})]})]);
  var pZentral = P('Zentralgestell',[
    B('image',img('bild-gestell.jpg')),
    q('Welches Zentralgestell gefällt Dir?', {fw:700, mb:56}),
    B('choice',{question:'', key:'zentralgestell', layout:'image', ratio:'1:1', colsD:4, options:[
      card('Spider','zentralgestell-spider.jpg',{sub:'Modern & markant'}), card('Mikado','zentralgestell-mikado.jpg',{sub:'Dynamisch & elegant', pos:'left top'}),
      card('Spider Six','zentralgestell-spider-six.jpg',{sub:'Kraftvoll & präsent'}), card('Thor','zentralgestell-thor.jpg',{sub:'Massiv & markant'}),
      card('V-Design','zentralgestell-v-design.jpg',{sub:'Leicht & modern'})]})]);
  var pMasse = P('Personen & Maße',[
    pill('NUR NOCH 1 SCHRITT. VERSPROCHEN'),
    B('image',img('bild-masse.jpg')),
    q('Wieviele Personen sollen am Tisch Platz finden?', {fw:700, mb:24}),
    B('choice',{question:'', key:'personen', layout:'checklist', autoNext:false, required:true, mb:36, options:[
      O('bis zu 4 Personen',''), O('6 Personen',''), O('8 Personen',''), O('10+ Personen',''), O('noch nicht sicher','')]}),
    pill('OPTIONAL', {variant:'grey', scale:96, mb:20}),
    B('heading',{text:'Falls du schon ein Wunschmaß hast, kannst du es hier ergänzen.', level:3, size:17.5, fw:700, align:'center', mb:20}),
    B('input',{label:'Länge', placeholder:'320mm', inputType:'number', key:'laenge', required:false, align:'center', mb:24}),
    B('input',{label:'Breite', placeholder:'130mm', inputType:'number', key:'breite', required:false, align:'center', mb:40}),
    B('button',{label:'Letzter Schritt', full:false, shadow:false, icon:'none', align:'center', mb:24})]);
  var pDanke = P('Finish',[
    B('image',{src:A+'bild-finish.png', radius:0, ratio:'auto', mb:24}),
    B('heading',{text:'💚', level:1, size:32, fw:500, align:'center', mb:12}),
    B('heading',{text:'Vielen Dank. Wir bereiten Dein Angebot vor und schicken es Dir zu!', level:2, size:22, fw:500, align:'center'})],{allowBack:false});
  var pKontakt = P('Kontakt',[
    pill('LETZTER SCHRITT', {scale:96}),
    q('An wen dürfen wir unser unverbindliches Angebot schicken?', {fw:700, mb:4}),
    B('text',{text:'🔒 Wir senden Dir niemals Spam zu. Versprochen!', align:'center', size:16, color:'#2b2a2b', mb:72}),
    B('input',{label:'Dein Vorname', placeholder:'Vorname', key:'vorname', required:false, half:true, mb:20}),
    B('input',{label:'Dein Nachname', placeholder:'Nachname', key:'nachname', required:false, half:true, mb:20}),
    B('input',{label:'Deine Email-Adresse', placeholder:'beispiel@gmx.de', inputType:'email', key:'email', required:true, mb:20}),
    pill('OPTIONAL', {variant:'grey', scale:96, mb:20}),
    B('input',{label:'Falls wir eine Rückfrage haben (optional)', placeholder:'Deine Telefonnummer', inputType:'tel', key:'telefon', required:false, align:'center', mb:28}),
    B('checkbox',{text:'Ich stimme den [Datenschutzbestimmungen zu](https://www.holz-gehlen.de/datenschutzerklaerung)', key:'datenschutz', required:true, mb:36}),
    B('button',{label:'Angebot anfordern', sub:'KOSTENLOS & UNVERBINDLICH', subIn:true, action:'next', variant:'gradient', btnBg:'#42423f', radiusOn:true, radius:8, icon:'check', iconLeft:true, mb:48}),
    B('testimonial',{quote:'', name:'Kai Gehlen', role:'Verkaufsleiter', stars:5, img:A+'kai-gehlen.png'})]);

  var pGestell = P('Gestell',[
    B('image',img('bild-gestell.jpg')),
    q('Welche Gestellart bevorzugst Du?', {fw:700, mb:56}),
    B('choice',{question:'', key:'gestell', layout:'image', ratio:'1:1', colsD:4, options:[
      card('Zentralgestell','gestell-zentralgestell.jpg',{pos:'center bottom', goto:pZentral.id}),
      card('Aussengestell','gestell-aussengestell.jpg',{pos:'right center', goto:pAussen.id})]})]);
  pAussen.next = pMasse.id;

  var css = [
    '.fp.prog-top .fp-top{padding-top:56px}',
    '.fp.prog-top .fp-prog{margin:0 0 43px;height:6px;background:rgba(43,42,43,.1)}',
    '.fp-body{padding-top:30px}',
    '.fp-h1,.fp-h2,.fp-h3{line-height:1.3}',
    '.fp-txt{font-size:20px;line-height:1.5;color:var(--tx)}',
    '.fp-txt strong{color:var(--p)}',
    '.fp-badge{border-radius:6px;padding:5px 12px;font-weight:inherit;letter-spacing:0}',
    '.fp-lbl .rq{display:none}',
    '.fp-badge.grey{background:#f2f2f2;color:var(--tx)}',
    '.fp-opts{gap:13px}',
    '.fp-opt{border:1px solid rgba(43,42,43,.08);font-size:13px;font-weight:400;line-height:1.45}',
    '.fp-opt:hover{border-color:rgba(43,42,43,.2);box-shadow:0 4px 14px -6px rgba(0,0,0,.18)}',
    '.fp-opt.sel{border-color:rgba(43,42,43,.35);background:var(--sf)}',
    '.fp-opts.image .fp-opt .lbl{padding:8px 12px 9px}',
    '.fp-opts.image .fp-opt .im{background-color:#fff}',
    '.fp-opts.image .fp-opt .chk{display:none}',
    '.fp-opt .sub{font-size:11px;margin-top:0;color:#6f6e6f}',
    '.fp-opts.checklist{gap:12px}',
    '.fp-opts.checklist .fp-opt{min-height:40px;padding:0 12px;font-size:13px;border:1px solid rgba(43,42,43,.08);background:var(--sf)}',
    '.fp-opts.checklist .fp-opt .chk{width:20px;height:20px;border-radius:50%;border:0;background:rgba(43,42,43,.1)}',
    '.fp-opts.checklist .fp-opt.sel{font-weight:600}',
    '.fp-opts.checklist .fp-opt.sel{border-color:rgba(43,42,43,.35);background:var(--sf)}',
    '.fp-opts.checklist .fp-opt.sel .chk{background:rgba(43,42,43,.3)}',
    '.fp-lbl{font-size:13px;font-weight:600;margin-bottom:8px}',
    '.fp-in{padding:10px 12px;font-size:13px;border:1px solid rgba(43,42,43,.15)}',
    '.fp-in[type=number]{padding:13px 14px;font-size:14px;-moz-appearance:textfield}',
    '.fp-in::-webkit-outer-spin-button,.fp-in::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}',
    '.fp-in:focus{box-shadow:0 0 0 3px rgba(170,197,32,.25)}',
    '.fp-iw .ii svg{display:none}',
    '.fp-iw:not(:has(input[type=tel])) .ii{display:none}',
    '.fp-iw:not(:has(input[type=tel])) .ii+.fp-in{padding-left:12px}',
    '.fp-iw:has(input[type=tel]) .ii::before{content:"🇩🇪";font-size:20px}',
    '.fp-cb{font-size:15px;color:var(--tx);align-items:center}',
    '.fp-cb .box{width:22px;height:22px;border-radius:4px;border:1.5px solid rgba(43,42,43,.25)}',
    '.fp-btn{font-size:15px;min-height:56px;padding:7px 28px}',
    '.fp-btn.auto{width:auto}',
    '.fp-btn.two:not(.gradient){box-shadow:0 0 0 3px rgba(170,197,32,.3)}',
    '.fp-btn.two:not(.gradient) .sb{font-size:12px}',
    '.fp-btn.gradient{font-size:18px;padding:12px 24px;justify-content:center;gap:28px;min-height:97px}',
    '.fp-btn.gradient .tx{align-items:flex-start;text-align:left}',
    '.fp-btn.gradient .sb{font-size:14.4px;opacity:.9}',
    '.fp-btn.gradient svg{width:34px;height:34px;padding:7px;border-radius:5px;background:#5fb15a;stroke:#fff;stroke-width:3}',
    '.fp-testi{background:none;padding:0;display:grid;grid-template-columns:auto auto;justify-content:center;align-items:center;column-gap:40px;row-gap:2px}',
    '.fp-testi .st{grid-column:2;margin:0;color:#f5a623;font-size:16px}',
    '.fp-testi .au{display:contents}',
    '.fp-testi .av{grid-column:1;grid-row:1/span 2;width:72px;height:72px}',
    '.fp-testi .au>div:last-child{grid-column:2}',
    '.fp-testi .nm{font-size:16px;font-weight:700}',
    '.fp-testi .ro{font-size:13px;color:var(--tx)}',
    '@container (min-width:640px){.fp-body{max-width:599px}.fp .fp-top,.fp.wide .fp-body{max-width:1198px}.fp.prog-top .fp-top{padding-top:114px}.fp.prog-top .fp-prog{margin-bottom:34px}.fp-logo img{max-height:51px!important;max-width:none!important}}'
  ].join('\n');

  return {name:'Massivholztisch-Konfigurator', desc:'Tischform, Kante, Ölung & Gestell wählen – mit Verzweigung und Angebotsanfrage (Holz Gehlen).', cats:['Konfigurator','Leads'],
    theme:theme('clean',{primary:'#aac520', primaryText:'#ffffff', bg:'#ffffff', surface:'#f4f4f4', text:'#2b2a2b', muted:'#6f6e6f', font:'Inter Tight', headingFont:'Onest', radius:6, btnRadius:4,
      headingWeight:500, headingLs:0, lineHeight:1.5, logoImg:A+'logo.png', logoH:46, progress:'bar', progressTop:true, backButton:false, animation:'slide', pad:24, btnPad:7, btnWeight:600, customCss:css}),
    settings:{currency:'EUR', basePrice:0},
    pages:[
      P('Start',[
        pill('IN 1 MINUTE ZUM WUNSCHTISCH-ANGEBOT', {scale:96, fw:700, mb:39}),
        B('image',img('bild-start.jpg',{mb:41})),
        B('heading',{text:'Konfiguriere jetzt deinen individuellen Massivholztisch', level:1, size:32, fw:700, align:'center', mb:12}),
        B('text',{text:'...und erhalte ein **kostenloses & unverbindliches** Angebot von uns!', align:'center', mb:40}),
        B('button',{label:'Konfigurator starten', sub:'Es dauert nur 1 Minute', subIn:true, icon:'none', shadow:false})],{wide:true}),
      P('Form',[
        q('Welche Form soll dein Massivholztisch haben?'),
        B('choice',{question:'', key:'tischform', layout:'image', ratio:'1:1', colsD:4, options:[
          card('Eckig','form-eckig.jpg',{pos:'41% 57%'}), card('rund','form-rund.jpg'), card('oval','form-oval.jpg'), card('organisch','form-organisch.jpg')]})]),
      P('Kante',[
        q('Welche Kante passt zu Deinem Tisch?'),
        B('choice',{question:'', key:'kante', layout:'image', ratio:'1:1', colsD:4, options:[
          card('Naturbaumkante','auswahl-kante-naturbaumkante.jpg',{sub:'natürlich und lebendig'}), card('gerade Kante','auswahl-kante-gerade-kante.png',{sub:'klar und modern', pos:'37% 61%'}),
          card('Schweitzer Kante','auswahl-kante-schweitzer-kante.jpg',{sub:'Fein und elegant', pos:'41% 75%'}), card('noch offen','auswahl-kante-noch-offen.jpg',{sub:'Wir beraten Dich gerne'})]})]),
      P('Ölung',[
        q('Hast Du Dich schon für eine Ölung entschieden?', {size:28}),
        B('choice',{question:'', key:'oelung', layout:'image', ratio:'16:9', colsD:4, options:[
          card('Light Oak','oelung-light-oak.jpg'), card('Beton','oelung-beton.jpg',{pos:'37% 61%'}), card('Gekalte','oelung-gekalte.jpg',{pos:'41% 75%'}),
          card('Rustikal','oelung-rustikal.jpg'), card('Vintage Grey','oelung-vintage-grey.jpg'), card('Natura Roh','oelung-natura-roh.jpg'),
          card('Disel Grey','oelung-disel-grey.jpg'), card('Smoked','oelung-smoked.jpg'), card('Wenge','oelung-wenge.jpg'),
          card('Weiss','oelung-weiss.jpg'), card('Natura Natur','oelung-natura-natur.jpg'), card('Ich bin noch unsicher','auswahl-kante-noch-offen.jpg',{sub:'Wir beraten Dich gerne!'})]})]),
      pGestell, pAussen, pZentral, pMasse, pKontakt, pDanke]};
}

/* Feedback-Funnel Kölner Zoo – Nachbau des Onepage-Funnels mit Smiley-Weiterleitung und drei Endseiten */
/* ---------- Feedback-Funnels 1:1 aus Onepage (Kölner Zoo, Schwimmbad): gleicher Aufbau, eigene Texte, Antworten und Bilder ----------
   Feldnamen = Onepage-Slugs, Antwort-IDs = Onepage-_id, Seitennamen = Onepage-Schritttitel, opStep = Onepage-Schrittnummer.
   Damit erzeugt der Webhook im Onepage-Format dieselben Schlüssel (data.fieldsMap „Step N. Schritt -> Slug“). */
function tFeedbackOp(c){
  var A = c.assets, PRI = c.primary;
  var h = function(text, extra){ return B('heading', Object.assign({text:text, level:1, size:30, fw:700, align:'center', mb:10}, extra||{})); };
  var badge = function(text){ return B('badge', {text:text, variant:'filled', upper:true, align:'center', fw:700, scale:96, mb:28}); };
  var img = function(file, ratio, pos, extra){ return B('image', Object.assign({src:A+file, alt:'', radius:16, ratio:ratio, mb:36}, pos ? {pos:pos} : {}, extra||{})); };
  var heart = function(){ return B('heading', {text:'💚', level:1, size:30, fw:500, align:'center', mb:8}); };
  /* [Label, Onepage-_id, Beschreibung] – Beschreibung nur, wenn Onepage eine hat (auch leer) */
  var opts = function(items){ return items.map(function(l){ var o = O(l[0], '', {oid:l[1]}); if(l.length > 2){ o.odesc = l[2]; if(l[2]) o.sub = l[2]; } return o; }); };
  var btn = function(label, extra){ return B('button', Object.assign({label:label, full:false, shadow:false, icon:'none', align:'center', btnBg:PRI, mt:8}, extra||{})); };
  var note = function(){ return B('input', {label:'', placeholder:'Magst du uns kurz mehr dazu sagen?', inputType:'textarea', key:'Kommentar zum Grund', rows:5, required:false, mb:24}); };
  var MUST = 'Wählen Sie mindestens eine Option', REQ = 'Feld ist erforderlich';

  var pGoogle = P('Finish Bewertung', [img(c.img.google, c.heroRatio, c.pos.google), heart(),
    h('Würdest du uns eine positive Bewertung auf Google dalassen?', {size:24}),
    B('text', {text:c.googleText || 'Das würde uns als familiengeführtes Unternehmen sehr weiterhelfen!', align:'center', mb:28}),
    btn('Jetzt auf Google bewerten', {action:'url', url:c.googleUrl, full:true})], {opStep:9, allowBack:false, submitOnEnter:true, autoButton:false});
  var pDankeNein = P('Finish NEIN', [img(c.img.nein, c.heroRatio, c.pos.nein), heart(),
    h('Danke für dein ehrliches Feedback 🙌', {size:24}),
    B('text', {text:'Auch anonymes Feedback hilft uns dabei, besser zu werden und Probleme schneller zu erkennen.', align:'center', mb:16}),
    B('text', {text:'Als kleines Dankeschön, dass du dir die Zeit für das ehrliche Feedback genommen hast, findest du '+(c.voucherUrl ? '[hier]('+c.voucherUrl+')' : '**hier**')+' einen Gutschein für deinen nächsten Besuch. Vielleicht können wir es ja dann wieder gut machen :)', align:'center'})], {opStep:8, allowBack:false, submitOnEnter:true, autoButton:false});
  var pDankeJa = P('Finish', [img(c.img.finish, c.heroRatio, c.pos.finish), heart(),
    h('Vielen Dank für dein ehrliches Feedback - wir kümmern uns sofort darum!', {size:24})], {opStep:7, allowBack:false, submitOnEnter:true, autoButton:false});
  var pKontakt = P('Kontakt ja', [
    img(c.img.kontakt, '3:2', c.pos.kontakt, {mb:32}),
    h('Hinterlasse uns bitte kurz deine Kontaktdaten und wir melden uns bei dir.'),
    B('text', {text:'🔒 Deine Daten werden ***ausschließlich*** zur Kontaktaufnahme bezüglich deines Feedbacks verwendet.', align:'center', mb:32}),
    B('input', {label:'', placeholder:'Vorname', key:'name.firstName', required:true, errorText:REQ, half:true, mb:12}),
    B('input', {label:'', placeholder:'Nachname (optional)', key:'name.lastName', required:false, half:true, mb:12}),
    B('input', {label:'', placeholder:'Deine E-Mail Adresse', inputType:'email', key:'email-adresse', required:true, errorText:REQ, mb:20}),
    B('checkbox', {text:c.consent, key:'zustimmung', oid:c.ids.consent, required:true, errorText:MUST, mb:24}),
    btn('Mein Feedback absenden', {action:'page', target:pDankeJa.id})], {opStep:6});
  var pWunsch = P('Kontakt gewünscht', [badge('NUR NOCH 1 SCHRITT'),
    h('Wir würden das gerne wieder gut machen.'),
    B('text', {text:'Dürfen wir uns **per Email** persönlich bei dir melden und eine Lösung finden?', align:'center', mb:32}),
    B('choice', {question:'', key:'Kontaktwunsch', layout:'image', ratio:'4:3', required:false, autoNext:true, options:[
      O('Ja, gerne!', '', {oid:c.ids.ja, odesc:'Du kannst Auswählen in welcher Form wir Dich kontaktieren dürfen.', img:A+c.img.ja, pos:c.pos.ja, sub:'Du kannst Auswählen in welcher Form wir Dich kontaktieren dürfen.', goto:pKontakt.id}),
      O('Nein, das passt schon...', '', {oid:c.ids.nein, img:A+c.img.nein2, pos:c.pos.nein2, goto:pDankeNein.id})]})], {opStep:4});
  var pGut = P('Was hat gut gefallen', [
    h('😊 Das freut uns sehr!\nWas hat dir besonders gut gefallen?', {mb:32}),
    B('choice', {question:'', key:'lob', layout:'checklist', multi:true, autoNext:false, required:true, errorText:MUST, mb:16, options:opts(c.lob)}),
    note(),
    btn('Weiter geht\'s')], {opStep:3, next:pGoogle.id});
  var pProblem = P('Problem', [
    h('😲\nSchade, dass nicht alles perfekt lief.', {mb:4}),
    B('text', {text:'Was können wir verbessern?', align:'center', mb:32}),
    B('choice', {question:'', key:'Problemgrund', layout:'checklist', multi:true, autoNext:false, required:true, errorText:MUST, mb:16, options:opts(c.problem)}),
    note(),
    btn('Weiter geht\'s')], {opStep:2, next:pWunsch.id});
  var pStart = P('Grundstimmung', [badge('Es dauert nur 2 minuten'), img(c.img.start, c.startRatio, null),
    h(c.start.head, {mb:8}),
    B('text', {text:c.start.sub, align:'center', size:13, mb:36}),
    B('rating', {label:'', style:'emoji', max:5, emojis:'😥 🙁 😐 🙂 😀', key:'Grundstimmung', autoNext:true, required:true, align:'left', minLabel:'nicht so gut', maxLabel:'mega zufrieden',
      routes:[{min:1, max:3, goto:pProblem.id}, {min:4, max:5, goto:pGut.id}]})], {opStep:1});

  var css = [
    '.fp.prog-top .fp-top{padding-top:56px}',
    '.fp.prog-top .fp-prog{margin:0 0 40px;height:6px;background:rgba(43,42,43,.1)}',
    '.fp-body{padding-top:24px}',
    '.fp-h1,.fp-h2,.fp-h3{line-height:1.3}',
    '.fp-txt{font-size:16px;line-height:1.5;color:var(--tx)}',
    '.fp-badge{border-radius:6px;padding:5px 12px;font-weight:inherit;letter-spacing:0;text-transform:uppercase}',
    '.fp-ul .fp-ulsv{color:var(--p)}',
    '.fp-emo{gap:12px}.fp-emo button{border-radius:6px;background:rgba(43,42,43,.05);box-shadow:inset 0 0 0 1px rgba(43,42,43,.1);height:50px;font-size:24px}',
    '.fp-rlab{font-size:13.5px;color:var(--tx);margin-top:8px}',
    '.fp-opts.checklist{gap:12px}',
    '.fp-opts.checklist .fp-opt{min-height:40px;padding:0 12px;font-size:13px;border:1px solid rgba(43,42,43,.08);background:#f8f9f9}',
    '.fp-opts.checklist .fp-opt .chk{width:20px;height:20px;border-radius:4px;border:0;background:rgba(43,42,43,.1)}',
    '.fp-opts.checklist .fp-opt.sel{border-color:rgba(43,42,43,.35);background:#f8f9f9;font-weight:600}',
    '.fp-opts.checklist .fp-opt.sel .chk{background:rgba(43,42,43,.3)}',
    '.fp-opt .sub{font-size:11px;margin-top:0;color:#6f6e6f}',
    '.fp-opts.image{gap:13px}.fp-opts.image .fp-opt{border:1px solid rgba(43,42,43,.08);font-size:13px;font-weight:400}.fp-opts.image .fp-opt .chk{display:none}.fp-opts.image .fp-opt .lbl{padding:8px 12px 9px}',
    '.fp-in{padding:10px 12px;font-size:14px;border:1px solid rgba(43,42,43,.15)}',
    'textarea.fp-in{min-height:100px}',
    '.fp-iw .ii{display:none}.fp-iw .ii+.fp-in{padding-left:12px}',
    '.fp-cb{font-size:14px;color:var(--tx)}',
    '.fp-btn{font-size:15px;min-height:56px;padding:7px 28px}',
    '.fp-btn.auto{width:auto}',
    '.fp-lbl .rq{display:none}',
    '@container (min-width:640px){.fp-body{max-width:599px}.fp .fp-top{max-width:1198px}.fp.prog-top .fp-top{padding-top:114px}.fp.prog-top .fp-prog{margin-bottom:34px}}'
  ].join('\n');

  return {name:c.name, desc:c.desc, cats:['Feedback'],
    theme:theme('clean', {primary:PRI, primaryText:'#ffffff', bg:'#ffffff', surface:'#f4f4f4', text:'#2b2a2b', muted:'#6f6e6f', font:'Inter Tight', headingFont:'Onest', radius:6, btnRadius:4,
      headingWeight:700, headingLs:0, lineHeight:1.5, logoImg:A+'logo.png', logoH:c.logoH, progress:'bar', progressTop:true, backButton:false, animation:'slide', pad:24, btnPad:7, btnWeight:600, customCss:css}),
    settings:{currency:'EUR', basePrice:0, address:'du', webhookFormat:'onepage', onepageForm:c.form, onepageFormId:c.formId, onepageSiteId:'7e7ce4b6-1606-4c36-9ae6-58d3b6f1b8e2'},
    pages:[pStart, pProblem, pGut, pWunsch, pKontakt, pDankeJa, pDankeNein, pGoogle]};
}
/* Google-Link des Kölner Zoos aus dem Onepage-Original. Beim Schwimmbad: echten Bewertungslink im Editor eintragen (Button auf der Seite „Finish Bewertung“). */
var OP_GOOGLE_ZOO = 'https://www.google.com/search?sa=X&sca_esv=78c86333cbc36880&rlz=1C5CHFA_enDE1140DE1141&sxsrf=ANbL-n7VOuwxj2R-8ihUcZUnmF8av9fj5Q:1779285917503&q=K%C3%B6lner+Zoo+Rezensionen&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxI2M7Q0MTEzMjAzMrMwMjY0szA23MDI-IpR3Pvwtpy81CKFqPx8haDUqtS84sz8vNS8Ray4ZABYOw3mTgAAAA&rldimm=6194462062682316831&tbm=lcl&hl=de-DE&ved=2ahUKEwjz6MPIhMiUAxU2BdsEHZ6YLaQQ9fQKegQIZxAG&biw=2465&bih=1265&dpr=1#lkt=LocalPoiReviews&lrd=0x47bf25931b47f54b:0x55f7266d24d0201f,3,,,,';
function tZoo(){
  return tFeedbackOp({name:'Feedback-Funnel Kölner Zoo', desc:'Smiley-Bewertung mit Weiterleitung: Zufriedene zu Google, Unzufriedene zu Kontakt oder Gutschein. 1:1 aus Onepage inklusive Webhook-Feldern.',
    assets:'/assets/koelner-zoo/', primary:'#0d5b43', logoH:35, form:'Kölner Zoo', formId:'r3e9cvLW6ncc3pGPglgba', startRatio:'7:3', heroRatio:'7:3', googleUrl:OP_GOOGLE_ZOO, consent:'Ich stimme zu, dass der Kölner Zoo mich zu meinem Feedback per E-Mail schriftlich kontaktieren darf.',
    start:{head:'🦁\nWie hat Dir __Dein Besuch__ im Kölner Zoo gefallen?', sub:'Dein Feedback hilft uns dabei, den Zoo für alle Besucher\nnoch schöner zu machen.'},
    img:{start:'tiere.jpg', finish:'tiere.jpg', nein:'tiere.jpg', google:'tiere.jpg', kontakt:'kontakt.jpg', ja:'kontakt-ja.jpg', nein2:'kontakt-nein.jpg'},
    pos:{finish:'50% 50%', nein:'50% 50%', google:'50% 41%', kontakt:'50% 50%', ja:'50% 15%', nein2:'50% 39%'},
    ids:{ja:'aH8NL8THqR6sj28wqLkCV', nein:'FmSogJroNt0EVbJcFdfpG', consent:'aNrA32aDYh9x0YLhFgU5e'},
    problem:[['Wartezeiten','qIA6vcKO7As6aC516PK4p',''],['Sauberkeit','8IJs3ZIaAES_5S_uDSziU'],['Gastronomie','WnGOck3diP5eNtnkwBoHP'],['Preise','FdRVShKXQ_I5miMvPpwq4'],['Tierbereiche','tFoowdcg6_peHGriJuI_0'],['Freundlichkeit','cPYcb7HJnGtjUgm9in_U_',''],['Orientierung im Zoo','a2a8c89e-4994-4e55-b101-4e25fdaa813f',''],['Toiletten','ba0ff39b-8055-4f93-8bbd-e6b3585e5a44'],['Sonstiges','b5eec26a-8d69-494a-b9a8-c7371d29bbda','Bitte gehe unten weiter darauf ein.']],
    lob:[['Tieranlagen','PZElkO1Fbms9pfNPCC5Ge',''],['Sauberkeit','-lGeNXUJFuKC6nVJc1YBA'],['Gastronomie','8-Dlsij4H3h44SPNnuhc-'],['Freundlichkeit der Mitarbeiter','oaukBRtdjmoLq7O1uSRIU',''],['Atmosphäre','b8beca56-90d1-4b38-b27b-dfda9d382d4e'],['Spielplätze','d0a9759a-8b0a-434c-897c-cee6a389d907'],['Organisation','50941cf0-cc9d-4c0c-ae07-86d5ecd06fe2'],['Sonstiges','297363f3-7cfa-4d96-a9a4-e96ce2f9aa2d','Bitte gehe unten weiter darauf ein.']]});
}
function tSchwimmbad(){
  return tFeedbackOp({name:'Feedback-Funnel Schwimmbad', desc:'Smiley-Bewertung mit Weiterleitung: Zufriedene zu Google, Unzufriedene zu Kontakt oder Gutschein. 1:1 aus Onepage inklusive Webhook-Feldern.',
    assets:'/assets/schwimmbad/', primary:'#ca0333', logoH:24, form:'Schwimmbad', formId:'jpn8z5DyLFT7AN9gATQsZ', startRatio:'2:1', heroRatio:'7:3', googleUrl:'https://www.google.com/maps/search/Schwimmbad', consent:'Ich stimme zu, dass das Schwimmbad mich zu meinem Feedback per E-Mail schriftlich kontaktieren darf.',
    start:{head:'🏊‍♂️\nWie hat Dir __Dein Besuch__ heute gefallen?', sub:'Ihr Feedback hilft uns, unser Schwimmbad weiter zu verbessern.'},
    img:{start:'start.jpg', finish:'finish.jpg', nein:'finish-nein.jpg', google:'finish-google.jpg', kontakt:'kontakt.jpg', ja:'kontakt-ja.jpg', nein2:'kontakt-nein.jpg'},
    pos:{finish:'50% 50%', nein:'37% 62%', google:'50% 41%', kontakt:'50% 50%', ja:'50% 15%', nein2:'50% 50%'},
    ids:{ja:'0gLuIqUWYVO0BR1XNw_E0', nein:'rrWKbtcXQ4X8KykDNfxa0', consent:'i0cc6l6lp_gQ8uNghK-Pu'},
    problem:[['Sauberkeit','eaiKE4Y6PeYclgMvzPfv_'],['Wasser-/Temperatur','G6M7YontboiAHFW8ieDdy'],['Wartezeiten','dhDtlCkYabDupkhEugKBE'],['Personal','PodE58WyHEU511hHCFi0Q'],['Umkleiden/Duschen','JfiJHMXG19xk7wHdH6RZp',''],['Gastronomie','KjutYn9xgv75vwvqPqBZi',''],['zu voll','WP1WaA41iHn6XYpJPUKKa'],['Technik/Defekte','6eA5EQp3yKnjym6ACgK5q',''],['Sonstiges','86ad8893-ac98-459f-9348-f4bc9d3dca67','Bitte gehe näher darauf ein']],
    lob:[['Sauberkeit','mcPHxpYjilVdRLJc6d4k2'],['Freundliches Personal','f5ncr4lxDuBXZqJsty5jo'],['Familienfreundlich','UAvbtdONpX7IVyFRqD96x',''],['Rutschen/Attraktionen','-B7rpccsdSzC30uZSz_Rd'],['Ruhe/Entspannung','WCWY0VMnxQdVSG25DSOIy'],['Gastronomie','m1K39SEqS56O0HqUJhgVe'],['Preis/Leistung','fQe9Xdsn4Jr2Q5sLq8LyG',''],['Allgemeine Atmosphäre','d92f38c5-38a7-413f-9554-daff490ad583']]});
}

/* Feedback-Funnel Holz Gehlen – 1:1 nach taptell.de/gehlen (Onepage).
   Feld-Schlüssel = Onepage-Slugs, damit Webhooks dieselben Felder liefern:
   Grundstimmung · Problemgrund · Kommentar zum Grund · Kontaktwunsch · name (firstName/lastName) · email-adresse · zustimmung · lob · lob_kommentar
   Logik: Grundstimmung ≤ 3 → Problem → Kontakt gewünscht (Ja → Kontakt → Finish, sonst Finish Keinkontakt); 4–5 → Was hat gut gefallen → Finish Google */
function tGehlenFeedback(){
  var A = '/assets/gehlen-feedback/', LIME = '#aac520';
  var h = function(text, extra){ return B('heading', Object.assign({text:text, level:1, size:32, fw:700, align:'center', mb:10}, extra||{})); };
  var badge = function(text, fw){ return B('badge', {text:text, variant:'filled', align:'center', fw:fw||700, scale:96, mb:28}); };
  var success = function(){ return B('image', {src:A+'success.svg', alt:'', radius:0, height:100, fit:'contain', mb:0}); };
  var team = function(){ return B('image', {src:A+'team.png', alt:'Das Team von Holz Gehlen', radius:0, ratio:'1280:1210', mb:36}); };
  var hands = function(){ return B('heading', {text:'🙌', level:1, size:30, fw:500, align:'center', mb:8}); };
  /* Antworten mit Onepage-IDs: [Label, Onepage-_id, Beschreibung (optional, auch leer)] */
  var check = function(items){ return items.map(function(l){ var o = O(l[0], '', {oid:l[1]}); if(l.length > 2){ o.odesc = l[2]; if(l[2]) o.sub = l[2]; } return o; }); };
  var lime = function(label, extra){ return B('button', Object.assign({label:label, full:false, shadow:false, icon:'none', align:'center', btnBg:LIME, mt:8}, extra||{})); };
  var dark = function(label, icon, extra){ return B('button', Object.assign({label:label, variant:'gradient', btnBg:'#000000', btnColor:'rgba(255,255,255,.78)', full:true, shadow:true, icon:icon, iconLeft:true, radiusOn:true, radius:16, align:'center', mt:8}, extra||{})); };
  var note = function(key, rows){ return B('input', {label:'', placeholder:'Könnten Sie uns kurz mehr dazu sagen?', inputType:'textarea', key:key, rows:rows, required:false, mb:24}); };
  var MUST = 'Wählen Sie mindestens eine Option', REQ = 'Feld ist erforderlich';
  var stars = B('html', {code:'<div style="display:flex;justify-content:center;gap:10px">'+new Array(6).join('<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="#f8c22d" d="M12.75 1.46l3.11 6.3 6.95 1.01a.83.83 0 01.46 1.42l-5.03 4.9 1.19 6.93a.83.83 0 01-1.21.88L12 19.63 5.78 22.9a.83.83 0 01-1.21-.88l1.19-6.93-5.03-4.9a.83.83 0 01.46-1.42l6.95-1.01 3.11-6.3a.83.83 0 011.5 0z"/></svg>')+'</div>', align:'center', mb:28});

  var pGoogle = P('Finish Google', [success(),
    B('image', {src:A+'google.jpg', alt:'Deine Bewertung macht den Unterschied', radius:16, ratio:'2:1', mb:0}),
    B('spacer', {height:72}),
    h('Vielen Dank für Ihr positives Feedback!', {mb:6}),
    B('text', {text:'Wenn Ihnen ihr Besuch gefallen hat, würden wir uns sehr über eine kurze Google-Bewertung freuen. ', align:'center', mb:36}),
    stars,
    dark('Auf Google bewerten', 'google', {action:'url', url:'https://search.google.com/local/writereview?placeid=ChIJ5ZAgh3VMv0cR9rNQ9QeRkV0', scale:120})], {wide:true, allowBack:false, submitOnEnter:true, autoButton:false});
  var pDankeNein = P('Finish Keinkontakt', [success(), team(), hands(),
    h('Danke für Ihr ehrliches Feedback', {size:24, mb:6}),
    B('text', {text:'Auch anonymes Feedback hilft uns dabei, besser zu werden und Probleme schneller zu erkennen.', align:'center'})], {wide:true, allowBack:false, submitOnEnter:true, autoButton:false});
  var pDankeJa = P('Finish', [success(), team(), hands(),
    h('Vielen Dank für Ihr ehrliches Feedback!', {size:30, mb:6}),
    B('text', {text:'Ihr Feedback ist bei uns angekommen und wird sofort intern besprochen. Ein Mitarbeiter wird Sie dazu schnellstmöglich per eMail kontaktieren.', align:'center'})], {wide:true, hideProgress:true, allowBack:false, submitOnEnter:true, autoButton:false});
  var pKontakt = P('Kontakt ja', [
    B('text', {text:'Danke für Ihr Vertrauen!', align:'center', size:14, mb:8}),
    B('image', {src:A+'kontakt.jpg', alt:'Kontakt', radius:0, ratio:'2:1', mb:32}),
    h('Hinterlassen Sie uns bitte kurz Ihre Kontaktdaten und wir melden uns bei Ihnen.', {size:22, mb:8}),
    B('text', {text:'🔒 Ihre Daten werden ***ausschließlich*** zur Kontaktaufnahme bezüglich Ihres Feedbacks verwendet. Wir werden niemals Spam zusenden!', align:'center', mb:32}),
    B('input', {label:'', placeholder:'Vorname', key:'name.firstName', required:true, errorText:REQ, half:true, mb:12}),
    B('input', {label:'', placeholder:'Nachname (optional)', key:'name.lastName', required:false, half:true, mb:12}),
    B('input', {label:'', placeholder:'Ihre E-Mail Adresse', inputType:'email', key:'email-adresse', required:true, errorText:REQ, mb:20}),
    B('checkbox', {text:'Ich stimme zu, dass Holz Gehlen mich zu meinem Feedback per Email kontaktieren darf.', key:'zustimmung', oid:'c61c4e5a-b1d4-420b-9be3-ac9727b440f7', required:true, errorText:MUST, mb:24}),
    dark('Mein Feedback absenden', 'plane', {action:'page', target:pDankeJa.id})], {wide:true});
  var pWunsch = P('Kontakt gewünscht', [badge('NUR NOCH 1 SCHRITT. VERSPROCHEN', 400),
    h('Wir würden das gerne wieder gut machen.'),
    B('text', {text:'Dürfen wir uns **per Email** persönlich bei Ihnen melden und eine Lösung finden?', align:'center', mb:32}),
    B('choice', {question:'', key:'Kontaktwunsch', layout:'image', ratio:'4:3', required:false, autoNext:true, options:[
      O('Ja, gerne!', '', {oid:'1WRjH5digqmhgQtg889Qj', odesc:'', img:A+'kontakt-ja.jpg', pos:'50% 50%', goto:pKontakt.id}),
      O('Nein, das passt schon...', '', {oid:'gXEU2_3bHyHF8vXL6bBTs', odesc:'Ihr Feedback wird anonym abgesendet.', img:A+'kontakt-nein.png', pos:'75% 50%', sub:'Ihr Feedback wird anonym abgesendet.', goto:pDankeNein.id})]})], {wide:true});
  var pGut = P('Was hat gut gefallen', [badge('NUR EINE FRAGE'),
    h('😊\nDas freut uns sehr!\nWas hat Ihnen besonders gut gefallen?', {size:28, mb:32}),
    B('choice', {question:'', key:'lob', layout:'checklist', colsD:2, multi:true, autoNext:false, required:true, errorText:MUST, mb:16, options:check([['Tolle Beratung','113e2ac4-fabd-4d93-8712-522afe26ab56',''],['gute Auswahl','70372d1f-865c-4ce2-b9aa-071fe45b85c7'],['Faire Preise','01874fdf-ddef-48b1-ae8c-1f5db7d321e7'],['Sonstiges','8f15f77d-6498-43a9-a940-a50b67888167','Bitte gehen Sie unten weiter darauf ein.']])}),
    note('lob_kommentar', 6),
    dark('Anonym abschicken', 'plane')], {wide:true, next:pGoogle.id});
  var pProblem = P('Problem', [
    h('😲 Ohje!\nWas lief nicht so gut?', {mb:4}),
    B('text', {text:'Konkretes Feedback ist sehr wichtig für uns, damit wir uns in diesen Bereichen verbessern können', align:'center', size:14, mb:40}),
    B('choice', {question:'', key:'Problemgrund', layout:'checklist', colsD:2, multi:true, autoNext:false, required:true, errorText:MUST, mb:24, options:check([['Beratung nicht hilfreich','upWngF3-41Ag8oo05reK0',''],['Zu lange gewartet','t7gNYiFUmb2mVTJZgi_R3'],['Produkt nicht gefunden','Ir8ffh7jHaFI6DtU2N_Ou'],['Preise unklar/zu hoch','pKEgppBRWCaSRuuYs3vu5'],['Auswahl nicht passend','7iYNjcFZ4yhLSPCkO8EiS'],['Sonstiges','lqmpZ04ricZQqhGixIbxk','Bitte gehe unten weiter darauf ein.']])}),
    B('badge', {text:'DETAILS ZU IHREM ANLIEGEN', variant:'grey', align:'center', fw:400, mb:6}),
    B('text', {text:'Dies ist optional, hilft uns aber enorm weiter', align:'center', size:14, mb:16}),
    note('Kommentar zum Grund', 10),
    lime('Weiter geht\'s')], {wide:true, next:pWunsch.id});
  var pStart = P('Grundstimmung', [badge('ES DAUERT NUR 1 MINUTE'),
    B('image', {src:A+'feedback.jpg', alt:'Ihr Feedback in nur 1 Minute', radius:16, ratio:'16:9', mb:36}),
    h('Wie war __Ihr Besuch__ bei uns?', {mb:36}),
    B('rating', {label:'', style:'emoji', max:5, emojis:'😥 🙁 😐 🙂 😀', key:'Grundstimmung', autoNext:true, required:true, align:'left', minLabel:'sehr schlecht', maxLabel:'sehr gut',
      routes:[{min:1, max:3, goto:pProblem.id}, {min:4, max:5, goto:pGut.id}]})], {wide:true});

  var css = [
    '.fp.prog-top .fp-top{padding-top:14px}',
    '.fp.prog-top .fp-prog{margin:0 0 33px;height:6px;background:rgba(43,42,43,.1)}',
    '.fp-body{padding-top:24px}',
    '.fp-h1,.fp-h2,.fp-h3{line-height:1.3;letter-spacing:-.3px}',
    '.fp-txt{font-size:16px;line-height:1.5;color:var(--tx)}',
    '.fp-badge{border-radius:6px;padding:5px 12px;font-weight:inherit;letter-spacing:.5px;text-transform:uppercase;font-size:12px}',
    '.fp-badge.grey{background:rgba(43,42,43,.05);font-size:13px;letter-spacing:0;padding:4px 12px}',
    '.fp-ul .fp-ulsv{color:var(--p)}',
    '.fp-emo{gap:12px}.fp-emo button{border-radius:6px;background:rgba(43,42,43,.05);box-shadow:inset 0 0 0 1px rgba(43,42,43,.1);height:52px;font-size:24px}',
    '.fp-rlab{font-size:13.5px;color:var(--tx);margin-top:8px}',
    '.fp-opts.checklist{gap:12px}',
    '.fp-opts.checklist .fp-opt{min-height:40px;padding:0 12px;font-size:13px;border:1px solid rgba(43,42,43,.08);background:#f8f9f9}',
    '.fp-opts.checklist .fp-opt .chk{width:20px;height:20px;border-radius:4px;border:0;background:rgba(43,42,43,.1)}',
    '.fp-opts.checklist .fp-opt.sel{border-color:rgba(43,42,43,.35);background:#f8f9f9;font-weight:600}',
    '.fp-opts.checklist .fp-opt.sel .chk{background:rgba(43,42,43,.3)}',
    '.fp-opt .sub{font-size:11px;margin-top:0;color:#6f6e6f}',
    '.fp-opts.image{gap:13px}.fp-opts.image .fp-opt{border:1px solid rgba(43,42,43,.08);font-size:13px;font-weight:400}.fp-opts.image .fp-opt .chk{display:none}.fp-opts.image .fp-opt .lbl{padding:8px 10px 9px}',
    '.fp-in{padding:10px 12px;font-size:13px;border:1px solid rgba(43,42,43,.15)}',
    'textarea.fp-in{min-height:0;resize:none}',
    '.fp-iw .ii{display:none}.fp-iw .ii+.fp-in{padding-left:12px}',
    '.fp-cb{font-size:14px;color:var(--tx);align-items:center}.fp-cb .box{border-radius:50%}',
    '.fp-btn{font-size:calc(15px*var(--sc,1));min-height:calc(56px*var(--sc,1));padding:7px 28px}',
    '.fp-btn.auto{width:auto}',
    '.fp-lbl .rq,.fp-cb .rq{display:none}',
    '@container (min-width:640px){.fp.wide .fp-body,.fp.wide .fp-top{max-width:1198px}.fp.prog-top .fp-top{padding-top:28px}.fp.prog-top .fp-prog{margin-bottom:34px}}'
  ].join('\n');

  return {name:'Feedback-Funnel Holz Gehlen', desc:'Smiley-Bewertung mit Weiterleitung: Zufriedene zu Google, Unzufriedene zu Kontakt oder anonymem Dank. Feldnamen wie im Onepage-Original.', cats:['Feedback'],
    theme:theme('clean', {primary:LIME, primaryText:'#ffffff', bg:'#ffffff', surface:'#f4f4f4', text:'#2b2a2b', muted:'#6f6e6f', font:'Inter Tight', headingFont:'Onest', radius:6, btnRadius:4,
      headingWeight:700, headingLs:0, lineHeight:1.5, logoImg:A+'logo.png', logoH:39, progress:'bar', progressTop:true, backButton:false, animation:'slide', pad:24, btnPad:7, btnWeight:600, customCss:css}),
    settings:{currency:'EUR', basePrice:0, address:'sie', webhookFormat:'onepage', onepageForm:'Gehlen', onepageFormId:'K6UAq-fnmPbYyHG5s0GAZ', onepageSiteId:'7e7ce4b6-1606-4c36-9ae6-58d3b6f1b8e2'},
    /* Reihenfolge wie im Onepage-Formular: ergibt dieselben „Step N.“-Schlüssel in data.fieldsMap */
    pages:[pStart, pProblem, pWunsch, pDankeJa, pKontakt, pGut, pDankeNein, pGoogle]};
}

function tBlank(){
  return {name:'Leerer Funnel', desc:'Starte mit einer leeren Seite.', cats:[], theme:modern({primary:'#111113', primaryText:'#ffffff'}), settings:{currency:'EUR'},
    pages:[P('Seite 1',[B('heading',{text:'Deine erste Seite'}), B('text',{}), B('button',{})]), P('Danke',[B('heading',{text:'Vielen Dank!', align:'center'})],{hideProgress:true})]};
}

var TEMPLATES_EXTRA = [];
/* ================= Baukasten: Funnel aus kompakter Beschreibung (für Vorlagen und die KI-Erstellung) =================
   spec = {name, desc, cats, brand, logo, style, start:{badge,title,text,image,cta,ctaSub,proof}, steps:[…], loader, pricing, contact, thanks}
   Schritt-Typen: cards (Bildkarten) · icons (Liste/Kacheln mit Icons) · slider · faces (Smileys) · calendar · text */
var IMG = {
  bath:'1584622650111-993a426fbf0a', bathTub:'1620626011761-996317b8d101', bathMarble:'1771681278369-e2a5480b8c29', bathWc:'1631889993959-41b4e9c6e3c5', bathDouble:'1781344334947-60c704bafd51',
  roof:'1563993356056-b23a9cd265ad', roofTiles:'1605450099279-533bd3ce379a', roofHouse:'1587061633437-187ac80e8e7a',
  heatPump:'1776860155275-eee24bfb1dee', heatPump2:'1776860150272-653efc74193c',
  houseModern:'1766603636700-e9d80473f40f', houseGlass:'1748063578185-3d68121b11ff', houseClassic:'1513584684374-8bab748fbf90', houseWood:'1591474200742-8e512e6f98f8',
  kitchen:'1556911220-bff31c812dba', kitchenIsland:'1617228069096-4638a7ffc906', kitchenWood:'1786053538161-501fbdd89629', kitchenBar:'1632583824020-937ae9564495', kitchenWhite:'1507089947368-19c1da9775ae',
  garden:'1597201278257-3687be27d954', gardenLawn:'1668120089662-42642838cfef', gardenPath:'1700689807667-82630348b301', gardenWork:'1734079692160-fcbe4be6ab96',
  painter:'1693985120993-e9b203ce7631', painterWall:'1688372199140-cade7ae820fe',
  moving:'1714647211902-bb711d643a17', movingBoxes:'1766040923580-16ad32fae8b4', movingRoom:'1730154838368-c37b1fdebcf6',
  cleaning:'1581578731548-c64695cc6952', cleaningOffice:'1497366754035-f200968a6e72', cleaningVacuum:'1781637590564-01c65dbf2039',
  gym:'1534258936925-c58bed479fcb', gymBarbell:'1517836357463-d25dfeac3438', gymRopes:'1758875569612-94d5e0f1a35f', gymWoman:'1574680096145-d05b474e2155', yoga:'1552196563-55cd4e45efb3',
  spa:'1570172619644-dfd03ed5d881', spaMassage:'1570174006382-148305ce4972', spaProducts:'1540555700478-4be289fbecef', spaFace:'1598901986949-f593ff2a31a6', salon:'1600948836101-f9ffda59d250',
  wedding:'1519741497674-611481863552', weddingWalk:'1779475501433-69a3a0b310f8', weddingHands:'1520854221256-17451cc331bf',
  catering:'1555244162-803834f70033', cateringFood:'1576842546422-60562b9242ae', restaurant:'1744776411221-702f2848b0b2', restaurantRed:'1771574205963-0c1d84ac7354',
  cars:'1777175013302-eaf4b3ef785a', carLot:'1621808752171-531c30903889',
  laptop:'1498050108023-c5249f4df085', laptopDesk:'1496181133206-80ce9b88a853', consulting:'1780733066519-df99b3123d30', meeting:'1758518727613-00192aed759b', signing:'1562564055-71e051d33c19',
  workshop:'1597058557804-95ac4ee36e66', workshopTeam:'1759662232622-6c0754a379f4', plumber:'1676210134188-4c05dd172f89',
  nurse:'1765896387387-0538bc9f997e', nurse2:'1765896387398-1e1ae8d2eb85',
  cabin:'1645131687573-56a55f7288e4', cabinSnow:'1598709597551-4ae514c1b297',
  terrace:'1787491581115-1d9a0e9f11ec', solar:'1655300256486-4ec7251bf84e', estate:'1771366260867-7e07094579d7', coffee:'1760175445000-0e01e193d1cd', construction:'1672627170267-fca17bb54156'
};
/* Bildquelle: Schlüssel aus IMG, Unsplash-Foto-ID oder vollständige Adresse */
var IMGSRC = function(v, w){ if(!v) return ''; if(/^(https?:|data:|\/)/.test(v)) return v; return U(IMG[v] || v, w); };
var inkOn = function(hex){ var h = String(hex||'').replace('#',''); if(h.length === 3) h = h.replace(/./g,'$&$&'); var n = parseInt(h, 16); if(isNaN(n)) return '#ffffff'; var l = [n>>16&255, n>>8&255, n&255].map(function(c){ c /= 255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); }); return (.2126*l[0] + .7152*l[1] + .0722*l[2]) > .45 ? '#111113' : '#ffffff'; };
function fromSpec(s){
  s = s || {}; var st = s.start || {}, pages = [], pr = s.pricing || null, keys = {}, sie = s.address === 'sie';
  /* Standardtexte passend zur Anrede */
  var D = sie ? {sub:'Kostenlos & unverbindlich', ctitle:'Wohin dürfen wir Ihr Angebot senden?', ctext:'Ihre Daten nutzen wir nur für Ihre Anfrage.', thanks:'Vielen Dank!', thx:'Ihre Anfrage ist eingegangen. Wir melden uns schnellstmöglich bei Ihnen.', steps:['Anfrage eingegangen | Gerade eben','Persönliche Rückmeldung | Innerhalb von 24 Stunden','Ihr Angebot | Passend zu Ihren Angaben'], recap:'Ihre Angaben', ltext:'Wir stellen Ihr persönliches Ergebnis zusammen.', est:'Ihre Schätzung', lines:['Wir prüfen Ihre Angaben …','Gleich geschafft …'], answer:'Ihre Antwort'}
    : {sub:'Kostenlos & unverbindlich', ctitle:'Wohin dürfen wir dein Angebot senden?', ctext:'Deine Daten nutzen wir nur für deine Anfrage. Kein Spam, versprochen.', thanks:'Danke, {{vorname|dir}}!', thx:'Deine Anfrage ist eingegangen. Wir melden uns schnellstmöglich bei dir.', steps:['Anfrage eingegangen | Gerade eben','Persönliche Rückmeldung | Innerhalb von 24 Stunden','Dein Angebot | Passend zu deinen Angaben'], recap:'Deine Angaben', ltext:'Wir stellen dein persönliches Ergebnis zusammen.', est:'Deine Schätzung', lines:['Wir prüfen deine Angaben …','Gleich geschafft …'], answer:'Deine Antwort'};
  var key = function(k, t){ var b = String(k || t || 'feld').toLowerCase().replace(/[äöüß]/g, function(c){ return {'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c]; }).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,28) || 'feld'; var x = b, i = 2; while(keys[x]) x = b + '_' + (i++); keys[x] = 1; return x; };
  var opt = function(o){ o = o || {}; var extra = {}; if(o.sub) extra.sub = o.sub; if(o.image) extra.img = IMGSRC(o.image, 600); if(o.icon) extra.ic = o.icon; if(+o.price) extra.price = +o.price; if(+o.unitPrice){ extra.unitPrice = +o.unitPrice; extra.unitLabel = o.unit || ''; } return O(o.label || 'Option', '', extra); };
  /* Startseite: Bild, Hinweis, Überschrift, Nutzen, Button, Vertrauen */
  var start = [];
  if(st.image) start.push(hero(IMG[st.image] || st.image, {src:IMGSRC(st.image), ratio:'16:10'}));
  if(st.badge) start.push(B('badge', {text:st.badge, align:'left'}));
  start.push(B('heading', {text:st.title || s.name || 'Dein Angebot in 60 Sekunden', level:1}));
  if(st.text) start.push(B('text', {text:st.text, mb:22}));
  start.push(B('button', {label:st.cta || 'Jetzt starten', sub:st.ctaSub || D.sub}));
  var pf = st.proof || {type:'reviews'};
  if(pf.type === 'avatars') start.push(B('avatars', {text:pf.text || 'Über **500** zufriedene Kunden', align:'center', mt:6}));
  else if(pf.type !== 'none') start.push(B('reviews', {score:pf.score || 4.9, count:pf.count || 127, source:pf.source || 'Google', align:'center', mt:6}));
  pages.push(P('Start', start));
  /* Fragen: eine pro Seite, Einzelauswahl geht automatisch weiter */
  (s.steps || []).forEach(function(q, i){
    var t = q.type || 'cards', k = key(q.key, q.name || q.title), blocks = [];
    if(t === 'cards' || t === 'icons'){
      var lay = t === 'cards' ? 'image' : (q.layout === 'grid' ? 'grid' : (q.multi ? 'checklist' : 'list'));
      /* Gleiche Icons bei allen Antworten bringen nichts – dann ohne Icons, wirkt ruhiger */
      var icSet = (q.options || []).map(function(o){ return o.icon || ''; }).filter(function(x, i, a){ return a.indexOf(x) === i; });
      if(t === 'icons' && (q.options || []).length > 1 && icSet.length === 1) q = Object.assign({}, q, {options:q.options.map(function(o){ return Object.assign({}, o, {icon:''}); })});
      blocks.push(B('choice', {question:q.title, desc:q.desc || '', key:k, layout:lay, ratio:q.ratio || '4:3', cols:q.cols || (lay === 'grid' ? 2 : undefined), multi:!!q.multi, autoNext:!q.multi, required:q.required !== false, showPrices:!!(pr && pr.show), options:(q.options || []).map(opt)}));
    } else if(t === 'slider'){
      blocks.push(B('heading', {text:q.title, level:2, mb:q.text ? 6 : 18}));
      if(q.text) blocks.push(B('text', {text:q.text, mb:20}));
      blocks.push(B('slider', {label:'', min:+q.min || 0, max:+q.max || 100, step:+q.step || 1, def:q.def != null ? +q.def : Math.round(((+q.min||0)+(+q.max||100))/2), unit:q.unit || '', key:k, isQuantity:!!q.quantity}));
      if(pr && q.quantity) blocks.push(B('summary', {compact:true, title:'Geschätzter Preis', prefix:pr.prefix || 'ab', note:''}));
    } else if(t === 'faces'){
      blocks.push(B('heading', {text:q.title, level:2, align:'center', mb:20}));
      blocks.push(B('rating', {label:'', style:'faces', max:5, key:k, autoNext:true, required:true, align:'center'}));
    } else if(t === 'calendar'){
      blocks.push(B('heading', {text:q.title, level:2, mb:16}));
      blocks.push(B('calendar', {label:'', key:k}));
    } else if(t === 'text'){
      blocks.push(B('heading', {text:q.title, level:2, mb:q.text ? 6 : 16}));
      if(q.text) blocks.push(B('text', {text:q.text, mb:18}));
      blocks.push(B('input', {label:'', placeholder:q.placeholder || D.answer, inputType:q.multiline ? 'textarea' : 'text', key:k, required:q.required !== false}));
    }
    pages.push(P(q.name || ('Frage ' + (i + 1)), blocks));
  });
  /* Ladeseite vor dem Ergebnis */
  if(s.loader) pages.push(P('Auswertung', [B('loader', {anim:s.loader.anim || 'orbit', duration:s.loader.duration || 3, texts:(s.loader.lines && s.loader.lines.length) ? s.loader.lines : D.lines}),
    B('heading', {text:s.loader.title || 'Einen Moment …', level:2, align:'center', mb:6}), B('text', {text:s.loader.text || D.ltext, align:'center'})], {hideProgress:true, vcenter:true, allowBack:false}));
  /* Preisübersicht */
  if(pr && pr.summary !== false) pages.push(P('Zusammenfassung', [B('heading', {text:pr.title || D.est, level:2}), B('summary', {title:'Deine Auswahl', totalLabel:'Geschätzter Preis', prefix:pr.prefix || '', note:pr.note || 'Unverbindliche Schätzung inkl. MwSt.'}), B('button', {label:pr.cta || 'Angebot anfordern'})]));
  /* Kontakt: wenige Felder, Vertrauen direkt am Formular */
  var c = s.contact || {};
  var extra = [];
  if(c.zip) extra.push(B('input', {label:'Postleitzahl', placeholder:'12345', inputType:'text', key:'plz', required:false, half:false}));
  if(c.message) extra.push(B('input', {label:'Nachricht (optional)', placeholder:'Was sollen wir noch wissen?', inputType:'textarea', key:'nachricht', required:false}));
  var cb = contact(c.title || D.ctitle, c.text || D.ctext, c.button || 'Anfrage absenden', extra);
  if(c.phone === false) cb = cb.filter(function(b){ return !(b.type === 'input' && b.props.key === 'telefon'); });
  pages.push(P('Kontakt', cb));
  /* Danke: Auswahl-Karte und nächste Schritte */
  var th = s.thanks || {}, more = [];
  if(th.recap !== false && (s.steps || []).some(function(q){ return q.type === 'cards' || q.type === 'icons' || q.type === 'slider'; })) more.push(B('recap', {title:th.recapTitle || D.recap, mt:8, mb:22}));
  more.push(B('steps', {items:(th.steps && th.steps.length) ? th.steps : D.steps}));
  pages.push(P('Danke', done(th.title || D.thanks, th.text || D.thx, more), {hideProgress:true, allowBack:false}));
  var brand = s.brand || '#2563eb';
  return {name:s.name || 'KI-Funnel', desc:s.desc || '', cats:s.cats || ['Leads'],
    theme:modern({primary:brand, primaryText:inkOn(brand), logoText:s.logo || '', optStyle:s.style || 'shadow', progFill:'solid', progAnim:'smooth'}),
    settings:Object.assign({currency:'EUR', basePrice:0, address:sie ? 'sie' : 'du'}, pr ? {basePrice:+pr.base || 0, priceMode:pr.mode || 'range'} : {}),
    pages:pages};
}

/* ---------- Vorlagen für viele Branchen (alle über den Baukasten) ---------- */
var SPECS = {
  bad:{name:'Badsanierung', desc:'Bad-Typ, Größe und Ausstattung wählen – mit Preisspanne und Beratungstermin.', cats:['Konfigurator','Handwerk'], brand:'#0f766e', logo:'Bad & Raum',
    start:{badge:'Preis in 60 Sekunden', title:'Dein __Traumbad__ – was kostet es wirklich?', text:'Beantworte vier kurze Fragen und erhalte sofort eine realistische Preisspanne für deine Badsanierung.', image:'bathMarble', cta:'Kosten berechnen'},
    steps:[{type:'cards', name:'Umfang', title:'Was möchtest du sanieren?', options:[{label:'Komplettsanierung', sub:'Alles neu, vom Boden bis zur Decke', image:'bathDouble', unitPrice:1450, unit:'m²'},{label:'Teilsanierung', sub:'Dusche, Wanne oder Fliesen', image:'bath', unitPrice:780, unit:'m²'},{label:'Barrierefreies Bad', sub:'Bodengleich & sicher', image:'bathTub', unitPrice:1650, unit:'m²'},{label:'Gäste-WC', sub:'Klein, aber fein', image:'bathWc', unitPrice:1100, unit:'m²'}]},
      {type:'slider', name:'Größe', title:'Wie groß ist dein Bad?', text:'Eine grobe Schätzung reicht völlig.', min:2, max:20, step:1, def:7, unit:'m²', quantity:true},
      {type:'icons', name:'Ausstattung', title:'Was soll rein?', desc:'Mehrfachauswahl möglich', multi:true, required:false, options:[{label:'Bodengleiche Dusche', icon:'drop', price:1900},{label:'Freistehende Wanne', icon:'sparkle', price:2400},{label:'Fußbodenheizung', icon:'flame', price:1300},{label:'Doppelwaschtisch', icon:'users', price:950},{label:'Dusch-WC', icon:'shield', price:1700}]},
      {type:'icons', name:'Zeitraum', title:'Wann soll es losgehen?', options:[{label:'So schnell wie möglich', icon:'rocket'},{label:'In 1–3 Monaten', icon:'calendar'},{label:'In 3–6 Monaten', icon:'clock'},{label:'Ich informiere mich nur', icon:'question'}]}],
    loader:{anim:'cube', title:'Einen Moment …', text:'Wir berechnen die Preisspanne für dein Bad.', lines:['Wir prüfen deine Auswahl …','Wir vergleichen aktuelle Preise …','Fast fertig …']},
    pricing:{show:false, mode:'range', title:'Deine Preisspanne', cta:'Beratung anfragen'},
    contact:{title:'Wohin dürfen wir dein Angebot senden?', zip:true},
    thanks:{steps:['Anfrage eingegangen | Gerade eben','Rückruf vom Bad-Experten | Innerhalb von 24 Stunden','Kostenloser Termin vor Ort | Aufmaß & Beratung','Dein Festpreis-Angebot | Ohne versteckte Kosten']}},
  dach:{name:'Dachsanierung-Check', desc:'Dachform, Zustand und Fläche – qualifizierte Anfragen für Dachdecker.', cats:['Leads','Handwerk'], brand:'#9a3412', logo:'Dach Meister',
    start:{badge:'Kostenloser Dach-Check', title:'Ist dein Dach __fit für die Zukunft__?', text:'In 60 Sekunden zur Einschätzung – inklusive Hinweis auf mögliche Förderung.', image:'roofHouse', cta:'Dach-Check starten'},
    steps:[{type:'icons', name:'Dachform', title:'Welche Dachform hat dein Haus?', layout:'grid', options:[{label:'Satteldach', icon:'home'},{label:'Flachdach', icon:'building'},{label:'Walmdach', icon:'home'},{label:'Pultdach', icon:'factory'}]},
      {type:'icons', name:'Anliegen', title:'Was ist dein Anliegen?', options:[{label:'Komplette Neueindeckung', icon:'hammer'},{label:'Dämmung verbessern', icon:'flame'},{label:'Undichte Stelle / Reparatur', icon:'drop'},{label:'Dachfenster einbauen', icon:'sun'}]},
      {type:'slider', name:'Fläche', title:'Wie groß ist die Dachfläche ungefähr?', text:'Faustregel: Wohnfläche × 1,3', min:40, max:400, step:10, def:150, unit:'m²'},
      {type:'icons', name:'Baujahr', title:'Wann wurde das Haus gebaut?', options:[{label:'Vor 1970', icon:'clock'},{label:'1970 – 1995', icon:'clock'},{label:'1995 – 2010', icon:'clock'},{label:'Nach 2010', icon:'clock'}]}],
    loader:{anim:'stack', title:'Wir werten deinen Dach-Check aus …', lines:['Dachform und Fläche prüfen …','Fördermöglichkeiten prüfen …']},
    contact:{title:'Wohin dürfen wir deine Einschätzung senden?', zip:true}},
  waermepumpe:{name:'Wärmepumpen-Check', desc:'Prüft in 5 Fragen, ob sich eine Wärmepumpe lohnt – mit Förderhinweis.', cats:['Leads','Handwerk'], brand:'#059669', logo:'Wärme Plus',
    start:{badge:'Bis zu 70 % Förderung', title:'Lohnt sich eine __Wärmepumpe__ für dein Haus?', text:'Finde in 60 Sekunden heraus, wie viel du sparen kannst und welche Förderung du bekommst.', image:'heatPump', cta:'Jetzt prüfen'},
    steps:[{type:'cards', name:'Gebäude', title:'Welche Art von Gebäude?', options:[{label:'Einfamilienhaus', image:'houseModern'},{label:'Doppel-/Reihenhaus', image:'houseClassic'},{label:'Mehrfamilienhaus', image:'houseGlass'},{label:'Altbau / Bestand', image:'houseWood'}]},
      {type:'icons', name:'Heizung', title:'Wie heizt du aktuell?', options:[{label:'Gas', icon:'flame'},{label:'Öl', icon:'drop'},{label:'Strom / Nachtspeicher', icon:'bolt'},{label:'Anderes', icon:'question'}]},
      {type:'slider', name:'Wohnfläche', title:'Wie groß ist die Wohnfläche?', min:60, max:400, step:10, def:150, unit:'m²'},
      {type:'icons', name:'Eigentum', title:'Bist du Eigentümer der Immobilie?', options:[{label:'Ja, ich bin Eigentümer', icon:'key'},{label:'Nein, ich miete', icon:'home'}]}],
    loader:{anim:'orbit', title:'Wir berechnen dein Sparpotenzial …', lines:['Heizbedarf schätzen …','Förderung prüfen …','Ergebnis vorbereiten …']},
    contact:{title:'Wohin dürfen wir deine Auswertung senden?', zip:true},
    thanks:{steps:['Check eingegangen | Gerade eben','Persönliche Auswertung | Innerhalb von 24 Stunden','Vor-Ort-Termin | Heizlast & Standort prüfen','Angebot inkl. Förderantrag | Wir kümmern uns']}},
  fenster:{name:'Fenster & Türen', desc:'Anzahl, Material und Zeitraum – Angebotsanfrage für Fensterbauer.', cats:['Leads','Handwerk'], brand:'#1d4ed8', logo:'Fensterwerk',
    start:{badge:'Angebot in 24 Stunden', title:'Neue Fenster – __besser dämmen__, Heizkosten senken', text:'Sag uns kurz, was du brauchst. Wir melden uns mit einem passenden Angebot.', image:'houseModern', cta:'Angebot anfordern'},
    steps:[{type:'icons', name:'Produkt', title:'Was suchst du?', layout:'grid', multi:true, options:[{label:'Fenster', icon:'sun'},{label:'Haustür', icon:'key'},{label:'Terrassentür', icon:'home'},{label:'Rollläden', icon:'shield'}]},
      {type:'icons', name:'Material', title:'Welches Material bevorzugst du?', options:[{label:'Kunststoff', sub:'Günstig & pflegeleicht', icon:'shield'},{label:'Holz', sub:'Natürlich & warm', icon:'tree'},{label:'Aluminium', sub:'Schlank & modern', icon:'sparkle'},{label:'Weiß ich noch nicht', icon:'question'}]},
      {type:'slider', name:'Anzahl', title:'Wie viele Fenster bzw. Türen?', min:1, max:30, step:1, def:6, unit:'Stück'},
      {type:'icons', name:'Zeitraum', title:'Wann soll eingebaut werden?', options:[{label:'So schnell wie möglich', icon:'rocket'},{label:'In 1–3 Monaten', icon:'calendar'},{label:'Später', icon:'clock'}]}],
    contact:{zip:true, message:true}},
  kueche:{name:'Küchenplanung', desc:'Stil, Form und Budget – Beratungstermin für Küchenstudios.', cats:['Termine','Verkauf'], brand:'#111827', logo:'Küchenhaus',
    start:{badge:'Kostenlose 3D-Planung', title:'Deine __neue Küche__ – geplant in 3 Schritten', text:'Erzähl uns, wovon du träumst. Wir planen deine Küche kostenlos in 3D.', image:'kitchenIsland', cta:'Planung starten', proof:{type:'avatars', text:'Über **1.200** geplante Küchen'}},
    steps:[{type:'cards', name:'Stil', title:'Welcher Stil gefällt dir?', options:[{label:'Modern & grifflos', image:'kitchen'},{label:'Landhaus', image:'kitchenWhite'},{label:'Natur & Holz', image:'kitchenWood'},{label:'Mit Theke', image:'kitchenBar'}]},
      {type:'icons', name:'Form', title:'Welche Form schwebt dir vor?', layout:'grid', options:[{label:'Küchenzeile', icon:'ruler'},{label:'L-Form', icon:'ruler'},{label:'U-Form', icon:'ruler'},{label:'Mit Insel', icon:'sparkle'}]},
      {type:'icons', name:'Budget', title:'Welches Budget hast du eingeplant?', options:[{label:'Bis 10.000 €', icon:'euro'},{label:'10.000 – 20.000 €', icon:'euro'},{label:'20.000 – 35.000 €', icon:'euro'},{label:'Über 35.000 €', icon:'euro'}]},
      {type:'calendar', name:'Termin', title:'Wann passt dir die Beratung?'}],
    contact:{title:'Fast geschafft! Wie erreichen wir dich?', button:'Termin anfragen'},
    thanks:{title:'Dein Termin ist angefragt!', text:'Wir bestätigen dir den Termin innerhalb von 24 Stunden.', steps:['Anfrage eingegangen | Gerade eben','Terminbestätigung | Per E-Mail','Beratung & 3D-Planung | Im Studio oder online']}},
  garten:{name:'Garten- & Landschaftsbau', desc:'Projekt, Fläche und Budget – Anfragen für GaLaBau-Betriebe.', cats:['Leads','Handwerk'], brand:'#3f6212', logo:'Grünwerk',
    start:{badge:'Planung kostenlos', title:'Mach aus deinem Garten deine __Lieblingsoase__', text:'Wähle dein Projekt und wir melden uns mit einem ersten Konzept.', image:'garden', cta:'Projekt starten'},
    steps:[{type:'cards', name:'Projekt', title:'Was möchtest du umsetzen?', multi:true, options:[{label:'Neuanlage', image:'gardenLawn'},{label:'Wege & Pflaster', image:'gardenPath'},{label:'Bepflanzung', image:'garden'},{label:'Pflege & Rückschnitt', image:'gardenWork'}]},
      {type:'slider', name:'Fläche', title:'Wie groß ist die Fläche?', min:20, max:2000, step:10, def:250, unit:'m²'},
      {type:'icons', name:'Budget', title:'Welchen Rahmen hast du eingeplant?', options:[{label:'Bis 5.000 €', icon:'euro'},{label:'5.000 – 15.000 €', icon:'euro'},{label:'15.000 – 40.000 €', icon:'euro'},{label:'Über 40.000 €', icon:'euro'}]}],
    contact:{zip:true, message:true}},
  maler:{name:'Maler-Kostenrechner', desc:'Räume, Fläche und Zustand – Preisspanne für Malerarbeiten.', cats:['Konfigurator','Handwerk'], brand:'#ea580c', logo:'Farbwerk',
    start:{badge:'Festpreis-Garantie', title:'Was kostet der __Maler__ für deine Räume?', text:'Berechne in 30 Sekunden eine Preisspanne – sauber, pünktlich, zum Festpreis.', image:'painter', cta:'Preis berechnen'},
    steps:[{type:'icons', name:'Arbeiten', title:'Was soll gemacht werden?', options:[{label:'Wände & Decken streichen', icon:'paint', unitPrice:14, unit:'m²'},{label:'Tapezieren & streichen', icon:'paint', unitPrice:24, unit:'m²'},{label:'Fassade', icon:'home', unitPrice:42, unit:'m²'}]},
      {type:'slider', name:'Fläche', title:'Wie groß ist die Fläche?', text:'Wohnfläche reicht als Schätzung.', min:10, max:300, step:5, def:80, unit:'m²', quantity:true},
      {type:'icons', name:'Zustand', title:'Wie ist der Zustand der Wände?', options:[{label:'Gut, nur neu streichen', icon:'check'},{label:'Kleine Risse & Löcher', icon:'wrench'},{label:'Stark beschädigt', icon:'hammer'}]}],
    pricing:{mode:'range', title:'Deine Preisspanne', cta:'Festpreis-Angebot anfordern'},
    contact:{zip:true}},
  umzug:{name:'Umzugskosten-Rechner', desc:'Wohnungsgröße, Strecke und Extras – Umzugsangebot mit Preisspanne.', cats:['Konfigurator','Dienstleistung'], brand:'#4f46e5', logo:'Umzug Express',
    start:{badge:'Festpreis in 60 Sekunden', title:'Was kostet dein __Umzug__?', text:'Stressfrei umziehen: Berechne jetzt deinen Preis und sichere dir deinen Wunschtermin.', image:'moving', cta:'Umzug berechnen'},
    steps:[{type:'icons', name:'Größe', title:'Wie groß ist deine aktuelle Wohnung?', layout:'grid', options:[{label:'1–2 Zimmer', icon:'box', price:690},{label:'3 Zimmer', icon:'box', price:1090},{label:'4 Zimmer', icon:'box', price:1490},{label:'Haus', icon:'home', price:2190}]},
      {type:'slider', name:'Entfernung', title:'Wie weit ziehst du?', min:1, max:800, step:1, def:25, unit:'km'},
      {type:'icons', name:'Extras', title:'Welche Extras brauchst du?', desc:'Mehrfachauswahl möglich', multi:true, required:false, options:[{label:'Ein- & Auspacken', icon:'box', price:390},{label:'Möbelmontage', icon:'wrench', price:290},{label:'Halteverbotszone', icon:'truck', price:120},{label:'Entrümpelung', icon:'x', price:350}]},
      {type:'calendar', name:'Termin', title:'Wann ist dein Wunschtermin?'}],
    loader:{anim:'flip', title:'Wir berechnen deinen Festpreis …', lines:['Volumen schätzen …','Strecke berechnen …','Preis vorbereiten …']},
    pricing:{mode:'from', prefix:'ab', title:'Dein Umzug', cta:'Festpreis sichern'},
    contact:{title:'Wohin dürfen wir dein Angebot senden?'}},
  reinigung:{name:'Gebäudereinigung', desc:'Objektart, Fläche und Turnus – Angebotsanfrage für Reinigungsfirmen.', cats:['Leads','Dienstleistung'], brand:'#0284c7', logo:'Klar & Rein',
    start:{badge:'Angebot in 24 Stunden', title:'Saubere Räume, __ohne Aufwand__', text:'Professionelle Reinigung für Büro, Praxis und Treppenhaus – planbar und zuverlässig.', image:'cleaningOffice', cta:'Angebot anfordern'},
    steps:[{type:'icons', name:'Objekt', title:'Was sollen wir reinigen?', layout:'grid', options:[{label:'Büro', icon:'building'},{label:'Praxis', icon:'heart'},{label:'Treppenhaus', icon:'home'},{label:'Gewerbe / Halle', icon:'factory'}]},
      {type:'slider', name:'Fläche', title:'Wie groß ist die Fläche?', min:50, max:5000, step:50, def:400, unit:'m²'},
      {type:'icons', name:'Turnus', title:'Wie oft soll gereinigt werden?', options:[{label:'Täglich', icon:'calendar'},{label:'2–3× pro Woche', icon:'calendar'},{label:'Wöchentlich', icon:'calendar'},{label:'Einmalig', icon:'sparkle'}]}],
    contact:{zip:true, message:true}},
  fitness:{name:'Probetraining Fitnessstudio', desc:'Ziel, Erfahrung und Termin – Probetrainings-Buchung für Studios.', cats:['Termine','Gesundheit'], brand:'#dc2626', logo:'Pulse Gym',
    start:{badge:'Probetraining gratis', title:'Starte jetzt mit deinem __Wunschziel__', text:'Sichere dir dein kostenloses Probetraining inklusive persönlicher Beratung.', image:'gym', cta:'Probetraining sichern', proof:{type:'avatars', text:'Über **2.000** Mitglieder trainieren schon'}},
    steps:[{type:'cards', name:'Ziel', title:'Was ist dein Ziel?', options:[{label:'Muskeln aufbauen', image:'gymBarbell'},{label:'Abnehmen & fitter werden', image:'gymRopes'},{label:'Kraft & Gesundheit', image:'gymWoman'},{label:'Beweglichkeit & Entspannung', image:'yoga'}]},
      {type:'icons', name:'Erfahrung', title:'Wie viel Trainingserfahrung hast du?', options:[{label:'Ich fange gerade an', icon:'rocket'},{label:'Ich habe schon trainiert', icon:'thumb'},{label:'Ich trainiere regelmäßig', icon:'star'}]},
      {type:'calendar', name:'Termin', title:'Wann möchtest du vorbeikommen?'}],
    contact:{title:'Auf welchen Namen dürfen wir buchen?', button:'Probetraining buchen'},
    thanks:{title:'Du bist dabei, {{vorname|dir}}!', text:'Wir freuen uns auf dich. Die Bestätigung kommt per E-Mail.', steps:['Buchung eingegangen | Gerade eben','Bestätigung | Per E-Mail','Probetraining | Mit persönlichem Coach']}},
  beauty:{name:'Kosmetik-Terminbuchung', desc:'Behandlung, Hauttyp und Termin – Buchungsanfrage für Kosmetikstudios.', cats:['Termine','Gesundheit'], brand:'#be185d', logo:'Studio Lumi',
    start:{badge:'Neukunden −15 %', title:'Gönn dir eine __Auszeit__', text:'Wähle deine Behandlung und deinen Wunschtermin – in unter einer Minute.', image:'spa', cta:'Termin wählen'},
    steps:[{type:'cards', name:'Behandlung', title:'Welche Behandlung wünschst du dir?', options:[{label:'Gesichtsbehandlung', sub:'60 Min.', image:'spa'},{label:'Massage', sub:'45 Min.', image:'spaMassage'},{label:'Pflege & Wellness', sub:'90 Min.', image:'spaProducts'},{label:'Anti-Aging', sub:'75 Min.', image:'spaFace'}]},
      {type:'icons', name:'Besuch', title:'Warst du schon einmal bei uns?', options:[{label:'Nein, ich bin neu', icon:'sparkle'},{label:'Ja, ich komme wieder', icon:'heart'}]},
      {type:'calendar', name:'Termin', title:'Wann passt es dir?'}],
    contact:{title:'Auf welchen Namen dürfen wir buchen?', button:'Termin anfragen'},
    thanks:{title:'Danke, {{vorname|dir}}!', text:'Wir bestätigen deinen Termin in Kürze per E-Mail.', steps:['Anfrage eingegangen | Gerade eben','Terminbestätigung | Per E-Mail','Deine Behandlung | Wir freuen uns auf dich']}},
  hochzeit:{name:'Hochzeitsfotograf', desc:'Datum, Paket und Location – Anfragen für Hochzeitsfotografen.', cats:['Leads','Gastro & Events'], brand:'#a16207', logo:'Lichtmomente',
    start:{badge:'Termine 2027 noch frei', title:'Eure Hochzeit, __für immer festgehalten__', text:'Erzählt uns kurz von eurem Tag – wir melden uns mit einem persönlichen Angebot.', image:'wedding', cta:'Verfügbarkeit prüfen'},
    steps:[{type:'cards', name:'Paket', title:'Wie viel soll begleitet werden?', options:[{label:'Trauung', sub:'ca. 2 Stunden', image:'weddingHands'},{label:'Halber Tag', sub:'Trauung bis Feier', image:'weddingWalk'},{label:'Ganzer Tag', sub:'Vom Getting Ready bis zur Party', image:'wedding'}]},
      {type:'text', name:'Datum', title:'Wann ist euer großer Tag?', placeholder:'z. B. 12. Juni 2027', required:false},
      {type:'text', name:'Location', title:'Wo feiert ihr?', placeholder:'Ort oder Location', required:false},
      {type:'icons', name:'Budget', title:'Welches Budget habt ihr eingeplant?', options:[{label:'Bis 1.500 €', icon:'euro'},{label:'1.500 – 2.500 €', icon:'euro'},{label:'Über 2.500 €', icon:'euro'}]}],
    contact:{title:'Wie erreichen wir euch?', message:true}},
  catering:{name:'Catering-Anfrage', desc:'Anlass, Gäste und Budget – Angebotsanfragen für Caterer und Eventlocations.', cats:['Leads','Gastro & Events'], brand:'#b45309', logo:'Tafelwerk',
    start:{badge:'Angebot in 24 Stunden', title:'Genuss für dein __Event__', text:'Vom Firmenevent bis zur Hochzeit – erzähl uns kurz, was du planst.', image:'catering', cta:'Angebot anfragen'},
    steps:[{type:'icons', name:'Anlass', title:'Was ist der Anlass?', layout:'grid', options:[{label:'Firmenevent', icon:'building'},{label:'Hochzeit', icon:'heart'},{label:'Geburtstag', icon:'gift'},{label:'Sonstiges', icon:'sparkle'}]},
      {type:'slider', name:'Gäste', title:'Mit wie vielen Gästen rechnest du?', min:10, max:500, step:5, def:60, unit:'Gäste'},
      {type:'icons', name:'Stil', title:'Welcher Stil passt?', options:[{label:'Fingerfood', icon:'star'},{label:'Buffet', icon:'users'},{label:'Gesetztes Menü', icon:'sparkle'},{label:'BBQ', icon:'flame'}]},
      {type:'calendar', name:'Datum', title:'Wann findet dein Event statt?'}],
    contact:{message:true}},
  autoankauf:{name:'Auto verkaufen', desc:'Marke, Kilometer und Zustand – Ankaufsanfragen für Autohäuser.', cats:['Leads','Verkauf'], brand:'#0f172a', logo:'Autohaus Nord',
    start:{badge:'Angebot in 24 Stunden', title:'Verkauf dein Auto __zum Bestpreis__', text:'Kostenlose Bewertung, faire Preise und sofortige Auszahlung.', image:'cars', cta:'Auto bewerten'},
    steps:[{type:'text', name:'Fahrzeug', title:'Welches Auto möchtest du verkaufen?', placeholder:'z. B. VW Golf 1.5 TSI', required:true},
      {type:'slider', name:'Baujahr', title:'Aus welchem Jahr ist es?', min:2000, max:2026, step:1, def:2018, unit:''},
      {type:'slider', name:'Kilometer', title:'Wie viele Kilometer hat es?', min:0, max:300000, step:5000, def:80000, unit:'km'},
      {type:'faces', name:'Zustand', title:'Wie ist der Zustand?'}],
    loader:{anim:'globe', title:'Wir prüfen den Marktwert …', lines:['Vergleichsfahrzeuge suchen …','Marktpreise prüfen …','Bewertung vorbereiten …']},
    contact:{title:'Wohin dürfen wir dein Angebot senden?'},
    thanks:{steps:['Bewertung eingegangen | Gerade eben','Dein Ankaufsangebot | Innerhalb von 24 Stunden','Besichtigung & Auszahlung | Am selben Tag']}},
  webdesign:{name:'Website-Projektanfrage', desc:'Projektart, Umfang, Budget – qualifizierte Anfragen für Agenturen.', cats:['Leads','Verkauf'], brand:'#7c3aed', logo:'Studio Pixel',
    start:{badge:'Antwort in 24 Stunden', title:'Deine neue Website, die __Kunden gewinnt__', text:'Beantworte 4 Fragen und erhalte eine erste Einschätzung zu Umfang, Zeit und Budget.', image:'laptop', cta:'Projekt anfragen', proof:{type:'reviews', score:5, count:64, source:'Google'}},
    steps:[{type:'icons', name:'Projekt', title:'Was dürfen wir für dich bauen?', layout:'grid', options:[{label:'Neue Website', icon:'rocket'},{label:'Relaunch', icon:'sparkle'},{label:'Online-Shop', icon:'box'},{label:'Landingpage', icon:'chart'}]},
      {type:'icons', name:'Umfang', title:'Wie umfangreich ist das Projekt?', options:[{label:'Bis 5 Seiten', icon:'check'},{label:'5 – 15 Seiten', icon:'check'},{label:'Mehr als 15 Seiten', icon:'check'}]},
      {type:'icons', name:'Budget', title:'Welches Budget hast du eingeplant?', options:[{label:'Bis 3.000 €', icon:'euro'},{label:'3.000 – 8.000 €', icon:'euro'},{label:'8.000 – 20.000 €', icon:'euro'},{label:'Über 20.000 €', icon:'euro'}]},
      {type:'icons', name:'Start', title:'Wann soll es losgehen?', options:[{label:'Sofort', icon:'rocket'},{label:'In 1–2 Monaten', icon:'calendar'},{label:'Später', icon:'clock'}]}],
    contact:{title:'Wie erreichen wir dich?', message:true}},
  steuer:{name:'Steuerberatung Erstgespräch', desc:'Situation, Anliegen und Termin – Mandantenanfragen für Kanzleien.', cats:['Termine','Dienstleistung'], brand:'#1e3a8a', logo:'Kanzlei Weber',
    start:{badge:'Erstgespräch kostenlos', title:'Steuern __entspannt erledigen__', text:'Sag uns kurz, worum es geht – wir melden uns für ein unverbindliches Erstgespräch.', image:'consulting', cta:'Erstgespräch anfragen'},
    steps:[{type:'icons', name:'Situation', title:'Wer bist du?', options:[{label:'Privatperson', icon:'user'},{label:'Selbstständig / Freiberufler', icon:'rocket'},{label:'GmbH / Unternehmen', icon:'building'},{label:'Gründer', icon:'sparkle'}]},
      {type:'icons', name:'Anliegen', title:'Wobei können wir helfen?', desc:'Mehrfachauswahl möglich', multi:true, options:[{label:'Steuererklärung', icon:'check'},{label:'Buchhaltung', icon:'chart'},{label:'Lohnabrechnung', icon:'users'},{label:'Gründungsberatung', icon:'rocket'},{label:'Steuern optimieren', icon:'piggy'}]},
      {type:'calendar', name:'Termin', title:'Wann passt dir das Erstgespräch?'}],
    contact:{title:'Wie erreichen wir dich?', button:'Termin anfragen'},
    thanks:{title:'Danke, {{vorname|dir}}!', text:'Wir bestätigen dein Erstgespräch in Kürze.', steps:['Anfrage eingegangen | Gerade eben','Terminbestätigung | Per E-Mail','Erstgespräch | Kostenlos und unverbindlich']}},
  restaurant:{name:'Restaurant-Feedback', desc:'Smiley-Bewertung, Lob und Kritik – Zufriedene landen bei Google.', cats:['Feedback','Gastro & Events'], brand:'#9f1239', logo:'Trattoria Sole',
    start:{badge:'Dauert nur 30 Sekunden', title:'Wie hat es dir __bei uns geschmeckt__?', text:'Dein Feedback hilft uns, jeden Abend ein bisschen besser zu werden.', image:'restaurant', cta:'Feedback geben', proof:{type:'none'}},
    steps:[{type:'faces', name:'Bewertung', title:'Wie war dein Besuch insgesamt?'},
      {type:'icons', name:'Highlights', title:'Was hat dir am besten gefallen?', multi:true, required:false, options:[{label:'Essen', icon:'star'},{label:'Service', icon:'users'},{label:'Ambiente', icon:'sparkle'},{label:'Preis/Leistung', icon:'euro'}]},
      {type:'text', name:'Kommentar', title:'Möchtest du uns noch etwas sagen?', placeholder:'Lob, Kritik, Wünsche …', multiline:true, required:false}],
    contact:{title:'Möchtest du eine Antwort von uns?', text:'Optional – lass uns deine E-Mail da, wenn wir uns melden dürfen.', phone:false, button:'Feedback senden'},
    thanks:{title:'Grazie mille!', text:'Danke für dein ehrliches Feedback. Wir freuen uns auf deinen nächsten Besuch.', recap:false, steps:['Feedback eingegangen | Gerade eben','Wir lesen jede Nachricht | Persönlich vom Team']}},
  azubi:{name:'Azubi-Bewerbung', desc:'Ausbildungsberuf, Abschluss und Start – Bewerbung ohne Anschreiben.', cats:['Recruiting'], brand:'#ea580c', logo:'Muster Bau',
    start:{badge:'Ausbildung 2027', title:'Starte deine Ausbildung bei uns – __in 60 Sekunden beworben__', text:'Kein Anschreiben, kein Lebenslauf nötig. Wir melden uns innerhalb von 48 Stunden.', image:'workshopTeam', cta:'Jetzt bewerben', proof:{type:'avatars', text:'**12** Azubis starten jedes Jahr bei uns'}},
    steps:[{type:'icons', name:'Beruf', title:'Welche Ausbildung interessiert dich?', options:[{label:'Anlagenmechaniker/in SHK', icon:'wrench'},{label:'Elektroniker/in', icon:'bolt'},{label:'Kaufmann/-frau für Büromanagement', icon:'chart'},{label:'Noch unsicher', icon:'question'}]},
      {type:'icons', name:'Abschluss', title:'Welchen Schulabschluss hast du (bald)?', options:[{label:'Hauptschulabschluss', icon:'check'},{label:'Mittlere Reife', icon:'check'},{label:'Abitur / Fachabitur', icon:'check'}]},
      {type:'icons', name:'Start', title:'Wann möchtest du starten?', options:[{label:'August 2026', icon:'calendar'},{label:'August 2027', icon:'calendar'},{label:'Erst Praktikum', icon:'rocket'}]}],
    contact:{title:'Wie erreichen wir dich?', text:'Am liebsten per WhatsApp oder Telefon.', button:'Bewerbung absenden'},
    thanks:{title:'Stark, {{vorname|danke}}!', text:'Deine Bewerbung ist da. Wir melden uns innerhalb von 48 Stunden.', recap:false, steps:['Bewerbung eingegangen | Gerade eben','Kurzes Telefonat | Innerhalb von 48 Stunden','Kennenlernen im Betrieb | Mit Probetag']}},
  pflege:{name:'Pflegekräfte-Recruiting', desc:'Qualifikation, Arbeitszeit und Bereich – Bewerbung in 60 Sekunden.', cats:['Recruiting','Gesundheit'], brand:'#0e7490', logo:'Pflege mit Herz',
    start:{badge:'Bis zu 4.200 € brutto', title:'Pflege, die __wertgeschätzt__ wird', text:'Feste Dienstpläne, faires Gehalt, echtes Team. Bewirb dich in 60 Sekunden – ohne Lebenslauf.', image:'nurse', cta:'Jetzt bewerben'},
    steps:[{type:'icons', name:'Qualifikation', title:'Welche Qualifikation hast du?', options:[{label:'Pflegefachkraft (examiniert)', icon:'shield'},{label:'Pflegehelfer/in', icon:'heart'},{label:'In Ausbildung', icon:'rocket'},{label:'Quereinsteiger/in', icon:'sparkle'}]},
      {type:'icons', name:'Arbeitszeit', title:'Welche Arbeitszeit wünschst du dir?', options:[{label:'Vollzeit', icon:'clock'},{label:'Teilzeit', icon:'clock'},{label:'Minijob', icon:'clock'}]},
      {type:'icons', name:'Bereich', title:'In welchem Bereich möchtest du arbeiten?', options:[{label:'Ambulant', icon:'car'},{label:'Stationär', icon:'building'},{label:'Egal', icon:'thumb'}]}],
    contact:{title:'Wie erreichen wir dich?', button:'Bewerbung absenden'},
    thanks:{title:'Danke, {{vorname|dir}}!', text:'Wir melden uns innerhalb von 48 Stunden bei dir.', recap:false, steps:['Bewerbung eingegangen | Gerade eben','Kurzes Telefonat | Innerhalb von 48 Stunden','Kennenlernen & Hospitation | Ganz entspannt']}},
  ferienhaus:{name:'Ferienhaus-Anfrage', desc:'Zeitraum, Gäste und Wünsche – Buchungsanfragen für Ferienhäuser und Hotels.', cats:['Leads','Gastro & Events'], brand:'#166534', logo:'Waldhaus am See',
    start:{badge:'Direkt buchen & sparen', title:'Deine __Auszeit__ im Grünen', text:'Frag jetzt deinen Wunschzeitraum an – ohne Buchungsgebühr.', image:'cabin', cta:'Verfügbarkeit prüfen'},
    steps:[{type:'text', name:'Zeitraum', title:'Wann möchtest du anreisen?', placeholder:'z. B. 14.–21. August', required:true},
      {type:'slider', name:'Gäste', title:'Wie viele Personen reisen?', min:1, max:10, step:1, def:2, unit:'Personen'},
      {type:'icons', name:'Wünsche', title:'Hast du besondere Wünsche?', multi:true, required:false, options:[{label:'Hund dabei', icon:'heart'},{label:'Sauna', icon:'flame'},{label:'Frühstück', icon:'sun'},{label:'Kinderbett', icon:'users'}]}],
    contact:{title:'Wohin dürfen wir dein Angebot senden?', message:true}}
};
/* Ohne KI-Anbindung: passende Branchen-Vorlage per Stichwort finden und mit Firmenname/Farbe anpassen */
var AI_WORDS = {bad:'bad badezimmer dusche wanne sanitär fliesen', dach:'dach dachdecker ziegel dachsanierung', waermepumpe:'wärmepumpe heizung heizungsbauer energie', fenster:'fenster tür türen rollladen glas', kueche:'küche küchenstudio küchenplanung', garten:'garten galabau landschaft pflaster rasen', maler:'maler streichen tapezieren fassade farbe', umzug:'umzug umzüge spedition möbel', reinigung:'reinigung gebäudereinigung putzen büro sauber', fitness:'fitness studio gym training probetraining sport', beauty:'kosmetik beauty spa massage nagel friseur', hochzeit:'hochzeit fotograf foto fotografie', catering:'catering event feier party buffet location', autoankauf:'auto autohaus fahrzeug ankauf kfz', webdesign:'website webdesign agentur marketing online shop', steuer:'steuer steuerberater kanzlei buchhaltung anwalt beratung', restaurant:'restaurant café gastronomie bewertung feedback essen', azubi:'azubi ausbildung lehrling auszubildende', pflege:'pflege pflegekraft altenpflege krankenpflege', ferienhaus:'ferienhaus ferienwohnung hotel urlaub unterkunft'};
function aiFallback(prompt, o){
  o = o || {}; var p = String(prompt || '').toLowerCase(), best = 'webdesign', score = 0;
  Object.keys(AI_WORDS).forEach(function(k){ var sc = 0; AI_WORDS[k].split(' ').forEach(function(w){ if(w && p.indexOf(w) >= 0) sc += w.length; }); if(sc > score){ score = sc; best = k; } });
  var sp = JSON.parse(JSON.stringify(SPECS[best]));
  if(o.company) sp.logo = o.company;
  if(o.brand) sp.brand = o.brand;
  sp.address = o.address === 'sie' ? 'sie' : 'du';
  sp.name = (o.company ? o.company + ' – ' : '') + sp.name;
  return {spec:sp, base:best, matched:score > 0};
}
Object.keys(SPECS).forEach(function(k){ var sp = SPECS[k]; TEMPLATES_EXTRA.push({id:k, make:function(){ return fromSpec(sp); }}); });

var TEMPLATES = [
  {id:'gehlen-tisch', make:tGehlen}, {id:'gehlen-feedback', make:tGehlenFeedback}, {id:'koelner-zoo', make:tZoo}, {id:'schwimmbad', make:tSchwimmbad}, {id:'terrasse', make:tTerrasse}, {id:'solar', make:tSolar}, {id:'immo', make:tImmo}, {id:'strategy', make:tStrategy},
  {id:'montage', make:tMontage}, {id:'recruiting', make:tRecruiting}, {id:'quiz', make:tQuiz}, {id:'feedback', make:tFeedback}, {id:'abnahme', make:tAbnahme},
  {id:'freebie', make:tFreebie}, {id:'blank', make:tBlank}
];
/* Branchen-Vorlagen vor „Leerer Funnel“ einreihen */
Array.prototype.splice.apply(TEMPLATES, [TEMPLATES.length - 1, 0].concat(TEMPLATES_EXTRA));


/* Feste Layout-Werte aus Vorlagen-CSS in Theme-Einstellungen übernehmen, damit „Abstand oben“, Fortschrittsbalken und
   Button-Größe im Design-Tab wirken (eigenes CSS hätte sonst Vorrang). Ergebnis sieht identisch aus. Gibt true zurück, wenn etwas übernommen wurde. */
function liftCss(t){
  if(!t || !t.customCss) return false;
  var css = String(t.customCss), before = css, set = function(k, v){ if(t[k] == null || t[k] === '') t[k] = v; };
  var top = null, hg = null;
  css = css.replace(/(^|\n)\.fp\.prog-top \.fp-top\{padding-top:(\d+)px\}(?=\n|$)/, function(m, a, n){ top = +n; set('spTop', top); return a; });
  css = css.replace(/(^|\n)\.fp\.prog-top \.fp-prog\{margin:0 0 (\d+)px;height:(\d+)px;background:rgba\(43,42,43,\.1\)\}(?=\n|$)/, function(m, a, mb, h){ hg = +mb; set('spHead', hg); set('progH', +h); return a; });
  css = css.replace(/(^|\n)\.fp-body\{padding-top:(\d+)px\}(?=\n|$)/, function(m, a, n){ set('spContent', +n); return a; });
  /* Zeilenhöhe der Überschriften in die Einstellung übernehmen, damit der Regler im Design-Tab wirkt */
  css = css.replace(/(^|\n)\.fp-h1,\.fp-h2,\.fp-h3\{line-height:([\d.]+);?([^}\n]*)\}(?=\n|$)/, function(m, a, n, rest){ set('headingLh', +n); return rest ? a + '.fp-h1,.fp-h2,.fp-h3{' + rest + '}' : a; });
  css = css.replace(/\.fp-btn\{font-size:([^;{}]+);min-height:[^;{}]+;padding:(\d+)px (\d+)px\}/, function(m, fs, py, px){ if(t.btnPad == null || +t.btnPad === +py) t.btnPad = 19; set('btnPadX', +px); return '.fp-btn{font-size:'+fs+'}'; });
  /* Desktop-Werte relativ zu den Einstellungen statt fest */
  if(top != null) css = css.replace(/\.fp\.prog-top \.fp-top\{padding-top:(\d+)px\}/g, function(m, n){ return '.fp.prog-top .fp-top{padding-top:calc(var(--tpt,'+top+'px) + '+(n - top)+'px)}'; });
  if(hg != null) css = css.replace(/\.fp\.prog-top \.fp-prog\{margin-bottom:(\d+)px\}/g, function(m, n){ return '.fp.prog-top .fp-prog{margin-bottom:calc(var(--hg,'+hg+'px) + '+(n - hg)+'px)}'; });
  css = css.replace(/\n{2,}/g, '\n').replace(/^\n/, '');
  if(css === before) return false;
  t.customCss = css; return true;
}
/* Vorlagen einheitlich mittig: Überschriften, Texte, Badges, Fragen, Bewertungen, Vertrauens-Elemente und schmale Buttons.
   Listen, Eingabefelder und Antwort-Karten bleiben linksbündig (dort liest es sich besser). */
var CENTER = {heading:1, text:1, badge:1, trust:1, reviews:1, avatars:1, logos:1, rating:1, countdown:1, choice:1, slider:1, button:1};
function centerPages(d){
  (d && d.pages || []).forEach(function(pg){ (pg.blocks || []).forEach(function(b){ if(CENTER[b.type] && b.props && b.props.align !== 'right') b.props.align = 'center'; }); });
  return d;
}
TEMPLATES.forEach(function(tp){ var mk = tp.make; tp.make = function(){ var d = mk(); liftCss(d.theme); if(tp.id !== 'blank') centerPages(d); return d; }; });

function newFunnel(tplId, overrides){
  var t = TEMPLATES.filter(function(x){return x.id===tplId;})[0] || TEMPLATES[TEMPLATES.length-1];
  return newFunnelFrom(t.make(), tplId, overrides);
}
/* Funnel aus fertigen Vorlagen-Daten (z. B. aus der KI-Erstellung) */
function newFunnelFrom(d, tplId, overrides){
  var now = Date.now();
  /* Neue Funnels zeigen das TapTell-Abzeichen in der Fußzeile (im Design-Tab ausblendbar) */
  var th = Object.assign({footBadge:true}, d.theme || {});
  return Object.assign({id:uid()+uid().slice(0,4), name:d.name, template:tplId, status:'draft', createdAt:now, updatedAt:now, theme:th, settings:Object.assign({currency:'EUR', basePrice:0, baseLabel:'Grundpreis', webhook:'', redirect:'', pixel:''}, d.settings||{}), pages:d.pages, stats:{views:0, starts:0, completes:0, pages:{}, daily:{}}}, overrides||{});
}

window.FS_T = {uid:uid, clone:clone, THEMES:THEMES, THEME_BASE:THEME_BASE, theme:theme, DEF:DEF, LIB:LIB, SECTIONS:SECTIONS, B:B, P:P, O:O, fromLib:fromLib, TEMPLATES:TEMPLATES, CATS:CATS, newFunnel:newFunnel, newFunnelFrom:newFunnelFrom, art:art, liftCss:liftCss, fromSpec:function(s){ return centerPages(fromSpec(s)); }, centerPages:centerPages, IMG:IMG, SPECS:SPECS, aiFallback:aiFallback};
})();
