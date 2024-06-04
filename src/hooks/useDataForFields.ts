import React from 'react';
import {useDataNodes} from './useData';
import {
  AlaSQLNode,
  DataNode,
  ObjectStoreNode,
} from '../WombatDataFramework/DataTypes';
import useGlobalMapEvents2 from '../pages/MapPage/hooks/useGlobalMapEvents2';

const matchFields = (queryInputFields: string[], nodeFields: string[]) => {
  return queryInputFields.every((f) => nodeFields.includes(f));
};

const singleDataNodes: {
  fields: string[];
  node: DataNode<any>;
}[] = [
  // Match Start
  {
    fields: ['mapId', 'team1Name', 'team2Name', 'mapName', 'mapType'],
    node: new ObjectStoreNode<any>('match_start_v2', 'match_start'),
  },
  // Match End
  {
    fields: ['mapId', 'mapEndTime', 'totalRounds', 'team1Score', 'team2Score'],
    node: new AlaSQLNode<any>(
      'match_end_renamed',
      `SELECT
        mapId,
        matchTime as mapEndTime,
        roundNumber as totalRounds,
        team1Score,
        team2Score
      FROM ? AS match_end
      `,
      ['match_end_object_store'],
    ),
  },
  // Defensive Assist
  {
    fields: [
      'mapId',
      'defensiveAssistTime',
      'assisterName',
      'assisterTeam',
      'assisterHero',
    ],
    node: new AlaSQLNode<any>(
      'defensive_assist_renamed',
      `SELECT
        mapId,
        matchTime as defensiveAssistTime,
        playerName as assisterName,
        playerTeam as assisterTeam,
        playerHero as assisterHero
      FROM ? AS defensive_assist
      `,
      ['defensive_assist_object_store'],
    ),
  },
  // Offensive Assist
  {
    fields: [
      'mapId',
      'offensiveAssistTime',
      'assisterName',
      'assisterTeam',
      'assisterHero',
    ],
    node: new AlaSQLNode<any>(
      'offensive_assist_renamed',
      `SELECT
        mapId,
        matchTime as offensiveAssistTime,
        playerName as assisterName,
        playerTeam as assisterTeam,
        playerHero as assisterHero
      FROM ? AS offensive_assist
      `,
      ['offensive_assist_object_store'],
    ),
  },
  // echo Duplicate Start
  {
    fields: ['mapId', 'echoDuplicateStartTime', 'echoName', 'echoTeam'],
    node: new AlaSQLNode<any>(
      'echo_duplicate_start_renamed',
      `SELECT
        mapId,
        matchTime as echoDuplicateStartTime,
        playerName as echoName,
        playerTeam as echoTeam
      FROM ? AS echo_duplicate_start
      `,
      ['echo_duplicate_start_object_store'],
    ),
  },
  // echo Duplicate End
  {
    fields: ['mapId', 'echoDuplicateEndTime', 'echoName', 'echoTeam'],
    node: new AlaSQLNode<any>(
      'echo_duplicate_end_renamed',
      `SELECT
        mapId,
        matchTime as echoDuplicateEndTime,
        playerName as echoName,
        playerTeam as echoTeam
      FROM ? AS echo_duplicate_end
      `,
      ['echo_duplicate_end_object_store'],
    ),
  },
  // hero spawn
  {
    fields: ['mapId', 'heroSpawnTime', 'heroName', 'heroTeam'],
    node: new AlaSQLNode<any>(
      'hero_spawn_renamed',
      `SELECT
        mapId,
        matchTime as heroSpawnTime,
        playerName as heroName,
        playerTeam as heroTeam
      FROM ? AS hero_spawn
      `,
      ['hero_spawn_object_store'],
    ),
  },
  // hero swap
  {
    fields: ['mapId', 'heroSwapTime', 'heroName', 'heroTeam'],
    node: new AlaSQLNode<any>(
      'hero_swap_renamed',
      `SELECT
        mapId,
        matchTime as heroSwapTime,
        playerName as heroName,
        playerTeam as heroTeam
      FROM ? AS hero_swap
      `,
      ['hero_swap_object_store'],
    ),
  },
  // kill
  {
    fields: [
      'mapId',
      'killTime',
      'killerName',
      'killerTeam',
      'killerHero',
      'victimName',
      'victimTeam',
      'victimHero',
    ],
    node: new AlaSQLNode<any>(
      'kill_renamed',
      `SELECT
        mapId,
        matchTime as killTime,
        playerName as killerName,
        playerTeam as killerTeam,
        playerHero as killerHero,
        victimName as victimName,
        victimTeam as victimTeam,
        victimHero as victimHero
      FROM ? AS kill
      `,
      ['kill_object_store'],
    ),
  },
  // maps
  {
    fields: ['mapId', 'fileName', 'fileModifiedTime'],
    node: new AlaSQLNode<any>(
      'maps_renamed',
      `SELECT
        mapId,
        name as fileName,
        fileModified as fileModifiedTime
      FROM ? AS maps
      `,
      ['maps_object_store'],
    ),
  },
  // match times
  {
    fields: [
      'mapId',
      'mapDuration',
      'team1Score',
      'team2Score',
      'totalRounds',
      'mapName',
      'mapType',
      'team1Name',
      'team2Name',
    ],
    node: new AlaSQLNode<any>(
      'match_times_renamed',
      `SELECT
        match_start.mapId,
        match_end.matchTime as mapDuration,
        match_end.team1Score,
        match_end.team2Score,
        match_end.roundNumber as totalRounds,
        match_start.mapName as mapName,
        match_start.mapType,
        match_start.team1Name,
        match_start.team2Name
      FROM ? AS match_start
      INNER JOIN ? AS match_end
      ON match_start.mapId = match_end.mapId
      `,
      ['match_start_object_store', 'match_end_object_store'],
    ),
  },
  // objective capture
  {
    fields: [
      'mapId',
      'objectiveCaptureTime',
      'objectiveCapturerRoundNumber',
      'objectiveCapturingTeamName',
      'objectiveCapturedPoint',
      'objectiveCaptureControlTeam1Percentage',
      'objectiveCaptureControlTeam2Percentage',
      'objectiveCapturedMatchTimeRemaining',
    ],
    node: new AlaSQLNode<any>(
      'objective_capture_renamed',
      `SELECT
        mapId,
        matchTime as objectiveCaptureTime,
        roundNumber as objectiveCapturerRoundNumber,
        capturingTeam as objectiveCapturingTeamName,
        objectiveIndex as objectiveCapturedPoint,
        controlTeam1Percentage as objectiveCaptureControlTeam1Percentage,
        controlTeam2Percentage as objectiveCaptureControlTeam2Percentage,
        matchTimeRemaining as objectiveCapturedMatchTimeRemaining
      FROM ? AS objective_capture
      `,
      ['objective_capture_object_store'],
    ),
  },
  // payload progress
  {
    fields: [
      'mapId',
      'payloadProgressTime',
      'payloadProgressRoundNumber',
      'payloadProgressCapturingTeamName',
      'payloadProgressPoint',
      'payloadCapturePercentage',
    ],
    node: new AlaSQLNode<any>(
      'payload_progress_renamed',
      `SELECT
        mapId,
        matchTime as payloadProgressTime,
        roundNumber as payloadProgressRoundNumber,
        capturingTeam as payloadProgressCapturingTeamName,
        objectiveIndex as payloadProgressPoint,
        payloadCaptureProgress as payloadCapturePercentage
      FROM ? AS payload_progress
      `,
      ['payload_progress_object_store'],
    ),
  },
  // player stat
  {
    fields: [
      'mapId',
      'playerName',
      'playerTeam',
      'playerHero',
      'playerStatEliminations',
      'playerStatDeaths',
      'playerStatFinalBlows',
      'playerStatDamage',
      'playerStatHealing',
      'playerStatBarrierDamage',
      'playerStatHeroDamage',
      'playerStatHealingDealt',
      'playerStatHealingReceived',
      'playerStatSelfHealing',
      'playerStatDamageTaken',
      'playerStatDamageBlocked',
      'playerStatDefensiveAssists',
      'playerStatOffensiveAssists',
      'playerStatKills',
      'playerStatAssists',
      'playerStatMultikillBest',
      'playerStatMultikills',
      'playerStatSoloKills',
      'playerStatObjectiveKills',
      'playerStatEnvironmentalKills',
      'playerStatEnvironmentalDeaths',
      'playerStatCriticalHits',
      'playerStatCriticalHitAccuracy',
      'playerStatScopedAccuracy',
      'playerStatScopedCriticalHitAccuracy',
      'playerStatScopedCriticalHitKills',
      'playerStatShotsFired',
      'playerStatShotsHit',
      'playerStatShotsMissed',
      'playerStatScopedShotsFired',
      'playerStatUltimatesEarned',
      'playerStatUltimatesUsed',
    ],
    node: new AlaSQLNode<any>(
      'player_stat_renamed',
      `SELECT
        mapId,
        playerName,
        playerTeam,
        playerHero,
        eliminations as playerStatEliminations,
        deaths as playerStatDeaths,
        finalBlows as playerStatFinalBlows,
        damage as playerStatDamage,
        healing as playerStatHealing,
        barrierDamage as playerStatBarrierDamage,
        heroDamage as playerStatHeroDamage,
        healingDealt as playerStatHealingDealt,
        healingReceived as playerStatHealingReceived,
        selfHealing as playerStatSelfHealing,
        damageTaken as playerStatDamageTaken,
        damageBlocked as playerStatDamageBlocked,
        defensiveAssists as playerStatDefensiveAssists,
        offensiveAssists as playerStatOffensiveAssists,
        kills as playerStatKills,
        assists as playerStatAssists,
        multikillBest as playerStatMultikillBest,
        multikills as playerStatMultikills,
        soloKills as playerStatSoloKills,
        objectiveKills as playerStatObjectiveKills,
        environmentalKills as playerStatEnvironmentalKills,
        environmentalDeaths as playerStatEnvironmentalDeaths,
        criticalHits as playerStatCriticalHits,
        criticalHitAccuracy as playerStatCriticalHitAccuracy,
        scopedAccuracy as playerStatScopedAccuracy,
        scopedCriticalHitAccuracy as playerStatScopedCriticalHitAccuracy,
        scopedCriticalHitKills as playerStatScopedCriticalHitKills,
        shotsFired as playerStatShotsFired,
        shotsHit as playerStatShotsHit,
        shotsMissed as playerStatShotsMissed,
        scopedShotsFired as playerStatScopedShotsFired,
        ultimatesEarned as playerStatUltimatesEarned,
        ultimatesUsed as playerStatUltimatesUsed
      FROM ? AS player_stat
      `,
      ['player_stat_object_store'],
    ),
  },
  {
    fields: [
      'mapId',
      'pointProgressTime',
      'pointProgressRoundNumber',
      'pointProgressCapturingTeamName',
      'pointProgressPoint',
      'pointCapturePercentage',
    ],
    node: new AlaSQLNode<any>(
      'point_progress_renamed',
      `SELECT
        mapId,
        matchTime as pointProgressTime,
        roundNumber as pointProgressRoundNumber,
        capturingTeam as pointProgressCapturingTeamName,
        objectiveIndex as pointProgressPoint,
        pointCaptureProgress as pointCapturePercentage
      FROM ? AS point_progress
      `,
      ['point_progress_object_store'],
    ),
  },
  {
    fields: [
      'mapId',
      'remechChargedTime',
      'remechChargedPlayerName',
      'remechChargedPlayerTeam',
    ],
    node: new AlaSQLNode<any>(
      'remech_charged_renamed',
      `SELECT
        mapId,
        matchTime as remechChargedTime,
        playerName as remechChargedPlayerName,
        playerTeam as remechChargedPlayerTeam
      FROM ? AS remech_charged
      `,
      ['remech_charged_object_store'],
    ),
  },
];

// we can disable the rule of hooks here because the same hook is called every time the component renders
export const useDataForFields = (fields: string[]) => {
  if (fields.length === 0) {
    throw new Error('No fields provided');
  }

  // if (
  //   matchFields(fields, [
  //     'matchStartTime',
  //     'matchEndTime',
  //     'round1StartTime',
  //     'round1EndTime',
  //     'round2StartTime',
  //     'round2EndTime',
  //     'round3StartTime',
  //     'round3EndTime',
  //   ])
  // ) {
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   return [useGlobalMapEvents2()];
  // }

  const node = singleDataNodes.find((n) => matchFields(fields, n.fields));

  if (!node) {
    throw new Error('No node found for fields');
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useDataNodes([node.node]);

  return node ? data[node.node.getName()] : [];
};
