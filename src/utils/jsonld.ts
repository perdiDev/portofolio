import { AUTHOR, EDUCATION, SITE, SOCIALS } from '../config';
import { absoluteUrl } from './seo';

/** A schema.org node. Every builder below returns this shape. */
export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

export interface BreadcrumbItem {
  name: string;
  /** Site path (e.g. "/diary/"). The last item is the current page. */
  href: string;
}

type Site = URL | string;

const node = (type: string, data: Record<string, unknown>): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': type,
  ...data,
});

/** Serialise for an inline `<script>`: `<` is escaped so `</script>` can never appear in the payload. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const personId = (site: Site) => absoluteUrl('/#person', site);
const websiteId = (site: Site) => absoluteUrl('/#website', site);
const personRef = (site: Site) => ({ '@type': 'Person', '@id': personId(site), name: AUTHOR.name });

export function personJsonLd(site: Site, image?: string): JsonLd {
  return node('Person', {
    '@id': personId(site),
    name: AUTHOR.name,
    alternateName: AUTHOR.alternateName,
    url: absoluteUrl('/', site),
    ...(image ? { image: absoluteUrl(image, site) } : {}),
    email: AUTHOR.email,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.bio,
    address: {
      '@type': 'PostalAddress',
      addressLocality: AUTHOR.location.city,
      addressRegion: AUTHOR.location.region,
      addressCountry: AUTHOR.location.country,
    },
    alumniOf: { '@type': 'CollegeOrUniversity', name: EDUCATION.school },
    knowsAbout: AUTHOR.knowsAbout,
    sameAs: SOCIALS.map((social) => social.url),
  });
}

/**
 * Home page as a Google "ProfilePage": the page is about one person.
 * The Person node is embedded as `mainEntity`, so it is not emitted separately.
 */
export function profilePageJsonLd(site: Site, image?: string): JsonLd {
  const { '@context': _context, ...person } = personJsonLd(site, image);
  return node('ProfilePage', {
    '@id': absoluteUrl('/#profile', site),
    url: absoluteUrl('/', site),
    name: SITE.homeTitle,
    description: SITE.homeDescription,
    inLanguage: SITE.language,
    isPartOf: { '@id': websiteId(site) },
    mainEntity: person,
  });
}

export function websiteJsonLd(site: Site): JsonLd {
  return node('WebSite', {
    '@id': websiteId(site),
    url: absoluteUrl('/', site),
    name: SITE.name,
    alternateName: AUTHOR.alternateName,
    description: SITE.homeDescription,
    inLanguage: SITE.language,
    publisher: { '@id': personId(site) },
  });
}

export function breadcrumbJsonLd(site: Site, items: BreadcrumbItem[]): JsonLd {
  return node('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href, site),
    })),
  });
}

export interface BlogPostingInput {
  site: Site;
  /** Canonical URL of the article (absolute). */
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: Date;
  dateModified: Date;
  keywords: string[];
  section: string;
  wordCount: number;
}

/** Note: view counts are deliberately never part of structured data. */
export function blogPostingJsonLd(input: BlogPostingInput): JsonLd {
  return node('BlogPosting', {
    '@id': `${input.url}#article`,
    headline: input.headline,
    description: input.description,
    image: [input.image],
    datePublished: input.datePublished.toISOString(),
    dateModified: input.dateModified.toISOString(),
    author: { ...personRef(input.site), url: absoluteUrl('/', input.site) },
    publisher: personRef(input.site),
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    isPartOf: { '@id': websiteId(input.site) },
    keywords: input.keywords.join(', '),
    articleSection: input.section,
    wordCount: input.wordCount,
    inLanguage: SITE.language,
  });
}

export interface SoftwareSourceCodeInput {
  site: Site;
  url: string;
  name: string;
  description: string;
  codeRepository?: string;
  programmingLanguage: string[];
  dateCreated: Date;
  image: string;
}

export function softwareSourceCodeJsonLd(input: SoftwareSourceCodeInput): JsonLd {
  return node('SoftwareSourceCode', {
    '@id': `${input.url}#project`,
    url: input.url,
    name: input.name,
    description: input.description,
    ...(input.codeRepository ? { codeRepository: input.codeRepository } : {}),
    programmingLanguage: input.programmingLanguage,
    dateCreated: input.dateCreated.toISOString(),
    image: input.image,
    author: personRef(input.site),
    inLanguage: SITE.language,
  });
}
