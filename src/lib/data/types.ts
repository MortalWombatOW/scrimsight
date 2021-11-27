import {keys} from 'ts-transformer-keys';
import {ObjectStoreMeta} from 'react-indexed-db';

// identifies each map
type OWMap = {
  mapId: number;
  fileName: string;
  mapName: string;
  timestamp: number;
  team1Name: string;
  team2Name: string;
  team1: string[];
  team2: string[];
  roles: {[key: string]: string};
};

type GameEvent = {
  mapId: number;
  timestamp: number;
};

type PlayerStatus = GameEvent & {
  player: string;
  hero: string;
  x: number;
  y: number;
  z: number;
  health: number;
  ultCharge: number;
};

type PlayerAbility = GameEvent & {
  player: string;
  type: string;
};

type PlayerInteraction = GameEvent & {
  player: string;
  target: string;
  type: string;
  amount: number;
};

type TableDefinition = OWMap | PlayerStatus | PlayerAbility | PlayerInteraction;

type WithId<T> = T & {id: number};

const types = {
  map: keys<OWMap>(),
  player_status: keys<PlayerStatus>(),
  player_ability: keys<PlayerAbility>(),
  player_interaction: keys<PlayerInteraction>(),
};

const generateDbSchema = (name: string): ObjectStoreMeta => {
  const fields = types[name];
  return {
    store: name,
    storeConfig: {keyPath: 'id', autoIncrement: true},
    storeSchema: [
      {name: 'id', keypath: 'id', options: {unique: true}},
      ...fields.map((field) => ({
        name: field,
        keypath: field,
        options: {unique: false},
      })),
    ],
  };
};

const generateAllDbSchemas = (): ObjectStoreMeta[] => {
  return Object.keys(types).map((name) => generateDbSchema(name));
};

export {
  generateAllDbSchemas,
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  types,
  TableDefinition,
  WithId,
};
