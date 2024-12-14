import { Card, CardMedia, CardContent, Box, Typography, ButtonBase } from '@mui/material';
import { useWombatData, useWombatDataManager } from 'wombat-data-framework';
import { MatchEnd, MatchStart } from '../../WombatDataFrameworkSchema';
import { mapNameToFileName } from '../../lib/string';
// import {useNavigate} from 'react-router-dom';
import './MapsList.scss';
import Uploader from '~/components/Uploader/Uploader';
import FileLoader from '~/components/FileLoader/FileLoader';

const MapRow = ({ matchId }: { matchId: number }) => {
  // const navigate = useNavigate();

  const matchData = useWombatData<{ name: string, timeString: string, matchId: number }>('match_object_store');
  const matchStartData = useWombatData<MatchStart>('match_start_object_store');
  const matchEndData = useWombatData<MatchEnd>('match_end_object_store');

  if (matchStartData.data.length === 0 || matchEndData.data.length === 0 || matchData.data.length === 0) {
    return null;
  }

  const { mapName, team1Name, team2Name } = matchStartData.data.find((row) => row['matchId'] === matchId) || { mapName: '', mapType: '', team1Name: '', team2Name: '' };
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
        transition: 'all 0.2s ease-in-out'
      }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>{mapName}</Typography>
          <Typography variant="h6" gutterBottom>{timeString}</Typography>
        </CardContent>

        <CardMedia
          component="img"
          image={mapNameToFileName(mapName, false)}
          alt={mapName}
          sx={{ borderRadius: 1 }}
        />

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        </CardContent>
      </Card>
    </ButtonBase>
  );
};

const MatchList = () => {
  const dataManager = useWombatDataManager();

  const matchesByDate = useWombatData<{ dateString: string; matchIds: number[] }>('matches_grouped_by_date');

  console.log('matchesByDate', matchesByDate.data);

  if (matchesByDate.data.length === 0) {
    return null;
  }

  return (
    <>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h3" gutterBottom>Matches</Typography></div>
        {matchesByDate.data.map((dateMatches, dateIndex) => (
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" gutterBottom>{dateMatches.dateString}</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
              {dateIndex === 0 && <FileLoader onSubmit={(files) => {
                dataManager.setInputForInputNode('log_file_input', files);
              }} />}
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
