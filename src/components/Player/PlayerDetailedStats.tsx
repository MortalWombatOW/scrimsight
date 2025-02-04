import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { SinglePlayerStats } from '../../atoms/singlePlayerStatsAtom';
import {
  Whatshot,
  Healing,
  Shield,
  Speed,
  Bolt,
  Stars,
  Person,
  FlashOn,
  Group,
  LocalHospital,
  Security,
  SportsKabaddi,
  EmojiFlags,
  EmojiEmotions,
  Favorite,
  Gavel,
  Highlight,
  Looks,
  LooksTwo,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
} from '@mui/icons-material';

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
  stats: SinglePlayerStats;
}

export const PlayerDetailedStats = ({ stats }: PlayerDetailedStatsProps) => {
  const statCards = [
    {
      title: 'Hero Damage',
      value: stats.heroDamageDealt,
      icon: <Whatshot />,
      color: 'error.main',
    },
    {
      title: 'Healing',
      value: stats.healingDealt,
      icon: <Healing />,
      color: 'success.main',
    },
    {
      title: 'Damage Blocked',
      value: stats.damageBlocked,
      icon: <Shield />,
      color: 'info.main',
    },
    {
      title: 'Eliminations',
      value: stats.eliminations,
      icon: <Stars />,
      color: 'warning.main',
    },
    {
      title: 'Final Blows',
      value: stats.finalBlows,
      icon: <Bolt />,
      color: 'secondary.main',
    },
    {
      title: 'Weapon Accuracy',
      value: `${(stats.weaponAccuracy * 100).toFixed(1)}%`,
      icon: <Speed />,
      color: 'primary.main',
    },
    {
      title: 'Deaths',
      value: stats.deaths,
      icon: <Person />,
      color: 'error.main',
    },
    {
      title: 'Objective Kills',
      value: stats.objectiveKills,
      icon: <FlashOn />,
      color: 'secondary.main',
    },
    {
      title: 'Defensive Assists',
      value: stats.defensiveAssists,
      icon: <Group />,
      color: 'info.main',
    },
    {
      title: 'Offensive Assists',
      value: stats.offensiveAssists,
      icon: <LocalHospital />,
      color: 'success.main',
    },
    {
      title: 'Damage Taken',
      value: stats.damageTaken,
      icon: <Security />,
      color: 'warning.main',
    },
    {
      title: 'All Damage Dealt',
      value: stats.allDamageDealt,
      icon: <SportsKabaddi />,
      color: 'error.main',
    },
    {
      title: 'Barrier Damage Dealt',
      value: stats.barrierDamageDealt,
      icon: <EmojiFlags />,
      color: 'info.main',
    },
    {
      title: 'Healing Received',
      value: stats.healingReceived,
      icon: <Favorite />,
      color: 'success.main',
    },
    {
      title: 'Self Healing',
      value: stats.selfHealing,
      icon: <EmojiEmotions />,
      color: 'secondary.main',
    },
    {
      title: 'Ultimates Earned',
      value: stats.ultimatesEarned,
      icon: <Gavel />,
      color: 'primary.main',
    },
    {
      title: 'Ultimates Used',
      value: stats.ultimatesUsed,
      icon: <Highlight />,
      color: 'secondary.main',
    },
    {
      title: 'Multikill Best',
      value: stats.multikillBest,
      icon: <Looks />,
      color: 'warning.main',
    },
    {
      title: 'Multikills',
      value: stats.multikills,
      icon: <LooksTwo />,
      color: 'error.main',
    },
    {
      title: 'Solo Kills',
      value: stats.soloKills,
      icon: <Looks3 />,
      color: 'info.main',
    },
    {
      title: 'Environmental Kills',
      value: stats.environmentalKills,
      icon: <Looks4 />,
      color: 'success.main',
    },
    {
      title: 'Environmental Deaths',
      value: stats.environmentalDeaths,
      icon: <Looks5 />,
      color: 'error.main',
    },
    {
      title: 'Critical Hits',
      value: stats.criticalHits,
      icon: <Looks6 />,
      color: 'primary.main',
    },
  ];

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Detailed Statistics
        </Typography>
        <Grid container spacing={2}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}; 