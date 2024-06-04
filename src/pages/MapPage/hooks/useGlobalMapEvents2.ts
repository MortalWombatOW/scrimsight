/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {useDataNodes} from '../../../hooks/useData';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import useMapTimes from './useMapTimes';
import useUUID from '../../../hooks/useUUID';
import {useMapContext} from '../context/MapContext';
import {useFilterContext} from '../../../context/FilterContextProvider';

const useGlobalMapEvents2 = (): {
  matchStartTime: number | null;
  matchEndTime: number | null;
  round1StartTime: number | null;
  round1EndTime: number | null;
  round2StartTime: number | null;
  round2EndTime: number | null;
  round3StartTime: number | null;
  round3EndTime: number | null;
} => {
  const {filters} = useFilterContext();
  const mapId = filters['mapId'];
  console.log('mapId', mapId);
  const uuid = useUUID();

  const data = useDataNodes([
    new AlaSQLNode(
      'UseGlobalMapEvents_setup_complete_' + mapId + '_' + uuid,
      `SELECT
        setup_complete.matchTime,
        'Setup Complete' as eventMessage
      FROM ? AS setup_complete
      WHERE
        setup_complete.mapId = ${mapId}
      `,
      ['setup_complete_object_store'],
    ),
    new AlaSQLNode(
      'UseGlobalMapEvents_objective_captured_' + mapId + '_' + uuid,
      `SELECT
        objective_captured.*
        FROM ? AS objective_captured
      WHERE
        objective_captured.mapId = ${mapId}
      `,
      ['objective_captured_object_store'],
    ),
  ]);

  const setupComplete =
    data['UseGlobalMapEvents_setup_complete_' + mapId + '_' + uuid];
  const objectiveCaptured =
    data['UseGlobalMapEvents_objective_captured_' + mapId + '_' + uuid];

  const matchTimes = useMapTimes();

  const [events, setEvents] = useState<{
    matchStartTime: number | null;
    matchEndTime: number | null;
    round1StartTime: number | null;
    round1EndTime: number | null;
    round2StartTime: number | null;
    round2EndTime: number | null;
    round3StartTime: number | null;
    round3EndTime: number | null;
  }>({
    matchStartTime: null,
    matchEndTime: null,
    round1StartTime: null,
    round1EndTime: null,
    round2StartTime: null,
    round2EndTime: null,
    round3StartTime: null,
    round3EndTime: null,
  });

  useEffect(() => {
    if (!setupComplete || !objectiveCaptured || !matchTimes) {
      return;
    }

    const mapEvents = {
      matchStartTime: matchTimes[0]?.startTime || null,
      matchEndTime: matchTimes[0]?.endTime || null,
      round1StartTime: matchTimes[1]?.startTime || null,
      round1EndTime: matchTimes[1]?.endTime || null,
      round2StartTime: matchTimes[2]?.startTime || null,
      round2EndTime: matchTimes[2]?.endTime || null,
      round3StartTime: matchTimes[3]?.startTime || null,
      round3EndTime: matchTimes[3]?.endTime || null,
    };

    setEvents(mapEvents);
  }, [
    JSON.stringify(setupComplete),
    JSON.stringify(objectiveCaptured),
    JSON.stringify(matchTimes),
  ]);

  return events;
};

export default useGlobalMapEvents2;
