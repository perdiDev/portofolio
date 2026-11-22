# Requirements: every page on the design foundation

## Introduction

The home page `/` is the design foundation. It is split into `FoundationLayout`, `Section`, token CSS and script modules. All other routes now render through `FoundationLayout` too. This spec records the standard each route must keep and the work that remains.

Routes in scope: `/`, `/diary/`, `/diary/page/[page]`, `/diary/[slug]`, `/projects/[slug]`, `/archive`, `/tags`, `/tags/[tag]` (and pages), `/categories/[category]` (and pages), `/404`. The about, projects list, skills and search pages were removed and are out of scope.

## Requirements

### R1. One layout for all pages

**User story:** As a visitor, I see the same shell (rail, theme toggle, footer) on every page.

1. WHEN any route in scope renders THEN it SHALL use `FoundationLayout`, directly or through `ListingLayout` / `PostLayout`.
2. WHEN the layout renders THEN it SHALL output exactly one `h1` (hidden `heading`, or the page's own when `ownHeading` is set).
3. WHEN a page needs SEO data THEN `FoundationLayout` SHALL accept it through the optional `seo` prop without duplicating markup.

### R2. URLs, SEO and feeds stay intact

1. WHEN a page changes THEN its URL, canonical, OG image, JSON-LD, sitemap entry and RSS item SHALL be unchanged or better.
2. WHEN a URL moves THEN the old URL SHALL redirect (`/blog/*` redirects to `/diary/*`).
3. `getStaticPaths` output for diary, project, tag and category routes SHALL not lose entries. `/api/views/[slug]` and the view counter SHALL keep working.

### R3. Design system compliance

1. WHEN files in foundation scope change THEN `node scripts/design-lint.mjs` SHALL exit 0.
2. Colour SHALL come from tokens only; every animation SHALL have a reduced-motion path; hover effects SHALL be gated to fine pointers.
3. WHEN a pattern is needed by a second page THEN it SHALL move to `src/components/foundation/`.

### R4. Content and reading experience

1. Diary entries SHALL keep Expressive Code blocks, the outline in the rail, related posts and post navigation, styled with tokens.
2. Long-form text SHALL have a measure of 60 to 75 characters and sans body at 1rem or larger.
3. Listing pages (diary, archive, tags, categories) SHALL share the `Diary` / `Archive` / `Tags` view patterns built on ruled rows.

### R5. Quality gates per page

1. `pnpm verify` SHALL pass, and `pnpm audit:build` SHALL report no errors.
2. WHEN a page is finished THEN screenshots at 1280 and 390 px, light and dark, SHALL be reviewed, with no horizontal overflow.
3. Lighthouse mobile SHALL score 95+ for Performance, 100 for Accessibility, Best Practices and SEO, on `/`, an entry and a project.
4. WHEN restyling a page that already exists THEN a before/after comparison SHALL be recorded in the task notes.

### R6. Deployment

1. The site SHALL build for Cloudflare Workers (`@astrojs/cloudflare`, `wrangler.jsonc`) with `SITE_URL` set (see `doc/deployment.md`).
2. Dead layouts, components and CSS SHALL be removed once no route uses them.
