import React from 'react';
import {useDataNode} from '../../hooks/useData';
import './MapList.scss';

interface MatchData {
  mapId: number;
  mapName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
}

const MatchCard: React.FC<{match: MatchData}> = ({match}) => {
  return (
    <div className="match-card">
      <div className="match-header">
        <h2>{match.mapName}</h2>
      </div>
      <div className="match-body">
        <div className="team-info">
          <span className="team-name">{match.team1Name}</span>
          <span className="score">{match.team1Score}</span>
        </div>
        <div className="versus">vs</div>
        <div className="team-info">
          <span className="team-name">{match.team2Name}</span>
          <span className="score">{match.team2Score}</span>
        </div>
      </div>
    </div>
  );
};

const MapList = () => {
  const maps = useDataNode('map_overview');
  console.log('maps:', maps);

  return (
    <div>
      <div>Map List</div>
      <div>
        {maps?.output?.map((map: any) => (
          <MatchCard match={map} />
        ))}
      </div>
    </div>
  );
};

export default MapList;
