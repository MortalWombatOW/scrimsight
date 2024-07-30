import React from 'react';
import {useParams} from 'react-router-dom';
import MapTimeline from '../../components/MapTimeline/MapTimeline';
import {Container} from '@mui/material';

const MapPage = () => {
  const {mapId} = useParams();

  return (
    <Container>
      <div>Map {mapId}</div>
      <div>players</div>
      <MapTimeline mapId={Number(mapId)} />
    </Container>
  );
};

export default MapPage;
