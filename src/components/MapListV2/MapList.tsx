import React from 'react';
import Masonry from '@mui/lab/Masonry';
import {useDataNode} from '../../hooks/useData';
import './MapList.scss';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardMedia,
  CardHeader,
  CardActionArea,
} from '@mui/material';
import {MapOverview} from '../../lib/data/NodeData';
import IconAndText from '../Common/IconAndText';
import {getIcon} from '../Common/RoleIcons';
import useWindowSize from '../../hooks/useWindowSize';
import {mapNameToFileName} from '../../lib/string';
import {useNavigate} from 'react-router-dom';

interface MapOverviewProps {
  overview: MapOverview;
}

const PlayerListMini = ({
  players,
  orientation,
}: {
  players: string[];
  orientation?: 'left' | 'right';
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      {players.map((player, i) => (
        <span key={i}>
          <IconAndText icon={getIcon('damage')} text={player} />
        </span>
      ))}
    </div>
  );
};

const MapOverviewComponent: React.FC<MapOverviewProps> = ({overview}) => {
  const navigate = useNavigate();
  const dayOfWeek = new Date(overview.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
  });
  return (
    <Card
      variant="elevation"
      onClick={() => navigate(`/map/${overview.mapId}`)}>
      <CardActionArea>
        <CardContent sx={{position: 'relative'}}>
          <Grid container spacing={2}>
            <Grid item xs="auto">
              <Typography variant="h4">{overview.team1Name}</Typography>
            </Grid>
            <Grid item xs="auto" sx={{ml: 'auto'}}>
              <Typography variant="h3">
                {overview.team1Score} : {overview.team2Score}
              </Typography>
            </Grid>
            <Grid item xs="auto" sx={{ml: 'auto'}}>
              <Typography variant="h3">{overview.team2Name}</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardMedia
          component="img"
          image={mapNameToFileName(overview.mapName, false)}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs="auto">
              <PlayerListMini players={overview.team1Players} />
            </Grid>
            <Grid item xs="auto" sx={{ml: 'auto'}}>
              <PlayerListMini players={overview.team2Players} />
            </Grid>
          </Grid>
        </CardContent>

        <CardContent>
          <Typography variant="h6">
            {dayOfWeek + ', ' + new Date(overview.timestamp).toLocaleString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const MapList = () => {
  const maps = useDataNode('map_overview');
  const {width} = useWindowSize();
  const columns = width > 1000 ? 4 : width > 600 ? 2 : 1;
  console.log('MapsList rendering', maps.getOutput());

  return (
    <>
      <Masonry columns={columns} spacing={3} sx={{mx: 0}}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h2">Map Databank</Typography>
            <Typography variant="h6">
              Click on a map to see more details.
            </Typography>
          </CardContent>
        </Card>
        {maps && maps.getOutput() ? (
          maps!.getOutput()!.map((map: MapOverview, i: number) => (
            <div key={i}>
              <MapOverviewComponent overview={map} />
            </div>
          ))
        ) : (
          <div>no data</div>
        )}
      </Masonry>
    </>
  );
};

export default MapList;
