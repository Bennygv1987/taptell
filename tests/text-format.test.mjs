import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const { FP } = vm.runInNewContext(
  readFileSync(new URL('../src/player.js', import.meta.url), 'utf8') + '\nwindow',
  { window: {} }
);
const f = { theme: {}, settings: {}, pages: [] };
const render = (type, props, edit = false) => FP.renderBlock({ id: 'b1', type, props }, { f, edit });

test('Schriftfarbe bleibt auf den markierten Zeichen, auch in Links und Fettdruck', () => {
  assert.equal(FP.md('**Ein {farbe:#12abcd}Wort{/farbe} fett**'),
    '<strong>Ein <span style="color:#12abcd">Wort</span> fett</strong>');
  assert.equal(FP.md('[vor {farbe:#ff0000}Rot{/farbe} nach](https://example.org)'),
    '<a href="https://example.org" target="_blank" rel="noopener">vor <span style="color:#ff0000">Rot</span> nach</a>');
  assert.equal(FP.md('A{farbe:#ff0000}BC{/farbe}{farbe:#0000ff}D{/farbe}E'),
    'A<span style="color:#ff0000">BC</span><span style="color:#0000ff">D</span>E');
  assert.match(FP.md('[Link](https://example.org/{farbe:#ff0000}pfad{/farbe})'), /href="https:\/\/example.org\/\{farbe:#ff0000\}pfad\{\/farbe\}"/);
  assert.doesNotMatch(FP.md('{farbe:red;display:none}X{/farbe}'), /style=/);
  assert.equal(FP.md('{farbe:#abcdef}<b>{/farbe}'), '<span style="color:#abcdef">&lt;b&gt;</span>');
});

test('Einwilligung behält Schriftgröße, Pflichtfeld und Datenschutzlink im Editor und Player', () => {
  const text = 'Ich akzeptiere [{farbe:#123abc}Datenschutz{/farbe}](https://example.org).';
  for (const edit of [false, true]) {
    const html = render('checkbox', { text, size: 19, required: true }, edit);
    assert.match(html, /role="checkbox"/);
    assert.match(html, /style="font-size:19px">Ich akzeptiere/);
    assert.match(html, /style="color:#123abc">Datenschutz<\/span><\/a>/);
    assert.match(html, /class="rq"/);
  }
  assert.doesNotMatch(render('checkbox', { text }), /font-size:/);
  assert.equal(FP.stripInk('Ich akzeptiere {farbe:#abcdef}Datenschutz{/farbe}.'), 'Ich akzeptiere Datenschutz.');
});

test('Beide schrägen Marker und beide Pinsel lassen sich mit eigener Farbe rendern', () => {
  for (const style of ['marker-tilt', 'half-tilt', 'brush-ink', 'brush-dry']) {
    assert.ok(FP.HL_STYLES.some(([value]) => value === style));
    const html = render('heading', { text: '__{farbe:#ffffff}Wort{/farbe}__', hl: style, hlColor: '#792463' });
    assert.ok(html.includes('hl-' + style));
    assert.match(html, /--hl-ink:#792463;/);
    assert.match(html, /class="fp-ul"><span style="color:#ffffff">Wort<\/span>/);
  }
  assert.match(render('text', { text: '__Wort__' }), /hl-swoosh/);
  assert.doesNotMatch(render('text', { text: '__Wort__', hlColor: 'red;background:none' }), /--hl-ink:/);
});
