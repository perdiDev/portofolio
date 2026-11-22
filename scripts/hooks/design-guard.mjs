#!/usr/bin/env node
// PreToolUse (write tools). Hard-blocks secrets and generated output, asks before design-system
// violations in foundation code. Exit 2 blocks; JSON on stdout can ask the user instead.
import { readEvent, eventPath, eventNewText } from './lib.mjs';

const ev = readEvent();
const path = eventPath(ev);
const text = eventNewText(ev);
const deny = (why) => {
  console.error(`design-guard: ${why}`);
  process.exit(2);
};
const ask = (why) => {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: `design-guard: ${why}`,
      },
    }),
  );
  process.exit(0);
};

if (!path) process.exit(0);
const base = path.split('/').pop();

if (/^\.env(\..+)?$/.test(base) && base !== '.env.example')
  deny(`${base} holds secrets. Edit it yourself, or change .env.example.`);
if (/^(dist|\.wrangler|\.astro|node_modules)\//.test(path))
  deny(`${path} is generated output. Change the source instead.`);

// Foundation code: generic parts, client scripts, the layout, section components (they render the
// foundation Section) and plain CSS in src/styles.
const inScope =
  /^src\/(styles\/foundation|components\/foundation|scripts)\//.test(path) ||
  path === 'src/layouts/FoundationLayout.astro' ||
  /^src\/styles\/(?!global\.css$)[^/]+\.css$/.test(path) ||
  (/^src\/(components|pages)\/.+\.astro$/.test(path) &&
    /foundation\/Section\.astro|FoundationLayout/.test(text ?? ''));
if (!inScope || !text) process.exit(0);

if (/transition\s*:\s*all\b/.test(text))
  deny('`transition: all` is banned. List the properties you animate.');
if (/\.(css)$/.test(path) && base !== 'tokens.css') {
  const bad = text
    .split('\n')
    .find((l) => /#[0-9a-fA-F]{3,8}\b/.test(l) && !/lint-allow:[^*]*hex/.test(l));
  if (bad) ask('raw hex colour in CSS. Use a token from tokens.css, or add one there.');
}
if (/\.astro$/.test(path) && /define:vars/.test(text))
  ask('inline define:vars script. Use a data attribute and a module in src/scripts/.');
if (/\.astro$/.test(path) && /<style[^>]*is:global/.test(text) && !path.includes('/layouts/'))
  ask('<style is:global> outside a layout. Put CSS in src/styles/<area>/.');
process.exit(0);
