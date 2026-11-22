# scripts/ and integrations/

Tooling that is not part of the site bundle.

| Path                            | Runs when                  | Purpose                                                                                         |
| ------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| `scripts/design-lint.mjs`       | `pnpm design:lint`, verify | Enforces the design foundation (tokens, motion, hover gating) on in-scope files.                |
| `scripts/preview.mjs`           | `pnpm preview`             | Static server for `dist/client` that mimics Vercel (redirects, headers, compression, 404).      |
| `scripts/audit-build.py`        | `pnpm audit:build`         | Checks built HTML: titles, descriptions, headings, canonicals, JSON-LD, images, internal links. |
| `scripts/hooks/`                | Kiro hooks                 | Session context, design guard, format on save, permission and stop gates. See `.kiro/hooks`.    |
| `integrations/content-meta.mjs` | `astro.config.mjs`         | Reads post and project frontmatter at config time for sitemap `lastmod` and noindex filtering.  |

`scripts/` holds commands you run or hooks call. `integrations/` holds code that `astro.config.mjs` imports. `.tools/` (gitignored) holds local Playwright and screenshot helpers.
