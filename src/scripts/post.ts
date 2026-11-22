// Diary entry: copy-link button and the view counter (filled in after load, hidden on failure).
import { $ } from './foundation/dom';

const share = $('[data-share]');
const copy = $<HTMLButtonElement>('[data-copy-link]');
const status = $('[data-share-status]');

if (share && copy) {
  const url = share.dataset.shareUrl ?? location.href;
  let timer = 0;
  copy.addEventListener('click', async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      // Clipboard unavailable or denied: say so instead of failing silently.
    }
    copy.textContent = ok ? 'Link copied' : 'Copy failed';
    if (status) status.textContent = ok ? 'Link copied to clipboard.' : 'Could not copy the link.';
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      copy.textContent = 'Copy link';
      if (status) status.textContent = '';
    }, 2200);
  });
}

const views = $('[data-views]');
const slug = views?.dataset.views;
if (views && slug) {
  const output = $('[data-views-count]', views);
  const format = (n: number) =>
    `${new Intl.NumberFormat('en-US').format(n)} ${n === 1 ? 'view' : 'views'}`;
  fetch(`/api/views/${encodeURIComponent(slug)}/`, {
    method: 'POST',
    headers: { accept: 'application/json' },
  })
    .then(async (res) => {
      const data: { views?: number } = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.views !== 'number') throw new Error(String(res.status));
      if (output) output.textContent = format(data.views);
    })
    .catch(() => {
      // Keep the space reserved so nothing shifts.
      views.style.visibility = 'hidden';
      views.setAttribute('aria-hidden', 'true');
    });
}
