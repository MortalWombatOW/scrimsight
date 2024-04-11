/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../useData';
import useUUID from '../useUUID';
import {useMapContext} from '../../pages/MapPage/context/MapContext';
import {usePlayerContext} from '../../pages/PlayerPage/context/PlayerContext';
import {
  HeroSpawn,
  HeroSwap,
  Kill,
  MercyRez,
  RoundEnd,
} from '../../lib/data/NodeData';

interface UsePlayerLivesBaseConfig {
  playerName?: string;
  mapId?: number;
}

type PlayerLifeStartType = 'spawn' | 'swap_spawn' | 'rez';
type PlayerLifeEndType = 'death' | 'swap_death' | 'round_end';

interface PlayerLifeStart {
  playerName: string;
  playerHero?: string;
  time: number;
  type: PlayerLifeStartType;
  message: string;
  inferred: boolean;
}

interface PlayerLifeEnd {
  playerName: string;
  // only used if the start event has an unknown hero
  playerHero?: string;
  time: number;
  type: PlayerLifeEndType;
  message: string;
  inferred: boolean;
}

interface PlayerLife {
  playerName: string;
  playerHero: string;
  startTime: number;
  endTime: number;
  startMessage: string;
  endMessage: string;
  startInferred: boolean;
  endInferred: boolean;
}

const isLifeStart = (
  event: PlayerLifeStart | PlayerLifeEnd,
): event is PlayerLifeStart => {
  return (
    event.type === 'spawn' ||
    event.type === 'swap_spawn' ||
    event.type === 'rez'
  );
};

const isLifeEnd = (
  event: PlayerLifeStart | PlayerLifeEnd,
): event is PlayerLifeEnd => {
  return (
    event.type === 'death' ||
    event.type === 'swap_death' ||
    event.type === 'round_end'
  );
};

const mergeLife = (
  start: PlayerLifeStart,
  end: PlayerLifeEnd,
): PlayerLife | null => {
  if (start.playerHero === undefined && end.playerHero === undefined) {
    if (start.inferred || end.type === 'round_end') {
      return null;
    } else {
      console.error(start, end);
      throw new Error('Both start and end events have unknown hero');
    }
  }
  return {
    playerName: start.playerName,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    playerHero: start.playerHero ? start.playerHero : end.playerHero!,
    startTime: start.time,
    endTime: end.time,
    startMessage: start.message,
    endMessage: end.message,
    startInferred: start.inferred,
    endInferred: end.inferred,
  };
};

// This function finds pairs of start and end events for a single player and merges them into a life object array
// and outputs an array of non-overlapping player lives. It does this by iterating through the events
// and creating a new life when a start event is found and adding the end event to the current life.
// At this point, events is composed of alternating start and end events.
const mergeLives = (
  events: (PlayerLifeStart | PlayerLifeEnd)[],
): PlayerLife[] => {
  if (events.length % 2 !== 0) {
    console.error('invalid events');
    return [];
  }
  const lives: PlayerLife[] = [];
  for (let i = 0; i < events.length / 2; i++) {
    const start = events[i * 2];
    const end = events[i * 2 + 1];
    if (!isLifeStart(start) || !isLifeEnd(end)) {
      console.error('invalid start or end event', start, end);
      return [];
    }
    const life = mergeLife(start, end);
    if (life) {
      lives.push(life);
    }
  }
  console.log('merged lives', lives);
  return lives;
};

// This function adds missing start and end events to the events array so that it is composed of alternating start and end events.
const addInferredEvents = (
  events: (PlayerLifeStart | PlayerLifeEnd)[],
): (PlayerLifeStart | PlayerLifeEnd)[] => {
  const newEvents: (PlayerLifeStart | PlayerLifeEnd)[] = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (isLifeStart(event)) {
      // if event is a start event, check that the next event is an end event. If not, add an inferred end event 1 second before the next event time,
      // or if there is no next event, add an inferred end event 1 second after the current event time
      newEvents.push(event);
      const isLastEvent = i === events.length - 1;
      if (isLastEvent) {
        newEvents.push({
          playerName: event.playerName,
          playerHero: event.playerHero,
          time: event.time + 10,
          type: 'death',
          message: 'Inferred death',
          inferred: true,
        });
      } else {
        const nextEvent = events[i + 1];
        if (isLifeStart(nextEvent)) {
          newEvents.push({
            playerName: event.playerName,
            playerHero: event.playerHero,
            time: Math.max(nextEvent.time - 7, event.time + 2),
            type: 'death',
            message: 'Inferred death2',
            inferred: true,
          });
        }
      }
    } else if (isLifeEnd(event)) {
      // if event is an end event, check that the previous event is a start event. If not, add an inferred start event 7 seconds after the previous event time,
      // or if there is no previous event, add an inferred start event 7 seconds before the current event time
      const isFirstEvent = i === 0;
      if (isFirstEvent) {
        newEvents.push({
          playerName: event.playerName,
          playerHero: event.playerHero,
          time: event.time - 7,
          type: 'spawn',
          message: 'Inferred spawn',
          inferred: true,
        });
      } else {
        const previousEvent = events[i - 1];
        if (isLifeEnd(previousEvent)) {
          newEvents.push({
            playerName: event.playerName,
            playerHero: event.playerHero,
            time: Math.min(previousEvent.time + 7, event.time - 2),
            type: 'spawn',
            message: 'Inferred spawn2',
            inferred: true,
          });
        }
      }
      newEvents.push(event);
    }
  }

  console.log('added inferred events', newEvents);
  return newEvents;
};

