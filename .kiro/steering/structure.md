---
inclusion: always
---

# Structure

```
src/
  layouts/FoundationLayout.astro      shell: head, theme bootstrap, rail, main, footer
  components/foundation/              generic, reusable (Section)
  components/                         section components (Work, Experience, Education, Recognition,
                                      Contact), plates.ts (project drawings)
  styles/foundation/                   tokens, base, shell, section, motion (imported by the layout)
  styles/                              one CSS file per section (work.css, contact.css, ...);
  scripts/foundation/                  shell behavior: theme, toc, reveal, progress, cursor
  scripts/                             one module per section (work.ts, contact.ts, ...)
  utils/                               posts.ts, timeline.ts (data shaping, no markup)
  pages/                               routes; compose only
  content/, config.ts                  data
scripts/design-lint.mjs, scripts/hooks/ enforcement
.kiro/                                 steering, hooks, skills, agents, specs, MCP
DESIGN.md                              the design reference
```

Rules:

- A page file composes layout and sections. Logic that shapes data goes in `utils/` or the section component frontmatter.
- One section = one component + one CSS file + (optionally) one script module, all with the same name.
- No per-page folders: section files sit directly in `components/`, `styles/` and `scripts/`, named after the section (`Contact.astro`, `contact.css`, `contact.ts`). Only shell-level generic pieces go in `foundation/`.
- Design lint and the write guard find section code by content (a component that renders `foundation/Section.astro`, a page that renders `FoundationLayout`, CSS those files import). No folder list to maintain.
- When an old component is replaced, delete it once no page imports it, together with its stylesheet.

#[[file:DESIGN.md]]
