/**
 * buildTools.test.ts — the §6 construction helpers must produce graphs that the
 * chemistry engine accepts, otherwise every tool in the palette is a lie.
 */

import { describe, expect, it } from 'vitest';
import {
  COORDINATION_GEOMETRY,
  GROUP_BY_ID,
  MONOMERS,
  groupToGraph,
  makeChain,
  makeCoordination,
  makeKekuleBenzene,
  makePolymer,
  makeRing,
} from '../chemistry/buildTools';
import {
  addImplicitHydrogens,
  analyzeMolecule,
  graphFromSmilesLite,
  structuralFormula,
} from '../chemistry/chemistryEngine';

/** Graphs built by the tools carry implicit hydrogens; materialise them first. */
const withH = (g: Parameters<typeof structuralFormula>[0]) => addImplicitHydrogens(g);

const strictOpts = { difficulty: 'strict' as const };
const sandboxOpts = { difficulty: 'sandbox' as const };

describe('functional groups', () => {
  it('every group converts to a graph whose attachment atom is index 0', () => {
    for (const group of GROUP_BY_ID.values()) {
      const graph = groupToGraph(group);
      expect(graph.atoms.length, group.id).toBeGreaterThan(0);
      expect(graph.atoms[0].element, group.id).toBe(group.attachment);
      // attachment atom must still have a free valence to bind the host
      const bonds = graph.bonds.filter((b) => b.a === graph.atoms[0].id || b.b === graph.atoms[0].id);
      const used = bonds.reduce((s, b) => s + b.order, 0);
      expect(used, group.id).toBeLessThan(4);
    }
  });

  it('hydroxyl and carboxyl are O–H / C(=O)O', () => {
    const hydroxyl = groupToGraph(GROUP_BY_ID.get('hydroxyl')!);
    // Hill order: hydrogen is listed first when no carbon is present.
    expect(structuralFormula(hydroxyl)).toBe('HO');
    const carboxyl = groupToGraph(GROUP_BY_ID.get('carboxyl')!);
    expect(structuralFormula(carboxyl)).toBe('CHO2');
  });
});

describe('chains and rings', () => {
  it('an n-carbon chain is C_n with n-1 bonds', () => {
    const chain = makeChain('C', 6);
    expect(chain.atoms.length).toBe(6);
    expect(chain.bonds.length).toBe(5);
    expect(structuralFormula(withH(chain))).toBe('C6H14');
  });

  it('a six-carbon aromatic ring is benzene', () => {
    const ring = makeRing('C', 6, true);
    const analysis = analyzeMolecule(ring, strictOpts);
    expect(analysis.isAromatic).toBe(true);
    expect(structuralFormula(withH(ring))).toBe('C6H6');
  });

  it('Kekulé benzene is also detected as aromatic', () => {
    const analysis = analyzeMolecule(makeKekuleBenzene(), strictOpts);
    expect(analysis.isAromatic).toBe(true);
  });

  it('a cyclopropane ring is strained but valid', () => {
    const ring = makeRing('C', 3);
    const analysis = analyzeMolecule(withH(ring), sandboxOpts);
    expect(analysis.stability.status).not.toBe('impossible');
    expect(analysis.stability.warnings.join(' ')).toMatch(/strain|angle/i);
  });
});

describe('coordination complexes', () => {
  it('hexaamminecobalt(III) is an octahedral sp3d2 complex', () => {
    const complex = makeCoordination({ metal: 'Co', ligand: 'N', count: 6, charge: 3 });
    expect(complex.atoms.filter((a) => a.element === 'N').length).toBe(6);
    expect(complex.bonds.filter((b) => b.type === 'coordinate').length).toBe(6);
    const analysis = analyzeMolecule(withH(complex), sandboxOpts);
    expect(analysis.molecularShape).toMatch(/octahedral/i);
    expect(analysis.hybridization).toBe('sp³d²');
  });

  it('every coordination count has a splitting diagram', () => {
    for (const count of [2, 4, 6]) {
      expect(COORDINATION_GEOMETRY[count].splitting.length).toBeGreaterThan(10);
    }
  });

  it('a four-coordinate complex is tetrahedral', () => {
    const complex = makeCoordination({ metal: 'Zn', ligand: 'Cl', count: 4 });
    const analysis = analyzeMolecule(withH(complex), sandboxOpts);
    expect(analysis.molecularShape).toMatch(/tetrahedral/i);
  });
});

describe('polymers', () => {
  it('polyethylene repeats the monomer', () => {
    const polymer = makePolymer('CC', 4);
    expect(polymer).not.toBeNull();
    expect(polymer!.atoms.filter((a) => a.element === 'C').length).toBe(8);
    expect(analyzeMolecule(withH(polymer!), sandboxOpts).stability.status).toBe('stable');
  });

  it('every listed monomer polymerises', () => {
    for (const monomer of MONOMERS) {
      const polymer = makePolymer(monomer.smiles, 3);
      expect(polymer, monomer.id).not.toBeNull();
      expect(polymer!.atoms.length, monomer.id).toBeGreaterThan(3);
      expect(analyzeMolecule(withH(polymer!), sandboxOpts).stability.status, monomer.id).not.toBe('impossible');
    }
  });
});

describe('quick templates parse', () => {
  const templates: [string, string][] = [
    ['water', 'O'],
    ['methane', 'C'],
    ['ammonia', 'N'],
    ['benzene', 'c1ccccc1'],
    ['ethanol', 'CCO'],
    ['glucose', 'OC1COC(O)C(O)C1O'],
  ];
  it.each(templates)('%s builds from SMILES', (_name, smiles) => {
    const graph = graphFromSmilesLite(smiles);
    expect(graph.atoms.length).toBeGreaterThan(0);
    expect(analyzeMolecule(graph, strictOpts).stability.status).not.toBe('impossible');
  });
});
