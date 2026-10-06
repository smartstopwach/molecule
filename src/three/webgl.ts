/**
 * webgl.ts — capability probe.
 *
 * A missing/blocked WebGL context makes three.js throw during render, which unmounts
 * the entire React tree (→ the dreaded blank page). We check first and show a
 * readable message instead, leaving the HUD and the rest of the app alive.
 */

let cached: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;
  if (typeof window === 'undefined' || typeof document === 'undefined') return (cached = false);
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    cached = !!gl;
    // Release the context immediately; browsers cap how many can be live at once.
    const lose = (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context') as
      | { loseContext: () => void }
      | null
      | undefined;
    lose?.loseContext?.();
  } catch {
    cached = false;
  }
  return cached;
}
