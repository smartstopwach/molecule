/**
 * vsepSolver.ts — 3D geometry from connectivity (spec §4, §5h).
 *
 * Two stages:
 *   1. CONSTRUCTIVE — walk the molecular graph breadth-first and give every atom a
 *      starting position using the real VSEPR arrangement of its steric number
 *      (sp slots 180°, sp² 120°, sp³ 109.5°, sp³d, sp³d² …), rotated so that the
 *      bond back to the parent occupies one slot and lone pairs take the
 *      least-crowded ones (equatorial in a trigonal bipyramid, trans in an
 *      octahedron).
 *   2. RELAXATION — a small force field:
 *        · bond springs to the ideal covalent distance (r_A + r_B)
 *        · angle springs: atoms sharing a centre are pushed toward the distance
 *          implied by the ideal angle (law of cosines)
 *        · soft repulsion between everything else so branches never interpenetrate
 *      Aromatic rings get a flatness constraint plus the correct 1.39 Å ring bonds.
 *
 * Units: 1 world unit = 1 Å. Radii come from elements.ts (covalent radii in pm).
 */

import { Vector3, Quaternion } from 'three';
import {
  type MoleculeGraph,
  centralAtomOf,
  neighboursOf,
  bondSumOf,
  findRings,
} from '../chemistry/chemistryEngine';
import { getElement } from '../chemistry/elements';
import { analyzeHybridization, vseprDirections, slotPriority } from '../chemistry/hybridization';
import { lonePairs } from '../chemistry/formalCharge';

/** Covalent radii in Å (vdW-free) — a C–C single bond is ~1.54 Å. */
export function covalentRadiusA(symbol: string): number {
  return getElement(symbol).covalentRadius / 100;
}

/** Ideal bond length from covalent radii, with aromatic bonds shortened. */
export function idealBondLength(a: string, b: string, order = 1, aromatic = false): number {
  const base = covalentRadiusA(a) + covalentRadiusA(b);
  if (aromatic) return Math.min(base * 0.93, 1.4);
  if (order === 2) return base * 0.87;
  if (order === 3) return base * 0.78;
  return base;
}

/** Re-exported for the store (keeps imports tidy). */
export { vseprDirections };

export type Positions = Record<string, [number, number, number]>;

export interface LayoutOptions {
  iterations?: number;
  /** Keep the root atom at the origin. */
  anchorRoot?: boolean;
}

const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpC = new Vector3();
const q = new Quaternion();

/**
 * Rotate a VSEPR template so that one of its slots points along `target`.
 * Used to hang a substituent off a parent without breaking the ideal angles.
 */
export function alignTemplate(template: [number, number, number][], target: Vector3): Vector3[] {
  const dirs = template.map((d) => new Vector3(d[0], d[1], d[2]).normalize());
  let bestIndex = 0;
  let bestDot = -Infinity;
  dirs.forEach((d, i) => {
    const dot = d.dot(target);
    if (dot > bestDot) {
      bestDot = dot;
      bestIndex = i;
    }
  });
  q.setFromUnitVectors(dirs[bestIndex], target.clone().normalize());
  return dirs.map((d) => d.clone().applyQuaternion(q));
}

/** Steric number (σ bonds + lone pairs) of an atom in a graph. */
export function stericNumberOf(g: MoleculeGraph, id: string): number {
  const atom = g.atoms.find((a) => a.id === id);
  if (!atom) return 4;
  const sigma = neighboursOf(g, id).length;
  const lp = Math.max(0, lonePairs(atom.element, bondSumOf(g, id), atom.charge ?? 0));
  return Math.min(7, Math.max(2, Math.round(sigma + lp)));
}

/** The ideal angle (radians) between two substituents on `id`. */
export function idealAngleOf(g: MoleculeGraph, id: string): number {
  const atom = g.atoms.find((a) => a.id === id);
  if (!atom) return Math.PI * 109.5 / 180;
  const sigma = neighboursOf(g, id).length;
  const lp = Math.max(0, lonePairs(atom.element, bondSumOf(g, id), atom.charge ?? 0));
  return (analyzeHybridization(sigma, lp).angle * Math.PI) / 180;
}

