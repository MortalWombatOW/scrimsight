import React, {memo, useMemo} from 'react';
import {Graphics, Text, Container} from '@pixi/react';
import {Point} from '@pixi/math';
import {TextStyle} from '@pixi/text';

interface TimelineGridProps {
  width: number;
  height: number;
  timeToX: (time: number) => number;
  startTime: number;
  endTime: number;
  labelWidth: number;
  showLabels?: boolean;
}

const timeIntervals = [
  {seconds: 5, alpha: 0.02, showLabel: false},
  {seconds: 15, alpha: 0.03, showLabel: false},
  {seconds: 30, alpha: 0.04, showLabel: true},
  {seconds: 60, alpha: 0.08, showLabel: true},
  {seconds: 120, alpha: 0.1, showLabel: true},
  {seconds: 300, alpha: 0.12, showLabel: true},
];

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const labelStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 10,
  fill: '#ffffff',
  align: 'left',
});

export const TimelineGrid = memo<TimelineGridProps>(({width, height, timeToX, startTime, endTime, labelWidth, showLabels = false}) => {
  // Calculate the best interval based on the visible time range
  const interval = useMemo(() => {
    const timeRange = endTime - startTime;
    const pixelsPerSecond = width / timeRange;

    // Find the first interval that gives us enough space between lines
    // We want at least 50 pixels between lines
    return timeIntervals.find((int) => pixelsPerSecond * int.seconds >= 50) ?? timeIntervals[timeIntervals.length - 1];
  }, [width, startTime, endTime]);

  // Calculate time marks
  const timeMarks = useMemo(() => {
    const marks: number[] = [];
    const firstMark = Math.floor(startTime / interval.seconds) * interval.seconds;
    for (let time = firstMark; time <= endTime; time += interval.seconds) {
      marks.push(time);
    }
    return marks;
  }, [startTime, endTime, interval.seconds]);

  return (
    <Container>
      <Graphics
        draw={(g) => {
          g.clear();

          // Draw major interval backgrounds first (for minutes)
          if (interval.seconds >= 60) {
            const firstMark = Math.floor(startTime / 60) * 60;
            for (let time = firstMark; time <= endTime; time += 60) {
              const x = timeToX(time);
              const nextX = timeToX(time + 60);
              if (x >= 0 && x <= width) {
                g.beginFill(0xffffff, 0.01);
                g.drawRect(x, 0, nextX - x, height);
                g.endFill();
              }
            }
          }

          // Draw vertical lines
          timeMarks.forEach((time) => {
            const x = timeToX(time);
            if (x >= 0 && x <= width) {
              const isMinute = time % 60 === 0;
              const isHalfMinute = time % 30 === 0;

              g.lineStyle(isMinute ? 1 : 0.5, 0xffffff, isMinute ? interval.alpha * 1.5 : isHalfMinute ? interval.alpha * 1.2 : interval.alpha);
              g.moveTo(x, 0);
              g.lineTo(x, height);
            }
          });
        }}
      />
      {showLabels &&
        interval.showLabel &&
        timeMarks.map((time) => {
          const x = timeToX(time);
          const isMinute = time % 60 === 0;
          if (isMinute && x >= 0 && x <= width) {
            return <Text key={time} text={formatTime(time)} style={labelStyle} x={x + 4} y={height / 2} anchor={new Point(0, 0.5)} alpha={0.5} />;
          }
          return null;
        })}
    </Container>
  );
});

TimelineGrid.displayName = 'TimelineGrid';
