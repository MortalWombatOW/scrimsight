export const safeDivide = (a: number | string, b: number | string) => {
  if (b === 0) {
    return 0;
  }
  return (a as number) / (b as number);
};

export const prettyFormat = (val: number | string | undefined, decimals = 2): string => {
  if (val === undefined) {
    return 'undefined';
  }
  if (typeof val === 'string') {
    return val;
  }
  if (val == Infinity) {
    return '∞';
  }
  if (val > 1000000) {
    return prettyFormat(val / 1000000, decimals) + 'm';
  }
  if (val > 1000) {
    return prettyFormat(val / 1000, decimals) + 'k';
  }
  if (val % 1 === 0) {
    return val.toFixed(0);
  }
  return val.toFixed(decimals);
};

export const camelCaseToWords = (s: string) => {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const formatTime = (val: number) => {
  const hours = Math.floor(val / 3600);
  const minutes = Math.floor((val % 3600) / 60);
  const seconds = Math.floor(val % 60);
  return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds > 0 ? seconds + 's' : ''}`;
};
