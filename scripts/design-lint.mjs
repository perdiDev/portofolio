#!/usr/bin/env node
/**
 * Design-foundation linter. Fast, static, no dependencies.
 *
 *   node scripts/design-lint.mjs            lint every foundation file
 *   node scripts/design-lint.mjs a.css b.astro   lint only these files
 *   node scripts/design-lint.mjs --json     machine-readable output
 *
 * A line may opt out of one rule with a trailing comment `lint-allow:<rule>` (rules: hex,
 * px-font), for example device-mockup colours that must stay literal.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';

const ROOT = process.cwd();
const SCOPE_DIRS = [
  'src/styles/foundation',
  'src/styles/new-home-4',
  'src/components/foundation',
  'src/components/new-home-4',
  'src/scripts/foundation',
  'src/scripts/new-home-4',
];
const SCOPE_FILES = ['src/layouts/FoundationLayout.astro'];

const walk = (dir) =>
  !existsSync(dir)
    ? []
    : readdirSync(dir).flatMap((n) => {
        const p = join(dir, n);
        return statSync(p).isDirectory() ? walk(p) : [p];
      });

/** Every page that renders inside the foundation layout is in scope. */
const foundationPages = () =>
  walk(join(ROOT, 'src/pages')).filter(
    (p) => p.endsWith('.astro') && readFileSync(p, 'utf8').includes('FoundationLayout'),
  );

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const explicit = args.filter((a) => !a.startsWith('--'));
const inScope = (rel) =>
  SCOPE_DIRS.some((d) => rel.startsWith(d + '/')) ||
  SCOPE_FILES.includes(rel) ||
  (rel.startsWith('src/pages/') && rel.endsWith('.astro') && readFileSync(join(ROOT, rel), 'utf8').includes('FoundationLayout'));

const files = (explicit.length
  ? explicit.map((f) => relative(ROOT, join(ROOT, f)))
  : [...SCOPE_DIRS.flatMap((d) => walk(join(ROOT, d))), ...SCOPE_FILES.map((f) => join(ROOT, f)), ...foundationPages()].map((f) => relative(ROOT, f))
).filter((f) => existsSync(join(ROOT, f)) && inScope(f) && ['.css', '.astro', '.ts'].includes(extname(f)));

const findings = [];
const add = (file, line, rule, msg) => findings.push({ file, line, rule, msg });

for (const file of files) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  const ext = extname(file);
  const isTokens = basename(file) === 'tokens.css';
  const lines = text.split('\n');
  const allowed = (l, rule) => l.includes(`lint-allow:`) && new RegExp(`lint-allow:[^*]*\\b${rule}\\b`).test(l);

  // Strip Astro frontmatter so data (e.g. a fallback hue) is not read as styling.
  let styleStart = 0;
  if (ext === '.astro' && lines[0]?.trim() === '---') {
    const end = lines.indexOf('---', 1);
    if (end > 0) styleStart = end + 1;
  }

  lines.forEach((l, i) => {
    const n = i + 1;
    const styling = ext === '.css' || (ext === '.astro' && i >= styleStart);
    if (!styling) return;
    if (ext === '.css' && !isTokens && /#[0-9a-fA-F]{3,8}\b/.test(l) && !allowed(l, 'hex'))
      add(file, n, 'hex', 'Raw hex colour. Use a token from tokens.css (or add one).');
    if (ext === '.astro' && /style="[^"]*#[0-9a-fA-F]{3,8}\b/.test(l) && !allowed(l, 'hex'))
      add(file, n, 'hex', 'Raw hex colour in a style attribute. Use a token or a CSS variable.');
    if (/transition\s*:\s*all\b/.test(l)) add(file, n, 'transition-all', 'Never `transition: all`. List the properties.');
    if (ext === '.css' && /font(-size)?\s*:[^;{]*\b\d+(\.\d+)?px\b/.test(l) && !allowed(l, 'px-font'))
      add(file, n, 'px-font', 'Font size in px. Use rem so it follows user settings.');
    if (ext === '.css' && /(^|[^\w-])(height|min-height)\s*:\s*100vh\b/.test(l))
      add(file, n, 'vh', 'Use 100dvh, not 100vh (mobile browser chrome).');
  });

  if (ext === '.css' && /(@keyframes|transition\s*:|animation\s*:)/.test(text) && !/prefers-reduced-motion/.test(text))
    add(file, 1, 'reduced-motion', 'Animates but has no `prefers-reduced-motion` block.');

  if (ext === '.astro') {
    const body = lines.slice(styleStart).join('\n');
    const isLayout = file.includes('/layouts/');
    if (/<style[^>]*is:global/.test(body) && !isLayout)
      add(file, 1, 'global-style', 'No `<style is:global>` outside layouts. Put CSS in src/styles/<area>/.');
    if (/define:vars/.test(body)) add(file, 1, 'define-vars', 'Inline `define:vars` script. Use a data attribute and a module in src/scripts/.');
    for (const m of body.matchAll(/<img\b[^>]*>/g))
      if (!/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0]))
        add(file, 1, 'img-size', 'Image without width and height (layout shift).');
    for (const m of body.matchAll(/<button\b[^>]*>/g))
      if (!/\btype=/.test(m[0])) add(file, 1, 'button-type', 'Button without an explicit type.');
    for (const m of body.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))
      if (!/noopener/.test(m[0])) add(file, 1, 'noopener', 'target="_blank" without rel="noopener".');
  }

  if (ext === '.ts' && /\blocalStorage\b/.test(text) && !/try\s*{/.test(text))
    add(file, 1, 'storage', 'localStorage access must be wrapped in try/catch.');
}

if (asJson) console.log(JSON.stringify({ files: files.length, findings }, null, 2));
else {
  for (const f of findings) console.log(`${f.file}:${f.line}  [${f.rule}]  ${f.msg}`);
  console.log(findings.length ? `\n${findings.length} finding(s) in ${files.length} file(s).` : `design-lint: ${files.length} file(s) clean.`);
}
process.exit(findings.length ? 1 : 0);
