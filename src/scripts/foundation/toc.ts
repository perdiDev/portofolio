// Rail navigation follows the section at the reading line.
import { $, $$, prefersReducedMotion } from './dom';

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

// Long lists scroll inside a five-row window: keep the current row in view and fade the cut edges.
const list = $<HTMLElement>('.toc ol');

if (list) {
  const setEdge = () => {
    const max = list.scrollHeight - list.clientHeight;
    list.dataset.edge =
      max <= 1
        ? 'none'
        : list.scrollTop <= 1
          ? 'start'
          : list.scrollTop >= max - 1
            ? 'end'
            : 'middle';
  };
  const follow = (a: HTMLElement) => {
    const top = a.offsetTop - list.offsetTop;
    const target = top - (list.clientHeight - a.offsetHeight) / 2;
    list.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  list.addEventListener('scroll', setEdge, { passive: true });
  new MutationObserver((muts) => {
    for (const m of muts) {
      const el = m.target as HTMLElement;
      if (el.hasAttribute('aria-current')) follow(el);
    }
  }).observe(list, { attributes: true, attributeFilter: ['aria-current'], subtree: true });
  setEdge();
}
