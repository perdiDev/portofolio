import { BLOG } from '../config';

/** Remove everything that is not prose: fenced code, inline code, HTML, images, link targets. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\S\n]*$/gm, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[#>\-*+\d.\s]+(?=\S)/gm, '')
    .replace(/[*_~|]/g, ' ');
}

export function countWords(markdown: string): number {
  const words = toPlainText(markdown).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
  return words?.length ?? 0;
}

export interface ReadingTime {
  minutes: number;
  words: number;
  /** "4 min read" */
  text: string;
}

/** Reading time at ~220 wpm, ignoring code blocks, rounded up, never below 1 minute. */
export function getReadingTime(markdown: string | undefined): ReadingTime {
  const words = countWords(markdown ?? '');
  const minutes = Math.max(1, Math.ceil(words / BLOG.wordsPerMinute));
  return { minutes, words, text: `${minutes} min read` };
}
