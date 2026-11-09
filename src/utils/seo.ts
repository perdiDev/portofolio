import { SITE } from '../config';
import { clamp } from './format';

export const MAX_TITLE = 60;
export const MAX_DESCRIPTION = 160;

/**
 * `Page | Site`, kept within 60 characters.
 * If the suffix does not fit, the bare page title is used; if even that is too
 * long it is cut on a word boundary with an ellipsis.
 */
export function buildTitle(pageTitle: string): string {
  const full = `${pageTitle} | ${SITE.name}`;
  if (full.length <= MAX_TITLE) return full;
  return clamp(pageTitle, MAX_TITLE);
}

export const buildDescription = (description: string): string =>
  clamp(description, MAX_DESCRIPTION);

/** Absolute URL for a site path. `site` is `Astro.site`. */
export function absoluteUrl(path: string, site: URL | string): string {
  return new URL(path, site).href;
}

/** Title suffix for paginated listings: "Blog — Page 2". */
export const pageLabel = (label: string, page: number): string =>
  page > 1 ? `${label} — Page ${page}` : label;

/** Path of the generated Open Graph image (see src/pages/og/[...slug].png.ts). */
export const ogImagePath = (kind: 'blog' | 'projects', id: string): string =>
  `/og/${kind}/${id}.png`;
