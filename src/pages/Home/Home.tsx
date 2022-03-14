import React from 'react';
import Header from './../../components/Header/Header';
import MapsList from './../../components/MapsList/MapsList';

const Home = () => (
  <div>
    <Header />
    <div className="Home-container">
      <MapsList />
    </div>
  </div>
);

export default Home;
