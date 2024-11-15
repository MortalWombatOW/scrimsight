import React, { memo, useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { TimelineRow } from './TimelineRow';
import { PlayerEvent, PlayerInteractionEvent, UltimateEvent } from '../types/timeline.types';
import { TimelineContainer, PlayerNameCell } from '../styles/timeline.styles';

interface TeamTimelineProps {
  teamName: string;
  width: number;
  eventsByPlayer: { [playerName: string]: PlayerEvent[] };
  interactionEventsByPlayer: { [playerName: string]: PlayerInteractionEvent[] };
  ultimateEventsByPlayer: { [playerName: string]: UltimateEvent[] };
  timeToX: (time: number) => number;
  windowStartTime: number;
  windowEndTime: number;
}

export const TeamTimeline: React.FC<TeamTimelineProps> = memo(({
  teamName,
  width,
  eventsByPlayer,
  interactionEventsByPlayer,
  ultimateEventsByPlayer,
  timeToX,
  windowStartTime,
  windowEndTime,
}) => {
  const playerRows = useMemo(() =>
    Object.entries(eventsByPlayer).map(([playerName, events]) => (
      <TimelineContainer container key={playerName} spacing={1}>
        <PlayerNameCell item xs={2}>
          <Typography variant="h6">{playerName}</Typography>
        </PlayerNameCell>
        <Grid item xs={10}>
          <TimelineRow
            width={width}
            events={events}
            interactionEvents={interactionEventsByPlayer[playerName] || []}
            ultimateEvents={ultimateEventsByPlayer[playerName] || []}
            windowStartTime={windowStartTime}
            windowEndTime={windowEndTime}
            timeToX={timeToX}
          />
        </Grid>
      </TimelineContainer>
    )),
    [eventsByPlayer, interactionEventsByPlayer, ultimateEventsByPlayer, width, windowStartTime, windowEndTime, timeToX]
  );

  return (
    <div>
      <Typography variant="h4">{teamName}</Typography>
      {playerRows}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.width === nextProps.width &&
    prevProps.windowStartTime === nextProps.windowStartTime &&
    prevProps.windowEndTime === nextProps.windowEndTime &&
    prevProps.teamName === nextProps.teamName &&
    Object.keys(prevProps.eventsByPlayer).length === Object.keys(nextProps.eventsByPlayer).length
  );
});

TeamTimeline.displayName = 'TeamTimeline'; 