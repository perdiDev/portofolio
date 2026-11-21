# Tasks

Run with `/spec run foundation-page-rewrite` or one at a time. Each task ends with `pnpm verify` and a screenshot review. Hooks `spec-task-prep` and `design-gate` apply.

- [x] 1. Extract the foundation from `/new-home-4` (layout, Section, tokens/base/shell/motion CSS, script modules, section components). Pixel diff identical, behavior test equal.
- [x] 2. Tooling: `scripts/design-lint.mjs`, hooks, steering, `DESIGN.md`, skills, agents, MCP.
- [ ] 3. Layout: add `seo` prop to `FoundationLayout` and wire `SEO.astro`. Requirements: R1.3, R2.1.
  - [ ] 3.1 Add prop and render SEO tags; keep `noindex` behavior.
  - [ ] 3.2 Confirm `/new-home-4` output unchanged apart from added tags.
- [ ] 4. Layout: `pages` navigation mode for the rail (site links with `aria-current="page"`). Requirements: R1.1.
- [ ] 5. Shared pieces: `PageHead`, `Listing`/`ListRow`, `Pager`, `TagList` with CSS in `src/styles/foundation/` (promote from area when second use appears). Requirements: R3.3, R4.3.
- [ ] 6. Blog listing: `/blog`, `/blog/page/[page]` on the foundation behind `noindex`. Requirements: R2.2, R4.3.
- [ ] 7. `Prose` component and blog post `/blog/[slug]` (TOC, share, related, nav, views, code blocks). Requirements: R4.1, R4.2, R2.3.
- [ ] 8. Tags and categories (index, detail, pagination).
- [ ] 9. Archive and skills.
- [ ] 10. Projects listing and detail `/projects`, `/projects/[slug]` (reuse `Work`, plates, gallery).
- [ ] 11. About: compose Experience, Education, Recognition, Contact with a new intro section.
- [ ] 12. Search page theme with Pagefind; 404 with line drawing (skill `abstract-illustration`).
- [ ] 13. Quality pass: `design-reviewer` agent on every route, Lighthouse mobile on `/`, a post, a project. Requirements: R5.
- [ ] 14. Swap: user confirms; point `/` to the new home, remove `noindex`, delete old layouts, `new-home*` experiments and dead Tailwind CSS. Requirements: R6.2.
