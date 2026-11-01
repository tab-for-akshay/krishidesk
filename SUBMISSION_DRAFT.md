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
