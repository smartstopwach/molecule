/**
 * Scene.tsx — the holographic lab (spec §4).
 *
 * Layers, back to front:
 *   • dark background + exponential fog
 *   • holographic grid floor with a radial "reactor" glow
 *   • floating particles
 *   • the molecule (atoms, bonds, orbitals, ghost guide, protractor)
 *   • the gesture cursor (billboarded, never depth-tested so it is always visible)
 *   • bloom + chromatic aberration + vignette
 *
 * The camera is gesture-driven (cameraRig), never mouse-driven: two-hand rotate and
 * zoom write to the rig and `CameraDriver` eases the real camera toward it.
 */

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { AdditiveBlending, Color, Fog, PerspectiveCamera, Vector3 } from 'three';
import { MoleculeGroup } from './MoleculeGroup';
import { Particles, ReactionBurst } from './effects/Particles';
import { Effects } from './effects/Effects';
import { Cursor, type CursorState } from './Cursor';
import { cameraRig, cameraPosition, arAnchor } from './cameraRig';
import { sceneBridge } from './sceneBridge';
import { useGameStore } from '../store/useGameStore';
import { useMoleculeStore } from '../store/useMoleculeStore';

/** Where the gesture layer wants the cursor, and what state it is in. */
export const cursorTarget: {
  position: [number, number, number] | null;
  state: CursorState;
  visible: boolean;
} = {
  position: null,
  state: 'idle',
  visible: false,
};

export function setCursor(position: [number, number, number] | null, state: CursorState = 'idle', visible = true) {
  cursorTarget.position = position;
  cursorTarget.state = state;
  cursorTarget.visible = visible && !!position;
}

/** Transient reaction bursts pushed by the reaction engine. */
export const burstQueue: { id: number; position: [number, number, number]; color: string }[] = [];
export function pushBurst(position: [number, number, number], color = '#ff9d3c') {
  burstQueue.push({ id: Math.random(), position, color });
  if (burstQueue.length > 6) burstQueue.shift();
}

/** Registers the live camera with the gesture bridge and drives it from cameraRig. */
function CameraDriver() {
  const { camera, size, gl } = useThree();
  const target = useRef(new Vector3());

  useEffect(() => {
    sceneBridge.camera = camera;
    sceneBridge.width = size.width;
    sceneBridge.height = size.height;
  }, [camera, size]);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 4);
    cameraRig.current.theta += (cameraRig.theta - cameraRig.current.theta) * k;
    cameraRig.current.phi += (cameraRig.phi - cameraRig.current.phi) * k;
    cameraRig.current.radius += (cameraRig.radius - cameraRig.current.radius) * k;
    cameraRig.current.target.lerp(cameraRig.target, k);

    const pos = cameraPosition(target.current);
    camera.position.copy(pos);
    camera.lookAt(cameraRig.current.target);
    sceneBridge.workPlane.normal.copy(camera.getWorldDirection(new Vector3())).negate();
    sceneBridge.workPlane.constant = -sceneBridge.workPlane.normal.dot(cameraRig.current.target);
    void gl;
  });

  return null;
}

/**
 * Exponential fog + background driven by the current mode.
 * In AR mode (`transparent`) we paint no background at all so the dimmed,
 * blue-tinted webcam feed shows through the canvas.
 */
function Atmosphere({ exothermic, transparent }: { exothermic: boolean; transparent: boolean }) {
  const { scene } = useThree();
  useEffect(() => {
    const fog = new Fog(exothermic ? 0x2a0f04 : 0x03121b, 12, 44);
    scene.fog = fog;
    scene.background = transparent ? null : new Color(exothermic ? 0x140603 : 0x02080d);
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene, exothermic, transparent]);
  return null;
}

