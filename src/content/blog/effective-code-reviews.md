---
title: "How to Run Effective Code Reviews"
description: "A practical guide to code review from both sides: what authors should prepare, how reviewers should comment, and how to tell if your process is healthy."
pubDate: 2026-03-24
category: Software Engineering
tags: [code-review, collaboration, workflow, git]
draft: false
project: portfolio-engine
---

## What a review is for

I think of code review as a conversation with three goals: catch correctness problems, check that the design fits the codebase, and spread knowledge so that more than one person understands each change.

Style policing is not on that list. Arguments about quotes, import order, or line length are a waste of human attention. Let a formatter and a linter settle them in CI, and keep reviewer energy for things a tool cannot judge.

## The author's side

Most of what makes a review good happens before the reviewer opens the page.

### Keep pull requests small

A change that fits on one screen gets read. A 1,500-line change gets skimmed and approved. In my blog starter, small PRs worked well: each one did a single thing, and reviews usually finished the same day.

### Explain the change and review it yourself

Link the issue, describe the approach, and say what you are unsure about. A template makes that the default:

```md title=".github/pull_request_template.md"
## What and why

<!-- One or two sentences. Link the issue: Closes #123 -->

## How to test

<!-- Commands or steps a reviewer can follow -->

## Notes for the reviewer

<!-- Risky areas, trade-offs, things you want a second opinion on -->
```

Before requesting review, read your own diff as if someone else wrote it. This command gives a quick overview of what the PR touches:

```bash
git diff main...HEAD --stat
```

I regularly find leftover debug lines and unrelated edits this way. Clean commit messages help here too, see [Writing Good Commit Messages](/blog/writing-good-commit-messages/).

## The reviewer's side

- Respond within one working day, even if only to say when you will get to it.
- Read the description first, then the tests, then the diff. Tests show intended behavior.
- Ask questions instead of giving orders: "What happens if the list is empty?" invites a better answer than "Handle empty lists."
- Praise good decisions. Review is not only a hunt for faults.

### Label your comments

Prefixes remove ambiguity about what is required:

- `blocking:` must be fixed before merge.
- `question:` I do not understand yet, and I may be wrong.
- `nit:` a minor preference, take it or leave it.

A suggestion can be as small as a code change in the comment:

```diff
- const items = posts.filter((p) => p.data.draft === false);
+ const items = posts.filter((p) => !p.data.draft);
```

Something like "nit: `!p.data.draft` also covers a missing field" tells the author this is optional.

## What I look for

A short checklist keeps me consistent:

- **Behavior:** does it do what the description says?
- **Edge cases:** empty input, large input, failures, concurrency.
- **Tests:** do they fail without the change?
- **Naming:** will the next reader understand it?
- **Security:** untrusted input, secrets, permissions.
- **Performance:** anything accidentally quadratic in a hot path?
- **Docs:** does a README or comment need an update?

## When you disagree

Separate "must fix" from "preference". If it is a preference, say so and let the author decide. If it is a real disagreement, move to a call or a chat rather than a fifth round of comments, then write the outcome back in the PR so the decision is not lost. When two reasonable designs remain, the author who will maintain the code usually gets the final say.

## Measuring review health

I only track one number: time to first review. Long waits cause large PRs, context switching, and resentment. Review size and the number of back-and-forth rounds are useful secondary signals. Treat them as conversation starters for the team, never as individual performance metrics.

## Next steps

Add a pull request template to your repository this week, and agree on comment labels with your team. When the next review stalls, check whether the PR is simply too big. Better debugging also makes reviews easier, so [debugging habits](/blog/debugging-habits/) is a good companion read.
