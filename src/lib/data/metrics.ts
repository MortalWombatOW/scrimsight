import {ChartDataset} from 'chart.js';
import {getPlayersToTeam} from './data';
import {
  Metric,
  MetricData,
  MetricGroup,
  MetricRow,
  MetricType,
  MetricValue,
  OWMap,
  PlayerInteraction,
  PlayerStatus,
} from './types';

// export const getMetricTypes: () => MetricType[] = () => ['sum', 'count'];
export const getMetricValues: () => MetricValue[] = () => [
  'damage',
  'damage taken',
  'healing',
  'healing taken',
  'final blows',
  'elimination',
  'deaths',
  'health',
  'time to ult',
  'time with ult',
];

export const getMetricGroups: () => MetricGroup[] = () => [
  'player',
  'team',
  'time',
];

export const getGroupsForMetric: (metric: MetricValue) => MetricGroup[] = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  metric: MetricValue,
) => {
  const allGroups: MetricGroup[] = getMetricGroups();

  return allGroups;
};

export const getTypeForMetric = (metric: MetricValue): MetricType => {
  switch (metric) {
    case 'damage':
    case 'damage taken':
    case 'healing':
    case 'healing taken':
      return 'sum';
    case 'final blows':
    case 'elimination':
    case 'deaths':
      return 'count';
    case 'health':
    case 'time to ult':
    case 'time with ult':
      return 'sum';
    default:
      console.error(`unknown metric ${metric}`);
      return 'sum';
  }
};

const getRowsForValue = (
  value: MetricValue,
  groups: MetricGroup[],
  map: OWMap,
  statuses: PlayerStatus[],
  interactions: PlayerInteraction[],
): MetricRow[] => {
  const rows: MetricRow[] = [];
  const playersToTeam = getPlayersToTeam(map);

  if (value === 'health') {
    statuses.forEach((status) => {
      const {player, health, timestamp} = status;
      const row: MetricRow = {
        value: health,
        groups: {},
      };
      if (groups.includes('player')) {
        row.groups.player = player;
      }
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'time to ult') {
    statuses.forEach((status) => {
      const {player, ultCharge, timestamp} = status;
      const row: MetricRow = {
        value: ultCharge,
        groups: {},
      };
      if (groups.includes('player')) {
        row.groups.player = player;
      }
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'damage') {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'damage') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes('player')) {
        row.groups.player = player;
      }
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'damage taken') {
    interactions.forEach((interaction) => {
      const {target, amount, timestamp, type} = interaction;
      if (type !== 'damage') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes('player')) {
        row.groups.player = target;
      }
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[target];
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'healing') {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'healing') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes('player')) {
        row.groups.player = player;
      }
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'healing taken') {
    interactions.forEach((interaction) => {
      const {target, amount, timestamp, type} = interaction;
      if (type !== 'healing') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes('player')) {
        row.groups.player = target;
      }
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[target];
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'final blows') {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'final blow') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes('player')) {
        row.groups.player = player;
      }
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'elimination') {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'elimination') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes('player')) {
        row.groups.player = player;
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'deaths') {
    interactions.forEach((interaction) => {
      const {target, amount, timestamp, type} = interaction;
      if (type !== 'final blow') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes('team')) {
        row.groups.team = playersToTeam[target];
      }
      if (groups.includes('player')) {
        row.groups.player = target;
      }
      if (groups.includes('time')) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === 'time with ult') {
    const damageRows = getRowsForValue(
      'damage',
      groups,
      map,
      statuses,
      interactions,
    );
    const healingRows = getRowsForValue(
      'healing',
      groups,
      map,
      statuses,
      interactions,
    );
    damageRows.forEach((dRow) => {
      // get healing row with matching groups
      const healingRow = healingRows.find((healingRow) => {
        return Object.keys(dRow.groups).every((key) => {
          return dRow.groups[key] === healingRow.groups[key];
        });
      });

      const row = {
        value: 0,
        groups: dRow.groups,
      };

      if (healingRow) {
        row.value = dRow.value / healingRow.value;
      }
      rows.push(row);
    });
  }

  return rows;
};

