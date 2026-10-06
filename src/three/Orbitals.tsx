/**
 * Orbitals.tsx — Orbital Mode (spec §4).
 *
 * Renders, around one atom:
 *   s        a single sphere
 *   p        three mutually perpendicular dumbbells
 *   sp       two lobes 180° apart
 *   sp²      three lobes 120° apart in a plane
 *   sp³      four tetrahedral lobes
 *   sp³d     five lobes (trigonal bipyramidal)
 *   sp³d²    six octahedral lobes
 *
 * `morph` 0→1 blends PURE (s + p) into HYBRID orbitals: at 0 you see the sphere and
 * the dumbbells, at 1 the hybrid set. Lone-pair lobes are tinted violet.
 * `BondOverlap` draws σ (head-on lens) and π (side-on slabs) for a selected bond.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Group, Mesh, Quaternion, Vector3 } from 'three';
import type { Hybridization } from '../chemistry/hybridization';
import { vseprDirections } from '../chemistry/hybridization';
import { renderRadius } from '../chemistry/elements';

export interface OrbitalSetProps {
  element: string;
  hybridization: Hybridization;
  /** 0 = pure s/p orbitals, 1 = fully hybridised. */
  morph?: number;
  position?: [number, number, number];
  lonePairs?: number;
  scale?: number;
  animate?: boolean;
  opacity?: number;
}

export const LOBE_COLOR = {
  s: '#38e8ff',
  p: '#ff9d3c',
  hybrid: '#4dffb8',
  lone: '#a97bff',
};

const UP = new Vector3(0, 1, 0);

