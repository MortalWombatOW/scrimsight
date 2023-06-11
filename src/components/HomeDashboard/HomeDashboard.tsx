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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import TeamDisplay from './TeamDisplay';
import MapInfo from '~/components/MapInfo/MapInfo';

const HomeDashboard = () => {
  const {width} = useWindowSize();

  const team = Globals.getTeam();

  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [contentComponent, setContentComponent] = useState<string>('timeline');
  const contentComponents = {
    timeline: 'Timeline',
    stats: 'Statistics',
    map: 'Map',
  };

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          marginBottom: '16px',
        }}>
        <ToggleButtonGroup
          value={contentComponent}
          exclusive
          onChange={(e, value) => setContentComponent(value)}
          aria-label="text alignment"
          style={{alignSelf: 'center'}}>
          {Object.keys(contentComponents).map((component) => (
            <ToggleButton
              key={component}
              value={component}
              aria-label={component}>
              {contentComponents[component]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div style={{flexGrow: 1, border: '1px solid red'}}>test</div>
      {selectedId && (
        <MapInfo
          mapId={selectedId}
          selectedPlayerNames={[]}
          setSelectedPlayerNames={() => {}}
        />
      )}
      <div style={{display: 'flex', flexDirection: 'row', gap: '16px'}}>
        <MapsList
          onLoaded={() => {}}
          onMapSelected={(mapId) => {
            setSelectedId(mapId);
          }}
        />
      </div>
    </div>
  );
};

export default HomeDashboard;