export const calculateMetric = (
  metric: Metric,
  map: OWMap,
  statuses: PlayerStatus[],
  interactions: PlayerInteraction[],
): MetricData => {
  const metricData: MetricData = {};
  const {values, groups} = metric;

  const valuesMap = values.reduce((acc, value) => {
    acc[value] = getRowsForValue(value, groups, map, statuses, interactions);
    return acc;
  }, {});

  values.forEach((value) => {
    const type = getTypeForMetric(value);
    const rows: MetricRow[] = valuesMap[value];
    console.log(metricData);
    rows.forEach((row) => {
      if (
        metric.filters &&
        metric.filters.length > 0 &&
        !metric.filters?.every((filter) => filter(row))
      ) {
        return;
      }
      let ptr = metricData;
      groups.forEach((group, idx) => {
        const isLastGroup = idx === groups.length - 1;
        const groupName = row.groups[group];
        if (!ptr[groupName]) {
          ptr[groupName] = {};
        }
        if (isLastGroup) {
          if (!ptr[groupName][value]) {
            ptr[groupName][value] = 0;
          }

          const oldValue = ptr[groupName][value] as number;
          if (type === 'sum') {
            ptr[groupName][value] = oldValue + row.value;
          }
          if (type === 'count') {
            ptr[groupName][value] = oldValue + 1;
          }
        } else {
          ptr = ptr[groupName] as MetricData;
        }
      });
    });
  });

  console.log(metricData);

  return metricData;
};

const getSumOfAllNumbers = (obj: MetricData | number): number => {
  if (typeof obj === 'number') {
    return obj;
  }
  let sum = 0;
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'number') {
      sum += obj[key] as number;
    } else {
      sum += getSumOfAllNumbers(obj[key] as MetricData);
    }
  });
  return sum;
};

export const flatten = (metric: MetricData, levels: number): MetricData => {
  const flat: MetricData = {};
  Object.keys(metric).forEach((group) => {
    const groupData = metric[group];
    if (levels === 1) {
      flat[group] = getSumOfAllNumbers(groupData as MetricData);
    } else {
      flat[group] = flatten(groupData as MetricData, levels - 1);
    }
  });
  // debugger;
  return flat;
};

export const getObjectDepth = (obj: MetricData): number => {
  let depth = 0;
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      depth = Math.max(depth, getObjectDepth(obj[key] as MetricData));
    }
  });
  return depth + 1;
};

export const formatDataForChart = (metricData: MetricData): ChartDataset[] => {
  const data = flatten(metricData, 2);
  const cData: ChartDataset[] = [];
  for (const [key, value] of Object.entries(data)) {
    let i = 0;
    for (const [k, v] of Object.entries(value as MetricData)) {
      let exists = cData.find((d) => d.label === k);
      if (!exists) {
        exists = {
          label: k,
          data: [],
        };
        cData.push(exists);
      }

      exists.data.push(v as number);
      // dataset.data.push(v);
      i++;
    }
  }
  console.log(cData);
  return cData;
};

// export const formatDataForBarChart = (
//   metric: Metric,
//   map: OWMap,
//   statuses: PlayerStatus[],
//   interactions: PlayerInteraction[],
// ): ChartDataset[] => {

export const formatTimeSeriesHeatmap = (
  metricData: MetricData,
): ChartDataset[] => {
  const data = flatten(metricData, 2);
  const cData: ChartDataset[] = [];
  const times = Object.keys(data).flatMap((key) => {
    return Object.keys(data[key] as MetricData).map((k) => {
      return Number.parseInt(k, 10);
    });
  });
  const primaryKeys = Object.keys(metricData);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeRange: number[] = [];
  for (let i = minTime; i <= maxTime; i++) {
    timeRange.push(i);
  }
  console.log(minTime, maxTime, timeRange);

  for (const primaryKey of primaryKeys) {
    const primaryData = data[primaryKey];
    const dataset = {
      label: primaryKey,
      data: [],
    };
    cData.push(dataset);
  }
  // timeRange.forEach((time) => {
  //   const timeData: ChartDataset = {
  //     label: time + '',
  //     data: primaryKeys.flatMap((key) => {
  //       return Object.keys(data[key] as MetricData).map((k) => {
  //         return data[key][k] as number;
  //       });
  //     }),

  //     // backgroundColor: primaryKeys.map((group) => '#fff'),
  //   };
  //   cData.push(timeData);
  // });
  for (const [key, value] of Object.entries(data)) {
    for (const [k, v] of Object.entries(value as MetricData)) {
      // const idx = primaryKeys.indexOf(key);
      const datum = cData.find((d) => d.label === key);
      if (datum && datum.data) {
        datum.data.push({
          x: Number.parseInt(k, 10),
          y: v as number,
        });
        // datum.backgroundColor[idx] = '#' + (v as number).toString(16) + '0000';
      }
    }
  }
  console.log('ya');
  console.log(cData);
  return cData;
};

export const getTimeSeriesLabels = (metricData: MetricData): string[] => {
  const data = flatten(metricData, 2);
  const times = Object.keys(data).flatMap((key) => {
    return Object.keys(data[key] as MetricData);
  });
  return [...new Set(times)].sort();
};
