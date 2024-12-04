import {memo} from 'react';
import {Container, Graphics} from '@pixi/react';
import {Graphics as GraphicsType} from '@pixi/graphics';
import {TimelineRowProps} from '../types/timeline.types';
import {EVENT_TYPE_TO_COLOR, INTERACTION_EVENT_TYPE_TO_COLOR, COLORS} from '../constants/timeline.constants';

const drawCircle = (g: GraphicsType) => {
  g.clear();
  g.beginFill(0xffffff);
  g.drawCircle(0, 0, 3);
  g.endFill();
};

const drawUltimateBar = (g: GraphicsType, width: number) => {
  g.clear();
  g.beginFill(COLORS.ultimate.color.replace('#', '0x'));
  g.drawRect(0, -5, width, 10);
  g.endFill();
};

export const PixiTimelineRow = memo<TimelineRowProps>(({events, interactionEvents, ultimateEvents, timeToX, windowStartTime, windowEndTime}) => {
  return (
    <Container y={10}>
      {/* Regular events */}
      {events.map((event, i) => {
        const x = timeToX(event.playerEventTime as number);
        const visible = event.playerEventTime >= windowStartTime && event.playerEventTime <= windowEndTime;
        const color = parseInt(String(EVENT_TYPE_TO_COLOR[event.playerEventType]).replace('#', '0x'));

        return <Graphics key={`event-${i}`} draw={drawCircle} x={x} alpha={visible ? 1 : 0} tint={color} />;
      })}

      {/* Interaction events */}
      {interactionEvents.map((event, i) => {
        const x = timeToX(event.playerInteractionEventTime as number);
        const visible = event.playerInteractionEventTime >= windowStartTime && event.playerInteractionEventTime <= windowEndTime;
        const color = parseInt(String(INTERACTION_EVENT_TYPE_TO_COLOR[event.playerInteractionEventType]).replace('#', '0x'));

        return <Graphics key={`interaction-${i}`} draw={drawCircle} x={x} alpha={visible ? 1 : 0} tint={color} />;
      })}

      {/* Ultimate events */}
      {ultimateEvents.map((event, i) => {
        const x = timeToX(event.ultimateChargedTime);
        const width = timeToX(event.ultimateEndTime as number) - x;
        const visible = event.ultimateEndTime >= windowStartTime && event.ultimateChargedTime <= windowEndTime;

        return <Graphics key={`ultimate-${i}`} draw={(g) => drawUltimateBar(g, width)} x={x} alpha={visible ? 0.8 : 0} />;
      })}
    </Container>
  );
});

PixiTimelineRow.displayName = 'PixiTimelineRow';
