/**
 * useMoleculeStore.ts — the 3D workspace: atoms, bonds, selection, undo/redo.
 *
 * Every mutating action that changes CHEMISTRY goes through chemistryEngine
 * (`canBond`, `checkPlacement`). Rejections are returned to the caller as a BondCheck
 * so the gesture layer can toast the real chemistry reason and JARVIS can say it.
 */

import { create } from 'zustand';
import { Vector3 } from 'three';
import {
  type MoleculeGraph,
  type GraphBond,
  type BondOrder,
  type BondType,
  type BondCheck,
  type RuleOptions,
  type Difficulty,
  analyzeMolecule,
  canBond,
  checkPlacement,
  centralAtomOf,
  getBond,
  bondSumOf,
  removeAtom as removeAtomFromGraph,
  effectiveMaxValence,
} from '../chemistry/chemistryEngine';
import { getElement } from '../chemistry/elements';
import { layoutMolecule, idealBondLength, vseprDirections, layoutFragment, alignTemplate } from '../three/vsepSolver';

export interface Atom3D {
  id: string;
  element: string;
  position: [number, number, number];
  charge: number;
  /** Ghost-guide targets are locked once the player matches them. */
  locked?: boolean;
}

export interface Bond3D {
  id: string;
  a: string;
  b: string;
  order: BondOrder;
  type: BondType;
}

interface Snapshot {
  atoms: Atom3D[];
  bonds: Bond3D[];
}

export interface MoleculeState {
  atoms: Atom3D[];
  bonds: Bond3D[];
  history: Snapshot[];
  future: Snapshot[];

  selectedElement: string;
  hoveredAtomId: string | null;
  grabbedAtomId: string | null;
  selectedAtomIds: string[];
  selectedBondId: string | null;

  /** Ghost-guide: the translucent target skeleton. */
  ghost: MoleculeGraph | null;
  ghostMatches: Record<string, boolean>;

  showOrbitals: boolean;
  showLonePairs: boolean;
  showLabels: boolean;
  /** 0 = normal, 1 = fully exploded (orbitals + electrons pulled apart). */
  explode: number;

  // ---- actions ----
  setSelectedElement: (el: string) => void;
  addAtom: (element: string, position: [number, number, number], opts?: RuleOptions) => { ok: boolean; id?: string; reason?: string };
  moveAtom: (id: string, position: [number, number, number]) => void;
  nudgeAtom: (id: string, delta: [number, number, number]) => void;
  tryBond: (a: string, b: string, order?: BondOrder, type?: BondType, opts?: RuleOptions) => BondCheck;
  cycleBondOrder: (bondId: string, opts?: RuleOptions) => BondCheck;
  deleteAtom: (id: string) => void;
  deleteBond: (id: string) => void;
  setHovered: (id: string | null) => void;
  setGrabbed: (id: string | null) => void;
  selectAtom: (id: string | null, additive?: boolean) => void;
  selectBond: (id: string | null) => void;
  clearSelection: () => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  setGhost: (graph: MoleculeGraph | null) => void;
  setOrbitals: (v: boolean) => void;
  setLonePairs: (v: boolean) => void;
  setLabels: (v: boolean) => void;
  setExplode: (v: number) => void;
  loadGraph: (graph: MoleculeGraph, opts?: { keepPositions?: boolean }) => void;
  /** Attach a functional group / fragment to an existing atom. */
  attachFragment: (hostId: string, fragment: MoleculeGraph, attachIndex: number, opts?: RuleOptions) => BondCheck;
  toGraph: () => MoleculeGraph;
  /** Nearest atom to a world point (used by the raycast cursor). */
  nearestAtom: (point: [number, number, number], maxDistance?: number) => Atom3D | null;
}

let atomSeq = 0;
let bondSeq = 0;
const nextAtomId = () => `at${++atomSeq}`;
const nextBondId = () => `bd${++bondSeq}`;

const snapshot = (s: Pick<MoleculeState, 'atoms' | 'bonds'>): Snapshot => ({
  atoms: s.atoms.map((a) => ({ ...a, position: [...a.position] as [number, number, number] })),
  bonds: s.bonds.map((b) => ({ ...b })),
});

const clone = (s: Snapshot): Snapshot => snapshot(s);

