/**
 * CameraGate.tsx — the boot screen (spec §2).
 *
 * Camera access is COMPULSORY: until the stream is live, the app is blocked behind
 * this gate. The screen shows the live (mirrored, dimmed, blue-tinted) video behind
 * an animated arc reactor and a fake-but-honest SYSTEM BOOT log; on failure it
 * swaps to "CAMERA ACCESS REQUIRED" with a retry button and the reason.
 */

import { useEffect, useMemo, useState } from 'react';
import { useCamera } from './useCamera';
import { playSfx } from '../jarvis/sfx';
import { speak } from '../jarvis/speech';
import { line } from '../jarvis/dialogue';
import { useGameStore } from '../store/useGameStore';

const BOOT_LOG = [
  '> power    : arc reactor ......... 100%',
  '> optics   : hand landmark model  ok',
  '> renderer : webgl2 .............. ok',
  '> physics  : vsepr solver ........ ok',
  '> chem     : element table ....... 36 loaded',
  '> audio    : speech synthesis .... ready',
  '> privacy  : local only .......... enforced',
  '> jarvis   : online',
];

export interface CameraGateProps {
  onReady: (video: HTMLVideoElement) => void;
  /** Fade the gate out but keep it mounted (so the stream stays alive). */
  dismissed?: boolean;
}

export function CameraGate({ onReady, dismissed = false }: CameraGateProps) {
  const { videoRef, status, error, retry } = useCamera({ width: 1280, height: 720, facingMode: 'user' });
  const [booted, setBooted] = useState(false);

  // Boot log types out while the camera is being requested.
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    if (status === 'live' && lines.length) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLines(BOOT_LOG.slice(0, i));
      if (i >= BOOT_LOG.length) window.clearInterval(id);
    }, 170);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once live: play the boot cue, speak the greeting, then hand over to the app.
  useEffect(() => {
    if (status !== 'live' || booted) return;
    const video = videoRef.current;
    if (!video) return;
    const boot = line('boot');
    const game = useGameStore.getState();
    game.say(boot);                       // captioned in the JARVIS panel
    playSfx('boot');
    if (game.settings.voiceEnabled) speak(boot, { interrupt: true });
    const id = window.setTimeout(() => {
      setBooted(true);
      onReady(video);
    }, 1250);
    return () => window.clearTimeout(id);
  }, [status, booted, onReady, videoRef]);

  const blocked = status === 'denied' || status === 'error' || status === 'unsupported';

  const { headline, advice } = useMemo(() => {
    switch (status) {
      case 'denied':
        return {
          headline: 'Camera permission denied',
          advice:
            'Click the camera icon in your browser\u2019s address bar, choose "Allow", then press Retry. JARVIS LAB cannot track your hands without a video stream.',
        };
      case 'unsupported':
        return {
          headline: 'Camera API unavailable',
          advice: 'This browser does not expose getUserMedia. Please open JARVIS LAB in the latest Chrome or Edge.',
        };
      case 'error':
      default:
        return {
          headline: 'Camera unavailable',
          advice:
            'Another application may be using the camera, or no device is connected. Close competing apps (Zoom, Meet, Photo Booth) and try again.',
        };
    }
  }, [status]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#02070a] transition-opacity duration-700 ${
        dismissed ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={dismissed}
    >
      {/* mirrored, dimmed, blue-tinted video background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          status === 'live' ? (dismissed ? 'opacity-0' : 'opacity-40') : 'opacity-0'
        }`}
        style={{ transform: 'scaleX(-1)', filter: 'brightness(0.55) saturate(0.7) hue-rotate(170deg)' }}
      />
      <div className="absolute inset-0 bg-scanline opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,232,255,0.16),transparent_62%)]" />

      <div className="relative z-10 flex w-[min(90vw,560px)] flex-col items-center">
        {/* arc reactor */}
        <div className={`relative mb-6 h-44 w-44 ${status === 'requesting' ? 'animate-spinSlow' : ''}`}>
          <div className="absolute inset-0 rounded-full border-2 border-jarvis-cyan/25" />
          <div className="absolute inset-3 rounded-full border border-jarvis-cyan/40" />
          <div
            className={`absolute inset-6 rounded-full border-4 ${
              blocked ? 'border-jarvis-red/70' : 'border-jarvis-cyan/70'
            } shadow-[0_0_40px_rgba(56,232,255,0.55)]`}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-full ${
              blocked ? 'bg-red-500/10' : 'bg-cyan-400/10'
            } blur-[2px]`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-hud text-3xl font-bold ${blocked ? 'text-jarvis-red' : 'text-jarvis-cyan'}`}>
              {status === 'live' ? '100%' : blocked ? '0%' : '...'}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-jarvis-cyan/60">reactor</span>
          </div>
        </div>

        <h1 className="font-hud text-2xl font-bold uppercase tracking-[0.42em] text-jarvis-cyan drop-shadow-[0_0_14px_rgba(56,232,255,0.7)]">
          Jarvis Lab
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-jarvis-cyan/50">
          AR Molecule Builder · Stark Industries R&amp;D
        </p>

        {!blocked ? (
          <>
            <pre className="mt-6 h-[132px] w-full max-w-[420px] overflow-hidden whitespace-pre-wrap rounded border border-jarvis-cyan/20 bg-black/40 p-3 font-mono text-[10px] leading-[1.5] text-jarvis-cyan/80">
{lines.join('\n')}
              <span className="animate-pulse">█</span>
            </pre>
            <p className="mt-4 text-center text-[12px] uppercase tracking-[0.24em] text-jarvis-cyan/70">
              {status === 'live' ? 'systems online' : 'waiting for camera permission…'}
            </p>
          </>
        ) : (
          <div className="mt-6 w-full max-w-[460px] rounded border border-jarvis-red/50 bg-red-950/25 p-4 text-center">
            <h2 className="font-hud text-lg font-bold uppercase tracking-[0.24em] text-jarvis-red">
              Camera access required
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-jarvis-red/70">{headline}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-jarvis-cyan/80">{advice}</p>
            {error && <p className="mt-2 font-mono text-[10px] text-jarvis-red/70">{error}</p>}
            <p className="mt-2 text-[11px] italic text-jarvis-cyan/50">
              Video never leaves your device — but without it there are no hands to track.
            </p>
            <button
              type="button"
              onClick={() => void retry()}
              className="mt-4 rounded border border-jarvis-cyan/60 bg-jarvis-cyan/10 px-6 py-2 font-hud text-[12px] uppercase tracking-[0.24em] text-jarvis-cyan transition hover:bg-jarvis-cyan/25"
            >
              Retry access
            </button>
          </div>
        )}

        {status === 'requesting' && (
          <p className="mt-3 text-[11px] text-jarvis-cyan/50">
            If no prompt appears, check the camera icon in your browser&apos;s address bar.
          </p>
        )}
      </div>
    </div>
  );
}

export default CameraGate;
