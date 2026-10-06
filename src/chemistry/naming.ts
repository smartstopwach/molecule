/**
 * naming.ts — live IUPAC-ish naming (spec §5, §6).
 *
 * Strategy:
 *   1. Exact match against knownMolecules.json (common name + true IUPAC name).
 *   2. Otherwise generate a systematic name:
 *        • inorganic → binary ionic / binary covalent / acid / hydride rules
 *        • organic   → longest chain, principal functional group suffix,
 *                      substituent prefixes, lowest-locant set, alphabetical order
 *   3. Fallback: Hill formula + "unclassified".
 *
 * This is deliberately a *teaching* namer, not a full IUPAC implementation: it
 * handles straight chains, simple branches, rings, the common functional groups
 * and the aromatic names that appear in the campaign. Anything it cannot parse
 * degrades to the formula instead of guessing something wrong.
 */

import { getElement } from './elements';
import {
  type MoleculeGraph,
  type BondOrder,
  atomById,
  neighboursOf,
  getBond,
  findRings,
  countFragments,
} from './chemistryEngine';

const ALKANE = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec', 'undec', 'dodec'];
const PREFIX = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca'];
const GREEK: Record<number, string> = { 1: 'mono', 2: 'di', 3: 'tri', 4: 'tetra', 5: 'penta', 6: 'hexa' };

const ROMAN: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };

export interface NamingResult {
  /** Display name (common name when known, else systematic). */
  name: string;
  iupac: string;
  /** How confident we are — the HUD dims low-confidence names. */
  confidence: 'exact' | 'systematic' | 'formula';
}

/* ------------------------------------------------------------ utilities */

const elemOf = (g: MoleculeGraph, id: string) => atomById(g, id)!.element;

function degree(g: MoleculeGraph, id: string): number {
  return neighboursOf(g, id).length;
}

function orderBetween(g: MoleculeGraph, a: string, b: string): number {
  const bond = getBond(g, a, b);
  if (!bond) return 0;
  return bond.type === 'aromatic' ? 1.5 : bond.order;
}

/* --------------------------------------------------------- inorganic (§) */

function anionName(symbol: string): string {
  const map: Record<string, string> = {
    H: 'hydride', F: 'fluoride', Cl: 'chloride', Br: 'bromide', I: 'iodide',
    O: 'oxide', S: 'sulfide', N: 'nitride', P: 'phosphide', C: 'carbide',
  };
  return map[symbol] ?? `${getElement(symbol).name.toLowerCase()}ide`;
}

/** True when the molecule contains a carbon bonded to H or C — i.e. it is organic. */
function hasOrganicCarbon(g: MoleculeGraph): boolean {
  return g.atoms
    .filter((a) => a.element === 'C')
    .some((a) => neighboursOf(g, a.id).some((n) => ['H', 'C'].includes(elemOf(g, n))));
}

