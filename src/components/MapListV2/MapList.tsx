import React from 'react';
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
  Button,
} from '@mui/material';
import {MapOverview} from '../../lib/data/NodeData';
import IconAndText from '../Common/IconAndText';
import {getIcon} from '../Common/RoleIcons';
import useWindowSize from '../../hooks/useWindowSize';
import {mapNameToFileName} from '../../lib/string';
import {useNavigate} from 'react-router-dom';
import PersonIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
interface ScrimOverviewProps {
  overviews: MapOverview[];
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
          <IconAndText icon={<PersonIcon />} text={player} />
        </span>
      ))}
    </div>
  );
};

const ScrimOverview: React.FC<ScrimOverviewProps> = ({overviews}) => {
  const navigate = useNavigate();
  const dayOfWeek = new Date(overviews[0].timestamp).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
    },
  );
  const datetimeStr = new Date(overviews[0].timestamp).toLocaleString();
  const dateStr = dayOfWeek + ', ' + datetimeStr.split(', ')[0];
  const team1Name = overviews[0].team1Name;
  const team2Name = overviews[0].team2Name;

  return (
    <Card
      variant="elevation"
      sx={{
        minWidth: overviews.length > 2 ? 900 : overviews.length > 1 ? 600 : 300,
      }}>
      <CardContent
        sx={{
          position: 'relative',
        }}>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Typography variant="h4">
              {team1Name} vs {team2Name}
            </Typography>
          </Grid>
          <Grid item xs="auto" sx={{ml: 'auto'}}>
            <Typography variant="h6">{dateStr}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Grid container spacing={2}>
        {overviews.map((overview, i) => (
          <Grid item key={i}>
            <CardActionArea
              key={i}
              onClick={() => navigate(`/map/${overview.mapId}`)}
              sx={{
                width: 300,
                height: '100%',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <div style={{position: 'relative'}}>
                <CardMedia
                  component="img"
                  image={mapNameToFileName(overview.mapName, false)}
                  sx={{borderRadius: '5px'}}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '33%',
                    display: 'flex',
                    alignItems: 'center',
                    // justifyContent: 'center',
                  }}>
                  <Typography
                    variant="h3"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      // mixBlendMode: 'overlay',
                      ml: 'auto',
                      padding: '0.5em',
                    }}>
                    {overview.mapName}
                  </Typography>
                </div>
              </div>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1em',
                  }}
                  component="div">
                  <Typography
                    variant="h5"
                    sx={{
                      padding: '0.5em',
                    }}>
                    {overview.team1Score === overview.team2Score
                      ? `Draw ${overview.team1Score} - ${overview.team2Score}`
                      : overview.team1Score > overview.team2Score
                      ? team1Name +
                        ` Win ${overview.team1Score} - ${overview.team2Score}`
                      : team2Name +
                        ` Win ${overview.team2Score} - ${overview.team1Score}`}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs="auto">
                    <PlayerListMini players={overview.team1Players} />
                  </Grid>
                  <Grid item xs="auto" sx={{ml: 'auto'}}>
                    <PlayerListMini players={overview.team2Players} />
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent sx={{width: '100%'}}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  component="div">
                  <Typography variant="h6">
                    {new Date(overview.timestamp).toLocaleTimeString()}
                  </Typography>
                  <Button variant="outlined" color="primary">
                    View <ArrowForwardIcon sx={{ml: '0.5em'}} />
                  </Button>
                </Box>
              </CardContent>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

const MapList = () => {
  const maps = useDataNode<MapOverview & {scrimId: number}>(
    'map_overview_with_scrim_id',
  );
  const {width} = useWindowSize();
  const columns = width > 1000 ? 4 : width > 600 ? 2 : 1;
  console.log('MapsList rendering', maps.getOutput());

  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h2">Map Databank</Typography>
              <Typography variant="h6">
                Click on a map to see more details.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {maps && maps.getOutput() ? (
          Array.from(
            maps
              .getOutput()!
              .reduce(
                (entryMap, e) =>
                  entryMap.set(e.scrimId, [
                    ...(entryMap.get(e.scrimId) || []),
                    e,
                  ]),
                new Map<number, MapOverview[]>(),
              )
              .entries(),
          ).map(([scrimId, overviews]) => (
            <Grid item key={scrimId}>
              <ScrimOverview overviews={overviews} />
            </Grid>
          ))
        ) : (
          <div>no data</div>
        )}
      </Grid>
    </>
  );
};

export default MapList;
