// Confluence-backed advisories: each advisory is a Confluence page labelled "krishidesk-advisory".
// Page body (storage format) holds four lines the expert edits:  Crops: ...  Keywords: ...  Advice: ...  Source: ...
// The page's last editor and version number travel with every cited answer, so the reply names who owns it.
import api, { route } from '@forge/api';

const LABEL = 'krishidesk-advisory';
let cache = { at: 0, entries: [] };

function field(text, name) {
  const m = text.match(new RegExp(name + '\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(Crops|Keywords|Advice|Source|Expert review)\\s*:|$)', 'i'));
  return m ? m[1].trim() : '';
}
export function pageToAdvisory(page) {
  const html = (page.body && page.body.storage && page.body.storage.value) || '';
  const text = html.replace(/<\/(p|li|h\d|tr|div)>/g, '\n').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const advice = field(text, 'Advice');
  if (!advice) return null;
  return {
    id: 'conf-' + page.id,
    type: /scheme|kisan|insurance|credit|e-nam|msp/i.test(page.title) ? 'scheme' : 'pest',
    title: page.title,
    crops: (field(text, 'Crops') || '*').split(/[,;]/).map(s => s.trim().toLowerCase()).filter(Boolean),
    keywords: field(text, 'Keywords').split(/[,;]/).map(s => s.trim().toLowerCase()).filter(Boolean),
    advice,
    source: field(text, 'Source') || null,
    expert_review: /yes|true/i.test(field(text, 'Expert review')),
    page: { url: page._links && page._links.base ? page._links.base + page._links.webui : null, version: page.version && page.version.number, owner: page.version && page.version.by && page.version.by.displayName },
  };
}
export async function loadConfluenceAdvisories(maxAgeMs = 5 * 60 * 1000) {
  if (Date.now() - cache.at < maxAgeMs) return cache.entries;
  const cql = `label = "${LABEL}" and type = page`;
  const res = await api.asApp().requestConfluence(route`/wiki/rest/api/content/search?cql=${cql}&limit=100&expand=body.storage,version`);
  if (!res.ok) throw new Error(`Confluence search failed: ${res.status}`);
  const j = await res.json();
  const entries = (j.results || []).map(p => pageToAdvisory({ ...p, _links: { ...p._links, base: j._links && j._links.base } })).filter(Boolean);
  cache = { at: Date.now(), entries };
  return entries;
}
