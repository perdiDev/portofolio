---
title: Wisataki
summary: Scan QR app for record destination trip to share that you complete your journey to beautiful place.
date: 2024-05-14
order: 1
featured: true
status: Archived
role: Fullstack Software Engineer (Mobile)
duration: 3 months
techStack: [Flutter, Supabase, Firebase Authentication, Firestore, Figma]
repoUrl: https://github.com/perdiDev/wisataki-try
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
challenges:
  - challenge: Connecting app to google authentication always failed when test the build.
    solution: Implement the google auth always need 2 type of environment, one for localhost or development, and one for production.
learned:
  - Try for the fist time google authentication with android application, then read their username and birth-of-date.
  - Implement simple Scanner for reading qr code inside mobile application and proccess the qr data.
  - Connecting suppabase for the database with google firestore, because it free enough for prototyping
outcome: The app bring me to get my first achievement on collage at FIT Competition as one of the inovative solution for helping smart country.
---

Wisataki is an app for healp tourist destination going easy when enter to destination spot without waiting the long queue with just scanning the qr code from the destination spot record. 

### Why I built it

I always going to visit destination spot on my area, then i get angry when i need to alway write it down my name, origin of residence, and make long listing queue just for enjoy a beatiful place. The motivation being bad, from want to enjoy nature being angry just because of waiting before entering.

### How it works

Just login for first time, then everytime you go holiday everywhere. Just open the app, scan the qr, then enjoy your holiday.
