import { PlayerEvent, PlayerInteractionEvent, UltimateEvent } from '../types/timeline.types';
import { EVENT_TYPE_TO_COLOR, INTERACTION_EVENT_TYPE_TO_COLOR } from '../constants/timeline.constants';

interface TimelineEvent {
  time: number;
  type: string;
  text: string;
}

export const findNearestEvent = (
  time: number,
  events: PlayerEvent[],
  interactionEvents: PlayerInteractionEvent[],
  ultimateEvents: UltimateEvent[],
  threshold = 5 // seconds
): TimelineEvent | null => {
  const allEvents: TimelineEvent[] = [
    ...events.map(e => ({
      time: e.playerEventTime,
      type: e.playerEventType,
      text: `${e.playerEventType} (${e.playerHero})`
    })),
    ...interactionEvents.map(e => ({
      time: e.playerInteractionEventTime,
      type: e.playerInteractionEventType,
      text: `${e.playerInteractionEventType} ${e.otherPlayerName}`
    })),
    ...ultimateEvents.map(e => ({
      time: e.ultimateChargedTime,
      type: 'Ultimate Charged',
      text: 'Ultimate Charged'
    }))
  ];

  const nearest = allEvents.reduce((closest, event) => {
    const distance = Math.abs(event.time - time);
    if (distance < threshold && (!closest || distance < Math.abs(closest.time - time))) {
      return event;
    }
    return closest;
  }, null as TimelineEvent | null);

  return nearest;
};

export const formatEventText = (event: TimelineEvent): string => {
  return event.text;
}; 