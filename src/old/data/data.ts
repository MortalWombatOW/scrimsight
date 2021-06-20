import log from "../logger";

export interface DataFormat {}

export interface DataValue<T> extends DataFormat {
  value: T;
}

export interface DataMultiValue<T> extends DataFormat {
  values: Array<T>;
}

export class DataNode {
    private path: string;
    private requiredPaths: Array<string>;
    private extractor: (info: MapInfo) => DataFormat;

    constructor(path: string, requiredPaths: Array<string>, extractor: (info: MapInfo) => any) {
      this.path = path;
      this.requiredPaths = requiredPaths;
      this.extractor = extractor;
    }

    static hasPath(info: MapInfo, path: string) {
      const steps = path.split('.');
      let ptr = info;
      for (const step of steps) {
        if (!ptr.hasOwnProperty(step)) {
          return false;
        }
      }
      return true;
    }

    getPath(): string {
      return this.path;
    }

    isLoaded(info: MapInfo) {
      return DataNode.hasPath(info, this.getPath());
    }

    canLoad(info: MapInfo): boolean {
      return this.requiredPaths.map(path => DataNode.hasPath(info, path)).reduce((a, b) => a && b);
    }

    load(info: MapInfo) {
      const key = this.getPath().split('.').slice(-1)[0];
      this.getParentNode(info)[key] = this.extractor(info);
    }

    getParentNode(info: MapInfo) {
      let ptr: any = info;
      for (const step of this.path.split('.').slice(0, -1)) {
        if (!ptr.hasOwnProperty(step)) {
          throw new Error(`${this.getPath()} not readable on ${info}: ${step} not found`);
        }
          ptr = ptr[step];
      }
      return ptr;
    }
    
    read(info: MapInfo){
      let ptr: any = info;
      for (const step of this.path.split('.')) {
        if (!ptr.hasOwnProperty(step)) {
          throw new Error(`${this.getPath()} not readable on ${info}: ${step} not found`);
        }
          ptr = ptr[step];
      }
      return ptr;
    }
}

declare enum OverwatchMap {
  KINGS_ROW,
  NUMBANI,
}


export interface GameEvent {
  timestamp: number;
  eventType: string;
  player: string;
  value1: string;
  value2: string;
}

export interface PlayerMetric {}

export interface MapInfo {
  timestamp: DataValue<number>;
  // Level 0: raw log
  log: DataValue<string>;
  hash: DataValue<number>;
  // Level 1
  events?: DataMultiValue<GameEvent>;
  // Level 2
  team1_players?: DataMultiValue<string>;
  team2_players?: DataMultiValue<string>;
  player_metrics?: DataMultiValue<PlayerMetric>;

  // Metadata
  map?: DataValue<OverwatchMap>;
  team1_name?: DataValue<string>;
  team2_name?: DataValue<string>;
  duration?: DataValue<number>;
}

const dataNodes: Array<DataNode> = [
  new DataNode('events', ['log'], info => {
    // log(info);
    return {value: info.log.value.length};
  }),
  new DataNode('ffff', ['log'], info => {value: info.log.value.split('\n').length}),
];

export function canLoadNode(info: MapInfo, path: string) {
  return dataNodes.filter(node => node.getPath() == path && node.canLoad(info)).length > 0;
}

export function loadNode(info: MapInfo, path: string) {
  return dataNodes.filter(node => node.getPath() == path && node.canLoad(info)).map(node => node.load(info));
}

export function loadAllNodes(info: MapInfo): void {
  for (let node of dataNodes) {
    if (node.canLoad(info) && !node.isLoaded(info)) {
      log(node.getPath())
      node.load(info);
    }
  }
}