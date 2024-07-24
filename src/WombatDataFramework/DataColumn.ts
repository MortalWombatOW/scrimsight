import {format} from '../lib/format';
import {DataUnit, DataBasicUnit, DataRatioUnit} from './DataUnits';

export type DataColumnTypeInput = 'string' | 'number' | 'boolean';

export type DataColumnType = string | number | boolean;

export interface DataColumn {
  name: string;
  displayName: string;
  description: string;
  units: DataUnit;
  dataType: DataColumnTypeInput;
  formatter: (data: DataColumnType) => string;
  comparator: (a: DataColumnType, b: DataColumnType) => number;
}

function makeDataColumn(
  name: string,
  displayName: string,
  description: string,
  units: DataUnit,
  dataType: DataColumnTypeInput,
  formatter: (data: DataColumnType) => string,
  comparator: (a: DataColumnType, b: DataColumnType) => number,
): DataColumn {
  return {
    name,
    displayName,
    description,
    units,
    dataType,
    formatter,
    comparator,
  };
}

function makeRatioUnits(numerator: DataBasicUnit, denominator: DataBasicUnit): DataRatioUnit {
  return {numerator, denominator};
}

// common formatters and comparators
const stringFormatter = (data: DataColumnType) => data.toString();
const stringComparator = (a: DataColumnType, b: DataColumnType) => a.toString().localeCompare(b.toString());

const numberFormatter = (data: DataColumnType) => format(data as number);
const percentFormatter = (data: DataColumnType) => `${data}%`;
const numberComparator = (a: DataColumnType, b: DataColumnType) => (a as number) - (b as number);

const booleanFormatter = (data: DataColumnType) => ((data as boolean) ? 'Yes' : 'No');
const booleanComparator = (a: DataColumnType, b: DataColumnType) => {
  if (a === b) {
    return 0;
  }
  if (a) {
    return 1;
  }
  return -1;
};

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
];
