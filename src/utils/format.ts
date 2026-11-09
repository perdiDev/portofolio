const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/** "March 4, 2025" — always UTC so the output never depends on the build machine. */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** "Mar 4" — used in the archive where the year is already a heading. */
export function formatShortDate(date: Date): string {
  return shortDateFormatter.format(date);
}

/** `YYYY-MM-DD`, valid for the `datetime` attribute of `<time>`. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Trim text to `max` characters on a word boundary, adding an ellipsis when cut. */
export function clamp(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–—-]+$/, '')}…`;
}
