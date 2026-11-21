#!/usr/bin/env node
// PermissionRequest. Auto-approves a short allow-list of read-only or project-verification shell
// commands so routine checks do not interrupt design work. Anything else falls through to the prompt.
import { readEvent } from './lib.mjs';

const cmd = String(readEvent().tool_input?.command ?? '').trim();
const SAFE = [
  /^git (status|diff|log|branch)( [\w./@=:-]+)*$/,
  /^pnpm (check|build|format:check|design:lint|verify)$/,
  /^node scripts\/design-lint\.mjs( [\w./-]+)*$/,
  /^npx prettier --check( [\w./*-]+)+$/,
  /^npx astro check$/,
];
if (cmd && !/[;&|`$<>\n]/.test(cmd) && SAFE.some((r) => r.test(cmd))) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PermissionRequest', decision: { behavior: 'allow' } } }));
}
process.exit(0);
