import { useState } from 'react';
import { useAtom } from 'jotai';
import { teamCompositionsAtom } from '../../atoms/teamCompositionsAtom';
import { Box, Typography, Grid, Avatar, Card, CardContent } from '@mui/material';
import { formatDuration } from '../../lib/time';
import { getRoleFromHero, getHeroImage } from '../../lib/data/hero';
import RoleIcon from '../../components/Common/RoleIcon';

interface TeamCompositionsProps {
  teamName: string;
}

export const TeamCompositions = ({ teamName }: TeamCompositionsProps) => {
  const [showAllCompositions, setShowAllCompositions] = useState(false);
  const [compositions] = useAtom(teamCompositionsAtom);

  const teamCompositions = compositions
    .filter(c => c.teamName === teamName)
    .filter(c => showAllCompositions || c.timePlayed > 60)
    .sort((a, b) => b.timePlayed - a.timePlayed);

  const maxTimePlayed = Math.max(...teamCompositions.map(c => c.timePlayed), 0);
  const hasHiddenCompositions = compositions.some(c => c.teamName === teamName && c.timePlayed <= 60);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Team Compositions
        </Typography>
        {teamCompositions.length > 0 ? (
          <Box>
            {hasHiddenCompositions && (
              <Typography 
                variant="body2" 
                sx={{ 
                  cursor: 'pointer', 
                  color: 'primary.main', 
                  mb: 2,
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => setShowAllCompositions(!showAllCompositions)}
              >
                {showAllCompositions ? 'Show only significant compositions' : 'Show all compositions'}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              {['tank', 'damage', 'support'].map((role) => (
                <Grid item xs={3} key={role}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <RoleIcon role={role} color="primary" />
                    <Typography variant="subtitle2">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={3}>
                <Typography variant="subtitle2">Time Played</Typography>
              </Grid>
            </Grid>

            {teamCompositions.map((composition, index) => {
              const groupedHeroes = composition.heroes.reduce((acc, hero) => {
                const role = getRoleFromHero(hero);
                acc[role] = [...(acc[role] || []), hero].sort();
                return acc;
              }, {} as Record<string, string[]>);
              
              return (
                <Grid container spacing={2} key={index} sx={{ py: 1 }}>
                  {['tank', 'damage', 'support'].map((role) => (
                    <Grid item xs={3} key={role}>
                      <Box display="flex" gap={1}>
                        {groupedHeroes[role]?.map((hero) => (
                          <Avatar
                            key={hero}
                            src={getHeroImage(hero)}
                            sx={{ width: 32, height: 32 }}
                            alt={hero}
                          />
                        ))}
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'primary.main',
                          width: Math.max((composition.timePlayed / maxTimePlayed) * 200, 1) + 'px',
                          borderRadius: 4
                        }}
                      />
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                        {formatDuration(composition.timePlayed)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No composition data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}; 