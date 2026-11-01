'use strict';
(() => {
// Sample tickets (made up for the demo; districts are illustrative)
const tickets = [
  { key: 'KD-101', d: 'Pune', text: 'Caterpillars are eating the whorl of my maize. Leaves have holes and there is sawdust-like frass.' },
  { key: 'KD-102', d: 'Nashik', text: 'Son sprayed yesterday, headache and sweating since morning.' },
  { key: 'KD-103', d: 'Ahmednagar', text: 'Monocrotophos on tomato, how many ml?' },
  { key: 'KD-104', d: 'Solapur', text: 'Paddy leaves turning yellow from the lower leaves.' },
  { key: 'KD-105', d: 'Pune', text: 'My PM-KISAN instalment did not come this time. What should I check?' },
  { key: 'KD-106', d: 'Nashik', text: 'मेरे भाई ने कीटनाशक पी लिया' },
  { key: 'KD-107', d: 'Ahmednagar', text: 'Holes in my tomato fruits with a worm inside.' },
  { key: 'KD-108', d: 'Pune', text: 'Fall armyworm in maize, whole field affected.' },
  { key: 'KD-109', d: 'Nashik', text: 'Silvery patches on onion leaves, tips drying.' },
  { key: 'KD-110', d: 'Solapur', text: 'Pomegranate fruit cracking, what to do?' },
];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let KB = [];
const all = [];
const q = document.getElementById('queue');
function show(t, btn) {
  document.querySelectorAll('.queue button').forEach(b => b.setAttribute('aria-pressed', b === btn));
  const r = KrishiCore.draftReply(t.text, KB);
  document.getElementById('tq').textContent = t.key + ' · ' + t.d + '\n' + t.text;
  const tr = r.triage;
  document.getElementById('chips').innerHTML = '<span class="chip ' + tr.urgency + '">' + tr.urgency + '</span><span class="chip type">' + esc(tr.requestType) + '</span>' + (tr.crop ? '<span class="chip crop">' + esc(tr.crop) + '</span>' : '') + tr.labels.map(l => '<span class="chip">' + esc(l) + '</span>').join('');
  const sf = document.getElementById('safety');
  sf.hidden = !(tr.safety || tr.safetyLevel === 'chemical');
  sf.className = 'safety ' + (tr.safety ? 'crit' : 'chem');
  sf.innerHTML = tr.safety ? '<strong>Possible pesticide poisoning.</strong> Emergency queue, 15-minute callback SLA, first-aid steps only. Why: ' + esc(tr.safetyReasons.join('; ')) : '<strong>Chemical question.</strong> No product or dose is drafted; an expert signs off. Why: ' + esc(tr.safetyReasons.join('; '));
  document.getElementById('draft').innerHTML = esc(r.reply).replace(/(https:\/\/[^\s)]+)/g, '<a href="$1" rel="noopener" target="_blank">source</a>');
  document.getElementById('human').textContent = 'Queue: ' + r.queue + (r.needsHuman ? ' · a human checks before anything is sent.' : ' · the officer approves the draft.');
}
function addTicket(t, select) {
  all.push(t);
  const li = document.createElement('li'), b = document.createElement('button');
  b.type = 'button'; b.setAttribute('aria-pressed', 'false'); b.innerHTML = '<span class="k">' + esc(t.key) + ' · ' + esc(t.d) + '</span>' + esc(t.text);
  b.addEventListener('click', () => show(t, b)); li.appendChild(b); q.appendChild(li); if (select) show(t, b);
  renderRadar();
}
function renderRadar() {
  const by = {};
  for (const t of all) {
    const tr = KrishiCore.triage(t.text);
    if (tr.safety) { (by['Pesticide poisoning'] = by['Pesticide poisoning'] || {})[t.d] = ((by['Pesticide poisoning'] || {})[t.d] || 0) + 1; continue; }
    const m = KrishiCore.lookup(KB, t.text, tr.crop)[0];
    if (m && /pest|disease/.test((KB.find(e => e.id === m.id) || {}).type || '')) { by[m.title] = by[m.title] || {}; by[m.title][t.d] = (by[m.title][t.d] || 0) + 1; }
  }
  const ul = document.getElementById('radar'); ul.innerHTML = '';
  Object.entries(by).sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y) - Object.values(a[1]).reduce((x, y) => x + y)).forEach(([k, v]) => {
    const li = document.createElement('li');
    li.innerHTML = '<strong>' + esc(k) + '</strong> ' + Object.entries(v).map(([d, n]) => '<span class="chip">' + esc(d) + ' ' + n + '</span>').join('');
    ul.appendChild(li);
  });
}
function renderTests(T) {
  let pass = 0; const rows = T.map(([qq, exp]) => {
    const r = KrishiCore.draftReply(qq, KB);
    const got = r.triage.safety ? 'poisoning' : r.triage.safetyLevel === 'chemical' ? 'chemical' : r.matches.length ? 'advice' : 'route';
    if (got === exp) pass++;
    return '<tr class="' + (got === exp ? 'ok' : 'bad') + '"><td>' + esc(qq) + '</td><td>' + exp + '</td><td>' + got + '</td><td>' + esc((r.matches[0] || {}).id || '') + '</td></tr>';
  });
  document.getElementById('t-sum').textContent = pass + ' of ' + T.length + ' pass, computed live in your browser by the same code.';
  document.getElementById('t-body').innerHTML = rows.join('');
}
Promise.all([fetch('kb.json').then(r => r.json()), fetch('tests.json').then(r => r.json())]).then(([kb, T]) => {
  KB = kb; document.getElementById('kb-n').textContent = kb.length;
  tickets.forEach((t, i) => addTicket(t, i === 1));
  renderTests(T);
  let n = 111;
  document.getElementById('new').addEventListener('submit', e => { e.preventDefault(); const v = document.getElementById('newq').value.trim(); if (!v) return; addTicket({ key: 'KD-' + (n++), d: 'You', text: v }, true); document.getElementById('newq').value = ''; });
});
})();
