/**
 * Bond.tsx — covalent / ionic / aromatic / coordinate bonds as cylinders.
 *
 *   single    one cylinder on the axis
 *   double    two cylinders offset perpendicular, in the molecular plane
 *   triple    three cylinders (centre + two offsets)
 *   aromatic  one solid cylinder + one dashed (segmented) cylinder
 *   ionic     a dotted, low-opacity cylinder (charge separated, not shared)
 *   coordinate an arrow-ish tapered cylinder pointing at the metal centre
 *
 * Offset direction: perpendicular to the bond axis, chosen in the plane defined by
 * the bond and a neighbouring atom where possible (that is what real drawings do).
 */

import { useMemo } from 'react';
import { Vector3, Quaternion, Color, type BufferGeometry } from 'three';
import type { Bond3D, Atom3D } from '../store/useMoleculeStore';
import { idealBondLength } from './vsepSolver';

const UP = new Vector3(0, 1, 0);

export interface BondProps {
  bond: Bond3D;
  a: Atom3D;
  b: Atom3D;
  /** Neighbour position used to orient double/triple bonds in-plane. */
  reference?: [number, number, number];
  highlight?: boolean;
  explode?: number;
  colorBlind?: boolean;
  onClick?: (id: string) => void;
  onHover?: (id: string | null) => void;
}

interface Cylinder {
  key: string;
  position: Vector3;
  quaternion: Quaternion;
  length: number;
  radius: number;
  color: string;
  opacity: number;
  dashed?: boolean;
  segments?: number;
  gap?: number;
}

export function Bond({
  bond,
  a,
  b,
  reference,
  highlight = false,
  explode = 0,
  colorBlind = false,
  onClick,
  onHover,
}: BondProps) {
  const cylinders = useMemo<Cylinder[]>(() => {
    const pa = new Vector3(...a.position);
    const pb = new Vector3(...b.position);
    const axis = pb.clone().sub(pa);
    const length = axis.length() || 0.001;
    const dir = axis.clone().normalize();
    const quat = new Quaternion().setFromUnitVectors(UP, dir);
    const mid = pa.clone().add(pb).multiplyScalar(0.5);

    // Perpendicular offset direction: use a neighbour to define the molecular plane.
    let perp = new Vector3(1, 0, 0);
    if (reference) {
      const ref = new Vector3(...reference).sub(pa);
      perp = new Vector3().crossVectors(dir, ref);
      if (perp.lengthSq() < 1e-6) perp = new Vector3().crossVectors(dir, UP);
    } else {
      perp = new Vector3().crossVectors(dir, UP);
      if (perp.lengthSq() < 1e-6) perp = new Vector3(1, 0, 0);
    }
    perp.normalize();

    const baseRadius = 0.085;
    const gap = 0.13 + explode * 0.22;
    const isAromatic = bond.type === 'aromatic';
    const isIonic = bond.type === 'ionic';
    const isDative = bond.type === 'coordinate';
    const color = isAromatic
      ? colorBlind ? '#56b4e9' : '#8ef0ff'
      : isIonic
        ? '#ffc76b'
        : isDative
          ? '#a97bff'
          : colorBlind
            ? '#999999'
            : '#cfefff';

    const out: Cylinder[] = [];
    const push = (offset: number, radius: number, opacity: number, dashed = false, segments = 1, key = '') => {
      const pos = mid.clone().addScaledVector(perp, offset);
      out.push({
        key: `${bond.id}-${key || offset}`,
        position: pos,
        quaternion: quat,
        length,
        radius,
        color,
        opacity,
        dashed,
        segments,
        gap,
      });
    };

    if (isDative) {
      // Drawn as a thin tapered rod: the ligand donates both electrons.
      push(0, baseRadius * 0.75, 0.85, false, 1, 'dative');
      return out;
    }
    if (isIonic) {
      push(0, baseRadius * 0.8, 0.32, true, 5, 'ionic');
      return out;
    }
    if (isAromatic) {
      push(-gap * 0.55, baseRadius, 0.92, false, 1, 'solid');
      push(gap * 0.95, baseRadius * 0.62, 0.5, true, 5, 'pi');
      return out;
    }
    switch (bond.order) {
      case 3:
        push(0, baseRadius * 0.8, 0.95);
        push(-gap * 1.15, baseRadius * 0.62, 0.9, false, 1, 'left');
        push(gap * 1.15, baseRadius * 0.62, 0.9, false, 1, 'right');
        break;
      case 2:
        push(-gap * 0.62, baseRadius * 0.85, 0.95, false, 1, 'left');
        push(gap * 0.62, baseRadius * 0.85, 0.95, false, 1, 'right');
        break;
      default:
        push(0, baseRadius, 0.95);
    }
    return out;
  }, [a.position, b.position, bond.order, bond.type, bond.id, reference, explode, colorBlind]);

  return (
    <group>
      {cylinders.map((c) => {
        const cyl = c.dashed ? (
          <DashedCylinder {...c} />
        ) : (
          <mesh
            key={c.key}
            position={c.position}
            quaternion={c.quaternion}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(bond.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover?.(bond.id);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              onHover?.(null);
            }}
          >
            <cylinderGeometry args={[c.radius, c.radius, c.length, 10, 1, false]} />
            <meshStandardMaterial
              color={c.color}
              emissive={highlight ? '#38e8ff' : c.color}
              emissiveIntensity={highlight ? 1.4 : 0.35}
              roughness={0.35}
              metalness={0.45}
              transparent
              opacity={c.opacity}
            />
          </mesh>
        );
        return cyl;
      })}
    </group>
  );
}

/** A cylinder chopped into `segments` pieces — used for partial/ionic/π bonds. */
function DashedCylinder({ position, quaternion, length, radius, color, opacity, segments = 5, gap = 0.13 }: Cylinder) {
  const pieces = Math.max(2, segments);
  const pieceLength = (length / pieces) * 0.55;
  const step = length / pieces;
  return (
    <group position={position} quaternion={quaternion}>
      {Array.from({ length: pieces }).map((_, i) => (
        <mesh key={i} position={[0, -length / 2 + step * (i + 0.5), 0]}>
          <cylinderGeometry args={[radius, radius, pieceLength, 8, 1, false]} />
          <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/** Distance a new bond should span — exported for the placement preview. */
export function previewBondLength(a: string, b: string, order = 1): number {
  return idealBondLength(a, b, order);
}

export type { BufferGeometry, Color };
