import { useState, useCallback } from 'react';
import { FederatedPointerEvent } from '@pixi/events';
import { findNearestEvent, formatEventText } from '../utils/eventUtils';
import { PlayerEvent, PlayerInteractionEvent, UltimateEvent } from '../types/timeline.types';

interface HoverEvent {
  x: number;
  y: number;
  text: string;
}

export const useHoverEvent = () => {
  const [hoverEvent, setHoverEvent] = useState<HoverEvent | null>(null);

  const handleMouseMove = useCallback((
    e: FederatedPointerEvent,
    events: PlayerEvent[],
    interactionEvents: PlayerInteractionEvent[],
    ultimateEvents: UltimateEvent[],
    timeToX: (t: number) => number,
    xToTime: (x: number) => number
  ) => {
    const localX = e.getLocalPosition(e.currentTarget as any).x;
    const time = xToTime(localX);
    const nearestEvent = findNearestEvent(time, events, interactionEvents, ultimateEvents);
    if (nearestEvent) {
      setHoverEvent({
        x: timeToX(nearestEvent.time),
        y: 10,
        text: formatEventText(nearestEvent)
      });
    } else {
      setHoverEvent(null);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    setHoverEvent(null);
  }, []);

  return { hoverEvent, handleMouseMove, handleMouseOut };
}; 