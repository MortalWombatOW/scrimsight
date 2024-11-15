import React from 'react';
import {Typography} from '@mui/material';
import {XAxisProps} from '../types/timeline.types';
import {useTimelineWindow} from '../hooks/useTimelineWindow';
import {
  XAxisContainer,
  XAxisMarker,
  WindowHandle,
  TimelineHorizontalLine,
  RoundSetupSection,
  RoundActiveSection,
  RoundLabel,
  EventMarker,
  WindowSection,
} from '../styles/timeline.styles';

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
      <TimelineHorizontalLine width={width} />
      <div style={{position: 'relative', height: '100%'}}>
        {roundTimes.map((round, index) => (
          <div key={index + '-round'}>
            <RoundSetupSection
              left={timeToX(round.roundStartTime)}
              width={timeToX(round.roundSetupCompleteTime) - timeToX(round.roundStartTime)}
            />
            <RoundActiveSection
              left={timeToX(round.roundSetupCompleteTime)}
              width={timeToX(round.roundEndTime) - timeToX(round.roundSetupCompleteTime)}
            />
            <RoundLabel left={timeToX(round.roundStartTime)} variant="body2">
              Round {index + 1}
            </RoundLabel>
          </div>
        ))}
        {eventTimes.map((time, index) => (
          <EventMarker key={index + '-time'} left={timeToX(time)} />
        ))}
        <WindowSection
          left={timeToX(innerWindowStartTime)}
          width={timeToX(innerWindowEndTime) - timeToX(innerWindowStartTime)}
        />
        <WindowHandle
          left={timeToX(innerWindowStartTime)}
          onMouseDown={(e) => handleMouseDown(e, 'start')}>
          {Math.round(windowStartTime)}
        </WindowHandle>
        <WindowHandle
          left={timeToX(innerWindowEndTime)}
          onMouseDown={(e) => handleMouseDown(e, 'end')}>
          {Math.round(windowEndTime)}
        </WindowHandle>
      </div>
    </XAxisContainer>
  );
}; 