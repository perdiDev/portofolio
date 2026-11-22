# SEO and search engines

Generated automatically: `<title>`, description, canonical, Open Graph and Twitter tags, JSON-LD, `sitemap-index.xml`, `robots.txt`, `rss.xml`, and a 1200x630 OG image per post at `/og/blog/<slug>.png`.

Everything derives from `SITE_URL`. Set it first: see [Deployment](deployment.md).

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
