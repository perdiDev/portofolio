---
inclusion: always
---

# Product

Personal portfolio and developer blog of Perdi (software engineer, Makassar, Indonesia). Goal of the redesign: one coherent, editorial design applied to every page, with the home page `/` as the source of truth.

- Audience: hiring managers and engineers who skim fast, and developers who read the diary (the blog).
- The site must feel hand-made: specific copy, real screenshots of real projects, no stock phrases.
- Content lives in `src/content` (collections `blog` and `projects`; the blog is published under `/diary/`) and `src/config/` (`site.ts`, `experience.ts`, `achievements.ts`, re-exported by `index.ts`). Do not hardcode that data in components.
- Routes: `/` (home), `/diary/` with pages and `/diary/[slug]`, `/projects/[slug]` (the project grid lives on the home page), `/archive`, `/tags`, `/categories/[category]`, `/404`, plus `rss.xml`, `robots.txt`, `og/*` and `api/views/[slug]`. The about, projects list, skills and search pages were removed.
- All routes render through `FoundationLayout`. The rewrite is done; new work extends or polishes it.
