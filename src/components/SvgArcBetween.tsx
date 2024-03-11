import React, {FC} from 'react';

interface SvgArcBetweenProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width: number;
}

const SvgArcBetween: FC<SvgArcBetweenProps> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  width,
}) => {
  const k = 40;
  const n = 5;
  const i = 1;

  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  const dx = (x2 - x1) / 2;
  const dy = (y2 - y1) / 2;

  const dd = Math.sqrt(dx * dx + dy * dy);

  const ex = cx + (dy / dd) * k * (i - (n - 1) / 2);
  const ey = cy - (dx / dd) * k * (i - (n - 1) / 2);

  return (
    <path
      d={`M ${x1} ${y1} Q ${ex} ${ey} ${x2} ${y2}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
    />
  );
};

export default SvgArcBetween;
