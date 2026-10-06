/**
 * main.tsx — React entry point.
 *
 * No service worker, no analytics, no network calls except the optional MediaPipe
 * model/WASM (see .env.example) — the app is deliberately offline-first.
 *
 * Two safety nets live here so a failure is never a blank page:
 *  1. <ErrorBoundary> catches render-time crashes and shows a diagnostic card.
 *  2. A window-level handler catches module-load/async failures that happen before
 *     React has painted anything, and reports them in the #boot element.
 *
 * The #boot placeholder from index.html is removed by a MutationObserver as soon as
 * React commits real DOM into #root (a single rAF is too early — React 18 schedules
 * the first commit after it), and a watchdog explains itself if nothing ever paints.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Styles are imported first so that even a catastrophic module-import failure
// paints the dark lab background instead of a bare white page.
import './index.css';
import App from './App';
import ErrorBoundary from './ui/ErrorBoundary';

// Tell the boot watchdog in index.html that the bundle is alive.
declare global {
  interface Window {
    __JARVIS__?: {
      html: number;
      main: boolean;
      mounted: boolean;
      errors: string[];
      note?: (text: string) => void;
      fatal?: (title: string, lines: string[]) => void;
    };
  }
}

if (window.__JARVIS__) window.__JARVIS__.main = true;

const container = document.getElementById('root');
if (!container) throw new Error('#root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    {/* Last line of defence: a render crash shows a diagnostic card, never a blank page. */}
    <ErrorBoundary label="JARVIS LAB">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

/* --------------------------------------------------------- fatal handler */

const boot = document.getElementById('boot');

/** True once React has actually committed something into #root. */
function hasPainted(): boolean {
  return !!container && container.childElementCount > 0;
}

function showFatal(title: string, detail: string) {
  if (hasPainted()) return;
  // Prefer the watchdog panel in index.html — it reports environment details too.
  if (window.__JARVIS__?.fatal) {
    window.__JARVIS__.fatal(title, [detail]);
    return;
  }
  if (!boot) return;
  boot.dataset.fatal = 'true';
  boot.innerHTML = '';
  const heading = document.createElement('div');
  heading.textContent = title;
  const note = document.createElement('small');
  note.textContent = detail;
  const action = document.createElement('small');
  action.textContent =
    'Reload the page. If it keeps happening, run npm run dev locally and check the browser console.';
  boot.append(heading, note, action);
}

window.addEventListener('error', (event) => {
  // Script/resource load failures arrive here with no React involvement.
  const target = event.target;
  if (target instanceof HTMLElement && target.tagName) {
    showFatal(
      'Failed to load JARVIS LAB',
      `A script could not be loaded (<${target.tagName.toLowerCase()}>). Check your network or the dev server.`,
    );
    return;
  }
  showFatal('JARVIS LAB failed to start', (event as ErrorEvent).message || 'Unknown error.');
});

window.addEventListener('unhandledrejection', (event) => {
  showFatal('JARVIS LAB failed to start', String((event.reason as Error)?.message ?? event.reason ?? ''));
});

/* ------------------------------------------------- boot placeholder teardown */

let watchdog = 0;
const observer = new MutationObserver(() => {
  if (!hasPainted()) return;
  // React has committed — drop the placeholder and stand the watchdog down.
  window.clearTimeout(watchdog);
  observer.disconnect();
  if (window.__JARVIS__) window.__JARVIS__.mounted = true;
  boot?.remove();
});
observer.observe(container, { childList: true });

// If the observer somehow never fires (or React never mounts), say so out loud
// instead of leaving the visitor staring at "Initialising…".
watchdog = window.setTimeout(() => {
  if (hasPainted()) {
    boot?.remove();
    observer.disconnect();
    return;
  }
  showFatal(
    'JARVIS LAB did not start',
    'The interface never mounted. Reload the page (Cmd/Ctrl+Shift+R); if it still hangs, the '
      + 'dependencies are probably missing — run "npm install" and restart "npm run dev".',
  );
}, 8000);

// Belt and braces: if it was already painted before the observer was wired up.
if (hasPainted()) {
  window.clearTimeout(watchdog);
  observer.disconnect();
  if (window.__JARVIS__) window.__JARVIS__.mounted = true;
  boot?.remove();
}
