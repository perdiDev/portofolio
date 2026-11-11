import { getCollection, type CollectionEntry } from 'astro:content';
import { getReadingTime, type ReadingTime } from './readingTime';

export type Post = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;

/** Drafts are visible in `astro dev` only. In production they exist nowhere. */
const isVisible = (draft: boolean) => import.meta.env.DEV || !draft;

/** All visible posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => isVisible(data.draft));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Drafts are visible in `astro dev` only. In production they exist nowhere. */
const isShow = (show: boolean) => import.meta.env.DEV || show;

/** Projects ordered by `order`, then date (newest first). */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => isShow(data.show));
  return projects.sort(
    (a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export const postUrl = (post: Pick<Post, 'id'>) => `/blog/${post.id}/`;
export const projectUrl = (project: Pick<Project, 'id'>) => `/projects/${project.id}/`;

/** Date used for sorting, sitemap lastmod, and "Updated" labels. */
export const lastModified = (post: Post): Date => post.data.updatedDate ?? post.data.pubDate;

export function readingTimeOf(post: Post): ReadingTime {
  return getReadingTime(post.body);
}

/** Posts that belong to a project: explicit `project` reference. */
export function postsForProject(posts: Post[], project: Pick<Project, 'id'>): Post[] {
  return posts.filter((post) => post.data.project?.id === project.id);
}

export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear();
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, posts: items }));
}
