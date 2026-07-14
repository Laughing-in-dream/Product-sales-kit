# Branch Work Log

This is a plain-language log of work performed on each branch. It is deliberately not a code comparison.

## main

### B1.0.1 beta preparation — 2026-07-14

- Added a visible beta version label and a customer feedback entry point.
- Added the server-side collection design for feedback and exported solution statistics.
- Added the release-note and branch-log process required before every future publication.
- Fixed the C53 cascade handoff so the selected MDVR wizard can continue normally; screen selection now occurs in that MDVR wizard.

## Rules for future entries

- When work starts on a new branch, create a heading with the branch name and intended customer impact.
- When work is merged or released, add a short, non-technical summary of what users gain, what is fixed, and any follow-up work.
- Keep this file current even for urgent fixes. A customer or sales colleague should be able to understand it without opening Git.
