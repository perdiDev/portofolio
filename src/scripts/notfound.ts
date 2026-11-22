// 404: on fine pointers the two plate layers drift at different depths toward the pointer.
import { $, canFollowPointer, frame } from './foundation/dom';

const plate = $('.nf-plate');
const layers = plate ? [...plate.querySelectorAll<SVGGElement>('[data-depth]')] : [];

if (plate && layers.length && canFollowPointer()) {
  let x = 0;
  let y = 0;
  const paint = frame(() => {
    for (const g of layers) {
      const d = Number(g.dataset.depth ?? 0);
      g.style.setProperty('--px', `${(x * 14 * d).toFixed(1)}px`);
      g.style.setProperty('--py', `${(y * 10 * d).toFixed(1)}px`);
    }
  });
  addEventListener('pointermove', (e) => {
    x = e.clientX / innerWidth - 0.5;
    y = e.clientY / innerHeight - 0.5;
    paint();
  });
}
