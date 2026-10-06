/**
 * MoleculeGroup.tsx — the molecule itself: atoms, bonds, ghost skeleton, orbitals,
 * lone pairs, the floating formula plate, the bond-angle protractor and the AR
 * palm anchor.
 */

import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import { Group, Vector3, CanvasTexture, LinearFilter, Quaternion } from 'three';
import { Atom, GhostAtom } from './Atom';
import { Bond } from './Bond';
import { Orbitals, BondOverlap, CrystalFieldDiagram } from './Orbitals';
import { useMoleculeStore, type Atom3D } from '../store/useMoleculeStore';
import { useGameStore } from '../store/useGameStore';
import { analyzeMolecule, getBond, neighboursOf } from '../chemistry/chemistryEngine';
import { nameMolecule } from '../chemistry/naming';
import { idealBondLength, layoutMolecule } from './vsepSolver';
import { arAnchor } from './cameraRig';
import type { Hybridization } from '../chemistry/hybridization';

/** Canvas-texture "HUD plate" that floats above the molecule. */
function useTextPlate(lines: string[], width = 512) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = Math.max(64, 56 * lines.length);
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(3,18,27,0.72)';
    ctx.strokeStyle = 'rgba(56,232,255,0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(4, 4, canvas.width - 8, canvas.height - 8, 12);
    ctx.fill();
    ctx.stroke();
    lines.forEach((line, i) => {
      ctx.font = `600 ${i === 0 ? 40 : 26}px "Rajdhani", system-ui, sans-serif`;
      ctx.fillStyle = i === 0 ? '#8ff4ff' : '#b9e6f5';
      ctx.textAlign = 'center';
      ctx.fillText(line, canvas.width / 2, 46 + i * 34);
    });
    const tex = new CanvasTexture(canvas);
    tex.minFilter = LinearFilter;
    tex.magFilter = LinearFilter;
    return { texture: tex, aspect: canvas.width / canvas.height };
  }, [lines.join('|'), width]);
}

