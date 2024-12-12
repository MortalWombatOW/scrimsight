import {useParams} from 'react-router-dom';
import MapTimeline from '../../components/MapTimeline/MapTimeline';
import {Card, CardContent, CardMedia, Container, Divider, Grid, Tab, Tabs, Typography} from '@mui/material';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import {Box} from '@mui/material';
import {StringParam, useQueryParam, withDefault} from 'use-query-params';
import {mapNameToFileName} from '../../lib/string';
import {MatchStart, MatchEnd} from '../../WombatDataFrameworkSchema';
import {useWombatData} from 'wombat-data-framework';

const MapPage = () => {
  const {matchId: matchIdString} = useParams();
  const matchId = Number(matchIdString);

  const [tab, setTab] = useQueryParam('tab', withDefault(StringParam, 'timeline'));

  console.log('matchId', matchId, tab);

  const {mapName, mapType, team1Name, team2Name} = useWombatData<MatchStart>('match_start_object_store', {initialFilter: {matchId}}).data[0];
  const {team1Score, team2Score} = useWombatData<MatchEnd>('match_end_object_store', {initialFilter: {matchId}}).data[0];
  const {name, fileModified} = useWombatData<{matchId: number; name: string; fileModified: number}>('match_object_store', {initialFilter: {matchId}}).data[0];

  return (
    <Container>
      <Card sx={{width: '100%', minWidth: '500px', marginBottom: '1em'}}>
        {/* <CardActionArea> */}
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <CardMedia component="img" image={mapNameToFileName(mapName, false)} sx={{height: '100%'}} />
          </Grid>
          <Grid item xs={10}>
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
        </Grid>
        {/* </CardActionArea> */}
      </Card>
      <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: '1em'}}>
        <Tabs value={tab} onChange={(_e, value) => setTab(value)}>
          <Tab label="Timeline" value={'timeline'} />
          <Tab label="Statistics" value={'statistics'} />
          <Tab label="Interactions" value={'interactions'} />
        </Tabs>
      </Box>
      {tab === 'statistics' && <div>Statistics</div>}
      {tab === 'timeline' && <MapTimeline matchId={Number(matchId)} />}
      {tab === 'interactions' && <ChordDiagram matchId={Number(matchId)} />}
    </Container>
  );
};

export default MapPage;
