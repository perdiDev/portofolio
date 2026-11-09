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

// OG images always use the light palette, regardless of the site's active theme.
const COLORS = {
  bg: '#fafaf9',
  border: '#e4e4e7',
  heading: '#18181b',
  muted: '#52525b',
  accent: '#047857',
};

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

function layout({ title, eyebrow }: OgOptions): VNode {
  return h(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: OG.width,
      height: OG.height,
      boxSizing: 'border-box',
      backgroundColor: COLORS.bg,
      padding: 40,
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
        border: `2px solid ${COLORS.border}`,
        borderRadius: 24,
        padding: '56px 64px',
      },
      h(
        'div',
        { display: 'flex', flexDirection: 'column' },
        h('div', { width: 72, height: 5, backgroundColor: COLORS.accent, borderRadius: 3 }),
        eyebrow &&
          h(
            'div',
            {
              marginTop: 28,
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: 3,
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
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
        h(
          'div',
          { display: 'flex', alignItems: 'center' },
          h(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 28,
              border: `2px solid ${COLORS.border}`,
              fontFamily: 'Lora',
              fontWeight: 700,
              fontSize: 30,
              color: COLORS.accent,
            },
            AUTHOR.name.charAt(0),
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
        h(
          'div',
          { fontFamily: 'Inter', fontWeight: 500, fontSize: 26, color: COLORS.muted },
          `Developer blog · ${AUTHOR.jobTitle}`,
        ),
      ),
    ),
  );
}

export async function renderOgImage(options: OgOptions): Promise<Uint8Array> {
  const fonts = await loadFonts();
  const svg = await satori(layout(options) as unknown as Parameters<typeof satori>[0], {
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
