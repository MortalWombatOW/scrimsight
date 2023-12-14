import React from 'react';
import {useDataNodeOutput} from '../hooks/useData';
import {
  Kill,
  MatchEnd,
  MatchStart,
  RoundEnd,
  RoundStart,
} from '../lib/data/NodeData';
import Timeline from './Timeline';

const OverviewTimeline = ({mapId}: {mapId: number}) => {
  const kills = useDataNodeOutput<Kill>('kill_object_store', {mapId});
  const matchStarts = useDataNodeOutput<MatchStart>(
    'match_start_object_store',
    {mapId},
  );
  const matchEnds = useDataNodeOutput<MatchEnd>('match_end_object_store', {
    mapId,
  });
  const roundStarts = useDataNodeOutput<RoundStart>(
    'round_start_object_store',
    {mapId},
  );
  const roundEnds = useDataNodeOutput<RoundEnd>('round_end_object_store', {
    mapId,
  });

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
