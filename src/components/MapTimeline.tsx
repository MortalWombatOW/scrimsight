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
    new AlaSQLNode(
      'MapTimeline_hero_spawns_' + mapId + '_' + roundId,
      `SELECT
        hero_spawn.*
      FROM ? AS hero_spawn
      WHERE
        hero_spawn.mapId = ${mapId}
      `,
      ['hero_spawn_object_store'],
    ),
    new AlaSQLNode(
      'MapTimeline_hero_swaps_' + mapId + '_' + roundId,
      `SELECT 
        hero_swap.*
      FROM ? AS hero_swap
      WHERE
        hero_swap.mapId = ${mapId}
      `,
      ['hero_swap_object_store'],
    ),
    new AlaSQLNode(
      'MapTimeline_mercy_resurrects_' + mapId + '_' + roundId,
      `SELECT
        mercy_rez.*
      FROM ? AS mercy_rez
      WHERE
        mercy_rez.mapId = ${mapId}
      `,
      ['mercy_rez_object_store'],
    ),
    new AlaSQLNode(
      'MapTimeline_round_end_' + mapId + '_' + roundId,
      `SELECT
        round_end.*
      FROM ? AS round_end
      WHERE
        round_end.mapId = ${mapId}
      `,
      ['round_end_object_store'],
    ),
  ]);

  const mapRosterRawData = data['MapTimeline_players_' + mapId];
  const kills = data['MapTimeline_kills_' + mapId + '_' + roundId];
  const heroSpawns = data['MapTimeline_hero_spawns_' + mapId + '_' + roundId];
  const heroSwaps = data['MapTimeline_hero_swaps_' + mapId + '_' + roundId];
  const mercyResurrects =
    data['MapTimeline_mercy_resurrects_' + mapId + '_' + roundId];
  const roundEnd = data['MapTimeline_round_end_' + mapId + '_' + roundId];

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

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
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

  const [playerLives, setPlayerLives] = useState<{
    [name: string]: {
      playerName: string;
      playerHero: string;
      startTime: number;
      endTime: number;
      startMessage?: string;
      endMessage?: string;
    }[];
  }>({});

  useEffect(() => {
    if (!kills || !heroSpawns || !heroSwaps || !mercyResurrects || !roundEnd) {
      return;
    }

    const startTime_ = Math.min(
      ...[
        ...kills,
        ...heroSpawns,
        ...heroSwaps,
        ...mercyResurrects,
        ...roundEnd,
      ].map((event) => event.matchTime),
    );
    const endTime_ = Math.max(
      ...[
        ...kills,
        ...heroSpawns,
        ...heroSwaps,
        ...mercyResurrects,
        ...roundEnd,
      ].map((event) => event.matchTime),
    );
    setStartTime(startTime_);
    setEndTime(endTime_);
    // build playerlives by iterating through events (kills, hero_swaps, hero_spawns, mercy_resurrects) in order
    // player lifes start with a hero spawn or mercy resurrect, and end with a hero swap or death or round end
    const playerLives_: {
      [name: string]: {
        playerName: string;
        playerHero: string;
        startTime: number;
        endTime: number;
        startMessage?: string;
        endMessage?: string;
      }[];
    } = {};

    const currentPlayerLives: {
      [name: string]: {
        playerName: string;
        playerHero: string;
        startTime: number;
        endTime: number;
        startMessage?: string;
        endMessage?: string;
      };
    } = {};
    let killIdx = 0;
    let heroSpawnIdx = 0;
    let heroSwapIdx = 0;
    let mercyResurrectIdx = 0;
    let roundEndIdx = 0;

    const maxIters = 10000;
    const iters = 0;
    while (
      (killIdx < kills.length ||
        heroSpawnIdx < heroSpawns.length ||
        heroSwapIdx < heroSwaps.length ||
        mercyResurrectIdx < mercyResurrects.length ||
        roundEndIdx < roundEnd.length) &&
      iters < maxIters
    ) {
      const nextKill = kills[killIdx];
      const nextHeroSpawn = heroSpawns[heroSpawnIdx];
      const nextHeroSwap = heroSwaps[heroSwapIdx];
      const nextMercyResurrect = mercyResurrects[mercyResurrectIdx];
      const nextRoundEnd = roundEnd[roundEndIdx];

      const nextEvent = [
        nextKill,
        nextHeroSpawn,
        nextHeroSwap,
        nextMercyResurrect,
        nextRoundEnd,
      ]
        .filter((e) => e)
        .sort((a, b) => {
          if (a.matchTime !== b.matchTime) {
            return a.matchTime - b.matchTime;
          }
          // prefer spawn and res
          if (a.type === 'hero_spawn' || a.type === 'mercy_rez') {
            return -1;
          }
          if (b.type === 'hero_spawn' || b.type === 'mercy_rez') {
            return 1;
          }
          return 0;
        })[0];

      // console.log(
      //   'nextEvent',
      //   nextEvent,
      //   nextKill,
      //   nextHeroSpawn,
      //   nextHeroSwap,
      //   nextMercyResurrect,
      //   nextRoundEnd,
      // );
      // console.log('currentPlayerLives', currentPlayerLives);

      // check if the last life for each player has ended more than 10 seconds ago. Is so, create a synthetic spawn event and add it to the playerLives_ array
      const previousLives = Object.keys(playerLives_)
        .map((playerName) => playerLives_[playerName].slice(-1)[0])
        .filter(
          (life) =>
            nextEvent.matchTime > life.endTime + 10 &&
            currentPlayerLives[life.playerName] === undefined,
        );

      for (const life of previousLives) {
        console.log('synthetic spawn', life);
        currentPlayerLives[life.playerName] = {
          playerName: life.playerName,
          playerHero: life.playerHero,
          startTime: life.endTime + 10,
          endTime: 0,
          startMessage: 'Inferred spawn',
        };
      }

      if (nextEvent === nextKill) {
        if (currentPlayerLives[nextKill.victimName]) {
          currentPlayerLives[nextKill.victimName].endTime = nextKill.matchTime;
          currentPlayerLives[nextKill.victimName].endMessage =
            'Killed by ' + nextKill.attackerName;
          if (!playerLives_[nextKill.victimName]) {
            playerLives_[nextKill.victimName] = [];
          }
          playerLives_[nextKill.victimName].push(
            currentPlayerLives[nextKill.victimName],
          );
          console.log('kill', currentPlayerLives[nextKill.victimName]);
          delete currentPlayerLives[nextKill.victimName];
        } else {
          console.error('kill with no spawn', nextKill);
          break;
        }
        killIdx++;
      }
      if (nextEvent === nextHeroSpawn) {
        if (currentPlayerLives[nextHeroSpawn.playerName]) {
          console.error('hero spawn with existing spawn', nextHeroSpawn);
          break;
        } else {
          const previousLife =
            playerLives_[nextHeroSpawn.playerName]?.slice(-1)?.[0];
          const startMessage = previousLife ? 'Respawned' : 'Spawned';
          const startMessageNewHero =
            nextHeroSpawn.playerHero !== previousLife?.playerHero
              ? ' as ' + nextHeroSpawn.playerHero
              : '';

          currentPlayerLives[nextHeroSpawn.playerName] = {
            playerName: nextHeroSpawn.playerName,
            playerHero: nextHeroSpawn.playerHero,
            startTime: nextHeroSpawn.matchTime,
            endTime: 0,
            startMessage: startMessage + startMessageNewHero,
          };
          console.log(
            'hero spawn',
            currentPlayerLives[nextHeroSpawn.playerName],
          );
        }
        heroSpawnIdx++;
      }
      if (nextEvent === nextHeroSwap) {
        if (currentPlayerLives[nextHeroSwap.playerName]) {
          currentPlayerLives[nextHeroSwap.playerName].endTime =
            nextHeroSwap.matchTime;
          if (!playerLives_[nextHeroSwap.playerName]) {
            playerLives_[nextHeroSwap.playerName] = [];
          }
          playerLives_[nextHeroSwap.playerName].push(
            currentPlayerLives[nextHeroSwap.playerName],
          );
          console.log('hero swap', currentPlayerLives[nextHeroSwap.playerName]);
          delete currentPlayerLives[nextHeroSwap.playerName];
          currentPlayerLives[nextHeroSwap.playerName] = {
            playerName: nextHeroSwap.playerName,
            playerHero: nextHeroSwap.playerHero,
            startTime: nextHeroSwap.matchTime,
            endTime: 0,
            startMessage: 'Swapped to ' + nextHeroSwap.playerHero,
          };
        } else {
          console.error('hero swap with no spawn', nextHeroSwap);
          // break;
        }
        heroSwapIdx++;
      }
      if (nextEvent === nextMercyResurrect) {
        // TODO revivedHero is really revivedName
        if (currentPlayerLives[nextMercyResurrect.revivedHero] === undefined) {
          const previousDeath =
            playerLives_[nextMercyResurrect.revivedHero].slice(-1)[0];
          currentPlayerLives[nextMercyResurrect.revivedHero] = {
            playerName: nextMercyResurrect.revivedHero,
            playerHero: previousDeath.playerHero,
            startTime: nextMercyResurrect.matchTime,
            endTime: 0,
            startMessage: 'Revived by ' + nextMercyResurrect.mercyName,
          };
          console.log(
            'rez',
            currentPlayerLives[nextMercyResurrect.revivedHero],
          );
        } else {
          console.error('rez with no death', nextMercyResurrect);
          break;
        }
        mercyResurrectIdx++;
      }
      if (nextEvent === nextRoundEnd) {
        for (const playerName in currentPlayerLives) {
          if (currentPlayerLives[playerName]) {
            currentPlayerLives[playerName].endTime = nextRoundEnd.matchTime;
            currentPlayerLives[playerName].endMessage = '';
            if (!playerLives_[playerName]) {
              playerLives_[playerName] = [];
            }
            playerLives_[playerName].push(currentPlayerLives[playerName]);
            delete currentPlayerLives[playerName];
          }
          console.log('round end', currentPlayerLives[playerName]);
        }
        roundEndIdx++;
      }
    }

    setPlayerLives(playerLives_);
  }, [
    JSON.stringify(kills),
    JSON.stringify(heroSpawns),
    JSON.stringify(heroSwaps),
    JSON.stringify(mercyResurrects),
    JSON.stringify(roundEnd),
  ]);

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
          <circle
            cx={width / 2}
            cy={timeToY(startTime, startTime, endTime)}
            r={5}
            fill="white"
          />
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
                    <text
                      x={columnIdxToX(i)}
                      y={timeToY(life.startTime, startTime, endTime)}
                      textAnchor="start"
                      fill={getColorFor(heroNameToNormalized(life.playerHero))}
                      fontSize={10}
                      dx={10}
                      dy={2.5}>
                      {life.startMessage}
                    </text>
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
