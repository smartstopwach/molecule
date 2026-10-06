/**
 * formalCharge.ts — pure, dependency-free electron bookkeeping.
 *
 * Conventions used throughout JARVIS LAB:
 *   • `bondSum`  = sum of bond ORDERS around an atom (single=1, double=2, triple=3, aromatic=1.5)
 *   • `sigma`    = number of bonded NEIGHBOURS (σ bonds) — a double bond counts once
 *   • `pi`       = number of extra bond orders (double=1, triple=2, aromatic=0.5)
 *
 * Formal charge:  FC = V − N − B/2
 *   V = group valence electrons, N = non-bonding electrons, B = bonding electrons.
 * With L = lone pairs and S = bondSum:  FC = V − 2L − S
 * Inverted (used when we know the charge, e.g. NH4⁺):  L = (V − q − S) / 2
 */

import { getElement } from './elements';

/** Number of electron pairs that sit in the valence shell as lone pairs. */
export function lonePairs(symbol: string, bondSum: number, charge = 0): number {
  const V = getElement(symbol).valenceElectrons;
  const raw = (V - charge - bondSum) / 2;
  // Fractional lone pairs happen for aromatic carbons (bondSum 1.5 + 3 → wait, aromatic
  // carbon has bondSum = 3 exactly) and for radicals; floor at 0 and keep 0.5 steps.
  if (raw <= 0) return 0;
  return Math.round(raw * 2) / 2;
}

/** FC = V − 2L − S. Pass an explicit `lonePairCount` when the editor has one. */
export function formalCharge(symbol: string, bondSum: number, lonePairCount?: number, charge = 0): number {
  const V = getElement(symbol).valenceElectrons;
  const L = lonePairCount ?? lonePairs(symbol, bondSum, charge);
  return V - 2 * L - bondSum;
}

/** Total electrons sitting in the valence shell of an atom (bonding + non-bonding). */
export function valenceShellElectrons(symbol: string, bondSum: number, lonePairCount?: number, charge = 0): number {
  const L = lonePairCount ?? lonePairs(symbol, bondSum, charge);
  return 2 * L + 2 * bondSum;
}

/** True when an atom has an odd number of valence-shell electrons (a free radical). */
export function isRadical(symbol: string, bondSum: number, lonePairCount?: number, charge = 0): boolean {
  const e = valenceShellElectrons(symbol, bondSum, lonePairCount, charge);
  return Math.abs(e % 2) === 1;
}

/** Net formal charge of a whole molecule. */
export function netCharge(atoms: { symbol: string; bondSum: number; charge?: number; lonePairs?: number }[]): number {
  return atoms.reduce((sum, a) => sum + formalCharge(a.symbol, a.bondSum, a.lonePairs, a.charge ?? 0), 0);
}

/** "2−", "+", "3+" … pretty charge badge used in the HUD. */
export function formatCharge(q: number): string {
  if (q === 0) return '';
  const n = Math.abs(q);
  const digits = n === 1 ? '' : String(n);
  return q > 0 ? `${digits}+` : `${digits}−`;
}

/** Ion notation for a single atom, e.g. "Na⁺", "O²⁻", "Fe³⁺". */
export function formatIon(symbol: string, q: number): string {
  if (q === 0) return symbol;
  const n = Math.abs(q);
  const sup = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const digits = n === 1 ? '' : String(n).split('').map((d) => sup[Number(d)]).join('');
  return `${symbol}${digits}${q > 0 ? '⁺' : '⁻'}`;
}

/**
 * Oxidation state, assigned by the simple "bond to more electronegative atom ⇒ +1 per
 * order" rule. Good enough for the ionic engine and for naming (iron(II)/iron(III)).
 */
export function oxidationState(
  symbol: string,
  bonds: { order: number; other: string; ionic?: boolean }[],
  charge = 0,
): number {
  const el = getElement(symbol);
  let os = 0;
  for (const b of bonds) {
    const other = getElement(b.other);
    if (b.ionic) {
      // Ionic bond: electron fully transferred.
      os += el.electronegativity < other.electronegativity ? b.order : -b.order;
      continue;
    }
    const dEN = other.electronegativity - el.electronegativity;
    if (Math.abs(dEN) < 0.05) continue; // homo-nuclear bond ⇒ 0
    os += dEN > 0 ? b.order : -b.order;
  }
  return os + charge;
}
