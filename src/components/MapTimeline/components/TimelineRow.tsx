import React, { memo, useRef, useEffect } from 'react';
import { TimelineRowProps } from '../types/timeline.types';
import { TimelineBase } from '../styles/timeline.styles';
import {
  EVENT_TYPE_TO_COLOR,
  INTERACTION_EVENT_TYPE_TO_COLOR,
  COLORS,
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
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number>();
  const positionsRef = useRef<{ [key: string]: number }>({});

  // Update positions using requestAnimationFrame
  useEffect(() => {
    const updatePositions = () => {
      if (!svgRef.current) return;

      let needsUpdate = false;

      // Update all elements through SVG transforms
      events.forEach((event, index) => {
        const targetX = timeToX(event.playerEventTime);
        const key = `event-${index}`;
        const currentX = positionsRef.current[key] || targetX;

        const dx = (targetX - currentX) * 0.3;
        if (Math.abs(dx) > 0.1) {
          positionsRef.current[key] = currentX + dx;
          needsUpdate = true;
        } else {
          positionsRef.current[key] = targetX;
        }

        const element = svgRef.current?.getElementById(key);
        if (element) {
          const visible = event.playerEventTime >= windowStartTime &&
            event.playerEventTime <= windowEndTime;
          element.setAttribute('transform', `translate(${positionsRef.current[key]}, 0) scale(${visible ? 1 : 0})`);
        }
      });

      // Similar updates for interaction events and ultimate events
      if (needsUpdate) {
        animationFrameRef.current = requestAnimationFrame(updatePositions);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updatePositions);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [events, interactionEvents, ultimateEvents, timeToX, windowStartTime, windowEndTime]);

  return (
    <TimelineBase width={width}>
      <svg ref={svgRef} width={width} height={20}>
        {/* Regular events */}
        {events.map((event, index) => (
          <circle
            key={`event-${index}`}
            id={`event-${index}`}
            r={3}
            cy={10}
            fill={EVENT_TYPE_TO_COLOR[event.playerEventType]}
            transform={`translate(${timeToX(event.playerEventTime)}, 0)`}
          >
            <title>{`${event.playerEventType}: ${event.playerHero}`}</title>
          </circle>
        ))}

        {/* Interaction events */}
        {interactionEvents.map((event, index) => (
          <circle
            key={`interaction-${index}`}
            id={`interaction-${index}`}
            r={3}
            cy={10}
            fill={INTERACTION_EVENT_TYPE_TO_COLOR[event.playerInteractionEventType]}
            transform={`translate(${timeToX(event.playerInteractionEventTime)}, 0)`}
          >
            <title>{`${event.playerInteractionEventType}: ${event.otherPlayerName}`}</title>
          </circle>
        ))}

        {/* Ultimate events */}
        {ultimateEvents.map((event, index) => (
          <g
            key={`ultimate-${index}`}
            id={`ultimate-${index}`}
            transform={`translate(${timeToX(event.ultimateChargedTime)}, 0)`}
          >
            <rect
              x={0}
              y={5}
              width={timeToX(event.ultimateEndTime) - timeToX(event.ultimateChargedTime)}
              height={10}
              fill={COLORS.ultimate}
              opacity={0.8}
            >
              <title>Ultimate</title>
            </rect>
          </g>
        ))}
      </svg>
    </TimelineBase>
  );
});

TimelineRow.displayName = 'TimelineRow'; 