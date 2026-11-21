---
inclusion: manual
---
# Playbook: rewriting a page on the foundation

Invoke with `#page-playbook`. Steps:

1. Read `DESIGN.md` and the target page's current file. List its data sources and routes.
2. Write down the sections (name, number, purpose, data) before coding. One idea per section.
3. Map each section to an existing component. Create a new one only if none fits; if you do, add `components/<area>/X.astro`, `styles/<area>/x.css`, `scripts/<area>/x.ts` (only if it needs behavior).
4. Page file: `FoundationLayout` + sections. Pass `nav` in reading order. Use `noindex` while it is a draft.
5. Entrance and motion: follow `motion-and-a11y.md`.
6. Verify: `pnpm verify`; capture desktop 1280 and mobile 390 in light and dark; run the behavior smoke test; compare against the previous version when restyling an existing page.
7. Remove the old page's dead CSS and components only after the new page replaces it.
