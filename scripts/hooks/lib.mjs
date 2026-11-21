import { readFileSync } from 'node:fs';
import { relative, isAbsolute, resolve } from 'node:path';

/** Reads the hook event JSON from stdin. Returns {} when nothing usable arrives. */
export function readEvent() {
  try {
    const raw = readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Best-effort file path from any tool or file event shape. Returned relative to the project root. */
export function eventPath(ev, root = process.cwd()) {
  const ti = ev.tool_input ?? {};
  const p = ti.path ?? ti.file_path ?? ti.filePath ?? ev.file_path ?? ev.path ?? ev.file ?? '';
  if (!p) return '';
  return relative(root, isAbsolute(p) ? p : resolve(root, p));
}

/** The text a write tool is about to put on disk (new content only, never the old). */
export function eventNewText(ev) {
  const ti = ev.tool_input ?? {};
  return String(ti.text ?? ti.newStr ?? ti.new_str ?? ti.content ?? ti.replacement ?? '');
}
