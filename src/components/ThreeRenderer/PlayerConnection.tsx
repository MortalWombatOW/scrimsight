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
  source: {
    x: number;
    y: number;
    z: number;
  };
  target: {
    x: number;
    y: number;
    z: number;
  };
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

  const ref = React.useRef<THREE.Group>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const pos = ref.current.position as THREE.Vector3;
    pos.x = source.x;
    pos.y = source.y;
    pos.z = source.z;
  }, [source]);

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }
    const pos = ref.current.position as THREE.Vector3;
    const targetPos = new THREE.Vector3(target.x, target.y, target.z);
    pos.lerp(targetPos, lightVelocity * delta);
  });

  return (
    <group ref={ref}>
      {/* <primitive object={light} /> */}
      <primitive object={sphere} />
    </group>
  );
}
