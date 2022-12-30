import React, {ReactElement} from 'react';
import {MapEntity} from '../../../lib/data/types';
import {mapNameToFileName} from '../../../lib/string';
import {useScrollBlock} from '../../../hooks/useScrollBlock';
import {useSpring, animated, useSprings, to} from 'react-spring';
import './MapOverlay.scss';
import {useGesture} from '@use-gesture/react';
import {
  getCameraTransformFromMapEntities,
  getMapEntitiesForTime,
  getMapTransform,
} from '../../../lib/data/data';
import PlayerEntity from './PlayerEntity';

interface MapOverlayProps {
  map: string;
  entities: MapEntity[];
  width: number;
  height: number;
}

const MapOverlay = (props: MapOverlayProps) => {
  const {map, entities, width, height} = props;

  const centerX = width / 2;
  const centerY = height / 2;

  const [time, setTime] = React.useState(150);
  const [playing, setPlaying] = React.useState(false);

  // increase time every second if
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        setTime((time) => time + 1);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [playing]);

  const [blockScroll, unblockScroll] = useScrollBlock();

  const [transform, api] = useSpring(() => ({
    // transform: `translate(0,0) scale(4)`,
    x: 0,
    y: 0,
    scale: 1,
  }));
  const svgRef = React.useRef<SVGSVGElement>(null);
  const transformRef = React.useRef(null);

  const pan = (x: number, y: number) => {
    console.log('pan', x, y);
    api.start({
      x,
      y,
    });
  };

  // const zoom = (scale: number) => {
  //   console.log('zoom', scale);
  //   api.start({
  //     scale: transform.scale.get() * scale,
  //     x: transform.x.get() * scale + (1 - scale) * centerX,
  //     y: transform.y.get() * scale + (1 - scale) * centerY,
  //   });
  // };

  const zoom = (
    delta: number,
    mouseScreenX: number,
    mouseScreenY: number,
  ): void => {
    const [mouseWorldX, mouseWorldY] = screenCoordsToworldCoords(
      mouseScreenX,
      mouseScreenY,
    );

    const [mouseScreenXafterZoom, mouseScreenYafterZoom] =
      worldCoordsToScreenCoords(mouseWorldX, mouseWorldY);
    const xDifference = mouseScreenXafterZoom - mouseScreenX;
    const yDifference = mouseScreenYafterZoom - mouseScreenY;
    api.start({
      x: transform.x.get() - xDifference,
      y: transform.y.get() - yDifference,
      scale: transform.scale.get() * (1 + delta),
    });
  };

  useGesture(
    {
      onDrag: ({offset: [x, y]}) => {
        // console.log('drag', x, y);
        pan(x, y);
      },
      // onWheel: ({_direction: [, y]}) => {
      //   // console.log('wheel', rest);
      //   const currentTransform = styles.transform.get().split(' ');

      //   const scaleText = currentTransform[1];
      //   // console.log(scaleText);
      //   const scale = parseFloat(scaleText.substring(7, scaleText.length - 1));
      //   console.log(scale);
      //   const newScale = scale * (1 + y / 100);
      //   api.start({
      //     transform: `${currentTransform[0]} scale(${newScale})`,
      //   });
      //   // api.start({zoom: transform.zoom.get() * (1 + y / 100)});
      // },
    },
    {
      target: svgRef,
      drag: {
        from: () => [transform.x.get(), transform.y.get()],
      },
      wheel: {
        from: (e) => {
          const rect = svgRef!.current!.getBoundingClientRect();
          zoom(
            e.event.deltaY / 100,
            e.event.clientX - rect.left,
            e.event.clientY - rect.top,
          );
          return [transform.x.get(), transform.y.get()];
        },
      },
    },
  );

  const screenCoordsToworldCoords = (screenX: number, screenY: number) => {
    const x = transform.x.get();
    const y = transform.y.get();
    const scale = transform.scale.get();
    const worldX = (screenX - x) / scale;
    const worldY = (screenY - y) / scale;
    return [worldX, worldY];
  };

  const worldCoordsToScreenCoords = (worldX: number, worldY: number) => {
    const x = transform.x.get();
    const y = transform.y.get();
    const scale = transform.scale.get();
    const screenX = worldX * scale + x;
    const screenY = worldY * scale + y;
    return [screenX, screenY];
  };

  const entitiesForTime = getMapEntitiesForTime(entities, time);

  const playerEntities = entitiesForTime.filter(
    (entity) => entity.entityType === 'player',
  );

  const [smoothEntities, entityApi] = useSprings(
    playerEntities.length,
    (i) => {
      return {
        to: playerEntities[i].states[time],
        config: {
          duration: 500,
        },
      };
    },
    [time],
  );

  // const [{smoothTime}, smoothTimeApi] = useSpring(() => ({
  //   from: {
  //     smoothTime: 0,
  //   },
  //   to: async (next) => {
  //     while (true) {
  //       console.log('smoothTime', smoothTime);
  //       await next({
  //         smoothTime: 1,
  //       });
  //     }
  //   },
  //   reset: true,
  // }));

  const getSmoothStateOfPlayer = (player: string) => {
    const playerEntityIdx = playerEntities.findIndex(
      (entity) => entity.id === player,
    );
    return smoothEntities[playerEntityIdx];
  };

  const setTimeSmooth = (newTime: number) => {
    const newEntities = getMapEntitiesForTime(entities, newTime);
    entityApi.start((i) => {
      if (!newEntities[i]) {
        console.log('no entity for time', newTime, i);
        return undefined;
      }
      return newEntities[i]?.states[newTime];
    });

    const [avgX, avgY] = getCameraTransformFromMapEntities(
      newEntities,
      newTime,
    );

    // move camera to center of new entities
    const [screenX, screenY] = worldCoordsToScreenCoords(avgX, avgY);
    console.log('move camera to', screenX, screenY);

    // pan(screenX + centerX, screenY + centerY);
    // smoothTimeApi.start({
    //   smoothTime: newTime,
    // });
    setTime(newTime);
  };

  // console.log(getMapEntitiesForTime(entities, time));

  // background ticks for scale
  const xGridLines: JSX.Element[] = [];
  const yGridLines: JSX.Element[] = [];

  const spacing = 100;

  let [startX, startY] = screenCoordsToworldCoords(0, 0);
  const [endX, endY] = screenCoordsToworldCoords(width, height);

  startX -= 1000;
  startY -= 1000;

  for (let x = startX; x < endX; x += spacing) {
    const line = (
      <line
        key={`x-grid-${x}`}
        x1={x}
        y1={startY}
        x2={x}
        y2={endY}
        strokeWidth={2}
        stroke="rgba(255,255,255,0.1)"
      />
    );
    xGridLines.push(line);
  }
  for (let y = startY; y < endY; y += spacing) {
    const line = (
      <line
        key={`y-grid-${y}`}
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        strokeWidth={2}
        stroke="rgba(255,255,255,0.1)"
      />
    );
    yGridLines.push(line);
  }

  const mapImagePath = mapNameToFileName(map, true);
  const mapTransform = getMapTransform(map);

  let mapImage: null | ReactElement = null;

  if (mapTransform) {
    const [maskWidth, maskHeight] = screenCoordsToworldCoords(width, height);
    mapImage = (
      <foreignObject
        x={0}
        y={0}
        width={maskWidth}
        height={maskHeight}
        style={{
          transform: mapTransform,
        }}>
        <img src={mapImagePath} style={{pointerEvents: 'none'}} />
        <div className="imgcover" />
      </foreignObject>
    );
  }

  return (
    <div
      className="MapOverlay"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseEnter={blockScroll}
      onMouseLeave={unblockScroll}
      role="presentation">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        ref={svgRef}>
        {/* <defs>
          <rect id="rect" x="-25" y="-25" width="50" height="50" rx="25" />
          <clipPath id="clip">
            <use xlinkHref="#rect" />
          </clipPath>
        </defs> */}
        <animated.g
          ref={transformRef}
          {...{
            transform: to(
              [transform.x, transform.y, transform.scale],
              (x, y, s) => `matrix(${s},0,0,${s},${x},${y})`,
            ),
          }}>
          {/* {xGridLines}
          {yGridLines} */}
          {mapImage}
          {getMapEntitiesForTime(entities, time)
            .filter((entity) => entity.entityType === 'healing')
            .map((entity, i) => {
              const entityState = entity.states[time];
              const {target, amount} = entityState;
              const targetState = getSmoothStateOfPlayer(target as string);

              const randomOffsetX = Math.random() * 20 - 10;
              const randomOffsetY = Math.random() * 20 - 20;
              const fontSize = Math.max(Math.log10(amount as number) * 15, 10);
              const text = `+${amount}`;
              return (
                <animated.text
                  key={`healing-${i}`}
                  x={targetState['x'].to((x) => (x as number) + randomOffsetX)}
                  y={targetState['y'].to(
                    (y) => (y as number) - 15 + randomOffsetY,
                  )}
                  textAnchor="middle"
                  fill={'gold'}
                  fontSize={fontSize}
                  fontWeight={600}
                  className="rise">
                  {text}
                </animated.text>
              );
              // if (player === target) {
              //   return (
              //     <animated.circle
              //       key={i}
              //       cx={playerState['x'].to((x) => x + 15)}
              //       cy={playerState['y'].to((y) => y - 15)}
              //       r={15}
              //       fill={'transparent'}
              //       strokeWidth={2}
              //       className={'healingedge'}
              //     />
              //   );
              // }

              // return (
              //   <animated.line
              //     key={entity.id}
              //     x1={targetState['x']}
              //     y1={targetState['y']}
              //     x2={playerState['x']}
              //     y2={playerState['y']}
              //     // strokeWidth={edgeWidth}
              //     // stroke
              //     className="healingedge"
              //   />
              // );
            })}
          {getMapEntitiesForTime(entities, time)
            .filter(
              (entity) =>
                entity.entityType === 'damage' ||
                entity.entityType === 'final blow' ||
                entity.entityType === 'elimination',
            )
            .map((entity, i) => {
              const entityState = entity.states[time];
              const {target, amount} = entityState;
              const targetState = getSmoothStateOfPlayer(target as string);

              const randomOffsetX = Math.random() * 20 - 10;
              const randomOffsetY = Math.random() * 20 - 20;

              const fontSize = Math.max(Math.log10(amount as number) * 15, 10);

              const text = `-${amount}`;
              return (
                <animated.text
                  key={`dmg-${i}`}
                  x={targetState['x'].to((x) => (x as number) + randomOffsetX)}
                  y={targetState['z'].to(
                    (y) => (y as number) - 15 + randomOffsetY,
                  )}
                  textAnchor="middle"
                  fill={'red'}
                  fontSize={fontSize}
                  fontWeight={600}
                  className="rise">
                  {text}
                </animated.text>
              );

              // if (entity.entityType === 'final blow') {
              //   color = 'black';
              // }

              // return (
              //   <animated.line
              //     key={entity.id}
              //     x1={targetState['x']}
              //     y1={targetState['y']}
              //     x2={playerState['x']}
              //     y2={playerState['y']}
              //     strokeWidth={edgeWidth}
              //     stroke={'red'}
              //     className="damageedge"
              //   />
              // );
            })}
          {getMapEntitiesForTime(entities, time)
            .filter((entity) => entity.entityType === 'ability')
            .map((entity, i) => {
              const entityState = entity.states[time];
              const {player, type} = entityState;
              const playerState = getSmoothStateOfPlayer(player as string);
              if (playerState === undefined) {
                console.error(`no position for ${player}`);
                return null;
              }

              const randomOffsetX = Math.random() * 20 - 10;
              const randomOffsetY = Math.random() * 20 - 20;

              const fontSize = 12;

              const text = `Used ${type} ability`;
              return (
                <animated.text
                  key={`ability-${i}`}
                  x={playerState['x'].to((x) => (x as number) + randomOffsetX)}
                  y={playerState['z'].to(
                    (y) => (y as number) - 15 + randomOffsetY,
                  )}
                  textAnchor="middle"
                  fill={'white'}
                  fontSize={fontSize}
                  fontWeight={600}
                  className="rise">
                  {text}
                </animated.text>
              );

              // if (entity.entityType === 'final blow') {
              //   color = 'black';
              // }

              // return (
              //   <animated.line
              //     key={entity.id}
              //     x1={targetState['x']}
              //     y1={targetState['y']}
              //     x2={playerState['x']}
              //     y2={playerState['y']}
              //     strokeWidth={edgeWidth}
              //     stroke={'red'}
              //     className="damageedge"
              //   />
              // );
            })}
          {getMapEntitiesForTime(entities, time)
            .filter((entity) => entity.entityType === 'player')
            .map((entity) => (
              <PlayerEntity
                key={entity.id}
                x={entity.states[time]['x'] as number}
                y={entity.states[time]['y'] as number}
                z={entity.states[time]['z'] as number}
                name={entity.id}
                health={entity.states[time]['health'] as number}
                maxHealth={entity.states[time]['maxHealth'] as number}
                ultCharge={entity.states[time]['ultCharge'] as number}
                hero={entity.states[time]['hero'] as string}
                incomingDamage={[]}
                incomingHealing={[]}
              />
            ))}
        </animated.g>
      </svg>
      <div className="controls">
        {/* <Box sx={{width: 200, marginRight: '20px'}}>
          <Slider
            // className="control"
            // value={getScale()}
            onChange={(e, newValue) => {
              zoom(newValue as number);
            }}
            min={0.5}
            max={12}
            defaultValue={4}
          />
        </Box> */}
        <button className="control" onClick={() => setTimeSmooth(time - 1)}>
          back
        </button>
        <button className="control" onClick={() => setTimeSmooth(time + 1)}>
          forward
        </button>
        <button className="control" onClick={() => setPlaying(!playing)}>
          {playing ? 'pause' : 'play'}
        </button>
        <span className="control">{time} s</span>
        <button
          className="control"
          onClick={() => zoom(0.1, width / 2, height / 2)}>
          +
        </button>
        <button
          className="control"
          onClick={() => zoom(-0.1, width / 2, height / 2)}>
          -
        </button>
      </div>
    </div>
  );
};

export default MapOverlay;
