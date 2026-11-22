# Writing a post

Posts are Markdown files in `src/content/blog/`. The collection is named `blog`, the URL is `/diary/<slug>/`.

## Steps

1. Create `src/content/blog/my-post-slug.md`. The **filename is the slug**: lowercase, kebab-case, short, with the main keyword.
2. Add frontmatter (below).
3. Write the body. Start at `##`, never `#`: the page title is the `<h1>`. Do not skip heading levels.
4. Put images in `src/assets/blog/` and reference them relatively:

   ```md
   ![Alt text that describes the image](../../assets/blog/diagram.png)
   ```

5. Keep `draft: true` while writing. Drafts show in `pnpm dev` only.
6. Run `pnpm verify`. The build fails on schema errors.
7. Commit and push. Vercel deploys.

Generated for you: reading time, table of contents (3 or more headings), related posts, previous and next links, OG image, JSON-LD, sitemap entry, RSS entry.

## Frontmatter

```yaml
---
title: 'Linux File Permissions: chmod, chown, and umask' # 10-70 chars
description: 'One sentence that sells the article, 50 to 160 characters.'
pubDate: 2026-05-27
updatedDate: 2026-06-18 # optional, not before pubDate
category: Linux # one of CATEGORIES in src/config/site.ts
tags: [linux, permissions, security] # 1-5, unique, lowercase
cover: ../../assets/blog/cover.png # optional
coverAlt: 'What the cover shows' # required with cover
draft: false
featured: false
project: pokidulu # optional: a project slug
canonicalUrl: https://example.com/original # optional, for cross-posts
ogImage: ../../assets/blog/social.png # optional override
---
```

Tags allow `a-z 0-9 . + # -` and spaces. Categories: `Programming`, `Linux`, `Software Engineering`, `Tips & Tricks`. To add one, edit `CATEGORIES` in `src/config/site.ts`.

## Code blocks

Expressive Code syntax:

````md
```ts title="src/user.ts" {2,4-5}

```

```diff
- old
+ new
```

```ts ins={3} del={2}

```
````

## Publish checklist

- [ ] Title is unique and ideally 52 characters or fewer
- [ ] Description is a real summary, different from other posts
- [ ] Body starts at `##`
- [ ] 1 to 5 lowercase tags, reusing existing ones where it makes sense
- [ ] Every image has alt text, `cover` has `coverAlt`
- [ ] 2 or more internal links to posts or projects
- [ ] `canonicalUrl` set if published elsewhere first
- [ ] `draft: false`, `pubDate` is not in the future
- [ ] `pnpm verify` passes
- [ ] `/og/blog/<slug>.png` renders

## Rename or delete

Renaming a file changes the URL and resets its [view count](views-counter.md). Add a redirect in `astro.config.mjs` if the old URL was public. Deleting a post leaves a 404.
