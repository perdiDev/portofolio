---
title: HySkySFC - PLTD Selayar App
summary: Android app for PLN Indonesia Power UPPLTD Selayar that plans diesel power plant load around the available solar supply.
date: 2025-12-08
order: 1
featured: false
status: Live
role: Fullstack Software Engineer (Mobile)
duration: 4 months so far
techStack: [Flutter, Golang, VPS Cloud, Azure Cloud, Docker]
thumbnail:
  image: ../../assets/projects/hyskysfc/screenshot-1.png
  alt: Three phone screens of the HySkySFC app showing the dashboard, the Data PLTS page and the Data PLTD page
screenshots:
  - image: ../../assets/projects/hyskysfc/screenshot-1.png
    alt: Three phone screens side by side, the dashboard with Total Beban and Prioritas fields, the Data PLTS page and the Data PLTD page
    caption: The three main screens, the dashboard, solar (PLTS) data and diesel (PLTD) engine data.
  - image: ../../assets/projects/hyskysfc/screenshot-2.png
    alt: PT PLN IP UPPLTD Selayar splash screen next to the dashboard with Input Data PLTS and Input Data PLTD buttons and a list of time slots
    caption: The app opens on the UPPLTD Selayar splash screen, then the dashboard lists the load plan per time slot.
  - image: ../../assets/projects/hyskysfc/screenshot-3.png
    alt: Data PLTS page with an Input File Excel button and a start and end time range, next to the Data PLTD page with a Tambah Mesin PLTD button
    caption: Solar data is imported from an Excel file and filtered by time range, while each diesel engine is added by hand.
challenges:
  - challenge: Solar output data at the plant was recorded in Excel spreadsheets, not in a system the app could read.
    solution: The PLTS page imports the Excel file directly and lets operators narrow the data to a start and end time, so no one has to retype readings.
  - challenge: The plant runs several diesel engines with different characteristics, and the right one to run first depends on the situation.
    solution: Each engine is registered once on the PLTD page, and the dashboard lets the operator choose which priority to plan by before the load is split across engines.
  - challenge: Operators need to see the plan for the coming hours at a glance on a phone.
    solution: The dashboard shows the total load in kW and a collapsible list of time slots, with a reload button to pull the latest data from the Go backend.
learned:
  - Tools for plant operators work best when they accept the files people already use, such as Excel.
  - Clear empty states matter in field apps, because a blank screen looks like a bug.
  - Running the Go API in Docker made it easy to move between a VPS and Azure.
outcome: The app is used by PLN Indonesia Power UPPLTD Selayar to combine solar and diesel data in one place and plan which PLTD engines to run as the PLTS supply changes.
relatedPosts: []
---

**HySkySFC** is an Android app built for **PT PLN Indonesia Power UPPLTD Selayar**, a power plant unit on Selayar Island that runs diesel engines (PLTD) alongside a solar plant (PLTS). The app helps operators plan how much load each diesel engine should carry, based on how much power the solar plant is supplying.

### Key Features

**Dashboard**: Shows the total load (Total Beban, in kW), a priority selector (Prioritas Berdasarkan) and a list of time slots. Each slot expands to show the plan for that moment.

**Solar (PLTS) data**: Operators upload an Excel file with solar output and filter it by a start and end time (Rentang Waktu).

**Diesel (PLTD) data**: Operators add each diesel engine at the plant (Tambah Mesin PLTD), so the app knows which machines are available.

**Reload**: A Muat Ulang Data button fetches the latest data from the server.

### Technology Stack

The mobile app is written in **Flutter**. The backend is a **Golang** API packaged with **Docker** and deployed on a **VPS** and **Azure Cloud**.
