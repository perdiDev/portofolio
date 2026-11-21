// Reading progress bar along the top edge.
import { $, frame } from './dom';

const bar = $('#bar');

if (bar) {
  const root = document.documentElement;
  const update = frame(() => {
    const h = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
  });
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}
