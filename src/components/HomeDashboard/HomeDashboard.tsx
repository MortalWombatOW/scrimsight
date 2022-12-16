import {Box, CircularProgress, Typography} from '@mui/material';
import React from 'react';
import {useQuery} from '../../hooks/useQueries';
import useWindowSize from '../../hooks/useWindowSize';
import CardCarousel from '../Card/CardCarousel';
import PlayerSummaryCard from '../Card/PlayerSummaryCard';
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage';

const HomeDashboard = () => {
  const {width} = useWindowSize();

  const [team, tick] = useQuery(
    {
      name: 'uniquePlayers',
      query: ` select distinct player from ? as player_status`,
      deps: ['player_status'],
    },
    [],
  );

  const isLoading = team === undefined;

  return (
    <div
      style={
        {
          // padding: '50px',
          // width: width,
        }
      }>
      <WelcomeMessage />
      <Box>
        <Box
          sx={{
            paddingLeft: '50px',
          }}>
          <Typography variant="h4">Your Team</Typography>
        </Box>

        {isLoading ? (
          <CircularProgress variant="indeterminate" color="primary" />
        ) : (
          <CardCarousel width={width} childSpacing={10}>
            {team.map(({player}) => (
              <PlayerSummaryCard playerName={player as string} />
            ))}
          </CardCarousel>
        )}
      </Box>
    </div>
  );
};

export default HomeDashboard;
