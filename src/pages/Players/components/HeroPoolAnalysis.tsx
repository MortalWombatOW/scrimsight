import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { useAtomValue } from 'jotai';
import { playerStatsByPlayerAndHeroAtom } from '../../../atoms/metrics/playerMetricsAtoms';
import { getRoleFromHero, OverwatchRole } from '../../../lib/data/hero';

interface HeroStats {
  hero: string;
  role: OverwatchRole;
  matches: number;
  winRate: number;
  avgElims: number;
  avgDamage: number;
  avgHealing: number;
}

export const HeroPoolAnalysis = () => {
  const { rows: heroStats } = useAtomValue(playerStatsByPlayerAndHeroAtom);

  // Process hero stats
  const heroPool = heroStats.reduce((acc, stat) => {
    const hero = stat.playerHero;
    const role = getRoleFromHero(hero);
    
    if (!acc[hero]) {
      acc[hero] = {
        hero,
        role,
        matches: 0,
        wins: 0,
        eliminations: 0,
        damage: 0,
        healing: 0,
      };
    }
    
    acc[hero].matches += 1;
    acc[hero].eliminations += stat.eliminations;
    acc[hero].damage += stat.heroDamageDealt;
    acc[hero].healing += stat.healingDealt;
    
    return acc;
  }, {} as Record<string, {
    hero: string;
    role: OverwatchRole;
    matches: number;
    wins: number;
    eliminations: number;
    damage: number;
    healing: number;
  }>);

  // Convert to array and calculate averages
  const heroPoolStats: HeroStats[] = Object.values(heroPool).map(stats => ({
    hero: stats.hero,
    role: stats.role,
    matches: stats.matches,
    winRate: 0, // TODO: Add win rate calculation when available
    avgElims: stats.eliminations / stats.matches,
    avgDamage: stats.damage / stats.matches,
    avgHealing: stats.healing / stats.matches,
  }));

  // Group by role
  const roleGroups = heroPoolStats.reduce((acc, hero) => {
    if (!acc[hero.role]) {
      acc[hero.role] = [];
    }
    acc[hero.role].push(hero);
    return acc;
  }, {} as Record<OverwatchRole, HeroStats[]>);

  // Sort roles in the standard order: tank, damage, support
  const roleOrder: OverwatchRole[] = ['tank', 'damage', 'support'];

  if (heroPoolStats.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No hero pool data available</Typography>
      </Paper>
    );
  }

  // Find the maximum matches for progress bar scaling
  const maxMatches = Math.max(...heroPoolStats.map(h => h.matches));

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Hero Pool Analysis
      </Typography>
      
      {roleOrder.map(role => (
        <Box key={role} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main' }}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>
          
          {roleGroups[role]?.sort((a, b) => b.matches - a.matches).map(hero => (
            <Box key={hero.hero} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  {hero.hero}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hero.matches} matches
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(hero.matches / maxMatches) * 100}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(hero.avgElims)} elims
                  </Typography>
                  {hero.role !== 'support' && (
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(hero.avgDamage).toLocaleString()} dmg
                    </Typography>
                  )}
                  {hero.role === 'support' && (
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(hero.avgHealing).toLocaleString()} heal
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Paper>
  );
}; 