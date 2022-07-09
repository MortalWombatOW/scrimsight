import {ChartDataset} from 'chart.js';
import {enumKeys} from '../enum';
import {getPlayersToTeam} from './data';
import {
  BaseData,
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

// export const getMetricTypes: () => MetricType[] = () => ['sum', 'count'];w w
export const getMetricValues: () => MetricValue[] = () => enumKeys(MetricValue);
export const getMetricValueName = (value: MetricValue) => MetricValue[value];

export const getMetricGroups: () => MetricGroup[] = () => enumKeys(MetricGroup);

export const getGroupsForMetric: (metric: MetricValue) => MetricGroup[] = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  metric: MetricValue,
) => {
  const allGroups: MetricGroup[] = getMetricGroups();

  return allGroups;
};

export const getTypeForMetric = (metric: MetricValue): MetricType => {
  switch (metric) {
    case MetricValue.damage:
    case MetricValue.damageTaken:
    case MetricValue.healing:
    case MetricValue.healingTaken:
      return MetricType.sum;
    case MetricValue.finalBlows:
    case MetricValue.eliminations:
    case MetricValue.deaths:
      return MetricType.count;
    case MetricValue.health:
    case MetricValue.timeToUlt:
    case MetricValue.timeWithUlt:
      return MetricType.sum;
    default:
      console.error(`unknown metric ${metric}`);
      return MetricType.sum;
  }
};

const getRowsForValue = (
  value: MetricValue,
  groups: MetricGroup[],
  maps: OWMap[],
  statuses: PlayerStatus[],
  interactions: PlayerInteraction[],
): MetricRow[] => {
  const rows: MetricRow[] = [];
  const playersToTeam = maps.length == 1 ? getPlayersToTeam(maps[0]) : {};

  if (value === MetricValue.health) {
    statuses.forEach((status) => {
      const {player, health, timestamp} = status;
      const row: MetricRow = {
        value: health,
        groups: {},
      };
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = player;
      }
      if (groups.includes(MetricGroup.team) && playersToTeam[player]) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.timeToUlt) {
    statuses.forEach((status) => {
      const {player, ultCharge, timestamp} = status;
      const row: MetricRow = {
        value: ultCharge,
        groups: {},
      };
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = player;
      }
      if (groups.includes(MetricGroup.team) && playersToTeam[player]) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.damage) {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'damage') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = player;
      }
      if (groups.includes(MetricGroup.team) && playersToTeam[player]) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.damageTaken) {
    interactions.forEach((interaction) => {
      const {target, amount, timestamp, type} = interaction;
      if (type !== 'damage') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = target;
      }
      if (groups.includes(MetricGroup.team) && playersToTeam[target]) {
        row.groups.team = playersToTeam[target];
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.healing) {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'healing') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = player;
      }
      if (groups.includes(MetricGroup.team) && playersToTeam[player]) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.healingTaken) {
    interactions.forEach((interaction) => {
      const {target, amount, timestamp, type} = interaction;
      if (type !== 'healing') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = target;
      }
      if (groups.includes(MetricGroup.team) && playersToTeam[target]) {
        row.groups.team = playersToTeam[target];
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.finalBlows) {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'final blow') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = player;
      }
      if (groups.includes(MetricGroup.team) && playersToTeam[player]) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.eliminations) {
    interactions.forEach((interaction) => {
      const {player, amount, timestamp, type} = interaction;
      if (type !== 'elimination') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes(MetricGroup.team) && playersToTeam[player]) {
        row.groups.team = playersToTeam[player];
      }
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = player;
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.deaths) {
    interactions.forEach((interaction) => {
      const {target, amount, timestamp, type} = interaction;
      if (type !== 'final blow') {
        return;
      }
      const row: MetricRow = {
        value: amount,
        groups: {},
      };
      if (groups.includes(MetricGroup.team) && playersToTeam[target]) {
        row.groups.team = playersToTeam[target];
      }
      if (groups.includes(MetricGroup.player)) {
        row.groups.player = target;
      }
      if (groups.includes(MetricGroup.time)) {
        row.groups.time = timestamp.toString();
      }
      rows.push(row);
    });
  } else if (value === MetricValue.timeWithUlt) {
    const damageRows = getRowsForValue(
      MetricValue.damage,
      groups,
      maps,
      statuses,
      interactions,
    );
    const healingRows = getRowsForValue(
      MetricValue.healing,
      groups,
      maps,
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

export const calculateMetricNew = (
  metric: Metric,
  baseData: BaseData | undefined,
): MetricData => {
  if (baseData === undefined) {
    return {} as MetricData;
  }

  return calculateMetric(
    metric,
    baseData.maps,
    baseData.statuses,
    baseData.interactions,
  );
};

export const calculateMetric = (
  metric: Metric,
  maps: OWMap[],
  statuses: PlayerStatus[],
  interactions: PlayerInteraction[],
): MetricData => {
  const metricData: MetricData = {};
  const {values, groups} = metric;

  const valuesMap = values.reduce((acc, value) => {
    acc[value] = getRowsForValue(value, groups, maps, statuses, interactions);
    return acc;
  }, {});

  values.forEach((value) => {
    const type = getTypeForMetric(value);
    const rows: MetricRow[] = valuesMap[value];
    console.log(metricData);
    rows.forEach((row) => {
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
          if (type === MetricType.sum) {
            ptr[groupName][value] = oldValue + row.value;
          }
          if (type === MetricType.count) {
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
