/**
 * canvas2d.ts — tiny, defensive 2D-canvas helpers.
 *
 * Two rules motivate this file:
 *  1. `canvas.getContext('2d')` can legitimately return null (canvas disabled by
 *     policy, too many live contexts, headless browsers). Touching a null context
 *     throws and — because this runs during render — takes the whole app down.
 *  2. `ctx.roundRect()` is only in Chrome 99+ / Firefox 112+ / Safari 16+. Older
 *     browsers throw "ctx.roundRect is not a function". We draw the path by hand
 *     when the native method is missing.
 *
 * Every helper degrades to something harmless instead of throwing.
 */

/** Get a 2D context, or null when the browser refuses to give us one. */
export function get2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  try {
    return canvas.getContext('2d');
  } catch {
    return null;
  }
}

/** Create a canvas of a given size and return it with its context (or nulls). */
export function makeCanvas(
  width: number,
  height: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D | null } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx: get2d(canvas) };
}

/**
 * Rounded-rectangle path. Uses the native `roundRect` when available and falls
 * back to arcTo otherwise, so the app runs on pre-2022 browsers too.
 */
export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  if (typeof (ctx as { roundRect?: unknown }).roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** A 1×1 transparent texture stand-in used when a canvas cannot be created. */
export function blankCanvas(width = 1, height = 1): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
