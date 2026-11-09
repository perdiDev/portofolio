import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { AUTHOR, SITE } from '../config';
import { postUrl, getPosts } from '../utils/posts';

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

// Images referenced from post bodies live in src/assets; map them to their built URLs.
const sourceImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{png,jpg,jpeg,webp,avif,gif}',
);

async function resolveImages(html: string, site: URL): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const sources = new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]));
  for (const src of sources) {
    const match = Object.keys(sourceImages).find((key) =>
      src.endsWith(key.replace('/src/assets/', '')),
    );
    if (!match) continue;
    const image = await getImage({ src: sourceImages[match](), width: 960, format: 'webp' });
    map.set(src, new URL(image.src, site).href);
  }
  return map;
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const posts = await getPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const html = markdown.render(post.body ?? '');
      const images = await resolveImages(html, origin);
      const content = sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          'img',
          'h1',
          'h2',
          'h3',
          'h4',
          'figure',
          'figcaption',
          'del',
        ]),
        allowedAttributes: {
          a: ['href', 'title'],
          img: ['src', 'alt', 'title', 'width', 'height'],
          code: ['class'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedClasses: { code: [/^language-[\w-]+$/] },
        transformTags: {
          a: (tag, attribs) => {
            const href = attribs.href ?? '';
            return {
              tagName: tag,
              attribs: {
                ...attribs,
                href: /^(https?:|mailto:)/.test(href) ? href : new URL(href, origin).href,
              },
            };
          },
          img: (tag, attribs) => {
            const src = attribs.src ?? '';
            const resolved = images.get(src) ?? (/^https?:/.test(src) ? src : '');
            return { tagName: tag, attribs: { ...attribs, src: resolved } };
          },
        },
        exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
      });
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: postUrl(post),
        content,
        categories: [post.data.category, ...post.data.tags],
        author: `${AUTHOR.email} (${AUTHOR.name})`,
      };
    }),
  );

  return rss({
    title: `${SITE.name} — Blog`,
    description: SITE.description,
    site: origin,
    items,
    trailingSlash: true,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${SITE.language}</language>`,
      `<atom:link href="${new URL('/rss.xml', origin).href}" rel="self" type="application/rss+xml" />`,
      `<lastBuildDate>${(posts[0]?.data.updatedDate ?? posts[0]?.data.pubDate ?? new Date()).toUTCString()}</lastBuildDate>`,
    ].join(''),
  });
};
