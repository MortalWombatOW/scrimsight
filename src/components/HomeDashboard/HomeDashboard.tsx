import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, {useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import Globals from '../../lib/globals';

import MapInfo from '~/components/MapInfo/MapInfo';
// import PlayByPlay from '../PlayByPlay/PlayByPlay';

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
          marginBottom: '16px',
        }}></div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '16px',
        }}>
        <div style={{flexGrow: 1}}></div>
        <ToggleButtonGroup
          value={contentComponent}
          exclusive
          onChange={(e, value) => setContentComponent(value)}
          aria-label="main content type"
          fullWidth>
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
      <div style={{flexGrow: 1, border: '1px solid red'}}>
        {selectedId &&
          contentComponent === 'timeline' &&
          // <PlayByPlay mapId={selectedId} onLoaded={() => {}} />
          'timeline'}
        {selectedId && contentComponent === 'stats' && (
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
