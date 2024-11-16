import React, { memo } from 'react';
import { Container } from '@pixi/react';
import { BaseTimelineRowProps } from '../../types/row.types';
import { TimelineGrid } from '../TimelineGrid';
import { LabelArea } from '../LabelArea';

interface ExtendedBaseTimelineRowProps extends BaseTimelineRowProps {
  label: string;
  labelWidth: number;
  onLabelWidthChange: (width: number) => void;
  showLabels?: boolean;
}

export const BaseTimelineRow = memo<ExtendedBaseTimelineRowProps>(({
  width,
  height,
  y,
  dimensions,
  useWindowScale = true,
  children,
  label,
  labelWidth,
  onLabelWidthChange,
  showLabels = false,
  onDelete,
}) => {
  const timeToX = useWindowScale ? dimensions.timeToXWindow : dimensions.timeToX;
  const startTime = useWindowScale ? dimensions.windowStartTime : dimensions.mapStartTime;
  const endTime = useWindowScale ? dimensions.windowEndTime : dimensions.mapEndTime;
  const timelineWidth = width - labelWidth;

  return (
    <Container y={y}>
      <LabelArea
        text={label}
        width={labelWidth}
        height={height}
        onResize={onLabelWidthChange}
        onDelete={onDelete}
      />

      <Container x={labelWidth}>
        <TimelineGrid
          width={timelineWidth}
          height={height}
          timeToX={timeToX}
          startTime={startTime}
          endTime={endTime}
          labelWidth={labelWidth}
          showLabels={showLabels}
        />
        <Container>
          {children}
        </Container>
      </Container>
    </Container>
  );
});

BaseTimelineRow.displayName = 'BaseTimelineRow'; 