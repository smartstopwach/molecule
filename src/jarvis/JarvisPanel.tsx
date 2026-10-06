/**
 * JarvisPanel.tsx — the right-hand HUD panel (spec §8, §11).
 *
 *  · the live explanation card (everything the chemistry engine knows)
 *  · the JARVIS dialogue log with typewriter output
 *  · a voice waveform that animates while he is speaking
 *  · the voice-command cheat sheet
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { analyzeMolecule } from '../chemistry/chemistryEngine';
import { nameMolecule } from '../chemistry/naming';
import { COMMAND_HELP } from './commands';
import { formatCharge } from '../chemistry/formalCharge';

/* ------------------------------------------------------------ typewriter */

function useTypewriter(text: string, speed = 18) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    if (!text) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return out;
}

/* ------------------------------------------------------------- waveform */

function Waveform({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const draw = () => {
      t += active ? 0.12 : 0.03;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = active ? '#38e8ff' : 'rgba(56,232,255,0.35)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x++) {
        const amp = active
          ? Math.sin(x * 0.08 + t) * Math.sin(x * 0.021 + t * 0.6) * (height / 2.6)
          : Math.sin(x * 0.08 + t) * 3;
        const y = height / 2 + amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return <canvas ref={canvasRef} width={240} height={44} className="w-full opacity-90" />;
}

/* ----------------------------------------------------------------- rows */

function Row({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-jarvis-cyan/10 py-[3px]">
      <span className="text-[10px] uppercase tracking-[0.14em] text-jarvis-cyan/50">{label}</span>
      <span className={`text-right font-mono text-[12px] ${accent ?? 'text-jarvis-cyan'}`}>{value}</span>
    </div>
  );
}

export function JarvisPanel() {
  const log = useGameStore((s) => s.log);
  const difficulty = useGameStore((s) => s.settings.difficulty);
  const captions = useGameStore((s) => s.settings.captions);
  /**
   * Subscribe to a signature rather than the raw arrays: dragging an atom updates
   * the store 60×/second and we must not re-run the full analysis that often.
   */
  const benchSignature = useMoleculeStore(
    (s) =>
      `${s.atoms.length}|${s.atoms.map((a) => a.element).sort().join(',')}|${s.bonds
        .map((b) => b.order)
        .sort()
        .join('')}`,
  );
  const [showHelp, setShowHelp] = useState(false);

  const analysis = useMemo(
    () => analyzeMolecule(useMoleculeStore.getState().toGraph(), { difficulty }),
    [benchSignature, difficulty],
  );

  const named = useMemo(() => {
    const graph = useMoleculeStore.getState().toGraph();
    if (!graph.atoms.length) return null;
    return nameMolecule(graph, { name: analysis.knownName, iupac: analysis.iupac });
  }, [analysis, benchSignature]);

  const lastLine = [...log].reverse().find((l) => l.who === 'jarvis');
  const typed = useTypewriter(lastLine?.text ?? '', 16);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    if (!lastLine) return;
    setSpeaking(true);
    const id = window.setTimeout(() => setSpeaking(false), Math.min(6000, 400 + lastLine.text.length * 45));
    return () => window.clearTimeout(id);
  }, [lastLine?.id]);

  return (
    <aside className="pointer-events-auto flex h-full w-[336px] flex-col gap-2 overflow-hidden rounded-lg border border-jarvis-cyan/25 bg-gradient-to-b from-[#041821]/92 to-[#02080d]/92 p-3 font-hud shadow-hud backdrop-blur-md">
      {/* header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.28em] text-jarvis-cyan">J.A.R.V.I.S.</h2>
          <p className="text-[9px] uppercase tracking-[0.2em] text-jarvis-cyan/40">Just A Rather Very Intelligent System</p>
        </div>
        <span className={`h-2 w-2 rounded-full ${speaking ? 'animate-pulse bg-jarvis-green' : 'bg-jarvis-cyan/40'}`} />
      </header>

      <Waveform active={speaking} />

      {/* dialogue log */}
      <div className="min-h-[92px] max-h-[150px] overflow-y-auto rounded border border-jarvis-cyan/15 bg-black/30 p-2">
        {log.length === 0 && (
          <p className="text-[11px] italic text-jarvis-cyan/40">Awaiting instructions, sir.</p>
        )}
        {log.slice(-8).map((l) => (
          <p
            key={l.id}
            className={`mb-1 text-[11px] leading-snug ${
              l.who === 'jarvis' ? 'text-jarvis-cyan/90' : l.who === 'user' ? 'text-jarvis-amber/90' : 'text-jarvis-cyan/40'
            }`}
          >
            <span className="mr-1 opacity-50">{l.who === 'jarvis' ? 'J:' : l.who === 'user' ? 'You:' : '·'}</span>
            {l.id === lastLine?.id && captions ? typed : l.text}
          </p>
        ))}
      </div>

      {/* explanation card */}
      <div className="flex-1 overflow-y-auto rounded border border-jarvis-cyan/15 bg-black/25 p-2">
        <h3 className="mb-1 text-[10px] uppercase tracking-[0.2em] text-jarvis-orange">Analysis card</h3>
        {!analysis.atoms.length ? (
          <p className="text-[11px] italic text-jarvis-cyan/40">Workspace empty — nothing to analyse.</p>
        ) : (
          <>
            <p className="mb-1 truncate text-[15px] font-semibold text-jarvis-cyan">
              {named?.name ?? analysis.formula}
              {analysis.isomerOf && <span className="ml-2 text-[10px] text-jarvis-amber">({analysis.isomerOf})</span>}
            </p>
            <Row label="Formula" value={analysis.formula} />
            <Row label="Molar mass" value={`${analysis.molarMass.toFixed(2)} g/mol`} />
            <Row label="Central atom" value={analysis.central?.element ?? '—'} />
            <Row label="Steric number" value={analysis.stericNumber || '—'} />
            <Row label="Hybridization" value={analysis.hybridization} accent="text-jarvis-green" />
            <Row label="Electron geometry" value={analysis.electronGeometry} />
            <Row label="Molecular shape" value={analysis.molecularShape} />
            <Row label="Bond angle" value={analysis.bondAngleLabel} />
            <Row label="σ / π bonds" value={`${analysis.sigmaCount} σ · ${analysis.piCount} π`} />
            <Row label="Lone pairs (centre)" value={analysis.lonePairCount} />
            <Row label="Polarity" value={`${analysis.polarity} — ${analysis.dipoleNote}`} />
            <Row
              label="Net charge"
              value={analysis.netCharge === 0 ? 'neutral' : formatCharge(analysis.netCharge)}
              accent={analysis.netCharge === 0 ? undefined : 'text-jarvis-violet'}
            />
            <Row
              label="Stability"
              value={`${analysis.stability.status} · ${analysis.stability.score}/100`}
              accent={
                analysis.stability.status === 'stable'
                  ? 'text-jarvis-green'
                  : analysis.stability.status === 'impossible'
                    ? 'text-jarvis-red'
                    : 'text-jarvis-orange'
              }
            />
            {analysis.stability.warnings.slice(0, 2).map((w) => (
              <p key={w} className="mt-1 text-[10px] italic leading-tight text-jarvis-orange/80">⚠ {w}</p>
            ))}
            {analysis.isAromatic && (
              <p className="mt-1 text-[10px] text-jarvis-violet">Aromatic — {analysis.aromaticRings.length} ring(s), Hückel 4n+2.</p>
            )}
            {analysis.uses?.length ? (
              <p className="mt-2 text-[10px] leading-tight text-jarvis-cyan/70">
                <span className="uppercase tracking-widest text-jarvis-cyan/40">Uses: </span>
                {analysis.uses.join(', ')}
              </p>
            ) : null}
            {analysis.hazards?.length ? (
              <p className="mt-1 text-[10px] leading-tight text-jarvis-red/80">
                <span className="uppercase tracking-widest">Hazards: </span>
                {analysis.hazards.join(', ')}
              </p>
            ) : null}
            {analysis.funFact && (
              <p className="mt-2 border-l-2 border-jarvis-orange/60 pl-2 text-[10px] italic leading-tight text-jarvis-amber/90">
                {analysis.funFact}
              </p>
            )}
          </>
        )}
      </div>

      {/* command cheat sheet */}
      <div className="rounded border border-jarvis-cyan/15 bg-black/25 p-2">
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="flex w-full items-center justify-between text-[10px] uppercase tracking-[0.2em] text-jarvis-cyan/60 hover:text-jarvis-cyan"
        >
          Voice commands
          <span>{showHelp ? '−' : '+'}</span>
        </button>
        {showHelp && (
          <ul className="mt-1 max-h-[150px] space-y-1 overflow-y-auto">
            {COMMAND_HELP.map((c) => (
              <li key={c.command} className="text-[10px] leading-tight">
                <span className="font-mono text-jarvis-amber/90">{c.command}</span>
                <span className="text-jarvis-cyan/50"> — {c.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default JarvisPanel;
