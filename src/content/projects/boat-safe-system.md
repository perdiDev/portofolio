---
title: Boat Safe System - IOTNoz
summary: Real-time boat monitoring system for maritime safety, providing live vessel tracking, accident detection, and 24/7 surveillance at sea.
date: 2024-08-15
order: 3
featured: true
status: Live
role: Fullstack Web & IoT Engineer
duration: 6 months
techStack: [Next.js, Firebase, Mapbox, React, TypeScript, Arduino, C++, IoT Sensors, Hardware Integration]
repoUrl: https://github.com/IOTNOZ
liveUrl: https://boat-alert-system-web.vercel.app/
thumbnail:
  image: ../../assets/projects/boat-safe-system/screenshot-1.png
  alt: Boat Safe System live map with a boat marker on OpenStreetMap tiles and a Live Tracking badge
screenshots:
  - image: ../../assets/projects/boat-safe-system/screenshot-1.png
    alt: Full-width Leaflet map with a blue boat marker, zoom controls and a Live Tracking badge with the current time in WIB
    caption: The home page opens on a live map that follows the boat's GPS position in real time.
  - image: ../../assets/projects/boat-safe-system/screenshot-2.png
    alt: Product page with the red sensor box on the left and Latar Belakang and Produk Akhir text on the right
    caption: The product page explains the background and what the final device does.
  - image: ../../assets/projects/boat-safe-system/screenshot-3.png
    alt: Sistem Alat page showing the shore-side Sistem Darat unit next to its description
    caption: Two hardware units, one on shore (Sistem Darat) and one on the boat (Sistem Laut), talk over LoRa.
  - image: ../../assets/projects/boat-safe-system/screenshot-4.png
    alt: Detail Komponen grid with cards for the ESP32, LoRa Ra-02 and MPU 9250 modules
    caption: Each component (ESP32, LoRa Ra-02, MPU9250, GPS Neo 6M) is documented on the hardware page.
  - image: ../../assets/projects/boat-safe-system/screenshot-5.png
    alt: IOTNOZ 09 team page with an illustrated group photo and four member cards
    caption: The IOTNOZ 09 team behind the project.
  - image: ../../assets/projects/boat-safe-system/screenshot-6.png
    alt: Partner page with the Dosen Pembimbing note and the Yayasan Konservasi Laut Indonesia program card
    caption: Built with Yayasan Konservasi Laut (YKL) Indonesia for small-scale fishers.
  - image: ../../assets/projects/boat-safe-system/screenshot-7.png
    alt: Three phone screens showing the live map, the realtime monitoring hero and the product page
    caption: The whole site is responsive, including the map on small screens.
challenges:
  - challenge: Integrating real-time IoT sensor data from boats at sea with web dashboard for live tracking.
    solution: Built a robust Firebase real-time database architecture with WebSocket connections to ensure low-latency data transmission from Arduino-based boat sensors to the web interface.
  - challenge: Ensuring reliable GPS tracking and accident detection in maritime environments with limited connectivity.
    solution: Implemented offline data buffering on IoT devices with automatic sync when connection is restored, plus redundant sensor validation to reduce false alerts.
  - challenge: Creating an intuitive map interface that handles multiple vessels simultaneously without performance degradation.
    solution: Used efficient map clustering algorithms and optimized marker rendering with Mapbox to handle dozens of vessels smoothly on various devices.
learned:
  - Real-time IoT systems require careful consideration of network reliability and offline scenarios.
  - Hardware-software integration demands thorough testing across different environmental conditions.
  - Maritime safety applications need intuitive interfaces that work under stress and time pressure.
  - Efficient data synchronization patterns are crucial for systems dealing with intermittent connectivity.
outcome: Successfully deployed IoT boat monitoring system providing 24/7 maritime surveillance. The platform enables faster emergency response through real-time vessel tracking and automated accident detection alerts.
relatedPosts: []
---

**Boat Safe System** is a comprehensive IoT-based maritime monitoring solution designed to enhance safety at sea. The system combines hardware sensors installed on boats with a real-time web dashboard for continuous surveillance.

### Key Features

**Real-Time Monitoring**: The platform tracks vessel positions, movements, and status continuously using GPS and IoT sensors integrated with Arduino-based hardware.

**Accident Detection**: Automated alert system that detects anomalies and potential accidents, enabling rapid response and rescue operations.

**24/7 Surveillance**: Continuous monitoring infrastructure that provides around-the-clock maritime safety coverage.

**Live Position Tracking**: Interactive map interface showing real-time vessel locations and movement patterns for fleet management and safety coordination.

### Technology Stack

The web platform is built with **Next.js** and **TypeScript** for a robust, type-safe frontend. **Firebase** handles real-time data synchronization and authentication. **Mapbox** powers the interactive mapping features with smooth performance even when tracking multiple vessels.

On the hardware side, **Arduino** microcontrollers interface with GPS modules, accelerometers, and communication modules to collect and transmit vessel data. The system is designed for reliability in harsh maritime conditions.

### Impact

The Boat Safe System addresses critical maritime safety challenges by providing fishermen, boat operators, and maritime authorities with real-time visibility into vessel status and location. This enables faster response times during emergencies and better coordination for search and rescue operations.
