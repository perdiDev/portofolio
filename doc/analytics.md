# Analytics (Umami)

Cookieless page analytics. The script is loaded only in production builds and only when a website ID is set. It respects Do Not Track (`data-do-not-track="true"`).

Code: `src/components/foundation/Analytics.astro`.

## Activate (Umami Cloud)

1. Sign up at [umami.is](https://umami.is) and add a website with your domain.
2. Copy the **Website ID** from the website settings.
3. Set:

   ```bash
   PUBLIC_UMAMI_WEBSITE_ID=<website id>
   ```

   Production only matters here. The script never loads in `pnpm dev`.

4. Redeploy and visit the live site. The visit shows in the Umami dashboard within a minute.

## Self-hosted Umami

Also set the script URL:

```bash
PUBLIC_UMAMI_SRC=https://stats.example.com/script.js
```

Default is `https://cloud.umami.is/script.js`.

## Check it works

Open the live site, DevTools, **Network**, filter `script.js`. You should see it load, and a `send` request on navigation. If you have Do Not Track on, nothing is sent: turn it off to test.

## Notes

- Ad blockers may block the Cloud script. A self-hosted instance on your own domain is blocked less.
- The website ID is public by design. It is safe in `PUBLIC_` variables.
- Add the domain to Umami's allowed domains if you restrict them.
