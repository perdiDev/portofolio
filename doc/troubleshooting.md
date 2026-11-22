# Troubleshooting

## The newsletter form does not show

- `PUBLIC_BUTTONDOWN_USERNAME` is empty or not set in the environment of the build. Set it as a Cloudflare build variable and **redeploy**.
- You are looking at a page that is not a post. The form is only at the end of posts.

## The views counter does not show

- The Redis variables are missing at build time. The counter is rendered only when `UPSTASH_REDIS_REST_*` or `KV_REST_API_*` exist during the build. Set them and redeploy.
- You are using `pnpm preview`. It never runs the API.

## The counter shows but never increases

- Your user agent looks like a bot, or you already counted in the last 24 hours (dedupe).
- Wrong token type. Use the **REST** URL and token, not the `redis://` connection string.
- Check the call: `curl https://<domain>/api/views/<slug>/`. A `502` means Redis rejected the request. Re-check the token.
- A `404` means the slug does not match a published post filename.

## Analytics shows no data

- The script loads in production only. Not in `pnpm dev`.
- `PUBLIC_UMAMI_WEBSITE_ID` not set at build time.
- Do Not Track is on in your browser, or an ad blocker removed the script.

## Canonical or sitemap URLs show the wrong domain

`SITE_URL` is not set or has a trailing slash. Set it for Production without a trailing slash and redeploy. See [Deployment](deployment.md).

## Env change has no effect

Values are read at build time. Redeploy. Locally, restart `pnpm dev`.

## Build fails on a post or project

The error names the file and the field. Common causes:

- `title` outside 10 to 70 characters, `description` outside 50 to 160.
- `tags` not lowercase, duplicated, or more than 5.
- `cover` set without `coverAlt`.
- `updatedDate` earlier than `pubDate`.
- `category` not in `CATEGORIES`.
- `project` or `relatedPosts` pointing to a slug that does not exist.

## Routes return 404 in dev

Run `pnpm check`. Content errors are reported there. Or build and serve `dist/client` with `pnpm preview`.

## `pnpm verify` fails at the design lint

The lint enforces the rules in `DESIGN.md`: colours only from tokens, motion gated by `.js` and reduced motion, hover gated by `(hover: hover) and (pointer: fine)`. Read the message, it names the file and line.

## Fonts or OG images look wrong locally

Reinstall: `pnpm install`. OG images are rendered at build time from the `@fontsource/lora` and `@fontsource/inter` packages.

## Port 4321 is already in use

A dev server may already be running. Reuse it instead of starting another.
