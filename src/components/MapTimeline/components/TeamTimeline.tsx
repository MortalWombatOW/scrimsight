import React, { memo, useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { PixiTimelineRow } from './PixiTimelineRow';
import { PixiWrapper } from './PixiWrapper';
import { TimelineContainer, PlayerNameCell } from '../styles/timeline.styles';
import { PlayerEvent, PlayerInteractionEvent, UltimateEvent } from '../types/timeline.types';

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
          <PixiWrapper width={width} height={20}>
            <PixiTimelineRow
              width={width}
              events={events}
              interactionEvents={interactionEventsByPlayer[playerName] || []}
              ultimateEvents={ultimateEventsByPlayer[playerName] || []}
              windowStartTime={windowStartTime}
              windowEndTime={windowEndTime}
              timeToX={timeToX}
            />
          </PixiWrapper>
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
});

TeamTimeline.displayName = 'TeamTimeline'; 