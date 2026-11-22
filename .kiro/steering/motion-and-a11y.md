---
inclusion: fileMatch
fileMatchPattern: ['src/**/*.css', 'src/**/*.astro', 'src/scripts/**/*.ts']
---

# When touching styles, markup or scripts

- Entrance pattern: base state under `.js .thing`, final state under `.js .section.in .thing`, delays from `--i`, `--k`, `--w` custom properties set in markup. See `src/styles/contact.css` for a full example.
- Draw-on SVG: `pathLength="1"`, `stroke-dasharray: 1`, `stroke-dashoffset: 1 -> 0`.
- New scripts export an `init...()` or run guarded at module top level (`if (!el) return`). Use helpers from `src/scripts/foundation/dom.ts` (`$`, `$$`, `frame`, `canFollowPointer`).
- Write the reduced-motion block in the same file as the animation, at the end.
- Press feedback on buttons: `:active { transform: scale(0.97) }` at 160ms.
- Touch targets at least 44px (2.75rem). Check at 390px.
- Check both themes. Text on `--bg` must meet 4.5:1.
- After a change: `node scripts/design-lint.mjs <files>`.
