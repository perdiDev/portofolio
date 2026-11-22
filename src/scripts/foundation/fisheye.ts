// Fisheye on scroll: rows near the vertical centre of the viewport swell and sit forward,
// rows toward the edges shrink and fade. Writes `--fe` (0 to 1) on each `[data-fi]` item
// inside a `[data-fisheye]` container. CSS decides what `--fe` does.
import { $$, frame, prefersReducedMotion } from './dom';

const containers = $$('[data-fisheye]');

if (containers.length && !prefersReducedMotion()) {
  const live = new Set<HTMLElement>();

  const update = frame(() => {
    const mid = innerHeight / 2;
    for (const el of live) {
      const r = el.getBoundingClientRect();
      const d = Math.min(1, Math.abs(r.top + r.height / 2 - mid) / mid);
      el.style.setProperty('--fe', (1 - d ** 1.7).toFixed(3));
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) live.add(el);
        else live.delete(el);
      }
      update();
    },
    { rootMargin: '10% 0px' },
  );

  for (const c of containers) {
    c.classList.add('fe-on');
    for (const el of $$('[data-fi]', c)) {
      el.style.setProperty('--fe', '0');
      io.observe(el);
    }
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
}
