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
  const data = useDataNodes([
    new AlaSQLNode(
      'MapTimeline_kills_' + mapId + '_' + roundId,
      `SELECT
        kill_object_store.*
      FROM ? AS kill_object_store
      WHERE
        kill_object_store.mapId = ${mapId}
      `,
      ['kill_object_store'],
    ),
  ]);

  const kills = data['MapTimeline_kills_' + mapId + '_' + roundId];

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

  console.log('players', players);

  const {startTime, endTime} = useMapTimes(mapId)?.[roundId] || {
    startTime: 0,
    endTime: 0,
  };
  const [pixelsPerSecond, setPixelsPerSecond] = useState(5);
  const height = (endTime - startTime) * pixelsPerSecond;
  const width = 1000;
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
    return (idx / players.length) * width + xPadding;
  };

  const [killsByPlayer, setKillsByPlayer] = useState<{
    [name: string]: object[];
  }>({});

  useEffect(() => {
    if (!kills) {
      return;
    }

    const killsByPlayer_ = {};

    for (const kill of kills) {
      if (!killsByPlayer_[kill.attackerName]) {
        killsByPlayer_[kill.attackerName] = [];
      }
      killsByPlayer_[kill.attackerName].push(kill);
    }

    setKillsByPlayer(killsByPlayer_);
  }, [JSON.stringify(kills)]);

  // console.log('killsByPlayer', killsByPlayer);

  const playerLives = usePlayerLives(mapId, roundId);

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
        {players.map((player: any, i: number) => (
          <g key={player.playerName}>
            {getSvgIcon(player.role, columnIdxToX(i), 25)}
            <text x={columnIdxToX(i)} y={50} textAnchor="middle" fill="white">
              {player.playerName}
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

              {killsByPlayer[player.playerName].map((kill: any) => (
                <g key={kill.id}>
                  <circle
                    cx={columnIdxToX(i)}
                    cy={timeToY(kill.matchTime, startTime, endTime)}
                    r={5}
                    fill={getColorgorical(player.playerTeam)}
                  />
                  <text
                    x={columnIdxToX(i)}
                    y={timeToY(kill.matchTime, startTime, endTime)}
                    textAnchor="start"
                    fill="white"
                    fontSize={10}
                    dx={10}
                    dy={2.5}>
                    Killed
                    {kill.victimName}
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
