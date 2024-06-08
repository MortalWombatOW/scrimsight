/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {AlaSQLNode, FilterNode} from '../../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../../hooks/useData';
import useMapTimes from './useMapTimes';
import {useMapContext} from '../context/MapContext';
import {UltimateCharged, UltimateStart} from '../../../lib/data/NodeData';

type PlayerUltimate = {
  playerName: string;
  playerHero: string;
  playerTeam: string;
  chargedTime: number;
  usedTime: number | null;
};
const useUltimateTimes = (): PlayerUltimate[] | null => {
  const {mapId} = useMapContext();
  const data = useDataNodes([
    new FilterNode<UltimateCharged>(
      'UseUltimateTimes_ultimate_charged_' + mapId,
      'Ultimate Charged Times',
      'mapId',
      mapId,
      'ultimate_charged_object_store',
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
    new FilterNode<UltimateStart>(
      'UseUltimateTimes_ultimate_start_' + mapId,
      'Ultimate Start Times',
      'mapId',
      mapId,
      'ultimate_start_object_store',
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
  ]);

  const mapTimes = useMapTimes();
  const ultimateCharged = data['UseUltimateTimes_ultimate_charged_' + mapId];
  const ultimateUsed = data['UseUltimateTimes_ultimate_start_' + mapId];
  const [output, setOutput] = useState<PlayerUltimate[] | null>(null);

  useEffect(() => {
    if (!ultimateCharged || !ultimateUsed || !mapTimes) {
      return;
    }

    const players = Array.from(
      new Set(ultimateCharged.map((c: any) => c.playerName)),
    );

    const ultimateTimes: PlayerUltimate[] = [];

    for (const player of players) {
      const playerCharged = ultimateCharged.filter(
        (c: any) => c.playerName === player,
      );
      const playerUsed = ultimateUsed.filter(
        (u: any) => u.playerName === player,
      );

      const playerUltimates = playerCharged.map((c: any) => {
        const used = playerUsed.find((u: any) => u.matchTime >= c.matchTime);
        const potentialUltEndingMapEvents = mapTimes
          .map((m: any) => m.endTime)
          .filter((e: any) => e >= c.matchTime);

        const end = Math.min(
          used ? used.matchTime : Infinity,
          ...potentialUltEndingMapEvents,
        );
        return {
          playerName: c.playerName,
          playerHero: c.playerHero,
          playerTeam: c.playerTeam,
          chargedTime: c.matchTime,
          usedTime: end,
        };
      });

      ultimateTimes.push(...playerUltimates);
    }
    setOutput(ultimateTimes);
  }, [
    JSON.stringify(ultimateCharged),
    JSON.stringify(ultimateUsed),
    JSON.stringify(mapTimes),
  ]);

  return output;
};

export default useUltimateTimes;
