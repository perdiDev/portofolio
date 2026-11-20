---
title: Wisataki
summary: Scan QR app for record destination trip to share that you complete your journey to beautiful place.
date: 2024-05-14
order: 5
featured: true
status: Archived
role: Fullstack Software Engineer (Mobile)
duration: 3 months
techStack: [Flutter, Supabase, Firebase Authentication, Firestore, Figma]
repoUrl: https://github.com/perdiDev/wisataki-try
thumbnail:
  image: ../../assets/projects/wisataki/screenshot-1.png
  alt: Three phone screens of the Wisataki app showing the home page, the QR scanner and the group size confirmation
screenshots:
  - image: ../../assets/projects/wisataki/screenshot-1.png
    alt: Three phone screens side by side, the home page with a Scan Now card, the camera scanning a QR code and the group size confirmation dialog for Sumpa Bitta
    caption: A visitor taps Scan Now, points the camera at the destination's QR code and only confirms the group size.
  - image: ../../assets/projects/wisataki/screenshot-2.png
    alt: Three phone screens side by side, the onboarding page, the Google sign-in page and the Sumpa Bitta destination detail page
    caption: Onboarding and Google sign-in happen once. Each destination has a detail page with its visitor count and description.
  - image: ../../assets/projects/wisataki/screenshot-3.png
    alt: Three phone screens side by side, the manager QR code page with a download button, the add destination form and the visitor profile with a visit counter
    caption: Managers add a destination and download its QR code for the entrance. The visitor profile counts completed trips.
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
