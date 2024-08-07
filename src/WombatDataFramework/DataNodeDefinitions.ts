import {WriteNodeInit, ObjectStoreNodeInit, AlaSQLNodeInit} from './DataNode';

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

// export const NODES: DataNodeInit<any>[] = [
//
//   new AlaSQLNode<MapTeams>(
//     'map_teams',
//     'Map Teams',
//     `
//   select
//    player_stat.mapId,
//    player_stat.playerTeam as teamName,
//    array(distinct player_stat.playerName) as teamPlayers
//   from ? as player_stat
//   group by player_stat.mapId, player_stat.playerTeam
//   `,
//     ['player_stat_object_store'],
//     ['mapId', 'teamName', 'teamPlayers'],
//   ),
//   new AlaSQLNode<MapTeamsGrouped>(
//     'map_teams_grouped',
//     'Map Teams Grouped',
//     `select
//   map_teams.mapId,
//   map_teams.teamName as team1Name,
//   map_teams2.teamName as team2Name,
//   map_teams.teamPlayers as team1Players,
//   map_teams2.teamPlayers as team2Players
// from ? as map_teams join ? as map_teams2
// on map_teams.mapId = map_teams2.mapId
// where map_teams.teamName < map_teams2.teamName
// `,
//     ['map_teams', 'map_teams'],
//     ['mapId', 'team1Name', 'team2Name', 'team1Players', 'team2Players'],
//   ),
//   new AlaSQLNode<MapOverview>(
//     'map_overview',
//     'Map Overview',
//     `
//       SELECT
//           match_start.mapId,
//           match_end.mapId,
//           match_start.mapName,
//           match_start.team1Name,
//           match_start.team2Name,
//           match_end.team1Score,
//           match_end.team2Score,
//           map_teams.team1Players,
//           map_teams.team2Players,
//           maps.name as fileName,
//           maps.fileModified as timestamp
//       FROM ? as match_start JOIN ? as match_end
//       ON match_start.mapId = match_end.mapId
//       JOIN ? as maps ON match_start.mapId = maps.mapId
//       JOIN ? as map_teams ON match_start.mapId = map_teams.mapId
//       `,
//     ['match_start_object_store', 'match_end_object_store', 'maps_object_store', 'map_teams_grouped'],
//     ['mapId', 'mapName', 'team1Name', 'team2Name', 'team1Score', 'team2Score', 'team1Players', 'team2Players', 'fileName', 'timestamp'],
//   ),
//   new PartitionNode<MapOverview, {scrimId: string}>(
//     'map_overview_with_scrim_id',
//     'Map Overview with Scrim ID',
//     'scrimId',
//     (map1: MapOverview, map2: MapOverview) => {
//       return map1.team1Name !== map2.team1Name || map1.team2Name !== map2.team2Name;
//     },
//     'map_overview',
//     ['scrimId'],
//   ),
//   new AlaSQLNode<PlayerTimePlayed>(
//     'player_time_played',
//     'Player Time Played',
//     `
//       SELECT
//           player_stat.playerName,
//           player_stat.playerTeam,
//           SUM(player_stat.timePlayed) as timePlayed
//       FROM ? as player_stat
//       GROUP BY player_stat.playerName, player_stat.playerTeam
//       `,
//     ['player_stat_object_store'],
//     ['playerName', 'playerTeam', 'timePlayed'],
//   ),
//   new AlaSQLNode<PlayerStatFormatted>(
//     'player_stat_formatted',
//     'Player Stat Formatted',
//     `
//   SELECT
//       player_stat.mapId,
//       player_stat.roundNumber,
//       player_stat.playerTeam,
//       player_stat.playerName,
//       player_stat.playerHero,
//       player_stat.eliminations,
//       player_stat.finalBlows,
//       player_stat.deaths,
//       player_stat.allDamageDealt,
//       player_stat.barrierDamageDealt,
//       player_stat.heroDamageDealt,
//       player_stat.healingDealt,
//       player_stat.healingReceived,
//       player_stat.selfHealing,
//       player_stat.damageTaken,
//       player_stat.damageBlocked,
//       player_stat.defensiveAssists,
//       player_stat.offensiveAssists,
//       player_stat.ultimatesEarned,
//       player_stat.ultimatesUsed,
//       player_stat.multikillBest,
//       player_stat.multikills,
//       player_stat.soloKills,
//       player_stat.objectiveKills,
//       player_stat.environmentalKills,
//       player_stat.environmentalDeaths,
//       player_stat.criticalHits,
//       player_stat.criticalHitAccuracy,
//       player_stat.scopedAccuracy,
//       player_stat.scopedCriticalHitAccuracy,
//       player_stat.scopedCriticalHitKills,
//       player_stat.shotsFired,
//       player_stat.shotsHit,
//       player_stat.shotsMissed,
//       player_stat.scopedShotsFired,
//       player_stat.scopedShotsHit,
//       player_stat.weaponAccuracy,
//       player_stat.heroTimePlayed
//   FROM ? as player_stat
//   order by
//   player_stat.mapId,
//   player_stat.roundNumber,
//   player_stat.playerTeam,
//   player_stat.playerName,
//   player_stat.heroTimePlayed desc,
//   player_stat.playerHero
//   `,
//     ['player_stat_object_store'],
//     [
//       'mapId',
//       'roundNumber',
//       'playerTeam',
//       'playerName',
//       'playerHero',
//       'eliminations',
//       'finalBlows',
//       'deaths',
//       'allDamageDealt',
//       'barrierDamageDealt',
//       'heroDamageDealt',
//       'healingDealt',
//       'healingReceived',
//       'selfHealing',
//       'damageTaken',
//       'damageBlocked',
//       'defensiveAssists',
//       'offensiveAssists',
//       'ultimatesEarned',
//       'ultimatesUsed',
//       'multikillBest',
//       'multikills',
//       'soloKills',
//       'objectiveKills',
//       'environmentalKills',
//       'environmentalDeaths',
//       'criticalHits',
//       'criticalHitAccuracy',
//       'scopedAccuracy',
//       'scopedCriticalHitAccuracy',
//       'scopedCriticalHitKills',
//       'shotsFired',
//       'shotsHit',
//       'shotsMissed',
//       'scopedShotsFired',
//       'scopedShotsHit',
//       'weaponAccuracy',
//       'heroTimePlayed',
//     ],
//   ),
//   new AlaSQLNode<ScrimPlayersHeroesRoles>(
//     'scrim_players_heroes_roles',
//     'Scrim Players Heroes Roles',
//     `
//       SELECT
//         map_overview_with_scrim_id.scrimId,
//         ARRAY(if(map_overview_with_scrim_id.team1Name = player_stat_formatted.playerTeam, 1, 2))->0 as teamNumber,

