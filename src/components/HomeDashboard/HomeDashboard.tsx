import {CircularProgress} from '@mui/material';
import React from 'react';
import {useQuery} from '../../hooks/useQueries';
import useWindowSize from '../../hooks/useWindowSize';
import CardCarousel from '../Card/CardCarousel';
import PlayerSummaryCard from '../Card/PlayerSummaryCard';

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
    <div>
      {isLoading ? (
        <CircularProgress variant="indeterminate" color="primary" />
      ) : (
        <CardCarousel width={width} childSpacing={10}>
          {team.map(({player}) => (
            <PlayerSummaryCard playerName={player as string} />
          ))}
        </CardCarousel>
      )}
    </div>
  );
};

export default HomeDashboard;
