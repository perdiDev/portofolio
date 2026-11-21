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
