import React, { Suspense } from 'react';
import { Container, Grid } from '@mui/material';
import { XAxis } from './components/XAxis';
import { TeamTimeline } from './components/TeamTimeline';
import { RecentEvents } from './components/RecentEvents';
import { useTimelineData } from './hooks/useTimelineData';
import { useTimelineDimensions } from './hooks/useTimelineDimensions';
import { MapTimelineProps } from './types/timeline.types';
import { TimelineErrorBoundary } from './components/TimelineErrorBoundary';
import { TimelineSkeleton } from './components/TimelineSkeleton';

const MapTimeline: React.FC<MapTimelineProps> = ({ mapId }) => {
  const timelineData = useTimelineData(mapId);
  const dimensions = useTimelineDimensions(
    timelineData?.mapStartTime ?? 0,
    timelineData?.mapEndTime ?? 100
  );

  console.log('Timeline data:', timelineData);
  console.log('Dimensions:', dimensions);

  // Render the container with ref regardless of data status
  return (
    <TimelineErrorBoundary>
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xs={12} ref={dimensions.gridRef}>
            {!timelineData || !dimensions.width ? (
              <TimelineSkeleton />
            ) : (
              <Suspense fallback={<TimelineSkeleton />}>
                <TeamTimeline
                  teamName={timelineData.team1Name}
                  width={dimensions.width}
                  eventsByPlayer={timelineData.team1EventsByPlayer}
                  interactionEventsByPlayer={timelineData.team1InteractionEventsByPlayer}
                  ultimateEventsByPlayer={timelineData.team1UltimateEventsByPlayer}
                  timeToX={dimensions.timeToXWindow}
                  windowStartTime={dimensions.windowStartTime}
                  windowEndTime={dimensions.windowEndTime}
                />
                <TeamTimeline
                  teamName={timelineData.team2Name}
                  width={dimensions.width}
                  eventsByPlayer={timelineData.team2EventsByPlayer}
                  interactionEventsByPlayer={timelineData.team2InteractionEventsByPlayer}
                  ultimateEventsByPlayer={timelineData.team2UltimateEventsByPlayer}
                  timeToX={dimensions.timeToXWindow}
                  windowStartTime={dimensions.windowStartTime}
                  windowEndTime={dimensions.windowEndTime}
                />
                <Grid container spacing={1}>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={10}>
                    <XAxis
                      width={dimensions.width}
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
                  </Grid>
                </Grid>
                <RecentEvents
                  events={[...Object.values(timelineData.team1EventsByPlayer), ...Object.values(timelineData.team2EventsByPlayer)].flat()}
                  windowStartTime={dimensions.windowStartTime}
                  windowEndTime={dimensions.windowEndTime}
                />
              </Suspense>
            )}
          </Grid>
        </Grid>
      </Container>
    </TimelineErrorBoundary>
  );
};

export default MapTimeline;
