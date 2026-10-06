/**
 * useVisionLoop.ts — track at ~30 fps, render at 60 fps (spec §12).
 *
 * One loop owns the webcam → MediaPipe → GestureEngine pipeline. It prefers
 * `requestVideoFrameCallback` (no wasted work on duplicate frames), falls back to
 * rAF with a 33 ms budget, and never blocks the React render loop: results are
 * published through a mutable ref plus a lightweight state counter so the HUD can
 * throttle its own repaints.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { HandTracker } from '../vision/handTracker';
import { GestureEngine } from '../vision/gestureEngine';
import type { GestureEvent, HandState } from '../vision/gestures.types';
import { useGameStore } from '../store/useGameStore';

export interface VisionLoopOptions {
  video: HTMLVideoElement | null;
  /** Target inference rate in Hz (default 30). */
  hz?: number;
  onEvents: (events: GestureEvent[], states: readonly HandState[]) => void;
}

export interface VisionLoopApi {
  states: () => readonly HandState[];
  pointer: (i?: number) => { x: number; y: number } | null;
  pinch: (i?: number) => { x: number; y: number } | null;
  fps: number;
  inferenceMs: number;
  hands: number;
  ready: boolean;
  error: string | null;
}

export function useVisionLoop({ video, hz = 30, onEvents }: VisionLoopOptions): VisionLoopApi {
  const trackerRef = useRef<HandTracker | null>(null);
  const engineRef = useRef<GestureEngine | null>(null);
  const [fps, setFps] = useState(0);
  const [inferenceMs, setInferenceMs] = useState(0);
  const [hands, setHands] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventsRef = useRef(onEvents);
  eventsRef.current = onEvents;

  // keep engine thresholds in sync with settings
  const sensitivity = useGameStore((s) => s.settings.sensitivity);
  useEffect(() => {
    // Sensitivity scales the "how hard do I have to try" thresholds: higher
    // sensitivity = larger pinch windows, faster swipes, smaller steps.
    engineRef.current?.setThresholds({
      pinchOn: 0.42 * sensitivity,
      pinchOff: 0.58 * sensitivity,
      swipeVelocity: 0.0016 / sensitivity,
      swipeDistance: 0.16 / sensitivity,
      zoomStep: 0.14 / sensitivity,
      rotateStep: 0.22 / sensitivity,
      circleAngle: (Math.PI * 1.75) / sensitivity,
      smoothing: Math.min(0.85, 0.45 * sensitivity),
    });
  }, [sensitivity]);

  useEffect(() => {
    if (!video) return;
    let cancelled = false;
    let raf = 0;
    let frameCb = 0;
    let lastRun = 0;
    let frames = 0;
    let fpsWindow = performance.now();

    const engine = new GestureEngine();
    const tracker = new HandTracker();
    engineRef.current = engine;
    trackerRef.current = tracker;

    const interval = 1000 / hz;

    const tick = (now: number) => {
      if (cancelled) return;
      schedule();
      if (now - lastRun < interval) return;
      lastRun = now;
      if (video.readyState < 2) return;

      const { hands: detected, inferenceMs: ms } = tracker.detect(video, now);
      const events = engine.update(detected, now);
      if (events.length) eventsRef.current(events, engine.getStates());

      frames += 1;
      if (now - fpsWindow >= 1000) {
        setFps(Math.round((frames * 1000) / (now - fpsWindow)));
        setInferenceMs(Math.round(ms * 10) / 10);
        setHands(detected.length);
        frames = 0;
        fpsWindow = now;
      }
    };

    const schedule = () => {
      const rVFC = (video as unknown as {
        requestVideoFrameCallback?: (cb: (now: number) => void) => number;
      }).requestVideoFrameCallback;
      if (rVFC) frameCb = rVFC(tick);
      else raf = requestAnimationFrame(tick);
    };

    (async () => {
      try {
        await tracker.init(2);
        if (cancelled) return;
        setReady(true);
        schedule();
      } catch (e) {
        if (!cancelled) setError(String((e as Error)?.message ?? e));
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      const cVFC = (video as unknown as {
        cancelVideoFrameCallback?: (h: number) => void;
      }).cancelVideoFrameCallback;
      cVFC?.(frameCb);
      tracker.dispose?.();
      trackerRef.current = null;
      engineRef.current = null;
    };
  }, [video, hz]);

  const states = useCallback(() => engineRef.current?.getStates() ?? [], []);
  const pointer = useCallback((i = 0) => engineRef.current?.getPointer(i) ?? null, []);
  const pinch = useCallback((i = 0) => engineRef.current?.getPinchPoint(i) ?? null, []);

  return { states, pointer, pinch, fps, inferenceMs, hands, ready, error };
}

export default useVisionLoop;
