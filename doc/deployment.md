# Deployment (Cloudflare Workers)

The site is built with Astro 7 and `@astrojs/cloudflare`. Pages are prerendered to static files and served by Workers Static Assets. The only on-demand route is the [views API](views-counter.md), which runs in the Worker.

## Files

- `wrangler.jsonc`: Worker name, compatibility date and flags.
- `public/_headers`: security headers on every route, one-year immutable cache on `/_astro/*`.
- `astro.config.mjs`: `cloudflare({ imageService: 'compile', prerenderEnvironment: 'node' })`. Prerendering runs in Node because the OG images use native `@resvg/resvg-js` and `node:fs`. Images are optimised at build time with Sharp.
- Redirects from `/blog` to `/diary` come from `astro.config.mjs` and are written to `dist/client/_redirects` at build time. Keep them: old links are still out there.

## First deploy

### From the dashboard (builds on every push)

1. Push the repository to GitHub.
2. Cloudflare dashboard, **Workers & Pages**, **Create application**, **Import a repository**.
3. Build command `pnpm build`. Deploy command `npx wrangler deploy`.
4. Under **Build, Variables** add `NODE_VERSION=22` and the [environment variables](environment-variables.md) you want (`SITE_URL`, `PUBLIC_*`, the Redis names).
5. Under **Variables and secrets** add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as secrets. The views API reads them at runtime.

Pushes to `main` deploy to production. Other branches get preview URLs.

### From your machine

```bash
pnpm exec wrangler login
pnpm build
pnpm exec wrangler deploy
pnpm exec wrangler secret put UPSTASH_REDIS_REST_URL
pnpm exec wrangler secret put UPSTASH_REDIS_REST_TOKEN
```

## Moving the domain from Vercel

1. Add the domain to Cloudflare (**Domains, Onboard a domain**) and let it import the DNS records. Change the nameservers at your registrar to the ones Cloudflare gives you.
2. Worker, **Settings, Domains & Routes**, **Add, Custom domain**. Cloudflare creates the DNS record and certificate.
3. Set `SITE_URL=https://www.example.com` as a build variable and redeploy.
4. Remove the domain from the Vercel project once the site answers on Cloudflare.
5. Submit the sitemap: see [SEO](seo.md).

Lower the DNS TTL a day before the switch to shorten the cutover.

## Preview a build locally

```bash
pnpm build
pnpm preview   # astro preview, runs the build in workerd
```

Secrets come from `.env` (copied to `dist/server/.dev.vars`).

## Before you push

```bash
pnpm verify        # design lint + astro check + build
pnpm audit:build   # optional: audit the built HTML
```

## Rollback

Worker, **Deployments**, pick an older version, **Rollback**.
