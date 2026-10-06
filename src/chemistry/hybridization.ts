/**
 * hybridization.ts — steric number → hybrid orbital, electron geometry,
 * VSEPR molecular shape and ideal bond angle (spec §5h, §5g).
 *
 * AXE method:  A = central atom, X = σ-bonded neighbours, E = lone pairs.
 * stericNumber = X + E  ⇒  2:sp 3:sp² 4:sp³ 5:sp³d 6:sp³d² 7:sp³d³
 *
 * Lone pairs compress bond angles (E–E repulsion > E–X > X–X), so the reported
 * angle is the *ideal* angle minus the standard empirical compression.
 */

export type Hybridization = 's' | 'p' | 'sp' | 'sp2' | 'sp3' | 'sp3d' | 'sp3d2' | 'sp3d3' | 'd2sp3' | 'none';

export interface HybridizationInfo {
  /** Steric number (σ bonds + lone pairs) */
  stericNumber: number;
  hybridization: Hybridization;
  /** Pretty label, e.g. "sp²" */
  label: string;
  electronGeometry: string;
  molecularShape: string;
  /** Ideal bond angle in degrees for the dominant geometry */
  angle: number;
  /** Human readable angle, e.g. "109.5° (compressed to ~107°)" */
  angleLabel: string;
  /** Number of hybrid orbitals and their composition, for Orbital Mode */
  orbitals: { count: number; composition: string; geometry: string }[];
  /** Unhybridised p orbitals left over (π bonding) */
  freeP: number;
}

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶' };

export function superscript(n: number | string): string {
  return String(n).split('').map((c) => SUP[c] ?? c).join('');
}

export function hybridLabel(h: Hybridization): string {
  switch (h) {
    case 'sp': return 'sp';
    case 'sp2': return `sp${superscript(2)}`;
    case 'sp3': return `sp${superscript(3)}`;
    case 'sp3d': return `sp${superscript(3)}d`;
    case 'sp3d2': return `sp${superscript(3)}d${superscript(2)}`;
    case 'sp3d3': return `sp${superscript(3)}d${superscript(3)}`;
    case 'd2sp3': return `d${superscript(2)}sp${superscript(3)}`;
    case 's': return 's';
    case 'p': return 'p';
    default: return '—';
  }
}

/** stericNumber → hybrid orbital set. */
export function hybridizationFor(stericNumber: number): Hybridization {
  switch (stericNumber) {
    case 2: return 'sp';
    case 3: return 'sp2';
    case 4: return 'sp3';
    case 5: return 'sp3d';
    case 6: return 'sp3d2';
    case 7: return 'sp3d3';
    case 1: return 's';
    default: return 'none';
  }
}

const ELECTRON_GEOMETRY: Record<number, string> = {
  1: 'terminal (no geometry)',
  2: 'linear',
  3: 'trigonal planar',
  4: 'tetrahedral',
  5: 'trigonal bipyramidal',
  6: 'octahedral',
  7: 'pentagonal bipyramidal',
};

/** Molecular shape from AXnEm. `n` = σ bonds, `m` = lone pairs. */
export function molecularShape(n: number, m: number): { shape: string; angle: number; angleLabel: string } {
  const steric = n + m;
  switch (steric) {
    case 1:
      return { shape: 'terminal / diatomic', angle: 180, angleLabel: 'n/a (terminal atom)' };
    case 2:
      return { shape: 'linear', angle: 180, angleLabel: '180°' };
    case 3:
      if (m === 0) return { shape: 'trigonal planar', angle: 120, angleLabel: '120°' };
      return { shape: 'bent (V-shaped)', angle: 118, angleLabel: '~118° (compressed from 120°)' };
    case 4:
      if (m === 0) return { shape: 'tetrahedral', angle: 109.5, angleLabel: '109.5°' };
      if (m === 1) return { shape: 'trigonal pyramidal', angle: 107, angleLabel: '~107° (compressed from 109.5°)' };
      return { shape: 'bent (V-shaped)', angle: 104.5, angleLabel: '~104.5° (two lone pairs)' };
    case 5: {
      // Trigonal bipyramidal family. Lone pairs occupy equatorial sites.
      if (m === 0) return { shape: 'trigonal bipyramidal', angle: 90, angleLabel: '90° / 120°' };
      if (m === 1) return { shape: 'see-saw (disphenoidal)', angle: 90, angleLabel: '~90° / ~117°' };
      if (m === 2) return { shape: 'T-shaped', angle: 90, angleLabel: '~90°' };
      return { shape: 'linear', angle: 180, angleLabel: '180°' };
    }
    case 6: {
      if (m === 0) return { shape: 'octahedral', angle: 90, angleLabel: '90°' };
      if (m === 1) return { shape: 'square pyramidal', angle: 90, angleLabel: '~90°' };
      return { shape: 'square planar', angle: 90, angleLabel: '90°' };
    }
    case 7:
      return { shape: 'pentagonal bipyramidal', angle: 72, angleLabel: '72° / 90°' };
    default:
      return { shape: 'undefined', angle: 0, angleLabel: '—' };
  }
}

