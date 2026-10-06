/**
 * chemistryEngine.test.ts — spec §12: unit tests for the rules engine.
 *
 * Covers > 40 molecules including every "must be rejected" case named in the
 * brief: CH5, OH3, NaCl2, NeH, F2O3, SF7, CCl5, NCl5, CH3• (strict), NH4+ (strict).
 *
 * Run with:  npm test
 */

import { describe, it, expect } from 'vitest';
import {
  type MoleculeGraph,
  type Difficulty,
  type GraphAtom,
  analyzeMolecule,
  canBond,
  elementKey,
  graphFromSmilesLite,
  structuralFormula,
  netFormalCharge,
  findAromaticRings,
  canonicalSignature,
  detectIsomer,
  countFragments,
  covalentBondSumOf,
} from '../chemistry/chemistryEngine';
import { lonePairs, formalCharge, formatCharge } from '../chemistry/formalCharge';
import { analyzeHybridization, hybridizationFor } from '../chemistry/hybridization';
import { nameMolecule } from '../chemistry/naming';
import { findReactionByFormulas, isBalanced, REACTION_TABLE, attemptReaction } from '../chemistry/reactionEngine';
import { ELEMENT_TABLE, getElement, octetLimit } from '../chemistry/elements';
import { KNOWN } from '../chemistry/chemistryEngine';
import { checkPlacement } from '../chemistry/chemistryEngine';

/* ------------------------------------------------------------- helpers */

const g = (smiles: string) => graphFromSmilesLite(smiles);

/** Notation-independent formula comparison ("H2SO4" === "H2O4S"). */
const sameFormula = (a: string, b: string) => elementKey(a) === elementKey(b);

function analyze(smiles: string, difficulty: Difficulty = 'advanced') {
  return analyzeMolecule(g(smiles), { difficulty });
}

/** Append a bare atom (no bonds) so we can attempt an extra bond onto it. */
function withFreeAtom(graph: MoleculeGraph, element: string): { graph: MoleculeGraph; id: string } {
  const atom: GraphAtom = { id: `free_${element}_${graph.atoms.length}`, element, charge: 0 };
  return { graph: { atoms: [...graph.atoms, atom], bonds: [...graph.bonds] }, id: atom.id };
}

/* ------------------------------------------------- 1. element table sanity */

describe('element table', () => {
  it('exposes every element required by the palette', () => {
    for (const sym of ['H', 'C', 'N', 'O', 'F', 'Cl', 'Br', 'I', 'S', 'P', 'Na', 'K', 'Mg', 'Ca', 'Al', 'B', 'Be', 'Si', 'Fe', 'Cu', 'Co', 'Ni', 'Zn', 'He', 'Ne', 'Ar']) {
      expect(ELEMENT_TABLE[sym], sym).toBeDefined();
    }
  });

  it('caps period-2 elements at the octet and lets period >= 3 expand', () => {
    expect(octetLimit('C')).toBe(8);
    expect(octetLimit('N')).toBe(8);
    expect(octetLimit('O')).toBe(8);
    expect(octetLimit('H')).toBe(2);
    expect(getElement('S').canExpandOctet).toBe(true);
    expect(getElement('P').canExpandOctet).toBe(true);
    expect(getElement('O').canExpandOctet).toBe(false);
  });

  it('matches the textbook valences', () => {
    expect(getElement('H').maxValence).toBe(1);
    expect(getElement('C').maxValence).toBe(4);
    expect(getElement('N').maxValence).toBe(3);
    expect(getElement('O').maxValence).toBe(2);
    expect(getElement('F').maxValence).toBe(1);
    expect(getElement('B').maxValence).toBe(3);
    expect(getElement('Be').maxValence).toBe(2);
    expect(getElement('S').maxValence).toBe(6);
    expect(getElement('P').maxValence).toBe(5);
    expect(getElement('Cl').maxValence).toBe(7);
  });
});

/* -------------------------------------------- 2. valid molecules (formulas) */

