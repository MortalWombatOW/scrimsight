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
const bg = '#f3f3f3';
import {
  MapControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  Select,
} from '@react-three/drei';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
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
import {CameraControls} from './CameraControls';
import Controls, {CameraFollowMode, LayerMode} from './Controls';
const BOUND_FIT_OPTIONS = {
  paddingBottom: 15,
  paddingLeft: 5,
  paddingRight: 5,
  paddingTop: 5,
};

// function AbilityText({
//   abilityName,
//   playerPosition,
// }: {
//   abilityName: string;
//   playerPosition: THREE.Vector3;
// }) {
//   const ref = useRef<THREE.Mesh>();
//   // display the ability name above the player. the text should rise up and then fade out

//   const textGeometry = new TextGeometry(abilityName, {
//     size: 20,
//     height: 10,
//     font: 'helvetiker',
//   });
//   const startY = playerPosition.y + 1;
//   const fadeStartY = startY + 1;
//   const endY = startY + 2;
//   const textPosition = new THREE.Vector3(
//     playerPosition.x,
//     startY,
//     playerPosition.z,
//   );
//   const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
//   const textMesh = new THREE.Mesh(textGeometry, textMaterial);
//   useFrame(({camera}, delta) => {
//     if (!ref.current) {
//       return;
//     }
//     // rotate towards camera
//     ref.current.lookAt(camera.position);
//     // rise up
//     if (textPosition.y < endY) {
//       textPosition.y += 1 * delta;
//     } else {
//       // restart
//       textPosition.y = startY;
//     }

//     // fade out
//     if (textPosition.y > fadeStartY) {
//       const opacity = 1 - (textPosition.y - fadeStartY) / (endY - fadeStartY);
//       textMaterial.opacity = opacity;
//     } else {
//       textMaterial.opacity = 1;
//     }
//   });

//   return (
//     <mesh ref={ref} position={textPosition}>
//       <primitive object={textMesh} />
//     </mesh>
//   );
// }

