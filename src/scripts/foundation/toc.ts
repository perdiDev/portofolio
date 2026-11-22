// Rail navigation follows the section at the reading line.
import { $$ } from './dom';

const links = $$<HTMLAnchorElement>('.toc a[data-target]');

if (links.length) {
  const byId = new Map(links.map((a) => [a.dataset.target, a]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        for (const a of links) {
          if (a.dataset.target === en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  for (const s of $$('main [id]')) if (byId.has(s.id)) io.observe(s);
}
