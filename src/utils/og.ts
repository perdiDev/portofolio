import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { AUTHOR, OG } from '../config';

/**
 * Open Graph images, rendered at build time with satori (SVG) + resvg (PNG).
 * satori cannot read WOFF2, so it uses the static .woff files shipped by
 * @fontsource/*. These files are used for rendering only; the website itself
 * serves the variable WOFF2 fonts.
 */
const fontDir = (pkg: string) => join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files');

let fontsPromise: Promise<
  { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: 'normal' }[]
>;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(fontDir('lora'), 'lora-latin-700-normal.woff')),
    readFile(join(fontDir('inter'), 'inter-latin-500-normal.woff')),
    readFile(join(fontDir('inter'), 'inter-latin-600-normal.woff')),
  ]).then(([lora, inter500, inter600]) => [
    { name: 'Lora', data: lora, weight: 700 as const, style: 'normal' as const },
    { name: 'Inter', data: inter500, weight: 500 as const, style: 'normal' as const },
    { name: 'Inter', data: inter600, weight: 600 as const, style: 'normal' as const },
  ]);
  return fontsPromise;
}

type Child = VNode | string | undefined | false;
interface VNode {
  type: string;
  props: {
    style?: Record<string, string | number>;
    children?: Child | Child[];
    [key: string]: unknown;
  };
}

const h = (type: string, style: Record<string, string | number>, ...children: Child[]): VNode => ({
  type,
  props: { style, children: children.filter(Boolean) as Child[] },
});

// OG images always use the light palette of the site (see tokens.css).
const COLORS = {
  bg: '#f4f1ea',
  border: '#d9d4c8',
  heading: '#1d1b18',
  muted: '#6f6b63',
  accent: '#8a4a30',
};

/** Abstract backdrop: off-centre concentric contours drawn as hairlines, like the project plates. */
function backdrop(): string {
  const rings = Array.from({ length: 10 }, (_, i) => {
    const r = 60 + i * 40;
    const stroke = i % 4 === 2 ? COLORS.accent : COLORS.border;
    const opacity = i % 4 === 2 ? 0.55 : 1;
    return `<ellipse cx="${OG.width - 80}" cy="${OG.height + 70}" rx="${r * 1.25}" ry="${r}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="2"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}" viewBox="0 0 ${OG.width} ${OG.height}">${rings}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

let monogramPromise: Promise<string>;

/**
 * The outlined italic "P" from the favicon, as an image for the author badge.
 * The glyph path is read from public/favicon.svg so both logos stay identical.
 */
function monogram(): Promise<string> {
  monogramPromise ??= readFile(join(process.cwd(), 'public', 'favicon.svg'), 'utf8').then((src) => {
    const d = src.match(/<path transform="[^"]*" d="([^"]+)"/)?.[1];
    if (!d) throw new Error('og: glyph path not found in public/favicon.svg');
    // Glyph units (y up): x 35 to 634, y 0 to 703. Flip and pad for the stroke.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 -750 700 800"><path transform="scale(1 -1)" d="${d}" fill="none" stroke="${COLORS.accent}" stroke-width="34" stroke-linejoin="round"/></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  });
  return monogramPromise;
}

export type OgOptions = {
  title: string;
  /** Small uppercase label above the title: the category, "Project", … */
  eyebrow?: string;
};

function titleSize(title: string): number {
  if (title.length > 80) return 52;
  if (title.length > 55) return 60;
  if (title.length > 35) return 70;
  return 82;
}

function layout({ title, eyebrow }: OgOptions, mark: string): VNode {
  return h(
    'div',
    {
      display: 'flex',
      position: 'relative',
      width: OG.width,
      height: OG.height,
      backgroundColor: COLORS.bg,
    },
    {
      type: 'img',
      props: {
        src: backdrop(),
        width: OG.width,
        height: OG.height,
        style: { position: 'absolute', top: 0, left: 0 },
      },
    },
    h(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        padding: '72px 80px',
      },
      h(
        'div',
        { display: 'flex', flexDirection: 'column', maxWidth: 900 },
        h('div', { width: 64, height: 3, backgroundColor: COLORS.accent }),
        eyebrow &&
          h(
            'div',
            {
              marginTop: 32,
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: COLORS.accent,
            },
            eyebrow,
          ),
        h(
          'div',
          {
            marginTop: eyebrow ? 24 : 40,
            fontFamily: 'Lora',
            fontWeight: 700,
            fontSize: titleSize(title),
            lineHeight: 1.15,
            letterSpacing: -1,
            color: COLORS.heading,
          },
          title,
        ),
      ),
      h(
        'div',
        { display: 'flex', alignItems: 'center' },
        h(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: 26,
            border: `2px solid ${COLORS.accent}`,
          },
          {
            type: 'img',
            props: { src: mark, width: 28, height: 32 },
          },
        ),
        h(
          'div',
          {
            marginLeft: 18,
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 28,
            color: COLORS.heading,
          },
          AUTHOR.name,
        ),
      ),
    ),
  );
}

export async function renderOgImage(options: OgOptions): Promise<Uint8Array> {
  const [fonts, mark] = await Promise.all([loadFonts(), monogram()]);
  const svg = await satori(layout(options, mark) as unknown as Parameters<typeof satori>[0], {
    width: OG.width,
    height: OG.height,
    fonts,
  });
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG.width },
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng();
  return new Uint8Array(png);
}
