import { Card, CardContent, Box, Typography, ButtonBase, Button } from '@mui/material';
import { useWombatData } from 'wombat-data-framework';
import { MatchEndLogEvent, matches_grouped_by_date_node, MatchesGroupedByDateNodeData, MatchStartLogEvent } from '../../WombatDataFrameworkSchema';
import { mapNameToFileName } from '../../lib/string';
// import {useNavigate} from 'react-router-dom';
import './MapsList.scss';
import { useWidgetRegistry } from '~/WidgetProvider';

const MapRow = ({ matchId }: { matchId: string }) => {
  // const navigate = useNavigate();

  const matchData = useWombatData<{ name: string, timeString: string, matchId: string }>('match_object_store');
  const matchStartData = useWombatData<MatchStartLogEvent>('match_start_object_store');
  const matchEndData = useWombatData<MatchEndLogEvent>('match_end_object_store');

  if (matchStartData.data.length === 0 || matchEndData.data.length === 0 || matchData.data.length === 0) {
    return null;
  }

  console.log('matchStartData', matchStartData.data);
  console.log('matchEndData', matchEndData.data);
  console.log('matchData', matchData.data);

  const { mapName, mapType, team1Name, team2Name } = matchStartData.data.find((row) => row['matchId'] === matchId) || { mapName: 'loading', mapType: 'loading', team1Name: 'loading', team2Name: 'loading' };
  const { team1Score, team2Score } = matchEndData.data.find((row) => row['matchId'] === matchId) || { team1Score: 0, team2Score: 0 };
  const { timeString } = matchData.data.find((row) => row['matchId'] === matchId) || { name: '', timeString: '' };

  const handleClick = () => {
    // TODO: Implement navigation or action when card is clicked
    console.log(`Clicked match ${matchId}`);
  };

  return (
    <ButtonBase
      onClick={handleClick}
      sx={{
        display: 'block',
        textAlign: 'left',
        width: 200,
        '&:hover': {
          '& .MuiCard-root': {
            borderColor: 'primary.main',
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out'
          }
        }
      }}
    >
      <Card sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'info.main',
        borderWidth: 1,
        borderStyle: 'solid',
        transition: 'all 0.2s ease-in-out',
        background: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${mapNameToFileName(mapName, false)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom>
                {team1Name}
              </Typography>
              <Typography variant="h3">
                {team1Score}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom>
                {team2Name}
              </Typography>
              <Typography variant="h3">
                {team2Score}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" gutterBottom>{mapName} - {mapType}</Typography>
          <Typography variant="h6">{timeString}</Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
};

const MatchList = () => {

  const matchesByDate = useWombatData<MatchesGroupedByDateNodeData>(matches_grouped_by_date_node.name);

  console.log('matchesByDate', matchesByDate.data);

  const widgetRegistry = useWidgetRegistry();

  // This is a 2x1 widget
  const width = widgetRegistry.widgetGridWidth * 2;
  const height = widgetRegistry.widgetGridHeight;

  return (
    <>
      <CardContent style={{ width: width, height: height }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h3" gutterBottom>Most Recent Scrim</Typography></div>

        <Button variant="contained" color="primary">
          See All Matches
        </Button>
        {matchesByDate.data.map((dateMatches) => (
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2, marginTop: 10 }}>
            <Typography variant="h4" gutterBottom>{dateMatches.dateString}</Typography>

            <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>

              {dateMatches.matchIds.map((matchId, index) => (

                index < 3 && (
                  <MapRow matchId={matchId} key={matchId} />
                )

              ))}
            </div>
          </div>
        ))}

      </CardContent>
    </>
  );
};

export default MatchList;
