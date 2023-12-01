import {ObjectStoreNode, WriteNode, AlaSQLNode} from './DataTypes';

interface BaseEvent {
  mapId: number;
  type: string;
  matchTime: number;
}

export interface MatchStart extends BaseEvent {
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
}

export interface MatchEnd extends BaseEvent {
  roundNumber: number;
  team1Score: number;
  team2Score: number;
}

export interface RoundStart extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
}

export interface RoundEnd extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
  controlTeam1Progress: number;
  controlTeam2Progress: number;
  matchTimeRemaining: number;
}

export interface SetupComplete extends BaseEvent {
  roundNumber: number;
  matchTimeRemaining: number;
}

export interface ObjectiveCaptured extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  objectiveIndex: number;
  controlTeam1Progress: number;
  controlTeam2Progress: number;
  matchTimeRemaining: number;
}

export interface PointProgress extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  objectiveIndex: number;
  pointCaptureProgress: number;
}

export interface PayloadProgress extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  objectiveIndex: number;
  payloadCaptureProgress: number;
}

export interface HeroSpawn extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}

export interface HeroSwap extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}

export interface Ability1Used extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface Ability2Used extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface OffensiveAssist extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface DefensiveAssist extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface UltimateCharged extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface UltimateStart extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface UltimateEnd extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface Kill extends BaseEvent {
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}

export interface Damage extends BaseEvent {
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}

export interface Healing extends BaseEvent {
  healerTeam: string;
  healerName: string;
  healerHero: string;
  healeeTeam: string;
  healeeName: string;
  healeeHero: string;
  eventAbility: string;
  eventHealing: number;
  isHealthPack: boolean;
}

export interface MercyRez extends BaseEvent {
  mercyTeam: string;
  mercyName: string;
  revivedTeam: string;
  revivedName: string;
  revivedHero: string;
  eventAbility: string;
}

export interface EchoDuplicateStart extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface EchoDuplicateEnd extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}

export interface DvaDemech extends BaseEvent {
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}

export interface DvaRemech extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}

export interface RemechCharged extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface PlayerStat extends BaseEvent {
  roundNumber: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  eliminations: number;
  finalBlows: number;
  deaths: number;
  allDamageDealt: number;
  barrierDamageDealt: number;
  heroDamageDealt: number;
  healingDealt: number;
  healingReceived: number;
  selfHealing: number;
  damageTaken: number;
  damageBlocked: number;
  defensiveAssists: number;
  offensiveAssists: number;
  ultimatesEarned: number;
  ultimatesUsed: number;
  multikillBest: number;
  multikills: number;
  soloKills: number;
  objectiveKills: number;
  environmentalKills: number;
  environmentalDeaths: number;
  criticalHits: number;
  criticalHitAccuracy: number;
  scopedAccuracy: number;
  scopedCriticalHitAccuracy: number;
  scopedCriticalHitKills: number;
  shotsFired: number;
  shotsHit: number;
  shotsMissed: number;
  scopedShotsFired: number;
  scopedShotsHit: number;
  weaponAccuracy: number;
  heroTimePlayed: number;
}

const maps_object_store: ObjectStoreNode<any> = {
  name: 'maps_object_store',
  objectStore: 'maps',
};

const match_start_object_store: ObjectStoreNode<MatchStart> = {
  name: 'match_start_object_store',
  objectStore: 'match_start',
};

const match_end_object_store: ObjectStoreNode<MatchEnd> = {
  name: 'match_end_object_store',
  objectStore: 'match_end',
};

const round_start_object_store: ObjectStoreNode<RoundStart> = {
  name: 'round_start_object_store',
  objectStore: 'round_start',
};

const round_end_object_store: ObjectStoreNode<RoundEnd> = {
  name: 'round_end_object_store',
  objectStore: 'round_end',
};

const setup_complete_object_store: ObjectStoreNode<SetupComplete> = {
  name: 'setup_complete_object_store',
  objectStore: 'setup_complete',
};

const objective_captured_object_store: ObjectStoreNode<ObjectiveCaptured> = {
  name: 'objective_captured_object_store',
  objectStore: 'objective_captured',
};

const point_progress_object_store: ObjectStoreNode<PointProgress> = {
  name: 'point_progress_object_store',
  objectStore: 'point_progress',
};

const payload_progress_object_store: ObjectStoreNode<PayloadProgress> = {
  name: 'payload_progress_object_store',
  objectStore: 'payload_progress',
};

