import React, {useEffect, useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {getHeroImage} from '../../lib/data/data';
import {getColorFor} from '../../lib/color';

interface PlayerProps {
  name: string;
  hero: string;
  position: THREE.Vector3;
  speed: number;
  playing: boolean;
  team: 1 | 2;
  health: number;
}

export const Player = ({
  name,
  hero,
  position,
  playing,
  team,
  health,
  speed,
}: PlayerProps) => {
  const ref = useRef<THREE.Group>();

  const loader = new THREE.TextureLoader();
  const [lastHero, setLastHero] = useState(hero);

  useEffect(() => {
    if (lastHero !== hero) {
      setLastHero(hero);
      setHeroImg(null);
    }
  }, [hero]);

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
  }, [lastHero]);

  const spriteRef = useRef<THREE.Sprite | null>(null);

  const pillRadius = 0.3;
  const spriteOffset = pillRadius + 0.15;
  useFrame(({camera}, delta) => {
    // move towards target position
    const current = (ref as React.MutableRefObject<THREE.Group>).current;
    if (current && position) {
      const currentPos = current.position;
      const {x, y, z} = currentPos;
      const dx = position.x - x;
      const dy = position.y - y;
      const dz = position.z - z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 0.1 && playing) {
        current.position.x += (dx / dist) * speed * delta;
        current.position.y += (dy / dist) * speed * delta;
        current.position.z += (dz / dist) * speed * delta;
      } else {
        // snap to position
        current.position.x = position.x;
        current.position.y = position.y;
        current.position.z = position.z;
      }
    }
    if (spriteRef.current) {
      const cameraPos = camera.position;
      // vector from currentPos to cameraPos
      const dir = new THREE.Vector3(
        cameraPos.x - position.x,
        cameraPos.y - position.y,
        cameraPos.z - position.z,
      ).normalize();

      // rotate sprite to face camera
      spriteRef.current.position.x = dir.x * spriteOffset;
      spriteRef.current.position.y = dir.y * spriteOffset + 0.2;
      spriteRef.current.position.z = dir.z * spriteOffset;
      // spriteRef.current.lookAt(cameraPos);
    }
  });

  return (
    /* @ts-ignore */
    <group key={name} ref={ref}>
      <mesh scale={[1, 1, 1]}>
        <capsuleGeometry attach="geometry" args={[pillRadius, 0.7, 8]} />
        <meshLambertMaterial
          attach="material"
          color={health > 0 ? getColorFor(lastHero) : 0x000000}
        />
      </mesh>
      <mesh scale={[1.25, 1.25, 1.25]}>
        <capsuleGeometry attach="geometry" args={[pillRadius, 0.7, 8]} />
        <meshBasicMaterial
          attach="material"
          color={getColorFor(team === 1 ? 'team1' : 'team2')}
          side={THREE.BackSide}
        />
      </mesh>
      <sprite scale={[0.6, 0.6, 0.6]} ref={spriteRef}>
        {heroImg ? <spriteMaterial attach="material" map={heroImg} /> : null}
      </sprite>
    </group>
  );
};
