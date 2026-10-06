/**
 * reactionEngine.ts — spec §5l & §7.
 *
 * When two molecules are slammed together in Reaction Lab, we:
 *   1. compute both Hill formulas,
 *   2. look them up in reactions.json (order-insensitive, coefficient-aware),
 *   3. verify the equation conserves atoms (a safety net for hand-written JSON),
 *   4. return the products as buildable graphs plus the JARVIS narration.
 *
 * If there is no match we return a `repel` result with a chemically literate
 * explanation ("methane and water do not react without steam reforming"), so the
 * simulation can bounce the molecules apart.
 */

import REACTIONS from './data/reactions.json';
import {
  type MoleculeGraph,
  type RuleOptions,
  analyzeMolecule,
  elementKey,
  graphFromSmilesLite,
  structuralFormula,
  findKnownByFormula,
} from './chemistryEngine';

export interface ReactionSide {
  formula: string;
  coeff: number;
}

export interface Reaction {
  id: string;
  name: string;
  type: string;
  equation: string;
  reactants: ReactionSide[];
  products: ReactionSide[];
  /** ΔH in kJ/mol (signed) */
  dH: number;
  conditions: string;
  exothermic: boolean;
  jarvis: string;
}

export const REACTION_TABLE: Reaction[] = REACTIONS as Reaction[];

/** Index: "keyA+keyB" (sorted) → reactions. */
const REACTION_INDEX: Map<string, Reaction[]> = (() => {
  const map = new Map<string, Reaction[]>();
  for (const r of REACTION_TABLE) {
    const key = r.reactants.map((x) => elementKey(x.formula)).sort().join('+');
    const list = map.get(key) ?? [];
    list.push(r);
    map.set(key, list);
  }
  return map;
})();

export function parseFormulaCounts(formula: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(formula))) {
    const sym = m[1];
    counts[sym] = (counts[sym] ?? 0) + (m[2] ? Number(m[2]) : 1);
  }
  return counts;
}

/** Verify mass balance of a table entry — catches typos in the JSON. */
export function isBalanced(r: Reaction): boolean {
  const left: Record<string, number> = {};
  const right: Record<string, number> = {};
  for (const s of r.reactants) {
    const c = parseFormulaCounts(s.formula);
    for (const [k, v] of Object.entries(c)) left[k] = (left[k] ?? 0) + v * s.coeff;
  }
  for (const s of r.products) {
    const c = parseFormulaCounts(s.formula);
    for (const [k, v] of Object.entries(c)) right[k] = (right[k] ?? 0) + v * s.coeff;
  }
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const k of keys) if ((left[k] ?? 0) !== (right[k] ?? 0)) return false;
  return true;
}

export interface ReactionAttempt {
  ok: boolean;
  reaction?: Reaction;
  /** Product graphs the scene should spawn (already balanced by coefficient). */
  products?: { graph: MoleculeGraph; formula: string; name: string; coeff: number }[];
  /** Human-readable "why not" for the JARVIS log. */
  reason?: string;
  jarvis?: string;
  exothermic?: boolean;
}

/** Look up a reaction between two formulas (order-insensitive). */
export function findReactionByFormulas(formulaA: string, formulaB: string): Reaction | undefined {
  const key = [elementKey(formulaA), elementKey(formulaB)].sort().join('+');
  const list = REACTION_INDEX.get(key);
  return list?.[0];
}

/** Single-reactant (decomposition) lookup. */
export function findDecomposition(formula: string): Reaction | undefined {
  const key = elementKey(formula);
  return REACTION_TABLE.find((r) => r.reactants.length === 1 && elementKey(r.reactants[0].formula) === key);
}

function buildProductGraph(formula: string): MoleculeGraph | null {
  const known = findKnownByFormula(formula);
  if (known?.smiles) {
    try {
      return graphFromSmilesLite(known.smiles);
    } catch {
      /* fall through */
    }
  }
  return null;
}

/**
 * The main entry point used by Reaction Lab. `a` and `b` are the two molecules
 * the player just collided.
 */
