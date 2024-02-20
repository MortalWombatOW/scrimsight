/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {Paper, Slider} from '@mui/material';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {useDataNodes} from '../hooks/useData';
import {getColorFor, getColorgorical} from '../lib/color';
import {getRoleFromHero, getRankForRole} from '../lib/data/data';
import {getSvgIcon} from './Common/RoleIcons';
import {heroNameToNormalized} from '../lib/string';
import usePlayerLives from '../hooks/usePlayerLives';
import useMapTimes from '../hooks/useMapTimes';
import useMapRosters from '../hooks/useMapRosters';
import useGlobalMapEvents from '../hooks/useGlobalMapEvents';
import usePlayerEvents from '../hooks/usePlayerEvents';
import {format, formatTime} from '../lib/format';
import useAdjustedText, {AABBs} from '../hooks/useAdjustedText';
import useLegibleTextSvg from '../hooks/useLegibleTextSvg';

const SvgWrapText = ({
  x,
  y,
  color,
  size,
  children,
}: {
  x: number;
  y: number;
  color: string;
  size: number;
  children: React.ReactNode;
}) => {
  return (
    <g className="svg-wrap-text-group" data-x={x} data-y={y}>
      <foreignObject
        width="80"
        height={50}
        requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <p
          className="svg-foreign-object"
          style={{
            color,
            fontSize: size,
            lineHeight: 0.9,
            margin: 0,
          }}>
          {children}
        </p>
      </foreignObject>
    </g>
  );
};

