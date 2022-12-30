import {AppBar, Toolbar} from '@mui/material';
import Header from 'components/Header/Header';
import MapInfo from 'components/MapInfo/MapInfo';
import PlayByPlay from 'components/PlayByPlay/PlayByPlay';
import React, {useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {Button} from '../../components/Common/Mui';
import MapsList from '../../components/MapsList/MapsList';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import './Map.scss';
import {useNavigate} from 'react-router-dom';

const MapPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  console.log('params', params.mapId);

  const {mapId: mapIdStr, view} = params;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlayerNamesStr = searchParams.get('players');
  // const [view, setView] = useState('map');
  console.log('foo', selectedPlayerNamesStr);
  // if (!mapIdStr) {
  //   return <div>No mapId</div>;
  // }
  const mapId = mapIdStr ? Number.parseInt(mapIdStr, 10) : undefined;
  let selectedPlayerNames: string[] = [];
  if (selectedPlayerNamesStr) {
    selectedPlayerNames = selectedPlayerNamesStr.split(',');
  }
  console.log(selectedPlayerNames);

  return (
    <div className="MapPage">
      <Header
        refreshCallback={undefined}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      {mapIdStr && (
        <AppBar
          position="static"
          sx={{
            backgroundColor: '#4e566c',
          }}>
          <Toolbar disableGutters>
            <SubdirectoryArrowRightIcon sx={{mr: 1, ml: '10%'}} />
            <Button
              onClick={() => {
                navigate(`/map/${mapIdStr}/stats`);
              }}
              sx={{
                my: 2,
                mx: 1,
                color: '#f1f1f1',
                display: 'block',
                fontFamily: 'Bitter',
                fontSize: view === 'stats' ? '16px' : '14px',
              }}>
              Statistics
            </Button>
            <Button
              onClick={() => {
                navigate(`/map/${mapIdStr}/review`);
              }}
              sx={{
                my: 2,
                mx: 1,
                color: '#f1f1f1',
                display: 'block',
                fontFamily: 'Bitter',
                fontSize: view === 'review' ? '16px' : '14px',
              }}>
              Review
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <div className="container">
        {!mapIdStr ? (
          <MapsList updateCount={0} />
        ) : (
          <div className="section">
            {view === 'stats' && (
              <MapInfo
                mapId={mapId!}
                selectedPlayerNames={selectedPlayerNames}
                setSelectedPlayerNames={(names: string[]) =>
                  setSearchParams({players: names.join(',')})
                }
              />
            )}
            {view === 'review' && <PlayByPlay mapId={mapId!} />}
          </div>
        )}
        {/* <div className="section">
          <div className="header">Statistics</div>
          <div className="content">
            <MapTotals mapId={mapId} />
          </div>
        </div> */}
        {/* <div className="sidebar">sidebar</div>
        <div className="section">
          <div className="content"></div>
        </div> */}
      </div>
    </div>
  );
};

export default MapPage;
