import { Card, CardContent, Typography, Box, Grid, Chip, Avatar } from '@mui/material';
import { type SinglePlayerStats } from '../../atoms/singlePlayerStatsAtom';
import { type MatchData } from '../../atoms/matchDataAtom';
import { PersonOutline, EmojiEvents, Event, Timeline, Stars, Bolt } from '@mui/icons-material';
import { getHeroImage } from '../../lib/data/hero';

interface PlayerOverviewCardProps {
  stats: SinglePlayerStats;
}

export const PlayerOverviewCard = ({ stats }: PlayerOverviewCardProps) => {
  const totalGames = stats.matches.length;
  const wins = stats.matches.filter((m: MatchData) => (m.team1Players.includes(stats.playerName) && m.team1Score > m.team2Score) || (m.team2Players.includes(stats.playerName) && m.team2Score > m.team1Score)).length;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0';
  const kdr = stats.deaths > 0 ? (stats.eliminations / stats.deaths).toFixed(2) : stats.eliminations.toString();

  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <PersonOutline sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            {stats.playerName}
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
              <Event sx={{ mr: 1, color: 'warning.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Games Played
                </Typography>
                <Typography variant="h6">
                  {totalGames}
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
                  {kdr}
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
                  {stats.finalBlows}
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
                  {stats.eliminations}
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
                {stats.topHeroes.slice(0, 3).map((hero: string) => (
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