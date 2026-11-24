// Dumps the site's config data to JSON so the Python deck builder reads one source of truth.
import { writeFileSync } from 'node:fs';
const root = new URL('../../src/config/', import.meta.url);
const { AUTHOR, EDUCATION, SOCIALS } = await import(new URL('site.ts', root));
const { EXPERIENCE } = await import(new URL('experience.ts', root));
const { ACHIEVEMENTS } = await import(new URL('achievements.ts', root));
const out = new URL('../../.tools/pptx-data.json', import.meta.url);
writeFileSync(out, JSON.stringify({ AUTHOR, EDUCATION, SOCIALS, EXPERIENCE, ACHIEVEMENTS }, null, 2));
console.log('wrote', out.pathname);
