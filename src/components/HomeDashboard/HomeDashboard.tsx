import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import React, {useState} from 'react';
import MapsList from '~/components/MapsList/MapsList';
import Uploader from '~/components/Uploader/Uploader';
import useWindowSize from '../../hooks/useWindowSize';
import Globals from '../../lib/data/globals';

import TeamDisplay from './TeamDisplay';
import MapInfo from '~/components/MapInfo/MapInfo';

const HomeDashboard = () => {
  const {width} = useWindowSize();

  const team = Globals.getTeam();

  const [selectedId, setSelectedId] = useState<number | undefined>();

  // const isLoading = team === undefined;

  return (
    <div style={{width: '100%', paddingLeft:  '20px', paddingRight: '20px', paddingTop: '20px'}}>
      <div style={{display: 'flex', flexDirection: 'row', gap: '16px'}}>
      <MapsList
      onLoaded={() => {}}
      onMapSelected={(mapId) => {
        setSelectedId(mapId);
      }}
      />
      {selectedId && (
      <MapInfo
          mapId={selectedId}
          selectedPlayerNames={[]}
          setSelectedPlayerNames={() => {}}
        />
      )}
      </div>
      
    </div>
  );
};

export default HomeDashboard;
