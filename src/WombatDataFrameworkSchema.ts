import {ultimateAdvantageConfig, playerAliveAdvantageConfig} from './lib/AdvantageTrackers';
import {processTeamAdvantageEvents} from './lib/TeamAdvantageTracker';
import {
  DataColumn,
  makeDataColumn,
  makeRatioUnits,
  numberFormatter,
  numberComparator,
  stringFormatter,
  stringComparator,
  ObjectStoreNodeConfig,
  InputNodeConfig,
  FunctionNodeConfig,
  AlaSQLNodeConfig,
  booleanFormatter,
  booleanComparator,
  percentFormatter,
  objectComparator,
  objectFormatter,
  DataNodeInputMap,
  AlaSQLNode,
  DataManager,
  FunctionNode,
  IndexedDBNode,
  InputNode,
  ObjectStoreNode,
  timeFormatter,
} from 'wombat-data-framework';
import {parseFile, readFileAsync} from './lib/data/uploadfile';
import {INDEXED_DB_NODE_NAME, IndexedDBNodeConfig} from 'wombat-data-framework';
import { stringHash } from '~/lib/string';

interface BaseEvent {
  matchId: string;
  type: string;
  matchTime: number;
}

export interface MatchStartLogEvent extends BaseEvent {
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
}

export interface MatchEndLogEvent extends BaseEvent {
  roundNumber: number;
  team1Score: number;
  team2Score: number;
}

export interface RoundStartLogEvent extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
}

export interface RoundEndLogEvent extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
  controlTeam1Progress: number;
  controlTeam2Progress: number;
  matchTimeRemaining: number;
}

export interface SetupCompleteLogEvent extends BaseEvent {
  roundNumber: number;
  matchTimeRemaining: number;
}

export interface ObjectiveCapturedLogEvent extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  objectiveIndex: number;
  controlTeam1Progress: number;
  controlTeam2Progress: number;
  matchTimeRemaining: number;
}

export interface PointProgressLogEvent extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  objectiveIndex: number;
  pointCaptureProgress: number;
}

export interface PayloadProgressLogEvent extends BaseEvent {
  roundNumber: number;
  capturingTeam: string;
  objectiveIndex: number;
  payloadCaptureProgress: number;
}

export interface HeroSpawnLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}

export interface HeroSwapLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}

