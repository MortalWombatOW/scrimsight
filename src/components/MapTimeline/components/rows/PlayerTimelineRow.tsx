import {memo, useState} from 'react';
import {Text, Graphics} from '@pixi/react';
import {PlayerTimelineRowProps} from '../../types/row.types';
import {BaseTimelineRow} from './BaseTimelineRow';
import {drawPlayerRow} from '../../utils/drawUtils';
import {findNearestEvent, formatEventText} from '../../utils/eventUtils';
import {tooltipStyle} from '../../constants/timeline.constants';
import {Rectangle, Point} from '@pixi/math';

export const PlayerTimelineRow = memo<PlayerTimelineRowProps>(
  ({width, height, y, events = [], interactionEvents = [], ultimateEvents = [], dimensions, useWindowScale = true, label, labelWidth, onLabelWidthChange, onDelete}) => {
    const timeToX = useWindowScale ? dimensions.timeToXWindow : dimensions.timeToX;
    const xToTime = useWindowScale ? dimensions.xToTimeWindow : dimensions.xToTime;
    const [hoverEvent, setHoverEvent] = useState<{x: number; y: number; text: string} | null>(null);

    const timelineWidth = width - labelWidth;

    return (
      <BaseTimelineRow width={width} height={height} y={y} dimensions={dimensions} useWindowScale={useWindowScale} label={label} labelWidth={labelWidth} onLabelWidthChange={onLabelWidthChange} onDelete={onDelete}>
        <Graphics
          interactive={true}
          hitArea={new Rectangle(0, 0, timelineWidth, height)}
          mousemove={(e) => {
            const localX = e.data.getLocalPosition(e.currentTarget).x;
            const time = xToTime(localX);
            const nearestEvent = findNearestEvent(time, events, interactionEvents, ultimateEvents);
            if (nearestEvent) {
              setHoverEvent({
                x: timeToX(nearestEvent.time),
                y: height / 2,
                text: formatEventText(nearestEvent),
              });
            } else {
              setHoverEvent(null);
            }
          }}
          mouseout={() => setHoverEvent(null)}
          draw={(g) => drawPlayerRow(g, events, interactionEvents, ultimateEvents, timeToX, height / 2, timelineWidth)}
        />
        {hoverEvent && <Text text={hoverEvent.text} style={tooltipStyle} x={hoverEvent.x} y={hoverEvent.y - 15} anchor={new Point(0.5, 1)} />}
      </BaseTimelineRow>
    );
  },
);

PlayerTimelineRow.displayName = 'PlayerTimelineRow';
