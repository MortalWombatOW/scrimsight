import React, { memo } from 'react';
import { Container, Text, Graphics } from '@pixi/react';
import { BaseTimelineRowProps } from '../types/row.types';
import { COLORS } from '../constants/timeline.constants';

export const LegendRow = memo<BaseTimelineRowProps>(({
  width,
  height,
  y,
  dimensions
}) => {
  return (
    <BaseTimelineRow width={width} height={height} y={y} dimensions={dimensions}>
      <Container x={5}>
        <Text text="Legend:" style={textStyle} x={0} y={height / 2} anchor={new PIXI.Point(0, 0.5)} />

        {/* Ultimate */}
        <Graphics draw={g => {
          g.beginFill(parseInt(COLORS.ultimate.replace('#', '0x')), 0.8);
          g.drawRect(60, height / 2 - 5, 20, 10);
        }} />
        <Text text="Ultimate" style={textStyle} x={85} y={height / 2} anchor={new PIXI.Point(0, 0.5)} />

        {/* Kill */}
        <Graphics draw={g => {
          g.beginFill(parseInt(COLORS.kill.replace('#', '0x')));
          g.drawCircle(140, height / 2, 3);
        }} />
        <Text text="Kill" style={textStyle} x={150} y={height / 2} anchor={new PIXI.Point(0, 0.5)} />

        {/* Other events... */}
      </Container>
    </BaseTimelineRow>
  );
}); 