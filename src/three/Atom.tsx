/**
 * Atom.tsx — one atom in the workspace.
 *
 * Sphere sized by covalent radius, CPK colour (or the colour-blind palette),
 * an emissive rim for the JARVIS glow, a billboarded element label and optional
 * translucent lone-pair lobes.
 *
 * Geometry and materials are cached per element so 40 atoms cost ~2 draw calls'
 * worth of GPU memory, and everything is disposed through R3F's reconciler.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import {
  AdditiveBlending,
  BackSide,
  Color,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  type Group,
} from 'three';
import type { Atom3D } from '../store/useMoleculeStore';
import { elementColor, getElement, renderRadius } from '../chemistry/elements';
import { labelTexture, glowTexture } from './labelTexture';

/** Colour-blind-safe palette (Okabe–Ito inspired) used when the setting is on. */
const CB_PALETTE: Record<string, string> = {
  H: '#ffffff', C: '#56b4e9', N: '#0072b2', O: '#d55e00', F: '#009e73',
  Cl: '#e69f00', Br: '#cc79a7', I: '#945cf0', S: '#f0e442', P: '#ff9d3c',
  Na: '#a97bff', K: '#8c8cff', Mg: '#66c2a5', Ca: '#99d594', Al: '#c9a7ff',
  B: '#fbaf5d', Be: '#8effc1', Si: '#d0b48a', Fe: '#e08a3c', Cu: '#e08a5e',
  Co: '#5e8aff', Ni: '#5ee0c0', Zn: '#9bb4c9', He: '#7ef0ff', Ne: '#7ec8ff',
  Ar: '#a97bff', Li: '#b98aff', Xe: '#5ec8ff', Kr: '#7ee0ff', Mn: '#ff9dbb',
  Cr: '#9dbbff', Ag: '#d6e4f0',
};

const geometryCache = new Map<number, SphereGeometry>();
const materialCache = new Map<string, MeshStandardMaterial>();

function sphereGeometry(radius: number): SphereGeometry {
  const key = Math.round(radius * 1000);
  let geo = geometryCache.get(key);
  if (!geo) {
    // 24×18 is plenty for a sphere of this size on screen and keeps the vertex
    // count low enough for 60 fps on integrated GPUs.
    geo = new SphereGeometry(radius, 24, 18);
    geometryCache.set(key, geo);
  }
  return geo;
}

export function atomMaterial(element: string, colorBlind = false): MeshStandardMaterial {
  const key = `${element}|${colorBlind}`;
  let mat = materialCache.get(key);
  if (!mat) {
    const base = colorBlind ? (CB_PALETTE[element] ?? '#38e8ff') : elementColor(element);
    mat = new MeshStandardMaterial({
      color: new Color(base),
      emissive: new Color(base).multiplyScalar(0.22),
      roughness: 0.32,
      metalness: 0.22,
      transparent: true,
      opacity: 0.97,
    });
    materialCache.set(key, mat);
  }
  return mat;
}

export function atomColor(element: string, colorBlind = false): string {
  return colorBlind ? (CB_PALETTE[element] ?? '#38e8ff') : elementColor(element);
}

export interface AtomProps {
  atom: Atom3D;
  hovered?: boolean;
  selected?: boolean;
  locked?: boolean;
  showLabel?: boolean;
  showLonePairs?: boolean;
  colorBlind?: boolean;
  lonePairCount?: number;
  /** 0..1 — pushes lone pairs outward for Explode View. */
  explode?: number;
  scaleBoost?: number;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
}

