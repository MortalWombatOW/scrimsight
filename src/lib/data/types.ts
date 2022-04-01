import {keys} from 'ts-transformer-keys';

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

// const generateDbSchema = (name: string): ObjectStoreMeta => {
//   const fields = types[name];
//   return {
//     store: name,
//     storeConfig: {keyPath: 'id', autoIncrement: true},
//     storeSchema: [
//       {name: 'id', keypath: 'id', options: {unique: true}},
//       ...fields.map((field) => ({
//         name: field,
//         keypath: field,
//         options: {unique: false},
//       })),
//     ],
//   };
// };

// const generateAllDbSchemas = (): ObjectStoreMeta[] => {
//   return Object.keys(types).map((name) => generateDbSchema(name));
// };

type FileUploadMessage = {
  file: File;
};

type LoadedFileMessage = {
  fileName: string;
  lastModified: number;
  data: string;
};

type ParsedFileMessage = {
  fileName: string;
  timestamp: number;
  mapId: number;
  map?: OWMap;
  playerStatus?: PlayerStatus[];
  playerAbilities?: PlayerAbility[];
  playerInteractions?: PlayerInteraction[];
};

type SuccessMessage = {
  fileName: string;
};

type ErrorMessage = {
  fileName: string;
  error: string;
};

type GlobalState = {
  filesToUpload: FileUploadMessage[];
  loadedFiles: LoadedFileMessage[];
  parsedFiles: ParsedFileMessage[];
  uploadSuccesses: SuccessMessage[];
  uploadErrors: ErrorMessage[];
};

type UploadStage = 'loading' | 'parsing' | 'saving' | 'success' | 'error';
type FileStatus = {
  fileName: string;
  stage: UploadStage;
  failedStage?: UploadStage;
};

type Column = {
  name: string;
  type: string;
};

type Aggregation = {
  by: string[];
  col: string;
  method: string; //'sum' | 'avg' | 'count';
  newName?: string;
};

type Dataset = {
  columns: Column[];
  rows: any[];
};

type Extractor = (
  maps: OWMap[],
  status: PlayerStatus[],
  abilities: PlayerAbility[],
  interactions: PlayerInteraction[],
) => Dataset;

type Transform = (dataset: Dataset) => Dataset;

interface SimpleMetric {
  displayName: string;
  extractor: Extractor;
  transforms: Transform[];
  columns: Column[];
}

type Metric = SimpleMetric;

interface TeamInfo {
  name: string;
  tanks: string[];
  dps: string[];
  supports: string[];
}

interface Statistic {
  [key: string]: number;
}

interface ColorInternal {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface MapEntity {
  id: string;
  // label?: string;
  clazz?: string;
  image?: string;
  states: RenderState;
  entityType:
    | 'player'
    | 'damage'
    | 'healing'
    | 'final blow'
    | 'elimination'
    | 'ability';
}

type RenderState = {
  [timestamp: string]: {
    [key: string]: string | number;
  };
};

export {
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  types,
  TableDefinition,
  WithId,
  GlobalState,
  FileUploadMessage,
  LoadedFileMessage,
  ParsedFileMessage,
  SuccessMessage,
  ErrorMessage,
  FileStatus,
  UploadStage,
  Column,
  Dataset,
  Extractor,
  Transform,
  SimpleMetric,
  Metric,
  Aggregation,
  TeamInfo,
  Statistic,
  ColorInternal,
  MapEntity,
  RenderState,
};