const hero_spawn_object_store: ObjectStoreNode<HeroSpawn> = {
  name: 'hero_spawn_object_store',
  objectStore: 'hero_spawn',
};

const hero_swap_object_store: ObjectStoreNode<HeroSwap> = {
  name: 'hero_swap_object_store',
  objectStore: 'hero_swap',
};

const ability_1_used_object_store: ObjectStoreNode<Ability1Used> = {
  name: 'ability_1_used_object_store',
  objectStore: 'ability_1_used',
};

const ability_2_used_object_store: ObjectStoreNode<Ability2Used> = {
  name: 'ability_2_used_object_store',
  objectStore: 'ability_2_used',
};

const offensive_assist_object_store: ObjectStoreNode<OffensiveAssist> = {
  name: 'offensive_assist_object_store',
  objectStore: 'offensive_assist',
};

const defensive_assist_object_store: ObjectStoreNode<DefensiveAssist> = {
  name: 'defensive_assist_object_store',
  objectStore: 'defensive_assist',
};

const ultimate_charged_object_store: ObjectStoreNode<UltimateCharged> = {
  name: 'ultimate_charged_object_store',
  objectStore: 'ultimate_charged',
};

const ultimate_start_object_store: ObjectStoreNode<UltimateStart> = {
  name: 'ultimate_start_object_store',
  objectStore: 'ultimate_start',
};

const ultimate_end_object_store: ObjectStoreNode<UltimateEnd> = {
  name: 'ultimate_end_object_store',
  objectStore: 'ultimate_end',
};

const kill_object_store: ObjectStoreNode<Kill> = {
  name: 'kill_object_store',
  objectStore: 'kill',
};

const damage_object_store: ObjectStoreNode<Damage> = {
  name: 'damage_object_store',
  objectStore: 'damage',
};

const healing_object_store: ObjectStoreNode<Healing> = {
  name: 'healing_object_store',
  objectStore: 'healing',
};

const mercy_rez_object_store: ObjectStoreNode<MercyRez> = {
  name: 'mercy_rez_object_store',
  objectStore: 'mercy_rez',
};

const echo_duplicate_start_object_store: ObjectStoreNode<EchoDuplicateStart> = {
  name: 'echo_duplicate_start_object_store',
  objectStore: 'echo_duplicate_start',
};

const echo_duplicate_end_object_store: ObjectStoreNode<EchoDuplicateEnd> = {
  name: 'echo_duplicate_end_object_store',
  objectStore: 'echo_duplicate_end',
};

const dva_demech_object_store: ObjectStoreNode<DvaDemech> = {
  name: 'dva_demech_object_store',
  objectStore: 'dva_demech',
};

const dva_remech_object_store: ObjectStoreNode<DvaRemech> = {
  name: 'dva_remech_object_store',
  objectStore: 'dva_remech',
};

const remech_charged_object_store: ObjectStoreNode<RemechCharged> = {
  name: 'remech_charged_object_store',
  objectStore: 'remech_charged',
};

const player_stat_object_store: ObjectStoreNode<PlayerStat> = {
  name: 'player_stat_object_store',
  objectStore: 'player_stat',
};

const match_start_write_node: WriteNode<MatchStart> = {
  name: 'match_start_write_node',
  outputObjectStore: 'match_start',
  data: [],
};

const match_end_write_node: WriteNode<MatchEnd> = {
  name: 'match_end_write_node',
  outputObjectStore: 'match_end',
  data: [],
};

const round_start_write_node: WriteNode<RoundStart> = {
  name: 'round_start_write_node',
  outputObjectStore: 'round_start',
  data: [],
};

const round_end_write_node: WriteNode<RoundEnd> = {
  name: 'round_end_write_node',
  outputObjectStore: 'round_end',
  data: [],
};

const setup_complete_write_node: WriteNode<SetupComplete> = {
  name: 'setup_complete_write_node',
  outputObjectStore: 'setup_complete',
  data: [],
};

const objective_captured_write_node: WriteNode<ObjectiveCaptured> = {
  name: 'objective_captured_write_node',
  outputObjectStore: 'objective_captured',
  data: [],
};

const point_progress_write_node: WriteNode<PointProgress> = {
  name: 'point_progress_write_node',
  outputObjectStore: 'point_progress',
  data: [],
};

const payload_progress_write_node: WriteNode<PayloadProgress> = {
  name: 'payload_progress_write_node',
  outputObjectStore: 'payload_progress',
  data: [],
};

