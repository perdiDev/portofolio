---
inclusion: always
---
# Structure

```
src/
  layouts/FoundationLayout.astro      shell: head, theme bootstrap, rail, main, footer
  components/foundation/              generic, reusable (Section)
  components/new-home-4/               home sections and plates.ts (project drawings)
  styles/foundation/                   tokens, base, shell, motion (imported by the layout)
  styles/new-home-4/                   one CSS file per section, imported by its component
  scripts/foundation/                  shell behavior: theme, clock, toc, reveal, progress, cursor
  scripts/new-home-4/                  one module per section
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
- Generic pieces go in `foundation/`. Anything specific to one page or section stays in that page's folder. Promote to `foundation/` when a second page needs it.
- New areas (for example `blog`) follow the same shape: `components/blog/`, `styles/blog/`, `scripts/blog/`. Add the folders to `SCOPE_DIRS` in `scripts/design-lint.mjs` and to the guard regex in `scripts/hooks/design-guard.mjs`.

#[[file:DESIGN.md]]
