/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {useDataNodes} from './useData';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import useMapTimes from './useMapTimes';

const useGlobalMapEvents = (
  mapId: number,
):
  | {
      matchTime: number;
      eventMessage: string;
    }[]
  | null => {
  // This hook is used to get the global map events for a specific map.
  // setup complete, objective captured,
  const data = useDataNodes([
    new AlaSQLNode(
      'UseGlobalMapEvents_setup_complete_' + mapId,
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
      'UseGlobalMapEvents_objective_captured_' + mapId,
      `SELECT
        objective_captured.*
        FROM ? AS objective_captured
      WHERE
        objective_captured.mapId = ${mapId}
      `,
      ['objective_captured_object_store'],
    ),
  ]);

  const setupComplete = data['UseGlobalMapEvents_setup_complete_' + mapId];
  const objectiveCaptured =
    data['UseGlobalMapEvents_objective_captured_' + mapId];

  // match start, match end, round start, round end
  // first index is the match start and end, other indexes are the rounds
  const matchTimes = useMapTimes(mapId, 'UseGlobalMapEvents_');

  const [events, setEvents] = useState<
    | {
        matchTime: number;
        eventMessage: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    if (!setupComplete || !objectiveCaptured || !matchTimes) {
      return;
    }

    const mapEvents = [
      {
        matchTime: matchTimes[0].startTime,
        eventMessage: 'Match Start',
      },
      {
        matchTime: matchTimes[0].endTime,
        eventMessage: 'Match End',
      },
    ];

    for (const [index, round] of matchTimes.slice(1).entries()) {
      mapEvents.push({
        matchTime: round.startTime,
        eventMessage: `Round ${index} start`,
      });

      mapEvents.push({
        matchTime: round.endTime,
        eventMessage: `Round ${index} end`,
      });
    }

    for (const event of setupComplete) {
      mapEvents.push({
        matchTime: event.matchTime,
        eventMessage: 'Setup complete',
      });
    }

    for (const event of objectiveCaptured) {
      mapEvents.push({
        matchTime: event.matchTime,
        eventMessage: `Objective captured by ${
          event.capturingTeam
        } (${event.controlTeam1Progress.toFixed(
          0,
        )}% to ${event.controlTeam2Progress.toFixed(0)}%)`,
      });
    }

    mapEvents.sort((a, b) => a.matchTime - b.matchTime);

    console.log('mapEvents', mapEvents);

    setEvents(mapEvents);
  }, [
    JSON.stringify(setupComplete),
    JSON.stringify(objectiveCaptured),
    JSON.stringify(matchTimes),
  ]);

  return events;
};

export default useGlobalMapEvents;
