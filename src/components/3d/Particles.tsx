'use client';

import { Sparkles } from '@react-three/drei';

export function Particles() {
  return (
    <Sparkles
      count={60}
      scale={8}
      size={2}
      speed={0.4}
      color="#22C55E"
      opacity={0.5}
    />
  );
}
