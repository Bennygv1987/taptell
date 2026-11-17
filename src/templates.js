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
  video:       function(){ return {url:'', radius:14}; },
  list:        function(){ return {items:['Erster Vorteil','Zweiter Vorteil','Dritter Vorteil'], icon:'check'}; },
  testimonial: function(){ return {quote:'„Super Beratung, schnelle Umsetzung – absolut empfehlenswert!“', name:'Julia Schneider', role:'Kundin aus Düsseldorf', stars:5, img:''}; },
  trust:       function(){ return {items:['⭐ 4,9 bei Google','✓ 500+ Kunden','🔒 DSGVO-konform'], align:'center'}; },
  faq:         function(){ return {items:[{q:'Ist das Angebot kostenlos?', a:'Ja, die Anfrage ist komplett kostenlos und unverbindlich.'},{q:'Wie schnell meldet ihr euch?', a:'In der Regel innerhalb von 24 Stunden an Werktagen.'}]}; },
  countdown:   function(){ return {minutes:15, label:'Dein Angebot ist reserviert für', align:'center'}; },
  choice:      function(){ return {question:'Deine Frage?', desc:'', key:'', layout:'list', multi:false, autoNext:true, required:true, showPrices:false, options:[O('Option A','👍'),O('Option B','✌️'),O('Option C','🙌')]}; },
  input:       function(){ return {label:'Dein Name', placeholder:'Max Mustermann', inputType:'text', key:'name', required:true}; },
  slider:      function(){ return {label:'Wie viel?', min:0, max:100, step:1, def:50, unit:'', key:'', isQuantity:false, align:'left'}; },
  rating:      function(){ return {label:'Wie zufrieden bist du?', max:5, style:'stars', key:'bewertung', required:true, autoNext:false, align:'center', minLabel:'', maxLabel:''}; },
  calendar:    function(){ return {label:'Wähle deinen Wunschtermin', days:10, offset:1, excludeDays:[0,6], slots:['09:00','10:30','12:00','14:00','15:30','17:00'], key:'termin', required:true}; },
  upload:      function(){ return {label:'Foto hochladen', cta:'Datei auswählen', hint:'JPG, PNG oder PDF', accept:'image/*,.pdf', key:'upload', required:false}; },
  signature:   function(){ return {label:'Unterschrift', hint:'Hier mit dem Finger unterschreiben', key:'unterschrift', required:true}; },
  checkbox:    function(){ return {text:'Ich stimme der **Datenschutzerklärung** zu und möchte kontaktiert werden.', key:'einwilligung', required:true}; },
  button:      function(){ return {label:'Weiter', action:'next', target:'', url:'', variant:'', full:true, shadow:true, arrow:true, pulse:false, sub:''}; },
  summary:     function(){ return {title:'Deine Konfiguration', totalLabel:'Geschätzter Gesamtpreis', note:'Unverbindliche Schätzung inkl. MwSt.', showItems:true, compact:false, prefix:''}; },
  spacer:      function(){ return {height:24}; },
  divider:     function(){ return {mt:4, mb:20}; },
  html:        function(){ return {code:'<div style="padding:16px;border-radius:12px;background:#f4f5f8;text-align:center">Eigener HTML-Code</div>'}; }
};

var LIB = [
  {id:'heading', type:'heading', n:'Überschrift', ic:'heading', g:'Inhalt'},
  {id:'text', type:'text', n:'Text', ic:'type', g:'Inhalt'},
  {id:'image', type:'image', n:'Bild', ic:'image', g:'Inhalt'},
  {id:'video', type:'video', n:'Video', ic:'video', g:'Inhalt'},
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
  {id:'faq', type:'faq', n:'FAQ', ic:'help', g:'Vertrauen'},
  {id:'countdown', type:'countdown', n:'Countdown', ic:'clock', g:'Vertrauen'},
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
  {id:'s-book', n:'Terminbuchung', ic:'calendar', make:function(){ return [B('heading',{text:'Wann passt es dir am besten?', level:2}), B('calendar',{}), B('button',{label:'Termin auswählen'})]; }}
];

/* ---------- templates ---------- */
var CATS = ['Alle','Konfigurator','Leads','Termine','Recruiting','Feedback','Verkauf'];

