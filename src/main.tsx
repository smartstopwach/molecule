/**
 * main.tsx — React entry point.
 *
 * No service worker, no analytics, no network calls except the optional MediaPipe
 * model/WASM (see .env.example) — the app is deliberately offline-first.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('#root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
