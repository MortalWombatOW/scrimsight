import {isNumeric} from '../string';
import {keys} from 'ts-transformer-keys';
import {OWMap, PlayerStatus, PlayerAbility, PlayerInteraction} from './types';
import {stringHash} from './../string';

type Value = number | string;

type Row = Value[];

type Data = Row[];

type GroupedData = {
  [key: string]: Data;
};

type PlayerStatusEvent = {
  timestamp: number;
  player: string;
  hero: string;
  position: string;
};

type PlayerHealth = {
  timestamp: number;
  player: string;
  health: number;
  maxHealth: number;
};

type PlayerUlt = {
  timestamp: number;
  player: string;
  ultPercent: number;
};

type UsedAbility = {
  timestamp: number;
  ability: string;
  player: string;
  hero: string;
};

type DamageDealt = {
  timestamp: number;
  player: string;
  damage: number;
  target: string;
};

type DidHealing = {
  timestamp: number;
  player: string;
  target: string;
  healing: number;
};

type DidElim = {
  timestamp: number;
  player: string;
  damage: number;
  target: string;
};

type DidFinalBlow = {
  timestamp: number;
  player: string;
  damage: number;
  target: string;
};

type PlayerTeam = {
  timestamp: number;
  player: string;
  team: string;
};

type MapEvent = {
  timestamp: number;
  map: string;
};

type RawEvent =
  | PlayerStatusEvent
  | PlayerHealth
  | PlayerUlt
  | UsedAbility
  | DamageDealt
  | DidHealing
  | DidElim
  | DidFinalBlow
  | PlayerTeam
  | MapEvent;

const eventFields = {
  player_status: keys<PlayerStatusEvent>(),
  player_health: keys<PlayerHealth>(),
  player_ult: keys<PlayerUlt>(),
  used_ability_1: keys<UsedAbility>(),
  used_ability_2: keys<UsedAbility>(),
  damage_dealt: keys<DamageDealt>(),
  did_healing: keys<DidHealing>(),
  did_elim: keys<DidElim>(),
  did_final_blow: keys<DidFinalBlow>(),
  player_team: keys<PlayerTeam>(),
  map_event: keys<MapEvent>(),
};

// const tableTypes: {
//   [key: string]: string[];
// } = {
//   map: ['map', 'player_team'],
//   player_status: ['player_status', 'player_health', 'player_ult'],
//   player_ability: ['used_ultimate', 'used_ability_1', 'used_ability_2'],
//   player_interaction: [
//     'damage_dealt',
//     'did_healing',
//     'did_elim',
//     'did_final_blow',
//   ],
// };

// inverse of tableTypes
const tableForEvent = {
  map: 'map',
  player_team: 'map',
  player_status: 'player_status',
  player_health: 'player_status',
  player_ult: 'player_status',
  used_ultimate: 'player_ability',
  used_ability_1: 'player_ability',
  used_ability_2: 'player_ability',
  damage_dealt: 'player_interaction',
  did_healing: 'player_interaction',
  did_elim: 'player_interaction',
  did_final_blow: 'player_interaction',
};

const parseTimestamp = (str: string) => {
  return str
    .trim()
    .slice(1, -1)
    .split(':')
    .map((x: string, i: number) => 60 ** (2 - i) * parseInt(x, 10))
    .reduce((a: number, b: number) => a + b);
};

const parseRow = (row: string) => {
  const [rawTimestamp, ...rawData] = row.split(';');
  const timestamp = parseTimestamp(rawTimestamp);

  const convertedData = rawData.map((x: string) =>
    isNumeric(x) ? parseFloat(x) : x,
  );
  return [timestamp, ...convertedData];
};

const parseFile = (file: string): Data => {
  const rows = file.split('\n');

  const data = rows.map(parseRow);

  return data;
};

const groupByTable = (data: Data): GroupedData => {
  const groupedData: GroupedData = {};
  data.forEach((row: Row) => {
    const [timestamp, eventType] = row;
    const table: string = tableForEvent[eventType];
    if (groupedData[table] === undefined) {
      groupedData[table] = [];
    }
    groupedData[table].push(row);
  });

  return groupedData;
};