function tTerrasse(){
  var mat = B('choice',{question:'Welches Material wünschst du dir?', key:'material', layout:'image', showPrices:true, options:[
    O('WPC-Dielen','🪵',{sub:'Pflegeleicht & splitterfrei', unitPrice:89, unitLabel:'m²', img:art('🪵','#c9a27a','#8a6544')}),
    O('Bangkirai','🌳',{sub:'Edles Hartholz', unitPrice:119, unitLabel:'m²', img:art('🌳','#a5764c','#5f3f22')}),
    O('Lärche','🌲',{sub:'Natürlich & regional', unitPrice:79, unitLabel:'m²', img:art('🌲','#d8b98c','#9c7a4e')}),
    O('Keramik','⬜',{sub:'Modern & robust', unitPrice:139, unitLabel:'m²', img:art('◻️','#cfd3d6','#8d959b')})]});
  var size = B('slider',{label:'', min:5, max:100, step:1, def:25, unit:'m²', key:'flaeche', isQuantity:true});
  var extras = B('choice',{question:'Welche Extras sollen dazu?', desc:'Mehrfachauswahl möglich', key:'extras', multi:true, autoNext:false, required:false, showPrices:true, options:[
    O('Alu-Unterkonstruktion','🔩',{unitPrice:25, unitLabel:'m²'}), O('LED-Beleuchtung','💡',{price:890}), O('Treppe / Stufen','🪜',{price:650}), O('Sichtschutz','🧱',{price:1200}), O('Montage durch Fachbetrieb','🛠️',{unitPrice:35, unitLabel:'m²'})]});
  var when = B('choice',{question:'Wann soll es losgehen?', key:'zeitraum', options:[O('So schnell wie möglich','⚡'),O('In 1–3 Monaten','📅'),O('In 3–6 Monaten','🗓️'),O('Ich informiere mich nur','🔍')]});
  return {name:'Terrassen-Konfigurator', desc:'Material, Fläche & Extras wählen – mit Live-Preis und Angebotsanfrage.', cats:['Konfigurator','Leads'],
    theme:theme('forest',{logoText:'🌿 Terrassenbau Muster'}), settings:{currency:'EUR', basePrice:0},
    pages:[
      P('Start',[B('image',{src:art('🏡','#7fae8e','#2f6b4f'), height:210, radius:18}), B('badge',{text:'⚡ Preis in 60 Sekunden', align:'left'}), B('heading',{text:'Konfiguriere deine ==Traumterrasse==', level:1}), B('text',{text:'Wähle Material, Größe und Extras – und erhalte sofort eine unverbindliche Preisschätzung.'}), B('button',{label:'Jetzt konfigurieren', sub:'Kostenlos & unverbindlich'}), B('trust',{items:['⭐ 4,9 Google','✓ 320+ Terrassen','📍 Regional']})]),
      P('Material',[B('heading',{text:'Schritt 1: Material', level:3, color:'#2f6b4f', mb:6}), mat]),
      P('Größe',[B('heading',{text:'Wie groß soll deine Terrasse werden?', level:2}), B('text',{text:'Grobe Schätzung reicht – wir messen vor Ort genau aus.', mb:20}), size, B('spacer',{height:8}), B('summary',{compact:true, title:'Geschätzter Preis', prefix:'ab', note:''})]),
      P('Extras',[extras, B('summary',{compact:true, title:'Aktueller Preis', prefix:'', note:''})]),
      P('Zeitraum',[when]),
      P('Zusammenfassung',[B('heading',{text:'Deine Wunschterrasse', level:2}), B('summary',{}), B('button',{label:'Angebot anfordern'})]),
      P('Kontakt',[B('heading',{text:'Wohin dürfen wir dein Angebot senden?', level:2}), B('input',{label:'Vor- und Nachname', placeholder:'Max Mustermann', key:'name', icon:'user'}), B('input',{label:'E-Mail-Adresse', placeholder:'max@beispiel.de', inputType:'email', key:'email'}), B('input',{label:'Telefonnummer', placeholder:'+49 170 1234567', inputType:'tel', key:'telefon'}), B('upload',{label:'Foto der Fläche (optional)', key:'foto'}), B('checkbox',{}), B('button',{label:'Kostenloses Angebot anfordern', action:'submit'})]),
      P('Danke',[B('spacer',{height:30}), B('heading',{text:'Danke, {{vorname}}! 🎉', align:'center'}), B('text',{text:'Deine Anfrage über **{{total}}** ist eingegangen. Wir melden uns innerhalb von 24 Stunden mit deinem Angebot.', align:'center'}), B('list',{items:['Wir prüfen deine Konfiguration','Kostenloser Aufmaß-Termin vor Ort','Verbindliches Festpreis-Angebot'], icon:'number'})],{hideProgress:true, allowBack:false})
    ]};
}

