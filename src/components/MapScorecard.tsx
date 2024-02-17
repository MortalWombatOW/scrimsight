import React from 'react';
import {useDataNodes} from '../hooks/useData';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {Paper, Typography} from '@mui/material';
import {getColorgorical} from '../lib/color';

const MapScorecard = ({mapId}: {mapId: number}) => {
  const data = useDataNodes([
    new AlaSQLNode(
      'map_scorecard_' + mapId,
      `SELECT
        match_start.team1Name,
        match_start.team2Name,
        match_start.mapName,
        match_start.mapType,
        match_end.team1Score,
        match_end.team2Score
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
  ]);

  const map_scorecard = data['map_scorecard_' + mapId];

  if (!map_scorecard) {
    return <div>Loading...</div>;
  }

  // console.log('map_scorecard', map_scorecard);

  const {team1Name, team2Name, mapName, mapType, team1Score, team2Score} =
    map_scorecard[0];
  const team1Color = getColorgorical(team1Name);
  const team2Color = getColorgorical(team2Name);
  const winnerColor = team1Score > team2Score ? team1Color : team2Color;
  return (
    <Paper variant="outlined" sx={{padding: '1em', borderColor: winnerColor}}>
      <Typography variant="h2">{mapName}</Typography>
      <Typography variant="h5">{mapType}</Typography>
      <Typography variant="h3">
        <span style={{color: team1Color}}>{team1Name}</span> {team1Score} -
        {'  '}
        {team2Score} <span style={{color: team2Color}}>{team2Name}</span>
      </Typography>
    </Paper>
  );
};

export default MapScorecard;
