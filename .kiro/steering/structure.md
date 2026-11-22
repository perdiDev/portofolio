---
inclusion: always
---

# Structure

```
src/
  layouts/FoundationLayout.astro      shell: head, theme bootstrap, rail, main, footer
  layouts/ListingLayout.astro         paginated post lists (diary, tags, categories): SEO + Diary view
  layouts/PostLayout.astro            one diary entry: SEO, JSON-LD + Post view
  components/foundation/              generic, reusable (Section, SEO, Analytics, Icon)
  components/sections/                home page sections (Work, Experience, Education, Recognition,
                                      Contact), ProjectPlate, plates.ts (project drawings)
  components/views/                   full-page bodies (Post, Archive, ProjectDetail, Diary, Tags,
                                      NotFound)
  styles/foundation/                   tokens, base, shell, section, motion, fisheye, transitions
                                      (imported by the layout)
  styles/                              one CSS file per section (work.css, contact.css, ...);
  scripts/foundation/                  shell behavior: theme, toc, reveal, progress, cursor, fisheye, transition, dom
  scripts/                             one module per section (work.ts, contact.ts, ...)
  utils/                               posts.ts, taxonomy.ts, timeline.ts, seo.ts, jsonld.ts ...
                                      (data shaping, no markup)
  pages/                               routes; compose only
  content/, config/                    data: collections `blog`, `projects`; site.ts, experience.ts,
                                      achievements.ts (index.ts re-exports)
integrations/                          content-meta.mjs (sitemap lastmod, noindex), used by astro.config
scripts/design-lint.mjs, scripts/hooks/ enforcement; scripts/audit-build.py (built HTML audit)
doc/                                   setup and maintenance guides
.kiro/                                 steering, hooks, skills, agents, specs, MCP
DESIGN.md                              the design reference
```

Rules:

- A page file composes layout and sections. Logic that shapes data goes in `utils/` or the section component frontmatter.
- One section = one component + one CSS file + (optionally) one script module, all with the same name.
- No per-page folders: a component sits in `components/sections/` or `components/views/`, its CSS in `styles/` and its script in `scripts/`, all named after it (`Contact.astro`, `contact.css`, `contact.ts`). Only shell-level generic pieces go in `foundation/`.
- Design lint and the write guard find section code by content (a component that renders `foundation/Section.astro`, a page that renders `FoundationLayout`, CSS those files import). No folder list to maintain.
- When an old component is replaced, delete it once no page imports it, together with its stylesheet.

#[[file:DESIGN.md]]
