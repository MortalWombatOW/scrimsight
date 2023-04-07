import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import React, {useState} from 'react';
import MapsList from '~/components/MapsList/MapsList';
import Uploader from '~/components/Uploader/Uploader';
import useWindowSize from '../../hooks/useWindowSize';
import Globals from '../../lib/data/globals';

import TeamDisplay from './TeamDisplay';

const HomeDashboard = () => {
  const {width} = useWindowSize();

  const team = Globals.getTeam();

  // const isLoading = team === undefined;

  return (
    <div style={{width: '100%'}}>
      {team !== undefined ? (
        <TeamDisplay />
      ) : null}
      <Uploader 
       refreshCallback={() => {} }
      />
      <MapsList
      height={width > 600 ? 400 : 200}
      onLoaded={() => {}}
      />
    </div>
  );
};

export default HomeDashboard;