/** Recognise the common polyatomic ions from connectivity (not from a formula table). */
function detectPolyatomic(g: MoleculeGraph): { name: string; charge: number; centre: string } | null {
  for (const a of g.atoms) {
    const nbrs = neighboursOf(g, a.id).filter((n) => elemOf(g, n) === 'O');
    if (nbrs.length === 0) continue;
    const sum = nbrs.reduce((s, n) => s + orderBetween(g, a.id, n), 0);
    const hOnO = nbrs.some((n) => neighboursOf(g, n).some((x) => elemOf(g, x) === 'H'));
    switch (a.element) {
      case 'C':
        if (nbrs.length === 3 && !hOnO) return { name: 'carbonate', charge: -2, centre: a.id };
        if (nbrs.length === 3 && hOnO) return { name: 'hydrogencarbonate', charge: -1, centre: a.id };
        break;
      case 'S':
        if (nbrs.length === 4) return { name: 'sulfate', charge: -2, centre: a.id };
        if (nbrs.length === 3) return { name: 'sulfite', charge: -2, centre: a.id };
        break;
      case 'N':
        if (nbrs.length === 3) return { name: 'nitrate', charge: -1, centre: a.id };
        if (nbrs.length === 2) return { name: 'nitrite', charge: -1, centre: a.id };
        break;
      case 'P':
        if (nbrs.length === 4) return { name: 'phosphate', charge: -3, centre: a.id };
        break;
      case 'Cl':
        if (nbrs.length === 4) return { name: 'perchlorate', charge: -1, centre: a.id };
        break;
      case 'Mn':
        if (nbrs.length === 4) return { name: 'permanganate', charge: -1, centre: a.id };
        break;
      case 'Cr':
        if (nbrs.length === 4 && sum >= 6) return { name: 'chromate', charge: -2, centre: a.id };
        break;
      default:
        break;
    }
  }
  // Ammonium: N with four hydrogens and a + charge.
  const ammonium = g.atoms.find(
    (a) => a.element === 'N' && (a.charge ?? 0) > 0 && neighboursOf(g, a.id).filter((n) => elemOf(g, n) === 'H').length === 4,
  );
  if (ammonium) return { name: 'ammonium', charge: 1, centre: ammonium.id };
  const hydroxide = g.atoms.find(
    (a) => a.element === 'O' && (a.charge ?? 0) < 0 && neighboursOf(g, a.id).some((n) => elemOf(g, n) === 'H'),
  );
  if (hydroxide) return { name: 'hydroxide', charge: -1, centre: hydroxide.id };
  return null;
}

/** Oxoacid naming: root + the -ic / -ous / per- / hypo- prefix set by oxidation state. */
const ACID_ROOTS: Record<string, { root: string; ic: number; ous: number; per?: number; hypo?: number }> = {
  S: { root: 'sulfur', ic: 6, ous: 4 },
  N: { root: 'nitr', ic: 5, ous: 3 },
  C: { root: 'carbon', ic: 4, ous: 2 },
  P: { root: 'phosphor', ic: 5, ous: 3, hypo: 1 },
  Cl: { root: 'chlor', ic: 5, ous: 3, per: 7, hypo: 1 },
  Br: { root: 'brom', ic: 5, ous: 3, per: 7, hypo: 1 },
  I: { root: 'iod', ic: 5, ous: 3, per: 7 },
  B: { root: 'bor', ic: 3, ous: 1 },
  Si: { root: 'silic', ic: 4, ous: 2 },
};

function oxoAcidName(g: MoleculeGraph): string | null {
  const central = g.atoms.find((a) => !['H', 'O'].includes(a.element));
  if (!central) return null;
  const spec = ACID_ROOTS[central.element];
  if (!spec) return null;
  const oxygens = neighboursOf(g, central.id).filter((id) => elemOf(g, id) === 'O');
  if (oxygens.length === 0) return null;
  const terminalO = oxygens.filter((id) => !neighboursOf(g, id).some((x) => elemOf(g, x) === 'H')).length;
  if (!g.atoms.some((a) => a.element === 'H')) return null;
  // Each terminal O contributes +2, each O–H contributes +1, to the central ox state.
  const oxState = terminalO * 2 + (oxygens.length - terminalO);
  if (spec.per && oxState >= spec.per) return `per${spec.root}ic acid`;
  if (spec.hypo && oxState <= spec.hypo) return `hypo${spec.root}ous acid`;
  if (oxState >= spec.ic) return `${spec.root}ic acid`;
  if (oxState <= spec.ous) return `${spec.root}ous acid`;
  return `${spec.root}ic acid`;
}

