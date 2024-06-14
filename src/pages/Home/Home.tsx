import React from 'react';
import HomeDashboard from '../../components/HomeDashboard/HomeDashboard';
import Header from './../../components/Header/Header';

const Home = () => {
  return (
    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
      <HomeDashboard />
    </div>
  );
};

export default Home;
