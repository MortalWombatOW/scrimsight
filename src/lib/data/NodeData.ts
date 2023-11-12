import {DataManager} from './DataManager';
import {
  DataNodeName,
  FieldName,
  DataNode,
  ObjectStoreNode,
  TransformNode,
  JoinNode,
  BaseEvent,
  Ability1Used,
  Ability2Used,
  Damage,
  DefensiveAssist,
  DvaDemech,
  DvaRemech,
  EchoDuplicateEnd,
  EchoDuplicateStart,
  Healing,
  HeroSpawn,
  HeroSwap,
  Kill,
  MatchEnd,
  MatchStart,
  MercyRez,
  ObjectiveCaptured,
  OffensiveAssist,
  PayloadProgress,
  PlayerStat,
  PointProgress,
  RemechCharged,
  RoundEnd,
  RoundStart,
  SetupComplete,
  UltimateCharged,
  UltimateEnd,
  UltimateStart,
  WriteNode,
  AlaSQLNode,
} from './types';

const maps_object_store: ObjectStoreNode<any> = {
  name: 'maps_object_store',
  state: 'pending',
  objectStore: 'maps',
};

const match_start_object_store: ObjectStoreNode<MatchStart> = {
  name: 'match_start_object_store',
  state: 'pending',
  objectStore: 'match_start',
};

const match_end_object_store: ObjectStoreNode<MatchEnd> = {
  name: 'match_end_object_store',
  state: 'pending',
  objectStore: 'match_end',
};

const round_start_object_store: ObjectStoreNode<RoundStart> = {
  name: 'round_start_object_store',
  state: 'pending',
  objectStore: 'round_start',
};

const round_end_object_store: ObjectStoreNode<RoundEnd> = {
  name: 'round_end_object_store',
  state: 'pending',
  objectStore: 'round_end',
};

const setup_complete_object_store: ObjectStoreNode<SetupComplete> = {
  name: 'setup_complete_object_store',
  state: 'pending',
  objectStore: 'setup_complete',
};

const objective_captured_object_store: ObjectStoreNode<ObjectiveCaptured> = {
  name: 'objective_captured_object_store',
  state: 'pending',
  objectStore: 'objective_captured',
};

const point_progress_object_store: ObjectStoreNode<PointProgress> = {
  name: 'point_progress_object_store',
  state: 'pending',
  objectStore: 'point_progress',
};

const payload_progress_object_store: ObjectStoreNode<PayloadProgress> = {
  name: 'payload_progress_object_store',
  state: 'pending',
  objectStore: 'payload_progress',
};

const hero_spawn_object_store: ObjectStoreNode<HeroSpawn> = {
  name: 'hero_spawn_object_store',
  state: 'pending',
  objectStore: 'hero_spawn',
};

const hero_swap_object_store: ObjectStoreNode<HeroSwap> = {
  name: 'hero_swap_object_store',
  state: 'pending',
  objectStore: 'hero_swap',
};

const ability_1_used_object_store: ObjectStoreNode<Ability1Used> = {
  name: 'ability_1_used_object_store',
  state: 'pending',
  objectStore: 'ability_1_used',
};

const ability_2_used_object_store: ObjectStoreNode<Ability2Used> = {
  name: 'ability_2_used_object_store',
  state: 'pending',
  objectStore: 'ability_2_used',
};

const offensive_assist_object_store: ObjectStoreNode<OffensiveAssist> = {
  name: 'offensive_assist_object_store',
  state: 'pending',
  objectStore: 'offensive_assist',
};

const defensive_assist_object_store: ObjectStoreNode<DefensiveAssist> = {
  name: 'defensive_assist_object_store',
  state: 'pending',
  objectStore: 'defensive_assist',
};

const ultimate_charged_object_store: ObjectStoreNode<UltimateCharged> = {
  name: 'ultimate_charged_object_store',
  state: 'pending',
  objectStore: 'ultimate_charged',
};

const ultimate_start_object_store: ObjectStoreNode<UltimateStart> = {
  name: 'ultimate_start_object_store',
  state: 'pending',
  objectStore: 'ultimate_start',
};

const ultimate_end_object_store: ObjectStoreNode<UltimateEnd> = {
  name: 'ultimate_end_object_store',
  state: 'pending',
  objectStore: 'ultimate_end',
};

const kill_object_store: ObjectStoreNode<Kill> = {
  name: 'kill_object_store',
  state: 'pending',
  objectStore: 'kill',
};

const damage_object_store: ObjectStoreNode<Damage> = {
  name: 'damage_object_store',
  state: 'pending',
  objectStore: 'damage',
};

const healing_object_store: ObjectStoreNode<Healing> = {
  name: 'healing_object_store',
  state: 'pending',
  objectStore: 'healing',
};

const mercy_rez_object_store: ObjectStoreNode<MercyRez> = {
  name: 'mercy_rez_object_store',
  state: 'pending',
  objectStore: 'mercy_rez',
};