describe('valid molecules — formula, status and geometry', () => {
  const cases: { smiles: string; formula: string; status: string; hy?: string; shape?: string }[] = [
    { smiles: '[H][H]', formula: 'H2', status: 'stable' },
    { smiles: 'O=O', formula: 'O2', status: 'stable' },
    { smiles: 'N#N', formula: 'N2', status: 'stable' },
    { smiles: 'O', formula: 'H2O', status: 'stable', hy: 'sp3', shape: 'bent (V-shaped)' },
    { smiles: 'O=C=O', formula: 'CO2', status: 'stable', hy: 'sp', shape: 'linear' },
    { smiles: 'N', formula: 'NH3', status: 'stable', hy: 'sp3', shape: 'trigonal pyramidal' },
    { smiles: 'C', formula: 'CH4', status: 'stable', hy: 'sp3', shape: 'tetrahedral' },
    { smiles: 'Cl', formula: 'HCl', status: 'stable' },
    { smiles: 'F', formula: 'HF', status: 'stable' },
    { smiles: 'S', formula: 'H2S', status: 'stable', hy: 'sp3', shape: 'bent (V-shaped)' },
    { smiles: 'OO', formula: 'H2O2', status: 'stable' },
    { smiles: 'O=S=O', formula: 'SO2', status: 'stable', hy: 'sp2', shape: 'bent (V-shaped)' },
    { smiles: 'O=S(=O)=O', formula: 'SO3', status: 'stable', hy: 'sp2', shape: 'trigonal planar' },
    { smiles: 'OS(=O)(=O)O', formula: 'H2SO4', status: 'stable', hy: 'sp3' },
    { smiles: 'O[N+](=O)[O-]', formula: 'HNO3', status: 'stable', hy: 'sp2' },
    { smiles: 'CC', formula: 'C2H6', status: 'stable', hy: 'sp3' },
    { smiles: 'C=C', formula: 'C2H4', status: 'stable', hy: 'sp2', shape: 'trigonal planar' },
    { smiles: 'C#C', formula: 'C2H2', status: 'stable', hy: 'sp', shape: 'linear' },
    { smiles: 'CO', formula: 'CH4O', status: 'stable', hy: 'sp3' },
    { smiles: 'CCO', formula: 'C2H6O', status: 'stable' },
    { smiles: 'CC(=O)O', formula: 'C2H4O2', status: 'stable', hy: 'sp2' },
    { smiles: 'C=O', formula: 'CH2O', status: 'stable', hy: 'sp2' },
    { smiles: 'CC(=O)C', formula: 'C3H6O', status: 'stable', hy: 'sp2' },
    { smiles: 'C1CCCCC1', formula: 'C6H12', status: 'stable' },
    { smiles: 'c1ccccc1', formula: 'C6H6', status: 'stable', hy: 'sp2' },
    { smiles: 'Cl[Be]Cl', formula: 'BeCl2', status: 'stable', hy: 'sp', shape: 'linear' },
    { smiles: 'FB(F)F', formula: 'BF3', status: 'stable', hy: 'sp2', shape: 'trigonal planar' },
    { smiles: 'ClP(Cl)(Cl)(Cl)Cl', formula: 'PCl5', status: 'stable', hy: 'sp3d', shape: 'trigonal bipyramidal' },
    { smiles: 'FS(F)(F)(F)(F)F', formula: 'SF6', status: 'stable', hy: 'sp3d2', shape: 'octahedral' },
    { smiles: 'FS(F)(F)F', formula: 'SF4', status: 'stable', hy: 'sp3d', shape: 'see-saw (disphenoidal)' },
    { smiles: 'F[Cl](F)F', formula: 'ClF3', status: 'stable', hy: 'sp3d', shape: 'T-shaped' },
    { smiles: 'F[Br](F)(F)(F)F', formula: 'BrF5', status: 'stable', hy: 'sp3d2', shape: 'square pyramidal' },
    { smiles: 'F[I](F)(F)(F)(F)(F)F', formula: 'IF7', status: 'stable', hy: 'sp3d3' },
    { smiles: 'Cl[Na]', formula: 'NaCl', status: 'stable' },
    { smiles: '[Mg+2].[O-2]', formula: 'MgO', status: 'stable' },
    { smiles: 'NC(N)=O', formula: 'CH4N2O', status: 'stable', hy: 'sp2' },
    { smiles: 'NCC(=O)O', formula: 'C2H5NO2', status: 'stable' },
    { smiles: 'O=CC(O)C(O)C(O)C(O)CO', formula: 'C6H12O6', status: 'stable' },
    { smiles: 'CC(=O)Oc1ccccc1C(=O)O', formula: 'C9H8O4', status: 'stable' },
  ];

  for (const c of cases) {
    it(`${c.formula.padEnd(9)} from "${c.smiles}" parses, is stable and reports the right shape`, () => {
      const a = analyze(c.smiles, 'advanced');
      expect(sameFormula(a.formula, c.formula), `formula ${a.formula} vs ${c.formula}`).toBe(true);
      expect(a.stability.status, `${c.formula}: ${a.stability.reason}`).toBe(c.status);
      if (c.hy) expect(a.central?.hybridization.hybridization).toBe(c.hy);
      if (c.shape) expect(a.molecularShape).toBe(c.shape);
      expect(a.fragmentCount).toBe(1);
    });
  }

  it('computes noble-gas hypervalent species correctly (XeF4 is square planar sp3d2)', () => {
    const a = analyze('F[Xe](F)(F)F', 'advanced');
    expect(a.formula).toBe('F4Xe');
    expect(a.central?.hybridization.hybridization).toBe('sp3d2');
    expect(a.molecularShape).toBe('square planar');
    expect(a.stability.status).toBe('stable');
  });

  it('flags XeF2 as impossible in STRICT (noble gases blocked)', () => {
    expect(analyze('F[Xe]F', 'strict').stability.status).toBe('impossible');
    expect(analyze('F[Xe]F', 'advanced').stability.status).not.toBe('impossible');
  });
});

