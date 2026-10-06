/**
 * elements.ts — the periodic table subset used by JARVIS LAB.
 *
 * Every entry is hand-authored from standard inorganic/organic reference data.
 * Radii are in picometres (covalent, Cordero et al. 2008 where available) and are
 * used for BOTH the 3D sphere sizing (scaled) and the steric-clash test.
 *
 * `maxValence` is the hard ceiling used by `canBond()`. For period-2 elements it
 * is the strict octet limit (C:4, N:3, O:2, F:1). For period >= 3 it is the
 * hypervalent ceiling (S:6, P:5, Cl:7 ...) because those atoms can expand.
 *
 * `allowedValences` is the *aesthetic* set of chemically sane bond counts used by
 * the stability classifier — building SF4 is "allowed but strained", SF7 is not
 * allowed at all because 7 > maxValence(S).
 */

export type ElementCategory =
  | 'nonmetal'
  | 'noble'
  | 'alkali'
  | 'alkaline'
  | 'metalloid'
  | 'post-transition'
  | 'transition'
  | 'halogen';

export interface ElementData {
  /** 1–2 letter symbol, e.g. "Cl" */
  symbol: string;
  /** Full English name */
  name: string;
  /** Atomic number */
  Z: number;
  /** IUPAC group (1..18) — 0 for lanthanides/actinides (unused here) */
  group: number;
  /** Period (1..7) — period >= 3 ⇒ may expand the octet */
  period: number;
  /** Electrons in the outer shell (group valence) */
  valenceElectrons: number;
  /** Hard ceiling on SUM of bond orders. Enforced by canBond(). */
  maxValence: number;
  /** Chemically sane bond counts — used for stability scoring, not rejection. */
  allowedValences: number[];
  /** Pauling electronegativity (0 when undefined) */
  electronegativity: number;
  /** Covalent radius in pm */
  covalentRadius: number;
  /** Van der Waals radius in pm (steric clash) */
  vdwRadius: number;
  isNobleGas: boolean;
  isMetal: boolean;
  /** Period >= 3 (and not a metal whose bonding we treat ionically) */
  canExpandOctet: boolean;
  /** e.g. Fe: [2, 3] — used by the ionic / coordination engine */
  commonOxidationStates: number[];
  category: ElementCategory;
  /** Approximate standard atomic mass (g/mol) — used for molar mass readout */
  mass: number;
  /** CPK / JARVIS palette override. Defaults to CPK_TABLE below. */
  color?: string;
}

/** Classic CPK colours, tuned slightly toward the JARVIS cyan/orange palette. */
export const CPK_COLORS: Record<string, string> = {
  H: '#f2f6ff',
  C: '#3de0c8',
  N: '#4d7cff',
  O: '#ff4d5e',
  F: '#8ef06a',
  Cl: '#5ef08a',
  Br: '#c46a3a',
  I: '#a24bd6',
  S: '#ffd93c',
  P: '#ff9d3c',
  Na: '#a97bff',
  K: '#c07bff',
  Mg: '#5effa8',
  Ca: '#7dff8a',
  Al: '#c9a7ff',
  B: '#ffb9a3',
  Be: '#8effc1',
  Si: '#d0b48a',
  Fe: '#e08a3c',
  Cu: '#e08a5e',
  Co: '#5e8aff',
  Ni: '#5ee0c0',
  Zn: '#9bb4c9',
  He: '#7ef0ff',
  Ne: '#7ec8ff',
  Ar: '#a97bff',
  Li: '#b98aff',
  Xe: '#5ec8ff',
  Kr: '#7ee0ff',
  Mn: '#ff9dbb',
  Cr: '#9dbbff',
  Ag: '#d6e4f0',
  default: '#38e8ff',
};

const E = (d: Partial<ElementData> & Pick<ElementData, 'symbol' | 'name' | 'Z' | 'group' | 'period' | 'valenceElectrons'>): ElementData => ({
  covalentRadius: 100,
  vdwRadius: 180,
  isNobleGas: false,
  isMetal: false,
  canExpandOctet: d.period >= 3 && !d.isMetal,
  commonOxidationStates: [],
  category: 'nonmetal',
  electronegativity: 2,
  maxValence: 4,
  allowedValences: [4],
  mass: d.Z * 2,
  ...d,
});

