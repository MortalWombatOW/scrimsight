/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../useData';
import useUUID from '../useUUID';
import {useMapContext} from '../../context/MapContext';

const usePlayerLives = () => {
  const {mapId, roundId} = useMapContext();
  const uuid = useUUID();
  const data = useDataNodes([
    new AlaSQLNode(
      'UsePlayerLives_kills_' + mapId + '_' + roundId + '_' + uuid,
      `SELECT
        kill_object_store.*
      FROM ? AS kill_object_store
      WHERE
        kill_object_store.mapId = ${mapId}
      `,
      ['kill_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerLives_hero_spawns_' + mapId + '_' + roundId + '_' + uuid,
      `SELECT
        hero_spawn.*
      FROM ? AS hero_spawn
      WHERE
        hero_spawn.mapId = ${mapId}
      `,
      ['hero_spawn_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerLives_hero_swaps_' + mapId + '_' + roundId + '_' + uuid,
      `SELECT 
        hero_swap.*
      FROM ? AS hero_swap
      WHERE
        hero_swap.mapId = ${mapId}
      `,
      ['hero_swap_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerLives_mercy_resurrects_' + mapId + '_' + roundId + '_' + uuid,
      `SELECT
        mercy_rez.*
      FROM ? AS mercy_rez
      WHERE
        mercy_rez.mapId = ${mapId}
      `,
      ['mercy_rez_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerLives_round_end_' + mapId + '_' + roundId + '_' + uuid,
      `SELECT
        round_end.*
      FROM ? AS round_end
      WHERE
        round_end.mapId = ${mapId}
      `,
      ['round_end_object_store'],
    ),
  ]);

  const kills =
    data['UsePlayerLives_kills_' + mapId + '_' + roundId + '_' + uuid];
  const heroSpawns =
    data['UsePlayerLives_hero_spawns_' + mapId + '_' + roundId + '_' + uuid];
  const heroSwaps =
    data['UsePlayerLives_hero_swaps_' + mapId + '_' + roundId + '_' + uuid];
  const mercyResurrects =
    data[
      'UsePlayerLives_mercy_resurrects_' + mapId + '_' + roundId + '_' + uuid
    ];
  const roundEnd =
    data['UsePlayerLives_round_end_' + mapId + '_' + roundId + '_' + uuid];

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
        violentEnd: boolean;
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
        violentEnd: boolean;
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
        // console.log('synthetic spawn', life);
        currentPlayerLives[life.playerName] = {
          playerName: life.playerName,
          playerHero: life.playerHero,
          startTime: life.endTime + 10,
          endTime: 0,
          startMessage: '',
          violentEnd: false,
        };
      }

      if (nextEvent === nextKill) {
        if (currentPlayerLives[nextKill.victimName]) {
          currentPlayerLives[nextKill.victimName].endTime = nextKill.matchTime;
          currentPlayerLives[nextKill.victimName].endMessage =
            'Killed by ' + nextKill.attackerName;
          currentPlayerLives[nextKill.victimName].violentEnd = true;
          if (!playerLives_[nextKill.victimName]) {
            playerLives_[nextKill.victimName] = [];
          }
          playerLives_[nextKill.victimName].push(
            currentPlayerLives[nextKill.victimName],
          );
          // console.log('kill', currentPlayerLives[nextKill.victimName]);
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
            violentEnd: false,
          };
          // console.log(
          //   'hero spawn',
          //   currentPlayerLives[nextHeroSpawn.playerName],
          // );
        }
        heroSpawnIdx++;
      }
      if (nextEvent === nextHeroSwap) {
        if (currentPlayerLives[nextHeroSwap.playerName]) {
          currentPlayerLives[nextHeroSwap.playerName].endTime =
            nextHeroSwap.matchTime;
          currentPlayerLives[nextHeroSwap.playerName].violentEnd = false;
          if (!playerLives_[nextHeroSwap.playerName]) {
            playerLives_[nextHeroSwap.playerName] = [];
          }
          playerLives_[nextHeroSwap.playerName].push(
            currentPlayerLives[nextHeroSwap.playerName],
          );
          // console.log('hero swap', currentPlayerLives[nextHeroSwap.playerName]);
          delete currentPlayerLives[nextHeroSwap.playerName];
          currentPlayerLives[nextHeroSwap.playerName] = {
            playerName: nextHeroSwap.playerName,
            playerHero: nextHeroSwap.playerHero,
            startTime: nextHeroSwap.matchTime,
            endTime: 0,
            startMessage: 'Swapped to ' + nextHeroSwap.playerHero,
            violentEnd: false,
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
            violentEnd: false,
          };
          // console.log(
          //   'rez',
          //   currentPlayerLives[nextMercyResurrect.revivedHero],
          // );
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
            currentPlayerLives[playerName].violentEnd = false;
            if (!playerLives_[playerName]) {
              playerLives_[playerName] = [];
            }
            playerLives_[playerName].push(currentPlayerLives[playerName]);
            delete currentPlayerLives[playerName];
          }
          // console.log('round end', currentPlayerLives[playerName]);
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

  return playerLives;
};

export default usePlayerLives;
