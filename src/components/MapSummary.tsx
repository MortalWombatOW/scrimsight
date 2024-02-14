import React from 'react';

import {Grid} from '@mui/material';
import MapScorecard from './MapScorecard';
import MapImage from './MapImage';
import MapSummaryStats from './MapSummaryStats';

const MapSummary = ({mapId}: {mapId: number}) => {
  return (
    <div>
      <Grid
        container
        spacing={5}
        sx={{
          mb: '1em',
        }}>
        <Grid item xs={6}>
          <MapScorecard mapId={mapId} />
          <MapSummaryStats mapId={mapId} />
        </Grid>
        <Grid item xs={6}>
          <MapImage mapId={mapId} />
        </Grid>
      </Grid>
    </div>
  );
};

export default MapSummary;
