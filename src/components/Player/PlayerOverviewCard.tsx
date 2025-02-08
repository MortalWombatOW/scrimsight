import { Box, Card, CardContent, Typography, Grid, Chip, Avatar } from '@mui/material';
import { PersonOutline, EmojiEvents, Timeline, Bolt, Stars } from '@mui/icons-material';
import { useAtomValue } from 'jotai';
import { playerStatsByPlayerAtom, playerStatsByPlayerAndHeroAtom } from '../../atoms/metrics/playerMetricsAtoms';
import { getHeroImage } from '../../lib/data/hero';

interface PlayerOverviewCardProps {
  playerName: string;
}

export const PlayerOverviewCard = ({ playerName }: PlayerOverviewCardProps) => {
  const { rows: playerStats } = useAtomValue(playerStatsByPlayerAtom);
  const { rows: heroStats } = useAtomValue(playerStatsByPlayerAndHeroAtom);
  
  const playerOverallStats = playerStats.find(stat => stat.playerName === playerName);
  const playerHeroStats = heroStats.filter(stat => stat.playerName === playerName);

  if (!playerOverallStats) {
    return null;
  }

  // Calculate top heroes by eliminations
  const topHeroes = playerHeroStats
    .sort((a, b) => b.eliminations - a.eliminations)
    .slice(0, 3)
    .map(stat => stat.playerHero);

  // Calculate win rate (this would need to be added to the metrics)
  const winRate = '50.0'; // Placeholder until we add win/loss tracking

  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <PersonOutline sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            {playerName}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <EmojiEvents sx={{ mr: 1, color: 'success.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Win Rate
                </Typography>
                <Typography variant="h6">
                  {winRate}%
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <Timeline sx={{ mr: 1, color: 'warning.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  K/D Ratio
                </Typography>
                <Typography variant="h6">
                  {playerOverallStats.deaths > 0 
                    ? (playerOverallStats.eliminations / playerOverallStats.deaths).toFixed(2) 
                    : playerOverallStats.eliminations.toString()}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <Stars sx={{ mr: 1, color: 'secondary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Final Blows
                </Typography>
                <Typography variant="h6">
                  {playerOverallStats.finalBlows}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <Bolt sx={{ mr: 1, color: 'error.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Eliminations
                </Typography>
                <Typography variant="h6">
                  {playerOverallStats.eliminations}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Top Heroes
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {topHeroes.map((hero) => (
                  <Chip
                    key={hero}
                    avatar={<Avatar src={getHeroImage(hero)} />}
                    label={hero}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 