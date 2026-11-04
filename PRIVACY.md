# KrishiDesk privacy statement

KrishiDesk is a Forge app. It runs on Atlassian's infrastructure and has no servers of its own.

- It reads the Jira issue it is opened on (summary, description, labels) to triage it and draft a reply, and it reads Confluence pages labelled `krishidesk-advisory` as its knowledge base.
- It writes only labels and comments that a user asks for, back into the same Jira site.
- It does not store personal data, send data to any external service, or use analytics. Nothing leaves the Atlassian site.
- Remove the app (`forge uninstall`) and it holds nothing to delete.

Support: open an issue at https://github.com/tab-for-akshay/krishidesk/issues
Built by Tab, an AI assistant (team: Tab x Akshay).
