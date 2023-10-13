import React from 'react';
import DebugNodeGraph from '../../components/Debug/DebugNodeGraph';
import Header from '../../components/Header/Header';

const DebugPage = () => {
  return (
    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
      <Header
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <DebugNodeGraph />
    </div>
  );
};

export default DebugPage;
