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
import useTeamfights from '../hooks/useTeamfights';
import useUltimateTimes from '../hooks/useUltimateTimes';
import {Svg} from '@react-three/drei';

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
            paddingBottom: '5px',
          }}>
          {children}
        </p>
      </foreignObject>
    </g>
  );
};

const SvgArcBetween = ({
  x1,
  y1,
  x2,
  y2,
  color,
  width,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width: number;
}) => {
  const k = 40;
  const n = 5;
  const i = 1;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const dx = (x2 - x1) / 2;
  const dy = (y2 - y1) / 2;
  const dd = Math.sqrt(dx * dx + dy * dy);
  const ex = cx + (dy / dd) * k * (i - (n - 1) / 2);
  const ey = cy - (dx / dd) * k * (i - (n - 1) / 2);
  return (
    <path
      d={'M' + x1 + ' ' + y1 + 'Q' + ex + ' ' + ey + ' ' + x2 + ' ' + y2}
      fill="none"
      stroke={color}
      strokeWidth={width}
    />
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

  const roster = useMapRosters(mapId, 'MapTimeline_');

  // console.log('roster', roster);

  useEffect(() => {
    if (!roster) {
      return;
    }

    const reversedTeam1 = roster.team1.roster.map(
      (_, i) => roster.team1.roster[roster.team1.roster.length - 1 - i],
    );

    const players = [
      ...reversedTeam1.map((player) => ({
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
  const axisWidth = 75;
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
  const ultTimes = useUltimateTimes(mapId);

  // console.log('ultTimes', ultTimes);

  const loaded =
    !!players && !!mapEvents && !!playerLives && !!playerEvents && !!ultTimes;

  // console.log('loaded', loaded);

  const iters = useLegibleTextSvg(ref, loaded);
  // console.log('iters', iters);

  const teamfights = useTeamfights(mapId, 'MapTimeline_');

  // console.log('teamfights', teamfights);

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
        <defs>
          <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor="#7deefd" />
            <stop offset="50%" stopColor="white" />
            <stop offset="75%" stopColor="#7deefd" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

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
        <svg
          width="100%"
          height={height}
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}>
          <line
            x1={xPadding + axisWidth}
            y1={topPadding}
            x2={xPadding + axisWidth}
            y2={height - bottomPadding}
            style={{
              stroke: '#cccccc',
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
                    stroke: '#cccccc',
                  }}
                />
                <text
                  x={xPadding + axisWidth - 10}
                  y={timeToY(time, startTime, endTime)}
                  textAnchor="end"
                  fill="#cccccc"
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
                    stroke: '#cccccc',
                  }}
                />
              </g>
            );
          })}
          {teamfights &&
            teamfights.map((teamfight: any, i: number) => (
              <g key={teamfight.start + teamfight.end + i}>
                <rect
                  x={0}
                  y={timeToY(teamfight.start, startTime, endTime) - 5}
                  width={xPadding + axisWidth}
                  height={
                    timeToY(teamfight.end, startTime, endTime) -
                    timeToY(teamfight.start, startTime, endTime) +
                    10
                  }
                  fill={getColorgorical(teamfight.winningTeam)}
                  fillOpacity={0.2}
                />

                <text
                  x={xPadding + axisWidth - 5}
                  y={timeToY(teamfight.start, startTime, endTime)}
                  textAnchor="end"
                  fill={getColorgorical(teamfight.winningTeam)}
                  fontSize={10}
                  dy={3}>
                  {formatTime(teamfight.start)}
                </text>
                <text
                  x={xPadding + axisWidth - 5}
                  y={timeToY(teamfight.end, startTime, endTime)}
                  textAnchor="end"
                  fill={getColorgorical(teamfight.winningTeam)}
                  fontSize={10}
                  dy={3}>
                  {formatTime(teamfight.end)}
                </text>
                <SvgWrapText
                  x={10}
                  y={timeToY(
                    (teamfight.start + teamfight.end) / 2,
                    startTime,
                    endTime,
                  )}
                  color={getColorgorical(teamfight.winningTeam)}
                  size={10}>
                  Teamfight {i + 1} - {teamfight.winningTeam} win
                </SvgWrapText>
              </g>
            ))}
          {mapEvents &&
            mapEvents.map((event: any, i: number) => (
              <g key={event.matchTime + event.eventMessage + i}>
                <line
                  x1={xPadding + axisWidth - 5}
                  y1={timeToY(event.matchTime, startTime, endTime)}
                  x2={xPadding + axisWidth + 5}
                  y2={timeToY(event.matchTime, startTime, endTime)}
                  style={{
                    stroke: 'white',
                    // strokeDasharray: '5,5',
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
              {ultTimes
                ?.filter((ult: any) => ult.playerName === player.playerName)
                .map((ult: any, j: number) => (
                  <rect
                    key={`${ult.playerName}_${ult.chargedTime}_${j}`}
                    x={columnIdxToX(i) - 4}
                    y={timeToY(ult.chargedTime, startTime, endTime)}
                    width={8}
                    height={
                      timeToY(ult.usedTime, startTime, endTime) -
                      timeToY(ult.chargedTime, startTime, endTime)
                    }
                    fill="url(#grad1)"
                  />
                ))}
              {playerLives[player.playerName] &&
                playerLives[player.playerName].map((life: any) => (
                  <g key={`${life.playerName}_${life.startTime}`}>
                    <circle
                      cx={columnIdxToX(i)}
                      cy={timeToY(life.startTime, startTime, endTime)}
                      r={3}
                      fill={getColorFor(heroNameToNormalized(life.playerHero))}
                    />

                    {life.startMessage && (
                      <SvgWrapText
                        x={columnIdxToX(i) + 7}
                        y={timeToY(life.startTime, startTime, endTime)}
                        color={getColorFor(
                          heroNameToNormalized(life.playerHero),
                        )}
                        size={10}>
                        {life.startMessage}
                      </SvgWrapText>
                    )}
                    {life.violentEnd ? (
                      <>
                        <line
                          x1={columnIdxToX(i) - 5}
                          y1={timeToY(life.endTime, startTime, endTime) - 5}
                          x2={columnIdxToX(i) + 5}
                          y2={timeToY(life.endTime, startTime, endTime) + 5}
                          style={{
                            stroke: getColorFor(
                              heroNameToNormalized(life.playerHero),
                            ),
                          }}
                        />
                        <line
                          x1={columnIdxToX(i) + 5}
                          y1={timeToY(life.endTime, startTime, endTime) - 5}
                          x2={columnIdxToX(i) - 5}
                          y2={timeToY(life.endTime, startTime, endTime) + 5}
                          style={{
                            stroke: getColorFor(
                              heroNameToNormalized(life.playerHero),
                            ),
                          }}
                        />
                      </>
                    ) : (
                      <line
                        x1={columnIdxToX(i) - 2}
                        y1={timeToY(life.endTime, startTime, endTime)}
                        x2={columnIdxToX(i) + 2}
                        y2={timeToY(life.endTime, startTime, endTime)}
                        style={{
                          stroke: getColorFor(
                            heroNameToNormalized(life.playerHero),
                          ),
                        }}
                      />
                    )}

                    {life.endMessage && (
                      <SvgWrapText
                        x={columnIdxToX(i) + 7}
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
                      fill={
                        event.eventType === 'kill'
                          ? getColorgorical(player.playerTeam)
                          : 'transparent'
                      }
                      stroke={getColorgorical(player.playerTeam)}
                    />
                    {event.targetPlayer && (
                      <SvgArcBetween
                        x1={columnIdxToX(i)}
                        y1={timeToY(event.matchTime, startTime, endTime)}
                        x2={columnIdxToX(
                          players.findIndex(
                            (p) => p.playerName === event.targetPlayer,
                          ),
                        )}
                        y2={timeToY(event.matchTime, startTime, endTime)}
                        color={getColorgorical(player.playerTeam)}
                        width={2}
                      />
                    )}
                    {event.eventMessage && (
                      <SvgWrapText
                        x={columnIdxToX(i) + 7}
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
