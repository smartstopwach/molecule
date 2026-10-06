/**
 * gestureEngine.ts — turns 21-point hand landmarks into high-level events (spec §3).
 *
 * Pipeline per frame:
 *   1. MATCH   incoming hands to persistent HandStates (by handedness, then proximity)
 *   2. SMOOTH  every landmark through an EMA so the cursor never jitters
 *   3. MEASURE scale, palm centre, per-finger extension, pinch distance, velocity
 *   4. EMIT    edge-triggered events (PINCH rise, FIST rise …) and continuous
 *              ticks (TWO_HAND_ZOOM, TWO_HAND_ROTATE) with their own cooldowns
 *
 * All thresholds live in DEFAULT_THRESHOLDS and are overridable from Settings.
 * Nothing here touches React or Three.js — the UI subscribes to the returned events.
 */

import {
  type HandFrame,
  type HandState,
  type GestureEvent,
  type GestureName,
  type GestureThresholds,
  type Landmark,
  DEFAULT_THRESHOLDS,
} from './gestures.types';
import { LANDMARK as L } from './handTracker';

const FINGER_TIPS = [L.INDEX_TIP, L.MIDDLE_TIP, L.RING_TIP, L.PINKY_TIP];
const FINGER_PIPS = [L.INDEX_PIP, L.MIDDLE_PIP, L.RING_PIP, L.PINKY_PIP];
const FINGER_MCPS = [L.INDEX_MCP, L.MIDDLE_MCP, L.RING_MCP, L.PINKY_MCP];

const dist2d = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);
const dist2p = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

function emptyTrail<T>(arr: T[], maxAge: number, now: number, getT: (v: T) => number): T[] {
  return arr.filter((v) => now - getT(v) < maxAge);
}

export class GestureEngine {
  thresholds: GestureThresholds;
  /** Mirror x so gestures line up with the mirrored webcam preview. */
  mirror = true;
  private states: HandState[] = [];
  private cooldowns = new Map<string, number>();
  private lastTwoHandDistance = 0;
  private lastTwoHandAngle = 0;
  private circleAccum = new Map<number, { angle: number; lastAngle: number; cx: number; cy: number }>();

