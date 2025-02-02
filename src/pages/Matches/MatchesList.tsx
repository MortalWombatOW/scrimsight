import React from 'react';
import { useAtom } from 'jotai';
import { type MatchData, matchDataAtom } from '~/atoms';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getColorgorical } from '~/lib/color';
import { mapNameToFileName } from '~/lib/string';

const MatchCard: React.FC<MatchData> = ({
  matchId,
  map,
  mode,
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  dateString,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/match/${matchId}`)}
      sx={{
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'info.main',
        transition: 'all 0.2s ease-in-out',
        background: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${mapNameToFileName(map, false)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom style={{ color: getColorgorical(team1Name) }}>
              {team1Name}
            </Typography>
            <Typography variant="h3" style={{ color: getColorgorical(team1Name) }}>
              {team1Score}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom style={{ color: getColorgorical(team2Name) }}>
              {team2Name}
            </Typography>
            <Typography variant="h3" style={{ color: getColorgorical(team2Name) }}>
              {team2Score}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" gutterBottom>
          {map} - {mode}
        </Typography>
        <Typography variant="h6">{dateString}</Typography>
      </CardContent>
    </Card>
  );
};

export const MatchesList = () => {
  const [matchData] = useAtom(matchDataAtom);

  if (!matchData) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Sort matches by date (most recent first)
  const sortedMatches = [...matchData].sort((a, b) => 
    new Date(b.dateString).getTime() - new Date(a.dateString).getTime()
  );

  return (
    <Grid container spacing={2}>
      {sortedMatches.map((match) => (
        <Grid item xs={12} sm={6} md={4} key={match.matchId}>
          <MatchCard {...match} />
        </Grid>
      ))}
    </Grid>
  );
};

