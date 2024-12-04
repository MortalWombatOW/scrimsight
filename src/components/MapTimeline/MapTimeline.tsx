import React, {Suspense, useState, useCallback} from 'react';
import {Container, Grid} from '@mui/material';
import {useTimelineData} from './hooks/useTimelineData';
import {useTimelineDimensions} from './hooks/useTimelineDimensions';
import {MapTimelineProps, TimelineData} from './types/timeline.types';
import {TimelineErrorBoundary} from './components/TimelineErrorBoundary';
import {TimelineSkeleton} from './components/TimelineSkeleton';
import {PixiWrapper} from './components/PixiWrapper';
import {WindowHandle} from './components/styles/timeline.styles';
import {useTimelineWindow} from './hooks/useTimelineWindow';
import {TimelineRowConfig} from './types/row.types';
import {PlayerTimelineRow} from './components/rows/PlayerTimelineRow';
import {RoundTimelineRow} from './components/rows/RoundTimelineRow';
import {EventMapRow} from './components/rows/EventMapRow';
import {HeaderRow} from './components/rows/HeaderRow';
import {TimeLabelsRow} from './components/rows/TimeLabelsRow';
import {TeamAdvantageRow} from './components/rows/TeamAdvantageRow';

const getDefaultRowConfigs = (timelineData: TimelineData | null): TimelineRowConfig[] => {
  if (!timelineData) return [];

  const configs: TimelineRowConfig[] = [];

  // Add time labels row at the top (window scaled)
  configs.push({
    id: 'time-labels-top',
    type: 'timeLabels',
    height: 20,
    useWindowScale: true,
    data: {type: 'timeLabels'},
  });

  // Team 1 header and players
  configs.push({
    id: 'team1-header',
    type: 'header',
    height: 30,
    data: {
      type: 'header',
      text: timelineData.team1Name,
    },
  });

  // Team 1 players
  Object.entries(timelineData.team1EventsByPlayer).forEach(([playerName]) => {
    configs.push({
      id: `team1-${playerName}`,
      type: 'player',
      height: 20,
      useWindowScale: true,
      data: {
        type: 'player',
        playerName,
        team: 'team1',
      },
    });
  });

  // Team 2 header and players
  configs.push({
    id: 'team2-header',
    type: 'header',
    height: 30,
    data: {
      type: 'header',
      text: timelineData.team2Name,
    },
  });

  // Team 2 players
  Object.entries(timelineData.team2EventsByPlayer).forEach(([playerName]) => {
    configs.push({
      id: `team2-${playerName}`,
      type: 'player',
      height: 20,
      useWindowScale: true,
      data: {
        type: 'player',
        playerName,
        team: 'team2',
      },
    });
  });

  // Add bottom sections
  configs.push(
    {
      id: 'rounds',
      type: 'round',
      height: 30,
      useWindowScale: false,
      data: {type: 'round'},
    },
    {
      id: 'ultimateAdvantage',
      type: 'teamAdvantage',
      height: 60,
      useWindowScale: false,
      data: {
        type: 'teamAdvantage',
        values: timelineData.ultimateAdvantageData,
        fieldNames: {
          team1Count: 'team1ChargedUltimateCount',
          team2Count: 'team2ChargedUltimateCount',
        },
        label: 'Ultimate Advantage',
      },
    },
    {
      id: 'aliveAdvantage',
      type: 'teamAdvantage',
      height: 60,
      useWindowScale: false,
      data: {
        type: 'teamAdvantage',
        values: timelineData.aliveAdvantageData,
        fieldNames: {
          team1Count: 'team1AliveCount',
          team2Count: 'team2AliveCount',
        },
        label: 'Player Advantage',
      },
    },
    {
      id: 'eventMap',
      type: 'eventMap',
      height: 10,
      useWindowScale: false,
      data: {type: 'eventMap'},
    },
    {
      id: 'time-labels-bottom',
      type: 'timeLabels',
      height: 20,
      useWindowScale: false,
      data: {type: 'timeLabels'},
    },
  );

  return configs;
};

