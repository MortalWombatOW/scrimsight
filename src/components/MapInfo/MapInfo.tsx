import 'components/MapInfo/MapInfo.scss';
import {getHeroImage} from 'lib/data/hero';
import React from 'react';
import {groupColorClass} from '../../lib/color';
import {Button, Typography} from '@mui/material';
import {formatTime} from '~/lib/format';
import {useNavigate} from 'react-router';
import {useData, useDataNode} from '../../hooks/useData';
// import ComparativeTimePlot from '~/components/Chart/ComparativeTimePlot';

const PlayerAndHero = ({
  player,
  hero,
  selected,
}: {
  player: string;
  hero: string;
  selected: boolean;
}) => {
  return (
    <Button
      variant="contained"
      style={{
        backgroundColor: groupColorClass(player),
      }}
      startIcon={
        <img
          style={{width: '24px', height: '24px'}}
          src={getHeroImage(hero)}
          alt={hero}
        />
      }>
      {player}
    </Button>
  );
};

const MapInfo = ({
  mapId,
  selectedPlayerNames,
  setSelectedPlayerNames,
}: {
  mapId: number;
  selectedPlayerNames: string[];
  setSelectedPlayerNames: (names: string[]) => void;
}) => {
  const navigate = useNavigate();

  const mapInfo = useDataNode('MapInfo');

  if (!mapInfo) {
    return <div>Loading...</div>;
  }

  const map = mapInfo[0];

  console.log(map);

  return (
    <div className="MapInfo">
      <div>
        <Typography variant="h4">{map['Map Name']}</Typography>
        <Typography variant="h6">{map['Map Type']}</Typography>
        <Typography variant="h6">
          {map['Team 1 Name']} {map['Team 1 Score']} - {map['Team 2 Score']}{' '}
          {map['Team 2 Name']}
        </Typography>
        <Typography variant="h6">
          {map['Round Number']} Rounds - {formatTime(map['Match Time'])}
        </Typography>
      </div>
      <div>
        <Typography variant="h5">Players</Typography>
      </div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/maps/${mapId}`)}>
          View
        </Button>
      </div>
    </div>
  );
};

export default MapInfo;
