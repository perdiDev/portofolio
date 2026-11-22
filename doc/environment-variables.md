# Environment variables

Every variable is optional. A feature whose variables are missing turns itself off without an error.

Variables are declared in `astro.config.mjs` (`env.schema`) and read through `astro:env`. `.env.example` is the template.

## Set them

**Local:** copy the template and fill what you need.

```bash
cp .env.example .env
```

Restart `pnpm dev` after editing `.env`.

**Production:** Vercel dashboard, your project, **Settings**, **Environment Variables**. Add each name for the **Production** environment (and **Preview** if you want it there). Then **redeploy**. Values are read at build time, so a change does nothing until the next build.

`.env` is git-ignored. Never commit it.

## Reference

| Variable                     | Kind   | Used by                | Guide                             |
| ---------------------------- | ------ | ---------------------- | --------------------------------- |
| `SITE_URL`                   | build  | canonical, OG, sitemap | [Deployment](deployment.md)       |
| `PUBLIC_UMAMI_WEBSITE_ID`    | public | analytics script       | [Analytics](analytics.md)         |
| `PUBLIC_UMAMI_SRC`           | public | self-hosted Umami      | [Analytics](analytics.md)         |
| `PUBLIC_BUTTONDOWN_USERNAME` | public | newsletter form        | [Newsletter](newsletter.md)       |
| `PUBLIC_GSC_VERIFICATION`    | public | Google Search Console  | [SEO](seo.md)                     |
| `PUBLIC_BING_VERIFICATION`   | public | Bing Webmaster Tools   | [SEO](seo.md)                     |
| `UPSTASH_REDIS_REST_URL`     | secret | view counter API       | [Views counter](views-counter.md) |
| `UPSTASH_REDIS_REST_TOKEN`   | secret | view counter API       | [Views counter](views-counter.md) |
| `KV_REST_API_URL`            | secret | alias of the two above | [Views counter](views-counter.md) |
| `KV_REST_API_TOKEN`          | secret | alias of the two above | [Views counter](views-counter.md) |

- **public**: prefixed `PUBLIC_`, ends up in the browser. Only put non-sensitive values here.
- **secret**: server only. Never prefix with `PUBLIC_`.
- `SITE_URL` falls back to `https://$VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:4321`.

## Minimal production set

```bash
SITE_URL=https://www.example.com
PUBLIC_UMAMI_WEBSITE_ID=<umami website id>
PUBLIC_BUTTONDOWN_USERNAME=<buttondown username>
PUBLIC_GSC_VERIFICATION=<token>
UPSTASH_REDIS_REST_URL=<url>
UPSTASH_REDIS_REST_TOKEN=<token>
```

## Adding a new variable

1. Add it to `env.schema` in `astro.config.mjs` with `envField` (`context` and `access` set correctly).
2. Add it to `.env.example` with a one-line comment.
3. Add it to the table above and to the root README.
4. Read it with `import { NAME } from 'astro:env/client'` or `'astro:env/server'`.
