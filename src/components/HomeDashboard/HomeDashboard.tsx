import React from 'react';
import DataFetcher from '../../WombatDataFramework/components/DataFetcher';
import DataTable from '../../WombatDataFramework/components/DataTable';
import DataFilter from '../../WombatDataFramework/components/DataFilter';
import MetricCard from '../Card/MetricCard';
import MapsList from '../MapsList/MapsList';

const HomeDashboard = () => {
  return (
    <div style={{margin: '1em'}}>
      <MapsList />
      <MetricCard columnName="healingDealt" slice={{playerName: 'Alert', playerRole: 'support'}} compareToOther={['playerName']} />
      {/* <MetricCard columnName="eliminations" slice={{playerName: 'Alert', mapId: 28671376556}} compareToOther={['playerName']} />
      <MetricCard columnName="eliminations" slice={{playerName: 'Alert', mapId: 28671376556}} compareToOther={['mapId']} /> */}

      <DataFetcher nodeName="player_events" renderContent={(dataResult) => <DataFilter dataResult={dataResult} renderContent={(dataResult) => <DataTable dataResult={dataResult} />} />} />
    </div>
  );
};

export default HomeDashboard;
