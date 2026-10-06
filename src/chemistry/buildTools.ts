/**
 * buildTools.ts — the §6 construction helpers.
 *
 * Every tool returns a plain `MoleculeGraph` whose atom `id`s are local, so the
 * molecule store can attach it anywhere without knowing how it was made.
 * All of these are pure functions → unit-testable.
 */

import {
  type BondOrder,
  type MoleculeGraph,
  graphFromAtoms,
  graphFromSmilesLite,
  emptyGraph,
} from './chemistryEngine';
import { FUNCTIONAL_GROUPS } from './naming';

/** Shape of one entry of `FUNCTIONAL_GROUPS` (declared without a `const` assertion,
 *  so we derive the type rather than duplicating it). */
export type FunctionalGroup = (typeof FUNCTIONAL_GROUPS)[number];

export type BuildToolId = 'atom' | 'functional' | 'chain' | 'ring' | 'coordination' | 'polymer';

/* ------------------------------------------------------------- groups */

/** Convert a FUNCTIONAL_GROUPS entry into a graph. Atom 0 is the attachment point. */
export function groupToGraph(group: FunctionalGroup): MoleculeGraph {
  return graphFromAtoms(
    group.atoms.map((a) => ({
      element: a.element,
      bonds: a.bonds.map((b) => ({ to: b.to, order: b.order as BondOrder })),
    })),
  );
}

export const GROUP_BY_ID = new Map(FUNCTIONAL_GROUPS.map((g) => [g.id, g]));

/* -------------------------------------------------------------- chains */

/**
 * Linear chain of `n` atoms of `element` (hydrogens implicit).
 * Attachment index is 0 (the first atom), so it can be grown from either end.
 */
export function makeChain(element: string, n: number, bondOrder: BondOrder = 1): MoleculeGraph {
  const g = emptyGraph();
  for (let i = 0; i < n; i++) g.atoms.push({ id: `c${i}`, element, charge: 0 });
  for (let i = 0; i + 1 < n; i++) {
    g.bonds.push({ id: `cb${i}`, a: `c${i}`, b: `c${i + 1}`, order: bondOrder, type: 'covalent' });
  }
  return g;
}

/* --------------------------------------------------------------- rings */

/** Cycloalkane / aromatic ring of size `n` (default benzene when n === 6 && C). */
export function makeRing(element: string, n: number, aromatic = false): MoleculeGraph {
  const g = emptyGraph();
  for (let i = 0; i < n; i++) g.atoms.push({ id: `r${i}`, element, charge: 0 });
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    g.bonds.push({
      id: `rb${i}`,
      a: `r${i}`,
      b: `r${j}`,
      order: aromatic ? 1 : 1,
      type: aromatic ? 'aromatic' : 'covalent',
    });
  }
  return g;
}

/** Benzene with alternating bonds written out explicitly (Kekulé fallback). */
export function makeKekuleBenzene(): MoleculeGraph {
  const g = emptyGraph();
  for (let i = 0; i < 6; i++) g.atoms.push({ id: `k${i}`, element: 'C', charge: 0 });
  for (let i = 0; i < 6; i++) {
    g.bonds.push({
      id: `kb${i}`,
      a: `k${i}`,
      b: `k${(i + 1) % 6}`,
      order: i % 2 === 0 ? 2 : 1,
      type: 'covalent',
    });
  }
  return g;
}

/* -------------------------------------------------------- coordination */

export interface CoordinationSpec {
  metal: string;
  ligand: string;
  /** 2 = linear, 4 = tetrahedral or square planar, 6 = octahedral. */
  count: 2 | 4 | 6;
  charge?: number;
  squarePlanar?: boolean;
}

/**
 * Coordination complex: `count` monodentate ligands around a metal centre.
 * Ligands are written as SMILES ("N" = ammine, "O" = aqua, "Cl" = chlorido …).
 */
export function makeCoordination(spec: CoordinationSpec): MoleculeGraph {
  const g = emptyGraph();
  g.atoms.push({ id: 'M', element: spec.metal, charge: spec.charge ?? 0 });
  for (let i = 0; i < spec.count; i++) {
    const donor = donorAtomOf(spec.ligand);
    g.atoms.push({ id: `L${i}`, element: donor, charge: 0 });
    g.bonds.push({ id: `mb${i}`, a: 'M', b: `L${i}`, order: 1, type: 'coordinate' });
    // add the ligand's remaining atoms (e.g. the H's of NH3) as a tiny branch
    const rest = ligandRemainder(spec.ligand, donor);
    rest.forEach((el, k) => {
      const id = `L${i}_${k}`;
      g.atoms.push({ id, element: el, charge: 0 });
      g.bonds.push({ id: `lb${i}_${k}`, a: `L${i}`, b: id, order: 1, type: 'covalent' });
    });
  }
  return g;
}

function donorAtomOf(ligand: string): string {
  const first = ligand.replace(/\[|\]|\(|\)|[0-9]/g, '').trim();
  if (!first) return 'N';
  if (first.length === 1) return first.toUpperCase();
  return first[0].toUpperCase() + (first[1] && first[1] === first[1].toLowerCase() ? first[1] : '');
}

function ligandRemainder(ligand: string, donor: string): string[] {
  const counts: Record<string, number> = {
    N: 3, O: donor === 'O' ? 2 : 2, Cl: 0, C: 0, S: 2, F: 0, Br: 0, I: 0, P: 3,
  };
  const n = counts[donor] ?? 0;
  return new Array(n).fill('H');
}