function inorganicName(g: MoleculeGraph): NamingResult | null {
  const syms = g.atoms.map((a) => a.element);
  const uniq = [...new Set(syms)];
  const counts: Record<string, number> = {};
  for (const s of syms) counts[s] = (counts[s] ?? 0) + 1;

  // Anything with a C–H or C–C bond is handled by the organic namer.
  if (hasOrganicCarbon(g)) return null;

  const metals = uniq.filter((s) => getElement(s).isMetal);
  const nonMetals = uniq.filter((s) => !getElement(s).isMetal);

  // ---- single element ----
  if (uniq.length === 1) {
    const s = uniq[0];
    const n = counts[s];
    const base = getElement(s).name.toLowerCase();
    const name = n === 1 ? base : `${GREEK[n] ?? PREFIX[n] ?? `${n}`}${base}`;
    return { name, iupac: name, confidence: 'systematic' };
  }

  // ---- oxoacids (H + central atom + O, no metal) ----
  if (counts.H && metals.length === 0) {
    const acid = oxoAcidName(g);
    if (acid) return { name: acid, iupac: acid, confidence: 'systematic' };
  }

  // ---- salt of a polyatomic ion ----
  const ion = detectPolyatomic(g);
  if (ion && metals.length === 1) {
    const cation = getElement(metals[0]).name.toLowerCase();
    const variable = getElement(metals[0]).commonOxidationStates.length > 1;
    const nCations = counts[metals[0]];
    const ox = Math.round((-ion.charge * (g.atoms.filter((a) => a.element === metals[0]).length / nCations)) / nCations) || undefined;
    const roman = variable && ox && ROMAN[ox] ? `(${ROMAN[ox]})` : '';
    const name = `${cation}${roman} ${ion.name}`;
    return { name, iupac: name, confidence: 'systematic' };
  }
  if (ion && metals.length === 0 && counts.H === 0) {
    // bare polyatomic ion, e.g. nitrate
    return { name: ion.name, iupac: ion.name, confidence: 'systematic' };
  }

  // ---- binary ionic: metal + non-metal ----
  if (metals.length === 1 && nonMetals.length === 1) {
    const m = metals[0], nm = nonMetals[0];
    const cation = getElement(m).name.toLowerCase();
    const variableCharge = getElement(m).commonOxidationStates.length > 1;
    const nMetal = counts[m];
    const nNon = counts[nm];
    const anionCharges: Record<string, number> = { F: 1, Cl: 1, Br: 1, I: 1, O: 2, S: 2, N: 3, H: 1 };
    const z = anionCharges[nm] ?? 1;
    const ox = Math.round((nNon * z) / nMetal);
    const roman = variableCharge && ROMAN[ox] ? `(${ROMAN[ox]})` : '';
    const name = `${cation}${roman} ${anionName(nm)}`;
    return { name, iupac: name, confidence: 'systematic' };
  }

  // ---- binary covalent (two non-metals) ----
  if (metals.length === 0 && uniq.length <= 2) {
    if (uniq.length === 2) {
      const [a, b] = uniq;
      const eA = getElement(a).electronegativity, eB = getElement(b).electronegativity;
      const first = eA <= eB ? a : b;
      const second = first === a ? b : a;
      const n1 = counts[first], n2 = counts[second];
      const special: Record<string, string> = {
        H2O1: 'water', H3N1: 'ammonia', H4C1: 'methane', H2S1: 'hydrogen sulfide',
        H1Cl1: 'hydrogen chloride', H1F1: 'hydrogen fluoride', H1Br1: 'hydrogen bromide',
        H1I1: 'hydrogen iodide', H4N2: 'hydrazine', H2O2: 'hydrogen peroxide',
      };
      const key = `${first}${n1}${second}${n2}`;
      const systematic = covalentName(first, n1, second, n2);
      if (special[key]) return { name: special[key], iupac: systematic, confidence: 'exact' };
      return { name: systematic, iupac: systematic, confidence: 'systematic' };
    }
  }

  return null;
}

function covalentName(first: string, n1: number, second: string, n2: number): string {
  const p1 = n1 > 1 ? PREFIX[n1] ?? `${n1}` : '';
  const p2 = PREFIX[n2] ?? `${n2}`;
  return `${p1}${getElement(first).name.toLowerCase()} ${p2}${anionName(second)}`;
}

/* ----------------------------------------------------------- organic ---- */

