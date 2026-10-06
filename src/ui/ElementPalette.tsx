/**
 * ElementPalette.tsx — the left HUD column (spec §6, §11).
 *
 * Tabs:
 *   ELEMENTS  25-element palette (CPK colours, sphere sized by covalent radius)
 *   TOOLS     functional groups, chains, rings, coordination, polymers
 *   LEVELS    campaign levels (only in campaign mode)
 *
 * Interaction is pointer-based ONLY for settings/accessibility; the primary
 * interaction remains gestures — the palette simply sets the "current element /
 * current tool" that a pinch places.
 */

import { useMemo, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useMoleculeStore } from '../store/useMoleculeStore';
import {
  ELEMENT_TABLE,
  EXTENDED_ELEMENTS,
  PALETTE_ELEMENTS,
  elementColor,
  getElement,
} from '../chemistry/elements';
import {
  BUILD_TOOLS,
  COORDINATION_GEOMETRY,
  FUNCTIONAL_GROUPS,
  LIGANDS,
  MONOMERS,
  groupToGraph,
  makeChain,
  makeCoordination,
  makePolymer,
  makeRing,
} from '../chemistry/buildTools';
import { LEVEL_LIST, levelDisplayName, isUnlocked, getLevel } from '../game/campaign';
import { playSfx } from '../jarvis/sfx';
import { graphFromSmilesLite } from '../chemistry/chemistryEngine';

type Tab = 'elements' | 'tools' | 'levels';

const TABS: { id: Tab; label: string }[] = [
  { id: 'elements', label: 'Elements' },
  { id: 'tools', label: 'Tools' },
  { id: 'levels', label: 'Levels' },
];