function tSolar(){
  return {name:'Solar-Angebot', desc:'Hausart, Dach & Verbrauch abfragen – qualifizierte Solar-Leads.', cats:['Leads','Termine'],
    theme:theme('solar',{logoText:'☀️ SonnenPlus'}), settings:{currency:'EUR'},
    pages:[
      P('Start',[B('image',{src:art('☀️','#ffd65a','#ff9a3c'), height:200, radius:18}), B('heading',{text:'Wie viel kannst du mit Solar ==sparen==?', align:'center'}), B('text',{text:'Jetzt in 4 Schritten kostenlos prüfen, ob sich eine PV-Anlage für dich lohnt.', align:'center'}), B('button',{label:'Jetzt Ersparnis berechnen', pulse:true}), B('trust',{items:['🏆 Testsieger 2026','✓ 2.400+ Anlagen','🇩🇪 Meisterbetrieb']})]),
      P('Hausart',[B('choice',{question:'Um welches Gebäude handelt es sich?', key:'hausart', layout:'grid', options:[O('Einfamilienhaus','🏠'),O('Doppelhaus','🏘️'),O('Mehrfamilienhaus','🏢'),O('Gewerbe','🏭')]})]),
      P('Dach',[B('choice',{question:'Welche Dachform hast du?', key:'dachform', layout:'grid', options:[O('Satteldach','🔺'),O('Flachdach','▬'),O('Pultdach','◢'),O('Walmdach','⬟')]})]),
      P('Verbrauch',[B('heading',{text:'Wie hoch ist dein Stromverbrauch?', level:2}), B('text',{text:'Steht auf deiner Jahresabrechnung.', mb:22}), B('slider',{label:'', min:1500, max:12000, step:250, def:4000, unit:'kWh/Jahr', key:'verbrauch'})]),
      P('Speicher',[B('choice',{question:'Interessierst du dich für einen Stromspeicher?', key:'speicher', options:[O('Ja, unbedingt','🔋'),O('Vielleicht','🤔'),O('Nein','✖️')]})]),
      P('PLZ',[B('heading',{text:'Wo befindet sich das Gebäude?', level:2}), B('input',{label:'Postleitzahl', placeholder:'41516', key:'plz', inputType:'number'})]),
      P('Kontakt',[B('badge',{text:'✅ Deine Region wird beliefert', align:'left'}), B('heading',{text:'Wohin dürfen wir deine Berechnung senden?', level:2}), B('input',{label:'Name', placeholder:'Max Mustermann', key:'name', icon:'user'}), B('input',{label:'E-Mail', placeholder:'max@beispiel.de', inputType:'email', key:'email'}), B('input',{label:'Telefon', placeholder:'+49 170 1234567', inputType:'tel', key:'telefon'}), B('checkbox',{}), B('button',{label:'Berechnung anfordern', action:'submit'})]),
      P('Danke',[B('spacer',{height:30}), B('heading',{text:'Perfekt, {{vorname}}! ☀️', align:'center'}), B('text',{text:'Ein Solar-Experte meldet sich innerhalb von 24 Stunden mit deiner persönlichen Berechnung.', align:'center'})],{hideProgress:true, allowBack:false})
    ]};
}

function tImmo(){
  return {name:'Immobilienbewertung', desc:'Kostenlose Werteinschätzung als Lead-Magnet für Makler.', cats:['Leads'],
    theme:theme('ocean',{logoText:'Immo Rheinland'}), settings:{currency:'EUR'},
    pages:[
      P('Start',[B('badge',{text:'🏠 Kostenlos in 2 Minuten', align:'center'}), B('heading',{text:'Was ist deine Immobilie ==wirklich wert==?', align:'center'}), B('text',{text:'Erhalte eine kostenlose Wertermittlung auf Basis aktueller Marktdaten.', align:'center'}), B('button',{label:'Jetzt Wert ermitteln'}), B('testimonial',{quote:'„Die Einschätzung war erstaunlich genau – verkauft haben wir 3 % darüber.“', name:'Thomas K.', role:'Verkäufer aus Neuss'})]),
      P('Objektart',[B('choice',{question:'Was möchtest du bewerten lassen?', key:'objekt', layout:'grid', options:[O('Wohnung','🏢'),O('Haus','🏠'),O('Grundstück','🌳'),O('Gewerbe','🏬')]})]),
      P('Fläche',[B('heading',{text:'Wie groß ist die Wohnfläche?', level:2, mb:24}), B('slider',{min:20, max:400, step:5, def:120, unit:'m²', key:'wohnflaeche'})]),
      P('Baujahr',[B('choice',{question:'Wann wurde die Immobilie gebaut?', key:'baujahr', options:[O('Vor 1950'),O('1950 – 1979'),O('1980 – 1999'),O('2000 – 2015'),O('Nach 2015')]})]),
      P('Zustand',[B('choice',{question:'Wie ist der Zustand?', key:'zustand', layout:'grid', options:[O('Neuwertig','✨'),O('Gepflegt','👍'),O('Renovierungsbedürftig','🔧'),O('Sanierungsbedürftig','🏚️')]})]),
      P('Verkauf',[B('choice',{question:'Planst du einen Verkauf?', key:'verkauf', options:[O('Ja, in den nächsten 3 Monaten','🔥'),O('Ja, in 6–12 Monaten','📅'),O('Nein, nur Interesse','💡')]})]),
      P('Kontakt',[B('heading',{text:'Wohin dürfen wir die Bewertung senden?', level:2}), B('input',{label:'Name', placeholder:'Max Mustermann', key:'name', icon:'user'}), B('input',{label:'E-Mail', placeholder:'max@beispiel.de', inputType:'email', key:'email'}), B('input',{label:'Telefon', placeholder:'+49 170 1234567', inputType:'tel', key:'telefon', required:false}), B('checkbox',{}), B('button',{label:'Bewertung anfordern', action:'submit'})]),
      P('Danke',[B('spacer',{height:30}), B('heading',{text:'Danke, {{vorname}}!', align:'center'}), B('text',{text:'Deine Wertermittlung ist in Arbeit und kommt in Kürze per E-Mail.', align:'center'})],{hideProgress:true, allowBack:false})
    ]};
}

