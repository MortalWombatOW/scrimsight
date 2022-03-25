import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Header from 'components/Header/Header';
import MapInfo from 'components/MapInfo/MapInfo';
import {useParams} from 'react-router-dom';
import './Map.scss';
import MapTotals from 'components/MapTotals/MapTotals';
import PlayByPlay from 'components/PlayByPlay/PlayByPlay';
const Map = () => {
  const {mapId: mapIdStr} = useParams();
  if (!mapIdStr) {
    return <div>No mapId</div>;
  }
  const mapId = Number.parseInt(mapIdStr, 10);

  return (
    <div className="MapPage">
      <Header />
      <div className="container">
        <div className="section">
          {/* <div className="header">Map Info</div> */}
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
          <div className="content">
            <PlayByPlay mapId={mapId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