export function ElementPalette() {
  const [tab, setTab] = useState<Tab>('elements');
  const difficulty = useGameStore((s) => s.settings.difficulty);
  const mode = useGameStore((s) => s.mode);
  const progress = useGameStore((s) => s.progress);
  const setLevel = useGameStore((s) => s.setLevel);
  const selected = useMoleculeStore((s) => s.selectedElement);
  const setSelectedElement = useMoleculeStore((s) => s.setSelectedElement);
  const loadGraph = useMoleculeStore((s) => s.loadGraph);
  const attachFragment = useMoleculeStore((s) => s.attachFragment);
  const clear = useMoleculeStore((s) => s.clear);
  const pushToast = useGameStore((s) => s.pushToast);
  const say = useGameStore((s) => s.say);

  const elements = useMemo(() => {
    const base: string[] = [...PALETTE_ELEMENTS];
    if (difficulty !== 'strict') base.push(...(EXTENDED_ELEMENTS as readonly string[]));
    return base;
  }, [difficulty]);

  const [chainLen, setChainLen] = useState(4);
  const [ringSize, setRingSize] = useState(6);
  const [ringAromatic, setRingAromatic] = useState(true);
  const [ligandId, setLigandId] = useState('ammine');
  const [coordCount, setCoordCount] = useState<2 | 4 | 6>(6);
  const [coordMetal, setCoordMetal] = useState('Co');
  const [monomerId, setMonomerId] = useState('ethene');
  const [polyUnits, setPolyUnits] = useState(5);

  const hostAtom = () => useMoleculeStore.getState().selectedAtomIds[0] ?? null;

  const load = (graph: ReturnType<typeof makeChain> | null, label: string) => {
    if (!graph) {
      pushToast({ kind: 'error', title: 'Cannot build', body: `${label} is not valid.` });
      return;
    }
    clear();
    loadGraph(graph);
    playSfx('place');
    pushToast({ kind: 'success', title: label, body: 'Skeleton dropped on the bench.' });
    say(`Loaded ${label}. Adjust it with gestures.`);
  };

  const attach = (graph: ReturnType<typeof groupToGraph> | null, label: string) => {
    const host = hostAtom();
    if (!graph) return;
    if (!host) {
      load(graph, label);
      return;
    }
    const result = attachFragment(host, graph, 0, { difficulty });
    if (!result.ok) {
      playSfx('reject');
      pushToast({ kind: 'error', title: 'Attachment rejected', body: result.reason });
      say(result.speech ?? result.reason);
      return;
    }
    playSfx('bond');
    pushToast({ kind: 'success', title: `${label} attached` });
    say(`${label} attached.`);
  };

  return (
    <aside className="pointer-events-auto flex h-full w-[268px] flex-col gap-2 overflow-hidden rounded-lg border border-jarvis-cyan/25 bg-[#041821]/88 p-2 font-hud shadow-hud backdrop-blur-md">
      <div className="flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              playSfx('click');
              setTab(t.id);
            }}
            className={`flex-1 rounded px-2 py-1 text-[10px] uppercase tracking-[0.16em] transition ${
              tab === t.id ? 'bg-jarvis-cyan/20 text-jarvis-cyan' : 'text-jarvis-cyan/45 hover:text-jarvis-cyan/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'elements' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-5 gap-1.5">
            {elements.map((sym) => {
              const el = ELEMENT_TABLE[sym];
              if (!el) return null;
              const active = selected === sym;
              // Sphere size tracks covalent radius so the palette reads like the scene.
              const size = 14 + Math.min(16, el.covalentRadius / 8);
              return (
                <button
                  key={sym}
                  type="button"
                  title={`${el.name} · Z=${el.Z} · valence ${el.allowedValences.join('/')} · r=${el.covalentRadius} pm`}
                  onClick={() => {
                    setSelectedElement(sym);
                    playSfx('select');
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded border py-1.5 transition ${
                    active
                      ? 'border-jarvis-cyan bg-jarvis-cyan/15 shadow-[0_0_12px_rgba(56,232,255,0.4)]'
                      : 'border-transparent hover:border-jarvis-cyan/40 hover:bg-jarvis-cyan/5'
                  }`}
                >
                  <span
                    className="rounded-full"
                    style={{
                      width: size,
                      height: size,
                      background: `radial-gradient(circle at 32% 30%, #ffffff88, ${elementColor(sym)} 62%, #00000066)`,
                      boxShadow: active ? `0 0 12px ${elementColor(sym)}` : 'none',
                    }}
                  />
                  <span className="font-mono text-[11px] text-jarvis-cyan">{sym}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 border-t border-jarvis-cyan/15 pt-2 text-[10px] leading-tight text-jarvis-cyan/55">
            Selected: <span className="text-jarvis-cyan">{getElement(selected).name}</span> · valences{' '}
            {getElement(selected).allowedValences.join(', ')}
            {getElement(selected).isNobleGas && ' · inert'}
            {getElement(selected).canExpandOctet && ' · can expand octet'}
          </p>
        </div>
      )}

      {tab === 'tools' && (
        <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-[11px]">
          <Section title="Functional groups">
            <div className="grid grid-cols-4 gap-1">
              {FUNCTIONAL_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => attach(groupToGraph(g), g.label)}
                  className="rounded border border-jarvis-cyan/25 bg-black/25 px-1 py-1 font-mono text-[11px] text-jarvis-cyan/85 hover:bg-jarvis-cyan/15"
                  title={`Attach ${g.name} (${g.label})`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[9px] text-jarvis-cyan/40">Attach to the selected atom, or drop standalone.</p>
          </Section>

          <Section title="Carbon chain">
            <div className="flex items-center gap-2">
              <input type="range" min={2} max={12} value={chainLen} onChange={(e) => setChainLen(+e.target.value)} className="w-full accent-cyan-300" />
              <span className="w-10 text-right font-mono">C{chainLen}</span>
            </div>
            <button type="button" onClick={() => load(makeChain('C', chainLen), `n-alkane C${chainLen}`)} className="mt-1 w-full rounded border border-jarvis-cyan/30 py-1 uppercase tracking-widest hover:bg-jarvis-cyan/15">
              Drop chain
            </button>
          </Section>

          <Section title="Ring builder">
            <div className="flex items-center gap-2">
              <input type="range" min={3} max={8} value={ringSize} onChange={(e) => setRingSize(+e.target.value)} className="w-full accent-cyan-300" />
              <span className="w-12 text-right font-mono">{ringSize}-ring</span>
            </div>
            <label className="mt-1 flex items-center gap-2 text-[10px] text-jarvis-cyan/60">
              <input type="checkbox" checked={ringAromatic} onChange={(e) => setRingAromatic(e.target.checked)} className="accent-cyan-400" />
              aromatic (Hückel 4n+2)
            </label>
            <button type="button" onClick={() => load(makeRing('C', ringSize, ringAromatic), `${ringSize}-membered ${ringAromatic ? 'aromatic' : 'cyclo'} ring`)} className="mt-1 w-full rounded border border-jarvis-cyan/30 py-1 uppercase tracking-widest hover:bg-jarvis-cyan/15">
              Build ring
            </button>
          </Section>

          <Section title="Coordination complex">
            <div className="flex items-center gap-1">
              {['Co', 'Fe', 'Cu', 'Ni', 'Zn', 'Ag'].map((m) => (
                <button key={m} type="button" onClick={() => setCoordMetal(m)} className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${coordMetal === m ? 'bg-jarvis-cyan/20 text-jarvis-cyan' : 'text-jarvis-cyan/50'}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="mt-1 flex gap-1">
              {([2, 4, 6] as const).map((c) => (
                <button key={c} type="button" onClick={() => setCoordCount(c)} className={`flex-1 rounded border border-jarvis-cyan/25 py-0.5 font-mono ${coordCount === c ? 'bg-jarvis-cyan/20' : ''}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {LIGANDS.map((l) => (
                <button key={l.id} type="button" onClick={() => setLigandId(l.id)} className={`rounded border border-jarvis-cyan/20 px-1 py-0.5 font-mono text-[10px] ${ligandId === l.id ? 'bg-jarvis-cyan/20 text-jarvis-cyan' : 'text-jarvis-cyan/55'}`} title={l.name}>
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => load(makeCoordination({ metal: coordMetal, ligand: LIGANDS.find((l) => l.id === ligandId)?.smiles ?? 'N', count: coordCount }), `[${coordMetal}(${LIGANDS.find((l) => l.id === ligandId)?.label ?? 'NH₃'})${coordCount}]`)}
              className="mt-1 w-full rounded border border-jarvis-cyan/30 py-1 uppercase tracking-widest hover:bg-jarvis-cyan/15"
            >
              Build complex
            </button>
            <p className="mt-1 text-[9px] leading-tight text-jarvis-violet/80">
              {COORDINATION_GEOMETRY[coordCount]?.splitting}
            </p>
          </Section>

          <Section title="Polymer">
            <div className="flex items-center gap-2">
              <select value={monomerId} onChange={(e) => setMonomerId(e.target.value)} className="flex-1 rounded border border-jarvis-cyan/25 bg-black/40 px-1 py-0.5 font-mono text-[10px] text-jarvis-cyan">
                {MONOMERS.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <input type="number" min={2} max={10} value={polyUnits} onChange={(e) => setPolyUnits(Math.max(2, Math.min(10, +e.target.value)))} className="w-12 rounded border border-jarvis-cyan/25 bg-black/40 px-1 py-0.5 font-mono text-[10px] text-jarvis-cyan" />
            </div>
            <button
              type="button"
              onClick={() => {
                const smiles = MONOMERS.find((m) => m.id === monomerId)?.smiles ?? 'CC';
                load(makePolymer(smiles, polyUnits), `${MONOMERS.find((m) => m.id === monomerId)?.label} ×${polyUnits}`);
              }}
              className="mt-1 w-full rounded border border-jarvis-cyan/30 py-1 uppercase tracking-widest hover:bg-jarvis-cyan/15"
            >
              Polymerise
            </button>
          </Section>

          <Section title="Quick templates">
            <div className="grid grid-cols-3 gap-1">
              {[['water', 'O'], ['methane', 'C'], ['ammonia', 'N'], ['benzene', 'c1ccccc1'], ['ethanol', 'CCO'], ['glucose', 'OC1COC(O)C(O)C1O']].map(([label, smiles]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    try {
                      load(graphFromSmilesLite(smiles), label);
                    } catch {
                      pushToast({ kind: 'error', title: 'Template failed', body: label });
                    }
                  }}
                  className="rounded border border-jarvis-orange/30 px-1 py-1 text-[10px] uppercase tracking-wider text-jarvis-orange/85 hover:bg-jarvis-orange/15"
                >
                  {label}
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === 'levels' && (
        <div className="flex-1 overflow-y-auto pr-1">
          {LEVEL_LIST.map((l) => {
            const unlocked = isUnlocked(l, progress);
            const rec = progress.levels[l.id];
            const active = mode === 'campaign' && getLevel(useGameStore.getState().levelId)?.id === l.id;
            return (
              <button
                key={l.id}
                type="button"
                disabled={!unlocked}
                onClick={() => {
                  setLevel(l.id);
                  playSfx('select');
                }}
                className={`mb-1 flex w-full items-center justify-between rounded border px-2 py-1 text-left text-[11px] transition ${
                  active ? 'border-jarvis-cyan bg-jarvis-cyan/15' : 'border-jarvis-cyan/15 hover:bg-jarvis-cyan/10'
                } ${unlocked ? '' : 'cursor-not-allowed opacity-35'}`}
              >
                <span className="truncate">{levelDisplayName(l)}</span>
                <span className="ml-2 shrink-0 font-mono text-jarvis-amber">
                  {unlocked ? '★'.repeat(rec?.stars ?? 0) + '☆'.repeat(3 - (rec?.stars ?? 0)) : '🔒'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-jarvis-cyan/15 bg-black/25 p-1.5">
      <h3 className="mb-1 text-[9px] uppercase tracking-[0.2em] text-jarvis-cyan/45">{title}</h3>
      {children}
    </section>
  );
}

export default ElementPalette;
