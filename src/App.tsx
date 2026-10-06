/**
 * App.tsx — the shell that stitches everything together (spec §11).
 *
 * Layout (all layers inside one fixed viewport):
 *   0  webcam backdrop       mirrored, dimmed, blue-tinted (never leaves the device)
 *   1  3D scene              transparent canvas so the video reads through it
 *   2  HUD                   top bar · left palette · right JARVIS · bottom hints
 *   3  overlays              camera gate, calibration, radial menu, scan, settings
 *
 * Camera access is compulsory: while `cameraReady` is false the gate owns the
 * screen. Everything else is mounted underneath it but blurred and inert.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ErrorBoundary from './ui/ErrorBoundary';
import { isWebGLAvailable } from './three/webgl';
import { CameraGate } from './camera/CameraGate';
import { HandOverlay } from './camera/HandOverlay';
import { Scene } from './three/Scene';

import { ElementPalette } from './ui/ElementPalette';
import { GestureHints } from './ui/GestureHints';
import { ModeOverlay } from './ui/ModeOverlay';
import { RadialMenu, type RadialItem } from './ui/RadialMenu';
import { ScanOverlay } from './ui/ScanOverlay';
import { SettingsPanel } from './ui/SettingsPanel';
import { Toasts } from './ui/Toasts';
import { TopBar } from './ui/TopBar';
import JarvisPanel from './jarvis/JarvisPanel';

import { useGestureBridge } from './hooks/useGestureBridge';
import { useVisionLoop } from './hooks/useVisionLoop';

import { useGameStore } from './store/useGameStore';
import { useMoleculeStore } from './store/useMoleculeStore';

import {
  LEVEL_LIST,
  getLevel,
  levelDisplayName,
  nextLevel,
  recordResult,
  targetGraph,
  validateLevel,
} from './game/campaign';
import { answerQuestion, makeQuizRound, type QuizQuestion } from './game/quiz';
import {
  ROUND_SECONDS,
  createTimeAttack,
  rankOf,
  startRound as startTimeAttack,
  submitMolecule,
  tick as tickTimeAttack,
  type TimeAttackState,
} from './game/timeAttack';
import { REACTION_TABLE } from './chemistry/reactionEngine';
import { awardMolecule, awardRejection } from './game/scoring';
import {
  analyzeMolecule,
  findKnownByFormula,
  graphFromSmilesLite,
  structuralFormula,
} from './chemistry/chemistryEngine';
import { scanObject, type ScanResult } from './vision/objectScanner';
import type { GestureEvent, GestureName, HandState } from './vision/gestures.types';

import { parseCommand } from './jarvis/commands';
import { completeLine, idleLine, line } from './jarvis/dialogue';
import { playSfx, setSfxEnabled } from './jarvis/sfx';
import { recognitionSupported, speak, startListening, stopSpeaking } from './jarvis/speech';

export default function App() {
  /* ------------------------------------------------------------ camera */
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const handleReady = useCallback((video: HTMLVideoElement) => {
    setVideoEl(video);
    setCameraReady(true);
  }, []);

  /** Mirror the live stream into the backdrop element (same MediaStream). */
  useEffect(() => {
    const bg = bgVideoRef.current;
    if (!bg || !videoEl?.srcObject) return;
    bg.srcObject = videoEl.srcObject;
    void bg.play().catch(() => undefined);
  }, [videoEl, cameraReady]);

  /* --------------------------------------------------------------- ui */
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [radialOpen, setRadialOpen] = useState(false);
  const [radialCenter, setRadialCenter] = useState<{ x: number; y: number } | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [gesture, setGesture] = useState<GestureName>('NONE');
  const [fingerCount, setFingerCount] = useState(0);
  const [calibrated, setCalibrated] = useState(false);
  const [scanState, setScanState] = useState<{ active: boolean; busy: boolean; result: ScanResult | null }>({
    active: false,
    busy: false,
    result: null,
  });

  /** Probed once: a missing WebGL context must degrade, not blank the screen. */
  const [webglAvailable] = useState(() => isWebGLAvailable());

  const settings = useGameStore((s) => s.settings);
  const mode = useGameStore((s) => s.mode);
  const levelId = useGameStore((s) => s.levelId);
  const elapsedMs = useGameStore((s) => s.elapsedMs);
  const say = useGameStore((s) => s.say);
  const pushToast = useGameStore((s) => s.pushToast);
  const setMode = useGameStore((s) => s.setMode);
  const setLevel = useGameStore((s) => s.setLevel);
  const useHint = useGameStore((s) => s.useHint);
  const markComplete = useGameStore((s) => s.markComplete);
  const restartTimer = useGameStore((s) => s.restartTimer);
  const tick = useGameStore((s) => s.tick);
  const checkAchievements = useGameStore((s) => s.checkAchievements);
  const bumpStats = useGameStore((s) => s.bumpStats);
  const setScore = useGameStore((s) => s.setScore);

  /**
   * A cheap "what is on the bench" signature. Subscribing to the whole store would
   * re-render the HUD on every drag frame; positions deliberately do not appear here.
   */
  const benchSignature = useMoleculeStore(
    (s) =>
      `${s.atoms.length}|${s.atoms.map((a) => a.element).sort().join(',')}|${s.bonds
        .map((b) => b.order)
        .sort()
        .join('')}`,
  );

  /* ------------------------------------------------------------ quiz */
  const [quizRound, setQuizRound] = useState<QuizQuestion[]>(() => makeQuizRound(10));
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizLocked, setQuizLocked] = useState(false);
  const quizQuestion = mode === 'quiz' ? quizRound[quizIndex] ?? null : null;

  /** Load the quiz molecule onto the bench so the player can inspect it. */
  useEffect(() => {
    if (mode !== 'quiz' || !quizQuestion) return;
    useMoleculeStore.getState().clear();
    useMoleculeStore.getState().loadGraph(quizQuestion.graph);
  }, [mode, quizQuestion]);

  const answerQuiz = useCallback(
    (fingers: number): boolean => {
      if (mode !== 'quiz' || !quizQuestion || quizLocked) return false;
      setQuizLocked(true);
      const result = answerQuestion(quizQuestion, fingers);
      playSfx(result.correct ? 'success' : 'reject');
      pushToast({
        kind: result.correct ? 'success' : 'error',
        title: result.correct ? 'Correct' : 'Not quite',
        body: result.feedback,
        ttl: 3200,
      });
      say(result.feedback);
      if (settings.voiceEnabled) speak(result.feedback);
      const stats = useGameStore.getState().stats;
      bumpStats({ quizCorrect: stats.quizCorrect + (result.correct ? 1 : 0) });
      window.setTimeout(() => {
        setQuizLocked(false);
        setQuizIndex((i) => {
          const next = i + 1;
          if (next >= quizRound.length) {
            setQuizRound(makeQuizRound(10));
            return 0;
          }
          return next;
        });
      }, 2200);
      return true;
    },
    [mode, quizQuestion, quizLocked, pushToast, say, settings.voiceEnabled, bumpStats, quizRound.length],
  );

  /* ------------------------------------------------------ time attack */
  const [attack, setAttack] = useState<TimeAttackState | null>(null);

  const startAttack = useCallback(() => {
    setAttack(startTimeAttack(createTimeAttack()));
    restartTimer();
    useMoleculeStore.getState().clear();
    playSfx('levelUp');
    say('Sixty seconds on the clock. Go.');
    if (settings.voiceEnabled) speak('Sixty seconds on the clock. Go.');
  }, [restartTimer, say, settings.voiceEnabled]);

  /* ------------------------------------------------------ vision loop */
  /** Set after `useGestureBridge` runs; the loop only ever calls into the ref. */
  const bridgeRef = useRef<{ onEvents: (e: GestureEvent[], s: readonly HandState[]) => void } | null>(null);

  const vision = useVisionLoop({
    video: cameraReady ? videoEl : null,
    hz: 30,
    onEvents: (events, states) => {
      if (!events.length) return;
      const last = events[events.length - 1];
      setGesture(last.name);
      if (last.name === 'FINGER_COUNT') setFingerCount(Math.round(last.value ?? 0));
      if (!calibrated && (last.name === 'PINCH' || last.name === 'POINT')) setCalibrated(true);
      bridgeRef.current?.onEvents(events, states);
    },
  });

  /** Push FPS/inference numbers into the store once per second. */
  useEffect(() => {
    useGameStore.getState().setTiming(vision.fps, vision.inferenceMs);
  }, [vision.fps, vision.inferenceMs]);

  /** Slow pointer sampling for the radial menu (avoids 60 Hz re-renders). */
  useEffect(() => {
    if (!cameraReady) return;
    const id = window.setInterval(() => {
      const p = vision.pointer();
      setPointerPos(p);
      const states = vision.states();
      setFingerCount((prev) => {
        const n = states.reduce((max, s) => Math.max(max, s.fingerCount), 0);
        return n === prev ? prev : n;
      });
    }, 80);
    return () => window.clearInterval(id);
  }, [cameraReady, vision]);

  /* ----------------------------------------------------- scan mode */
  const runScan = useCallback(async () => {
    if (!videoEl || scanState.busy) return;
    setScanState({ active: true, busy: true, result: null });
    playSfx('scan');
    const result = await scanObject(videoEl);
    setScanState({ active: true, busy: false, result });
    playSfx(result.molecule ? 'success' : 'reject');
    pushToast({
      kind: result.molecule ? 'success' : 'warn',
      title: result.molecule ? result.molecule.name : 'Nothing recognised',
      body: result.message,
      ttl: 4200,
    });
    say(result.message);
    if (settings.voiceEnabled) speak(result.message);
    if (result.molecule?.smiles) {
      const stats = useGameStore.getState().stats;
      bumpStats({ scanHits: stats.scanHits + 1 });
      // Pull the molecule out of the object: it materialises on the bench.
      try {
        const graph = graphFromSmilesLite(result.molecule.smiles);
        window.setTimeout(() => {
          const store = useMoleculeStore.getState();
          store.clear();
          store.loadGraph(graph);
        }, 500);
      } catch {
        /* keep the bench as it was */
      }
    }
  }, [videoEl, scanState.busy, pushToast, say, settings.voiceEnabled, bumpStats]);

  /* ------------------------------------------------- gesture bridge */
  const bridge = useGestureBridge({
    pointer: vision.pointer,
    pinch: vision.pinch,
    onPalmHold: (position) => {
      setRadialCenter(position);
      setRadialOpen(true);
      if (mode === 'scan') void runScan();
    },
    onFingerCount: answerQuiz,
    onSubmit: () => {
      if (mode !== 'timeAttack' || !attack?.running) return false;
      const { state, attempt } = submitMolecule(attack, useMoleculeStore.getState().toGraph());
      setAttack(state);
      if (attempt.ok) {
        playSfx('success');
        pushToast({ kind: 'success', title: `+${attempt.points}`, body: attempt.reason, ttl: 2200 });
        useMoleculeStore.getState().clear();
      } else {
        playSfx('reject');
        pushToast({ kind: 'warn', title: 'Not scored', body: attempt.reason, ttl: 2400 });
        say(attempt.reason);
      }
      return true;
    },
    onSwipe: (dir) => {
      const store = useMoleculeStore.getState();
      if (dir === 'left') {
        store.undo();
        playSfx('whoosh');
        say(line('undo'));
      } else {
        store.redo();
        playSfx('whoosh');
        say('Redone.');
      }
    },
    onBondOrderChange: (order) => {
      const store = useMoleculeStore.getState();
      const bondId = store.selectedBondId ?? store.bonds[store.bonds.length - 1]?.id ?? null;
      if (!bondId) return;
      const bond = store.bonds.find((b) => b.id === bondId);
      if (!bond || bond.order === order) return;
      const check = store.cycleBondOrder(bondId, { difficulty: settings.difficulty });
      if (!check.ok) {
        playSfx('reject');
        pushToast({ kind: 'error', title: 'Bond order rejected', body: check.reason, ttl: 2600 });
      }
    },
  });

  bridgeRef.current = bridge;

  /** Release drags when no hand is pinching any more. */
  useEffect(() => {
    if (!cameraReady) return;
    const id = window.setInterval(() => {
      const states = vision.states();
      if (!states.some((s) => s.pinching)) bridge.releaseDrag();
    }, 120);
    return () => window.clearInterval(id);
  }, [cameraReady, vision, bridge]);

  /* --------------------------------------------------- the game clock */
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      tick(now);

      if (mode === 'timeAttack' && attack?.running) {
        const next = tickTimeAttack(attack, now);
        if (next !== attack) setAttack(next);
        if (next.finished && attack.running) {
          playSfx('levelUp');
          const rank = rankOf(next.score.score);
          pushToast({ kind: 'success', title: `Time! ${next.score.score} points`, body: `Rank: ${rank}`, ttl: 6000 });
          say(`Time. ${next.score.score} points. Rank ${rank}.`);
          if (settings.voiceEnabled) speak(`Time. ${next.score.score} points. Rank ${rank}.`);
          const stats = useGameStore.getState().stats;
          bumpStats({ bestStreak: Math.max(stats.bestStreak, next.score.bestStreak) });
          setScore(next.score);
        }
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [mode, attack, tick, pushToast, say, settings.voiceEnabled, bumpStats]);

  /* --------------------------------------- campaign: target + validation */
  const level = useMemo(() => getLevel(levelId), [levelId]);

  /** Ghost guide skeleton for the current level (spec §8). */
  useEffect(() => {
    if (mode !== 'campaign' || !level) return;
    const store = useMoleculeStore.getState();
    if (level.ghost) store.setGhost(targetGraph(level));
    else store.setGhost(null);
    restartTimer();
    say(`${levelDisplayName(level)}. ${level.teach}`);
    if (settings.voiceEnabled) speak(`${levelDisplayName(level)}. ${level.teach}`);
  }, [mode, level, restartTimer, say, settings.voiceEnabled]);

  /**
   * Debounced bench validation (spec §8, §10).
   *
   * JARVIS only speaks when you stop building for ~900 ms, so he does not narrate
   * every intermediate. Campaign completion and achievement checks hang off the same
   * debounce; Time Attack scores on the thumbs-up gesture instead (onSubmit).
   */
  const announcedRef = useRef(new Set<string>());

  useEffect(() => {
    if (!benchSignature || benchSignature.startsWith('0|')) return;
    const id = window.setTimeout(() => {
      const store = useMoleculeStore.getState();
      const graph = store.toGraph();
      const analysis = analyzeMolecule(graph, { difficulty: settings.difficulty });
      const key = structuralFormula(graph);

      // completion narration + stats (once per distinct formula)
      if (analysis.fragmentCount === 1 && graph.atoms.length >= 2 && !announcedRef.current.has(key)) {
        announcedRef.current.add(key);
        if (analysis.stability.status === 'impossible') {
          playSfx('reject');
          pushToast({ kind: 'error', title: 'Not a stable molecule', body: analysis.stability.reason, ttl: 3600 });
          say(analysis.stability.reason);
          if (settings.voiceEnabled) speak(analysis.stability.reason);
          setScore(awardRejection(useGameStore.getState().score));
        } else {
          const summary = completeLine(analysis);
          say(summary);
          if (settings.voiceEnabled) speak(summary);
          // Hypervalent: any atom whose shared bond order exceeds an octet.
          // Coordination: a metal centre carrying dative bonds.
          // Hypervalent: any atom whose shared bond order exceeds an octet.
          // Coordination: a metal centre carrying dative bonds.
          const hypervalent = analysis.atoms.some((a) => a.bondSum > 8 + 0.01);
          const coordination = analysis.atoms.some((a) => a.dative > 0);
          const stats = useGameStore.getState().stats;
          setScore(awardMolecule(useGameStore.getState().score, analysis.stability.score, 0));
          bumpStats({
            moleculesBuilt: stats.moleculesBuilt + 1,
            stableMolecules: stats.stableMolecules + (analysis.stability.status === 'stable' ? 1 : 0),
            aromaticBuilt: stats.aromaticBuilt + (analysis.isAromatic ? 1 : 0),
            hypervalentBuilt: stats.hypervalentBuilt + (hypervalent ? 1 : 0),
            coordinationBuilt: stats.coordinationBuilt + (coordination ? 1 : 0),
            radicalsBuilt: stats.radicalsBuilt + (analysis.stability.status === 'radical' ? 1 : 0),
          });
        }
        checkAchievements();
      }

      // campaign validation
      if (mode !== 'campaign' || !level) return;
      const result = validateLevel(level, graph, elapsedMs, useGameStore.getState().hintsUsed);
      if (!result.complete) return;

      const stars = result.stars;
      markComplete(level, stars, elapsedMs);
      const progress = recordResult(
        useGameStore.getState().progress,
        level,
        result,
        elapsedMs,
        useGameStore.getState().hintsUsed,
      );
      useGameStore.setState({ progress });
      playSfx('levelUp');
      pushToast({
        kind: 'success',
        title: `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} ${levelDisplayName(level)} complete`,
        body: `${(elapsedMs / 1000).toFixed(1)} s`,
        ttl: 5000,
      });
      say(`${line('levelComplete')} ${stars} ${stars === 1 ? 'star' : 'stars'}.`);
      if (settings.voiceEnabled) speak(`${line('levelComplete')} ${stars} stars.`);
      const stats = useGameStore.getState().stats;
      bumpStats({ levelsCompleted: stats.levelsCompleted + 1, stars: stats.stars + stars });
      checkAchievements().forEach((id) => {
        playSfx('achievement');
        pushToast({ kind: 'achievement', title: 'Achievement unlocked', body: id, ttl: 5000 });
      });
      window.setTimeout(() => {
        const next = nextLevel(level.id);
        if (next) setLevel(next.id);
        useMoleculeStore.getState().clear();
      }, 2600);
    }, 900);
    return () => window.clearTimeout(id);
    // The signature is the trigger; everything else is read from the stores.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benchSignature, mode, level?.id]);

  /** Clear the "already announced" set when the bench is emptied. */
  useEffect(() => {
    if (!benchSignature || benchSignature.startsWith('0|')) announcedRef.current.clear();
  }, [benchSignature]);

  /* ----------------------------------------------------------- voice in */
  const commandRef = useRef<(text: string) => void>(() => undefined);
  useEffect(() => {
    if (!cameraReady || !settings.voiceEnabled || !recognitionSupported()) return;
    const handle = startListening({
      wakeWord: true,
      lang: 'en-GB',
      onFinal: (text) => {
        say(text, 'user');
        commandRef.current(text);
      },
    });
    return () => handle?.stop();
  }, [cameraReady, settings.voiceEnabled, say]);

  const handleCommand = useCallback(
    (raw: string) => {
      const command = parseCommand(raw);
      const store = useMoleculeStore.getState();
      switch (command.kind) {
        case 'build': {
          if (!command.smiles) {
            say(`I do not have ${command.target} in my database, sir.`);
            if (settings.voiceEnabled) speak(`I do not have ${command.target} in my database, sir.`);
            return;
          }
          try {
            store.clear();
            store.loadGraph(graphFromSmilesLite(command.smiles));
            store.setGhost(null);
            playSfx('levelUp');
            say(`Here is ${command.target}. Fill in the rest yourself.`);
            if (settings.voiceEnabled) speak(`Here is ${command.target}. Fill in the rest yourself.`);
          } catch {
            say('That one defeated even me.');
          }
          return;
        }
        case 'orbitals':
          store.setOrbitals(true);
          say('Orbitals online.');
          return;
        case 'hideOrbitals':
          store.setOrbitals(false);
          return;
        case 'hybridization': {
          say(`Hybridization is ${store.atoms.length ? 'shown on the analysis card' : 'unknown — the bench is empty'}.`);
          return;
        }
        case 'scan':
          if (mode !== 'scan') setMode('scan');
          void runScan();
          return;
        case 'clear':
          store.clear();
          playSfx('whoosh');
          say(line('clear'));
          return;
        case 'next': {
          const next = nextLevel(levelId);
          if (next) setLevel(next.id);
          store.clear();
          return;
        }
        case 'undo':
          store.undo();
          return;
        case 'redo':
          store.redo();
          return;
        case 'element':
          store.setSelectedElement(command.symbol);
          playSfx('select');
          return;
        case 'reactionMode':
          setMode('reaction');
          return;
        case 'sandbox':
          setMode('sandbox');
          return;
        case 'campaign':
          setMode('campaign');
          return;
        case 'quiz':
          setMode('quiz');
          return;
        case 'timeAttack':
          setMode('timeAttack');
          startAttack();
          return;
        case 'answer':
          answerQuiz(command.value);
          return;
        case 'explainBond': {
          const bond = store.bonds.find((b) => b.id === store.selectedBondId) ?? store.bonds[0];
          if (!bond) {
            say('There is no bond on the bench yet.');
            return;
          }
          const description =
            bond.order === 1
              ? 'A sigma bond: head-on overlap of two orbitals.'
              : bond.order === 2
                ? 'One sigma bond plus one pi bond from sideways p overlap.'
                : 'One sigma bond plus two pi bonds, as in a triple bond.';
          say(description);
          if (settings.voiceEnabled) speak(description);
          return;
        }
        case 'help':
          say('Say "build methane", "show orbitals", "scan this", "clear" or "next level".');
          return;
        default:
          say('I did not catch that, sir. Say "help" for the command list.');
          return;
      }
    },
    [answerQuiz, levelId, mode, runScan, say, setLevel, setMode, settings.voiceEnabled, startAttack],
  );

  commandRef.current = handleCommand;

  /* -------------------------------------------------------- idle lines */
  useEffect(() => {
    if (!cameraReady) return;
    let long = false;
    const shortTimer = window.setTimeout(() => {
      say(idleLine(false));
      long = true;
    }, 25_000);
    const longTimer = window.setInterval(() => {
      if (long) say(idleLine(true));
    }, 60_000);
    return () => {
      window.clearTimeout(shortTimer);
      window.clearInterval(longTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraReady, benchSignature]);

  /* ------------------------------------------------------- keyboard/mouse
   * Allowed ONLY for settings & accessibility (spec §12). Never for building. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const store = useMoleculeStore.getState();
      const combo = e.ctrlKey || e.metaKey;
      if (combo && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.shiftKey ? store.redo() : store.undo();
        return;
      }
      switch (e.key.toLowerCase()) {
        case ',':
          setSettingsOpen((v) => !v);
          break;
        case 'o':
          store.setOrbitals(!store.showOrbitals);
          break;
        case 'l':
          store.setLabels(!store.showLabels);
          break;
        case 'g':
          store.setGhost(store.ghost ? null : level ? targetGraph(level) : null);
          break;
        case 'escape':
          setRadialOpen(false);
          setScanState({ active: false, busy: false, result: null });
          setSettingsOpen(false);
          break;
        case 'm':
          if (settings.voiceEnabled) stopSpeaking();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [level, settings.voiceEnabled]);

  /** Keep the SFX toggle in sync with settings. */
  useEffect(() => setSfxEnabled(settings.sfx), [settings.sfx]);

  /* ------------------------------------------------------ radial menu */
  const radialItems: RadialItem[] = useMemo(
    () => [
      {
        id: 'ghost',
        label: 'ghost',
        icon: '◌',
        run: () => {
          const store = useMoleculeStore.getState();
          store.setGhost(store.ghost ? null : level ? targetGraph(level) : null);
        },
        disabled: !level,
      },
      { id: 'orbitals', label: 'orbitals', icon: '◍', run: () => useMoleculeStore.getState().setOrbitals(!useMoleculeStore.getState().showOrbitals) },
      { id: 'explode', label: 'explode', icon: '✺', run: () => useMoleculeStore.getState().setExplode(useMoleculeStore.getState().explode > 0.05 ? 0 : 0.7) },
      { id: 'undo', label: 'undo', icon: '↶', run: () => useMoleculeStore.getState().undo() },
      { id: 'clear', label: 'clear', icon: '✕', run: () => useMoleculeStore.getState().clear() },
      { id: 'hint', label: 'hint', icon: '?', run: () => { useHint(); if (level) say(level.hint); }, disabled: !level },
      { id: 'scan', label: 'scan', icon: '◎', run: () => void runScan() },
      { id: 'settings', label: 'settings', icon: '⚙', run: () => setSettingsOpen(true) },
    ],
    [level, runScan, say, useHint],
  );

  /* ------------------------------------------------------------ render */
  return (
    <div className={`relative h-full w-full overflow-hidden ${settings.highContrast ? 'high-contrast' : ''}`}>
      {/* layer 0 — webcam backdrop */}
      <video
        ref={bgVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          transform: settings.mirror ? 'scaleX(-1)' : undefined,
          filter: 'brightness(0.5) saturate(0.65) hue-rotate(165deg) blur(1px)',
          opacity: cameraReady ? 0.85 : 0,
        }}
      />
      <div className="absolute inset-0 bg-scanline opacity-20" />

      {/* layer 1 — 3D hologram (never allowed to take the HUD down with it) */}
      <div className="absolute inset-0">
        {webglAvailable ? (
          <ErrorBoundary label="3D renderer" compact>
            <Scene transparent />
          </ErrorBoundary>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6">
            <div className="max-w-[420px] rounded-lg border border-jarvis-orange/40 bg-black/55 p-4 text-center font-hud">
              <p className="text-[13px] uppercase tracking-[0.24em] text-jarvis-orange">3D stage offline</p>
              <p className="mt-1 text-[12px] leading-snug text-jarvis-cyan/75">
                WebGL is unavailable in this browser, so the hologram is disabled. Gestures,
                chemistry rules, JARVIS and every mode still work — enable hardware
                acceleration (or try Chrome/Edge) to bring the molecules back.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* layer 2 — HUD */}
      <div className="pointer-events-none absolute inset-0 flex flex-col gap-2 p-3">
        <TopBar cameraLive={cameraReady && vision.ready} />

        <div className="flex min-h-0 flex-1 gap-2">
          {/* On narrow screens the side panels step aside so the stage stays usable. */}
          <div className="hidden min-h-0 md:flex">
            <ElementPalette />
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-between gap-2">
            <ModeOverlay
              quizQuestion={quizQuestion}
              quizIndex={quizIndex}
              quizTotal={quizRound.length}
              timeAttack={
                attack
                  ? {
                      score: attack.score.score,
                      built: attack.built.map((b) => ({ formula: b.formula, name: b.name, points: b.points })),
                      finished: attack.finished,
                      rank: rankOf(attack.score.score),
                    }
                  : null
              }
              onNextLevel={() => {
                const next = nextLevel(levelId);
                if (next) setLevel(next.id);
                useMoleculeStore.getState().clear();
              }}
              onUseHint={() => {
                useHint();
                if (level) {
                  say(level.hint);
                  if (settings.voiceEnabled) speak(level.hint);
                }
              }}
              onToggleGhost={() => {
                const store = useMoleculeStore.getState();
                store.setGhost(store.ghost ? null : level ? targetGraph(level) : null);
              }}
              onStartRound={startAttack}
              onLoadReaction={(index) => {
                const reaction = REACTION_TABLE[index];
                if (!reaction) return;
                const store = useMoleculeStore.getState();
                store.clear();
                const first = reaction.reactants[0];
                const known = first ? findKnownByFormula(first.formula) : undefined;
                if (known?.smiles) {
                  try {
                    store.loadGraph(graphFromSmilesLite(known.smiles));
                  } catch {
                    /* ignore */
                  }
                }
                say(`Loaded ${reaction.name}. Now build ${reaction.reactants[1]?.formula ?? 'the other reactant'} and collide them.`);
                if (settings.voiceEnabled) speak(`Loaded ${reaction.name}.`);
              }}
            />

            {/* webcam preview + skeleton, bottom-left of the stage */}
            <div className="pointer-events-auto relative h-[168px] w-[298px] overflow-hidden rounded-lg border border-jarvis-cyan/30 bg-black/50 shadow-hud">
              <video
                ref={(node) => {
                  if (!node || !videoEl?.srcObject) return;
                  if (node.srcObject !== videoEl.srcObject) {
                    node.srcObject = videoEl.srcObject;
                    void node.play().catch(() => undefined);
                  }
                }}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: settings.mirror ? 'scaleX(-1)' : undefined, filter: 'brightness(0.85) saturate(0.8) hue-rotate(150deg)' }}
              />
              {settings.showSkeleton && (
                <HandOverlay getStates={vision.states} mirror={settings.mirror} visible={cameraReady} />
              )}
              <div className="absolute left-1 top-1 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-jarvis-cyan/70">
                <span className={`h-1.5 w-1.5 rounded-full ${vision.ready ? 'bg-jarvis-green' : 'bg-jarvis-orange'}`} />
                {vision.ready ? `tracking ${vision.hands}` : 'loading model…'}
              </div>
              <div className="absolute bottom-1 left-1 font-mono text-[9px] text-jarvis-cyan/50">
                {vision.fps} fps · {vision.inferenceMs.toFixed(1)} ms/frame
              </div>
              {vision.error && (
                <p className="absolute inset-x-1 bottom-6 font-mono text-[9px] text-jarvis-red">{vision.error}</p>
              )}
            </div>
          </div>

          <div className="hidden min-h-0 lg:flex">
            <JarvisPanel />
          </div>
        </div>

        <GestureHints gesture={gesture} fingerCount={fingerCount} />
      </div>

      {/* layer 3 — overlays */}
      {!calibrated && cameraReady && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
          <div className="rounded-lg border border-jarvis-cyan/40 bg-black/55 px-6 py-4 text-center font-hud backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-jarvis-cyan">Pinch to calibrate</p>
            <p className="mt-1 font-mono text-[11px] text-jarvis-cyan/60">
              Hold your hand up, then pinch your thumb and index finger together.
            </p>
          </div>
        </div>
      )}

      <RadialMenu
        items={radialItems}
        center={radialCenter}
        pointer={pointerPos}
        open={radialOpen}
        onClose={() => setRadialOpen(false)}
      />

      <ScanOverlay
        video={videoEl}
        active={scanState.active}
        busy={scanState.busy}
        result={scanState.result}
        onClose={() => setScanState({ active: false, busy: false, result: null })}
      />

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Toasts />

      {/* the gate owns the screen until the camera is live */}
      <CameraGate onReady={handleReady} dismissed={cameraReady} />

      {/* privacy banner */}
      {cameraReady && (
        <p className="pointer-events-none fixed bottom-1 right-3 z-20 font-mono text-[9px] uppercase tracking-[0.18em] text-jarvis-green/70">
          Video never leaves your device · {LEVEL_LIST.length} levels · {ROUND_SECONDS}s attack
        </p>
      )}
    </div>
  );
}
