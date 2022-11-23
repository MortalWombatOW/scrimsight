import {debug} from 'webpack';

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

// const types = {
//   map: keys<OWMap>(),
//   player_status: keys<PlayerStatus>(),
//   player_ability: keys<PlayerAbility>(),
//   player_interaction: keys<PlayerInteraction>(),
// };

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

enum MetricType {
  sum,
  count,
  average,
}

enum MetricValue {
  health,
  timeToUlt,
  timeWithUlt,
  damage,
  damageTaken,
  healing,
  healingTaken,
  finalBlows,
  deaths,
  eliminations,
  ultsUsed,
  mapCount,
  topHero,
  damagePer10m,
  healingPer10m,
  deathsPer10m,
  eliminationsPer10m,
  finalBlowsPer10m,
  finalBlowsPerLife,
  timePlayed,
  fileTime,
}

enum MetricGroup {
  player,
  team,
  time,
  map,
  teamfight,
}

type Metric = {
  values: MetricValue[];
  groups: MetricGroup[];
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

enum ReportComponentType {
  default,
  debug,
  table,
  map,
  timeChart,
  barChart,
  embed,
  matrix,
}

enum ReportComponentStyle {
  default,
  emphasized,
  topLine,
}

type ReportComponent = {
  type: ReportComponentType;
  metric: Metric;
  style: ReportComponentStyle;
};

type ReportControl = {
  type: ReportControlType;
};

enum ReportControlType {
  metric,
  map,
  player,
}

type ReportMetricGroup = {
  metric: Metric;
  components: ReportComponent[];
};

type Report = {
  title: string;
  controls: ReportControl[];
  metricGroups: ReportMetricGroup[];
};

type PackedReport = (string | number)[];

type BaseData = {
  maps: OWMap[];
  statuses: PlayerStatus[];
  abilities: PlayerAbility[];
  interactions: PlayerInteraction[];
};

type GameStateTimeSlice = {
  mapId: number;
  timestamp: number;
  players: {
    name: string;
    x: number;
    y: number;
    z: number;
    hero: string;
    health: number;
    ultCharge: number;
    abilityies: string[];
  }[];
  interactions: {
    player: string;
    target: string;
    healing: number;
    damage: number;
    finalBlow: boolean;
    elimination: boolean;
  }[];
};

type GameStateExtractor = (slice: GameStateTimeSlice) => {
  [key: string]: number;
};

type MetricComponent = ({data}: {data: MetricData}) => JSX.Element;

export {
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  // types,
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
  Report,
  BaseData,
  ReportComponent,
  ReportControl,
  ReportComponentType,
  PackedReport,
  MetricComponent,
  ReportMetricGroup,
  ReportControlType,
  ReportComponentStyle,
  GameStateTimeSlice,
  GameStateExtractor,
};
