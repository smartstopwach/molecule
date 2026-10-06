/**
 * boot.test.tsx — the "Initialising JARVIS LAB…" placeholder must disappear.
 *
 * Regression guard: the placeholder is removed by a MutationObserver when React
 * commits DOM into #root. A single requestAnimationFrame is too early under React 18,
 * which left the placeholder (a fixed, full-screen overlay) stuck on top forever.
 */

// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

// A trivial stand-in so this test only exercises the mounting/placeholder logic.
vi.mock('../App', () => ({
  default: () => React.createElement('div', { id: 'app-mounted' }, 'APP MOUNTED'),
}));

beforeAll(() => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  if (!HTMLCanvasElement.prototype.getContext) {
    HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext'];
  }
});

/** Wait until `predicate()` is true (or the timeout expires). */
async function waitFor(predicate: () => boolean, timeout = 3000): Promise<void> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeout) throw new Error('waitFor timed out');
    await new Promise((r) => setTimeout(r, 20));
  }
}

describe('boot placeholder', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div><div id="boot">Initialising JARVIS LAB…</div>';
    vi.resetModules();
  });

  it('is removed once React has rendered the app', async () => {
    await import('../main');

    await waitFor(() => !!document.getElementById('app-mounted'));
    // The overlay must not linger on top of a working app.
    await waitFor(() => document.getElementById('boot') === null);

    expect(document.getElementById('root')?.textContent).toContain('APP MOUNTED');
  });

  it('is click-through in the shipped HTML so it can never trap the app', () => {
    // #boot is a fixed, full-screen overlay; index.html must make it click-through.
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).toMatch(/#boot\s*\{[^}]*pointer-events:\s*none/);
    expect(html).toContain('id="boot"');
  });
});
