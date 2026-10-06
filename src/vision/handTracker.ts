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

import type { HandLandmarker as HandLandmarkerType, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import type { HandFrame } from './gestures.types';

/**
 * The vendor bundle is imported DYNAMICALLY, inside `init()`.
 *
 * MediaPipe ships a 4 MB WASM bundle; if it fails to load (offline, CSP, corporate
 * proxy) a static import would break the whole module graph — i.e. a blank page.
 * Loading it on demand means the worst case is "no hand tracking", and the rest of
 * the lab (chemistry, HUD, JARVIS, keyboard fallback) keeps working.
 */
type VisionModule = typeof import('@mediapipe/tasks-vision');
let visionModule: VisionModule | null = null;
let visionLoadFailed: string | null = null;

async function loadVision(): Promise<VisionModule> {
  if (visionModule) return visionModule;
  if (visionLoadFailed) throw new Error(visionLoadFailed);
  try {
    visionModule = await import('@mediapipe/tasks-vision');
    return visionModule;
  } catch (err) {
    visionLoadFailed = `Hand tracking model could not be loaded (${String((err as Error)?.message ?? err)}).`;
    throw new Error(visionLoadFailed);
  }
}

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
  private landmarker: HandLandmarkerType | null = null;
  private lastVideoTime = -1;
  private initPromise: Promise<void> | null = null;

  /**
   * Inference downscale (spec §12): the model only needs ~640×360, and running it
   * on a 1280×720 frame costs roughly four times the pixels for no accuracy gain.
   * The canvas is reused between frames so there is no per-frame allocation.
   */
  private scratch: HTMLCanvasElement | null = null;
  private scratchCtx: CanvasRenderingContext2D | null = null;
  /** Flipped off automatically if a browser refuses to read from the canvas. */
  private downscale = true;
  readonly inferenceWidth = 640;
  readonly inferenceHeight = 360;

  get ready(): boolean {
    return !!this.landmarker;
  }

  /** Idempotent: concurrent callers share the same init promise. */
  async init(numHands = 2): Promise<void> {
    if (this.landmarker) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      const { FilesetResolver, HandLandmarker } = await loadVision();
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      const gpuOptions = {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' as const },
        runningMode: 'VIDEO' as const,
        numHands,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      };
      try {
        this.landmarker = await HandLandmarker.createFromOptions(fileset, gpuOptions);
      } catch (err) {
        // The GPU delegate fails on some drivers — fall back to CPU once.
        const message = String(err);
        if (!/gpu|delegate/i.test(message)) throw err;
        this.landmarker = await HandLandmarker.createFromOptions(fileset, {
          ...gpuOptions,
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
        });
      }
    })().catch((err) => {
      this.initPromise = null; // allow the UI's retry button to try again
      throw err;
    });
    return this.initPromise;
  }

  /** Copy the newest video frame into the downscaled scratch canvas. */
  private frame(video: HTMLVideoElement): HTMLCanvasElement | null {
    if (typeof document === 'undefined') return null;
    if (!this.scratch) {
      this.scratch = document.createElement('canvas');
      this.scratch.width = this.inferenceWidth;
      this.scratch.height = this.inferenceHeight;
      this.scratchCtx = this.scratch.getContext('2d', { alpha: false, willReadFrequently: false });
    }
    const ctx = this.scratchCtx;
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, this.inferenceWidth, this.inferenceHeight);
    return this.scratch;
  }

  /**
   * Run inference. Returns an empty result (not an error) when the video has not
   * produced a new frame yet, which keeps the loop cheap.
   *
   * Landmarks come back in the downscaled frame's normalised space, which is the
   * same 0..1 space the video uses — so no coordinate conversion is needed.
   */
  detect(video: HTMLVideoElement, timestampMs: number): HandTrackingResult {
    if (!this.landmarker) return { hands: [], inferenceMs: 0 };
    if (video.readyState < 2) return { hands: [], inferenceMs: 0 };
    if (video.currentTime === this.lastVideoTime) return { hands: [], inferenceMs: 0 };
    this.lastVideoTime = video.currentTime;

    const scratch = this.downscale ? this.frame(video) : null;
    const t0 = performance.now();
    let raw: HandLandmarkerResult;
    try {
      raw = this.landmarker.detectForVideo(scratch ?? video, timestampMs);
    } catch {
      if (!scratch) return { hands: [], inferenceMs: 0 };
      // Some drivers refuse canvas sources — fall back to the video element once.
      this.downscale = false;
      try {
        raw = this.landmarker.detectForVideo(video, timestampMs);
      } catch {
        return { hands: [], inferenceMs: 0 };
      }
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
