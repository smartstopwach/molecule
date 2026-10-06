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
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Styles are imported first so that even a catastrophic module-import failure
// paints the dark lab background instead of a bare white page.
import './index.css';
import App from './App';
import ErrorBoundary from './ui/ErrorBoundary';

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

/** True once React has actually painted something into #root. */
function hasPainted(): boolean {
  return !!container && container.childElementCount > 0;
}

function showFatal(title: string, detail: string) {
  if (!boot || hasPainted()) return;
  boot.innerHTML = '';
  const heading = document.createElement('div');
  heading.textContent = title;
  const note = document.createElement('small');
  note.textContent = detail;
  const action = document.createElement('small');
  action.innerHTML =
    'Reload the page. If it keeps happening, run <code>npm run dev</code> locally and check the browser console.';
  boot.append(heading, note, action);
}

window.addEventListener('error', (event) => {
  // Module/inline script failures surface here with no React involvement.
  if (event.target && event.target !== window && (event.target as HTMLElement).tagName) {
    showFatal(
      'Failed to load JARVIS LAB',
      `A script could not be loaded (${(event.target as HTMLElement).tagName}). Check your network or the dev server.`,
    );
    return;
  }
  showFatal('JARVIS LAB failed to start', (event as ErrorEvent).message || 'Unknown error.');
});

window.addEventListener('unhandledrejection', (event) => {
  showFatal('JARVIS LAB failed to start', String((event.reason as Error)?.message ?? event.reason ?? ''));
});

// React has mounted successfully — remove the placeholder.
requestAnimationFrame(() => {
  if (hasPainted()) boot?.remove();
});
