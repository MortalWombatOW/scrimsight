import { CardContent, Typography } from '@mui/material';
import { useWombatData } from 'wombat-data-framework';
import { MatchEnd, MatchStart } from '../../WombatDataFrameworkSchema';
import { mapNameToFileName } from '../../lib/string';
// import {useNavigate} from 'react-router-dom';
import './MapsList.scss';

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

  return (
    <div
      style={{
        width: '200px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'space-between',

      }}>
      <Typography variant="h5" gutterBottom>{mapName}</Typography>
      <Typography variant="h6" gutterBottom>{timeString}</Typography>
      <img
        src={mapNameToFileName(mapName, false)}
        style={{
          width: '200px',
          position: 'relative',
          //curved corners
          borderRadius: '10px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '10px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          {team1Name}
        </Typography>
        <Typography variant="h3" align="center">
          {team1Score}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '10px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          {team2Name}
        </Typography>
        <Typography variant="h3" align="center">
          {team2Score}
        </Typography>
      </div>
    </div>
  );
};

const MatchList = () => {

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
        {matchesByDate.data.map((dateMatches) => (
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" gutterBottom>{dateMatches.dateString}</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
              {dateMatches.matchIds.map((matchId) => (
                <MapRow matchId={matchId} key={matchId} />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </>
  );
};

export default MatchList;
