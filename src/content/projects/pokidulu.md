---
title: Pokidulu
summary: Pre-order management platform for organizations. Build a catalog, share an order link, and track orders, payments and balance from one dashboard.
date: 2026-12-08
order: 6
featured: false
status: Live
role: Fullstack Web Developer
duration: 4 months so far
techStack: [Laravel, Filament, Livewire, Laravel Reverb, Midtrans Payment]
thumbnail:
  image: ../../assets/projects/pokidulu/screenshot-2.png
  alt: Pokidulu organization dashboard with revenue, order, product and member cards above the latest orders list
screenshots:
  - image: ../../assets/projects/pokidulu/screenshot-1.png
    alt: Pokidulu landing page with the headline Urus Pre-Order Jadi Gampang and a preview of the dashboard
    caption: The landing page explains the product in one sentence and links straight to sign-up.
  - image: ../../assets/projects/pokidulu/screenshot-2.png
    alt: Pokidulu organization dashboard with revenue, order, product and member cards above the latest orders list
    caption: The dashboard shows revenue, pending orders, products, members, available balance and the latest orders.
  - image: ../../assets/projects/pokidulu/screenshot-3.png
    alt: Product list with photo, category, price, stock, type and status columns, split into active, draft and archived tabs
    caption: Products are managed in a table with status tabs and per-row status control.
  - image: ../../assets/projects/pokidulu/screenshot-4.png
    alt: Order list with order code, customer, order status, payment status and total columns
    caption: Every order has a code, a customer, an order status and a payment status.
challenges:
  - challenge: Organizations run pre-orders through chat and spreadsheets, so payments and orders drift apart.
    solution: Orders and payments live in one system. Each order has a code, an order status and a separate payment status, and Midtrans handles the payment.
  - challenge: One account has to manage several organizations without mixing their data.
    solution: Every organization has its own workspace, with its own catalog, orders, finance and members.
learned:
  - Separating the order status from the payment status makes the order list much easier to read.
  - Admin screens built from table, filter and form building blocks are fast to extend as new needs come up.
outcome: Live and still in development. The platform already covers events, products, orders, promos, finance and member management for each organization.
---

Pokidulu helps communities and organizations run pre-orders without spreadsheets. An organization sets up its profile, builds a catalog of products or events, shares an order link, and follows incoming orders and payments from a single dashboard.

### What it covers

- Events and products, with stock, price, category and draft or archived states.
- Orders with a customer, an order status and a payment status, plus a public page to track an order.
- Promos, organization finance with an available balance, and member management.

### Status

It is under active development. I work on it as a fullstack developer, from the Laravel backend to the admin screens.
