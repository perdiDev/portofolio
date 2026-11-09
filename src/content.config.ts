import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './config';

/** Lowercase, URL-friendly-ish tags: "typescript", "node.js", "c++". */
const tag = z
  .string()
  .regex(/^[a-z0-9][a-z0-9 .+#-]*$/, 'Tags must be lowercase (letters, numbers, ". + # -").');

/** Filename (without ".md") is the slug, exactly as written. */
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog', generateId }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(10).max(70),
        description: z.string().min(50).max(160),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.enum(CATEGORIES),
        tags: z.array(tag).min(1).max(5),
        cover: image().optional(),
        coverAlt: z.string().min(5).optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        project: reference('projects').optional(),
        canonicalUrl: z.url().optional(),
        ogImage: image().optional(),
      })
      .refine((post) => !post.cover || Boolean(post.coverAlt), {
        message: '`coverAlt` is required when `cover` is set.',
        path: ['coverAlt'],
      })
      .refine((post) => !post.updatedDate || post.updatedDate >= post.pubDate, {
        message: '`updatedDate` cannot be earlier than `pubDate`.',
        path: ['updatedDate'],
      })
      .refine((post) => new Set(post.tags).size === post.tags.length, {
        message: 'Tags must be unique.',
        path: ['tags'],
      }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects', generateId }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(3).max(60),
      summary: z
        .string()
        .max(160)
        .refine((text) => !/[\r\n]/.test(text), { message: 'The summary must be a single line.' }),
      date: z.coerce.date(),
      order: z.number().int(),
      featured: z.boolean().default(false),
      status: z.enum(['Live', 'In progress', 'Archived', 'Open source']),
      role: z.string().min(2),
      duration: z.string().min(2),
      techStack: z.array(z.string().min(1)).min(1),
      liveUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      thumbnail: z.object({ image: image(), alt: z.string().min(5) }),
      screenshots: z
        .array(
          z.object({
            image: image(),
            alt: z.string().min(5),
            caption: z.string().optional(),
          }),
        )
        .min(1),
      youtubeId: z
        .string()
        .regex(/^[\w-]{11}$/, 'Expected an 11 character YouTube video ID.')
        .optional(),
      challenges: z.array(z.object({ challenge: z.string(), solution: z.string() })).min(1),
      learned: z.array(z.string().min(1)).min(1),
      outcome: z.string().optional(),
      relatedPosts: z.array(reference('blog')).optional(),
    }),
});

export const collections = { blog, projects };
