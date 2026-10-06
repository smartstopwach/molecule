/**
 * scoring.ts — points, combos and achievements (spec §10).
 */

export interface ScoreState {
  score: number;
  streak: number;
  bestStreak: number;
  combo: number;
  moleculesBuilt: number;
  rejections: number;
  startedAt: number;
}

export const BASE_POINTS = 100;

export function createScoreState(): ScoreState {
  return {
    score: 0,
    streak: 0,
    bestStreak: 0,
    combo: 1,
    moleculesBuilt: 0,
    rejections: 0,
    startedAt: Date.now(),
  };
}

/** Valid placement / valid bond */
export function awardSuccess(s: ScoreState, multiplier = 1): ScoreState {
  const streak = s.streak + 1;
  const combo = Math.min(5, 1 + Math.floor(streak / 3));
  return {
    ...s,
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
    combo,
    score: s.score + Math.round(BASE_POINTS * multiplier * combo),
  };
}

/** Rejected bond — small penalty, breaks the streak. */
export function awardRejection(s: ScoreState): ScoreState {
  return { ...s, streak: 0, combo: 1, rejections: s.rejections + 1, score: Math.max(0, s.score - 10) };
}

export function awardMolecule(s: ScoreState, stabilityScore: number, timeBonus = 0): ScoreState {
  const bonus = Math.round((stabilityScore / 100) * 500) + timeBonus;
  return { ...s, moleculesBuilt: s.moleculesBuilt + 1, score: s.score + bonus };
}

export function comboLabel(combo: number): string {
  return combo > 1 ? `×${combo} COMBO` : '';
}

/* -------------------------------------------------------- achievements */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Returns true when the achievement has been earned. */
  test: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  moleculesBuilt: number;
  stableMolecules: number;
  aromaticBuilt: number;
  hypervalentBuilt: number;
  coordinationBuilt: number;
  radicalsBuilt: number;
  reactionsRun: number;
  exoticRejections: number;
  bestStreak: number;
  stars: number;
  levelsCompleted: number;
  quizCorrect: number;
  scanHits: number;
  fastestMoleculeMs: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'octet-master', name: 'Octet Master', icon: '◎',
    description: 'Build 10 perfectly stable molecules.',
    test: (s) => s.stableMolecules >= 10,
  },
  {
    id: 'aromatic-architect', name: 'Aromatic Architect', icon: '⬡',
    description: 'Build three different aromatic rings.',
    test: (s) => s.aromaticBuilt >= 3,
  },
  {
    id: 'hypervalent', name: 'Beyond the Octet', icon: '✶',
    description: 'Build a hypervalent molecule (expanded octet).',
    test: (s) => s.hypervalentBuilt >= 1,
  },
  {
    id: 'coordination', name: 'Ligand Wrangler', icon: '⊞',
    description: 'Assemble a coordination complex.',
    test: (s) => s.coordinationBuilt >= 1,
  },
  {
    id: 'radical', name: 'Controlled Radical', icon: '•',
    description: 'Create a radical outside Strict mode.',
    test: (s) => s.radicalsBuilt >= 1,
  },
  {
    id: 'reactor', name: 'Reaction Engineer', icon: '⚗',
    description: 'Complete five reactions in Reaction Lab.',
    test: (s) => s.reactionsRun >= 5,
  },
  {
    id: 'streak', name: 'Unbroken Chain', icon: '⚡',
    description: 'Reach a 15-action streak.',
    test: (s) => s.bestStreak >= 15,
  },
  {
    id: 'campaign', name: 'Lab Director', icon: '★',
    description: 'Complete every campaign level.',
    test: (s) => s.levelsCompleted >= 30,
  },
  {
    id: 'perfect', name: 'Flawless', icon: '✦',
    description: 'Earn 60 stars across the campaign.',
    test: (s) => s.stars >= 60,
  },
  {
    id: 'scanner', name: 'Field Analyst', icon: '◉',
    description: 'Identify three real-world objects with Scan Mode.',
    test: (s) => s.scanHits >= 3,
  },
  {
    id: 'speed', name: 'Faster than Thought', icon: '⏱',
    description: 'Build a molecule in under 20 seconds.',
    test: (s) => s.fastestMoleculeMs > 0 && s.fastestMoleculeMs < 20000,
  },
  {
    id: 'quiz', name: 'Hybridization Ace', icon: '∫',
    description: 'Answer 15 quiz questions correctly.',
    test: (s) => s.quizCorrect >= 15,
  },
];

export function evaluateAchievements(stats: AchievementStats, unlocked: string[]): string[] {
  return ACHIEVEMENTS.filter((a) => !unlocked.includes(a.id) && a.test(stats)).map((a) => a.id);
}
