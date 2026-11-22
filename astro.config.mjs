// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { collectContentMeta } from './integrations/content-meta.mjs';

// `.env` files are not loaded inside the config file, so load it manually.
try {
  process.loadEnvFile();
} catch {
  // No .env file: fine, every variable is optional.
}

/**
 * Site URL: SITE_URL -> Vercel production URL -> local dev server.
 * Set SITE_URL once a custom domain is connected (see README).
 */
function resolveSite() {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;
  return 'http://localhost:4321';
}

const { lastmod, noindex } = collectContentMeta();

// Palette shared with src/styles/foundation/tokens.css (kept literal: Expressive Code needs real values).
const ui = {
  light: {
    bg: '#f4f1ea',
    surface: '#ece8df',
    border: '#d9d4c8',
    text: '#1d1b18',
    muted: '#6f6b63',
    accent: '#8a4a30',
  },
  dark: {
    bg: '#141311',
    surface: '#1c1a17',
    border: '#2d2a25',
    text: '#ece7dd',
    muted: '#9a958a',
    accent: '#dba685',
  },
};
/** Resolves a style override to the light/dark value matching the active Expressive Code theme.
 * @param {keyof typeof ui.light} key
 */
const pick =
  (key) =>
  (/** @type {{ theme: { type: string } }} */ { theme }) =>
    theme.type === 'dark' ? ui.dark[key] : ui.light[key];

// https://astro.build/config
export default defineConfig({
  site: resolveSite(),
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'always',
  // One small stylesheet: inlining it removes the render-blocking request.
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  env: {
    schema: {
      PUBLIC_UMAMI_WEBSITE_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_UMAMI_SRC: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_BUTTONDOWN_USERNAME: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_GSC_VERIFICATION: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_BING_VERIFICATION: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      UPSTASH_REDIS_REST_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      // Names used by the Upstash integration in the Vercel marketplace.
      KV_REST_API_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      KV_REST_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  // Self-hosted variable fonts from the locally installed Fontsource packages:
  // no network at build time, no CDN requests at runtime. Astro adds the preload
  // links; metric-adjusted fallbacks live in src/styles/fonts.css.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Lora',
      cssVariable: '--font-lora',
      // Fallback metrics are defined by hand in src/styles/fonts.css (several local() names per OS).
      optimizedFallbacks: false,
      fallbacks: ['Lora Fallback', 'Georgia', 'serif'],
      options: {
        variants: [
          {
            weight: '400 700',
            style: 'normal',
            src: ['./node_modules/@fontsource-variable/lora/files/lora-latin-wght-normal.woff2'],
          },
          {
            weight: '400 700',
            style: 'italic',
            src: ['./node_modules/@fontsource-variable/lora/files/lora-latin-wght-italic.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      optimizedFallbacks: false,
      fallbacks: ['Inter Fallback', 'Arial', 'sans-serif'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'],
          },
        ],
      },
    },
    {
      // Handwriting, used only for the rail's diary link.
      provider: fontProviders.local(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      optimizedFallbacks: false,
      fallbacks: ['cursive'],
      options: {
        variants: [
          {
            weight: '400 700',
            style: 'normal',
            src: [
              './node_modules/@fontsource-variable/caveat/files/caveat-latin-wght-normal.woff2',
            ],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      optimizedFallbacks: false,
      fallbacks: ['JetBrains Mono Fallback', 'Courier New', 'monospace'],
      options: {
        variants: [
          {
            weight: '100 800',
            style: 'normal',
            src: [
              './node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
            ],
          },
        ],
      },
    },
  ],

  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            // "wrap" keeps each link's accessible name equal to the heading text
            // and leaves the heading text untouched for the generated TOC.
            behavior: 'wrap',
            properties: { className: ['heading-link'] },
          },
        ],
      ],
    }),
  },

  integrations: [
    astroExpressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      useThemedScrollbars: false,
      // Bind each bundled theme to our own [data-theme] attribute instead of EC's default
      // `[data-theme='<theme-name>']`, so it follows the same toggle as the rest of the site.
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      styleOverrides: {
        borderRadius: '0',
        borderColor: pick('border'),
        codeBackground: ({ theme }) => (theme.type === 'dark' ? ui.dark.surface : ui.light.surface),
        codeFontFamily: 'var(--font-jetbrains-mono)',
        codeFontSize: '0.875rem',
        codeLineHeight: '1.65',
        codePaddingInline: '1.1rem',
        uiFontFamily: 'var(--font-inter)',
        uiFontSize: '0.8125rem',
        frames: {
          shadowColor: 'transparent',
          frameBoxShadowCssValue: 'none',
          editorBackground: ({ theme }) =>
            theme.type === 'dark' ? ui.dark.surface : ui.light.surface,
          editorTabBarBackground: pick('surface'),
          editorTabBarBorderBottomColor: pick('border'),
          editorActiveTabBackground: ({ theme }) =>
            theme.type === 'dark' ? ui.dark.surface : ui.light.surface,
          editorActiveTabForeground: pick('text'),
          editorActiveTabIndicatorTopColor: pick('accent'),
          editorActiveTabIndicatorBottomColor: 'transparent',
          terminalBackground: ({ theme }) =>
            theme.type === 'dark' ? ui.dark.surface : ui.light.surface,
          terminalTitlebarBackground: pick('surface'),
          terminalTitlebarBorderBottomColor: pick('border'),
          terminalTitlebarForeground: pick('muted'),
          terminalTitlebarDotsForeground: pick('muted'),
          terminalTitlebarDotsOpacity: '0.5',
          inlineButtonForeground: pick('muted'),
          tooltipSuccessBackground: ({ theme }) => (theme.type === 'dark' ? '#3a2a20' : '#f0dfd2'),
          tooltipSuccessForeground: ({ theme }) => (theme.type === 'dark' ? '#f0dfd2' : '#5a2f1d'),
        },
        textMarkers: {
          lineDiffIndicatorMarginLeft: '0.4rem',
        },
      },
    }),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname === '/search/' || pathname === '/404/' || pathname.startsWith('/api/')) {
          return false;
        }
        return ![...noindex].some(
          (path) => pathname === path || pathname.startsWith(`${path}page/`),
        );
      },
      serialize: (item) => {
        const date = lastmod.get(new URL(item.url).pathname);
        if (date) item.lastmod = date.toISOString();
        return item;
      },
    }),
  ],
});
