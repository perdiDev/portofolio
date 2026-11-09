import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '../../config';
import { renderOgImage, type OgOptions } from '../../utils/og';
import { getPosts, getProjects } from '../../utils/posts';

/**
 * /og/default.png, /og/blog/<slug>.png, /og/projects/<slug>.png — generated at build time.
 */
export const getStaticPaths = (async () => {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const entries: { params: { slug: string }; props: OgOptions }[] = [
    {
      params: { slug: 'default' },
      props: { title: SITE.homeTitle, eyebrow: 'Developer blog' },
    },
    ...posts.map((post) => ({
      params: { slug: `blog/${post.id}` },
      props: { title: post.data.title, eyebrow: post.data.category },
    })),
    ...projects.map((project) => ({
      params: { slug: `projects/${project.id}` },
      props: { title: project.data.title, eyebrow: `Project · ${project.data.status}` },
    })),
  ];
  return entries;
}) satisfies GetStaticPaths;

export const GET: APIRoute<OgOptions> = async ({ props }) => {
  const png = await renderOgImage(props);
  return new Response(png.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