function tStrategy(){
  return {name:'Strategiegespräch', desc:'VSL + Qualifizierung + Terminwahl – für Coaches & Agenturen.', cats:['Termine','Verkauf'],
    theme:theme('midnight',{logoText:'GROWTH//LAB'}), settings:{currency:'EUR'},
    pages:[
      P('Video',[B('badge',{text:'🎥 Kostenloses Video-Training', align:'center'}), B('heading',{text:'Wie wir Agenturen zu ==planbaren Neukunden== verhelfen', align:'center', level:2}), B('video',{url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}), B('button',{label:'Kostenloses Erstgespräch sichern', pulse:true, sub:'Nur 4 freie Plätze diese Woche'}), B('countdown',{minutes:15})]),
      P('Umsatz',[B('choice',{question:'Wie hoch ist dein aktueller Monatsumsatz?', key:'umsatz', options:[O('Unter 10.000 €','🌱',{score:1}),O('10.000 – 30.000 €','📈',{score:2}),O('30.000 – 100.000 €','🚀',{score:3}),O('Über 100.000 €','🏆',{score:4})]})]),
      P('Herausforderung',[B('choice',{question:'Was ist aktuell deine größte Herausforderung?', desc:'Mehrfachauswahl möglich', key:'herausforderung', multi:true, autoNext:false, options:[O('Zu wenig Anfragen','📉'),O('Unplanbarer Umsatz','🎢'),O('Keine Zeit für Vertrieb','⏱️'),O('Team & Prozesse','🧩')]})]),
      P('Termin',[B('heading',{text:'Wähle deinen Wunschtermin', level:2}), B('text',{text:'30 Minuten · per Zoom · kostenlos'}), B('calendar',{label:''})]),
      P('Kontakt',[B('heading',{text:'Fast geschafft!', level:2}), B('input',{label:'Name', key:'name', icon:'user'}), B('input',{label:'E-Mail', inputType:'email', key:'email', placeholder:'max@beispiel.de'}), B('input',{label:'Telefon / WhatsApp', inputType:'tel', key:'telefon', placeholder:'+49 170 1234567'}), B('checkbox',{}), B('button',{label:'Termin verbindlich buchen', action:'submit'})]),
      P('Bestätigung',[B('spacer',{height:30}), B('heading',{text:'Termin bestätigt ✅', align:'center'}), B('text',{text:'Wir sehen uns am **{{termin}}**. Die Einladung kommt per E-Mail.', align:'center'}), B('faq',{items:[{q:'Wie bereite ich mich vor?', a:'Notiere dir deine wichtigsten Ziele für die nächsten 12 Monate.'},{q:'Kann ich den Termin verschieben?', a:'Ja, über den Link in deiner Bestätigungsmail.'}]})],{hideProgress:true, allowBack:false})
    ]};
}

