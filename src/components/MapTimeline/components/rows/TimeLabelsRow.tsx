import {memo} from 'react';
import {BaseTimelineRow} from './BaseTimelineRow';
import {BaseTimelineRowProps} from '../../types/row.types';

export const TimeLabelsRow = memo<BaseTimelineRowProps>(({width, height, y, dimensions, useWindowScale = false, label = '', labelWidth, onLabelWidthChange, onDelete}) => {
  return (
    <BaseTimelineRow
      width={width}
      height={height}
      y={y}
      dimensions={dimensions}
      useWindowScale={useWindowScale}
      label={label}
      labelWidth={labelWidth}
      onLabelWidthChange={onLabelWidthChange}
      showLabels={true}
      onDelete={onDelete}
    />
  );
});

TimeLabelsRow.displayName = 'TimeLabelsRow';
