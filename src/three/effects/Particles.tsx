/**
 * effects/Particles.tsx — the floating dust of the holographic lab.
 *
 * One THREE.Points object with a procedurally generated sprite texture, 900
 * particles drifting on a sin/cos field. Zero per-frame allocations.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, CanvasTexture, Float32BufferAttribute, Points } from 'three';

export interface ParticlesProps {
  count?: number;
  radius?: number;
  color?: string;
  /** Extra upward drift when a reaction is running (heat shimmer). */
  energy?: number;
}

export function Particles({ count = 900, radius = 22, color = '#38e8ff', energy = 0 }: ParticlesProps) {
  const points = useRef<Points>(null);

  const { geometry, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.6) * radius;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * radius * 0.7;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;
      seeds[i * 3] = Math.random() * Math.PI * 2;
      seeds[i * 3 + 1] = 0.25 + Math.random() * 0.9;
      seeds[i * 3 + 2] = Math.random() * Math.PI * 2;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return { geometry, seeds };
  }, [count, radius]);

  const sprite = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, `${color}cc`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, [color]);

  useFrame(({ clock }, delta) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const t = clock.elapsedTime;
    const attr = geo.getAttribute('position') as Float32BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      arr[ix + 1] += (0.12 + energy * 1.6) * delta * seeds[ix + 1];
      if (arr[ix + 1] > radius * 0.5) arr[ix + 1] = -radius * 0.5;
      arr[ix] += Math.sin(t * 0.25 + seeds[ix]) * delta * 0.12;
      arr[ix + 2] += Math.cos(t * 0.22 + seeds[ix + 2]) * delta * 0.12;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        map={sprite}
        transparent
        opacity={0.55}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Reaction burst: a short-lived expanding shell of sparks. Mount it for ~1.2 s when
 * a reaction fires; it disposes itself through the normal React tree.
 */
export function ReactionBurst({
  position = [0, 0, 0],
  color = '#ff9d3c',
  onDone,
}: {
  position?: [number, number, number];
  color?: string;
  onDone?: () => void;
}) {
  const points = useRef<Points>(null);
  const start = useRef(performance.now());
  const directions = useMemo(() => {
    const n = 260;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.6 + Math.random() * 1.4;
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      arr[i * 3 + 1] = Math.cos(phi) * speed;
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }
    return arr;
  }, []);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(new Float32Array(directions.length), 3));
    return geo;
  }, [directions]);

  useFrame(() => {
    const elapsed = (performance.now() - start.current) / 1000;
    const geo = points.current?.geometry;
    if (!geo) return;
    const attr = geo.getAttribute('position') as Float32BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < directions.length / 3; i++) {
      arr[i * 3] = directions[i * 3] * elapsed;
      arr[i * 3 + 1] = directions[i * 3 + 1] * elapsed;
      arr[i * 3 + 2] = directions[i * 3 + 2] * elapsed;
    }
    attr.needsUpdate = true;
    if (points.current) {
      const mat = points.current.material as { opacity: number };
      mat.opacity = Math.max(0, 1 - elapsed / 1.3);
    }
    if (elapsed > 1.3) onDone?.();
  });

  return (
    <points ref={points} geometry={geometry} position={position}>
      <pointsMaterial size={0.13} color={color} transparent opacity={1} depthWrite={false} sizeAttenuation />
    </points>
  );
}
