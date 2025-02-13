import { Container, Grid, Typography, Paper, Box, Tabs, Tab } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { playerStatsBaseAtom } from '../../atoms/metrics/playerMetricsAtoms';
import { uniquePlayerNamesAtom } from '../../atoms/uniquePlayerNamesAtom';
import { PlayerStatsGrid } from './components/PlayerStatsGrid';
import { TopPlayersSection } from './components/TopPlayersSection';
import { HeroDistributionChart } from './components/HeroDistributionChart';
import { HeroPoolAnalysis } from './components/HeroPoolAnalysis';
import { PlayerPerformanceMetrics } from './components/PlayerPerformanceMetrics';
import { StatCard } from '../../components/Card/StatCard';
import {
  People as PeopleIcon,
  Timeline as TimelineIcon,
  LocalHospital as HealingIcon,
  Security as TankIcon,
  Whatshot as DamageIcon,
  Support as SupportIcon
} from '@mui/icons-material';

export const PlayersPage = () => {
  const [players] = useAtom(uniquePlayerNamesAtom);
  const playerStats = useAtomValue(playerStatsBaseAtom);
  const playerStatsRows = playerStats?.rows || [];
  const [selectedTab, setSelectedTab] = useState(0);

  // Calculate overall statistics
  const totalPlayers = players?.length || 0;
  const avgDamagePerMatch = playerStatsRows.length > 0
    ? Math.round(playerStatsRows.reduce((acc, p) => acc + p.heroDamageDealt, 0) / playerStatsRows.length)
    : 0;
  const avgHealingPerMatch = playerStatsRows.length > 0
    ? Math.round(playerStatsRows.reduce((acc, p) => acc + p.healingDealt, 0) / playerStatsRows.length)
    : 0;

  // Role distribution (mock data for now, should be replaced with actual data)
  const roleDistribution = {
    tank: Math.round(totalPlayers * 0.2),
    damage: Math.round(totalPlayers * 0.5),
    support: Math.round(totalPlayers * 0.3)
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" gutterBottom>
          Players
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Comprehensive player statistics and performance metrics
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Total Players"
            value={totalPlayers.toString()}
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Tank Players"
            value={roleDistribution.tank.toString()}
            icon={<TankIcon />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Damage Players"
            value={roleDistribution.damage.toString()}
            icon={<DamageIcon />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Support Players"
            value={roleDistribution.support.toString()}
            icon={<SupportIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Avg. Damage"
            value={avgDamagePerMatch.toLocaleString()}
            icon={<TimelineIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Avg. Healing"
            value={avgHealingPerMatch.toLocaleString()}
            icon={<HealingIcon />}
            color="secondary.main"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Performance" />
          <Tab label="Heroes" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {selectedTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TopPlayersSection />
              </Grid>
              <Grid item xs={12}>
                <PlayerStatsGrid />
              </Grid>
            </Grid>
          )}

          {selectedTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <PlayerPerformanceMetrics />
              </Grid>
            </Grid>
          )}

          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <HeroDistributionChart />
              </Grid>
              <Grid item xs={12} md={6}>
                <HeroPoolAnalysis />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