function tRecruiting(){
  return {name:'Express-Bewerbung', desc:'Bewerbung in 60 Sekunden – ohne Anschreiben und Lebenslauf.', cats:['Recruiting'],
    theme:theme('sunset',{logoText:'Muster Haustechnik'}), settings:{currency:'EUR'},
    pages:[
      P('Job',[B('image',{src:art('🔧','#ffb199','#ff5a36'), height:180, radius:20}), B('badge',{text:'📍 Neuss · Vollzeit · ab sofort', align:'left'}), B('heading',{text:'Anlagenmechaniker SHK (m/w/d) gesucht', level:2}), B('list',{items:['Übertarifliche Bezahlung + Weihnachtsgeld','Neuer Firmenwagen – auch privat','4-Tage-Woche möglich','Top-Ausstattung & Weiterbildungen']}), B('button',{label:'In 60 Sekunden bewerben', sub:'Kein Lebenslauf nötig'}), B('testimonial',{quote:'„Bestes Team, in dem ich je gearbeitet habe. Hier wird man wertgeschätzt.“', name:'Murat Y.', role:'Seit 2021 im Team'})]),
      P('Ausbildung',[B('choice',{question:'Hast du eine abgeschlossene Ausbildung im SHK-Bereich?', key:'ausbildung', options:[O('Ja','✅'),O('Nein, aber Berufserfahrung','🛠️'),O('Nein','✖️')]})]),
      P('Erfahrung',[B('choice',{question:'Wie viele Jahre Berufserfahrung hast du?', key:'erfahrung', layout:'grid', options:[O('0–2 Jahre','🌱'),O('3–5 Jahre','💪'),O('6–10 Jahre','⭐'),O('10+ Jahre','🏆')]})]),
      P('Start',[B('choice',{question:'Wann könntest du starten?', key:'start', options:[O('Sofort','⚡'),O('In 1 Monat','📅'),O('In 2–3 Monaten','🗓️'),O('Später','⏳')]})]),
      P('Kontakt',[B('heading',{text:'Wie erreichen wir dich?', level:2}), B('input',{label:'Name', key:'name', icon:'user'}), B('input',{label:'Telefon / WhatsApp', inputType:'tel', key:'telefon', placeholder:'+49 170 1234567'}), B('input',{label:'E-Mail', inputType:'email', key:'email', placeholder:'max@beispiel.de', required:false}), B('upload',{label:'Lebenslauf (optional)', key:'lebenslauf', accept:'.pdf,image/*'}), B('checkbox',{text:'Ich stimme der Verarbeitung meiner Daten im Rahmen der Bewerbung zu.'}), B('button',{label:'Bewerbung absenden', action:'submit'})]),
      P('Danke',[B('spacer',{height:30}), B('heading',{text:'Danke für deine Bewerbung, {{vorname}}! 🙌', align:'center', level:2}), B('text',{text:'Wir melden uns innerhalb von 48 Stunden telefonisch bei dir.', align:'center'})],{hideProgress:true, allowBack:false})
    ]};
}

function tQuiz(){
  var r1 = P('Ergebnis: Kompakt',[B('badge',{text:'🎯 Dein Ergebnis', align:'center'}), B('heading',{text:'Die Kompakte ☕', align:'center'}), B('image',{src:art('☕','#f7a6c9','#e0338a'), height:180}), B('text',{text:'Schnell, unkompliziert und platzsparend – perfekt für deinen Alltag.', align:'center'}), B('button',{label:'Zum Produkt', action:'url', url:'https://example.com/kompakt'})],{hideProgress:true, allowBack:false});
  var r2 = P('Ergebnis: Allrounder',[B('badge',{text:'🎯 Dein Ergebnis', align:'center'}), B('heading',{text:'Der Allrounder ✨', align:'center'}), B('image',{src:art('🥤','#c7b5ff','#7b5cff'), height:180}), B('text',{text:'Vielfalt auf Knopfdruck – von Espresso bis Latte macchiato.', align:'center'}), B('button',{label:'Zum Produkt', action:'url', url:'https://example.com/allrounder'})],{hideProgress:true, allowBack:false});
  var r3 = P('Ergebnis: Barista',[B('badge',{text:'🎯 Dein Ergebnis', align:'center'}), B('heading',{text:'Die Barista-Maschine 🏆', align:'center'}), B('image',{src:art('🫘','#e3b48a','#7a4a28'), height:180}), B('text',{text:'Für echte Genießer, die volle Kontrolle wollen.', align:'center'}), B('button',{label:'Zum Produkt', action:'url', url:'https://example.com/barista'})],{hideProgress:true, allowBack:false});
  var mail = P('E-Mail',[B('heading',{text:'Dein Ergebnis ist fertig! 🎉', level:2, align:'center'}), B('text',{text:'Wohin dürfen wir dir deine Empfehlung + 10 % Gutschein senden?', align:'center'}), B('input',{label:'', placeholder:'Deine E-Mail-Adresse', inputType:'email', key:'email'}), B('checkbox',{text:'Ich möchte den Newsletter erhalten und stimme dem Datenschutz zu.'}), B('button',{label:'Ergebnis anzeigen', action:'submit'})]);
  mail.scoreRoutes = [{min:0, max:4, goto:r1.id},{min:5, max:7, goto:r2.id},{min:8, max:99, goto:r3.id}];
  return {name:'Produktfinder-Quiz', desc:'Punktebasiertes Quiz mit individuellen Ergebnisseiten.', cats:['Leads','Verkauf'],
    theme:theme('candy',{logoText:'brewly'}), settings:{currency:'EUR'},
    pages:[
      P('Start',[B('heading',{text:'Welche Kaffeemaschine ==passt zu dir==?', align:'center'}), B('text',{text:'3 Fragen – 30 Sekunden – deine perfekte Empfehlung.', align:'center'}), B('image',{src:art('☕','#ffc2dd','#e0338a'), height:190, radius:24}), B('button',{label:'Quiz starten'})]),
      P('Tassen',[B('choice',{question:'Wie viele Tassen trinkst du am Tag?', key:'tassen', layout:'grid', options:[O('1','☕',{score:1}),O('2–3','☕☕',{score:2}),O('4+','🔥',{score:3})]})]),
      P('Wichtig',[B('choice',{question:'Was ist dir am wichtigsten?', key:'prioritaet', options:[O('Geschwindigkeit','⚡',{score:1}),O('Vielfalt','🎨',{score:2}),O('Perfekter Geschmack','👌',{score:3})]})]),
      P('Budget',[B('choice',{question:'Wie hoch ist dein Budget?', key:'budget', options:[O('Bis 200 €','💶',{score:1}),O('200 – 600 €','💳',{score:2}),O('Über 600 €','💎',{score:3})]})]),
      mail, r1, r2, r3
    ]};
}

