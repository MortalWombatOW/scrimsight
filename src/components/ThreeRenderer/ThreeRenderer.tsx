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
  PlayerCurve,
  setCurveBaseColor,
} from '../../lib/data/geometry';
import {getColorFor} from '../../lib/color';
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
    if (entity.entityType !== 'player') {
      continue;
    }
    for (const [time, state] of Object.entries(entity.states)) {
      // console.log(`time: ${time}, state: ${JSON.stringify(state)}`);
      if (
        state.health === 0 ||
        state.x === 0 ||
        state.y === 0 ||
        state.z === 0
      ) {
        continue;
      }
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

  console.log(
    `startTime: ${startTime}, endTime: ${endTime}, currentGameTime: ${currentGameTime}, tick: ${tick}, maxTick: ${maxTick}`,
  );

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

  const playerCurves: Record<string, PlayerCurve[]> = useMemo(() => {
    const curves = buildCurvesForPlayers(playerEntities, ticksPerGameSecond);
    console.log('curves', curves);
    return curves;
  }, []);

  const currentPlayerCurve: Record<string, PlayerCurve | undefined> =
    useMemo(() => {
      const curves: Record<string, THREE.BufferGeometry | undefined> = {};
      for (const player of playerNames) {
        const playerCurve: PlayerCurve | undefined = playerCurves[player].find(
          (curve: PlayerCurve) =>
            curve.startTime <= currentGameTime &&
            curve.endTime >= currentGameTime,
        );
        if (!playerCurve) {
          console.log(
            `no curve for player ${player} at tick ${tick} = ${tickToTime(
              tick,
            )}s`,
          );
          continue;
        }
        curves[player] = playerCurve;
      }
      return curves;
    }, [currentGameTime]);

  console.log('currentPlayerCurve', currentPlayerCurve);

  const playerPositions: Record<string, THREE.Vector3> = useMemo(() => {
    const positions: Record<string, THREE.Vector3> = {};
    for (const player of playerNames) {
      const curve = currentPlayerCurve[player];
      if (!curve) {
        console.log(
          `no curve for player ${player} at tick ${tick} = ${tickToTime(
            tick,
          )}s`,
        );
        continue;
      }
      if (positions[player] === undefined) {
        positions[player] = new THREE.Vector3();
      }
      positions[player].fromBufferAttribute(
        curve.curve.getAttribute('position'),
        tick - (curve.startTime - startTime) * ticksPerGameSecond,
      );
    }
    return positions;
  }, [tick]);

  // map from player name to it's current speed by interpolating between the two closest states
  const currentPlayerSpeed: Record<string, number> = useMemo(() => {
    const velocities: Record<string, number> = {};
    for (const player of playerNames) {
      const curve = currentPlayerCurve[player];
      if (!curve) {
        console.log(
          `no curve for player ${player} at tick ${tick} = ${tickToTime(
            tick,
          )}s`,
        );
        continue;
      }
      const prevPosition = new THREE.Vector3().fromBufferAttribute(
        curve.curve.getAttribute('position'),
        tick - (curve.startTime - startTime) * ticksPerGameSecond - 1,
      );
      const nextPosition = playerPositions[player];
      const distance = prevPosition.distanceTo(nextPosition);
      const velocity = distance / realSecondsPerTick;
      velocities[player] = velocity;
    }
    return velocities;
  }, [tick]);

  console.log('playerPositions', playerPositions);

  useEffect(() => {
    const percentDone = tick / maxTick;
    console.log('percent done', percentDone);
    Object.entries(currentPlayerCurve)
      .filter(([player, curve]) => curve !== undefined)
      .forEach(([player, curve]: [string, PlayerCurve]) => {
        const percentForCurve =
          (tick - timeToTick(curve.startTime)) /
          (timeToTick(curve.endTime) - timeToTick(curve.startTime));
        setCurveBaseColor(
          curve.curve,
          new THREE.Color(
            getColorFor(playerTeam(player) === 1 ? 'team1' : 'team2'),
          ),
        );
        highlightCurveAroundPercent(
          curve.curve,
          percentForCurve,
          (dist) => dist / 10,
        );
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
          let hero = entity.states[currentGameTime]?.hero as string;
          let name = entity.states[currentGameTime]?.name as string;
          let health = entity.states[currentGameTime]?.health as number;
          if (!hero || !name || !health) {
            // console.log(`skipping render at ${currentGameTime}`);
            hero = 'Orisa';
            name = 'unknown';
            health = 0;
          }
          if (!playerRefs.current[name]) {
            playerRefs.current[name] = createRef();
          }
          const playerPosition = playerPositions[name];
          if (!playerPosition) return null;
          return (
            <Player
              hero={hero}
              name={name}
              // getPosition={() => currentPosition(name)}
              position={playerPosition}
              speed={currentPlayerSpeed[name]}
              key={i}
              playing={playing}
              team={playerTeam(name)}
              health={health}
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
        {Object.entries(currentPlayerCurve).map(([player, currentCurve], i) => {
          if (!currentCurve) {
            return null;
          }
          const startPoint: THREE.Vector3 = new THREE.Vector3();
          const endPoint: THREE.Vector3 = new THREE.Vector3();
          startPoint.fromBufferAttribute(
            currentCurve.curve.getAttribute('position'),
            0,
          );
          endPoint.fromBufferAttribute(
            currentCurve.curve.getAttribute('position'),
            currentCurve.curve.getAttribute('position').count - 1,
          );
          const line = new THREE.Line(currentCurve.curve, lineMaterial);
          // line.computeLineDistances();
          return (
            <group key={`line-${player}`}>
              <primitive object={line} />
            </group>
          );
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
