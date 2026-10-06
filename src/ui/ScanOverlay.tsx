/**
 * ScanOverlay.tsx — Scan Mode UI (spec §9).
 *
 * Shows the frozen frame, the detected object label, the molecule it maps to and a
 * fallback line when nothing recognisable is found. Everything happens locally.
 */

import { useRef, useEffect } from 'react';
import { freezeFrame, type ScanResult } from '../vision/objectScanner';

export interface ScanOverlayProps {
  video: HTMLVideoElement | null;
  active: boolean;
  busy: boolean;
  result: ScanResult | null;
  onClose: () => void;
}

export function ScanOverlay({ video, active, busy, result, onClose }: ScanOverlayProps) {
  const holder = useRef<HTMLDivElement>(null);

  // Drop the frozen frame into the panel so the user can see what was analysed.
  useEffect(() => {
    if (!active || !video || !holder.current) return;
    const canvas = freezeFrame(video, 320);
    holder.current.innerHTML = '';
    canvas.className = 'w-full rounded border border-jarvis-cyan/30';
    canvas.style.transform = 'scaleX(-1)';
    holder.current.appendChild(canvas);
    return () => {
      holder.current && (holder.current.innerHTML = '');
    };
  }, [active, video, result]);

  if (!active) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-label="Scan mode">
      <div className="w-[min(94vw,560px)] rounded-xl border border-jarvis-cyan/35 bg-[#041821]/95 p-4 font-hud shadow-hud">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold uppercase tracking-[0.24em] text-jarvis-cyan">Scan mode</h2>
          <button type="button" onClick={onClose} className="rounded border border-jarvis-cyan/30 px-3 py-1 font-mono text-[11px] uppercase text-jarvis-cyan/80 hover:bg-jarvis-cyan/15">
            close
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <div ref={holder} className="min-h-[120px]" />
            <p className="mt-1 text-[10px] text-jarvis-cyan/45">
              Frame frozen locally — no image is uploaded or stored.
            </p>
          </div>
          <div>
            {busy && <p className="animate-pulse text-[12px] text-jarvis-cyan/70">Analysing frame…</p>}
            {!busy && result && (
              <>
                <p className="text-[10px] uppercase tracking-[0.2em] text-jarvis-cyan/45">detected</p>
                <p className="text-[15px] text-jarvis-orange">
                  {result.detections[0]?.class ?? 'unidentified object'}
                  {result.detections[0] && (
                    <span className="ml-2 font-mono text-[11px] text-jarvis-cyan/50">
                      {(result.detections[0].score * 100).toFixed(0)}%
                    </span>
                  )}
                </p>
                {result.molecule ? (
                  <>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-jarvis-cyan/45">molecule</p>
                    <p className="text-[18px] font-semibold text-jarvis-cyan">{result.molecule.name}</p>
                    <p className="font-mono text-[12px] text-jarvis-amber">{result.molecule.formula}</p>
                    {result.molecule.note && <p className="mt-1 text-[11px] italic text-jarvis-cyan/70">{result.molecule.note}</p>}
                  </>
                ) : (
                  <p className="mt-2 text-[12px] italic text-jarvis-cyan/60">
                    {result.message || 'No known compound detected. Try another object.'}
                  </p>
                )}
              </>
            )}
            {!busy && !result && (
              <p className="text-[12px] text-jarvis-cyan/60">
                Hold an open palm steady for a second (or say &ldquo;scan this&rdquo;) while pointing the
                camera at an everyday object.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanOverlay;