function tFeedback(){
  return {name:'Kundenfeedback', desc:'Sterne, NPS und Freitext – mit Weiterleitung zu Google bei 5 Sternen.', cats:['Feedback'],
    theme:theme('clean',{logoText:'Salon Mia', primary:'#111827'}), settings:{currency:'EUR'},
    pages:[
      P('Bewertung',[B('heading',{text:'Wie war dein Besuch bei uns?', align:'center', level:2}), B('text',{text:'Dein Feedback hilft uns, jeden Tag besser zu werden.', align:'center', mb:24}), B('rating',{label:'', autoNext:true, minLabel:'Schlecht', maxLabel:'Hervorragend'})]),
      P('NPS',[B('rating',{label:'Wie wahrscheinlich empfiehlst du uns weiter?', style:'nps', key:'nps', align:'left', required:true})]),
      P('Freitext',[B('input',{label:'Was können wir besser machen?', inputType:'textarea', key:'feedback', placeholder:'Dein Feedback …', required:false}), B('input',{label:'Name (optional)', key:'name', required:false})]),
      P('Danke',[B('spacer',{height:30}), B('heading',{text:'Danke für dein Feedback! 💛', align:'center'}), B('text',{text:'Hat es dir gefallen? Wir freuen uns riesig über eine Google-Bewertung.', align:'center'}), B('button',{label:'Auf Google bewerten', action:'url', url:'https://g.page/r/', variant:'outline', arrow:false})],{hideProgress:true, allowBack:false})
    ]};
}

function tAbnahme(){
  return {name:'Montage-Abnahme', desc:'Digitales Abnahmeprotokoll mit Checkliste, Foto & Unterschrift.', cats:['Feedback'],
    theme:theme('mono',{logoText:'ABNAHME·PROTOKOLL'}), settings:{currency:'EUR'},
    pages:[
      P('Auftrag',[B('heading',{text:'Montage-Abnahme', level:2}), B('text',{text:'Bitte gemeinsam mit dem Kunden ausfüllen.'}), B('input',{label:'Auftragsnummer', placeholder:'A-2026-0142', key:'auftrag'}), B('input',{label:'Name des Kunden', key:'name', icon:'user'}), B('input',{label:'Datum der Montage', inputType:'date', key:'datum'})]),
      P('Checkliste',[B('choice',{question:'Folgende Punkte wurden geprüft:', key:'checkliste', multi:true, autoNext:false, required:true, options:[O('Montage vollständig','✔︎'),O('Funktion getestet','✔︎'),O('Baustelle gereinigt','✔︎'),O('Einweisung erfolgt','✔︎'),O('Unterlagen übergeben','✔︎')]})]),
      P('Zufriedenheit',[B('rating',{label:'Wie zufrieden ist der Kunde mit der Ausführung?'}), B('input',{label:'Festgestellte Mängel', inputType:'textarea', key:'maengel', placeholder:'Keine', required:false}), B('upload',{label:'Foto der Montage', key:'foto'})]),
      P('Unterschrift',[B('heading',{text:'Abnahme bestätigen', level:2}), B('text',{text:'Hiermit bestätigt der Kunde die ordnungsgemäße Ausführung der Arbeiten.'}), B('signature',{label:'Unterschrift Kunde'}), B('checkbox',{text:'Ich bestätige die Richtigkeit der Angaben.', key:'bestaetigung'}), B('button',{label:'Abnahme abschließen', action:'submit'})]),
      P('Fertig',[B('spacer',{height:30}), B('heading',{text:'Abnahme gespeichert ✓', align:'center'}), B('text',{text:'Das Protokoll für Auftrag **{{auftrag}}** wurde übermittelt.', align:'center'})],{hideProgress:true, allowBack:false})
    ]};
}

