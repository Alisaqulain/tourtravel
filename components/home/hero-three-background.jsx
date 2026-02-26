'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingParticles() {
  const count = 120;
  const mesh = useRef();
  const light = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    if (light.current) light.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3;
  });

  return (
    <>
      <pointLight ref={light} color="#FBBF24" intensity={0.4} position={[2, 2, 2]} />
      <pointLight color="#EAB308" intensity={0.2} position={[-3, -1, 2]} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          transparent
          size={0.12}
          color="#FBBF24"
          opacity={0.35}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

export function HeroThreeBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
