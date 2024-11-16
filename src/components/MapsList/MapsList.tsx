import React from 'react';
import { Button, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import useUniqueValuesForColumn from '../../hooks/useUniqueValuesForColumn';
import { useDataManager } from '../../WombatDataFramework/DataContext';
import { MatchEnd, MatchStart } from '../../WombatDataFrameworkSchema';
import { mapNameToFileName } from '../../lib/string';
import { useNavigate } from 'react-router-dom';

const MapRow = ({ mapId }: { mapId: number }) => {
  const dataManager = useDataManager();
  const navigate = useNavigate();

  if (!dataManager.hasNodeOutput('match_start_object_store') || !dataManager.hasNodeOutput('match_end_object_store') || !dataManager.hasNodeOutput('maps_object_store')) {
    return <div />;
  }

  const { mapName, mapType, team1Name, team2Name } = dataManager.getNodeOutput('match_start_object_store').filter((row) => row['mapId'] === mapId)[0] as MatchStart;
  const { team1Score, team2Score } = dataManager.getNodeOutput('match_end_object_store').filter((row) => row['mapId'] === mapId)[0] as MatchEnd;
  const { name, fileModified } = dataManager.getNodeOutput('maps_object_store').filter((row) => row['mapId'] === mapId)[0] as { name: string; fileModified: number };
  return (
    <Card sx={{ width: '100%', minWidth: '500px' }}>
      {/* <CardActionArea> */}
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <CardMedia component="img" image={mapNameToFileName(mapName, false)} sx={{ height: '100%' }} />
        </Grid>
        <Grid item xs={9}>
          <CardContent>
            <Typography variant="h6" component="div">
              {mapName} ({mapType})
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">{team1Name}</Typography>
                <Typography variant="h6">{team1Score}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  {team2Name}
                </Typography>
                <Typography variant="h6" align="right">
                  {team2Score}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {new Date(fileModified).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" align="right">
                  {name}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/map/${mapId}`)}>
            View
          </Button>
        </Grid>
      </Grid>
      {/* </CardActionArea> */}
    </Card>
  );
};

const MapsList = () => {
  const dataManager = useDataManager();
  const maps = dataManager.getNodeOutput('maps_object_store').sort((a, b) => b['fileModified'] - a['fileModified']);

  return (
    <div style={{ width: '80%', marginLeft: '10%' }}>
      <Typography variant="h3">Recent Maps</Typography>
      <List>
        {maps.map((map) => (
          <ListItem key={map['mapId']}>
            <MapRow mapId={parseInt(map['mapId'], 10)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MapsList;
