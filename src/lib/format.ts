export const safeDivide = (a: number | string, b: number | string) => {
  if (b === 0) {
    return 0;
  }
  return (a as number) / (b as number);
};

export const format = (val: number | string | undefined, decimals = 2) => {
  if (typeof val === 'string' || val === undefined) {
    return val;
  }
  if (val == Infinity) {
    return '∞';
  }
  if (val > 1000000) {
    return format(val / 1000000) + 'm';
  }
  if (val > 1000) {
    return format(val / 1000) + 'k';
  }
  if (val % 1 === 0) {
    return val.toFixed(0);
  }
  return val.toFixed(decimals);
};

export const formatTime = (val: number | string | undefined) => {
  if (val === undefined) {
    return '';
  }
  if (typeof val === 'string') {
    return val;
  }
  const hours = Math.floor(val / 3600);
  const minutes = Math.floor((val % 3600) / 60);
  const seconds = Math.floor(val % 60);
  return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds > 0 ? seconds + 's' : ''}`;
};