class PlayerLifeManager {
  // input data
  kills: Kill[];
  heroSpawns: HeroSpawn[];
  heroSwaps: HeroSwap[];
  mercyResurrects: MercyRez[];
  roundEnd: RoundEnd[];

  // internal state
  indexes: {
    killIdx: number;
    heroSpawnIdx: number;
    heroSwapIdx: number;
    mercyResurrectIdx: number;
    roundEndIdx: number;
  };

  // intermediate data
  playerLifeEvents: {
    [name: string]: (PlayerLifeStart | PlayerLifeEnd)[];
  };

  // final output
  playerLives: {
    [name: string]: PlayerLife[];
  };

  constructor(kills, heroSpawns, heroSwaps, mercyResurrects, roundEnd) {
    this.kills = kills;
    this.heroSpawns = heroSpawns;
    this.heroSwaps = heroSwaps;
    this.mercyResurrects = mercyResurrects;
    this.roundEnd = roundEnd;
    this.playerLives = {};
    this.playerLifeEvents = {};
    this.indexes = {
      killIdx: 0,
      heroSpawnIdx: 0,
      heroSwapIdx: 0,
      mercyResurrectIdx: 0,
      roundEndIdx: 0,
    };
  }

  sortByTime() {
    for (const playerName in this.playerLifeEvents) {
      this.playerLifeEvents[playerName].sort((a, b) => {
        if (a.time !== b.time) {
          return a.time - b.time;
        }
        return 0;
      });
    }
  }

  processEvents() {
    const maxIters = 10000;
    let iters = 0;
    while (this.hasNextEvent() && iters < maxIters) {
      const nextEvent = this.getNextEvent();
      this.handleEvent(nextEvent);
      iters++;
    }

    console.log(
      'loaded events',
      JSON.parse(JSON.stringify(this.playerLifeEvents)),
    );
  }

  hasNextEvent() {
    return (
      this.indexes.killIdx < this.kills.length ||
      this.indexes.heroSpawnIdx < this.heroSpawns.length ||
      this.indexes.heroSwapIdx < this.heroSwaps.length ||
      this.indexes.mercyResurrectIdx < this.mercyResurrects.length ||
      this.indexes.roundEndIdx < this.roundEnd.length
    );
  }

  getNextEvent() {
    const events = [
      this.kills[this.indexes.killIdx],
      this.heroSpawns[this.indexes.heroSpawnIdx],
      this.heroSwaps[this.indexes.heroSwapIdx],
      this.mercyResurrects[this.indexes.mercyResurrectIdx],
      this.roundEnd[this.indexes.roundEndIdx],
    ].filter((e) => e);

    return events.sort(this.sortEvents)[0];
  }

  sortEvents(a, b) {
    if (a.matchTime !== b.matchTime) {
      return a.matchTime - b.matchTime;
    }
    if (a.type === 'hero_spawn' || a.type === 'mercy_rez') {
      return -1;
    }
    if (b.type === 'hero_spawn' || b.type === 'mercy_rez') {
      return 1;
    }
    return 0;
  }

  handleEvent(event) {
    switch (event.type) {
      case 'kill':
        this.handleKill(event);
        this.indexes.killIdx++;
        break;
      case 'hero_spawn':
        this.handleHeroSpawn(event);
        this.indexes.heroSpawnIdx++;
        break;
      case 'hero_swap':
        this.handleHeroSwap(event);
        this.indexes.heroSwapIdx++;
        break;
      case 'mercy_rez':
        this.handleMercyResurrect(event);
        this.indexes.mercyResurrectIdx++;
        break;
      case 'round_end':
        this.handleRoundEnd(event);
        this.indexes.roundEndIdx++;
        break;
      default:
        console.error('Unknown event type', event);
    }
  }