export const ELEMENT_TABLE: Record<string, ElementData> = Object.fromEntries(
  [
    E({
      symbol: 'H', name: 'Hydrogen', Z: 1, group: 1, period: 1, valenceElectrons: 1,
      maxValence: 1, allowedValences: [1], electronegativity: 2.2, covalentRadius: 31, vdwRadius: 120,
      mass: 1.008, commonOxidationStates: [1, -1],
    }),
    E({
      symbol: 'He', name: 'Helium', Z: 2, group: 18, period: 1, valenceElectrons: 2,
      maxValence: 0, allowedValences: [0], electronegativity: 0, covalentRadius: 28, vdwRadius: 140,
      isNobleGas: true, category: 'noble', mass: 4.0026,
    }),
    E({
      symbol: 'Li', name: 'Lithium', Z: 3, group: 1, period: 2, valenceElectrons: 1,
      maxValence: 1, allowedValences: [1], electronegativity: 0.98, covalentRadius: 128, vdwRadius: 182,
      isMetal: true, category: 'alkali', commonOxidationStates: [1], mass: 6.94,
    }),
    E({
      symbol: 'Be', name: 'Beryllium', Z: 4, group: 2, period: 2, valenceElectrons: 2,
      maxValence: 2, allowedValences: [2], electronegativity: 1.57, covalentRadius: 96, vdwRadius: 153,
      isMetal: true, category: 'alkaline', commonOxidationStates: [2], mass: 9.0122,
    }),
    E({
      symbol: 'B', name: 'Boron', Z: 5, group: 13, period: 2, valenceElectrons: 3,
      maxValence: 3, allowedValences: [3, 4], electronegativity: 2.04, covalentRadius: 84, vdwRadius: 192,
      category: 'metalloid', commonOxidationStates: [3], mass: 10.81,
    }),
    E({
      symbol: 'C', name: 'Carbon', Z: 6, group: 14, period: 2, valenceElectrons: 4,
      maxValence: 4, allowedValences: [4, 3, 2], electronegativity: 2.55, covalentRadius: 76, vdwRadius: 170,
      commonOxidationStates: [4, 2, -4], mass: 12.011,
    }),
    E({
      symbol: 'N', name: 'Nitrogen', Z: 7, group: 15, period: 2, valenceElectrons: 5,
      maxValence: 3, allowedValences: [3, 4, 2, 1], electronegativity: 3.04, covalentRadius: 71, vdwRadius: 155,
      commonOxidationStates: [-3, 3, 5], mass: 14.007,
    }),
    E({
      symbol: 'O', name: 'Oxygen', Z: 8, group: 16, period: 2, valenceElectrons: 6,
      maxValence: 2, allowedValences: [2, 1, 3], electronegativity: 3.44, covalentRadius: 66, vdwRadius: 152,
      commonOxidationStates: [-2, -1, 1, 2], mass: 15.999,
    }),
    E({
      symbol: 'F', name: 'Fluorine', Z: 9, group: 17, period: 2, valenceElectrons: 7,
      maxValence: 1, allowedValences: [1], electronegativity: 3.98, covalentRadius: 57, vdwRadius: 147,
      category: 'halogen', commonOxidationStates: [-1], mass: 18.998,
    }),
    E({
      symbol: 'Ne', name: 'Neon', Z: 10, group: 18, period: 2, valenceElectrons: 8,
      maxValence: 0, allowedValences: [0], electronegativity: 0, covalentRadius: 58, vdwRadius: 154,
      isNobleGas: true, category: 'noble', mass: 20.18,
    }),
    E({
      symbol: 'Na', name: 'Sodium', Z: 11, group: 1, period: 3, valenceElectrons: 1,
      maxValence: 1, allowedValences: [1], electronegativity: 0.93, covalentRadius: 166, vdwRadius: 227,
      isMetal: true, category: 'alkali', commonOxidationStates: [1], mass: 22.99,
    }),
    E({
      symbol: 'Mg', name: 'Magnesium', Z: 12, group: 2, period: 3, valenceElectrons: 2,
      maxValence: 2, allowedValences: [2], electronegativity: 1.31, covalentRadius: 141, vdwRadius: 173,
      isMetal: true, category: 'alkaline', commonOxidationStates: [2], mass: 24.305,
    }),
    E({
      symbol: 'Al', name: 'Aluminium', Z: 13, group: 13, period: 3, valenceElectrons: 3,
      maxValence: 3, allowedValences: [3, 4], electronegativity: 1.61, covalentRadius: 121, vdwRadius: 184,
      isMetal: true, category: 'post-transition', commonOxidationStates: [3], mass: 26.982,
    }),
    E({
      symbol: 'Si', name: 'Silicon', Z: 14, group: 14, period: 3, valenceElectrons: 4,
      maxValence: 4, allowedValences: [4, 6], electronegativity: 1.9, covalentRadius: 111, vdwRadius: 210,
      category: 'metalloid', commonOxidationStates: [4, -4], mass: 28.085,
    }),
    E({
      symbol: 'P', name: 'Phosphorus', Z: 15, group: 15, period: 3, valenceElectrons: 5,
      maxValence: 5, allowedValences: [3, 5], electronegativity: 2.19, covalentRadius: 107, vdwRadius: 180,
      canExpandOctet: true, commonOxidationStates: [-3, 3, 5], mass: 30.974,
    }),
    E({
      symbol: 'S', name: 'Sulfur', Z: 16, group: 16, period: 3, valenceElectrons: 6,
      maxValence: 6, allowedValences: [2, 4, 6], electronegativity: 2.58, covalentRadius: 105, vdwRadius: 180,
      canExpandOctet: true, commonOxidationStates: [-2, 4, 6], mass: 32.06,
    }),
    E({
      symbol: 'Cl', name: 'Chlorine', Z: 17, group: 17, period: 3, valenceElectrons: 7,
      maxValence: 7, allowedValences: [1, 3, 5, 7], electronegativity: 3.16, covalentRadius: 102, vdwRadius: 175,
      canExpandOctet: true, category: 'halogen', commonOxidationStates: [-1, 1, 3, 5, 7], mass: 35.45,
    }),
    E({
      symbol: 'Ar', name: 'Argon', Z: 18, group: 18, period: 3, valenceElectrons: 8,
      maxValence: 0, allowedValences: [0, 2], electronegativity: 0, covalentRadius: 106, vdwRadius: 188,
      isNobleGas: true, category: 'noble', mass: 39.948,
    }),
    E({
      symbol: 'K', name: 'Potassium', Z: 19, group: 1, period: 4, valenceElectrons: 1,
      maxValence: 1, allowedValences: [1], electronegativity: 0.82, covalentRadius: 203, vdwRadius: 275,
      isMetal: true, category: 'alkali', commonOxidationStates: [1], mass: 39.098,
    }),
    E({
      symbol: 'Ca', name: 'Calcium', Z: 20, group: 2, period: 4, valenceElectrons: 2,
      maxValence: 2, allowedValences: [2], electronegativity: 1.0, covalentRadius: 176, vdwRadius: 231,
      isMetal: true, category: 'alkaline', commonOxidationStates: [2], mass: 40.078,
    }),
    E({
      symbol: 'Cr', name: 'Chromium', Z: 24, group: 6, period: 4, valenceElectrons: 6,
      maxValence: 6, allowedValences: [2, 3, 6], electronegativity: 1.66, covalentRadius: 139, vdwRadius: 200,
      isMetal: true, category: 'transition', commonOxidationStates: [2, 3, 6], mass: 51.996,
    }),
    E({
      symbol: 'Mn', name: 'Manganese', Z: 25, group: 7, period: 4, valenceElectrons: 7,
      maxValence: 7, allowedValences: [2, 4, 7], electronegativity: 1.55, covalentRadius: 139, vdwRadius: 200,
      isMetal: true, category: 'transition', commonOxidationStates: [2, 4, 7], mass: 54.938,
    }),
    E({
      symbol: 'Fe', name: 'Iron', Z: 26, group: 8, period: 4, valenceElectrons: 8,
      maxValence: 6, allowedValences: [2, 3, 6], electronegativity: 1.83, covalentRadius: 132, vdwRadius: 204,
      isMetal: true, category: 'transition', commonOxidationStates: [2, 3], mass: 55.845,
    }),
    E({
      symbol: 'Co', name: 'Cobalt', Z: 27, group: 9, period: 4, valenceElectrons: 9,
      maxValence: 6, allowedValences: [2, 3, 6], electronegativity: 1.88, covalentRadius: 126, vdwRadius: 200,
      isMetal: true, category: 'transition', commonOxidationStates: [2, 3], mass: 58.933,
    }),
    E({
      symbol: 'Ni', name: 'Nickel', Z: 28, group: 10, period: 4, valenceElectrons: 10,
      maxValence: 6, allowedValences: [2, 4], electronegativity: 1.91, covalentRadius: 124, vdwRadius: 197,
      isMetal: true, category: 'transition', commonOxidationStates: [2], mass: 58.693,
    }),
    E({
      symbol: 'Cu', name: 'Copper', Z: 29, group: 11, period: 4, valenceElectrons: 11,
      maxValence: 6, allowedValences: [1, 2, 4], electronegativity: 1.9, covalentRadius: 132, vdwRadius: 196,
      isMetal: true, category: 'transition', commonOxidationStates: [1, 2], mass: 63.546,
    }),
    E({
      symbol: 'Zn', name: 'Zinc', Z: 30, group: 12, period: 4, valenceElectrons: 12,
      maxValence: 6, allowedValences: [2, 4], electronegativity: 1.65, covalentRadius: 122, vdwRadius: 201,
      isMetal: true, category: 'transition', commonOxidationStates: [2], mass: 65.38,
    }),
    E({
      symbol: 'Br', name: 'Bromine', Z: 35, group: 17, period: 4, valenceElectrons: 7,
      maxValence: 7, allowedValences: [1, 3, 5, 7], electronegativity: 2.96, covalentRadius: 120, vdwRadius: 185,
      canExpandOctet: true, category: 'halogen', commonOxidationStates: [-1, 1, 3, 5], mass: 79.904,
    }),
    E({
      symbol: 'Ag', name: 'Silver', Z: 47, group: 11, period: 5, valenceElectrons: 11,
      maxValence: 6, allowedValences: [1, 2, 4], electronegativity: 1.93, covalentRadius: 145, vdwRadius: 210,
      isMetal: true, category: 'transition', commonOxidationStates: [1], mass: 107.87,
    }),
    E({
      symbol: 'I', name: 'Iodine', Z: 53, group: 17, period: 5, valenceElectrons: 7,
      maxValence: 7, allowedValences: [1, 3, 5, 7], electronegativity: 2.66, covalentRadius: 139, vdwRadius: 198,
      canExpandOctet: true, category: 'halogen', commonOxidationStates: [-1, 1, 3, 5, 7], mass: 126.9,
    }),
    E({
      symbol: 'Xe', name: 'Xenon', Z: 54, group: 18, period: 5, valenceElectrons: 8,
      maxValence: 8, allowedValences: [2, 4, 6, 8], electronegativity: 2.6, covalentRadius: 140, vdwRadius: 216,
      isNobleGas: true, category: 'noble', canExpandOctet: true, commonOxidationStates: [2, 4, 6], mass: 131.29,
    }),
    E({
      symbol: 'Kr', name: 'Krypton', Z: 36, group: 18, period: 4, valenceElectrons: 8,
      maxValence: 6, allowedValences: [2, 4, 6], electronegativity: 3.0, covalentRadius: 116, vdwRadius: 202,
      isNobleGas: true, category: 'noble', canExpandOctet: true, commonOxidationStates: [2, 4], mass: 83.798,
    }),
  ].map((e) => [e.symbol, e]),
);

