// One-time setup: create one Confluence page per advisory in src/kb.json, labelled "krishidesk-advisory".
// Usage: CONF_BASE=https://YOUR-SITE.atlassian.net CONF_USER=email CONF_TOKEN=api-token CONF_SPACE=KVK node scripts/seed-confluence.mjs
import fs from 'node:fs';
const { CONF_BASE, CONF_USER, CONF_TOKEN, CONF_SPACE } = process.env;
if (!CONF_BASE || !CONF_USER || !CONF_TOKEN || !CONF_SPACE) { console.error('Set CONF_BASE, CONF_USER, CONF_TOKEN, CONF_SPACE'); process.exit(1); }
const auth = 'Basic ' + Buffer.from(`${CONF_USER}:${CONF_TOKEN}`).toString('base64');
const kb = JSON.parse(fs.readFileSync(new URL('../src/kb.json', import.meta.url)));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
for (const e of kb) {
  const body = `<p>Crops: ${esc(e.crops.join(', '))}</p><p>Keywords: ${esc(e.keywords.join(', '))}</p><p>Advice: ${esc(e.advice)}</p><p>Source: ${esc(e.source)}</p><p>Expert review: ${e.expert_review ? 'yes' : 'no'}</p>`;
  const r = await fetch(`${CONF_BASE}/wiki/rest/api/content`, { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'page', title: e.title, space: { key: CONF_SPACE }, body: { storage: { value: body, representation: 'storage' } }, metadata: { labels: [{ prefix: 'global', name: 'krishidesk-advisory' }] } }) });
  console.log(r.status, e.title);
}