function tFreebie(){
  return {name:'Lead-Magnet', desc:'Freebie / Checkliste gegen E-Mail – einfach & schnell.', cats:['Leads'],
    theme:theme('luxe',{logoText:'ATELIER NORD'}), settings:{currency:'EUR'},
    pages:[
      P('Freebie',[B('image',{src:art('📘','#3a3226','#141210'), height:200, radius:4}), B('heading',{text:'Die 7 größten Fehler beim Hausbau', align:'center'}), B('text',{text:'Kostenlose PDF-Checkliste – direkt in dein Postfach.', align:'center'}), B('list',{items:['Versteckte Kosten erkennen','Den richtigen Partner finden','Bauzeit realistisch planen']}), B('input',{label:'', placeholder:'Deine beste E-Mail-Adresse', inputType:'email', key:'email'}), B('button',{label:'Checkliste sichern', action:'submit'}), B('text',{text:'Kein Spam. Abmeldung jederzeit möglich.', align:'center', size:12})]),
      P('Danke',[B('spacer',{height:40}), B('heading',{text:'Check dein Postfach 📬', align:'center'}), B('text',{text:'Die Checkliste ist auf dem Weg zu dir.', align:'center'})],{hideProgress:true, allowBack:false})
    ]};
}

function tMontage(){
  var start = P('Bewertung',[]), pos = P('Positiv',[]), neg = P('Negativ',[]), back = P('Rückmeldung',[]), contact = P('Kontakt',[]), thanks = P('Danke',[],{hideProgress:true, allowBack:false});
  var face = function(e, l, sc, g){ return O(l, e, {score:sc, goto:g}); };
  start.blocks = [
    B('badge',{text:'⏱️ Es dauert nur 1 Minute', variant:'outline', upper:true, align:'center', mb:22}),
    B('image',{src:art('🛠️','#d9e7a0','#aac520'), height:190, radius:12, mb:26}),
    B('heading',{text:'Wie zufrieden waren Sie mit unserer __Montage__?', level:2, align:'center', mb:24}),
    B('choice',{question:'', key:'zufriedenheit', layout:'scale', autoNext:true, required:true, minLabel:'sehr schlecht', maxLabel:'sehr gut', options:[face('😥','Sehr schlecht',1,neg.id),face('🙁','Schlecht',2,neg.id),face('😐','Okay',3,neg.id),face('🙂','Gut',4,pos.id),face('😀','Sehr gut',5,pos.id)]})
  ];
  pos.blocks = [
    B('badge',{text:'Nur eine Frage', variant:'filled', upper:true, align:'center', mb:18}),
    B('heading',{text:'😊', level:2, align:'center', mb:4}),
    B('heading',{text:'Das freut uns sehr!\nWas hat Ihnen besonders gut gefallen?', level:2, align:'center', mb:24}),
    B('choice',{question:'', key:'positiv', layout:'checklist', multi:true, autoNext:false, required:true, options:[O('Tolle Beratung'),O('Montageteam vor Ort'),O('Sauberkeit der Baustelle'),O('Kommunikation & Terminplanung'),O('Sonstiges','',{sub:'Bitte geben Sie uns unten hierzu Details'})]}),
    B('input',{label:'', placeholder:'Könnten Sie uns kurz mehr dazu sagen?', inputType:'textarea', key:'details_positiv', required:false}),
    B('button',{label:'Anonym abschicken', action:'submit', target:thanks.id, variant:'gradient', btnBg:'#000000', icon:'send', iconLeft:true})
  ];
  neg.blocks = [
    B('badge',{text:'😲 Das tut uns leid!', variant:'outline', upper:true, align:'center', mb:18}),
    B('heading',{text:'Was lief nicht so gut?', level:1, align:'center', mb:8}),
    B('text',{text:'Konkretes Feedback ist sehr wichtig für uns, damit wir uns in diesen Bereichen verbessern können.', align:'center', mb:26}),
    B('choice',{question:'', key:'negativ', layout:'checklist', multi:true, autoNext:false, required:true, options:[O('Montagequalität'),O('Sauberkeit der Baustelle'),O('Kommunikation'),O('Terminverzug'),O('Funktion nicht wie erwartet'),O('Sonstiges','',{sub:'Bitte gehen Sie unten weiter darauf ein.'})]}),
    B('badge',{text:'Details zu Ihrem Anliegen', variant:'grey', upper:true, align:'center', mt:8, mb:6}),
    B('text',{text:'Dies ist optional, hilft uns aber enorm weiter', align:'center', mb:12}),
    B('input',{label:'', placeholder:'Bitte schildern Sie uns kurz, was passiert ist.', inputType:'textarea', key:'details_negativ', required:false}),
    B('button',{label:'Weiter geht\'s', variant:'gradient', btnBg:'#000000', icon:'arrow'})
  ];
  back.blocks = [
    B('badge',{text:'Nur noch 1 Schritt. Versprochen', variant:'filled', upper:true, align:'center', mb:18}),
    B('heading',{text:'Wir würden das gerne wieder gut machen.', level:2, align:'center', mb:10}),
    B('text',{text:'Dürfen wir uns persönlich bei Ihnen melden und eine Lösung finden?', align:'center', mb:26}),
    B('choice',{question:'', key:'rueckmeldung', layout:'image', options:[O('Ja, gerne!','✅',{img:art('✅','#e3f0c0','#aac520'), goto:contact.id}),O('Nein, das passt schon …','✋',{sub:'Ihr Feedback wird anonym abgesendet.', img:art('✋','#ffd9cc','#ff8a65'), goto:thanks.id})]})
  ];
  contact.blocks = [
    B('text',{text:'Danke für Ihr Vertrauen!', align:'center', mb:12}),
    B('image',{src:art('✉️','#efe7da','#c9b79c'), height:170, radius:12, mb:24}),
    B('heading',{text:'Hinterlassen Sie uns bitte kurz Ihre Kontaktdaten und wir melden uns bei Ihnen.', level:2, align:'center', mb:10}),
    B('text',{text:'🔒 Ihre Daten werden **ausschließlich** zur Kontaktaufnahme bezüglich Ihres Feedbacks verwendet. Wir werden niemals Spam zusenden!', align:'center', mb:22}),
    B('input',{label:'', placeholder:'Vorname', key:'vorname', half:true, mb:12}),
    B('input',{label:'', placeholder:'Nachname', key:'nachname', half:true, mb:12}),
    B('input',{label:'', placeholder:'Ihre E-Mail-Adresse', inputType:'email', key:'email'}),
    B('checkbox',{text:'Ich stimme zu, dass wir Sie zu Ihrem Feedback per E-Mail kontaktieren dürfen.', key:'einwilligung'}),
    B('button',{label:'Mein Feedback absenden', action:'submit', target:thanks.id, variant:'gradient', btnBg:'#000000', icon:'send', iconLeft:true})
  ];
  thanks.blocks = [B('spacer',{height:40}), B('heading',{text:'💚', level:1, align:'center', mb:6, size:44}), B('heading',{text:'Vielen Dank für Ihr __Feedback__!', level:2, align:'center', mb:10}), B('text',{text:'Ihre Rückmeldung hilft uns, jeden Tag ein Stück besser zu werden.', align:'center'})];
  return {name:'Montage-Feedback', desc:'Emoji-Bewertung mit Verzweigung: positiv → Lob, negativ → Rückruf-Angebot.', cats:['Feedback'],
    theme:theme('clean',{primary:'#aac520', primaryText:'#ffffff', bg:'#ffffff', surface:'#f4f4f4', text:'#2b2a2b', muted:'#6b6a6b', font:'Inter Tight', headingFont:'Onest', headingWeight:600, headingLs:-1, radius:6, btnRadius:16, btnPad:18, progressTop:true, logoText:'IHR LOGO', optStyle:'filled', backButton:false}),
    settings:{currency:'EUR'}, pages:[start, pos, neg, back, contact, thanks]};
}

