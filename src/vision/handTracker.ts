/**
 * handTracker.ts — MediaPipe Tasks Vision HandLandmarker wrapper.
 *
 * Design notes:
 *  • The WASM bundle and the .task model are loaded from a CDN by default so the app
 *    has zero backend; set VITE_MEDIAPIPE_WASM_BASE / VITE_HAND_MODEL_URL to self-host.
 *  • `detectForVideo` is called at most 30×/second from the render loop (driven by
 *    requestVideoFrameCallback when available), never from its own rAF loop, so the
 *    3D scene keeps the rest of the frame budget.
 *  • Everything runs on-device. Frames never leave the browser.
 */

import { FilesetResolver, HandLandmarker, type HandLandmarkerResult } from '@mediapipe/tasks-vision';
import type { HandFrame } from './gestures.types';

const WASM_BASE =
  (import.meta.env?.VITE_MEDIAPIPE_WASM_BASE as string | undefined) ??
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

const MODEL_URL =
  (import.meta.env?.VITE_HAND_MODEL_URL as string | undefined) ??
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export interface HandTrackingResult {
  hands: HandFrame[];
  /** ms spent in detectForVideo — surfaced in the HUD diagnostics. */
  inferenceMs: number;
}

export class HandTracker {
  private landmarker: HandLandmarker | null = null;
  private lastVideoTime = -1;
  private initPromise: Promise<void> | null = null;

  get ready(): boolean {
    return !!this.landmarker;
  }

  /** Idempotent: concurrent callers share the same init promise. */
  async init(numHands = 2): Promise<void> {
    if (this.landmarker) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      this.landmarker = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numHands,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    })().catch(async (err) => {
      // GPU delegate can fail on some drivers — retry on CPU before giving up.
      this.initPromise = null;
      if (String(err).includes('GPU') || String(err).includes('delegate')) {
        const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
        this.landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numHands,
        });
        return;
      }
      throw err;
    });
    return this.initPromise;
  }

  /**
   * Run inference. Returns an empty result (not an error) when the video has not
   * produced a new frame yet, which keeps the loop cheap.
   */
  detect(video: HTMLVideoElement, timestampMs: number): HandTrackingResult {
    if (!this.landmarker) return { hands: [], inferenceMs: 0 };
    if (video.readyState < 2) return { hands: [], inferenceMs: 0 };
    if (video.currentTime === this.lastVideoTime) return { hands: [], inferenceMs: 0 };
    this.lastVideoTime = video.currentTime;

    const t0 = performance.now();
    let raw: HandLandmarkerResult;
    try {
      raw = this.landmarker.detectForVideo(video, timestampMs);
    } catch {
      return { hands: [], inferenceMs: 0 };
    }
    const inferenceMs = performance.now() - t0;

    const hands: HandFrame[] = [];
    const n = raw.landmarks?.length ?? 0;
    for (let i = 0; i < n; i++) {
      const label = raw.handedness?.[i]?.[0];
      hands.push({
        handedness: (label?.categoryName as 'Left' | 'Right') ?? 'Right',
        score: label?.score ?? 1,
        landmarks: raw.landmarks[i].map((p) => ({ x: p.x, y: p.y, z: p.z })),
      });
    }
    return { hands, inferenceMs };
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
    this.initPromise = null;
  }
}

/** Landmark indices from the MediaPipe hand model (21 points). */
export const LANDMARK = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const;

/** Bone pairs used to draw the glowing hand skeleton. */
export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];