/** The 25 elements exposed in the default atom palette (spec §4). */
export const PALETTE_ELEMENTS = [
  'H', 'C', 'N', 'O', 'F', 'Cl', 'Br', 'I', 'S', 'P', 'Na', 'K', 'Mg', 'Ca',
  'Al', 'B', 'Be', 'Si', 'Fe', 'Cu', 'Co', 'Ni', 'Zn', 'He', 'Ne', 'Ar',
] as const;

/** Extra elements unlocked in ADVANCED / SANDBOX (noble-gas & coordination chemistry). */
export const EXTENDED_ELEMENTS = ['Li', 'Xe', 'Kr', 'Cr', 'Mn', 'Ag'] as const;

export function getElement(symbol: string): ElementData {
  const el = ELEMENT_TABLE[symbol];
  if (!el) throw new Error(`Unknown element: ${symbol}`);
  return el;
}

export function elementColor(symbol: string): string {
  return getElement(symbol).color ?? CPK_COLORS[symbol] ?? CPK_COLORS.default;
}

/** Sphere radius in world units (1 unit ≈ 1 Å) for rendering. */
export function renderRadius(symbol: string, scale = 0.34): number {
  return (getElement(symbol).covalentRadius / 100) * scale;
}

export const ALL_SYMBOLS = Object.keys(ELEMENT_TABLE);

/**
 * Effective valence ceiling for an atom, taking its formal charge into account.
 * N is allowed 4 bonds only when it carries a +1 charge (ammonium), O is allowed
 * 3 when +1 (oxonium), C never exceeds 4.
 */
export function effectiveMaxValence(symbol: string, charge = 0): number {
  const el = getElement(symbol);
  if (charge > 0) return el.maxValence + charge;
  if (charge < 0) return Math.max(1, el.maxValence + charge); // O⁻ makes 1 bond, N⁻ makes 2
  return el.maxValence;
}

/** Maximum valence-shell electrons the atom may hold (duet for H/He, octet, or expanded). */
export function octetLimit(symbol: string): number {
  const el = getElement(symbol);
  if (el.period === 1) return 2;
  if (el.canExpandOctet) return el.maxValence * 2; // S:12, P:10, Cl:14, Xe:16
  return 8;
}
