# Tasks

Run with `/spec run foundation-page-rewrite` or one at a time. Each task ends with `pnpm verify` and a screenshot review. Hooks `spec-task-prep` and `design-gate` apply.

- [x] 1. Extract the foundation (layout, Section, tokens/base/shell/motion CSS, script modules, section components) from the home experiment. Pixel diff identical.
- [x] 2. Tooling: `scripts/design-lint.mjs`, hooks, steering, `DESIGN.md`, skills, agents, MCP.
- [x] 3. Layout: `seo` prop on `FoundationLayout` wired to `SEO.astro`. Requirements: R1.3, R2.1.
- [x] 4. Rail and footer: back link goes up one level, footer site links (Prologue, Diary, RSS), outline of entry headings in the rail for entries.
- [x] 5. Diary: `/diary/`, `/diary/page/[page]` through `ListingLayout` and the `Diary` view. `/blog/*` redirects to `/diary/*`.
- [x] 6. Diary entry `/diary/[slug]` through `PostLayout` and the `Post` view (outline, related, nav, views, code blocks).
- [x] 7. Tags, categories and archive on the foundation (`Tags`, `Archive` views, fisheye rows).
- [x] 8. Project detail `/projects/[slug]` (`ProjectDetail` view, plate travels from the home grid by view transition).
- [x] 9. 404 on the foundation with a line drawing (`NotFound` view).
- [x] 10. Cleanup: removed about, projects list, skills and search pages, old layouts and dead CSS; components grouped into `foundation/`, `sections/`, `views/`; config split into modules.
- [x] 11. Deployment moved from Vercel to Cloudflare Workers. Theme saved in local storage.
- [ ] 12. Quality pass: `design-reviewer` agent on every route, `pnpm audit:build`, Lighthouse mobile on `/`, an entry and a project. Requirements: R5.
