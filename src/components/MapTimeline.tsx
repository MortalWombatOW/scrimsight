/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {Grid, Paper, Typography} from '@mui/material';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {useDataNodes} from '../hooks/useData';
import {getColorFor, getColorgorical} from '../lib/color';
import {getRoleFromHero, getRankForRole} from '../lib/data/data';
import IconAndText from './Common/IconAndText';
import {
  DamageIconSvg,
  TankIconSvg,
  getIcon,
  getSvgIcon,
} from './Common/RoleIcons';
import DangerousIcon from '@mui/icons-material/Dangerous';
import {heroNameToNormalized} from '../lib/string';
import usePlayerLives from '../hooks/usePlayerLives';
import useMapTimes from '../hooks/useMapTimes';

const MapTimeline = ({mapId, roundId}: {mapId: number; roundId: number}) => {
  const data = useDataNodes([
    new AlaSQLNode(
      'MapTimeline_players_' + mapId,
      `SELECT
        player_stat.playerTeam,
        match_start.team1Name,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam as id,
        ARRAY(player_stat.playerHero) as playerHeroes
      FROM ? AS player_stat
      JOIN
      ? AS match_start
      ON
        player_stat.mapId = match_start.mapId
      WHERE
        player_stat.mapId = ${mapId}
      GROUP BY
        player_stat.playerTeam,
        match_start.team1Name,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam
      `,
      ['player_stat_object_store', 'match_start_object_store'],
    ),
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

  const mapRosterRawData = data['MapTimeline_players_' + mapId];
  const kills = data['MapTimeline_kills_' + mapId + '_' + roundId];

  // holds the players for columns
  const [players, setPlayers] = useState<object[]>([]);

  useEffect(() => {
    if (!mapRosterRawData) {
      return;
    }

    const rosterWithRoles = mapRosterRawData.map((player: object) => {
      const role = getRoleFromHero(player['playerHeroes'][0]);
      const roleRank = getRankForRole(role);

      return {
        playerTeam: player['playerTeam'],
        isTeam1: player['playerTeam'] === player['team1Name'],
        playerName: player['playerName'],
        role,
        roleRank,
      };
    });

    // order is  team1 in reverse role order, then team2 in role order
    rosterWithRoles.sort((a: any, b: any) => {
      if (a.isTeam1 && b.isTeam1) {
        return b.roleRank - a.roleRank;
      }
      if (!a.isTeam1 && !b.isTeam1) {
        return a.roleRank - b.roleRank;
      }
      return a.isTeam1 ? -1 : 1;
    });

    setPlayers(rosterWithRoles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mapRosterRawData)]);

  const [killsByPlayer, setKillsByPlayer] = useState<{
    [name: string]: object[];
  }>({});

  const {startTime, endTime} = useMapTimes(mapId)?.[roundId] || {
    startTime: 0,
    endTime: 0,
  };
  const height = 3000;
  const width = 1000;
  const xPadding = 50;
  const topPadding = 50;
  const timeToY = (time: number, startTime: number, endTime: number) => {
    return ((time - startTime) / (endTime - startTime)) * height + topPadding;
  };
  const columnIdxToX = (idx: number) => {
    return (idx / players.length) * width + xPadding;
  };

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
      {/* <Grid container>
        <Grid item xs={2}>
          <Typography variant="h6">Timeline</Typography>
        </Grid>
        {players.map((player: any) => (
          <Grid item xs={1} key={player.attackerName}>
            <Typography variant="body2">
              <IconAndText
                icon={getIcon(player.role)}
                text={player.playerName}
              />
            </Typography>
          </Grid>
        ))} */}
      {/* </Grid> */}
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
              {/* <line
                key={player.playerName}
                x1={columnIdxToX(i)}
                y1={0}
                x2={columnIdxToX(i)}
                y2={height}
                style={{stroke: getColorgorical(player.playerTeam)}}
              /> */}
              {playerLives[player.playerName] &&
                playerLives[player.playerName].map((life: any) => (
                  <g key={`${life.playerName}_${life.startTime}`}>
                    <circle
                      cx={columnIdxToX(i)}
                      cy={timeToY(life.startTime, startTime, endTime)}
                      r={5}
                      fill={getColorFor(heroNameToNormalized(life.playerHero))}
                    />

                    {/* <text
                      x={columnIdxToX(i)}
                      y={timeToY(life.startTime, startTime, endTime)}
                      textAnchor="start"
                      fill={getColorFor(heroNameToNormalized(life.playerHero))}
                      fontSize={10}
                      dx={10}
                      dy={2.5}> */}
                    <g
                      transform={`translate(${columnIdxToX(i) + 10}, ${
                        timeToY(life.startTime, startTime, endTime) - 13
                      })`}>
                      <foreignObject
                        width="80"
                        height="50"
                        requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                        <p
                          style={{
                            color: getColorFor(
                              heroNameToNormalized(life.playerHero),
                            ),
                            fontSize: 10,
                            lineHeight: 0.9,
                          }}>
                          {life.startMessage}
                        </p>
                      </foreignObject>
                      {/* </text> */}
                    </g>
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
                    <text
                      x={columnIdxToX(i)}
                      y={timeToY(life.endTime, startTime, endTime)}
                      textAnchor="start"
                      fill={getColorFor(heroNameToNormalized(life.playerHero))}
                      fontSize={10}
                      dx={10}
                      dy={2.5}>
                      {life.endMessage}
                    </text>

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