const echo_duplicate_start_object_store: ObjectStoreNode<EchoDuplicateStart> = {
  name: 'echo_duplicate_start_object_store',
  state: 'pending',
  objectStore: 'echo_duplicate_start',
};

const echo_duplicate_end_object_store: ObjectStoreNode<EchoDuplicateEnd> = {
  name: 'echo_duplicate_end_object_store',
  state: 'pending',
  objectStore: 'echo_duplicate_end',
};

const dva_demech_object_store: ObjectStoreNode<DvaDemech> = {
  name: 'dva_demech_object_store',
  state: 'pending',
  objectStore: 'dva_demech',
};

const dva_remech_object_store: ObjectStoreNode<DvaRemech> = {
  name: 'dva_remech_object_store',
  state: 'pending',
  objectStore: 'dva_remech',
};

const remech_charged_object_store: ObjectStoreNode<RemechCharged> = {
  name: 'remech_charged_object_store',
  state: 'pending',
  objectStore: 'remech_charged',
};

const player_stat_object_store: ObjectStoreNode<PlayerStat> = {
  name: 'player_stat_object_store',
  state: 'pending',
  objectStore: 'player_stat',
};

const match_start_write_node: WriteNode<MatchStart> = {
  name: 'match_start_write_node',
  state: 'pending',
  outputObjectStore: 'match_start',
  data: [],
};

const match_end_write_node: WriteNode<MatchEnd> = {
  name: 'match_end_write_node',
  state: 'pending',
  outputObjectStore: 'match_end',
  data: [],
};

const round_start_write_node: WriteNode<RoundStart> = {
  name: 'round_start_write_node',
  state: 'pending',
  outputObjectStore: 'round_start',
  data: [],
};

const round_end_write_node: WriteNode<RoundEnd> = {
  name: 'round_end_write_node',
  state: 'pending',
  outputObjectStore: 'round_end',
  data: [],
};

const setup_complete_write_node: WriteNode<SetupComplete> = {
  name: 'setup_complete_write_node',
  state: 'pending',
  outputObjectStore: 'setup_complete',
  data: [],
};

const objective_captured_write_node: WriteNode<ObjectiveCaptured> = {
  name: 'objective_captured_write_node',
  state: 'pending',
  outputObjectStore: 'objective_captured',
  data: [],
};

const point_progress_write_node: WriteNode<PointProgress> = {
  name: 'point_progress_write_node',
  state: 'pending',
  outputObjectStore: 'point_progress',
  data: [],
};

const payload_progress_write_node: WriteNode<PayloadProgress> = {
  name: 'payload_progress_write_node',
  state: 'pending',
  outputObjectStore: 'payload_progress',
  data: [],
};

const hero_spawn_write_node: WriteNode<HeroSpawn> = {
  name: 'hero_spawn_write_node',
  state: 'pending',
  outputObjectStore: 'hero_spawn',
  data: [],
};

const hero_swap_write_node: WriteNode<HeroSwap> = {
  name: 'hero_swap_write_node',
  state: 'pending',
  outputObjectStore: 'hero_swap',
  data: [],
};

const ability_1_used_write_node: WriteNode<Ability1Used> = {
  name: 'ability_1_used_write_node',
  state: 'pending',
  outputObjectStore: 'ability_1_used',
  data: [],
};

const ability_2_used_write_node: WriteNode<Ability2Used> = {
  name: 'ability_2_used_write_node',
  state: 'pending',
  outputObjectStore: 'ability_2_used',
  data: [],
};

const offensive_assist_write_node: WriteNode<OffensiveAssist> = {
  name: 'offensive_assist_write_node',
  state: 'pending',
  outputObjectStore: 'offensive_assist',
  data: [],
};

const defensive_assist_write_node: WriteNode<DefensiveAssist> = {
  name: 'defensive_assist_write_node',
  state: 'pending',
  outputObjectStore: 'defensive_assist',
  data: [],
};

const ultimate_charged_write_node: WriteNode<UltimateCharged> = {
  name: 'ultimate_charged_write_node',
  state: 'pending',
  outputObjectStore: 'ultimate_charged',
  data: [],
};

const ultimate_start_write_node: WriteNode<UltimateStart> = {
  name: 'ultimate_start_write_node',
  state: 'pending',
  outputObjectStore: 'ultimate_start',
  data: [],
};

const ultimate_end_write_node: WriteNode<UltimateEnd> = {
  name: 'ultimate_end_write_node',
  state: 'pending',
  outputObjectStore: 'ultimate_end',
  data: [],
};

const kill_write_node: WriteNode<Kill> = {
  name: 'kill_write_node',
  state: 'pending',
  outputObjectStore: 'kill',
  data: [],
};

const damage_write_node: WriteNode<Damage> = {
  name: 'damage_write_node',
  state: 'pending',
  outputObjectStore: 'damage',
  data: [],
};

const healing_write_node: WriteNode<Healing> = {
  name: 'healing_write_node',
  state: 'pending',
  outputObjectStore: 'healing',
  data: [],
};

