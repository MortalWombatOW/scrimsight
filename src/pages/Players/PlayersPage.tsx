import { Container, Grid, Typography, Paper } from '@mui/material';
import { useAtom } from 'jotai';
import { playerStatTotalsAtom, uniquePlayerNamesAtom } from '../../atoms';
import { PlayerStatsGrid } from './components/PlayerStatsGrid';
import { TopPlayersSection } from './components/TopPlayersSection';
import { HeroDistributionChart } from './components/HeroDistributionChart';
import { PlayerPerformanceMetrics } from './components/PlayerPerformanceMetrics';

export const PlayersPage = () => {
  const [playerStats] = useAtom(playerStatTotalsAtom);
  const [players] = useAtom(uniquePlayerNamesAtom);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Typography variant="h3" component="h1" gutterBottom>
        Players Overview
      </Typography>
      
      {/* Top Stats Summary */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="text.secondary">
              Total Players
            </Typography>
            <Typography variant="h4">
              {players?.length || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="text.secondary">
              Active Players
            </Typography>
            <Typography variant="h4">
              {playerStats?.length || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="text.secondary">
              Average Damage
            </Typography>
            <Typography variant="h4">
              {playerStats ? Math.round(playerStats.reduce((acc, p) => acc + p.heroDamageDealt, 0) / playerStats.length).toLocaleString() : 0}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="text.secondary">
              Average Healing
            </Typography>
            <Typography variant="h4">
              {playerStats ? Math.round(playerStats.reduce((acc, p) => acc + p.healingDealt, 0) / playerStats.length).toLocaleString() : 0}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Top Players Section */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Top Performing Players
            </Typography>
            <TopPlayersSection />
          </Paper>
        </Grid>

        {/* Hero Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Hero Distribution
            </Typography>
            <HeroDistributionChart />
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Performance Metrics
            </Typography>
            <PlayerPerformanceMetrics />
          </Paper>
        </Grid>

        {/* Player Stats Grid */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              All Players
            </Typography>
            <PlayerStatsGrid />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
