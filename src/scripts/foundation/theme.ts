// Theme toggle. The initial theme is set before paint by the inline bootstrap in FoundationLayout.
import { $ } from './dom';

const root = document.documentElement;
const btn = $<HTMLButtonElement>('#theme');

const sync = () => {
  if (!btn) return;
  const dark = root.dataset.theme === 'dark';
  btn.setAttribute('aria-pressed', String(dark));
  btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
};

// No saved choice: keep following the system setting while the page is open.
const hasChoice = () => {
  try {
    return localStorage.getItem('theme') !== null;
  } catch {
    return false;
  }
};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (hasChoice()) return;
  root.dataset.theme = e.matches ? 'dark' : 'light';
  sync();
});

if (btn) {
  sync();
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
    sync();
    setTimeout(() => root.classList.remove('theme-anim'), 350);
  });
}
