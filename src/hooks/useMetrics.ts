import { useAtom } from 'jotai';
import { playerStatExpandedAtom } from '~/atoms';
// @ts-ignore
import jStat from 'jstat';

export interface Column {
  name: string;
  displayName: string;
  description: string;
  formatter: (value: number) => string;
}

export interface MetricData {
  column: Column;
  value: number;
  lowerBound: number;
  upperBound: number;
  valueLabel: string;
  roundCount: number;
  histogram: {bin: number; count: number; compareCount: number}[];
  direction: 'increase' | 'decrease' | 'flat';
  compareValue: number;
  compareValueLabel: string;
  percentChange: number;
  significance: string;
}

const getGroupDisplayName = (group: string): string => {
  if (group === 'matchId') {
    return 'map';
  }
  if (group === 'teamName') {
    return 'team';
  }
  if (group === 'playerName') {
    return 'player';
  }
  if (group === 'playerRole') {
    return 'role';
  }
  if (group === 'roundNumber') {
    return 'round';
  }
  return group;
};

const getLabelForSlice = (slice: Record<string, string | number>): string => {
  if (Object.keys(slice).length === 0) {
    return 'overall';
  }
  return Object.entries(slice)
    .map(([group, value]) => {
      return `${getGroupDisplayName(group)} ${value}`;
    })
    .join(', ');
};

// Welch-Satterthwaite degrees of freedom
function degreesOfFreedom(sample1: number[], sample2: number[]): number {
  const n1 = sample1.length;
  const n2 = sample2.length;

  const var1 = jStat.variance(sample1);
  const var2 = jStat.variance(sample2);

  return Math.pow(var1 / n1 + var2 / n2, 2) / (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));
}

function welchsTTest(sample1: number[], sample2: number[]): {tValue: number; degreesOfFreedom: number; pValue: number; label: string} {
  const n1 = sample1.length;
  const n2 = sample2.length;

  const mean1 = jStat.mean(sample1);
  const mean2 = jStat.mean(sample2);

  const var1 = jStat.variance(sample1);
  const var2 = jStat.variance(sample2);

  // Welch's t-value
  const tValue = (mean1 - mean2) / Math.sqrt(var1 / n1 + var2 / n2);

  const dof = degreesOfFreedom(sample1, sample2);

  // Approximate p-value using Student's t-distribution
  const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tValue), dof));

  let label = '';
  if (pValue > 0.1) {
    label = `Not a significant difference`;
  } else if (pValue > 0.05) {
    label = `Potentially significant difference`;
  } else if (pValue > 0.01) {
    label = `Significant difference`;
  } else {
    label = `Very significant difference`;
  }

  return {tValue, degreesOfFreedom: dof, pValue, label};
}

function meanWithConfidenceInterval(
  data: number[],
  confidence = 0.95,
): {
  lowerBound: number;
  mean: number;
  upperBound: number;
} {
  const n = data.length;
  const dof = degreesOfFreedom(data, data);
  const standardError = jStat.stdev(data) / Math.sqrt(n);
  const tCriticalValue = jStat.studentt.inv(1 - confidence, dof);
  const mean = jStat.mean(data);
  const lowerBound = mean - tCriticalValue * standardError;
  const upperBound = mean + tCriticalValue * standardError;
  return {lowerBound, mean, upperBound};
}

// Default formatters for different types of metrics
const formatters = {
  number: (value: number) => value.toFixed(0),
  percent: (value: number) => `${(value * 100).toFixed(1)}%`,
  time: (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// Column definitions
const columns: Record<string, Column> = {
  eliminations: {
    name: 'eliminations',
    displayName: 'Eliminations',
    description: 'Number of eliminations',
    formatter: formatters.number
  },
  deaths: {
    name: 'deaths',
    displayName: 'Deaths',
    description: 'Number of deaths',
    formatter: formatters.number
  },
  // Add more columns as needed
};

const useMetric = (columnName: string, slice: Record<string, string | number>, compareToOther: string[]): MetricData | null => {
  const [playerStats] = useAtom(playerStatExpandedAtom);
  const compareSlice = Object.fromEntries(Object.entries(slice).filter(([group]) => !compareToOther.includes(group)));

  const column = columns[columnName];
  if (!column) return null;

  const valueLabel = getLabelForSlice(slice);
  const compareValueLabel = getLabelForSlice(compareSlice);

  if (!playerStats) {
    return {
      column,
      value: 0,
      lowerBound: 0,
      upperBound: 0,
      valueLabel,
      histogram: [],
      roundCount: 0,
      direction: 'flat',
      compareValue: 0,
      compareValueLabel,
      percentChange: 0,
      significance: 'unknown',
    };
  }

  const data = playerStats.filter((row) => row.allDamageDealt > 0);

  const valueArray = data
    .filter((row) => Object.entries(slice).every(([group, value]) => row[group as keyof typeof row] === value))
    .map((row) => row[columnName as keyof typeof row] as number);

  const compareValueArray = data
    .filter((row) => Object.entries(compareSlice).every(([group, value]) => row[group as keyof typeof row] === value))
    .map((row) => row[columnName as keyof typeof row] as number);

  const {label: significance} = welchsTTest(valueArray, compareValueArray);

  const {lowerBound, mean, upperBound} = meanWithConfidenceInterval(valueArray);
  const {mean: compareMean} = meanWithConfidenceInterval(compareValueArray);

  // percent change is the change in value compared to the baseline
  const percentChange = compareMean === 0 ? Infinity : ((mean - compareMean) / compareMean) * 100;
  const direction = percentChange > 0 ? 'increase' : percentChange < 0 ? 'decrease' : 'flat';

  const binCount = 10;
  const bins: number[] = jStat.histogram(valueArray, binCount);
  const compareBins: number[] = jStat.histogram(compareValueArray, binCount);
  const minValue = Math.min(...valueArray, ...compareValueArray);
  const maxValue = Math.max(...valueArray, ...compareValueArray);
  const binWidth = (maxValue - minValue) / binCount;
  const histogram = bins.map((bin, index) => ({
    bin: Math.round((minValue + index * binWidth) * 100) / 100,
    count: bin / Math.max(...bins),
    compareCount: compareBins[index] / Math.max(...compareBins)
  }));

  return {
    column,
    value: mean,
    lowerBound,
    upperBound,
    valueLabel,
    roundCount: valueArray.length,
    histogram,
    direction,
    compareValue: compareMean,
    compareValueLabel,
    percentChange,
    significance,
  };
};

export default useMetric;
