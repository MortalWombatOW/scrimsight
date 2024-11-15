import React, {memo} from 'react';
import {TimelineRowProps} from '../types/timeline.types';
import {TimelineEvent} from './TimelineEvent';
import {TimelineInteractionEvent} from './TimelineInteractionEvent';
import {UltimateBar} from './UltimateBar';
import {TimelineBase, TimelineLine, TimelineHorizontalLine} from '../styles/timeline.styles';
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
}) => (
  <TimelineBase width={width}>
    <TimelineLine />
    <TimelineHorizontalLine width={width} />
    {ultimateEvents
      .filter((row) => row.ultimateEndTime >= windowStartTime && row.ultimateChargedTime <= windowEndTime)
      .map((row, index) => (
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
    {events
      .filter((row) => row.playerEventTime >= windowStartTime && row.playerEventTime <= windowEndTime)
      .map((row, index) => (
        <TimelineEvent
          key={index + '-event'}
          time={row.playerEventTime}
          timeToX={timeToX}
          color={EVENT_TYPE_TO_COLOR[row.playerEventType] || 'white'}
          icon={EVENT_TYPE_TO_ICON[row.playerEventType] || '?'}
          tooltipTitle={`${row.playerEventType}: ${row.playerHero}`}
        />
      ))}
    {interactionEvents
      .filter((row) => row.playerInteractionEventTime >= windowStartTime && row.playerInteractionEventTime <= windowEndTime)
      .map((row, index) => (
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
));

TimelineRow.displayName = 'TimelineRow'; 