import React from 'react';
import { Typography } from '@mui/material';
import { XAxisProps } from '../types/timeline.types';
import { useTimelineWindow } from '../hooks/useTimelineWindow';
import { XAxisContainer, WindowHandle } from '../styles/timeline.styles';
import { PixiWrapper } from './PixiWrapper';
import { PixiXAxis } from './PixiXAxis';

export const XAxis: React.FC<XAxisProps> = ({
  width,
  timeToX,
  xToTime,
  mapStartTime,
  mapEndTime,
  roundTimes,
  windowStartTime,
  setWindowStartTime,
  windowEndTime,
  setWindowEndTime,
  eventTimes,
  team1Name,
  team2Name,
  ultimateAdvantageData
}) => {
  const {
    innerWindowStartTime,
    innerWindowEndTime,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  } = useTimelineWindow({
    windowStartTime,
    windowEndTime,
    mapStartTime,
    mapEndTime,
    setWindowStartTime,
    setWindowEndTime,
    xToTime,
  });

  return (
    <XAxisContainer width={width} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <PixiWrapper width={width} height={100}>
        <PixiXAxis {...{
          width,
          timeToX,
          xToTime,
          mapStartTime,
          mapEndTime,
          roundTimes,
          windowStartTime,
          setWindowStartTime,
          windowEndTime,
          setWindowEndTime,
          eventTimes,
          team1Name,
          team2Name,
          ultimateAdvantageData
        }} />
      </PixiWrapper>

      {/* Window handles - kept in DOM for better interaction */}
      <WindowHandle
        style={{ left: `${timeToX(innerWindowStartTime)}px` }}
        onMouseDown={(e) => handleMouseDown(e, 'start')}>
        {Math.round(windowStartTime)}
      </WindowHandle>
      <WindowHandle
        style={{ left: `${timeToX(innerWindowEndTime)}px` }}
        onMouseDown={(e) => handleMouseDown(e, 'end')}>
        {Math.round(windowEndTime)}
      </WindowHandle>

      {/* Round labels - kept in DOM for text rendering */}
      {roundTimes.map((round, index) => (
        <Typography
          key={`round-${index}`}
          variant="body2"
          style={{
            position: 'absolute',
            left: timeToX(round.roundStartTime),
            top: 10,
            transform: 'translateX(-50%)'
          }}
        >
          Round {index + 1}
        </Typography>
      ))}
    </XAxisContainer>
  );
}; 