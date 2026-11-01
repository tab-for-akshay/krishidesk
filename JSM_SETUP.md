# Jira Service Management setup for KrishiDesk

1. Create a JSM service project, "KVK Help Desk".
2. Add four request types: **Pest/Disease**, **Scheme**, **Market** and **Emergency**.
3. Create three queues:
   - **Emergency**: JQL `labels = safety-poisoning`
   - **Expert review**: `labels = chem-expert-signoff OR labels = type-pestdisease`
   - **All open**
4. Set two SLAs:
   - "Time to first response" on Emergency: 15 minutes.
   - Pest/Disease: 1 business day.
5. Add an automation rule.
   - When a work item is created, or its labels change, and labels contain `safety-poisoning`:
     - set request type = Emergency;
     - set priority = Highest;
     - alert the on-call officer.
   - When labels contain `chem-expert-signoff`: assign to the plant-protection expert.
6. Install the KrishiDesk Forge app. On each ticket, the issue panel triages it and shows the draft. "Apply labels" (or the Rovo action "Apply triage labels") adds the labels that the rule above acts on.
7. Move advisories into a Confluence space, "KVK Advisories": one page per advisory, each with an owner and a version. (In v2 they are in `src/kb.json` with TNAU Agritech and government sources.)

Status, 1 Nov 2026: the code is written and tested locally, but it has not been deployed, because no Atlassian developer site exists yet.
