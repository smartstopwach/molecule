/**
 * cameraRig.ts — the camera is driven by GESTURES (two-hand rotate / zoom / pan),
 * not by a mouse. Components read this mutable singleton inside useFrame so we never
 * re-render React 60 times a second.
 */

import { Vector3 } from 'three';

export interface CameraRigState {
  theta: number;
  phi: number;
  radius: number;
  target: Vector3;
  /** Smoothed values actually applied to the camera. */
  current: { theta: number; phi: number; radius: number; target: Vector3 };
  autoSpin: number;
}

export const cameraRig: CameraRigState = {
  theta: 0.35,
  phi: 1.15,
  radius: 9,
  target: new Vector3(0, 0, 0),
  current: { theta: 0.35, phi: 1.15, radius: 9, target: new Vector3(0, 0, 0) },
  autoSpin: 0.02,
};

export function rotateCamera(dTheta: number, dPhi = 0) {
  cameraRig.theta += dTheta;
  cameraRig.phi = Math.max(0.15, Math.min(Math.PI - 0.15, cameraRig.phi + dPhi));
}

export function zoomCamera(delta: number) {
  cameraRig.radius = Math.max(3.2, Math.min(26, cameraRig.radius * (1 - delta)));
}

export function resetCamera() {
  cameraRig.theta = 0.35;
  cameraRig.phi = 1.15;
  cameraRig.radius = 9;
  cameraRig.target.set(0, 0, 0);
}

/** Where the camera should be, given the rig state. */
export function cameraPosition(out: Vector3): Vector3 {
  const { theta, phi, radius, target } = cameraRig;
  return out.set(
    target.x + radius * Math.sin(phi) * Math.sin(theta),
    target.y + radius * Math.cos(phi),
    target.z + radius * Math.sin(phi) * Math.cos(theta),
  );
}

/**
 * AR anchor: when the player grabs an atom, the whole molecule is re-parented in
 * effect to their palm — the grabbed atom is pinned to `arAnchor.position`
 * (a world-space point derived from the palm's screen position).
 */
export const arAnchor: {
  active: boolean;
  position: Vector3;
  atomId: string | null;
} = {
  active: false,
  position: new Vector3(),
  atomId: null,
};

export function setArAnchor(active: boolean, position?: Vector3, atomId?: string | null) {
  arAnchor.active = active;
  if (position) arAnchor.position.copy(position);
  if (atomId !== undefined) arAnchor.atomId = atomId;
}
