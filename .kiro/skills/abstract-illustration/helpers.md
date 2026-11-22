# Copy-ready helpers

From `src/components/plates.ts`. Canvas is `0 0 1600 900`.

```ts
let k = 0; // reset to 0 at the start of every artX()
const ln = (d: string, extra = '') =>
  `<path class="ln" style="--k:${k++}" pathLength="1" d="${d}" ${extra}/>`;
const circ = (cx: number, cy: number, r: number) =>
  `<circle class="ln" style="--k:${k++}" pathLength="1" cx="${cx}" cy="${cy}" r="${r}"/>`;
const txt = (x: number, y: number, s: string, anchor = 'middle') =>
  `<text class="tx" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Closed wobbly ring for contour lines. sx/sy stretch it. */
function ring(cx: number, cy: number, r: number, seed: number, sx = 1.5, sy = 1) {
  const pts: string[] = [];
  for (let i = 0; i <= 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const w =
      1 +
      0.09 * Math.sin(3 * t + seed) +
      0.05 * Math.sin(5 * t + seed * 2.1) +
      0.03 * Math.cos(7 * t + seed);
    pts.push(`${r1(cx + Math.cos(t) * r * w * sx)} ${r1(cy + Math.sin(t) * r * w * sy)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** Hills: one polyline sampled every 40 units. Stack 2 to 4 with different y, amp, seed. */
const ridge = (y: number, amp: number, seed: number) => {
  const pts: string[] = [];
  for (let x = -20; x <= 1620; x += 40)
    pts.push(
      `${x} ${r1(y - amp * (0.6 + 0.4 * Math.sin(x / 210 + seed)) * Math.abs(Math.sin(x / 330 + seed)))}`,
    );
  return ln(`M${pts.join('L')}`);
};

/** Gentle terraces / waves. */
const terrace = (y: number, amp: number, seed: number) => {
  const pts: string[] = [];
  for (let x = -20; x <= 1620; x += 40) pts.push(`${x} ${r1(y + amp * Math.sin(x / 170 + seed))}`);
  return ln(`M${pts.join('L')}`);
};

/** Leaf from the origin along +x, rotated by a degrees and moved to x,y. l is length. */
const leaf = (x: number, y: number, a: number, l: number) =>
  ln(
    `M0 0Q${l * 0.45} ${-l * 0.32} ${l} 0Q${l * 0.45} ${l * 0.32} 0 0M0 0L${l * 0.8} 0`,
    `transform="translate(${x} ${y}) rotate(${a})"`,
  );

/** Spiral, a rose seen from above. */
function rose(cx: number, cy: number, size: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = (i / 160) * Math.PI * 7;
    const r = size * (0.06 + t / (Math.PI * 7)) * (1 + 0.08 * Math.sin(5 * t));
    pts.push(`${r1(cx + Math.cos(t) * r)} ${r1(cy + Math.sin(t) * r)}`);
  }
  return ln(`M${pts.join('L')}`);
}

/** QR finder square. */
const finder = (x: number, y: number, s: number) =>
  ln(`M${x} ${y}h${s}v${s}h${-s}Z`) +
  ln(`M${x + s * 0.17} ${y + s * 0.17}h${s * 0.66}v${s * 0.66}h${-s * 0.66}Z`) +
  ln(`M${x + s * 0.34} ${y + s * 0.34}h${s * 0.32}v${s * 0.32}h${-s * 0.32}Z`);

/** Map pin, tip at x,y. */
const pin = (x: number, y: number) =>
  ln(`M${x} ${y}c-14-22-30-36-30-56a30 30 0 0 1 60 0c0 20-16 34-30 56Z`) + circ(x, y - 58, 10);
```

## Hatch fill clipped to a shape (the `fl` layer)

```ts
`<defs>
  <pattern id="hatch-ID" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V16"/></pattern>
  <clipPath id="clip-ID"><path d="${shapePath}Z"/></clipPath>
</defs>
<rect class="fl" x="0" y="0" width="1600" height="900" fill="url(#hatch-ID)" clip-path="url(#clip-ID)"/>`;
```

Use a unique `ID` per drawing, since all plates share one HTML document.

## Registering

```ts
export const PLATES: Record<string, Plate> = {
  'project-id': { hue: '#2e7d8f', kind: 'phones' /* or 'browser' */, shots: [...], art: artProject() },
};
```

## Pattern recipes

- **Chart axis:** baseline `H`, ticks every hour (`v8`, longer `v16` every 6th), mono labels under it, 3 to 4 faint `gr` lines above.
- **Contours:** 5 to 6 `ring()` with radii like 70, 125, 180, 240, 305 and seed `base + i*0.35`. Two clusters in opposite corners.
- **Target / live marker:** three concentric `circ` (16, 46, 84) plus a `+` cross.
- **Document sheet:** outline with a clipped corner, 6 to 9 text lines of alternating length, one `bold` accent line.