/* ------------------------------------------------------------ main entry */

export function layoutMolecule(
  g: MoleculeGraph,
  seed?: Positions,
  opts: LayoutOptions = {},
): Positions {
  if (g.atoms.length === 0) return {};
  const iterations = opts.iterations ?? 260;
  const pos = new Map<string, Vector3>();

  // ---- 1. constructive placement --------------------------------------
  const root = centralAtomOf(g) ?? g.atoms[0];
  pos.set(root.id, seed?.[root.id] ? new Vector3(...seed[root.id]) : new Vector3(0, 0, 0));

  const visited = new Set<string>([root.id]);
  const queue: { id: string; parent: string | null; dir: Vector3 | null }[] = [
    { id: root.id, parent: null, dir: null },
  ];

  while (queue.length) {
    const node = queue.shift()!;
    const children = neighboursOf(g, node.id).filter((n) => !visited.has(n));
    if (children.length === 0) continue;

    const steric = Math.max(children.length + (node.parent ? 1 : 0), stericNumberOf(g, node.id));
    const template = vseprDirections(Math.min(7, Math.max(2, steric)));
    const priority = slotPriority(template.length, steric - children.length - (node.parent ? 1 : 0));
    let slots: Vector3[];

    if (node.parent && node.dir) {
      const away = node.dir.clone().negate(); // direction back toward the parent
      slots = alignTemplate(template, away);
    } else {
      slots = template.map((d) => new Vector3(d[0], d[1], d[2]).normalize());
    }

    // Use the slots that are NOT pointing back at the parent.
    let slotIndex = 0;
    const ordered = priority.length === template.length ? priority : [...template.keys()];
    const available = ordered.filter((i) => {
      if (!node.dir) return true;
      return slots[i].dot(node.dir.clone().negate()) < 0.92;
    });
    if (available.length < children.length) {
      for (let i = 0; i < template.length; i++) if (!available.includes(i)) available.push(i);
    }

    const parentPos = pos.get(node.id)!;
    for (const child of children) {
      const slot = slots[available[slotIndex % available.length] ?? slotIndex % slots.length];
      slotIndex++;
      const bond = g.bonds.find(
        (b) => (b.a === node.id && b.b === child) || (b.b === node.id && b.a === child),
      );
      const childEl = g.atoms.find((a) => a.id === child)!.element;
      const nodeEl = g.atoms.find((a) => a.id === node.id)!.element;
      const len = idealBondLength(nodeEl, childEl, bond?.order ?? 1, bond?.type === 'aromatic');
      const p = parentPos.clone().addScaledVector(slot.clone().normalize(), len);
      pos.set(child, seed?.[child] ? new Vector3(...seed[child]) : p);
      visited.add(child);
      queue.push({ id: child, parent: node.id, dir: slot.clone().normalize() });
    }
  }

  // Rings never close on the first pass — give ring members a planar seed.
  const rings = findRings(g, 7);
  for (const ring of rings) {
    seedRing(g, ring, pos);
  }

  // ---- 2. relaxation ---------------------------------------------------
  const bondList = g.bonds.map((b) => {
    const A = g.atoms.find((a) => a.id === b.a)!;
    const B = g.atoms.find((a) => a.id === b.b)!;
    return {
      a: b.a,
      b: b.b,
      ideal: idealBondLength(A.element, B.element, b.order, b.type === 'aromatic'),
      k: b.type === 'aromatic' ? 0.55 : 0.5,
    };
  });

  const angleTriples: { a: string; b: string; c: string; ideal: number }[] = [];
  const neighbourMap = new Map<string, string[]>();
  for (const atom of g.atoms) neighbourMap.set(atom.id, neighboursOf(g, atom.id));
  for (const [centre, nbrs] of neighbourMap) {
    const theta = idealAngleOf(g, centre);
    for (let i = 0; i < nbrs.length; i++) {
      for (let j = i + 1; j < nbrs.length; j++) {
        const l1 = bondList.find((b) => (b.a === centre && b.b === nbrs[i]) || (b.b === centre && b.a === nbrs[i]))?.ideal ?? 1.5;
        const l2 = bondList.find((b) => (b.a === centre && b.b === nbrs[j]) || (b.b === centre && b.a === nbrs[j]))?.ideal ?? 1.5;
        const d = Math.sqrt(l1 * l1 + l2 * l2 - 2 * l1 * l2 * Math.cos(theta));
        angleTriples.push({ a: nbrs[i], b: centre, c: nbrs[j], ideal: d });
      }
    }
  }

  // Planarity constraints for aromatic rings.
  const planarSets = rings
    .filter((r) => r.length >= 5 && r.every((id) => (neighbourMap.get(id)?.length ?? 0) <= 3))
    .filter((r) => g.bonds.filter((b) => r.includes(b.a) && r.includes(b.b) && (b.order >= 2 || b.type === 'aromatic')).length >= r.length - 1);

  const ids = g.atoms.map((a) => a.id);
  const step = 0.45;
  for (let iter = 0; iter < iterations; iter++) {
    const force = new Map<string, Vector3>();
    for (const id of ids) force.set(id, new Vector3());

    // bond springs
    for (const b of bondList) {
      const pa = pos.get(b.a)!;
      const pb = pos.get(b.b)!;
      tmpA.copy(pb).sub(pa);
      const d = tmpA.length() || 1e-6;
      const f = ((d - b.ideal) / d) * b.k;
      force.get(b.a)!.addScaledVector(tmpA, f);
      force.get(b.b)!.addScaledVector(tmpA, -f);
    }

    // angle springs (via the 1–3 distance)
    for (const t of angleTriples) {
      const pa = pos.get(t.a)!;
      const pc = pos.get(t.c)!;
      tmpB.copy(pc).sub(pa);
      const d = tmpB.length() || 1e-6;
      const f = ((d - t.ideal) / d) * 0.22;
      force.get(t.a)!.addScaledVector(tmpB, f);
      force.get(t.c)!.addScaledVector(tmpB, -f);
    }

    // soft repulsion between non-bonded atoms
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const ia = ids[i];
        const ib = ids[j];
        if (neighbourMap.get(ia)?.includes(ib)) continue;
        tmpC.copy(pos.get(ib)!).sub(pos.get(ia)!);
        const d = tmpC.length() || 1e-6;
        const minD = (covalentRadiusA(elOf(g, ia)) + covalentRadiusA(elOf(g, ib))) * 1.9;
        if (d < minD) {
          const f = ((d - minD) / d) * 0.18;
          force.get(ia)!.addScaledVector(tmpC, f);
          force.get(ib)!.addScaledVector(tmpC, -f);
        }
      }
    }

    // aromatic planarity: pull every ring atom toward the ring's best-fit plane
    for (const ring of planarSets) {
      const centroid = new Vector3();
      for (const id of ring) centroid.add(pos.get(id)!);
      centroid.divideScalar(ring.length);
      // normal via Newell's method
      const normal = new Vector3();
      for (let i = 0; i < ring.length; i++) {
        const p1 = pos.get(ring[i])!.clone().sub(centroid);
        const p2 = pos.get(ring[(i + 1) % ring.length])!.clone().sub(centroid);
        normal.x += (p1.y - p2.y) * (p1.z + p2.z);
        normal.y += (p1.z - p2.z) * (p1.x + p2.x);
        normal.z += (p1.x - p2.x) * (p1.y + p2.y);
      }
      if (normal.lengthSq() < 1e-8) continue;
      normal.normalize();
      for (const id of ring) {
        const v = pos.get(id)!.clone().sub(centroid);
        const off = v.dot(normal);
        force.get(id)!.addScaledVector(normal, -off * 0.35);
      }
    }

    // integrate
    for (const id of ids) {
      pos.get(id)!.addScaledVector(force.get(id)!, step);
    }
  }

  // centre the molecule on the origin
  if (opts.anchorRoot !== false) {
    const centroid = new Vector3();
    for (const id of ids) centroid.add(pos.get(id)!);
    centroid.divideScalar(Math.max(1, ids.length));
    for (const id of ids) pos.get(id)!.sub(centroid);
  }

  const out: Positions = {};
  for (const [id, v] of pos) out[id] = [v.x, v.y, v.z];
  return out;
}

