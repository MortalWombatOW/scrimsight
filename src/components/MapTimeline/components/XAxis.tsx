import React from 'react';
import { Typography } from '@mui/material';
import { XAxisProps } from '../types/timeline.types';
import { useTimelineWindow } from '../hooks/useTimelineWindow';
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
import { UltimateAdvantageChart } from './UltimateAdvantageChart';

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
      <UltimateAdvantageChart
        width={width}
        timeToX={timeToX}
        windowStartTime={windowStartTime}
        windowEndTime={windowEndTime}
        team1Name={team1Name}
        team2Name={team2Name}
        ultimateAdvantageData={ultimateAdvantageData}
      />
      <TimelineHorizontalLine width={width} />
      <div style={{ position: 'relative', height: '100%' }}>
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
          style={{ left: `${timeToX(innerWindowStartTime)}px` }}
          onMouseDown={(e) => handleMouseDown(e, 'start')}>
          {Math.round(windowStartTime)}
        </WindowHandle>
        <WindowHandle
          style={{ left: `${timeToX(innerWindowEndTime)}px` }}
          onMouseDown={(e) => handleMouseDown(e, 'end')}>
          {Math.round(windowEndTime)}
        </WindowHandle>
      </div>
    </XAxisContainer>
  );
}; 