---
name: abstract-illustration
description: Create abstract line illustrations as code-generated SVG, themed by one hue, drawn from the subject of a project or section, with a stroke-draw entrance animation. Use when asked for abstract art, backdrop illustrations, line drawings, plates, or decorative graphics for a card, hero or section on this portfolio. Reference implementation is /new-home-4 (src/components/new-home-4/plates.ts).
---

# Abstract line illustration

House style from `/new-home-4`. Use it for any new abstract illustration on any page. Copy the method, not the project-specific drawings.

Reference files:
- `src/components/new-home-4/plates.ts`: helpers and 7 finished drawings.
- `src/pages/new-home-4.astro`: CSS (search `.plate`, `.art`, `.ln`) and the markup (`set:html`).
- `.tools/pw/plates.mjs`: screenshots each plate after its animation finishes.
- `helpers.md` (this folder): copy-ready helper functions and recipes.

## Core idea
One illustration is a drawing of the subject's own world, in one stroke weight and one hue, placed around the real product screenshots. "Abstract" means schematic and diagrammatic, not decorative blobs.

1. **Pick the metaphor from the project's real data.** Ask what the thing measures, moves, stores or prints. Used so far:
   - solar/diesel planner: 24h load curve, hatched solar bell
   - boat tracker: sea-depth contour rings, dashed track, crosshair
   - parenting chat app: speech bubbles, report sheet with bars
   - flower shop: stems, leaves, rose spirals from above
   - tourism QR app: ridgelines, map pins, QR finder squares
   - pre-order shop: torn receipts, ticket stub
   - village letters app: rice terraces, mountain, letter with seal
2. **Compose at the edges.** Keep the centre and the screenshots' footprint calm. Put dense drawing in corners and margins.
3. **Add 1 to 3 small mono labels** from the real domain (`BEBAN · kW`, `−12 m`, `No. 0042`).
4. **Restraint.** About 10 to 25 paths. At most two stroke weights (default and `bold`). Dashed lines for secondary things (tracks, routes, guides).

## Technical contract

**Canvas:** `viewBox="0 0 1600 900"`, `preserveAspectRatio="xMidYMid slice"`, `aria-hidden="true"`. The container is 16:9 with `position:relative; overflow:hidden; isolation:isolate; container-type:inline-size`. The SVG is `position:absolute; inset:0; z-index:-1`. Keep important shapes at least 60 units from every edge, because `slice` crops on other ratios.

**Generation:** one TypeScript function per drawing (`artSomething()`) that returns an SVG string. Reset the counter `k = 0` at its start. Inject with `set:html`. Never hardcode colours in the SVG.

**Class vocabulary** (styled once in CSS; drawings only use these):
| class | meaning |
|---|---|
| `ln` | main stroke. Needs `pathLength="1"` and `style="--k:N"` (stagger order) |
| `ln bold` | emphasis stroke, about 2x weight. Use once or twice |
| `ln ds` | dashed secondary stroke (route, track, ruler) |
| `gr` | faint dotted grid line, not animated |
| `fl` | fill area, normally a hatch pattern clipped to a shape |
| `tx` | mono uppercase label. Uses `fill`, not `stroke` |

**Colour:** one `--hue` per drawing on its container. Everything derives from it:
```css
.plate { --tint: color-mix(in oklab, var(--hue) 9%, var(--bg));
         --stroke: color-mix(in oklab, var(--hue) 62%, var(--bg)); }
[data-theme='dark'] .plate { --tint: color-mix(in oklab, var(--hue) 16%, var(--bg));
                             --stroke: color-mix(in oklab, var(--hue) 70%, var(--ink)); }
.art { fill:none; stroke:var(--stroke); stroke-width:1.4; stroke-linecap:round; stroke-linejoin:round; }
```
Use mid-saturation hues (`#2e7d8f`, `#5b8a66`, `#7652b0`). Give each project a distinct hue. Check light and dark themes.

**Draw-on animation:** `ln` paths use `stroke-dasharray:1; stroke-dashoffset:1` (works because of `pathLength="1"`) and transition to `0` when the card gets `.in`. Stagger with `calc(400ms + min(var(--k), 14) * 45ms)`. Dashed, label and fill layers fade in later (900 to 1300ms). Gate everything behind `.js` so no-JS users see the finished drawing. Add a `prefers-reduced-motion` block that removes dasharray and transitions. Copy the exact rules next to `.js .card .art .ln` in `new-home-4.astro`.

**Dashed paths:** `ds` cannot also use the draw-on dash. It fades in with opacity and keeps `stroke-dasharray: 0.006 0.012`.

## Building blocks (code in helpers.md)
- `ln`, `circ`, `txt`: emit elements with auto `--k`.
- `ring(cx,cy,r,seed,sx,sy)`: wobbly closed contour. Layer 5 to 6 rings with growing radius and changing seed.
- `ridge`, `terrace`: polylines sampled every 40 units from sines. Stack 2 to 4 layers.
- `leaf`, `rose`, `receipt`, `finder`, `pin`, speech bubble.
- Organic wobble: `1 + 0.09*sin(3t+seed) + 0.05*sin(5t+2.1*seed) + 0.03*cos(7t+seed)`. Round numbers with `r1` to keep markup small.

Add a new helper only when two drawings would use it.

## Workflow
1. Read the project's data and screenshots. Write one sentence: "This is about ___, so the drawing shows ___."
2. Sketch on the 1600x900 grid: where screenshots sit, which corners get drawing, where labels go.
3. Write `artX()` in `plates.ts` and register it in `PLATES` with `hue`, `kind` (`phones` or `browser`) and `art: artX()`.
4. Run `pnpm dev`, then `cd .tools/pw && node plates.mjs light` and `node plates.mjs dark`. View `.tools/shots/plate-*.png`. Also check a 390px wide viewport.
5. Fix overlap with screenshots, shapes near edges, label collisions, density, and dark-mode contrast.

## Do not
- No gradients, shadows, glows, blur or filled colour blocks. Only strokes, one hatch fill and mono text.
- No icon packs or emoji. Draw from primitives.
- One hue per drawing. No hex values inside the SVG.
- No raster images.
- No JS animation. Use CSS transitions triggered by an `.in` class from an IntersectionObserver.
- Do not put meaningful text in the drawing. It is `aria-hidden`, so labels are decoration.
- Unique `id`s for patterns and clipPaths per drawing (`hatch-hy`, `clip-hy`), since all plates share one document.

## Beyond plates
The method also fits hero backdrops, section dividers, empty states and 404 pages. Keep the class vocabulary and hue-derived colours, and change only the container and layout. For small spots (dividers, icons) use a smaller viewBox, fewer paths and no labels.
