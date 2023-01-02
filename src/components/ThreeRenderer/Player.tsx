import React, {useEffect, useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {getHeroImage} from '../../lib/data/data';
import {getColorForHero} from '../../lib/color';

export function Player({
  name,
  hero,
  getPosition,
  playing,
}: {
  name: string;
  hero: string;
  getPosition: () => {x: number; y: number; z: number} | undefined;
  playing: boolean;
}) {
  const loader = new THREE.TextureLoader();
  const [heroImg, setHeroImg] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    loader.load(
      'https://scrimsight.com' + getHeroImage(hero),
      (texture) => {
        setHeroImg(texture);
      },
      undefined,
      (err) => {
        console.error('error loading hero image', err);
      },
    );
  }, [hero]);

  const ref = useRef<THREE.Mesh>();
  const spriteRef = useRef<THREE.Sprite>();
  // console.log(
  //   'hero',
  //   hero,
  //   'pos',
  //   to([pos.x, pos.y, pos.z], (x, y, z) => [x, y, z]).get(),
  // );
  useFrame(({camera}, delta) => {
    // move towards target position
    const pos = getPosition();
    if (ref.current && pos) {
      const currentPos = ref.current.position;
      const {x, y, z} = currentPos;
      const dx = pos.x - x;
      const dy = pos.y - y;
      const dz = pos.z - z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const velocity = 3;
      if (dist > 0.1 && playing) {
        ref.current.position.x += (dx / dist) * velocity * delta;
        ref.current.position.y += (dy / dist) * velocity * delta;
        ref.current.position.z += (dz / dist) * velocity * delta;
      } else {
        // snap to position
        ref.current.position.x = pos.x;
        ref.current.position.y = pos.y;
        ref.current.position.z = pos.z;
      }
      if (spriteRef.current) {
        const cameraPos = camera.position;
        // vector from currentPos to cameraPos
        const dir = new THREE.Vector3(
          cameraPos.x - currentPos.x,
          cameraPos.y - currentPos.y,
          cameraPos.z - currentPos.z,
        ).normalize();
        // rotate sprite to face camera
        spriteRef.current.position.x = dir.x;
        spriteRef.current.position.y = dir.y + 0.4;
        spriteRef.current.position.z = dir.z;
      }
    }
  });

  return (
    /* @ts-ignore */
    <group key={name} ref={ref}>
      <mesh scale={[1, 1, 1]}>
        <capsuleGeometry attach="geometry" args={[0.5, 1, 8]} />
        <meshLambertMaterial attach="material" color={getColorForHero(hero)} />
      </mesh>
      <sprite scale={[1, 1, 1]} ref={spriteRef}>
        {heroImg ? <spriteMaterial attach="material" map={heroImg} /> : null}
      </sprite>
    </group>
  );
}
