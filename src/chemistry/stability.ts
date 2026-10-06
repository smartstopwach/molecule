/**
 * stability.ts — spec §5f. Given the graph + per-atom electron bookkeeping,
 * return { status, score, reason }.
 *
 *   impossible → the species cannot exist (CH5, OH3, NeH, F2O3, NaCl2 …)
 *   radical    → odd electron count (OH•, CH3•, NO•) — allowed only in
 *                ADVANCED (with warning) and SANDBOX; blocked in STRICT.
 *   unstable   → exists, but electron-deficient / charge-separated / strained
 *   stable     → every atom has a full octet (or a legitimate duet/incompleteness)
 *                and formal charges are minimal
 *
 * The score is deliberately transparent: start at 100 and dock points per issue so
 * the HUD can say *why* a molecule scored 62.
 */

import { getElement, octetLimit, effectiveMaxValence } from './elements';
import type { AtomAnalysis, MoleculeGraph, RuleOptions } from './chemistryEngine';

export type StabilityStatus = 'stable' | 'unstable' | 'radical' | 'impossible';

export interface StabilityIssue {
  code: string;
  atomId?: string;
  element?: string;
  message: string;
  penalty: number;
}

export interface StabilityReport {
  status: StabilityStatus;
  /** 0–100 */
  score: number;
  reason: string;
  issues: StabilityIssue[];
  warnings: string[];
}

const DEDUCTIONS = {
  overValent: 60,
  octetExceeded: 60,
  radical: 30,
  incompleteOctet: 22,
  formalCharge: 9,
  bigFormalCharge: 16,
  hypervalent: 6,
  electronDeficient: 8,
  netChargeStrict: 35,
  romanNobleGas: 70,
  oddElectronMolecule: 25,
  strainedRing: 8,
  fragmented: 15,
};

/** Atoms for which an incomplete octet is the *normal*, textbook-stable state. */
const ELECTRON_DEFICIENT_OK = new Set(['Be', 'B', 'Al']);

/**
 * A full valence shell is 2 electrons for period 1 and 8 for everything else.
 * Expanded octets (10, 12, 14 e⁻) are a permitted EXTRA, never a requirement —
 * a terminal chlorine with 8 electrons is perfectly happy.
 */
function targetShell(symbol: string): number {
  return getElement(symbol).period === 1 ? 2 : 8;
}

