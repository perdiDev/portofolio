import { BLOG } from '../config';
import type { Post } from './posts';

const TAG_WEIGHT = 2;
const CATEGORY_WEIGHT = 1;

/** Score = 2 per shared tag + 1 for the same category. */
export function relatedScore(post: Post, candidate: Post): number {
  const tags = new Set(post.data.tags);
  const shared = candidate.data.tags.filter((tag) => tags.has(tag)).length;
  const sameCategory = post.data.category === candidate.data.category ? 1 : 0;
  return shared * TAG_WEIGHT + sameCategory * CATEGORY_WEIGHT;
}

/**
 * Related posts for `post`: highest score first, ties broken by newest.
 * Excludes `post` itself. Falls back to the latest posts when nothing scores,
 * and tops up with the latest posts if fewer than `count` score.
 *
 * `allPosts` must already be sorted newest first.
 */
export function getRelatedPosts(post: Post, allPosts: Post[], count = BLOG.relatedCount): Post[] {
  const others = allPosts.filter((candidate) => candidate.id !== post.id);
  const scored = others
    .map((candidate) => ({ candidate, score: relatedScore(post, candidate) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.data.pubDate.valueOf() - a.candidate.data.pubDate.valueOf(),
    )
    .map(({ candidate }) => candidate);

  const picked = scored.slice(0, count);
  if (picked.length < count) {
    const chosen = new Set(picked.map((p) => p.id));
    for (const candidate of others) {
      if (picked.length >= count) break;
      if (!chosen.has(candidate.id)) picked.push(candidate);
    }
  }
  return picked;
}