/** A single teardrop lobe: an ellipsoid elongated along `direction`. */
function Lobe({
  direction,
  length,
  width,
  color,
  opacity,
  animate,
  phase,
}: {
  direction: Vector3;
  length: number;
  width: number;
  color: string;
  opacity: number;
  animate: boolean;
  phase: number;
}) {
  const mesh = useRef<Mesh>(null);

  const { quaternion, position } = useMemo(() => {
    const dir = direction.clone().normalize();
    const axis = new Vector3().crossVectors(UP, dir);
    const angle = Math.acos(Math.max(-1, Math.min(1, UP.dot(dir))));
    const q = new Quaternion();
    if (axis.lengthSq() < 1e-8) {
      // Collinear with UP: either identity or a 180° flip about X.
      q.setFromAxisAngle(new Vector3(1, 0, 0), dir.y < 0 ? Math.PI : 0);
    } else {
      q.setFromAxisAngle(axis.normalize(), angle);
    }
    return { quaternion: q, position: dir.multiplyScalar(length * 0.42) };
  }, [direction, length]);

  useFrame(({ clock }) => {
    if (!mesh.current || !animate) return;
    const s = 1 + Math.sin(clock.elapsedTime * 1.5 + phase) * 0.05;
    mesh.current.scale.set(s, 1 + (s - 1) * 1.6, s);
  });

  return (
    <mesh ref={mesh} position={position} quaternion={quaternion}>
      <sphereGeometry args={[width, 20, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.85}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
      />
      <mesh scale={[0.72, length / (width * 1.15), 0.72]}>
        <sphereGeometry args={[width, 20, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.85}
          transparent
          opacity={opacity}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </mesh>
  );
}

export function Orbitals({
  element,
  hybridization,
  morph = 1,
  position = [0, 0, 0],
  lonePairs = 0,
  scale = 1,
  animate = true,
  opacity = 0.36,
}: OrbitalSetProps) {
  const group = useRef<Group>(null);
  const radius = renderRadius(element) * scale;
  const lobeLength = radius * 3.0;
  const lobeWidth = radius * 0.62;

  const lobes = useMemo(() => {
    const out: { dir: Vector3; color: string; len: number; phase: number }[] = [];
    const m = Math.max(0, Math.min(1, morph));

    if (hybridization === 's' || hybridization === 'none') {
      out.push({ dir: new Vector3(0, 1, 0), color: LOBE_COLOR.s, len: lobeLength * 0.5, phase: 0 });
      return out;
    }

    const hybridCount =
      hybridization === 'sp' ? 2 :
      hybridization === 'sp2' ? 3 :
      hybridization === 'sp3' ? 4 :
      hybridization === 'sp3d' ? 5 :
      hybridization === 'sp3d2' || hybridization === 'd2sp3' ? 6 :
      hybridization === 'sp3d3' ? 7 : 0;

    const loneCount = Math.min(Math.round(lonePairs), hybridCount);

    if (hybridCount > 0) {
      vseprDirections(hybridCount).forEach((d, i) => {
        const dir = new Vector3(d[0], d[1], d[2]).normalize();
        const isLone = i >= hybridCount - loneCount;
        out.push({
          dir,
          color: isLone ? LOBE_COLOR.lone : LOBE_COLOR.hybrid,
          len: lobeLength * (isLone ? 1.18 : 1),
          phase: i * 0.8,
        });
      });
    }

    // Pure p character fades in as the morph slider goes to 0.
    const pWeight = 1 - m;
    if (pWeight > 0.03) {
      [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)].forEach((d, i) => {
        out.push({ dir: d, color: LOBE_COLOR.p, len: lobeLength * 1.3 * pWeight, phase: 3 + i });
      });
    }
    return out;
  }, [hybridization, morph, lonePairs, lobeLength]);

  useFrame(({ clock }) => {
    if (group.current && animate) group.current.rotation.y = clock.elapsedTime * 0.1;
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <sphereGeometry args={[radius * (1.45 - morph * 0.4), 20, 16]} />
        <meshStandardMaterial
          color={LOBE_COLOR.s}
          transparent
          opacity={0.14 * (1 - morph * 0.45)}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {lobes.map((l, i) => (
        <Lobe
          key={i}
          direction={l.dir}
          length={l.len}
          width={lobeWidth}
          color={l.color}
          opacity={opacity}
          animate={animate}
          phase={l.phase}
        />
      ))}
    </group>
  );
}

/**
 * σ / π overlap for one bond: a head-on lens (σ) plus side-on slabs (π).
 * Shown when a double or triple bond is pinch-held.
 */
export function BondOverlap({
  a,
  b,
  order,
  showPi,
}: {
  a: [number, number, number];
  b: [number, number, number];
  order: number;
  showPi: boolean;
}) {
  const { mid, quaternion, length, perp } = useMemo(() => {
    const pa = new Vector3(...a);
    const pb = new Vector3(...b);
    const mid = pa.clone().add(pb).multiplyScalar(0.5);
    const axis = pb.clone().sub(pa);
    const length = axis.length();
    const dir = axis.clone().normalize();
    const cross = new Vector3().crossVectors(UP, dir);
    const q = new Quaternion();
    if (cross.lengthSq() < 1e-8) q.setFromAxisAngle(new Vector3(1, 0, 0), dir.y < 0 ? Math.PI : 0);
    else q.setFromAxisAngle(cross.normalize(), Math.acos(Math.max(-1, Math.min(1, UP.dot(dir)))));
    let perp = new Vector3().crossVectors(dir, UP);
    if (perp.lengthSq() < 1e-8) perp = new Vector3(1, 0, 0);
    return { mid, quaternion: q, length, perp: perp.normalize() };
  }, [a, b]);

  return (
    <group position={mid} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[Math.max(0.12, length * 0.2), 16, 12]} />
        <meshStandardMaterial
          color={LOBE_COLOR.hybrid}
          emissive={LOBE_COLOR.hybrid}
          emissiveIntensity={0.8}
          transparent
          opacity={0.28}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {showPi &&
        [1, -1].map((s) => (
          <mesh key={s} position={perp.clone().multiplyScalar(s * 0.34).toArray() as [number, number, number]}>
            <boxGeometry args={[length * 0.72, 0.05, 0.3]} />
            <meshStandardMaterial
              color={LOBE_COLOR.p}
              emissive={LOBE_COLOR.p}
              emissiveIntensity={0.85}
              transparent
              opacity={0.32}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      {order >= 3 &&
        [1, -1].map((s) => (
          <mesh key={`z${s}`} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, s * 0.34]}>
            <boxGeometry args={[length * 0.72, 0.05, 0.3]} />
            <meshStandardMaterial
              color={LOBE_COLOR.p}
              emissive={LOBE_COLOR.p}
              emissiveIntensity={0.85}
              transparent
              opacity={0.32}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
    </group>
  );
}

/**
 * Crystal-field splitting diagram for coordination mode: a compact 3D bar chart of
 * the d-orbital energy levels (octahedral: t2g low / eg high).
 */
export function CrystalFieldDiagram({
  geometry,
  position = [0, 0, 0],
}: {
  geometry: 'octahedral' | 'tetrahedral' | 'square planar';
  position?: [number, number, number];
}) {
  const levels = useMemo(() => {
    if (geometry === 'octahedral') {
      return [
        { label: 'eg', y: 0.6, count: 2 },
        { label: 't2g', y: -0.4, count: 3 },
      ];
    }
    if (geometry === 'tetrahedral') {
      return [
        { label: 't2', y: 0.4, count: 3 },
        { label: 'e', y: -0.6, count: 2 },
      ];
    }
    return [
      { label: 'dx2−y2', y: 0.8, count: 1 },
      { label: 'dxy', y: 0.2, count: 1 },
      { label: 'dz2', y: -0.1, count: 1 },
      { label: 'dxz,dyz', y: -0.5, count: 2 },
    ];
  }, [geometry]);

  return (
    <group position={position}>
      {levels.map((level) =>
        Array.from({ length: level.count }).map((_, i) => (
          <mesh key={`${level.label}-${i}`} position={[(i - (level.count - 1) / 2) * 0.26, level.y, 0]}>
            <boxGeometry args={[0.16, 0.06, 0.02]} />
            <meshStandardMaterial
              color={level.y > 0 ? '#ff9d3c' : '#38e8ff'}
              emissive={level.y > 0 ? '#ff9d3c' : '#38e8ff'}
              emissiveIntensity={0.9}
              transparent
              opacity={0.9}
            />
          </mesh>
        )),
      )}
    </group>
  );
}
