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

const useTeamfights = (mapId: number, prefix: string): Teamfight[] | null => {
  // kills, offensive assists, defensive assists, ultimate charged, ultimate started, ultimate ended, remech charged, mercy rez, dva demech, dva remech,
  const data = useDataNodes([
    new AlaSQLNode(
      prefix + 'useTeamfights_kills_' + mapId,
      `SELECT
        kill.*
      FROM ? AS kill
      WHERE
        kill.mapId = ${mapId}
      `,
      ['kill_object_store'],
    ),

    new AlaSQLNode(
      prefix + 'useTeamfights_ultimate_start_' + mapId,
      `SELECT
        ultimate_start.*
      FROM ? AS ultimate_start
      WHERE
        ultimate_start.mapId = ${mapId}
      `,
      ['ultimate_start_object_store'],
    ),
  ]);

  const kills = data[prefix + 'useTeamfights_kills_' + mapId];
  const ultimateStart = data[prefix + 'useTeamfights_ultimate_start_' + mapId];

  console.log('kills', prefix, kills);
  console.log('ultimateStart', prefix, ultimateStart);

  const roster = useMapRosters(mapId, prefix + 'useTeamfights_');
  const team1Name = roster?.team1.name;
  const team2Name = roster?.team2.name;

  const [teamfights, setTeamfights] = useState<Teamfight[] | null>(null);
  const interFightMinInterval = 15;

  // A teamfight lasts from the first kill to the last kill, whereafter there are no kills for 10 seconds.
  // The winning team is the team with the most kills.

  useEffect(() => {
    if (!kills || !ultimateStart || !roster || !team1Name || !team2Name) {
      console.log(
        'returning',
        kills,
        ultimateStart,
        roster,
        team1Name,
        team2Name,
      );
      return;
    }

    // first, create a teamfight for each kill event
    const teamfights: Teamfight[] = [];
    for (const kill of kills) {
      const teamfight: Teamfight = {
        start: kill.matchTime,
        end: kill.matchTime,
        team1Kills: 0,
        team2Kills: 0,
        winningTeam: '',
      };
      if (kill.attackerTeam === team1Name) {
        teamfight.team1Kills = 1;
      } else {
        teamfight.team2Kills = 1;
      }
      teamfights.push(teamfight);
    }

    // then, merge teamfights that are within 10 seconds of each other
    let i = 0;
    while (i < teamfights.length - 1) {
      const currentFight = teamfights[i];
      const nextFight = teamfights[i + 1];
      if (nextFight.start - currentFight.end < interFightMinInterval) {
        currentFight.end = nextFight.end;
        currentFight.team1Kills += nextFight.team1Kills;
        currentFight.team2Kills += nextFight.team2Kills;
        teamfights.splice(i + 1, 1);
      } else {
        i++;
      }
    }

    // finally, determine the winning team for each teamfight
    for (const teamfight of teamfights) {
      if (teamfight.team1Kills > teamfight.team2Kills) {
        teamfight.winningTeam = team1Name;
      } else if (teamfight.team2Kills > teamfight.team1Kills) {
        teamfight.winningTeam = team2Name;
      } else {
        teamfight.winningTeam = 'Draw';
      }
    }

    setTeamfights(teamfights);
  }, [
    JSON.stringify(kills),
    JSON.stringify(ultimateStart),
    JSON.stringify(roster),
  ]);

  console.log('teamfights', prefix, teamfights);

  return teamfights;
};

export default useTeamfights;
