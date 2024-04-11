import React from 'react';

import {Grid} from '@mui/material';
import MapScorecard from './MapScorecard';
import MapImage from './MapImage';
import MapSummaryStats from './MapSummaryStats';
import MapRoster from './MapRoster';

const MapSummary = () => {
  return (
    <div>
      <Grid
        container
        spacing={5}
        sx={{
          mb: '1em',
        }}>
        <Grid item xs={6}>
          <MapScorecard />
          <MapRoster />
        </Grid>
        <Grid item xs={6}>
          <MapImage />
        </Grid>
      </Grid>
    </div>
  );
};

export default MapSummary;
