# Documentation

Task-oriented guides for running and maintaining this site. The root [`README.md`](../README.md) is the overview and reference. [`DESIGN.md`](../DESIGN.md) is the design system.

| Guide                                             | Read it when you want to                                          |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| [Environment variables](environment-variables.md) | Know which variables exist, where to set them, what each one does |
| [Newsletter](newsletter.md)                       | Turn on the subscribe form (Buttondown)                           |
| [Views counter](views-counter.md)                 | Turn on per-post view counts (Upstash Redis)                      |
| [Analytics](analytics.md)                         | Turn on cookieless page analytics (Umami)                         |
| [SEO and search engines](seo.md)                  | Verify Google and Bing, submit the sitemap, check metadata        |
| [Deployment](deployment.md)                       | Deploy to Vercel, connect a domain, set `SITE_URL`                |
| [Writing a post](writing-posts.md)                | Add, edit, draft or publish a blog post                           |
| [Adding a project](adding-projects.md)            | Add a project case study and its screenshots                      |
| [Site content and config](site-config.md)         | Change bio, socials, categories, experience, achievements         |
| [Troubleshooting](troubleshooting.md)             | Fix a feature that does not show up or a failing build            |

## Quick start

```bash
pnpm install
cp .env.example .env   # every variable is optional
pnpm dev               # http://localhost:4321
```

Run `pnpm verify` before every commit. It runs the design lint, `astro check` and a production build.

## Which features need setup

| Feature               | Needs                                                        | Without it                   |
| --------------------- | ------------------------------------------------------------ | ---------------------------- |
| Newsletter form       | `PUBLIC_BUTTONDOWN_USERNAME`                                 | Form is not rendered         |
| Views counter         | `UPSTASH_REDIS_REST_URL` + `_TOKEN` (or the `KV_REST_API_*`) | Counter is not rendered      |
| Analytics             | `PUBLIC_UMAMI_WEBSITE_ID`                                    | No script is loaded          |
| Search verification   | `PUBLIC_GSC_VERIFICATION`, `PUBLIC_BING_VERIFICATION`        | No meta tags                 |
| Correct canonical URL | `SITE_URL` (after a custom domain)                           | Falls back to the Vercel URL |

## Conventions for these docs

- One guide per task. Keep each short and link to the code that does the work.
- When you change a variable name or behaviour, update the guide and `.env.example` in the same commit.
- Never put real secrets in any doc. Use placeholders.