const MapTimeline: React.FC<MapTimelineProps> = ({mapId}) => {
  const timelineData = useTimelineData(mapId);
  const dimensions = useTimelineDimensions(timelineData?.mapStartTime ?? 0, timelineData?.mapEndTime ?? 100);

  const {handleMouseDown, handleMouseUp, handleMouseMove} = useTimelineWindow({
    windowStartTime: dimensions.windowStartTime,
    windowEndTime: dimensions.windowEndTime,
    mapStartTime: timelineData?.mapStartTime ?? 0,
    mapEndTime: timelineData?.mapEndTime ?? 100,
    setWindowStartTime: dimensions.setWindowStartTime,
    setWindowEndTime: dimensions.setWindowEndTime,
    xToTime: dimensions.xToTime,
  });

  const [labelWidth, setLabelWidth] = useState(150);
  const [rowConfigs, setRowConfigs] = useState<TimelineRowConfig[]>([]);

  // Initialize row configs when timelineData changes
  React.useEffect(() => {
    if (timelineData) {
      setRowConfigs(getDefaultRowConfigs(timelineData));
    }
  }, [timelineData]);

  const handleDeleteRow = useCallback((id: string) => {
    setRowConfigs((prev) => prev.filter((config) => config.id !== id));
  }, []);

  // Calculate total height
  const totalHeight = rowConfigs.reduce((sum, config) => sum + config.height, 0);

  // Calculate timeline width
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
                <div style={{position: 'relative'}} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseUp}>
                  <PixiWrapper width={dimensions.width || 0} height={totalHeight}>
                    {rowConfigs.map((config, index) => {
                      const y = rowConfigs.slice(0, index).reduce((sum, c) => sum + c.height, 0);

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
                          if (config.data.type !== 'player') break;
                          return (
                            <PlayerTimelineRow
                              key={config.id}
                              {...commonProps}
                              label={config.data.playerName}
                              playerName={config.data.playerName}
                              events={(timelineData[`${config.data.team}EventsByPlayer` as keyof TimelineData] as Record<string, unknown[]>)?.[config.data.playerName] ?? []}
                              interactionEvents={(timelineData[`${config.data.team}InteractionEventsByPlayer` as keyof TimelineData] as Record<string, unknown[]>)?.[config.data.playerName] ?? []}
                              ultimateEvents={(timelineData[`${config.data.team}UltimateEventsByPlayer` as keyof TimelineData] as Record<string, unknown[]>)?.[config.data.playerName] ?? []}
                              useWindowScale={config.useWindowScale}
                            />
                          );

                        case 'round':
                          return <RoundTimelineRow key={config.id} {...commonProps} label="Rounds" timelineData={timelineData} useWindowScale={config.useWindowScale} />;

                        case 'teamAdvantage':
                          if (config.data.type !== 'teamAdvantage') break;
                          return <TeamAdvantageRow key={config.id} {...commonProps} data={config.data.values} fieldNames={config.data.fieldNames} label={config.data.label} useWindowScale={config.useWindowScale} />;

                        case 'eventMap':
                          return <EventMapRow key={config.id} {...commonProps} label="Events" timelineData={timelineData} useWindowScale={config.useWindowScale} />;

                        case 'spacing':
                          return null;

                        case 'header':
                          if (config.data.type !== 'header') break;
                          return <HeaderRow key={config.id} {...commonProps} label={config.data.text} text={config.data.text} />;

                        case 'timeLabels':
                          return <TimeLabelsRow key={config.id} {...commonProps} label="" useWindowScale={config.useWindowScale} />;

                        default:
                          return null;
                      }
                    })}
                  </PixiWrapper>

                  {/* Window handles - updated positioning */}
                  <WindowHandle
                    style={{
                      left: `${dimensions.timeToX(dimensions.windowStartTime) * (timelineWidth / (dimensions.width || 1)) + labelWidth}px`,
                      top: `${totalHeight - 80}px`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'start')}>
                    {Math.round(dimensions.windowStartTime)}
                  </WindowHandle>
                  <WindowHandle
                    style={{
                      left: `${dimensions.timeToX(dimensions.windowEndTime) * (timelineWidth / (dimensions.width || 1)) + labelWidth}px`,
                      top: `${totalHeight - 80}px`,
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
