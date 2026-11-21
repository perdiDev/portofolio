#!/usr/bin/env node
// SessionStart / UserPromptSubmit / PreTaskExec / PostCompact. Prints short context lines that Kiro
// adds to the conversation. Usage: context.mjs <session|prompt|task|compact>
import { execFileSync } from 'node:child_process';
import { readEvent } from './lib.mjs';

const mode = process.argv[2];
const ev = readEvent();
const RULES = 'Foundation rules: compose pages from FoundationLayout + <Section>; colour only via tokens (src/styles/foundation/tokens.css); behavior in src/scripts/, never inline; motion gated by .js and prefers-reduced-motion; hover gated by (hover:hover) and (pointer:fine). Verify with `pnpm verify`.';
const git = (...a) => { try { return execFileSync('git', a, { encoding: 'utf8' }).trim(); } catch { return ''; } };

if (mode === 'session') {
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  const dirty = git('status', '--porcelain').split('\n').filter(Boolean).length;
  console.log(`Project: Astro portfolio. The home page (/) is the reference for the design foundation. Branch ${branch || '?'}, ${dirty} uncommitted file(s).\n${RULES}\nSteering and skills: .kiro/steering/, .kiro/skills/foundation-page, .kiro/skills/design-review. Rewrite plan: .kiro/specs/foundation-page-rewrite/.`);
} else if (mode === 'prompt') {
  const prompt = String(ev.prompt ?? ev.user_prompt ?? '');
  if (!prompt || /\b(page|design|section|layout|component|style|css|ui|ux|animation|theme|responsive|mobile)\b/i.test(prompt)) console.log(RULES);
} else if (mode === 'task') {
  console.log(`Before starting this task: read DESIGN.md, reuse an existing foundation component if one fits, and finish by running \`pnpm verify\` and the pixel/behavior checks in .kiro/skills/design-review.`);
} else if (mode === 'compact') {
  console.log(`Context was compacted. ${RULES}`);
}
process.exit(0);
