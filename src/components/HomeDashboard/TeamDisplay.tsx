import {Box, Typography, CircularProgress} from '@mui/material';
import {width} from '@mui/system';
import React, {useState} from 'react';
import {useQuery} from '../../hooks/useQueries';
import Globals from '../../lib/globals';
import {Team} from '../../lib/data/types';
import CardCarousel from '../Card/CardCarousel';
import PlayerSummaryCard from '../Card/PlayerSummaryCard';

const TeamDisplay = () => {
  const [team, setTeam] = useState<Team | undefined>(Globals.getTeam());
  Globals.subscribeToTeamChange(setTeam);

  if (team === undefined) {
    return <Box component="div">No team selected</Box>;
  }

  return (
    <Box component="div">
      <Box
        component="div"
        sx={{
          paddingLeft: '50px',
          paddingTop: '50px',
        }}>
        <Typography variant="h4">{team.name}</Typography>
        {team.notes && (
          <Box component="div">
            <Typography variant="h6">Notes</Typography>
            <Typography variant="body1">{team.notes}</Typography>
          </Box>
        )}
      </Box>

      <CardCarousel width={width} childSpacing={10}>
        {team.players.map((player) => (
          <PlayerSummaryCard playerName={player} />
        ))}
      </CardCarousel>
    </Box>
  );
};

export default TeamDisplay;
