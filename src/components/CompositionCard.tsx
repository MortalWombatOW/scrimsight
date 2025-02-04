import { Card, CardContent, Grid, Typography, Box, Avatar } from '@mui/material';
import { getHeroImage, getRoleFromHero, getRankForRole } from '../lib/data/hero';
import { formatDuration } from '../lib/time';
import RoleIcon from './Common/RoleIcon';

interface CompositionCardProps {
  heroes: string[];
  timePlayed: number;
}

export const CompositionCard = ({ heroes, timePlayed }: CompositionCardProps) => (
  <Card sx={{ width: 300, m: 1 }}>
    <CardContent>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {Object.entries(
              heroes.reduce((acc, hero) => {
                const role = getRoleFromHero(hero);
                acc[role] = [...(acc[role] || []), hero].sort();
                return acc;
              }, {} as Record<string, string[]>)
            )
            .sort(([a], [b]) => getRankForRole(a) - getRankForRole(b))
            .map(([role, roleHeroes]) => (
              <Grid item key={role}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <RoleIcon role={role} color="primary" sx={{ fontSize: '1rem' }} />
                    <Typography variant="caption" color="text.secondary">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={0.5}>
                    {roleHeroes.map((hero) => (
                      <Avatar
                        key={hero}
                        src={getHeroImage(hero)}
                        sx={{ width: 32, height: 32 }}
                        alt={hero}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Play time: {formatDuration(timePlayed)}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
); 