import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, {useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import Globals from '../../lib/globals';

import MapInfo from '~/components/MapInfo/MapInfo';
import {useData, useDataNode, useDataNodeOutput} from '../../hooks/useData';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MapList from '../MapListV2/MapList';
// import PlayByPlay from '../PlayByPlay/PlayByPlay';

// const PlayerTimePlayedDisplay = () => {
//   const node = useDataNode('player_time_played');

const HomeDashboard = () => {
  const {width} = useWindowSize();

  const team = Globals.getTeam();

  const recentGames = useDataNodeOutput('player_time_played');

  // const isLoading = team === undefined;

  return (
    <div
      style={{
        flexGrow: 1,
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <MapList />
    </div>
  );
};

export default HomeDashboard;