  handleKill(killEvent) {
    const victimName = killEvent.victimName;
    const lifeEnd: PlayerLifeEnd = {
      playerName: victimName,
      playerHero: killEvent.victimHero,
      time: killEvent.matchTime,
      type: 'death',
      message: `Killed by ${killEvent.attackerName}`,
      inferred: false,
    };
    if (!this.playerLifeEvents[victimName]) {
      this.playerLifeEvents[victimName] = [];
    }
    this.playerLifeEvents[victimName].push(lifeEnd);
  }

  handleHeroSpawn(heroSpawnEvent) {
    const playerName = heroSpawnEvent.playerName;
    const lifeStart: PlayerLifeStart = {
      playerName: playerName,
      playerHero: heroSpawnEvent.playerHero,
      time: heroSpawnEvent.matchTime,
      type: 'spawn',
      message: `Spawned as ${heroSpawnEvent.playerHero}`,
      inferred: false,
    };
    if (!this.playerLifeEvents[playerName]) {
      this.playerLifeEvents[playerName] = [];
    }
    this.playerLifeEvents[playerName].push(lifeStart);
  }

  handleHeroSwap(heroSwapEvent: HeroSwap) {
    const playerName = heroSwapEvent.playerName;
    const lifeEnd: PlayerLifeEnd = {
      playerName: playerName,
      playerHero: heroSwapEvent.previousHero,
      time: heroSwapEvent.matchTime,
      type: 'swap_death',
      message: `Swapped to ${heroSwapEvent.playerHero}`,
      inferred: false,
    };
    if (!this.playerLifeEvents[playerName]) {
      this.playerLifeEvents[playerName] = [];
    }
    this.playerLifeEvents[playerName].push(lifeEnd);

    const lifeStart: PlayerLifeStart = {
      playerName: playerName,
      playerHero: heroSwapEvent.playerHero,
      time: heroSwapEvent.matchTime,
      type: 'swap_spawn',
      message: `Swapped to ${heroSwapEvent.playerHero}`,
      inferred: false,
    };
    if (!this.playerLifeEvents[playerName]) {
      this.playerLifeEvents[playerName] = [];
    }
    this.playerLifeEvents[playerName].push(lifeStart);
  }

  handleMercyResurrect(mercyResurrectEvent) {
    const revivedName = mercyResurrectEvent.revivedHero;
    const lifeStart: PlayerLifeStart = {
      playerName: revivedName,
      playerHero: mercyResurrectEvent.eventAbility,
      time: mercyResurrectEvent.matchTime,
      type: 'rez',
      message: `Revived by ${mercyResurrectEvent.mercyName}`,
      inferred: false,
    };
    if (!this.playerLifeEvents[revivedName]) {
      this.playerLifeEvents[revivedName] = [];
    }
    this.playerLifeEvents[revivedName].push(lifeStart);
  }

  handleRoundEnd(roundEndEvent) {
    for (const playerName in this.playerLifeEvents) {
      const lifeEnd: PlayerLifeEnd = {
        playerName: playerName,
        time: roundEndEvent.matchTime,
        type: 'round_end',
        message: `Round ended`,
        inferred: false,
      };
      if (!this.playerLifeEvents[playerName]) {
        this.playerLifeEvents[playerName] = [];
      }
      this.playerLifeEvents[playerName].push(lifeEnd);
    }
  }

  addInferredEvents() {
    for (const playerName in this.playerLifeEvents) {
      this.playerLifeEvents[playerName] = addInferredEvents(
        this.playerLifeEvents[playerName],
      );
    }
  }

  matchEventsToLives() {
    for (const playerName in this.playerLifeEvents) {
      this.playerLives[playerName] = mergeLives(
        this.playerLifeEvents[playerName],
      );
    }
  }

  validateLives() {
    let inferredStarts = 0;
    let inferredEnds = 0;
    let inferredLives = 0;
    let totalLives = 0;
    for (const playerName in this.playerLives) {
      for (const life of this.playerLives[playerName]) {
        totalLives++;
        inferredStarts += life.startInferred ? 1 : 0;
        inferredEnds += life.endInferred ? 1 : 0;
        inferredLives += life.startInferred || life.endInferred ? 1 : 0;

        if (life.startInferred && life.endInferred) {
          console.error('Whole life is inferred', life);
          continue;
        }
        if (life.startTime > life.endTime) {
          console.error('Start time is after end time', life);
          continue;
        }
        console.log('Validated life', life);
      }
    }
    console.log(
      'Validated lives',
      totalLives,
      inferredStarts,
      inferredEnds,
      inferredLives,
    );
  }
}

