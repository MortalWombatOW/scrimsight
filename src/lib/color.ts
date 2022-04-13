import {ColorInternal} from 'lib/data/types';

const parseHex = (hex: string): ColorInternal => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  let a = 255;
  if (hex.length === 9) {
    a = parseInt(hex.substring(7, 9), 16);
  }
  return {r, g, b, a};
};

export const colorToHex = (color: ColorInternal): string => {
  const r = color.r.toString(16);
  const g = color.g.toString(16);
  const b = color.b.toString(16);
  const a = color.a.toString(16);
  return `#${r}${g}${b}${a}`;
};

export const interpolateColors = (
  startColor: string,
  endColor: string,
  steps: number,
) => {
  const start = parseHex(startColor);
  const end = parseHex(endColor);
  const step = {
    r: (end.r - start.r) / steps,
    g: (end.g - start.g) / steps,
    b: (end.b - start.b) / steps,
    a: (end.a - start.a) / steps,
  };
  const colors: string[] = [];
  for (let i = 0; i < steps; i++) {
    const r = Math.round(start.r + step.r * i);
    const g = Math.round(start.g + step.g * i);
    const b = Math.round(start.b + step.b * i);
    const a = Math.round(start.a + step.a * i);
    colors.push(colorToHex({r, g, b, a}));
  }
  return colors;
};

export const groupColorClass = (group: string): string | undefined => {
  const map = {
    'Team 1': 'team-1',
    'Team 2': 'team-2',
  };
  return map[group] || undefined;
};
