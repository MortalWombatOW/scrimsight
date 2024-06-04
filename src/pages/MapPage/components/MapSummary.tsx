import React from 'react';

import {Grid} from '@mui/material';
import MapScorecard from './MapScorecard';
import MapImage from './MapImage';
import MapSummaryStats from './MapSummaryStats';
import MapRoster from './MapRoster';
import DataComponent from '../../../components/DataComponent';
import DataTable from '../../../components/data/DataTable';
import Infobox from '../../../components/data/Infobox';

const MapSummary = () => {
  return (
    <div>
      <Grid
        container
        spacing={5}
        sx={{
          mb: '1em',
        }}>
        <Grid item xs={8}>
          <MapScorecard />
          <MapRoster />
        </Grid>
        <Grid item xs={4}>
          <MapImage />
          <DataComponent
            fields={[
              {
                id: 'mapId',
                displayName: 'Map ID',
                type: 'categorical',
              },
              {
                id: 'mapName',
                displayName: 'Map Name',
                type: 'categorical',
              },
              {
                id: 'mapType',
                displayName: 'Map Type',
                type: 'categorical',
              },
              {
                id: 'team1Name',
                displayName: 'Team 1',
                type: 'categorical',
              },
              {
                id: 'team2Name',
                displayName: 'Team 2',
                type: 'categorical',
              },
              {
                id: 'team1Score',
                displayName: 'Team 1 Score',
                type: 'numerical',
              },
              {
                id: 'team2Score',
                displayName: 'Team 2 Score',
                type: 'numerical',
              },
              {
                id: 'totalRounds',
                displayName: 'Total Rounds',
                type: 'numerical',
              },
            ]}>
            <Infobox />
          </DataComponent>
          <DataComponent
            fields={[
              {
                id: 'mapId',
                displayName: 'Map ID',
                type: 'categorical',
                hidden: true,
              },
              {
                id: 'matchStartTime',
                displayName: 'Match Start Time',
                type: 'numerical',
              },
              {
                id: 'matchEndTime',
                displayName: 'Match End Time',
                type: 'numerical',
              },
              {
                id: 'round1StartTime',
                displayName: 'Round 1 Start Time',
                type: 'numerical',
              },
              {
                id: 'round1EndTime',
                displayName: 'Round 1 End Time',
                type: 'numerical',
              },
              {
                id: 'round2StartTime',
                displayName: 'Round 2 Start Time',
                type: 'numerical',
              },
              {
                id: 'round2EndTime',
                displayName: 'Round 2 End Time',
                type: 'numerical',
              },
              {
                id: 'round3StartTime',
                displayName: 'Round 3 Start Time',
                type: 'numerical',
              },
              {
                id: 'round3EndTime',
                displayName: 'Round 3 End Time',
                type: 'numerical',
              },
            ]}>
            <DataTable />
          </DataComponent>
        </Grid>
      </Grid>
    </div>
  );
};

export default MapSummary;
