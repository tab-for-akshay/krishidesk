// KrishiDesk core v2: triage + safety guard + knowledge lookup. Pure JS, shared by the Forge functions and the web demo.
// Built by Tab (AI assistant) for team lead Akshay Wagh.
const CATEGORIES = {
  pest: ['pest', 'insect', 'worm', 'caterpillar', 'larva', 'aphid', 'whitefly', 'white fly', 'borer', 'bollworm', 'armyworm', 'jassid', 'thrips', 'mite', 'locust', 'hopper', 'beetle', 'grub', 'termite', 'dead heart', 'holes'],
  disease: ['disease', 'blight', 'rust', 'wilt', 'rot', 'mildew', 'spot', 'virus', 'fungus', 'yellowing', 'yellow', 'curl', 'blast', 'smut', 'lesion', 'mosaic', 'drying', 'patches', 'bunchy'],
  nutrient: ['fertiliser', 'fertilizer', 'urea', 'dap', 'npk', 'soil', 'nutrient', 'deficiency', 'zinc', 'manure', 'compost', 'soil health', 'pale'],
  water: ['irrigation', 'water', 'drip', 'sprinkler', 'drought', 'flood', 'rain', 'monsoon', 'waterlogging'],
  scheme: ['scheme', 'pm-kisan', 'pm kisan', 'kcc', 'loan', 'subsidy', 'insurance', 'pmfby', 'fasal bima', 'installment', 'instalment', 'claim', 'credit'],
  market: ['price', 'mandi', 'sell', 'market', 'msp', 'e-nam', 'enam', 'trader', 'rate'],
};
const CROPS = ['rice', 'paddy', 'wheat', 'maize', 'corn', 'cotton', 'soybean', 'sugarcane', 'tomato', 'onion', 'potato', 'chilli', 'chili', 'groundnut', 'mustard', 'gram', 'tur', 'bajra', 'jowar', 'banana', 'mango'];
// --- Safety guard (rule floor; an AI classifier may only add escalations, never remove these) ---
const INGEST = ['drank', 'drink', 'drunk', 'swallow', 'ingest', 'consumed', 'ate ', 'eaten', 'poison', 'suicide', 'overdose', 'pi liya', 'pee liya', 'kha liya', 'zeher', 'zahar', 'जहर', 'ज़हर', 'विष', 'पी लिया', 'प्यायले'];
const SYMPTOM = ['headache', 'head ache', 'dizzy', 'dizziness', 'giddy', 'vomit', 'nausea', 'sweating', 'sweat', 'breath', 'unconscious', 'faint', 'fits', 'seizure', 'convulsion', 'blurred', 'blurry', 'saliva', 'froth', 'eyes burning', 'burning eyes', 'skin burning', 'rash', 'chest pain', 'collapsed', 'shivering', 'tremor', 'chakkar', 'ulti', 'चक्कर', 'उल्टी'];
const EXPOSURE = ['spray', 'sprayed', 'spraying', 'pesticide', 'insecticide', 'fungicide', 'herbicide', 'weedicide', 'chemical', 'dawai', 'davai', 'medicine for crop', 'keetnashak', 'kitnashak', 'कीटनाशक', 'field', 'tank', 'pump'];
const PESTICIDES = ['monocrotophos', 'chlorpyrifos', 'chlorpyriphos', 'imidacloprid', 'acephate', 'profenofos', 'cypermethrin', 'lambda', 'cyhalothrin', 'emamectin', 'fipronil', 'thiamethoxam', 'carbofuran', 'phorate', 'thimet', 'quinalphos', 'dimethoate', 'dichlorvos', 'ddvp', 'endosulfan', 'paraquat', 'glyphosate', '2,4-d', '2,4 d', 'atrazine', 'pendimethalin', 'mancozeb', 'carbendazim', 'tricyclazole', 'hexaconazole', 'propiconazole', 'copper oxychloride', 'chlorantraniliprole', 'spinosad', 'malathion', 'triazophos', 'methyl parathion', 'parathion', 'aluminium phosphide', 'aluminum phosphide', 'celphos', 'zinc phosphide', 'carbaryl', 'acetamiprid', 'buprofezin', 'flubendiamide', 'indoxacarb', 'methomyl', 'ethion', 'phosalone', 'oxydemeton', 'methyl demeton', 'thiacloprid', 'spinetoram', 'carbosulfan', 'clothianidin', 'dinotefuran', 'neonicotinoid', 'organophosphate'];
const DOSE = ['how many ml', 'how much ml', ' ml', 'ml per', 'ml/', 'dose', 'dosage', 'how much to spray', 'how much should i spray', 'per litre', 'per liter', 'per acre', 'per pump', 'per tank', 'gram per', 'g per', 'mix how much', 'kitna'];
const URGENT = ['dying', 'whole field', 'entire field', 'spreading fast', 'all plants', 'urgent', 'emergency', 'help fast', 'overnight'];

function norm(s) { return ' ' + String(s || '').toLowerCase().replace(/\s+/g, ' ') + ' '; }
const esc = w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// ASCII words match on word boundaries (so 'ate' does not fire inside 'glyphosate'); Devanagari phrases match as substrings
const has = (t, list) => list.filter(w => /^[\x00-\x7f]+$/.test(w) ? new RegExp('(^|[^a-z0-9])' + esc(w.trim()) + (w.endsWith(' ') ? '([^a-z0-9]|$)' : '')).test(t) : t.includes(w));