//         ARRAY(CASE
//           WHEN player_stat_formatted.playerHero = 'Mauga' THEN 1
//           WHEN player_stat_formatted.playerHero = 'D.Va' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Orisa' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Reinhardt' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Roadhog' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Sigma' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Winston' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Wrecking Ball' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Zarya' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Doomfist' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Junker Queen' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Rammatra' THEN 1
//           WHEN player_stat_formatted.playerHero = 'Ashe' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Bastion' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Cassidy' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Echo' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Genji' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Hanzo' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Junkrat' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Mei' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Pharah' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Reaper' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Soldier: 76' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Sojourn' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Sombra' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Symmetra' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Torbjörn' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Tracer' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Widowmaker' THEN 2
//           WHEN player_stat_formatted.playerHero = 'Ana' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Baptiste' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Brigitte' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Lúcio' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Mercy' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Moira' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Zenyatta' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Lifeweaver' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Illari' THEN 3
//           WHEN player_stat_formatted.playerHero = 'Kiriko' THEN 3
//           ELSE 4
//         END)->0 as roleNumber,
//         player_stat_formatted.mapId as mapId,
//         player_stat_formatted.playerTeam as teamName,
//         map_overview_with_scrim_id.team1Name as team1Name,
//         player_stat_formatted.playerName,
//         ARRAY(CASE
//           WHEN player_stat_formatted.playerHero = 'Mauga' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'D.Va' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Orisa' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Reinhardt' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Roadhog' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Sigma' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Winston' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Wrecking Ball' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Zarya' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Doomfist' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Junker Queen' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Rammatra' THEN 'tank'
//           WHEN player_stat_formatted.playerHero = 'Ashe' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Bastion' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Cassidy' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Echo' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Genji' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Hanzo' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Junkrat' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Mei' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Pharah' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Reaper' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Soldier: 76' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Sojourn' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Sombra' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Symmetra' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Torbjörn' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Tracer' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Widowmaker' THEN 'damage'
//           WHEN player_stat_formatted.playerHero = 'Ana' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Baptiste' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Brigitte' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Lúcio' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Mercy' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Moira' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Zenyatta' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Lifeweaver' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Illari' THEN 'support'
//           WHEN player_stat_formatted.playerHero = 'Kiriko' THEN 'support'
//           ELSE 'unknown'
//         END)->0 as role,
//         player_stat_formatted.playerHero as hero,
//         sum(player_stat_formatted.finalBlows) as finalBlows,
//         sum(player_stat_formatted.deaths) as deaths,
//         sum(player_stat_formatted.heroDamageDealt) as damage,
//         sum(player_stat_formatted.shotsFired) as shotsFired,
//         sum(player_stat_formatted.shotsHit) / sum(player_stat_formatted.shotsFired) as accuracy
// from ? as map_overview_with_scrim_id join ? as player_stat_formatted
// on map_overview_with_scrim_id.mapId = player_stat_formatted.mapId
// group by map_overview_with_scrim_id.scrimId,
// player_stat_formatted.mapId,
// player_stat_formatted.playerTeam,
// map_overview_with_scrim_id.team1Name,
// player_stat_formatted.playerName,
// player_stat_formatted.playerHero
// having sum(player_stat_formatted.shotsFired) > 0
// `,
//     ['map_overview_with_scrim_id', 'player_stat_formatted'],
//     ['scrimId', 'teamName', 'playerName', 'role', 'hero', 'finalBlows', 'deaths'],
//   ),
// ];

function makeWriteNodeInit(name: string, displayName: string, objectStore: string): WriteNodeInit {
  return {
    name,
    displayName,
    objectStore,
    columnNames: [],
  };
}

