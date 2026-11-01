const test = require('node:test'); const assert = require('node:assert');
const core = require('../src/core'); const kb = require('../src/kb.json');
test('fall armyworm in maize is a pest ticket with the FAW advisory first', () => {
  const r = core.draftReply('Caterpillars eating the whorl of my maize, leaves full of holes and frass', kb);
  assert.equal(r.triage.category, 'pest'); assert.equal(r.triage.crop, 'maize');
  assert.equal(r.matches[0].id, 'pest-faw'); assert.ok(r.needsHuman);
});
test('PM-KISAN instalment query is a scheme ticket', () => {
  const r = core.draftReply('My PM-KISAN instalment did not come this time', kb);
  assert.equal(r.triage.category, 'scheme'); assert.equal(r.matches[0].id, 'scheme-pmkisan');
});
test('poisoning is critical and escalated', () => {
  const r = core.draftReply('I sprayed and now feel dizzy and vomit', kb);
  assert.equal(r.triage.urgency, 'critical'); assert.ok(r.reply.startsWith('SAFETY FIRST')); assert.ok(r.needsHuman);
});
test('every advisory carries a source', () => { for (const e of kb) assert.match(e.source, /^https:\/\//); });
