import { Box, Grid, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { BarChart } from '@mui/x-charts/BarChart';
import { playerStatTotalsAtom } from '../../../atoms';

export const PlayerPerformanceMetrics = () => {
  const [playerStats] = useAtom(playerStatTotalsAtom);

  const getTopPlayers = (field: keyof typeof playerStats[0], count: number = 5) => {
    if (!playerStats?.length) return [];
    return [...playerStats]
      .sort((a, b) => (b[field] as number) - (a[field] as number))
      .slice(0, count);
  };

  const topDamageStats = getTopPlayers('heroDamageDealt');
  const topHealingStats = getTopPlayers('healingDealt');

  return (
    <Grid container spacing={4}>
      {/* Damage Dealers Chart */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Top Damage Dealers
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <BarChart
            xAxis={[{
              scaleType: 'band',
              data: topDamageStats.map(stat => stat.playerName),
            }]}
            series={[{
              data: topDamageStats.map(stat => stat.heroDamageDealt),
              color: '#ff4569',
            }]}
            height={300}
          />
        </Box>
      </Grid>

      {/* Healers Chart */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Top Healers
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <BarChart
            xAxis={[{
              scaleType: 'band',
              data: topHealingStats.map(stat => stat.playerName),
            }]}
            series={[{
              data: topHealingStats.map(stat => stat.healingDealt),
              color: '#45ff69',
            }]}
            height={300}
          />
        </Box>
      </Grid>
    </Grid>
  );
}; 