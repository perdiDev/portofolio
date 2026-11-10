---
title: DevNotes CLI
summary: A tiny command-line tool for capturing, tagging, and searching developer notes as plain Markdown files.
date: 2026-09-10
order: 10
featured: true
status: Open source
role: Creator and maintainer
duration: 3 months, ongoing
techStack: [TypeScript, Node.js, Markdown, Git]
repoUrl: https://github.com/perdidev/devnotes # TODO: replace with the real repository
thumbnail:
  image: ../../assets/projects/dev-notes-cli/screenshot-1.png
  alt: Terminal window showing the devnotes commands new, search and list with their output
screenshots:
  - image: ../../assets/projects/dev-notes-cli/screenshot-1.png
    alt: Terminal session running devnotes new, devnotes search timeout and devnotes list with a tag filter
    caption: Create, search, and list notes without leaving the terminal.
  - image: ../../assets/projects/dev-notes-cli/screenshot-2.png
    alt: Terminal output of devnotes search with matching note file names and surrounding context lines
    caption: Search shows the matching file and a line of context around each hit.
  - image: ../../assets/projects/dev-notes-cli/screenshot-3.png
    alt: Contents of the devnotes config.toml file with editor, directory, sync and template settings
    caption: One small TOML file configures the editor, folder, templates, and Git sync.
challenges:
  - challenge: Startup time. A Node CLI that takes 400 ms to print its help feels sluggish when you run it dozens of times a day.
    solution: I bundled the CLI into a single file, loaded heavy modules lazily, and avoided a framework for argument parsing. Cold start dropped to roughly 60 ms.
  - challenge: Notes live in plain Markdown, so searching has to be fast without a database that could drift out of sync with the files.
    solution: Search streams the files and uses a simple inverted index cached in a hidden folder. The cache is disposable and rebuilt automatically when file modification times change.
  - challenge: Syncing notes across machines without inventing a sync protocol.
    solution: The notes folder is just a Git repository. The tool commits after each change and pushes in the background, and conflicts are Git conflicts, which everyone already knows how to resolve.
learned:
  - The most useful feature of a tool you run daily is how fast it starts.
  - Boring file formats (Markdown, TOML, Git) are what make a tool trustworthy over the years.
  - Disposable caches are easier to get right than synchronized databases.
outcome: The tool has about 40 stars, a handful of outside contributors, and a notes folder of more than 600 entries that I actually search. Several articles on this blog started life as a note captured with it.
relatedPosts:
  - linux-terminal-essentials
  - shell-aliases-and-functions
---

DevNotes is a command-line tool that turns the habit of jotting things down into a one-line command. `devnotes new "Fix flaky test in CI"` creates a dated Markdown file, opens it in your editor, and files it in a folder you can read with any other tool.

### Design goals

- **Plain text first.** Every note is a Markdown file with a little front matter. No database, no lock-in.
- **Fast enough to disappear.** If the command is slower than opening an editor, you stop using it.
- **Composable.** Output is line-oriented, so it works with `grep`, `fzf`, and pipes like any other Unix tool.

### What it does

You can create notes from templates, search them with context, list them by tag or date, and optionally sync the folder through Git. That is the entire feature list, on purpose.