export type ZoomIProps = {
  width: number;
  height: number;
  entities: MapEntity[];
  onLoaded: () => void;
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

const ThreeRenderer = ({width, height, entities, onLoaded}: ZoomIProps) => {
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

  // console.log(
  //   `startTime: ${startTime}, endTime: ${endTime}, currentGameTime: ${currentGameTime}, tick: ${tick}, maxTick: ${maxTick}`,
  // );

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTick((tick) => {
        if (tick >= maxTick) {
          // console.log(
          //   `stopping playback at tick ${tick} = ${tickToTime(tick)}s`,
          // );
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
        vec.set(x as number, y as number, z as number);
        bounds_.expandByPoint(vec);
      }
    }
    return bounds_;
  }, []);

  const playerCurves: Record<string, PlayerCurve[]> = useMemo(() => {
    const curves = buildCurvesForPlayers(playerEntities, ticksPerGameSecond);
    return curves;
  }, []);

  const currentPlayerCurve: Record<string, PlayerCurve | undefined> =
    useMemo(() => {
      const curves: Record<string, PlayerCurve | undefined> = {};
      for (const player of playerNames) {
        const playerCurve: PlayerCurve | undefined = playerCurves[player].find(
          (curve: PlayerCurve) =>
            curve.startTime <= currentGameTime &&
            curve.endTime >= currentGameTime,
        );
        if (!playerCurve) {
          continue;
        }
        curves[player] = playerCurve;
      }
      return curves;
    }, [currentGameTime]);

  const playerPositions: Record<string, THREE.Vector3> = useMemo(() => {
    const positions: Record<string, THREE.Vector3> = {};
    for (const player of playerNames) {
      const curve = currentPlayerCurve[player];
      if (!curve) {
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

  const currentPositionBounds = useMemo(() => {
    const bounds_ = new THREE.Box3();
    for (const player of playerNames) {
      const position = playerPositions[player];
      if (!position) {
        continue;
      }
      bounds_.expandByPoint(position);
    }
    return bounds_;
  }, [playerPositions]);

  // map from player name to it's current speed by interpolating between the two closest states
  const currentPlayerSpeed: Record<string, number> = useMemo(() => {
    const velocities: Record<string, number> = {};
    for (const player of playerNames) {
      const curve = currentPlayerCurve[player];
      if (!curve) {
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

  useEffect(() => {
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
        highlightCurveAroundPercent(curve.curve, percentForCurve, (dist) =>
          Math.max(Math.min(dist / 10, 1), 0),
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

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
  });

  const [isOrthographic, setIsOrthographic] = useState(true);
  const [follow, setFollow] = useState<CameraFollowMode>('all');
  const cameraControls = useRef<CameraControls | null>(null);
  const orthographicCam = useRef<THREE.OrthographicCamera | null>(null);
  const perspectiveCam = useRef<THREE.PerspectiveCamera | null>(null);

  const refit = (bounds: THREE.Box3, smooth: boolean) => {
    if (cameraControls.current) {
      cameraControls.current.fitToBox(bounds, smooth, BOUND_FIT_OPTIONS);
    }
  };

  const triggerTopDownCamera = (zoomDelay: number) => {
    console.log('triggering top down camera');
    console.log('current position bounds', currentPositionBounds);
    const currentTarget = currentPositionBounds.getCenter(new THREE.Vector3());
    // position camera above the current target, looking down at it
    setTimeout(() => {
      if (cameraControls.current) {
        cameraControls.current.setPosition(
          currentTarget.x,
          currentTarget.y + 100,
          currentTarget.z,
          false,
        );
        cameraControls.current.setTarget(
          currentTarget.x,
          currentTarget.y,
          currentTarget.z,
          false,
        );
        setTimeout(() => {
          refit(currentPositionBounds, true);
        }, zoomDelay);
      }
    }, 0);
  };

  const triggerSideViewCamera = () => {
    if (cameraControls.current) {
      refit(currentPositionBounds, false);
      const currentTarget = cameraControls.current.getTarget(
        new THREE.Vector3(),
      );
      // position camera to the side of the current target, looking at it
      cameraControls.current.setPosition(
        currentTarget.x + 100,
        currentTarget.y,
        currentTarget.z,
        true,
      );
      cameraControls.current.setTarget(
        currentTarget.x,
        currentTarget.y,
        currentTarget.z,
        true,
      );
    }
  };

  useEffect(() => {
    // console.log('fitting camera to box', cameraControls?.current);
    if (cameraControls.current) {
      if (follow === 'all') {
        refit(currentPositionBounds, true);
      }
    }
  }, [tick, follow]);

  useEffect(() => {
    // copy camera position when isOrthographic changes
    if (
      orthographicCam.current &&
      perspectiveCam.current &&
      cameraControls.current
    ) {
      const previousCameraPostion = isOrthographic
        ? perspectiveCam.current.position
        : orthographicCam.current.position;
      const previousCameraRotation = isOrthographic
        ? perspectiveCam.current.rotation
        : orthographicCam.current.rotation;
      cameraControls.current.setPosition(
        previousCameraPostion.x,
        previousCameraPostion.y,
        previousCameraPostion.z,
      );

      // cameraControls.current.setT
    }
  }, [isOrthographic]);

  const [layerMode, setLayerMode] = useState<LayerMode>('default');
  const [controlsHeight, setControlsHeight] = useState(0);

  // for text rendering
  const worldToScreen = (
    world: THREE.Vector3,
    camera: THREE.Camera,
    snap: boolean,
  ): THREE.Vector2 => {
    const screen = new THREE.Vector2();
    // camera.updateMatrixWorld();
    // camera.updateProjectionMatrix();
    const navHeight = 70;
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight - navHeight;
    const vector = world.clone();
    vector.project(camera);
    screen.x = (vector.x + 1) / 2;
    screen.y = (vector.y + 1) / 2;
    screen.x *= canvasWidth;
    screen.y *= canvasHeight;
    return screen;
  };

  const textRefs = useRef<Record<string, HTMLDivElement>>({});

  const renderText = (
    key: string,
    text: string,
    position: THREE.Vector3,
    positionTop: THREE.Vector3,
    camera: THREE.Camera,
    color: string,
  ) => {
    const screen = worldToScreen(position, camera, true);
    const screenTop = worldToScreen(positionTop, camera, true);
    const fontSize = screenTop.y - screen.y;
    // const distanceToCamera = camera.position.distanceTo(position);
    // compute the distance to camera by projecting the position onto the camera's forward vector
    const cameraVector = new THREE.Vector3(0, 0, -1);
    cameraVector.applyQuaternion(camera.quaternion);
    const distanceToCamera = position
      .clone()
      .sub(camera.position)
      .dot(cameraVector);

    let div: HTMLDivElement = textRefs.current[key];
    if (!div) {
      textRefs.current[key] = document.createElement('div');
      div = textRefs.current[key];
      div.style.position = 'absolute';
      div.style.fontWeight = 'bold';
      div.style.fontFamily = 'sans-serif';
      div.style.textAlign = 'center';
      div.style.pointerEvents = 'none';
      // div.style.textShadow = '0 0 2px black';
      div.style.zIndex = '2';
      // document.body.appendChild(div);
      document.getElementById('textcontainer')!.appendChild(div);
    }

    const divWidth = text.length * fontSize * 0.6;

    const xPos = screen.x - divWidth / 2;
    const yPos = screen.y;

    const offScreen =
      xPos < 0 ||
      xPos + divWidth > window.innerWidth ||
      yPos < controlsHeight ||
      screenTop.y > window.innerHeight - 145;
    div.style.display = offScreen ? 'none' : 'block';

    div.style.left = `${xPos}px`;
    div.style.bottom = `${yPos}px`;
    div.style.color = color;
    div.style.fontSize = `${fontSize}px`;
    div.textContent = text;
  };

  return (
    <div style={{height: '100%'}}>
      <Canvas
        onCreated={({gl}) => {
          gl.setClearColor(new THREE.Color(bg));
          triggerTopDownCamera(0);
          onLoaded();
        }}>
        <group>
          {/* <OrthographicCamera
            makeDefault={isOrthographic}
            position={[0, 100, 0]}
            zoom={1}
          />
          <PerspectiveCamera
            makeDefault={!isOrthographic}
            position={[0, 100, 0]}
            zoom={1}
          /> */}
          {/* <primitive object={orthographicCam} />
          <primitive object={perspectiveCam} /> */}
          <OrthographicCamera
            makeDefault={isOrthographic}
            ref={orthographicCam}
          />
          <PerspectiveCamera
            makeDefault={!isOrthographic}
            ref={perspectiveCam}
          />
          <CameraControls
            ref={cameraControls}
            primaryAction={isOrthographic ? 'pan' : 'rotate'}
          />
        </group>

        {/* <ambientLight intensity={0.5} /> */}
        {/* <hemisphereLight intensity={0.5} /> */}
        <pointLight position={[30, 100, -30]} intensity={2} />
        <Select box onChange={(e) => console.log(e)}>
          {playerEntities.map((entity, i) => {
            let hero = entity.states[currentGameTime]?.hero as string;
            let name = entity.states[currentGameTime]?.name as string;
            let health = entity.states[currentGameTime]?.health as number;
            let maxHealth = entity.states[currentGameTime]?.maxHealth as number;
            let ultCharge = entity.states[currentGameTime]?.ultCharge as number;
            if (!hero || !name || !health) {
              // console.log(`skipping render at ${currentGameTime}`);
              hero = 'Orisa';
              name = 'unknown';
              health = 0;
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
                maxHealth={maxHealth}
                ultCharge={ultCharge}
                renderText={renderText}
              />
            );
          })}
        </Select>

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

        <BackgroundPlane
          bounds={bounds}
          cellSize={5}
          isWireframe={false}
          layerMode={layerMode}
          playerEntities={playerEntities}
          currentTime={currentGameTime}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            luminanceSmoothing={0.9}
            height={height}
            intensity={0.5}
          />
        </EffectComposer>
      </Canvas>
      <div id="textcontainer" style={{position: 'absolute', zIndex: 1}} />
      <Controls
        width={width}
        playing={playing}
        setPlaying={setPlaying}
        currentTime={currentGameTime}
        setCurrentTime={(time: number) => setTick(timeToTick(time))}
        startTime={startTime}
        endTime={endTime}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        layerMode={layerMode}
        setLayerMode={setLayerMode}
        setControlsHeight={setControlsHeight}
        isOrthographic={isOrthographic}
        setIsOrthographic={setIsOrthographic}
        triggerTopDownCamera={triggerTopDownCamera}
        triggerSideViewCamera={triggerSideViewCamera}
        follow={follow}
        setFollow={setFollow}
      />
    </div>
  );
};

export default ThreeRenderer;