export function Atom({
  atom,
  hovered = false,
  selected = false,
  locked = false,
  showLabel = true,
  showLonePairs = false,
  colorBlind = false,
  lonePairCount = 0,
  explode = 0,
  scaleBoost = 1,
  onHover,
  onSelect,
}: AtomProps) {
  const group = useRef<Group>(null);
  const glow = useRef<Mesh>(null);
  const element = getElement(atom.element);
  const radius = renderRadius(atom.element) * scaleBoost;
  const color = atomColor(atom.element, colorBlind);

  const geometry = useMemo(() => sphereGeometry(radius), [radius]);
  const material = useMemo(() => atomMaterial(atom.element, colorBlind), [atom.element, colorBlind]);
  const glowMap = useMemo(() => glowTexture(color), [color]);
  const labelMap = useMemo(() => labelTexture(atom.element, '#ffffff'), [atom.element]);

  // Pulse the glow on hover / selection — cheap, and it reads as "JARVIS is watching".
  useFrame(({ clock }) => {
    if (!glow.current) return;
    const t = clock.elapsedTime;
    const base = hovered ? 1.25 : selected ? 1.15 : 1;
    const pulse = 1 + Math.sin(t * 2.4 + atom.position[0]) * (hovered ? 0.12 : 0.05);
    glow.current.scale.setScalar(radius * 3.1 * base * pulse);
    const mat = glow.current.material as MeshStandardMaterial;
    mat.opacity = (hovered ? 0.5 : selected ? 0.4 : 0.22) * (locked ? 1.4 : 1);
  });

  const lobeRadius = radius * 0.34;

  return (
    <group ref={group} position={atom.position}>
      {/* glow shell */}
      <mesh ref={glow} geometry={geometry}>
        <meshBasicMaterial
          color={locked ? '#4dffb8' : color}
          transparent
          opacity={0.22}
          blending={AdditiveBlending}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* the atom */}
      <mesh
        geometry={geometry}
        material={material}
        castShadow={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.(atom.id);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover?.(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(atom.id);
        }}
      >
        {(hovered || selected) && (
          <meshStandardMaterial
            color={color}
            emissive={selected ? '#38e8ff' : '#ffc76b'}
            emissiveIntensity={0.9}
            roughness={0.25}
            metalness={0.3}
          />
        )}
      </mesh>

      {/* lone pairs: small translucent lobes pushed out by the explode slider */}
      {showLonePairs && lonePairCount > 0 &&
        Array.from({ length: Math.min(3, Math.round(lonePairCount)) }).map((_, i) => {
          const angle = (i / Math.max(1, Math.round(lonePairCount))) * Math.PI * 2;
          const d = radius * (1.5 + explode * 1.6);
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * d, Math.sin(angle) * d * 0.6 + radius * 0.4, Math.sin(angle) * d * 0.5]}
            >
              <sphereGeometry args={[lobeRadius * (1 + explode * 0.5), 12, 10]} />
              <meshStandardMaterial
                color="#8ef0ff"
                transparent
                opacity={0.3 + explode * 0.3}
                emissive="#38e8ff"
                emissiveIntensity={0.6}
                depthWrite={false}
              />
            </mesh>
          );
        })}

      {/* formal-charge badge */}
      {atom.charge !== 0 && (
        <Billboard position={[radius * 1.5, radius * 1.5, 0]}>
          <sprite scale={[radius * 1.5, radius * 1.5, 1]}>
            <spriteMaterial
              map={labelTexture(atom.charge > 0 ? '+' : '−', atom.charge > 0 ? '#4dffb8' : '#ff6b7a')}
              transparent
              depthWrite={false}
            />
          </sprite>
        </Billboard>
      )}

      {/* element symbol */}
      {showLabel && (
        <Billboard position={[0, 0, radius * 1.02]}>
          <sprite scale={[radius * 2.4, radius * 2.4, 1]}>
            <spriteMaterial map={labelMap} transparent depthWrite={false} opacity={0.95} />
          </sprite>
        </Billboard>
      )}
      {/*
        Synthesiser note: the glow sprite below is a screen-space halo so small atoms
        (hydrogen) still read clearly at distance.
      */}
      <sprite scale={[radius * 5, radius * 5, 1]}>
        <spriteMaterial
          map={glowMap}
          transparent
          opacity={hovered ? 0.5 : 0.22}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/** Rim-light shell used by the ghost-guide skeleton. */
export function GhostAtom({ atom, colorBlind = false }: { atom: Atom3D; colorBlind?: boolean }) {
  const radius = renderRadius(atom.element) * 1.04;
  const color = atomColor(atom.element, colorBlind);
  return (
    <group position={atom.position}>
      <mesh>
        <sphereGeometry args={[radius, 18, 14]} />
        <meshBasicMaterial color={color} transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.06, 18, 14]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  );
}

export { radiusOf };
function radiusOf(element: string) {
  return renderRadius(element);
}
