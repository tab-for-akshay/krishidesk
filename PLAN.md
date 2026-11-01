# KrishiDesk — project plan (Codegeist 2026, Atlassian)

Hackathon: Codegeist 2026: Build with context. Ship with confidence. · https://codegeist2026.devpost.com/
Deadline: Tue 22 Dec 2026, 12:00 PM PST (Wed 23 Dec 1:30 AM IST) · $120,000 cash · adults; India allowed · individuals, teams (one "Representative" submits) or organizations.
Category: Apps for Specialized Industries ("Give experts in healthcare, finance, manufacturing, automotive, or other fields the context to do their best work"); also eligible for the Best Agents (Rovo) bonus since it ships a rovo:agent module.
Requirements (official rules): Forge app integrated with at least one Atlassian product; demo video "uploaded to and made publicly visible on YouTube"; installation link a judge can use; "Be the original work of the Entrant, be solely owned by the Entrant".
Team: Akshay Wagh (team lead, Representative) + Tab (AI assistant, builder). Registered on Devpost as tab-for-akshay (registration only).

## Problem
Agriculture extension centres (Krishi Vigyan Kendras, state agriculture offices, FPO help desks) answer a flood of farmer questions by phone and WhatsApp: pests, fertiliser doses, scheme payments, mandi prices. Answers depend on whoever picks up; vetted advice sits in PDFs and experts' heads; risky advice (pesticide doses) goes out unchecked; nothing is tracked.

## Solution
A Forge app for Jira Service Management + Confluence:
- Every farmer query becomes a ticket. The KrishiDesk issue panel triages it: category (pest, disease, nutrient, water, scheme, market), crop, urgency, safety flag, suggested labels.
- A Rovo agent, "KrishiDesk Advisor", drafts the reply using two actions (Triage farmer query, Look up vetted advice) and answers ONLY from the centre's vetted advisories, with a source per fact.
- Safety by design: possible pesticide poisoning makes the ticket critical and suppresses agronomic advice; chemical advisories carry an expert sign-off flag; no match routes to the subject-matter expert.
- Teamwork context: advisories live in the centre's Confluence space; experts edit one page and every reply follows.

## Tech
Forge (Node 22 runtime), manifest modules rovo:agent, action ×2, jira:issuePanel (UI Kit, @forge/react), resolver; Jira REST via @forge/api (read:jira-work). Shared pure-JS core (triage + retrieval) also powers the web demo. Seed knowledge base: 8 advisories citing public pages (PM-KISAN, KCC, Soil Health Card, e-NAM, PMFBY, fall armyworm, pink bollworm, IPM thresholds).

## MVP status (1 Nov 2026)
Code: /home/user/tab/files/hackathons/krishidesk/ (manifest.yml, src/index.js, src/core.js, src/kb.json, src/frontend/index.jsx, prompts/agent-prompt.md) · unit tests 4/4 pass.
Web demo of the triage/lookup core: https://krishidesk.sites.tab.bot/
Not yet: forge register / lint / deploy / install (needs Tab's Atlassian developer account + API token: a helper is creating it); Confluence-backed advisories (reads a space instead of the bundled JSON); demo video; installation link.

## Plan to submission
- Nov: Atlassian dev site + forge deploy to development; install on the dev site; fix lint; replace bundled KB with a Confluence space read (Confluence REST, read:confluence-content.all); add "Create follow-up task for expert" action (CREATE verb) with human confirmation.
- Early Dec (after 27 Nov, with Akshay): Akshay checks the agronomy content and the farmer-facing tone; record the demo video; Akshay uploads it to YouTube.
- By 20 Dec: production deploy + distribution (installation link) ; Akshay submits as Representative.

## Demo script (~3 min)
1. JSM queue with 5 farmer tickets. Open "caterpillars in maize whorl": panel shows PEST · maize · medium, fall-armyworm advisory with source and "expert sign-off" flag.
2. Ask Rovo "Triage KD-104" (poisoning): critical, safety-first reply, escalated.
3. Edit the Confluence advisory page; re-run: the reply follows the expert's update.
4. Close: built by Tab, an AI assistant, for Akshay Wagh.
