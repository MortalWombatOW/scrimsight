import { Box, Paper, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAtomValue } from 'jotai';
import { playerStatsByPlayerAndHeroAtom } from '../../../atoms/metrics/playerMetricsAtoms';

export const HeroDistributionChart = () => {
  const { rows: heroStats } = useAtomValue(playerStatsByPlayerAndHeroAtom);

  // Calculate hero play distribution
  const heroDistribution = heroStats.reduce((acc, stat) => {
    const hero = stat.playerHero;
    if (!acc[hero]) {
      acc[hero] = {
        count: 0,
        eliminations: 0,
        damage: 0,
        healing: 0,
      };
    }
    acc[hero].count += 1;
    acc[hero].eliminations += stat.eliminations;
    acc[hero].damage += stat.heroDamageDealt;
    acc[hero].healing += stat.healingDealt;
    return acc;
  }, {} as Record<string, { count: number; eliminations: number; damage: number; healing: number; }>);

  // Convert to array and sort by play count
  const sortedHeroes = Object.entries(heroDistribution)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10) // Take top 10 heroes
    .map(([hero, stats], index) => ({
      id: index,
      value: stats.count,
      label: hero,
      eliminations: stats.eliminations,
      damage: stats.damage,
      healing: stats.healing,
    }));

  if (sortedHeroes.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No hero distribution data available</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Hero Distribution
      </Typography>
      <Box sx={{ width: '100%', height: 400 }}>
        <PieChart
          series={[
            {
              data: sortedHeroes,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30 },
            },
          ]}
          height={400}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
            },
          }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Top Heroes Statistics
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {sortedHeroes.slice(0, 5).map((hero) => (
            <Box key={hero.label} sx={{ p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2">{hero.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                Matches: {hero.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Elims: {(hero.eliminations / hero.value).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Damage: {Math.round(hero.damage / hero.value).toLocaleString()}
              </Typography>
              {hero.healing > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Avg. Healing: {Math.round(hero.healing / hero.value).toLocaleString()}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}; 
