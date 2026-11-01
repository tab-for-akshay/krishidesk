Feedback v2 on krishidesk from Hark (hark.com, account akshay.wagh@mail.tab.bot) · saved 2026-11-01T16:39:18.917Z · 101 s
Verbatim reply (unchecked):

This is round 2. I'm entering a hackathon and want blunt feedback before the final version. You (or a colleague) reviewed v1 earlier; here is v2. Please open the live demo and read the draft write-up below.

Hackathon: Codegeist 2026 (Atlassian Forge apps; category Apps for Specialized Industries; Rovo agents bonus)
Judging criteria: Technological Implementation (thorough, non-trivial use of Forge + Jira/Confluence/JSM/Rovo); Design (complete coherent product, not just a proof of concept); Potential Impact (credible, specific real problem for a real audience); Innovation/Idea; Presentation (video shows it working end-to-end, clear pitch).
Live demo: https://krishidesk.sites.tab.bot/ (web demo of the triage core; the real app is a Forge app in Jira Service Management, code ready, not yet deployed)

What changed since v1:
- Safety rebuilt as a rule floor that runs before any AI: swallowing words (incl. Hindi/Hinglish), symptoms after spraying, 50+ pesticide names, dose questions. Your three failing cases now: 'neighbour drank pesticide' and 'son sprayed, headache and sweating' -> Emergency (first aid only, 15-min SLA); 'Monocrotophos on tomato, how many ml' -> expert sign-off, no dose drafted.
- 50-query adversarial test sheet (written by us, so a floor not proof), 50/50 pass, runs live on the demo page and as repo tests.
- Knowledge base 8 -> 23 advisories, mostly TNAU Agritech pages; 'paddy leaves turning yellow' now gets a differential checklist; 'spots on tomato' -> early blight.
- Request types (Pest/Disease, Scheme, Market, Emergency), queue, labels; new Forge action 'Apply triage labels' (write:jira-work) for JSM automation; JSM_SETUP.md documents queues/SLA/automation.
- Outbreak radar by district from ticket labels (sample tickets).
- Still missing: Forge deploy + install link (no Atlassian developer site yet), Confluence-backed advisories, video.

Draft Devpost write-up (v2):
# Devpost submission draft: KrishiDesk (Codegeist 2026), v2

**Status: draft only, not submitted.** Still to come: the installation link (needs an Atlassian developer site) and the video. This is version 2 (1 Nov 2026), revised after round-1 feedback from two AI reviewers (Fo and Hark). Hark found three dangerous queries that v1 answered with normal advice; v2 fixes all three.

- **Project name:** KrishiDesk
- **Category:** Apps for Specialized Industries (also Best Agents: Rovo)
- **Elevator pitch (≤200 chars):** A Forge app and Rovo agent that triages farmer queries for India's farm-advice centres, escalates poisoning cases in seconds, and answers only from vetted, sourced advisories.

## Inspiration
India has about 731 Krishi Vigyan Kendras (KVKs), the farm science centres that farmers phone or message about pests, fertiliser and scheme payments. The answer depends on who picks up. Vetted advice sits in PDFs and in experts' heads. A wrong answer about a pesticide can hurt someone.

Our team lead, Akshay Wagh, studies agriculture for the Indian Forest Service exam. He asked his AI assistant, Tab, to build the help desk these centres need: fast for routine questions, and never careless with the dangerous ones.

## What it does
- **Triage.** Every farmer query becomes a Jira Service Management ticket. An issue panel shows:
  - the request type (Pest/Disease, Scheme, Market, Emergency);
  - category, crop and urgency;
  - the queue it belongs in;
  - a draft reply.
  One click applies labels that JSM automation uses to route the ticket.
- **Safety floor in code, before any AI.**
  - Words about swallowing ("drank", "pi liya", "जहर"), or symptoms after spraying ("headache and sweating"), make the ticket an Emergency. It gets a 15-minute callback SLA and first-aid steps only.
  - Any of 50+ pesticide names, or a dose question, gets no drafted product or dose; an expert signs off.
  - The Rovo agent can add escalations but can never remove one.
- **Vetted answers only.** 23 advisories so far: rice, tomato, cotton, chilli, onion, wheat, mango, sugarcane, banana pests and diseases, plus PM-KISAN, KCC, Soil Health Card, PMFBY and e-NAM.
  - Each cites its source, mostly TNAU Agritech pages from Tamil Nadu Agricultural University.
  - Ambiguous symptoms ("paddy leaves turning yellow") get a checklist to tell the possible causes apart, not a guess.
  - No match goes to a human.
- **Outbreak radar.** Pest tickets are grouped by district from their labels, so a centre sees a cluster early.
- **Safety test sheet.** 50 adversarial queries, including Hindi and Hinglish poisoning reports and dose requests. All 50 pass. The sheet runs live on the demo page and in the repo's tests.

## How we built it
- **Forge (Node 22) modules:**
  - a `rovo:agent` with three actions: Triage farmer query, Look up vetted advice, Apply triage labels;
  - a `jira:issuePanel` in UI Kit;
  - a resolver.
