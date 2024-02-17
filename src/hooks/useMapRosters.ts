import React, {useEffect, useState} from 'react';

import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {useDataNodes} from './useData';
import {getRoleFromHero, getRankForRole} from '../lib/data/data';

type Roster = {
  name: string;
  role: 'tank' | 'damage' | 'support';
}[];

type Team = {
  name: string;
  roster: Roster;
};

const useMapRosters = (
  mapId: number,
): {
  team1: Team;
  team2: Team;
} | null => {
  const data = useDataNodes([
    new AlaSQLNode(
      'UseMapRosters_players_' + mapId,
      `SELECT
        player_stat.playerTeam,
        match_start.team1Name,
        match_start.team2Name,
        player_stat.playerName,
        ARRAY(player_stat.playerHero) as playerHeroes
      FROM ? AS player_stat
      JOIN
      ? AS match_start
      ON
        player_stat.mapId = match_start.mapId
      WHERE
        player_stat.mapId = ${mapId}
      GROUP BY
        player_stat.playerName,
        match_start.team1Name,
        match_start.team2Name,
        player_stat.playerTeam
      `,
      ['player_stat_object_store', 'match_start_object_store'],
    ),
  ]);

  const [output, setOutput] = useState<{
    team1: Team;
    team2: Team;
  } | null>(null);

  const mapRosterRawData = data['UseMapRosters_players_' + mapId];

  console.log('mapRosterRawData', data);

  useEffect(() => {
    if (!mapRosterRawData) {
      return;
    }

    const rosterWithRoles = mapRosterRawData.map((player: object) => {
      const role = getRoleFromHero(player['playerHeroes'][0]);
      const roleRank = getRankForRole(role);

      return {
        ...player,
        role,
        roleRank,
      };
    });

    const team1 = rosterWithRoles
      .filter((player: any) => player.isTeam1)
      .map((player: any) => {
        return {
          name: player.playerName,
          role: player.role,
        };
      });
    const team2 = rosterWithRoles
      .filter((player: any) => !player.isTeam1)
      .map((player: any) => {
        return {
          name: player.playerName,
          role: player.role,
        };
      });

    team1.sort((a: any, b: any) => a.roleRank - b.roleRank);
    team2.sort((a: any, b: any) => a.roleRank - b.roleRank);

    setOutput({
      team1: {
        name: mapRosterRawData[0].team1Name,
        roster: team1,
      },
      team2: {
        name: mapRosterRawData[0].team2Name,
        roster: team2,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mapRosterRawData)]);

  return output;
};

export default useMapRosters;
