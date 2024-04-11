/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../../hooks/useData';
import useMapTimes from './useMapTimes';
import {useMapContext} from '../context/MapContext';

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
    new AlaSQLNode(
      'UseUltimateTimes_ultimate_charged_' + mapId,
      `SELECT
        ultimate_charged.*
      FROM ? AS ultimate_charged
      WHERE
        ultimate_charged.mapId = ${mapId}
      ORDER BY
        ultimate_charged.matchTime
      `,
      ['ultimate_charged_object_store'],
    ),
    new AlaSQLNode(
      'UseUltimateTimes_ultimate_start_' + mapId,
      `SELECT
        ultimate_start.*
      FROM ? AS ultimate_start
      WHERE
        ultimate_start.mapId = ${mapId}
      ORDER BY
        ultimate_start.matchTime
      `,
      ['ultimate_start_object_store'],
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
