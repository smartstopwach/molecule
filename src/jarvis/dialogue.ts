/**
 * dialogue.ts — JARVIS's lines (spec §8).
 *
 * Persona: calm, British, concise, slightly witty. Every line is a pure function so
 * it can be unit-tested and reused by the HUD, the toasts and the speech synthesiser.
 */

import type { MoleculeAnalysis } from '../chemistry/chemistryEngine';
import type { StabilityReport } from '../chemistry/stability';

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const LINES = {
  boot: [
    'Systems online. Welcome to the lab.',
    'Good to see you again, sir. All systems nominal.',
    'Reactor stable. Shall we make something?',
  ],
  cameraDenied: [
    'I am afraid I cannot operate without visual input. Camera access is required.',
    'My eyes are the camera, sir. Please enable it and I shall behave.',
  ],
  idle: [
    'Nothing on the bench yet. Pinch in empty space to place an atom.',
    'Shall I suggest something? Water is a classic.',
    'The periodic table is at your left hand. Use it.',
    'Two atoms, one pinch. That is all a bond really is.',
  ],
  idleLong: [
    'Still thinking? Point at an atom and I will tell you about it.',
    'If you are stuck, open your palm for the radial menu.',
    'Say "Jarvis, build methane" and I will sketch the skeleton.',
  ],
  complete: [
    'Molecule complete. Rather elegant, if I may say so.',
    'Stable. Every octet satisfied.',
    'That will hold together nicely.',
  ],
  radical: [
    'A radical. Perfectly legal, and thoroughly reactive.',
    'One unpaired electron. Handle with care.',
  ],
  unstable: [
    'It exists, but it will not sit still for long.',
    'Technically valid. Practically eager to react.',
  ],
  impossible: [
    'That arrangement violates the octet rule. I have stopped it.',
    'Even I cannot bend the periodic table, sir.',
  ],
  aromatic: [
    'Aromatic. Six pi electrons — Hückel would approve.',
    'Delocalised. That ring is unusually comfortable.',
  ],
  hypervalent: [
    'Expanded octet. Period three and below only.',
    'Hypervalent, and perfectly happy about it.',
  ],
  coordination: [
    'A coordination complex. Werner would be proud.',
    'Ligands attached. Note the d-orbital splitting.',
  ],
  scanHit: [
    'There we are. Pulling it out of the frame now.',
    'Identified. Rendering the structure.',
  ],
  scanMiss: [
    'No known compound detected. Try another object.',
    'I see nothing recognisable in that frame.',
  ],
  levelStart: [
    'New objective. I have sketched the target.',
    'Level loaded. Shall we begin?',
  ],
  levelComplete: [
    'Objective complete. Shall we raise the difficulty?',
    'Textbook work, sir.',
  ],
  quiz: [
    'Count the fingers you would hold up. One is sp.',
    'Which hybrid set? Show me your fingers.',
  ],
  reaction: [
    'Bringing them together now.',
    'Collision course. Stand by.',
  ],
  noReaction: [
    'Nothing happens. Chemistry is like that sometimes.',
    'No pathway in my table for that pair.',
  ],
  undo: ['Reverting.', 'As you were.'],
  clear: ['Bench cleared.', 'Wiping the workspace.'],
  witty: [
    'I do have a PhD in this, you know.',
    'Shall I add that to your Nobel citation?',
    'I have seen worse from graduate students.',
    'Remarkable. Almost as good as my own work.',
  ],
};

export const line = (key: keyof typeof LINES): string => pick(LINES[key]);

/** Molecule-completion narration built from the live analysis. */
export function completeLine(analysis: MoleculeAnalysis): string {
  const name = analysis.knownName ?? analysis.formula;
  const shape = analysis.molecularShape;
  const hy = analysis.hybridization;
  const bits: string[] = [];
  if (analysis.stability.status === 'stable') bits.push(pick(LINES.complete));
  else if (analysis.stability.status === 'radical') bits.push(pick(LINES.radical));
  else if (analysis.stability.status === 'unstable') bits.push(pick(LINES.unstable));
  else bits.push(pick(LINES.impossible));
  bits.push(`${name}: ${hy} hybridised, ${shape}`);
  if (analysis.bondAngleLabel && analysis.bondAngleLabel !== '—') bits.push(`bond angle ${analysis.bondAngleLabel}`);
  if (analysis.isAromatic) bits.push(pick(LINES.aromatic));
  if (analysis.netCharge !== 0) bits.push(`net charge ${analysis.netCharge > 0 ? '+' : 'minus'} ${Math.abs(analysis.netCharge)}`);
  return bits.join('. ') + '.';
}

/** Explain a rejected bond in JARVIS's voice. */
export function rejectionLine(reason: string, element?: string): string {
  const prefix = pick([
    'Rejected.',
    'I am stopping you there.',
    'That will not hold.',
    'Denied.',
  ]);
  return `${prefix} ${reason}${element ? ` — ${element} is quite firm about this.` : ''}`;
}

/** Stability commentary for the explanation card. */
export function stabilityLine(report: StabilityReport): string {
  switch (report.status) {
    case 'stable':
      return `Stable · ${report.score}/100 — all octets satisfied.`;
    case 'radical':
      return `Radical · ${report.score}/100 — one unpaired electron.`;
    case 'unstable':
      return `Unstable · ${report.score}/100 — ${report.reason}`;
    default:
      return `Impossible · ${report.score}/100 — ${report.reason}`;
  }
}

/** Idle nudge after 20 s of no activity (spec §8). */
export function idleLine(longIdle = false): string {
  return longIdle ? pick(LINES.idleLong) : pick(LINES.idle);
}

/** Read a balanced equation aloud, converting subscripts to spoken English. */
export function speakEquation(equation: string): string {
  return equation
    .replace(/₂/g, ' two ')
    .replace(/₃/g, ' three ')
    .replace(/₄/g, ' four ')
    .replace(/₅/g, ' five ')
    .replace(/₆/g, ' six ')
    .replace(/→/g, ' gives ')
    .replace(/\+/g, ' plus ')
    .replace(/\s+/g, ' ')
    .trim();
}
