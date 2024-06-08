/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {AlaSQLNode, FilterNode} from '../../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../../hooks/useData';
import useUUID from '../../../hooks/useUUID';
import {useMapContext} from '../context/MapContext';
import {
  DvaDemech,
  DvaRemech,
  Kill,
  MercyRez,
  OffensiveAssist,
  RemechCharged,
} from '../../../lib/data/NodeData';

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

const usePlayerEvents = (): PlayerEvents | null => {
  const {mapId} = useMapContext();
  const uuid = useUUID();
  const data = useDataNodes([
    new FilterNode<Kill>(
      'UsePlayerEvents_kills_' + mapId + '_' + uuid,
      'Kills in Map',
      'mapId',
      mapId,
      'kill_object_store',
      [
        'mapId',
        'type',
        'matchTime',
        'attackerName',
        'attackerTeam',
        'attackerHero',
        'victimName',
        'victimTeam',
        'victimHero',
        'eventAbility',
        'eventDamage',
        'isCriticalHit',
        'isEnvironmental',
      ],
    ),
    new FilterNode<OffensiveAssist>(
      'UsePlayerEvents_offensive_assists_' + mapId + '_' + uuid,
      'Offensive Assists in Map',
      'mapId',
      mapId,
      'offensive_assist_object_store',
      [
        'mapId',
        'type',
        'matchTime',
        'playerName',
        'playerTeam',
        'playerHero',
        'heroDuplicated',
      ],
    ),
    new FilterNode<OffensiveAssist>(
      'UsePlayerEvents_defensive_assists_' + mapId + '_' + uuid,
      'Defensive Assists in Map',
      'mapId',
      mapId,
      'defensive_assist_object_store',
      [
        'mapId',
        'type',
        'matchTime',
        'playerName',
        'playerTeam',
        'playerHero',
        'heroDuplicated',
      ],
    ),
    new FilterNode<RemechCharged>(
      'UsePlayerEvents_remech_charged_' + mapId + '_' + uuid,
      'Remech Charged in Map',
      'mapId',
      mapId,
      'remech_charged_object_store',
      [
        'mapId',
        'type',
        'matchTime',
        'playerName',
        'playerTeam',
        'playerHero',
        'heroDuplicated',
      ],
    ),
    new FilterNode<MercyRez>(
      'UsePlayerEvents_mercy_rez_' + mapId + '_' + uuid,
      'Mercy Rez in Map',
      'mapId',
      mapId,
      'mercy_rez_object_store',
      [
        'mapId',
        'type',
        'matchTime',
        'mercyName',
        'mercyTeam',
        'revivedHero',
        'revivedTeam',
      ],
    ),
    new FilterNode<DvaDemech>(
      'UsePlayerEvents_dva_demech_' + mapId + '_' + uuid,
      'Dva Demech in Map',
      'mapId',
      mapId,
      'dva_demech_object_store',
      [
        'mapId',
        'type',
        'matchTime',
        'attackerName',
        'attackerTeam',
        'attackerHero',
        'victimName',
        'victimTeam',
        'victimHero',
        'eventAbility',
        'eventDamage',
        'isCriticalHit',
        'isEnvironmental',
      ],
    ),
    new FilterNode<DvaRemech>(
      'UsePlayerEvents_dva_remech_' + mapId + '_' + uuid,
      'Dva Remech in Map',
      'mapId',
      mapId,
      'dva_remech_object_store',
      ['mapId', 'type', 'matchTime', 'playerName', 'playerHero', 'playerTeam'],
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
