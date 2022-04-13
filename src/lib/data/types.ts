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

type FileUpload = {
  fileName: string;
  file?: File;
  data?: string;
  map?: OWMap;
  playerStatus?: PlayerStatus[];
  playerAbilities?: PlayerAbility[];
  playerInteractions?: PlayerInteraction[];
  error?: string;
  done?: boolean;
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

// interface SimpleMetric {
//   displayName: string;
//   extractor: Extractor;
//   transforms: Transform[];
//   columns: Column[];
// }

// type Metric = SimpleMetric;

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

type MetricType = 'sum' | 'count' | 'average';
type MetricValue =
  | 'health'
  | 'ult charge'
  | 'damage'
  | 'damage taken'
  | 'healing'
  | 'healing taken'
  | 'final blows'
  | 'deaths'
  | 'elimination'
  | 'damage/healing';
type MetricGroup = 'player' | 'team' | 'time';
type Metric = {
  type: MetricType;
  value: MetricValue;
  groups: MetricGroup[];
};
type ComplexMetricType = 'ratio' | 'stack';
type ComplexMetric = {
  type: ComplexMetricType;
  value1: MetricValue;
  value2: MetricValue;
};

type MetricRow = {
  value: number;
  groups: {
    [key: string]: string;
  };
};
type MetricData =
  | Statistic
  | {
      [key: string]: MetricData;
    };

export {
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  types,
  TableDefinition,
  WithId,
  FileUpload,
  Column,
  Dataset,
  Extractor,
  Transform,
  Metric,
  Aggregation,
  TeamInfo,
  Statistic,
  ColorInternal,
  MapEntity,
  RenderState,
  MetricType,
  MetricValue,
  MetricGroup,
  MetricData,
  MetricRow,
};
