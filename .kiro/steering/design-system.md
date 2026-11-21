---
inclusion: always
---
# Design system rules (short form; details in DESIGN.md)

1. Colour only through tokens in `src/styles/foundation/tokens.css`. No hex, rgb or named colours elsewhere. Project colour is `--hue` + `color-mix`.
2. Fonts: serif for headings and voice, sans for reading, mono for metadata. Sizes in `rem`/`clamp`.
3. Structure with 1px `--line` rules, grids and space. No shadows on panels, no gradients as decoration, no rounded cards, no emoji or icon packs.
4. One accent. Emphasis is italic serif in the accent colour, once per heading.
5. Reuse before creating: check `src/components/foundation/` and `src/components/*/`.
6. Every animated rule is under `.js` and has a `prefers-reduced-motion` counterpart. Hover and pointer effects sit inside `@media (hover: hover) and (pointer: fine)`.
7. Animate `transform`, `opacity`, `clip-path`, `translate` only. Never `transition: all`. Easing is `var(--ease-out)`.
8. Behavior lives in `src/scripts/`, not inline. Server data goes to the client through `data-*` attributes, not `define:vars`.
9. Semantic HTML first: landmarks, headings in order, `button` for actions and `a` for navigation, `aria-expanded` on disclosures, decorative SVG `aria-hidden`.
10. Mobile is designed, not collapsed: check 390px wide. Use `100dvh`, never `100vh`.
11. Images: `astro:assets`, explicit width and height, `loading="lazy"` below the fold, `fetchpriority="high"` on the first.
