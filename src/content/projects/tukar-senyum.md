---
title: Tukar Senyum
summary: An online store for custom pipe-cleaner flower bouquets. Customers browse the catalog, design a bouquet, pay online, and track the order.
date: 2026-12-08
order: 4
featured: false
status: Live
role: Fullstack Web Developer
duration: 4 months so far
techStack: [Next.js, Laravel, Filament, Midtrans Payment]
repoUrl: https://github.com/perdidev/childcare # TODO: replace with the real repository
thumbnail:
  image: ../../assets/projects/tukar-senyum/screenshot-1.png
  alt: Tukar Senyum home page with the headline Rangkai Cerita Lewat Bunga and a photo of a pink rose bouquet in green wrapping
screenshots:
  - image: ../../assets/projects/tukar-senyum/screenshot-1.png
    alt: Tukar Senyum home page with the headline Rangkai Cerita Lewat Bunga and a photo of a pink rose bouquet in green wrapping
    caption: The storefront home page, in Indonesian, with a clear path to the catalog and the bouquet designer.
  - image: ../../assets/projects/tukar-senyum/screenshot-2.png
    alt: Curated collection section showing three bouquets with badges and starting prices
    caption: The curated collection shows each bouquet with a badge and a starting price.
  - image: ../../assets/projects/tukar-senyum/screenshot-3.png
    alt: Admin login page with the Tukar Senyum logo, email and password fields
    caption: The Laravel back office where the owner manages products and orders.
challenges:
  - challenge: Customers want a bouquet made their way, but a free-form order is hard to price and hard to produce.
    solution: Products have a starting price, and color and size are options on top of it. The custom bouquet flow collects the choices in one form, so the owner receives a complete order instead of a chat thread.
  - challenge: Keeping the storefront fast and the back office simple for a small, online-only shop.
    solution: The storefront is a Next.js app and the back office is a separate Laravel app with an admin panel. The shop owner edits catalog content there without touching the storefront code.
  - challenge: Customers ask where their order is, and payment has to be confirmed without manual checking.
    solution: Payments go through Midtrans, and the order status updates when the payment is confirmed. A Cek Pesanan page lets customers look up an order themselves.
learned:
  - A small shop needs a back office the owner can use without help more than it needs extra features.
  - Splitting the storefront and the back office keeps each one small and easy to change.
  - Payment flows need to be tested against failure and retry cases, not only the happy path.
outcome: Live and in use. The next steps are more catalog filters and order notifications for customers.
relatedPosts:
  - effective-code-reviews
  - writing-good-commit-messages
  - debugging-habits
---

Tukar Senyum is an online store for custom bouquets made from pipe-cleaner (bulu kawat) flowers. The tagline is "Bunga Abadi untuk Senyum yang Abadi": flowers that last, for smiles that last. The shop is online only and ships from Pangkep, South Sulawesi.

### What customers can do

Customers browse a curated collection, open the full catalog, or design their own bouquet by choosing colors and size. They pay online and use the order lookup page to follow the order until it arrives.

### How it is built

The public storefront runs on Next.js. A separate Laravel app with an admin panel handles products, orders, and payment confirmation through Midtrans.