export const useMoleculeStore = create<MoleculeState>((set, get) => ({
  atoms: [],
  bonds: [],
  history: [],
  future: [],
  selectedElement: 'C',
  hoveredAtomId: null,
  grabbedAtomId: null,
  selectedAtomIds: [],
  selectedBondId: null,
  ghost: null,
  ghostMatches: {},
  showOrbitals: false,
  showLonePairs: true,
  showLabels: true,
  explode: 0,

  setSelectedElement: (selectedElement) => set({ selectedElement }),

  addAtom: (element, position, opts) => {
    const state = get();
    const clash = checkPlacement(
      state.atoms.map((a) => ({ id: a.id, element: a.element, position: { x: a.position[0], y: a.position[1], z: a.position[2] } })),
      element,
      { x: position[0], y: position[1], z: position[2] },
    );
    if (!clash.ok) return { ok: false, reason: clash.reason };
    void opts;
    const id = nextAtomId();
    const atom: Atom3D = { id, element, position: [...position], charge: 0 };
    set({
      atoms: [...state.atoms, atom],
      history: [...state.history.slice(-49), clone(state)],
      future: [],
    });
    return { ok: true, id };
  },

  moveAtom: (id, position) =>
    set((s) => ({ atoms: s.atoms.map((a) => (a.id === id ? { ...a, position: [...position] } : a)) })),

  nudgeAtom: (id, delta) =>
    set((s) => ({
      atoms: s.atoms.map((a) =>
        a.id === id
          ? { ...a, position: [a.position[0] + delta[0], a.position[1] + delta[1], a.position[2] + delta[2]] }
          : a,
      ),
    })),

  tryBond: (a, b, order = 1, type = 'covalent', opts = { difficulty: 'sandbox' }) => {
    const state = get();
    const graph = state.toGraph();
    const check = canBond(graph, a, b, order, opts, type);
    if (!check.ok) return check;
    const bond: Bond3D = { id: nextBondId(), a, b, order, type };
    set({
      bonds: [...state.bonds, bond],
      history: [...state.history.slice(-49), clone(state)],
      future: [],
    });
    return { ok: true, code: 'OK', reason: '', speech: '', severity: 'warn' as const };
  },

  cycleBondOrder: (bondId, opts = { difficulty: 'sandbox' }) => {
    const state = get();
    const bond = state.bonds.find((x) => x.id === bondId);
    if (!bond) return { ok: false, code: 'MISSING_ATOM', reason: 'No such bond.', speech: '', severity: 'error' as const };
    const next = (bond.order === 1 ? 2 : bond.order === 2 ? 3 : 1) as BondOrder;
    // Validate the promoted order against the valency of BOTH atoms.
    const without: MoleculeGraph = {
      atoms: state.atoms.map((a) => ({ id: a.id, element: a.element, charge: a.charge })),
      bonds: state.bonds.filter((b) => b.id !== bondId).map((b) => ({ id: b.id, a: b.a, b: b.b, order: b.order, type: b.type })),
    };
    const check = canBond(without, bond.a, bond.b, next, opts, bond.type);
    if (!check.ok) {
      // Try to go back to single instead of refusing outright.
      if (next !== 1) {
        const retry = canBond(without, bond.a, bond.b, 1, opts, bond.type);
        if (retry.ok) {
          set({
            bonds: state.bonds.map((b) => (b.id === bondId ? { ...b, order: 1 } : b)),
            history: [...state.history.slice(-49), clone(state)],
            future: [],
          });
          return { ...retry, reason: `Reduced to a single bond — ${check.reason}` };
        }
      }
      return check;
    }
    set({
      bonds: state.bonds.map((b) => (b.id === bondId ? { ...b, order: next } : b)),
      history: [...state.history.slice(-49), clone(state)],
      future: [],
    });
    return { ok: true, code: 'OK', reason: `Bond order ${next}.`, speech: '', severity: 'warn' as const };
  },

  deleteAtom: (id) => {
    const state = get();
    set({
      atoms: state.atoms.filter((a) => a.id !== id),
      bonds: state.bonds.filter((b) => b.a !== id && b.b !== id),
      selectedAtomIds: state.selectedAtomIds.filter((x) => x !== id),
      hoveredAtomId: state.hoveredAtomId === id ? null : state.hoveredAtomId,
      grabbedAtomId: state.grabbedAtomId === id ? null : state.grabbedAtomId,
      history: [...state.history.slice(-49), clone(state)],
      future: [],
    });
  },

  deleteBond: (id) => {
    const state = get();
    set({
      bonds: state.bonds.filter((b) => b.id !== id),
      history: [...state.history.slice(-49), clone(state)],
      future: [],
    });
  },

  setHovered: (hoveredAtomId) => set({ hoveredAtomId }),
  setGrabbed: (grabbedAtomId) => set({ grabbedAtomId }),

  selectAtom: (id, additive = false) =>
    set((s) => {
      if (!id) return { selectedAtomIds: [], selectedBondId: null };
      if (!additive) return { selectedAtomIds: [id], selectedBondId: null };
      return {
        selectedAtomIds: s.selectedAtomIds.includes(id)
          ? s.selectedAtomIds.filter((x) => x !== id)
          : [...s.selectedAtomIds, id],
      };
    }),

  selectBond: (selectedBondId) => set({ selectedBondId, selectedAtomIds: [] }),

  clearSelection: () => set({ selectedAtomIds: [], selectedBondId: null }),

  clear: () => {
    const state = get();
    set({
      atoms: [],
      bonds: [],
      selectedAtomIds: [],
      selectedBondId: null,
      hoveredAtomId: null,
      grabbedAtomId: null,
      history: [...state.history.slice(-49), clone(state)],
      future: [],
    });
  },

  undo: () => {
    const state = get();
    const prev = state.history[state.history.length - 1];
    if (!prev) return;
    set({
      atoms: prev.atoms,
      bonds: prev.bonds,
      history: state.history.slice(0, -1),
      future: [clone(state), ...state.future.slice(0, 49)],
      selectedAtomIds: [],
      selectedBondId: null,
    });
  },

  redo: () => {
    const state = get();
    const next = state.future[0];
    if (!next) return;
    set({
      atoms: next.atoms,
      bonds: next.bonds,
      history: [...state.history.slice(-49), clone(state)],
      future: state.future.slice(1),
    });
  },

  setGhost: (ghost) => set({ ghost, ghostMatches: {} }),
  setOrbitals: (showOrbitals) => set({ showOrbitals }),
  setLonePairs: (showLonePairs) => set({ showLonePairs }),
  setLabels: (showLabels) => set({ showLabels }),
  setExplode: (explode) => set({ explode: Math.max(0, Math.min(1, explode)) }),

  loadGraph: (graph, opts) => {
    const state = get();
    const layout = layoutMolecule(graph);
    const atoms: Atom3D[] = graph.atoms.map((a) => ({
      id: a.id,
      element: a.element,
      charge: a.charge ?? 0,
      position: (opts?.keepPositions
        ? (state.atoms.find((x) => x.id === a.id)?.position ?? layout[a.id] ?? [0, 0, 0])
        : (layout[a.id] ?? [0, 0, 0])) as [number, number, number],
    }));
    const bonds: Bond3D[] = graph.bonds.map((b) => ({
      id: b.id ?? nextBondId(),
      a: b.a,
      b: b.b,
      order: b.order,
      type: b.type,
    }));
    set({
      atoms,
      bonds,
      history: [...state.history.slice(-49), clone(state)],
      future: [],
      selectedAtomIds: [],
      selectedBondId: null,
    });
  },

  /**
   * Snap a functional group / ring onto an existing atom. `attachIndex` is the index
   * of the fragment atom that forms the new bond (declared by FUNCTIONAL_GROUPS).
   * If the host has no free valency the whole operation is rolled back and the
   * chemistry reason is returned so JARVIS can explain it.
   */
  attachFragment: (hostId, fragment, attachIndex, opts = { difficulty: 'sandbox' }) => {
    const state = get();
    const host = state.atoms.find((a) => a.id === hostId);
    if (!host) {
      return { ok: false, code: 'MISSING_ATOM', reason: 'No host atom to attach to.', speech: '', severity: 'error' as const };
    }

    // Direction: point away from every existing substituent (VSEPR-aware).
    const hostVectors = state.bonds
      .filter((b) => b.a === hostId || b.b === hostId)
      .map((b) => {
        const other = state.atoms.find((a) => a.id === (b.a === hostId ? b.b : b.a));
        if (!other) return null;
        const dx = other.position[0] - host.position[0];
        const dy = other.position[1] - host.position[1];
        const dz = other.position[2] - host.position[2];
        const len = Math.hypot(dx, dy, dz) || 1;
        return [dx / len, dy / len, dz / len] as [number, number, number];
      })
      .filter((v): v is [number, number, number] => !!v);

    const dir = oppositeDirection(hostVectors);
    // Spread the group out along the VSEPR arrangement of the host, not in a line.
    const steric = Math.max(2, hostVectors.length + 2);
    const slots = vseprDirections(steric);
    const usedDir = alignTemplate(slots, new Vector3(dir[0], dir[1], dir[2]));

    const attachElement = fragment.atoms[attachIndex]?.element ?? 'C';
    const distance = idealBondLength(host.element, attachElement);
    const anchor: [number, number, number] = [
      host.position[0] + dir[0] * distance,
      host.position[1] + dir[1] * distance,
      host.position[2] + dir[2] * distance,
    ];

    // Remap fragment indices → fresh atom ids.
    const indexToId = new Map<number, string>();
    const newAtoms: Atom3D[] = fragment.atoms.map((a, i) => {
      const id = nextAtomId();
      indexToId.set(i, id);
      return { id, element: a.element, charge: a.charge ?? 0, position: [...anchor] as [number, number, number] };
    });
    const idToIndex = new Map(fragment.atoms.map((a, i) => [a.id, i]));
    const newBonds: Bond3D[] = fragment.bonds.map((b) => ({
      id: nextBondId(),
      a: indexToId.get(idToIndex.get(b.a) ?? 0)!,
      b: indexToId.get(idToIndex.get(b.b) ?? 0)!,
      order: b.order,
      type: b.type,
    }));

    // Place the group in 3D: the anchor, then a BFS spray using the free VSEPR slots.
    const placed = layoutFragment(fragment, attachIndex, anchor, usedDir, distance);
    newAtoms.forEach((atom, i) => {
      atom.position = placed[i] ?? anchor;
    });

    // Chemistry gate: is the host allowed another bond?
    const mergedGraph: MoleculeGraph = {
      atoms: [...state.atoms, ...newAtoms].map((a) => ({ id: a.id, element: a.element, charge: a.charge })),
      bonds: [...state.bonds, ...newBonds].map((b) => ({ id: b.id, a: b.a, b: b.b, order: b.order, type: b.type })),
    };
    const check = canBond(mergedGraph, hostId, indexToId.get(attachIndex)!, 1, opts, 'covalent');
    if (!check.ok) return check; // atoms were never committed — clean rollback

    const hostBond: Bond3D = { id: nextBondId(), a: hostId, b: indexToId.get(attachIndex)!, order: 1, type: 'covalent' };
    set({
      atoms: [...state.atoms, ...newAtoms],
      bonds: [...state.bonds, ...newBonds, hostBond],
      history: [...state.history.slice(-49), clone(state)],
      future: [],
    });
    return { ok: true, code: 'OK' as const, reason: 'Group attached.', speech: '', severity: 'warn' as const };
  },

  toGraph: () => {
    const s = get();
    return {
      atoms: s.atoms.map((a) => ({ id: a.id, element: a.element, charge: a.charge })),
      bonds: s.bonds.map((b) => ({ id: b.id, a: b.a, b: b.b, order: b.order, type: b.type })),
    };
  },

  nearestAtom: (point, maxDistance = 1.2) => {
    const s = get();
    let best: Atom3D | null = null;
    let bestDist = Infinity;
    for (const a of s.atoms) {
      const d = Math.hypot(a.position[0] - point[0], a.position[1] - point[1], a.position[2] - point[2]);
      const reach = maxDistance + getElement(a.element).covalentRadius / 200;
      if (d < reach && d < bestDist) {
        bestDist = d;
        best = a;
      }
    }
    return best;
  },
}));

