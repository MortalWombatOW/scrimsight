import { Box, Paper, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { playerStatsBaseAtom } from '../../../atoms/metrics/playerMetricsAtoms';
import { PlayerStats } from '../../../atoms/playerStatExpandedAtom';

const numericFields = [
  'eliminations',
  'finalBlows',
  'deaths',
  'heroDamageDealt',
  'healingDealt',
  'damageTaken',
  'damageBlocked',
  'ultimatesEarned',
  'ultimatesUsed',
  'weaponAccuracy'
] as const;

type NumericField = typeof numericFields[number];

export const PlayerPerformanceMetrics = () => {
  const playerStats = useAtomValue(playerStatsBaseAtom);
  const playerStatsRows = playerStats?.rows || [];

  const calculateAverages = () => {
    if (playerStatsRows.length === 0) return null;

    const totals = playerStatsRows.reduce((acc: Record<NumericField, number>, curr: PlayerStats) => {
      numericFields.forEach((field) => {
        acc[field] = (acc[field] || 0) + (curr[field] || 0);
      });
      return acc;
    }, {} as Record<NumericField, number>);

    const averages = Object.entries(totals).reduce((acc, [key, value]) => {
      acc[key as NumericField] = value / playerStatsRows.length;
      return acc;
    }, {} as Record<NumericField, number>);

    return averages;
  };

  const averages = calculateAverages();

  if (!averages) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No performance data available</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Average Performance Metrics
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        {Object.entries(averages).map(([key, value]) => (
          <Box key={key} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Typography variant="h6">
              {key === 'weaponAccuracy' 
                ? `${(value * 100).toFixed(1)}%`
                : value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}; 