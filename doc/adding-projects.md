# Adding a project

Projects are Markdown files in `src/content/projects/`. They appear in the home page Work grid and at `/projects/<slug>/`.

## Steps

1. Create `src/content/projects/my-project.md`. Filename is the slug.
2. Add screenshots under `src/assets/projects/my-project/`. The first is the hero, the rest form the gallery.
3. Fill the frontmatter (below). The Markdown body is the overview. Use `###` for headings inside it.
4. Link related posts with `relatedPosts`, or set `project: my-project` in a post. Both show on the project page.
5. The Work grid draws a line illustration for each project. Add one: see `.kiro/skills/abstract-illustration` and `src/components/sections/plates.ts`.
6. Run `pnpm verify`.

## Frontmatter

```yaml
---
title: Budget Tracker # 3-60 chars
summary: One line, 160 characters at most.
date: 2026-05-14 # year column and ordering
order: 1 # lower first
featured: true
show: true # false hides it from lists
status: Live # Live | In progress | Archived | Open source
role: Design, full-stack development
duration: 5 months
techStack: [TypeScript, Astro, PostgreSQL]
liveUrl: https://example.com # optional
repoUrl: https://github.com/you/repo # optional
thumbnail:
  image: ../../assets/projects/my-project/screenshot-1.png
  alt: 'Describe the image'
screenshots: # at least 1
  - image: ../../assets/projects/my-project/screenshot-1.png
    alt: 'Describe the image'
    caption: 'Optional caption'
youtubeId: jNQXAC9IVRw # optional, 11 characters
challenges: # at least 1
  - challenge: 'What was hard?'
    solution: 'How you solved it.'
learned: # at least 1
  - 'One lesson per line.'
outcome: 'Optional: what happened afterwards.'
relatedPosts: [debugging-habits] # optional, post slugs
---
```

The full schema is in `src/content.config.ts`.

## Screenshots

- Use real screenshots of the real product. Crop out personal data and tokens.
- Write alt text that says what is visible, not "screenshot".
- Desktop and mobile shots both help. Keep file sizes reasonable: images go through `astro:assets` and are resized at build time.

## Hide without deleting

Set `show: false`. The file stays, the project leaves the lists.
