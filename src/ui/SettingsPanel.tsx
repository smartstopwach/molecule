/**
 * SettingsPanel.tsx — the only place a real mouse/keyboard is expected (spec §11).
 *
 * Live here: sensitivity, mirror, voice, difficulty, colour-blind palette,
 * captions, SFX, skeleton visibility, hand-tracking threshold tuning and the
 * privacy notice. Everything persists to localStorage.
 */

import { useGameStore } from '../store/useGameStore';
import { DEFAULT_SETTINGS } from '../store/useGameStore';
import { stopSpeaking } from '../jarvis/speech';
import { setSfxEnabled } from '../jarvis/sfx';
import { playSfx } from '../jarvis/sfx';
import { resetProgress } from '../game/campaign';
import { useMoleculeStore } from '../store/useMoleculeStore';

const THRESHOLD_FIELDS = [
  { key: 'pinchOn', label: 'Pinch on', min: 0.2, max: 0.9, step: 0.02 },
  { key: 'pinchOff', label: 'Pinch off', min: 0.3, max: 1.2, step: 0.02 },
  { key: 'pinchHoldMs', label: 'Hold (ms)', min: 150, max: 1200, step: 25 },
  { key: 'doublePinchMs', label: 'Double pinch (ms)', min: 200, max: 1200, step: 25 },
  { key: 'swipeVelocity', label: 'Swipe velocity', min: 0.0004, max: 0.006, step: 0.0002 },
  { key: 'smoothing', label: 'Smoothing', min: 0.1, max: 1, step: 0.05 },
] as const;

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useGameStore((s) => s.settings);
  const setSettings = useGameStore((s) => s.setSettings);
  const setThreshold = useGameStore((s) => s.setThreshold);
  const resetCampaign = useGameStore((s) => s.resetCampaign);
  const pushToast = useGameStore((s) => s.pushToast);
  const say = useGameStore((s) => s.say);
  const clearMolecule = useMoleculeStore((s) => s.clear);

  if (!open) return null;

  const set = (patch: Partial<typeof settings>) => {
    setSettings(patch);
    playSfx('click');
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[86vh] w-[min(96vw,720px)] overflow-y-auto rounded-xl border border-jarvis-cyan/30 bg-[#041821]/95 p-5 font-hud shadow-hud">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold uppercase tracking-[0.28em] text-jarvis-cyan">Settings</h2>
          <button type="button" onClick={onClose} className="rounded border border-jarvis-cyan/30 px-3 py-1 font-mono text-[11px] uppercase text-jarvis-cyan/80 hover:bg-jarvis-cyan/15">
            close
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* difficulty + rules */}
          <section>
            <H>Difficulty</H>
            <div className="flex gap-1">
              {(['strict', 'advanced', 'sandbox'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set({ difficulty: d })}
                  className={`flex-1 rounded border px-2 py-1 text-[11px] uppercase tracking-wider ${
                    settings.difficulty === d ? 'border-jarvis-cyan bg-jarvis-cyan/20 text-jarvis-cyan' : 'border-jarvis-cyan/25 text-jarvis-cyan/50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[10px] leading-tight text-jarvis-cyan/45">
              STRICT enforces octet/duet and ionic balance. ADVANCED unlocks noble gases, radicals and
              hypervalency. SANDBOX only blocks the physically impossible.
            </p>

            <H>Interaction</H>
            <Slider label="Gesture sensitivity" value={settings.sensitivity} min={0.4} max={2} step={0.1}
              onChange={(v) => set({ sensitivity: v })} format={(v) => `${v.toFixed(1)}×`} />
            <Check label="Mirror video (selfie view)" checked={settings.mirror} onChange={(v) => set({ mirror: v })} />
            <Check label="Show hand skeleton" checked={settings.showSkeleton} onChange={(v) => set({ showSkeleton: v })} />
            <Check label="Show atom labels" checked={settings.showLabels} onChange={(v) => set({ showLabels: v })} />
            <Check label="Keyboard / mouse fallback for UI" checked={settings.keyboardFallback}
              onChange={(v) => set({ keyboardFallback: v })} />
          </section>

          {/* audio + accessibility */}
          <section>
            <H>Voice &amp; sound</H>
            <Check
              label="JARVIS speaks"
              checked={settings.voiceEnabled}
              onChange={(v) => {
                if (!v) stopSpeaking();
                set({ voiceEnabled: v });
              }}
            />
            <Check label="Captions + typewriter" checked={settings.captions} onChange={(v) => set({ captions: v })} />
            <Check
              label="Sound effects"
              checked={settings.sfx}
              onChange={(v) => {
                setSfxEnabled(v);
                set({ sfx: v });
              }}
            />

            <H>Accessibility</H>
            <Check label="High contrast" checked={settings.highContrast} onChange={(v) => set({ highContrast: v })} />
            <Check label="Colour-blind palette (Okabe–Ito)" checked={settings.colorBlind} onChange={(v) => set({ colorBlind: v })} />

            <H>Privacy</H>
            <p className="rounded border border-jarvis-green/40 bg-green-950/30 p-2 text-[10.5px] leading-tight text-jarvis-green">
              Video never leaves your device. Frames go to a local canvas, landmarks are computed in
              this tab, and nothing is uploaded, recorded or stored.
            </p>
          </section>

          {/* thresholds */}
          <section className="md:col-span-2">
            <H>Gesture tuning</H>
            <div className="grid gap-2 md:grid-cols-2">
              {THRESHOLD_FIELDS.map((f) => (
                <Slider
                  key={f.key}
                  label={f.label}
                  value={settings.thresholds[f.key]}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  onChange={(v) => setThreshold(f.key, v)}
                  format={(v) => (v < 0.01 ? v.toFixed(4) : String(Math.round(v)))}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSettings({ thresholds: { ...DEFAULT_SETTINGS.thresholds }, sensitivity: 1 });
                  pushToast({ kind: 'info', title: 'Thresholds reset' });
                }}
                className="rounded border border-jarvis-cyan/30 px-3 py-1 font-mono text-[11px] uppercase text-jarvis-cyan/80 hover:bg-jarvis-cyan/15"
              >
                reset thresholds
              </button>
              <button
                type="button"
                onClick={() => {
                  resetProgress();
                  resetCampaign();
                  clearMolecule();
                  pushToast({ kind: 'warn', title: 'Campaign progress erased' });
                  say('Progress erased. Starting fresh.');
                }}
                className="rounded border border-jarvis-red/40 px-3 py-1 font-mono text-[11px] uppercase text-jarvis-red/80 hover:bg-red-500/15"
              >
                erase progress
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-1 mt-3 text-[10px] uppercase tracking-[0.24em] text-jarvis-orange">{children}</h3>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-0.5 text-[11.5px] text-jarvis-cyan/85">
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="ml-3 h-3.5 w-3.5 accent-cyan-400" />
    </label>
  );
}

function Slider({
  label, value, min, max, step, onChange, format,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  return (
    <label className="block py-0.5 text-[11.5px] text-jarvis-cyan/85">
      <span className="flex justify-between">
        {label}
        <span className="font-mono text-[10px] text-jarvis-amber">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="mt-0.5 w-full accent-cyan-300"
      />
    </label>
  );
}

export default SettingsPanel;
