# Design: rewrite on the foundation

## Architecture
```
FoundationLayout (shell, SEO props)
  └─ Page (src/pages/**)       composes sections only
       └─ Section (foundation) hairline + number + h2 + reveal
            └─ Area components (components/<area>/)  with styles/<area>/x.css and scripts/<area>/x.ts
```
Areas: `new-home-4` (home), `blog`, `projects`, `archive` (shared listing), `about`.

## Layout changes needed
`FoundationLayout` today covers head, theme bootstrap, rail, footer. Add, in this order and each as its own verified step:
1. `seo` prop: pass-through to `src/components/SEO.astro` (title, description, canonical, image, type, dates, JSON-LD).
2. `rail` variants: the rail nav is section anchors on the home page. On other pages it shows site links (Home, Work, Writing, About) with `aria-current="page"`. Implement as `nav` items with `href` instead of `#id`, plus a `mode` of `anchors` or `pages`.
3. `Analytics`, `Cursor` removal check, `ViewCounter` slot for posts.
Home keeps pixel parity at each step (regression script).

## New shared components (create when first needed, then reuse)
| Component | Used by | Notes |
|---|---|---|
| `Listing.astro` + `ListRow.astro` | blog, archive, tags, categories, skills | ruled rows: date (mono), title (serif), summary (muted), tags; hover shifts title 8px, like Recognition |
| `PageHead.astro` | all non-home pages | number, `h1`-adjacent title block, optional intro; the layout `h1` stays visually hidden unless the page passes `heading` |
| `Prose.astro` | post, project, about | typography for rendered markdown: measure, headings with autolinks, figure, blockquote, lists, tables, code (Expressive Code theme from tokens) |
| `Pager.astro` | blog, tags, categories | prev/next with ruled edges |
| `TagList.astro` | rows, posts | mono uppercase labels |
| `Toc.astro` | post | sticky, uses the rail's active-link logic |

Each gets CSS in `src/styles/<area>/` and uses tokens only. Existing small components (`Breadcrumbs`, `ShareButtons`, `RelatedPosts`, `PostNav`, `TOC`, `Tag`, `Pagination`, `SocialLinks`) are restyled or replaced, not duplicated.

## Page map
| Route | Sections |
|---|---|
| `/` | take over `new-home-4` content (after sign-off) |
| `/about` | intro with portrait, Experience, Education, Recognition, Contact (reuse home components) |
| `/projects` | Listing of projects with plates (reuse `Work`), filters by status |
| `/projects/[slug]` | PageHead, plate hero, facts (stack, role, status, links), Prose, gallery, next project |
| `/blog`, pages, tags, categories | PageHead + Listing + Pager |
| `/blog/[slug]` | PageHead, Prose, TOC, share, related, post nav, view counter |
| `/archive` | Listing grouped by year |
| `/skills` | grouped ruled rows with mono levels |
| `/search` | PageHead + Pagefind UI themed with tokens |
| `/404` | oversized serif line with a line drawing, link home |

## Data and errors
Data stays in content collections and `config.ts`. Pages never hardcode it. A content reference error (for example a post pointing to a missing project) must fail `pnpm check` review: treat any `[ERROR] [content]` line as blocking.

## Testing and verification
- `pnpm verify` per task.
- `.tools/pw/nh4-regress.mjs` for pixel baselines (set `BASE` to a static server for `dist/client`; the dev server may be stale).
- `.tools/pw/nh4-behavior.mjs` pattern for interactions; one script per new behavior.
- Lighthouse scripts in `.tools/pw/lh*.mjs` at the end of each area.

## Decisions
- Plain CSS files per area instead of Tailwind in new code: one cascade, tokens visible, no class soup. Tailwind stays only for legacy pages until they are removed. (Alternative: Tailwind with a token theme. Rejected for now to keep the foundation identical to the proven nh4 CSS.)
- Behavior in small TS modules, not islands: keeps JS per page under a few KB.
- Section number and `h1` are separate: the hidden layout `h1` guarantees a heading; visible titles are `h2` or a `PageHead`.