export function MoleculeGroup() {
  const group = useRef<Group>(null);
  const atoms = useMoleculeStore((s) => s.atoms);
  const bonds = useMoleculeStore((s) => s.bonds);
  const hoveredAtomId = useMoleculeStore((s) => s.hoveredAtomId);
  const selectedAtomIds = useMoleculeStore((s) => s.selectedAtomIds);
  const selectedBondId = useMoleculeStore((s) => s.selectedBondId);
  const showOrbitals = useMoleculeStore((s) => s.showOrbitals);
  const showLonePairs = useMoleculeStore((s) => s.showLonePairs);
  const showLabels = useMoleculeStore((s) => s.showLabels);
  const explode = useMoleculeStore((s) => s.explode);
  const ghost = useMoleculeStore((s) => s.ghost);
  const setHovered = useMoleculeStore((s) => s.setHovered);
  const selectAtom = useMoleculeStore((s) => s.selectAtom);
  const selectBond = useMoleculeStore((s) => s.selectBond);
  const colorBlind = useGameStore((s) => s.settings.colorBlind);
  const difficulty = useGameStore((s) => s.settings.difficulty);
  const [morph, setMorph] = useState(1);

  const analysis = useMemo(() => analyzeMolecule(useMoleculeStore.getState().toGraph(), { difficulty }), [atoms, bonds, difficulty]);
  const lonePairMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of analysis.atoms) map[a.id] = a.lonePairs;
    return map;
  }, [analysis]);

  const named = useMemo(() => {
    const graph = useMoleculeStore.getState().toGraph();
    if (graph.atoms.length === 0) return null;
    return nameMolecule(graph, { name: analysis.knownName, iupac: analysis.iupac });
  }, [analysis]);

  const plate = useTextPlate(
    named && atoms.length
      ? [named.name.toUpperCase(), `${analysis.formula} · ${analysis.hybridization} · ${analysis.molecularShape}`]
      : ['JARVIS LAB', 'Pinch in empty space to place an atom'],
  );

  const ghostAtoms = useMemo<Atom3D[]>(() => {
    if (!ghost) return [];
    const layout = layoutMolecule(ghost);
    return ghost.atoms.map((a) => ({
      id: `ghost_${a.id}`,
      element: a.element,
      charge: a.charge ?? 0,
      position: layout[a.id] ?? [0, 0, 0],
    }));
  }, [ghost]);

  // Explode view: pull every atom radially away from the centroid.
  useEffect(() => {
    if (!group.current) return;
    group.current.scale.setScalar(1 + explode * 0.12);
  }, [explode]);

  // AR palm anchor: pin the grabbed atom to the palm's world position.
  useFrame(() => {
    if (!group.current) return;
    if (arAnchor.active && arAnchor.atomId) {
      const atom = atoms.find((a) => a.id === arAnchor.atomId);
      if (atom) {
        const current = new Vector3(...atom.position);
        const delta = arAnchor.position.clone().sub(current);
        group.current.position.lerp(delta, 0.25);
      }
    } else {
      group.current.position.lerp(new Vector3(0, 0, 0), 0.18);
    }
  });

  // Morph the orbitals when the mode toggles so the "pure → hybrid" transition reads.
  useFrame((_, delta) => {
    const target = showOrbitals ? 1 : 1;
    if (Math.abs(morph - target) > 0.001) setMorph(morph + (target - morph) * Math.min(1, delta * 3));
  });

  const selectedBond = bonds.find((b) => b.id === selectedBondId) ?? null;
  const orbitalTarget = selectedAtomIds[0] ?? (atoms.length ? analysis.centralAtomId : null) ?? null;
  const orbitalAtom = analysis.atoms.find((a) => a.id === orbitalTarget);

  // Protractor: three selected atoms (or one selected + its two neighbours).
  const protractor = useMemo(() => {
    if (selectedAtomIds.length !== 3) return null;
    const [x, y, z] = selectedAtomIds;
    const graph = useMoleculeStore.getState().toGraph();
    const middle = [x, y, z].find((id) => {
      const n = neighboursOf(graph, id);
      return selectedAtomIds.filter((o) => o !== id).every((o) => n.includes(o));
    });
    if (!middle) return null;
    const outer = selectedAtomIds.filter((id) => id !== middle);
    const pm = atoms.find((a) => a.id === middle);
    const p1 = atoms.find((a) => a.id === outer[0]);
    const p2 = atoms.find((a) => a.id === outer[1]);
    if (!pm || !p1 || !p2) return null;
    const v1 = new Vector3(...p1.position).sub(new Vector3(...pm.position));
    const v2 = new Vector3(...p2.position).sub(new Vector3(...pm.position));
    const angle = (v1.angleTo(v2) * 180) / Math.PI;
    return { middle: pm, p1, p2, angle };
  }, [selectedAtomIds, atoms]);

  return (
    <group>
      {/* ghost-guide skeleton */}
      {ghostAtoms.map((a) => (
        <GhostAtom key={a.id} atom={a} colorBlind={colorBlind} />
      ))}

      <group ref={group}>
        {bonds.map((b) => {
          const a = atoms.find((x) => x.id === b.a);
          const c = atoms.find((x) => x.id === b.b);
          if (!a || !c) return null;
          const refId = neighboursOf(useMoleculeStore.getState().toGraph(), b.a).find((n) => n !== b.b);
          const refAtom = atoms.find((x) => x.id === refId);
          return (
            <Bond
              key={b.id}
              bond={b}
              a={a}
              b={c}
              reference={refAtom?.position}
              highlight={b.id === selectedBondId}
              explode={explode}
              colorBlind={colorBlind}
              onClick={selectBond}
              onHover={(id) => setHovered(id)}
            />
          );
        })}

        {atoms.map((a) => (
          <Atom
            key={a.id}
            atom={a}
            hovered={hoveredAtomId === a.id}
            selected={selectedAtomIds.includes(a.id)}
            locked={a.locked}
            showLabel={showLabels}
            showLonePairs={showLonePairs}
            colorBlind={colorBlind}
            lonePairCount={lonePairMap[a.id] ?? 0}
            explode={explode}
            onHover={setHovered}
            onSelect={(id) => selectAtom(id)}
          />
        ))}

        {/* σ / π overlap for the selected bond */}
        {selectedBond &&
          (() => {
            const a = atoms.find((x) => x.id === selectedBond.a);
            const b = atoms.find((x) => x.id === selectedBond.b);
            if (!a || !b) return null;
            return <BondOverlap a={a.position} b={b.position} order={selectedBond.order} showPi={selectedBond.order >= 2 || selectedBond.type === 'aromatic'} />;
          })()}

        {/* orbitals around the selected (or central) atom */}
        {showOrbitals && orbitalAtom && (
          <Orbitals
            element={orbitalAtom.element}
            hybridization={orbitalAtom.hybridization.hybridization as Hybridization}
            morph={morph}
            position={atoms.find((a) => a.id === orbitalAtom.id)?.position}
            lonePairs={orbitalAtom.lonePairs}
          />
        )}

        {/* crystal-field diagram for coordination centres */}
        {showOrbitals && orbitalAtom?.element && ['Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Cr', 'Mn', 'Ag'].includes(orbitalAtom.element) && (
          <CrystalFieldDiagram
            geometry={orbitalAtom.sigma >= 6 ? 'octahedral' : orbitalAtom.sigma === 4 ? 'square planar' : 'tetrahedral'}
            position={[0, 2.2, 0]}
          />
        )}
      </group>

      {/* floating name plate */}
      {atoms.length > 0 && (
        <Billboard position={[0, boundingTop(atoms) + 0.9, 0]}>
          <mesh>
            <planeGeometry args={[2.9, 2.9 / plate.aspect]} />
            <meshBasicMaterial map={plate.texture} transparent depthWrite={false} />
          </mesh>
        </Billboard>
      )}

      {/* bond-angle protractor */}
      {protractor && <Protractor {...protractor} />}
    </group>
  );
}

