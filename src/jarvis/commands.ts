/**
 * commands.ts — voice command grammar (spec §8).
 *
 * `parseCommand(text)` maps free speech onto an intent; the caller (App) executes it.
 * Matching is deliberately forgiving: "build me some methane", "make CH4" and
 * "methane please" all resolve to BUILD/METHANE.
 */

import { KNOWN, graphFromSmilesLite } from '../chemistry/chemistryEngine';
import { parseHybridFromSpeech } from '../game/quiz';
import type { GameMode } from '../store/useGameStore';

export type CommandIntent =
  | { kind: 'build'; target: string; smiles?: string }
  | { kind: 'orbitals' }
  | { kind: 'hideOrbitals' }
  | { kind: 'hybridization' }
  | { kind: 'scan' }
  | { kind: 'clear' }
  | { kind: 'next' }
  | { kind: 'explainBond' }
  | { kind: 'reactionMode' }
  | { kind: 'sandbox' }
  | { kind: 'campaign' }
  | { kind: 'quiz' }
  | { kind: 'timeAttack' }
  | { kind: 'undo' }
  | { kind: 'redo' }
  | { kind: 'element'; symbol: string }
  | { kind: 'answer'; value: number }
  | { kind: 'help' }
  | { kind: 'unknown'; raw: string };

const ELEMENT_WORDS: Record<string, string> = {
  hydrogen: 'H', carbon: 'C', nitrogen: 'N', oxygen: 'O', fluorine: 'F',
  chlorine: 'Cl', bromide: 'Br', bromine: 'Br', iodine: 'I', sulfur: 'S', sulphur: 'S',
  phosphorus: 'P', sodium: 'Na', potassium: 'K', magnesium: 'Mg', calcium: 'Ca',
  aluminium: 'Al', aluminum: 'Al', boron: 'B', beryllium: 'Be', silicon: 'Si',
  iron: 'Fe', copper: 'Cu', cobalt: 'Co', nickel: 'Ni', zinc: 'Zn', helium: 'He',
  neon: 'Ne', argon: 'Ar', xenon: 'Xe', krypton: 'Kr', lithium: 'Li',
};

/** Every known molecule name, lower-cased, for the "build X" command. */
const NAME_INDEX = new Map<string, { name: string; smiles: string }>();
for (const k of KNOWN) {
  if (!k.smiles) continue;
  NAME_INDEX.set(k.name.toLowerCase(), { name: k.name, smiles: k.smiles });
  if (k.iupac) NAME_INDEX.set(k.iupac.toLowerCase(), { name: k.name, smiles: k.smiles });
}

const MODE_WORDS: Record<string, GameMode> = {
  sand: 'sandbox', sandbox: 'sandbox', free: 'sandbox',
  campaign: 'campaign', levels: 'campaign', story: 'campaign',
  reaction: 'reaction', reactions: 'reaction', lab: 'reaction',
  quiz: 'quiz', test: 'quiz', questions: 'quiz',
  attack: 'timeAttack', 'time attack': 'timeAttack', timetrial: 'timeAttack', 'time trial': 'timeAttack',
  scan: 'scan', scanner: 'scan',
};

