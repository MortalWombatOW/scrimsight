import React from 'react';
import Header from './../../components/Header/Header';
import MapsList from './../../components/MapsList/MapsList';

const Home = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);
  return (
    <div>
      <Header refreshCallback={incrementUpdateCount} />
      <div className="Home-container">
        <MapsList updateCount={updateCount} />
      </div>
    </div>
  );
};

export default Home;
