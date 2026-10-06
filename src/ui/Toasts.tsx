/**
 * Toasts.tsx — transient notifications (spec §11).
 *
 * Every toast is also announced by JARVIS (when voice is on), so nothing is
 * vision-only. Rejections are red, achievements violet, successes green.
 */

import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

const TONE: Record<string, string> = {
  success: 'border-jarvis-green/60 bg-green-950/60 text-jarvis-green',
  error: 'border-jarvis-red/60 bg-red-950/60 text-jarvis-red',
  warn: 'border-jarvis-orange/60 bg-orange-950/50 text-jarvis-orange',
  info: 'border-jarvis-cyan/50 bg-cyan-950/50 text-jarvis-cyan',
  achievement: 'border-jarvis-violet/60 bg-violet-950/50 text-jarvis-violet',
};

const ICON: Record<string, string> = {
  success: '✔',
  error: '✖',
  warn: '⚠',
  info: 'ℹ',
  achievement: '★',
};

export function Toasts() {
  const toasts = useGameStore((s) => s.toasts);
  const dismiss = useGameStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) => window.setTimeout(() => dismiss(t.id), t.ttl));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [toasts, dismiss]);

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-40 flex w-[min(92vw,520px)] -translate-x-1/2 flex-col items-center gap-2">
      {toasts.slice(-4).map((t) => (
        <div
          key={t.id}
          className={`animate-rise pointer-events-auto w-full rounded border px-4 py-2 font-hud text-[12px] shadow-hud backdrop-blur-md ${TONE[t.kind]}`}
          role="status"
        >
          <span className="mr-2 font-mono">{ICON[t.kind]}</span>
          <span className="font-semibold uppercase tracking-widest">{t.title}</span>
          {t.body && <span className="ml-2 font-mono text-[11px] opacity-80">{t.body}</span>}
        </div>
      ))}
    </div>
  );
}

export default Toasts;
