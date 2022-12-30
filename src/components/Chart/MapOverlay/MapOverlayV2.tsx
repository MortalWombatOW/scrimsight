/* eslint react/jsx-handler-names: "off" */
import React, {useMemo, useState} from 'react';
import {Zoom} from '@visx/zoom';
import {localPoint} from '@visx/event';
import {RectClipPath} from '@visx/clip-path';
import {scaleLinear} from '@visx/scale';
import {MapEntity, RenderState, Team} from '../../../lib/data/types';
import Globals from '../../../lib/data/globals';
import PlayerEntity from './PlayerEntity';
import {Button} from '@mui/material';
const bg = '#0a0a0a';
import {DefaultNode, Graph} from '@visx/network';
import {node} from 'webpack';
import useAnimatedPath from '../../../hooks/useAnimatedPath';
import {animated} from 'react-spring';
import {groupColorClass} from '../../../lib/color';
import MapBackground from './MapBackground';
import Connection from './Connection';
const colorScale = scaleLinear<number>({range: [0, 1], domain: [0, 1000]});
const sizeScale = scaleLinear<number>({domain: [0, 600], range: [0.5, 8]});

export type ZoomIProps = {
  width: number;
  height: number;
  entities: MapEntity[];
};

interface HeroNode {
  x: number;
  y: number;
  player: string;
  hero: string;
  health: number;
  maxHealth: number;
  ultCharge: number;
}

interface HeroLink {
  source: HeroNode;
  target: HeroNode;
  type: string;
  amount: number;
}

const allVisibleTransform = (
  currentPositions: {x: number; y: number}[],
): {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
} => {
  const minX = Math.min(...currentPositions.map((p) => p.x));
  const maxX = Math.max(...currentPositions.map((p) => p.x));
  const minY = Math.min(...currentPositions.map((p) => p.y));
  const maxY = Math.max(...currentPositions.map((p) => p.y));

  const scale = 1;
  const translateX = -minX * scale;
  const translateY = -minY * scale;

  return {
    scaleX: scale,
    scaleY: scale,
    translateX,
    translateY,
  };
};

