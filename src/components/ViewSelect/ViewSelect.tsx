import React from 'react';

import ViewListIcon from '@mui/icons-material/ViewList';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import MapIcon from '@mui/icons-material/Map';
import './ViewSelect.scss';

export const ViewSelect = ({
  currentView,
  setView,
}: {
  currentView: string;
  setView: (view: string) => void;
}) => {
  const handleClick = (view: string) => {
    setView(view);
  };
  return (
    <div className="ViewSelect">
      <div className="ViewSelect__item" onClick={() => handleClick('map')}>
        <span>Map</span>
        <MapIcon />
      </div>
      <div
        className="ViewSelect__item"
        onClick={() => handleClick('play-by-play')}>
        <span>Play-by-play</span>
        <InsertChartIcon />
      </div>
      <div className="ViewSelect__item" onClick={() => handleClick('stats')}>
        <span>Metrics</span>
        <ViewListIcon />
      </div>
    </div>
  );
};

export default ViewSelect;
