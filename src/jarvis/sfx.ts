/**
 * sfx.ts — procedural sound effects.
 *
 * No binary audio assets: every cue is synthesised with the Web Audio API, so the
 * repository stays source-only and the bundle stays small. Howler is a listed
 * dependency for teams that want to drop in real samples — swap `play()` for a
 * Howl and the call sites do not change.
 */

export type SfxName =
  | 'boot'
  | 'place'
  | 'bond'
  | 'reject'
  | 'select'
  | 'whoosh'
  | 'success'
  | 'levelUp'
  | 'explosion'
  | 'frost'
  | 'scan'
  | 'click'
  | 'achievement';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function setSfxEnabled(v: boolean) {
  enabled = v;
  if (master) master.gain.value = v ? 0.35 : 0;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType,
  gainValue = 0.3,
  sweepTo?: number,
  delay = 0,
) {
  const audio = context();
  if (!audio || !master || !enabled) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const t0 = audio.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(gainValue, t0 + Math.min(0.03, duration / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noise(duration: number, gainValue = 0.2, filterFreq = 1200) {
  const audio = context();
  if (!audio || !master || !enabled) return;
  const frames = Math.floor(audio.sampleRate * duration);
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;
  const gain = audio.createGain();
  gain.gain.value = gainValue;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start();
}

export function playSfx(name: SfxName): void {
  if (!enabled) return;
  switch (name) {
    case 'boot':
      tone(180, 0.5, 'sine', 0.28, 720);
      tone(360, 0.6, 'triangle', 0.16, 1080, 0.12);
      break;
    case 'place':
      tone(520, 0.12, 'sine', 0.22, 780);
      break;
    case 'bond':
      tone(320, 0.18, 'triangle', 0.26, 640);
      tone(640, 0.14, 'sine', 0.12, 900, 0.05);
      break;
    case 'reject':
      tone(180, 0.22, 'sawtooth', 0.18, 90);
      break;
    case 'select':
      tone(880, 0.06, 'square', 0.08);
      break;
    case 'click':
      tone(1200, 0.04, 'square', 0.06);
      break;
    case 'whoosh':
      noise(0.28, 0.12, 900);
      break;
    case 'success':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'sine', 0.2, undefined, i * 0.08));
      break;
    case 'levelUp':
      [392, 523, 659, 880, 1175].forEach((f, i) => tone(f, 0.24, 'triangle', 0.18, undefined, i * 0.09));
      break;
    case 'explosion':
      noise(0.7, 0.35, 400);
      tone(90, 0.6, 'sawtooth', 0.22, 40);
      break;
    case 'frost':
      noise(0.5, 0.14, 5200);
      [1568, 2093].forEach((f, i) => tone(f, 0.3, 'sine', 0.1, undefined, i * 0.1));
      break;
    case 'scan':
      [660, 880, 660, 1100].forEach((f, i) => tone(f, 0.1, 'square', 0.08, undefined, i * 0.09));
      break;
    case 'achievement':
      [523, 784, 1047, 1319].forEach((f, i) => tone(f, 0.3, 'sine', 0.18, undefined, i * 0.1));
      break;
    default:
      break;
  }
}

/** Small helper for the HUD: brief blip when a panel opens. */
export const sfx = playSfx;
