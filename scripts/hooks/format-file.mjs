#!/usr/bin/env node
// PostFileSave. Formats the saved file with the project's Prettier config. Never fails the session.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readEvent, eventPath } from './lib.mjs';

const path = eventPath(readEvent());
const prettier = 'node_modules/.bin/prettier';
if (
  !path ||
  !/\.(astro|css|ts|mjs|json)$/.test(path) ||
  /^(dist|\.vercel|\.astro|node_modules)\//.test(path) ||
  !existsSync(prettier) ||
  !existsSync(path)
)
  process.exit(0);
try {
  execFileSync(prettier, ['--write', '--log-level', 'warn', path], {
    stdio: 'ignore',
    timeout: 20000,
  });
} catch {
  /* unparsable mid-edit file: leave it alone */
}
process.exit(0);
