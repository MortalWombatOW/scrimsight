import React, {useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export function PlayerConnection({
  source,
  target,
  amount,
  type,
  playing,
}: {
  amount: number;
  type: string;
  playing: boolean;
  source: THREE.Vector3;
  target: THREE.Vector3;
}) {
  const color = type === 'damage' ? '#b65153' : '#d7ae0b';
  const lightVelocity = 3;

  const sphereGeom = new THREE.SphereGeometry(0.1, 4, 4);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: amount / 10,
    toneMapped: false,
  });
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);

  const ref = React.useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.position.copy(source);
  }, [source]);

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }
    const pos = ref.current.position as THREE.Vector3;
    pos.lerp(target, lightVelocity * delta);
  });

  return (
    <group ref={ref}>
      {/* <primitive object={light} /> */}
      <primitive object={sphere} />
    </group>
  );
}
