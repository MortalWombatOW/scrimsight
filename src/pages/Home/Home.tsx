import React from 'react';
import HomeDashboard from '../../components/HomeDashboard/HomeDashboard';
import Header from './../../components/Header/Header';

const Home = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);

  return (
    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
      <Header
        refreshCallback={incrementUpdateCount}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />

      <HomeDashboard />
    </div>
  );
};

export default Home;
