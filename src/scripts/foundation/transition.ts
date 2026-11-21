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

const KEY = 'vt-origin';

/** Where the plate left from (viewport px) and its colour; read by the next page's reveal. */
const saveOrigin = (id: string) => {
  const plate = $$<HTMLElement>('.plate').find((p) => p.style.viewTransitionName === `plate-${id}`);
  if (!plate) return;
  const r = plate.getBoundingClientRect();
  const origin = {
    x: Math.round(r.left + r.width / 2),
    y: Math.round(r.top + r.height / 2),
    hue: plate.style.getPropertyValue('--hue').trim(),
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(origin));
  } catch {}
  applyOrigin(origin);
};

const applyOrigin = (o: { x: number; y: number; hue: string }) => {
  const root = document.documentElement.style;
  root.setProperty('--vt-x', `${o.x}px`);
  root.setProperty('--vt-y', `${o.y}px`);
  if (o.hue) root.setProperty('--vt-hue', o.hue);
};

const loadOrigin = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) applyOrigin(JSON.parse(raw));
  } catch {}
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
    const id = idFrom(ev.activation?.entry?.url) || idFrom(location.href);
    keepOnly(id);
    saveOrigin(id);
  });

  // Arriving: the same, plus bring the card the plate lands on into the viewport.
  addEventListener('pagereveal', (e) => {
    const ev = e as SwapEvent;
    if (!ev.viewTransition) return;
    const nav = (window as unknown as { navigation?: { activation?: { from?: { url?: string } } } })
      .navigation;
    const id = idFrom(location.href) || idFrom(nav?.activation?.from?.url);
    keepOnly(id);
    loadOrigin();
    if (location.pathname === '/' && id) {
      const plate = $$<HTMLElement>('.plate').find(
        (p) => p.style.viewTransitionName === `plate-${id}`,
      );
      plate?.closest('.card')?.classList.add('in');
      plate?.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  });
}