type FG =
  | { kind: 'carboxylic'; id: string }
  | { kind: 'ester'; id: string }
  | { kind: 'aldehyde'; id: string }
  | { kind: 'ketone'; id: string }
  | { kind: 'alcohol'; id: string }
  | { kind: 'amine'; id: string }
  | { kind: 'nitro'; id: string }
  | { kind: 'halide'; id: string; symbol: string }
  | { kind: 'alkene'; id: string; locant: number }
  | { kind: 'alkyne'; id: string; locant: number }
  | { kind: 'benzene'; ids: string[] };

const FG_PRIORITY: FG['kind'][] = [
  'carboxylic', 'ester', 'aldehyde', 'ketone', 'alcohol', 'amine', 'nitro', 'alkyne', 'alkene', 'halide', 'benzene',
];

function detectFunctionalGroups(g: MoleculeGraph, ringAtoms: Set<string>): FG[] {
  const out: FG[] = [];
  for (const a of g.atoms) {
    if (a.element === 'C') {
      const nbrs = neighboursOf(g, a.id);
      const os = nbrs.filter((id) => elemOf(g, id) === 'O');
      const carbonyl = os.find((id) => orderBetween(g, a.id, id) === 2);
      if (carbonyl) {
        const oh = os.find((id) => orderBetween(g, a.id, id) === 1 && neighboursOf(g, id).some((h) => elemOf(g, h) === 'H'));
        const or = os.find((id) => orderBetween(g, a.id, id) === 1 && neighboursOf(g, id).some((h) => elemOf(g, h) === 'C' && h !== a.id));
        const hOnC = nbrs.some((id) => elemOf(g, id) === 'H');
        if (oh) out.push({ kind: 'carboxylic', id: a.id });
        else if (or) out.push({ kind: 'ester', id: a.id });
        else if (hOnC) out.push({ kind: 'aldehyde', id: a.id });
        else out.push({ kind: 'ketone', id: a.id });
      }
    }
    if (a.element === 'O' && neighboursOf(g, a.id).some((id) => elemOf(g, id) === 'H') && degree(g, a.id) <= 2) {
      // An –OH on a carbonyl carbon is part of –COOH, not a separate alcohol.
      const host = neighboursOf(g, a.id).find((id) => elemOf(g, id) === 'C');
      const isCarboxylOh = !!host && neighboursOf(g, host).some((x) => elemOf(g, x) === 'O' && orderBetween(g, host, x) === 2);
      if (!isCarboxylOh) out.push({ kind: 'alcohol', id: a.id });
    }
    if (a.element === 'N') {
      const nbrs = neighboursOf(g, a.id);
      const hasNO2 = nbrs.filter((id) => elemOf(g, id) === 'O').length >= 2;
      if (hasNO2) out.push({ kind: 'nitro', id: a.id });
      else if (nbrs.some((id) => elemOf(g, id) === 'C') && !ringAtoms.has(a.id)) out.push({ kind: 'amine', id: a.id });
    }
    if (['F', 'Cl', 'Br', 'I'].includes(a.element) && neighboursOf(g, a.id).some((id) => elemOf(g, id) === 'C')) {
      out.push({ kind: 'halide', id: a.id, symbol: a.element });
    }
  }
  // Multiple bonds
  for (const b of g.bonds) {
    if (elemOf(g, b.a) === 'C' && elemOf(g, b.b) === 'C') {
      if (b.order === 2) out.push({ kind: 'alkene', id: b.a, locant: 0 });
      if (b.order === 3) out.push({ kind: 'alkyne', id: b.a, locant: 0 });
    }
  }
  return out;
}

/** Longest carbon chain (simple DFS, fine for <= 20 carbons). */
function longestCarbonChain(g: MoleculeGraph): string[] {
  const carbons = g.atoms.filter((a) => a.element === 'C').map((a) => a.id);
  if (carbons.length === 0) return [];
  let best: string[] = [];
  const dfs = (cur: string, path: string[], seen: Set<string>) => {
    if (path.length > best.length) best = [...path];
    for (const n of neighboursOf(g, cur)) {
      if (elemOf(g, n) !== 'C' || seen.has(n)) continue;
      seen.add(n);
      path.push(n);
      dfs(n, path, seen);
      path.pop();
      seen.delete(n);
    }
  };
  for (const c of carbons) dfs(c, [c], new Set([c]));
  return best;
}

