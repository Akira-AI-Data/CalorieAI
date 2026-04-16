'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { FloatingPhone } from './FloatingPhone';
import { FoodOrbit } from './FoodOrbit';
import { Particles } from './Particles';

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#22C55E" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <FloatingPhone position={[0, 0, 0]} />
      </Float>

      <FoodOrbit />
      <Particles />

      <Environment preset="city" environmentIntensity={0.3} />
    </>
  );
}

function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-green to-brand-green-light animate-pulse" />
    </div>
  );
}

export function Scene() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Suspense fallback={<Fallback />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  );
}
