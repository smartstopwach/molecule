/**
 * degradation.test.tsx — the app must degrade, never disappear.
 *
 * With WebGL unavailable, JARVIS LAB shows a "3D stage offline" panel and keeps the
 * HUD, the camera gate and all the chemistry alive. This is the difference between
 * "no GPU in this browser" and a blank white page.
 */

// @vitest-environment jsdom

import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

vi.mock('../three/webgl', () => ({ isWebGLAvailable: () => false }));
vi.mock('@react-three/fiber', () => ({
  Canvas: () => null,
  useFrame: () => undefined,
  useThree: () => ({ camera: {}, size: { width: 800, height: 600 }, gl: {}, scene: {} }),
}));
vi.mock('@react-three/drei', () => ({ Grid: () => null, Billboard: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children) }));
vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children),
  Bloom: () => null,
  Vignette: () => null,
  ChromaticAberration: () => null,
}));
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

beforeAll(() => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext'];
});

describe('without WebGL', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => container.remove());

  it('keeps the HUD and explains that the 3D stage is offline', async () => {
    const App = (await import('../App')).default;
    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(App));
    });

    expect(container.textContent).toMatch(/3D stage offline/i);
    // The rest of the lab is still there.
    expect(container.textContent).toMatch(/Jarvis Lab/i);
    expect(container.textContent).toMatch(/Elements/i);

    await act(async () => root.unmount());
  });
});
