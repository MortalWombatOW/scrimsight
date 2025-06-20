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
  const output = result.charAt(0).toUpperCase() + result.slice(1);
  // console.log("camelCaseToWords", s, output);
  return output;
}

export const camelCaseToAbbreviation = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/([a-z])/g, '');
}

export const formatTime = (val: number) => {
  if (val === 0) {
    return '0s';
  }
  const hours = Math.floor(val / 3600);
  const minutes = Math.floor((val % 3600) / 60);
  const seconds = Math.floor(val % 60);
  return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds > 0 ? seconds + 's' : ''}`;
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours > 0 ? hours + 'h ' : ''}${remainingMinutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
};

export const formatPercentage = (value: number | undefined, decimals = 1): string => {
  if (value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${(value * 100).toFixed(decimals)}%`;
};

export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}



export function listToNaturalLanguage(list: string[]): string {
  if (list.length === 0) {
    return '';
  }
  if (list.length === 1) {
    return list[0];
  }
  if (list.length === 2) {
    return `${list[0]} and ${list[1]}`;
  }
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
};