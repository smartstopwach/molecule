/**
 * campaign.ts — level loading, unlocking, validation and star awards (spec §10).
 *
 * Levels are pure JSON (src/game/levels.json) so new content needs no code change:
 * add an entry with a target SMILES, a difficulty and two star thresholds.
 */

import LEVELS from './levels.json';
import {
  type MoleculeGraph,
  type Difficulty,
  analyzeMolecule,
  structuralFormula,
  elementKey,
  graphFromSmilesLite,
  canonicalSignature,
  countFragments,
} from '../chemistry/chemistryEngine';
import { nameMolecule } from '../chemistry/naming';

export interface LevelFragment {
  name: string;
  smiles: string;
  /** JARVIS places this fragment for you (used for the DNA base-pair boss). */
  assisted?: boolean;
}

export interface Level {
  id: string;
  world: number;
  index: number;
  name: string;
  formula: string;
  smiles?: string;
  difficulty: Difficulty;
  ghost: boolean;
  hint: string;
  teach: string;
  /** seconds: [3-star threshold, 2-star threshold] */
  starTimes: [number, number];
  askHybridization: boolean;
  expectedHybridization: string;
  fragments?: LevelFragment[];
  hydrogenBonds?: number;
}

export const LEVEL_LIST = LEVELS as unknown as Level[];

export const WORLDS = [
  { id: 1, name: 'Basics', subtitle: 'Diatomics and the octet rule', color: '#38e8ff' },
  { id: 2, name: 'Shapes', subtitle: 'VSEPR, hypervalency and noble gases', color: '#4dffb8' },
  { id: 3, name: 'Organic', subtitle: 'Chains, rings and functional groups', color: '#ffc76b' },
  { id: 4, name: 'Bio', subtitle: 'Sugars, amino acids and alkaloids', color: '#a97bff' },
  { id: 5, name: 'Boss', subtitle: 'Aspirin, DNA and coordination chemistry', color: '#ff9d3c' },
];

export function levelsOfWorld(world: number): Level[] {
  return LEVEL_LIST.filter((l) => l.world === world);
}

export function getLevel(id: string): Level | undefined {
  return LEVEL_LIST.find((l) => l.id === id);
}

export function nextLevel(id: string): Level | undefined {
  const i = LEVEL_LIST.findIndex((l) => l.id === id);
  return i >= 0 ? LEVEL_LIST[i + 1] : undefined;
}

/* --------------------------------------------------------- persistence */

export interface LevelProgress {
  id: string;
  completed: boolean;
  stars: number;
  bestTimeMs: number;
  hintsUsed: number;
  attempts: number;
}

export interface CampaignProgress {
  levels: Record<string, LevelProgress>;
  lastPlayed?: string;
}

const KEY = 'jarvis-lab.campaign.v1';

export function loadProgress(): CampaignProgress {
  if (typeof localStorage === 'undefined') return { levels: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { levels: {} };
    const parsed = JSON.parse(raw) as CampaignProgress;
    return { levels: parsed.levels ?? {}, lastPlayed: parsed.lastPlayed };
  } catch {
    return { levels: {} };
  }
}

export function saveProgress(p: CampaignProgress): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage disabled — progress simply is not persisted */
  }
}

export function resetProgress(): CampaignProgress {
  const fresh: CampaignProgress = { levels: {} };
  saveProgress(fresh);
  return fresh;
}

/** A level is playable once the previous one in the campaign order is completed. */
export function isUnlocked(level: Level, progress: CampaignProgress): boolean {
  const i = LEVEL_LIST.findIndex((l) => l.id === level.id);
  if (i <= 0) return true;
  const prev = LEVEL_LIST[i - 1];
  return !!progress.levels[prev.id]?.completed;
}

export function totalStars(progress: CampaignProgress): number {
  return Object.values(progress.levels).reduce((s, l) => s + (l.stars ?? 0), 0);
}

export function completedCount(progress: CampaignProgress): number {
  return Object.values(progress.levels).filter((l) => l.completed).length;
}

/* ----------------------------------------------------------- validation */

export interface ValidationResult {
  complete: boolean;
  /** Short reason shown in the toast when it is not complete yet. */
  reason: string;
  /** 0–3 stars */
  stars: number;
  matchedHybridization?: boolean;
}

/** Build the target graph for a level (memoised per level id). */
const targetCache = new Map<string, MoleculeGraph>();

