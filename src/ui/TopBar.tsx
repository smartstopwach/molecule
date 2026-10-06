/**
 * TopBar.tsx — mode, level, timer, score, streak, FPS and camera LED (spec §11).
 */

import { useEffect, useState } from 'react';
import { useGameStore, type GameMode } from '../store/useGameStore';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { getLevel } from '../game/campaign';
import { playSfx } from '../jarvis/sfx';

const MODES: { id: GameMode; label: string }[] = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'timeAttack', label: 'Time Attack' },
  { id: 'quiz', label: 'Hybrid Quiz' },
  { id: 'reaction', label: 'Reaction Lab' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'scan', label: 'Scan' },
];

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TopBar({ cameraLive }: { cameraLive: boolean }) {
  const mode = useGameStore((s) => s.mode);
  const setMode = useGameStore((s) => s.setMode);
  const levelId = useGameStore((s) => s.levelId);
  const elapsedMs = useGameStore((s) => s.elapsedMs);
  const fps = useGameStore((s) => s.fps);
  const inferenceMs = useGameStore((s) => s.inferenceMs);
  const score = useGameStore((s) => s.score);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const level = mode === 'campaign' ? getLevel(levelId) : null;
  const remaining = mode === 'timeAttack' ? Math.max(0, 60_000 - elapsedMs) : elapsedMs;

  return (
    <header className="pointer-events-auto flex items-center gap-3 rounded-lg border border-jarvis-cyan/25 bg-[#041821]/85 px-3 py-2 font-hud shadow-hud backdrop-blur-md">
      <div className="flex items-center gap-2 pr-2">
        <span className={`h-2.5 w-2.5 rounded-full ${cameraLive ? 'animate-pulse bg-jarvis-green shadow-[0_0_10px_#3ef2a1]' : 'bg-jarvis-red'}`} title={cameraLive ? 'Camera live' : 'Camera offline'} />
        <span className="text-[13px] font-bold uppercase tracking-[0.3em] text-jarvis-cyan">Jarvis Lab</span>
      </div>

      <nav className="flex flex-wrap gap-1 border-l border-jarvis-cyan/20 pl-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              playSfx('click');
              setMode(m.id);
            }}
            className={`rounded px-2 py-1 text-[10px] uppercase tracking-[0.16em] transition ${
              mode === m.id
                ? 'bg-jarvis-cyan/20 text-jarvis-cyan shadow-[0_0_12px_rgba(56,232,255,0.35)]'
                : 'text-jarvis-cyan/45 hover:bg-jarvis-cyan/10 hover:text-jarvis-cyan/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-4 font-mono text-[11px] text-jarvis-cyan/85">
        {level && (
          <span className="uppercase tracking-widest text-jarvis-cyan/60">
            {level.world} · {level.name}
          </span>
        )}
        <span
          className={`tabular-nums ${mode === 'timeAttack' && remaining < 10_000 ? 'text-jarvis-red' : 'text-jarvis-amber'}`}
          title={mode === 'timeAttack' ? 'Time remaining' : 'Elapsed'}
        >
          ⏱ {mode === 'timeAttack' ? fmt(remaining) : fmt(elapsedMs)}
        </span>
        <span className="tabular-nums text-jarvis-green" title="Score">
          ◈ {score.score}
        </span>
        <span
          className={`tabular-nums ${score.streak >= 3 ? 'text-jarvis-violet' : 'text-jarvis-cyan/60'}`}
          title="Streak (×combo)"
        >
          ×{score.combo} · streak {score.streak}
        </span>
        <span className="tabular-nums text-jarvis-cyan/45" title="Render FPS / inference">
          {fps} fps · {inferenceMs.toFixed(1)} ms
        </span>
        <span className="text-[10px] text-jarvis-cyan/35">{new Date(now).toLocaleTimeString()}</span>
      </div>
    </header>
  );
}

/** Small read-only stats strip (atom/bond counts) shown under the top bar. */
export function StatsStrip() {
  const atoms = useMoleculeStore((s) => s.atoms);
  const bonds = useMoleculeStore((s) => s.bonds);
  return (
    <div className="pointer-events-none font-mono text-[10px] uppercase tracking-[0.18em] text-jarvis-cyan/50">
      {atoms.length} atoms · {bonds.length} bonds
    </div>
  );
}

export default TopBar;
