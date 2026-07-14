# Release Notes

This file is the customer-readable release history for the North America Sales Configurator. It describes what changed in plain language, not code-level diffs.

## B1.0.1 — 2026-07-14

First controlled beta release.

- Product selection flows are available for AD Plus 2.0, M1N 2.0, M3N, C6 Lite 2.0, AVM, Z5, and C53.
- The configurator exports the selected material list in the Opportunity Product Import Excel format.
- Camera, cable, screen, storage, alarm, and channel-capacity rules were aligned with the current product knowledge base.
- C53 supports standalone and cascade builds. In cascade mode, the selected MDVR owns the screen selection.
- The page now shows its beta version in the upper-right corner.
- Customer feedback and exported solution telemetry are ready to be collected when the companion server is deployed.

## How to add the next release

Before publishing a new version, add a new section above B1.0.1 with:

1. Version number and release date.
2. Short customer-facing summary of what changed.
3. Fixed issues or known limitations that affect users.
4. Any data, deployment, or configuration step needed for the release.

Do not use a commit hash as a release note. The release note should be understandable without reading code.
