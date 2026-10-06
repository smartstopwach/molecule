/**
 * sceneBridge.ts — the bridge between 2D hand-gesture space and 3D world space.
 *
 * The vision loop runs OUTSIDE the React tree (a plain rAF driven by the camera),
 * so it needs a way to turn "my fingertip is at (0.42, 0.61) of the screen" into a
 * world position and into "which atom am I touching".
 *
 * Picking is done analytically against atom spheres (no raycaster event plumbing),
 * which is both faster and immune to pointer-events ordering problems.
 */

import { Camera, Plane, Raycaster, Vector2, Vector3 } from 'three';
import { useMoleculeStore, type Atom3D } from '../store/useMoleculeStore';
import { renderRadius } from '../chemistry/elements';

export const sceneBridge: {
  camera: Camera | null;
  width: number;
  height: number;
  /** Plane the cursor is projected onto (a screen-facing plane through the target). */
  workPlane: Plane;
} = {
  camera: null,
  width: 1,
  height: 1,
  workPlane: new Plane(new Vector3(0, 0, 1), 0),
};

const ndc = new Vector2();
const raycaster = new Raycaster();
const tmp = new Vector3();
const hit = new Vector3();

/** Screen coords are 0..1 with y DOWN (like the webcam overlay). */
export function toNDC(x: number, y: number): Vector2 {
  return ndc.set(x * 2 - 1, -(y * 2 - 1));
}

export function rayFromScreen(x: number, y: number): Raycaster | null {
  if (!sceneBridge.camera) return null;
  raycaster.setFromCamera(toNDC(x, y), sceneBridge.camera);
  return raycaster;
}

/** Project a screen point onto the working plane (default: z = 0 through the origin). */
export function screenToWorld(x: number, y: number, planeOffset = 0): Vector3 | null {
  const ray = rayFromScreen(x, y);
  if (!ray) return null;
  const plane = sceneBridge.workPlane;
  plane.constant = planeOffset;
  const point = ray.ray.intersectPlane(plane, hit.clone());
  return point ?? null;
}

/** Pick the atom whose sphere the screen ray hits first. */
export function pickAtom(x: number, y: number, extraRadius = 0.18): Atom3D | null {
  const ray = rayFromScreen(x, y);
  if (!ray) return null;
  const atoms = useMoleculeStore.getState().atoms;
  let best: Atom3D | null = null;
  let bestDistance = Infinity;
  for (const atom of atoms) {
    const radius = renderRadius(atom.element) + extraRadius;
    tmp.set(atom.position[0], atom.position[1], atom.position[2]);
    const distanceToRay = ray.ray.distanceToPoint(tmp);
    if (distanceToRay > radius) continue;
    const along = ray.ray.origin.distanceTo(tmp);
    if (along < bestDistance) {
      bestDistance = along;
      best = atom;
    }
  }
  return best;
}

/** Nearest atom within a screen-space tolerance — used for forgiving grabs. */
export function pickAtomNear(x: number, y: number, maxWorldDistance = 0.9): Atom3D | null {
  const world = screenToWorld(x, y);
  if (!world) return null;
  return useMoleculeStore.getState().nearestAtom([world.x, world.y, world.z], maxWorldDistance);
}

/** Where a NEW atom should go: on the work plane, nudged toward the camera. */
export function placementPoint(x: number, y: number, z = 0): Vector3 | null {
  return screenToWorld(x, y, z);
}

/** Project a world position back to screen coords (0..1, y down) for the AR overlay. */
export function worldToScreen(v: Vector3): { x: number; y: number } | null {
  if (!sceneBridge.camera) return null;
  const p = v.clone().project(sceneBridge.camera);
  return { x: (p.x + 1) / 2, y: (-p.y + 1) / 2 };
}
