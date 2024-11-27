import React from 'react';

import MetricCard from '../Card/MetricCard';
import MapsList from '../MapsList/MapsList';
import { DataTable } from 'wombat-data-framework';
import Uploader from '../Uploader/Uploader';
import Grid from '@mui/material/Grid2';
import './HomeDashboard.scss';

const HomeDashboard = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', padding: '50px', position: 'relative' }} className="home-dashboard">

      <Uploader />


      <MapsList />

      <MetricCard columnName="healingDealt" slice={{ playerName: 'Alert', playerRole: 'support' }} compareToOther={['playerName']} />
      {/* <MetricCard columnName="eliminations" slice={{playerName: 'Alert', mapId: 28671376556}} compareToOther={['playerName']} />
      <MetricCard columnName="eliminations" slice={{playerName: 'Alert', mapId: 28671376556}} compareToOther={['mapId']} /> */}

    </div>
  );
};

export default HomeDashboard;
