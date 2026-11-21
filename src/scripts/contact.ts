// Contact: copy the email (label rolls to a check; on failure the address is shown to copy by hand),
// and on fine pointers the button leans toward the pointer.
import { $, canFollowPointer } from './foundation/dom';

const btn = $<HTMLButtonElement>('#copy');
const status = $('#copied');

if (btn && status) {
  const email = btn.dataset.email ?? '';
  let timer = 0;

  btn.addEventListener('click', async () => {
    clearTimeout(timer);
    let ok = true;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      ok = false;
    }
    status.className = ok ? 'sr' : 'small';
    status.textContent = ok ? 'Copied to clipboard' : `Copying failed. The address is ${email}`;
    if (ok) btn.dataset.state = 'done';
    timer = window.setTimeout(() => {
      btn.dataset.state = 'idle';
      status.textContent = '';
    }, 2400);
  });

  if (canFollowPointer()) {
    btn.classList.add('is-magnet');
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      btn.style.transform = `translate(${(dx * 8).toFixed(1)}px,${(dy * 6).toFixed(1)}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  }
}
