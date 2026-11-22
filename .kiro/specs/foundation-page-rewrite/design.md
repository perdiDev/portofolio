# Design: pages on the foundation

## Architecture

```
FoundationLayout (shell, `seo` prop)
  ├─ ListingLayout   diary, tags, categories  -> views/Diary
  ├─ PostLayout      diary entry              -> views/Post
  └─ Page (src/pages/**)  composes sections or a view only
       └─ Section (foundation)  hairline + number + h2 + reveal
            └─ Section components (components/sections/X.astro) with styles/x.css and scripts/x.ts
```

Generic shell parts sit in `components/foundation/` (Section, SEO, Analytics, Icon). Home sections are in `components/sections/`. Full-page bodies are in `components/views/`. CSS in `styles/`, behavior in `scripts/`, same stem. No per-page folders.

## Layout

`FoundationLayout` covers head and SEO, theme bootstrap (saved in local storage), rail (identity, section or outline nav, clock, theme toggle), main and footer. Props: `title`, `description`, `heading`, `ownHeading`, `nav`, `noindex`, `seo`. The rail nav is anchors to sections on the page; on entries it lists the entry's headings.

## Route map

| Route                           | Body                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `/`                             | Work, Experience, Education, Recognition, Contact                        |
| `/diary/`, `/diary/page/[page]` | `Diary` view through `ListingLayout`                                     |
| `/diary/[slug]`                 | `Post` view through `PostLayout`                                         |
| `/projects/[slug]`              | `ProjectDetail` view, plate hero, sections from `utils/project-sections` |
| `/archive`                      | `Archive` view, grouped by year                                          |
| `/tags`, `/tags/[tag]`          | `Tags` view and `Diary` list, thin terms are `noindex`                   |
| `/categories/[category]`        | `Diary` list                                                             |
| `/404`                          | `NotFound` view, `noindex`                                               |
| `rss.xml`, `robots.txt`, `og/*` | endpoints                                                                |
| `api/views/[slug]`              | view counter endpoint                                                    |

## Motion between pages

Native cross-document view transitions (`styles/foundation/transitions.css`, `scripts/foundation/transition.ts`). Off under reduced motion. Rows on tag and archive pages use the fisheye effect (`scripts/foundation/fisheye.ts`).

## Data and errors

Data stays in content collections (`blog`, `projects`) and `src/config/`. Pages never hardcode it. A content reference error (for example a post pointing to a missing project) is blocking: treat any `[ERROR] [content]` line as a failure.

## Verification

- `pnpm verify` per task, then `pnpm audit:build`.
- `.tools/pw/` scripts for screenshots (`nh4-regress.mjs`, set `BASE` to a static server for `dist/client`), behavior smoke tests and Lighthouse (`lh*.mjs`). `.tools/` is gitignored and local.

## Decisions

- Plain CSS files per area instead of Tailwind: one cascade, tokens visible. Tailwind was removed with the old pages.
- Behavior in small TS modules, not islands: keeps JS per page small.
- The hidden layout `h1` guarantees a heading; visible section titles are `h2`. A page with its own visible title sets `ownHeading`.