const hero_spawn_write_node: WriteNode<HeroSpawn> = {
  name: 'hero_spawn_write_node',
  outputObjectStore: 'hero_spawn',
  data: [],
};

const hero_swap_write_node: WriteNode<HeroSwap> = {
  name: 'hero_swap_write_node',
  outputObjectStore: 'hero_swap',
  data: [],
};

const ability_1_used_write_node: WriteNode<Ability1Used> = {
  name: 'ability_1_used_write_node',
  outputObjectStore: 'ability_1_used',
  data: [],
};

const ability_2_used_write_node: WriteNode<Ability2Used> = {
  name: 'ability_2_used_write_node',
  outputObjectStore: 'ability_2_used',
  data: [],
};

const offensive_assist_write_node: WriteNode<OffensiveAssist> = {
  name: 'offensive_assist_write_node',
  outputObjectStore: 'offensive_assist',
  data: [],
};

const defensive_assist_write_node: WriteNode<DefensiveAssist> = {
  name: 'defensive_assist_write_node',
  outputObjectStore: 'defensive_assist',
  data: [],
};

const ultimate_charged_write_node: WriteNode<UltimateCharged> = {
  name: 'ultimate_charged_write_node',
  outputObjectStore: 'ultimate_charged',
  data: [],
};

const ultimate_start_write_node: WriteNode<UltimateStart> = {
  name: 'ultimate_start_write_node',
  outputObjectStore: 'ultimate_start',
  data: [],
};

const ultimate_end_write_node: WriteNode<UltimateEnd> = {
  name: 'ultimate_end_write_node',
  outputObjectStore: 'ultimate_end',
  data: [],
};

const kill_write_node: WriteNode<Kill> = {
  name: 'kill_write_node',
  outputObjectStore: 'kill',
  data: [],
};

const damage_write_node: WriteNode<Damage> = {
  name: 'damage_write_node',
  outputObjectStore: 'damage',
  data: [],
};

const healing_write_node: WriteNode<Healing> = {
  name: 'healing_write_node',
  outputObjectStore: 'healing',
  data: [],
};

const mercy_rez_write_node: WriteNode<MercyRez> = {
  name: 'mercy_rez_write_node',
  outputObjectStore: 'mercy_rez',
  data: [],
};

const echo_duplicate_start_write_node: WriteNode<EchoDuplicateStart> = {
  name: 'echo_duplicate_start_write_node',
  outputObjectStore: 'echo_duplicate_start',
  data: [],
};

const echo_duplicate_end_write_node: WriteNode<EchoDuplicateEnd> = {
  name: 'echo_duplicate_end_write_node',
  outputObjectStore: 'echo_duplicate_end',
  data: [],
};

const dva_demech_write_node: WriteNode<DvaDemech> = {
  name: 'dva_demech_write_node',
  outputObjectStore: 'dva_demech',
  data: [],
};

const dva_remech_write_node: WriteNode<DvaRemech> = {
  name: 'dva_remech_write_node',
  outputObjectStore: 'dva_remech',
  data: [],
};

const remech_charged_write_node: WriteNode<RemechCharged> = {
  name: 'remech_charged_write_node',
  outputObjectStore: 'remech_charged',
  data: [],
};

const player_stat_write_node: WriteNode<PlayerStat> = {
  name: 'player_stat_write_node',
  outputObjectStore: 'player_stat',
  data: [],
};

interface MapTeams {
  mapId: number;
  teamName: string;
  teamPlayers: string[];
}

const mapTeamsNode: AlaSQLNode<MapTeams> = {
  name: 'map_teams',
  sql: `
  select 
   player_stat.mapId,
   player_stat.playerTeam as teamName,
   array(distinct player_stat.playerName) as teamPlayers
  from ? as player_stat
  group by player_stat.mapId, player_stat.playerTeam
  `,
  sources: ['player_stat_object_store'],
};

interface MapTeamsGrouped {
  mapId: number;
  team1Name: string;
  team2Name: string;
  team1Players: string[];
  team2Players: string[];
}

const mapTeamsGroupedNode: AlaSQLNode<MapTeamsGrouped> = {
  name: 'map_teams_grouped',
  sql: `select
  map_teams.mapId,
  map_teams.teamName as team1Name,
  map_teams2.teamName as team2Name,
  map_teams.teamPlayers as team1Players,
  map_teams2.teamPlayers as team2Players
from ? as map_teams join ? as map_teams2
on map_teams.mapId = map_teams2.mapId
where map_teams.teamName < map_teams2.teamName
`,
  sources: ['map_teams', 'map_teams'],
};

