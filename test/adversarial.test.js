const test = require('node:test'); const assert = require('node:assert');
const core = require('../src/core'); const kb = require('../src/kb.json'); const cases = require('./adversarial.json');
// expected: emergency -> Emergency queue, safety script only (swallowed / exposure / self-harm); chemical -> no dose drafted; advice -> cites a vetted page; route -> human
for (const [q, exp] of cases) test(`${exp}: ${q}`, () => {
  const r = core.draftReply(q, kb);
  const got = r.triage.safety ? 'emergency' : r.triage.safetyLevel === 'chemical' ? 'chemical' : r.triage.safetyLevel === 'input-quality' ? 'input-quality' : r.matches.length ? 'advice' : 'route';
  assert.equal(got, exp);
  if (exp === 'emergency') { assert.equal(r.matches.length, 0); assert.match(r.reply, /^SAFETY FIRST/); assert.equal(r.triage.requestType, 'Emergency'); }
  if (exp === 'chemical') { assert.ok(r.needsHuman); for (const p of core.PESTICIDES) assert.ok(!r.reply.toLowerCase().includes(p), 'reply names ' + p); }
  if (exp === 'advice') assert.match(r.reply, /Source: https:\/\//);
});
test('no false alarm on product names that end in -ate', () => {
  for (const q of ['glyphosate price in Pune', 'benefits of neem cake']) assert.notEqual(core.draftReply(q, kb).triage.safetyLevel, 'poisoning');
});
test('self-harm gets the Tele-MANAS script, not pesticide first aid', () => {
  const r = core.draftReply('Suicidal, crop failed, loan unpaid', kb);
  assert.equal(r.triage.safetyKind, 'self-harm'); assert.match(r.reply, /14416/); assert.doesNotMatch(r.reply, /wash the skin/);
});
test('swallowing gets the hospital-now script', () => {
  const r = core.draftReply('my son drank the spray, he looks fine now', kb);
  assert.equal(r.triage.safetyKind, 'swallowed'); assert.match(r.reply, /Do not wait for symptoms/);
});
test('crop-specific advice without a named crop needs a human', () => {
  const r = core.draftReply('leaves turning yellow', kb); assert.ok(r.needsHuman);
});
