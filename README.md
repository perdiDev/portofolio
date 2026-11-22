# Perdi — portfolio and diary

Personal site of Perdi, a software engineer in Makassar, Indonesia. A one-page portfolio (work, experience, education, recognition, contact) plus a diary of technical posts and project case studies. Built with **Astro 7**, statically generated, deployed on Vercel.

- Editorial design: warm paper, ink, one accent. Lora for headings, Inter for reading, JetBrains Mono for metadata (self-hosted). Light and dark themes.
- Plain CSS with design tokens. No CSS framework, no UI framework islands.
- Every page is readable and crawlable with JavaScript disabled. JavaScript is small TypeScript modules for progressive enhancement.
- Typed content collections (Zod), Expressive Code for code blocks, generated Open Graph images, RSS, sitemap, JSON-LD.

The design rules live in [`DESIGN.md`](DESIGN.md). The home page (`/`) is the reference implementation.

## Contents

1. [Quick start](#quick-start)
2. [Scripts](#scripts)
3. [Routes](#routes)
4. [Project structure](#project-structure)
5. [Configuration](#configuration)
6. [Writing a post](#writing-a-post)
7. [Post frontmatter](#post-frontmatter)
8. [Adding a project](#adding-a-project)
9. [Project frontmatter](#project-frontmatter)
10. [Environment variables](#environment-variables)
11. [Deploying to Vercel](#deploying-to-vercel)
12. [Custom domain and `SITE_URL`](#custom-domain-and-site_url)
13. [Pre-publish checklist](#pre-publish-checklist)
14. [Quality checks](#quality-checks)
15. [Decisions](#decisions)

## Quick start

Requirements: **Node 22.12 or newer** (see `.nvmrc`) and **pnpm**.

```bash
pnpm install
cp .env.example .env     # optional: every variable is optional
pnpm dev                 # http://localhost:4321
```

Production build and local preview:

```bash
pnpm build               # builds the site to dist/ and .vercel/output
pnpm preview             # serves dist/client at http://localhost:4321
```

> `astro preview` is not supported by the Vercel adapter, so `pnpm preview` runs `scripts/preview.mjs`, a small static server that mimics Vercel for this site (trailing-slash redirects, the headers from `vercel.json`, brotli/gzip, the custom 404). The view-counter API is not executed locally; it answers `{ "enabled": false }`, which is what the site does when Redis is not configured.

## Scripts

| Script             | What it does                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `pnpm dev`         | Dev server. Drafts are visible.                                                                      |
| `pnpm build`       | Production build.                                                                                    |
| `pnpm preview`     | Serve the last build locally (`scripts/preview.mjs`).                                                |
| `pnpm check`       | `astro check` (TypeScript and Astro diagnostics).                                                    |
| `pnpm design:lint` | Design lint: colour tokens, motion gating, hover gating, reduced motion (`scripts/design-lint.mjs`). |
| `pnpm verify`      | Design lint, then `astro check`, then `astro build`. Run this before committing.                     |
| `pnpm format`      | Prettier.                                                                                            |
| `pnpm audit:build` | Audits the built HTML: titles, descriptions, headings, canonicals, JSON-LD, images, links.           |

## Routes

| Route                                  | Page                                                    |
| -------------------------------------- | ------------------------------------------------------- |
| `/`                                    | Home: work, experience, education, recognition, contact |
| `/diary/`, `/diary/page/N/`            | Post list (paginated, page 1 only at `/diary/`)         |
| `/diary/<slug>/`                       | Post                                                    |
| `/categories/<slug>/`, `/tags/<slug>/` | Category and tag lists (paginated)                      |
| `/tags/`                               | All tags                                                |
| `/archive/`                            | Posts by year                                           |
| `/projects/<slug>/`                    | Project detail                                          |
| `/rss.xml`, `/robots.txt`              | Feed and robots                                         |
| `/og/blog/<slug>.png`                  | Generated Open Graph image for a post                   |
| `/api/views/<slug>`                    | View counter (the only on-demand route)                 |
| `/404`                                 | Not found                                               |

The blog used to live at `/blog/`. Redirects in `astro.config.mjs` send `/blog/`, `/blog/page/N/` and `/blog/<slug>/` to their `/diary/` equivalents, so old links keep working. The content collection is still named `blog` and its files live in `src/content/blog/`; only the URL changed.

## Project structure

```
src/
  layouts/             FoundationLayout (shell), PostLayout, ListingLayout
  components/
    foundation/        Section, SEO, Analytics, Icon (generic, reusable)
    sections/          Home sections (Work, Experience, Education, Recognition, Contact),
                       ProjectPlate, plates.ts (project drawings)
    views/             Full-page bodies (Post, Diary, Archive, Tags, ProjectDetail, NotFound)
  styles/
    foundation/        tokens, base, shell, section, motion
    *.css              One file per section or view (work.css, diary.css, ...)
  scripts/
    foundation/        Shell behaviour: theme, toc, reveal, progress, cursor
    *.ts               One module per section or view
  utils/               posts, taxonomy, timeline, jsonld, seo, slug, format, og
  config/              site.ts, experience.ts, achievements.ts (index.ts re-exports)
  content/
    blog/              One Markdown file per post (filename = slug)
    projects/          One Markdown file per project (filename = slug)
  content.config.ts    Collection schemas (Zod)
  pages/               Routes. Pages only compose layout and sections.
integrations/
  content-meta.mjs     Reads frontmatter at config time for sitemap lastmod and noindex rules
scripts/               design-lint.mjs, preview.mjs, audit-build.py, hooks/
DESIGN.md              Design reference
vercel.json  astro.config.mjs  .env.example  .nvmrc
```

One section is one component, one CSS file and optionally one script module with the same name (`Contact.astro`, `contact.css`, `contact.ts`).

## Configuration

Site-wide values live in `src/config/`: author, education, socials, categories, SEO defaults and view-counter settings in `site.ts`; the timeline in `experience.ts`; recognition in `achievements.ts`. Components do not hard-code them.

Values marked `TODO` in `site.ts` are placeholders to review:

- `AUTHOR.bio`: shown in Person JSON-LD.
- `X_URL`: empty, so no X profile link is shown. Fill it in to add one.

To add a **category**, add it to `CATEGORIES`. It becomes valid in frontmatter and gets its own page once a post uses it.

## Writing a post

1. Create `src/content/blog/my-post-slug.md`. The **filename is the slug**: the post is served at `/diary/my-post-slug/`. Use lowercase kebab-case.
2. Add the frontmatter (below) and write the body in Markdown. **Never use `#`**: the page title is the `<h1>`. Start at `##` and do not skip levels.
3. Put images in `src/assets/blog/` and reference them relatively: `![Descriptive alt text](../../assets/blog/diagram.png)`.
4. Code blocks use [Expressive Code](https://expressive-code.com/): ` ```ts title="src/user.ts" {2,4-5} `, ` ```diff `, ` ```ts ins={3} del={2} `.
5. Set `draft: true` while writing. Drafts are visible in `pnpm dev` only; in production they are excluded from pages, RSS and the sitemap.
6. Run `pnpm verify` (the build fails on schema violations), commit and push. Vercel deploys.

Reading time, table of contents (3 or more headings), related posts, previous/next links, OG image, JSON-LD and the sitemap entry are generated.

## Post frontmatter

```yaml
---
title: 'Linux File Permissions: chmod, chown, and umask' # required, 10-70 chars
description: 'One sentence that sells the article.' # required, 50-160 chars
pubDate: 2025-05-27 # required
updatedDate: 2026-02-18 # optional, must be >= pubDate
category: Linux # required: one of CATEGORIES
tags: [linux, permissions, security] # required, 1-5 unique, lowercase
cover: ../../assets/blog/cover.png # optional
coverAlt: 'What the cover shows' # required when cover is set
draft: false # default false
featured: false # default false
project: dev-notes-cli # optional: slug of a project
canonicalUrl: https://example.com/original # optional: for cross-posted articles
ogImage: ../../assets/blog/social.png # optional override of the generated OG image
---
```

| Field          | Type                 | Rules                                      |
| -------------- | -------------------- | ------------------------------------------ |
| `title`        | string               | 10-70 characters                           |
| `description`  | string               | 50-160 characters                          |
| `pubDate`      | date                 | required                                   |
| `updatedDate`  | date                 | optional, not earlier than `pubDate`       |
| `category`     | enum                 | values from `CATEGORIES` in `site.ts`      |
| `tags`         | string[]             | 1-5, unique, lowercase (`a-z 0-9 . + # -`) |
| `cover`        | image                | optional; requires `coverAlt`              |
| `coverAlt`     | string               | min 5 characters                           |
| `draft`        | boolean              | default `false`                            |
| `featured`     | boolean              | default `false`                            |
| `project`      | reference (projects) | optional; the slug must exist              |
| `canonicalUrl` | URL                  | optional; replaces the self-canonical      |
| `ogImage`      | image                | optional                                   |

Tags and categories get pages at `/tags/<slug>/` and `/categories/<slug>/`. Slugs come from `src/utils/slug.ts`: `Tips & Tricks` becomes `tips-and-tricks`. Tag pages with fewer than 2 posts are `noindex, follow` and left out of the sitemap.

## Adding a project

1. Create `src/content/projects/my-project.md` (filename = slug).
2. Add at least one screenshot under `src/assets/projects/my-project/`. The first is the hero, the rest form the gallery.
3. Fill the frontmatter (below). The Markdown body is the overview; use `###` for headings inside it.
4. Link related posts with `relatedPosts`, or set `project: my-project` in a post. Both directions show on the project page.
5. The home page Work grid draws a plate for each project. See `.kiro/skills/abstract-illustration` and `src/components/sections/plates.ts`.

## Project frontmatter

```yaml
---
title: Budget Tracker
summary: One line, 160 characters at most.
date: 2026-05-14 # year column and ordering
order: 1 # lower first
featured: true
show: true # default true; false hides it from lists
status: Live # Live | In progress | Archived | Open source
role: Design, full-stack development
duration: 5 months
techStack: [TypeScript, Astro, PostgreSQL]
liveUrl: https://example.com # optional
repoUrl: https://github.com/you/repo # optional
thumbnail:
  image: ../../assets/projects/my-project/screenshot-1.png
  alt: 'Describe the image'
screenshots: # at least 1
  - image: ../../assets/projects/my-project/screenshot-1.png
    alt: 'Describe the image'
    caption: 'Optional caption'
youtubeId: jNQXAC9IVRw # optional, 11-character video ID
challenges: # at least 1
  - challenge: 'What was hard?'
    solution: 'How you solved it.'
learned: # at least 1
  - 'One lesson per line.'
outcome: 'Optional: what happened afterwards.'
relatedPosts: [typescript-generics-in-practice] # optional, post slugs
---
```

## Environment variables

Copy `.env.example` to `.env` locally and set the same names in the Vercel dashboard for production. **Every variable is optional**; each feature degrades gracefully when its variables are missing.

| Variable                                | Purpose                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SITE_URL`                              | Canonical origin (no trailing slash). Fallback: `https://$VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:4321`.                                |
| `PUBLIC_UMAMI_WEBSITE_ID`               | Umami website ID (cookieless analytics, production only). No script when missing.                                                                      |
| `PUBLIC_UMAMI_SRC`                      | Script URL for self-hosted Umami (default `https://cloud.umami.is/script.js`).                                                                         |
| `PUBLIC_BUTTONDOWN_USERNAME`            | Buttondown username. The subscribe form at the end of each post (`views/Post.astro`, copy in `NEWSLETTER` in `site.ts`) renders only when this is set. |
| `PUBLIC_GSC_VERIFICATION`               | Google Search Console verification token (the `content` value).                                                                                        |
| `PUBLIC_BING_VERIFICATION`              | Bing Webmaster Tools verification token.                                                                                                               |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN`     | Upstash Redis credentials for the view counter. Counter not rendered when missing.                                                                     |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Names set by the Upstash integration in the Vercel marketplace; accepted as aliases.                                                                   |

Variables are declared in `astro.config.mjs` (`env.schema`) and read through `astro:env`. Secrets are server-only.

### The view counter

`src/pages/api/views/[slug].ts` is the only on-demand route. `GET` returns `{ views }`, `POST` increments. It validates the slug against the blog collection (unknown returns 404), ignores obvious bots and cross-origin POSTs, deduplicates per visitor and post for 24 hours with `SET NX EX` on a SHA-256 of IP and user agent, and always sends `Cache-Control: no-store`. Without Redis credentials it answers `{ "enabled": false }`.

Post pages stay static. The counter renders only in builds where the Redis variables exist, and a small script fills it in and registers the visit once.

## Deploying to Vercel

1. Push the repository and import it in Vercel. The Astro preset is detected; the build command is `pnpm build`.
2. Node 22+ works. `.nvmrc` pins 22 for local work.
3. Optional, for the view counter: Vercel dashboard, **Storage** (or **Marketplace**), **Upstash**, **Redis**, create a database and connect it. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Alternatively create a database at [console.upstash.com](https://console.upstash.com) and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Redeploy afterwards; the counter is included at build time only when the variables exist.
4. Add any other variables you want, then redeploy.
5. `vercel.json` sets `trailingSlash: true` and the security and caching headers (`/_astro/*` immutable for one year, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`).

## Custom domain and `SITE_URL`

Until `SITE_URL` is set, the site URL is `https://$VERCEL_PROJECT_PRODUCTION_URL`. Canonicals, Open Graph URLs, JSON-LD, the sitemap, RSS and `robots.txt` derive from it.

1. Vercel, **Settings, Domains**: add the domain and follow the DNS instructions.
2. Set `SITE_URL=https://www.example.com` (no trailing slash) for Production.
3. Redeploy. The URL is baked in at build time.
4. Pick one canonical host (with or without `www`) and redirect the other.

After the domain is live, submit `https://your-domain/sitemap-index.xml` in Google Search Console and Bing Webmaster Tools. `robots.txt` already points to it. The sitemap uses `updatedDate ?? pubDate` for `lastmod` and excludes drafts and noindex pages.

## Pre-publish checklist

For every post:

- [ ] Title is clear and unique, ideally 52 characters or fewer so `Title | Perdi` fits in 60.
- [ ] Description is a real summary of 50-160 characters, different from every other post.
- [ ] Slug (filename) is short, lowercase, hyphenated, and contains the main keyword.
- [ ] Body starts at `##`; headings form a sensible outline.
- [ ] 1-5 lowercase tags, reusing existing ones where it makes sense (thin tag pages are `noindex`).
- [ ] Every image has alt text; `cover` has `coverAlt`.
- [ ] 2 or more internal links to other posts or projects.
- [ ] `canonicalUrl` set if the article was published elsewhere first.
- [ ] `draft: false` and `pubDate` is not in the future.
- [ ] `pnpm verify` passes; open the post and check its OG image at `/og/blog/<slug>.png`.

## Quality checks

```bash
pnpm verify                     # design lint, astro check, build
pnpm audit:build                # structural audit of the built HTML
pnpm preview                    # then open http://localhost:4321
```

Lighthouse against the preview server:

```bash
pnpm dlx lighthouse http://localhost:4321/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --view
# repeat for /diary/ and one post and one project
```

## Decisions

- **Astro 7 / Zod 4.** Content Layer `glob` loader, `astro/zod`, `astro:env` and the Fonts API. TypeScript is pinned to 6.x because `@astrojs/check` does not support TypeScript 7 yet.
- **Markdown uses the `unified()` processor.** `rehype-slug`, `rehype-autolink-headings` and Expressive Code are rehype plugins, so `markdown.processor` is set to `unified()` (package `@astrojs/markdown-remark`). Heading anchors use `behavior: 'wrap'`.
- **Fonts** come from the installed `@fontsource-variable/*` packages through Astro's Fonts API (local provider), so there is no network access at build or run time. Metric-adjusted fallbacks are in `src/styles/fonts.css`.
- **Theme.** An inline script in the layout `<head>` sets `data-theme` before first paint from `localStorage` (`theme` key); `scripts/foundation/theme.ts` handles the toggle. Colours exist only as tokens in `src/styles/foundation/tokens.css`.
- **`<title>`** is `Page | Perdi` and stays within 60 characters: if the suffix does not fit, the page title is used alone, and if that is too long it is trimmed with an ellipsis. Descriptions are clamped to 160. `og:title` and `twitter:title` use the title without the suffix.
- **Pagination** is custom (`/diary/` for page 1, `/diary/page/N/` from 2) instead of Astro's `paginate()`, to get exactly these URLs. Category and tag pages paginate the same way.
- **Newsletter**: the form posts to Buttondown's embed endpoint and opens the confirmation page in a new tab (`target="_blank"`), so no popup script is needed.
- **Stylesheet inlining**: `build.inlineStylesheets: 'always'`, which removes the render-blocking request.
- **Social images** are rendered at build time with satori and resvg from the static `.woff` files in `@fontsource/lora` and `@fontsource/inter`.
- **YouTube thumbnails** are the only remote images (`i.ytimg.com`, lazy, explicit size).
- **Motion** is gated by `.js` and `prefers-reduced-motion`; hover and pointer effects are gated by `(hover: hover) and (pointer: fine)`. Content is fully visible without JavaScript. Details in `DESIGN.md`.
- **Redirects** from `/blog/*` to `/diary/*` use Astro's `redirects` config without trailing slashes in the keys, because Astro rejects trailing-slash keys for dynamic routes.