/** Common ligands offered by the coordination tool. */
export const LIGANDS = [
  { id: 'ammine', label: 'NH₃', smiles: 'N', name: 'ammine' },
  { id: 'aqua', label: 'H₂O', smiles: 'O', name: 'aqua' },
  { id: 'chlorido', label: 'Cl⁻', smiles: 'Cl', name: 'chlorido' },
  { id: 'cyanido', label: 'CN⁻', smiles: 'C#N', name: 'cyanido' },
  { id: 'carbonyl', label: 'CO', smiles: 'C=O', name: 'carbonyl' },
  { id: 'thiolato', label: 'SH⁻', smiles: 'S', name: 'thiolato' },
];

/** d-orbital splitting diagram values used by the coordination overlay. */
export const COORDINATION_GEOMETRY: Record<number, { geometry: string; hybridization: string; splitting: string }> = {
  2: { geometry: 'linear', hybridization: 'sp', splitting: 'd<sub>z²</sub> high, d<sub>x²−y²</sub>, d<sub>xy</sub>, d<sub>xz</sub>=d<sub>yz</sub> low' },
  4: { geometry: 'tetrahedral', hybridization: 'sp³', splitting: 'e (d<sub>z²</sub>, d<sub>x²−y²</sub>) low, t₂ (d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>) high' },
  6: { geometry: 'octahedral', hybridization: 'sp³d²', splitting: 't₂g low (d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>) … Δ<sub>o</sub> … e<sub>g</sub> high (d<sub>z²</sub>, d<sub>x²−y²</sub>)' },
};

/** Square-planar variants (d⁸ metals: Ni²⁺, Pd²⁺, Pt²⁺). */
export const SQUARE_PLANAR_METALS = ['Ni', 'Pd', 'Pt', 'Cu', 'Au'];

/* ------------------------------------------------------------ polymers */

/**
 * Repeat a monomer `units` times, joining head → tail.
 * The monomer is given as SMILES with a '*' (or the first atom) as the head.
 */
export function makePolymer(monomerSmiles: string, units: number): MoleculeGraph | null {
  try {
    // Heavy-atom skeleton only: hydrogens stay implicit until the molecule store
    // lays the chain out, otherwise the head/tail carbons would already be full
    // and the join would over-valence them.
    const monomer = graphFromSmilesLite(monomerSmiles.replace(/\*/g, ''), false);
    if (!monomer.atoms.length) return null;
    const junctions = junctionAtoms(monomer);
    if (!junctions) return null;
    const g = emptyGraph();
    let prevTail = '';
    for (let u = 0; u < units; u++) {
      const map = new Map<string, string>();
      monomer.atoms.forEach((a, i) => {
        const id = `p${u}_${i}`;
        map.set(a.id, id);
        g.atoms.push({ ...a, id });
      });
      monomer.bonds.forEach((b, i) => {
        g.bonds.push({ ...b, id: `pb${u}_${i}`, a: map.get(b.a)!, b: map.get(b.b)! });
      });
      const head = map.get(junctions.head)!;
      if (prevTail) {
        g.bonds.push({ id: `pj${u}`, a: prevTail, b: head, order: 1, type: 'covalent' });
      }
      prevTail = map.get(junctions.tail)!;
    }
    return g;
  } catch {
    return null;
  }
}

/**
 * Backbone atoms that may carry a polymer junction. Halogens and hydrogen never
 * do, so `CC(F)(F)` (PTFE) joins carbon-to-carbon instead of carbon-to-fluorine.
 */
const BACKBONE = new Set(['C', 'Si', 'N', 'P', 'B', 'S', 'O']);

function junctionAtoms(monomer: MoleculeGraph): { head: string; tail: string } | null {
  const heavy = monomer.atoms.filter((a) => a.element !== 'H');
  if (heavy.length < 2) return null;
  const head = heavy[0].id;
  const backbone = heavy.filter((a) => BACKBONE.has(a.element) && a.id !== head);
  const tailPool = backbone.length ? backbone : heavy.filter((a) => a.id !== head);
  if (!tailPool.length) return null;
  // Prefer the least-connected atom so the junction does not over-valence it.
  const sum = (id: string) =>
    monomer.bonds.reduce((acc, b) => (b.a === id || b.b === id ? acc + b.order : acc), 0);
  const tail = tailPool.reduce((best, a) => (sum(a.id) <= sum(best.id) ? a : best), tailPool[tailPool.length - 1]);
  return { head, tail: tail.id };
}

export const MONOMERS = [
  { id: 'ethene', label: 'polyethylene', smiles: 'CC' },
  { id: 'propene', label: 'polypropylene', smiles: 'CCC' },
  { id: 'styrene', label: 'polystyrene', smiles: 'CCc1ccccc1' },
  { id: 'vinylchloride', label: 'PVC', smiles: 'CCCl' },
  { id: 'tetrafluoro', label: 'PTFE', smiles: 'CC(F)(F)' },
  { id: 'glucose', label: 'cellulose', smiles: 'OC1COC(O)C(O)C1O' },
];

/* ------------------------------------------------------------- presets */

/** Everything the palette offers, in one table. */
export const BUILD_TOOLS: { id: BuildToolId; label: string; hint: string }[] = [
  { id: 'atom', label: 'Single atom', hint: 'Point, then pinch to drop an atom of the selected element' },
  { id: 'functional', label: 'Functional group', hint: 'Attach –OH, –COOH, –NH₂ … to the selected atom' },
  { id: 'chain', label: 'Carbon chain', hint: 'Pick a length and drop a saturated chain' },
  { id: 'ring', label: 'Ring builder', hint: '3–8 membered rings; 6 × C is aromatic benzene' },
  { id: 'coordination', label: 'Coordination', hint: 'Metal + 2/4/6 ligands → d-orbital splitting' },
  { id: 'polymer', label: 'Polymer', hint: 'Repeat a monomer 3–10 times' },
];

export { FUNCTIONAL_GROUPS };
