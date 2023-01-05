/* eslint react/jsx-handler-names: "off" */
import React, {
  createRef,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import {
  buildCurvesForPlayers,
  highlightCurveAroundPercent,
} from '../../lib/data/geometry';
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

function getTimeBounds(entities: MapEntity[]): [number, number] {
  let minTime = Number.MAX_SAFE_INTEGER;
  let maxTime = Number.MIN_SAFE_INTEGER;
  for (const entity of entities) {
    for (const time of Object.keys(entity.states)) {
      const timeNum = Number(time);
      if (timeNum < minTime) {
        minTime = timeNum;
      }
      if (timeNum > maxTime) {
        maxTime = timeNum;
      }
    }
  }
  return [minTime, maxTime];
}

const ThreeRenderer = ({width, height, entities}: ZoomIProps) => {
  // How much to interpolate between states
  // 1 = no interpolation
  const ticksPerGameSecond = 5;
  // how many seconds of game time to show per second of real time
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const realSecondsPerTick = 1 / (ticksPerGameSecond * playbackSpeed);

  // time state
  const [startTime, endTime] = useMemo(
    () => getTimeBounds(entities),
    [entities.length],
  );

  const tickToTime = (tick: number) => {
    return startTime + tick / ticksPerGameSecond;
  };
  const timeToTick = (time: number) => {
    return (time - startTime) * ticksPerGameSecond;
  };

  const [tick, setTick] = useState(0);

  // current game time is the floor of tick / ticksPerSecond
  const currentGameTime = useMemo(() => Math.floor(tickToTime(tick)), [tick]);
  const maxTick = useMemo(() => timeToTick(endTime), [endTime]);

  const currentTeam = Globals.getTeam();
  const playerTeam = (name: string): 1 | 2 => {
    return currentTeam?.players.includes(name) ? 1 : 2;
  };
  // playback state
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTick((tick) => {
        if (tick >= maxTick) {
          console.log(
            `stopping playback at tick ${tick} = ${tickToTime(tick)}s`,
          );
          setPlaying(false);
          return tick;
        }
        return tick + 1;
      });
    }, realSecondsPerTick * 1000);
    return () => clearInterval(interval);
  }, [playing, realSecondsPerTick]);

  const playerEntities = entities.filter((e) => e.entityType === 'player');
  const playerNames = useMemo(
    () => playerEntities.map((entity) => entity.id),
    [playerEntities],
  );

  const bounds = useMemo(() => {
    const bounds_ = new THREE.Box3();
    const vec = new THREE.Vector3();
    for (let t = startTime; t <= endTime; t++) {
      for (const player of playerEntities) {
        const state = player.states[t];
        if (!state) {
          continue;
        }
        const {x, y, z} = state;
        if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
          continue;
        }
        vec.set(x, y, z);
        bounds_.expandByPoint(vec);
      }
    }
    return bounds_;
  }, []);

  const playerCurves: Record<string, THREE.BufferGeometry> = useMemo(
    () => buildCurvesForPlayers(playerEntities, ticksPerGameSecond, playerTeam),
    [],
  );
  const playerPositions: Record<string, THREE.Vector3> = useMemo(() => {
    const positions: Record<string, THREE.Vector3> = {};
    for (const player of playerNames) {
      const curve: THREE.BufferGeometry = playerCurves[player];
      if (!curve) {
        console.warn(`no curve for player ${player}`);
        continue;
      }
      if (positions[player] === undefined) {
        positions[player] = new THREE.Vector3();
      }
      positions[player].fromBufferAttribute(
        curve.getAttribute('position'),
        tick,
      );
    }
    return positions;
  }, [tick]);

  useEffect(() => {
    const percentDone = tick / maxTick;
    console.log('percent done', percentDone);
    Object.values(playerCurves).forEach((curve) => {
      highlightCurveAroundPercent(curve, percentDone, (dist) => dist / 10);
    });
  }, [tick]);

  const linkEntities = entities.filter(
    (e) => e.entityType === 'damage' || e.entityType === 'healing',
  );
  const elimEntities = entities.filter(
    (e) => e.entityType === 'elimination' || e.entityType === 'final blow',
  );
  const abilityEntities = entities.filter((e) => e.entityType === 'ability');

  const playerRefs: React.MutableRefObject<{
    [key: string]: React.MutableRefObject<THREE.Group>;
  }> = useRef({});

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
  });

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
          const hero = entity.states[currentGameTime]?.hero as string;
          const name = entity.states[currentGameTime]?.name as string;
          const health = entity.states[currentGameTime]?.health as number;
          if (!hero || !name || !health) {
            console.log(`skipping render at ${currentGameTime}`);
            return null;
          }
          if (!playerRefs.current[name]) {
            playerRefs.current[name] = createRef();
          }
          return (
            <Player
              hero={hero}
              name={name}
              // getPosition={() => currentPosition(name)}
              position={playerPositions[name]}
              key={i}
              playing={playing}
              team={playerTeam(name)}
              health={health}
              ref={playerRefs.current[name]}
            />
          );
        })}
        <Links
          linkEntities={linkEntities}
          time={currentGameTime}
          playing={playing}
          playerPositions={playerPositions}
        />
        {/* {abilityEntities.map((entity, i) => {
          const abilityName = entity.states[currentGameTime]?.ability as string;
          const name = entity.states[currentGameTime]?.name as string;
          if (!abilityName || !name) return null;
          const playerPosition = playerPositions[name];
          if (!playerPosition) return null;
          return (
            <AbilityText
              abilityName={abilityName}
              playerPosition={playerPosition}
              key={i}
            />
          );
        })} */}
        {Object.entries(playerCurves).map(([player, geometry], i) => {
          const line = new THREE.Line(geometry, lineMaterial);
          // line.computeLineDistances();
          return <primitive object={line} key={`line-${player}`} />;
        })}

        <BackgroundPlane bounds={bounds} cellSize={1} isWireframe={false} />
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
        <button onClick={() => setTick(tick - ticksPerGameSecond)}>Back</button>
        <button onClick={() => setTick(tick + ticksPerGameSecond)}>
          Forward
        </button>
      </div>
    </div>
  );
};

export default ThreeRenderer;
