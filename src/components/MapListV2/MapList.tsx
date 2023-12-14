import React from 'react';
import {useDataNode, useDataNodeOutput} from '../../hooks/useData';
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
  Badge,
  Avatar,
  Icon,
  AvatarGroup,
} from '@mui/material';
import {MapOverview, ScrimPlayers} from '../../lib/data/NodeData';
import IconAndText from '../Common/IconAndText';
import {getIcon} from '../Common/RoleIcons';
import useWindowSize from '../../hooks/useWindowSize';
import {mapNameToFileName} from '../../lib/string';
import {useNavigate} from 'react-router-dom';
import PersonIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {getColorgorical} from '../../lib/color';
interface ScrimOverviewProps {
  scrimId: number;
  overviews: MapOverview[];
}

const PlayerListMini = ({
  scrimId,
  teamName,
}: {
  scrimId: number;
  teamName: string;
}) => {
  const data = useDataNodeOutput<ScrimPlayers>('scrim_players', {
    scrimId,
    teamName,
  });

  console.log('PlayerListMini rendering', data);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      {data && data.length > 0 ? (
        data.map((player, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <AvatarGroup spacing={2} max={10}>
              <Avatar
                alt={player.playerName}
                sx={{
                  width: 32,
                  height: 32,
                  ml: '-0.5em',
                  bgcolor: getColorgorical(teamName),
                }}>
                {getIcon(player.role)}
              </Avatar>
              {player.heroes.map((hero, i) => (
                <Avatar
                  key={i}
                  alt={hero.hero}
                  src={`/assets/heroes/${hero.hero
                    .toLowerCase()
                    .replaceAll('.', '')
                    .replaceAll(' ', '')
                    .replaceAll(':', '')
                    .replaceAll('ú', 'u')
                    .replaceAll('ö', 'o')}.png`}
                  sx={{width: 32, height: 32}}
                />
              ))}
            </AvatarGroup>

            <Typography variant="h6" sx={{ml: '0.5em'}}>
              {player.playerName}
            </Typography>
          </div>
        ))
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconAndText icon={<PersonIcon />} text="No Data" />
        </div>
      )}
    </div>
  );
};

const ScrimOverview: React.FC<ScrimOverviewProps> = ({overviews, scrimId}) => {
  const navigate = useNavigate();
  const datetimeStr = new Date(overviews[0].timestamp).toLocaleString();
  const dateStr = datetimeStr.split(', ')[0];
  const team1Name = overviews[0].team1Name;
  const team2Name = overviews[0].team2Name;
  const team1Color = getColorgorical(team1Name);
  const team2Color = getColorgorical(team2Name);

  return (
    <Card
      variant="elevation"
      sx={{
        backgroundColor: 'grey.900',
      }}>
      <CardContent
        sx={{
          position: 'relative',
        }}>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Typography variant="h4">
              <span
                style={{
                  color: team1Color,
                }}>
                {team1Name}
              </span>{' '}
              vs <span style={{color: team2Color}}>{team2Name}</span>
            </Typography>
          </Grid>
          <Grid item xs="auto" sx={{ml: 'auto'}}>
            <Typography variant="h6">{dateStr}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Grid container spacing={2}>
        <Grid item xs="auto" sx={{color: team1Color, ml: '1em'}}>
          <PlayerListMini
            scrimId={new Number(scrimId).valueOf()}
            teamName={team1Name}
          />
        </Grid>
        <Grid item xs="auto" sx={{color: team2Color, mr: '1em'}}>
          <PlayerListMini
            scrimId={new Number(scrimId).valueOf()}
            teamName={team2Name}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        sx={{
          margin: '1em',
        }}>
        {overviews.map((overview, i) => (
          <Grid item key={i} xs="auto">
            <CardActionArea
              key={i}
              onClick={() => navigate(`/map/${overview.mapId}`)}
              sx={{
                // height: '100%',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <div style={{position: 'relative'}}>
                <CardMedia
                  component="img"
                  image={mapNameToFileName(overview.mapName, false)}
                  sx={{borderRadius: '5px', maxHeight: '100px', width: '200px'}}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <Typography
                    variant="h3"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color:
                        overview.team1Score > overview.team2Score
                          ? team1Color
                          : overview.team1Score < overview.team2Score
                          ? team2Color
                          : 'white',
                      mr: 'auto',
                      // mixBlendMode: 'overlay',
                      padding: '0.5em',
                      justifyContent: 'center',
                      display: 'flex',
                      width: '100%',
                    }}>
                    {overview.mapName}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      mr: 'auto',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                    component="div">
                    <Typography
                      variant="h3"
                      sx={{
                        display: 'flex',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        width: '100%',
                        // mr: 'auto',
                        justifyContent: 'center',
                        padding: '0.5em',
                      }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: team1Color,
                          mr: '0.5em',
                        }}>
                        {overview.team1Score}
                      </Typography>
                      :
                      <Typography
                        variant="h4"
                        sx={{
                          color: team2Color,
                          ml: '0.5em',
                        }}>
                        {overview.team2Score}
                      </Typography>
                    </Typography>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '15%',
                        height: '100%',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <ArrowForwardIcon />
                    </div>
                  </Box>
                </div>
              </div>
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
  console.log('MapsList rendering', maps.getOutput());

  return (
    <>
      <Grid container spacing={5}>
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
              <ScrimOverview overviews={overviews} scrimId={scrimId} />
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
