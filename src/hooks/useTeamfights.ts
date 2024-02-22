/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {useDataNodes} from './useData';
import useMapRosters from './useMapRosters';

type Teamfight = {
  // timestamps
  start: number;
  end: number;
  // number of kills
  team1Kills: number;
  team2Kills: number;
  // the winning team
  winningTeam: string;
};

const useTeamfights = (mapId: number): Teamfight[] | null => {
  // kills, offensive assists, defensive assists, ultimate charged, ultimate started, ultimate ended, remech charged, mercy rez, dva demech, dva remech,
  const data = useDataNodes([
    new AlaSQLNode(
      'UsePlayerEvents_kills_' + mapId,
      `SELECT
        kill.*
      FROM ? AS kill
      WHERE
        kill.mapId = ${mapId}
      `,
      ['kill_object_store'],
    ),

    new AlaSQLNode(
      'UsePlayerEvents_ultimate_start_' + mapId,
      `SELECT
        ultimate_start.*
      FROM ? AS ultimate_start
      WHERE
        ultimate_start.mapId = ${mapId}
      `,
      ['ultimate_start_object_store'],
    ),
  ]);

  const kills = data['UsePlayerEvents_kills_' + mapId];
  const ultimateStart = data['UsePlayerEvents_ultimate_start_' + mapId];

  const roster = useMapRosters(mapId, 'UseTeamfights_');
  const team1Name = roster?.team1.name;
  const team2Name = roster?.team2.name;

  const [teamfights, setTeamfights] = useState<Teamfight[] | null>(null);

  // A teamfight lasts from the first kill to the last kill, whereafter there are no kills for 10 seconds.
  // The winning team is the team with the most kills.

  useEffect(() => {
    if (!kills || !ultimateStart || !roster || !team1Name || !team2Name) {
      return;
    }

    const teamfights: Teamfight[] = [];

    let currentTeamfight: Teamfight | null = null;

    let killIdx = 0;

    // Loop through all the kills
    // If the kill is within 10 seconds of the last kill, add it to the current teamfight
    // If it's not, start a new teamfight
    while (killIdx < kills.length) {
      const kill = kills[killIdx];

      if (currentTeamfight === null) {
        currentTeamfight = {
          start: kill.matchTime,
          end: kill.matchTime,
          team1Kills: 0,
          team2Kills: 0,
          winningTeam: '',
        };
      }

      if (kill.matchTime - currentTeamfight.end < 20) {
        currentTeamfight.end = kill.matchTime;

        if (kill.playerTeam === team1Name) {
          currentTeamfight.team1Kills++;
        } else {
          currentTeamfight.team2Kills++;
        }
      } else {
        currentTeamfight.winningTeam =
          currentTeamfight.team1Kills > currentTeamfight.team2Kills
            ? team1Name
            : team2Name;
        teamfights.push(currentTeamfight);
        currentTeamfight = null;
      }

      killIdx++;
    }

    console.log('teamfights', teamfights);

    setTeamfights(teamfights);
  }, [
    JSON.stringify(kills),
    JSON.stringify(ultimateStart),
    JSON.stringify(roster),
  ]);

  return teamfights;
};

export default useTeamfights;