export function targetGraph(level: Level): MoleculeGraph {
  const cached = targetCache.get(level.id);
  if (cached) return cached;
  let graph: MoleculeGraph = { atoms: [], bonds: [] };
  if (level.smiles) graph = graphFromSmilesLite(level.smiles);
  else if (level.fragments) {
    // Multi-fragment targets: concatenate the fragment graphs.
    for (const f of level.fragments) {
      const frag = graphFromSmilesLite(f.smiles);
      const offset = graph.atoms.length;
      const remap = new Map<string, string>();
      frag.atoms.forEach((a, i) => remap.set(a.id, `${f.name}_${offset + i}`));
      graph.atoms.push(...frag.atoms.map((a) => ({ ...a, id: remap.get(a.id)! })));
      graph.bonds.push(
        ...frag.bonds.map((b, i) => ({
          ...b,
          id: `${f.name}_b${i}`,
          a: remap.get(b.a)!,
          b: remap.get(b.b)!,
        })),
      );
    }
  }
  targetCache.set(level.id, graph);
  return graph;
}

export function targetFormula(level: Level): string {
  return level.formula;
}

/**
 * Compare the player's workspace against the level target.
 * Two-stage: the formula must match, then (for small molecules) the connectivity
 * must match too — that is what makes isomers distinct in Time Attack.
 */
export function validateLevel(
  level: Level,
  player: MoleculeGraph,
  elapsedMs: number,
  hintsUsed: number,
): ValidationResult {
  const target = targetGraph(level);
  const targetFormula = structuralFormula(target);
  const playerFormula = structuralFormula(player);
  const analysis = analyzeMolecule(player, { difficulty: level.difficulty });

  if (player.atoms.length === 0) {
    return { complete: false, reason: 'Empty workspace.', stars: 0 };
  }
  if (analysis.stability.status === 'impossible') {
    return { complete: false, reason: `Impossible species: ${analysis.stability.reason}`, stars: 0 };
  }
  if (elementKey(playerFormula) !== elementKey(targetFormula)) {
    return {
      complete: false,
      reason: `Formula ${playerFormula} — target is ${targetFormula}.`,
      stars: 0,
    };
  }

  // Connectivity check for molecules small enough to be unambiguous.
  const targetFragmentCount = countFragments(target);
  if (player.atoms.length <= 22 && targetFragmentCount === 1) {
    const a = canonicalSignature(player);
    const b = canonicalSignature(target);
    if (a !== b) {
      return {
        complete: false,
        reason: `Correct formula but a different connectivity — you have built an isomer of ${level.name}.`,
        stars: 0,
      };
    }
  }

  if (countFragments(player) !== targetFragmentCount) {
    return { complete: false, reason: 'The target is a single connected molecule.', stars: 0 };
  }

  const matchedHybridization = level.askHybridization
    ? analysis.central?.hybridization.hybridization === level.expectedHybridization
    : true;

  return {
    complete: true,
    reason: 'Target assembled.',
    stars: starsFor(level, elapsedMs, hintsUsed),
    matchedHybridization,
  };
}

/** 3 stars: fast and hint-free. 2 stars: within the second threshold. 1 star: finished. */
export function starsFor(level: Level, elapsedMs: number, hintsUsed: number): number {
  const seconds = elapsedMs / 1000;
  const [three, two] = level.starTimes;
  if (seconds <= three && hintsUsed === 0) return 3;
  if (seconds <= two && hintsUsed <= 1) return 2;
  return 1;
}

export function recordResult(progress: CampaignProgress, level: Level, result: ValidationResult, elapsedMs: number, hintsUsed: number): CampaignProgress {
  const existing = progress.levels[level.id] ?? { id: level.id, completed: false, stars: 0, bestTimeMs: Infinity, hintsUsed: 0, attempts: 0 };
  const next: LevelProgress = {
    id: level.id,
    completed: existing.completed || result.complete,
    stars: Math.max(existing.stars, result.stars),
    bestTimeMs: result.complete ? Math.min(existing.bestTimeMs || Infinity, elapsedMs) : existing.bestTimeMs,
    hintsUsed: Math.min(existing.hintsUsed || 0, hintsUsed),
    attempts: existing.attempts + 1,
  };
  const levels = { ...progress.levels, [level.id]: next };
  const out: CampaignProgress = { levels, lastPlayed: level.id };
  saveProgress(out);
  return out;
}

/** Human-readable name of the level target for the HUD. */
export function levelDisplayName(level: Level): string {
  const graph = targetGraph(level);
  if (graph.atoms.length) {
    const named = nameMolecule(graph);
    if (named.confidence !== 'formula') return named.name;
  }
  return level.name;
}
