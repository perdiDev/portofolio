// Project page: screenshot lightbox on a native <dialog>, and the privacy-friendly video facade.
// Without JS every screenshot link opens the full image and the video link opens YouTube.
import { $, $$ } from './foundation/dom';

const dialog = $<HTMLDialogElement>('[data-lightbox-dialog]');
const links = $$<HTMLAnchorElement>('a[data-lightbox]');

if (dialog && links.length && typeof dialog.showModal === 'function') {
  const figure = $('[data-lightbox-figure]', dialog)!;
  const counter = $('[data-lightbox-counter]', dialog)!;
  const prevButton = $<HTMLButtonElement>('[data-lightbox-prev]', dialog)!;
  const nextButton = $<HTMLButtonElement>('[data-lightbox-next]', dialog)!;
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (to: number) => {
    index = (to + links.length) % links.length;
    const link = links[index]!;
    const img = new Image();
    img.src = link.href;
    img.alt = link.dataset.alt ?? '';
    figure.replaceChildren(img);
    if (link.dataset.caption) {
      const cap = document.createElement('figcaption');
      cap.textContent = link.dataset.caption;
      figure.append(cap);
    }
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(links.length).padStart(2, '0')}`;
    // Warm the neighbours so the arrow keys feel instant.
    for (const step of [-1, 1])
      new Image().src = links[(index + step + links.length) % links.length]!.href;
  };

  links.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      opener = link;
      show(i);
      prevButton.hidden = nextButton.hidden = links.length < 2;
      dialog.showModal();
    });
  });

  prevButton.addEventListener('click', () => show(index - 1));
  nextButton.addEventListener('click', () => show(index + 1));
  $('[data-lightbox-close]', dialog)?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    show(index + (e.key === 'ArrowLeft' ? -1 : 1));
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    figure.replaceChildren();
    opener?.focus();
    opener = null;
  });
}

for (const a of $$<HTMLAnchorElement>('a[data-video]')) {
  a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(a.dataset.video ?? '')}?autoplay=1&rel=0`;
    frame.title = a.dataset.videoTitle ?? 'Video';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    a.replaceWith(frame);
    frame.focus();
  });
}
