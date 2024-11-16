import { ultimateAdvantageConfig, playerAliveAdvantageConfig } from "./WombatDataFramework/AdvantageTrackers";
import { DataColumn, makeDataColumn, makeRatioUnits, numberFormatter, numberComparator, stringFormatter, stringComparator, percentFormatter, booleanFormatter, booleanComparator } from "./WombatDataFramework/DataColumn";
import { WriteNodeInit, ObjectStoreNodeInit, AlaSQLNodeInit, FunctionNodeInit } from "./WombatDataFramework/DataNode";
import { processTeamAdvantageEvents } from "./lib/TeamAdvantageTracker";


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


export const DATA_COLUMNS: DataColumn[] = [
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
  makeDataColumn('playerInteractionEventTime', 'Player Interaction Event Time', 'The time the player interaction event occurred.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('playerInteractionEventType', 'Player Interaction Event Type', 'The type of the player interaction event.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('otherPlayerName', 'Other Player Name', 'The name of the other player.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('playerEventTime', 'Player Event Time', 'The time the event occurred.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('playerEventType', 'Player Event Type', 'The type of the event.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('roundStartTime', 'Round Start Time', 'The time the round started.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('roundEndTime', 'Round End Time', 'The time the round ended.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('roundDuration', 'Round Duration', 'The duration of the round.', 's', 'number', numberFormatter, numberComparator),
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
  makeDataColumn('heroTimePlayed', 'Hero Time Played (s)', 'The time in seconds the hero was played.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('isCriticalHit', 'Is Critical Hit', 'Whether the attack was a critical hit.', 'none', 'boolean', booleanFormatter, booleanComparator),
  makeDataColumn('isEnvironmental', 'Is Environmental', 'Whether the attack was environmental.', 'none', 'boolean', booleanFormatter, booleanComparator),
  makeDataColumn('isHealthPack', 'Is Health Pack', 'Whether the healing was from a health pack.', 'none', 'boolean', booleanFormatter, booleanComparator),
  makeDataColumn('mapDuration', 'Map Duration', 'The duration of the map.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('mapEndTime', 'Map End Time', 'The time the map ended.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('mapId', 'Map ID', 'The ID of the map, generated from the input log file.', 'none', 'string', stringFormatter, numberComparator),
  makeDataColumn('mapName', 'Map Name', 'The name of the map.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('mapStartTime', 'Map Start Time', 'The time the map started.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('mapType', 'Map Type', 'The type of the map.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('matchTime', 'Match Time (s)', 'The time in seconds since the start of the match.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('matchTimeRemaining', 'Match Time Remaining (s)', 'The time remaining in the match.', 's', 'number', numberFormatter, numberComparator),
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
  makeDataColumn('team1Name', 'Team 1 Name', 'The name of team 1.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('team1Score', 'Team 1 Score', 'The score of team 1.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('team2Name', 'Team 2 Name', 'The name of team 2.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('team2Score', 'Team 2 Score', 'The score of team 2.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('type', 'Type', 'The type of the event.', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('ultimateChargedTime', 'Ultimate Charged Time (s)', 'The match time the ultimate was charged.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimateEndTime', 'Ultimate End Time (s)', 'The match time the ultimate was ended.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimateHoldTime', 'Ultimate Hold Time (s)', 'The time the ultimate was held.', 's', 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimateId', 'Ultimate ID', 'The ID of the ultimate ability.', 'none', 'number', numberFormatter, numberComparator),
  makeDataColumn('ultimateStartTime', 'Ultimate Start Time (s)', 'The match time the ultimate was started.', 's', 'number', numberFormatter, numberComparator),
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
  makeDataColumn('team1ChargedUltimateCount', 'Team 1 Charged Ultimate Count', 'Number of ultimates charged for team 1', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('team2ChargedUltimateCount', 'Team 2 Charged Ultimate Count', 'Number of ultimates charged for team 2', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('teamWithUltimateAdvantage', 'Team with Ultimate Advantage', 'Team that has more ultimates charged', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('ultimateAdvantageDiff', 'Ultimate Advantage Difference', 'Difference in number of charged ultimates between teams', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('chargedUltimateCount', 'Charged Ultimate Count', 'Number of charged ultimates for a team at a given time', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('team1AliveCount', 'Team 1 Alive Players', 'Number of alive players on team 1', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('team2AliveCount', 'Team 2 Alive Players', 'Number of alive players on team 2', 'count', 'number', numberFormatter, numberComparator),
  makeDataColumn('teamWithAliveAdvantage', 'Team with Player Advantage', 'Team that has more alive players', 'none', 'string', stringFormatter, stringComparator),
  makeDataColumn('aliveAdvantageDiff', 'Player Advantage Difference', 'Difference in number of alive players between teams', 'count', 'number', numberFormatter, numberComparator),
];


const playerStatFragment = `
      SUM(player_stat.eliminations) as eliminations,
      SUM(player_stat.finalBlows) as finalBlows,
      SUM(player_stat.deaths) as deaths,
      IF(SUM(player_stat.deaths) = 0, 0, SUM(player_stat.finalBlows) / SUM(player_stat.deaths)) as finalBlowsPerDeaths,
      IF(SUM(player_stat.damageTaken) = 0, 0, SUM(player_stat.damageTaken) / SUM(player_stat.deaths)) as damageTakenPerDeaths,
      IF(SUM(player_stat.allDamageDealt) = 0, 0, SUM(player_stat.allDamageDealt) / SUM(player_stat.damageTaken)) as allDamageDealtPerDamageTaken,
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
      SUM(player_stat.scopedShotsHit) as scopedShotsHit,
      SUM(player_stat.eliminations) / SUM(round_times.roundDuration) * 600 as eliminationsPer10,
      SUM(player_stat.finalBlows) / SUM(round_times.roundDuration) * 600 as finalBlowsPer10,
      SUM(player_stat.deaths) / SUM(round_times.roundDuration) * 600 as deathsPer10,
      SUM(player_stat.allDamageDealt) / SUM(round_times.roundDuration) * 600 as allDamagePer10,
      SUM(player_stat.heroDamageDealt) / SUM(round_times.roundDuration) * 600 as heroDamagePer10,
      SUM(player_stat.barrierDamageDealt) / SUM(round_times.roundDuration) * 600 as barrierDamageDealtPer10,
      SUM(player_stat.healingDealt) / SUM(round_times.roundDuration) * 600 as healingPer10,
      SUM(player_stat.healingReceived) / SUM(round_times.roundDuration) * 600 as healingReceivedPer10,
      SUM(player_stat.selfHealing) / SUM(round_times.roundDuration) * 600 as selfHealingPer10,
      SUM(player_stat.damageTaken) / SUM(round_times.roundDuration) * 600 as damageTakenPer10,
      SUM(player_stat.damageBlocked) / SUM(round_times.roundDuration) * 600 as damageBlockedPer10,
      SUM(player_stat.defensiveAssists) / SUM(round_times.roundDuration) * 600 as defensiveAssistsPer10,
      SUM(player_stat.offensiveAssists) / SUM(round_times.roundDuration) * 600 as offensiveAssistsPer10,
      SUM(player_stat.ultimatesEarned) / SUM(round_times.roundDuration) * 600 as ultimatesEarnedPer10,
      SUM(player_stat.ultimatesUsed) / SUM(round_times.roundDuration) * 600 as ultimatesUsedPer10,
      SUM(player_stat.multikillBest) / SUM(round_times.roundDuration) * 600 as multikillsPer10,
      SUM(player_stat.multikills) / SUM(round_times.roundDuration) * 600 as multikillsPer10,
      SUM(player_stat.soloKills) / SUM(round_times.roundDuration) * 600 as soloKillsPer10,
      SUM(player_stat.objectiveKills) / SUM(round_times.roundDuration) * 600 as objectiveKillsPer10,
      SUM(player_stat.environmentalKills) / SUM(round_times.roundDuration) * 600 as environmentalKillsPer10,
      SUM(player_stat.environmentalDeaths) / SUM(round_times.roundDuration) * 600 as environmentalDeathsPer10,
      SUM(player_stat.criticalHits) / SUM(round_times.roundDuration) * 600 as criticalHitsPer10,
      SUM(player_stat.scopedCriticalHitKills) / SUM(round_times.roundDuration) * 600 as scopedCriticalHitKillsPer10,
      SUM(player_stat.shotsFired) / SUM(round_times.roundDuration) * 600 as shotsFiredPer10,
      SUM(player_stat.shotsHit) / SUM(round_times.roundDuration) * 600 as shotsHitPer10,
      SUM(player_stat.shotsMissed) / SUM(round_times.roundDuration) * 600 as shotsMissedPer10,
      SUM(player_stat.scopedShotsFired) / SUM(round_times.roundDuration) * 600 as scopedShotsFiredPer10,
      SUM(player_stat.scopedShotsHit) / SUM(round_times.roundDuration) * 600 as scopedShotsHitPer10
`;

const playerStatColumns: string[] = [
  'eliminations',
  'finalBlows',
  'deaths',
  'finalBlowsPerDeaths',
  'damageTakenPerDeaths',
  'allDamageDealtPerDamageTaken',
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
];

function getAllCombinations(inputArray: string[]): string[][] {
  let result: string[][] = [];
  const combinationsCount = 2 ** inputArray.length;

  for (let i = 0; i < combinationsCount; i++) {
    const combination: string[] = [];
    for (let j = 0; j < inputArray.length; j++) {
      if (i & (1 << j)) {
        // Check if the jth bit is set
        combination.push(inputArray[j]);
      }
    }
    result.push(combination);
  }

  result = result.filter((group) => !((group.includes('roundNumber') && !group.includes('mapId')) || (!group.includes('playerRole') && group.includes('playerHero'))));

  // sort the combinations by length
  result.sort((a, b) => a.length - b.length);

  return result;
}

const player_stat_groups: string[][] = getAllCombinations(['mapId', 'roundNumber', 'playerName', 'playerTeam', 'playerHero', 'playerRole']);

console.log('player_stat_groups', player_stat_groups);


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

// Rules:
// never use subqueries, always split into multiple nodes.
// any change to the output columns requires a change to the DataColumn definitions in DataColumn.ts
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
      defensive_assist.playerTeam,
      defensive_assist.playerHero,
      defensive_assist.matchTime as playerEventTime,
      'Defensive Assist' as playerEventType
    FROM ? as defensive_assist
    UNION ALL
    SELECT
      offensive_assist.mapId,
      offensive_assist.playerName,
      offensive_assist.playerTeam,
      offensive_assist.playerHero,
      offensive_assist.matchTime as playerEventTime,
      'Offensive Assist' as playerEventType
    FROM ? as offensive_assist
    UNION ALL
    SELECT
      hero_spawn.mapId,
      hero_spawn.playerName,
      hero_spawn.playerTeam,
      hero_spawn.playerHero,
      hero_spawn.matchTime as playerEventTime,
      'Spawn' as playerEventType
    FROM ? as hero_spawn
    UNION ALL
    SELECT
      hero_swap.mapId,
      hero_swap.playerName,
      hero_swap.playerTeam,
      hero_swap.playerHero,
      hero_swap.matchTime as playerEventTime,
      'Swap' as playerEventType
    FROM ? as hero_swap
    UNION ALL
    SELECT
      ability_1_used.mapId,
      ability_1_used.playerName,
      ability_1_used.playerTeam,
      ability_1_used.playerHero,
      ability_1_used.matchTime as playerEventTime,
      'Ability 1 Used' as playerEventType
    FROM ? as ability_1_used
    UNION ALL
    SELECT
      ability_2_used.mapId,
      ability_2_used.playerName,
      ability_2_used.playerTeam,
      ability_2_used.playerHero,
      ability_2_used.matchTime as playerEventTime,
      'Ability 2 Used' as playerEventType
    FROM ? as ability_2_used
    )
    ORDER BY mapId, playerName, playerEventTime
    `,
    ['defensive_assist_object_store', 'offensive_assist_object_store', 'hero_spawn_object_store', 'hero_swap_object_store', 'ability_1_used_object_store', 'ability_2_used_object_store'],
    ['mapId', 'playerName', 'playerTeam', 'playerHero', 'playerEventTime', 'playerEventType'],
  ),
  makeAlaSQLNodeInit(
    'player_interaction_events',
    'Player Interaction Events',
    `
    SELECT * FROM (
      SELECT
        mercy_rez.mapId,
        mercy_rez.revivedName as playerName,
        mercy_rez.revivedTeam as playerTeam,
        mercy_rez.revivedHero as playerHero,
        mercy_rez.mercyName as otherPlayerName,
        mercy_rez.matchTime as playerInteractionEventTime,
        'Resurrected' as playerInteractionEventType
      FROM ? as mercy_rez
      UNION ALL
      SELECT
        mercy_rez.mapId,
        mercy_rez.mercyName as playerName,
        mercy_rez.mercyTeam as playerTeam,
        'Mercy' as playerHero,
        mercy_rez.revivedName as otherPlayerName,
        mercy_rez.matchTime as playerInteractionEventTime,
        'Resurrected Player' as playerInteractionEventType
      FROM ? as mercy_rez
      UNION ALL
      SELECT
        dva_demech.mapId,
        dva_demech.victimName as playerName,
        dva_demech.victimTeam as playerTeam,
        dva_demech.victimHero as playerHero,
        dva_demech.attackerName as otherPlayerName,
        dva_demech.matchTime as playerInteractionEventTime,
        'Demeched' as playerInteractionEventType
      FROM ? as dva_demech
      UNION ALL
      SELECT
        dva_remech.mapId,
        dva_remech.playerName as playerName,
        dva_remech.playerTeam as playerTeam,
        dva_remech.playerHero as playerHero,
        dva_remech.playerName as otherPlayerName,
        dva_remech.matchTime as playerInteractionEventTime,
        'Remeched' as playerInteractionEventType
      FROM ? as dva_remech
      UNION ALL
      SELECT
        kill.mapId,
        kill.attackerName as playerName,
        kill.attackerTeam as playerTeam,
        kill.attackerHero as playerHero,
        kill.victimName as otherPlayerName,
        kill.matchTime as playerInteractionEventTime,
        'Killed player' as playerInteractionEventType
      FROM ? as kill
      UNION ALL
      SELECT
        kill.mapId,
        kill.victimName as playerName,
        kill.victimTeam as playerTeam,
        kill.victimHero as playerHero,
        kill.attackerName as otherPlayerName,
        kill.matchTime as playerInteractionEventTime,
        'Died' as playerInteractionEventType
      FROM ? as kill
      UNION ALL
      SELECT
        damage.mapId,
        damage.attackerName as playerName,
        damage.attackerTeam as playerTeam,
        damage.attackerHero as playerHero,
        damage.victimName as otherPlayerName,
        damage.matchTime as playerInteractionEventTime,
        'Dealt Damage' as playerInteractionEventType
      FROM ? as damage
      UNION ALL
      SELECT
        damage.mapId,
        damage.victimName as playerName,
        damage.victimTeam as playerTeam,
        damage.victimHero as playerHero,
        damage.attackerName as otherPlayerName,
        damage.matchTime as playerInteractionEventTime,
        'Recieved Damaged' as playerInteractionEventType
      FROM ? as damage
      UNION ALL
      SELECT
        healing.mapId,
        healing.healerName as playerName,
        healing.healerTeam as playerTeam,
        healing.healerHero as playerHero,
        healing.healeeName as otherPlayerName,
        healing.matchTime as playerInteractionEventTime,
        'Dealt Healing' as playerInteractionEventType
      FROM ? as healing
      UNION ALL
      SELECT
        healing.mapId,
        healing.healeeName as playerName,
        healing.healeeTeam as playerTeam,
        healing.healeeHero as playerHero,
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
    ['mapId', 'playerName', 'playerTeam', 'playerHero', 'otherPlayerName', 'playerInteractionEventTime', 'playerInteractionEventType'],
  ),

  makeAlaSQLNodeInit(
    'player_stat_expanded',
    'Player Stat Expanded',
    `
    SELECT
      player_stat.mapId,
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
      'mapId',
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
  ),
];

export const FUNCTION_NODES: FunctionNodeInit[] = [
  {
    name: 'team_ultimate_advantage',
    displayName: 'Team Ultimate Advantage',
    sources: ['ultimate_charged_object_store', 'ultimate_end_object_store', 'match_start_object_store', 'round_end_object_store', 'round_start_object_store'],
    columnNames: [
      'mapId',
      'matchTime',
      'team1Name',
      'team2Name', 
      'team1ChargedUltimateCount',
      'team2ChargedUltimateCount',
      'teamWithUltimateAdvantage',
      'ultimateAdvantageDiff'
    ],
    transform: (sources: any[][]): any[] => {
      const events = [
        ...(sources[0] || []).map(e => ({...e, type: 'charged'})),
        ...(sources[1] || []).map(e => ({...e, type: 'end'})),
        ...(sources[3] || []).map(e => ({...e, type: 'round_end'})),
        ...(sources[4] || []).map(e => ({...e, type: 'round_start'}))
      ];

      const mapTeams = new Map(
        (sources[2] || []).map(match => [
          match.mapId,
          {team1Name: match.team1Name, team2Name: match.team2Name}
        ])
      );

      return processTeamAdvantageEvents(events, mapTeams, ultimateAdvantageConfig);
    }
  },
  {
    name: 'team_alive_advantage',
    displayName: 'Team Alive Players Advantage',
    sources: [
      'kill_object_store',
      'hero_spawn_object_store', 
      'match_start_object_store',
      'round_end_object_store',
      'round_start_object_store'
    ],
    columnNames: [
      'mapId',
      'matchTime',
      'team1Name',
      'team2Name',
      'team1AliveCount',
      'team2AliveCount',
      'teamWithAliveAdvantage',
      'aliveAdvantageDiff'
    ],
    transform: (sources: any[][]): any[] => {
      const events = [
        ...(sources[0] || []).map(e => ({...e, type: 'kill'})),
        ...(sources[1] || []).map(e => ({...e, type: 'spawn'})),
        ...(sources[3] || []).map(e => ({...e, type: 'round_end'})),
        ...(sources[4] || []).map(e => ({...e, type: 'round_start'}))
      ];

      const mapTeams = new Map(
        (sources[2] || []).map(match => [
          match.mapId,
          {team1Name: match.team1Name, team2Name: match.team2Name}
        ])
      );

      return processTeamAdvantageEvents(events, mapTeams, playerAliveAdvantageConfig);
    }
  }
];
