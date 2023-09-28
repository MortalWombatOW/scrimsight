import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Grid from '@mui/material/Grid';
import 'components/MapInfo/MapInfo.scss';
import {getHeroImage} from 'lib/data/data';
import {heroNameToNormalized, mapNameToFileName} from 'lib/string';
import React, {useEffect, useMemo} from 'react';
import useQueries, {useQuery} from '../../hooks/useQueries';
import {groupColorClass} from '../../lib/color';
import {Button, Typography} from '@mui/material';
import {formatTime} from '~/lib/format';
import {useNavigate} from 'react-router';
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

  const [{MapInfo_map: mapWrapped}] = useQueries(
    [
      {
        name: 'MapInfo_map',
        query: `select \
        match_start.[Map ID] as [Map ID], \
        match_start.[Map Name] as [Map Name], \
        match_start.[Map Type] as [Map Type], \
        match_start.[Team 1 Name] as [Team 1 Name], \
        match_start.[Team 2 Name] as [Team 2 Name], \
        match_end.[Team 1 Score] as [Team 1 Score], \
        match_end.[Team 2 Score] as [Team 2 Score], \
        match_end.[Match Time] as [Match Time], \
        match_end.[Round Number] as [Round Number] \
        from match_start \
        inner join match_end on match_end.[Map ID] = match_start.[Map ID] \
        where match_start.[Map ID] = ${mapId}`,
      },
    ],
    [mapId],
  );

  if (!mapWrapped) {
    return <div>Loading...</div>;
  }

  const map = mapWrapped[0];

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
