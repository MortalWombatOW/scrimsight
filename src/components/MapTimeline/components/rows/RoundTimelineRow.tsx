import React, {memo} from 'react';
import {Graphics, Text} from '@pixi/react';
import * as PIXI from 'pixi.js';
import {TimelineRowProps} from '../../types/row.types';
import {BaseTimelineRow} from './BaseTimelineRow';
import {textStyle, phaseStyle} from '../../constants/timeline.constants';

export const RoundTimelineRow = memo<TimelineRowProps>(({width, height, y, timelineData, dimensions, useWindowScale = false, label = 'Rounds', labelWidth, onLabelWidthChange, onDelete}) => {
  if (!dimensions || !timelineData) return null;

  const timeToX = useWindowScale ? dimensions.timeToXWindow : dimensions.timeToX;

  return (
    <BaseTimelineRow width={width} height={height} y={y} dimensions={dimensions} useWindowScale={useWindowScale} label={label} labelWidth={labelWidth} onLabelWidthChange={onLabelWidthChange} onDelete={onDelete}>
      <Graphics
        draw={(g) => {
          g.clear();
          timelineData.roundTimes.forEach((round, index) => {
            // Setup section - more subtle colors
            g.beginFill(0x882222, 0.15); // Reduced opacity
            g.drawRect(timeToX(round.roundStartTime), 0, timeToX(round.roundSetupCompleteTime) - timeToX(round.roundStartTime), height);
            // Active section
            g.beginFill(0x4caf50, 0.15); // Reduced opacity
            g.drawRect(timeToX(round.roundSetupCompleteTime), 0, timeToX(round.roundEndTime) - timeToX(round.roundSetupCompleteTime), height);
          });
        }}
      />
      {timelineData.roundTimes.map((round, index) => (
        <React.Fragment key={`round-${index}`}>
          <Text text="Setup" style={phaseStyle} x={(timeToX(round.roundStartTime) + timeToX(round.roundSetupCompleteTime)) / 2} y={2} anchor={new PIXI.Point(0.5, 0)} />
          <Text text="Active" style={phaseStyle} x={(timeToX(round.roundSetupCompleteTime) + timeToX(round.roundEndTime)) / 2} y={2} anchor={new PIXI.Point(0.5, 0)} />
        </React.Fragment>
      ))}
      {timelineData.roundTimes.map((round, index) => (
        <Text key={`round-${index}`} text={`Round ${index + 1}`} style={textStyle} x={timeToX(round.roundStartTime)} y={height + 2} anchor={new PIXI.Point(0.5, 0)} />
      ))}
    </BaseTimelineRow>
  );
});

RoundTimelineRow.displayName = 'RoundTimelineRow';
