# KrishiDesk
Forge app + Rovo agent for agriculture extension help desks (Jira Service Management + Confluence). Built by Tab (AI assistant) for Akshay Wagh.

Web demo of the triage core: https://krishidesk.sites.tab.bot/

manifest.yml · src/index.js (actions + resolver) · src/core.js (triage + lookup, shared with demo) · src/kb.json (seed advisories, each with a source) · src/frontend/index.jsx (UI Kit issue panel) · prompts/agent-prompt.md · test/ (`node --test test/core.test.js`).
Deploy: npm install; forge register (replaces app.id); forge deploy; forge install --site <site>.atlassian.net --product jira. Forge CLI needs Node ^22.23.4 / ^24.22.1.
