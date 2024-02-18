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
  const [offsetY, setOffsetY] = useState(0);
  const ref = React.useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const height = ref.current.clientHeight;
      setOffsetY(height / 2);
    }
  }, [JSON.stringify(children), size]);

  return (
    <g transform={`translate(${x}, ${y - offsetY})`}>
      <foreignObject
        width="80"
        height="50"
        requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <p
          ref={ref}
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

  const ref = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

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
  const topPadding = 50;
  const bottomPadding = 50;
  const timeToY = (time: number, startTime: number, endTime: number) => {
    return (
      ((time - startTime) / (endTime - startTime)) *
        (height - topPadding - bottomPadding) +
      topPadding
    );
  };
  const columnIdxToX = (idx: number) => {
    return (
      ((idx + 1) / (players.length + 1)) * (width - 2 * xPadding) + xPadding
    );
  };

  const [killsByPlayer, setKillsByPlayer] = useState<{
    [name: string]: object[];
  }>({});

  console.log('killsByPlayer', killsByPlayer);

  const playerLives = usePlayerLives(mapId, roundId);
  const playerEvents = usePlayerEvents(mapId);

  return (
    <Paper
      sx={{padding: '1em', borderRadius: '5px', marginTop: '1em'}}
      ref={ref}>
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
        {players.map((player: any, i: number) => (
          <g key={player.playerName}>
            {getSvgIcon(player.role, columnIdxToX(i), 25)}
            <text x={columnIdxToX(i)} y={50} textAnchor="middle" fill="white">
              {player.playerName}
            </text>
            <text
              x={columnIdxToX(i)}
              y={50}
              textAnchor="middle"
              fill={getColorgorical(player.playerTeam)}
              fontSize={10}
              dy={15}>
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
        <svg width="100%" height={height}>
          {mapEvents &&
            mapEvents.map((event: any) => (
              <g key={event.matchTime}>
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

                    <SvgWrapText
                      x={columnIdxToX(i) + 10}
                      y={timeToY(life.startTime, startTime, endTime)}
                      color={getColorFor(heroNameToNormalized(life.playerHero))}
                      size={10}>
                      {life.startMessage}
                    </SvgWrapText>
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

                    <SvgWrapText
                      x={columnIdxToX(i) + 10}
                      y={timeToY(life.endTime, startTime, endTime)}
                      color={getColorFor(heroNameToNormalized(life.playerHero))}
                      size={10}>
                      {life.endMessage}
                    </SvgWrapText>

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
                playerEvents[player.playerName].map((event: any) => (
                  <g key={`${event.eventMessage}_${event.matchTime}`}>
                    <circle
                      cx={columnIdxToX(i)}
                      cy={timeToY(event.matchTime, startTime, endTime)}
                      r={5}
                      fill={getColorgorical(player.playerTeam)}
                    />
                    <text
                      x={columnIdxToX(i)}
                      y={timeToY(event.matchTime, startTime, endTime)}
                      textAnchor="start"
                      fill="white"
                      fontSize={10}
                      dx={10}
                      dy={2.5}>
                      {event.eventMessage}
                    </text>
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
