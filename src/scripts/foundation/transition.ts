/**
 * Cross-page view transition helper (see styles/foundation/transitions.css).
 * Every plate carries a `plate-{id}` name in markup; here only the one that travels keeps it,
 * so the other cards leave with the page instead of fading on their own layer. Coming back to
 * the grid, the target card is scrolled into view before the browser captures the new page.
 */
import { $$, prefersReducedMotion } from './dom';

const idFrom = (url?: string | URL | null) => {
  if (!url) return '';
  const m = new URL(url, location.href).pathname.match(/^\/projects\/([^/]+)\/?$/);
  return m ? m[1] : '';
};

const keepOnly = (id: string) => {
  for (const el of $$<HTMLElement>('.plate')) {
    if (!id || el.style.viewTransitionName !== `plate-${id}`) el.style.viewTransitionName = 'none';
  }
};

interface SwapEvent extends Event {
  activation?: { entry?: { url?: string }; from?: { url?: string } };
  viewTransition?: unknown;
}

if (!prefersReducedMotion()) {
  // Leaving: keep the plate of the project being opened, or of the one being left.
  addEventListener('pageswap', (e) => {
    const ev = e as SwapEvent;
    if (!ev.viewTransition) return;
    keepOnly(idFrom(ev.activation?.entry?.url) || idFrom(location.href));
  });

  // Arriving: the same, plus bring the card the plate lands on into the viewport.
  addEventListener('pagereveal', (e) => {
    const ev = e as SwapEvent;
    if (!ev.viewTransition) return;
    const nav = (window as unknown as { navigation?: { activation?: { from?: { url?: string } } } })
      .navigation;
    const id = idFrom(location.href) || idFrom(nav?.activation?.from?.url);
    keepOnly(id);
    if (location.pathname === '/' && id) {
      const plate = $$<HTMLElement>('.plate').find(
        (p) => p.style.viewTransitionName === `plate-${id}`,
      );
      plate?.closest('.card')?.classList.add('in');
      plate?.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  });
}
