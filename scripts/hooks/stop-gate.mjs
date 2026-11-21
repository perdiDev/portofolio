#!/usr/bin/env node
// Stop. Lints the files changed in this working tree. If the agent left design-system violations,
// it is sent back to fix them. Gives up after 2 rounds per session so it can never loop forever.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readEvent } from './lib.mjs';

const ev = readEvent();
const state = join(tmpdir(), `design-gate-${ev.session_id ?? 'default'}`);
const rounds = existsSync(state) ? Number(readFileSync(state, 'utf8')) || 0 : 0;

let changed = [];
try {
  changed = execFileSync('git', ['status', '--porcelain', '-uall'], { encoding: 'utf8' })
    .split('\n').map((l) => l.slice(3).trim()).filter((f) => /\.(css|astro|ts)$/.test(f));
} catch { process.exit(0); }
if (!changed.length) process.exit(0);

let out = '';
let failed = false;
try {
  execFileSync('node', ['scripts/design-lint.mjs', ...changed], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) {
  failed = true;
  out = String(e.stdout ?? '').trim();
}
if (!failed) { rmSync(state, { force: true }); process.exit(0); }
if (rounds >= 2) process.exit(0);
writeFileSync(state, String(rounds + 1));
console.log(JSON.stringify({ decision: 'block', reason: `design-lint found problems in files you changed. Fix them (see .kiro/steering/design-system.md), then finish.\n\n${out}` }));
process.exit(0);
