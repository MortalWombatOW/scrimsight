import { Box, Container, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PlayerMetricsDashboard } from '../../components/Player/PlayerMetricsDashboard';
import { PlayerDetailedStats } from '../../components/Player/PlayerDetailedStats';
import { PlayerMatchHistory } from '../../components/Player/PlayerMatchHistory';

export const PlayerPage = () => {
  const { playerName } = useParams<{ playerName: string }>();

  if (!playerName) {
    return <div>No player selected</div>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PlayerMetricsDashboard playerName={playerName} />
          </Grid>

          <Grid item xs={12}>
            <PlayerDetailedStats playerName={playerName} />
          </Grid>

          <Grid item xs={12}>
            <PlayerMatchHistory playerName={playerName} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

