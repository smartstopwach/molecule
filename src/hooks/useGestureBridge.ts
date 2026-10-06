/**
 * useGestureBridge.ts — where gestures become chemistry (spec §3 → §4/§6/§7/§10).
 *
 * Discrete events are handled in `onEvents`; continuous behaviour (cursor tracking,
 * dragging, the AR palm anchor) runs in a single rAF loop. Nothing here touches
 * React state directly except through the Zustand stores, so the HUD re-renders only
 * when something meaningful changes.
 */

import { useCallback, useEffect, useRef } from 'react';
import type { GestureEvent, HandState } from '../vision/gestures.types';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { useGameStore } from '../store/useGameStore';
import { setCursor, pushBurst, updateArAnchorFromPalm } from '../three/Scene';
import { pickAtom, placementPoint, screenToWorld } from '../three/sceneBridge';
import { rotateCamera, zoomCamera, resetCamera, setArAnchor } from '../three/cameraRig';
import { playSfx } from '../jarvis/sfx';
import { speak } from '../jarvis/speech';
import { line, rejectionLine } from '../jarvis/dialogue';
import { attemptReaction, formatEquation } from '../chemistry/reactionEngine';
import { structuralFormula } from '../chemistry/chemistryEngine';
import { makeRing } from '../chemistry/buildTools';
import { awardRejection, awardSuccess } from '../game/scoring';
import { Vector3 } from 'three';

export interface GestureBridgeOptions {
  /** Normalised pointer/pinch accessors from the vision loop. */
  pointer: (i?: number) => { x: number; y: number } | null;
  pinch: (i?: number) => { x: number; y: number } | null;
  /** Called when the open-palm hold completes (Scan Mode + radial menu). */
  onPalmHold: (position: { x: number; y: number }) => void;
  /** FINGER_COUNT answers the quiz when one is active; returns true if consumed. */
  onFingerCount: (n: number) => boolean;
  /** THUMBS_UP = "lock this molecule in". Returns true when it was consumed. */
  onSubmit?: () => boolean;
  onSwipe: (dir: 'left' | 'right') => void;
  onBondOrderChange: (order: number) => void;
}

const tmpVec = new Vector3();

