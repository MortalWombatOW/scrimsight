import React, {useEffect} from 'react';
import {Button, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, List, ListItem, ListItemText, Typography} from '@mui/material';
import useUniqueValuesForColumn from '../../hooks/useUniqueValuesForColumn';
import {useWombatData, useWombatDataManager} from 'wombat-data-framework';
import {MatchEnd, MatchStart} from '../../WombatDataFrameworkSchema';
import {mapNameToFileName} from '../../lib/string';
import {useNavigate} from 'react-router-dom';

const MapRow = ({mapId}: {mapId: number}) => {
  const dataManager = useWombatDataManager();
  const navigate = useNavigate();

  const matchStartData = useWombatData<MatchStart>('match_start_object_store');
  const matchEndData = useWombatData<MatchEnd>('match_end_object_store');
  const mapsData = useWombatData<{name: string; fileModified: number}>('maps_object_store');

  const {mapName, mapType, team1Name, team2Name} = matchStartData.data.filter((row) => row['mapId'] === mapId)[0];
  const {team1Score, team2Score} = matchEndData.data.filter((row) => row['mapId'] === mapId)[0];
  const {name, fileModified} = mapsData.data.filter((row) => row['mapId'] === mapId)[0];
  return (
    <Card sx={{width: '100%', minWidth: '500px'}}>
      {/* <CardActionArea> */}
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <CardMedia component="img" image={mapNameToFileName(mapName, false)} sx={{height: '100%'}} />
        </Grid>
        <Grid item xs={9}>
          <CardContent>
            <Typography variant="h6" component="div">
              {mapName} ({mapType})
            </Typography>
            <Divider sx={{my: 1}} />
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
            <Divider sx={{my: 1}} />
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
        <Grid item xs={1} sx={{display: 'flex', alignItems: 'center'}}>
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
  const mapsData = useWombatData<{name: string; fileModified: number}>('maps_object_store');

  useEffect(() => {
    mapsData.onSortSelection('fileModified');
  }, []);

  return (
    <div style={{width: '80%', marginLeft: '10%'}}>
      <Typography variant="h3">Recent Maps</Typography>
      <List>
        {mapsData.data.map((map) => (
          <ListItem key={map['mapId']}>
            <MapRow mapId={parseInt(map['mapId'], 10)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MapsList;
