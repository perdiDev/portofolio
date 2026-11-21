// "View" label that trails the pointer over elements marked [data-cursor].
import { $, $$, canFollowPointer } from './dom';

const cur = $('#cursor');
const targets = $$('[data-cursor]');

if (cur && targets.length && canFollowPointer()) {
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let on = false;
  let raf = 0;

  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    cur.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${on ? 1 : 0.6})`;
    raf = Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  for (const el of targets) {
    el.addEventListener('pointerenter', (e) => {
      tx = x = e.clientX;
      ty = y = e.clientY;
      on = true;
      cur.classList.add('show');
      kick();
    });
    el.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      kick();
    });
    el.addEventListener('pointerleave', () => {
      on = false;
      cur.classList.remove('show');
    });
  }
}
