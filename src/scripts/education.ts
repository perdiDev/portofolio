// Foundations plate: arches and graph drift against the pointer (fine pointers, motion allowed).
import { $$, canFollowPointer } from './foundation/dom';

if (canFollowPointer()) {
  for (const plate of $$('[data-parallax]')) {
    plate.addEventListener('pointermove', (e) => {
      const r = plate.getBoundingClientRect();
      plate.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      plate.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    plate.addEventListener('pointerleave', () => {
      plate.style.setProperty('--mx', '0');
      plate.style.setProperty('--my', '0');
    });
  }
}
