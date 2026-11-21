// Toggle .in while an element is visible: entrances play on enter and replay on re-entry.
// CSS decides what .in animates (see styles/foundation/motion.css and area CSS).
import { $$ } from './dom';

const targets = $$('.reveal, .sec, [data-reveal]');

if (targets.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.target.classList.toggle('in', e.isIntersecting);
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  for (const el of targets) io.observe(el);
}
