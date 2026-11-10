/**
 * Single source of truth for every site-wide value.
 * Anything marked `TODO` is a placeholder the owner must review before launch.
 */

export interface SocialLink {
  /** Visible label and accessible name. */
  readonly label: string;
  readonly url: string;
  /** Key of the icon in `src/components/Icon.astro`. */
  readonly icon: 'github' | 'linkedin' | 'x' | 'mail';
}

/** Blog categories. Add a value here and it becomes valid in frontmatter. */
export const CATEGORIES = [
  'Programming',
  'Linux',
  'Software Engineering',
  'Tips & Tricks',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const AUTHOR = {
  name: 'Perdi',
  email: 'perdidev@gmail.com',
  jobTitle: 'Software Engineer',
  /** TODO: replace with your real bio (shown on /about/ and in Person JSON-LD). */
  bio: 'I am a software engineer who enjoys Linux, clean code, and explaining hard things in plain language. This blog is where I write down what I learn so other developers can skip the detours.',
  /** Short intro for the home page hero. */
  intro:
    'I am Perdi, a software engineer. I write about programming, Linux, and the craft of building software, for developers who like clear explanations and working examples.',
} as const;

/** TODO: add your X profile URL. Entries without a URL are skipped everywhere. */
const X_URL = '';

export const SOCIALS: readonly SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/perdidev', icon: 'github' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/perdi-dev/', icon: 'linkedin' },
  ...(X_URL ? [{ label: 'X', url: X_URL, icon: 'x' } as const] : []),
];

export const SITE = {
  name: 'Perdi',
  /** Distinct <title> for the home page (<= 60 chars). */
  homeTitle: 'Perdi — Software engineer writing about code and Linux',
  description:
    'A developer blog by Perdi: practical articles on programming, Linux, and software engineering, plus a few projects.',
  language: 'en',
  locale: 'en_US',
  themeColor: '#fafaf9',
  /** TODO: optional. Your X handle without "@", used for twitter:site / twitter:creator. */
  twitterHandle: '',
  /** TODO: optional. Set to a URL (e.g. "/cv.pdf" placed in /public) to show "Download CV" on /about/. */
  cvUrl: '',
  /** First year shown in the footer copyright (current year is computed at build time). */
  copyrightStartYear: 2025,
} as const;

export const BLOG = {
  /** Posts per page on /blog/, category pages, and tag pages. */
  postsPerPage: 6,
  /** Posts shown under "Latest writing" on the home page. */
  homePostCount: 3,
  relatedCount: 3,
  wordsPerMinute: 220,
  /** Tag pages with fewer posts than this are `noindex,follow` and left out of the sitemap. */
  minPostsForIndexableTag: 2,
  /** Minimum number of h2/h3 headings before a table of contents is shown. */
  tocMinHeadings: 3,
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Skills', href: '/skills/' },
  { label: 'More', href: '/about/' },
] as const;

export const ABOUT = {
  /** TODO: tune to what you really write about. */
  writesAbout: [
    {
      title: 'Programming',
      text: 'JavaScript and TypeScript in depth, algorithms without the anxiety, and patterns that survive contact with production.',
    },
    {
      title: 'Linux',
      text: 'The terminal, permissions, services, and the everyday tools every developer should be comfortable with.',
    },
    {
      title: 'Software engineering',
      text: 'Code review, commit hygiene, debugging habits, and the human side of shipping software.',
    },
  ],
  /** TODO: replace with your real stack. */
  skills: [
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Astro',
    'Linux',
    'Bash',
    'PostgreSQL',
    'Git',
    'Docker',
    'Testing',
  ],
} as const;

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
                'First engineering role out of university. Built internal tooling with Vue.js and learned how to ship production code as part of a small, fast-moving team.',
            },
            {
                title: 'Backend Developer',
                employmentType: 'Freelence',
                startDate: '2025-06',
                endDate: '2025-07',
                description:
                'First engineering role out of university. Built internal tooling with Vue.js and learned how to ship production code as part of a small, fast-moving team.',
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
                'First engineering role out of university. Built internal tooling with Vue.js and learned how to ship production code as part of a small, fast-moving team.',
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
            'Leading a team of 4 frontend engineers. Rebuilt the core dashboard in React and TypeScript, cutting load time by 40%, and introduced component-level testing and code review standards the rest of the org went on to adopt.',
        },
        {
            title: 'Instructor Ngoding Holiday Camp',
            employmentType: 'Full-time',
            startDate: '2024-12',
            endDate: '2025-1',
            description:
            'Leading a team of 4 frontend engineers. Rebuilt the core dashboard in React and TypeScript, cutting load time by 40%, and introduced component-level testing and code review standards the rest of the org went on to adopt.',
        }
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
            'First engineering role out of university. Built internal tooling with Vue.js and learned how to ship production code as part of a small, fast-moving team.',
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
            'First engineering role out of university. Built internal tooling with Vue.js and learned how to ship production code as part of a small, fast-moving team.',
        },
        ],
    },
] as const;

