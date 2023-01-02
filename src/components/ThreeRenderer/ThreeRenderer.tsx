/* eslint react/jsx-handler-names: "off" */
import React, {Suspense, useEffect, useMemo, useRef, useState} from 'react';
import {MapEntity, RenderState, Team} from '../../lib/data/types';
const bg = '#0a0a0a';
import {OrbitControls} from '@react-three/drei';
import {Canvas, useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {useControls} from 'leva';
import {duration} from '@mui/material';
import {Links} from './Links';
import {Player} from './Player';
import {EffectComposer, Bloom} from '@react-three/postprocessing';
import {BackgroundPlane} from './BackgroundPlane';
import {extend} from '@react-three/fiber';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import Globals from '../../lib/data/globals';
function getIndexForPlayer(
  player: MapEntity,
  playerEntities: MapEntity[],
): number {
  return playerEntities.findIndex((p) => p.id === player.id);
}

function AbilityText({
  abilityName,
  playerPosition,
}: {
  abilityName: string;
  playerPosition: THREE.Vector3;
}) {
  const ref = useRef<THREE.Mesh>();
  // display the ability name above the player. the text should rise up and then fade out

  const textGeometry = new TextGeometry(abilityName, {
    size: 20,
    height: 10,
  });
  const startY = playerPosition.y + 1;
  const fadeStartY = startY + 1;
  const endY = startY + 2;
  const textPosition = new THREE.Vector3(
    playerPosition.x,
    startY,
    playerPosition.z,
  );
  const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  useFrame(({camera}, delta) => {
    if (!ref.current) {
      return;
    }
    // rotate towards camera
    ref.current.lookAt(camera.position);
    // rise up
    if (textPosition.y < endY) {
      textPosition.y += 1 * delta;
    } else {
      // restart
      textPosition.y = startY;
    }

    // fade out
    if (textPosition.y > fadeStartY) {
      const opacity = 1 - (textPosition.y - fadeStartY) / (endY - fadeStartY);
      textMaterial.opacity = opacity;
    } else {
      textMaterial.opacity = 1;
    }
  });

  return (
    <mesh ref={ref} position={textPosition}>
      <primitive object={textMesh} />
    </mesh>
  );
}

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
  const elimEntities = entities.filter(
    (e) => e.entityType === 'elimination' || e.entityType === 'final blow',
  );
  const abilityEntities = entities.filter((e) => e.entityType === 'ability');
  const currentPosition = (
    entity: MapEntity,
  ): {x: number; y: number; z: number} | undefined => {
    const state = entity.states[time];
    if (!state) return undefined;
    return {
      x: Number(state.x),
      y: Number(state.y),
      z: Number(state.z),
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
  const currentTeam = Globals.getTeam();
  const playerTeam = (name: string): 1 | 2 => {
    return currentTeam?.players.includes(name) ? 1 : 2;
  };

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
          const health = entity.states[time]?.health as number;
          if (!hero || !name || !health) return null;
          return (
            <Player
              hero={hero}
              name={name}
              getPosition={() => currentPosition(entity)}
              key={i}
              playing={playing}
              team={playerTeam(name)}
              health={health}
            />
          );
        })}
        <Links
          linkEntities={linkEntities}
          playerEntities={playerEntities}
          time={time}
          playerNameToIndex={playerNameToIndex}
          currentPosition={currentPosition}
          playing={playing}
        />
        {abilityEntities.map((entity, i) => {
          const abilityName = entity.states[time]?.ability as string;
          const name = entity.states[time]?.name as string;
          if (!abilityName || !name) return null;
          const playerPosition = currentPosition(
            playerEntities[playerNameToIndex.get(name) as number],
          );
          if (!playerPosition) return null;
          return (
            <AbilityText
              abilityName={abilityName}
              playerPosition={playerPosition}
              key={i}
            />
          );
        })}

        <BackgroundPlane entities={playerEntities} />
        <OrbitControls />
        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            luminanceSmoothing={0.9}
            height={height}
          />
        </EffectComposer>
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
