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
import useWindowSize from '../../hooks/useWindowSize';
import Globals from '../../lib/data/globals';

import TeamDisplay from './TeamDisplay';

const HomeDashboard = () => {
  const {width} = useWindowSize();

  const team = Globals.getTeam();

  const isLoading = team === undefined;

  return (
    <div style={{width: '100%'}}>
      {team === undefined ? (
        <div
          style={{
            padding: '50px',
          }}>
          <Card className="welcome-card">
            <CardContent>
              <Typography variant="h5">Select your team</Typography>
              <Typography variant="body1">
                Select your team to get started. If you don't have a team, you
                can create one.
              </Typography>
            </CardContent>
          </Card>
        </div>
      ) : (
        <TeamDisplay />
      )}
    </div>
  );
};

export default HomeDashboard;
