/** Small DOM helpers shared by every foundation script. */

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [
  ...root.querySelectorAll<T>(sel),
];

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pointer-following effects need a precise hovering pointer and motion allowed. */
export const canFollowPointer = () =>
  matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion();

/** Wrap `fn` so any number of calls within one frame run it once, on the next frame. */
export const frame = (fn: () => void) => {
  let id = 0;
  return () => {
    if (id) return;
    id = requestAnimationFrame(() => {
      id = 0;
      fn();
    });
  };
};