/** Reactor-style floor glow. */
function FloorGlow() {
  const mesh = useRef<{ scale: { setScalar: (n: number) => void }; rotation: { z: number } }>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    mesh.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.02);
    mesh.current.rotation.z = t * 0.05;
  });
  return (
    <mesh ref={mesh as never} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]}>
      <ringGeometry args={[3.2, 6.4, 64]} />
      <meshBasicMaterial color="#0a5f80" transparent opacity={0.28} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function SceneContents({ transparent }: { transparent: boolean }) {
  const highContrast = useGameStore((s) => s.settings.highContrast);
  const mode = useGameStore((s) => s.mode);
  const [bursts, setBursts] = useState<{ id: number; position: [number, number, number]; color: string }[]>([]);
  const [cursor, setCursorState] = useState({ position: null as [number, number, number] | null, state: 'idle' as CursorState, visible: false });
  const exothermic = useRef(false);

  // Poll the module-level queues once per animation frame batch (cheap, avoids
  // re-rendering React from inside the vision loop).
  useFrame(() => {
    if (burstQueue.length) {
      setBursts((b) => [...b, ...burstQueue]);
      burstQueue.length = 0;
    }
    if (
      cursorTarget.position !== cursor.position ||
      cursorTarget.state !== cursor.state ||
      cursorTarget.visible !== cursor.visible
    ) {
      setCursorState({ position: cursorTarget.position, state: cursorTarget.state, visible: cursorTarget.visible });
    }
    exothermic.current = mode === 'reaction';
  });

  return (
    <>
      <Atmosphere exothermic={exothermic.current} transparent={transparent} />
      <CameraDriver />

      {/* lighting: cool key, warm rim, and a soft fill so metals read */}
      <ambientLight intensity={0.55} color="#9fdcff" />
      <hemisphereLight args={['#38e8ff', '#04121b', 0.5]} />
      <pointLight position={[6, 8, 6]} intensity={38} distance={40} color="#8ff4ff" />
      <pointLight position={[-7, -4, -5]} intensity={22} distance={36} color="#ff9d3c" />
      <directionalLight position={[0, 10, 4]} intensity={0.35} color="#ffffff" />

      <Grid
        position={[0, -3.25, 0]}
        args={[40, 40]}
        cellSize={0.75}
        cellThickness={0.6}
        cellColor="#0d4d66"
        sectionSize={3.75}
        sectionThickness={1.1}
        sectionColor="#1b8fb5"
        fadeDistance={38}
        fadeStrength={1.4}
        followCamera={false}
        infiniteGrid
      />
      <FloorGlow />

      <Particles count={highContrast ? 500 : 900} energy={mode === 'reaction' ? 1 : 0} />

      <Suspense fallback={null}>
        <MoleculeGroup />
      </Suspense>

      {bursts.map((b) => (
        <ReactionBurst
          key={b.id}
          position={b.position}
          color={b.color}
          onDone={() => setBursts((list) => list.filter((x) => x.id !== b.id))}
        />
      ))}

      <Cursor position={cursor.position} state={cursor.state} visible={cursor.visible} />

      <Effects intensity={mode === 'reaction' ? 1.25 : 0.85} highContrast={highContrast} />
    </>
  );
}

export interface SceneProps {
  /**
   * AR mode: the canvas paints no background so the webcam feed (rendered behind
   * it by the app shell) reads through the hologram.
   */
  transparent?: boolean;
  className?: string;
}

export function Scene({ transparent = false, className }: SceneProps) {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
  return (
    <Canvas
      className={className}
      dpr={dpr}
      gl={{ antialias: true, alpha: transparent, powerPreference: 'high-performance' }}
      camera={{ fov: 48, near: 0.1, far: 200, position: [0, 3, 9] }}
      onCreated={({ gl }) => {
        gl.setClearColor(new Color('#02080d'), transparent ? 0 : 1);
      }}
    >
      <SceneContents transparent={transparent} />
    </Canvas>
  );
}

/**
 * Compute the world position of the AR palm anchor so a grabbed molecule can sit
 * on the user's hand (spec §4 "AR touch").
 */
export function updateArAnchorFromPalm(screenX: number, screenY: number) {
  const camera = sceneBridge.camera as PerspectiveCamera | null;
  if (!camera || !arAnchor.atomId) return;
  const point = new Vector3(screenX * 2 - 1, -(screenY * 2 - 1), 0.5).unproject(camera);
  arAnchor.position.copy(point);
}

export default Scene;
