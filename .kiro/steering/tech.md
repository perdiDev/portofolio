---
inclusion: always
---

# Tech

- Astro 7, TypeScript strict, plain CSS files for the foundation, pnpm, Node 22.12+. Deployed on Cloudflare Workers (`@astrojs/cloudflare`, `wrangler.jsonc`).
- Content collections with schemas in `src/content.config.ts`. Images through `astro:assets` (`getImage`), always with width and height.
- Code blocks: `astro-expressive-code`. Fonts: `@fontsource-variable` (Inter, Lora, JetBrains Mono).
- Commands: `pnpm dev`, `pnpm verify` (design lint + astro check + build), `pnpm design:lint`, `pnpm audit:build` (built HTML audit), `pnpm format`.
- Routes: the blog is served under `/diary/`; old `/blog/` URLs redirect. Navigation between foundation pages uses native cross-document view transitions (`styles/foundation/transitions.css`), no router library.
- A dev server may already be running on :4321. Do not start a second one. If routes 404 unexpectedly, check `astro check` output for content errors, or verify against a static build served from `dist/client`.
- Ship minimal JavaScript. Interactivity is small TypeScript modules in `src/scripts/`, loaded by a `<script>` tag in the component that needs it. No framework islands unless a feature truly needs state.
- Prettier config is in `.prettierrc.json` (single quotes, width 100). A save hook formats files.
- Never edit `.env`, `dist/`, `.astro/`, `.wrangler/`. A hook blocks it.
