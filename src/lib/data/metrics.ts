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
  'ult charge',
];

export const getMetricGroups: () => MetricGroup[] = () => [
  'player',
  'team',
  'time',
];

export const getGroupsForMetric: (metric: MetricValue) => MetricGroup[] = (
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
    case 'ult charge':
      return 'average';
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
  } else if (value === 'ult charge') {
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
  } else if (value === 'damage/healing') {
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
  const {type, value, groups} = metric;

  const rows = getRowsForValue(value, groups, map, statuses, interactions);

  rows.forEach((row) => {
    let ptr = metricData;
    groups.forEach((group, idx) => {
      const isLastGroup = idx === groups.length - 1;
      const groupVal = row.groups[group];
      if (!ptr[groupVal]) {
        if (isLastGroup) {
          ptr[groupVal] = 0;
        } else {
          ptr[groupVal] = {};
        }
      }
      if (typeof ptr[groupVal] === 'number') {
        const oldValue = ptr[groupVal] as number;
        if (type === 'sum') {
          ptr[groupVal] = oldValue + row.value;
        }
        if (type === 'count') {
          ptr[groupVal] = oldValue + 1;
        }
      } else {
        ptr = ptr[groupVal] as MetricData;
      }
    });
  });

  return metricData;
};
