// Work: the project at the reading line stays at full strength, the others dim (see work.css).
import { $$ } from './foundation/dom';

for (const grid of $$('[data-work]')) {
  const cards = $$('.card', grid);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        for (const c of cards) c.toggleAttribute('data-active', c === e.target);
        grid.dataset.focus = '';
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  for (const c of cards) io.observe(c);
}

// Snap only while the list covers the viewport, so other sections scroll freely.
const root = document.documentElement;
const grids = $$('[data-work]');
if (grids.length) {
  const visible = new Set<Element>();
  const snapIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      root.toggleAttribute('data-snap', visible.size > 0);
    },
    { rootMargin: '-20% 0px -20% 0px' },
  );
  for (const g of grids) snapIo.observe(g);
  document.addEventListener('astro:before-swap', () => root.removeAttribute('data-snap'));
}