const usePlayerLivesBase = (config: UsePlayerLivesBaseConfig) => {
  const {mapId, playerName} = config;

  const uuid = useUUID();

  const data = useDataNodes([
    new AlaSQLNode(
      `UsePlayerLives_kills_${mapId}_${playerName}_${uuid}`,
      `SELECT
        kill_object_store.*
      FROM ? AS kill_object_store
      WHERE
      ${mapId ? `kill_object_store.mapId = ${mapId}` : '1'}
      ${playerName ? `AND kill_object_store.victimName = '${playerName}'` : ''}
      ORDER BY
        kill_object_store.mapId ASC,
        kill_object_store.matchTime ASC
      `,
      ['kill_object_store'],
    ),
    new AlaSQLNode(
      `UsePlayerLives_hero_spawns_${mapId}_${playerName}_${uuid}`,
      `SELECT
      hero_spawn.*
      FROM ? AS hero_spawn
      WHERE
      ${mapId ? `hero_spawn.mapId = ${mapId}` : '1'}
      ${playerName ? `AND hero_spawn.playerName = '${playerName}'` : ''}
      ORDER BY
        hero_spawn.mapId ASC,
        hero_spawn.matchTime ASC
      `,
      ['hero_spawn_object_store'],
    ),
    new AlaSQLNode(
      `UsePlayerLives_hero_swaps_${mapId}_${playerName}_${uuid}`,
      `SELECT 
      hero_swap.*
      FROM ? AS hero_swap
      WHERE
      ${mapId ? `hero_swap.mapId = ${mapId}` : '1'}
      ${playerName ? `AND hero_swap.playerName = '${playerName}'` : ''}
      ORDER BY
        hero_swap.mapId ASC,
        hero_swap.matchTime ASC
      `,
      ['hero_swap_object_store'],
    ),
    new AlaSQLNode(
      `UsePlayerLives_mercy_resurrects_${mapId}_${playerName}_${uuid}`,
      `SELECT
      mercy_rez.*
      FROM ? AS mercy_rez
      WHERE
      ${mapId ? `mercy_rez.mapId = ${mapId}` : '1'}
      ${playerName ? `AND mercy_rez.playerName = '${playerName}'` : ''}
      ORDER BY
        mercy_rez.mapId ASC,
        mercy_rez.matchTime ASC
      `,
      ['mercy_rez_object_store'],
    ),
    new AlaSQLNode(
      `UsePlayerLives_round_end_${mapId}_${playerName}_${uuid}`,
      `SELECT
      round_end.*
      FROM ? AS round_end
      WHERE
      ${mapId ? `round_end.mapId = ${mapId}` : '1'}
      ORDER BY
        round_end.mapId ASC,
        round_end.matchTime ASC
      `,
      ['round_end_object_store'],
    ),
  ]);

  const kills = data[`UsePlayerLives_kills_${mapId}_${playerName}_${uuid}`];
  const heroSpawns =
    data[`UsePlayerLives_hero_spawns_${mapId}_${playerName}_${uuid}`];
  const heroSwaps =
    data[`UsePlayerLives_hero_swaps_${mapId}_${playerName}_${uuid}`];
  const mercyResurrects =
    data[`UsePlayerLives_mercy_resurrects_${mapId}_${playerName}_${uuid}`];
  const roundEnd =
    data[`UsePlayerLives_round_end_${mapId}_${playerName}_${uuid}`];

  console.log('kills', kills);
  console.log('heroSpawns', heroSpawns);
  console.log('heroSwaps', heroSwaps);
  console.log('mercyResurrects', mercyResurrects);
  console.log('roundEnd', roundEnd);

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
    const lifeManager = new PlayerLifeManager(
      kills,
      heroSpawns,
      heroSwaps,
      mercyResurrects,
      roundEnd,
    );
    lifeManager.processEvents();
    lifeManager.sortByTime();
    lifeManager.addInferredEvents();
    lifeManager.matchEventsToLives();
    lifeManager.validateLives();

    setPlayerLives(lifeManager.playerLives);
  }, [
    JSON.stringify(kills),
    JSON.stringify(heroSpawns),
    JSON.stringify(heroSwaps),
    JSON.stringify(mercyResurrects),
    JSON.stringify(roundEnd),
  ]);

  console.log('playerLives', playerLives);
  return playerLives;
};

const usePlayerLives = () => {
  const {mapId} = useMapContext();
  const {playerName} = usePlayerContext();
  return usePlayerLivesBase({mapId, playerName});
};

export default usePlayerLives;