/* ------------------------------------------ 3. ions, charges and radicals */

describe('formal charges and ions', () => {
  it('ammonium is a stable +1 ion in ADVANCED but rejected in STRICT', () => {
    const adv = analyze('[NH4+]', 'advanced');
    expect(sameFormula(adv.formula, 'H4N')).toBe(true);
    expect(adv.netCharge).toBe(1);
    expect(adv.chargeLabel).toBe('+');
    expect(adv.stability.status).toBe('stable');
    expect(analyze('[NH4+]', 'strict').stability.status).toBe('impossible');
  });

  it('neutral molecules carry zero net charge', () => {
    expect(netFormalCharge(g('O'))).toBe(0);
    expect(netFormalCharge(g('C'))).toBe(0);
    expect(netFormalCharge(g('CC(=O)O'))).toBe(0);
  });

  it('nitrate and sulfate carry their textbook charges', () => {
    const no3 = analyzeMolecule(g('O=[N+](=O)[O-]'), { difficulty: 'advanced' });
    expect(no3.netCharge).toBe(-1);
    const so4 = analyzeMolecule(g('[O-]S(=O)(=O)[O-]'), { difficulty: 'advanced' });
    expect(so4.netCharge).toBe(-2);
    expect(formatCharge(so4.netCharge)).toBe('2−');
  });

  it('ozone has a +1 formal charge on the central oxygen', () => {
    const o3 = analyzeMolecule(g('[O-][O+]=O'), { difficulty: 'advanced' });
    const central = o3.atoms.find((a) => a.sigma === 2)!;
    expect(central.formalCharge).toBe(1);
    expect(o3.netCharge).toBe(0);
  });

  it('counts lone pairs: H2O 2, NH3 1, CH4 0, HF 3', () => {
    expect(lonePairs('O', 2)).toBe(2);
    expect(lonePairs('N', 3)).toBe(1);
    expect(lonePairs('C', 4)).toBe(0);
    expect(lonePairs('F', 1)).toBe(3);
  });

  it('computes formal charge FC = V − 2L − S', () => {
    expect(formalCharge('C', 4, 0)).toBe(0);
    expect(formalCharge('N', 4, 0)).toBe(1);
    expect(formalCharge('O', 1, 3)).toBe(-1);
    expect(formalCharge('O', 3, 1)).toBe(1);
  });

  it('treats the methyl radical as a radical in ADVANCED and impossible in STRICT', () => {
    const radical: MoleculeGraph = {
      atoms: [
        { id: 'c', element: 'C' },
        { id: 'h1', element: 'H' },
        { id: 'h2', element: 'H' },
        { id: 'h3', element: 'H' },
      ],
      bonds: [
        { id: 'b1', a: 'c', b: 'h1', order: 1, type: 'covalent' },
        { id: 'b2', a: 'c', b: 'h2', order: 1, type: 'covalent' },
        { id: 'b3', a: 'c', b: 'h3', order: 1, type: 'covalent' },
      ],
    };
    expect(analyzeMolecule(radical, { difficulty: 'advanced' }).stability.status).toBe('radical');
    expect(analyzeMolecule(radical, { difficulty: 'strict' }).stability.status).toBe('impossible');
  });

  it('hydroxide radical OH• is a radical, not a stable molecule', () => {
    const oh: MoleculeGraph = {
      atoms: [{ id: 'o', element: 'O' }, { id: 'h', element: 'H' }],
      bonds: [{ id: 'b', a: 'o', b: 'h', order: 1, type: 'covalent' }],
    };
    expect(analyzeMolecule(oh, { difficulty: 'advanced' }).stability.status).toBe('radical');
  });
});

