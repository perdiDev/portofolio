---
title: Budget Tracker
summary: A privacy-first personal budgeting app that imports bank exports, categorizes spending, and shows where the money goes.
date: 2026-05-14
order: 1
featured: true
status: Live
role: Design, full-stack development
duration: 5 months
techStack: [TypeScript, Astro, PostgreSQL, Node.js, Tailwind CSS]
liveUrl: https://budget.example.com # TODO: replace with the real demo URL
repoUrl: https://github.com/perdidev/budget-tracker # TODO: replace with the real repository
thumbnail:
  image: ../../assets/projects/budget-tracker/screenshot-1.png
  alt: Dashboard of the Budget Tracker app with income, spending and savings cards above a spending-over-time line chart
screenshots:
  - image: ../../assets/projects/budget-tracker/screenshot-1.png
    alt: Budget Tracker dashboard showing monthly income, spending, savings and a line chart of spending over time
    caption: The overview page answers one question first, "am I on track this month?"
  - image: ../../assets/projects/budget-tracker/screenshot-2.png
    alt: Transactions table listing recent purchases with dates, merchants and signed amounts
    caption: Transactions are imported from CSV exports and categorized automatically.
  - image: ../../assets/projects/budget-tracker/screenshot-3.png
    alt: Budgets page with progress bars for rent, groceries, transport, dining out, subscriptions and health
    caption: Each budget turns amber at 90% so overspending is visible before it happens.
youtubeId: jNQXAC9IVRw # TODO: replace with the real walkthrough video ID (this is a placeholder)
challenges:
  - challenge: Every bank exports CSV files in a slightly different shape, with different date formats, decimal separators, and column names.
    solution: I wrote a small mapping layer, one adapter per bank, that normalizes every row into the same typed transaction. Adding a bank is now one file and a handful of fixtures.
  - challenge: Automatic categorization felt magical when it worked and infuriating when it guessed wrong.
    solution: Rules are explicit and ordered, matching on merchant text, and every transaction shows which rule categorized it. Corrections become new rules instead of silent exceptions.
  - challenge: Dashboards that recompute everything on each request got slow once a few years of transactions were loaded.
    solution: Monthly totals are pre-aggregated in PostgreSQL and refreshed on import, so the overview is a handful of indexed reads.
learned:
  - Typed boundaries pay for themselves. Parsing untrusted CSV into a strict type at the edge removed a whole class of bugs downstream.
  - Explainable rules beat clever heuristics for anything involving money.
  - Pre-aggregating data is easier than it sounds when the write path is a single import job.
outcome: I use it every week, and it replaced a spreadsheet I had maintained for six years. Importing a month of transactions takes under a second, and the dashboard renders in about 80 ms.
relatedPosts:
  - typescript-generics-in-practice
  - async-await-in-javascript
---

Budget Tracker is a small web app for people who want to understand their spending without handing their bank data to a third party. You export a CSV from your bank, drop it into the app, and it does the boring parts: cleaning up merchant names, assigning categories, and keeping a running view of each budget.

### Why I built it

Most budgeting tools want a live connection to your accounts and a monthly fee. I wanted something I could run myself, with data that stays in a database I control, and a dashboard that answers a single question when it opens: am I on track this month?

### How it works

The import pipeline is a chain of small, typed steps: parse the file, normalize each row, apply categorization rules, and write the result in a single transaction. The interface is mostly server-rendered pages with a little progressive enhancement, which keeps it fast on old phones and easy to reason about.
