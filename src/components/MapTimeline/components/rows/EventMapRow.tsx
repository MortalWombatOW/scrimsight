import {memo} from 'react';
import {Graphics} from '@pixi/react';
import {TimelineRowProps} from '../../types/row.types';
import {BaseTimelineRow} from './BaseTimelineRow';

export const EventMapRow = memo<TimelineRowProps>(({width, height, y, timelineData, dimensions, useWindowScale = false, label = 'Events', labelWidth, onLabelWidthChange, onDelete}) => {
  if (!dimensions || !timelineData) return null;

  const timeToX = useWindowScale ? dimensions.timeToXWindow : dimensions.timeToX;

  return (
    <BaseTimelineRow width={width} height={height} y={y} dimensions={dimensions} useWindowScale={useWindowScale} label={label} labelWidth={labelWidth} onLabelWidthChange={onLabelWidthChange} onDelete={onDelete}>
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xffffff, 0.2);
          timelineData.eventTimes.forEach((time) => {
            g.drawRect(timeToX(time), 0, 1, height);
          });
          g.endFill();
        }}
      />
    </BaseTimelineRow>
  );
});

EventMapRow.displayName = 'EventMapRow';