export function parseCommand(raw: string): CommandIntent {
  const text = raw.toLowerCase().replace(/[^a-z0-9\s+]/g, ' ').replace(/\s+/g, ' ').trim();

  if (/\b(help|commands|what can you do)\b/.test(text)) return { kind: 'help' };
  if (/\b(clear|reset|wipe|delete everything)\b/.test(text)) return { kind: 'clear' };
  if (/\b(undo|go back|revert)\b/.test(text)) return { kind: 'undo' };
  if (/\b(redo|redo that)\b/.test(text)) return { kind: 'redo' };
  if (/\b(scan this|scan|identify)\b/.test(text)) return { kind: 'scan' };
  if (/\b(show orbitals|orbitals|show me the orbitals)\b/.test(text)) return { kind: 'orbitals' };
  if (/\b(hide orbitals|no orbitals)\b/.test(text)) return { kind: 'hideOrbitals' };
  if (/\b(hybridi[sz]ation|what is the hybridi[sz]ation|hybridi[sz]ed)\b/.test(text)) return { kind: 'hybridization' };
  if (/\b(explain (the )?bond|explain|tell me about)\b/.test(text)) return { kind: 'explainBond' };
  if (/\b(next level|next|continue)\b/.test(text)) return { kind: 'next' };

  // mode switches
  for (const [word, mode] of Object.entries(MODE_WORDS)) {
    if (new RegExp(`\\b(${word}|${word} mode)\\b`).test(text)) {
      if (mode === 'reaction') return { kind: 'reactionMode' };
      if (mode === 'sandbox') return { kind: 'sandbox' };
      if (mode === 'campaign') return { kind: 'campaign' };
      if (mode === 'quiz') return { kind: 'quiz' };
      if (mode === 'timeAttack') return { kind: 'timeAttack' };
    }
  }

  // quiz answers: "sp3", "tetrahedral", "three"
  const hybrid = parseHybridFromSpeech(text);
  if (hybrid && /\b(answer|is|it is|it's|hybridi[sz])\b/.test(text)) return { kind: 'answer', value: hybrid };
  const numberWords: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };
  for (const [word, n] of Object.entries(numberWords)) {
    if (new RegExp(`^\\s*${word}\\s*$`).test(text)) return { kind: 'answer', value: n };
  }

  // element selection: "select oxygen", "give me a carbon"
  for (const [word, symbol] of Object.entries(ELEMENT_WORDS)) {
    if (new RegExp(`\\b(select|choose|pick|use|give me|grab)\\s+(an?\\s+)?${word}\\b`).test(text)) {
      return { kind: 'element', symbol };
    }
  }

  // build X
  const buildMatch = /\b(build|make|create|assemble|give me|i want)\b\s+(me\s+)?(a\s+|an\s+|some\s+)?(.+)/.exec(text);
  if (buildMatch) {
    const target = buildMatch[4].trim();
    const entry = NAME_INDEX.get(target);
    if (entry) return { kind: 'build', target: entry.name, smiles: entry.smiles };
    // try a formula written out, e.g. "h2o"
    const formulaHit = KNOWN.find((k) => k.formula.replace(/[^A-Za-z0-9]/g, '').toLowerCase() === target.replace(/\s/g, ''));
    if (formulaHit?.smiles) return { kind: 'build', target: formulaHit.name, smiles: formulaHit.smiles };
    return { kind: 'build', target };
  }

  return { kind: 'unknown', raw };
}

/** Build the graph for a voice-built molecule (used by ghost-guide mode). */
export function graphForCommand(smiles: string) {
  try {
    return graphFromSmilesLite(smiles);
  } catch {
    return null;
  }
}

export const COMMAND_HELP: { command: string; description: string }[] = [
  { command: '"Jarvis, build methane"', description: 'Ghost-guide skeleton for a named molecule' },
  { command: '"show orbitals" / "hide orbitals"', description: 'Toggle orbital rendering' },
  { command: '"what is the hybridization"', description: 'JARVIS explains the central atom' },
  { command: '"scan this"', description: 'Freeze the frame and identify an object' },
  { command: '"clear"', description: 'Empty the workspace' },
  { command: '"next level"', description: 'Advance the campaign' },
  { command: '"explain bond"', description: 'Explain the selected bond (σ/π)' },
  { command: '"reaction mode" / "sandbox" / "quiz"', description: 'Switch mode' },
  { command: '"select oxygen"', description: 'Change the active element' },
  { command: '"undo" / "redo"', description: 'Step through history' },
  { command: '"one" … "five" / "sp3"', description: 'Answer a quiz question' },
];

export { ELEMENT_WORDS };
