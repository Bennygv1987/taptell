import {test} from 'node:test';
import assert from 'node:assert/strict';
import {automationMessage, renderAutomationEmail, sampleLead, varsFor} from '../supabase/functions/_shared/automation-mail.mjs';

const funnel = {name:'Beispiel',settings:{basePrice:2490},pages:[]};
const vars = varsFor(sampleLead(funnel),funnel,'https://example.com');
function mail(config,kind){
  return renderAutomationEmail({config,kind,vars,subject:'Terminanfrage',funnel,
    fields:[{label:'Terminwunsch',value:'Freitag'},{label:'Rufnummer',value:'1234',inputType:'tel'}]});
}

for(const kind of ['notify','confirm']){
  test(kind+': alte und neue Schalter für Preis und Antworten',()=>{
    assert.doesNotMatch(mail({fields:false},kind), /2\.490|Gesamt:|Freitag/);
    assert.match(mail({fields:true,total:false},kind), /Freitag/);
    assert.doesNotMatch(mail({fields:true,total:false},kind), /2\.490|Gesamt:/);
    assert.match(mail({fields:false,total:true},kind), /2\.490/);
    assert.doesNotMatch(mail({fields:false,total:true},kind), /Freitag/);
  });
  test(kind+': eigene Vorlage ersetzt den gesamten Standardinhalt',()=>{
    const html = mail({customLayout:true,layoutHtml:'<main>{{betreff}} · {{vorname}}</main>'},kind);
    assert.equal(html,'<main>Terminanfrage · Max</main>');
    const parts = mail({customLayout:true,layoutHtml:'{{nachricht_html}}{{antworten_html}}{{preis_html}}',html:'<b>{{name}}</b>',total:false},kind);
    assert.match(parts, /<b>Max Mustermann<\/b>/); assert.match(parts,/Freitag/); assert.doesNotMatch(parts,/Gesamt:/);
    if(kind==='confirm') assert.doesNotMatch(parts,/Rufnummer/);
  });
}
test('Funnel ohne Preise enthält auch im Test keinen Beispielbetrag',()=>{
  const free = {name:'Feedback',pages:[]};
  const v=varsFor(sampleLead(free),free,'https://example.com');
  assert.equal(v.total,'');
  assert.doesNotMatch(renderAutomationEmail({config:{total:true},vars:v,kind:'notify',funnel:free}), /Gesamt:|2\.490/);
});
test('Standard-Überschrift, Button und Fußzeile lassen sich leeren',()=>{
  assert.doesNotMatch(mail({headingText:'',buttonText:'',footerText:''},'notify'),/<h1|Im Dashboard öffnen|Gesendet mit TapTell/);
});

for(const kind of ['notify','confirm']){
  test(kind+': Klartext bewahrt Zeilen, Abstände und benachbarte Platzhalter',()=>{
    const template='Name: {{name}}\nForm: {{form}}\n\n{{form}}{{nummer}}  {{name}}\n';
    const result=automationMessage({config:{format:'plain',plainBody:template,customLayout:true,fields:true,total:true},
      kind,vars:{name:'Mia & Tom',form:'Eckig',nummer:'42'},subject:'Anfrage',funnel});
    assert.deepEqual(result,{text:'Name: Mia & Tom\nForm: Eckig\n\nEckig42  Mia & Tom\n'});
  });
}
test('Bestehende formatierte Vorlagen behalten ihre Versandart',()=>{
  const result=automationMessage({config:{body:'Hallo {{vorname}}'},kind:'notify',vars,funnel,subject:'Test'});
  assert.deepEqual(Object.keys(result),['html']);assert.match(result.html,/Hallo Max/);
});
