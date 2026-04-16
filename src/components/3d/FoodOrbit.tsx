'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Apple } from './Apple';
import { Avocado } from './Avocado';

/** Orange fruit */
function Orange({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      ref.current.rotation.x = Math.sin(Date.now() * 0.0008) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position} scale={1.1}>
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#F97316" roughness={0.6} metalness={0.02} />
      </mesh>
      {/* Tiny stem bump */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.04, 0.03, 0.05, 8]} />
        <meshStandardMaterial color="#A16207" roughness={0.9} />
      </mesh>
      {/* Small leaf */}
      <mesh position={[0.06, 0.38, 0]} rotation={[0.3, 0, -0.4]}>
        <planeGeometry args={[0.12, 0.06]} />
        <meshStandardMaterial color="#16A34A" side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Broccoli floret */
function Broccoli({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={ref} position={position} scale={1.0}>
      {/* Stem */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.35, 8]} />
        <meshStandardMaterial color="#86EFAC" roughness={0.5} />
      </mesh>
      {/* Floret clusters - multiple green spheres */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#15803D" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0, 0.08]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>
      <mesh position={[-0.12, 0.02, 0.1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#14532D" roughness={0.7} />
      </mesh>
      <mesh position={[0.05, 0.12, -0.08]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#16A34A" roughness={0.7} />
      </mesh>
      <mesh position={[-0.08, -0.02, -0.12]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#15803D" roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Carrot */
function Carrot({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={ref} position={position} rotation={[0, 0, -0.8]} scale={1.0}>
      {/* Carrot body - cone */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.7, 12]} />
        <meshStandardMaterial color="#F97316" roughness={0.5} metalness={0.02} />
      </mesh>
      {/* Green top leaves */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.04, 0.35 + i * 0.02, Math.sin(angle) * 0.04]}
          rotation={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
        >
          <planeGeometry args={[0.05, 0.2]} />
          <meshStandardMaterial color="#22C55E" side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Blueberry cluster */
function Blueberries({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.35;
    }
  });

  const berryPositions: [number, number, number][] = [
    [0, 0, 0],
    [0.14, 0.05, 0.05],
    [-0.1, 0.04, 0.1],
    [0.05, -0.08, 0.12],
    [-0.06, 0.1, -0.05],
    [0.1, -0.04, -0.08],
  ];

  return (
    <group ref={ref} position={position}>
      {berryPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#6366F1' : '#4F46E5'}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export function FoodOrbit() {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={orbitRef}>
      <Apple position={[2.2, 0.5, 0]} />
      <Avocado position={[-2, -0.3, 1]} />
      <Orange position={[1.5, -0.8, -1.8]} />
      <Broccoli position={[-1.2, 1.0, -1.5]} />
      <Carrot position={[0.8, 1.3, 1.8]} />
      <Blueberries position={[-1.8, -0.6, -0.8]} />
    </group>
  );
}
