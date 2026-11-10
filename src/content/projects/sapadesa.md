---
title: SapaDesa - KKN Bonto Karaeng
summary: AI apps that help parents for having conversetion with adhd children, record the conversetion and get the summary for analyse by profesional.
date: 2026-01-07
order: 7
featured: false
status: Live
role: Fullstack Web Developer
duration: 4 months so far
techStack: [Laravel, Livewire, PostgresSQL, AWS Cloud]
repoUrl: https://github.com/perdidev/childcare # TODO: replace with the real repository
thumbnail:
  image: ../../assets/projects/portfolio-engine/screenshot-1.png
  alt: Landing page of the Site Starter template with the headline Write. Ship. Rank. and three feature cards
screenshots:
  - image: ../../assets/projects/portfolio-engine/screenshot-1.png
    alt: Site Starter landing page with the headline Write. Ship. Rank. and cards for SEO, zero JavaScript and typed content
    caption: The starter ships with a calm, typography-first home page.
  - image: ../../assets/projects/portfolio-engine/screenshot-2.png
    alt: Lighthouse report showing four perfect scores of 100 for performance, accessibility, best practices and SEO
    caption: Every template is audited with Lighthouse before a release.
  - image: ../../assets/projects/portfolio-engine/screenshot-3.png
    alt: Markdown file with front matter defining a title, description, date, category and tags for a blog post
    caption: Posts are Markdown files validated by a typed schema at build time.
challenges:
  - challenge: Making the defaults good enough that a new site scores 100 on Lighthouse without any tuning.
    solution: I treated the Lighthouse run as a test in CI. A change that lowers a score fails the build, so regressions are caught in the pull request instead of after launch.
  - challenge: SEO metadata that is easy to forget, such as canonical URLs, Open Graph images, and structured data.
    solution: All of it is generated from one component and one typed helper, driven by the same frontmatter the page already needs. There is nothing to remember to add.
  - challenge: Keeping the template opinionated without making it hard to change.
    solution: Site-wide values live in a single config file, and every feature degrades gracefully when its environment variables are missing.
learned:
  - A starter is a product. Documentation and sensible defaults matter as much as the code.
  - Failing the build on invalid content is kinder than finding broken pages in production.
  - Small, well-named components make a codebase approachable to strangers.
outcome: Still in progress, but already running this very site. The next steps are a visual theme switcher for forks, a CLI to scaffold new posts, and a public changelog.
relatedPosts:
  - effective-code-reviews
  - writing-good-commit-messages
  - debugging-habits
---

Site Starter is the template behind this blog. It is an Astro project that gives you a fast, accessible, search-friendly site as soon as you clone it: a blog, a small project showcase, an RSS feed, a sitemap, and social images that generate themselves.

### Principles

The starter follows a few strict rules: content first, no JavaScript unless it earns its place, and every page must be fully readable without a script. Everything else follows from those three.

### Status

It is under active development. I am using this site as the proving ground: whenever something annoys me while writing a post, it becomes an issue in the starter.
