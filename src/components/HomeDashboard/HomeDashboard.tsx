import React from 'react';

import MetricCard from '../Card/MetricCard';
import MapsList from '../MapsList/MapsList';
import { DataTable } from 'wombat-data-framework';

const HomeDashboard = () => {
  return (
    <div style={{ margin: '1em' }}>
      <MapsList />
      <MetricCard columnName="healingDealt" slice={{ playerName: 'Alert', playerRole: 'support' }} compareToOther={['playerName']} />
      {/* <MetricCard columnName="eliminations" slice={{playerName: 'Alert', mapId: 28671376556}} compareToOther={['playerName']} />
      <MetricCard columnName="eliminations" slice={{playerName: 'Alert', mapId: 28671376556}} compareToOther={['mapId']} /> */}

      <DataTable nodeName="player_events" />
    </div>
  );
};

export default HomeDashboard;