const mercy_rez_write_node: WriteNode<MercyRez> = {
  name: 'mercy_rez_write_node',
  state: 'pending',
  outputObjectStore: 'mercy_rez',
  data: [],
};

const echo_duplicate_start_write_node: WriteNode<EchoDuplicateStart> = {
  name: 'echo_duplicate_start_write_node',
  state: 'pending',
  outputObjectStore: 'echo_duplicate_start',
  data: [],
};

const echo_duplicate_end_write_node: WriteNode<EchoDuplicateEnd> = {
  name: 'echo_duplicate_end_write_node',
  state: 'pending',
  outputObjectStore: 'echo_duplicate_end',
  data: [],
};

const dva_demech_write_node: WriteNode<DvaDemech> = {
  name: 'dva_demech_write_node',
  state: 'pending',
  outputObjectStore: 'dva_demech',
  data: [],
};

const dva_remech_write_node: WriteNode<DvaRemech> = {
  name: 'dva_remech_write_node',
  state: 'pending',
  outputObjectStore: 'dva_remech',
  data: [],
};

const remech_charged_write_node: WriteNode<RemechCharged> = {
  name: 'remech_charged_write_node',
  state: 'pending',
  outputObjectStore: 'remech_charged',
  data: [],
};

const player_stat_write_node: WriteNode<PlayerStat> = {
  name: 'player_stat_write_node',
  state: 'pending',
  outputObjectStore: 'player_stat',
  data: [],
};

// Define a type for heroes played by each player
interface HeroesPlayed {
  playerName: string;
  playerTeam: string;
  heroes: Set<string>;
}

interface MapOverview {
  mapId: number;
  mapName: string;
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  team1Players: string[];
  team2Players: string[];
  rounds: {
    roundNumber: number;
    team1Score: number;
    team2Score: number;
  }[];
}
[];

const mapOverviewNode: AlaSQLNode<MapOverview> = {
  name: 'map_overview',
  state: 'pending',
  sql: `
      SELECT
          match_start.mapId,
          match_end.mapId,
          match_start.mapName,
          match_start.team1Name,
          match_start.team2Name,
          match_end.team1Score,
          match_end.team2Score,
          maps.name,
          maps.fileModified
      FROM ? as match_start JOIN ? as match_end 
      ON match_start.mapId = match_end.mapId 
      JOIN ? as maps ON match_start.mapId = maps.mapId
      `,
  sources: [
    'match_start_object_store',
    'match_end_object_store',
    'maps_object_store',
  ],
} as AlaSQLNode<MapOverview>;

interface PlayerTimePlayed {
  playerName: string;
  playerTeam: string;
  timePlayed: number;
}

const playerTimePlayedNode: AlaSQLNode<PlayerTimePlayed> = {
  name: 'player_time_played',
  state: 'pending',
  sql: `
      SELECT
          player_stat.playerName,
          player_stat.playerTeam,
          SUM(player_stat.timePlayed) as timePlayed
      FROM ? as player_stat
      GROUP BY player_stat.playerName, player_stat.playerTeam
      `,
  sources: ['player_stat_object_store'],
} as AlaSQLNode<PlayerTimePlayed>;

export default [
  maps_object_store,
  match_start_object_store,
  match_end_object_store,
  round_start_object_store,
  round_end_object_store,
  setup_complete_object_store,
  objective_captured_object_store,
  point_progress_object_store,
  payload_progress_object_store,
  hero_spawn_object_store,
  hero_swap_object_store,
  ability_1_used_object_store,
  ability_2_used_object_store,
  offensive_assist_object_store,
  defensive_assist_object_store,
  ultimate_charged_object_store,
  ultimate_start_object_store,
  ultimate_end_object_store,
  kill_object_store,
  damage_object_store,
  healing_object_store,
  mercy_rez_object_store,
  echo_duplicate_start_object_store,
  echo_duplicate_end_object_store,
  dva_demech_object_store,
  dva_remech_object_store,
  remech_charged_object_store,
  player_stat_object_store,
  match_start_write_node,
  match_end_write_node,
  round_start_write_node,
  round_end_write_node,
  setup_complete_write_node,
  objective_captured_write_node,
  point_progress_write_node,
  payload_progress_write_node,
  hero_spawn_write_node,
  hero_swap_write_node,
  ability_1_used_write_node,
  ability_2_used_write_node,
  offensive_assist_write_node,
  defensive_assist_write_node,
  ultimate_charged_write_node,
  ultimate_start_write_node,
  ultimate_end_write_node,
  kill_write_node,
  damage_write_node,
  healing_write_node,
  mercy_rez_write_node,
  echo_duplicate_start_write_node,
  echo_duplicate_end_write_node,
  dva_demech_write_node,
  dva_remech_write_node,
  remech_charged_write_node,
  player_stat_write_node,
  mapOverviewNode,
  playerTimePlayedNode,
];
