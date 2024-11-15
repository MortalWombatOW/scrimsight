import React, { memo, useMemo } from 'react';
import { TimelineRowProps } from '../types/timeline.types';
import { TimelineEvent } from './TimelineEvent';
import { TimelineInteractionEvent } from './TimelineInteractionEvent';
import { UltimateBar } from './UltimateBar';
import { TimelineBase, TimelineLine, TimelineHorizontalLine } from '../styles/timeline.styles';
import {
  EVENT_TYPE_TO_COLOR,
  EVENT_TYPE_TO_ICON,
  INTERACTION_EVENT_TYPE_TO_COLOR,
  INTERACTION_EVENT_TYPE_TO_ICON,
} from '../constants/timeline.constants';

export const TimelineRow: React.FC<TimelineRowProps> = memo(({
  width,
  events,
  interactionEvents,
  ultimateEvents,
  timeToX,
  windowStartTime,
  windowEndTime,
}) => {
  const filteredEvents = useMemo(() =>
    events.filter(e => e.playerEventTime >= windowStartTime && e.playerEventTime <= windowEndTime),
    [events, windowStartTime, windowEndTime]
  );

  const filteredInteractionEvents = useMemo(() =>
    interactionEvents.filter(e => e.playerInteractionEventTime >= windowStartTime && e.playerInteractionEventTime <= windowEndTime),
    [interactionEvents, windowStartTime, windowEndTime]
  );

  const filteredUltimateEvents = useMemo(() =>
    ultimateEvents.filter(e => e.ultimateEndTime >= windowStartTime && e.ultimateChargedTime <= windowEndTime),
    [ultimateEvents, windowStartTime, windowEndTime]
  );

  return (
    <TimelineBase width={width}>
      <TimelineLine />
      <TimelineHorizontalLine width={width} />
      {filteredUltimateEvents.map((row, index) => (
        <UltimateBar
          key={index + '-ultimate'}
          startTime={row.ultimateStartTime}
          endTime={row.ultimateEndTime}
          chargedTime={row.ultimateChargedTime}
          timeToX={timeToX}
          windowStartTime={windowStartTime}
          windowEndTime={windowEndTime}
        />
      ))}
      {filteredEvents.map((row, index) => (
        <TimelineEvent
          key={index + '-event'}
          time={row.playerEventTime}
          timeToX={timeToX}
          color={EVENT_TYPE_TO_COLOR[row.playerEventType] || 'white'}
          icon={EVENT_TYPE_TO_ICON[row.playerEventType] || '?'}
          tooltipTitle={`${row.playerEventType}: ${row.playerHero}`}
        />
      ))}
      {filteredInteractionEvents.map((row, index) => (
        <TimelineInteractionEvent
          key={index + '-interaction'}
          time={row.playerInteractionEventTime}
          timeToX={timeToX}
          color={INTERACTION_EVENT_TYPE_TO_COLOR[row.playerInteractionEventType] || 'white'}
          icon={INTERACTION_EVENT_TYPE_TO_ICON[row.playerInteractionEventType] || '?'}
          tooltipTitle={`${row.playerInteractionEventType}: ${row.otherPlayerName}`}
        />
      ))}
    </TimelineBase>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.width === nextProps.width &&
    prevProps.windowStartTime === nextProps.windowStartTime &&
    prevProps.windowEndTime === nextProps.windowEndTime &&
    prevProps.events === nextProps.events &&
    prevProps.interactionEvents === nextProps.interactionEvents &&
    prevProps.ultimateEvents === nextProps.ultimateEvents
  );
});

TimelineRow.displayName = 'TimelineRow'; 