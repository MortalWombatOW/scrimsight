/* eslint react/jsx-handler-names: "off" */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Zoom} from '@visx/zoom';
import {localPoint} from '@visx/event';
import {RectClipPath} from '@visx/clip-path';
import {scaleLinear} from '@visx/scale';
import {MapEntity, RenderState, Team} from '../../lib/data/types';
import Globals from '../../lib/data/globals';
import PlayerEntity from '../Chart/MapOverlay/PlayerEntity';
import {Button} from '@mui/material';
const bg = '#0a0a0a';
import {DefaultNode, Graph} from '@visx/network';
import {node} from 'webpack';
import useAnimatedPath from '../../hooks/useAnimatedPath';
import {
  useSpring,
  animated,
  config,
  useSprings,
  to,
  SpringValue,
} from '@react-spring/three';
import {groupColorClass} from '../../lib/color';
import MapBackground from '../Chart/MapOverlay/MapBackground';
import Connection from '../Chart/MapOverlay/Connection';
import {OrbitControls, Trail} from '@react-three/drei';
import {Canvas, useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {getHeroImage} from '../../lib/data/data';
import {useControls} from 'leva';

function Player({
  name,
  hero,
  pos,
}: {
  name: string;
  hero: string;
  pos: {
    x: SpringValue<number>;
    y: SpringValue<number>;
    z: SpringValue<number>;
  };
}) {
  const loader = new THREE.TextureLoader();
  const [heroImg, setHeroImg] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    loader.load(
      'https://scrimsight.com' + getHeroImage(hero),
      (texture) => {
        texture.center = new THREE.Vector2(0.5, 0.5);
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(200, 200);
        // console.log('loaded hero image', texture);

        setHeroImg(texture);
      },
      undefined,
      (err) => {
        console.error('error loading hero image', err);
      },
    );
  }, [hero]);

  const mesh = useRef();
  // console.log(
  //   'hero',
  //   hero,
  //   'pos',
  //   to([pos.x, pos.y, pos.z], (x, y, z) => [x, y, z]).get(),
  // );

  return (
    /* @ts-ignore */
    <animated.sprite
      key={name}
      scale={[1, 1, 1]}
      position={to([pos.x, pos.y, pos.z], (x, y, z) => [x, y, z])}>
      {heroImg ? (
        <spriteMaterial attach="material" map={heroImg} />
      ) : (
        <meshBasicMaterial attach="material" color="red" />
      )}
    </animated.sprite>
  );
}

const BackgroundPlane = () => {
  const mesh = useRef();
  const grid = useMemo(() => new THREE.GridHelper(100, 100), []);
  return (
    <group>
      {/* <mesh ref={mesh} geometry={geometry} material={material} /> */}
      <primitive object={grid} />
    </group>
  );
};

export type ZoomIProps = {
  width: number;
  height: number;
  entities: MapEntity[];
};

const ThreeRenderer = ({width, height, entities}: ZoomIProps) => {
  const {time} = useControls({time: 130});
  const {smoothTime} = useSpring({
    smoothTime: time,
  });
  const {zoom, offsetX, offsetY} = useSpring({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });

  const playerEntities = entities.filter((e) => e.entityType === 'player');

  const currentPosition = (
    entity: MapEntity,
  ): {x: number; y: number; z: number} | undefined => {
    const state = entity.states[time];
    if (!state) return undefined;
    return {
      x: Number(state.x) / 100,
      y: Number(state.y) / 100,
      z: Number(state.z) / 100,
    };
  };

  const [smoothPositions, set] = useSprings(playerEntities.length, (i) => ({
    x: 0,
    y: 0,
    z: 0,
  }));
  useEffect(() => {
    set((i) => {
      const pos = currentPosition(playerEntities[i]);
      if (!pos) return {x: 0, y: 0, z: 0};
      return {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        config: {duration: 100},
      };
    });
  }, [time]);

  return (
    <Canvas
      camera={{position: [0, 100, -30]}}
      onCreated={({gl}) => {
        gl.setClearColor(new THREE.Color(bg));
      }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {playerEntities.map((entity, i) => {
        const pos = smoothPositions[i];
        const hero = entity.states[time]?.hero as string;
        const name = entity.states[time]?.name as string;
        if (!pos || !hero) return null;
        return <Player hero={hero} pos={pos} name={name} />;
      })}
      <BackgroundPlane />
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeRenderer;
