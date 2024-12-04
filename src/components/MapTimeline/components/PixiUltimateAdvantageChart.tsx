import {memo} from 'react';
import {Container, Graphics} from '@pixi/react';
import {Graphics as GraphicsType} from '@pixi/graphics';
import {UltimateAdvantageChartProps, UltimateAdvantageData} from '../types/timeline.types';

const drawBars = (g: GraphicsType, data: any[], timeToX: (t: number) => number, scale: number) => {
  g.clear();

  data.forEach((d, i) => {
    const nextEvent = data[i + 1];
    const x = timeToX(d.matchTime);
    const width = nextEvent ? timeToX(nextEvent.matchTime) - x : 0;

    // Team 1 bar (top)
    g.beginFill(0x4caf50, 0.6);
    g.drawRect(x, 30 - d.team1ChargedUltimateCount * scale, width, d.team1ChargedUltimateCount * scale);

    // Team 2 bar (bottom)
    g.beginFill(0xf44336, 0.6);
    g.drawRect(x, 30, width, d.team2ChargedUltimateCount * scale);
  });
  g.endFill();
};

const drawLine = (g: GraphicsType, data: UltimateAdvantageData[], timeToX: (t: number) => number, scale: number) => {
  g.clear();
  g.lineStyle(2, 0xffffff, 0.8);

  data.forEach((d, i) => {
    const x = timeToX(d.matchTime as number);
    const diff = (d.team1ChargedUltimateCount as number) - (d.team2ChargedUltimateCount as number);
    const y = 30 - diff * scale;

    if (i === 0) {
      g.moveTo(x, y);
    } else {
      g.lineTo(x, y);
    }
  });
};

export const PixiUltimateAdvantageChart = memo<UltimateAdvantageChartProps>(({width, timeToX, ultimateAdvantageData}) => {
  const maxUltCount = Math.max(...ultimateAdvantageData.map((d) => Math.max(d.team1ChargedUltimateCount, d.team2ChargedUltimateCount)));
  const scale = 30 / maxUltCount;

  return (
    <Container y={0}>
      {/* Center line */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(1, 0x666666, 0.2);
          g.moveTo(0, 30);
          g.lineTo(width, 30);
        }}
      />

      {/* Bars */}
      <Graphics draw={(g) => drawBars(g, ultimateAdvantageData, timeToX, scale)} />

      {/* Advantage line */}
      <Graphics draw={(g) => drawLine(g, ultimateAdvantageData, timeToX, scale)} />
    </Container>
  );
});

PixiUltimateAdvantageChart.displayName = 'PixiUltimateAdvantageChart';
