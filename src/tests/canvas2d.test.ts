/**
 * canvas2d.test.ts — guards the two canvas foot-guns that once blanked the app:
 *   · `getContext('2d')` returning null
 *   · `ctx.roundRect()` missing (Chrome < 99, Firefox < 112, Safari < 16)
 */

// @vitest-environment jsdom

import { beforeAll, describe, expect, it, vi } from 'vitest';
import { blankCanvas, get2d, makeCanvas, roundRectPath } from '../three/canvas2d';

beforeAll(() => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

describe('canvas2d', () => {
  it('get2d returns null instead of throwing when there is no context', () => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext'];
    const { canvas, ctx } = makeCanvas(8, 8);
    expect(canvas.width).toBe(8);
    expect(ctx).toBeNull();
    expect(get2d(canvas)).toBeNull();
    HTMLCanvasElement.prototype.getContext = original;
  });

  it('roundRectPath falls back to arcTo when roundRect is unavailable', () => {
    const calls: string[] = [];
    const ctx = {
      beginPath: () => calls.push('beginPath'),
      moveTo: () => calls.push('moveTo'),
      arcTo: () => calls.push('arcTo'),
      closePath: () => calls.push('closePath'),
      roundRect: undefined, // simulate an older browser
    } as unknown as CanvasRenderingContext2D;

    roundRectPath(ctx, 0, 0, 100, 50, 8);
    expect(calls.filter((c) => c === 'arcTo')).toHaveLength(4);
    expect(calls[0]).toBe('beginPath');
  });

  it('roundRectPath uses the native roundRect when present', () => {
    const calls: string[] = [];
    const ctx = {
      beginPath: () => calls.push('beginPath'),
      roundRect: () => calls.push('roundRect'),
      arcTo: () => calls.push('arcTo'),
    } as unknown as CanvasRenderingContext2D;

    roundRectPath(ctx, 0, 0, 10, 10, 2);
    expect(calls).toContain('roundRect');
    expect(calls).not.toContain('arcTo');
  });

  it('clamps the corner radius to half the shortest side', () => {
    const seen: number[] = [];
    const ctx = {
      beginPath: () => undefined,
      roundRect: (_x: number, _y: number, _w: number, _h: number, r: number) => seen.push(r),
    } as unknown as CanvasRenderingContext2D;
    roundRectPath(ctx, 0, 0, 40, 20, 999);
    expect(seen[0]).toBe(10);
  });

  it('blankCanvas produces a usable 1×1 fallback surface', () => {
    const canvas = blankCanvas();
    expect(canvas.width).toBe(1);
    expect(canvas.height).toBe(1);
  });

  it('labelTexture and glowTexture survive a null 2D context', async () => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext'];
    vi.resetModules();
    const { labelTexture, glowTexture } = await import('../three/labelTexture');
    // Must not throw — the components get a blank texture instead.
    expect(labelTexture('C')).toBeTruthy();
    expect(glowTexture('#38e8ff')).toBeTruthy();
    HTMLCanvasElement.prototype.getContext = original;
  });
});
