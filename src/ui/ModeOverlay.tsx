/**
 * ModeOverlay.tsx — the per-mode banner + screens (spec §10, §11).
 *
 *  campaign   objective card with target formula, ghost toggle, stars
 *  timeAttack round header + running list + end-of-round results
 *  quiz       question card answered by holding up fingers
 *  reaction   instructions + preset reaction list
 *  sandbox    nothing but a hint
 */

import { useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { getLevel, levelDisplayName, WORLDS } from '../game/campaign';
import { HYBRID_LABELS, type QuizQuestion } from '../game/quiz';
import { REACTION_TABLE, formatEquation, REACTION_TYPES } from '../chemistry/reactionEngine';
import { playSfx } from '../jarvis/sfx';

export interface ModeOverlayProps {
  quizQuestion: QuizQuestion | null;
  quizIndex: number;
  quizTotal: number;
  timeAttack: { score: number; built: { formula: string; name: string; points: number }[]; finished: boolean; rank: string } | null;
  onNextLevel: () => void;
  onUseHint: () => void;
  onToggleGhost: () => void;
  onStartRound: () => void;
  onLoadReaction: (index: number) => void;
}

export function ModeOverlay(props: ModeOverlayProps) {
  const mode = useGameStore((s) => s.mode);
  const levelId = useGameStore((s) => s.levelId);
  const progress = useGameStore((s) => s.progress);
  const ghost = useMoleculeStore((s) => s.ghost);

  const level = useMemo(() => getLevel(levelId), [levelId]);
  const world = WORLDS.find((w) => w.id === level?.world);

  if (mode === 'campaign' && level) {
    const rec = progress.levels[level.id];
    return (
      <div className="pointer-events-auto w-[min(94vw,560px)] rounded-lg border border-jarvis-cyan/25 bg-[#041821]/90 p-3 font-hud shadow-hud backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: world?.color ?? '#38e8ff' }}>
            World {level.world} · {world?.name} · {level.index}
          </span>
          <span className="font-mono text-[11px] text-jarvis-amber">
            {'★'.repeat(rec?.stars ?? 0)}{'☆'.repeat(3 - (rec?.stars ?? 0))}
          </span>
        </div>
        <h2 className="mt-1 text-xl font-bold uppercase tracking-[0.16em] text-jarvis-cyan">{levelDisplayName(level)}</h2>
        <p className="font-mono text-[12px] text-jarvis-orange">{level.formula}</p>
        <p className="mt-1 text-[11.5px] leading-snug text-jarvis-cyan/75">{level.teach}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Btn onClick={props.onToggleGhost}>{ghost ? 'hide ghost' : 'ghost guide'}</Btn>
          <Btn onClick={props.onUseHint}>hint</Btn>
          <Btn onClick={props.onNextLevel}>skip →</Btn>
        </div>
      </div>
    );
  }

  if (mode === 'timeAttack') {
    return (
      <div className="pointer-events-auto w-[min(94vw,460px)] rounded-lg border border-jarvis-orange/30 bg-[#041821]/90 p-3 font-hud shadow-hud backdrop-blur-md">
        <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-jarvis-orange">Time attack</h2>
        {!props.timeAttack ? (
          <>
            <p className="mt-1 text-[11.5px] leading-snug text-jarvis-cyan/75">
              60 seconds. Build as many <em>different</em> stable molecules as you can. Duplicates score
              nothing; impossible ones cost you.
            </p>
            <Btn onClick={() => { playSfx('select'); props.onStartRound(); }}>start round</Btn>
          </>
        ) : (
          <>
            <p className="font-mono text-[22px] text-jarvis-amber">{props.timeAttack.score}</p>
            <ul className="mt-1 max-h-[130px] overflow-y-auto font-mono text-[11px] text-jarvis-cyan/70">
              {props.timeAttack.built.slice(-8).map((b, i) => (
                <li key={`${b.formula}-${i}`}>
                  {b.formula} <span className="text-jarvis-green">+{b.points}</span>
                </li>
              ))}
            </ul>
            {props.timeAttack.finished && (
              <div className="mt-2 border-t border-jarvis-cyan/20 pt-2">
                <p className="text-[13px] text-jarvis-green">Round over — rank {props.timeAttack.rank}</p>
                <Btn onClick={() => { playSfx('select'); props.onStartRound(); }}>again</Btn>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (mode === 'quiz') {
    const q = props.quizQuestion;
    return (
      <div className="pointer-events-auto w-[min(94vw,520px)] rounded-lg border border-jarvis-violet/35 bg-[#041821]/90 p-3 font-hud shadow-hud backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-jarvis-violet">Hybridization quiz</h2>
          <span className="font-mono text-[11px] text-jarvis-cyan/60">
            {props.quizIndex + 1}/{props.quizTotal}
          </span>
        </div>
        {q ? (
          <>
            <p className="mt-1 text-[15px] text-jarvis-cyan">
              What is the hybridization of <span className="text-jarvis-orange">{q.central}</span> in{' '}
              <span className="font-semibold">{q.name}</span>?
            </p>
            <p className="mt-1 font-mono text-[11px] text-jarvis-cyan/55">{q.formula}</p>
            <p className="mt-2 text-[10.5px] leading-snug text-jarvis-cyan/70">
              Hold up fingers: 1 = sp · 2 = sp² · 3 = sp³ · 4 = sp³d · 5 = sp³d²
            </p>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="rounded border border-jarvis-violet/30 px-2 py-0.5 font-mono text-[11px] text-jarvis-violet/85">
                  {n} · {HYBRID_LABELS[Object.keys(HYBRID_LABELS)[n - 1]] ?? ''}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-1 text-[12px] text-jarvis-cyan/70">Round complete. Switch mode to start another.</p>
        )}
      </div>
    );
  }

  if (mode === 'reaction') {
    return (
      <div className="pointer-events-auto w-[min(94vw,520px)] rounded-lg border border-jarvis-amber/35 bg-[#041821]/90 p-3 font-hud shadow-hud backdrop-blur-md">
        <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-jarvis-amber">Reaction lab</h2>
        <p className="mt-1 text-[11.5px] leading-snug text-jarvis-cyan/75">
          Build two molecules, grab one with a pinch and smash it into the other. JARVIS reads the
          balanced equation aloud; exothermic reactions flash orange, endothermic ones frost blue.
        </p>
        <div className="mt-2 max-h-[168px] overflow-y-auto">
          {REACTION_TYPES.map((type) => (
            <div key={type} className="mb-1">
              <p className="text-[9px] uppercase tracking-[0.2em] text-jarvis-amber/60">{type}</p>
              {REACTION_TABLE.filter((r) => r.type === type).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => props.onLoadReaction(REACTION_TABLE.indexOf(r))}
                  className="mr-1 mb-1 rounded border border-jarvis-cyan/20 px-1.5 py-0.5 font-mono text-[10px] text-jarvis-cyan/75 hover:bg-jarvis-cyan/15"
                >
                  {formatEquation(r)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-jarvis-cyan/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-jarvis-cyan/85 transition hover:bg-jarvis-cyan/15"
    >
      {children}
    </button>
  );
}

export default ModeOverlay;
