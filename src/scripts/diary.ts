// Diary: a soft light follows the pointer across each entry row (fine pointers, motion allowed).
import { $$, canFollowPointer } from './foundation/dom';

if (canFollowPointer()) {
  for (const row of $$('.dy-row')) {
    row.addEventListener('pointermove', (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty('--mx', `${e.clientX - r.left}px`);
      row.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }
}
