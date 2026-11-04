# KrishiDesk

KrishiDesk is a Forge app and Rovo agent for Jira Service Management. It triages farmer queries for India's farm advice centres (Krishi Vigyan Kendras), escalates safety cases at once, and answers only from vetted advisories, each with a source. It is an entry for Codegeist 2026.

**Web demo** (the same core logic): https://krishidesk.sites.tab.bot/

**Team:** Akshay Wagh, team lead. Built by **Tab, an AI assistant**, which wrote the code, the agent prompt and the test sheet. Akshay set the goal and reviews the agronomy.

## Layout
- `manifest.yml`: the Forge modules.
  - `rovo:agent` KrishiDesk Advisor, with 3 actions: triage, lookup, apply labels.
  - A `jira:issuePanel` (UI Kit) and a resolver.
  - Scopes: read/write Jira work, read and search Confluence.
- `src/core.js`: pure-JS triage, safety guard and retrieval. Shared by the Forge functions and the web demo.
- `src/confluence.js`: reads advisories from Confluence pages labelled `krishidesk-advisory`, citing each page's last editor and version. The bundled `src/kb.json` is the fallback.
- `src/index.js`: Forge action and resolver handlers. `src/frontend/index.jsx` is the issue panel.
- `prompts/agent-prompt.md`: the Rovo agent's instructions. Safety flags may be raised, never lowered.
- `scripts/seed-confluence.mjs`: turns `kb.json` into Confluence pages.
- `JSM_SETUP.md`: request types, queues, SLAs and the automation rule.
- `test/`:
  - `core.test.js`;
  - `adversarial.test.js` with `adversarial.json`: 58 adversarial queries, covering poisoning, self-harm, dose and mixing questions, and fake inputs, in English, Hindi and Hinglish.
  - Run them with `node --test test/`.
- `demo-site/`: the public web demo.

## Safety floor
These are rules that run before any AI:
- **Swallowed pesticide:** a hospital-now script.
- **Symptoms after spraying:** a first-aid script.
- **Self-harm:** Tele-MANAS 14416 / 1-800-891-4416, and 112.

All three go to the Emergency request type with a 15-minute SLA.

Any pesticide name, dose question or mixing question gets no drafted product, dose or mix; an expert signs off. A crop-specific advisory is auto-drafted only when the farmer named that crop.

## Status
Live. Forge app id `88dbaf3e-6c3a-48a1-9526-e94049588533` is deployed to production (v2.0.0) and installed in Jira and Confluence on a dev site. The issue panel and the Rovo agent "KrishiDesk Advisor" both answer on a demo ticket (screens in the submission).

## Install and run
You need Node 22 and the Forge CLI (`npm i -g @forge/cli`, then `forge login`).
1. `git clone https://github.com/tab-for-akshay/krishidesk && cd krishidesk`
2. `forge register` (gives the app your own id), then `npm install` and `forge deploy -e production`.
3. `forge install --site <your-site>.atlassian.net --product jira` (and again with `--product confluence`).
4. Optional: `node scripts/seed-confluence.mjs` loads the 23 vetted advisories as Confluence pages; follow `JSM_SETUP.md` for request types, queues, SLAs and the automation rule.
5. Run the tests with `node --test test/`. To try the logic without Atlassian, open the web demo above.

## Licence
MIT
