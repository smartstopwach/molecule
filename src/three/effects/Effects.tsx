/**
 * effects/Effects.tsx — post-processing (spec §4: bloom).
 *
 * @react-three/postprocessing is imported lazily-safe: if the GPU/driver refuses the
 * effect composer we render the scene untouched rather than showing a black canvas.
 */

import { Component, type ReactNode } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

export interface EffectsProps {
  /** Bloom intensity — raised automatically for exothermic reactions. */
  intensity?: number;
  highContrast?: boolean;
}

class EffectBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('[JARVIS] post-processing disabled:', error);
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}

export function Effects({ intensity = 0.85, highContrast = false }: EffectsProps) {
  return (
    <EffectBoundary>
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={highContrast ? intensity * 1.35 : intensity}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.32}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new Vector2(0.0006, 0.0009)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.22} darkness={0.75} />
      </EffectComposer>
    </EffectBoundary>
  );
}

export default Effects;
