import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { useAtomValue } from 'jotai';
import { playerStatsByPlayerAtom, PlayerStats, PlayerStatsNumericalKeys } from '../../../atoms/metrics/playerMetricsAtoms';
import { Link } from 'react-router-dom';
import { Grouped } from '../../../atoms/metrics/metricUtils';

interface TopPlayerCardProps {
  title: string;
  player: Grouped<PlayerStats, 'playerName', PlayerStatsNumericalKeys>;
  metric: string;
  value: number;
  color: string;
}

const TopPlayerCard = ({ title, player, metric, value, color }: TopPlayerCardProps) => (
  <Paper sx={{
    p: 2,
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    }
  }}>
    <Typography variant="h6" gutterBottom color={color}>
      {title}
    </Typography>
    <Box component={Link} to={`/players/${encodeURIComponent(player.playerName)}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ mr: 2 }}>{player.playerName[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1">
            {player.playerName}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {metric}
        </Typography>
        <Typography variant="h6" color={color}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export const TopPlayersSection = () => {
  const playerStats = useAtomValue(playerStatsByPlayerAtom);
  const players = playerStats?.rows || [];

  if (players.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No player data available</Typography>
      </Paper>
    );
  }

  // Find top players in different categories
  const topDamage = players.reduce((prev, current) =>
    prev.heroDamageDealt > current.heroDamageDealt ? prev : current
  );

  const topHealing = players.reduce((prev, current) =>
    prev.healingDealt > current.healingDealt ? prev : current
  );

  const topEliminations = players.reduce((prev, current) =>
    prev.eliminations > current.eliminations ? prev : current
  );

  const topAccuracy = players.reduce((prev, current) =>
    prev.weaponAccuracy > current.weaponAccuracy ? prev : current
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Top Performers
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <TopPlayerCard
            title="Top Damage"
            player={topDamage}
            metric="Hero Damage"
            value={topDamage.heroDamageDealt}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TopPlayerCard
            title="Top Healing"
            player={topHealing}
            metric="Healing Done"
            value={topHealing.healingDealt}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TopPlayerCard
            title="Most Eliminations"
            player={topEliminations}
            metric="Eliminations"
            value={topEliminations.eliminations}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TopPlayerCard
            title="Best Accuracy"
            player={topAccuracy}
            metric="Weapon Accuracy"
            value={Math.round(topAccuracy.weaponAccuracy * 100)}
            color="warning.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
}; 
