import React from 'react';
import {useDataNodeOutput} from '../hooks/useData';
import {
  Kill,
  MatchEnd,
  MatchStart,
  RoundEnd,
  RoundStart,
} from '../lib/data/NodeData';

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

  const timeToX = (time: number) => {
    return (time / matchDuration) * width;
  };

  const xToTime = (x: number) => {
    return (x / width) * matchDuration;
  };

  const teamToY = (team: string) => {
    return team === team1Name ? 0 : height;
  };

  const yToTeam = (y: number) => {
    return y < height / 2 ? team1Name : team2Name;
  };

  return <div style={{position: 'relative', width}}>fsdf</div>;
};

export default OverviewTimeline;