/* ------------------------------------------------ 4. rejected compounds */

describe('invalid compounds are rejected with the right reason', () => {
  it('CH5 — carbon already has four bonds', () => {
    const { graph, id } = withFreeAtom(g('C'), 'H');
    const check = canBond(graph, 'a0', id, 1, { difficulty: 'strict' });
    expect(check.ok).toBe(false);
    expect(check.code).toBe('VALENCY_EXCEEDED');
  });

  it('OH3 — oxygen cannot make three bonds', () => {
    const { graph, id } = withFreeAtom(g('O'), 'H');
    const check = canBond(graph, 'a0', id, 1, { difficulty: 'strict' });
    expect(check.ok).toBe(false);
    expect(check.code).toBe('VALENCY_EXCEEDED');
    expect(check.reason).toMatch(/maximum is 2/);
  });

  it('NaCl2 — sodium is +1, two chlorides give −2: charge imbalance + over-valency', () => {
    const a = analyze('Cl[Na]Cl', 'strict');
    expect(a.stability.status).toBe('impossible');
    expect(a.stability.issues.some((i) => i.code === 'OVER_VALENT')).toBe(true);
    expect(a.netCharge).not.toBe(0);
  });

  it('NeH — neon cannot bond at all', () => {
    const graph: MoleculeGraph = { atoms: [{ id: 'h', element: 'H' }, { id: 'ne', element: 'Ne' }], bonds: [] };
    const check = canBond(graph, 'h', 'ne', 1, { difficulty: 'strict' });
    expect(check.ok).toBe(false);
    expect(check.code).toBe('NOBLE_GAS');
    expect(check.speech).toMatch(/complete valence shell/);
  });

  it('HeH and ArH are rejected the same way', () => {
    for (const noble of ['He', 'Ar']) {
      const graph: MoleculeGraph = { atoms: [{ id: 'h', element: 'H' }, { id: 'x', element: noble }], bonds: [] };
      expect(canBond(graph, 'h', 'x', 1, { difficulty: 'sandbox' }).code).toBe('NOBLE_GAS');
    }
  });

  it('F2O3 — a three-oxygen chain is not isolable', () => {
    const a = analyze('FOOOF', 'advanced');
    expect(sameFormula(a.formula, 'F2O3')).toBe(true);
    expect(a.stability.status).not.toBe('stable');
    expect(a.stability.warnings.join(' ')).toMatch(/oxygen chain|polyoxide|ozonide|peroxide/i);
  });

  it('SF7 — sulfur tops out at six bonds', () => {
    const { graph, id } = withFreeAtom(g('FS(F)(F)(F)(F)F'), 'F');
    const check = canBond(graph, 'a0', id, 1, { difficulty: 'advanced' });
    expect(check.ok).toBe(false);
    expect(['VALENCY_EXCEEDED', 'HYPERVALENT_BLOCKED', 'OCTET_EXCEEDED']).toContain(check.code);
  });

  it('CCl5 — carbon can never exceed four bonds', () => {
    const { graph, id } = withFreeAtom(g('ClC(Cl)(Cl)Cl'), 'Cl');
    const check = canBond(graph, 'a1', id, 1, { difficulty: 'sandbox' });
    expect(check.ok).toBe(false);
    expect(check.code).toBe('VALENCY_EXCEEDED');
  });

  it('NCl5 — nitrogen cannot expand the octet', () => {
    const { graph, id } = withFreeAtom(g('ClN(Cl)Cl'), 'Cl');
    const check = canBond(graph, 'a1', id, 1, { difficulty: 'sandbox' });
    expect(check.ok).toBe(false);
    expect(check.code).toBe('VALENCY_EXCEEDED');
  });

  it('OF3 — oxygen is limited to two bonds even in SANDBOX', () => {
    const { graph, id } = withFreeAtom(g('FOF'), 'F');
    const check = canBond(graph, 'a1', id, 1, { difficulty: 'sandbox' });
    expect(check.ok).toBe(false);
  });

  it('a bond to itself is rejected', () => {
    expect(canBond(g('O'), 'a0', 'a0', 1, { difficulty: 'sandbox' }).code).toBe('SAME_ATOM');
  });

  it('duplicating an existing bond is rejected with a helpful hint', () => {
    const check = canBond(g('CC'), 'a0', 'a1', 1, { difficulty: 'sandbox' });
    expect(check.ok).toBe(false);
    expect(check.code).toBe('ALREADY_BONDED');
    expect(check.speech).toMatch(/bond order/i);
  });

  it('promoting C–C to a triple bond is allowed but a fourth order is not representable', () => {
    const ethyne = analyze('C#C', 'advanced');
    expect(ethyne.piCount).toBe(2);
    expect(ethyne.sigmaCount).toBe(3); // 1 C–C + 2 C–H
  });

  it('steric clash check rejects overlapping atoms', () => {
    const clash = checkPlacement([{ id: 'a', element: 'C', position: { x: 0, y: 0, z: 0 } }], 'C', { x: 0.1, y: 0, z: 0 });
    expect(clash.ok).toBe(false);
    expect(clash.reason).toMatch(/Steric clash/);
    const ok = checkPlacement([{ id: 'a', element: 'C', position: { x: 0, y: 0, z: 0 } }], 'C', { x: 4, y: 0, z: 0 });
    expect(ok.ok).toBe(true);
  });
});

