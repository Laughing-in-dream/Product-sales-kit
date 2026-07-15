# Branch Work Log

This is a plain-language log of work performed on each branch. It is deliberately not a code comparison.

## main

### Stable sales UI refinement — 2026-07-15

- Created a separate visual-refinement branch that improves hierarchy, navigation, cards, and the live build summary without changing product-selection rules.
- Home-page product images are protected as full, uncropped product references: no enlargement transforms, cover cropping, or decorative overlays are applied to them.
- Selectively adopted the strongest parts of the separate Claude review: system typography, top-level product context, and a clearer quotation-style Build Summary, without taking its unstable page-wide layout rewrite.
- Reframed the homepage as the full Streamax Sales Configurator rather than an AD Plus 2.0-only wizard; the top bar now switches to the selected product only after a customer enters that product flow.

### Streamax visual identity — 2026-07-14

- Added the supplied Streamax logo to the top-left of the configurator, while keeping version, annotation, and feedback actions grouped on the right.

### Element annotations for beta review — 2026-07-14

- Added an annotation mode so a beta reviewer can click the specific page element that needs attention and leave a comment against it.
- The internal dashboard now shows the element label, page context, comment, and contact details together, so product and UI issues can be reproduced without guessing where they occurred.
- Standardized the close icon in the release-note, feedback, and annotation dialogs so it remains aligned across browsers.

### B1.0.1 beta preparation — 2026-07-14

- Added a visible beta version label and a customer feedback entry point.
- Added the server-side collection design for feedback and exported solution statistics.
- Added the release-note and branch-log process required before every future publication.
- Fixed the C53 cascade handoff so the selected MDVR wizard can continue normally; screen selection now occurs in that MDVR wizard.

## codex/ui-stability-optimization

### Claude visual language, with layout safeguards — 2026-07-15

- Brought the floating Streamax header, more polished type rendering, and calmer action buttons from the Claude visual review into the stable configurator.
- Kept every existing label, instruction, product-selection rule, and page structure exactly as it is; this change is visual only.
- Preserved the current one-row and tiled layouts, including the C6 Lite four-option row. Product images remain fully visible with no cover cropping, zooming, or replacement artwork.

### Import-template export and visual annotations — 2026-07-15

- Matched the Excel export to the approved Opportunity Product Import Template: its explanatory first row, required field names, column order, and `Dates` worksheet are retained.
- Every exported material now has `Sales Price` preset to `1` and `Factory` preset to `Vietnam factory`; optional substitute-material and description fields are intentionally left blank.
- Beta annotations now retain a marked screenshot of the selected page element together with the reviewer’s written change request. The internal dashboard can securely open that capture for direct visual review.

## Rules for future entries

- When work starts on a new branch, create a heading with the branch name and intended customer impact.
- When work is merged or released, add a short, non-technical summary of what users gain, what is fixed, and any follow-up work.
- Keep this file current even for urgent fixes. A customer or sales colleague should be able to understand it without opening Git.