export interface Ability1UsedLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface Ability2UsedLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface OffensiveAssistLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface DefensiveAssistLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface UltimateChargedLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface UltimateStartLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface UltimateEndLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface KillLogEvent extends BaseEvent {
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

export interface DamageLogEvent extends BaseEvent {
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

export interface HealingLogEvent extends BaseEvent {
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

export interface MercyRezLogEvent extends BaseEvent {
  mercyTeam: string;
  mercyName: string;
  revivedTeam: string;
  revivedName: string;
  revivedHero: string;
  eventAbility: string;
}

export interface EchoDuplicateStartLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface EchoDuplicateEndLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}

export interface DvaDemechLogEvent extends BaseEvent {
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

export interface DvaRemechLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}

export interface RemechChargedLogEvent extends BaseEvent {
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface PlayerStatLogEvent extends BaseEvent {
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

const DATA_COLUMNS: DataColumn[] = [
  makeDataColumn('eliminationsPer10', 'Eliminations Per 10 Minutes', 'The number of eliminations per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('deathsPer10', 'Deaths Per 10 Minutes', 'The number of deaths per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('damagePer10', 'Damage Per 10 Minutes', 'The amount of damage dealt per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('healingPer10', 'Healing Per 10 Minutes', 'The amount of healing dealt per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('finalBlowsPer10', 'Final Blows Per 10 Minutes', 'The number of final blows per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('allDamagePer10', 'All Damage Dealt Per 10 Minutes', 'The total amount of damage dealt per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('selfHealingPer10', 'Self Healing Per 10 Minutes', 'The amount of self healing per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('damageTakenPer10', 'Damage Taken Per 10 Minutes', 'The amount of damage taken per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('damageBlockedPer10', 'Damage Blocked Per 10 Minutes', 'The amount of damage blocked per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('defensiveAssistsPer10', 'Defensive Assists Per 10 Minutes', 'The number of defensive assists per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('offensiveAssistsPer10', 'Offensive Assists Per 10 Minutes', 'The number of offensive assists per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimatesEarnedPer10', 'Ultimates Earned Per 10 Minutes', 'The number of ultimates earned per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimatesUsedPer10', 'Ultimates Used Per 10 Minutes', 'The number of ultimates used per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('multikillsPer10', 'Multikills Per 10 Minutes', 'The number of multikills per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('soloKillsPer10', 'Solo Kills Per 10 Minutes', 'The number of solo kills per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('objectiveKillsPer10', 'Objective Kills Per 10 Minutes', 'The number of objective kills per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('environmentalKillsPer10', 'Environmental Kills Per 10 Minutes', 'The number of environmental kills per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('environmentalDeathsPer10', 'Environmental Deaths Per 10 Minutes', 'The number of environmental deaths per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('criticalHitsPer10', 'Critical Hits Per 10 Minutes', 'The number of critical hits per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn(
    'scopedCriticalHitKillsPer10',
    'Scoped Critical Hit Kills Per 10 Minutes',
    'The number of scoped critical hits kills per 10 minutes.',
    makeRatioUnits('count', '10m'),
    'number',
    numberFormatter,
    numberComparator,
  ),
  makeDataColumn('scopedShotsFiredPer10', 'Scoped Shots Fired Per 10 Minutes', 'The number of scoped shots fired per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('scopedShotsHitPer10', 'Scoped Shots Hit Per 10 Minutes', 'The number of scoped shots hit per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('shotsFiredPer10', 'Shots Fired Per 10 Minutes', 'The number of shots fired per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('shotsHitPer10', 'Shots Hit Per 10 Minutes', 'The number of shots hit per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('shotsMissedPer10', 'Shots Missed Per 10 Minutes', 'The number of shots missed per 10 minutes.', makeRatioUnits('count', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('barrierDamageDealtPer10', 'Barrier Damage Dealt Per 10 Minutes', 'The amount of damage dealt to the barrier per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('heroDamagePer10', 'Hero Damage Dealt Per 10 Minutes', 'The amount of damage dealt to heroes per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('healingReceivedPer10', 'Healing Received Per 10 Minutes', 'The amount of healing received per 10 minutes.', makeRatioUnits('hp', '10m'), 'number', numberFormatter, numberComparator),
  makeDataColumn('playerInteractionEventTime', 'Player Interaction Event Time', 'The time the player interaction event occurred.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('playerInteractionEventType', 'Player Interaction Event Type', 'The type of the player interaction event.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('otherPlayerName', 'Other Player Name', 'The name of the other player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('playerEventTime', 'Player Event Time', 'The time the event occurred.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('playerEventType', 'Player Event Type', 'The type of the event.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('roundStartTime', 'Round Start Time', 'The time the round started.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('roundEndTime', 'Round End Time', 'The time the round ended.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('roundDuration', 'Round Duration', 'The duration of the round.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('roundSetupCompleteTime', 'Round Setup Complete Time', 'The time the round setup was completed.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('allDamageDealt', 'All Damage Dealt', 'The total amount of damage dealt.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('attackerHero', 'Attacker Hero', 'The hero of the attacking player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('attackerName', 'Attacker Name', 'The name of the attacking player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('attackerTeam', 'Attacker Team', 'The team of the attacking player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('barrierDamageDealt', 'Barrier Damage Dealt', 'The amount of damage dealt to the barrier.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('capturingTeam', 'Capturing Team', 'The team capturing the objective.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('controlTeam1Progress', 'Control Team 1 Progress', 'The progress of the control team 1.', 'cap%', 'number', percentFormatter, numberComparator),
  makeDataColumn('controlTeam2Progress', 'Control Team 2 Progress', 'The progress of the control team 2.', 'cap%', 'number', percentFormatter, numberComparator),
  makeDataColumn('criticalHitAccuracy', 'Critical Hit Accuracy', 'The accuracy of critical hits.', 'acc%', 'number', percentFormatter, numberComparator),
  makeDataColumn('criticalHits', 'Critical Hits', 'The number of critical hits.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('damageBlocked', 'Damage Blocked', 'The amount of damage blocked.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('damageTaken', 'Damage Taken', 'The amount of damage taken.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('deaths', 'Deaths', 'The number of deaths.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('defensiveAssists', 'Defensive Assists', 'The number of defensive assists.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('eliminations', 'Eliminations', 'The number of eliminations.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('environmentalDeaths', 'Environmental Deaths', 'The number of environmental deaths.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('environmentalKills', 'Environmental Kills', 'The number of environmental kills.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('eventAbility', 'Event Ability', 'The ability that was used.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('eventDamage', 'Event Damage', 'The amount of damage dealt.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('eventHealing', 'Event Healing', 'The amount of healing dealt.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('file', 'File', 'The file object.', 'none', 'string', objectFormatter, objectComparator),
  makeDataColumn('fileContent', 'File Content', 'The content of the file.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('fileName', 'File Name', 'The name of the file.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('fileModified', 'File Modified', 'The date the file was last modified.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('finalBlows', 'Final Blows', 'The number of final blows.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('healeeHero', 'Healee Hero', 'The hero of the healee player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('healeeName', 'Healee Name', 'The name of the healee player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('healeeTeam', 'Healee Team', 'The team of the healee player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('healerHero', 'Healer Hero', 'The hero of the healer player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('healerName', 'Healer Name', 'The name of the healer player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('healerTeam', 'Healer Team', 'The team of the healer player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('healingDealt', 'Healing Dealt', 'The amount of healing dealt.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('healingReceived', 'Healing Received', 'The amount of healing received.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('heroDamageDealt', 'Hero Damage Dealt', 'The amount of damage dealt to the hero.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('heroDuplicated', 'Hero Duplicated', 'The name of the hero that was duplicated.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('heroTimePlayed', 'Hero Time Played (s)', 'The time in seconds the hero was played.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('isCriticalHit', 'Is Critical Hit', 'Whether the attack was a critical hit.', 'none', 'boolean', booleanFormatter, booleanComparator),
  makeDataColumn('isEnvironmental', 'Is Environmental', 'Whether the attack was environmental.', 'none', 'boolean', booleanFormatter, booleanComparator),
  makeDataColumn('isHealthPack', 'Is Health Pack', 'Whether the healing was from a health pack.', 'none', 'boolean', booleanFormatter, booleanComparator),
  makeDataColumn('logs', 'Logs', 'The logs from the file.', 'none', 'string', objectFormatter, objectComparator),
  makeDataColumn('mapDuration', 'Map Duration', 'The duration of the map.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('mapEndTime', 'Map End Time', 'The time the map ended.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('matchId', 'Map ID', 'The ID of the map, generated from the input log file.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('map', 'Map', 'The name of the map.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('mapName', 'Map Name', 'The name of the map.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('mapStartTime', 'Map Start Time', 'The time the map started.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('mode', 'Mode', 'The game mode of the map.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('mapType', 'Map Type', 'The type of the map.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('matchTime', 'Match Time (s)', 'The time in seconds since the start of the match.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('matchTimeRemaining', 'Match Time Remaining (s)', 'The time remaining in the match.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('mercyName', 'Mercy Name', 'The name of the mercy player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('mercyPlayer', 'Mercy Player', 'The name of the mercy player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('mercyTeam', 'Mercy Team', 'The team of the mercy player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('multikillBest', 'Multikill Best', 'The highest multikill.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('multikills', 'Multikills', 'The number of multikills.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('name', 'Log File Name', 'The name of the log file.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('objectiveIndex', 'Objective Index', 'The index of the objective.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('objectiveKills', 'Objective Kills', 'The number of objective kills.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('offensiveAssists', 'Offensive Assists', 'The number of offensive assists.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('payloadCaptureProgress', 'Payload Capture Progress', 'The progress of the payload capture.', 'cap%', 'number', percentFormatter, numberComparator),
  makeDataColumn('playerHero', 'Player Hero', 'The hero of the player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('playerName', 'Player Name', 'The name of the player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('playerTeam', 'Player Team', 'The team of the player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('playerRole', 'Player Role', 'The role of the player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('pointCaptureProgress', 'Point Capture Progress', 'The progress of the point capture.', 'cap%', 'number', percentFormatter, numberComparator),
  makeDataColumn('previousHero', 'Previous Hero', 'The name of the hero that was previously selected.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('revivedHero', 'Revived Hero', 'The hero of the revived player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('revivedName', 'Revived Name', 'The name of the revived player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('revivedTeam', 'Revived Team', 'The team of the revived player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('roundNumber', 'Round Number', 'The number of the round.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('scopedAccuracy', 'Scoped Accuracy', 'The accuracy of scoped shots.', 'acc%', 'number', percentFormatter, numberComparator),
  makeDataColumn('scopedCriticalHitAccuracy', 'Scoped Critical Hit Accuracy', 'The accuracy of scoped critical hits.', 'acc%', 'number', percentFormatter, numberComparator),
  makeDataColumn('scopedCriticalHitKills', 'Scoped Critical Hit Kills', 'The number of scoped critical hits kills.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('scopedShotsFired', 'Scoped Shots Fired', 'The number of scoped shots fired.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('scopedShotsHit', 'Scoped Shots Hit', 'The number of scoped shots hit.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('selfHealing', 'Self Healing', 'The amount of self healing.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('shotsFired', 'Shots Fired', 'The number of shots fired.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('shotsHit', 'Shots Hit', 'The number of shots hit.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('shotsMissed', 'Shots Missed', 'The number of shots missed.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('soloKills', 'Solo Kills', 'The number of solo kills.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('team1Count', 'Team 1 Count', 'The count for team 1.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('team1Name', 'Team 1 Name', 'The name of team 1.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('team1Score', 'Team 1 Score', 'The score of team 1.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('team2Count', 'Team 2 Count', 'The count for team 2.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('teamWithAdvantage', 'Team with Advantage', 'The team with the advantage.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('diff', 'Difference', 'The difference between the two teams.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('team2Name', 'Team 2 Name', 'The name of team 2.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('team2Score', 'Team 2 Score', 'The score of team 2.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('type', 'Type', 'The type of the event.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('ultimateChargedTime', 'Ultimate Charged Time (s)', 'The match time the ultimate was charged.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('ultimateEndTime', 'Ultimate End Time (s)', 'The match time the ultimate was ended.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('ultimateHoldTime', 'Ultimate Hold Time (s)', 'The time the ultimate was held.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('ultimateId', 'Ultimate ID', 'The ID of the ultimate ability.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimateStartTime', 'Ultimate Start Time (s)', 'The match time the ultimate was started.', 's', 'number', timeFormatter, numberComparator),
  makeDataColumn('ultimatesEarned', 'Ultimates Earned', 'The number of ultimates earned.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimatesUsed', 'Ultimates Used', 'The number of ultimates used.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('victimHero', 'Victim Hero', 'The hero of the victim player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('victimName', 'Victim Name', 'The name of the victim player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('victimTeam', 'Victim Team', 'The team of the victim player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('weaponAccuracy', 'Weapon Accuracy', 'The accuracy of the weapon.', 'acc%', 'number', percentFormatter, numberComparator),
  makeDataColumn('weaponAccuracyBest', 'Weapon Accuracy Best', 'The highest weapon accuracy.', 'acc%', 'number', percentFormatter, numberComparator),
  makeDataColumn('finalBlowsPerDeaths', 'Final Blows per Deaths', 'The number of final blows per deaths.', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('damageTakenPerDeaths', 'Damage Taken per Deaths', 'The amount of damage taken per deaths.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('allDamageDealtPerDamageTaken', 'All Damage Dealt per Damage Taken', 'The total amount of damage dealt per damage taken.', 'hp', 'number', numberFormatter, numberComparator),
  makeDataColumn('chargedUltimateCount', 'Charged Ultimate Count', 'Number of charged ultimates for a team at a given time', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('dateString', 'Date', 'The date of the match.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('timeString', 'Time', 'The time of the match.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('matchIds', 'Match IDs', 'The IDs of the matches.', 'none', 'object', objectFormatter, objectComparator),
  ];

// const playerStatFragment = `
//       SUM(player_stat.eliminations) as eliminations,
//       SUM(player_stat.finalBlows) as finalBlows,
//       SUM(player_stat.deaths) as deaths,
//       IF(SUM(player_stat.deaths) = 0, 0, SUM(player_stat.finalBlows) / SUM(player_stat.deaths)) as finalBlowsPerDeaths,
//       IF(SUM(player_stat.damageTaken) = 0, 0, SUM(player_stat.damageTaken) / SUM(player_stat.deaths)) as damageTakenPerDeaths,
//       IF(SUM(player_stat.allDamageDealt) = 0, 0, SUM(player_stat.allDamageDealt) / SUM(player_stat.damageTaken)) as allDamageDealtPerDamageTaken,
//       SUM(player_stat.allDamageDealt) as allDamageDealt,
//       SUM(player_stat.barrierDamageDealt) as barrierDamageDealt,
//       SUM(player_stat.heroDamageDealt) as heroDamageDealt,
//       SUM(player_stat.healingDealt) as healingDealt,
//       SUM(player_stat.healingReceived) as healingReceived,
//       SUM(player_stat.selfHealing) as selfHealing,
//       SUM(player_stat.damageTaken) as damageTaken,
//       SUM(player_stat.damageBlocked) as damageBlocked,
//       SUM(player_stat.defensiveAssists) as defensiveAssists,
//       SUM(player_stat.offensiveAssists) as offensiveAssists,
//       SUM(player_stat.ultimatesEarned) as ultimatesEarned,
//       SUM(player_stat.ultimatesUsed) as ultimatesUsed,
//       MAX(player_stat.multikillBest) as multikillBest,
//       SUM(player_stat.multikills) as multikills,
//       SUM(player_stat.soloKills) as soloKills,
//       SUM(player_stat.objectiveKills) as objectiveKills,
//       SUM(player_stat.environmentalKills) as environmentalKills,
//       SUM(player_stat.environmentalDeaths) as environmentalDeaths,
//       SUM(player_stat.criticalHits) as criticalHits,
//       SUM(player_stat.scopedCriticalHitKills) as scopedCriticalHitKills,
//       SUM(player_stat.shotsFired) as shotsFired,
//       SUM(player_stat.shotsHit) as shotsHit,
//       SUM(player_stat.shotsMissed) as shotsMissed,
//       SUM(player_stat.scopedShotsFired) as scopedShotsFired,
//       SUM(player_stat.scopedShotsHit) as scopedShotsHit,
//       SUM(player_stat.eliminations) / SUM(round_times.roundDuration) * 600 as eliminationsPer10,
//       SUM(player_stat.finalBlows) / SUM(round_times.roundDuration) * 600 as finalBlowsPer10,
//       SUM(player_stat.deaths) / SUM(round_times.roundDuration) * 600 as deathsPer10,
//       SUM(player_stat.allDamageDealt) / SUM(round_times.roundDuration) * 600 as allDamagePer10,
//       SUM(player_stat.heroDamageDealt) / SUM(round_times.roundDuration) * 600 as heroDamagePer10,
//       SUM(player_stat.barrierDamageDealt) / SUM(round_times.roundDuration) * 600 as barrierDamageDealtPer10,
//       SUM(player_stat.healingDealt) / SUM(round_times.roundDuration) * 600 as healingPer10,
//       SUM(player_stat.healingReceived) / SUM(round_times.roundDuration) * 600 as healingReceivedPer10,
//       SUM(player_stat.selfHealing) / SUM(round_times.roundDuration) * 600 as selfHealingPer10,
//       SUM(player_stat.damageTaken) / SUM(round_times.roundDuration) * 600 as damageTakenPer10,
//       SUM(player_stat.damageBlocked) / SUM(round_times.roundDuration) * 600 as damageBlockedPer10,
//       SUM(player_stat.defensiveAssists) / SUM(round_times.roundDuration) * 600 as defensiveAssistsPer10,
//       SUM(player_stat.offensiveAssists) / SUM(round_times.roundDuration) * 600 as offensiveAssistsPer10,
//       SUM(player_stat.ultimatesEarned) / SUM(round_times.roundDuration) * 600 as ultimatesEarnedPer10,
//       SUM(player_stat.ultimatesUsed) / SUM(round_times.roundDuration) * 600 as ultimatesUsedPer10,
//       SUM(player_stat.multikillBest) / SUM(round_times.roundDuration) * 600 as multikillsPer10,
//       SUM(player_stat.multikills) / SUM(round_times.roundDuration) * 600 as multikillsPer10,
//       SUM(player_stat.soloKills) / SUM(round_times.roundDuration) * 600 as soloKillsPer10,
//       SUM(player_stat.objectiveKills) / SUM(round_times.roundDuration) * 600 as objectiveKillsPer10,
//       SUM(player_stat.environmentalKills) / SUM(round_times.roundDuration) * 600 as environmentalKillsPer10,
//       SUM(player_stat.environmentalDeaths) / SUM(round_times.roundDuration) * 600 as environmentalDeathsPer10,
//       SUM(player_stat.criticalHits) / SUM(round_times.roundDuration) * 600 as criticalHitsPer10,
//       SUM(player_stat.scopedCriticalHitKills) / SUM(round_times.roundDuration) * 600 as scopedCriticalHitKillsPer10,
//       SUM(player_stat.shotsFired) / SUM(round_times.roundDuration) * 600 as shotsFiredPer10,
//       SUM(player_stat.shotsHit) / SUM(round_times.roundDuration) * 600 as shotsHitPer10,
//       SUM(player_stat.shotsMissed) / SUM(round_times.roundDuration) * 600 as shotsMissedPer10,
//       SUM(player_stat.scopedShotsFired) / SUM(round_times.roundDuration) * 600 as scopedShotsFiredPer10,
//       SUM(player_stat.scopedShotsHit) / SUM(round_times.roundDuration) * 600 as scopedShotsHitPer10
// `;

// const playerStatColumns: string[] = [
//   'eliminations',
//   'finalBlows',
//   'deaths',
//   'finalBlowsPerDeaths',
//   'damageTakenPerDeaths',
//   'allDamageDealtPerDamageTaken',
//   'allDamageDealt',
//   'heroDamageDealt',
//   'barrierDamageDealt',
//   'healingDealt',
//   'healingReceived',
//   'selfHealing',
//   'damageTaken',
//   'damageBlocked',
//   'defensiveAssists',
//   'offensiveAssists',
//   'ultimatesEarned',
//   'ultimatesUsed',
//   'multikills',
//   'multikillBest',
//   'soloKills',
//   'objectiveKills',
//   'environmentalKills',
//   'environmentalDeaths',
//   'criticalHits',
//   'scopedCriticalHitKills',
//   'shotsFired',
//   'shotsHit',
//   'shotsMissed',
//   'scopedShotsFired',
//   'scopedShotsHit',
//   'eliminationsPer10',
//   'finalBlowsPer10',
//   'deathsPer10',
//   'allDamagePer10',
//   'heroDamagePer10',
//   'barrierDamageDealtPer10',
//   'healingPer10',
//   'healingReceivedPer10',
//   'selfHealingPer10',
//   'damageTakenPer10',
//   'damageBlockedPer10',
//   'defensiveAssistsPer10',
//   'offensiveAssistsPer10',
//   'ultimatesEarnedPer10',
//   'ultimatesUsedPer10',
//   'multikillsPer10',
//   'soloKillsPer10',
//   'objectiveKillsPer10',
//   'environmentalKillsPer10',
//   'environmentalDeathsPer10',
//   'criticalHitsPer10',
//   'scopedCriticalHitKillsPer10',
//   'shotsFiredPer10',
//   'shotsHitPer10',
//   'shotsMissedPer10',
//   'scopedShotsFiredPer10',
//   'scopedShotsHitPer10',
// ];

// function getAllCombinations(inputArray: string[]): string[][] {
//   let result: string[][] = [];
//   const combinationsCount = 2 ** inputArray.length;

//   for (let i = 0; i < combinationsCount; i++) {
//     const combination: string[] = [];
//     for (let j = 0; j < inputArray.length; j++) {
//       if (i & (1 << j)) {
//         // Check if the jth bit is set
//         combination.push(inputArray[j]);
//       }
//     }
//     result.push(combination);
//   }

//   result = result.filter((group) => !((group.includes('roundNumber') && !group.includes('matchId')) || (!group.includes('playerRole') && group.includes('playerHero'))));

//   // sort the combinations by length
//   result.sort((a, b) => a.length - b.length);

//   return result;
// }

// const player_stat_groups: string[][] = getAllCombinations(['matchId', 'roundNumber', 'playerName', 'playerTeam', 'playerHero', 'playerRole']);

const indexedDbNode: IndexedDBNodeConfig = {
  name: INDEXED_DB_NODE_NAME,
  type: 'IndexedDBNode',
  displayName: 'Indexed DB',
  outputType: 'Multiple',
  databaseName: 'scrimsight',
  version: 5,
  columnNames: [],
  objectStores: [],
};

interface LogFileInputNodeData {
  file: File;
}
const logFileInputNode: InputNodeConfig<LogFileInputNodeData> = {
  name: 'log_file_input',
  type: 'InputNode',
  displayName: 'Log File Input',
  outputType: 'Multiple',
  behavior: 'Append',
  columnNames: ['file'],
};

interface LogFileLoaderOutput {
  fileName: string;
  fileModified: number;
  fileContent: string;
}
const logFileLoaderNode: FunctionNodeConfig<LogFileLoaderOutput> = {
  name: 'log_file_loader',
  type: 'FunctionNode',
  displayName: 'Log File Loader',
  outputType: 'Multiple',
  sources: ['log_file_input'],
  transform: async (data: DataNodeInputMap) => {
    const fileContents = await Promise.all((data['log_file_input'] as File[]).map((file) => readFileAsync(file)));
    return fileContents.map((content: string, index: number) => ({
      fileName: (data['log_file_input'] as File[])[index].name,
      fileModified: (data['log_file_input'] as File[])[index].lastModified,
      fileContent: content,
    }));
  },
  columnNames: ['fileName', 'fileContent', 'fileModified'],
};

interface LogFileParserOutput {
  fileName: string;
  matchId: string;
  logs: {specName: string; data: object}[];
  fileModified: number;
}

const logFileParserNode: FunctionNodeConfig<LogFileParserOutput> = {
  name: 'log_file_parser',
  type: 'FunctionNode',
  displayName: 'Log File Parser',
  outputType: 'Multiple',
  sources: ['log_file_loader'],
  transform: async (data: DataNodeInputMap) =>
    (data['log_file_loader'] as LogFileLoaderOutput[]).map((file) => {
      const {logs} = parseFile(file.fileContent);
      return {
        fileName: file.fileName,
        matchId: stringHash(file.fileContent).toString(),
        logs,
        fileModified: file.fileModified,
      };
    }),
  columnNames: ['fileName', 'matchId', 'logs', 'fileModified'],
};

export interface MatchFileInfo {
  matchId: string;
  name: string;
  fileModified: number;
  dateString: string;
  timeString: string;
}

const match_extractor: FunctionNodeConfig<MatchFileInfo> = {
  name: 'match_extractor',
  type: 'FunctionNode',
  displayName: 'Match Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as LogFileParserOutput[]).map((file) => {
    const matchId = file.matchId;
    const name = file.fileName;
    const fileModified = file.fileModified;
    const date = new Date(fileModified);
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return {matchId, name, fileModified, dateString, timeString};
  }),
  columnNames: ['matchId', 'name', 'fileModified', 'dateString', 'timeString']
};


// Update the extractEventType function to return the correct type
const extractEventType = <T extends BaseEvent>(type: string, logs: {specName: string; data: object}[]): T[]=> {
  const log = logs.find((log) => log.specName === type);
  if (log === undefined) {
    return [];
  }
  return log.data as T[];
};



const match_start_extractor: FunctionNodeConfig<MatchStartLogEvent> = {
  name: 'match_start_extractor',
  type: 'FunctionNode',
  displayName: 'Match Start Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file) => extractEventType<MatchStartLogEvent>('match_start', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'mapName', 'mapType', 'team1Name', 'team2Name'],
};

const match_end_extractor: FunctionNodeConfig<MatchEndLogEvent> = {
  name: 'match_end_extractor',
  type: 'FunctionNode',
  displayName: 'Match End Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data: DataNodeInputMap) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<MatchEndLogEvent>('match_end', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'roundNumber', 'team1Score', 'team2Score'],
};

const objective_captured_extractor: FunctionNodeConfig<ObjectiveCapturedLogEvent> = {
  name: 'objective_captured_extractor',
  type: 'FunctionNode',
  displayName: 'Objective Captured Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<ObjectiveCapturedLogEvent>('objective_captured', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'controlTeam1Progress', 'controlTeam2Progress', 'matchTimeRemaining'],
};

const offensive_assist_extractor: FunctionNodeConfig<OffensiveAssistLogEvent> = {
  name: 'offensive_assist_extractor',
  type: 'FunctionNode',
  displayName: 'Offensive Assist Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<OffensiveAssistLogEvent>('offensive_assist', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated'],
};

const payload_progress_extractor: FunctionNodeConfig<PayloadProgressLogEvent> = {
  name: 'payload_progress_extractor',
  type: 'FunctionNode',
  displayName: 'Payload Progress Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<PayloadProgressLogEvent>('payload_progress', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'payloadCaptureProgress'],
};

const player_stat_extractor: FunctionNodeConfig<PlayerStatLogEvent> = {
  name: 'player_stat_extractor',
  type: 'FunctionNode',
  displayName: 'Player Stat Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<PlayerStatLogEvent>('player_stat', file.logs)),
  columnNames: [
    'matchId',
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
  ],
};

const point_progress_extractor: FunctionNodeConfig<PointProgressLogEvent> = {
  name: 'point_progress_extractor',
  type: 'FunctionNode',
  displayName: 'Point Progress Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<PointProgressLogEvent>('point_progress', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'pointCaptureProgress'],
};

const remech_charged_extractor: FunctionNodeConfig<RemechChargedLogEvent> = {
  name: 'remech_charged_extractor',
  type: 'FunctionNode',
  displayName: 'Remech Charged Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<RemechChargedLogEvent>('remech_charged', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId'],
};

const round_end_extractor: FunctionNodeConfig<RoundEndLogEvent> = {
  name: 'round_end_extractor',
  type: 'FunctionNode',
  displayName: 'Round End Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType('round_end', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'team1Score', 'team2Score', 'objectiveIndex', 'controlTeam1Progress', 'controlTeam2Progress', 'matchTimeRemaining'],
};

const round_start_extractor: FunctionNodeConfig<RoundStartLogEvent> = {
  name: 'round_start_extractor',
  type: 'FunctionNode',
  displayName: 'Round Start Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<RoundStartLogEvent>('round_start', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'team1Score', 'team2Score'],
};

const setup_complete_extractor: FunctionNodeConfig<SetupCompleteLogEvent> = {
  name: 'setup_complete_extractor',
  type: 'FunctionNode',
  displayName: 'Setup Complete Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<SetupCompleteLogEvent>('setup_complete', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'roundNumber', 'matchTimeRemaining'],
};

const ultimate_charged_extractor: FunctionNodeConfig<UltimateChargedLogEvent> = {
  name: 'ultimate_charged_extractor',
  type: 'FunctionNode',
  displayName: 'Ultimate Charged Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<UltimateChargedLogEvent>('ultimate_charged', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId'],
};

const ultimate_end_extractor: FunctionNodeConfig<UltimateEndLogEvent> = {
  name: 'ultimate_end_extractor',
  type: 'FunctionNode',
  displayName: 'Ultimate End Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<UltimateEndLogEvent>('ultimate_end', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId'],
};

const ultimate_start_extractor: FunctionNodeConfig<UltimateStartLogEvent> = {
  name: 'ultimate_start_extractor',
  type: 'FunctionNode',
  displayName: 'Ultimate Start Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<UltimateStartLogEvent>('ultimate_start', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId'],
};

const kill_extractor: FunctionNodeConfig<KillLogEvent> = {
  name: 'kill_extractor',
  type: 'FunctionNode',
  displayName: 'Kill Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<KillLogEvent>('kill', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'attackerTeam', 'attackerName', 'attackerHero', 'victimTeam', 'victimName', 'victimHero', 'eventAbility', 'eventDamage', 'isCriticalHit', 'isEnvironmental'],
};

const damage_extractor: FunctionNodeConfig<DamageLogEvent> = {
  name: 'damage_extractor',
  type: 'FunctionNode',
  displayName: 'Damage Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<DamageLogEvent>('damage', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'attackerTeam', 'attackerName', 'attackerHero', 'victimTeam', 'victimName', 'victimHero', 'eventAbility', 'eventDamage', 'isCriticalHit', 'isEnvironmental'],
};

const healing_extractor: FunctionNodeConfig<HealingLogEvent> = {
  name: 'healing_extractor',
  type: 'FunctionNode',
  displayName: 'Healing Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<HealingLogEvent>('healing', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'healerTeam', 'healerName', 'healerHero', 'healeeTeam', 'healeeName', 'healeeHero', 'eventAbility', 'eventHealing', 'isHealthPack'],
};

const mercy_rez_extractor: FunctionNodeConfig<MercyRezLogEvent> = {
  name: 'mercy_rez_extractor',
  type: 'FunctionNode',
  displayName: 'Mercy Rez Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<MercyRezLogEvent>('mercy_rez', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'mercyTeam', 'mercyName', 'revivedTeam', 'revivedName', 'revivedHero', 'eventAbility'],
};

const echo_duplicate_end_extractor: FunctionNodeConfig<EchoDuplicateEndLogEvent> = {
  name: 'echo_duplicate_end_extractor',
  type: 'FunctionNode',
  displayName: 'Echo Duplicate End Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<EchoDuplicateEndLogEvent>('echo_duplicate_end', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'ultimateId'],
};

const echo_duplicate_start_extractor: FunctionNodeConfig<EchoDuplicateStartLogEvent> = {
  name: 'echo_duplicate_start_extractor',
  type: 'FunctionNode',
  displayName: 'Echo Duplicate Start Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<EchoDuplicateStartLogEvent>('echo_duplicate_start', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId'],
};

const dva_demech_extractor: FunctionNodeConfig<DvaDemechLogEvent> = {
  name: 'dva_demech_extractor',
  type: 'FunctionNode',
  displayName: 'Dva Demech Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<DvaDemechLogEvent>('dva_demech', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'attackerTeam', 'attackerName', 'attackerHero', 'victimTeam', 'victimName', 'victimHero', 'eventAbility', 'eventDamage', 'isCriticalHit', 'isEnvironmental'],
};

const dva_remech_extractor: FunctionNodeConfig<DvaRemechLogEvent> = {
  name: 'dva_remech_extractor',
  type: 'FunctionNode',
  displayName: 'Dva Remech Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType<DvaRemechLogEvent>('dva_remech', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'ultimateId'],
};

const hero_spawn_extractor: FunctionNodeConfig<HeroSpawnLogEvent> = {
  name: 'hero_spawn_extractor',
  type: 'FunctionNode',
  displayName: 'Hero Spawn Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType('hero_spawn', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'previousHero', 'heroTimePlayed'],
};

const hero_swap_extractor: FunctionNodeConfig<HeroSwapLogEvent> = {
  name: 'hero_swap_extractor',
  type: 'FunctionNode',
  displayName: 'Hero Swap Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType('hero_swap', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'previousHero', 'heroTimePlayed'],
};

const ability_1_used_extractor: FunctionNodeConfig<Ability1UsedLogEvent> = {
  name: 'ability_1_used_extractor',
  type: 'FunctionNode',
  displayName: 'Ability 1 Used Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType('ability_1_used', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated'],
};

const ability_2_used_extractor: FunctionNodeConfig<Ability2UsedLogEvent> = {
  name: 'ability_2_used_extractor',
  type: 'FunctionNode',
  displayName: 'Ability 2 Used Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType('ability_2_used', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated'],
};

const defensive_assist_extractor: FunctionNodeConfig<DefensiveAssistLogEvent> = {
  name: 'defensive_assist_extractor',
  type: 'FunctionNode',
  displayName: 'Defensive Assist Extractor',
  outputType: 'Multiple',
  sources: ['log_file_parser'],
  transform: async (data) => (data['log_file_parser'] as {logs: {specName: string; data: object}[]}[]).flatMap((file: {logs: {specName: string; data: object}[]}) => extractEventType('defensive_assist', file.logs)),
  columnNames: ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated'],
};

const FILE_PARSING_NODES: (InputNodeConfig<any> | FunctionNodeConfig<any>)[] = [
  logFileInputNode,
  logFileLoaderNode,
  logFileParserNode,
  match_extractor,
  ability_1_used_extractor,
  ability_2_used_extractor,
  damage_extractor,
  defensive_assist_extractor,
  dva_demech_extractor,
  dva_remech_extractor,
  echo_duplicate_end_extractor,
  echo_duplicate_start_extractor,
  healing_extractor,
  hero_spawn_extractor,
  hero_swap_extractor,
  kill_extractor,
  match_end_extractor,
  match_start_extractor,
  mercy_rez_extractor,
  objective_captured_extractor,
  offensive_assist_extractor,
  payload_progress_extractor,
  player_stat_extractor,
  point_progress_extractor,
  remech_charged_extractor,
  round_end_extractor,
  round_start_extractor,
  setup_complete_extractor,
  ultimate_charged_extractor,
  ultimate_end_extractor,
  ultimate_start_extractor,
];

function makeObjectStoreNodeConfig<T>(name: string, displayName: string, objectStore: string, columnNames: (keyof T)[]): ObjectStoreNodeConfig<T> {
  return {
    name,
    displayName,
    objectStore,
    columnNames,
    behavior: 'Append',
    source: `${objectStore}_extractor`,
    type: 'ObjectStoreNode',
    outputType: 'Multiple',
  };
}

const OBJECT_STORE_NODES = [
  makeObjectStoreNodeConfig<Ability1UsedLogEvent>('ability_1_used_object_store', 'Ability 1 Used', 'ability_1_used', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeConfig<Ability2UsedLogEvent>('ability_2_used_object_store', 'Ability 2 Used', 'ability_2_used', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeConfig<DamageLogEvent>('damage_object_store', 'Damage', 'damage', [
    'matchId',
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
  makeObjectStoreNodeConfig<DefensiveAssistLogEvent>('defensive_assist_object_store', 'Defensive Assist', 'defensive_assist', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeConfig<DvaDemechLogEvent>('dva_demech_object_store', 'Dva Demech', 'dva_demech', [
    'matchId',
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
  makeObjectStoreNodeConfig<DvaRemechLogEvent>('dva_remech_object_store', 'Dva Remech', 'dva_remech', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'ultimateId']),
  makeObjectStoreNodeConfig<EchoDuplicateEndLogEvent>('echo_duplicate_end_object_store', 'Echo Duplicate End', 'echo_duplicate_end', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'ultimateId']),
  makeObjectStoreNodeConfig<EchoDuplicateStartLogEvent>('echo_duplicate_start_object_store', 'Echo Duplicate Start', 'echo_duplicate_start', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeConfig<HealingLogEvent>('healing_object_store', 'Healing', 'healing', [
    'matchId',
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
  makeObjectStoreNodeConfig<HeroSpawnLogEvent>('hero_spawn_object_store', 'Hero Spawn', 'hero_spawn', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'previousHero', 'heroTimePlayed']),
  makeObjectStoreNodeConfig<HeroSwapLogEvent>('hero_swap_object_store', 'Hero Swap', 'hero_swap', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'previousHero', 'heroTimePlayed']),
  makeObjectStoreNodeConfig<KillLogEvent>('kill_object_store', 'Kill', 'kill', [
    'matchId',
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
  makeObjectStoreNodeConfig<MatchFileInfo>('match_object_store', 'Match', 'match', ['matchId', 'name', 'fileModified', 'dateString', 'timeString']),
  makeObjectStoreNodeConfig<MatchEndLogEvent>('match_end_object_store', 'Match End', 'match_end', ['matchId', 'type', 'matchTime', 'roundNumber', 'team1Score', 'team2Score']),
  makeObjectStoreNodeConfig<MatchStartLogEvent>('match_start_object_store', 'Match Start', 'match_start', ['matchId', 'type', 'matchTime', 'mapName', 'mapType', 'team1Name', 'team2Name']),
  makeObjectStoreNodeConfig<MercyRezLogEvent>('mercy_rez_object_store', 'Mercy Rez', 'mercy_rez', ['matchId', 'type', 'matchTime', 'mercyTeam', 'mercyName', 'revivedTeam', 'revivedName', 'revivedHero', 'eventAbility']),
  makeObjectStoreNodeConfig<ObjectiveCapturedLogEvent>('objective_captured_object_store', 'Objective Captured', 'objective_captured', [
    'matchId',
    'type',
    'matchTime',
    'roundNumber',
    'capturingTeam',
    'objectiveIndex',
    'controlTeam1Progress',
    'controlTeam2Progress',
    'matchTimeRemaining',
  ]),
  makeObjectStoreNodeConfig<OffensiveAssistLogEvent>('offensive_assist_object_store', 'Offensive Assist', 'offensive_assist', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated']),
  makeObjectStoreNodeConfig<PayloadProgressLogEvent>('payload_progress_object_store', 'Payload Progress', 'payload_progress', ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'payloadCaptureProgress']),
  makeObjectStoreNodeConfig<PlayerStatLogEvent>('player_stat_object_store', 'Player Stat', 'player_stat', [
    'matchId',
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
  makeObjectStoreNodeConfig<PointProgressLogEvent>('point_progress_object_store', 'Point Progress', 'point_progress', ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'objectiveIndex', 'pointCaptureProgress']),
  makeObjectStoreNodeConfig<RemechChargedLogEvent>('remech_charged_object_store', 'Remech Charged', 'remech_charged', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeConfig<RoundEndLogEvent>('round_end_object_store', 'Round End', 'round_end', [
    'matchId',
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
  makeObjectStoreNodeConfig<RoundStartLogEvent>('round_start_object_store', 'Round Start', 'round_start', ['matchId', 'type', 'matchTime', 'roundNumber', 'capturingTeam', 'team1Score', 'team2Score', 'objectiveIndex']),
  makeObjectStoreNodeConfig<SetupCompleteLogEvent>('setup_complete_object_store', 'Setup Complete', 'setup_complete', ['matchId', 'type', 'matchTime', 'roundNumber', 'matchTimeRemaining']),
  makeObjectStoreNodeConfig<UltimateChargedLogEvent>('ultimate_charged_object_store', 'Ultimate Charged', 'ultimate_charged', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeConfig<UltimateEndLogEvent>('ultimate_end_object_store', 'Ultimate End', 'ultimate_end', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
  makeObjectStoreNodeConfig<UltimateStartLogEvent>('ultimate_start_object_store', 'Ultimate Start', 'ultimate_start', ['matchId', 'type', 'matchTime', 'playerTeam', 'playerName', 'playerHero', 'heroDuplicated', 'ultimateId']),
];

function makeAlaSQLNodeConfig<T extends object>(name: string, displayName: string, sql: string, sources: string[], columnNames: (keyof T & string)[]): AlaSQLNodeConfig<T> {
  return {
    name,
    type: 'AlaSQLNode',
    displayName,
    sql,
    sources,
    columnNames,
    outputType: 'Multiple',
  };
}

// function buildSQLRatioMetrics(
//   numeratorSource: string,
//   numeratorSliceColumns: string[],
//   numeratorColumns: string[],
//   denominatorSource: string,
//   denominatorColumn: string,
//   weight: number,
//   joinColumns: string[],
//   metricSuffix: string,
// ): string {
//   function ratioForNumeratorColumn(column: string): string {
//     return `${numeratorSource}.${column} / ${denominatorSource}.${denominatorColumn} * ${weight} as ${column}${metricSuffix}`;
//   }
//   return `
//   SELECT
//     ${numeratorSliceColumns.map((column) => `${numeratorSource}.${column}`).join(', ')},
//     ${numeratorColumns.map(ratioForNumeratorColumn).join(', ')}
//   FROM ? as ${numeratorSource}
//   JOIN ? as ${denominatorSource}
//   ON ${joinColumns.map((column) => `${numeratorSource}.${column} = ${denominatorSource}.${column}`).join(' AND ')}
//   `;
// }

// Rules:
// never use subqueries, always split into multiple nodes.
// any change to the output columns requires a change to the DataColumn definitions in DataColumn.ts
export interface UltimateEventNodeData {
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  ultimateId: string;
  ultimateChargedTime: number;
  ultimateStartTime: number;
  ultimateEndTime: number;
  ultimateHoldTime: number;
};

export const ultimate_events_node = makeAlaSQLNodeConfig<UltimateEventNodeData>(
    'ultimate_events',
    'Ultimate Events',
    `
  SELECT
    ult_charged.matchId,
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
  ON ult_charged.matchId = ult_start.matchId AND ult_charged.playerName = ult_start.playerName AND ult_charged.playerTeam = ult_start.playerTeam
  AND ult_charged.playerHero = ult_start.playerHero AND ult_charged.ultimateId = ult_start.ultimateId AND ult_charged.matchTime <= ult_start.matchTime
  JOIN ? as ult_end
  ON ult_charged.matchId = ult_end.matchId AND ult_charged.playerName = ult_end.playerName AND ult_charged.playerTeam = ult_end.playerTeam
  AND ult_charged.playerHero = ult_end.playerHero AND ult_charged.ultimateId = ult_end.ultimateId AND ult_start.matchTime <= ult_end.matchTime
  ORDER BY ult_charged.matchId, ult_charged.playerName, ult_charged.matchTime
  `,
    ['ultimate_charged_object_store', 'ultimate_start_object_store', 'ultimate_end_object_store'],
    ['matchId', 'playerName', 'playerTeam', 'playerHero', 'ultimateId', 'ultimateChargedTime', 'ultimateStartTime', 'ultimateEndTime', 'ultimateHoldTime'],
  );

export interface MapTimesNodeData {
  matchId: string;
  mapStartTime: number;
  mapEndTime: number;
  mapDuration: number;
}

export const map_times_node = makeAlaSQLNodeConfig<MapTimesNodeData>(
    'map_times',
    'Map Times',
    `SELECT
      match_start.matchId,
      match_start.matchTime as mapStartTime,
      match_end.matchTime as mapEndTime,
      SUM(round.roundDuration) as mapDuration
    FROM ? as match_start
    JOIN ? as match_end
    ON match_start.matchId = match_end.matchId
    JOIN ? as round
    ON match_start.matchId = round.matchId
    GROUP BY match_start.matchId, match_start.matchTime, match_end.matchTime
    ORDER BY match_start.matchId, match_start.matchTime
    `,
    ['match_start_object_store', 'match_end_object_store', 'round_times'],
    ['matchId', 'mapStartTime', 'mapEndTime', 'mapDuration'],
  );

export interface RoundTimesNodeData {
  matchId: string;
  roundNumber: number;
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
  roundDuration: number;
  }

export const round_times_node = makeAlaSQLNodeConfig<RoundTimesNodeData>(
  'round_times',
  'Round Times',
  `SELECT
      round_start.matchId,
      round_start.roundNumber,
      round_start.matchTime as roundStartTime,
      setup_complete.matchTime as roundSetupCompleteTime,
      round_end.matchTime as roundEndTime,
      round_end.matchTime - setup_complete.matchTime as roundDuration
    FROM ? as round_start
    JOIN ? as round_end
    ON round_start.matchId = round_end.matchId AND round_start.roundNumber = round_end.roundNumber
    JOIN ? as setup_complete
    ON round_start.matchId = setup_complete.matchId AND round_start.roundNumber = setup_complete.roundNumber
    ORDER BY round_start.matchId, round_start.roundNumber
    `,
    ['round_start_object_store', 'round_end_object_store', 'setup_complete_object_store'],
    ['matchId', 'roundNumber', 'roundStartTime', 'roundEndTime', 'roundDuration', 'roundSetupCompleteTime'],
  );

export interface PlayerEventsNodeData {
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  playerEventTime: number;
  playerEventType: string;
  }

export const player_events_node = makeAlaSQLNodeConfig<PlayerEventsNodeData>(
  'player_events',
  'Player Events',
  `
    SELECT * FROM (
    SELECT
      defensive_assist.matchId,
      defensive_assist.playerName,
      defensive_assist.playerTeam,
      defensive_assist.playerHero,
      defensive_assist.matchTime as playerEventTime,
      'Defensive Assist' as playerEventType
    FROM ? as defensive_assist
    UNION ALL
    SELECT
      offensive_assist.matchId,
      offensive_assist.playerName,
      offensive_assist.playerTeam,
      offensive_assist.playerHero,
      offensive_assist.matchTime as playerEventTime,
      'Offensive Assist' as playerEventType
    FROM ? as offensive_assist
    UNION ALL
    SELECT
      hero_spawn.matchId,
      hero_spawn.playerName,
      hero_spawn.playerTeam,
      hero_spawn.playerHero,
      hero_spawn.matchTime as playerEventTime,
      'Spawn' as playerEventType
    FROM ? as hero_spawn
    UNION ALL
    SELECT
      hero_swap.matchId,
      hero_swap.playerName,
      hero_swap.playerTeam,
      hero_swap.playerHero,
      hero_swap.matchTime as playerEventTime,
      'Swap' as playerEventType
    FROM ? as hero_swap
    UNION ALL
    SELECT
      ability_1_used.matchId,
      ability_1_used.playerName,
      ability_1_used.playerTeam,
      ability_1_used.playerHero,
      ability_1_used.matchTime as playerEventTime,
      'Ability 1 Used' as playerEventType
    FROM ? as ability_1_used
    UNION ALL
    SELECT
      ability_2_used.matchId,
      ability_2_used.playerName,
      ability_2_used.playerTeam,
      ability_2_used.playerHero,
      ability_2_used.matchTime as playerEventTime,
      'Ability 2 Used' as playerEventType
    FROM ? as ability_2_used
    )
    ORDER BY matchId, playerName, playerEventTime
    `,
    ['defensive_assist_object_store', 'offensive_assist_object_store', 'hero_spawn_object_store', 'hero_swap_object_store', 'ability_1_used_object_store', 'ability_2_used_object_store'],
    ['matchId', 'playerName', 'playerTeam', 'playerHero', 'playerEventTime', 'playerEventType'],
  );

export interface PlayerInteractionEventsNodeData {
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  otherPlayerName: string;
  playerInteractionEventTime: number;
    playerInteractionEventType: string;
  }

export const player_interaction_events_node = makeAlaSQLNodeConfig<PlayerInteractionEventsNodeData>(
  'player_interaction_events',
  'Player Interaction Events',
  `
    SELECT * FROM (
      SELECT
        mercy_rez.matchId,
        mercy_rez.revivedName as playerName,
        mercy_rez.revivedTeam as playerTeam,
        mercy_rez.revivedHero as playerHero,
        mercy_rez.mercyName as otherPlayerName,
        mercy_rez.matchTime as playerInteractionEventTime,
        'Resurrected' as playerInteractionEventType
      FROM ? as mercy_rez
      UNION ALL
      SELECT
        mercy_rez.matchId,
        mercy_rez.mercyName as playerName,
        mercy_rez.mercyTeam as playerTeam,
        'Mercy' as playerHero,
        mercy_rez.revivedName as otherPlayerName,
        mercy_rez.matchTime as playerInteractionEventTime,
        'Resurrected Player' as playerInteractionEventType
      FROM ? as mercy_rez
      UNION ALL
      SELECT
        dva_demech.matchId,
        dva_demech.victimName as playerName,
        dva_demech.victimTeam as playerTeam,
        dva_demech.victimHero as playerHero,
        dva_demech.attackerName as otherPlayerName,
        dva_demech.matchTime as playerInteractionEventTime,
        'Demeched' as playerInteractionEventType
      FROM ? as dva_demech
      UNION ALL
      SELECT
        dva_remech.matchId,
        dva_remech.playerName as playerName,
        dva_remech.playerTeam as playerTeam,
        dva_remech.playerHero as playerHero,
        dva_remech.playerName as otherPlayerName,
        dva_remech.matchTime as playerInteractionEventTime,
        'Remeched' as playerInteractionEventType
      FROM ? as dva_remech
      UNION ALL
      SELECT
        kill.matchId,
        kill.attackerName as playerName,
        kill.attackerTeam as playerTeam,
        kill.attackerHero as playerHero,
        kill.victimName as otherPlayerName,
        kill.matchTime as playerInteractionEventTime,
        'Killed player' as playerInteractionEventType
      FROM ? as kill
      UNION ALL
      SELECT
        kill.matchId,
        kill.victimName as playerName,
        kill.victimTeam as playerTeam,
        kill.victimHero as playerHero,
        kill.attackerName as otherPlayerName,
        kill.matchTime as playerInteractionEventTime,
        'Died' as playerInteractionEventType
      FROM ? as kill
      UNION ALL
      SELECT
        damage.matchId,
        damage.attackerName as playerName,
        damage.attackerTeam as playerTeam,
        damage.attackerHero as playerHero,
        damage.victimName as otherPlayerName,
        damage.matchTime as playerInteractionEventTime,
        'Dealt Damage' as playerInteractionEventType
      FROM ? as damage
      UNION ALL
      SELECT
        damage.matchId,
        damage.victimName as playerName,
        damage.victimTeam as playerTeam,
        damage.victimHero as playerHero,
        damage.attackerName as otherPlayerName,
        damage.matchTime as playerInteractionEventTime,
        'Recieved Damaged' as playerInteractionEventType
      FROM ? as damage
      UNION ALL
      SELECT
        healing.matchId,
        healing.healerName as playerName,
        healing.healerTeam as playerTeam,
        healing.healerHero as playerHero,
        healing.healeeName as otherPlayerName,
        healing.matchTime as playerInteractionEventTime,
        'Dealt Healing' as playerInteractionEventType
      FROM ? as healing
      UNION ALL
      SELECT
        healing.matchId,
        healing.healeeName as playerName,
        healing.healeeTeam as playerTeam,
        healing.healeeHero as playerHero,
        healing.healerName as otherPlayerName,
        healing.matchTime as playerInteractionEventTime,
        'Recieved Healing' as playerInteractionEventType
      FROM ? as healing
    )
    ORDER BY matchId, playerName, playerInteractionEventTime
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
    ['matchId', 'playerName', 'playerTeam', 'playerHero', 'otherPlayerName', 'playerInteractionEventTime', 'playerInteractionEventType'],
  );

  export interface UniquePlayerNamesNodeData {
    playerName: string;
  }

export const unique_player_names_node = makeAlaSQLNodeConfig<UniquePlayerNamesNodeData>(
  'unique_player_names',
  'Unique Player Names',
  `SELECT DISTINCT playerName FROM ? as player_stat_object_store`,
  ['player_stat_object_store'],
  ['playerName']
);

export interface UniqueMapNamesNodeData {
  mapName: string;
}

export const unique_map_names_node = makeAlaSQLNodeConfig<UniqueMapNamesNodeData>(
  'unique_map_names',
  'Unique Map Names',
  `SELECT DISTINCT mapName FROM ? as match_start_object_store`,
  ['match_start_object_store'],
  ['mapName']
);

export interface UniqueMapIdsNodeData {
  matchId: string;
}

export const unique_map_ids_node = makeAlaSQLNodeConfig<UniqueMapIdsNodeData>(
  'unique_map_ids',
  'Unique Map IDs',
  `SELECT DISTINCT matchId FROM ? as match_start_object_store`,
  ['match_start_object_store'],
  ['matchId']
);

export interface UniqueGameModesNodeData {
  mapType: string;
}

export const unique_game_modes_node = makeAlaSQLNodeConfig<UniqueGameModesNodeData>(
  'unique_game_modes',
  'Unique Game Modes',
  `SELECT DISTINCT mapType FROM ? as match_start_object_store`,
  ['match_start_object_store'],
  ['mapType']
);

export interface TeamNamesNodeData {
  teamName: string;
}

export const team_names_node = makeAlaSQLNodeConfig<TeamNamesNodeData>(
  'team_names',
  'Team Names',
  `SELECT team1Name as teamName FROM ? as match_start_object_store UNION ALL SELECT team2Name as teamName FROM ? as match_start_object_store`,
  ['match_start_object_store', 'match_start_object_store'],
  ['teamName']
);

export interface UniqueTeamNamesNodeData {
  teamName: string;
}

export const unique_team_names_node = makeAlaSQLNodeConfig<UniqueTeamNamesNodeData>(
  'unique_team_names',
  'Unique Team Names',
  `SELECT DISTINCT teamName FROM ? as team_names`,
  ['team_names'],
  ['teamName']
);

export interface PlayerStatExpandedNodeData {
  matchId: string;
  roundNumber: number;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  playerRole: string;
  eliminations: number;
  finalBlows: number;
  deaths: number;
  allDamageDealt: number;
  heroDamageDealt: number;
  barrierDamageDealt: number;
  healingDealt: number;
    healingReceived: number;
    selfHealing: number;
    damageTaken: number;
    damageBlocked: number;
    defensiveAssists: number;
    offensiveAssists: number;
    ultimatesEarned: number;
    ultimatesUsed: number;
    multikills: number;
    multikillBest: number;
    soloKills: number;
    objectiveKills: number;
    environmentalKills: number;
    environmentalDeaths: number;
    criticalHits: number;
    scopedCriticalHitKills: number;
    shotsFired: number;
    shotsHit: number;
    shotsMissed: number;
    scopedShotsFired: number;
    scopedShotsHit: number;
    weaponAccuracy: number;
  }

export const player_stat_expanded_node = makeAlaSQLNodeConfig<PlayerStatExpandedNodeData>(
  'player_stat_expanded',
  'Player Stat Expanded',
  `
    SELECT
      player_stat.matchId,
      player_stat.roundNumber,
      player_stat.playerName,
      player_stat.playerTeam,
      player_stat.playerHero,
      (CASE
          WHEN player_stat.playerHero = 'Mauga' THEN 'tank'
          WHEN player_stat.playerHero = 'D.Va' THEN 'tank'
          WHEN player_stat.playerHero = 'Orisa' THEN 'tank'
          WHEN player_stat.playerHero = 'Reinhardt' THEN 'tank'
          WHEN player_stat.playerHero = 'Roadhog' THEN 'tank'
          WHEN player_stat.playerHero = 'Sigma' THEN 'tank'
          WHEN player_stat.playerHero = 'Winston' THEN 'tank'
          WHEN player_stat.playerHero = 'Wrecking Ball' THEN 'tank'
          WHEN player_stat.playerHero = 'Zarya' THEN 'tank'
          WHEN player_stat.playerHero = 'Doomfist' THEN 'tank'
          WHEN player_stat.playerHero = 'Junker Queen' THEN 'tank'
          WHEN player_stat.playerHero = 'Rammatra' THEN 'tank'
          WHEN player_stat.playerHero = 'Ashe' THEN 'damage'
          WHEN player_stat.playerHero = 'Bastion' THEN 'damage'
          WHEN player_stat.playerHero = 'Cassidy' THEN 'damage'
          WHEN player_stat.playerHero = 'Echo' THEN 'damage'
          WHEN player_stat.playerHero = 'Genji' THEN 'damage'
          WHEN player_stat.playerHero = 'Hanzo' THEN 'damage'
          WHEN player_stat.playerHero = 'Junkrat' THEN 'damage'
          WHEN player_stat.playerHero = 'Mei' THEN 'damage'
          WHEN player_stat.playerHero = 'Pharah' THEN 'damage'
          WHEN player_stat.playerHero = 'Reaper' THEN 'damage'
          WHEN player_stat.playerHero = 'Soldier: 76' THEN 'damage'
          WHEN player_stat.playerHero = 'Sojourn' THEN 'damage'
          WHEN player_stat.playerHero = 'Sombra' THEN 'damage'
          WHEN player_stat.playerHero = 'Symmetra' THEN 'damage'
          WHEN player_stat.playerHero = 'Torbjörn' THEN 'damage'
          WHEN player_stat.playerHero = 'Tracer' THEN 'damage'
          WHEN player_stat.playerHero = 'Widowmaker' THEN 'damage'
          WHEN player_stat.playerHero = 'Ana' THEN 'support'
          WHEN player_stat.playerHero = 'Baptiste' THEN 'support'
          WHEN player_stat.playerHero = 'Brigitte' THEN 'support'
          WHEN player_stat.playerHero = 'Lúcio' THEN 'support'
          WHEN player_stat.playerHero = 'Mercy' THEN 'support'
          WHEN player_stat.playerHero = 'Moira' THEN 'support'
          WHEN player_stat.playerHero = 'Zenyatta' THEN 'support'
          WHEN player_stat.playerHero = 'Lifeweaver' THEN 'support'
          WHEN player_stat.playerHero = 'Illari' THEN 'support'
          WHEN player_stat.playerHero = 'Kiriko' THEN 'support'
          ELSE 'unknown' END)
         as playerRole,
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
      player_stat.scopedCriticalHitKills,
      player_stat.scopedCriticalHitKills,
      player_stat.shotsFired,
      player_stat.shotsHit,
      player_stat.shotsMissed,
      player_stat.scopedShotsFired,
      player_stat.scopedShotsHit,
      player_stat.weaponAccuracy
      FROM ? as player_stat`,
    ['player_stat_object_store'],
    [
      'matchId',
      'roundNumber',
      'playerName',
      'playerTeam',
      'playerHero',
      'playerRole',
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
      'weaponAccuracy',
    ],
  );

  export interface MatchesGroupedByDateNodeData {  
    dateString: string;
    matchIds: string[];
  }

  export const matches_grouped_by_date_node = makeAlaSQLNodeConfig<MatchesGroupedByDateNodeData>(
    'matches_grouped_by_date',
    'Matches Grouped By Date',
    `SELECT dateString, ARRAY(matchId) as matchIds FROM ? as match_object_store GROUP BY dateString`,
    ['match_object_store'],
    ['dateString', 'matchIds'],
  );

  export interface TeamPlayersByMatchNodeData {
    matchId: string;
    team1Name: string;
    team2Name: string;
    team1Players: string[];
    team2Players: string[];
  }

  export const team_players_by_match_node = makeAlaSQLNodeConfig<TeamPlayersByMatchNodeData>(
    'team_players_by_match',
    'Team Players By Match',
    `SELECT
      match_start_object_store.matchId,
      match_start_object_store.team1Name,
      match_start_object_store.team2Name,
      ARRAY(DISTINCT player_stat_object_store_team1.playerName) as team1Players,
      ARRAY(DISTINCT player_stat_object_store_team2.playerName) as team2Players
    FROM ? as match_start_object_store
    JOIN ? as player_stat_object_store_team1 ON match_start_object_store.matchId = player_stat_object_store_team1.matchId
    JOIN ? as player_stat_object_store_team2 ON match_start_object_store.matchId = player_stat_object_store_team2.matchId
    WHERE player_stat_object_store_team1.playerTeam = match_start_object_store.team1Name
    AND player_stat_object_store_team2.playerTeam = match_start_object_store.team2Name
    GROUP BY match_start_object_store.matchId, match_start_object_store.team1Name, match_start_object_store.team2Name

    `,
    ['match_start_object_store', 'player_stat_object_store', 'player_stat_object_store'],
    ['matchId', 'team1Name', 'team2Name', 'team1Players', 'team2Players'],
  );

  export interface PlayerMetrics {
    eliminations: number;
    finalBlows: number;
    deaths: number;
    allDamageDealt: number;
    heroDamageDealt: number;
    barrierDamageDealt: number;
    healingDealt: number;
    healingReceived: number;
    selfHealing: number;
    damageTaken: number;
    damageBlocked: number;
    defensiveAssists: number;
    offensiveAssists: number;
    ultimatesEarned: number;
    ultimatesUsed: number;
    multikills: number;
    multikillBest: number;
    soloKills: number;
    objectiveKills: number;
    environmentalKills: number;
    environmentalDeaths: number;
    criticalHits: number;
    scopedCriticalHitKills: number;
    shotsFired: number;
    shotsHit: number;
    shotsMissed: number;
    scopedShotsFired: number;
    scopedShotsHit: number;
    weaponAccuracy: number;
  }

  export const PLAYER_METRICS: (keyof PlayerMetrics)[] = [
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
    'weaponAccuracy',
  ];

  export interface PlayerStatTotalsNodeData extends PlayerMetrics {
    playerName: string;
  }

  export const player_stat_totals_node = makeAlaSQLNodeConfig<PlayerStatTotalsNodeData>(
    'player_stat_totals',
    'Player Stat Totals',
    `SELECT
      playerName,
      SUM(eliminations) as eliminations,
      SUM(finalBlows) as finalBlows,
      SUM(deaths) as deaths,
      SUM(allDamageDealt) as allDamageDealt,
      SUM(heroDamageDealt) as heroDamageDealt,
      SUM(barrierDamageDealt) as barrierDamageDealt,
      SUM(healingDealt) as healingDealt,
      SUM(healingReceived) as healingReceived,
      SUM(selfHealing) as selfHealing,
      SUM(damageTaken) as damageTaken,
      SUM(damageBlocked) as damageBlocked,
      SUM(defensiveAssists) as defensiveAssists,
      SUM(offensiveAssists) as offensiveAssists,
      SUM(ultimatesEarned) as ultimatesEarned,
      SUM(ultimatesUsed) as ultimatesUsed,
      SUM(multikills) as multikills,
      SUM(multikillBest) as multikillBest,
      SUM(soloKills) as soloKills,
      SUM(objectiveKills) as objectiveKills,
      SUM(environmentalKills) as environmentalKills,
      SUM(environmentalDeaths) as environmentalDeaths,
      SUM(criticalHits) as criticalHits,
      SUM(scopedCriticalHitKills) as scopedCriticalHitKills,
      SUM(shotsFired) as shotsFired,
      SUM(shotsHit) as shotsHit,
      SUM(shotsMissed) as shotsMissed,
      SUM(scopedShotsFired) as scopedShotsFired,
      SUM(scopedShotsHit) as scopedShotsHit
    FROM ? as player_stat_expanded
    GROUP BY playerName`,
    ['player_stat_expanded'],
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
  );

  export interface MatchData {
    matchId: string;
    fileName: string;
    fileModified: number;
    dateString: string;
    map: string;
    mode: string;
    team1Name: string;
    team2Name: string;
    team1Score: number;
    team2Score: number;
    team1Players: string[];
    team2Players: string[];
  }

  export const match_data_node = makeAlaSQLNodeConfig<MatchData>(
    'match_data',
    'Match Data',
    `SELECT 
      match_object_store.matchId,
      match_object_store.name as fileName,
      match_object_store.fileModified,
      match_object_store.dateString,
      match_start_object_store.mapName as map,
      match_start_object_store.mapType as mode,
      match_start_object_store.team1Name,
      match_start_object_store.team2Name,
      match_end_object_store.team1Score,
      match_end_object_store.team2Score,
      team_players_by_match.team1Players,
      team_players_by_match.team2Players
    FROM ? as match_object_store
    JOIN ? as match_end_object_store ON match_object_store.matchId = match_end_object_store.matchId
    JOIN ? as match_start_object_store ON match_object_store.matchId = match_start_object_store.matchId
    JOIN ? as team_players_by_match ON match_object_store.matchId = team_players_by_match.matchId
    `,
    ['match_object_store', 'match_end_object_store', 'match_start_object_store', 'team_players_by_match'],
    ['matchId', 'fileName', 'fileModified', 'dateString', 'map', 'mode', 'team1Name', 'team2Name', 'team1Score', 'team2Score', 'team1Players', 'team2Players'],
  );

const FUNCTION_NODES = [
  {
    name: 'team_ultimate_advantage',
    displayName: 'Team Ultimate Advantage',
    sources: ['ultimate_charged_object_store', 'ultimate_end_object_store', 'match_start_object_store', 'round_end_object_store', 'round_start_object_store'],
    columnNames: ['matchId', 'matchTime', 'team1Name', 'team2Name', 'team1Count', 'team2Count', 'teamWithAdvantage', 'diff'],
    transform: async (data: DataNodeInputMap) => {
      const events = [
        ...(data['ultimate_charged_object_store'] as UltimateChargedLogEvent[]).map((e) => ({...e, type: 'charged'})),
        ...(data['ultimate_end_object_store'] as UltimateEndLogEvent[]).map((e) => ({...e, type: 'end'})),
        ...(data['round_end_object_store'] as RoundEndLogEvent[]).map((e) => ({...e, type: 'round_end'})),
        ...(data['round_start_object_store'] as RoundStartLogEvent[]).map((e) => ({...e, type: 'round_start'})),
      ];

      // Define mapTeams with number keys
      const mapTeams = new Map<string, {team1Name: string; team2Name: string}>(
        (data['match_start_object_store'] as MatchStartLogEvent[]).map((match) => [match.matchId, {team1Name: match.team1Name, team2Name: match.team2Name}]),
      );

      return processTeamAdvantageEvents(events, mapTeams, ultimateAdvantageConfig);
    },
    outputType: 'Multiple',
    type: 'FunctionNode',
  },
  {
    name: 'team_alive_advantage',
    displayName: 'Team Alive Players Advantage',
    sources: ['kill_object_store', 'hero_spawn_object_store', 'match_start_object_store', 'round_end_object_store', 'round_start_object_store'],
    columnNames: ['matchId', 'matchTime', 'team1Name', 'team2Name', 'team1Count', 'team2Count', 'teamWithAdvantage', 'diff'],
    transform: async (data: DataNodeInputMap) => {
      const events = [
        ...(data['kill_object_store'] as KillLogEvent[]).map((e) => ({...e, type: 'kill'})),
        ...(data['hero_spawn_object_store'] as HeroSpawnLogEvent[]).map((e) => ({...e, type: 'spawn'})),
        ...(data['round_end_object_store'] as RoundEndLogEvent[]).map((e) => ({...e, type: 'round_end'})),
        ...(data['round_start_object_store'] as RoundStartLogEvent[]).map((e) => ({...e, type: 'round_start'})),
      ];

      // Define mapTeams with number keys
      const mapTeams = new Map<string, {team1Name: string; team2Name: string}>(
        (data['match_start_object_store'] as MatchStartLogEvent[]).map((match) => [match.matchId, {team1Name: match.team1Name, team2Name: match.team2Name}]),
      );

      return processTeamAdvantageEvents(events, mapTeams, playerAliveAdvantageConfig);
    },
    outputType: 'Multiple',
    type: 'FunctionNode',
  },
];


export const initializeDataManager = (dataManager: DataManager) => {
  console.log('Initializing Data Manager');
  DATA_COLUMNS.forEach((col) => !dataManager.hasColumn(col.name) && dataManager.registerColumn(col));

  const allNodes = [indexedDbNode, ...FILE_PARSING_NODES, ...OBJECT_STORE_NODES, 
    ultimate_events_node,
    player_interaction_events_node,
    unique_player_names_node,
    unique_map_names_node,
    unique_map_ids_node,
    unique_game_modes_node,
    team_names_node,
    unique_team_names_node,
    player_stat_expanded_node,
    matches_grouped_by_date_node,
    team_players_by_match_node,
    player_stat_totals_node,
    match_data_node,
    ...FUNCTION_NODES];
  allNodes.forEach((node) => {
    if (dataManager.hasNode(node.name)) {
      return;
    }
    if (node.type === 'IndexedDBNode') {
      const requiredObjectStores = allNodes.filter((n) => n.type === 'ObjectStoreNode').map((n) => (n as ObjectStoreNodeConfig<unknown>).objectStore);
      const configWithObjectStores: IndexedDBNodeConfig = {...(node as IndexedDBNodeConfig), objectStores: requiredObjectStores};
      dataManager.registerNode(new IndexedDBNode(configWithObjectStores));
    }
    const nodeColumns = node.columnNames.map((name) => dataManager.getColumn(name));
    if (node.type === 'InputNode') {
      const inputNode = node as InputNodeConfig<unknown>;
    
      dataManager.registerNode(new InputNode(inputNode.name, inputNode.displayName, inputNode.outputType, nodeColumns, inputNode.behavior));
    }
    if (node.type === 'ObjectStoreNode') {
      const objectStoreNode = node as ObjectStoreNodeConfig<unknown>;
      dataManager.registerNode(new ObjectStoreNode(objectStoreNode.name, objectStoreNode.displayName, nodeColumns, objectStoreNode.objectStore, objectStoreNode.source, objectStoreNode.behavior));
    }
    if (node.type === 'AlaSQLNode') {
      const alaSQLNode = node as AlaSQLNodeConfig<unknown>;
      dataManager.registerNode(new AlaSQLNode(alaSQLNode.name, alaSQLNode.displayName, alaSQLNode.sql, alaSQLNode.sources, nodeColumns));
    }
    if (node.type === 'FunctionNode') {
      const functionNode = node as FunctionNodeConfig<object>;
      dataManager.registerNode(new FunctionNode(functionNode.name, functionNode.displayName, functionNode.transform, functionNode.sources, nodeColumns, functionNode.outputType));
    }
  });
};