const groupByIndex = (data: Data, index: number): GroupedData => {
  const groupedData: GroupedData = {};
  data.forEach((row: Row) => {
    const key = row[index];
    if (groupedData[key] === undefined) {
      groupedData[key] = [];
    }
    groupedData[key].push(row);
  });

  return groupedData;
};

const getRolesFromPlayerStatusData = (data: Data): {[key: string]: string} => {
  const roles: {[key: string]: string} = {};

  const heroToRole = {
    'D.Va': 'tank',
    Orisa: 'tank',
    Reinhardt: 'tank',
    Roadhog: 'tank',
    Winston: 'tank',
    Sigma: 'tank',
    'Wrecking Ball': 'tank',
    Zarya: 'tank',
    Ashe: 'damage',
    Bastion: 'damage',
    Cassidy: 'damage',
    McCree: 'damage',
    Doomfist: 'damage',
    Echo: 'damage',
    Genji: 'damage',
    Hanzo: 'damage',
    Junkrat: 'damage',
    Mei: 'damage',
    Pharah: 'damage',
    Reaper: 'damage',
    'Soldier: 76': 'damage',
    Sombra: 'damage',
    Symmetra: 'damage',
    Torbjörn: 'damage',
    Tracer: 'damage',
    Widowmaker: 'damage',
    Ana: 'support',
    Baptiste: 'support',
    Brigitte: 'support',
    Lúcio: 'support',
    Mercy: 'support',
    Moira: 'support',
    Zenyatta: 'support',
  };
  data.forEach((row: Row) => {
    const [timestamp, event_type, player, hero, position] = row;
    if (roles[player] === undefined) {
      roles[player] = heroToRole[hero];
    }
  });

  return roles;
};

const addMapEvents = (
  mapId: number,
  fileName: string,
  timestamp: number,
  mapData: Data,
  playerStatusData: Data,
  addToMapTable: (map: OWMap) => Promise<number>,
): Promise<number[]> => {
  const map: Partial<OWMap> = {
    mapId,
    fileName,
    timestamp,
    team1: [],
    team2: [],
    roles: getRolesFromPlayerStatusData(
      playerStatusData.filter((row) => row[1] === 'player_status'),
    ),
  };
  const teamAssignment = {};
  if (mapData === undefined) {
    debugger;
  }
  mapData.forEach((row: Row) => {
    const [timestamp, eventType, ...rest] = row;
    if (eventType === 'map') {
      map.mapName = rest[0] as string;
    }
    if (eventType === 'player_team') {
      const [player, team] = rest;
      if (map.team1Name === undefined) {
        map.team1Name = team as string;
        teamAssignment[team as string] = 'team1';
      } else if (map.team2Name === undefined && team !== map.team1Name) {
        map.team2Name = team as string;
        teamAssignment[team as string] = 'team2';
      }
      map[teamAssignment[team as string]].push(player as string);
    }
  });

  return Promise.all([addToMapTable(map as OWMap)]);
};

const addPlayerStatusEvents = (
  mapId: number,
  data: Data,
  addToPlayerStatusTable: (status: PlayerStatus) => Promise<number>,
): Promise<number[]> => {
  const promises = [];
  const groupByPlayer = groupByIndex(data, 2);
  Object.keys(groupByPlayer).forEach((player: string) => {
    const groupByTimestamp = groupByIndex(groupByPlayer[player], 0);
    Object.keys(groupByTimestamp).forEach((timestamp: string) => {
      const playerEventsAtTimestamp = groupByTimestamp[timestamp];
      const status: Partial<PlayerStatus> = {
        mapId,
        timestamp: parseInt(timestamp, 10),
        player,
      };
      playerEventsAtTimestamp.forEach((event: Row) => {
        const [, eventType, , ...rest] = event;
        if (eventType === 'player_status') {
          status.hero = rest[0] as string;
          if (rest[1] === 0) {
            // sometimes happens at end of games, players don't have a position
            return;
          }
          const [x, y, z] = (rest[1] as string)
            .slice(1, -1)
            .split(',')
            .map((x) => parseFloat(x));
          status.x = x;
          status.y = y;
          status.z = z;
        }
        if (eventType === 'player_health') {
          status.health = rest[0] as number;
        }
        if (eventType === 'player_ult') {
          status.ultCharge = rest[0] as number;
        }
      });
      promises.push(addToPlayerStatusTable(status as PlayerStatus));
    });
  });

  return Promise.all(promises);
};

