/**
 * Cursor.tsx — the glowing fingertip cursor (spec §3).
 *
 * A billboarded ring that changes colour and size with state:
 *   idle cyan → hovering an atom (amber) → pinching (green, contracting)
 * → rejected (red flash).
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import { AdditiveBlending, Group, Mesh, MeshBasicMaterial } from 'three';
import { glowTexture } from './labelTexture';

export type CursorState = 'idle' | 'hover' | 'pinch' | 'reject' | 'build';

const COLORS: Record<CursorState, string> = {
  idle: '#38e8ff',
  hover: '#ffc76b',
  pinch: '#4dffb8',
  reject: '#ff4d5e',
  build: '#a97bff',
};

export interface CursorProps {
  position: [number, number, number] | null;
  state?: CursorState;
  visible?: boolean;
}

export function Cursor({ position, state = 'idle', visible = true }: CursorProps) {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!group.current || !position) return;
    group.current.position.lerp({ x: position[0], y: position[1], z: position[2] } as never, 0.35);
    const t = clock.elapsedTime;
    const color = COLORS[state];
    if (ring.current) {
      const pulse = state === 'pinch' ? 0.8 : 1 + Math.sin(t * 3) * 0.06;
      ring.current.scale.setScalar(pulse);
      ring.current.rotation.z = t * 0.6;
      const ringMat = ring.current.material as MeshBasicMaterial;
      ringMat.color.set(color);
      ringMat.opacity = state === 'idle' ? 0.55 : 0.9;
    }
    if (core.current) {
      core.current.scale.setScalar(state === 'pinch' ? 0.35 : 0.2 + Math.sin(t * 5) * 0.02);
      (core.current.material as MeshBasicMaterial).color.set(color);
    }
  });

  if (!visible || !position) return null;

  return (
    <group ref={group}>
      <Billboard>
        <mesh ref={ring}>
          <ringGeometry args={[0.16, 0.21, 32]} />
          <meshBasicMaterial color={COLORS[state]} transparent opacity={0.75} blending={AdditiveBlending} depthWrite={false} depthTest={false} />
        </mesh>
        <mesh ref={core}>
          <circleGeometry args={[0.06, 24]} />
          <meshBasicMaterial color={COLORS[state]} transparent opacity={0.95} blending={AdditiveBlending} depthWrite={false} depthTest={false} />
        </mesh>
        <sprite scale={[1.1, 1.1, 1]}>
          <spriteMaterial map={glowTexture(COLORS[state])} transparent opacity={0.35} blending={AdditiveBlending} depthWrite={false} />
        </sprite>
      </Billboard>
      {/* crosshair ticks */}
      <Billboard>
        {[0, Math.PI / 2].map((r) => (
          <mesh key={r} rotation={[0, 0, r]}>
            <planeGeometry args={[0.5, 0.012]} />
            <meshBasicMaterial color={COLORS[state]} transparent opacity={0.35} blending={AdditiveBlending} depthWrite={false} depthTest={false} />
          </mesh>
        ))}
      </Billboard>
    </group>
  );
}

export default Cursor;
