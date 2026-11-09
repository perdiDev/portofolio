import { BLOG } from '../config';

export interface Page<T> {
  items: T[];
  /** 1-based current page number. */
  page: number;
  totalPages: number;
  totalItems: number;
  /** URL of the previous page (page 1 maps to the base path), if any. */
  prevUrl?: string;
  nextUrl?: string;
}

/** Page 1 lives at `base`, page N (N >= 2) at `base + "page/N/"`. Both end with a slash. */
export const pageUrl = (base: string, page: number): string =>
  page <= 1 ? base : `${base}page/${page}/`;

export function totalPagesFor(totalItems: number, perPage: number = BLOG.postsPerPage): number {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

export function paginate<T>(
  all: T[],
  page: number,
  base: string,
  perPage: number = BLOG.postsPerPage,
): Page<T> {
  const totalPages = totalPagesFor(all.length, perPage);
  const start = (page - 1) * perPage;
  return {
    items: all.slice(start, start + perPage),
    page,
    totalPages,
    totalItems: all.length,
    prevUrl: page > 1 ? pageUrl(base, page - 1) : undefined,
    nextUrl: page < totalPages ? pageUrl(base, page + 1) : undefined,
  };
}

/** `[2, 3, …]` — the page numbers that need their own `/page/N/` route. */
export function extraPageNumbers(
  totalItems: number,
  perPage: number = BLOG.postsPerPage,
): number[] {
  const total = totalPagesFor(totalItems, perPage);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => i + 2);
}
