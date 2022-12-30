import React from 'react';
import {Grid} from '@visx/grid';
const MapBackground = ({
  bounds,
  step,
}: {
  bounds: {x1: number; y1: number; x2: number; y2: number};
  step: number;
}) => {
  // renders a grid of lines to represent the map
  console.log('bounds', bounds);
  const {x1, y1, x2, y2} = bounds;
  const width = x2 - x1;
  const height = y2 - y1;
  const lines: JSX.Element[] = [];
  for (let x = x1; x <= x2; x += step) {
    lines.push(
      <line
        key={`x${x}`}
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke="white"
        strokeWidth={0.5}
      />,
    );
  }
  for (let y = y1; y <= y2; y += step) {
    lines.push(
      <line
        key={`y${y}`}
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="white"
        strokeWidth={0.5}
      />,
    );
  }

  return (
    <g>
      {/* <Grid
        xScale={5}
        yScale={5}
        width={width}
        height={height}
        numTicksRows={10}
        numTicksColumns={10}
      /> */}
      {lines}
    </g>
  );
};

export default MapBackground;