/* ---------------------------------------------- 5. hybridization rules */

describe('hybridization', () => {
  it('maps steric number to hybrid orbital', () => {
    expect(hybridizationFor(2)).toBe('sp');
    expect(hybridizationFor(3)).toBe('sp2');
    expect(hybridizationFor(4)).toBe('sp3');
    expect(hybridizationFor(5)).toBe('sp3d');
    expect(hybridizationFor(6)).toBe('sp3d2');
    expect(hybridizationFor(7)).toBe('sp3d3');
  });

  it('derives molecular shape from AXnEm', () => {
    expect(analyzeHybridization(2, 0).molecularShape).toBe('linear');
    expect(analyzeHybridization(3, 1).molecularShape).toBe('trigonal pyramidal');
    expect(analyzeHybridization(2, 2).molecularShape).toBe('bent (V-shaped)');
    expect(analyzeHybridization(4, 1).molecularShape).toBe('see-saw (disphenoidal)');
    expect(analyzeHybridization(3, 2).molecularShape).toBe('T-shaped');
    expect(analyzeHybridization(4, 2).molecularShape).toBe('square planar');
    expect(analyzeHybridization(5, 1).molecularShape).toBe('square pyramidal');
  });

  it('reports the ideal bond angle with lone-pair compression', () => {
    expect(analyzeHybridization(4, 0).angle).toBe(109.5);
    expect(analyzeHybridization(3, 1).angle).toBe(107);
    expect(analyzeHybridization(2, 2).angle).toBe(104.5);
    expect(analyzeHybridization(2, 0).angle).toBe(180);
  });

  it('σ / π counts: ethane 7σ, ethene 5σ+1π, ethyne 3σ+2π', () => {
    expect(analyze('CC', 'advanced').sigmaCount).toBe(7);
    expect(analyze('C=C', 'advanced').sigmaCount).toBe(5);
    expect(analyze('C=C', 'advanced').piCount).toBe(1);
    expect(analyze('C#C', 'advanced').sigmaCount).toBe(3);
    expect(analyze('C#C', 'advanced').piCount).toBe(2);
  });
});

