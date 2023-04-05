import { DataAndSpecName, DataRow } from './logging/spec';

type FileUpload = {
  fileName: string;
  file?: File;
  data?: string;
  mapId?: number;
  events: DataAndSpecName[];
  error?: string;
  done?: boolean;
};

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

interface ColorInternalHSL {
  h: number;
  s: number;
  l: number;
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
  // metric: Metric; TODO change to query?
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

type Report = {
  title: string;
  controls: ReportControl[];
  // metricGroups: ReportMetricGroup[]; TODO
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


type Query = {
  name: string;
  query: string;
  deps?: (string | DataRow[])[];
};

type Team = {
  name: string;
  players: string[];
  notes?: string;
  id?: number;
};

export {
  FileUpload,
  TeamInfo,
  Statistic,
  ColorInternal,
  ColorInternalHSL,
  MapEntity,
  RenderState,
  Report,
  ReportComponent,
  ReportControl,
  ReportComponentType,
  ReportControlType,
  ReportComponentStyle,
  GameStateTimeSlice,
  GameStateExtractor,
  Query,
  Team,
};
