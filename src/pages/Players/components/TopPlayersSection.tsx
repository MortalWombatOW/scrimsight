import { Grid, Paper, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { playerStatsBaseAtom } from '../../../atoms/metrics/playerMetricsAtoms';
import { PlayerStats } from '../../../atoms/playerStatExpandedAtom';

export const TopPlayersSection = () => {
  const playerStats = useAtomValue(playerStatsBaseAtom);

  let topPlayer: PlayerStats | undefined;

  if (playerStats && playerStats.rows.length > 0) {
    // Find player with highest eliminations
    topPlayer = playerStats.rows.reduce((prev: PlayerStats, current: PlayerStats) => {
      return prev.eliminations > current.eliminations ? prev : current;
    });
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Top Player
          </Typography>
          {topPlayer ? (
            <>
              <Typography>
                {topPlayer.playerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {topPlayer.eliminations} eliminations
              </Typography>
            </>
          ) : (
            <Typography>No data available</Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}; 