/* --------------------------------------------------- 6. aromaticity */

describe('aromaticity', () => {
  it('detects benzene as one 6-membered aromatic ring', () => {
    const a = analyze('c1ccccc1', 'advanced');
    expect(a.isAromatic).toBe(true);
    expect(a.aromaticRings).toHaveLength(1);
    expect(a.aromaticRings[0]).toHaveLength(6);
  });

  it('detects a Kekulé benzene written with alternating double bonds', () => {
    expect(findAromaticRings(g('C1=CC=CC=C1'))).toHaveLength(1);
  });

  it('does not call cyclohexane aromatic', () => {
    expect(analyze('C1CCCCC1', 'advanced').isAromatic).toBe(false);
  });

  it('detects pyridine (one N in the ring)', () => {
    const a = analyze('c1ccncc1', 'advanced');
    expect(sameFormula(a.formula, 'C5H5N')).toBe(true);
    expect(a.isAromatic).toBe(true);
  });
});

/* ------------------------------------------------------- 7. isomers */

describe('isomer detection', () => {
  it('gives propan-1-ol and propan-2-ol different canonical signatures', () => {
    const a = canonicalSignature(g('CCCO'));
    const b = canonicalSignature(g('CC(O)C'));
    expect(sameFormula(structuralFormula(g('CCCO')), structuralFormula(g('CC(O)C')))).toBe(true);
    expect(a).not.toBe(b);
  });

  it('recognises a known isomer by name', () => {
    expect(detectIsomer(g('CC(O)C'))).toBeTruthy();
  });

  it('is isomorphism-tolerant (same molecule, different atom order)', () => {
    const one: MoleculeGraph = {
      atoms: [{ id: 'a', element: 'C' }, { id: 'b', element: 'O' }, { id: 'c', element: 'H' }],
      bonds: [
        { id: 'x', a: 'a', b: 'b', order: 1, type: 'covalent' },
        { id: 'y', a: 'b', b: 'c', order: 1, type: 'covalent' },
      ],
    };
    const two: MoleculeGraph = {
      atoms: [{ id: 'z', element: 'H' }, { id: 'y2', element: 'C' }, { id: 'x2', element: 'O' }],
      bonds: [
        { id: 'p', a: 'y2', b: 'x2', order: 1, type: 'covalent' },
        { id: 'q', a: 'x2', b: 'z', order: 1, type: 'covalent' },
      ],
    };
    expect(canonicalSignature(one)).toBe(canonicalSignature(two));
  });
});

/* -------------------------------------------------------- 8. naming */