const HALO: Record<string, string> = { F: 'fluoro', Cl: 'chloro', Br: 'bromo', I: 'iodo' };
const ALKYL: Record<number, string> = { 1: 'methyl', 2: 'ethyl', 3: 'propyl', 4: 'butyl', 5: 'pentyl' };

function aromaticRing(g: MoleculeGraph): string[] | null {
  const rings = findRings(g, 6);
  for (const r of rings) {
    if (r.length !== 6) continue;
    if (r.every((id) => elemOf(g, id) === 'C')) {
      const aromaticCount = r.filter((id) =>
        neighboursOf(g, id).some((n) => r.includes(n) && (orderBetween(g, id, n) === 2 || getBond(g, id, n)?.type === 'aromatic')),
      ).length;
      if (aromaticCount === 6) return r;
    }
  }
  // benzene written with alternating doubles already covered; also accept aromatic type
  for (const r of rings) {
    if (r.length === 6 && r.every((id) => elemOf(g, id) === 'C')) {
      const arom = r.every((id) =>
        neighboursOf(g, id).filter((n) => r.includes(n)).length === 2,
      );
      if (arom) {
        const doubles = g.bonds.filter((b) => r.includes(b.a) && r.includes(b.b) && (b.order === 2 || b.type === 'aromatic')).length;
        if (doubles >= 3) return r;
      }
    }
  }
  return null;
}

function benzeneName(g: MoleculeGraph, ring: string[]): string {
  const subs: { name: string; priority: number; locant: number }[] = [];
  const ringSet = new Set(ring);
  const order: Record<string, number> = { OH: 0, COOH: 0, NH2: 1, CHO: 2, CH3: 3, NO2: 4, Cl: 5, F: 5, Br: 5, I: 5 };
  let best: string | null = null;
  for (const id of ring) {
    for (const n of neighboursOf(g, id)) {
      if (ringSet.has(n)) continue;
      const el = elemOf(g, n);
      if (el === 'H') continue;
      const idx = ring.indexOf(id) + 1;
      if (el === 'O' && neighboursOf(g, n).some((h) => elemOf(g, h) === 'H')) {
        subs.push({ name: 'hydroxy', priority: 0, locant: idx });
      } else if (el === 'C') {
        const os = neighboursOf(g, n).filter((x) => elemOf(g, x) === 'O');
        if (os.some((x) => orderBetween(g, n, x) === 2)) {
          const oh = os.find((x) => neighboursOf(g, x).some((h) => elemOf(g, h) === 'H'));
          subs.push({ name: oh ? 'carboxy' : 'formyl', priority: oh ? 0 : 2, locant: idx });
        } else subs.push({ name: ALKYL[1] ?? 'methyl', priority: 3, locant: idx });
      } else if (el === 'N') {
        const isNitro = neighboursOf(g, n).filter((x) => elemOf(g, x) === 'O').length >= 2;
        subs.push({ name: isNitro ? 'nitro' : 'amino', priority: isNitro ? 4 : 1, locant: idx });
      } else if (HALO[el]) {
        subs.push({ name: HALO[el], priority: 5, locant: idx });
      }
    }
  }
  if (subs.length === 0) return 'benzene';
  const primary = subs.slice().sort((a, b) => a.priority - b.priority)[0];
  const special: Record<string, string> = {
    hydroxy: 'phenol', carboxy: 'benzoic acid', amino: 'aniline', methyl: 'toluene',
    formyl: 'benzaldehyde', nitro: 'nitrobenzene',
  };
  best = special[primary.name] ?? null;
  const others = subs.filter((s) => s !== primary).sort((a, b) => a.name.localeCompare(b.name));
  if (best && others.length === 0) return best;
  const base = best ?? 'benzene';
  const locants = others.map((s) => `${s.locant}-${s.name}`).join(',');
  return `${locants}${base}`;
}

