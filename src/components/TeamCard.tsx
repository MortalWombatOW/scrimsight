import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Avatar } from '@mui/material';
import { useAtomValue } from 'jotai';
import { teamStatsAtom } from '../atoms/teamStatsAtom';
import { Link } from 'react-router-dom';

interface TeamCardProps {
  teamName: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
};

const TeamCard: React.FC<TeamCardProps> = ({ teamName }) => {
  const teamStats = useAtomValue(teamStatsAtom);

  const team = teamStats.find((team) => team.teamName === teamName);

  return (
    <Link to={`/teams/${teamName}`} style={{ textDecoration: 'none' }}>
      <Card
        style={{ width: '400px', padding: '16px' }}
        sx={{
          transition: 'border 0.3s ease-in-out',
          border: '2px solid transparent',
          '&:hover': {
            border: '2px solid',
            borderColor: 'primary.main',
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ marginBottom: '0.35em' }}>{getInitials(teamName)}</Avatar>
            <Typography variant="h2" component="div" gutterBottom style={{ marginLeft: '8px' }}>
              {teamName}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Record
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1" sx={{ color: 'success.main' }}>
                  {team?.wins} W
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  /
                </Typography>
                <Typography variant="body1" sx={{ color: 'warning.main' }}>
                  {team?.draws} D
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  /
                </Typography>
                <Typography variant="body1" sx={{ color: 'error.light' }}>
                  {team?.losses} L
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Most Recent Game
              </Typography>
              <Typography variant="body1">
                {team?.mostRecentGameDate ? team.mostRecentGameDate.toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Players
              </Typography>
              <Typography variant="body1">
                {team?.players.join(', ')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TeamCard; 