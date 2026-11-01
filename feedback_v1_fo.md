Feedback v1 on krishidesk from Fo (OG Fo, Wajo; account akshay.wagh@mail.tab.bot) · saved 2026-11-01T16:03:38.559Z · chat https://wajo.ai/fo/c/3e536eb3-90de-43a3-a928-e2987607c9b1
Verbatim reply (unchecked):

Read the demo and the draft. Here's the blunt version.

**Scores (out of 10)**

1. Technological Implementation: 6. The described architecture (Rovo agent, two actions, UI Kit panel, resolver) is non-trivial, but it's not deployed, so a judge can't verify any of it in Jira.
2. Design: 5. The web demo reads as a coherent product idea, but the actual JSM experience, the thing being judged, is invisible.
3. Potential Impact: 8. Genuinely specific: extension centres, vetted-advice gap, unsafe dose advice is a real failure mode. Your strongest criterion.
4. Innovation/Idea: 7. Source-on-every-fact plus safety escalation is a sharp angle; retrieval over vetted docs alone isn't new, the guardrails are.
5. Presentation: 3. No video and a stand-in demo, so this criterion is nearly empty today.

**5 biggest weaknesses (most damaging first)**

1. The Forge app isn't installed anywhere. "Code ready, not yet deployed" reads to a judge as "unproven." This single fact caps both Implementation and Design.
2. No video. Presentation is a full criterion and you currently score near zero on it.
3. The web demo proves a rule-based triage core, not the AI product. Judges can't see the Rovo agent drafting, citing, or refusing.
4. The demo knowledge base is tiny, so retrieval quality is untested. One obscure crop query and the demo looks broken rather than correctly saying "no match."
5. The pitch lacks a number. "Hundreds of questions a week" is unsourced; "Akshay asked Tab to build it" also undercuts credibility, keep the team story professional.

**5 highest-value improvements in a week**

1. Deploy. A working Forge app on a free JSM site beats every other fix; even a rough one beats none.
2. Record the real end-to-end loop in JSM: query to ticket, panel triage, agent drafting with visible citations, poisoning query going critical with no agronomic advice.
3. Grow the knowledge base to 8-10 real advisories across 5-6 crops, pulled from public ICAR/KVK pages, so retrieval demos look substantive.
4. Demo the failure cases on purpose: a query with no matching advisory routing to a human, and a poisoning case triggering escalation. Guardrails are your differentiator; show them firing.
5. Tighten the pitch: open with one concrete number about extension-centre query volume, add the install link, and swap the "built by Tab" line for your own role.

**What would make this a winner**

A judge watching a poisoning query get escalated to a human with zero agronomic advice in the draft, then a routine query answered with a citation from the centre's own Confluence advisory, inside a real Jira site, not a mockup.
