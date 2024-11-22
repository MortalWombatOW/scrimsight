import React, {memo} from 'react';
import {Graphics} from '@pixi/react';
import * as PIXI from 'pixi.js';
import {TimelineRowProps, BaseTimelineRowProps} from '../../types/row.types';
import {BaseTimelineRow} from './BaseTimelineRow';

interface TeamAdvantageData {
  matchTime: number;
  [key: string]: any;
}

interface TeamAdvantageRowProps extends Omit<BaseTimelineRowProps, 'label'> {
  data: TeamAdvantageData[];
  fieldNames: {
    team1Count: string;
    team2Count: string;
  };
  label: string;
  team1Color?: number;
  team2Color?: number;
}

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

export const TeamAdvantageRow = memo<TeamAdvantageRowProps>(
  ({width, height, y, dimensions, useWindowScale = false, label, labelWidth, onLabelWidthChange, onDelete, data, fieldNames, team1Color = 0x4caf50, team2Color = 0xf44336}) => {
    if (!dimensions || !data) return null;

    const timeToX = useWindowScale ? dimensions.timeToXWindow : dimensions.timeToX;
    const maxCount = Math.max(...data.map((d) => Math.max(d[fieldNames.team1Count], d[fieldNames.team2Count])));
    const scale = height / (2 * maxCount);
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
            data.forEach((d, i) => {
              const x = timeToX(d.matchTime);
              const nextEvent = data[i + 1];

              if (nextEvent) {
                const barWidth = timeToX(nextEvent.matchTime) - x;

                // Draw team 1 bar (top)
                drawTeamBar({
                  g,
                  x,
                  barWidth,
                  count: d[fieldNames.team1Count],
                  scale,
                  centerY,
                  color: team1Color,
                  isTopTeam: true,
                });

                // Draw team 2 bar (bottom)
                drawTeamBar({
                  g,
                  x,
                  barWidth,
                  count: d[fieldNames.team2Count],
                  scale,
                  centerY,
                  color: team2Color,
                  isTopTeam: false,
                });
              }
            });

            // Draw advantage step line
            g.lineStyle(1, 0xffffff, 1);
            let lastY: number | null = null;
            let lastX: number | null = null;

            data.forEach((d, i) => {
              const x = timeToX(d.matchTime);
              const diff = d[fieldNames.team1Count] - d[fieldNames.team2Count];
              const y = centerY - (diff * scale) / 2;

              if (i === 0) {
                g.moveTo(x, y);
              } else if (lastY !== null && lastX !== null) {
                g.lineTo(x, lastY); // Horizontal line to new x
                g.lineTo(x, y); // Vertical line to new y
              }

              lastX = x;
              lastY = y;

              const nextEvent = data[i + 1];
              if (nextEvent) {
                const nextX = timeToX(nextEvent.matchTime);
                if (nextX > x) {
                  g.lineTo(nextX, y);
                }
              }
            });
          }}
        />
      </BaseTimelineRow>
    );
  },
);

TeamAdvantageRow.displayName = 'TeamAdvantageRow';
