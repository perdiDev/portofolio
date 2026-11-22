# Deployment (Vercel)

The site is static, built with Astro 7 and `@astrojs/vercel`. The only on-demand route is the [views API](views-counter.md).

## First deploy

1. Push the repository to GitHub.
2. In Vercel: **Add New, Project**, import the repository. The Astro preset is detected. Build command: `pnpm build`.
3. Use Node 22 or newer. `.nvmrc` pins 22 for local work. Set it in **Settings, General, Node.js Version** if needed.
4. Add [environment variables](environment-variables.md) you want, then deploy.

Every push to `main` deploys to production. Other branches and pull requests get preview URLs.

## What `vercel.json` does

- `trailingSlash: true`. Every URL ends in `/`.
- `/_astro/*` is cached for one year (immutable).
- Security headers on all routes: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`.

## Custom domain and `SITE_URL`

Until `SITE_URL` is set, canonicals, OG URLs, JSON-LD, sitemap, RSS and `robots.txt` use `https://$VERCEL_PROJECT_PRODUCTION_URL`.

1. Vercel, **Settings, Domains**: add the domain and follow the DNS instructions.
2. Pick one canonical host (with or without `www`) and redirect the other one in the Domains screen.
3. Set for **Production**:

   ```bash
   SITE_URL=https://www.example.com
   ```

   No trailing slash.

4. Redeploy. The value is baked in at build time.
5. Submit the sitemap: see [SEO](seo.md).

## Preview a build locally

```bash
pnpm build
pnpm preview   # serves dist/client at http://localhost:4321
```

`astro preview` does not work with the Vercel adapter, so `scripts/preview.mjs` imitates Vercel (redirects, headers, compression, 404). The views API is not run there.

## Before you push

```bash
pnpm verify        # design lint + astro check + build
pnpm audit:build   # optional: audit the built HTML
```

## Rollback

Vercel, **Deployments**, pick an older successful deployment, **Promote to Production** (or **Instant Rollback**).

## Redirects

`/blog`, `/blog/page/N` and `/blog/<slug>` redirect to the `/diary/` equivalents (`astro.config.mjs`). Keep them: old links are still out there.
