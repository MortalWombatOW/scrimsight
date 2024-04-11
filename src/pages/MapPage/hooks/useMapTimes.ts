/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../../hooks/useData';
import useUUID from '../../../hooks/useUUID';
import {useMapContext} from '../context/MapContext';

const useMapTimes = ():
  | {
      startTime: number;
      endTime: number;
    }[]
  | null => {
  const {mapId} = useMapContext();
  const uuid = useUUID();
  const data = useDataNodes([
    new AlaSQLNode(
      'UseMapTimes_match_time_' + mapId + '_' + uuid,
      `SELECT
        match_start.matchTime as startTime,
        match_end.matchTime as endTime
      FROM ? AS match_start
      JOIN
      ? AS match_end
      ON
        match_start.mapId = match_end.mapId
      WHERE
        match_start.mapId = ${mapId}
      `,
      ['match_start_object_store', 'match_end_object_store'],
    ),
    new AlaSQLNode(
      'UseMapTimes_round_times_' + mapId + '_' + uuid,
      `SELECT
        round_start.roundNumber,
        round_start.matchTime as startTime,
        round_end.matchTime as endTime,
        round_end.capturingTeam
      FROM ? AS round_end
      JOIN
      ? AS round_start
      ON
        round_start.mapId = round_end.mapId
      AND round_start.roundNumber = round_end.roundNumber
      WHERE
        round_start.mapId = ${mapId}
      ORDER BY
        round_start.roundNumber
      `,
      ['round_end_object_store', 'round_start_object_store'],
    ),
  ]);

  const matchTimes = data['UseMapTimes_match_time_' + mapId + '_' + uuid];
  const roundTimes = data['UseMapTimes_round_times_' + mapId + '_' + uuid];

  // zero index is the whole match, other indexes are the rounds
  const [mapTimes, setMapTimes] = useState<
    | {
        startTime: number;
        endTime: number;
        winningTeam?: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    if (!matchTimes || !roundTimes || matchTimes.length === 0) {
      return;
    }

    const mapTimes = [
      {
        startTime: matchTimes[0].startTime,
        endTime: matchTimes[0].endTime,
      },
      ...roundTimes.map((round: any) => {
        return {
          startTime: round.startTime,
          endTime: round.endTime,
          capturingTeam: round.capturingTeam,
        };
      }),
    ];

    setMapTimes(mapTimes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(matchTimes), JSON.stringify(roundTimes)]);

  // console.log('mapTimes', mapTimes);

  return mapTimes;
};

export default useMapTimes;
