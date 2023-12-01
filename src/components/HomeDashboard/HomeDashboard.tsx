import React, {useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import Globals from '../../lib/globals';

import MapList from '../MapListV2/MapList';
import {useDataNodeOutput} from '../../hooks/useData';
// import PlayByPlay from '../PlayByPlay/PlayByPlay';

// const PlayerTimePlayedDisplay = () => {
//   const node = useDataNode('player_time_played');

const HomeDashboard = () => {
  const {width} = useWindowSize();

  const team = Globals.getTeam();

  // const isLoading = team === undefined;

  return (
    <div style={{margin: '1em'}}>
      <MapList />
    </div>
  );
};

export default HomeDashboard;
