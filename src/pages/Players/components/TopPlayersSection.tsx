import { Grid, Paper, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { playerStatTotalsAtom } from '../../../atoms';

interface TopPlayerCard {
  title: string;
  value: string | number;
  playerName: string;
  statKey: keyof typeof statFormatters;
}

const statFormatters = {
  eliminations: (value: number) => value.toLocaleString(),
  heroDamageDealt: (value: number) => value.toLocaleString(),
  healingDealt: (value: number) => value.toLocaleString(),
  weaponAccuracy: (value: number) => `${(value * 100).toFixed(1)}%`,
  ultimatesEarned: (value: number) => value.toLocaleString(),
  kdr: (value: number) => value.toFixed(2),
};

export const TopPlayersSection = () => {
  const [playerStats] = useAtom(playerStatTotalsAtom);
  const navigate = useNavigate();

  const getTopPlayerInCategory = (category: keyof typeof statFormatters): TopPlayerCard | null => {
    if (!playerStats?.length) return null;

    let topPlayer;
    if (category === 'kdr') {
      topPlayer = playerStats.reduce((prev, current) => {
        const prevKdr = prev.deaths > 0 ? prev.eliminations / prev.deaths : prev.eliminations;
        const currentKdr = current.deaths > 0 ? current.eliminations / current.deaths : current.eliminations;
        return prevKdr > currentKdr ? prev : current;
      });
    } else {
      topPlayer = playerStats.reduce((prev, current) => 
        (prev[category] > current[category]) ? prev : current
      );
    }

    const value = category === 'kdr' 
      ? (topPlayer.deaths > 0 ? topPlayer.eliminations / topPlayer.deaths : topPlayer.eliminations)
      : topPlayer[category];

    return {
      title: category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: statFormatters[category](value),
      playerName: topPlayer.playerName,
      statKey: category,
    };
  };

  const topCategories: (keyof typeof statFormatters)[] = [
    'kdr',
    'eliminations',
    'heroDamageDealt',
    'healingDealt',
    'weaponAccuracy',
    'ultimatesEarned',
  ];

  return (
    <Grid container spacing={2}>
      {topCategories.map((category) => {
        const topPlayer = getTopPlayerInCategory(category);
        if (!topPlayer) return null;

        return (
          <Grid item xs={12} sm={6} md={4} key={category}>
            <Paper 
              onClick={() => navigate(`/players/${encodeURIComponent(topPlayer.playerName)}`)}
              sx={{ 
                p: 2, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transition: 'all 0.3s',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Top {topPlayer.title}
              </Typography>
              <Typography variant="h4" component="div" gutterBottom>
                {topPlayer.value}
              </Typography>
              <Typography 
                variant="body2" 
                color="primary"
                sx={{ 
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {topPlayer.playerName}
              </Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}; 
