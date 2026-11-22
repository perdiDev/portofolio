/**
 * Site-wide values: identity, socials, SEO defaults, blog and view-counter settings.
 * Experience lives in `experience.ts`, achievements in `achievements.ts`; `index.ts` re-exports all.
 * Anything marked `TODO` is a placeholder the owner must review before launch.
 */

export interface SocialLink {
  /** Visible label and accessible name. */
  readonly label: string;
  readonly url: string;
  /** Key of the icon in `src/components/foundation/Icon.astro`. */
  readonly icon: 'github' | 'linkedin' | 'instagram' | 'x' | 'mail';
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
  /** Handle used on GitHub, Instagram and email; helps search engines connect the profiles. */
  alternateName: 'perdidev',
  email: 'perdidev@gmail.com',
  jobTitle: 'Software Engineer',
  /** Where Perdi is based (Person JSON-LD `address`). */
  location: { city: 'Makassar', region: 'South Sulawesi', country: 'ID' },
  /** Topics for Person JSON-LD `knowsAbout`, taken from the work history and the diary. */
  knowsAbout: ['Software engineering', 'Go', 'Laravel', 'Flutter', 'PostgreSQL', 'Linux'],
  /** TODO: replace with your real bio (shown in Person JSON-LD). */
  bio: 'Informatics Engineering graduate specializing in Software Engineering, with hands-on experience for almost 4+ years.',
} as const;

/** Shown in the Foundations section on the home page. The last word of `degree` is emphasised. */
export const EDUCATION = {
  level: 'Bachelor’s degree',
  degree: 'Informatics Engineering',
  school: 'Universitas Hasanuddin',
  city: 'Makassar',
  country: 'Indonesia',
  start: 2022,
  end: 2026,
} as const;

/** TODO: add your X profile URL. Entries without a URL are skipped everywhere. */
const X_URL = '';

export const SOCIALS: readonly SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/perdidev', icon: 'github' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/perdi-dev/', icon: 'linkedin' },
  { label: 'Instagram', url: 'https://www.instagram.com/perdidev/', icon: 'instagram' },
  ...(X_URL ? [{ label: 'X', url: X_URL, icon: 'x' } as const] : []),
];

export const SITE = {
  name: 'Perdi',
  /** Distinct <title> for the home page (<= 60 chars). */
  homeTitle: 'Perdi (perdidev) — Software Engineer in Makassar',
  /** Home page meta description (<= 160 chars). `description` below stays the diary/RSS blurb. */
  homeDescription:
    'Perdi (perdidev) is a software engineer in Makassar, Indonesia. Projects, work history and a diary on Go, Laravel, Flutter and Linux.',
  description:
    'A developer blog by Perdi: practical articles on programming, Linux, and software engineering, plus a few projects.',
  language: 'en',
  locale: 'en_US',
  themeColor: '#fafaf9',
  /** TODO: optional. Your X handle without "@", used for twitter:site / twitter:creator. */
  twitterHandle: '',
  /** TODO: optional. Set to a URL (e.g. "/cv.pdf" placed in /public). */
  cvUrl: '',
  /** First year shown in the footer copyright (current year is computed at build time). */
  copyrightStartYear: 2025,
} as const;

export const BLOG = {
  /** Posts per page on /diary/, category pages, and tag pages. */
  postsPerPage: 6,
  relatedCount: 3,
  wordsPerMinute: 220,
  /** Tag pages with fewer posts than this are `noindex,follow` and left out of the sitemap. */
  minPostsForIndexableTag: 2,
  /** Minimum number of h2/h3 headings before a table of contents is shown. */
  tocMinHeadings: 3,
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