const addPlayerAbilityEvents = (
  mapId: number,
  data: Data,
  addToPlayerAbilityTable: (ability: PlayerAbility) => Promise<number>,
): Promise<number[]> => {
  const promises = [];
  const abilityMap = {
    used_ultimate: 'ultimate',
    used_ability_1: 'primary',
    used_ability_2: 'secondary',
  };
  data.forEach((row: Row) => {
    const [timestamp, eventType, player, ...rest] = row;
    promises.push(
      addToPlayerAbilityTable({
        mapId,
        timestamp: timestamp as number,
        player: player as string,
        type: abilityMap[eventType],
      }),
    );
  });

  return Promise.all(promises);
};

const addPlayerInteractionEvents = (
  mapId: number,
  data: Data,
  addToPlayerInteractionTable: (
    interaction: PlayerInteraction,
  ) => Promise<number>,
): Promise<number[]> => {
  const promises = [];
  const interactionMap = {
    damage_dealt: 'damage',
    did_healing: 'healing',
    did_elim: 'elimination',
    did_final_blow: 'final blow',
  };
  data.forEach((row: Row) => {
    const [timestamp, eventType, player, amount, target] = row;
    promises.push(
      addToPlayerInteractionTable({
        mapId,
        timestamp: timestamp as number,
        player: player as string,
        type: interactionMap[eventType],
        amount: amount as number,
        target: target as string,
      }),
    );
  });

  return Promise.all(promises);
};

const validateEventsByTable = (data: GroupedData): boolean => {
  const tables = Object.keys(data);
  if (!tables.includes('map')) {
    console.log('missing map table');
    return false;
  }
  if (!tables.includes('player_status')) {
    console.log('missing player_status table');
    return false;
  }
  if (!tables.includes('player_ability')) {
    console.log('missing player_ability table');
    return false;
  }
  if (!tables.includes('player_interaction')) {
    console.log('missing player_interaction table');
    return false;
  }
  return true;
};

const uploadFile = async (
  file: string,
  fileName: string,
  lastModified: number,
  // addToMapTable: (map: OWMap) => Promise<number>,
  // addToPlayerStatusTable: (status: PlayerStatus) => Promise<number>,
  // addToPlayerAbilityTable: (status: PlayerAbility) => Promise<number>,
  // addToPlayerInteractionTable: (status: PlayerInteraction) => Promise<number>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // getMapByIndex: (index: string, key: any) => Promise<OWMap>,
) => {
  updateFileProgress(0);
  const existingMap = await getMapByIndex('mapId', mapId);
  if (existingMap !== undefined) {
    updateFileProgress(-1);
    console.log(`Map ${mapId} already exists`);
    return;
  }

  const data = parseFile(file);
  const eventsByTable = groupByTable(data);

  if (!validateEventsByTable(eventsByTable)) {
    updateFileProgress(-1);
    return;
  }

  await addMapEvents(
    mapId,
    fileName,
    lastModified,
    eventsByTable.map,
    eventsByTable.player_status,
    addToMapTable,
  );
  updateFileProgress(25);
  await addPlayerStatusEvents(
    mapId,
    eventsByTable.player_status,
    addToPlayerStatusTable,
  );
  updateFileProgress(50);
  await addPlayerAbilityEvents(
    mapId,
    eventsByTable.player_ability,
    addToPlayerAbilityTable,
  );
  updateFileProgress(75);
  await addPlayerInteractionEvents(
    mapId,
    eventsByTable.player_interaction,
    addToPlayerInteractionTable,
  );
  updateFileProgress(100);
};

export default uploadFile;
