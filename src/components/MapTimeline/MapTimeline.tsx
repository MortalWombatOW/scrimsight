import React, { Suspense, useMemo, useState, useCallback } from 'react';
import { Container, Grid } from '@mui/material';
import { useTimelineData } from './hooks/useTimelineData';
import { useTimelineDimensions } from './hooks/useTimelineDimensions';
import { MapTimelineProps, TimelineData } from './types/timeline.types';
import { TimelineErrorBoundary } from './components/TimelineErrorBoundary';
import { TimelineSkeleton } from './components/TimelineSkeleton';
import { PixiWrapper } from './components/PixiWrapper';
import { PixiTimeline } from './components/PixiTimeline';
import { WindowHandle } from './styles/timeline.styles';
import { useTimelineWindow } from './hooks/useTimelineWindow';
import { TimelineRowConfig } from './types/row.types';
import { PlayerTimelineRow } from './components/rows/PlayerTimelineRow';
import { RoundTimelineRow } from './components/rows/RoundTimelineRow';
import { UltimateAdvantageRow } from './components/rows/UltimateAdvantageRow';
import { EventMapRow } from './components/rows/EventMapRow';
import { HeaderRow } from './components/rows/HeaderRow';
import { TimeLabelsRow } from './components/rows/TimeLabelsRow';

const getDefaultRowConfigs = (timelineData: TimelineData | null): TimelineRowConfig[] => {
  if (!timelineData) return [];

  const configs: TimelineRowConfig[] = [];

  // Add time labels row at the top (window scaled)
  configs.push({
    id: 'time-labels-top',
    type: 'timeLabels',
    height: 20,
    useWindowScale: true,
  });

  // Team 1 header and players
  configs.push({
    id: 'team1-header',
    type: 'header',
    height: 30,
    data: { text: timelineData.team1Name }
  });

  // Team 1 players
  Object.entries(timelineData.team1EventsByPlayer).forEach(([playerName]) => {
    configs.push({
      id: `team1-${playerName}`,
      type: 'player',
      height: 20,
      useWindowScale: true,
      data: {
        playerName,
        team: 'team1',
      }
    });
  });

  // Team 2 header and players
  configs.push({
    id: 'team2-header',
    type: 'header',
    height: 30,
    data: { text: timelineData.team2Name }
  });

  // Team 2 players
  Object.entries(timelineData.team2EventsByPlayer).forEach(([playerName]) => {
    configs.push({
      id: `team2-${playerName}`,
      type: 'player',
      height: 20,
      useWindowScale: true,
      data: {
        playerName,
        team: 'team2',
      }
    });
  });

  // Add bottom sections
  configs.push(
    {
      id: 'rounds',
      type: 'round',
      height: 30,
      useWindowScale: false,
    },
    {
      id: 'ultimateAdvantage',
      type: 'ultimateAdvantage',
      height: 60,
      useWindowScale: false,
    },
    {
      id: 'eventMap',
      type: 'eventMap',
      height: 10,
      useWindowScale: false,
    },
    // Add time labels row at the bottom (not window scaled)
    {
      id: 'time-labels-bottom',
      type: 'timeLabels',
      height: 20,
      useWindowScale: false,
    }
  );

  return configs;
};

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

  const [labelWidth, setLabelWidth] = useState(150);

  // Move row configs to state
  const [rowConfigs, setRowConfigs] = useState<TimelineRowConfig[]>([]);

  // Initialize row configs when timelineData changes
  React.useEffect(() => {
    setRowConfigs(getDefaultRowConfigs(timelineData));
  }, [timelineData]);

  const handleDeleteRow = useCallback((id: string) => {
    setRowConfigs(prev => prev.filter(config => config.id !== id));
  }, []);

  // Calculate total height
  const totalHeight = rowConfigs.reduce((sum, config) => sum + config.height, 0);

  const timelineWidth = (dimensions.width || 0) - labelWidth;

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
                  <PixiWrapper width={dimensions.width || 0} height={totalHeight}>
                    {rowConfigs.map((config, index) => {
                      const y = rowConfigs
                        .slice(0, index)
                        .reduce((sum, c) => sum + c.height, 0);

                      const commonProps = {
                        width: dimensions.width || 0,
                        height: config.height,
                        y,
                        dimensions,
                        labelWidth,
                        onLabelWidthChange: setLabelWidth,
                        onDelete: () => handleDeleteRow(config.id),
                      };

                      switch (config.type) {
                        case 'player':
                          const playerEvents = timelineData[`${config.data.team}EventsByPlayer`]?.[config.data.playerName] ?? [];
                          const playerInteractionEvents = timelineData[`${config.data.team}InteractionEventsByPlayer`]?.[config.data.playerName] ?? [];
                          const playerUltimateEvents = timelineData[`${config.data.team}UltimateEventsByPlayer`]?.[config.data.playerName] ?? [];

                          return (
                            <PlayerTimelineRow
                              key={config.id}
                              {...commonProps}
                              label={config.data.playerName}
                              playerName={config.data.playerName}
                              events={playerEvents}
                              interactionEvents={playerInteractionEvents}
                              ultimateEvents={playerUltimateEvents}
                              useWindowScale={config.useWindowScale}
                            />
                          );

                        case 'round':
                          return (
                            <RoundTimelineRow
                              key={config.id}
                              {...commonProps}
                              label="Rounds"
                              timelineData={timelineData}
                              useWindowScale={config.useWindowScale}
                            />
                          );

                        case 'ultimateAdvantage':
                          return (
                            <UltimateAdvantageRow
                              key={config.id}
                              {...commonProps}
                              label="Ultimate Advantage"
                              timelineData={timelineData}
                              useWindowScale={config.useWindowScale}
                            />
                          );

                        case 'eventMap':
                          return (
                            <EventMapRow
                              key={config.id}
                              {...commonProps}
                              label="Events"
                              timelineData={timelineData}
                              useWindowScale={config.useWindowScale}
                            />
                          );

                        case 'spacing':
                          return null;

                        case 'header':
                          return (
                            <HeaderRow
                              key={config.id}
                              {...commonProps}
                              label={config.data.text}
                              text={config.data.text}
                            />
                          );

                        case 'timeLabels':
                          return (
                            <TimeLabelsRow
                              key={config.id}
                              {...commonProps}
                              label=""
                              useWindowScale={config.useWindowScale}
                            />
                          );

                        default:
                          return null;
                      }
                    })}
                  </PixiWrapper>

                  {/* Window handles - updated positioning */}
                  <WindowHandle
                    style={{
                      left: `${dimensions.timeToX(dimensions.windowStartTime) * (timelineWidth / (dimensions.width || 1)) + labelWidth}px`,
                      top: `${totalHeight - 80}px`
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'start')}>
                    {Math.round(dimensions.windowStartTime)}
                  </WindowHandle>
                  <WindowHandle
                    style={{
                      left: `${dimensions.timeToX(dimensions.windowEndTime) * (timelineWidth / (dimensions.width || 1)) + labelWidth}px`,
                      top: `${totalHeight - 80}px`
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
