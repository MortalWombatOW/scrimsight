import React from 'react';
import {Grid, Typography, Button, Select, MenuItem} from '@mui/material';
import {getColorgorical} from '../../../lib/color';
import DraggableTimeWindow from './DraggableTimeWindow';

const KillVisualizations = ({kills, endTime}) => (
  <svg width="50px" height="500">
    {kills.map((kill, i) => (
      <rect
        key={kill.matchTime + i}
        y={`${(kill.matchTime / endTime) * 100}%`}
        x={0}
        width={50}
        height={2}
        fill={getColorgorical(kill.team)}
      />
    ))}
  </svg>
);

function TimelineControls({
  startTimeFilter,
  endTime,
  endTimeFilter,
  setStartTimeFilter,
  setEndTimeFilter,
  kills,
}: {
  startTimeFilter: number;
  endTime: number | null;
  endTimeFilter: number;
  setStartTimeFilter: (startTimeFilter: number) => void;
  setEndTimeFilter: (endTimeFilter: number) => void;
  kills: any[];
}) {
  return (
    <div style={{position: 'relative', maxWidth: '200px'}}>
      <DraggableTimeWindow
        startTimeFilter={startTimeFilter}
        setStartTimeFilter={setStartTimeFilter}
        endTime={endTime}
        endTimeFilter={endTimeFilter}
        setEndTimeFilter={setEndTimeFilter}
      />
      <KillVisualizations kills={kills} endTime={endTime} />
    </div>
  );
}

export default TimelineControls;
