import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const functions = source.slice(source.indexOf('async function syncFunnels()'), source.indexOf('async function syncTable('));
test('A rename sends no embedded images or live copy, including on timeout retry', async () => {
  const calls = [];
  let fail = true;
  const previous = {id:'f', name:'Alt', pages:[{img:'data:image/png;base64,abc'}], published:{at:1}};
  const ctx = {
    SNAP:{funnels:{f:JSON.stringify(previous)}}, db:{funnels:[{...previous, name:'Neu'}]},
    funnelToRow: f => f,
    sb:{from:() => ({update: patch => ({eq:() => ({select:() => ({single(){
      calls.push(JSON.parse(JSON.stringify(patch)));
      return {error: fail ? Error('statement timeout') : null};
    }})})})})}
  };
  vm.runInNewContext(functions, ctx);
  await assert.rejects(ctx.syncFunnels(), /timeout/);
  assert.equal(ctx.SNAP.funnels.f, JSON.stringify(previous));
  fail = false;
  await ctx.syncFunnels();
  await ctx.syncFunnels();
  assert.deepEqual(calls, [{name:'Neu'}, {name:'Neu'}]);
  ctx.db.funnels[0].published = {at:2};
  await ctx.syncFunnels();
  assert.deepEqual(calls[2], {published:{at:2}});
});
