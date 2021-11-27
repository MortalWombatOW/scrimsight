import NavCard from '../../components/NavCard/NavCard';
import React from 'react';
import Header from './../../components/Header/Header';

const Home = () => (
  <div>
    <Header />
    <div className="Home-container">
      <NavCard title="Maps" link="/maps">
        Explore the matches you{"'"}ve played
      </NavCard>
      <NavCard title="Players" link="google.com">
        Understand player performance over time
      </NavCard>
    </div>
  </div>
);

export default Home;
