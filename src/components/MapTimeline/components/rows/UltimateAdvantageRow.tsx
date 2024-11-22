import React, {memo} from 'react';
import {Graphics} from '@pixi/react';
import * as PIXI from 'pixi.js';
import {TimelineRowProps} from '../../types/row.types';
import {BaseTimelineRow} from './BaseTimelineRow';

interface TeamBarParams {
  g: PIXI.Graphics;
  x: number;
  barWidth: number;
  count: number;
  scale: number;
  centerY: number;
  color: number;
  isTopTeam: boolean;
}

const drawTeamBar = ({g, x, barWidth, count, scale, centerY, color, isTopTeam}: TeamBarParams) => {
  if (count > 0 && barWidth > 0) {
    const height = count * scale;
    g.beginFill(color, 0.6);
    g.lineStyle(0);
    g.drawRect(x, isTopTeam ? centerY - height : centerY, barWidth, height);
    g.endFill();
  }
};

export const UltimateAdvantageRow = memo<TimelineRowProps>(({width, height, y, timelineData, dimensions, useWindowScale = false, label = 'Ultimate Advantage', labelWidth, onLabelWidthChange, onDelete}) => {
  if (!dimensions || !timelineData) return null;

  const timeToX = useWindowScale ? dimensions.timeToXWindow : dimensions.timeToX;
  const maxUltCount = Math.max(...timelineData.ultimateAdvantageData.map((d) => Math.max(d.team1ChargedUltimateCount, d.team2ChargedUltimateCount)));
  const scale = height / (2 * maxUltCount);
  const centerY = height / 2;

  return (
    <BaseTimelineRow width={width} height={height} y={y} dimensions={dimensions} useWindowScale={useWindowScale} label={label} labelWidth={labelWidth} onLabelWidthChange={onLabelWidthChange} onDelete={onDelete}>
      <Graphics
        draw={(g) => {
          g.clear();

          // Draw center line
          g.lineStyle(1, 0x666666, 0.2);
          g.moveTo(0, centerY);
          g.lineTo(width, centerY);

          // Draw bars
          timelineData.ultimateAdvantageData.forEach((d, i) => {
            const x = timeToX(d.matchTime);
            const nextEvent = timelineData.ultimateAdvantageData[i + 1];

            if (nextEvent) {
              const barWidth = timeToX(nextEvent.matchTime) - x;

              // Draw team 1 bar (top)
              drawTeamBar({
                g,
                x,
                barWidth,
                count: d.team1ChargedUltimateCount,
                scale,
                centerY,
                color: 0x4caf50,
                isTopTeam: true,
              });

              // Draw team 2 bar (bottom)
              drawTeamBar({
                g,
                x,
                barWidth,
                count: d.team2ChargedUltimateCount,
                scale,
                centerY,
                color: 0xf44336,
                isTopTeam: false,
              });
            }
          });

          // Draw advantage step line
          g.lineStyle(1, 0xffffff, 1);
          let lastY: number | null = null;
          let lastX: number | null = null;

          timelineData.ultimateAdvantageData.forEach((d, i) => {
            const x = timeToX(d.matchTime);
            const diff = d.team1ChargedUltimateCount - d.team2ChargedUltimateCount;
            const y = centerY - (diff * scale) / 2;

            if (i === 0) {
              // First point
              g.moveTo(x, y);
            } else if (lastY !== null && lastX !== null) {
              // Draw vertical line at current x from last y to new y
              g.lineTo(x, lastY); // Horizontal line to new x
              g.lineTo(x, y); // Vertical line to new y
            }

            // Store last positions
            lastX = x;
            lastY = y;

            // Draw horizontal line to next point if it exists
            const nextEvent = timelineData.ultimateAdvantageData[i + 1];
            if (nextEvent) {
              const nextX = timeToX(nextEvent.matchTime);
              if (nextX > x) {
                // Only draw if next x is greater
                g.lineTo(nextX, y);
              }
            }
          });
        }}
      />
    </BaseTimelineRow>
  );
});

UltimateAdvantageRow.displayName = 'UltimateAdvantageRow';
