# Perdi — developer blog & portfolio

A minimalist, dark-only, SEO-first personal site built with **Astro 7**. The blog is the main feature; a small project showcase sits next to it. Pure Astro components, zero JavaScript by default, statically generated, deployed on Vercel.

- English, dark only, single centred column, Lora / Inter / JetBrains Mono (self-hosted).
- Every page is fully readable and crawlable **with JavaScript disabled**.
- JavaScript is limited to small progressive enhancements (≈ 6 KB brotli on every page except `/search/`).
- Tailwind CSS v4, typed content collections (Zod), Expressive Code, Pagefind search, generated Open Graph images, RSS, sitemap, JSON-LD.

## Contents

1. [Quick start](#quick-start)
2. [Scripts](#scripts)
3. [Project structure](#project-structure)
4. [Configuration (`src/config.ts`)](#configuration-srcconfigts)
5. [Writing and publishing a post](#writing-and-publishing-a-post)
6. [Blog frontmatter reference](#blog-frontmatter-reference)
7. [Adding a project](#adding-a-project)
8. [Project frontmatter reference](#project-frontmatter-reference)
9. [Environment variables](#environment-variables)
10. [Search](#search)
11. [Deploying to Vercel](#deploying-to-vercel)
12. [Custom domain and `SITE_URL`](#custom-domain-and-site_url)
13. [Submitting the sitemap](#submitting-the-sitemap)
14. [Pre-publish SEO checklist](#pre-publish-seo-checklist)
15. [Replacing or deleting the sample content](#replacing-or-deleting-the-sample-content)
16. [Quality checks and Lighthouse](#quality-checks-and-lighthouse)
17. [Assumptions and decisions](#assumptions-and-decisions)

## Quick start

Requirements: **Node 22.12 or newer** (see `.nvmrc`) and **pnpm**.

```bash
pnpm install
cp .env.example .env     # optional: every variable is optional
pnpm dev                 # http://localhost:4321
```

Production build and local preview:

```bash
pnpm build               # type-checks content, builds the site, creates the Pagefind index
pnpm preview             # serves dist/client at http://localhost:4321 (see note below)
```

> `astro preview` is **not supported by the Vercel adapter**, so `pnpm preview` runs `scripts/preview.mjs`, a small static server that mimics Vercel for this site (trailing-slash redirects, the headers from `vercel.json`, brotli/gzip, the custom 404). The view-counter API is not executed locally; it answers `{ "enabled": false }`, which is exactly what the site does when Redis is not configured.

## Scripts

| Script             | What it does                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`         | Dev server. Drafts are visible. No Pagefind index of its own (see [Search](#search)).                        |
| `pnpm build`       | Production build to `dist/` + `.vercel/output`, sitemap, Pagefind index.                                     |
| `pnpm preview`     | Serve the last build locally (`scripts/preview.mjs`).                                                        |
| `pnpm check`       | `astro check` (TypeScript + Astro diagnostics). Must report 0 errors, 0 warnings, 0 hints.                   |
| `pnpm format`      | Prettier (with the Astro and Tailwind plugins).                                                              |
| `pnpm assets`      | Regenerates placeholder icons, avatar, project screenshots, and blog images (`scripts/generate-assets.mjs`). |
| `pnpm audit:build` | Audits the built HTML: titles, descriptions, headings, canonicals, JSON-LD, images, internal links.          |

## Project structure

```
src/
  assets/              # images imported by components/content (avatar, blog + project images)
  components/          # Header, Footer, SEO, PostCard, ProjectRow, TOC, ShareButtons, Newsletter,
                       # Gallery (lightbox), YouTubeFacade, Breadcrumbs, Pagination, ViewCounter, Tag, Icon, ...
  content/
    blog/              # one Markdown file per post (filename = slug)
    projects/          # one Markdown file per project (filename = slug)
  layouts/             # BaseLayout, PostLayout, ProjectLayout, ListingLayout (paginated lists)
  pages/               # routes (index, blog/, categories/, tags/, archive, projects/, about, contact,
                       #         search, 404, rss.xml, robots.txt, og/, api/views/)
  styles/
    global.css         # Tailwind, design tokens (@theme), prose, animations, Pagefind theming
    fonts.css          # metric-adjusted fallback fonts (zero layout shift)
  utils/               # posts, taxonomy, related, paginate, readingTime, jsonld, seo, slug, format, og
  config.ts            # single source of truth for site-wide values
  content.config.ts    # collection schemas (Zod)
integrations/
  content-meta.mjs     # reads frontmatter at config time for sitemap lastmod / noindex rules
scripts/               # asset generator, local preview server, build audit
public/                # favicon, icons, web manifest
vercel.json  astro.config.mjs  .env.example  .nvmrc  README.md
```

## Configuration (`src/config.ts`)

Every site-wide value lives in `src/config.ts`: author, socials, categories, nav, posts per page, reading speed, copy for About/Newsletter, and so on. Nothing else hard-codes them.

Placeholders you should review (marked `TODO` in the file):

- `AUTHOR.bio`, `AUTHOR.intro`: sample copy.
- `X_URL`: empty, so no X profile link is shown. Fill it in to add one.
- `SITE.twitterHandle`: optional, adds `twitter:site` / `twitter:creator`.
- `SITE.cvUrl`: set to e.g. `/cv.pdf` (file in `public/`) to show a "Download CV" button on `/about/`.
- `ABOUT.writesAbout` and `ABOUT.skills`: sample lists.

To add a **category**, add it to `CATEGORIES`; it becomes valid in frontmatter and gets its own page as soon as a post uses it.

## Writing and publishing a post

1. Create `src/content/blog/my-post-slug.md`. The **filename is the slug**: `/blog/my-post-slug/`. Use lowercase kebab-case.
2. Add the frontmatter (below) and write the body in Markdown. **Never use `#`**: the page title is the `<h1>`. Start at `##`. Use `###` for sub-sections; do not skip levels.
3. Put images in `src/assets/blog/` and reference them relatively: `![Descriptive alt text](../../assets/blog/diagram.png)`. They are optimized automatically.
4. Code blocks use [Expressive Code](https://expressive-code.com/): ` ```ts title="src/user.ts" {2,4-5} `, ` ```diff `, ` ```ts ins={3} del={2} `. `bash`/`sh` blocks get a terminal frame. Every block gets a copy button.
5. Set `draft: true` while writing. Drafts are visible in `pnpm dev` only; in production they are excluded from pages, RSS, sitemap, search, and counts.
6. Run `pnpm check` (the build fails on schema violations), commit, and push. Vercel deploys.

Reading time, table of contents (shown when there are 3+ `##`/`###` headings), related posts, previous/next links, OG image, JSON-LD and sitemap entry are all generated automatically.

## Blog frontmatter reference

```yaml
---
title: 'Linux File Permissions: chmod, chown, and umask' # required, 10-70 chars (<= 52 keeps "Title | Perdi" within 60)
description: 'One sentence that sells the article.' # required, 50-160 chars (meta description)
pubDate: 2025-05-27 # required
updatedDate: 2026-02-18 # optional, must be >= pubDate; shows "Updated ..." and feeds lastmod
category: Linux # required: Programming | Linux | Software Engineering | Tips & Tricks
tags: [linux, permissions, security] # required, 1-5 unique, lowercase
cover: ../../assets/blog/cover.png # optional image, shown above the article (LCP-optimized)
coverAlt: 'What the cover shows' # required when cover is set
draft: false # default false
featured: false # default false
project: dev-notes-cli # optional: slug of a project -> "Part of project: ..." + cross-link
canonicalUrl: https://example.com/original # optional: for cross-posted articles
ogImage: ../../assets/blog/social.png # optional override of the generated Open Graph image (cropped to 1200x630)
---
```

| Field          | Type                 | Rules                                      |
| -------------- | -------------------- | ------------------------------------------ |
| `title`        | string               | 10-70 characters                           |
| `description`  | string               | 50-160 characters                          |
| `pubDate`      | date                 | required                                   |
| `updatedDate`  | date                 | optional, not earlier than `pubDate`       |
| `category`     | enum                 | values from `CATEGORIES` in `config.ts`    |
| `tags`         | string[]             | 1-5, unique, lowercase (`a-z 0-9 . + # -`) |
| `cover`        | image                | optional; requires `coverAlt`              |
| `coverAlt`     | string               | min 5 characters                           |
| `draft`        | boolean              | default `false`                            |
| `featured`     | boolean              | default `false`                            |
| `project`      | reference (projects) | optional; the slug must exist              |
| `canonicalUrl` | URL                  | optional; replaces the self-canonical      |
| `ogImage`      | image                | optional                                   |

Tags and categories get pages at `/tags/<slug>/` and `/categories/<slug>/` (paginated, 6 per page). Slugs come from one helper (`src/utils/slug.ts`): `Tips & Tricks` becomes `tips-and-tricks`. **Tag pages with fewer than 2 posts are `noindex, follow` and left out of the sitemap.**

## Adding a project

1. Create `src/content/projects/my-project.md` (filename = slug).
2. Add at least one screenshot under `src/assets/projects/my-project/` (the first one is the hero, the rest form the gallery/lightbox).
3. Fill the frontmatter (below). The Markdown **body** is the "Overview" section; use `###` for headings inside it (the page already has the `##` section headings).
4. Link related posts with `relatedPosts`, and/or set `project: my-project` in a post's frontmatter. Both directions are shown on the project page.

## Project frontmatter reference

```yaml
---
title: Budget Tracker
summary: One line, 160 characters at most.
date: 2026-05-14 # used for the year column and ordering
order: 1 # lower first; ties broken by date (newest first)
featured: true
status: Live # Live | In progress | Archived | Open source
role: Design, full-stack development
duration: 5 months
techStack: [TypeScript, Astro, PostgreSQL]
liveUrl: https://example.com # optional -> "Live demo" button
repoUrl: https://github.com/you/repo # optional -> "GitHub" button
thumbnail:
  image: ../../assets/projects/my-project/screenshot-1.png
  alt: 'Describe the image'
screenshots: # at least 1
  - image: ../../assets/projects/my-project/screenshot-1.png
    alt: 'Describe the image'
    caption: 'Optional caption'
youtubeId: jNQXAC9IVRw # optional, 11-character video ID (privacy-friendly facade)
challenges: # at least 1
  - challenge: 'What was hard?'
    solution: 'How you solved it.'
learned: # at least 1
  - 'One lesson per line.'
outcome: 'Optional: what happened afterwards.'
relatedPosts: [typescript-generics-in-practice] # optional, slugs of blog posts
---
```

## Environment variables

Copy `.env.example` to `.env` locally; set the same names in the Vercel dashboard for production. **Every variable is optional** and each feature degrades gracefully when its variables are missing.

| Variable                                | Purpose                                                                                                                 | When missing                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `SITE_URL`                              | Canonical origin (no trailing slash). Fallback: `https://$VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:4321`. | Falls back as described.                           |
| `PUBLIC_UMAMI_WEBSITE_ID`               | Umami website ID (cookieless analytics, production only, `defer`, `data-do-not-track="true"`).                          | No analytics script at all.                        |
| `PUBLIC_UMAMI_SRC`                      | Optional script URL for self-hosted Umami (default `https://cloud.umami.is/script.js`).                                 | Default URL.                                       |
| `PUBLIC_BUTTONDOWN_USERNAME`            | Buttondown username for the newsletter forms.                                                                           | Forms hidden in production; a small notice in dev. |
| `PUBLIC_GSC_VERIFICATION`               | Google Search Console verification token (the `content` value).                                                         | No meta tag.                                       |
| `PUBLIC_BING_VERIFICATION`              | Bing Webmaster Tools verification token.                                                                                | No meta tag.                                       |
| `UPSTASH_REDIS_REST_URL`                | Upstash Redis REST URL (view counter).                                                                                  | View counter not rendered.                         |
| `UPSTASH_REDIS_REST_TOKEN`              | Upstash Redis REST token.                                                                                               | View counter not rendered.                         |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Names set by the Upstash integration in the Vercel marketplace; accepted as aliases.                                    | Same.                                              |

Variables are declared in `astro.config.mjs` (`env.schema`) and read through `astro:env`, so they are typed. Secrets are server-only and read at runtime.

### The view counter

`src/pages/api/views/[slug].ts` is the **only on-demand route**. `GET` returns `{ views }`, `POST` increments. It validates the slug against the blog collection (unknown → 404), ignores obvious bots (user-agent check) and cross-origin POSTs, deduplicates per visitor and post for 24 hours with `SET NX EX` on a SHA-256 of IP + user agent, and always sends `Cache-Control: no-store`. Without Redis credentials it answers `{ "enabled": false }`.

Post pages stay fully static: the counter is only rendered in builds where the Redis variables exist, shows `— views` as a placeholder, and a tiny script fills it in and registers the visit once. Counts never appear in JSON-LD.

## Search

Search uses [Pagefind](https://pagefind.app/) through `astro-pagefind`. **The index exists only after a build.** `pnpm dev` serves the index of the _last_ build, so run `pnpm build` once before testing search locally. Only article and project content is indexed (`data-pagefind-body`), with `category` and `type` (Post / Project) filters. `/search/` is `noindex`.

## Theming

Light is the default theme; the header toggle switches to dark and persists the choice to `localStorage` (`theme` key). Colors live as CSS variables in `src/styles/global.css`'s `@theme` block (`bg`, `surface`, `line`/`border`, `fg`/`text`, `muted`, `accent`, `accent-hover`, `accent-contrast`), overridden under `[data-theme='dark']`. A blocking inline script in `BaseLayout.astro`'s `<head>` sets `data-theme` before first paint to avoid a flash. Expressive Code mirrors the same toggle via `github-light`/`github-dark`; generated OG images always use the light palette.

## Deploying to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket and **Import Project** in Vercel. The Astro framework preset is detected; the build command is `pnpm build`.
2. Node version: the project works on Node 22+ (Vercel uses its own supported runtime). `.nvmrc` pins 22 for local work.
3. **Add Upstash Redis for the view counter** (optional): Vercel dashboard → your project → **Storage** (or **Marketplace**) → **Upstash** → **Redis** → create a database and connect it to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically (the code accepts them). Alternatively create a database at [console.upstash.com](https://console.upstash.com) and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` yourself. Redeploy afterwards: the counter is included at build time only when the variables exist.
4. Add the other environment variables you want (Umami, Buttondown, verification tokens), then redeploy.
5. `vercel.json` already sets `trailingSlash: true` and the security/caching headers (`/_astro/*` immutable for one year, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`).

## Custom domain and `SITE_URL`

Until `SITE_URL` is set, the site URL is `https://$VERCEL_PROJECT_PRODUCTION_URL` (e.g. `your-project.vercel.app`). Canonicals, Open Graph URLs, JSON-LD, the sitemap, RSS and `robots.txt` all derive from it.

1. Vercel → Project → **Settings → Domains** → add your domain and follow the DNS instructions.
2. Set **`SITE_URL=https://www.example.com`** (no trailing slash) in **Settings → Environment Variables** for Production.
3. **Redeploy.** The URL is baked in at build time, so a new deployment is required.
4. Choose one canonical host (with or without `www`) and redirect the other one in the Domains settings.

## Submitting the sitemap

After the custom domain is live, submit **`https://your-domain/sitemap-index.xml`**:

- **Google Search Console**: add the property (set `PUBLIC_GSC_VERIFICATION` to the token from the "HTML tag" method and redeploy, or use DNS verification) → **Sitemaps** → enter `sitemap-index.xml` → Submit.
- **Bing Webmaster Tools**: add the site (set `PUBLIC_BING_VERIFICATION`, or import from Search Console) → **Sitemaps** → submit `https://your-domain/sitemap-index.xml`.

`robots.txt` already points to the sitemap index. The sitemap has accurate `lastmod` values (`updatedDate ?? pubDate`) and excludes `/search/`, `/404`, drafts and noindex pages.

## Pre-publish SEO checklist

For every post:

- [ ] Title is clear, unique, and ideally ≤ 52 characters (so `Title | Perdi` fits in 60).
- [ ] Description is a real summary of 50-160 characters, different from every other post.
- [ ] Slug (filename) is short, lowercase, hyphenated, and contains the main keyword.
- [ ] Body starts at `##`; headings form a sensible outline (they drive the table of contents).
- [ ] 1-5 relevant lowercase tags, reusing existing tags where it makes sense (thin tag pages are `noindex`).
- [ ] Right category.
- [ ] Every image has meaningful alt text; `cover` has `coverAlt`.
- [ ] 2+ internal links to other posts or projects; external links are relevant.
- [ ] `canonicalUrl` set if the article was published elsewhere first.
- [ ] `draft: false`, `pubDate` is correct (not in the future).
- [ ] `pnpm build` passes; open the post and check the generated OG image at `/og/blog/<slug>.png`.
- [ ] After deploying: paste the URL into Search Console → URL Inspection → Request indexing (optional but fast).

## Replacing or deleting the sample content

The repository ships with realistic sample content so every feature can be tested. **Remove or replace it before launch:**

1. **Posts**: delete everything in `src/content/blog/` (10 published posts and one `draft: true` post). Write yours.
2. **Projects**: delete `src/content/projects/*.md`. At least one project is needed for `/projects/` to make sense. Posts that point at a deleted project via `project:` must be updated or deleted first (the build tells you).
3. **Images**: delete `src/assets/blog/` and `src/assets/projects/` (the placeholder diagrams and fake screenshots). `src/assets/avatar.png` is a monogram placeholder: replace it with a photo (same file name, or edit `src/pages/about.astro`).
4. **Icons**: `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-*.png` are monogram placeholders. Replace them with your own artwork (keep the file names and sizes: 180, 192, 512, and a maskable 512). `pnpm assets` regenerates the placeholders, so do not run it after replacing them.
5. **Copy**: `AUTHOR`, `ABOUT`, and `SITE` in `src/config.ts`. Search the repository for `TODO` to find every placeholder (project URLs, the sample YouTube ID, and so on).
6. Contact details and social URLs live in `src/config.ts` as well.
7. If you delete all content, the build still works, but `/blog/` and `/projects/` will be empty.

Quick way to find sample data: `grep -rn "TODO" src astro.config.mjs` and `ls src/content/*`.

## Quality checks and Lighthouse

```bash
pnpm check && pnpm build        # 0 errors, 0 warnings
pnpm audit:build                      # structural audit of the built HTML
pnpm preview                    # in another terminal: http://localhost:4321
```

Lighthouse (mobile is the default emulation) against the preview server, one run per key page:

```bash
pnpm dlx lighthouse http://localhost:4321/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --view
# repeat for /blog/, /blog/typescript-generics-in-practice/, /projects/, /projects/budget-tracker/
```

Or with Lighthouse CI: `pnpm dlx @lhci/cli collect --url=http://localhost:4321/ --url=http://localhost:4321/blog/ --url=http://localhost:4321/projects/`.

## Assumptions and decisions

Decisions made without asking, in no particular order:

- **Astro 7.4 / Vite 8 / Zod 4.** Verified against the current docs (Content Layer `glob` loader, `astro/zod`, `<ClientRouter />`, `astro:env`, Fonts API, `@astrojs/vercel` 11). TypeScript is pinned to 6.x because `@astrojs/check` does not yet support TypeScript 7.
- **Markdown uses the `unified()` processor.** Astro 7 defaults to the new Sätteri pipeline, but `rehype-slug`, `rehype-autolink-headings`, and Expressive Code are rehype plugins, so `markdown.processor` is set to `unified()` (package `@astrojs/markdown-remark`).
- **Heading anchors use `behavior: 'wrap'`.** The whole heading is the link, so its accessible name equals the heading text and the generated TOC text stays clean.
- **Fonts**: variable WOFF2 files from the installed `@fontsource-variable/*` packages through Astro's Fonts API (local provider), so there is no network access at build or run time. Only Lora (regular) and Inter are preloaded. Metric-adjusted fallbacks are hand-written in `src/styles/fonts.css` with several `local()` names per OS: Astro's generated fallback lists a single name that does not match on Linux, which showed up as layout shift in testing.
- **`<title>`** is `Page | Perdi` and never exceeds 60 characters: if the suffix does not fit, the page title is used on its own, and if even that is too long it is trimmed with an ellipsis. Descriptions are clamped to 160.
- **`og:title` / `twitter:title`** use the page title without the site suffix.
- **Pagination** is custom (page 1 only at `/blog/`; `/blog/page/N/` from 2) instead of Astro's `paginate()`, to get exactly the required URLs. Category and tag pages paginate the same way.
- **Header persistence**: the header uses `transition:persist`, so a small script refreshes `aria-current` and closes the mobile menu on every `astro:page-load`. All scripts initialise on `astro:page-load` and clean up on `astro:before-swap`.
- **Newsletter**: the form posts to Buttondown's embed endpoint and opens the confirmation page in a **new tab** (Buttondown's snippet uses a popup window, which the brief rules out). `data-astro-reload` keeps the router from intercepting the cross-origin POST.
- **Social images**: satori reads the static `.woff` files from `@fontsource/lora` and `@fontsource/inter` (`node_modules`) at build time. These are used for rendering only.
- **Stylesheet inlining**: `build.inlineStylesheets: 'always'`. The whole stylesheet is about 10 KB gzipped, and inlining removes the render-blocking request.
- **YouTube thumbnails** are the only remote images (`i.ytimg.com`, lazy, explicit size). The sample project uses `jNQXAC9IVRw` as a placeholder video ID (marked `TODO`).
- **View counter API** answers `200 { enabled: false }` rather than an error when Redis is not configured, so the browser console stays clean.
- **No `SearchAction`** in the `WebSite` JSON-LD, as requested. Reading time ignores fenced code blocks.
- **Emails and links**: the owner's email was given as `[perdidev@gmail.com]`; the brackets were treated as formatting. No X URL was provided, so it is left out until `X_URL` is set. The sample project URLs (`github.com/perdidev/...`, `budget.example.com`) are placeholders.
- **Dates** are formatted with `Intl.DateTimeFormat('en-US')` in UTC inside `<time datetime>`.
- **Browser support**: scroll-driven animations (`animation-timeline`) are inside `@supports` and everything is fully visible without them. `prefers-reduced-motion` disables motion and view-transition animation.
- `astro preview` is replaced by `scripts/preview.mjs` (see above).
