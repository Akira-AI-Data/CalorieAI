'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Apple({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.2}>
      {/* Apple body - red, round */}
      <mesh>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#EF4444" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Slight indent at top */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#EF4444" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.025, 0.018, 0.18, 8]} />
        <meshStandardMaterial color="#78350F" roughness={0.9} />
      </mesh>
      {/* Leaf */}
      <mesh position={[0.1, 0.5, 0.02]} rotation={[0.2, 0.3, -0.6]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshStandardMaterial color="#22C55E" side={THREE.DoubleSide} roughness={0.4} />
      </mesh>
      {/* Subtle highlight */}
      <mesh position={[0.15, 0.15, 0.3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FCA5A5" roughness={0.1} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
