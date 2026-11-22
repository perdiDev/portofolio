---
name: foundation-page
description: Build or rewrite a page of the portfolio on the design foundation (FoundationLayout, Section, token CSS, script modules). Use when asked to create, redesign or migrate any page, section or component of this site.
---

# Build a page on the foundation

Reference: the home page `/` (`src/pages/index.astro`, sections in `src/components/sections/`), `DESIGN.md`, `.kiro/steering/design-system.md`. Also use `impeccable` or `design-taste-frontend` for layout and typography judgement, `emil-design-eng` for interaction polish, and `abstract-illustration` for line drawings.

## Steps

1. **Brief.** State the page's job in one sentence and list its sections with name, number, data source. Ask the user only if the purpose is unclear.
2. **Reuse.** Look in `src/components/foundation/` the section components in `src/components/sections/` (Work, Experience, Education, Recognition, Contact) and the full-page bodies in `src/components/views/` (Diary, Post, ProjectDetail, Archive, Tags, NotFound). `Section` covers heading, rule and reveal. Prefer composing existing parts.
3. **New section** (only if nothing fits). Create three files with the same stem:
   - `src/components/sections/Name.astro` (or `views/` for a full-page body): imports `../../styles/name.css`, wraps content in `<Section id n title>` from `../foundation/Section.astro`, loads its data in the frontmatter, ends with `<script>import '../../scripts/name';</script>` when it needs behavior.
   - `src/styles/name.css`: base styles, entrance under `.js .name.in`, hover inside `@media (hover: hover) and (pointer: fine)`, responsive, then a `prefers-reduced-motion` block at the end.
   - `src/scripts/name.ts`: guarded by `if (!el) return`, uses `src/scripts/foundation/dom.ts` helpers. Pass server data with `data-*` attributes.
   - No folder per page, and no lint config to update: lint finds the component because it renders `Section`, and the CSS because the component imports it.
4. **Page file.** `FoundationLayout` with `title`, `nav` (reading order), `noindex` until launch, then the sections. No logic beyond data shaping.
5. **Colour.** Tokens only. Need a new colour? Add a token to `tokens.css` for both themes and document it in `DESIGN.md`.
6. **Verify** (all must pass):
   - `pnpm verify` (design lint, astro check, build).
   - Screenshots at 1280 and 390 wide, light and dark, with `reducedMotion: 'reduce'` for deterministic output (`.tools/pw/nh4-regress.mjs <out-prefix> <path>`, `BASE=` selects a server). View them.
   - Behavior smoke test `.tools/pw/nh4-behavior.mjs` adapted to the page. No console errors.
   - Keyboard: tab through, focus ring visible, accordions work with Enter/Space.
7. **Migrating an existing route.** Keep the URL and SEO tags (canonical, OG, JSON-LD: `src/components/foundation/SEO.astro`). Pass them to `FoundationLayout` through its `seo` prop rather than copying markup; post lists and entries go through `ListingLayout` and `PostLayout`. Remove `noindex` only when the user confirms the page is ready. Moved URLs need a redirect (the blog moved from `/blog/` to `/diary/`). Run `pnpm audit:build` after the build.

## Do not

- Add inline `<script>` with `define:vars`, `<style is:global>` in pages, `transition: all`, raw hex, `px` font sizes, `100vh`.
- Add a framework island for something CSS or a 20-line module can do.
- Change the foundation's look while building a page. If the foundation needs a change, make it as a separate step and re-run the pixel comparison on `/` (`.tools/pw/nh4-regress.mjs`).
