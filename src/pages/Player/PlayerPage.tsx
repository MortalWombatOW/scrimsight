import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Suspense } from 'react';
import { singlePlayerStatsAtom } from '../../atoms/singlePlayerStatsAtom';
import { PlayerOverviewCard } from '../../components/Player/PlayerOverviewCard';
import { PlayerDetailedStats } from '../../components/Player/PlayerDetailedStats';
import { PlayerMatchHistory } from '../../components/Player/PlayerMatchHistory';

export const PlayerPage = () => {
  const { playerName } = useParams<{ playerName: string }>();

  const decodedName = decodeURIComponent(playerName ?? '');
  console.log('Rendering PlayerPage for:', decodedName);
  
  const [playerStats] = useAtom(singlePlayerStatsAtom(decodedName));
  console.log('Player stats loaded:', Boolean(playerStats));

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Suspense fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
            onClick={() => console.log('Suspense fallback active for:', decodedName)}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading player data... (Click for debug)
            </Typography>
          </Box>
        }>
          
          <Box mb={3}>
            <PlayerOverviewCard stats={playerStats} />
          </Box>

          <Box mb={3}>
            <PlayerDetailedStats stats={playerStats} />
          </Box>

          <Box>
            <PlayerMatchHistory stats={playerStats} />
          </Box>
        </Suspense>
      </Box>
    </Container>
  );
};

