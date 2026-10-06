/**
 * timeAttack.ts — 60-second mode (spec §10).
 *
 * Score = Σ (base × stability/100 × combo). Only UNIQUE formulas count, so
 * spamming water does nothing. The combo ramps by one every three valid builds.
 */

import { type MoleculeGraph, structuralFormula, elementKey, analyzeMolecule } from '../chemistry/chemistryEngine';
import { createScoreState, awardMolecule, awardRejection, type ScoreState } from './scoring';

export const ROUND_SECONDS = 60;

export interface TimeAttackState {
  running: boolean;
  finished: boolean;
  startedAt: number;
  endsAt: number;
  remainingMs: number;
  score: ScoreState;
  built: { formula: string; name: string; ms: number; points: number }[];
  unique: string[];
}

export function createTimeAttack(): TimeAttackState {
  return {
    running: false,
    finished: false,
    startedAt: 0,
    endsAt: 0,
    remainingMs: ROUND_SECONDS * 1000,
    score: createScoreState(),
    built: [],
    unique: [],
  };
}

export function startRound(s: TimeAttackState, now = Date.now()): TimeAttackState {
  return {
    ...createTimeAttack(),
    running: true,
    startedAt: now,
    endsAt: now + ROUND_SECONDS * 1000,
    remainingMs: ROUND_SECONDS * 1000,
  };
}

export function tick(s: TimeAttackState, now = Date.now()): TimeAttackState {
  if (!s.running) return s;
  const remainingMs = Math.max(0, s.endsAt - now);
  if (remainingMs === 0) return { ...s, running: false, finished: true, remainingMs };
  return { ...s, remainingMs };
}

export interface ScoreAttempt {
  ok: boolean;
  reason: string;
  points?: number;
  duplicate?: boolean;
  stability?: number;
  combo?: number;
}

/** Register a completed molecule. Duplicates are rejected with a nudge. */
export function submitMolecule(s: TimeAttackState, graph: MoleculeGraph, now = Date.now()): { state: TimeAttackState; attempt: ScoreAttempt } {
  const analysis = analyzeMolecule(graph, { difficulty: 'advanced' });
  if (analysis.stability.status === 'impossible') {
    return {
      state: { ...s, score: awardRejection(s.score) },
      attempt: { ok: false, reason: analysis.stability.reason },
    };
  }
  const formula = structuralFormula(graph);
  const key = elementKey(formula);
  if (s.unique.includes(key)) {
    return {
      state: s,
      attempt: { ok: false, reason: `${formula} is already on the board — try something new.`, duplicate: true },
    };
  }
  const elapsed = now - s.startedAt;
  const combo = Math.min(5, 1 + Math.floor(s.built.length / 3));
  const timeBonus = Math.max(0, Math.round((ROUND_SECONDS * 1000 - elapsed) / 100));
  const points = Math.round((200 + (analysis.stability.score / 100) * 800 + timeBonus) * combo);
  const builtEntry = { formula, name: analysis.knownName ?? formula, ms: elapsed, points };
  return {
    state: {
      ...s,
      unique: [...s.unique, key],
      built: [...s.built, builtEntry],
      score: awardMolecule(s.score, analysis.stability.score, timeBonus),
    },
    attempt: {
      ok: true,
      reason: `+${points} for ${formula}`,
      points,
      stability: analysis.stability.score,
      combo,
    },
  };
}

export function rankOf(score: number): string {
  if (score >= 12000) return 'JARVIS';
  if (score >= 8000) return 'Chief Chemist';
  if (score >= 5000) return 'Senior Researcher';
  if (score >= 2500) return 'Lab Technician';
  if (score >= 1000) return 'Intern';
  return 'Trainee';
}
