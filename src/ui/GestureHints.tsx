/**
 * GestureHints.tsx — bottom bar: live gesture, cheat sheet, undo/redo, toggles.
 */

import { useGameStore } from '../store/useGameStore';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { playSfx } from '../jarvis/sfx';
import type { GestureName } from '../vision/gestures.types';

const HINTS: { gesture: GestureName; action: string }[] = [
  { gesture: 'POINT', action: 'move cursor' },
  { gesture: 'PINCH', action: 'place / grab atom' },
  { gesture: 'PINCH_HOLD', action: 'bond · show σ/π overlap' },
  { gesture: 'DOUBLE_PINCH', action: 'cycle bond order' },
  { gesture: 'OPEN_PALM', action: 'radial menu · AR palm overlay' },
  { gesture: 'FIST', action: 'delete held atom' },
  { gesture: 'SWIPE_LEFT', action: 'resonance / undo' },
  { gesture: 'SWIPE_RIGHT', action: 'resonance / redo' },
  { gesture: 'TWO_HAND_ROTATE', action: 'orbit camera' },
  { gesture: 'TWO_HAND_ZOOM', action: 'zoom' },
  { gesture: 'TWO_HAND_SPREAD', action: 'exploded view' },
  { gesture: 'FINGER_COUNT', action: 'answer quiz · bond order' },
  { gesture: 'CIRCLE', action: 'ring builder' },
];

export function GestureHints({ gesture, fingerCount }: { gesture: GestureName; fingerCount: number }) {
  const undo = useMoleculeStore((s) => s.undo);
  const redo = useMoleculeStore((s) => s.redo);
  const clearMolecule = useMoleculeStore((s) => s.clear);
  const canUndo = useMoleculeStore((s) => s.history.length > 0);
  const canRedo = useMoleculeStore((s) => s.future.length > 0);
  const orbitals = useMoleculeStore((s) => s.showOrbitals);
  const setOrbitals = useMoleculeStore((s) => s.setOrbitals);
  const lonePairs = useMoleculeStore((s) => s.showLonePairs);
  const setLonePairs = useMoleculeStore((s) => s.setLonePairs);
  const explode = useMoleculeStore((s) => s.explode);
  const setExplode = useMoleculeStore((s) => s.setExplode);
  const settings = useGameStore((s) => s.settings);
  const setSettings = useGameStore((s) => s.setSettings);
  const say = useGameStore((s) => s.say);

  return (
    <footer className="pointer-events-auto flex items-end gap-2">
      {/* gesture cheatsheet */}
      <div className="max-w-[52vw] flex-1 overflow-hidden rounded-lg border border-jarvis-cyan/25 bg-[#041821]/85 px-3 py-2 font-hud shadow-hud backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-jarvis-cyan/45">gesture</span>
          <span className="rounded bg-jarvis-cyan/15 px-2 py-0.5 font-mono text-[12px] text-jarvis-cyan">
            {gesture === 'NONE' ? '—' : gesture.replace(/_/g, ' ')}
          </span>
          {fingerCount > 0 && <span className="font-mono text-[11px] text-jarvis-amber">{fingerCount} finger{fingerCount > 1 ? 's' : ''}</span>}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {HINTS.map((h) => (
            <span
              key={h.gesture}
              className={`font-mono text-[9.5px] ${h.gesture === gesture ? 'text-jarvis-orange' : 'text-jarvis-cyan/40'}`}
            >
              {h.gesture.replace(/_/g, ' ')} → {h.action}
            </span>
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-col gap-1 rounded-lg border border-jarvis-cyan/25 bg-[#041821]/85 px-2 py-2 font-hud shadow-hud backdrop-blur-md">
        <div className="flex gap-1">
          <Btn disabled={!canUndo} onClick={() => { undo(); playSfx('whoosh'); }} title="Undo (swipe left)">↶ undo</Btn>
          <Btn disabled={!canRedo} onClick={() => { redo(); playSfx('whoosh'); }} title="Redo (swipe right)">↷ redo</Btn>
          <Btn onClick={() => { clearMolecule(); playSfx('whoosh'); say('Bench cleared.'); }} title="Clear the bench">✕ clear</Btn>
        </div>
        <div className="flex gap-1">
          <Toggle on={orbitals} onClick={() => setOrbitals(!orbitals)} title="Orbital mode">orbitals</Toggle>
          <Toggle on={lonePairs} onClick={() => setLonePairs(!lonePairs)} title="Lone pairs">lone pairs</Toggle>
          <Toggle on={explode > 0.05} onClick={() => setExplode(explode > 0.05 ? 0 : 0.6)} title="Exploded view">explode</Toggle>
          <Toggle on={settings.ionicMode} onClick={() => setSettings({ ionicMode: !settings.ionicMode })} title="Ionic bonding mode">ionic</Toggle>
        </div>
      </div>
    </footer>
  );
}

function Btn({ children, onClick, disabled, title }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="rounded border border-jarvis-cyan/30 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-jarvis-cyan/85 transition hover:bg-jarvis-cyan/15 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Toggle({ children, on, onClick, title }: { children: React.ReactNode; on: boolean; onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
        on ? 'border-jarvis-cyan bg-jarvis-cyan/20 text-jarvis-cyan' : 'border-jarvis-cyan/25 text-jarvis-cyan/50 hover:bg-jarvis-cyan/10'
      }`}
    >
      {children}
    </button>
  );
}

export default GestureHints;