function organicName(g: MoleculeGraph): NamingResult | null {
  const carbons = g.atoms.filter((a) => a.element === 'C');
  if (carbons.length === 0) return null;

  const ring = aromaticRing(g);
  const ringSet = new Set(ring ?? []);
  const ringName = ring ? benzeneName(g, ring) : null;

  // A molecule that is essentially a substituted benzene.
  if (ring) {
    const outside = g.atoms.filter((a) => !ringSet.has(a.id) && a.element !== 'H');
    const carbonOutside = outside.filter((a) => a.element === 'C');
    if (carbonOutside.length <= 1 && outside.length <= 3) {
      return { name: ringName!, iupac: ringName!, confidence: ringName === 'benzene' ? 'exact' : 'systematic' };
    }
  }

  const chain = longestCarbonChain(g);
  if (chain.length === 0) return null;
  const n = chain.length;
  const base = ALKANE[n] ?? `C${n}`;
  const chainSet = new Set(chain);

  // Unsaturation
  let ene = -1, yne = -1;
  for (let i = 0; i < chain.length - 1; i++) {
    const o = orderBetween(g, chain[i], chain[i + 1]);
    if (o === 2 && ene < 0) ene = i + 1;
    if (o === 3 && yne < 0) yne = i + 1;
  }

  const groups = detectFunctionalGroups(g, ringSet);

  // Principal group on (or attached to) the chain.
  const pick = (kind: FG['kind']) => groups.find((x) => x.kind === kind);
  const suffixFor = (kind: FG['kind']): { suffix: string; locantOf: (id: string) => number } | null => {
    const locantOf = (id: string): number => {
      const idx = chain.indexOf(id);
      if (idx >= 0) return idx + 1;
      // group hangs off a chain carbon
      const host = neighboursOf(g, id).find((x) => chainSet.has(x));
      return host ? chain.indexOf(host) + 1 : 1;
    };
    switch (kind) {
      case 'carboxylic': return { suffix: 'oic acid', locantOf };
      case 'aldehyde': return { suffix: 'al', locantOf };
      case 'ketone': return { suffix: 'one', locantOf };
      case 'alcohol': return { suffix: 'ol', locantOf };
      case 'amine': return { suffix: 'amine', locantOf };
      default: return null;
    }
  };

  let suffix = 'e';
  let suffixLocant = '';
  let prefixParts: { text: string; locant: number }[] = [];

  for (const kind of FG_PRIORITY) {
    const grp = pick(kind);
    if (!grp) continue;
    if (kind === 'halide') {
      const g2 = grp as Extract<FG, { kind: 'halide' }>;
      const host = neighboursOf(g, g2.id).find((x) => chainSet.has(x));
      if (!host) continue;
      prefixParts.push({ text: HALO[g2.symbol] ?? g2.symbol.toLowerCase(), locant: chain.indexOf(host) + 1 });
      continue;
    }
    if (kind === 'nitro') {
      const host = neighboursOf(g, (grp as { id: string }).id).find((x) => chainSet.has(x));
      if (!host) continue;
      prefixParts.push({ text: 'nitro', locant: chain.indexOf(host) + 1 });
      continue;
    }
    if (kind === 'benzene') continue;
    if (kind === 'alkene' || kind === 'alkyne') continue;
    const s = suffixFor(kind);
    if (!s) continue;
    const loc = s.locantOf((grp as { id: string }).id);
    suffix = s.suffix;
    // A locant is only printed when more than one position is possible.
    const needsLocant =
      kind === 'aldehyde' || kind === 'carboxylic' || kind === 'ester' ? false :
      kind === 'ketone' ? n > 3 :
      kind === 'alcohol' || kind === 'amine' ? n > 2 :
      n > 1;
    suffixLocant = needsLocant ? `${loc}-` : '';
    break; // highest-priority group wins as the suffix; the rest become prefixes
  }

  // Remaining alcohol/amine groups become hydroxy- / amino- prefixes.
  for (const grp of groups) {
    if (grp.kind === 'alcohol' && suffix !== 'ol') {
      const host = neighboursOf(g, (grp as { id: string }).id).find((x) => chainSet.has(x));
      if (host) prefixParts.push({ text: 'hydroxy', locant: chain.indexOf(host) + 1 });
    }
    if (grp.kind === 'amine' && suffix !== 'amine') {
      const host = neighboursOf(g, (grp as { id: string }).id).find((x) => chainSet.has(x));
      if (host) prefixParts.push({ text: 'amino', locant: chain.indexOf(host) + 1 });
    }
  }

  // Alkyl branches off the chain.
  for (const c of chain) {
    for (const nb of neighboursOf(g, c)) {
      if (chainSet.has(nb) || elemOf(g, nb) !== 'C') continue;
      if (ringSet.has(nb)) {
        prefixParts.push({ text: ringName === 'benzene' ? 'phenyl' : 'cyclohexyl', locant: chain.indexOf(c) + 1 });
        continue;
      }
      const branchLen = countBranch(g, nb, new Set(chain));
      prefixParts.push({ text: ALKYL[branchLen] ?? `${ALKANE[branchLen] ?? 'C'}yl`, locant: chain.indexOf(c) + 1 });
    }
  }

  // Unsaturation marker: "-2-en" / "-1-yn".
  let unsat = '';
  if (ene > 0 || yne > 0) {
    const parts: string[] = [];
    if (ene > 0) parts.push(`${ene}-en`);
    if (yne > 0) parts.push(`${yne}-yn`);
    unsat = `-${parts.join('-')}`;
  }

  prefixParts = dedupeLocants(prefixParts);
  prefixParts.sort((a, b) => a.text.localeCompare(b.text) || a.locant - b.locant);
  const multPrefix = prefixParts.length > 1 ? groupMulti(prefixParts) : prefixParts.map((p) => `${p.locant}-${p.text}`).join('-');
  const prefix = multPrefix ? `${multPrefix}-` : '';

  // Assemble:  prefix + base + (unsat | 'an') + locant + suffix
  let name: string;
  if (['ol', 'al', 'one', 'amine'].includes(suffix)) {
    const infix = unsat ? unsat : 'an';
    const join = unsat && suffixLocant ? '-' : '';
    name = `${prefix}${base}${infix}${join}${suffixLocant}${suffix}`;
  } else if (suffix === 'oic acid') {
    name = `${prefix}${base}${unsat ? unsat : 'an'}oic acid`;
  } else if (suffix === 'e' || suffix === 'ane') {
    name = `${prefix}${base}${unsat ? `${unsat}e` : 'ane'}`;
  } else {
    name = `${prefix}${base}${unsat}${suffixLocant}${suffix}`;
  }

  return { name: prettify(name), iupac: prettify(name), confidence: 'systematic' };
}