function tBlank(){
  return {name:'Leerer Funnel', desc:'Starte mit einer leeren Seite.', cats:[], theme:theme('clean'), settings:{currency:'EUR'},
    pages:[P('Seite 1',[B('heading',{text:'Deine erste Seite'}), B('text',{}), B('button',{})]), P('Danke',[B('heading',{text:'Vielen Dank!', align:'center'})],{hideProgress:true})]};
}

var TEMPLATES = [
  {id:'terrasse', make:tTerrasse}, {id:'solar', make:tSolar}, {id:'immo', make:tImmo}, {id:'strategy', make:tStrategy},
  {id:'montage', make:tMontage}, {id:'recruiting', make:tRecruiting}, {id:'quiz', make:tQuiz}, {id:'feedback', make:tFeedback}, {id:'abnahme', make:tAbnahme},
  {id:'freebie', make:tFreebie}, {id:'blank', make:tBlank}
];

function newFunnel(tplId, overrides){
  var t = TEMPLATES.filter(function(x){return x.id===tplId;})[0] || TEMPLATES[TEMPLATES.length-1];
  var d = t.make();
  var now = Date.now();
  return Object.assign({id:uid()+uid().slice(0,4), name:d.name, template:tplId, status:'draft', createdAt:now, updatedAt:now, theme:d.theme, settings:Object.assign({currency:'EUR', basePrice:0, baseLabel:'Grundpreis', webhook:'', redirect:'', pixel:''}, d.settings||{}), pages:d.pages, stats:{views:0, starts:0, completes:0, pages:{}, daily:{}}}, overrides||{});
}

window.FS_T = {uid:uid, clone:clone, THEMES:THEMES, THEME_BASE:THEME_BASE, theme:theme, DEF:DEF, LIB:LIB, SECTIONS:SECTIONS, B:B, P:P, O:O, fromLib:fromLib, TEMPLATES:TEMPLATES, CATS:CATS, newFunnel:newFunnel, art:art};
})();
