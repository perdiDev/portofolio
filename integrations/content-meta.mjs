// Reads the frontmatter of published posts/projects at config time.
// Used by astro.config.mjs to give the sitemap accurate `lastmod` values
// and to leave noindex pages (thin tag pages) out of it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { slugify } from '../src/utils/slug.ts';
import { BLOG, CATEGORIES } from '../src/config.ts';

const root = new URL('../src/content/', import.meta.url).pathname;

function readCollection(name) {
  const dir = join(root, name);
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
  return files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf8');
    const { frontmatter } = parseFrontmatter(raw, { frontmatter: 'parse' });
    return { slug: file.replace(/\.md$/, ''), data: frontmatter };
  });
}

const toDate = (value) => (value ? new Date(value) : undefined);
const newest = (dates) => dates.filter(Boolean).sort((a, b) => b.getTime() - a.getTime())[0];

/**
 * @param {{ includeDrafts?: boolean }} options
 * @returns {{ lastmod: Map<string, Date>, noindex: Set<string> }} keyed by pathname
 */
export function collectContentMeta({ includeDrafts = false } = {}) {
  const posts = readCollection('blog')
    .filter((p) => includeDrafts || !p.data.draft)
    .map((p) => ({
      slug: p.slug,
      category: String(p.data.category),
      tags: (p.data.tags ?? []).map(String),
      date: toDate(p.data.updatedDate) ?? toDate(p.data.pubDate),
    }));
  const projects = readCollection('projects').map((p) => ({
    slug: p.slug,
    date: toDate(p.data.date),
  }));

  /** @type {Map<string, Date>} */
  const lastmod = new Map();
  /** @type {Set<string>} */
  const noindex = new Set();
  const set = (path, date) => date && lastmod.set(path, date);

  const latestPost = newest(posts.map((p) => p.date));
  set('/', newest([latestPost, ...projects.map((p) => p.date)]));
  set('/blog/', latestPost);
  set('/archive/', latestPost);
  set('/categories/', latestPost);
  set('/tags/', latestPost);
  set('/projects/', newest(projects.map((p) => p.date)));

  for (const post of posts) set(`/blog/${post.slug}/`, post.date);
  for (const project of projects) set(`/projects/${project.slug}/`, project.date);

  for (const category of CATEGORIES) {
    const inCategory = posts.filter((p) => p.category === category);
    set(`/categories/${slugify(category)}/`, newest(inCategory.map((p) => p.date)));
  }

  const byTag = new Map();
  for (const post of posts) {
    for (const tag of post.tags) {
      const key = slugify(tag);
      byTag.set(key, [...(byTag.get(key) ?? []), post]);
    }
  }
  for (const [tag, tagged] of byTag) {
    const path = `/tags/${tag}/`;
    set(path, newest(tagged.map((p) => p.date)));
    if (tagged.length < BLOG.minPostsForIndexableTag) noindex.add(path);
  }

  return { lastmod, noindex };
}
