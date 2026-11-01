import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { loadConfluenceAdvisories } from './confluence';
const core = require('./core');
const seedKb = require('./kb.json');

// Advisories come from the centre's Confluence space (label "krishidesk-advisory"); the bundled seed set is the fallback.
async function getKb() {
  try { const conf = await loadConfluenceAdvisories(); if (conf.length) return conf.concat(seedKb.filter(s => !conf.some(c => c.title === s.title))); }
  catch (e) { console.warn('Confluence advisories unavailable, using seed set:', e.message); }
  return seedKb;
}

async function issueText(issueKey) {
  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}?fields=summary,description`);
  if (!res.ok) throw new Error(`Could not read ${issueKey}: ${res.status}`);
  const j = await res.json();
  const desc = adfToText(j.fields && j.fields.description);
  return `${(j.fields && j.fields.summary) || ''}\n${desc}`;
}
function adfToText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.type === 'text') return node.text || '';
  return (node.content || []).map(adfToText).join(node.type === 'paragraph' ? '' : '\n');
}

export async function triageQuery(payload) {
  const text = await issueText(payload.issueKey);
  return core.draftReply(text, await getKb());
}

export async function lookupAdvice(payload) {
  const crop = payload.crop ? String(payload.crop).toLowerCase() : null;
  return { matches: core.lookup(await getKb(), payload.question, crop), note: 'Vetted advisories only; cite the source with every fact.' };
}

async function addLabels(issueKey, labels) {
  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ update: { labels: labels.map(l => ({ add: l })) } }),
  });
  if (!res.ok) throw new Error(`Could not label ${issueKey}: ${res.status}`);
  return labels;
}

export async function applyLabels(payload) {
  const r = core.draftReply(await issueText(payload.issueKey), await getKb());
  return { issueKey: payload.issueKey, added: await addLabels(payload.issueKey, r.triage.labels), queue: r.queue };
}

const resolver = new Resolver();
resolver.define('triage', async ({ context }) => {
  const key = context.extension.issue.key;
  return core.draftReply(await issueText(key), await getKb());
});
resolver.define('applyLabels', async ({ context }) => {
  const key = context.extension.issue.key;
  const r = core.draftReply(await issueText(key), await getKb());
  return { added: await addLabels(key, r.triage.labels), queue: r.queue };
});
export const handler = resolver.getDefinitions();
