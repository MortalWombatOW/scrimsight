import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useAtomValue } from 'jotai';
import { playerStatsByMatchIdAndPlayerNameAtom } from '../../atoms/metrics/playerMetricsAtoms';

interface PlayerMatchHistoryProps {
  playerName: string;
}

export const PlayerMatchHistory = ({ playerName }: PlayerMatchHistoryProps) => {
  const { rows } = useAtomValue(playerStatsByMatchIdAndPlayerNameAtom);
  const playerMatches = rows
    .filter(match => match.playerName === playerName)
    .sort((a, b) => a.matchId.localeCompare(b.matchId));

  if (!playerMatches.length) {
    return <Typography>No match history available</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Match History</Typography>
        <Grid container spacing={2}>
          {playerMatches.map((match) => (
            <Grid item xs={12} key={match.matchId}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1">
                    Match ID: {match.matchId}
                  </Typography>
                  <Typography>
                    Eliminations: {match.eliminations}
                  </Typography>
                  <Typography>
                    Deaths: {match.deaths}
                  </Typography>
                  <Typography>
                    Hero Damage: {match.heroDamageDealt}
                  </Typography>
                  <Typography>
                    Healing: {match.healingDealt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};