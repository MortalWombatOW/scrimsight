/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../useData';
import useUUID from '../useUUID';

type PlayerEventType =
  | 'kill'
  | 'defensiveAssist'
  | 'offensiveAssist'
  | 'comboAssist'
  | 'ultimateCharged'
  | 'ultimateStart'
  | 'ultimateEnd'
  | 'remechCharged'
  | 'mercyRez'
  | 'dvaDemech'
  | 'dvaRemech';

type PlayerEvent = {
  player: string;
  team: string;
  matchTime: number;
  eventMessage: string;
  eventType: PlayerEventType;
  hero?: string;
  targetPlayer?: string;
};

export type PlayerEvents = {
  [key: string]: PlayerEvent[];
};

const usePlayerEvents = (mapId: number): PlayerEvents | null => {
  const uuid = useUUID();
  const data = useDataNodes([
    new AlaSQLNode(
      'UsePlayerEvents_kills_' + mapId + '_' + uuid,
      `SELECT
        kill.*
      FROM ? AS kill
      WHERE
        kill.mapId = ${mapId}
      `,
      ['kill_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerEvents_offensive_assists_' + mapId + '_' + uuid,
      `SELECT
        offensive_assist.*
      FROM ? AS offensive_assist
      WHERE
        offensive_assist.mapId = ${mapId}
      `,
      ['offensive_assist_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerEvents_defensive_assists_' + mapId + '_' + uuid,
      `SELECT

        defensive_assist.*
      FROM ? AS defensive_assist
      WHERE
        defensive_assist.mapId = ${mapId}
      `,
      ['defensive_assist_object_store'],
    ),
    // new AlaSQLNode(
    //   'UsePlayerEvents_ultimate_charged_' + mapId,
    //   `SELECT
    //     ultimate_charged.*
    //   FROM ? AS ultimate_charged
    //   WHERE
    //     ultimate_charged.mapId = ${mapId}
    //   `,
    //   ['ultimate_charged_object_store'],
    // ),
    // new AlaSQLNode(
    //   'UsePlayerEvents_ultimate_start_' + mapId,
    //   `SELECT
    //     ultimate_start.*
    //   FROM ? AS ultimate_start
    //   WHERE
    //     ultimate_start.mapId = ${mapId}
    //   `,
    //   ['ultimate_start_object_store'],
    // ),
    // new AlaSQLNode(
    //   'UsePlayerEvents_ultimate_end_' + mapId,
    //   `SELECT
    //     ultimate_end.*
    //   FROM ? AS ultimate_end
    //   WHERE
    //     ultimate_end.mapId = ${mapId}
    //   `,
    //   ['ultimate_end_object_store'],
    // ),

    new AlaSQLNode(
      'UsePlayerEvents_remech_charged_' + mapId + '_' + uuid,
      `SELECT
        remech_charged.*
      FROM ? AS remech_charged
      WHERE
        remech_charged.mapId = ${mapId}
      `,
      ['remech_charged_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerEvents_mercy_rez_' + mapId + '_' + uuid,
      `SELECT
        mercy_rez.*
      FROM ? AS mercy_rez
      WHERE
        mercy_rez.mapId = ${mapId}
      `,
      ['mercy_rez_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerEvents_dva_demech_' + mapId + '_' + uuid,
      `SELECT
        dva_demech.*
      FROM ? AS dva_demech
      WHERE
        dva_demech.mapId = ${mapId}
      `,
      ['dva_demech_object_store'],
    ),
    new AlaSQLNode(
      'UsePlayerEvents_dva_remech_' + mapId + '_' + uuid,
      `SELECT
        dva_remech.*
      FROM ? AS dva_remech
      WHERE
        dva_remech.mapId = ${mapId}
      `,
      ['dva_remech_object_store'],
    ),
  ]);

  const kills = data['UsePlayerEvents_kills_' + mapId + '_' + uuid];
  const offensiveAssists =
    data['UsePlayerEvents_offensive_assists_' + mapId + '_' + uuid];
  const defensiveAssists =
    data['UsePlayerEvents_defensive_assists_' + mapId + '_' + uuid];
  // const ultimateCharged = data['UsePlayerEvents_ultimate_charged_' + mapId + '_' + uuid];
  // const ultimateStart = data['UsePlayerEvents_ultimate_start_' + mapId + '_' + uuid];
  // const ultimateEnd = data['UsePlayerEvents_ultimate_end_' + mapId + '_' + uuid];
  const remechCharged =
    data['UsePlayerEvents_remech_charged_' + mapId + '_' + uuid];
  const mercyRez = data['UsePlayerEvents_mercy_rez_' + mapId + '_' + uuid];
  const dvaDemech = data['UsePlayerEvents_dva_demech_' + mapId + '_' + uuid];
  const dvaRemech = data['UsePlayerEvents_dva_remech_' + mapId + '_' + uuid];

  const [events, setEvents] = useState<PlayerEvents | null>(null);

  useEffect(() => {
    if (
      !kills ||
      !offensiveAssists ||
      !defensiveAssists ||
      // !ultimateCharged ||
      // !ultimateStart ||
      // !ultimateEnd ||
      !remechCharged ||
      !mercyRez ||
      !dvaDemech ||
      !dvaRemech
    ) {
      return;
    }

    // offensive and defensive assists can happen at the same time, so we need to merge them
    const mergedAssists: PlayerEvent[] = [];

    let offIdx = 0;
    let defIdx = 0;
    while (
      offIdx < offensiveAssists.length &&
      defIdx < defensiveAssists.length
    ) {
      if (
        offensiveAssists[offIdx].matchTime < defensiveAssists[defIdx].matchTime
      ) {
        mergedAssists.push({
          player: offensiveAssists[offIdx].playerName,
          team: offensiveAssists[offIdx].playerTeam,
          matchTime: offensiveAssists[offIdx].matchTime,
          eventMessage: 'Offensive Assist',
          eventType: 'offensiveAssist' as PlayerEventType,
        });

        offIdx++;
      } else if (
        offensiveAssists[offIdx].matchTime > defensiveAssists[defIdx].matchTime
      ) {
        mergedAssists.push({
          player: defensiveAssists[defIdx].playerName,
          team: defensiveAssists[defIdx].playerTeam,
          matchTime: defensiveAssists[defIdx].matchTime,
          eventMessage: 'Defensive Assist',
          eventType: 'defensiveAssist' as PlayerEventType,
        });
        defIdx++;
      } else {
        mergedAssists.push({
          player: offensiveAssists[offIdx].playerName,
          team: offensiveAssists[offIdx].playerTeam,
          matchTime: offensiveAssists[offIdx].matchTime,
          eventMessage: 'Combo Assist',
          eventType: 'comboAssist' as PlayerEventType,
        });
        offIdx++;
        defIdx++;
      }
    }

    const playerEvents: PlayerEvent[] = [
      ...kills.map((kill: any) => ({
        player: kill.attackerName as string,
        team: kill.attackerTeam as string,
        matchTime: kill.matchTime as number,
        eventMessage: `Killed ${kill.victimName}`,
        eventType: 'kill' as PlayerEventType,
        hero: kill.victimHero as string,
        targetPlayer: kill.victimName as string,
      })),
      ...mergedAssists,
      // ...ultimateCharged.map((charge: any) => ({
      //   player: charge.playerName,
      //   matchTime: charge.matchTime,
      //   eventMessage: 'Ultimate Charged',
      //   eventType: 'ultimateCharged' as PlayerEventType,
      // })),

      // ...ultimateStart.map((start: any) => ({
      //   player: start.playerName,
      //   matchTime: start.matchTime,
      //   eventMessage: 'Ultimate Used',
      //   eventType: 'ultimateStart' as PlayerEventType,
      // })),

      // ...ultimateEnd.map((end: any) => ({
      //   player: end.playerName,
      //   matchTime: end.matchTime,
      //   eventMessage: 'Ultimate Ended',
      //   eventType: 'ultimateEnd' as PlayerEventType,
      // })),

      ...remechCharged.map((charge: any) => ({
        player: charge.playerName,
        team: charge.playerTeam,
        matchTime: charge.matchTime,
        eventMessage: 'Remech Charged',
        eventType: 'remechCharged' as PlayerEventType,
      })),
      ...mercyRez.map((rez: any) => ({
        player: rez.mercyName,
        team: rez.mercyTeam,
        matchTime: rez.matchTime,
        // TODO revivedHero is actually the name of the player who was revived
        eventMessage: 'Revived ' + rez.revivedHero,
        eventType: 'mercyRez' as PlayerEventType,
        // TODO revivedTeam is actually the name of the hero who was revived
        hero: rez.revivedTeam,
        targetPlayer: rez.revivedHero,
      })),
      ...dvaDemech.map((demech: any) => ({
        team: demech.playerTeam,
        player: demech.playerName,
        matchTime: demech.matchTime,
        eventMessage: 'Demeched',
        eventType: 'dvaDemech' as PlayerEventType,
      })),
      ...dvaRemech.map((remech: any) => ({
        player: remech.playerName,
        team: remech.playerTeam,
        matchTime: remech.matchTime,
        eventMessage: 'Remeched',
        eventType: 'dvaRemech' as PlayerEventType,
      })),
    ];

    playerEvents.sort((a, b) => a.matchTime - b.matchTime);

    const playerEventsByPlayer: PlayerEvents = {};

    for (const event of playerEvents) {
      if (!playerEventsByPlayer[event.player]) {
        playerEventsByPlayer[event.player] = [];
      }

      playerEventsByPlayer[event.player].push(event);
    }

    setEvents(playerEventsByPlayer);
  }, [
    JSON.stringify(kills),
    JSON.stringify(offensiveAssists),
    JSON.stringify(defensiveAssists),
    // JSON.stringify(ultimateCharged),
    // JSON.stringify(ultimateStart),
    // JSON.stringify(ultimateEnd),
    JSON.stringify(remechCharged),
    JSON.stringify(mercyRez),
    JSON.stringify(dvaDemech),
    JSON.stringify(dvaRemech),
  ]);

  console.log('events', events);

  return events;
};

export default usePlayerEvents;