function boundingTop(atoms: Atom3D[]): number {
  return atoms.reduce((max, a) => Math.max(max, a.position[1]), 0);
}

/** Arc + numeric readout between three selected atoms. */
function Protractor({
  middle,
  p1,
  p2,
  angle,
}: {
  middle: Atom3D;
  p1: Atom3D;
  p2: Atom3D;
  angle: number;
}) {
  const pm = new Vector3(...middle.position);
  const a = new Vector3(...p1.position).sub(pm);
  const b = new Vector3(...p2.position).sub(pm);
  const r = Math.min(a.length(), b.length()) * 0.42;
  const points: [number, number, number][] = [];
  const steps = 24;
  const axis = new Vector3().crossVectors(a, b).normalize();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Slerp between the two bond directions.
    const dir = slerp(a.clone().normalize(), b.clone().normalize(), t, axis);
    points.push([pm.x + dir.x * r, pm.y + dir.y * r, pm.z + dir.z * r]);
  }
  const midDir = slerp(a.clone().normalize(), b.clone().normalize(), 0.5, axis);
  const labelPos: [number, number, number] = [pm.x + midDir.x * r * 1.35, pm.y + midDir.y * r * 1.35, pm.z + midDir.z * r * 1.35];

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap((p) => p)), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffc76b" linewidth={2} transparent opacity={0.95} />
      </line>
      <Billboard position={labelPos}>
        <mesh>
          <planeGeometry args={[0.9, 0.42]} />
          <meshBasicMaterial color="#03121b" transparent opacity={0.75} />
        </mesh>
      </Billboard>
      <Billboard position={[labelPos[0], labelPos[1], labelPos[2] + 0.01]}>
        <mesh>
          <planeGeometry args={[0.86, 0.38]} />
          <meshBasicMaterial map={angleTexture(angle)} transparent depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

const angleTextureCache = new Map<string, CanvasTexture>();
function angleTexture(angle: number): CanvasTexture {
  const key = angle.toFixed(1);
  const cached = angleTextureCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 112;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 112);
  ctx.font = '700 52px "Rajdhani", system-ui, sans-serif';
  ctx.fillStyle = '#ffc76b';
  ctx.textAlign = 'center';
  ctx.fillText(`${angle.toFixed(1)}°`, 128, 68);
  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter;
  angleTextureCache.set(key, tex);
  return tex;
}

/** Shortest-arc interpolation between two unit vectors. */
function slerp(a: Vector3, b: Vector3, t: number, axis: Vector3): Vector3 {
  const angle = a.angleTo(b);
  if (angle < 1e-5) return a.clone();
  // Rotate `a` toward `b` about `axis` (Rodrigues in the plane spanned by a ⟂ axis).
  const quaternion = new Quaternion().setFromAxisAngle(axis, angle * t);
  return a.clone().applyQuaternion(quaternion).normalize();
}
