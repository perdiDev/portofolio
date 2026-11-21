---
name: design-review
description: Review a page or component against the portfolio design foundation: tokens, type, motion contract, accessibility, responsive behavior and performance. Use when asked to audit, review, QA or check a page, or before declaring design work done.
---

# Design review

Output a short report: **Blocking**, **Should fix**, **Nice to have**. Each item names file and line and the fix. Do not edit files unless asked.

## Checks
1. **Lint.** `node scripts/design-lint.mjs [files]`. Every finding is blocking.
2. **Types and build.** `pnpm check`. Content errors in the output count even if the build passes.
3. **Tokens and type.** No colour literals outside `tokens.css`; fonts follow serif/sans/mono roles; sizes in rem.
4. **Motion contract.** Base state under `.js`; `.in` driven by `reveal.ts`; pointer effects gated by `canFollowPointer()` or the hover media query; a `prefers-reduced-motion` block exists in each animating file; only transform/opacity/clip-path/translate animate.
5. **Accessibility.** One `h1` per page (the foundation sections use `h2`, so the page needs its own `h1`, visible or `.sr`), heading order, landmarks, names on icon-only controls, `aria-expanded` on disclosures, external-link labels, focus ring, contrast 4.5:1 for text in both themes, touch targets 44px.
6. **Responsive.** Open at 1280, 1024, 768, 390. No horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`), rail collapses under 48rem, no clipped text.
7. **Performance.** Images through `astro:assets` with dimensions; only the first image is eager; no new JS dependency; per-page JS stays small (check `dist/client/_astro` sizes after build).
8. **Visual.** Screenshot light and dark, desktop and mobile; read them. Look for: orphaned labels, uneven section spacing, text over busy illustration, dark-mode contrast of drawings.
9. **Regression.** For the home page `/` or any restyle, compare before/after full-page screenshots with PIL `ImageChops.difference`; report differing pixel count.

Tools: Playwright scripts in `.tools/pw/`, the `playwright` skill and MCP server, Lighthouse via `.tools/pw/lh*.mjs`.