/** Hybrid orbital composition, used by the orbital renderer and the explanation card. */
function orbitalSet(h: Hybridization, stericNumber: number): { count: number; composition: string; geometry: string }[] {
  switch (h) {
    case 's': return [{ count: 1, composition: 's (100%)', geometry: 'sphere' }];
    case 'p': return [{ count: 3, composition: 'p (100%)', geometry: 'dumbbell, mutually perpendicular' }];
    case 'sp': return [{ count: 2, composition: 's 50% + p 50%', geometry: 'linear, 180° apart' }];
    case 'sp2': return [{ count: 3, composition: 's 33% + p 67%', geometry: 'trigonal planar, 120° apart' }];
    case 'sp3': return [{ count: 4, composition: 's 25% + p 75%', geometry: 'tetrahedral, 109.5° apart' }];
    case 'sp3d': return [{ count: 5, composition: 's 20% + p 60% + d 20%', geometry: 'trigonal bipyramidal' }];
    case 'sp3d2':
    case 'd2sp3':
      return [{ count: 6, composition: 's 17% + p 50% + d 33%', geometry: 'octahedral, 90° apart' }];
    case 'sp3d3': return [{ count: 7, composition: 's 14% + p 43% + d 43%', geometry: 'pentagonal bipyramidal' }];
    default: return [];
  }
}

/** Full hybridization report for one atom. */
export function analyzeHybridization(sigmaBonds: number, lonePairCount: number, piBonds = 0): HybridizationInfo {
  const stericNumber = Math.max(1, Math.round(sigmaBonds + lonePairCount));
  const h = hybridizationFor(stericNumber);
  const { shape, angle, angleLabel } = molecularShape(sigmaBonds, lonePairCount);
  // Free p orbitals = (number of p orbitals available) − (p orbitals consumed by hybrids)
  const pUsed = stericNumber <= 4 ? Math.max(0, stericNumber - 1) : 3;
  const freeP = Math.max(0, 3 - pUsed);
  return {
    stericNumber,
    hybridization: h,
    label: hybridLabel(h),
    electronGeometry: ELECTRON_GEOMETRY[stericNumber] ?? 'undefined',
    molecularShape: shape,
    angle,
    angleLabel,
    orbitals: orbitalSet(h, stericNumber),
    freeP: Math.max(freeP, piBonds > 0 && freeP === 0 ? 1 : freeP),
  };
}

/**
 * Unit vectors for `n` substituent directions in a VSEPR arrangement, centred on
 * the origin. Used by `vsepSolver.ts` to place atoms before relaxation.
 * Lone-pair slots are included so the solver can "reserve" them.
 */
export function vseprDirections(stericNumber: number): [number, number, number][] {
  switch (stericNumber) {
    case 1: return [[0, 1, 0]];
    case 2: return [[0, 1, 0], [0, -1, 0]];
    case 3: {
      // trigonal planar in the XY plane
      return [0, 1, 2].map((i) => {
        const a = (i * 2 * Math.PI) / 3 + Math.PI / 2;
        return [Math.cos(a), Math.sin(a), 0] as [number, number, number];
      });
    }
    case 4: {
      // tetrahedron
      const s = 1 / Math.sqrt(3);
      return [[s, s, s], [-s, -s, s], [-s, s, -s], [s, -s, -s]];
    }
    case 5: {
      // trigonal bipyramidal: 2 axial + 3 equatorial
      return [
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-0.5, 0, Math.sqrt(3) / 2],
        [-0.5, 0, -Math.sqrt(3) / 2],
      ];
    }
    case 6: {
      // octahedral
      return [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    }
    default: {
      // Fibonacci sphere fallback for 7+
      const n = stericNumber;
      const pts: [number, number, number][] = [];
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const th = phi * i;
        pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
      }
      return pts;
    }
  }
}

/**
 * Which slots in a trigonal-bipyramidal arrangement are equatorial (indices 2,3,4 in
 * `vseprDirections(5)`). Lone pairs prefer these — that is why SF4 is see-saw and
 * ClF3 is T-shaped rather than the alternatives.
 */
export const EQUATORIAL_SLOTS_5 = [2, 3, 4];

/**
 * Order in which substituent slots are filled for a given steric number, so lone
 * pairs land in the least-crowded sites.
 */
export function slotPriority(stericNumber: number, lonePairs: number): number[] {
  const all = [...Array(stericNumber).keys()];
  if (stericNumber === 5 && lonePairs > 0) {
    // equatorial first for the lone pairs, axial last
    return [...EQUATORIAL_SLOTS_5, 0, 1];
  }
  if (stericNumber === 6 && lonePairs === 2) {
    // trans axial sites → square planar
    return [2, 3, 4, 5, 0, 1];
  }
  return all;
}
