import React from 'react';
import DataFetcher from '../../WombatDataFramework/components/DataFetcher';
import DataTable from '../../WombatDataFramework/components/DataTable';
import DataFilter from '../../WombatDataFramework/components/DataFilter';
import useMetric from '../../hooks/useMetrics';
import MetricCard from '../Card/MetricCard';

// import PlayByPlay from '../PlayByPlay/PlayByPlay';

// const PlayerTimePlayedDisplay = () => {
//   const node = useDataNode('player_time_played');

const HomeDashboard = () => {
  return (
    <div style={{margin: '1em'}}>
      <MetricCard columnName="damageTakenPer10" slice={{playerRole: 'tank'}} compareToOther={['playerRole']} />
      <DataFetcher nodeName="player_events" renderContent={(dataResult) => <DataFilter dataResult={dataResult} renderContent={(dataResult) => <DataTable dataResult={dataResult} />} />} />
    </div>
  );
};

export default HomeDashboard;
