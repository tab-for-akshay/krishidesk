Feedback v1 on krishidesk from Hark (hark.com, account akshay.wagh@mail.tab.bot) · saved 2026-11-01T16:06:13.759Z · 100 s
Verbatim reply (unchecked):

Blunt version: the problem is real, but the entry isn't judgeable yet, and the safety pitch breaks on the first tricky question. I ran your triage code on test queries, and three of the dangerous ones went out as normal advice with no human review.

[Summary card]
KrishiDesk: Judge's-Eye Review
Scores
Technological Implementation: 2/10. It isn't deployed, so there's no install link. The demo is about 50 lines of keyword matching, with no Rovo, no Confluence and no JSM to see.
Design: 4/10. The concept and panel layout hang together, but it's five canned tickets on a web page, not a product.
Potential Impact: 7/10. Extension centres and Kisan Call Centres are a real, specific audience, but there's no user voice or numbers.
Innovation: 5/10. Grounded help-desk replies are common. Farm safety routing is the real differentiator, and it's undercooked.
Presentation: 2/10. There's no video yet, and the AI-built framing hides the human story.

Biggest weaknesses

There's no installation link, but the rules require the app to install in a judge's site and work as shown. Today it would be disqualified, not just scored low.

The safety claims fail:

"My neighbour drank pesticide" got IPM advice and no escalation.
"Son sprayed yesterday, headache and sweating" was rated low urgency and got advice.
"Monocrotophos on tomato, how many ml" wasn't flagged for an expert.

The "vetted advice" is 8 entries citing Wikipedia, not ICAR, state agricultural university or KVK advisories, and none of it comes from Confluence.

Triage misses ordinary questions. "Paddy leaves turning yellow" and "spots on tomato, aphids" get no match, and judges will type their own questions into the box.

The Atlassian use is shallow: no request types, queues, SLAs or automation. The Rovo agent isn't shown working anywhere.

Improvements for this week

Deploy to a developer site and generate the install link. Add a JSM project with request types (Pest/Disease, Scheme, Market, Emergency), an Emergency queue with a 15-minute SLA, and an automation rule that acts on the panel's labels.

Rebuild the safety layer:

Escalate on swallowing words, symptom words, any pesticide name, and a banned/restricted pesticide list.
Have Rovo classify, with the keyword guard as a floor.
Ship a test sheet of 50 adversarial queries with results.

Put 30 to 40 real advisories in Confluence (package of practices, TNAU Agritech, official scheme portals), each with an owner and a version. Show an expert editing a page and the next draft changing.

Add one standout: a district pest-outbreak view built from ticket labels, or replies drafted in Hindi or Marathi.

Make a video under 3 minutes:

A farmer's WhatsApp-style message becomes a ticket and gets triaged.
A poisoning case escalates.
An expert updates Confluence and the cited reply changes.
Rewrite the inspiration in your own voice, aimed at India's 700-plus KVKs.

What would win
A live JSM install where a judge can type their own question, including a nasty one, and watch KrishiDesk route it safely and cite the exact Confluence page and expert who own the answer.
