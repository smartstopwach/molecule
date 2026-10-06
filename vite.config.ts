import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * JARVIS LAB is 100% client-side: no backend, no API routes.
 * `base: './'` keeps the build portable for Vercel / Netlify / GitHub Pages.
 *
 * ENTRY POINTS
 * ------------
 * The repo root's `index.html` is the PUBLISHED page — plain built HTML/CSS/JS — so
 * any static host pointed at the folder root serves a working site with no build
 * step and no configuration (this is what GitHub Pages does by default).
 *
 * Development uses a separate entry, `dev.html`, so the published file is never
 * overwritten by the dev server:
 *   npm run dev     →  http://localhost:5173/dev.html
 *   npm run build   →  dist/dev.html + dist/assets/
 *   npm run publish →  copies them to ./index.html and ./assets/  (what ships)
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0', // required so the sandbox/live preview can reach the dev server
    port: 5173,
    strictPort: false,
    open: '/dev.html',
  },
  preview: { host: '0.0.0.0', port: 4173 },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 2500,
    outDir: 'dist',
    rollupOptions: {
      // Build from the dev entry — never from the published root index.html.
      input: 'dev.html',
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          mediapipe: ['@mediapipe/tasks-vision'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.test.tsx'],
    globals: true,
  },
  // WASM / model loading for MediaPipe is done from a CDN at runtime, so we
  // only need to make sure Vite does not try to pre-bundle the worker asset.
  optimizeDeps: { exclude: ['@mediapipe/tasks-vision'] },
} as any);
