import {CircularProgress} from '@mui/material';
import Header from 'components/Header/Header';

import React, {useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import './Map.scss';
import {useNavigate} from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';

const MapPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  console.log('params', params.mapId);

  const {mapId: mapIdStr} = params;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlayerNamesStr = searchParams.get('players');

  const mapId = mapIdStr ? Number.parseInt(mapIdStr, 10) : undefined;
  let selectedPlayerNames: string[] = [];
  if (selectedPlayerNamesStr) {
    selectedPlayerNames = selectedPlayerNamesStr.split(',');
  }

  const needsMap = mapId === undefined;
  const [loaded, setLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  // const maskWidthRef = useSpringRef();
  // const {maskWidth} = useSpring({
  //   maskWidth: loaded ? '0%' : '50%',
  //   // config: {duration: 1000},
  // });

  const {height} = useWindowSize();
  const maskHeight = height - 70;

  const startLoadAnimation = () => {
    setShowSpinner(false);
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  };

  return (
    <div className="MapPage">
      <Header
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="container">
        {/* {mapId && <PlayByPlay mapId={mapId!} onLoaded={startLoadAnimation} />} */}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          width: loaded ? '0%' : '50%',
          height: maskHeight,
          background: 'grey',
          transition: 'width 1s ease-in-out',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 0,
          width: loaded ? '0%' : '50%',
          height: maskHeight,
          background: 'grey',
          transition: 'width 1s ease-in-out',
          zIndex: 2,
        }}
      />
      {mapId !== undefined && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(50% - 50px)',
            left: 'calc(50% - 50px)',
            zIndex: 3,
          }}>
          <CircularProgress
            style={{
              opacity: showSpinner ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              width: 100,
              height: 100,
            }}
          />
        </div>
      )}
      {mapId === undefined && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(50% - 400px)',
            left: 'calc(50% - 750px)',
            width: 1500,
            height: 800,
            background: 'white',
            borderRadius: 10,
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            justifyContent: 'center',
            zIndex: 3,
          }}>
          {/* <MapsList onLoaded={() => console.log('yay')} /> */}
          no map selected
        </div>
      )}
    </div>
  );
};

export default MapPage;
