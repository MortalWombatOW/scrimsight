import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import {
  Whatshot,
} from '@mui/icons-material';
import { useAtomValue } from 'jotai';
import { playerStatsByPlayerAtom } from '../../atoms/metrics/playerMetricsAtoms';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card elevation={1}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Box sx={{ color, mr: 1 }}>
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h6">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
    </CardContent>
  </Card>
);

interface PlayerDetailedStatsProps {
  playerName: string;
}

export const PlayerDetailedStats = ({ playerName }: PlayerDetailedStatsProps) => {
  const { numericalKeys, rows } = useAtomValue(playerStatsByPlayerAtom);
  const playerStats = rows.find((stats) => stats.playerName === playerName);

  if (!playerStats) {
    return <div>Player not found</div>;
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Detailed Statistics
        </Typography>
        <Grid container spacing={2}>
          {numericalKeys.map((key) => (
            <Grid item xs={12} md={6} lg={4} key={key}>
              <StatCard
                title={key}
                value={playerStats[key]}
                icon={<Whatshot />}
                color="primary.main"
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}; 