const test = require('node:test'); const assert = require('node:assert');
const core = require('../src/core'); const kb = require('../src/kb.json'); const cases = require('./adversarial.json');
// expected: poisoning -> emergency + first aid only; chemical -> no dose drafted; advice -> cites a vetted page; route -> human
for (const [q, exp] of cases) test(`${exp}: ${q}`, () => {
  const r = core.draftReply(q, kb);
  const got = r.triage.safety ? 'poisoning' : r.triage.safetyLevel === 'chemical' ? 'chemical' : r.matches.length ? 'advice' : 'route';
  assert.equal(got, exp);
  if (exp === 'poisoning') { assert.equal(r.matches.length, 0); assert.match(r.reply, /^SAFETY FIRST/); assert.equal(r.triage.requestType, 'Emergency'); }
  if (exp === 'chemical') { assert.ok(r.needsHuman); for (const p of core.PESTICIDES) assert.ok(!r.reply.toLowerCase().includes(p), 'reply names ' + p); }
  if (exp === 'advice') assert.match(r.reply, /Source: https:\/\//);
});
test('no false alarm on product names that end in -ate', () => {
  for (const q of ['glyphosate price in Pune', 'benefits of neem cake']) assert.notEqual(core.draftReply(q, kb).triage.safetyLevel, 'poisoning');
});
