import { BLOG, CATEGORIES, type Category } from '../config';
import { slugify } from './slug';
import type { Post } from './posts';

export interface Term {
  /** Display name, e.g. "Tips & Tricks" or "typescript". */
  name: string;
  /** URL segment produced by `slugify`. */
  slug: string;
  count: number;
  posts: Post[];
}

export const categoryUrl = (category: string) => `/categories/${slugify(category)}/`;
export const tagUrl = (tag: string) => `/tags/${slugify(tag)}/`;

/** Categories that have at least one visible post, in the order declared in `config.ts`. */
export function getCategories(posts: Post[]): Term[] {
  return CATEGORIES.map((name: Category) => {
    const inCategory = posts.filter((post) => post.data.category === name);
    return { name, slug: slugify(name), count: inCategory.length, posts: inCategory };
  }).filter((term) => term.count > 0);
}

/** Tags sorted by popularity, then alphabetically. Tags are grouped by slug. */
export function getTags(posts: Post[]): Term[] {
  const bySlug = new Map<string, Term>();
  for (const post of posts) {
    for (const tag of new Set(post.data.tags)) {
      const slug = slugify(tag);
      const term = bySlug.get(slug) ?? { name: tag, slug, count: 0, posts: [] };
      term.posts.push(post);
      term.count += 1;
      bySlug.set(slug, term);
    }
  }
  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Thin tag pages (fewer than 2 posts) are `noindex,follow`. */
export const isThinTerm = (term: Pick<Term, 'count'>) => term.count < BLOG.minPostsForIndexableTag;