- **Jira access** is through `@forge/api`, using the `read:jira-work` and `write:jira-work` scopes.
- **One small core.** Triage, the safety guard and retrieval are a single pure-JavaScript core that also runs the public demo, so the demo is the real logic.
- **Setup guide.** `JSM_SETUP.md` covers request types, queues, SLAs and the automation rule.

## Challenges we ran into
Hark's first review broke our safety claims:
- "My neighbour drank pesticide" got pest advice.
- "Son sprayed yesterday, headache and sweating" was rated low urgency.

We rebuilt the guard as rules that run first. Then we tested it on 50 adversarial queries. That surfaced a subtler bug: "ate" matched inside "glyphosate", which raised a false alarm. Matching on whole words fixed it.

## Accomplishments that we're proud of
- A help desk that cannot be talked into giving a dose.
- Every sentence it drafts has a source.

## What we learned
- Guardrails belong in code the AI cannot override.
- A visible test sheet earns more trust than a promise.

## What's next for KrishiDesk
- Deploy to a Jira Service Management site with the advisories in Confluence (one page per advisory, each with an owner and a version).
- Replies in Hindi and Marathi.
- A WhatsApp intake channel.
- A pilot with one KVK.

## Built with
atlassian-forge, rovo, jira-service-management, confluence, ui-kit, react, javascript, node.js

## Try it out
- Web demo of the same core: https://krishidesk.sites.tab.bot/
- Installation link: after `forge deploy`. This needs an Atlassian developer site, which is pending.

## Video
To record (about 3 minutes; the rules require it to be public on YouTube):
1. A WhatsApp-style message becomes a ticket.
2. A poisoning report escalates.
3. A dose question is held for an expert.
4. The outbreak radar updates.

## Team and AI disclosure
Team lead and entrant: Akshay Wagh (India). This project was built by Tab, an AI assistant, for Akshay Wagh. Tab wrote the code, the agent and the test sheet. Akshay set the goal and reviews the agronomy and the final entry. The knowledge base cites public pages and is not a substitute for an expert's advice.


Please reply with:
0. Which v1 weaknesses are now fixed, and which still stand.
1. Your score out of 10 against each judging criterion, one line each.
2. The 5 biggest weaknesses a judge would see (most damaging first).
3. The 5 most valuable improvements I can make in about a week, each concrete (feature, wording or demo change).
4. One sentence on what would make this a winner.
Keep it under 450 words. Plain text.

---

It's a 10-marker, so keep the definition crisp, use the four pillars as your frame, then give two tight sets of constraints.

---

Real progress: the safety floor now caught all seven poisoning cases I threw at it, in English and Hindi. But the entry still can't be judged without an install link, and new gaps show up where the floor ends.

[Summary card]
KrishiDesk v2: Judge's-Eye Review
v1 issues: fixed and still standing
Fixed: the poisoning and dose escalation, coverage of everyday questions, JSM request types, queues and labels, and the visible test sheet.
Still standing: no deploy or install link; no Confluence (the advisories live in local JSON); the Rovo agent isn't shown working; 8 of 23 advisories still cite Wikipedia.
Scores
Technological Implementation: 3/10. The Forge code is unproven until a judge can install it.
Design: 5/10. The parts hang together, but it's still a web demo of a product.
Potential Impact: 7/10. KVKs are a sharp, credible audience, but there's no pilot voice.
Innovation: 6/10. A code-level safety floor that AI can add to but never remove is a good idea.
Presentation: 3/10. No video, and the write-up dwells on reviewers.

Biggest weaknesses

No installation link. Under the rules that's a disqualifier, not a deduction.

Wrong advice goes out automatically. In my tests:

"Yellow mosaic in moong" got the rice yellowing checklist with no human review.
"Mix two insecticides in one tank" got IPM advice with no expert flag.
"Fake DAP" matched e-NAM and was sent.

Wrong emergency scripts:

"Suicidal, crop failed, loan unpaid" gets pesticide first aid (fresh air, wash skin) and no mental-health helpline.
Swallowing cases need their own script, not skin-exposure steps.

The headline Atlassian features don't exist yet: Confluence as the source of truth, and Rovo drafting.

Category errors (urea dose classed as a pest, phorate as Market) show that keyword routing is still brittle.

Improvements for this week

Today: get a free Atlassian developer site, run forge deploy and forge install, and generate the distribution link. Everything else depends on it.

Move the 23 advisories into a Confluence space (one page each, with an owner label and a version). Retrieve them through the Confluence API, and show an edit changing the next draft.

Add three guards:

Auto-send only when the crop matches and the confidence is high; otherwise a human reviews.
Any chemical-mixing, fake-input or dose question goes to an expert.
Separate Emergency scripts for swallowing, skin exposure and self-harm, with Tele-MANAS 14416. Add these cases to the test sheet.

Replace the Wikipedia sources with TNAU, ICAR and official scheme portals.

Make a video under 3 minutes in real JSM:

Rovo triages a ticket.
A poisoning case hits the Emergency queue with its SLA clock.
An expert edits Confluence and the reply changes.
In the write-up, cut "Fo and Hark" and frame the fixes as "an external red-team found".

What would win
A judge installs it, types the nastiest question they can think of in Hindi, and watches KrishiDesk route it to the right human with the right script, while routine questions get a cited Confluence answer in seconds.
