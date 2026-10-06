/**
 * useGameStore.ts — global session state (spec §10, §11).
 *
 * Holds: current mode, difficulty, campaign progress, score/streak, toasts,
 * JARVIS dialogue log, settings and achievements. Persisted bits (progress,
 * settings, achievements) are written to localStorage.
 *
 * Deliberately separate from useMoleculeStore so that moving an atom 60×/second
 * never re-renders the HUD.
 */

import { create } from 'zustand';
import type { Difficulty } from '../chemistry/chemistryEngine';
import {
  type CampaignProgress,
  type Level,
  loadProgress,
  saveProgress,
  LEVEL_LIST,
  getLevel,
  resetProgress,
} from '../game/campaign';
import { createScoreState, evaluateAchievements, type AchievementStats, type ScoreState } from '../game/scoring';
import type { GestureThresholds } from '../vision/gestures.types';
import { DEFAULT_THRESHOLDS } from '../vision/gestures.types';

export type GameMode = 'campaign' | 'timeAttack' | 'quiz' | 'reaction' | 'sandbox' | 'scan';

export interface Settings {
  difficulty: Difficulty;
  voiceEnabled: boolean;
  captions: boolean;
  mirror: boolean;
  highContrast: boolean;
  colorBlind: boolean;
  sfx: boolean;
  showSkeleton: boolean;
  showLabels: boolean;
  showOrbitals: boolean;
  showLonePairs: boolean;
  ionicMode: boolean;
  /** Multiplies every gesture threshold: 0.5 = twitchy, 2 = deliberate. */
  sensitivity: number;
  thresholds: GestureThresholds;
  /** Mouse/keyboard fallback is allowed ONLY for settings & accessibility. */
  keyboardFallback: boolean;
}

export interface Toast {
  id: number;
  kind: 'success' | 'error' | 'info' | 'warn' | 'achievement';
  title: string;
  body?: string;
  at: number;
  ttl: number;
}

export interface JarvisLine {
  id: number;
  text: string;
  at: number;
  /** 'jarvis' | 'user' | 'system' */
  who: 'jarvis' | 'user' | 'system';
}

const SETTINGS_KEY = 'jarvis-lab.settings.v1';
const ACH_KEY = 'jarvis-lab.achievements.v1';

export const DEFAULT_SETTINGS: Settings = {
  difficulty: 'strict',
  voiceEnabled: true,
  captions: true,
  mirror: true,
  highContrast: false,
  colorBlind: false,
  sfx: true,
  showSkeleton: true,
  showLabels: true,
  showOrbitals: false,
  showLonePairs: true,
  ionicMode: false,
  sensitivity: 1,
  thresholds: { ...DEFAULT_THRESHOLDS },
  keyboardFallback: false,
};