function groupMulti(parts: { text: string; locant: number }[]): string {
  const byName = new Map<string, number[]>();
  for (const p of parts) byName.set(p.text, [...(byName.get(p.text) ?? []), p.locant]);
  return [...byName.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([text, locs]) => `${locs.sort((a, b) => a - b).join(',')}-${locs.length > 1 ? (PREFIX[locs.length] ?? `${locs.length}`) : ''}${text}`)
    .join('-');
}

function dedupeLocants(parts: { text: string; locant: number }[]): { text: string; locant: number }[] {
  const seen = new Set<string>();
  return parts.filter((p) => {
    const k = `${p.text}${p.locant}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function countBranch(g: MoleculeGraph, start: string, exclude: Set<string>): number {
  let best = 0;
  const dfs = (cur: string, len: number, seen: Set<string>) => {
    best = Math.max(best, len);
    for (const n of neighboursOf(g, cur)) {
      if (exclude.has(n) || seen.has(n) || elemOf(g, n) !== 'C') continue;
      seen.add(n);
      dfs(n, len + 1, seen);
      seen.delete(n);
    }
  };
  dfs(start, 1, new Set([start]));
  return best;
}

function prettify(s: string): string {
  return s
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ------------------------------------------------------------- public API */

export function nameMolecule(g: MoleculeGraph, known?: { name?: string; iupac?: string }): NamingResult {
  if (known?.name) {
    return { name: known.name, iupac: known.iupac ?? known.name, confidence: 'exact' };
  }
  if (g.atoms.length === 0) return { name: 'empty', iupac: 'empty', confidence: 'formula' };
  const ionic = g.atoms.some((a) => getElement(a.element).isMetal);
  if (countFragments(g) > 1 && !ionic) {
    return { name: `${g.atoms.length} separate fragments`, iupac: `${g.atoms.length} separate fragments`, confidence: 'formula' };
  }
  const organic = hasOrganicCarbon(g);
  if (!organic) {
    const inorg = inorganicName(g);
    if (inorg) return inorg;
  }
  const org = organicName(g);
  if (org && org.confidence !== 'formula') return org;
  const inorg2 = inorganicName(g);
  if (inorg2) return inorg2;
  const counts: Record<string, number> = {};
  for (const a of g.atoms) counts[a.element] = (counts[a.element] ?? 0) + 1;
  const formula = Object.entries(counts).map(([k, v]) => (v > 1 ? `${k}${v}` : k)).join('');
  return { name: formula, iupac: formula, confidence: 'formula' };
}

/** IUPAC substituent names used by the functional-group palette (§6). */
export const FUNCTIONAL_GROUPS = [
  { id: 'hydroxyl', label: '–OH', name: 'hydroxyl', attachment: 'O', atoms: [{ element: 'O', bonds: [{ to: -1, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }] },
  { id: 'aldehyde', label: '–CHO', name: 'formyl', attachment: 'C', atoms: [{ element: 'C', bonds: [{ to: -1, order: 1 as BondOrder }] }, { element: 'O', bonds: [{ to: 0, order: 2 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }] },
  { id: 'carboxyl', label: '–COOH', name: 'carboxyl', attachment: 'C', atoms: [{ element: 'C', bonds: [{ to: -1, order: 1 as BondOrder }] }, { element: 'O', bonds: [{ to: 0, order: 2 as BondOrder }] }, { element: 'O', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 2, order: 1 as BondOrder }] }] },
  { id: 'amino', label: '–NH₂', name: 'amino', attachment: 'N', atoms: [{ element: 'N', bonds: [{ to: -1, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }] },
  { id: 'nitro', label: '–NO₂', name: 'nitro', attachment: 'N', atoms: [{ element: 'N', bonds: [{ to: -1, order: 1 as BondOrder }, { to: 1, order: 2 as BondOrder }, { to: 2, order: 1 as BondOrder }] }, { element: 'O', bonds: [] }, { element: 'O', bonds: [] }] },
  { id: 'methyl', label: '–CH₃', name: 'methyl', attachment: 'C', atoms: [{ element: 'C', bonds: [{ to: -1, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }] },
  { id: 'ethyl', label: '–C₂H₅', name: 'ethyl', attachment: 'C', atoms: [{ element: 'C', bonds: [{ to: -1, order: 1 as BondOrder }] }, { element: 'C', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 1, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 1, order: 1 as BondOrder }] }, { element: 'H', bonds: [{ to: 1, order: 1 as BondOrder }] }] },
  { id: 'phosphate', label: '–PO₄', name: 'phosphate', attachment: 'P', atoms: [{ element: 'P', bonds: [{ to: -1, order: 1 as BondOrder }] }, { element: 'O', bonds: [{ to: 0, order: 2 as BondOrder }] }, { element: 'O', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'O', bonds: [{ to: 0, order: 1 as BondOrder }] }, { element: 'O', bonds: [{ to: 0, order: 1 as BondOrder }] }] },
];
