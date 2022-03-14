import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Header from 'components/Header/Header';
import MapInfo from 'components/MapInfo/MapInfo';
import {useParams} from 'react-router-dom';
import './Map.scss';
import MapTotals from 'components/MapTotals/MapTotals';
const Map = () => {
  const {mapId: mapIdStr} = useParams();
  const mapId = Number.parseInt(mapIdStr, 10);

  return (
    <div className="MapPage">
      <Header />
      <div className="container">
        <div className="section">
          <div className="header">Map Info</div>
          <div className="content">
            <MapInfo mapId={mapId} />
          </div>
        </div>
        <div className="section">
          <div className="header">Statistics</div>
          <div className="content">
            <MapTotals mapId={mapId} />
          </div>
        </div>
        <div className="section">
          <div className="header">Play-by-play</div>
          <div className="content"></div>
        </div>
      </div>
    </div>
  );
};

export default Map;