  constructor(thresholds: Partial<GestureThresholds> = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  setThresholds(t: Partial<GestureThresholds>) {
    this.thresholds = { ...this.thresholds, ...t };
  }

  /** Current per-hand state (read-only) for the skeleton overlay / debug HUD. */
  getStates(): readonly HandState[] {
    return this.states;
  }

  /** The active pointing fingertip in screen space (0..1, already mirrored). */
  getPointer(which = 0): { x: number; y: number } | null {
    const hand = this.states[which];
    if (!hand) return null;
    const tip = hand.smooth[L.INDEX_TIP];
    if (!tip) return null;
    return { x: this.mirror ? 1 - tip.x : tip.x, y: tip.y };
  }

  /** Pinch midpoint — used as the "grab" anchor. */
  getPinchPoint(which = 0): { x: number; y: number } | null {
    const hand = this.states[which];
    if (!hand || !hand.pinching) return null;
    const a = hand.smooth[L.THUMB_TIP];
    const b = hand.smooth[L.INDEX_TIP];
    const x = (a.x + b.x) / 2;
    const y = (a.y + b.y) / 2;
    return { x: this.mirror ? 1 - x : x, y };
  }

  private cooled(name: GestureName, now: number, ms: number): boolean {
    const last = this.cooldowns.get(name) ?? -Infinity;
    if (now - last < ms) return true;
    this.cooldowns.set(name, now);
    return false;
  }

  /* ------------------------------------------------------------ main tick */

  update(hands: HandFrame[], now: number): GestureEvent[] {
    const events: GestureEvent[] = [];
    const t = this.thresholds;

    // --- 1. match / create / prune -------------------------------------
    for (const h of hands) {
      const raw = h.landmarks;
      if (!raw || raw.length < 21) continue;
      const palmRaw = this.palmOf(raw, h.landmarks);
      let state = this.states.find(
        (s) => s.handedness === h.handedness && dist2p(s.palm, palmRaw) < 0.25,
      );
      if (!state) {
        state = this.states.find((s) => now - s.lastSeen > 150 && dist2p(s.palm, palmRaw) < 0.35);
      }
      if (!state) {
        state = this.createState(raw, palmRaw, h.handedness, now);
        this.states.push(state);
      }
      state.lastSeen = now;
      state.handedness = h.handedness;
      state.landmarks = raw;

      // --- 2. EMA smoothing ----------------------------------------------
      const k = Math.min(1, Math.max(0.02, t.smoothing));
      state.smooth = raw.map((p, i) => {
        const prev = state!.smooth[i] ?? p;
        return { x: prev.x + (p.x - prev.x) * k, y: prev.y + (p.y - prev.y) * k, z: prev.z + (p.z - prev.z) * k };
      });

      // --- 3. measurements -------------------------------------------------
      const s = state.smooth;
      const scale = Math.max(0.02, dist2d(s[L.WRIST], s[L.MIDDLE_MCP]));
      state.scale = scale;
      const palm = this.palmOf(s, s);
      const prevPalm = state.palm;
      state.palm = palm;
      state.velocity = {
        x: palm.x - prevPalm.x,
        y: palm.y - prevPalm.y,
      };

      const fingers = FINGER_TIPS.map((tip, i) => dist2d(s[tip], s[L.WRIST]) > dist2d(s[FINGER_PIPS[i]], s[L.WRIST]) * t.fingerExtend);
      const thumbOut = dist2d(s[L.THUMB_TIP], s[L.THUMB_MCP]) > scale * t.thumbExtend;
      const extended = fingers.filter(Boolean).length + (thumbOut ? 1 : 0);
      state.fingerCount = extended;
      state.open = fingers.every(Boolean) && thumbOut;
      state.fist = !fingers.some(Boolean) && dist2d(s[L.THUMB_TIP], s[L.INDEX_MCP]) < scale * 0.9;
      state.point = fingers[0] && !fingers[1] && !fingers[2] && !fingers[3];

      const pinchDistance = dist2d(s[L.THUMB_TIP], s[L.INDEX_TIP]) / scale;
      state.pinchDistance = pinchDistance;
      const wasPinching = state.pinching;
      if (wasPinching ? pinchDistance > t.pinchOff : pinchDistance < t.pinchOn) {
        state.pinching = !wasPinching;
      }

      // trails
      state.trail.push({ x: palm.x, y: palm.y, t: now });
      state.trail = emptyTrail(state.trail, 800, now, (v) => v.t).slice(-40);
      state.tipTrail.push({ x: s[L.INDEX_TIP].x, y: s[L.INDEX_TIP].y, t: now });
      state.tipTrail = emptyTrail(state.tipTrail, 1400, now, (v) => v.t).slice(-60);

      const idx = this.states.indexOf(state);
      const pos = (p: { x: number; y: number }) => ({ x: this.mirror ? 1 - p.x : p.x, y: p.y });

      // --- 4a. pinch events -------------------------------------------------
      if (state.pinching && !wasPinching) {
        state.pinchStart = now;
        state.pinchTimes.push(now);
        state.pinchTimes = state.pinchTimes.filter((x) => now - x < t.doublePinchMs * 2);
        events.push({ name: 'PINCH', hand: idx, position: pos(state.palm), confidence: 1, holdMs: 0 });
        if (state.pinchTimes.length >= 2 && state.pinchTimes[state.pinchTimes.length - 1] - state.pinchTimes[state.pinchTimes.length - 2] <= t.doublePinchMs) {
          if (!this.cooled('DOUBLE_PINCH', now, 300)) {
            events.push({ name: 'DOUBLE_PINCH', hand: idx, position: pos(state.palm), confidence: 1 });
          }
          state.pinchTimes = [];
        }
      }
      if (state.pinching && now - state.pinchStart > t.pinchHoldMs && !this.cooled('PINCH_HOLD', now, 600)) {
        events.push({ name: 'PINCH_HOLD', hand: idx, position: pos(state.palm), holdMs: now - state.pinchStart, confidence: 1 });
      }

      // --- 4b. shapes -------------------------------------------------------
      if (state.open && !this.cooled('OPEN_PALM', now, 400)) {
        events.push({ name: 'OPEN_PALM', hand: idx, position: pos(state.palm), confidence: 1, holdMs: 0 });
      }
      if (state.fist && !this.cooled('FIST', now, 450)) {
        events.push({ name: 'FIST', hand: idx, position: pos(state.palm), confidence: 1 });
      }
      if (state.point) {
        events.push({ name: 'POINT', hand: idx, position: pos(s[L.INDEX_TIP]), confidence: 1 });
      }
      if (state.fingerCount >= 1 && state.fingerCount <= 5 && !state.fist) {
        const key = `FC${idx}` as GestureName;
        if (!this.cooled(key, now, 260)) {
          events.push({ name: 'FINGER_COUNT', hand: idx, position: pos(state.palm), value: state.fingerCount, confidence: 0.9 });
        }
      }
      if (thumbOut && !fingers.some(Boolean) && state.smooth[L.THUMB_TIP].y < state.smooth[L.WRIST].y - scale * 0.9 && !this.cooled('THUMBS_UP', now, 800)) {
        events.push({ name: 'THUMBS_UP', hand: idx, position: pos(state.palm), confidence: 0.85 });
      }
      if (fingers[0] && fingers[1] && !fingers[2] && !fingers[3] && !this.cooled('PEACE', now, 600)) {
        events.push({ name: 'PEACE', hand: idx, position: pos(state.palm), value: 2, confidence: 0.9 });
      }

      // --- 4c. swipe --------------------------------------------------------
      const trail = state.trail;
      if (trail.length > 4) {
        const first = trail[Math.max(0, trail.length - 6)];
        const dx = palm.x - first.x;
        const dt = Math.max(1, now - first.t);
        const vx = dx / dt;
        if (Math.abs(dx) > t.swipeDistance && Math.abs(vx) > t.swipeVelocity * 0.6) {
          const name: GestureName = dx > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT';
          if (!this.cooled(name, now, 700)) {
            events.push({ name, hand: idx, position: pos(state.palm), value: Math.abs(vx), confidence: 0.9 });
          }
          state.trail = [];
        }
      }

      // --- 4d. circle (ring builder) ----------------------------------------
      const circle = this.updateCircle(idx, state, now);
      if (circle) events.push({ name: 'CIRCLE', hand: idx, position: pos(state.palm), value: circle > 0 ? 1 : -1, confidence: 0.8 });
    }

    // prune stale hands
    this.states = this.states.filter((s) => now - s.lastSeen < 400).slice(0, 2);

    // --- 5. two-hand gestures ------------------------------------------------
    if (this.states.length === 2) {
      const [a, b] = this.states;
      const d = dist2p(a.palm, b.palm) / Math.max(a.scale, b.scale, 0.02);
      const angle = Math.atan2(b.palm.y - a.palm.y, b.palm.x - a.palm.x);

      if (a.pinching && b.pinching) {
        let dAngle = angle - this.lastTwoHandAngle;
        if (dAngle > Math.PI) dAngle -= Math.PI * 2;
        if (dAngle < -Math.PI) dAngle += Math.PI * 2;
        if (Math.abs(dAngle) > this.thresholds.rotateStep && !this.cooled('TWO_HAND_ROTATE', now, 60)) {
          events.push({
            name: 'TWO_HAND_ROTATE', hand: -1,
            position: this.mirrored(a.palm), position2: this.mirrored(b.palm),
            value: dAngle, confidence: 0.95,
          });
        }
      } else if (a.open && b.open) {
        const delta = d - this.lastTwoHandDistance;
        if (Math.abs(delta) > this.thresholds.zoomStep && !this.cooled('TWO_HAND_ZOOM', now, 90)) {
          events.push({
            name: 'TWO_HAND_ZOOM', hand: -1,
            position: this.mirrored(a.palm), position2: this.mirrored(b.palm),
            value: delta, confidence: 0.95,
          });
        }
        // fast separation = explode view
        const rate = Math.abs(delta) / Math.max(1, now - (this.cooldowns.get('__spreadTick') ?? now - 16));
        this.cooldowns.set('__spreadTick', now);
        if (delta > 0 && rate > this.thresholds.spreadRate && !this.cooled('TWO_HAND_SPREAD', now, 1500)) {
          events.push({
            name: 'TWO_HAND_SPREAD', hand: -1,
            position: this.mirrored(a.palm), position2: this.mirrored(b.palm),
            value: delta, confidence: 0.8,
          });
        }
      }
      this.lastTwoHandDistance = d;
      this.lastTwoHandAngle = angle;
    }

    return events;
  }

  private mirrored(p: { x: number; y: number }) {
    return { x: this.mirror ? 1 - p.x : p.x, y: p.y };
  }

  private palmOf(lm: Landmark[], fallback: Landmark[]) {
    const ids = [L.WRIST, L.INDEX_MCP, L.MIDDLE_MCP, L.RING_MCP, L.PINKY_MCP];
    let x = 0, y = 0;
    for (const id of ids) {
      const p = lm[id] ?? fallback[id];
      x += p.x;
      y += p.y;
    }
    return { x: x / ids.length, y: y / ids.length };
  }

  private createState(lm: Landmark[], palm: { x: number; y: number }, handedness: 'Left' | 'Right', now: number): HandState {
    return {
      id: Math.random(),
      handedness,
      landmarks: lm,
      smooth: lm.map((p) => ({ ...p })),
      palm,
      scale: Math.max(0.02, dist2d(lm[L.WRIST], lm[L.MIDDLE_MCP])),
      pinching: false,
      pinchStart: now,
      pinchDistance: 1,
      fist: false,
      open: false,
      point: false,
      fingerCount: 0,
      pinchTimes: [],
      trail: [],
      tipTrail: [],
      velocity: { x: 0, y: 0 },
      lastSeen: now,
    };
  }

  /**
   * Circle detection: accumulate the signed angle swept by the index fingertip
   * around the centroid of its own recent trail. ±1.75π with a sane radius = ring.
   */
  private updateCircle(idx: number, state: HandState, now: number): number | null {
    const pts = state.tipTrail;
    if (pts.length < 12) return null;
    const recent = pts.slice(-30);
    let cx = 0, cy = 0;
    for (const p of recent) { cx += p.x; cy += p.y; }
    cx /= recent.length;
    cy /= recent.length;
    let radius = 0;
    for (const p of recent) radius += Math.hypot(p.x - cx, p.y - cy);
    radius /= recent.length;
    if (radius < this.thresholds.circleRadius * state.scale) return null;

    const acc = this.circleAccum.get(idx) ?? { angle: 0, lastAngle: 0, cx, cy };
    const last = recent[recent.length - 1];
    const prev = recent[recent.length - 2] ?? last;
    const a1 = Math.atan2(prev.y - cy, prev.x - cx);
    const a2 = Math.atan2(last.y - cy, last.x - cx);
    let da = a2 - a1;
    if (da > Math.PI) da -= Math.PI * 2;
    if (da < -Math.PI) da += Math.PI * 2;
    acc.angle += da;
    acc.cx = cx;
    acc.cy = cy;
    this.circleAccum.set(idx, acc);
    if (Math.abs(acc.angle) >= this.thresholds.circleAngle) {
      const dir = Math.sign(acc.angle);
      acc.angle = 0;
      state.tipTrail = [];
      if (!this.cooled('CIRCLE', now, 1200)) return dir;
    }
    return null;
  }

  reset() {
    this.states = [];
    this.cooldowns.clear();
    this.circleAccum.clear();
  }
}

/** Helper: how many fingers are up right now (used by the quiz HUD). */
export function activeFingerCount(states: readonly HandState[]): number {
  return states.reduce((max, s) => Math.max(max, s.fingerCount), 0);
}
