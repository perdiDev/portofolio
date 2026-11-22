# Views counter (Upstash Redis)

Each post shows a view count in its meta line. Post pages stay static. A small script (`src/scripts/post.ts`) calls the only on-demand route, `src/pages/api/views/[slug].ts`, which stores counts in Upstash Redis.

## Activate

You need a Redis database with a REST URL and token. Pick one path.

### Path A: Vercel marketplace (easiest)

1. Vercel dashboard, your project, **Storage** (or **Marketplace**), **Upstash**, **Redis**.
2. Create a database and connect it to the project.
3. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. The code accepts these names.
4. Redeploy.

### Path B: Upstash directly

1. Create a Redis database at [console.upstash.com](https://console.upstash.com). Choose a region near your Vercel region.
2. On the database page, copy the **REST** URL and token (not the `redis://` URL).
3. Add to Vercel **Environment Variables** (and `.env` for local):

   ```bash
   UPSTASH_REDIS_REST_URL=https://<name>.upstash.io
   UPSTASH_REDIS_REST_TOKEN=<token>
   ```

4. Redeploy.

The counter is included in the page only in builds where these variables exist, so a redeploy is required.

## How it counts

- `GET /api/views/<slug>/` returns `{ "views": n }`.
- `POST /api/views/<slug>/` registers a visit and returns `{ "views": n, "counted": true|false }`.
- Unknown slugs and drafts (in production) return 404.
- Cross-origin POSTs return 403. Requests with an empty or bot-like user agent are not counted.
- One count per visitor per post per 24 hours. The visitor key is a SHA-256 hash of IP and user agent, so no raw IP is stored.
- Responses use `Cache-Control: no-store` and `X-Robots-Tag: noindex`.

Settings are in `VIEWS` in `src/config/site.ts` (`dedupeSeconds`, `keyPrefix`).

## Redis keys

| Key                        | Value                          | TTL      |
| -------------------------- | ------------------------------ | -------- |
| `views:<slug>`             | integer count                  | none     |
| `views:<slug>:seen:<hash>` | `1`, dedupe marker per visitor | 24 hours |

## Check it works

```bash
curl https://<your-domain>/api/views/debugging-habits/
# {"views":0}
```

Open the post in a browser, then call it again. The count goes up by one. Reload: it stays the same for 24 hours.

## Local development

`pnpm dev` runs the API. With the variables in `.env` it uses your real database, so test views are counted. Use a separate database for local work if that matters.

`pnpm preview` does not run the API. It answers `{ "enabled": false }`, the same as when Redis is missing.

## Edit or reset a count

In the Upstash console, **Data Browser**, search `views:<slug>`, edit or delete the key.

## Renaming a post

The count is keyed by slug (filename). Renaming a post file resets its count unless you rename the key in Redis too.
