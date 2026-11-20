---
title: SapaDesa - KKN Bonto Karaeng
summary: Village administration web app for Desa Bonto Karaeng that manages resident data and creates official letters from templates, built during KKN-T Unhas.
date: 2026-01-07
order: 7
featured: false
status: Live
role: Fullstack Web Developer
duration: 4 months so far
techStack: [Laravel, Livewire, PostgreSQL, AWS Cloud]
thumbnail:
  image: ../../assets/projects/sapadesa/login.png
  alt: SapaDesa login page with a rice field and mountain background and the Portal Masuk sign-in card
screenshots:
  - image: ../../assets/projects/sapadesa/login.png
    alt: SapaDesa login page with the title Sistem Aplikasi Pelayanan Administrasi Desa and a Portal Masuk card asking for email and password
    caption: Village staff sign in through the Portal Masuk page with their email and password.
  - image: ../../assets/projects/sapadesa/manajemen-penduduk.png
    alt: Penduduk admin page with Terverifikasi, Menunggu Konfirmasi and Ditolak tabs, filters for dusun, gender, religion and marital status, and a table of residents
    caption: The resident list is split into verified, pending and rejected entries, with filters, search, import, export and a registration QR code.
  - image: ../../assets/projects/sapadesa/pendaftaran-penduduk-mandiri.png
    alt: Public Layanan Desa Bonto Karaeng form with sections for identity, birth data and home address, ending with a Daftar Sekarang button
    caption: Residents can register themselves with their NIK, family card number, birth data and address. Each entry waits for staff verification.
  - image: ../../assets/projects/sapadesa/pembuatan-surat.png
    alt: Buat Surat page with fields for letter template, resident, letter number, date and purpose, next to a live preview of a Surat Keterangan Usaha with the village letterhead
    caption: Staff pick a template and a resident, fill in the details, and see the letter in its print format before saving.
  - image: ../../assets/projects/sapadesa/pengajuan-surat.png
    alt: Kode QR Pengajuan Surat dialog with a QR code, the request page URL, and buttons to download the code or copy the URL
    caption: A QR code links residents to the self-service letter request page. Staff can download it for printing or copy the URL.
challenges:
  - challenge: Entering data for every resident by hand at the village office is slow and depends on a few staff members.
    solution: Residents fill in their own data through a public registration form opened from a QR code. New entries wait under Menunggu Konfirmasi until staff verify or reject them, and staff can still import and export resident data in bulk.
  - challenge: Each type of letter needs the official letterhead, a letter number, the resident's details, and fields that only apply to that letter type.
    solution: Letters are built from templates managed in Template Surat. Staff choose a template and a resident, the resident's data is filled in for them, the number is generated if left empty, and extra fields such as Nama Usaha appear for a Surat Keterangan Usaha. A live preview shows the final print layout.
  - challenge: Residents had to visit the village office to ask for a letter.
    solution: A QR code points to the letter request page, so residents can submit a request from their phone. Requests show up in Pengajuan Surat, where staff process or reject them.
learned:
  - Village staff trust a system more when the printed letter looks exactly like the paper format they already use.
  - Self-registration saves time only if staff still check the data before it is used in official documents.
  - A printed QR code is an easy way to bring residents to a web form they would never type the address of.
outcome: Built for the village government of Desa Bonto Karaeng, Kecamatan Sinoa, Kabupaten Bantaeng, as part of KKN-T Universitas Hasanuddin Gelombang 115.
relatedPosts: []
---

**SapaDesa** (Sistem Aplikasi Pelayanan Administrasi Desa) is a web app for the village administration of **Desa Bonto Karaeng** in Kecamatan Sinoa, Kabupaten Bantaeng. It was built during **KKN-T Universitas Hasanuddin Gelombang 115**.

### How It Works

1. Residents scan a QR code and register their own data, or staff add and import residents in the admin panel.
2. Staff review new registrations and mark them as verified or rejected.
3. Residents request a letter through the self-service page linked from another QR code.
4. Staff create the letter from a template, check the print preview, and print it with the village letterhead.

### Key Features

**Penduduk**: The resident database with verified, pending and rejected tabs, filters by dusun, gender, religion and marital status, NIK or name search, import, export and a registration QR code.

**Layanan Surat**: Letter requests (Pengajuan Surat), issued letters (Surat) and the letter templates (Template Surat).

**Data Wilayah**: The village's administrative areas, organised as Dusun, RW and RT.

**Manajemen Pengguna**: Accounts for the staff who use the admin panel.

**Pengaturan**: The village profile (Profil Desa) and the content of the public landing page.

### Technology Stack

The app is built with **Laravel** and **Livewire**, stores its data in **PostgreSQL**, and is deployed on **AWS Cloud**.
