/**
 * smoke.test.tsx — guards against the "blank white page" class of bug.
 *
 * Two things are checked:
 *  1. The whole app mounts in jsdom (no import-time throw, no render-time crash)
 *     and shows the camera gate while the stream is missing.
 *  2. A crashing child is caught by <ErrorBoundary> and turns into a readable
 *     diagnostic card instead of an empty <div id="root">.
 *
 * The 3D canvas is mocked out — jsdom has no WebGL — but stores, HUD, camera gate,
 * JARVIS panel and the error boundaries are all real.
 */

// @vitest-environment jsdom

import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

// ---- 3D is mocked: jsdom has no WebGL and r3f intrinsics are not DOM nodes ----
vi.mock('@react-three/fiber', () => ({
  Canvas: () => null,
  useFrame: () => undefined,
  useThree: () => ({
    camera: { getWorldDirection: () => ({ x: 0, y: 0, z: -1 }), position: { copy() {} }, lookAt() {} },
    size: { width: 1280, height: 720 },
    gl: { setClearColor() {} },
    scene: {},
  }),
}));
vi.mock('@react-three/drei', () => ({
  Grid: () => null,
  Billboard: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children),
}));
vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children),
  Bloom: () => null,
  Vignette: () => null,
  ChromaticAberration: () => null,
}));
// MediaPipe needs real WASM, which jsdom cannot provide.
vi.mock('../vision/handTracker', () => ({
  HandTracker: class {
    ready = false;
    async init() {}
    detect() {
      return { hands: [], inferenceMs: 0 };
    }
    dispose() {}
  },
  LANDMARK: { INDEX_TIP: 8, THUMB_TIP: 4 },
  HAND_CONNECTIONS: [],
}));

/** jsdom has no 2D canvas; every canvas helper in the app expects one to exist. */
function fakeContext(): CanvasRenderingContext2D {
  const gradient = { addColorStop: () => undefined };
  const noop = () => undefined;
  return {
    createRadialGradient: () => gradient,
    createLinearGradient: () => gradient,
    measureText: () => ({ width: 10 }),
    clearRect: noop, fillRect: noop, strokeRect: noop, beginPath: noop, closePath: noop,
    arc: noop, fill: noop, stroke: noop, moveTo: noop, lineTo: noop, drawImage: noop,
    fillText: noop, strokeText: noop, save: noop, restore: noop, translate: noop,
    scale: noop, rotate: noop, setTransform: noop, getImageData: () => ({ data: [] }),
    // deliberately absent: roundRect — see canvas2d.roundRectPath
  } as unknown as CanvasRenderingContext2D;
}

beforeAll(() => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  HTMLCanvasElement.prototype.getContext = (() => fakeContext()) as unknown as HTMLCanvasElement['getContext'];
  if (!window.matchMedia) {
    window.matchMedia = (() => ({ matches: false, addEventListener() {}, removeEventListener() {} })) as never;
  }
});

describe('app shell', () => {
  let container: HTMLDivElement;
  let errors: string[];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    errors = [];
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const message = String(args[0] ?? '');
      // React's act() environment notices are harness noise, not app errors.
      if (!message.includes('act(')) errors.push(message);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    container.remove();
  });

  it('mounts App without throwing and renders the boot gate', async () => {
    const App = (await import('../App')).default;
    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(App));
    });

    // Something must actually be painted — a silent unmount is the bug we fear.
    expect(container.textContent).toBeTruthy();
    // The camera gate owns the screen until the stream is live (jsdom has no camera).
    expect(container.textContent).toMatch(/Jarvis Lab/i);
    expect(container.textContent).toMatch(/waiting for camera|camera access/i);
    expect(errors).toEqual([]);

    await act(async () => root.unmount());
  });

  it('ErrorBoundary turns a crashing child into a diagnostic card', async () => {
    const { default: ErrorBoundary } = await import('../ui/ErrorBoundary');
    const Exploding = () => {
      throw new Error('boom: simulated render failure');
    };
    const root = createRoot(container);
    await act(async () => {
      root.render(
        React.createElement(
          ErrorBoundary,
          { label: '3D renderer', compact: true },
          React.createElement(Exploding),
        ),
      );
    });

    expect(container.textContent).toMatch(/short-circuited/i);
    expect(container.textContent).toMatch(/boom: simulated render failure/);
    expect(container.getAttribute('role')).toBeNull(); // role lives on the card
    expect(container.querySelector('[role="alert"]')).toBeTruthy();

    await act(async () => root.unmount());
  });
});
