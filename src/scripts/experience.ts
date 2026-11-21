// Journey: accordion rows, and a spine that fills down to the reading line,
// lighting each node as it is passed (see experience.css).
import { $$, frame } from './foundation/dom';

for (const list of $$('[data-timeline]')) {
  const items = $$('.exp-item', list);

  for (const btn of $$<HTMLButtonElement>('.exp-btn', list)) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      const item = btn.closest<HTMLElement>('.exp-item');
      if (item) item.dataset.open = String(!open);
    });
  }

  const spine = frame(() => {
    const line = innerHeight * 0.58 - list.getBoundingClientRect().top;
    const total = list.offsetHeight;
    list.style.setProperty('--p', Math.max(0, Math.min(1, line / total)).toFixed(4));
    for (const it of items) it.toggleAttribute('data-passed', line > it.offsetTop + 34);
  });
  addEventListener('scroll', spine, { passive: true });
  new ResizeObserver(spine).observe(list);
  spine();
}