const getBounds = (entities: MapEntity[]) => {
  interface Bounds {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  }
  const union = (a: Bounds, b: Bounds) => ({
    minX: a.minX ? Math.min(a.minX, b.minX || a.minX) : b.minX,
    maxX: a.maxX ? Math.max(a.maxX, b.maxX || a.maxX) : b.maxX,
    minY: a.minY ? Math.min(a.minY, b.minY || a.minY) : b.minY,
    maxY: a.maxY ? Math.max(a.maxY, b.maxY || a.maxY) : b.maxY,
  });
  // calculate bounds for each entity and timestamp. then find the max/min of all of them
  return entities
    .flatMap((entity) =>
      Object.values(entity.states)
        .map((state) => {
          const x = Number(state.x);
          const y = Number(state.z);
          return {
            minX: x,
            maxX: x,
            minY: y,
            maxY: y,
          };
        })
        .reduce(union, {}),
    )
    .reduce(union, {});
};
const MapOverlayV2 = ({width, height, entities}: ZoomIProps) => {
  const [time, setTime] = useState<number>(100);
  const [mousePosition, setMousePosition] = useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });

  const onMouseMove = (event: React.MouseEvent) => {
    const {x, y} = localPoint(event) || {x: 0, y: 0};
    setMousePosition({x, y});
  };

  const playerPositions = useMemo(
    () => entities.filter((entity) => entity.entityType === 'player'),
    [entities],
  );

  const currentPosition = (
    entity: MapEntity,
  ): {x: number; y: number} | undefined => {
    const state = entity.states[time];
    if (!state) return undefined;
    return {
      x: Number(state.x),
      y: Number(state.z),
    };
  };

  const bounds = useMemo(() => getBounds(entities), [entities]);

  const currentPositions = useMemo(
    () =>
      playerPositions.flatMap((entity) => {
        const position = currentPosition(entity);
        if (!position) return [];
        return [position];
      }),
    [playerPositions, time],
  );

  const playerNodes = useMemo(
    () =>
      playerPositions.flatMap((entity) => {
        const state = entity.states[time];
        if (!state) return [];
        const player = state['name'];
        const hero = state['hero'];
        const health = Number(state['health']);
        const maxHealth = Number(state['maxHealth']);
        const ultCharge = Number(state['ultCharge']);
        const position = currentPosition(entity);
        if (!position) return [];
        return [
          {
            x: position.x,
            y: position.y,
            player: player as string,
            hero: hero as string,
            health: health as number,
            maxHealth: maxHealth as number,
            ultCharge: ultCharge as number,
          },
        ];
      }),
    [playerPositions, time],
  );

  const initialTransform = useMemo(() => {
    return {
      ...allVisibleTransform(currentPositions),
      skewX: 0,
      skewY: 0,
    };
  }, [currentPositions]);

  const linkEntities = useMemo(
    () =>
      entities.filter(
        (entity) =>
          entity.entityType === 'damage' || entity.entityType === 'healing',
      ),
    [entities],
  );

  const links = useMemo(
    () =>
      linkEntities.flatMap((entity) => {
        const state = entity.states[time];
        if (!state) return [];
        const source = state['player'] as string;
        const target = state['target'] as string;
        const sourceNode = playerNodes.find((node) => node.player === source);
        const targetNode = playerNodes.find((node) => node.player === target);
        if (!sourceNode || !targetNode) {
          console.log('no source or target', entity, state);
          return [];
        }
        return [
          {
            source: sourceNode,
            target: targetNode,
            type: entity.entityType,
            amount: Number(state['amount']),
          },
        ];
      }),
    [linkEntities, time, playerNodes],
  );

  const graph = useMemo(() => {
    return {
      nodes: playerNodes,
      links,
    };
  }, [playerNodes, links]);
  // console.log('graph', graph);

  return (
    <div onMouseMove={onMouseMove}>
      <Zoom<SVGSVGElement>
        width={width}
        height={height - 50}
        scaleXMin={1 / 10}
        scaleXMax={20}
        scaleYMin={1 / 10}
        scaleYMax={20}
        initialTransformMatrix={initialTransform}>
        {(zoom) => (
          <div className="relative">
            <svg
              width={width}
              height={height - 50}
              style={{
                cursor: zoom.isDragging ? 'grabbing' : 'default',
                touchAction: 'none',
              }}
              ref={zoom.containerRef}>
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <rect width={width} height={height} rx={14} fill={bg} />
              {/* {polygons.map((polygon, i) => (
                <VoronoiPolygon
                  key={`polygon-${i}`}
                  polygon={polygon}
                  fill={'white'}
                  stroke="black"
                  strokeWidth={1}
                  fillOpacity={0.2}
                />
              ))} */}
              <g transform={zoom.toString()}>
                <MapBackground
                  bounds={{
                    x1: bounds.minX!,
                    x2: bounds.maxX!,
                    y1: bounds.minY!,
                    y2: bounds.maxY!,
                  }}
                  step={250}
                />
                {/* <RectClipPath
                  id="voronoi_clip"
                  width={innerWidth}
                  height={innerHeight}
                  rx={14}
                /> */}
                {/* <g clipPath="url(#voronoi_clip)">
                  {polygons.map((polygon, i) => (
                    <VoronoiPolygon
                      key={`polygon-${i}`}
                      polygon={polygon}
                      fill={'white'}
                      stroke="black"
                      strokeWidth={1}
                      fillOpacity={0.2}
                    />
                  ))}
                </g> */}
                <Graph<HeroLink, HeroNode>
                  graph={graph}
                  top={20}
                  left={100}
                  nodeComponent={({node}) => (
                    <PlayerEntity
                      key={node.player}
                      name={node.player}
                      x={node.x}
                      y={node.y}
                      z={0}
                      health={node.health}
                      maxHealth={node.maxHealth}
                      ultCharge={node.ultCharge}
                      hero={node.hero}
                      incomingDamage={[]}
                      incomingHealing={[]}
                    />
                  )}
                  linkComponent={(props) => (
                    // <animated.line
                    //   className={lineColor(props.link)}
                    //   x1={props.link.source.x}
                    //   y1={props.link.source.y}
                    //   x2={props.link.target.x}
                    //   y2={props.link.target.y}
                    //   strokeWidth={Math.sqrt(props.link.amount + 9)}
                    //   // stroke={lineColor(link)}
                    //   strokeOpacity={0.6}
                    //   // strokeDasharray={
                    //   //   link.type === 'damage' ? '8,4' : undefined
                    //   // }
                    // />
                    <Connection
                      key={props.link.source.player + props.link.target.player}
                      x1={props.link.source.x}
                      y1={props.link.source.y}
                      x2={props.link.target.x}
                      y2={props.link.target.y}
                      type={props.link.type}
                      amount={props.link.amount}
                      className={groupColorClass(props.link.source.hero)}
                    />
                  )}
                />
                {/* {playerPositions.map((entity, i) => {
                  const currentState = entity.states[time];
                  if (!currentState) return null;
                  const x = Number(currentState.x);
                  const y = Number(currentState.y);
                  const z = Number(currentState.z);
                  const health = Number(currentState.health);
                  const maxHealth = Number(currentState.maxHealth);
                  const ultCharge = Number(currentState.ultCharge);
                  const hero = currentState.hero as string;
                  const incomingDamage = [];
                  const incomingHealing = [];

                  return (
                    <React.Fragment key={`dot-${i}`}>
                     
                      <PlayerEntity
                        key={entity.id}
                        name={entity.id}
                        x={x}
                        y={y}
                        z={z}
                        health={health}
                        maxHealth={maxHealth}
                        ultCharge={ultCharge}
                        hero={hero}
                        incomingDamage={incomingDamage}
                        incomingHealing={incomingHealing}
                      />
                    </React.Fragment>
                  );
                })} */}
              </g>
              <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={(event) => {
                  const point = localPoint(event) || {x: 0, y: 0};
                  zoom.scale({scaleX: 1.1, scaleY: 1.1, point});
                }}
              />
            </svg>
            <div
              style={{
                width: '100%',
                height: '50px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <Button onClick={() => setTime(time - 1)}>Prev</Button>
              <Button
                onClick={() => {
                  setTime(time + 1);
                }}>
                Next
              </Button>
              <div>
                Mouse Position: {mousePosition.x}, {mousePosition.y}
              </div>
            </div>
            {/* <div className="mini-map">
              <button
                type="button"
                className="btn btn-lg"
                onClick={() => setShowMiniMap(!showMiniMap)}>
                {showMiniMap ? 'Hide' : 'Show'} Mini Map
              </button>
            </div> */}
          </div>
        )}
      </Zoom>
      {/* <style jsx>{`
        .btn {
          margin: 0;
          text-align: center;
          border: none;
          background: #2f2f2f;
          color: #888;
          padding: 0 4px;
          border-top: 1px solid #0a0a0a;
        }
        .btn-lg {
          font-size: 12px;
          line-height: 1;
          padding: 4px;
        }
        .btn-zoom {
          width: 26px;
          font-size: 22px;
        }
        .btn-bottom {
          margin-bottom: 1rem;
        }
        .description {
          font-size: 12px;
          margin-right: 0.25rem;
        }
        .controls {
          
        }
        .mini-map {
          position: absolute;
          bottom: 25px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .relative {
          position: relative;
        }
      `}</style> */}
    </div>
  );
};

export default MapOverlayV2;