export function classifyStability(
  g: MoleculeGraph,
  atoms: AtomAnalysis[],
  opts: RuleOptions,
): StabilityReport {
  const issues: StabilityIssue[] = [];
  const warnings: string[] = [];
  let score = 100;
  const moleculeIsIonic = g.atoms.some((a) => getElement(a.element).isMetal);

  if (g.atoms.length === 0) {
    return { status: 'stable', score: 0, reason: 'Empty workspace.', issues: [], warnings: [] };
  }

  // ---- total electron parity: an odd number of valence electrons ⇒ radical ----
  const totalValence = g.atoms.reduce((s, a) => {
    const el = getElement(a.element);
    return s + el.valenceElectrons - (a.charge ?? 0);
  }, 0);
  const oddElectronMolecule = totalValence % 2 === 1;

  for (const a of atoms) {
    const el = getElement(a.element);
    const charge = g.atoms.find((x) => x.id === a.id)?.charge ?? 0;
    const maxV = effectiveMaxValence(a.element, charge);
    const limit = octetLimit(a.element);

    const dativeBonds = g.bonds.filter(
      (b) => b.type === 'coordinate' && (b.a === a.id || b.b === a.id),
    ).length;
    if (el.isMetal && dativeBonds > 0) {
      // A coordination centre follows a COORDINATION limit, not the octet rule.
      const maxSites = el.category === 'transition' ? 6 : 4;
      if (a.sigma > maxSites) {
        issues.push({
          code: 'OVER_VALENT', atomId: a.id, element: a.element,
          message: `${a.element} has ${a.sigma} ligands but its maximum coordination number is ${maxSites}.`,
          penalty: DEDUCTIONS.overValent,
        });
      }
    } else if (el.isMetal) {
      // Ionic metal: the valency ceiling is its charge, not a charge-boosted octet
      // limit — sodium never makes two bonds, whatever charge you hand it.
      const ceiling = el.commonOxidationStates[0] ?? maxV;
      if (a.sigma > ceiling) {
        issues.push({
          code: 'OVER_VALENT', atomId: a.id, element: a.element,
          message: `${a.element} has ${a.sigma} bonds but its maximum valency is ${ceiling}.`,
          penalty: DEDUCTIONS.overValent,
        });
      }
    } else {
      // A dative bond is donated from an existing lone pair, so it does NOT consume
      // extra valency: only the genuinely shared bonds count here.
      if (a.hasAromatic ? a.sigma > maxV + 1e-6 : a.covalentBondSum > maxV + 1e-6) {
        issues.push({
          code: 'OVER_VALENT', atomId: a.id, element: a.element,
          message: `${a.element} has ${a.bondSum} bonds but its maximum valency is ${maxV}.`,
          penalty: DEDUCTIONS.overValent,
        });
      }
      if (a.shellElectrons > limit + 1e-6) {
        issues.push({
          code: 'OCTET_EXCEEDED', atomId: a.id, element: a.element,
          message: `${a.element} would hold ${a.shellElectrons} valence electrons; the limit is ${limit}.`,
          penalty: DEDUCTIONS.octetExceeded,
        });
      }
    }

    // Noble gases (He, Ne, Ar) with bonds are impossible outside sandbox.
    const nobleGasAllowed = ['Xe', 'Kr'].includes(a.element) && opts.difficulty !== 'strict';
    if (el.isNobleGas && !nobleGasAllowed && a.sigma > 0) {
      issues.push({
        code: 'NOBLE_GAS_BONDED', atomId: a.id, element: a.element,
        message: `${el.name} has a complete valence shell — compounds of He/Ne/Ar are not known.`,
        penalty: DEDUCTIONS.romanNobleGas,
      });
    }

    // Radical detection: odd number of electrons in the valence shell.
    const oddShell = Math.abs(a.shellElectrons % 2) === 1;
    const unsatisfiedValency = a.bondSum < maxV && a.shellElectrons < limit - 1;
    if (oddShell || (oddElectronMolecule && unsatisfiedValency && !ELUCTANT.has(a.element))) {
      issues.push({
        code: 'RADICAL', atomId: a.id, element: a.element,
        message: `${a.element} carries an unpaired electron (${a.shellElectrons} e⁻ in its valence shell).`,
        penalty: DEDUCTIONS.radical,
      });
    } else if (a.shellElectrons < targetShell(a.element) && !ELUCTANT.has(a.element)) {
      // Incomplete octet.
      if (ELECTRON_DEFICIENT_OK.has(a.element)) {
        warnings.push(`${a.element} is electron-deficient (${a.shellElectrons} e⁻) — a Lewis acid, but perfectly stable.`);
        score -= DEDUCTIONS.electronDeficient;
      } else if (a.element !== 'H') {
        issues.push({
          code: 'INCOMPLETE_OCTET', atomId: a.id, element: a.element,
          message: `${a.element} has only ${a.shellElectrons} valence electrons — incomplete octet.`,
          penalty: DEDUCTIONS.incompleteOctet,
        });
      }
    }

    // Formal charges. Ions in an ionic lattice (NaCl, MgO) and explicitly
    // charged centres (NH4⁺) are SUPPOSED to carry charge, so they are not penalised.
    const isIonicCharge = (charge !== 0) || (el.isMetal) || moleculeIsIonic;
    if (Math.abs(a.formalCharge) >= 1 && !isIonicCharge) {
      const big = Math.abs(a.formalCharge) > 1;
      issues.push({
        code: 'FORMAL_CHARGE', atomId: a.id, element: a.element,
        message: `${a.element} carries a formal charge of ${a.formalCharge > 0 ? '+' : ''}${a.formalCharge}.`,
        penalty: big ? DEDUCTIONS.bigFormalCharge : DEDUCTIONS.formalCharge,
      });
    }

    if (a.shellElectrons > 8) {
      warnings.push(`${a.element} uses an expanded octet (${a.shellElectrons} e⁻) — hypervalent, period ${el.period}.`);
      score -= DEDUCTIONS.hypervalent;
    }
  }

  // Net charge vs. difficulty (spec §5d / §10 rule-sets).
  const net = atoms.reduce((s, a) => s + a.formalCharge, 0);
  if (net !== 0) {
    if (opts.difficulty === 'strict') {
      issues.push({
        code: 'NET_CHARGE', message: `Net charge ${net > 0 ? '+' : ''}${net}. Strict mode permits neutral molecules only.`,
        penalty: DEDUCTIONS.netChargeStrict,
      });
    } else {
      warnings.push(`Net charge ${net > 0 ? '+' : ''}${net} — this is an ion, not a neutral molecule.`);
      score -= 4;
    }
  }

  if (oddElectronMolecule && !issues.some((i) => i.code === 'RADICAL')) {
    score -= DEDUCTIONS.oddElectronMolecule;
    warnings.push('Odd total valence-electron count — expect radical character.');
  }

  // Polyoxide chains (O–O–O …) are only isolable for O2, O3 and H2O2.
  const polyoxide = detectPolyoxide(g);
  if (polyoxide > 0) {
    score -= 25 * polyoxide;
    warnings.push('Oxygen-only chain detected — beyond H₂O₂ and ozone, polyoxides are not isolable.');
    issues.push({
      code: 'POLYOXIDE', message: 'An oxygen chain longer than a peroxide is not a stable species.',
      penalty: 25,
    });
  }

  // Three- and four-membered rings are strained (cyclopropane, cyclobutane).
  const ringStrain = detectStrainedRings(g);
  if (ringStrain > 0) {
    score -= DEDUCTIONS.strainedRing * ringStrain;
    warnings.push(`Small ring detected (${ringStrain} strained ring${ringStrain > 1 ? 's' : ''}) — angle strain raises the energy.`);
  }

  score -= issues.reduce((s, i) => s + i.penalty, 0);
  score = Math.max(0, Math.min(100, Math.round(score)));

  const hasImpossible = issues.some(
    (i) => i.code === 'OVER_VALENT' || i.code === 'OCTET_EXCEEDED' || i.code === 'NOBLE_GAS_BONDED',
  );
  const hasRadical = issues.some((i) => i.code === 'RADICAL');

  let status: StabilityStatus;
  let reason: string;
  const strictNeutralViolation = opts.difficulty === 'strict' && issues.some((i) => i.code === 'NET_CHARGE');
  if (hasImpossible || strictNeutralViolation) {
    status = 'impossible';
    reason = issues.find((i) => i.code !== 'FORMAL_CHARGE')?.message ?? 'Violates the octet rule.';
    if (strictNeutralViolation) reason = 'Strict mode permits neutral molecules only — this species carries a net charge.';
  } else if (hasRadical) {
    if (opts.difficulty === 'strict') {
      status = 'impossible';
      reason = 'Radicals are disabled in Strict mode.';
    } else {
      status = 'radical';
      reason = issues.find((i) => i.code === 'RADICAL')!.message;
    }
  } else if (score >= 78) {
    status = 'stable';
    reason = net !== 0
      ? 'Complete, well-formed ion. All octets satisfied.'
      : 'Complete and stable — all octets satisfied, formal charges minimal.';
  } else {
    status = 'unstable';
    reason = issues[0]?.message ?? warnings[0] ?? 'Energetically unfavourable arrangement.';
  }

  return { status, score, reason, issues, warnings };
}

