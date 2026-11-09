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
  homePostCount: 6,
  relatedCount: 3,
  wordsPerMinute: 220,
  /** Tag pages with fewer posts than this are `noindex,follow` and left out of the sitemap. */
  minPostsForIndexableTag: 2,
  /** Minimum number of h2/h3 headings before a table of contents is shown. */
  tocMinHeadings: 3,
} as const;

export const NAV = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
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
