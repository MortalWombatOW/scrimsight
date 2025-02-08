import { Grid } from '@mui/material';
import { StatCard } from '../../../components/Card/StatCard';
import {
  Groups as TeamsIcon,
  EmojiEvents as WinsIcon,
  People as PlayersIcon,
  SportsEsports as GamesIcon
} from '@mui/icons-material';

interface TeamsSummaryStatsProps {
  totalTeams: number;
  totalGames: number;
  totalWins: number;
  totalPlayers: number;
}

export const TeamsSummaryStats = ({ totalTeams, totalGames, totalWins, totalPlayers }: TeamsSummaryStatsProps) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Teams"
          value={totalTeams.toString()}
          icon={<TeamsIcon />}
          color="primary.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Games"
          value={totalGames.toString()}
          icon={<GamesIcon />}
          color="secondary.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Wins"
          value={totalWins.toString()}
          icon={<WinsIcon />}
          color="success.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Players"
          value={totalPlayers.toString()}
          icon={<PlayersIcon />}
          color="info.main"
        />
      </Grid>
    </Grid>
  );
}; 