/** Atoms that legitimately stop short of an octet without becoming radicals
 *  (noble gases, and metals we treat ionically). */
const ELUCTANT = new Set(['H', 'He', 'Ne', 'Ar', 'Li', 'Na', 'K', 'Mg', 'Ca', 'Be', 'Al', 'Fe', 'Cu', 'Co', 'Ni', 'Zn', 'Ag', 'Cr', 'Mn']);

/** Count O–O–O motifs (an oxygen bonded to two other oxygens). */
function detectPolyoxide(g: MoleculeGraph): number {
  let n = 0;
  for (const a of g.atoms) {
    if (a.element !== 'O') continue;
    const oNeighbours = g.bonds.filter(
      (b) => (b.a === a.id || b.b === a.id) && (g.atoms.find((x) => x.id === (b.a === a.id ? b.b : b.a))?.element === 'O'),
    ).length;
    if (oNeighbours >= 2) n++;
  }
  return n;
}

function detectStrainedRings(g: MoleculeGraph): number {
  // Count bonds that participate in rings of size 3–4 (cheap: triangle detection).
  const adj = new Map<string, Set<string>>();
  for (const a of g.atoms) adj.set(a.id, new Set());
  for (const b of g.bonds) {
    adj.get(b.a)?.add(b.b);
    adj.get(b.b)?.add(b.a);
  }
  let strained = 0;
  const seen = new Set<string>();
  for (const a of g.atoms) {
    for (const b of adj.get(a.id) ?? []) {
      for (const c of adj.get(b) ?? []) {
        if (c === a.id) continue;
        if (adj.get(c)?.has(a.id)) {
          const key = [a.id, b, c].sort().join('|');
          if (!seen.has(key)) { seen.add(key); strained++; }
        }
      }
    }
  }
  return strained;
}

/** Convenience wrapper used by the campaign validator. */
export function stabilityLabel(report: StabilityReport): string {
  switch (report.status) {
    case 'stable': return `STABLE · ${report.score}/100`;
    case 'unstable': return `UNSTABLE · ${report.score}/100`;
    case 'radical': return `RADICAL · ${report.score}/100`;
    default: return `IMPOSSIBLE · ${report.score}/100`;
  }
}
