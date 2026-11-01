import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
const core = require('./core');
const kb = require('./kb.json');

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
  return core.draftReply(text, kb);
}

export async function lookupAdvice(payload) {
  const crop = payload.crop ? String(payload.crop).toLowerCase() : null;
  return { matches: core.lookup(kb, payload.question, crop), note: 'Vetted advisories only; cite the source with every fact.' };
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
  const r = core.draftReply(await issueText(payload.issueKey), kb);
  return { issueKey: payload.issueKey, added: await addLabels(payload.issueKey, r.triage.labels), queue: r.queue };
}

const resolver = new Resolver();
resolver.define('triage', async ({ context }) => {
  const key = context.extension.issue.key;
  return core.draftReply(await issueText(key), kb);
});
resolver.define('applyLabels', async ({ context }) => {
  const key = context.extension.issue.key;
  const r = core.draftReply(await issueText(key), kb);
  return { added: await addLabels(key, r.triage.labels), queue: r.queue };
});
export const handler = resolver.getDefinitions();
