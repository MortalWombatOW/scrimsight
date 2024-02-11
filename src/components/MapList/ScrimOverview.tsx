import {
  Card,
  CardContent,
  Grid,
  Typography,
  CardActionArea,
  CardMedia,
  Box,
} from '@mui/material';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {getColorgorical} from '../../lib/color';
import {MapOverview} from '../../lib/data/NodeData';
import {mapNameToFileName} from '../../lib/string';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayerListMini from './PlayerListMini';
interface ScrimOverviewProps {
  scrimId: number;
  overviews: MapOverview[];
}

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
        height: '100%',
        justifyContent: 'space-between',
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
                justifyContent: 'space-between',
              }}>
              <div style={{position: 'relative'}}>
                <CardMedia
                  component="img"
                  image={mapNameToFileName(overview.mapName, false)}
                  sx={{borderRadius: '5px', maxHeight: '150px', width: '200px'}}
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
                      }}></div>
                  </Box>
                </div>
              </div>
              <PlayerListMini
                scrimId={new Number(scrimId).valueOf()}
                mapId={overview.mapId}
                showRole={i === 0}
              />
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default ScrimOverview;
