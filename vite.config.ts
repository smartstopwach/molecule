import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// JARVIS LAB is 100% client-side: no backend, no API routes.
// `base: './'` keeps the build portable for Vercel / Netlify / GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0', // required so the sandbox/live preview can reach the dev server
    port: 5173,
    strictPort: false,
  },
  preview: { host: '0.0.0.0', port: 4173 },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
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
    include: ['src/tests/**/*.test.ts'],
    globals: true,
  },
  // WASM / model loading for MediaPipe is done from a CDN at runtime, so we
  // only need to make sure Vite does not try to pre-bundle the worker asset.
  optimizeDeps: { exclude: ['@mediapipe/tasks-vision'] },
} as any);
