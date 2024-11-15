import React, {memo, useMemo} from 'react';
import {Typography} from '@mui/material';
import {PlayerEvent} from '../types/timeline.types';
import {RecentEventsContainer, EventsList, EventListItem} from '../styles/timeline.styles';

interface RecentEventsProps {
  events: PlayerEvent[];
  windowStartTime: number;
  windowEndTime: number;
}

export const RecentEvents: React.FC<RecentEventsProps> = memo(({events, windowStartTime, windowEndTime}) => {
  const eventsToShow = useMemo(
    () =>
      events
        .filter((event) => event.playerEventTime >= windowStartTime && event.playerEventTime <= windowEndTime)
        .slice(0, 10),
    [events, windowStartTime, windowEndTime]
  );

  return (
    <RecentEventsContainer>
      <Typography variant="h6">Recent Events:</Typography>
      <EventsList>
        {eventsToShow.map((event, index) => (
          <EventListItem key={index}>
            {event.playerEventTime}: {event.playerEventType} - {event.playerName} ({event.playerHero})
          </EventListItem>
        ))}
      </EventsList>
    </RecentEventsContainer>
  );
});

RecentEvents.displayName = 'RecentEvents'; 