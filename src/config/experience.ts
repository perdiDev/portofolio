/** Work history shown in the Experience section. Companies are ordered newest first. */

export interface ExperienceRole {
  /** Job title for this step, e.g. "Senior Frontend Engineer". */
  readonly title: string;
  /** e.g. "Full-time", "Internship", "Contract". */
  readonly employmentType?: string;
  /** "YYYY-MM". */
  readonly startDate: string;
  /** "YYYY-MM", or `null` for a role that's still ongoing. */
  readonly endDate: string | null;
  readonly description: string;
}

export interface ExperienceEntry {
  readonly company: string;
  /** Leave empty to render the company name as plain text instead of a link. */
  readonly companyUrl?: string;
  readonly location?: string;
  /** Newest first. A company with a single role still uses a one-item array. */
  readonly roles: readonly ExperienceRole[];
}

/** Companies ordered newest first. End date with null value mean work present  */
export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    company: 'PLN IP UPPLTD Selayar',
    companyUrl: '',
    location: 'Selayar, Indonesia · Remote',
    roles: [
      {
        title: 'Android Developer - Flutter',
        employmentType: 'Freelence',
        startDate: '2025-07',
        endDate: '2025-08',
        description:
          '• Automated operational workflows by building an algorithm that calculates and ranks diesel generator supply priority by efficiency, fully replacing the manual calculation process. • Built the mobile frontend with Flutter, applying Clean Architecture and BLoC state management to ensure a scalable, modular, and maintainable codebase.',
      },
      {
        title: 'Backend Developer',
        employmentType: 'Freelence',
        startDate: '2025-06',
        endDate: '2025-07',
        description:
          '• Designed and developed an end-to-end backend architecture using Golang and PostgreSQL, enabling centralized recording of solar and diesel energy forecast data. • Managed configuration and deployment on Microsoft Azure VM, delivering a reliable integrated system used daily by 5 operators and 1 supervisor in the field.',
      },
    ],
  },
  {
    company: 'PT. Rise Lanskap Hortikultura',
    companyUrl: 'https://okegarden.com/',
    location: 'Depok, Indonesia · Remote',
    roles: [
      {
        title: 'Fullstack Software Engineer',
        employmentType: 'Internship',
        startDate: '2025-09',
        endDate: '2025-12',
        description:
          '• Restructured the database architecture and expanded table relationships in an internal system to support business insight extraction, enabling analytics on plant preference trends (e.g., home gardens and dried plants). • Refactored Laravel backend API endpoints to optimize data flow for other internal systems, specifically streamlining the garden construction cost estimation (RAB) module. • Improved customer UX by fixing frontend issues, including responsiveness problems and truncated text in plant catalog card components.',
      },
    ],
  },
  {
    company: 'PT Celebes Solusi Digital',
    companyUrl: 'https://companieshouse.id/celebes-solusi-digital',
    location: 'Makassar, Indonesia · On Site',
    roles: [
      {
        title: 'Fullstack Developer',
        employmentType: 'Full-time',
        startDate: '2024-08',
        endDate: '2025-03',
        description:
          '• Led architecture design and development for key projects, and managed server deployment strategies to meet clients’ scalability requirements. • Integrated healthcare facility systems with the Indonesian Ministry of Health’s SatuSehat API using Laravel, owning the end-to-end synchronization of electronic medical record (EMR) data from sandbox testing through stable production operation. • Architected a complex multi-level Role-Based Access Control (RBAC) system for a BNSP professional certification platform (LSP Admin, Assessor, Assessee) using Spatie, Livewire, and Filament to accelerate rapid development. • Developed an end-to-end internal operations management system for an Umrah travel platform and two other client projects, focusing on digitizing ticket administration and pilgrim database management.',
      },
      {
        title: 'Instructor Ngoding Holiday Camp',
        employmentType: 'Full-time',
        startDate: '2024-12',
        endDate: '2025-1',
        description:
          '• Taught foundational JavaScript to 45 learners, ranging from high school students to early-year university students. • Designed and delivered a hands-on DOM manipulation mini-project (a browser-based game), with a 95% completion rate among participants.',
      },
    ],
  },
  {
    company: 'Coder Institute',
    companyUrl: 'https://www.instagram.com/coderinstitute/',
    location: 'Gowa, Indonesia · On Site',
    roles: [
      {
        title: 'Head of Web Development',
        employmentType: 'Part Time',
        startDate: '2024-02',
        endDate: '2025-01',
        description:
          '• Led the planning and execution of the website division’s work programs, fostering strategic collaboration among members to ensure every initiative ran effectively. • Organized mentoring and technical teaching sessions focused on web development to strengthen team members’ programming skills.',
      },
    ],
  },
  {
    company: 'Google Developer Student Club',
    companyUrl: 'https://www.instagram.com/gdgocunhas/',
    location: 'Gowa, Indonesia · On Site',
    roles: [
      {
        title: 'Core Team - Backend Technical',
        employmentType: 'Part Time',
        startDate: '2023-09',
        endDate: '2024-09',
        description:
          '• Mentored 75 GDSC members as a backend mentor, introducing core server-side web development concepts and guiding participants through them step by step. • Designed the backend web development syllabus and actively contributed teaching materials, giving participants a structured learning path from fundamentals to more advanced topics. • Contributed actively to all GDSC events, including initiating and running collaborations with companies and GDSC chapters from other universities.',
      },
    ],
  },
] as const;
