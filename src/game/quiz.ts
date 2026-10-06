/**
 * quiz.ts — Hybridization Quiz (spec §10).
 *
 * A molecule spins in the middle of the lab; the player answers with a FINGER COUNT
 * (1 = sp, 2 = sp², 3 = sp³, 4 = sp³d, 5 = sp³d²) or by voice. Every wrong answer
 * triggers an orbital reveal so the player sees *why*.
 */

import {
  type MoleculeGraph,
  graphFromSmilesLite,
  analyzeMolecule,
  structuralFormula,
} from '../chemistry/chemistryEngine';
import { findKnownByFormula } from '../chemistry/chemistryEngine';
import type { Hybridization } from '../chemistry/hybridization';

/** finger count → hybridization */
export const FINGER_TO_HYBRID: Record<number, Hybridization> = {
  1: 'sp',
  2: 'sp2',
  3: 'sp3',
  4: 'sp3d',
  5: 'sp3d2',
};

export const HYBRID_TO_FINGER: Record<string, number> = {
  sp: 1,
  sp2: 2,
  sp3: 3,
  sp3d: 4,
  sp3d2: 5,
  sp3d3: 5,
};

export const HYBRID_LABELS: Record<string, string> = {
  sp: 'sp — linear, 180°',
  sp2: 'sp² — trigonal planar, 120°',
  sp3: 'sp³ — tetrahedral, 109.5°',
  sp3d: 'sp³d — trigonal bipyramidal',
  sp3d2: 'sp³d² — octahedral, 90°',
};

export interface QuizQuestion {
  id: string;
  smiles: string;
  graph: MoleculeGraph;
  formula: string;
  /** Display name (common name when the database has one). */
  name: string;
  central: string;
  /** The correct finger count 1–5 */
  answer: number;
  hybridization: string;
  shape: string;
  angle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

interface QuizSeed {
  smiles: string;
  central?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const EASY: QuizSeed[] = [
  { smiles: 'O=C=O', difficulty: 'easy' },
  { smiles: 'C', difficulty: 'easy' },
  { smiles: 'O', difficulty: 'easy' },
  { smiles: 'N', difficulty: 'easy' },
  { smiles: 'C#C', difficulty: 'easy' },
  { smiles: 'C=C', difficulty: 'easy' },
  { smiles: 'Cl[Be]Cl', difficulty: 'easy' },
  { smiles: 'FB(F)F', difficulty: 'easy' },
  { smiles: 'C=O', difficulty: 'easy' },
  { smiles: 'N#N', difficulty: 'easy' },
];

const MEDIUM: QuizSeed[] = [
  { smiles: 'CC', difficulty: 'medium' },
  { smiles: 'CC(=O)C', difficulty: 'medium' },
  { smiles: 'CC(=O)O', difficulty: 'medium' },
  { smiles: 'c1ccccc1', difficulty: 'medium' },
  { smiles: 'S', difficulty: 'medium' },
  { smiles: 'O=S=O', difficulty: 'medium' },
  { smiles: 'ClP(Cl)(Cl)(Cl)Cl', difficulty: 'medium' },
  { smiles: 'FS(F)(F)F', difficulty: 'medium' },
  { smiles: 'CCO', difficulty: 'medium' },
  { smiles: '[NH4+]', difficulty: 'medium' },
];

const HARD: QuizSeed[] = [
  { smiles: 'FS(F)(F)(F)(F)F', difficulty: 'hard' },
  { smiles: 'F[Xe](F)(F)F', difficulty: 'hard' },
  { smiles: 'F[Cl](F)F', difficulty: 'hard' },
  { smiles: 'F[Br](F)(F)(F)F', difficulty: 'hard' },
  { smiles: 'OS(=O)(=O)O', difficulty: 'hard' },
  { smiles: 'ON(=O)=O', difficulty: 'hard' },
  { smiles: 'NC(N)=O', difficulty: 'hard' },
  { smiles: 'F[I](F)(F)(F)(F)(F)F', difficulty: 'hard' },
];

function buildQuestion(seed: QuizSeed, id: number): QuizQuestion | null {
  const graph = graphFromSmilesLite(seed.smiles);
  if (!graph.atoms.length) return null;
  const analysis = analyzeMolecule(graph, { difficulty: 'advanced' });
  const central = analysis.central;
  if (!central) return null;
  const answer = HYBRID_TO_FINGER[central.hybridization.hybridization];
  if (!answer) return null;
  const formula = structuralFormula(graph);
  const known = findKnownByFormula(formula);
  return {
    id: `q${id}`,
    smiles: seed.smiles,
    graph,
    formula,
    name: known?.name ?? analysis.formula,
    central: central.element,
    answer,
    hybridization: central.hybridization.label,
    shape: central.hybridization.molecularShape,
    angle: central.hybridization.angleLabel,
    difficulty: seed.difficulty,
    explanation: `${central.element} has ${central.hybridization.stericNumber} electron domains (${central.sigma} σ bond${central.sigma === 1 ? '' : 's'} + ${central.lonePairs} lone pair${central.lonePairs === 1 ? '' : 's'}) ⇒ ${central.hybridization.label}, ${central.hybridization.molecularShape}.`,
  };
}

const BANK: QuizQuestion[] = [...EASY, ...MEDIUM, ...HARD]
  .map((seed, i) => buildQuestion(seed, i))
  .filter((q): q is QuizQuestion => !!q);

export const QUIZ_BANK = BANK;

/** Deterministic-ish shuffle so a session never repeats the same order twice running. */
export function makeQuizRound(count = 10, difficulty?: 'easy' | 'medium' | 'hard'): QuizQuestion[] {
  let pool = BANK;
  if (difficulty) pool = BANK.filter((q) => q.difficulty === difficulty);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export interface QuizAnswer {
  correct: boolean;
  given: number;
  expected: number;
  /** JARVIS line — teaches rather than scolds. */
  feedback: string;
}

export function answerQuestion(q: QuizQuestion, fingers: number): QuizAnswer {
  const correct = fingers === q.answer;
  return {
    correct,
    given: fingers,
    expected: q.answer,
    feedback: correct
      ? `Correct — ${q.central} in ${q.name} is ${q.hybridization}: ${q.shape}, ${q.angle}.`
      : `Not quite. You said ${HYBRID_LABELS[FINGER_TO_HYBRID[fingers]] ?? `${fingers} fingers`}, but ${q.central} in ${q.name} is ${q.hybridization}. ${q.explanation}`,
  };
}

/** Parse "sp3", "sp three", "sp³", "tetrahedral" from a voice command. */
export function parseHybridFromSpeech(text: string): number | null {
  const t = text.toLowerCase().replace(/[^a-z0-9³²]/g, '');
  if (/sp3d2|sp3d²|sp³d²|spthreedtwo|octahedral/.test(t)) return 5;
  if (/sp3d|sp³d|spthreed|bipyramidal/.test(t)) return 4;
  if (/sp3|sp³|spthree|tetrahedral/.test(t)) return 3;
  if (/sp2|sp²|sptwo|trigonalplanar/.test(t)) return 2;
  if (/^sp|sp1|sone|linear/.test(t)) return 1;
  return null;
}
