---
name: playwright
description: Use Playwright to screenshot, inspect, and QA pages of the local Astro portfolio (desktop and mobile), capture console errors, and run Lighthouse. Use when asked to check, screenshot, or visually verify the site.
---

# Playwright for this portfolio

Playwright lives in `.tools/pw` (pnpm project, `playwright` and `lighthouse` installed). Scripts are ES modules (`.mjs`) and run with `node` from that folder.

## Setup
- Start the dev server first: `pnpm dev` from the repo root (serves `http://localhost:4321`). Run it in the background and confirm it is up.
- If browsers are missing: `cd .tools/pw && pnpm exec playwright install chromium`.

## Existing scripts (`.tools/pw`)
- `shot.mjs <paths...>`: full-page screenshots at desktop (1280x900) and mobile (390x844), saved to `.tools/shots/`. Prints console errors, page errors, and failed requests. Example: `node shot.mjs / /blog`
- `qa.mjs`, `explore.mjs`, `net.mjs`, `js.mjs`, `clip.mjs`, `clean-shot.mjs`, `styled-shot.mjs`, `gallery-check.mjs`: purpose-specific helpers. Read the file before using one.
- `lh.mjs`, `lh2.mjs`, `lh3.mjs`, `lhm.mjs`: Lighthouse runs (desktop and mobile).

## Writing a new script
```js
import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.on('console', (m) => m.type() === 'error' && console.log(m.text()));
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/home/perdidev/dev/web-portofolio/.tools/shots/out.png', fullPage: true });
await browser.close();
```

## Conventions
- Put new scripts in `.tools/pw`, screenshots in `.tools/shots`. Neither is part of the site build.
- Check both desktop and mobile viewports for layout changes.
- Wait for `networkidle` plus a short timeout for animations before capturing.
- View screenshots with the image-capable file read tool to verify results visually.
- Only target localhost or sites the user owns.
