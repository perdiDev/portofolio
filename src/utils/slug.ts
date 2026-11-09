/**
 * One slugification helper for categories and tags, so URLs, links, and
 * sitemap rules can never drift apart.
 *
 * "Tips & Tricks" -> "tips-and-tricks", "c++" -> "c-plus-plus", "Node.js" -> "node-js"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