function safetyCheck(text) {
  const t = norm(text);
  const ingest = has(t, INGEST), symptom = has(t, SYMPTOM), exposure = has(t, EXPOSURE), chem = has(t, PESTICIDES), dose = has(t, DOSE);
  const reasons = [];
  let level = 'none';
  if (ingest.length && (exposure.length || chem.length || /poison|zeher|zahar|जहर|ज़हर|विष|suicide|overdose/.test(t))) { level = 'poisoning'; reasons.push('swallowed/poison words: ' + ingest.join(', ')); }
  if (symptom.length && (exposure.length || chem.length)) { level = 'poisoning'; reasons.push('symptoms after chemical exposure: ' + symptom.join(', ')); }
  if (level === 'none' && ingest.length && symptom.length) { level = 'poisoning'; reasons.push('swallowed something + symptoms'); }
  if (level === 'none' && (chem.length || (dose.length && (exposure.length || /spray|chemical|pesticide|insecticide|fungicide|herbicide/.test(t))))) {
    level = 'chemical'; reasons.push(chem.length ? 'names a pesticide: ' + chem.join(', ') : 'asks for a chemical dose');
  }
  return { level, reasons, matched: { ingest, symptom, exposure, chem, dose } };
}

function triage(text) {
  const t = norm(text);
  const scores = {};
  for (const [cat, words] of Object.entries(CATEGORIES)) scores[cat] = words.filter(w => t.includes(w)).length;
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const category = ranked[0][1] > 0 ? ranked[0][0] : 'general';
  let crop = CROPS.find(c => new RegExp('\\b' + c + '\\b').test(t)) || null;
  if (crop === 'corn') crop = 'maize'; if (crop === 'paddy') crop = 'rice'; if (crop === 'chili') crop = 'chilli';
  const s = safetyCheck(text);
  const safety = s.level === 'poisoning';
  const urgency = safety ? 'critical' : URGENT.some(w => t.includes(w)) ? 'high' : s.level === 'chemical' ? 'medium' : (category === 'pest' || category === 'disease') ? 'medium' : 'low';
  const requestType = safety ? 'Emergency' : (category === 'pest' || category === 'disease' || category === 'nutrient') ? 'Pest/Disease' : category === 'scheme' ? 'Scheme' : category === 'market' ? 'Market' : 'General';
  const labels = ['krishidesk', 'cat-' + category, 'type-' + requestType.toLowerCase().replace(/[^a-z]/g, '')]
    .concat(crop ? ['crop-' + crop] : [])
    .concat(safety ? ['safety-poisoning', 'urgent'] : [])
    .concat(s.level === 'chemical' ? ['chem-expert-signoff'] : [])
    .concat(!safety && urgency === 'high' ? ['urgent'] : []);
  return { category, crop, urgency, safety, safetyLevel: s.level, safetyReasons: s.reasons, requestType, labels };
}

function lookup(kb, text, crop) {
  const t = norm(text);
  const hits = kb.map(e => {
    let s = e.keywords.filter(k => t.includes(k)).length * 2;
    const cropOk = e.crops.includes('*') || !crop || e.crops.includes(crop) || (crop === 'rice' && e.crops.includes('paddy'));
    if (crop && (e.crops.includes(crop) || (crop === 'rice' && e.crops.includes('paddy')))) s += 3;
    if (!cropOk) s -= 4;
    if (!e.keywords.some(k => t.includes(k))) s = 0; // crop alone is not a match
    return { e, s };
  }).filter(h => h.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
  return hits.map(h => ({ id: h.e.id, title: h.e.title, advice: h.e.advice, source: h.e.source, portal: h.e.portal || null, expertReview: !!h.e.expert_review, score: h.s }));
}

const POISON_REPLY = 'SAFETY FIRST: this may be pesticide poisoning. Tell the caller: stop all work; move the person to fresh air; remove contaminated clothes and wash the skin with soap and water; call 108 (ambulance) or go to the nearest hospital now, and take the pesticide container or label along. A human officer has been alerted and must call back. No crop advice is sent on this ticket.';
const CHEM_REPLY = 'This question names a pesticide or asks for a dose. KrishiDesk does not draft chemical names or doses: a human expert will reply with a product and dose approved for this crop. Meanwhile: use only products whose label lists this crop and pest, follow the label dose, wear gloves and a mask, and never spray in strong wind or mix chemicals at home.';

function draftReply(text, kb) {
  const tri = triage(text);
  const matches = tri.safety ? [] : lookup(kb, text, tri.crop);
  const lines = [];
  if (tri.safety) lines.push(POISON_REPLY);
  else {
    if (tri.safetyLevel === 'chemical') lines.push(CHEM_REPLY);
    if (matches.length) matches.forEach(m => lines.push(m.title + ': ' + m.advice + ' (Source: ' + m.source + ')' + (m.expertReview ? ' [Expert sign-off needed before any chemical step]' : '')));
    else if (tri.safetyLevel !== 'chemical') lines.push('No vetted advisory matches this yet. Ticket routed to the ' + (tri.requestType === 'General' ? 'duty officer' : tri.requestType + ' expert') + ' with the details above. A clear photo of the affected plant helps.');
  }
  const needsHuman = tri.safety || tri.safetyLevel === 'chemical' || !matches.length || matches.some(m => m.expertReview);
  return { triage: tri, matches, reply: lines.join('\n\n'), needsHuman, queue: tri.safety ? 'Emergency (15-min SLA)' : needsHuman ? 'Expert review' : 'Auto-draft, officer approves' };
}

const API = { triage, lookup, draftReply, safetyCheck, CATEGORIES, CROPS, PESTICIDES };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else globalThis.KrishiCore = API;
