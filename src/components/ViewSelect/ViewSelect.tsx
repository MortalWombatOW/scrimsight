import React from 'react';

import ViewListIcon from '@mui/icons-material/ViewList';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import MapIcon from '@mui/icons-material/Map';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import './ViewSelect.scss';

const ViewSelectButton = ({currentView, handleClick, id, icon}) => {
  const className = `ViewSelectButton ${
    currentView === id ? 'selected' : 'unselected'
  }`;
  return (
    <div className={className} onClick={() => handleClick(id)}>
      <span>{id}</span>
      {icon}
    </div>
  );
};

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
      <ViewSelectButton
        currentView={currentView}
        handleClick={handleClick}
        id="overview"
        icon={<InsertChartIcon fontSize="large" />}
      />
      <ViewSelectButton
        currentView={currentView}
        handleClick={handleClick}
        id="play-by-play"
        icon={<MapIcon fontSize="large" />}
      />
      <ViewSelectButton
        currentView={currentView}
        handleClick={handleClick}
        id="statistics"
        icon={<InsertChartIcon fontSize="large" />}
      />
    </div>
  );
};

export default ViewSelect;
