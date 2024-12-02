import {Graphics} from '@pixi/graphics';
import {EVENT_TYPE_TO_COLOR, INTERACTION_EVENT_TYPE_TO_COLOR, COLORS} from '../constants/timeline.constants';
import {PlayerEvent, PlayerInteractionEvent, UltimateEvent} from '../types/timeline.types';

const parseColor = (colorStr: string) => parseInt(colorStr.replace('#', '0x'));

export const drawPlayerRow = (g: Graphics, events: PlayerEvent[], interactionEvents: PlayerInteractionEvent[], ultimateEvents: UltimateEvent[], timeToX: (t: number) => number, centerY: number, timelineWidth: number) => {
  g.clear();

  // Draw ultimate bars first (background)
  ultimateEvents.forEach((event) => {
    const startX = timeToX(event.ultimateChargedTime);
    const endX = timeToX(event.ultimateEndTime);
    const width = Math.min(endX - startX, timelineWidth - startX);

    if (width > 0 && startX < timelineWidth) {
      // Charging bar
      g.beginFill(parseColor(COLORS.ultimate.color), COLORS.ultimate.alpha * 0.6);
      g.drawRect(startX, centerY - 5, width, 10);

      // Active bar
      if (event.ultimateStartTime) {
        const activeStartX = timeToX(event.ultimateStartTime);
        const activeWidth = Math.min(endX - activeStartX, timelineWidth - activeStartX);
        if (activeWidth > 0 && activeStartX < timelineWidth) {
          g.beginFill(parseColor(COLORS.ultimate.color), COLORS.ultimate.alpha);
          g.drawRect(activeStartX, centerY - 5, activeWidth, 10);
        }
      }
    }
  });

  // Draw regular events
  events.forEach((event) => {
    const x = timeToX(event.playerEventTime);
    if (x >= 0 && x <= timelineWidth) {
      const colorConfig = EVENT_TYPE_TO_COLOR[event.playerEventType];
      if (colorConfig) {
        g.beginFill(parseColor(colorConfig.color), colorConfig.alpha);
        g.drawCircle(x, centerY, 3);
      }
    }
  });

  // Draw interaction events
  interactionEvents.forEach((event) => {
    const x = timeToX(event.playerInteractionEventTime);
    if (x >= 0 && x <= timelineWidth) {
      const colorConfig = INTERACTION_EVENT_TYPE_TO_COLOR[event.playerInteractionEventType];
      if (colorConfig) {
        g.beginFill(parseColor(colorConfig.color), colorConfig.alpha);
        g.drawCircle(x, centerY, 3);
      }
    }
  });

  g.endFill();
};