/* ------------------------------------------------------------- helpers */

function addVectors(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/** Pick a direction that points away from all existing substituents. */
function oppositeDirection(vectors: [number, number, number][]): [number, number, number] {
  if (vectors.length === 0) return [0, 1, 0];
  let sx = 0, sy = 0, sz = 0;
  for (const v of vectors) {
    sx += v[0];
    sy += v[1];
    sz += v[2];
  }
  let len = Math.hypot(sx, sy, sz);
  if (len < 1e-4) {
    // perfectly symmetric (e.g. methane): pick any direction perpendicular to the first bond
    const v = vectors[0];
    const candidate: [number, number, number] = Math.abs(v[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const dot = candidate[0] * v[0] + candidate[1] * v[1] + candidate[2] * v[2];
    const perp: [number, number, number] = [candidate[0] - v[0] * dot, candidate[1] - v[1] * dot, candidate[2] - v[2] * dot];
    len = Math.hypot(perp[0], perp[1], perp[2]) || 1;
    return [perp[0] / len, perp[1] / len, perp[2] / len];
  }
  return [-sx / len, -sy / len, -sz / len];
}

/* --------------------------------------------------- derived selectors */

export interface WorkspaceAnalysis {
  formula: string;
  name: string;
  hybridization: string;
  shape: string;
  angle: string;
  sigma: number;
  pi: number;
  lonePairs: number;
  netCharge: number;
  polarity: string;
  stabilityScore: number;
  status: string;
  reason: string;
  aromatic: boolean;
  centralElement: string;
}

export function analyzeWorkspace(difficulty: Difficulty) {
  const s = useMoleculeStore.getState();
  const graph = s.toGraph();
  const a = analyzeMolecule(graph, { difficulty });
  return a;
}

/** Free valency left on an atom — used by the HUD "H to add" hint. */
export function freeValence(atomId: string, difficulty: Difficulty): number {
  const s = useMoleculeStore.getState();
  const atom = s.atoms.find((a) => a.id === atomId);
  if (!atom) return 0;
  const graph = s.toGraph();
  const used = bondSumOf(graph, atomId);
  return Math.max(0, effectiveMaxValence(atom.element, atom.charge) - used);
}

/** Does the workspace contain a bond between these two atoms already? */
export function hasBond(a: string, b: string): boolean {
  const s = useMoleculeStore.getState();
  return !!getBond(s.toGraph(), a, b);
}

export function centralAtomId(): string | null {
  const s = useMoleculeStore.getState();
  return centralAtomOf(s.toGraph())?.id ?? null;
}

export type { GraphBond };
