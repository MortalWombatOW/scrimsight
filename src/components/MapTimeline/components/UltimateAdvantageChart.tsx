import React, { memo } from 'react';
import { styled } from '@mui/material';

interface UltimateAdvantageChartProps {
  width: number;
  timeToX: (time: number) => number;
  windowStartTime: number;
  windowEndTime: number;
  team1Name: string;
  team2Name: string;
  ultimateAdvantageData: {
    matchTime: number;
    team1ChargedUltimateCount: number;
    team2ChargedUltimateCount: number;
    ultimateAdvantageDiff: number;
  }[];
}

const ChartContainer = styled('div') <{ width: number }>`
  width: ${props => props.width}px;
  height: 60px;
  position: relative;
  margin-top: 10px;
`;

const CenterLine = styled('div')`
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: #666;
  top: 50%;
`;

const Team1Bar = styled('div') <{ left: number; width: number; height: number }>`
  position: absolute;
  left: ${props => props.left}px;
  bottom: 50%;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: #4caf50;
  opacity: 0.6;
`;

const Team2Bar = styled('div') <{ left: number; width: number; height: number }>`
  position: absolute;
  left: ${props => props.left}px;
  top: 50%;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: #f44336;
  opacity: 0.6;
`;

const AdvantageLine = styled('path')`
  stroke: #fff;
  stroke-width: 1;
  fill: none;
  opacity: 0.8;
`;

// Helper function to generate step path
const generateStepPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return '';

  const path: string[] = [];
  path.push(`M ${points[0].x} ${points[0].y}`);

  // For each point after the first, draw a horizontal line to its x coordinate
  // then a vertical line to its y coordinate
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const previous = points[i - 1];

    // Horizontal line to new x position
    path.push(`H ${current.x}`);
    // Vertical line to new y position
    path.push(`V ${current.y}`);
  }

  return path.join(' ');
};

export const UltimateAdvantageChart: React.FC<UltimateAdvantageChartProps> = memo(({
  width,
  timeToX,
  windowStartTime,
  windowEndTime,
  ultimateAdvantageData
}) => {
  const maxUltCount = Math.max(
    ...ultimateAdvantageData.map(d => Math.max(d.team1ChargedUltimateCount, d.team2ChargedUltimateCount))
  );

  const scale = 30 / maxUltCount;

  // Generate points for the advantage line
  const points = ultimateAdvantageData.map(d => {
    const x = timeToX(d.matchTime);
    const diff = d.team1ChargedUltimateCount - d.team2ChargedUltimateCount;
    const y = 30 - (diff * scale);
    return { x, y };
  });

  const pathData = generateStepPath(points);

  return (
    <ChartContainer width={width}>
      <CenterLine />
      {ultimateAdvantageData.map((d, i) => {
        const nextEvent = ultimateAdvantageData[i + 1];
        const barWidth = nextEvent
          ? timeToX(nextEvent.matchTime) - timeToX(d.matchTime)
          : timeToX(windowEndTime) - timeToX(d.matchTime);

        return (
          <React.Fragment key={i}>
            <Team1Bar
              left={timeToX(d.matchTime)}
              width={barWidth}
              height={d.team1ChargedUltimateCount * scale}
            />
            <Team2Bar
              left={timeToX(d.matchTime)}
              width={barWidth}
              height={d.team2ChargedUltimateCount * scale}
            />
          </React.Fragment>
        );
      })}
      <svg width={width} height={60} style={{ position: 'absolute', top: 0 }}>
        <AdvantageLine d={pathData} />
      </svg>
    </ChartContainer>
  );
});

UltimateAdvantageChart.displayName = 'UltimateAdvantageChart'; 