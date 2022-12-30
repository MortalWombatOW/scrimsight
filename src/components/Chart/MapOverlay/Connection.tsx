import React from 'react';
import {groupColorClass} from '../../../lib/color';

const Connection = ({
  x1,
  y1,
  x2,
  y2,
  type,
  amount,
  className,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: string;
  amount: number;
  className: string;
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // get the angle of the line
  const angle = Math.atan2(dy, dx);
  const initialDistance = 500;
  const finalDistance = 500;
  // inputs on left and outputs on right
  const x1c = x1 + initialDistance;
  const y1c = y1;
  const x2c = x2 - finalDistance;
  const y2c = y2;

  // returns a smooth curve between two points
  const path = `M${x1},${y1}  ${x2},${y2}`;
  return (
    <path
      className={className}
      d={path}
      fill="none"
      stroke="red"
      strokeWidth={amount + 0.5}
    />
  );
};

export default Connection;
