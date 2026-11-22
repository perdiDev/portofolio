/** Competitions and awards shown in the Recognition section. */

export interface Achievement {
  readonly title: string;
  readonly description: string;
  /** Short result label, e.g. "3rd Place". */
  readonly rank?: string;
  /** "YYYY" or "YYYY-MM". */
  readonly date: string;
  /** Optional link to a write-up, certificate, or announcement. */
  readonly url?: string;
}

/** TODO: replace with your real achievements. Newest first. */
export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    title: 'Semifinalist, Samsung Solve for Tomorrow Indonesia 2024',
    rank: 'Semifinalist',
    description: 'University Category · Samsung Electronics Indonesia',
    date: '2024',
    url: '',
  },
  {
    title: '1st Honorable Mention, FIT Competition 2024',
    rank: 'Honorable Mention',
    description: 'Mobile Development · Universitas Kristen Satya Wacana (UKSW)',
    date: '2024',
    url: '',
  },
  {
    title: '3rd Place, Pekan Ilmiah Teknik',
    rank: '3rd Place',
    description: 'Universitas Hasanuddin',
    date: '2023',
    url: '',
  },
  {
    title: 'Scholarship, DBS Foundation Coding Camp',
    rank: 'Scholarship',
    description: 'Backend Intermediate Level · DBS Foundation',
    date: '2023',
    url: '',
  },
  {
    title: 'Top 10 Finalist, Software Engineering Competition',
    rank: 'Top 10',
    description: 'Scholarship competition · Telkom University',
    date: '2022',
    url: '',
  },
] as const;