export function useGestureBridge(options: GestureBridgeOptions) {
  const opts = useRef(options);
  opts.current = options;

  /** The atom currently being dragged, and where the drag started. */
  const dragRef = useRef<{ id: string; offset: [number, number, number] } | null>(null);
  const hoverRef = useRef<string | null>(null);
  const lastPinchRelease = useRef(0);
  const explodeAccum = useRef(0);

  const speakIfEnabled = useCallback((text: string, opts2?: Parameters<typeof speak>[1]) => {
    const { settings, say } = useGameStore.getState();
    say(text);
    if (settings.voiceEnabled) speak(text, opts2);
  }, []);

  /** Continuous loop: cursor, hover highlight, dragging, AR palm anchor. */
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = opts.current.pointer();
      if (!p) return;

      const mol = useMoleculeStore.getState();
      const hovered = pickAtom(p.x, p.y);
      hoverRef.current = hovered?.id ?? null;
      if (mol.hoveredAtomId !== hoverRef.current) mol.setHovered(hoverRef.current);

      const world = placementPoint(p.x, p.y);
      if (world) {
        const pinch = opts.current.pinch();
        const state = pinchingState(pinch !== null, hovered !== null, dragRef.current !== null);
        setCursor([world.x, world.y, world.z], state, true);
      }

      // dragging: follow the cursor on the working plane
      const drag = dragRef.current;
      if (drag && world) {
        mol.moveAtom(drag.id, [world.x + drag.offset[0], world.y + drag.offset[1], world.z + drag.offset[2]]);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /** Discrete gesture events. */
  const onEvents = useCallback(
    (events: GestureEvent[], states: readonly HandState[]) => {
      const mol = useMoleculeStore.getState();
      const game = useGameStore.getState();
      const ruleOpts = { difficulty: game.settings.difficulty, ionic: game.settings.ionicMode };

      for (const event of events) {
        switch (event.name) {
          /* ------------------------------------------------ place / grab */
          case 'PINCH': {
            const hovered = hoverRef.current;
            if (hovered) {
              const atom = mol.atoms.find((a) => a.id === hovered);
              if (atom) {
                dragRef.current = { id: atom.id, offset: [0, 0, 0] };
                mol.setGrabbed(atom.id);
                mol.selectAtom(atom.id);
                playSfx('select');
              }
            } else {
              const world = placementPoint(event.position.x, event.position.y);
              if (world) {
                const result = mol.addAtom(
                  mol.selectedElement,
                  [world.x, world.y, world.z],
                  ruleOpts,
                );
                if (result.ok) {
                  playSfx('place');
                } else {
                  playSfx('reject');
                  game.pushToast({ kind: 'error', title: 'Placement rejected', body: result.reason, ttl: 2600 });
                  game.setScore(awardRejection(game.score));
                  speakIfEnabled(rejectionLine(result.reason ?? 'That placement is not allowed.'));
                }
              }
            }
            break;
          }

          /* ------------------------------------------------- pinch release */
          case 'PINCH_HOLD': {
            const drag = dragRef.current;
            const hovered = hoverRef.current;
            if (drag && hovered && hovered !== drag.id) {
              const check = mol.tryBond(drag.id, hovered, 1, 'covalent', ruleOpts);
              if (check.ok) {
                playSfx('bond');
                game.setScore(awardSuccess(game.score));
              } else {
                playSfx('reject');
                game.pushToast({ kind: 'error', title: 'Bond rejected', body: check.reason, ttl: 2800 });
                game.setScore(awardRejection(game.score));
                speakIfEnabled(rejectionLine(check.reason, mol.atoms.find((a) => a.id === drag.id)?.element));
              }
            } else if (hovered) {
              // hold on a single atom → show its orbitals (σ/π overlap)
              mol.selectAtom(hovered);
              mol.setOrbitals(true);
              speakIfEnabled(`Showing ${mol.atoms.find((a) => a.id === hovered)?.element} orbitals.`);
            }
            // Reaction Lab: a pinch-hold that ends near another molecule collides.
            if (game.mode === 'reaction' && drag) tryCollision(speakIfEnabled);
            break;
          }

          case 'DOUBLE_PINCH': {
            const target = mol.selectedBondId ?? bondAtHand(mol, hoverRef.current);
            if (target) {
              const check = mol.cycleBondOrder(target, ruleOpts);
              if (check.ok) playSfx('bond');
              else {
                playSfx('reject');
                game.pushToast({ kind: 'error', title: 'Cannot change order', body: check.reason, ttl: 2600 });
                speakIfEnabled(rejectionLine(check.reason));
              }
            }
            break;
          }

          /* ---------------------------------------------------- open palm */
          case 'OPEN_PALM': {
            opts.current.onPalmHold(event.position);
            // AR touch: a grabbed molecule rides the open palm.
            if (mol.grabbedAtomId) {
              const anchor = screenToWorld(event.position.x, event.position.y);
              if (anchor) setArAnchor(true, tmpVec.copy(anchor), mol.grabbedAtomId);
              updateArAnchorFromPalm(event.position.x, event.position.y);
            }
            break;
          }

          case 'FIST': {
            const hovered = hoverRef.current;
            if (hovered) {
              mol.deleteAtom(hovered);
              hoverRef.current = null;
              playSfx('whoosh');
              speakIfEnabled('Atom removed.');
            } else {
              resetCamera();
              playSfx('whoosh');
            }
            break;
          }

          case 'SWIPE_LEFT':
            opts.current.onSwipe('left');
            break;
          case 'SWIPE_RIGHT':
            opts.current.onSwipe('right');
            break;

          case 'TWO_HAND_ROTATE':
            rotateCamera((event.value ?? 0) * 1.4);
            break;

          case 'TWO_HAND_ZOOM':
            zoomCamera((event.value ?? 0) * 2.2);
            break;

          case 'TWO_HAND_SPREAD': {
            explodeAccum.current = Math.min(1, Math.max(0, explodeAccum.current + (event.value ?? 0)));
            mol.setExplode(explodeAccum.current);
            mol.setOrbitals(explodeAccum.current > 0.05);
            break;
          }

          case 'FINGER_COUNT': {
            const n = Math.round(event.value ?? 0);
            if (n >= 1 && n <= 5) {
              const consumed = opts.current.onFingerCount(n);
              if (!consumed) opts.current.onBondOrderChange(n);
            }
            break;
          }

          case 'CIRCLE': {
            const ring = makeRing(mol.selectedElement, 6, mol.selectedElement === 'C');
            const world = placementPoint(event.position.x, event.position.y);
            if (world) {
              mol.loadGraph(ring);
              playSfx('bond');
              speakIfEnabled(`Six-membered ring built. ${event.value && event.value < 0 ? 'Anti-clockwise.' : 'Clockwise.'}`);
            }
            break;
          }

          case 'PEACE':
            mol.setOrbitals(!mol.showOrbitals);
            break;

          case 'THUMBS_UP':
            if (!opts.current.onSubmit?.()) speakIfEnabled(line('witty'));
            break;

          default:
            break;
        }
      }

      // Two hands present and spread apart → exploded view; together → collapse.
      if (states.length === 2) {
        const [a, b] = states;
        const separation = Math.hypot(a.palm.x - b.palm.x, a.palm.y - b.palm.y);
        if (separation > 0.55) {
          mol.setExplode(Math.min(1, (separation - 0.55) * 3));
          mol.setOrbitals(true);
        } else if (separation < 0.25) {
          mol.setExplode(0);
        }
      }
    },
    [speakIfEnabled],
  );

  /** Called whenever a pinch ends (any hand) so drags release cleanly. */
  const releaseDrag = useCallback(() => {
    const mol = useMoleculeStore.getState();
    if (dragRef.current) {
      lastPinchRelease.current = performance.now();
      setArAnchor(false);
      mol.setGrabbed(null);
      dragRef.current = null;
    }
  }, []);

  return { onEvents, releaseDrag, hoverRef };
}

/* ------------------------------------------------------------- helpers */

function pinchingState(pinching: boolean, hovering: boolean, dragging: boolean) {
  if (dragging) return 'pinch' as const;
  if (pinching) return hovering ? ('build' as const) : ('pinch' as const);
  return hovering ? ('hover' as const) : ('idle' as const);
}

/** The bond touching the hovered atom (used by DOUBLE_PINCH). */
function bondAtHand(mol: ReturnType<typeof useMoleculeStore.getState>, atomId: string | null): string | null {
  if (!atomId) return mol.selectedBondId;
  const bond = mol.bonds.find((b) => b.a === atomId || b.b === atomId);
  return bond?.id ?? mol.selectedBondId;
}

/** Reaction Lab: collide the grabbed molecule with whatever it is touching. */
function tryCollision(speak: (text: string) => void) {
  const mol = useMoleculeStore.getState();
  const game = useGameStore.getState();
  const grabbed = mol.grabbedAtomId;
  if (!grabbed) return;

  // Split the workspace into connected fragments.
  const groups = fragmentsOf(mol);
  const mine = groups.find((g) => g.has(grabbed));
  if (!mine || groups.length < 2) return;

  // find the closest pair of atoms between my fragment and any other
  let best: { other: Set<string>; distance: number; at: [number, number, number] } | null = null;
  for (const group of groups) {
    if (group === mine) continue;
    for (const id of mine) {
      const a = mol.atoms.find((x) => x.id === id);
      if (!a) continue;
      for (const id2 of group) {
        const b = mol.atoms.find((x) => x.id === id2);
        if (!b) continue;
        const d = Math.hypot(
          a.position[0] - b.position[0],
          a.position[1] - b.position[1],
          a.position[2] - b.position[2],
        );
        if (!best || d < best.distance) {
          best = {
            other: group,
            distance: d,
            at: [(a.position[0] + b.position[0]) / 2, (a.position[1] + b.position[1]) / 2, (a.position[2] + b.position[2]) / 2],
          };
        }
      }
    }
  }

  if (!best || best.distance > 1.9) return;

  const graphA = subgraphOf(mol, mine);
  const graphB = subgraphOf(mol, best.other);
  const attempt = attemptReaction(graphA, graphB, { difficulty: game.settings.difficulty });
  game.bumpStats({ reactionsRun: game.stats.reactionsRun + 1 });

  if (!attempt.ok || !attempt.reaction) {
    playSfx('reject');
    game.pushToast({ kind: 'error', title: 'No reaction', body: attempt.reason ?? '', ttl: 3200 });
    speak(attempt.jarvis ?? attempt.reason ?? 'Nothing happens.');
    return;
  }

  const reaction = attempt.reaction;
  const exothermic = attempt.exothermic ?? reaction.exothermic;
  playSfx(exothermic ? 'explosion' : 'frost');
  pushBurst(best.at, exothermic ? '#ff9d3c' : '#7fdcff');
  speak(`${formatEquation(reaction)}. ${reaction.jarvis}`);
  game.pushToast({
    kind: 'success',
    title: reaction.name,
    body: `${reaction.equation} · ΔH ${reaction.dH} kJ/mol`,
    ttl: 5200,
  });

  // Swap in the products once the burst has had time to read.
  window.setTimeout(() => {
    const store = useMoleculeStore.getState();
    store.clear();
    const first = attempt.products?.[0];
    if (first) store.loadGraph(first.graph);
  }, 700);
}

function fragmentsOf(mol: ReturnType<typeof useMoleculeStore.getState>): Set<string>[] {
  const adjacency = new Map<string, Set<string>>();
  mol.atoms.forEach((a) => adjacency.set(a.id, new Set()));
  mol.bonds.forEach((b) => {
    adjacency.get(b.a)?.add(b.b);
    adjacency.get(b.b)?.add(b.a);
  });
  const seen = new Set<string>();
  const groups: Set<string>[] = [];
  for (const atom of mol.atoms) {
    if (seen.has(atom.id)) continue;
    const group = new Set<string>();
    const stack = [atom.id];
    while (stack.length) {
      const id = stack.pop()!;
      if (seen.has(id)) continue;
      seen.add(id);
      group.add(id);
      adjacency.get(id)?.forEach((n) => stack.push(n));
    }
    groups.push(group);
  }
  return groups;
}

function subgraphOf(mol: ReturnType<typeof useMoleculeStore.getState>, ids: Set<string>) {
  const atoms = mol.atoms.filter((a) => ids.has(a.id));
  const bonds = mol.bonds.filter((b) => ids.has(b.a) && ids.has(b.b));
  return {
    atoms: atoms.map((a) => ({ id: a.id, element: a.element, charge: a.charge ?? 0 })),
    bonds: bonds.map((b) => ({ id: b.id, a: b.a, b: b.b, order: b.order, type: b.type })),
  };
}

/** Convenience: describe what is on the bench (used by JARVIS idle lines). */
export function benchSummary(): string {
  const mol = useMoleculeStore.getState();
  if (!mol.atoms.length) return 'empty bench';
  return structuralFormula(mol.toGraph());
}

export default useGestureBridge;