function loadSettings(): Settings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw), thresholds: { ...DEFAULT_THRESHOLDS, ...(JSON.parse(raw).thresholds ?? {}) } };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadAchievements(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(ACH_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

const EMPTY_STATS: AchievementStats = {
  moleculesBuilt: 0, stableMolecules: 0, aromaticBuilt: 0, hypervalentBuilt: 0,
  coordinationBuilt: 0, radicalsBuilt: 0, reactionsRun: 0, exoticRejections: 0,
  bestStreak: 0, stars: 0, levelsCompleted: 0, quizCorrect: 0, scanHits: 0, fastestMoleculeMs: 0,
};

export interface GameState {
  mode: GameMode;
  /** ms since the current mode/level started — drives the HUD timer. */
  startedAt: number;
  elapsedMs: number;
  paused: boolean;

  levelId: string;
  progress: CampaignProgress;
  hintsUsed: number;

  score: ScoreState;
  stats: AchievementStats;
  achievements: string[];

  settings: Settings;
  toasts: Toast[];
  log: JarvisLine[];

  /** FPS + inference timing surfaced in the top bar. */
  fps: number;
  inferenceMs: number;
  cameraStatus: string;

  /** Current resonance structure index (swipe to cycle). */
  resonanceIndex: number;

  setMode: (m: GameMode) => void;
  setLevel: (id: string) => void;
  useHint: () => void;
  markComplete: (level: Level, stars: number, timeMs: number) => void;
  resetCampaign: () => void;

  pushToast: (t: Omit<Toast, 'id' | 'at' | 'ttl'> & { ttl?: number }) => number;
  dismissToast: (id: number) => void;
  say: (text: string, who?: JarvisLine['who']) => void;
  clearLog: () => void;

  setSettings: (patch: Partial<Settings>) => void;
  setSensitivity: (s: number) => void;
  setThreshold: (key: keyof GestureThresholds, value: number) => void;

  bumpStats: (patch: Partial<AchievementStats>) => void;
  checkAchievements: () => string[];

  setScore: (s: ScoreState) => void;
  setTiming: (fps: number, inferenceMs: number) => void;
  setCameraStatus: (s: string) => void;
  tick: (now: number) => void;
  restartTimer: () => void;
  setPaused: (p: boolean) => void;
  setResonance: (i: number) => void;
}

let toastId = 1;
let lineId = 1;

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'campaign',
  startedAt: Date.now(),
  elapsedMs: 0,
  paused: false,

  levelId: LEVEL_LIST[0]?.id ?? 'w1-01',
  progress: loadProgress(),
  hintsUsed: 0,

  score: createScoreState(),
  stats: { ...EMPTY_STATS },
  achievements: loadAchievements(),

  settings: loadSettings(),
  toasts: [],
  log: [],

  fps: 0,
  inferenceMs: 0,
  cameraStatus: 'idle',
  resonanceIndex: 0,

  setMode: (mode) => set({ mode, startedAt: Date.now(), elapsedMs: 0, hintsUsed: 0 }),

  setLevel: (levelId) => set({ levelId, startedAt: Date.now(), elapsedMs: 0, hintsUsed: 0, resonanceIndex: 0 }),

  useHint: () => set((s) => ({ hintsUsed: s.hintsUsed + 1 })),

  markComplete: (level, stars, timeMs) => {
    const state = get();
    const existing = state.progress.levels[level.id];
    const levels = {
      ...state.progress.levels,
      [level.id]: {
        id: level.id,
        completed: true,
        stars: Math.max(existing?.stars ?? 0, stars),
        bestTimeMs: Math.min(existing?.bestTimeMs ?? Infinity, timeMs),
        hintsUsed: Math.min(existing?.hintsUsed ?? 99, state.hintsUsed),
        attempts: (existing?.attempts ?? 0) + 1,
      },
    };
    const progress: CampaignProgress = { levels, lastPlayed: level.id };
    saveProgress(progress);
    const starsTotal = Object.values(levels).reduce((t, l) => t + (l.stars ?? 0), 0);
    const completed = Object.values(levels).filter((l) => l.completed).length;
    set({
      progress,
      stats: { ...state.stats, stars: starsTotal, levelsCompleted: completed },
    });
    get().checkAchievements();
  },

  resetCampaign: () => set({ progress: resetProgress() }),

  pushToast: (t) => {
    const id = toastId++;
    set((s) => ({ toasts: [...s.toasts.slice(-5), { ...t, id, at: Date.now(), ttl: t.ttl ?? 4200 }] }));
    return id;
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  say: (text, who = 'jarvis') =>
    set((s) => ({ log: [...s.log.slice(-60), { id: lineId++, text, at: Date.now(), who }] })),

  clearLog: () => set({ log: [] }),

  setSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch { /* ignore */ }
    }
    set({ settings });
  },

  setSensitivity: (sensitivity) => {
    const s = get().settings;
    const k = 1 / Math.max(0.25, sensitivity);
    get().setSettings({
      sensitivity,
      thresholds: {
        ...s.thresholds,
        pinchOn: DEFAULT_THRESHOLDS.pinchOn * k,
        pinchOff: DEFAULT_THRESHOLDS.pinchOff * k,
        swipeVelocity: DEFAULT_THRESHOLDS.swipeVelocity * k,
        zoomStep: DEFAULT_THRESHOLDS.zoomStep * k,
        spreadRate: DEFAULT_THRESHOLDS.spreadRate * k,
        rotateStep: DEFAULT_THRESHOLDS.rotateStep * k,
      },
    });
  },

  setThreshold: (key, value) => {
    const s = get().settings;
    get().setSettings({ thresholds: { ...s.thresholds, [key]: value } });
  },

  bumpStats: (patch) => {
    const stats = { ...get().stats, ...patch };
    set({ stats });
    get().checkAchievements();
  },

  checkAchievements: () => {
    const state = get();
    const earned = evaluateAchievements(state.stats, state.achievements);
    if (earned.length) {
      const achievements = [...state.achievements, ...earned];
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(ACH_KEY, JSON.stringify(achievements));
        } catch { /* ignore */ }
      }
      set({ achievements });
      earned.forEach((id) => {
        const meta = { id };
        void meta;
      });
    }
    return earned;
  },

  setScore: (score) => set({ score, stats: { ...get().stats, bestStreak: Math.max(get().stats.bestStreak, score.bestStreak) } }),
  setTiming: (fps, inferenceMs) => set({ fps, inferenceMs }),
  setCameraStatus: (cameraStatus) => set({ cameraStatus }),

  tick: (now) => set((s) => (s.paused ? s : { elapsedMs: now - s.startedAt })),
  restartTimer: () => set({ startedAt: Date.now(), elapsedMs: 0 }),
  setPaused: (paused) => set({ paused }),
  setResonance: (resonanceIndex) => set({ resonanceIndex }),
}));

/** Convenience selectors. */
export const selectLevel = (s: GameState): Level | undefined => getLevel(s.levelId);
export const selectDifficulty = (s: GameState) => s.settings.difficulty;
export const selectThresholds = (s: GameState) => s.settings.thresholds;
