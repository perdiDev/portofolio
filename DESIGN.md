# Design system: Foundation

Every redesigned page is built from this. The home page `/` (`src/pages/index.astro`) is the reference implementation: it only composes `FoundationLayout` and section components, and it was pixel-checked against the `/new-home-4` draft it replaced (`/new-home-4` now redirects to `/`).

## Character
Editorial and quiet. Warm paper, ink, one accent. A serif for voice, a sans for reading, a mono for metadata. Hairline rules instead of boxes and shadows. Motion explains structure (a line draws, a title rises out of a mask) and never decorates.

## Tokens (`src/styles/foundation/tokens.css`)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f4f1ea` | `#141311` | page |
| `--bg-2` | `#ece8df` | `#1c1a17` | quiet surface |
| `--ink` | `#1d1b18` | `#ece7dd` | text, solid buttons |
| `--muted` | `#6f6b63` | `#9a958a` | secondary text |
| `--line` | `#d9d4c8` | `#2d2a25` | every rule and border |
| `--accent` | `#8a4a30` | `#dba685` | the one accent: numbers, italics, active state |
| `--band-*` | inverted set | inverted set | inverted surfaces (hover fills) |

Other tokens: `--serif` Lora, `--sans` Inter, `--mono` JetBrains Mono, `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--rail: 17rem`, `--gutter: clamp(1.5rem, 4.5vw, 5rem)`, `--shade` (near-black for mockup shadows), `--cursor-bg` / `--cursor-ink` (cursor label, same in both themes). Fonts come from the Astro Fonts API (`--font-lora`, `--font-inter`, `--font-jetbrains-mono`) with metric fallbacks in `src/styles/fonts.css`.
Per-project colour is a single `--hue` on a plate; tint, stroke and shadow are derived with `color-mix(in oklab, ...)`.

Rule: components never contain a colour literal. Add a token instead. The only literals allowed outside `tokens.css` are device-mockup colours, tagged `lint-allow:hex`.

## Type
- `h1 h2 h3`: serif 400, `letter-spacing: -0.02em`, `text-wrap: balance`. Section `h2` is `clamp(2rem, 3.8vw, 3.25rem)`.
- Body: sans 1rem / 1.7. `.small`: 0.8125rem muted.
- Metadata (numbers, dates, statuses, labels): mono, 0.6875 to 0.75rem, uppercase with `0.06 to 0.08em` tracking. Use `.tnum` for numbers.
- Italic serif in accent colour (`<em>`) is the single emphasis device. Use once per heading.
- Sizes in `rem` and `clamp()`. Never `px` for text.

## Layout
- Shell: sticky rail (`--rail`) + reading column. Rail holds identity, section nav, local clock, theme toggle. Below `48rem` the rail becomes a top bar and the nav hides.
- Sections: `<Section id n title>`. Hairline top edge, `padding-block: clamp(5rem, 11vw, 9rem)`, number in mono accent above an `h2`.
- Structure comes from rules (`1px solid var(--line)`), grids and whitespace. No cards with shadows, no rounded panels. Pills are only for buttons and the avatar arch.
- Breakpoints: `64rem` (narrower rail), `48rem` (single column, rail on top).

## Components (reuse before creating)
| Part | File | Notes |
|---|---|---|
| Layout | `src/layouts/FoundationLayout.astro` | props `title`, `description`, `heading` (text of the one visually hidden `h1`), `nav` (`{ id, label }[]`), `noindex`, `seo` (passed to `SEO.astro`: `fullTitle`, `canonical`, `image`, `type`, `article`, `prev`, `next`, `jsonLd`). Footer carries site links. |
| Section | `src/components/foundation/Section.astro` | `id`, `n`, `title`, `class`; `headless` = keep the rule, slot renders its own `h2#{id}-h`; `bare` = no scaffold, named by `aria-label`. CSS in `styles/foundation/section.css`, imported by the layout |
| Work grid and plate | `src/components/Work.astro`, `src/components/plates.ts` | see skill `abstract-illustration` |
| Timeline | `Experience.astro` + `src/utils/timeline.ts` | accordion, spine fills on scroll |
| Education | `Education.astro` | masked title, drawn arches |
| Recognition | `Recognition.astro` | ruled rows, pointer light |
| Contact | `Contact.astro` | envelope plate, copy button, socials |
| Primitives (CSS) | `base.css` | `.btn`, `.ulink`, `.small`, `.tnum`, `.sr`, `.skip`, `.dot` |

## Motion contract
1. Everything is hidden or offset only under `.js` (set by an inline script in `<head>`), so no-JS users see finished content.
2. `foundation/reveal.ts` toggles `.in` on `.reveal`, `.sec` and `[data-reveal]` while they are visible. CSS decides what `.in` animates. Entrances replay.
3. Draw-on lines: `class="ln" pathLength="1" style="--k:N"`, dash 1 to 0, staggered by `--k`.
4. Mask rise for titles: `.edu-w > *` and `.cw > *` translate from 112% inside `overflow: hidden`.
5. Pointer effects (cursor label, parallax, glow, magnet) require `(hover: hover) and (pointer: fine)` and no reduced motion. `canFollowPointer()` in `scripts/foundation/dom.ts`.
6. Hover styles live inside `@media (hover: hover) and (pointer: fine)`.
7. Every file that animates ends with a `prefers-reduced-motion: reduce` block that removes transitions, transforms and filters.
8. Durations: 150 to 300ms for state changes, 500 to 1200ms for entrances. Easing `--ease-out`. Animate `transform`, `opacity`, `clip-path`, `translate`; avoid layout properties. Never `transition: all`.

## Accessibility
Skip link first. Landmarks: `aside` rail, `nav` with label, `main`, `footer`. Each section has `aria-labelledby`. Decorative SVG is `aria-hidden`. Accordion buttons carry `aria-expanded` and `aria-controls`. External links get `rel="noopener noreferrer"` and a "(opens in a new tab)" label. Focus ring is `2px solid var(--accent)` with a 4px offset. Measured contrast: `--muted` on `--bg` is 4.7:1 light and 6.2:1 dark; `--accent` on `--bg` is 6.0:1 and 8.7:1. `--muted` on `--bg-2` in light is 4.3:1, so do not put small muted text on `--bg-2`.

## Illustration
Line drawings in one hue, drawn from the subject of the content. Method and helpers: `.kiro/skills/abstract-illustration`.

## Adding a page
See `.kiro/skills/foundation-page/SKILL.md`. Short version: new file in `src/pages`, wrap in `FoundationLayout`, compose `Section` blocks, add `components/X.astro` plus `styles/x.css` plus `scripts/x.ts` only when no existing one fits, then `pnpm verify`.
