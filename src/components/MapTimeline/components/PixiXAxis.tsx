import React, {memo} from 'react';
import {Container, Graphics} from '@pixi/react';
import * as PIXI from 'pixi.js';
import {XAxisProps} from '../types/timeline.types';
import {PixiUltimateAdvantageChart} from './PixiUltimateAdvantageChart';

const drawRoundSection = (g: PIXI.Graphics, x: number, width: number, color: number, alpha: number) => {
  g.clear();
  g.beginFill(color, alpha);
  g.drawRect(x, 0, width, 10);
  g.endFill();
};

const drawEventMarker = (g: PIXI.Graphics) => {
  g.clear();
  g.beginFill(0xffffff, 0.2);
  g.drawRect(0, 0, 1, 10);
  g.endFill();
};

const drawWindowSection = (g: PIXI.Graphics, width: number) => {
  g.clear();
  g.lineStyle(1, 0xffffff, 0.2);
  g.beginFill(0xffffff, 0.1);
  g.drawRect(0, 0, width, 20);
  g.endFill();
};

export const PixiXAxis = memo<XAxisProps>(
  ({width, timeToX, xToTime, mapStartTime, mapEndTime, roundTimes, windowStartTime, setWindowStartTime, windowEndTime, setWindowEndTime, eventTimes, team1Name, team2Name, ultimateAdvantageData}) => {
    return (
      <Container>
        <PixiUltimateAdvantageChart width={width} timeToX={timeToX} windowStartTime={windowStartTime} windowEndTime={windowEndTime} team1Name={team1Name} team2Name={team2Name} ultimateAdvantageData={ultimateAdvantageData} />

        {/* Round sections */}
        {roundTimes.map((round, index) => (
          <Container key={`round-${index}`}>
            {/* Setup section */}
            <Graphics draw={(g) => drawRoundSection(g, timeToX(round.roundStartTime), timeToX(round.roundSetupCompleteTime) - timeToX(round.roundStartTime), 0x882222, 0.3)} />
            {/* Active section */}
            <Graphics draw={(g) => drawRoundSection(g, timeToX(round.roundSetupCompleteTime), timeToX(round.roundEndTime) - timeToX(round.roundSetupCompleteTime), 0x4caf50, 0.3)} />
            {/* Round label would need to be handled outside PIXI */}
          </Container>
        ))}

        {/* Event markers */}
        {eventTimes.map((time, index) => (
          <Graphics key={`event-${index}`} x={timeToX(time)} draw={drawEventMarker} />
        ))}

        {/* Window section */}
        <Graphics x={timeToX(windowStartTime)} draw={(g) => drawWindowSection(g, timeToX(windowEndTime) - timeToX(windowStartTime))} />

        {/* Window handles would need to be handled outside PIXI for interaction */}
      </Container>
    );
  },
);

PixiXAxis.displayName = 'PixiXAxis';