export const WRITE_NODES: WriteNodeInit[] = [
  makeWriteNodeInit('ability_1_used_write_node', 'Add Ability 1 Used Events', 'ability_1_used'),
  makeWriteNodeInit('ability_2_used_write_node', 'Add Ability 2 Used Events', 'ability_2_used'),
  makeWriteNodeInit('damage_write_node', 'Add Damage Events', 'damage'),
  makeWriteNodeInit('defensive_assist_write_node', 'Add Defensive Assist Events', 'defensive_assist'),
  makeWriteNodeInit('dva_demech_write_node', 'Add Dva Demech Events', 'dva_demech'),
  makeWriteNodeInit('dva_remech_write_node', 'Add Dva Remech Events', 'dva_remech'),
  makeWriteNodeInit('echo_duplicate_end_write_node', 'Add Echo Duplicate End Events', 'echo_duplicate_end'),
  makeWriteNodeInit('echo_duplicate_start_write_node', 'Add Echo Duplicate Start Events', 'echo_duplicate_start'),
  makeWriteNodeInit('healing_write_node', 'Add Healing Events', 'healing'),
  makeWriteNodeInit('hero_spawn_write_node', 'Add Hero Spawn Events', 'hero_spawn'),
  makeWriteNodeInit('hero_swap_write_node', 'Add Hero Swap Events', 'hero_swap'),
  makeWriteNodeInit('kill_write_node', 'Add Kill Events', 'kill'),
  makeWriteNodeInit('maps_write_node', 'Add Maps', 'maps'),
  makeWriteNodeInit('match_end_write_node', 'Add Match End Events', 'match_end'),
  makeWriteNodeInit('match_start_write_node', 'Add Match Start Events', 'match_start'),
  makeWriteNodeInit('mercy_rez_write_node', 'Add Mercy Rez Events', 'mercy_rez'),
  makeWriteNodeInit('objective_captured_write_node', 'Add Objective Captured Events', 'objective_captured'),
  makeWriteNodeInit('offensive_assist_write_node', 'Add Offensive Assist Events', 'offensive_assist'),
  makeWriteNodeInit('payload_progress_write_node', 'Add Payload Progress Events', 'payload_progress'),
  makeWriteNodeInit('player_stat_write_node', 'Add Player Stat Events', 'player_stat'),
  makeWriteNodeInit('point_progress_write_node', 'Add Point Progress Events', 'point_progress'),
  makeWriteNodeInit('remech_charged_write_node', 'Add Remech Charged Events', 'remech_charged'),
  makeWriteNodeInit('round_end_write_node', 'Add Round End Events', 'round_end'),
  makeWriteNodeInit('round_start_write_node', 'Add Round Start Events', 'round_start'),
  makeWriteNodeInit('setup_complete_write_node', 'Add Setup Complete Events', 'setup_complete'),
  makeWriteNodeInit('ultimate_charged_write_node', 'Add Ultimate Charged Events', 'ultimate_charged'),
  makeWriteNodeInit('ultimate_end_write_node', 'Add Ultimate End Events', 'ultimate_end'),
  makeWriteNodeInit('ultimate_start_write_node', 'Add Ultimate Start Events', 'ultimate_start'),
];

function makeObjectStoreNodeInit(name: string, displayName: string, objectStore: string, columnNames: string[]): ObjectStoreNodeInit {
  return {
    name,
    displayName,
    objectStore,
    columnNames,
  };
}

