import {ColorInternal, ColorInternalHSL} from '../lib/data/types';

const colorgorical = [
  '#78b4c6',
  '#fd6ca0',
  '#fd7450',
  '#7d9af7',
  '#2cc18e',
  '#eaa5c3',
  '#4ed31b',
  '#a3c541',
  '#c87ef8',
  '#fb57f9',
];

export const getColorgorical = (str: string | null | undefined): string => {
  if (!str) {
    return 'white';
  }
  if (str === 'Team 1') {
    return colorgorical[0];
  }
  if (str === 'Team 2') {
    return colorgorical[1];
  }
  if (str === 'Draw') {
    return 'gray';
  }
  const index =
    Math.abs(
      str.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0),
    ) % colorgorical.length;
  return colorgorical[index];
};

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

export const groupColorClass = (group: string): string => {
  return group.toLowerCase().replaceAll(' ', '-');
};

export const getColorPaletteOfSize = (size: number): string[] => {
  if (size <= 12) {
    return colorgorical.slice(0, size);
  }

  const colors = interpolateColors('#505f76', '#dc3c07', size);
  return colors;
};

export const getColorFor = (key: string): string => {
  const map = {
    ana: '#718ab3',
    ashe: '#f3d19c',
    bastion: '#7c8f7b',
    brigitte: '#be736e',
    baptiste: '#fea350',
    dva: '#ed93c7',
    doomfist: '#815049',
    echo: '#31a5cc',
    genji: '#97ef43',
    hanzo: '#b9b48a',
    junkrat: '#ecbd53',
    lucio: '#85c952',
    cassidy: '#ae595c',
    mauga: '#a37f5c',
    mei: '#6faced',
    mercy: '#ebe8bb',
    moira: '#803c51',
    orisa: '#468c43',
    pharah: '#3e7dca',
    reaper: '#7d3e51',
    reinhardt: '#929da3',
    roadhog: '#b68c52',
    soldier76: '#697794',
    sombra: '#7359ba',
    sigma: '#7aa3b9',
    symmetra: '#8ebccc',
    torbjorn: '#c0726e',
    tracer: '#d79342',
    widowmaker: '#9e6aa8',
    winston: '#a2a6bf',
    wreckingball: '#c09e74',
    zarya: '#e77eb6',
    zenyatta: '#ede582',
    illari: '#f3d19c',
    junkerqueen: '#7c8f7b',
    rammatra: '#be736e',
    lifeweaver: '#F0A3A5',
    kiriko: '#ed93c7',
    sojourn: '#815049',
  };
  return map[key] || 'red';
};