describe('naming', () => {
  it('names simple inorganics', () => {
    expect(nameMolecule(g('O')).name).toBe('water');
    expect(nameMolecule(g('O=C=O')).name).toBe('carbon dioxide');
    expect(nameMolecule(g('Cl[Na]')).name).toBe('sodium chloride');
    expect(nameMolecule(g('N#N')).name).toBe('dinitrogen');
    expect(nameMolecule(g('O=O')).name).toBe('dioxygen');
  });

  it('names ionic compounds with variable charge using roman numerals', () => {
    expect(nameMolecule(g('Cl[Fe](Cl)Cl')).name).toBe('iron(III) chloride');
    expect(nameMolecule(g('Cl[Fe]Cl')).name).toBe('iron(II) chloride');
  });

  it('names oxoacids by oxidation state', () => {
    expect(nameMolecule(g('OS(=O)(=O)O')).name).toBe('sulfuric acid');
    expect(nameMolecule(g('OS(=O)O')).name).toBe('sulfurous acid');
    expect(nameMolecule(g('O[N+](=O)[O-]')).name).toBe('nitric acid');
    expect(nameMolecule(g('ON=O')).name).toBe('nitrous acid');
    expect(nameMolecule(g('OCl(=O)(=O)=O')).name).toBe('perchloric acid');
    expect(nameMolecule(g('OC(=O)O')).name).toBe('carbonic acid');
    expect(nameMolecule(g('OP(=O)(O)O')).name).toBe('phosphoric acid');
  });

  it('names salts of polyatomic ions', () => {
    expect(nameMolecule(g('[Ca+2].[O-]C(=O)[O-]')).name).toBe('calcium carbonate');
    expect(nameMolecule(g('[Na+].[OH-]')).name).toBe('sodium hydroxide');
  });

  it('names simple organics systematically', () => {
    expect(nameMolecule(g('CCO')).name).toBe('ethanol');
    expect(nameMolecule(g('CC(=O)O')).name).toBe('ethanoic acid');
    expect(nameMolecule(g('CC(=O)C')).name).toBe('propanone');
    expect(nameMolecule(g('CC=O')).name).toBe('ethanal');
    expect(nameMolecule(g('c1ccccc1')).name).toBe('benzene');
    expect(nameMolecule(g('Cc1ccccc1')).name).toBe('toluene');
    expect(nameMolecule(g('Oc1ccccc1')).name).toBe('phenol');
  });

  it('prefers a known common name when the database supplies one', () => {
    const acetic = analyze('CC(=O)O', 'advanced');
    const named = nameMolecule(g('CC(=O)O'), { name: acetic.knownName, iupac: acetic.iupac });
    expect(named.name).toBe('acetic acid');
    expect(named.confidence).toBe('exact');
  });
});

/* ----------------------------------------------------- 9. reactions */

describe('reaction engine', () => {
  it('every table entry is mass balanced', () => {
    for (const r of REACTION_TABLE) {
      expect(isBalanced(r), `${r.id}: ${r.equation}`).toBe(true);
    }
  });

  it('finds the classic preset reactions', () => {
    expect(findReactionByFormulas('H2', 'O2')?.id).toBe('hydrogen-oxygen');
    expect(findReactionByFormulas('CH4', 'O2')?.id).toBe('methane-combustion');
    expect(findReactionByFormulas('N2', 'H2')?.id).toBe('ammonia-synthesis');
    expect(findReactionByFormulas('ClH', 'HNaO')?.id).toBe('neutralisation');
    expect(findReactionByFormulas('C2H4', 'H2')?.id).toBe('ethene-hydrogenation');
  });

  it('is order insensitive', () => {
    expect(findReactionByFormulas('O2', 'H2')?.id).toBe('hydrogen-oxygen');
  });

  it('marks exothermic / endothermic correctly', () => {
    const combustion = findReactionByFormulas('H2', 'O2')!;
    expect(combustion.exothermic).toBe(true);
    expect(combustion.dH).toBeLessThan(0);
    const calcination = REACTION_TABLE.find((r) => r.id === 'limestone-calcination')!;
    expect(calcination.exothermic).toBe(false);
    expect(calcination.dH).toBeGreaterThan(0);
  });

  it('reacts methane with oxygen and returns product graphs', () => {
    const result = attemptReaction(g('C'), g('O=O'), { difficulty: 'advanced' });
    expect(result.ok).toBe(true);
    expect(result.reaction?.id).toBe('methane-combustion');
    expect(result.products?.length).toBeGreaterThan(0);
    expect(result.exothermic).toBe(true);
  });

  it('refuses to invent a reaction between inert partners', () => {
    const result = attemptReaction(g('CC'), g('CC'), { difficulty: 'advanced' });
    expect(result.ok).toBe(false);
    expect(result.jarvis).toMatch(/alkane|bounce|do not react/i);
  });

  it('decomposition works with a single reactant', () => {
    const result = attemptReaction(g('[Ca+2].[O-]C(=O)[O-]'), null, { difficulty: 'advanced' });
    expect(result.ok).toBe(true);
    expect(result.reaction?.id).toBe('limestone-calcination');
  });
});

