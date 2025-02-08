import { Container, Grid, Typography, Paper } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { playerStatsBaseAtom } from '../../atoms/metrics/playerMetricsAtoms';
import { uniquePlayerNamesAtom } from '../../atoms/uniquePlayerNamesAtom';
import { PlayerStatsGrid } from './components/PlayerStatsGrid';
import { TopPlayersSection } from './components/TopPlayersSection';
import { HeroDistributionChart } from './components/HeroDistributionChart';
import { PlayerPerformanceMetrics } from './components/PlayerPerformanceMetrics';
import { PlayerStats } from '../../atoms/playerStatExpandedAtom';

export const PlayersPage = () => {
  const [players] = useAtom(uniquePlayerNamesAtom);
  const playerStats = useAtomValue(playerStatsBaseAtom);
  const playerStatsRows = playerStats?.rows || [];

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Players
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {players?.length || 0} players tracked
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Average Hero Damage per Match
                </Typography>
                <Typography variant="h4">
                  {playerStatsRows.length > 0 ? Math.round(playerStatsRows.reduce((acc: number, p: PlayerStats) => acc + p.heroDamageDealt, 0) / playerStatsRows.length).toLocaleString() : 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Average Healing per Match
                </Typography>
                <Typography variant="h4">
                  {playerStatsRows.length > 0 ? Math.round(playerStatsRows.reduce((acc: number, p: PlayerStats) => acc + p.healingDealt, 0) / playerStatsRows.length).toLocaleString() : 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TopPlayersSection />
        </Grid>

        <Grid item xs={12}>
          <PlayerStatsGrid />
        </Grid>

        <Grid item xs={12} md={6}>
          <HeroDistributionChart />
        </Grid>

        <Grid item xs={12} md={6}>
          <PlayerPerformanceMetrics />
        </Grid>
      </Grid>
    </Container>
  );
};
