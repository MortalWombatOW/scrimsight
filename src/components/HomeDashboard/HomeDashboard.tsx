import React from 'react';

import MapList from '../MapList/MapList';
// import PlayByPlay from '../PlayByPlay/PlayByPlay';

// const PlayerTimePlayedDisplay = () => {
//   const node = useDataNode('player_time_played');

const HomeDashboard = () => {
  return (
    <div style={{margin: '1em'}}>
      <MapList />
    </div>
  );
};

export default HomeDashboard;