export interface MapOverview {
  mapId: number;
  mapName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  team1Players: string[];
  team2Players: string[];
  timestamp: number;
  fileName: string;
}

const mapOverviewNode: AlaSQLNode<MapOverview> = {
  name: 'map_overview',
  sql: `
      SELECT
          match_start.mapId,
          match_end.mapId,
          match_start.mapName,
          match_start.team1Name,
          match_start.team2Name,
          match_end.team1Score,
          match_end.team2Score,
          map_teams.team1Players,
          map_teams.team2Players,
          maps.name as fileName,
          maps.fileModified as timestamp
      FROM ? as match_start JOIN ? as match_end 
      ON match_start.mapId = match_end.mapId 
      JOIN ? as maps ON match_start.mapId = maps.mapId
      JOIN ? as map_teams ON match_start.mapId = map_teams.mapId
      `,
  sources: [
    'match_start_object_store',
    'match_end_object_store',
    'maps_object_store',
    'map_teams_grouped',
  ],
} as AlaSQLNode<MapOverview>;

interface PlayerTimePlayed {
  playerName: string;
  playerTeam: string;
  timePlayed: number;
}

const playerTimePlayedNode: AlaSQLNode<PlayerTimePlayed> = {
  name: 'player_time_played',
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

export interface PlayerStatFormatted {
  mapId: number;
  roundNumber: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  eliminations: number;
  finalBlows: number;
  deaths: number;
  allDamageDealt: number;
  barrierDamageDealt: number;
  heroDamageDealt: number;
  healingDealt: number;
  healingReceived: number;
  selfHealing: number;
  damageTaken: number;
  damageBlocked: number;
  defensiveAssists: number;
  offensiveAssists: number;
  ultimatesEarned: number;
  ultimatesUsed: number;
  multikillBest: number;
  multikills: number;
  soloKills: number;
  objectiveKills: number;
  environmentalKills: number;
  environmentalDeaths: number;
  criticalHits: number;
  criticalHitAccuracy: number;
  scopedAccuracy: number;
  scopedCriticalHitAccuracy: number;
  scopedCriticalHitKills: number;
  shotsFired: number;
  shotsHit: number;
  shotsMissed: number;
  scopedShotsFired: number;
  scopedShotsHit: number;
  weaponAccuracy: number;
  heroTimePlayed: number;
}

export type PlayerStatsAggregated = Omit<PlayerStatFormatted, 'roundNumber'>;

const playerStatFormattedNode: AlaSQLNode<PlayerStatFormatted> = {
  name: 'player_stat_formatted',
  sql: `
  SELECT
      player_stat.mapId,
      player_stat.roundNumber,
      player_stat.playerTeam,
      player_stat.playerName,
      player_stat.playerHero,
      player_stat.eliminations,
      player_stat.finalBlows,
      player_stat.deaths,
      player_stat.allDamageDealt,
      player_stat.barrierDamageDealt,
      player_stat.heroDamageDealt,
      player_stat.healingDealt,
      player_stat.healingReceived,
      player_stat.selfHealing,
      player_stat.damageTaken,
      player_stat.damageBlocked,
      player_stat.defensiveAssists,
      player_stat.offensiveAssists,
      player_stat.ultimatesEarned,
      player_stat.ultimatesUsed,
      player_stat.multikillBest,
      player_stat.multikills,
      player_stat.soloKills,
      player_stat.objectiveKills,
      player_stat.environmentalKills,
      player_stat.environmentalDeaths,
      player_stat.criticalHits,
      player_stat.criticalHitAccuracy,
      player_stat.scopedAccuracy,
      player_stat.scopedCriticalHitAccuracy,
      player_stat.scopedCriticalHitKills,
      player_stat.shotsFired,
      player_stat.shotsHit,
      player_stat.shotsMissed,
      player_stat.scopedShotsFired,
      player_stat.scopedShotsHit,
      player_stat.weaponAccuracy,
      player_stat.heroTimePlayed
  FROM ? as player_stat
  order by
  player_stat.mapId,
  player_stat.roundNumber,
  player_stat.playerTeam,
  player_stat.playerName,
  player_stat.heroTimePlayed desc,
  player_stat.playerHero
  `,
  sources: ['player_stat_object_store'],
};

export const NODES = [
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
  mapTeamsNode,
  mapTeamsGroupedNode,
  playerStatFormattedNode,
];
