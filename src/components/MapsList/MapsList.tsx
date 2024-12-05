import {Card, CardContent, Typography} from '@mui/material';
import {useWombatData} from 'wombat-data-framework';
import {MatchEnd, MatchStart} from '../../WombatDataFrameworkSchema';
import {mapNameToFileName} from '../../lib/string';
// import {useNavigate} from 'react-router-dom';
import './MapsList.scss';

const MapRow = ({mapId}: {mapId: number}) => {
  // const navigate = useNavigate();

  const matchStartData = useWombatData<MatchStart>('match_start_object_store');
  const matchEndData = useWombatData<MatchEnd>('match_end_object_store');
  // const mapsData = useWombatData<{name: string; fileModified: number; mapId: number}>('maps_object_store');

  const {mapName, team1Name, team2Name} = matchStartData.data.find((row) => row['mapId'] === mapId) || {mapName: '', mapType: '', team1Name: '', team2Name: ''};
  const {team1Score, team2Score} = matchEndData.data.find((row) => row['mapId'] === mapId) || {team1Score: 0, team2Score: 0};
  // const {name, fileModified} = mapsData.data.find((row) => row['mapId'] === mapId) || {name: '', fileModified: 0};

  return (
    <Card
      sx={{
        width: '200px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'secondary.main',
      }}
      className="dashboard-item secondary">
      <CardContent
        sx={{
          flexGrow: 1,
          padding: '0',
          display: 'flex',
          gap: 2,
        }}>
        {/* Scores section - always visible */}
        <div
          style={{
            width: '200px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'space-between',
          }}>
          <img
            src={mapNameToFileName(mapName, false)}
            style={{
              width: '200px',
              position: 'relative',
              //curved corners
              borderRadius: '10px',
            }}
          />
          <div style={{display: 'flex', flexDirection: 'column', gap: 2, margin: '10px'}}>
            <Typography variant="h5" align="center" gutterBottom>
              {team1Name}
            </Typography>
            <Typography variant="h3" align="center">
              {team1Score}
            </Typography>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 2, margin: '10px'}}>
            <Typography variant="h5" align="center" gutterBottom>
              {team2Name}
            </Typography>
            <Typography variant="h3" align="center">
              {team2Score}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MapsList = () => {
  const mapsData = useWombatData<{name: string; fileModified: number; mapId: number}>('maps_object_store');//, {initialSortColumn: 'fileModified', initialSortDirection: 'desc'});
  
  console.log('mapsData', mapsData.data);

  return (
    <>
      {mapsData.data.map((map) => (
        <MapRow mapId={map['mapId']} key={map['mapId']} />
      ))}
    </>
  );
};

export default MapsList;
