/**
 * gestures.types.ts — the vocabulary shared by the tracker, the engine and the UI.
 */

/** A single MediaPipe hand: 21 landmarks in NORMALISED image space (0..1). */
export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface HandFrame {
  /** 0 = left, 1 = right (as reported by MediaPipe, mirrored by us if needed). */
  handedness: 'Left' | 'Right';
  score: number;
  landmarks: Landmark[];
}

export type GestureName =
  | 'NONE'
  | 'POINT'
  | 'PINCH'
  | 'PINCH_HOLD'
  | 'DOUBLE_PINCH'
  | 'OPEN_PALM'
  | 'FIST'
  | 'SWIPE_LEFT'
  | 'SWIPE_RIGHT'
  | 'TWO_HAND_ROTATE'
  | 'TWO_HAND_ZOOM'
  | 'TWO_HAND_SPREAD'
  | 'FINGER_COUNT'
  | 'CIRCLE'
  | 'PEACE'
  | 'THUMBS_UP';

export interface GestureEvent {
  name: GestureName;
  /** Which hand triggered it (index into the hands array), -1 for two-hand gestures. */
  hand: number;
  /** Normalised screen position of the acting fingertip / palm (0..1, x mirrored). */
  position: { x: number; y: number };
  /** Extra payload: finger count, zoom delta, rotation delta, swipe velocity … */
  value?: number;
  /** Second hand position for two-hand gestures. */
  position2?: { x: number; y: number };
  confidence: number;
  /** Milliseconds the gesture has been held (PINCH_HOLD, OPEN_PALM hold …). */
  holdMs?: number;
}

/** Smoothed per-hand state the engine keeps between frames. */
export interface HandState {
  id: number;
  handedness: 'Left' | 'Right';
  landmarks: Landmark[];
  /** EMA-smoothed landmarks used for everything except raw cursor position. */
  smooth: Landmark[];
  /** Palm centre (average of wrist + MCPs), smoothed. */
  palm: { x: number; y: number };
  /** Hand scale = wrist → middle-finger MCP distance, used to normalise thresholds. */
  scale: number;
  pinching: boolean;
  pinchStart: number;
  pinchDistance: number;
  fist: boolean;
  open: boolean;
  point: boolean;
  fingerCount: number;
  /** Recent pinch timestamps for DOUBLE_PINCH. */
  pinchTimes: number[];
  /** Palm centre history for swipe / circle detection. */
  trail: { x: number; y: number; t: number }[];
  /** Index-fingertip history for the circle gesture. */
  tipTrail: { x: number; y: number; t: number }[];
  velocity: { x: number; y: number };
  lastSeen: number;
}

/**
 * Every threshold in one place so Settings can expose them and the README can
 * explain them. Values are fractions of hand scale unless noted.
 */
export interface GestureThresholds {
  /** pinch when thumbTip–indexTip < scale * pinchOn */
  pinchOn: number;
  /** release when > scale * pinchOff (hysteresis stops flicker) */
  pinchOff: number;
  /** ms holding a pinch before PINCH_HOLD fires */
  pinchHoldMs: number;
  /** two pinches inside this window = DOUBLE_PINCH */
  doublePinchMs: number;
  /** fingertip further than this from the PIP joint (× scale) = finger extended */
  fingerExtend: number;
  /** thumb uses a more generous ratio because it is foreshortened */
  thumbExtend: number;
  /** palm velocity (units/ms) above which a swipe fires */
  swipeVelocity: number;
  /** minimum horizontal travel for a swipe */
  swipeDistance: number;
  /** ms a palm must stay open to trigger Scan Mode */
  palmHoldMs: number;
  /** change in palm separation (× scale) before a zoom tick fires */
  zoomStep: number;
  /** palm separation change rate for the explode gesture */
  spreadRate: number;
  /** rotation delta (radians) before a rotate tick fires */
  rotateStep: number;
  /** EMA smoothing factor: 0 = frozen, 1 = raw (no smoothing) */
  smoothing: number;
  /** cumulative angle (radians) for the ring-builder circle gesture */
  circleAngle: number;
  /** minimum radius of the circle gesture (× scale) */
  circleRadius: number;
}

export const DEFAULT_THRESHOLDS: GestureThresholds = {
  pinchOn: 0.42,
  pinchOff: 0.58,
  pinchHoldMs: 400,
  doublePinchMs: 500,
  fingerExtend: 1.05,
  thumbExtend: 0.65,
  swipeVelocity: 0.0016,
  swipeDistance: 0.16,
  palmHoldMs: 1000,
  zoomStep: 0.14,
  spreadRate: 0.004,
  rotateStep: 0.22,
  smoothing: 0.45,
  circleAngle: Math.PI * 1.75,
  circleRadius: 0.35,
};
