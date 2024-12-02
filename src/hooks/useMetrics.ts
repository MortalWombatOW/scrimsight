import {useWombatDataManager, DataColumn, useWombatDataNode} from 'wombat-data-framework';
import jStat from 'jstat';

// to be displayed like
// 30 eliminations per 10 minutes
// +10% vs all players
export interface MetricData {
  column: DataColumn;
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
  if (group === 'mapId') {
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
  console.log('welchsTTest', sample1, sample2);
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
  // (More accurate implementations might use specialized libraries)
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

const useMetric = (columnName: string, slice: Record<string, string | number>, compareToOther: string[]): MetricData => {
  const dataManager = useWombatDataManager();
  const compareSlice = Object.fromEntries(Object.entries(slice).filter(([group]) => !compareToOther.includes(group)));

  const column = dataManager.getColumn(columnName);
  const valueLabel = getLabelForSlice(slice);
  const compareValueLabel = getLabelForSlice(compareSlice);

  const [playerStatExpandedNode] = useWombatDataNode('player_stat_expanded');

  if (!dataManager.hasNodeOutput('player_stat_expanded')) {
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
  const data = playerStatExpandedNode?.getOutput<Record<string, unknown>[]>()?.filter((row) => (row['allDamageDealt'] as number) > 0) || [];

  const valueArray = data.filter((row) => Object.entries(slice).every(([group, value]) => row[group] === value)).map((row) => row[columnName]) as number[];
  const compareValueArray = data.filter((row) => Object.entries(compareSlice).every(([group, value]) => row[group] === value)).map((row) => row[columnName]) as number[];

  console.log('slice', slice);
  console.log('data', data);
  console.log('valueArray', valueArray);

  const {tValue, degreesOfFreedom, pValue, label: significance} = welchsTTest(valueArray, compareValueArray);

  console.log('welchsTTest', tValue, degreesOfFreedom, pValue);

  const {lowerBound, mean, upperBound} = meanWithConfidenceInterval(valueArray);
  const {mean: compareMean} = meanWithConfidenceInterval(compareValueArray);

  // percent change is the change in value compared to the baseline
  const percentChange = compareMean === 0 ? Infinity : ((mean - compareMean) / compareMean) * 100;
  const direction = percentChange > 0 ? 'increase' : 'decrease';

  const binCount = 10;
  const bins: number[] = jStat.histogram(valueArray, binCount);
  const compareBins: number[] = jStat.histogram(compareValueArray, binCount);
  const minValue = Math.min(...valueArray, ...compareValueArray);
  const maxValue = Math.max(...valueArray, ...compareValueArray);
  const binWidth = (maxValue - minValue) / binCount;
  const histogram = bins.map((bin, index) => ({bin: Math.round((minValue + index * binWidth) * 100) / 100, count: bin / Math.max(...bins), compareCount: compareBins[index] / Math.max(...compareBins)}));

  console.log('useMetric', column);
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
