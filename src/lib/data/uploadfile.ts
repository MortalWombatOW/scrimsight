import {isNumeric} from '../string';
// import {keys} from 'ts-transformer-keys';
import {
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  FileUpload,
} from 'lib/data/types';
import {stringHash} from './../string';
import {getRoleFromHero} from './data';
import {getDB, mapExists} from './database';
import batch from 'idb-batch';

type Value = number | string;

type Row = Value[];

type Data = Row[];

type GroupedData = {
  [key: string]: Data;
};

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

const parseFileContents = (file: string): Data => {
  const rows = file.split('\n');

  const data = rows.map(parseRow);

  return data;
};

const groupByTable = (data: Data): GroupedData => {
  const groupedData: GroupedData = {};
  data.forEach((row: Row) => {
    const [, eventType] = row;
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

  data.forEach((row: Row) => {
    const [, , player, hero] = row;
    if (roles[player] === undefined) {
      roles[player] = getRoleFromHero(hero as string);
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
): OWMap => {
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
    const [, eventType, ...rest] = row;
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

  return map as OWMap;
};

const addPlayerStatusEvents = (mapId: number, data: Data): PlayerStatus[] => {
  const playerStatus: PlayerStatus[] = [];
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
      playerStatus.push(status as PlayerStatus);
    });
  });

  return playerStatus;
};

const addPlayerAbilityEvents = (mapId: number, data: Data): PlayerAbility[] => {
  const playerAbility: PlayerAbility[] = [];
  const abilityMap = {
    used_ultimate: 'ultimate',
    used_ability_1: 'primary',
    used_ability_2: 'secondary',
  };
  data.forEach((row: Row) => {
    const [timestamp, eventType, player] = row;
    playerAbility.push({
      mapId,
      timestamp: timestamp as number,
      player: player as string,
      type: abilityMap[eventType],
    });
  });

  return playerAbility;
};

const addPlayerInteractionEvents = (
  mapId: number,
  data: Data,
): PlayerInteraction[] => {
  const playerInteraction: PlayerInteraction[] = [];
  const interactionMap = {
    damage_dealt: 'damage',
    did_healing: 'healing',
    did_elim: 'elimination',
    did_final_blow: 'final blow',
  };
  data.forEach((row: Row) => {
    const [timestamp, eventType, player, amount, target] = row;
    playerInteraction.push({
      mapId,
      timestamp: timestamp as number,
      player: player as string,
      type: interactionMap[eventType],
      amount: amount as number,
      target: target as string,
    });
  });

  return playerInteraction;
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

const parseFile = async (fileUpload: FileUpload): Promise<FileUpload> => {
  if (!fileUpload.data || !fileUpload.file) {
    console.error('no data');
    return fileUpload;
  }

  const mapId = stringHash(fileUpload.data);
  // const existingMap = await getMapByIndex('mapId', mapId);
  // if (existingMap !== undefined) {
  //   return {
  //     fileName: fileUpload.fileName,
  //     error: `map with id ${mapId} already exists`,
  //   };
  // }

  const data = parseFileContents(fileUpload.data);
  const eventsByTable = groupByTable(data);

  if (!validateEventsByTable(eventsByTable)) {
    fileUpload.error = 'invalid file';
    return fileUpload;
  }

  const map = addMapEvents(
    mapId,
    fileUpload.fileName,
    fileUpload.file.lastModified,
    eventsByTable.map,
    eventsByTable.player_status,
  );

  const playerStatus = addPlayerStatusEvents(
    mapId,
    eventsByTable.player_status,
  );
  const playerAbilities = addPlayerAbilityEvents(
    mapId,
    eventsByTable.player_ability,
  );
  const playerInteractions = addPlayerInteractionEvents(
    mapId,
    eventsByTable.player_interaction,
  );

  fileUpload.map = map;
  fileUpload.playerStatus = playerStatus;
  fileUpload.playerAbilities = playerAbilities;
  fileUpload.playerInteractions = playerInteractions;

  return fileUpload;
};

const loadFile = async (fileUpload: FileUpload) => {
  if (!fileUpload.file) {
    fileUpload.error = 'no file';
    return fileUpload;
  }

  try {
    const data = (await readFileAsync(fileUpload.file)) as string;
    fileUpload.data = data;
  } catch (e) {
    fileUpload.error = 'error reading file';
    return fileUpload;
  }

  return fileUpload;
};

const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
};

const saveFile = async (
  fileUpload: FileUpload,
  setPercent: (number) => void,
) => {
  if (
    !fileUpload.map ||
    !fileUpload.playerStatus ||
    !fileUpload.playerAbilities ||
    !fileUpload.playerInteractions
  ) {
    console.error('no parsed data');
    return;
  }

  const exists = await mapExists(fileUpload.map?.mapId);
  if (exists) {
    console.error('map already exists');
    fileUpload.error = 'map already exists';
    setPercent(-1);
    return;
  }

  const db = getDB();

  await batch(db, 'map', [
    {
      type: 'add',
      value: fileUpload.map,
    },
  ]);
  setPercent(50);

  console.log('wrote map', fileUpload.fileName);
  await batch(
    db,
    'player_ability',
    fileUpload.playerAbilities.map((p) => ({
      type: 'add',
      value: p,
    })),
  );
  setPercent(65);
  console.log('wrote player abilities', fileUpload.fileName);
  await batch(
    db,
    'player_interaction',
    fileUpload.playerInteractions.map((p) => ({
      type: 'add',
      value: p,
    })),
  );
  setPercent(80);
  console.log('wrote player interactions', fileUpload.fileName);
  await batch(
    db,
    'player_status',
    fileUpload.playerStatus.map((p) => ({
      type: 'add',
      value: p,
    })),
  );
  console.log('wrote player status', fileUpload.fileName);
  setPercent(100);
};

const uploadFile = async (
  fileUpload: FileUpload,
  setPercent: (number) => void,
) => {
  setPercent(0);
  await loadFile(fileUpload);
  if (fileUpload.error) {
    setPercent(-1);
    return;
  }
  setPercent(10);
  await parseFile(fileUpload);
  if (fileUpload.error) {
    setPercent(-1);
    return;
  }
  setPercent(20);
  await saveFile(fileUpload, setPercent);
  console.log('uploaded file', fileUpload.fileName);
  fileUpload.done = true;
  // return fileUpload;
};

export {uploadFile};
