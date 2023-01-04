import React, {useEffect, useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {getHeroImage} from '../../lib/data/data';
import {getColorFor} from '../../lib/color';

interface PlayerProps {
  name: string;
  hero: string;
  getPosition: () => {x: number; y: number; z: number} | undefined;
  playing: boolean;
  team: 1 | 2;
  health: number;
}

export const Player = React.forwardRef<PlayerProps, THREE.Group>(
  (
    {name, hero, getPosition, playing, team, health}: PlayerProps,
    ref: React.Ref<THREE.Group> | null,
  ) => {
    if (!ref) {
      console.error('ref is null');
      return null;
    }

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

    const spriteRef = useRef<THREE.Sprite>();

    const pillRadius = 0.3;
    const spriteOffset = pillRadius + 0.15;
    useFrame(({camera}, delta) => {
      // move towards target position
      const pos = getPosition();
      const current = (ref as React.MutableRefObject<THREE.Group>).current;
      if (current && pos) {
        const currentPos = current.position;
        const {x, y, z} = currentPos;
        const dx = pos.x - x;
        const dy = pos.y - y;
        const dz = pos.z - z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const velocity = 3;
        if (dist > 0.1 && playing) {
          current.position.x += (dx / dist) * velocity * delta;
          current.position.y += (dy / dist) * velocity * delta;
          current.position.z += (dz / dist) * velocity * delta;
        } else {
          // snap to position
          current.position.x = pos.x;
          current.position.y = pos.y;
          current.position.z = pos.z;
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
          spriteRef.current.position.x = dir.x * spriteOffset;
          spriteRef.current.position.y = dir.y * spriteOffset + 0.2;
          spriteRef.current.position.z = dir.z * spriteOffset;
        }
      }
    });

    return (
      /* @ts-ignore */
      <group key={name} ref={ref}>
        <mesh scale={[1, 1, 1]}>
          <capsuleGeometry attach="geometry" args={[pillRadius, 0.7, 8]} />
          <meshLambertMaterial
            attach="material"
            color={health > 0 ? getColorFor(hero) : 0x000000}
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
  },
);
