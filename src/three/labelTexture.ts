/**
 * labelTexture.ts — element symbols drawn to a canvas texture.
 *
 * We deliberately avoid drei's <Text> (troika) because it fetches a font from a CDN;
 * a canvas texture keeps JARVIS LAB fully offline-capable and dependency-free.
 */

import { CanvasTexture, LinearFilter, type Texture } from 'three';

const cache = new Map<string, Texture>();

export function labelTexture(text: string, color = '#eaf8ff', background = 'rgba(0,0,0,0)'): Texture {
  const key = `${text}|${color}|${background}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  if (background !== 'rgba(0,0,0,0)') {
    ctx.fillStyle = background;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = `600 ${text.length > 1 ? 52 : 66}px "Rajdhani", "Share Tech Mono", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillText(text, size / 2, size / 2 + 2);

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.anisotropy = 4;
  cache.set(key, texture);
  return texture;
}

/** Radial gradient sprite used for the atom glow and the fingertip cursor. */
export function glowTexture(color = '#38e8ff'): Texture {
  const key = `glow|${color}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, `${color}aa`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  cache.set(key, texture);
  return texture;
}

export function disposeLabelCache(): void {
  for (const t of cache.values()) t.dispose();
  cache.clear();
}
