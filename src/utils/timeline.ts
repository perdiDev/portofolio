/** Shapes EXPERIENCE from src/config/experience.ts into rows for the timeline accordion. No markup. */
import type { ExperienceEntry } from '../config';

type Entry = ExperienceEntry;

/** "2024-3" -> "2024-03" so year-month strings sort and parse consistently. */
const norm = (ym: string) => ym.replace(/-(\d)$/, '-0$1');

const parts = (ym: string) => norm(ym).split('-').map(Number) as [number, number];

/** "2024-03" -> "Mar 2024" */
export const formatMonth = (ym: string) => {
  const [y, m] = parts(ym);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const monthIndex = (ym: string) => {
  const [y, m] = parts(ym);
  return y * 12 + (m - 1);
};

/** Inclusive length between two year-months, e.g. "1 yr 4 mos". `to = null` means now. */
export const tenure = (from: string, to: string | null, now = new Date()) => {
  const end = to ? monthIndex(to) : now.getUTCFullYear() * 12 + now.getUTCMonth();
  const n = Math.max(1, end - monthIndex(from) + 1);
  const y = Math.floor(n / 12);
  const m = n % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`]
    .filter(Boolean)
    .join(' ');
};

export interface TimelineRow {
  id: string;
  company: string;
  url?: string;
  location?: string;
  range: string;
  span: string;
  ongoing: boolean;
  titles: string;
  roles: { title: string; meta: string; bullets: string[] }[];
}

export function toTimeline(entries: readonly Entry[], idPrefix = 'exp'): TimelineRow[] {
  return entries.map((e, i) => {
    const starts = e.roles.map((r) => norm(r.startDate)).sort();
    const ongoing = e.roles.some((r) => r.endDate === null);
    const ends = e.roles.map((r) => norm(r.endDate ?? '')).sort();
    const last = ends[ends.length - 1];
    return {
      id: `${idPrefix}-${i}`,
      company: e.company,
      url: e.companyUrl,
      location: e.location,
      range: `${formatMonth(starts[0])} – ${ongoing ? 'Present' : formatMonth(last)}`,
      span: tenure(starts[0], ongoing ? null : last),
      ongoing,
      titles: e.roles.map((r) => r.title).join(' / '),
      roles: e.roles.map((r) => ({
        title: r.title,
        meta: [
          r.employmentType,
          `${formatMonth(r.startDate)} – ${r.endDate ? formatMonth(r.endDate) : 'Present'}`,
        ]
          .filter(Boolean)
          .join(' · '),
        bullets: r.description
          .split('•')
          .map((s) => s.trim())
          .filter(Boolean),
      })),
    };
  });
}
