'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function FloatingPhone({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.15;
      groupRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Phone body */}
      <RoundedBox args={[1.2, 2.2, 0.1]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#1C1917" roughness={0.2} metalness={0.8} />
      </RoundedBox>
      {/* Screen */}
      <RoundedBox args={[1.05, 2.0, 0.01]} radius={0.05} smoothness={4} position={[0, 0, 0.06]}>
        <meshStandardMaterial color="#F0FDF4" roughness={0.1} metalness={0} emissive="#F0FDF4" emissiveIntensity={0.3} />
      </RoundedBox>
      {/* Screen content - calorie circle */}
      <mesh position={[0, 0.3, 0.075]}>
        <ringGeometry args={[0.25, 0.3, 32]} />
        <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={0.5} />
      </mesh>
      {/* Macro bars */}
      {[
        { y: -0.3, w: 0.7, color: '#22C55E' },
        { y: -0.5, w: 0.5, color: '#F59E0B' },
        { y: -0.7, w: 0.6, color: '#3B82F6' },
      ].map((bar, i) => (
        <mesh key={i} position={[-0.15 + bar.w / 2, bar.y, 0.075]}>
          <boxGeometry args={[bar.w, 0.08, 0.005]} />
          <meshStandardMaterial color={bar.color} emissive={bar.color} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