const MapTimeline = ({mapId, roundId}: {mapId: number; roundId: number}) => {
  const mapEvents = useGlobalMapEvents(mapId);

  // holds the players for columns
  const [players, setPlayers] = useState<
    {
      playerName: string;
      playerTeam: string;
      role: string;
    }[]
  >([]);

  const roster = useMapRosters(mapId);

  console.log('roster', roster);

  useEffect(() => {
    if (!roster) {
      return;
    }

    const players = [
      ...roster.team1.roster.map((player) => ({
        playerName: player.name,
        playerTeam: roster.team1.name,
        role: player.role,
      })),
      ...roster.team2.roster.map((player) => ({
        playerName: player.name,
        playerTeam: roster.team2.name,
        role: player.role,
      })),
    ];

    setPlayers(players);
  }, [JSON.stringify(roster)]);

  const ref = React.useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(1000);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
  }, [JSON.stringify(players)]);

  const {startTime, endTime} = useMapTimes(mapId, 'MapTimeline_')?.[
    roundId
  ] || {
    startTime: 0,
    endTime: 0,
  };
  const [pixelsPerSecond, setPixelsPerSecond] = useState(5);
  const height = (endTime - startTime) * pixelsPerSecond;
  const xPadding = 50;
  const topPadding = 10;
  const bottomPadding = 50;
  const axisWidth = 50;
  const [majorTickInterval, minorTickInterval] = [60, 10];
  const numMajorTicks = Math.floor((endTime - startTime) / majorTickInterval);
  const numMinorTicks = Math.floor((endTime - startTime) / minorTickInterval);
  const timeToY = (time: number, startTime: number, endTime: number) => {
    return Math.floor(
      ((time - startTime) / (endTime - startTime)) *
        (height - topPadding - bottomPadding) +
        topPadding,
    );
  };
  const columnIdxToX = (idx: number) => {
    return Math.floor(
      ((idx + 1) / (players.length + 1)) * (width - 2 * xPadding - axisWidth) +
        xPadding +
        axisWidth,
    );
  };

  const playerLives = usePlayerLives(mapId, roundId);
  const playerEvents = usePlayerEvents(mapId);

  // const [textAABBs, setTextAABBs] = useState<AABBs>([]);

  // console.log('textAABBs', textAABBs);

  // useEffect(() => {
  //   if (!ref.current) {
  //     return;
  //   }

  //   const svg = ref.current;

  //   console.log('updating textAABBs');
  //   const textNodes = svg.querySelectorAll('text');

  //   const newAABBs: AABBs = [];

  //   textNodes.forEach((textNode, i) => {
  //     const bbox = textNode.getBBox();
  //     if (textNode.textContent === null) {
  //       return;
  //     }
  //     console.log('textNode.textContent', textNode.textContent);
  //     newAABBs.push({
  //       elementTag: 'text',
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //       matchText: textNode.textContent!,
  //       id: 'text_' + i,
  //       x: bbox.x,
  //       y: bbox.y,
  //       width: bbox.width,
  //       height: bbox.height,
  //     });
  //   });

  //   const pNodes = Array.from(svg.getElementsByTagName('g'));
  //   console.log('pNodes', pNodes);
  //   const filteredPNodes = pNodes.filter((el) =>
  //     el.classList.contains('svg-wrap-text-group'),
  //   ) as SVGGElement[];
  //   console.log('fpNodes', filteredPNodes);
  //   filteredPNodes.forEach((pNode, i) => {
  //     if (!pNode) {
  //       return;
  //     }
  //     if (!pNode.innerHTML || pNode.innerHTML === '') {
  //       return;
  //     }
  //     // console.log('pNode.innerHTML', pNode.innerHTML);
  //     const bbox = pNode.getBBox();
  //     const bboxWidth = bbox.width;
  //     const bboxHeight = bbox.height;

  //     const transform = pNode.getAttribute('transform');
  //     if (!transform) {
  //       return;
  //     }
  //     const x = parseFloat(
  //       transform?.split('(')[1].split(',')[0].replace(')', ''),
  //     );
  //     const y = parseFloat(
  //       transform?.split('(')[1].split(',')[1].replace(')', ''),
  //     );
  //     console.log(
  //       'x',
  //       x,
  //       'y',
  //       y,
  //       'bboxWidth',
  //       bboxWidth,
  //       'bboxHeight',
  //       bboxHeight,
  //     );

  //     newAABBs.push({
  //       elementTag: 'g',
  //       matchText: pNode.getElementsByTagName('p')[0].innerHTML,
  //       id: 'g_' + i,
  //       x: x,
  //       y: y,
  //       width: bboxWidth,
  //       height: bboxHeight,
  //     });
  //   });

  //   setTextAABBs(newAABBs);
  // }, [
  //   JSON.stringify(
  //     Array.from(ref.current?.getElementsByTagName('text') || []).map(
  //       (el) => el.innerHTML,
  //     ),
  //   ),
  //   JSON.stringify(
  //     Array.from(ref.current?.getElementsByTagName('g') || [])
  //       .filter((el) => el.classList.contains('svg-wrap-text-group'))
  //       .map((el) => el.getElementsByTagName('p')[0].innerHTML),
  //   ),
  // ]);

  // const textNodesAdjusted = useAdjustedText(textAABBs);
  // console.log(
  //   'textNodes before',
  //   textAABBs.length,
  //   'after',
  //   textNodesAdjusted.length,
  // );

  // const diffs = textAABBs.filter(
  //   (aabb, i) =>
  //     aabb.x !== textNodesAdjusted[i].x || aabb.y !== textNodesAdjusted[i].y,
  // );

  // console.log('diffs', diffs);

  // // console.log('textAABBs', textAABBs, 'textNodesAdjusted', textNodesAdjusted);
  // useEffect(() => {
  //   console.log('textNodesAdjusted', diffs);
  //   for (const [i, aabb] of Object.entries(diffs)) {
  //     const node = Array.from(
  //       document.getElementsByTagName(aabb.elementTag),
  //     ).find((el) => el.innerHTML.includes(aabb.matchText));
  //     if (!node) {
  //       console.log('node not found', aabb.elementTag, aabb.matchText);
  //       continue;
  //     }

  //     if (aabb.elementTag === 'text') {
  //       const beforeX = node.getAttribute('x');
  //       const beforeY = node.getAttribute('y');
  //       node.setAttribute('x', aabb.x.toString());
  //       node.setAttribute('y', aabb.y.toString());
  //       console.log(
  //         'text moved',
  //         aabb.matchText,
  //         'from',
  //         beforeX,
  //         beforeY,
  //         'to',
  //         aabb.x,
  //         aabb.y,
  //       );
  //     }
  //     if (aabb.elementTag === 'g') {
  //       const beforeTransform = node.getAttribute('transform');
  //       node.setAttribute('transform', `translate(${aabb.x}, ${aabb.y})`);
  //       console.log(
  //         'g moved',
  //         aabb.matchText,
  //         'from',
  //         beforeTransform,
  //         'to',
  //         `translate(${aabb.x}, ${aabb.y})`,
  //       );
  //     }
  //   }
  // }, [JSON.stringify(diffs)]);

  const loaded = !!players && !!mapEvents && !!playerLives && !!playerEvents;

  console.log('loaded', loaded);

  const iters = useLegibleTextSvg(ref, loaded);
  console.log('iters', iters);

  return (
    <Paper sx={{padding: '1em', borderRadius: '5px', marginTop: '1em'}}>
      {/* <Slider
        value={pixelsPerSecond}
        onChange={(e, newValue) => {
          setPixelsPerSecond(newValue as number);
        }}
        min={0.1}
        max={10}
        step={0.1}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value} px/s`}
      /> */}
      <svg width="100%" height={100}>
        {/* draw aabbs */}

        {/* {textNodesAdjusted.map((aabb) => (
          <rect
            key={aabb.id}
            x={aabb.x}
            y={aabb.y}
            width={aabb.width}
            height={aabb.height}
            fill="none"
            stroke="blue"
            strokeWidth={1}
          />
        ))} */}

        {players.map((player: any, i: number) => (
          <g key={player.playerName}>
            {getSvgIcon(player.role, columnIdxToX(i), 25)}
            <text x={columnIdxToX(i)} y={50} textAnchor="middle" fill="white">
              {player.playerName}
            </text>
            <text
              x={columnIdxToX(i)}
              y={67}
              textAnchor="middle"
              fill={getColorgorical(player.playerTeam)}
              fontSize={10}>
              {player.playerTeam}
            </text>
          </g>
        ))}
      </svg>
      <div
        style={{
          height: 1000,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
        <svg width="100%" height={height} ref={ref}>
          <line
            x1={xPadding + axisWidth}
            y1={topPadding}
            x2={xPadding + axisWidth}
            y2={height - bottomPadding}
            style={{
              stroke: 'white',
            }}
          />
          {Array.from({length: numMajorTicks + 1}).map((_, i) => {
            const time = startTime + i * majorTickInterval;
            return (
              <g key={time}>
                <line
                  x1={xPadding + axisWidth - 5}
                  y1={timeToY(time, startTime, endTime)}
                  x2={xPadding + axisWidth + 5}
                  y2={timeToY(time, startTime, endTime)}
                  style={{
                    stroke: 'white',
                  }}
                />
                <text
                  x={xPadding + axisWidth - 10}
                  y={timeToY(time, startTime, endTime)}
                  textAnchor="end"
                  fill="white"
                  fontSize={10}
                  dy={3}>
                  {formatTime(time)}
                </text>
              </g>
            );
          })}
          {Array.from({length: numMinorTicks + 1}).map((_, i) => {
            const time = startTime + i * minorTickInterval;
            return (
              <g key={time}>
                <line
                  x1={xPadding + axisWidth - 2.5}
                  y1={timeToY(time, startTime, endTime)}
                  x2={xPadding + axisWidth + 2.5}
                  y2={timeToY(time, startTime, endTime)}
                  style={{
                    stroke: 'white',
                  }}
                />
              </g>
            );
          })}
          {mapEvents &&
            mapEvents.map((event: any, i: number) => (
              <g key={event.matchTime + event.eventMessage + i}>
                <line
                  x1={100}
                  y1={timeToY(event.matchTime, startTime, endTime)}
                  x2={width}
                  y2={timeToY(event.matchTime, startTime, endTime)}
                  style={{
                    stroke: 'white',
                    strokeDasharray: '5,5',
                  }}
                />
                <SvgWrapText
                  x={10}
                  y={timeToY(event.matchTime, startTime, endTime)}
                  color="white"
                  size={10}>
                  {event.eventMessage}
                </SvgWrapText>
              </g>
            ))}
          {players.map((player: any, i: number) => (
            <g key={player.playerName}>
              {playerLives[player.playerName] &&
                playerLives[player.playerName].map((life: any) => (
                  <g key={`${life.playerName}_${life.startTime}`}>
                    <circle
                      cx={columnIdxToX(i)}
                      cy={timeToY(life.startTime, startTime, endTime)}
                      r={5}
                      fill={getColorFor(heroNameToNormalized(life.playerHero))}
                    />

                    {life.startMessage && (
                      <SvgWrapText
                        x={columnIdxToX(i) + 10}
                        y={timeToY(life.startTime, startTime, endTime)}
                        color={getColorFor(
                          heroNameToNormalized(life.playerHero),
                        )}
                        size={10}>
                        {life.startMessage}
                      </SvgWrapText>
                    )}
                    <line
                      x1={columnIdxToX(i) - 5}
                      y1={timeToY(life.endTime, startTime, endTime)}
                      x2={columnIdxToX(i) + 5}
                      y2={timeToY(life.endTime, startTime, endTime)}
                      style={{
                        stroke: getColorFor(
                          heroNameToNormalized(life.playerHero),
                        ),
                      }}
                    />

                    {life.endMessage && (
                      <SvgWrapText
                        x={columnIdxToX(i) + 10}
                        y={timeToY(life.endTime, startTime, endTime)}
                        color={getColorFor(
                          heroNameToNormalized(life.playerHero),
                        )}
                        size={10}>
                        {life.endMessage}
                      </SvgWrapText>
                    )}

                    <line
                      x1={columnIdxToX(i)}
                      y1={timeToY(life.startTime, startTime, endTime)}
                      x2={columnIdxToX(i)}
                      y2={timeToY(life.endTime, startTime, endTime)}
                      style={{
                        stroke: getColorFor(
                          heroNameToNormalized(life.playerHero),
                        ),
                      }}
                    />
                  </g>
                ))}

              {playerEvents?.[player.playerName] &&
                playerEvents[player.playerName].map((event: any, j: number) => (
                  <g key={`${event.eventMessage}_${event.matchTime}_${j}`}>
                    <circle
                      cx={columnIdxToX(i)}
                      cy={timeToY(event.matchTime, startTime, endTime)}
                      r={5}
                      fill={getColorgorical(player.playerTeam)}
                    />
                    {event.eventMessage && (
                      <SvgWrapText
                        x={columnIdxToX(i) + 10}
                        y={timeToY(event.matchTime, startTime, endTime)}
                        color={'white'}
                        size={10}>
                        {event.eventMessage}
                      </SvgWrapText>
                    )}
                  </g>
                ))}
            </g>
          ))}
        </svg>
      </div>
    </Paper>
  );
};

export default MapTimeline;
