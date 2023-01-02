/* eslint react/jsx-handler-names: "off" */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {MapEntity, RenderState, Team} from '../../lib/data/types';
const bg = '#0a0a0a';
import {OrbitControls} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import * as THREE from 'three';
import {useControls} from 'leva';
import {duration} from '@mui/material';
import {Links} from './Links';
import {Player} from './Player';

function getIndexForPlayer(
  player: MapEntity,
  playerEntities: MapEntity[],
): number {
  return playerEntities.findIndex((p) => p.id === player.id);
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
  const playbackSpeed = 0.5;
  const [time, setTime] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(300);
  const timeBetweenStates = 1 / playbackSpeed;
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTime((time) => {
        if (time >= maxTime) {
          setPlaying(false);
          return time;
        }
        return time + 1;
      });
    }, timeBetweenStates * 1000);
    return () => clearInterval(interval);
  }, [playing, timeBetweenStates]);

  const playerEntities = entities.filter((e) => e.entityType === 'player');
  const linkEntities = entities.filter(
    (e) => e.entityType === 'damage' || e.entityType === 'healing',
  );
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

  const playerNameToIndex = useMemo(() => {
    const map = new Map<string, number>();
    playerEntities.forEach((p, i) => {
      const name = p.states[time]?.name as string;
      if (name) map.set(name, i);
    });
    return map;
  }, [time]);

  return (
    <div style={{height: '100%'}}>
      <Canvas
        camera={{position: [0, 100, -30]}}
        onCreated={({gl}) => {
          gl.setClearColor(new THREE.Color(bg));
        }}>
        <ambientLight intensity={0.5} />
        {/* <hemisphereLight intensity={0.5} /> */}
        <pointLight position={[30, 100, -30]} intensity={2} />
        {playerEntities.map((entity, i) => {
          const hero = entity.states[time]?.hero as string;
          const name = entity.states[time]?.name as string;
          if (!hero || !name) return null;
          return (
            <Player
              hero={hero}
              name={name}
              getPosition={() => currentPosition(entity)}
              key={i}
              playing={playing}
            />
          );
        })}
        <Links
          linkEntities={linkEntities}
          playerEntities={playerEntities}
          time={time}
          playerNameToIndex={playerNameToIndex}
          currentPosition={currentPosition}
        />

        <BackgroundPlane />
        <OrbitControls />
      </Canvas>
      <div style={{position: 'absolute', bottom: 10, left: width / 2}}>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button onClick={() => setTime(time - 1)}>Back</button>
        <button onClick={() => setTime(time + 1)}>Forward</button>
      </div>
    </div>
  );
};

export default ThreeRenderer;
