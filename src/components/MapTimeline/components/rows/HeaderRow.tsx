import {memo} from 'react';
import {Text} from '@pixi/react';
import {BaseTimelineRowProps} from '../../types/row.types';
import {BaseTimelineRow} from './BaseTimelineRow';
import {textStyle} from '../../constants/timeline.constants';
import {Point} from '@pixi/math';

interface HeaderRowProps extends BaseTimelineRowProps {
  text?: string;
}

export const HeaderRow = memo<HeaderRowProps>(({width, height, y, dimensions, label, labelWidth, onLabelWidthChange, text, onDelete}) => {
  return (
    <BaseTimelineRow width={width} height={height} y={y} dimensions={dimensions} label={label} labelWidth={labelWidth} onLabelWidthChange={onLabelWidthChange} onDelete={onDelete}>
      <Text text={text || label} style={textStyle} x={5} y={height / 2} anchor={new Point(0, 0.5)} />
    </BaseTimelineRow>
  );
});

HeaderRow.displayName = 'HeaderRow';
