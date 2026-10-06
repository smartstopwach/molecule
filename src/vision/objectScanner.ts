/**
 * objectScanner.ts — Scan Mode (spec §9).
 *
 * Open-palm hold (or "Jarvis, scan this") freezes the frame and runs an in-browser
 * COCO-SSD detector. TensorFlow.js is an OPTIONAL dependency: if it is not installed
 * or fails to load, the scanner degrades to a friendly "detector unavailable" state
 * instead of breaking the app.
 *
 * Detected COCO classes are mapped to representative molecules by
 * chemistry/data/scanMap.json (bottle → H₂O, banana → glucose, book → cellulose …).
 */

import SCAN_MAP from '../chemistry/data/scanMap.json';
import { findKnownByFormula } from '../chemistry/chemistryEngine';

export interface Detection {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

export interface ScanResult {
  ok: boolean;
  detections: Detection[];
  /** The best molecule guess, if any. */
  molecule?: {
    formula: string;
    name: string;
    note?: string;
    smiles?: string;
    uses?: string[];
    hazards?: string[];
  };
  message: string;
}

interface ScanEntry {
  classes: string[];
  formula: string;
  name: string;
  note?: string;
}

const MAP = (SCAN_MAP as { map: ScanEntry[]; fallbacks: string[] }).map;
const FALLBACKS = (SCAN_MAP as { map: ScanEntry[]; fallbacks: string[] }).fallbacks;

type CocoSsd = {
  load: (opts?: Record<string, unknown>) => Promise<{
    detect: (input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => Promise<Detection[]>;
  }>;
};

let modelPromise: Promise<{ detect: (i: HTMLCanvasElement) => Promise<Detection[]> } | null> | null = null;

/** Lazily import tfjs + coco-ssd. Returns null when the packages are unavailable. */
async function loadModel() {
  if (modelPromise) return modelPromise;
  modelPromise = (async () => {
    try {
      const [{ default: cocoSsdModule }, tf] = await Promise.all([
        import(/* @vite-ignore */ '@tensorflow-models/coco-ssd'),
        import(/* @vite-ignore */ '@tensorflow/tfjs'),
      ]);
      // Warm up on the CPU/WebGL backend and keep tensors tidy.
      await tf.ready();
      const cocoSsd = (cocoSsdModule ?? (cocoSsdModule as unknown as { load: CocoSsd }).load) as unknown as CocoSsd['load'];
      const model = await cocoSsd({ base: 'lite_mobilenet_v2' as never });
      return { detect: (input: HTMLCanvasElement) => model.detect(input) as Promise<Detection[]> };
    } catch (err) {
      console.warn('[JARVIS] object detector unavailable:', err);
      return null;
    }
  })();
  return modelPromise;
}

/** Freeze the current camera frame into an offscreen canvas we can feed the model. */
export function freezeFrame(video: HTMLVideoElement, maxWidth = 640): HTMLCanvasElement {
  const scale = Math.min(1, maxWidth / (video.videoWidth || maxWidth));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round((video.videoWidth || maxWidth) * scale);
  canvas.height = Math.round((video.videoHeight || maxWidth * 0.5625) * scale);
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

let unavailableWarned = false;

/** Run the detector and map the best class to a molecule. */
export async function scanObject(video: HTMLVideoElement): Promise<ScanResult> {
  const model = await loadModel();
  if (!model) {
    if (!unavailableWarned) {
      unavailableWarned = true;
      console.info('[JARVIS] Scan Mode needs the optional TensorFlow.js packages (npm i @tensorflow/tfjs @tensorflow-models/coco-ssd).');
    }
    return {
      ok: false,
      detections: [],
      message: 'The object detector is not installed on this build. Gesture and voice control are unaffected, sir.',
    };
  }

  const canvas = freezeFrame(video);
  let detections: Detection[] = [];
  try {
    detections = await model.detect(canvas);
  } catch (err) {
    return { ok: false, detections: [], message: `Detection failed: ${String(err)}` };
  }

  const sorted = [...detections].sort((a, b) => b.score - a.score);
  for (const det of sorted) {
    if (det.score < 0.45) continue;
    const entry = MAP.find((m) => m.classes.some((c) => c.toLowerCase() === det.class.toLowerCase()));
    if (entry) {
      const known = findKnownByFormula(entry.formula);
      return {
        ok: true,
        detections: sorted,
        molecule: {
          formula: entry.formula,
          name: known?.name ?? entry.name,
          note: entry.note,
          smiles: known?.smiles,
          uses: known?.uses,
          hazards: known?.hazards,
        },
        message: `${det.class} detected — pulling out ${known?.name ?? entry.name}.`,
      };
    }
  }

  return {
    ok: true,
    detections: sorted,
    message: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)],
  };
}

/** Synchronous helper for tests/mocking: map a class name straight to a molecule. */
export function mapClassToMolecule(cls: string) {
  const entry = MAP.find((m) => m.classes.some((c) => c.toLowerCase() === cls.toLowerCase()));
  if (!entry) return null;
  const known = findKnownByFormula(entry.formula);
  return {
    formula: entry.formula,
    name: known?.name ?? entry.name,
    note: entry.note,
    smiles: known?.smiles,
  };
}
