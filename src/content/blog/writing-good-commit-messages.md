---
title: "Writing Good Commit Messages"
description: "How to write commit messages that explain why a change happened, from subject line to footers, and how to keep history clean with amend and autosquash."
pubDate: 2025-07-08
category: Software Engineering
tags: [git, workflow, collaboration]
draft: false
---

## Why history is documentation

A commit message is the one piece of documentation that is written at the exact moment a change is made. Six months from now, someone (very often me) will run `git blame` on a strange line and wonder why it exists. The diff shows what changed. Only the message can say why.

Good messages also make reviews faster and `git bisect` output readable. I treat the message as part of the change, not as paperwork after it.

## Anatomy of a commit message

A message has up to three parts, separated by blank lines:

- **Subject:** imperative mood, around 50 characters, no trailing period.
- **Body:** explains why the change was needed, wrapped at about 72 characters.
- **Footers:** references and credits, one per line.

### The subject line

I write it so it completes the sentence "If applied, this commit will ...". "Add retry to the upload client" works. "Added retry" and "Adding retry" do not. A short subject also survives `git log --oneline` without being truncated.

### The body and footers

The body is for context the diff cannot carry: the symptom, the constraint, the alternative you rejected. Skip the line-by-line retelling of the code. Footers such as `Fixes #123` let the tracker close the issue, and `Co-authored-by` gives credit to pair programming partners.

Passing `-m` twice gives you a subject and a body without opening an editor:

```bash
git commit -m "Fix off-by-one in pagination offset" -m "The offset was computed from the page number instead of the
zero-based page index, so the first page skipped ten items.
Use page - 1 and add a regression test.

Fixes #123
Co-authored-by: Ana Silva <ana@example.com>"
```

## Bad messages and better ones

Most weak messages fail the same way: they say nothing a reader could search for.

| Before | After |
| --- | --- |
| fix stuff | Fix off-by-one in pagination offset |
| updates | Bump sharp to 0.33 to fix ARM build failures |
| WIP | Extract token parsing into its own module |
| address review | Reject empty slugs in the post loader |

The "after" versions name the thing that changed and hint at the reason. You can check how your own history reads at any time:

```bash
git log --oneline -5
```

## Keep commits atomic

One commit should hold one logical change. If my working tree contains a refactor and a bug fix, I stage them separately with `git add -p`, which walks through each hunk and asks whether to include it:

```bash
git add -p
git commit
```

Small commits are easier to review and revert. If you cannot summarize a commit without the word "and", it is probably two commits. This pairs well with the habits in [How to Run Effective Code Reviews](/blog/effective-code-reviews/).

## Fixing history before you share it

Typo in the last message, or a forgotten file? Amend it:

```bash
git commit --amend
```

For a mistake in an older commit on my own branch, I create a fixup commit and let Git move it into place:

```bash
git commit --fixup a1b2c3d
git rebase -i --autosquash main
```

Only rewrite commits that nobody else has based work on. Once a branch is shared, add a new commit instead.

## A note on Conventional Commits

Prefixes like `feat:` and `fix:` make changelogs and version bumps automatable, and they force a small amount of classification. The trade-off is that the prefix eats into your 50 characters, and people often pick a type just to satisfy a linter while the message itself stays vague. I find them worthwhile when tooling consumes them and optional otherwise.

## A convention for your team

Agreeing on a few rules matters more than which rules you pick:

- Imperative subject, about 50 characters, no period.
- A body whenever the reason is not obvious from the diff.
- A reference to the issue or ticket in a footer.
- Squash fixup commits before merging.

Write this down in your contributing guide, then try it for two weeks. The next time you chase a bug with [good debugging habits](/blog/debugging-habits/), notice how often the answer is sitting in `git log`.
