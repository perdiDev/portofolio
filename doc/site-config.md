# Site content and config

Content that is not a post or a project lives in `src/config/`. Components read from there, so change data here, not in markup.

| File              | What it holds                                                                 |
| ----------------- | ----------------------------------------------------------------------------- |
| `site.ts`         | Author, education, socials, categories, SEO defaults, blog, newsletter, views |
| `experience.ts`   | Work timeline on the home page                                                |
| `achievements.ts` | Recognition section                                                           |
| `index.ts`        | Re-exports all of the above                                                   |

## Common edits

**Bio (used in Person JSON-LD):** `AUTHOR.bio` in `site.ts`. It is marked `TODO`.

**Add the X profile link:** set `X_URL` in `site.ts`. Empty means no link anywhere.

**Add a social link:** add an entry to `SOCIALS`. The `icon` must be one of `github | linkedin | instagram | x | mail`. To add a new icon, extend `src/components/foundation/Icon.astro` and the `SocialLink` type.

**Add a category:** add it to `CATEGORIES`. It becomes valid in frontmatter and gets a page once a post uses it.

**Posts per page, related count, reading speed:** `BLOG` in `site.ts`.

**Newsletter copy:** `NEWSLETTER` in `site.ts`. See [Newsletter](newsletter.md).

**View counter dedupe window and key prefix:** `VIEWS` in `site.ts`. See [Views counter](views-counter.md).

**Footer start year:** `SITE.copyrightStartYear`.

## Experience and achievements

Add or edit entries in `experience.ts` and `achievements.ts`. The timeline is shaped by `src/utils/timeline.ts`. Keep each entry specific: what you built, with what, and the result.

## Favicons and manifest

Icons are in `public/` (`favicon.svg`, `icon-*.png`, `apple-touch-icon.png`, `site.webmanifest`). Replace files in place, keeping the names and sizes.

## Profile photo

`src/assets/photo.jpeg`. Replace it with the same name, or update the import where it is used.

## After any change

```bash
pnpm verify
```
