import React, { Suspense } from 'react';
import { Container, Grid } from '@mui/material';
import { useTimelineData } from './hooks/useTimelineData';
import { useTimelineDimensions } from './hooks/useTimelineDimensions';
import { MapTimelineProps } from './types/timeline.types';
import { TimelineErrorBoundary } from './components/TimelineErrorBoundary';
import { TimelineSkeleton } from './components/TimelineSkeleton';
import { PixiWrapper } from './components/PixiWrapper';
import { PixiTimeline } from './components/PixiTimeline';
import { WindowHandle } from './styles/timeline.styles';
import { useTimelineWindow } from './hooks/useTimelineWindow';

const MapTimeline: React.FC<MapTimelineProps> = ({ mapId }) => {
  const timelineData = useTimelineData(mapId);
  const dimensions = useTimelineDimensions(
    timelineData?.mapStartTime ?? 0,
    timelineData?.mapEndTime ?? 100
  );

  const { handleMouseDown, handleMouseUp, handleMouseMove } = useTimelineWindow({
    windowStartTime: dimensions.windowStartTime,
    windowEndTime: dimensions.windowEndTime,
    mapStartTime: timelineData?.mapStartTime ?? 0,
    mapEndTime: timelineData?.mapEndTime ?? 100,
    setWindowStartTime: dimensions.setWindowStartTime,
    setWindowEndTime: dimensions.setWindowEndTime,
    xToTime: dimensions.xToTime,
  });

  // Calculate layout dimensions
  const rowHeight = 20;
  const team1PlayerCount = timelineData ? Object.keys(timelineData.team1EventsByPlayer).length : 0;
  const team2PlayerCount = timelineData ? Object.keys(timelineData.team2EventsByPlayer).length : 0;
  const xAxisHeight = 100;
  const padding = 20;
  const totalHeight = (team1PlayerCount + team2PlayerCount) * rowHeight + xAxisHeight + (padding * 3);

  return (
    <TimelineErrorBoundary>
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xs={12} ref={dimensions.gridRef}>
            {!timelineData || !dimensions.width ? (
              <TimelineSkeleton />
            ) : (
              <Suspense fallback={<TimelineSkeleton />}>
                <div
                  style={{ position: 'relative' }}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseUp}
                >
                  {/* PIXI Canvas */}
                  <PixiWrapper width={dimensions.width} height={totalHeight}>
                    <PixiTimeline
                      width={dimensions.width}
                      height={totalHeight}
                      timelineData={timelineData}
                      dimensions={dimensions}
                    />
                  </PixiWrapper>

                  {/* Window handles - rendered outside canvas for interaction */}
                  <WindowHandle
                    style={{
                      left: `${dimensions.timeToX(dimensions.windowStartTime)}px`,
                      top: `${totalHeight - xAxisHeight + 20}px`
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'start')}>
                    {Math.round(dimensions.windowStartTime)}
                  </WindowHandle>
                  <WindowHandle
                    style={{
                      left: `${dimensions.timeToX(dimensions.windowEndTime)}px`,
                      top: `${totalHeight - xAxisHeight + 20}px`
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'end')}>
                    {Math.round(dimensions.windowEndTime)}
                  </WindowHandle>
                </div>
              </Suspense>
            )}
          </Grid>
        </Grid>
      </Container>
    </TimelineErrorBoundary>
  );
};

export default MapTimeline;