export const OBJECT_STORE_NODES: ObjectStoreNodeInit[] = [
  makeObjectStoreNodeInit('ability_1_used_object_store', 'Ability 1 Used', 'ability_1_used', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeInit('ability_2_used_object_store', 'Ability 2 Used', 'ability_2_used', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeInit('damage_object_store', 'Damage', 'damage', [
    'mapId',
    'type',
    'matchTime',
    'attackerTeam',
    'attackerName',
    'attackerHero',
    'victimTeam',
    'victimName',
    'victimHero',
    'eventAbility',
    'eventDamage',
    'isCriticalHit',
    'isEnvironmental',
  ]),
  makeObjectStoreNodeInit('defensive_assist_object_store', 'Defensive Assist', 'defensive_assist', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeInit('dva_demech_object_store', 'Dva Demech', 'dva_demech', [
    'mapId',
    'type',
    'matchTime',
    'attackerTeam',
    'attackerName',
    'attackerHero',
    'victimTeam',
    'victimName',
    'victimHero',
    'eventAbility',
    'eventDamage',
    'isCriticalHit',
    'isEnvironmental',
  ]),
  makeObjectStoreNodeInit('dva_remech_object_store', 'Dva Remech', 'dva_remech', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'ultimateId']),
  makeObjectStoreNodeInit('echo_duplicate_end_object_store', 'Echo Duplicate End', 'echo_duplicate_end', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'ultimateId']),
  makeObjectStoreNodeInit('echo_duplicate_start_object_store', 'Echo Duplicate Start', 'echo_duplicate_start', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeInit('healing_object_store', 'Healing', 'healing', [
    'mapId',
    'type',
    'matchTime',
    'healerTeam',
    'healerName',
    'healerHero',
    'healeeTeam',
    'healeeName',
    'healeeHero',
    'eventAbility',
    'eventHealing',
    'isHealthPack',
  ]),
  makeObjectStoreNodeInit('hero_spawn_object_store', 'Hero Spawn', 'hero_spawn', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'previousHero', 'heroTimePlayed']),
  makeObjectStoreNodeInit('hero_swap_object_store', 'Hero Swap', 'hero_swap', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'previousHero', 'heroTimePlayed']),
  makeObjectStoreNodeInit('kill_object_store', 'Kill', 'kill', [
    'mapId',
    'type',
    'matchTime',
    'attackerTeam',
    'attackerName',
    'attackerHero',
    'victimTeam',
    'victimName',
    'victimHero',
    'eventAbility',
    'eventDamage',
    'isCriticalHit',
    'isEnvironmental',
  ]),
  makeObjectStoreNodeInit('maps_object_store', 'Maps', 'maps', ['mapId', 'name', 'fileModified']),
  makeObjectStoreNodeInit('match_end_object_store', 'Match End', 'match_end', ['mapId', 'type', 'matchTime', 'roundNumber', 'team1Score', 'team2Score']),
  makeObjectStoreNodeInit('match_start_object_store', 'Match Start', 'match_start', ['mapId', 'type', 'matchTime', 'mapName', 'mapType', 'team1Name', 'team2Name']),
  makeObjectStoreNodeInit('mercy_rez_object_store', 'Mercy Rez', 'mercy_rez', ['mapId', 'type', 'matchTime', 'mercyTeam', 'mercyName', 'revivedTeam', 'revivedName', 'revivedHero', 'eventAbility']),
  makeObjectStoreNodeInit('objective_captured_object_store', 'Objective Captured', 'objective_captured', [
    'mapId',
    'type',
    'matchTime',
    'roundNumber',
    'capturingTeam',
    'objectiveIndex',
    'controlTeam1Progress',
    'controlTeam2Progress',
    'matchTimeRemaining',
  ]),
  makeObjectStoreNodeInit('offensive_assist_object_store', 'Offensive Assist', 'offensive_assist', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeInit('payload_progress_object_store', 'Payload Progress', 'payload_progress', ['mapId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'payloadCaptureProgress']),
  makeObjectStoreNodeInit('player_stat_object_store', 'Player Stat', 'player_stat', [
    'mapId',
    'type',
    'matchTime',
    'roundNumber',
    'playerTeam',
    'playerName',
    'playerHero',
    'eliminations',
    'finalBlows',
    'deaths',
    'allDamageDealt',
    'barrierDamageDealt',
    'heroDamageDealt',
    'healingDealt',
    'healingReceived',
    'selfHealing',
    'damageTaken',
    'damageBlocked',
    'defensiveAssists',
    'offensiveAssists',
    'ultimatesEarned',
    'ultimatesUsed',
    'multikillBest',
    'multikills',
    'soloKills',
    'objectiveKills',
    'environmentalKills',
    'environmentalDeaths',
    'criticalHits',
    'criticalHitAccuracy',
    'scopedAccuracy',
    'scopedCriticalHitAccuracy',
    'scopedCriticalHitKills',
    'shotsFired',
    'shotsHit',
    'shotsMissed',
    'scopedShotsFired',
    'scopedShotsHit',
    'weaponAccuracy',
    'heroTimePlayed',
  ]),
  makeObjectStoreNodeInit('point_progress_object_store', 'Point Progress', 'point_progress', ['mapId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'pointCaptureProgress']),
  makeObjectStoreNodeInit('remech_charged_object_store', 'Remech Charged', 'remech_charged', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeInit('round_end_object_store', 'Round End', 'round_end', [
    'mapId',
    'type',
    'matchTime',
    'roundNumber',
    'capturingTeam',
    'team1Score',
    'team2Score',
    'objectiveIndex',
    'controlTeam1Progress',
    'controlTeam2Progress',
    'matchTimeRemaining',
  ]),
  makeObjectStoreNodeInit('round_start_object_store', 'Round Start', 'round_start', ['mapId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'team1Score', 'team2Score', 'objectiveIndex']),
  makeObjectStoreNodeInit('setup_complete_object_store', 'Setup Complete', 'setup_complete', ['mapId', 'type', 'matchTime', 'roundNumber', 'matchTimeRemaining']),
  makeObjectStoreNodeInit('ultimate_charged_object_store', 'Ultimate Charged', 'ultimate_charged', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeInit('ultimate_end_object_store', 'Ultimate End', 'ultimate_end', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeInit('ultimate_start_object_store', 'Ultimate Start', 'ultimate_start', ['mapId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
];

function makeAlaSQLNodeInit(name: string, displayName: string, sql: string, sources: string[], columnNames: string[]): AlaSQLNodeInit {
  return {
    name,
    displayName,
    sql,
    sources,
    columnNames,
  };
}

function buildSQLRatioMetrics(
  numeratorSource: string,
  numeratorSliceColumns: string[],
  numeratorColumns: string[],
  denominatorSource: string,
  denominatorColumn: string,
  weight: number,
  joinColumns: string[],
  metricSuffix: string,
): string {
  function ratioForNumeratorColumn(column: string): string {
    return `${numeratorSource}.${column} / ${denominatorSource}.${denominatorColumn} * ${weight} as ${column}${metricSuffix}`;
  }
  return `
  SELECT
    ${numeratorSliceColumns.map((column) => `${numeratorSource}.${column}`).join(', ')},
    ${numeratorColumns.map(ratioForNumeratorColumn).join(', ')}
  FROM ? as ${numeratorSource}
  JOIN ? as ${denominatorSource}
  ON ${joinColumns.map((column) => `${numeratorSource}.${column} = ${denominatorSource}.${column}`).join(' AND ')}
  `;
}

export const ALASQL_NODES: AlaSQLNodeInit[] = [
  makeAlaSQLNodeInit(
    'ultimate_events',
    'Ultimate Events',
    `
  SELECT
    ult_charged.mapId,
    ult_charged.playerName,
    ult_charged.playerTeam,
    ult_charged.playerHero,
    ult_charged.ultimateId,
    ult_charged.matchTime as ultimateChargedTime,
    ult_start.matchTime as ultimateStartTime,
    ult_end.matchTime as ultimateEndTime,
    ult_start.matchTime - ult_charged.matchTime as ultimateHoldTime
  FROM ? as ult_charged
  JOIN ? as ult_start
  ON ult_charged.mapId = ult_start.mapId AND ult_charged.playerName = ult_start.playerName AND ult_charged.playerTeam = ult_start.playerTeam
  AND ult_charged.playerHero = ult_start.playerHero AND ult_charged.ultimateId = ult_start.ultimateId AND ult_charged.matchTime <= ult_start.matchTime
  JOIN ? as ult_end
  ON ult_charged.mapId = ult_end.mapId AND ult_charged.playerName = ult_end.playerName AND ult_charged.playerTeam = ult_end.playerTeam
  AND ult_charged.playerHero = ult_end.playerHero AND ult_charged.ultimateId = ult_end.ultimateId AND ult_start.matchTime <= ult_end.matchTime
  ORDER BY ult_charged.mapId, ult_charged.playerName, ult_charged.matchTime
  `,
    ['ultimate_charged_object_store', 'ultimate_start_object_store', 'ultimate_end_object_store'],
    ['mapId', 'playerName', 'playerTeam', 'playerHero', 'ultimateId', 'ultimateChargedTime', 'ultimateStartTime', 'ultimateEndTime', 'ultimateHoldTime'],
  ),
  makeAlaSQLNodeInit(
    'map_times',
    'Map Times',
    `SELECT
      match_start.mapId,
      match_start.matchTime as mapStartTime,
      match_end.matchTime as mapEndTime,
      SUM(round.roundDuration) as mapDuration
    FROM ? as match_start
    JOIN ? as match_end
    ON match_start.mapId = match_end.mapId
    JOIN ? as round
    ON match_start.mapId = round.mapId
    GROUP BY match_start.mapId, match_start.matchTime, match_end.matchTime
    ORDER BY match_start.mapId, match_start.matchTime
    `,
    ['match_start_object_store', 'match_end_object_store', 'round_times'],
    ['mapId', 'mapStartTime', 'mapEndTime', 'mapDuration'],
  ),
  makeAlaSQLNodeInit(
    'round_times',
    'Round Times',
    `SELECT
      round_start.mapId,
      round_start.roundNumber,
      round_start.matchTime as roundStartTime,
      setup_complete.matchTime as roundSetupCompleteTime,
      round_end.matchTime as roundEndTime,
      round_end.matchTime - setup_complete.matchTime as roundDuration
    FROM ? as round_start
    JOIN ? as round_end
    ON round_start.mapId = round_end.mapId AND round_start.roundNumber = round_end.roundNumber
    JOIN ? as setup_complete
    ON round_start.mapId = setup_complete.mapId AND round_start.roundNumber = setup_complete.roundNumber
    ORDER BY round_start.mapId, round_start.roundNumber
    `,
    ['round_start_object_store', 'round_end_object_store', 'setup_complete_object_store'],
    ['mapId', 'roundNumber', 'roundStartTime', 'roundEndTime', 'roundDuration', 'roundSetupCompleteTime'],
  ),
  makeAlaSQLNodeInit(
    'player_events',
    'Player Events',
    `
    SELECT * FROM (
    SELECT
      defensive_assist.mapId,
      defensive_assist.playerName,
      defensive_assist.matchTime as playerEventTime,
      'Defensive Assist' as playerEventType
    FROM ? as defensive_assist
    UNION ALL
    SELECT
      offensive_assist.mapId,
      offensive_assist.playerName,
      offensive_assist.matchTime as playerEventTime,
      'Offensive Assist' as playerEventType
    FROM ? as offensive_assist
    UNION ALL
    SELECT
      echo_duplicate_start.mapId,
      echo_duplicate_start.playerName,
      echo_duplicate_start.matchTime as playerEventTime,
      'Duplicate Start' as playerEventType
    FROM ? as echo_duplicate_start
    UNION ALL
    SELECT
      echo_duplicate_end.mapId,
      echo_duplicate_end.playerName,
      echo_duplicate_end.matchTime as playerEventTime,
      'Duplicate End' as playerEventType
    FROM ? as echo_duplicate_end
    UNION ALL
    SELECT
      hero_spawn.mapId,
      hero_spawn.playerName,
      hero_spawn.matchTime as playerEventTime,
      'Spawn' as playerEventType
    FROM ? as hero_spawn
    UNION ALL
    SELECT
      hero_swap.mapId,
      hero_swap.playerName,
      hero_swap.matchTime as playerEventTime,
      'Swap' as playerEventType
    FROM ? as hero_swap
    UNION ALL
    SELECT
      ultimate_charged.mapId,
      ultimate_charged.playerName,
      ultimate_charged.matchTime as playerEventTime,
      'Ultimate Charged' as playerEventType
    FROM ? as ultimate_charged
    UNION ALL
    SELECT
      ultimate_start.mapId,
      ultimate_start.playerName,
      ultimate_start.matchTime as playerEventTime,
      'Ultimate Start' as playerEventType
    FROM ? as ultimate_start
    UNION ALL
    SELECT
      ultimate_end.mapId,
      ultimate_end.playerName,
      ultimate_end.matchTime as playerEventTime,
      'Ultimate End' as playerEventType
    FROM ? as ultimate_end
    UNION ALL
    SELECT
      ability_1_used.mapId,
      ability_1_used.playerName,
      ability_1_used.matchTime as playerEventTime,
      'Ability 1 Used' as playerEventType
    FROM ? as ability_1_used
    UNION ALL
    SELECT
      ability_2_used.mapId,
      ability_2_used.playerName,
      ability_2_used.matchTime as playerEventTime,
      'Ability 2 Used' as playerEventType
    FROM ? as ability_2_used
    )
    ORDER BY mapId, playerName, playerEventTime
    `,
    [
      'defensive_assist_object_store',
      'offensive_assist_object_store',
      'echo_duplicate_start_object_store',
      'echo_duplicate_end_object_store',
      'hero_spawn_object_store',
      'hero_swap_object_store',
      'ultimate_charged_object_store',
      'ultimate_start_object_store',
      'ultimate_end_object_store',
      'ability_1_used_object_store',
      'ability_2_used_object_store',
    ],
    ['mapId', 'playerName', 'playerEventTime', 'playerEventType'],
  ),
  makeAlaSQLNodeInit(
    'player_interaction_events',
    'Player Interaction Events',
    `
    SELECT * FROM (
      SELECT
        mercy_rez.mapId,
        mercy_rez.revivedName as playerName,
        mercy_rez.mercyName as otherPlayerName,
        mercy_rez.matchTime as playerInteractionEventTime,
        'Resurrected' as playerInteractionEventType
      FROM ? as mercy_rez
      UNION ALL
      SELECT
        mercy_rez.mapId,
        mercy_rez.mercyName as playerName,
        mercy_rez.revivedName as otherPlayerName,
        mercy_rez.matchTime as playerInteractionEventTime,
        'Resurrected Player' as playerInteractionEventType
      FROM ? as mercy_rez
      UNION ALL
      SELECT
        dva_demech.mapId,
        dva_demech.victimName as playerName,
        dva_demech.attackerName as otherPlayerName,
        dva_demech.matchTime as playerInteractionEventTime,
        'Demeched' as playerInteractionEventType
      FROM ? as dva_demech
      UNION ALL
      SELECT
        dva_remech.mapId,
        dva_remech.playerName as playerName,
        dva_remech.playerName as otherPlayerName,
        dva_remech.matchTime as playerInteractionEventTime,
        'Remeched' as playerInteractionEventType
      FROM ? as dva_remech
      UNION ALL
      SELECT
        kill.mapId,
        kill.attackerName as playerName,
        kill.victimName as otherPlayerName,
        kill.matchTime as playerInteractionEventTime,
        'Killed player' as playerInteractionEventType
      FROM ? as kill
      UNION ALL
      SELECT
        kill.mapId,
        kill.victimName as playerName,
        kill.attackerName as otherPlayerName,
        kill.matchTime as playerInteractionEventTime,
        'Died' as playerInteractionEventType
      FROM ? as kill
      UNION ALL
      SELECT
        damage.mapId,
        damage.attackerName as playerName,
        damage.victimName as otherPlayerName,
        damage.matchTime as playerInteractionEventTime,
        'Dealt Damage' as playerInteractionEventType
      FROM ? as damage
      UNION ALL
      SELECT
        damage.mapId,
        damage.victimName as playerName,
        damage.attackerName as otherPlayerName,
        damage.matchTime as playerInteractionEventTime,
        'Recieved Damaged' as playerInteractionEventType
      FROM ? as damage
      UNION ALL
      SELECT
        healing.mapId,
        healing.healerName as playerName,
        healing.healeeName as otherPlayerName,
        healing.matchTime as playerInteractionEventTime,
        'Dealt Healing' as playerInteractionEventType
      FROM ? as healing
      UNION ALL
      SELECT
        healing.mapId,
        healing.healeeName as playerName,
        healing.healerName as otherPlayerName,
        healing.matchTime as playerInteractionEventTime,
        'Recieved Healing' as playerInteractionEventType
      FROM ? as healing
    )
    ORDER BY mapId, playerName, playerInteractionEventTime
    `,
    [
      'mercy_rez_object_store',
      'mercy_rez_object_store',
      'dva_demech_object_store',
      'dva_remech_object_store',
      'kill_object_store',
      'kill_object_store',
      'damage_object_store',
      'damage_object_store',
      'healing_object_store',
      'healing_object_store',
    ],
    ['mapId', 'playerName', 'otherPlayerName', 'playerInteractionEventTime', 'playerInteractionEventType'],
  ),
  // makeAlaSQLNodeInit(
  //   'player_stat_per_10_per_map',
  //   'Player Statistics Per 10 Minutes Per Map',
  //   buildSQLRatioMetrics(
  //     'player_stat_object_store',
  //     ['mapId', 'playerName'],
  //     [
  //       'eliminations',
  //       'finalBlows',
  //       'deaths',
  //       'allDamageDealt',
  //       'heroDamageDealt',
  //       'healingDealt',
  //       'healingReceived',
  //       'selfHealing',
  //       'damageTaken',
  //       'damageBlocked',
  //       'defensiveAssists',
  //       'offensiveAssists',
  //       'ultimatesEarned',
  //       'ultimatesUsed',
  //       'multikillBest',
  //       'multikills',
  //       'soloKills',
  //       'objectiveKills',
  //       'environmentalKills',
  //       'environmentalDeaths',
  //       'criticalHits',
  //       'scopedCriticalHitKills',
  //       'shotsFired',
  //       'shotsHit',
  //       'shotsMissed',
  //       'scopedShotsFired',
  //       'scopedShotsHit',
  //     ],
  //     'map_times',
  //     'mapDuration',
  //     600,
  //     ['mapId'],
  //     'Per10',
  //   ),

  //   ['map_times', 'player_stat_object_store'],
  //   [
  //     'mapId',
  //     'playerName',
  //     'eliminationsPer10',
  //     'finalBlowsPer10',
  //     'deathsPer10',
  //     'allDamagePer10',
  //     'heroDamagePer10',
  //     'healingPer10',
  //     'healingReceivedPer10',
  //     'selfHealingPer10',
  //     'damageTakenPer10',
  //     'damageBlockedPer10',
  //     'defensiveAssistsPer10',
  //     'offensiveAssistsPer10',
  //     'ultimatesEarnedPer10',
  //     'ultimatesUsedPer10',
  //     'multikillsPer10',
  //     'soloKillsPer10',
  //     'objectiveKillsPer10',
  //     'environmentalKillsPer10',
  //     'environmentalDeathsPer10',
  //     'criticalHitsPer10',
  //     'scopedCriticalHitKillsPer10',
  //     'shotsFiredPer10',
  //     'shotsHitPer10',
  //     'shotsMissedPer10',
  //     'scopedShotsFiredPer10',
  //     'scopedShotsHitPer10',
  //   ],
  // ),
  makeAlaSQLNodeInit(
    'player_stat_per_10',
    'Player Statistics Per 10 Minutes',
    `
    SELECT
      player_stat.playerName,
      SUM(player_stat.eliminations) / SUM(map_times.mapDuration) * 600 as eliminationsPer10,
      SUM(player_stat.finalBlows) / SUM(map_times.mapDuration) * 600 as finalBlowsPer10,
      SUM(player_stat.deaths) / SUM(map_times.mapDuration) * 600 as deathsPer10,
      SUM(player_stat.allDamageDealt) / SUM(map_times.mapDuration) * 600 as allDamagePer10,
      SUM(player_stat.heroDamageDealt) / SUM(map_times.mapDuration) * 600 as heroDamagePer10,
      SUM(player_stat.barrierDamageDealt) / SUM(map_times.mapDuration) * 600 as barrierDamageDealtPer10,
      SUM(player_stat.healingDealt) / SUM(map_times.mapDuration) * 600 as healingPer10,
      SUM(player_stat.healingReceived) / SUM(map_times.mapDuration) * 600 as healingReceivedPer10,
      SUM(player_stat.selfHealing) / SUM(map_times.mapDuration) * 600 as selfHealingPer10,
      SUM(player_stat.damageTaken) / SUM(map_times.mapDuration) * 600 as damageTakenPer10,
      SUM(player_stat.damageBlocked) / SUM(map_times.mapDuration) * 600 as damageBlockedPer10,
      SUM(player_stat.defensiveAssists) / SUM(map_times.mapDuration) * 600 as defensiveAssistsPer10,
      SUM(player_stat.offensiveAssists) / SUM(map_times.mapDuration) * 600 as offensiveAssistsPer10,
      SUM(player_stat.ultimatesEarned) / SUM(map_times.mapDuration) * 600 as ultimatesEarnedPer10,
      SUM(player_stat.ultimatesUsed) / SUM(map_times.mapDuration) * 600 as ultimatesUsedPer10,
      SUM(player_stat.multikillBest) / SUM(map_times.mapDuration) * 600 as multikillsPer10,
      SUM(player_stat.multikills) / SUM(map_times.mapDuration) * 600 as multikillsPer10,
      SUM(player_stat.soloKills) / SUM(map_times.mapDuration) * 600 as soloKillsPer10,
      SUM(player_stat.objectiveKills) / SUM(map_times.mapDuration) * 600 as objectiveKillsPer10,
      SUM(player_stat.environmentalKills) / SUM(map_times.mapDuration) * 600 as environmentalKillsPer10,
      SUM(player_stat.environmentalDeaths) / SUM(map_times.mapDuration) * 600 as environmentalDeathsPer10,
      SUM(player_stat.criticalHits) / SUM(map_times.mapDuration) * 600 as criticalHitsPer10,
      SUM(player_stat.scopedCriticalHitKills) / SUM(map_times.mapDuration) * 600 as scopedCriticalHitKillsPer10,
      SUM(player_stat.shotsFired) / SUM(map_times.mapDuration) * 600 as shotsFiredPer10,
      SUM(player_stat.shotsHit) / SUM(map_times.mapDuration) * 600 as shotsHitPer10,
      SUM(player_stat.shotsMissed) / SUM(map_times.mapDuration) * 600 as shotsMissedPer10,
      SUM(player_stat.scopedShotsFired) / SUM(map_times.mapDuration) * 600 as scopedShotsFiredPer10,
      SUM(player_stat.scopedShotsHit) / SUM(map_times.mapDuration) * 600 as scopedShotsHitPer10
    FROM ? as map_times
    JOIN ? as player_stat
    ON map_times.mapId = player_stat.mapId
    GROUP BY player_stat.playerName
    `,
    ['map_times', 'player_stat_object_store'],
    [
      'playerName',
      'eliminationsPer10',
      'finalBlowsPer10',
      'deathsPer10',
      'allDamagePer10',
      'heroDamagePer10',
      'barrierDamageDealtPer10',
      'healingPer10',
      'healingReceivedPer10',
      'selfHealingPer10',
      'damageTakenPer10',
      'damageBlockedPer10',
      'defensiveAssistsPer10',
      'offensiveAssistsPer10',
      'ultimatesEarnedPer10',
      'ultimatesUsedPer10',
      'multikillsPer10',
      'soloKillsPer10',
      'objectiveKillsPer10',
      'environmentalKillsPer10',
      'environmentalDeathsPer10',
      'criticalHitsPer10',
      'scopedCriticalHitKillsPer10',
      'shotsFiredPer10',
      'shotsHitPer10',
      'shotsMissedPer10',
      'scopedShotsFiredPer10',
      'scopedShotsHitPer10',
    ],
  ),
  makeAlaSQLNodeInit(
    'player_stat_totals',
    'Player Stat Totals',
    `
    SELECT
      player_stat.playerName,
      SUM(player_stat.eliminations) as eliminations,
      SUM(player_stat.finalBlows) as finalBlows,
      SUM(player_stat.deaths) as deaths,
      SUM(player_stat.allDamageDealt) as allDamageDealt,
      SUM(player_stat.barrierDamageDealt) as barrierDamageDealt,
      SUM(player_stat.heroDamageDealt) as heroDamageDealt,
      SUM(player_stat.healingDealt) as healingDealt,
      SUM(player_stat.healingReceived) as healingReceived,
      SUM(player_stat.selfHealing) as selfHealing,
      SUM(player_stat.damageTaken) as damageTaken,
      SUM(player_stat.damageBlocked) as damageBlocked,
      SUM(player_stat.defensiveAssists) as defensiveAssists,
      SUM(player_stat.offensiveAssists) as offensiveAssists,
      SUM(player_stat.ultimatesEarned) as ultimatesEarned,
      SUM(player_stat.ultimatesUsed) as ultimatesUsed,
      MAX(player_stat.multikillBest) as multikillBest,
      SUM(player_stat.multikills) as multikills,
      SUM(player_stat.soloKills) as soloKills,
      SUM(player_stat.objectiveKills) as objectiveKills,
      SUM(player_stat.environmentalKills) as environmentalKills,
      SUM(player_stat.environmentalDeaths) as environmentalDeaths,
      SUM(player_stat.criticalHits) as criticalHits,
      SUM(player_stat.scopedCriticalHitKills) as scopedCriticalHitKills,
      SUM(player_stat.shotsFired) as shotsFired,
      SUM(player_stat.shotsHit) as shotsHit,
      SUM(player_stat.shotsMissed) as shotsMissed,
      SUM(player_stat.scopedShotsFired) as scopedShotsFired,
      SUM(player_stat.scopedShotsHit) as scopedShotsHit
    FROM ? as player_stat
    GROUP BY player_stat.playerName
    `,
    ['player_stat_object_store'],
    [
      'playerName',
      'eliminations',
      'finalBlows',
      'deaths',
      'allDamageDealt',
      'heroDamageDealt',
      'barrierDamageDealt',
      'healingDealt',
      'healingReceived',
      'selfHealing',
      'damageTaken',
      'damageBlocked',
      'defensiveAssists',
      'offensiveAssists',
      'ultimatesEarned',
      'ultimatesUsed',
      'multikills',
      'multikillBest',
      'soloKills',
      'objectiveKills',
      'environmentalKills',
      'environmentalDeaths',
      'criticalHits',
      'scopedCriticalHitKills',
      'shotsFired',
      'shotsHit',
      'shotsMissed',
      'scopedShotsFired',
      'scopedShotsHit',
    ],
  ),
  // TODO how to do ratios?
];

// interface MapTeams {
//   mapId: number;
//   teamName: string;
//   teamPlayers: string[];
// }

// interface MapTeamsGrouped {
//   mapId: number;
//   team1Name: string;
//   team2Name: string;
//   team1Players: string[];
//   team2Players: string[];
// }

// export interface MapOverview {
//   mapId: number;
//   scrimId: string;
//   mapName: string;
//   team1Name: string;
//   team2Name: string;
//   team1Score: number;
//   team2Score: number;
//   team1Players: string[];
//   team2Players: string[];
//   timestamp: number;
//   fileName: string;
// }

// export interface ScrimPlayersHeroesRoles {
//   scrimId: string;
//   teamName: string;
//   playerName: string;
//   role: string;
//   hero: string;
//   finalBlows: number;
//   deaths: number;
// }

// export interface ScrimPlayers {
//   scrimId: number;
//   mapId: number;
//   teamName: string;
//   teamNumber: number;
//   playerName: string;
//   role: string;
//   roleNumber: number;
//   heroes: {
//     hero: string;
//     finalBlows: number;
//     deaths: number;
//     damage: number;
//     accuracy: number;
//     shotsFired: number;
//   }[];
// }

// interface PlayerTimePlayed {
//   playerName: string;
//   playerTeam: string;
//   timePlayed: number;
// }

// export interface PlayerStatFormatted {
//   mapId: number;
//   roundNumber: number;
//   playerTeam: string;
//   playerName: string;
//   playerHero: string;
//   eliminations: number;
//   finalBlows: number;
//   deaths: number;
//   allDamageDealt: number;
//   barrierDamageDealt: number;
//   heroDamageDealt: number;
//   healingDealt: number;
//   healingReceived: number;
//   selfHealing: number;
//   damageTaken: number;
//   damageBlocked: number;
//   defensiveAssists: number;
//   offensiveAssists: number;
//   ultimatesEarned: number;
//   ultimatesUsed: number;
//   multikillBest: number;
//   multikills: number;
//   soloKills: number;
//   objectiveKills: number;
//   environmentalKills: number;
//   environmentalDeaths: number;
//   criticalHits: number;
//   criticalHitAccuracy: number;
//   scopedAccuracy: number;
//   scopedCriticalHitAccuracy: number;
//   scopedCriticalHitKills: number;
//   shotsFired: number;
//   shotsHit: number;
//   shotsMissed: number;
//   scopedShotsFired: number;
//   scopedShotsHit: number;
//   weaponAccuracy: number;
//   heroTimePlayed: number;
// }

// export type PlayerStatsAggregated = Omit<PlayerStatFormatted, 'roundNumber'>;
