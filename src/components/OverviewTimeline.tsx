import React from 'react';
import {useDataNodeOutput, useDataNodes} from '../hooks/useData';
import {
  Kill,
  MatchEnd,
  MatchStart,
  RoundEnd,
  RoundStart,
} from '../lib/data/NodeData';
import Timeline from './Timeline';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';

const OverviewTimeline = ({mapId}: {mapId: number}) => {
  const {
    kills_for_overview_timeline: kills,
    match_start_for_overview_timeline: matchStarts,
    match_end_for_overview_timeline: matchEnds,
    round_start_for_overview_timeline: roundStarts,
    round_end_for_overview_timeline: roundEnds,
  } = useDataNodes([
    new AlaSQLNode<Kill>(
      'kills_for_overview_timeline',
      `SELECT
        kill_object_store.*
      FROM ? AS kill_object_store`,
      ['kill_object_store'],
    ),
    new AlaSQLNode<MatchStart>(
      'match_start_for_overview_timeline',
      `SELECT
        match_start_object_store.*
      FROM ? AS match_start_object_store`,
      ['match_start_object_store'],
    ),
    new AlaSQLNode<MatchEnd>(
      'match_end_for_overview_timeline',
      `SELECT
        match_end_object_store.*
      FROM ? AS match_end_object_store`,
      ['match_end_object_store'],
    ),
    new AlaSQLNode<RoundStart>(
      'round_start_for_overview_timeline',
      `SELECT
        round_start_object_store.*
      FROM ? AS round_start_object_store`,
      ['round_start_object_store'],
    ),
    new AlaSQLNode<RoundEnd>(
      'round_end_for_overview_timeline',
      `SELECT
        round_end_object_store.*
      FROM ? AS round_end_object_store`,
      ['round_end_object_store'],
    ),
  ]);

  if (!kills || !matchStarts || !matchEnds) {
    return <div>Loading...</div>;
  }

  const width = 1000;
  const height = 300;

  const matchStartTime = matchStarts.length > 0 ? matchStarts[0].matchTime : 0;
  const matchEndTime = matchEnds.length > 0 ? matchEnds[0].matchTime : 0;
  const matchDuration = matchEndTime - matchStartTime;

  const team1Name = matchStarts.length > 0 ? matchStarts[0].team1Name : '';
  const team2Name = matchStarts.length > 0 ? matchStarts[0].team2Name : '';

  console.log(kills);
  return (
    <Timeline
      lanes={[team1Name, team2Name]}
      events={kills.map((k) => ({
        lane: k.attackerTeam,
        time: k.matchTime,
        icon: <div>{k.attackerName}</div>,
      }))}
      metrics={[]}
      periods={[]}
      width={width}
      heightPerLane={height}
    />
  );
};

export default OverviewTimeline;