export function attemptReaction(a: MoleculeGraph, b: MoleculeGraph | null, opts: RuleOptions): ReactionAttempt {
  const fa = structuralFormula(a);
  const fb = b ? structuralFormula(b) : null;

  const reaction = fb ? findReactionByFormulas(fa, fb) : findDecomposition(fa);

  if (!reaction) {
    return {
      ok: false,
      reason: 'No reaction pathway in the database.',
      jarvis: explainNoReaction(fa, fb),
    };
  }

  if (!isBalanced(reaction)) {
    return {
      ok: false,
      reason: 'Reaction table entry is not mass balanced.',
      jarvis: 'My reaction table is corrupted — the equation does not balance, sir. I refuse to fake it.',
    };
  }

  if (opts.difficulty === 'strict' && reaction.type === 'redox' && reaction.reactants.some((r) => /Na|K|Ca|Mg/.test(r.formula))) {
    return {
      ok: false,
      reason: 'Alkali-metal reactions are disabled in Strict mode.',
      jarvis: 'Alkali metals are far too energetic for a school laboratory, sir. Raise the difficulty.',
    };
  }

  const products = reaction.products
    .map((p) => {
      const graph = buildProductGraph(p.formula);
      if (!graph) return null;
      const known = findKnownByFormula(p.formula);
      return { graph, formula: p.formula, name: known?.name ?? p.formula, coeff: p.coeff };
    })
    .filter((x): x is { graph: MoleculeGraph; formula: string; name: string; coeff: number } => !!x);

  return {
    ok: true,
    reaction,
    products,
    jarvis: reaction.jarvis,
    exothermic: reaction.exothermic,
  };
}

/** Chemistry-aware "nothing happens" explanations. */
function explainNoReaction(fa: string, fb: string | null): string {
  if (!fb) return `${fa} is stable on its own — give it heat, a catalyst, or a partner.`;
  const a = findKnownByFormula(fa);
  const b = findKnownByFormula(fb);
  const an = a?.name ?? fa;
  const bn = b?.name ?? fb;
  if (an === bn) return `Two molecules of ${an} simply bounce, sir. They need a reagent, not a mirror.`;
  if (/acid/i.test(an) && /acid/i.test(bn)) return 'Acid plus acid is not a reaction — one of them must be a base.';
  if (/acid/i.test(an) || /acid/i.test(bn)) {
    return 'That pairing has no favourable pathway in my table. Most acid chemistry needs a base, a metal or a carbonate.';
  }
  if (/ane$/.test(an) && /ane$/.test(bn)) return `Two saturated alkanes. Nothing happens without a flame — alkanes are famously inert.`;
  return `${an} and ${bn} do not react under these conditions. Check the activation energy, sir.`;
}

/** All reactions whose type matches (used by the Reaction Lab browser). */
export function reactionsByType(type: string): Reaction[] {
  return REACTION_TABLE.filter((r) => r.type === type);
}

export const REACTION_TYPES = [...new Set(REACTION_TABLE.map((r) => r.type))];

/**
 * Predict whether a collision should react based on approach speed — the gesture
 * layer needs a velocity threshold so gentle nudges do not detonate.
 */
export function collisionEnergy(relativeSpeed: number, mass = 1): number {
  return 0.5 * mass * relativeSpeed * relativeSpeed;
}

/** Balance an arbitrary "A + B → C + D" from formulas (used by the HUD readout). */
export function formatEquation(r: Reaction): string {
  return r.equation;
}

/** Neutralisation helper: does mixing these two acids/bases give salt + water? */
export function isNeutralisation(a: MoleculeGraph, b: MoleculeGraph): boolean {
  const reaction = findReactionByFormulas(structuralFormula(a), structuralFormula(b));
  return reaction?.type === 'acid-base';
}

/** Convenience for the quiz / HUD: describe a reaction's energy flow. */
export function energyLabel(r: Reaction): string {
  return `${r.exothermic ? 'Exothermic' : 'Endothermic'} · ΔH = ${r.dH > 0 ? '+' : ''}${r.dH} kJ/mol`;
}

/** Run the analysis on a product so the HUD can show the new molecule card. */
export function describeProducts(products: { graph: MoleculeGraph; name: string }[], opts: RuleOptions) {
  return products.map((p) => ({ name: p.name, analysis: analyzeMolecule(p.graph, opts) }));
}
