import React, { memo } from 'react';
import { Grid, Typography } from '@mui/material';
import { PixiWrapper } from './PixiWrapper';
import { PixiTimelineRow } from './PixiTimelineRow';
import { PixiXAxis } from './PixiXAxis';
import { TimelineData, TimelineDimensions, PlayerEvent } from '../types/timeline.types';
import { TimelineContainer, PlayerNameCell } from '../styles/timeline.styles';
import { WindowHandle } from '../styles/timeline.styles';

interface PixiMapTimelineProps {
  width: number;
  height: number;
  timelineData: TimelineData;
  dimensions: TimelineDimensions;
}

export const PixiMapTimeline = memo<PixiMapTimelineProps>(({
  width,
  height,
  timelineData,
  dimensions
}) => {
  return (
    <Grid container spacing={1}>
      {/* Team 1 */}
      <Grid item xs={12}>
        <Typography variant="h4">{timelineData.team1Name}</Typography>
        {Object.entries(timelineData.team1EventsByPlayer).map(([playerName, events]: [string, PlayerEvent[]]) => (
          <TimelineContainer container key={playerName} spacing={1}>
            <PlayerNameCell item xs={2}>
              <Typography variant="h6">{playerName}</Typography>
            </PlayerNameCell>
            <Grid item xs={10}>
              <PixiWrapper width={width} height={20}>
                <PixiTimelineRow
                  width={width}
                  events={events}
                  interactionEvents={timelineData.team1InteractionEventsByPlayer[playerName] || []}
                  ultimateEvents={timelineData.team1UltimateEventsByPlayer[playerName] || []}
                  timeToX={dimensions.timeToXWindow}
                  windowStartTime={dimensions.windowStartTime}
                  windowEndTime={dimensions.windowEndTime}
                />
              </PixiWrapper>
            </Grid>
          </TimelineContainer>
        ))}
      </Grid>

      {/* Team 2 */}
      <Grid item xs={12}>
        <Typography variant="h4">{timelineData.team2Name}</Typography>
        {Object.entries(timelineData.team2EventsByPlayer).map(([playerName, events]: [string, PlayerEvent[]]) => (
          <TimelineContainer container key={playerName} spacing={1}>
            <PlayerNameCell item xs={2}>
              <Typography variant="h6">{playerName}</Typography>
            </PlayerNameCell>
            <Grid item xs={10}>
              <PixiWrapper width={width} height={20}>
                <PixiTimelineRow
                  width={width}
                  events={events}
                  interactionEvents={timelineData.team2InteractionEventsByPlayer[playerName] || []}
                  ultimateEvents={timelineData.team2UltimateEventsByPlayer[playerName] || []}
                  timeToX={dimensions.timeToXWindow}
                  windowStartTime={dimensions.windowStartTime}
                  windowEndTime={dimensions.windowEndTime}
                />
              </PixiWrapper>
            </Grid>
          </TimelineContainer>
        ))}
      </Grid>

      {/* X Axis with window handles */}
      <Grid item xs={12} style={{ position: 'relative' }}>
        <PixiWrapper width={width} height={100}>
          <PixiXAxis
            width={width}
            timeToX={dimensions.timeToX}
            xToTime={dimensions.xToTime}
            mapStartTime={timelineData.mapStartTime}
            mapEndTime={timelineData.mapEndTime}
            roundTimes={timelineData.roundTimes}
            windowStartTime={dimensions.windowStartTime}
            setWindowStartTime={dimensions.setWindowStartTime}
            windowEndTime={dimensions.windowEndTime}
            setWindowEndTime={dimensions.setWindowEndTime}
            eventTimes={timelineData.eventTimes}
            team1Name={timelineData.team1Name}
            team2Name={timelineData.team2Name}
            ultimateAdvantageData={timelineData.ultimateAdvantageData}
          />
        </PixiWrapper>
        <WindowHandle
          style={{ left: `${dimensions.timeToX(dimensions.windowStartTime)}px` }}
          onMouseDown={(e) => dimensions.handleMouseDown?.(e, 'start')}>
          {Math.round(dimensions.windowStartTime)}
        </WindowHandle>
        <WindowHandle
          style={{ left: `${dimensions.timeToX(dimensions.windowEndTime)}px` }}
          onMouseDown={(e) => dimensions.handleMouseDown?.(e, 'end')}>
          {Math.round(dimensions.windowEndTime)}
        </WindowHandle>
      </Grid>
    </Grid>
  );
});

PixiMapTimeline.displayName = 'PixiMapTimeline'; 