function elOf(g: MoleculeGraph, id: string): string {
  return g.atoms.find((a) => a.id === id)?.element ?? 'C';
}

/** Give a ring a flat, regular polygon starting position. */
function seedRing(g: MoleculeGraph, ring: string[], pos: Map<string, Vector3>): void {
  const n = ring.length;
  const seen = ring.filter((id) => pos.has(id));
  if (seen.length === n) return; // already placed (rare)
  // Build the regular polygon in a plane, then fit it to the atoms already placed.
  const radius = (1.4 * n) / (2 * Math.PI);
  const pts: Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push(new Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  // If some ring atoms already have positions, translate the polygon to their centroid.
  if (seen.length) {
    const target = new Vector3();
    for (const id of seen) target.add(pos.get(id)!);
    target.divideScalar(seen.length);
    const source = new Vector3();
    seen.forEach((id) => source.add(pts[ring.indexOf(id)]));
    source.divideScalar(seen.length);
    const delta = target.sub(source);
    pts.forEach((p) => p.add(delta));
  }
  ring.forEach((id, i) => {
    if (!pos.has(id)) pos.set(id, pts[i].clone());
  });
  void g;
}

/**
 * Place a functional group (or any small fragment) around an anchor point.
 * `slots` are the free VSEPR directions around the host, already rotated.
 */
export function layoutFragment(
  fragment: MoleculeGraph,
  attachIndex: number,
  anchor: [number, number, number],
  slots: Vector3[],
  bondLength: number,
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const idToIndex = new Map(fragment.atoms.map((a, i) => [a.id, i] as const));
  const placed = new Map<number, Vector3>();
  const anchorVec = new Vector3(...anchor);
  placed.set(attachIndex, anchorVec.clone());

  const queue: number[] = [attachIndex];
  const visited = new Set<number>([attachIndex]);
  let slotCursor = 0;
  while (queue.length) {
    const idx = queue.shift()!;
    const atomId = fragment.atoms[idx].id;
    const children = neighboursOf(fragment, atomId)
      .map((n) => idToIndex.get(n))
      .filter((i): i is number => i !== undefined && !visited.has(i));
    for (const child of children) {
      const bond = fragment.bonds.find(
        (b) => (b.a === atomId && b.b === fragment.atoms[child].id) || (b.b === atomId && b.a === fragment.atoms[child].id),
      );
      const len = idealBondLength(
        fragment.atoms[idx].element,
        fragment.atoms[child].element,
        bond?.order ?? 1,
        bond?.type === 'aromatic',
      );
      const parentPos = placed.get(idx)!;
      // Substituents fan out along the host's remaining VSEPR slots, then fall back
      // to a perpendicular spray so groups never stack on top of each other.
      const dir =
        idx === attachIndex
          ? (slots[slotCursor++ % slots.length] ?? new Vector3(0, 1, 0)).clone().normalize()
          : perpendicularTo(parentPos.clone().sub(anchorVec).normalize(), slotCursor++);
      placed.set(child, parentPos.clone().addScaledVector(dir, len));
      visited.add(child);
      queue.push(child);
    }
  }
  void bondLength;
  for (let i = 0; i < fragment.atoms.length; i++) {
    const p = placed.get(i) ?? anchorVec.clone();
    positions.push([p.x, p.y, p.z]);
  }
  return positions;
}

function perpendicularTo(v: Vector3, seed: number): Vector3 {
  if (v.lengthSq() < 1e-8) return new Vector3(0, 1, 0);
  const helper = Math.abs(v.y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
  const a = new Vector3().crossVectors(v, helper).normalize();
  const b = new Vector3().crossVectors(v, a).normalize();
  const angle = (seed * 2.399963) % (Math.PI * 2);
  return a.multiplyScalar(Math.cos(angle)).add(b.multiplyScalar(Math.sin(angle))).normalize();
}
