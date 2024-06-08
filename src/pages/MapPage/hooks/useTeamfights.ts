/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {AlaSQLNode, FilterNode} from '../../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../../hooks/useData';
import useMapRosters from './useMapRosters';
import useUUID from '../../../hooks/useUUID';
import {useMapContext} from '../context/MapContext';
import {Kill, UltimateStart} from '../../../lib/data/NodeData';

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

const useTeamfights = (): Teamfight[] | null => {
  const {mapId} = useMapContext();
  const uuid = useUUID();
  const data = useDataNodes([
    new FilterNode<Kill>(
      'useTeamfights_kills_' + mapId + '_' + uuid,
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
    new FilterNode<UltimateStart>(
      'useTeamfights_ultimate_start_' + mapId + '_' + uuid,
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

  const kills = data['useTeamfights_kills_' + mapId + '_' + uuid];
  const ultimateStart =
    data['useTeamfights_ultimate_start_' + mapId + '_' + uuid];

  console.log('kills', kills);
  console.log('ultimateStart', ultimateStart);

  const roster = useMapRosters();
  const team1Name = roster?.team1.name;
  const team2Name = roster?.team2.name;

  const [teamfights, setTeamfights] = useState<Teamfight[] | null>(null);
  const interFightMinInterval = 30;

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

  console.log('teamfights', teamfights);

  return teamfights;
};

export default useTeamfights;
