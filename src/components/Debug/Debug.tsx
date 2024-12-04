import {useSearchParams} from 'react-router-dom';
import {Typography, Paper} from '@mui/material';
import {useWombatDataManager} from 'wombat-data-framework';
const Debug = () => {
  const [searchParams] = useSearchParams();
  const debugLevel = searchParams.get('debug');
  const maxTicks = searchParams.get('maxTicks');

  const dataManager = useWombatDataManager();
  const realTicks = dataManager.getTick();

  // Only render if either debug or maxTicks parameters are set
  if (!debugLevel && !maxTicks) {
    return null;
  }

  return (
    <Paper
      sx={{
        padding: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        minWidth: '200px',
        minHeight: '100px',
      }}
      className="dashboard-item">
      <Typography variant="h6" gutterBottom>
        Debug Info
      </Typography>
      {debugLevel && <Typography variant="body1">Debug Level: {debugLevel}</Typography>}
      {maxTicks && <Typography variant="body1">Max Ticks: {maxTicks}</Typography>}
      <Typography variant="body1">Real Ticks: {realTicks}</Typography>
    </Paper>
  );
};

export default Debug;
