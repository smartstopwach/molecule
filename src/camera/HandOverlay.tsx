/**
 * HandOverlay.tsx — the cyan skeleton drawn on top of the webcam feed (spec §2).
 *
 * Reads `HandState[]` straight from the GestureEngine (already EMA-smoothed) and
 * paints it onto a transparent canvas: bones, joints, fingertip glow, pinch ring
 * and a mini pinch-strength meter. Everything is client-side; the canvas is never
 * read back by a network request.
 */

import { useEffect, useRef } from 'react';
import { HAND_CONNECTIONS } from '../vision/handTracker';
import type { HandState } from '../vision/gestures.types';

export interface HandOverlayProps {
  getStates: () => readonly HandState[];
  /** Mirror horizontally to match the mirrored video preview. */
  mirror?: boolean;
  visible?: boolean;
  className?: string;
}

const CYAN = '#38e8ff';
const AMBER = '#ff9d3c';

export function HandOverlay({ getStates, mirror = true, visible = true, className }: HandOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.clearRect(0, 0, w, h);

      const states = getStates();
      for (const hand of states) {
        const pts = hand.smooth;
        if (!pts?.length) continue;
        const px = (i: number) => {
          const p = pts[i];
          return { x: (mirror ? 1 - p.x : p.x) * w, y: p.y * h };
        };

        // pinch ring around thumb + index when pinching
        if (hand.pinching) {
          const a = px(4);
          const b = px(8);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const r = Math.max(9, Math.hypot(a.x - b.x, a.y - b.y) * 0.9);
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 2;
          ctx.shadowColor = CYAN;
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(mx, my, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // bones
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = hand.pinching ? AMBER : CYAN;
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        for (const [a, b] of HAND_CONNECTIONS) {
          const pa = px(a);
          const pb = px(b);
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }

        // joints
        for (let i = 0; i < pts.length; i++) {
          const p = px(i);
          const tip = i === 4 || i === 8 || i === 12 || i === 16 || i === 20;
          ctx.beginPath();
          ctx.arc(p.x, p.y, tip ? 4.2 : 2.6, 0, Math.PI * 2);
          ctx.fillStyle = tip ? AMBER : CYAN;
          ctx.fill();
        }

        // fingertip glow for the pointing finger
        const tip8 = px(8);
        ctx.beginPath();
        ctx.arc(tip8.x, tip8.y, 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,157,60,0.75)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // handedness + finger count label
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(56,232,255,0.75)';
        ctx.font = '10px "Share Tech Mono", monospace';
        const wrist = px(0);
        ctx.fillText(`${hand.handedness} · ${hand.fingerCount}`, wrist.x - 8, wrist.y + 16);
      }
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, [getStates, mirror, visible]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`}
      aria-hidden
    />
  );
}

export default HandOverlay;
