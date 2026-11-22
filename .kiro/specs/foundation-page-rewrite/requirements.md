# Requirements: rewrite every page on the new-home-4 foundation

## Introduction

`/new-home-4` is the design foundation. It was split into `FoundationLayout`, `Section`, token CSS and script modules with no visual change (full-page pixel diff identical, light and dark, desktop and mobile). This spec covers rewriting the remaining pages so the whole site shares one design and structure.

## Requirements

### R1. One layout for all pages

**User story:** As a visitor, I see the same shell (rail, theme toggle, footer) on every page.

1. WHEN any route in scope renders THEN it SHALL use `FoundationLayout`.
2. WHEN the layout renders THEN it SHALL output exactly one `h1`.
3. WHEN a page needs SEO data THEN `FoundationLayout` SHALL accept it through optional props (canonical, Open Graph image, JSON-LD, article dates) without duplicating markup.

### R2. Existing URLs, SEO and feeds stay intact

1. WHEN a page is rewritten THEN its URL, canonical, OG image, JSON-LD, sitemap entry and RSS item SHALL be unchanged or better.
2. WHEN `/blog/[slug]`, `/projects/[slug]`, tag, category and pagination routes are rewritten THEN `getStaticPaths` output SHALL be identical.
3. `/search` SHALL keep Pagefind working; `/api/views/[slug]` and view counter SHALL keep working.

### R3. Design system compliance

1. WHEN files in foundation scope change THEN `node scripts/design-lint.mjs` SHALL exit 0.
2. Colour SHALL come from tokens only; every animation SHALL have a reduced-motion path; hover effects SHALL be gated to fine pointers.
3. WHEN a pattern is needed by a second page THEN it SHALL move to `src/components/foundation/`.

### R4. Content and reading experience

1. Blog posts SHALL keep Expressive Code blocks, TOC, related posts, share buttons and post navigation, restyled with tokens.
2. Long-form text SHALL have a measure of 60 to 75 characters and sans body at 1rem or larger.
3. Listing pages (blog, archive, tags, categories, projects, skills) SHALL share one listing pattern built from `Section` and ruled rows.

### R5. Quality gates per page

1. `pnpm verify` SHALL pass.
2. WHEN a page is finished THEN screenshots at 1280 and 390 px, light and dark, SHALL be reviewed, with no horizontal overflow.
3. Lighthouse mobile SHALL score 95+ for Performance, 100 for Accessibility, Best Practices and SEO, on `/`, a post and a project.
4. WHEN restyling a page that already exists THEN a before/after comparison SHALL be recorded in the task notes.

### R6. Migration safety

1. New pages SHALL ship behind `noindex` until the user confirms the swap.
2. Old layouts (`BaseLayout`, `ListingLayout`, `PostLayout`; `ProjectLayout` is already removed) and old experiments SHALL be removed only after no route uses them.