export interface Achievement {
  readonly title: string;
  readonly description: string;
  /** "YYYY" or "YYYY-MM". */
  readonly date: string;
  /** Optional link to a write-up, certificate, or announcement. */
  readonly url?: string;
}

/** TODO: replace with your real achievements. Newest first. */
export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    title: 'Semifinalis Samsung Solve for Tomorrow 2024 Kategori Universitas',
    description: 'Samsung Electronics Indonesia',
    date: 'Agustus 2024',
    url: '',
  },
  {
    title: 'Juara Harapan 1 FIT Competition 2024',
    description: 'Fakultas Teknologi Informasi dan HMPTI Universitas Kristen Satya Wacana (UKSW)',
    date: 'Juli 2024',
    url: '',
  },
  {
    title: 'Top 10 finalis - SECS Telkom University',
    description: 'Telkom University',
    date: '2022',
    url: '',
  },
] as const;

export interface SkillGroup {
  readonly title: string;
  /** Key of the icon in `src/components/Icon.astro`. */
  readonly icon: 'layout' | 'server' | 'terminal' | 'cloud';
  readonly description: string;
  readonly skills: readonly string[];
  /** Project ids (filenames under `src/content/projects`, without `.md`) built with this skill set. */
  readonly projectIds: readonly string[];
}

/** TODO: replace with your real skill groups. Shown on the home page, after Projects. */
export const SKILLS: readonly SkillGroup[] = [
  {
    title: 'Frontend & UI',
    icon: 'layout',
    description: 'Interfaces that stay fast and readable, from the component up to the pixel.',
    skills: ['TypeScript', 'Astro', 'React', 'Tailwind CSS', 'Accessibility'],
    projectIds: ['portfolio-engine', 'budget-tracker'],
  },
  {
    title: 'Backend & Data',
    icon: 'server',
    description: 'APIs and data models that still hold up once real traffic and real data arrive.',
    skills: ['Node.js', 'PostgreSQL', 'REST APIs', 'Data modeling'],
    projectIds: ['budget-tracker'],
  },
  {
    title: 'Tooling & DX',
    icon: 'terminal',
    description: 'CLIs and scripts that make the next hour of work a little faster than this one.',
    skills: ['CLI design', 'Git', 'Bash', 'Markdown'],
    projectIds: ['dev-notes-cli', 'portfolio-engine'],
  },
  {
    title: 'Delivery & Performance',
    icon: 'cloud',
    description: 'Shipping with CI, performance budgets, and deploys nobody has to babysit.',
    skills: ['Vercel', 'CI/CD', 'Lighthouse audits', 'SEO'],
    projectIds: ['portfolio-engine'],
  },
] as const;

export const NEWSLETTER = {
  privacy: 'No spam. Unsubscribe anytime.',
  heading: 'Get new posts by email',
  text: 'One short email when a new article is published. Nothing else.',
} as const;

/** Third-party endpoints and fixed behaviour for the view counter. */
export const VIEWS = {
  /** Visitors are counted once per this many seconds. */
  dedupeSeconds: 60 * 60 * 24,
  keyPrefix: 'views',
} as const;

export const OG = {
  width: 1200,
  height: 630,
} as const;

export const PAGEFIND_BUNDLE = '/pagefind/';
