import {
  ObjectStoreNode,
  WriteNode,
  AlaSQLNode,
  DataNode,
  PartitionNode,
} from '../../WombatDataFramework/DataTypes';

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

export const NODES: DataNode<any>[] = [
  new ObjectStoreNode<any>('maps_object_store', 'Maps', 'maps', [
    'mapId',
    'name',
    'fileModified',
  ]),
  new ObjectStoreNode<MatchStart>(
    'match_start_object_store',
    'Match Start',
    'match_start',
    [
      'mapId',
      'type',
      'matchTime',
      'team1Name',
      'team2Name',
      'mapName',
      'mapType',
    ],
  ),
  new ObjectStoreNode<MatchEnd>(
    'match_end_object_store',
    'Match End',
    'match_end',
    ['mapId', 'type', 'matchTime', 'roundNumber', 'team1Score', 'team2Score'],
  ),
  new ObjectStoreNode<RoundStart>(
    'round_start_object_store',
    'Round Start',
    'round_start',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'team1Score',
      'team2Score',
      'objectiveIndex',
    ],
  ),
  new ObjectStoreNode<RoundEnd>(
    'round_end_object_store',
    'Round End',
    'round_end',
    [
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
    ],
  ),
  new ObjectStoreNode<SetupComplete>(
    'setup_complete_object_store',
    'Setup Complete',
    'setup_complete',
    ['mapId', 'type', 'matchTime', 'roundNumber', 'matchTimeRemaining'],
  ),
  new ObjectStoreNode<ObjectiveCaptured>(
    'objective_captured_object_store',
    'Objective Captured',
    'objective_captured',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'objectiveIndex',
      'controlTeam1Progress',
      'controlTeam2Progress',
      'matchTimeRemaining',
    ],
  ),
  new ObjectStoreNode<PointProgress>(
    'point_progress_object_store',
    'Point Progress',
    'point_progress',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'objectiveIndex',
      'pointCaptureProgress',
    ],
  ),
  new ObjectStoreNode<PayloadProgress>(
    'payload_progress_object_store',
    'Payload Progress',
    'payload_progress',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'objectiveIndex',
      'payloadCaptureProgress',
    ],
  ),
  new ObjectStoreNode<HeroSpawn>(
    'hero_spawn_object_store',
    'Hero Spawn',
    'hero_spawn',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'previousHero',
      'heroTimePlayed',
    ],
  ),
  new ObjectStoreNode<HeroSwap>(
    'hero_swap_object_store',
    'Hero Swap',
    'hero_swap',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'previousHero',
      'heroTimePlayed',
    ],
  ),
  new ObjectStoreNode<Ability1Used>(
    'ability_1_used_object_store',
    'Ability 1 Used',
    'ability_1_used',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new ObjectStoreNode<Ability2Used>(
    'ability_2_used_object_store',
    'Ability 2 Used',
    'ability_2_used',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new ObjectStoreNode<OffensiveAssist>(
    'offensive_assist_object_store',
    'Offensive Assist',
    'offensive_assist',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new ObjectStoreNode<DefensiveAssist>(
    'defensive_assist_object_store',
    'Defensive Assist',
    'defensive_assist',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new ObjectStoreNode<UltimateCharged>(
    'ultimate_charged_object_store',
    'Ultimate Charged',
    'ultimate_charged',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new ObjectStoreNode<UltimateStart>(
    'ultimate_start_object_store',
    'Ultimate Start',
    'ultimate_start',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),

  new ObjectStoreNode<UltimateEnd>(
    'ultimate_end_object_store',
    'Ultimate End',
    'ultimate_end',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new ObjectStoreNode<Kill>('kill_object_store', 'Kill', 'kill', [
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
  new ObjectStoreNode<Damage>('damage_object_store', 'Damage', 'damage', [
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
  new ObjectStoreNode<Healing>('healing_object_store', 'Healing', 'healing', [
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
  new ObjectStoreNode<MercyRez>(
    'mercy_rez_object_store',
    'Mercy Rez',
    'mercy_rez',
    [
      'mapId',
      'type',
      'matchTime',
      'mercyTeam',
      'mercyName',
      'revivedTeam',
      'revivedName',
      'revivedHero',
      'eventAbility',
    ],
  ),
  new ObjectStoreNode<EchoDuplicateStart>(
    'echo_duplicate_start_object_store',
    'Echo Duplicate Start',
    'echo_duplicate_start',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new ObjectStoreNode<EchoDuplicateEnd>(
    'echo_duplicate_end_object_store',
    'Echo Duplicate End',
    'echo_duplicate_end',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'ultimateId',
    ],
  ),
  new ObjectStoreNode<DvaDemech>(
    'dva_demech_object_store',
    'Dva Demech',
    'dva_demech',
    [
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
    ],
  ),
  new ObjectStoreNode<DvaRemech>(
    'dva_remech_object_store',
    'Dva Remech',
    'dva_remech',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'ultimateId',
    ],
  ),
  new ObjectStoreNode<RemechCharged>(
    'remech_charged_object_store',
    'Remech Charged',
    'remech_charged',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new ObjectStoreNode<any>(
    'player_stat_object_store',
    'Player Stat',
    'player_stat',
    [
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
    ],
  ),
  new WriteNode<any>('maps_write_node', 'Maps Input', 'maps', [
    'mapId',
    'name',
    'fileModified',
  ]),
  new WriteNode<MatchStart>(
    'match_start_write_node',
    'Match Start Input',
    'match_start',
    [
      'mapId',
      'type',
      'matchTime',
      'team1Name',
      'team2Name',
      'mapName',
      'mapType',
    ],
  ),
  new WriteNode<MatchEnd>(
    'match_end_write_node',
    'Match End Input',
    'match_end',
    ['mapId', 'type', 'matchTime', 'roundNumber', 'team1Score', 'team2Score'],
  ),
  new WriteNode<RoundStart>(
    'round_start_write_node',
    'Round Start Input',
    'round_start',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'team1Score',
      'team2Score',
      'objectiveIndex',
    ],
  ),
  new WriteNode<RoundEnd>(
    'round_end_write_node',
    'Round End Input',
    'round_end',
    [
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
    ],
  ),
  new WriteNode<SetupComplete>(
    'setup_complete_write_node',
    'Setup Complete Input',
    'setup_complete',
    ['mapId', 'type', 'matchTime', 'roundNumber', 'matchTimeRemaining'],
  ),
  new WriteNode<ObjectiveCaptured>(
    'objective_captured_write_node',
    'Objective Captured Input',
    'objective_captured',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'objectiveIndex',
      'controlTeam1Progress',
      'controlTeam2Progress',
      'matchTimeRemaining',
    ],
  ),
  new WriteNode<PointProgress>(
    'point_progress_write_node',
    'Point Progress Input',
    'point_progress',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'objectiveIndex',
      'pointCaptureProgress',
    ],
  ),
  new WriteNode<PayloadProgress>(
    'payload_progress_write_node',
    'Payload Progress Input',
    'payload_progress',
    [
      'mapId',
      'type',
      'matchTime',
      'roundNumber',
      'capturingTeam',
      'objectiveIndex',
      'payloadCaptureProgress',
    ],
  ),
  new WriteNode<HeroSpawn>(
    'hero_spawn_write_node',
    'Hero Spawn Input',
    'hero_spawn',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'previousHero',
      'heroTimePlayed',
    ],
  ),
  new WriteNode<HeroSwap>(
    'hero_swap_write_node',
    'Hero Swap Input',
    'hero_swap',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'previousHero',
      'heroTimePlayed',
    ],
  ),
  new WriteNode<Ability1Used>(
    'ability_1_used_write_node',
    'Ability 1 Used Input',
    'ability_1_used',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new WriteNode<Ability2Used>(
    'ability_2_used_write_node',
    'Ability 2 Used Input',
    'ability_2_used',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new WriteNode<OffensiveAssist>(
    'offensive_assist_write_node',
    'Offensive Assist Input',
    'offensive_assist',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new WriteNode<DefensiveAssist>(
    'defensive_assist_write_node',
    'Defensive Assist Input',
    'defensive_assist',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
    ],
  ),
  new WriteNode<UltimateCharged>(
    'ultimate_charged_write_node',
    'Ultimate Charged Input',
    'ultimate_charged',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new WriteNode<UltimateStart>(
    'ultimate_start_write_node',
    'Ultimate Start Input',
    'ultimate_start',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new WriteNode<UltimateEnd>(
    'ultimate_end_write_node',
    'Ultimate End Input',
    'ultimate_end',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new WriteNode<Kill>('kill_write_node', 'Kill Input', 'kill', [
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
  new WriteNode<Damage>('damage_write_node', 'Damage Input', 'damage', [
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
  new WriteNode<Healing>('healing_write_node', 'Healing Input', 'healing', [
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
  new WriteNode<MercyRez>(
    'mercy_rez_write_node',
    'Mercy Rez Input',
    'mercy_rez',
    [
      'mapId',
      'type',
      'matchTime',
      'mercyTeam',
      'mercyName',
      'revivedTeam',
      'revivedName',
      'revivedHero',
      'eventAbility',
    ],
  ),
  new WriteNode<EchoDuplicateStart>(
    'echo_duplicate_start_write_node',
    'Echo Duplicate Start Input',
    'echo_duplicate_start',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new WriteNode<EchoDuplicateEnd>(
    'echo_duplicate_end_write_node',
    'Echo Duplicate End Input',
    'echo_duplicate_end',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'ultimateId',
    ],
  ),
  new WriteNode<DvaDemech>(
    'dva_demech_write_node',
    'Dva Demech Input',
    'dva_demech',
    [
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
    ],
  ),
  new WriteNode<DvaRemech>(
    'dva_remech_write_node',
    'Dva Remech Input',
    'dva_remech',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'ultimateId',
    ],
  ),
  new WriteNode<RemechCharged>(
    'remech_charged_write_node',
    'Remech Charged Input',
    'remech_charged',
    [
      'mapId',
      'type',
      'matchTime',
      'playerTeam',
      'playerName',
      'playerHero',
      'heroDuplicated',
      'ultimateId',
    ],
  ),
  new WriteNode<PlayerStat>(
    'player_stat_write_node',
    'Player Stat Input',
    'player_stat',
    [
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
    ],
  ),
  new AlaSQLNode<MapTeams>(
    'map_teams',
    'Map Teams',
    `
  select 
   player_stat.mapId,
   player_stat.playerTeam as teamName,
   array(distinct player_stat.playerName) as teamPlayers
  from ? as player_stat
  group by player_stat.mapId, player_stat.playerTeam
  `,
    ['player_stat_object_store'],
    ['mapId', 'teamName', 'teamPlayers'],
  ),
  new AlaSQLNode<MapTeamsGrouped>(
    'map_teams_grouped',
    'Map Teams Grouped',
    `select
  map_teams.mapId,
  map_teams.teamName as team1Name,
  map_teams2.teamName as team2Name,
  map_teams.teamPlayers as team1Players,
  map_teams2.teamPlayers as team2Players
from ? as map_teams join ? as map_teams2
on map_teams.mapId = map_teams2.mapId
where map_teams.teamName < map_teams2.teamName
`,
    ['map_teams', 'map_teams'],
    ['mapId', 'team1Name', 'team2Name', 'team1Players', 'team2Players'],
  ),
  new AlaSQLNode<MapOverview>(
    'map_overview',
    'Map Overview',
    `
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
    [
      'match_start_object_store',
      'match_end_object_store',
      'maps_object_store',
      'map_teams_grouped',
    ],
    [
      'mapId',
      'mapName',
      'team1Name',
      'team2Name',
      'team1Score',
      'team2Score',
      'team1Players',
      'team2Players',
      'fileName',
      'timestamp',
    ],
  ),
  new PartitionNode<MapOverview, {scrimId: string}>(
    'map_overview_with_scrim_id',
    'Map Overview with Scrim ID',
    'scrimId',
    (map1: MapOverview, map2: MapOverview) => {
      return (
        map1.team1Name !== map2.team1Name || map1.team2Name !== map2.team2Name
      );
    },
    'map_overview',
    ['scrimId'],
  ),
  new AlaSQLNode<PlayerTimePlayed>(
    'player_time_played',
    'Player Time Played',
    `
      SELECT
          player_stat.playerName,
          player_stat.playerTeam,
          SUM(player_stat.timePlayed) as timePlayed
      FROM ? as player_stat
      GROUP BY player_stat.playerName, player_stat.playerTeam
      `,
    ['player_stat_object_store'],
    ['playerName', 'playerTeam', 'timePlayed'],
  ),
  new AlaSQLNode<PlayerStatFormatted>(
    'player_stat_formatted',
    'Player Stat Formatted',
    `
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
    ['player_stat_object_store'],
    [
      'mapId',
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
    ],
  ),
  new AlaSQLNode<ScrimPlayersHeroesRoles>(
    'scrim_players_heroes_roles',
    'Scrim Players Heroes Roles',
    `
      SELECT 
        map_overview_with_scrim_id.scrimId,
        ARRAY(if(map_overview_with_scrim_id.team1Name = player_stat_formatted.playerTeam, 1, 2))->0 as teamNumber,

        ARRAY(CASE 
          WHEN player_stat_formatted.playerHero = 'Mauga' THEN 1
          WHEN player_stat_formatted.playerHero = 'D.Va' THEN 1
          WHEN player_stat_formatted.playerHero = 'Orisa' THEN 1
          WHEN player_stat_formatted.playerHero = 'Reinhardt' THEN 1
          WHEN player_stat_formatted.playerHero = 'Roadhog' THEN 1
          WHEN player_stat_formatted.playerHero = 'Sigma' THEN 1
          WHEN player_stat_formatted.playerHero = 'Winston' THEN 1
          WHEN player_stat_formatted.playerHero = 'Wrecking Ball' THEN 1
          WHEN player_stat_formatted.playerHero = 'Zarya' THEN 1
          WHEN player_stat_formatted.playerHero = 'Doomfist' THEN 1
          WHEN player_stat_formatted.playerHero = 'Junker Queen' THEN 1
          WHEN player_stat_formatted.playerHero = 'Rammatra' THEN 1
          WHEN player_stat_formatted.playerHero = 'Ashe' THEN 2
          WHEN player_stat_formatted.playerHero = 'Bastion' THEN 2
          WHEN player_stat_formatted.playerHero = 'Cassidy' THEN 2
          WHEN player_stat_formatted.playerHero = 'Echo' THEN 2
          WHEN player_stat_formatted.playerHero = 'Genji' THEN 2
          WHEN player_stat_formatted.playerHero = 'Hanzo' THEN 2
          WHEN player_stat_formatted.playerHero = 'Junkrat' THEN 2
          WHEN player_stat_formatted.playerHero = 'Mei' THEN 2
          WHEN player_stat_formatted.playerHero = 'Pharah' THEN 2
          WHEN player_stat_formatted.playerHero = 'Reaper' THEN 2
          WHEN player_stat_formatted.playerHero = 'Soldier: 76' THEN 2
          WHEN player_stat_formatted.playerHero = 'Sojourn' THEN 2
          WHEN player_stat_formatted.playerHero = 'Sombra' THEN 2
          WHEN player_stat_formatted.playerHero = 'Symmetra' THEN 2
          WHEN player_stat_formatted.playerHero = 'Torbjörn' THEN 2
          WHEN player_stat_formatted.playerHero = 'Tracer' THEN 2
          WHEN player_stat_formatted.playerHero = 'Widowmaker' THEN 2
          WHEN player_stat_formatted.playerHero = 'Ana' THEN 3
          WHEN player_stat_formatted.playerHero = 'Baptiste' THEN 3
          WHEN player_stat_formatted.playerHero = 'Brigitte' THEN 3
          WHEN player_stat_formatted.playerHero = 'Lúcio' THEN 3
          WHEN player_stat_formatted.playerHero = 'Mercy' THEN 3
          WHEN player_stat_formatted.playerHero = 'Moira' THEN 3
          WHEN player_stat_formatted.playerHero = 'Zenyatta' THEN 3
          WHEN player_stat_formatted.playerHero = 'Lifeweaver' THEN 3
          WHEN player_stat_formatted.playerHero = 'Illari' THEN 3
          WHEN player_stat_formatted.playerHero = 'Kiriko' THEN 3
          ELSE 4
        END)->0 as roleNumber,
        player_stat_formatted.mapId as mapId,
        player_stat_formatted.playerTeam as teamName,
        map_overview_with_scrim_id.team1Name as team1Name,
        player_stat_formatted.playerName,
        ARRAY(CASE 
          WHEN player_stat_formatted.playerHero = 'Mauga' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'D.Va' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Orisa' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Reinhardt' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Roadhog' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Sigma' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Winston' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Wrecking Ball' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Zarya' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Doomfist' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Junker Queen' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Rammatra' THEN 'tank'
          WHEN player_stat_formatted.playerHero = 'Ashe' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Bastion' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Cassidy' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Echo' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Genji' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Hanzo' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Junkrat' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Mei' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Pharah' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Reaper' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Soldier: 76' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Sojourn' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Sombra' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Symmetra' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Torbjörn' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Tracer' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Widowmaker' THEN 'damage'
          WHEN player_stat_formatted.playerHero = 'Ana' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Baptiste' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Brigitte' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Lúcio' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Mercy' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Moira' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Zenyatta' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Lifeweaver' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Illari' THEN 'support'
          WHEN player_stat_formatted.playerHero = 'Kiriko' THEN 'support'
          ELSE 'unknown' 
        END)->0 as role,
        player_stat_formatted.playerHero as hero,
        sum(player_stat_formatted.finalBlows) as finalBlows,
        sum(player_stat_formatted.deaths) as deaths,
        sum(player_stat_formatted.heroDamageDealt) as damage,
        sum(player_stat_formatted.shotsFired) as shotsFired,
        sum(player_stat_formatted.shotsHit) / sum(player_stat_formatted.shotsFired) as accuracy
from ? as map_overview_with_scrim_id join ? as player_stat_formatted
on map_overview_with_scrim_id.mapId = player_stat_formatted.mapId
group by map_overview_with_scrim_id.scrimId,
player_stat_formatted.mapId,
player_stat_formatted.playerTeam,
map_overview_with_scrim_id.team1Name,
player_stat_formatted.playerName,
player_stat_formatted.playerHero
having sum(player_stat_formatted.shotsFired) > 0
`,
    ['map_overview_with_scrim_id', 'player_stat_formatted'],
    [
      'scrimId',
      'teamName',
      'playerName',
      'role',
      'hero',
      'finalBlows',
      'deaths',
    ],
  ),
];

interface MapTeams {
  mapId: number;
  teamName: string;
  teamPlayers: string[];
}

interface MapTeamsGrouped {
  mapId: number;
  team1Name: string;
  team2Name: string;
  team1Players: string[];
  team2Players: string[];
}

export interface MapOverview {
  mapId: number;
  scrimId: string;
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

export interface ScrimPlayersHeroesRoles {
  scrimId: string;
  teamName: string;
  playerName: string;
  role: string;
  hero: string;
  finalBlows: number;
  deaths: number;
}

export interface ScrimPlayers {
  scrimId: number;
  mapId: number;
  teamName: string;
  teamNumber: number;
  playerName: string;
  role: string;
  roleNumber: number;
  heroes: {
    hero: string;
    finalBlows: number;
    deaths: number;
    damage: number;
    accuracy: number;
    shotsFired: number;
  }[];
}

interface PlayerTimePlayed {
  playerName: string;
  playerTeam: string;
  timePlayed: number;
}

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