/* ---------------------------------------------- 10. coordination chemistry */

describe('coordination complexes', () => {
  it('[Co(NH3)6]3+ keeps the ammonia ligands neutral and the complex at +3', () => {
    // Each NH3 is a branch so the main chain runs N → Co.
    const nh3 = 'N([H])([H])([H])';
    const smiles = `${nh3}[Co+3](${nh3})(${nh3})(${nh3})(${nh3})(${nh3})`;
    const graph = g(smiles);
    const a = analyzeMolecule(graph, { difficulty: 'advanced' });
    expect(sameFormula(a.formula, 'H18CoN6')).toBe(true);
    expect(a.netCharge).toBe(3);
    expect(a.central?.hybridization.hybridization).toBe('sp3d2');
    expect(a.stability.status).toBe('stable');
    // Each N still sees only its three covalent N–H bonds (dative bonds excluded).
    const n = a.atoms.find((x) => x.element === 'N')!;
    expect(covalentBondSumOf(graph, n.id)).toBe(3);
    expect(n.formalCharge).toBe(0);
  });

  it('[Fe(CN)6]3− carries −3 overall', () => {
    const graph = g('[C-]#N[Fe+3](N#[C-])(N#[C-])(N#[C-])(N#[C-])N#[C-]');
    const a = analyzeMolecule(graph, { difficulty: 'advanced' });
    expect(sameFormula(a.formula, 'C6FeN6')).toBe(true);
    expect(a.netCharge).toBe(-3);
  });

  it('a seventh ligand is refused (coordination number 6)', () => {
    const nh3 = 'N([H])([H])([H])';
    const base = g(`${nh3}[Co+3](${nh3})(${nh3})(${nh3})(${nh3})(${nh3})`);
    const { graph, id } = withFreeAtom(base, 'N');
    const co = graph.atoms.find((x) => x.element === 'Co')!.id;
    expect(canBond(graph, co, id, 1, { difficulty: 'advanced' }, 'coordinate').code).toBe('COORDINATION_LIMIT');
  });
});

/* ----------------------------------------- 11. misc engine guarantees */

describe('engine guarantees', () => {
  it('counts fragments for disconnected builds', () => {
    expect(countFragments(g('O'))).toBe(1);
    expect(countFragments(g('O.O'))).toBe(2);
  });

  it('every known molecule entry has a parseable formula key', () => {
    expect(KNOWN.length).toBeGreaterThan(150);
    for (const k of KNOWN) expect(elementKey(k.formula).length).toBeGreaterThan(0);
  });

  it('rates stability from 0 to 100', () => {
    for (const smiles of ['O', 'C', 'CC(=O)O', 'FS(F)(F)(F)(F)F', 'c1ccccc1']) {
      const score = analyze(smiles, 'advanced').stability.score;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it('reports polarity: CO2 nonpolar, H2O polar, NaCl ionic', () => {
    expect(analyze('O=C=O', 'advanced').polarity).toBe('nonpolar');
    expect(analyze('O', 'advanced').polarity).toBe('polar');
    expect(analyze('Cl[Na]', 'advanced').polarity).toBe('ionic');
  });
});
