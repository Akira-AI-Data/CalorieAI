'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Avocado({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  const bodyGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const angle = t * Math.PI;
      const r = Math.sin(angle) * (0.35 + 0.15 * Math.sin(angle * 0.5));
      points.push(new THREE.Vector2(r, t * 1.0 - 0.5));
    }
    return new THREE.LatheGeometry(points, 24);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.25;
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0.4, 0, 0.3]} scale={1.1}>
      {/* Outer dark green skin - full pear shape */}
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial color="#166534" roughness={0.8} metalness={0.02} />
      </mesh>
      {/* Cut face - lighter green inner flesh, flat circle */}
      <mesh position={[0, -0.02, 0.2]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.3, 24]} />
        <meshStandardMaterial color="#BEF264" roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Seed/pit */}
      <mesh position={[0, -0.05, 0.25]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#92400E" roughness={0.4} metalness={0.15} />
      </mesh>
    </group>
  );
}
