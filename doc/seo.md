# SEO and search engines

Generated automatically: `<title>`, description, canonical, Open Graph and Twitter tags, JSON-LD, `sitemap-index.xml`, `robots.txt`, `rss.xml`, and a 1200x630 OG image per post at `/og/blog/<slug>.png`.

Everything derives from `SITE_URL`. Set it first: see [Deployment](deployment.md).

## Share images (Open Graph)

The image shown when a link is shared (WhatsApp, Telegram, X, LinkedIn, Google Discover) is generated at build time. Nothing to design by hand and nothing to upload.

| URL                       | Made for                   | Label above the title |
| ------------------------- | -------------------------- | --------------------- |
| `/og/default.png`         | home page and other routes | "Portfolio and diary" |
| `/og/blog/<slug>.png`     | each diary entry           | the entry's category  |
| `/og/projects/<slug>.png` | each project               | "Project · <status>"  |

### How it works

1. `src/pages/og/[...slug].png.ts` lists every post and project with `getStaticPaths` and passes `title` and `eyebrow` (the label) to the renderer. A new post or project is picked up on the next build, with no extra step.
2. `src/utils/og.ts` draws the image with `satori` (layout to SVG) and `@resvg/resvg-js` (SVG to PNG). The result is 1200x630, the size in `OG` in `src/config/site.ts`.
3. The background is a set of thin concentric lines built as an SVG in `backdrop()`, then used as an image behind the text. The title shrinks in steps for long titles (`titleSize`).
4. `SEO.astro` writes the `og:image` and `twitter:image` tags. `ogImagePath()` in `src/utils/seo.ts` builds the path.

The colours in `COLORS` match the light palette in `src/styles/foundation/tokens.css`. satori cannot read colour variables or WOFF2, so the values are copied by hand and the fonts are the static `.woff` files from `@fontsource`. If you change the site palette, update `COLORS` in `og.ts` too.

### Change the look

Edit `src/utils/og.ts`: `COLORS` for colour, `backdrop()` for the lines, `layout()` for the text and the author mark. Run `pnpm build` and open `dist/client/og/default.png` to check it.

### Refresh a shared link

Chat apps and social sites cache the old image. After a deploy, use the Facebook Sharing Debugger or LinkedIn Post Inspector, or share the link with `?v=2` appended.

## Verify Google Search Console

1. Add a property at [search.google.com/search-console](https://search.google.com/search-console). Choose **URL prefix** and enter your site URL.
2. Choose **HTML tag** verification. You get a tag like `<meta name="google-site-verification" content="TOKEN" />`.
3. Copy only `TOKEN` (the `content` value):

   ```bash
   PUBLIC_GSC_VERIFICATION=TOKEN
   ```

4. Redeploy, then click **Verify** in Search Console.
5. Submit `https://<your-domain>/sitemap-index.xml` under **Sitemaps**.

## Verify Bing Webmaster Tools

1. Add the site at [bing.com/webmasters](https://www.bing.com/webmasters). You can import it from Search Console instead.
2. For the **meta tag** method, copy the `content` value of `msvalidate.01`:

   ```bash
   PUBLIC_BING_VERIFICATION=TOKEN
   ```

3. Redeploy and verify. Submit the same sitemap URL.

## What is excluded from indexing

- Drafts: not built in production, not in RSS or the sitemap.
- Tag pages with fewer than 2 posts: `noindex, follow`, not in the sitemap (`BLOG.minPostsForIndexableTag` in `site.ts`).
- The sitemap `lastmod` is `updatedDate ?? pubDate`.

## Check a build

```bash
pnpm build
pnpm audit:build   # titles, descriptions, headings, canonicals, JSON-LD, images, links
pnpm preview       # http://localhost:4321
```

Then inspect:

- `/sitemap-index.xml`, `/robots.txt`, `/rss.xml`
- `/og/blog/<slug>.png` for a post
- Page source: one `<h1>`, a canonical that matches the live domain

Useful validators: Google Rich Results Test (JSON-LD), and the Open Graph debuggers of Facebook and LinkedIn.

## Title and description rules

- `<title>` is `Page | Perdi`, kept within 60 characters. If the suffix does not fit, the page title is used alone.
- Descriptions are clamped to 160 characters. In posts the frontmatter enforces 50 to 160.
- Each post needs a unique title and description.

## Cross-posted articles

If a post was published elsewhere first, set `canonicalUrl` in its frontmatter to the original URL.
