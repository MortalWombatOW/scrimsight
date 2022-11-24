// Metrics logic

import {duration} from '@mui/material';
import {cartesian} from '../cartesian';
import {capitalize, listToNaturalLanguage} from '../string';
import {BaseData, Metric, MetricGroup, MetricValue} from './types';

export type Data = DataRow[];
export type DataRow = {[key: string]: string | number};

export type DataExtractor = (baseData: BaseData) => Data;

const simpleInteractionExtractor =
  (key: string): DataExtractor =>
  (baseData: BaseData) =>
    baseData.interactions
      .filter((i) => i.type === key)
      .map((i) => {
        const {player, amount, timestamp, type} = i;
        const obj: {[key: string]: string | number} = {
          player: player,
          time: timestamp,
          label: type,
        };
        obj[key] = amount;
        return obj;
      });

// string value of metric value or group to extractor function
const extractorMap: {[key: string]: DataExtractor} = {
  [MetricValue[MetricValue.damage]]: simpleInteractionExtractor('damage'),
  [MetricValue[MetricValue.healing]]: simpleInteractionExtractor('healing'),
  // get connections between players and teams
  [MetricGroup[MetricGroup.team]]: (baseData: BaseData) => {
    const data: Data = [];
    baseData.maps.forEach((map) => {
      const {team1, team2, team1Name, team2Name} = map;
      team1.forEach((player) => {
        data.push({
          player: player,
          team: team1Name,
        });
      });
      team2.forEach((player) => {
        data.push({
          player: player,
          team: team2Name,
        });
      });
    });
    return data;
  },
  [MetricValue[MetricValue.mapCount]]: (baseData: BaseData) => {
    const data: Data = [];
    baseData.maps.forEach((map) => {
      const {team1, team2} = map;
      team1.forEach((player) => {
        data.push({
          player: player,
          mapCount: 1,
        });
      });
      team2.forEach((player) => {
        data.push({
          player: player,
          mapCount: 1,
        });
      });
    });
    return data;
  },
  [MetricValue[MetricValue.topHero]]: (baseData: BaseData) => {
    const data: Data = [];
    baseData.statuses.forEach((status) => {
      const {player, hero} = status;
      data.push({
        player: player,
        topHero: hero,
      });
    });
    return data;
  },
  [MetricValue[MetricValue.damagePer10m]]: (baseData: BaseData) => {
    const data: Data = [];
    // first calculate total damage and duration by player and map
    const byPlayerAndMap = baseData.interactions.reduce((acc, interaction) => {
      const {mapId, timestamp, type, player, amount} = interaction;
      if (!acc[mapId]) {
        acc[mapId] = {
          min: timestamp,
          max: timestamp,
        };
      } else {
        if (timestamp < acc[mapId].min) {
          acc[mapId].min = timestamp;
        }
        if (timestamp > acc[mapId].max) {
          acc[mapId].max = timestamp;
        }
        if (type === 'damage') {
          if (!acc[mapId][player]) {
            acc[mapId][player] = 0;
          }
          acc[mapId][player] += amount;
        }
      }

      return acc;
    }, {} as {[key: string]: {min: number; max: number; [key: string]: number}});
    // then calculate damage per 10 minutes
    const damagePer10mByPlayer = {};
    for (const mapId in byPlayerAndMap) {
      const {min, max, ...players} = byPlayerAndMap[mapId];
      const duration = max - min;
      for (const player in players) {
        if (!damagePer10mByPlayer[player]) {
          damagePer10mByPlayer[player] = {
            acc: 0,
            count: 0,
          };
        }
        const damagePer10m = (players[player] / duration) * 600;
        damagePer10mByPlayer[player].count += 1;
        damagePer10mByPlayer[player].acc +=
          (damagePer10m - damagePer10mByPlayer[player].acc) /
          damagePer10mByPlayer[player].count;
      }
    }
    // then add to data
    for (const player in damagePer10mByPlayer) {
      data.push({
        player: player,
        damagePer10m: damagePer10mByPlayer[player].acc,
      });
    }
    return data;
  },
  [MetricValue[MetricValue.fileTime]]: (baseData: BaseData) => {
    const data: Data = [];
    baseData.maps.forEach((map) => {
      const {mapId, fileName, timestamp} = map;
      data.push({
        mapId: mapId,
        fileTime: timestamp,
      });
    });
    return data;
  },
  [MetricGroup[MetricGroup.map]]: (baseData: BaseData) => {
    const data: Data = [];
    baseData.maps.forEach((map) => {
      const {mapId, fileName} = map;
      data.push({
        mapId: mapId,
        fileName: fileName,
      });
    });
    return data;
  },
};

const groupJoinFieldMap: {[key: string]: string} = {
  team: 'player',
};

const join = (data1: Data, data2: Data, on: string) => {
  const data: Data = [];
  data1.forEach((d1) => {
    data2.forEach((d2) => {
      if (d1[on] === d2[on]) {
        const row: {[key: string]: string | number} = {
          ...d1,
          ...d2,
        };
        delete row[on];

        data.push(row);
      }
    });
  });
  console.log('Joining', data1, data2, on, data);

  return data;
};

function getDataFromExtractor(
  baseData: BaseData,
  key: string,
): Data | undefined {
  const defaultList = ['player', 'timestamp'];
  if (defaultList.includes(key)) {
    return undefined;
  }

  const extractor = extractorMap[key];
  if (!extractor) {
    throw new Error(`No extractor for ${key}`);
  }
  return extractor(baseData);
}

// returns mapping from metric group name to group values
function getUniqueGroups(
  data: Data,
  groups: MetricGroup[],
): {[key: string]: string[]} {
  const uniqueGroups: {[key: string]: string[]} = {};
  for (const row of data) {
    for (const group of groups) {
      const groupValue = row[MetricGroup[group]] as string;
      if (!uniqueGroups[MetricGroup[group]]) {
        uniqueGroups[MetricGroup[group]] = [];
      }
      if (uniqueGroups[MetricGroup[group]].indexOf(groupValue) === -1) {
        uniqueGroups[MetricGroup[group]].push(groupValue);
      }
    }
  }
  return uniqueGroups;
}

function aggregateMetric(
  data: Data,
  value: MetricValue,
  forGroups: {[key: string]: string[]},
  by: 'sum' | 'count',
): Data {
  // aggregate rows where the groups match forGroups
  const resultData: Data = [];
  const filteredData = data.filter((row) => {
    for (const group in forGroups) {
      if (forGroups[group].indexOf(row[group] as string) === -1) {
        return false;
      }
    }
    return true;
  });
  const increment = (row: {[key: string]: string | number}) => {
    if (by === 'sum') {
      return row[MetricValue[value]] as number;
    }
    return 1;
  };
  const sliceValue = filteredData.reduce((acc, row) => {
    return acc + increment(row);
  }, 0);
  const resultRow: {[key: string]: string | number} = {};
  for (const group of Object.keys(forGroups)) {
    resultRow[MetricGroup[group]] = forGroups[group][0];
  }
  resultRow[MetricValue[value]] = sliceValue;
  resultData.push(resultRow);
  return resultData;
}

// const firstTwoGroups = Object.keys(forGroups).slice(0, 2);
// console.log('aggregateMetric', forGroups);
// const groupItems = forGroups[firstTwoGroups[0]];
// const resultData: {[key: string]: string | number}[] = groupItems.map(
//   (groupItem) => {
//     const filteredData = data.filter((row) => {
//       return row[firstTwoGroups[0]] === groupItem;
//     });
//     const sum = filteredData.reduce((acc, row) => {
//       return acc + (row[MetricValue[value]] as number);
//     }, 0);

//     const obj: {[key: string]: string | number} = {
//       [firstTwoGroups[0]]: groupItem,
//     };
//     const metricValueName: string = MetricValue[value];
//     obj[metricValueName] = by === 'sum' ? sum : filteredData.length;
//     return obj;
//   },
//   );

//   return resultData;
// }

const mergeValues = (data: Data, metric: Metric): Data => {
  const resultData: {[key: string]: string | number}[] = [];
  const hasSameGroups = (
    row1: {[key: string]: string | number},
    row2: {[key: string]: string | number},
  ) => {
    for (const group of metric.groups) {
      if (row1[MetricGroup[group]] !== row2[MetricGroup[group]]) {
        return false;
      }
    }
    return true;
  };

  for (const row of data) {
    let found = false;
    for (const resultRow of resultData) {
      if (hasSameGroups(row, resultRow)) {
        mergeRows(resultRow, row);
        found = true;
        break;
      }
    }
    if (!found) {
      resultData.push(row);
    }
  }
  return resultData;
};

// Computes each metric value for each group in the data by the following steps:
// 1. Get the rows for each metric value by calling the extractor for the metric value.
// 2. Compute the group set by finding the unique groups in the rows.
// 3. For each group in the group set, compute the metric value by aggregating the values in the rows for the group.
export function computeMetric(metric: Metric, baseData: BaseData): Data {
  const result: Data = [];
  for (const value of metric.values) {
    let data = getDataFromExtractor(baseData, MetricValue[value]);
    if (data === undefined) {
      continue;
    }
    const groupsToExtract = metric.groups.filter(
      (g) => (data as Data)[0][MetricGroup[g]] === undefined,
    );
    const groupData = groupsToExtract.map((group) =>
      getDataFromExtractor(baseData, MetricGroup[group]),
    );
    console.log('groupData', groupData);
    groupData.forEach((group, i) => {
      if (group) {
        data = join(
          data as Data,
          group,
          groupJoinFieldMap[MetricGroup[groupsToExtract[i]]],
        );
      }
    });
    // const groupsMinusTime = metric.groups.filter((g) => g !== MetricGroup.time);
    // key is the groups concatenated with '_'
    const groupMap: {
      [key: string]: {
        [key: string]: string | number;
      };
    } = data.reduce<{
      [key: string]: {
        [key: string]: string | number;
      };
    }>((acc, row) => {
      const key = metric.groups.map((g) => row[MetricGroup[g]]).join('_');
      if (!acc[key]) {
        acc[key] = {};
      }
      mergeRows(acc[key], row);
      return acc;
    }, {});
    console.log('groupMap', groupMap);
    for (const group in groupMap) {
      const groupRow = groupMap[group];

      result.push(groupRow);
    }
  }
  const merged = mergeValues(result, metric);
  console.log('computeMetric', metric, result, merged);
  return merged;
}

export const getMetricName = (metric: Metric): string => {
  let nameBuilder = '';
  nameBuilder += listToNaturalLanguage(
    metric.values.map((v) => MetricValue[v]),
  );
  nameBuilder += ' by ';
  nameBuilder += listToNaturalLanguage(
    metric.groups.map((g) => MetricGroup[g]),
  );
  return capitalize(nameBuilder);
};

const mergeRows = (
  current: {[key: string]: string | number},
  toAdd: {[key: string]: string | number},
): void => {
  for (const key of Object.keys(toAdd)) {
    if (current[key] === undefined) {
      current[key] = toAdd[key];
    } else {
      if (
        typeof current[key] === 'number' &&
        key !== MetricGroup[MetricGroup.time]
      ) {
        current[key] = (current[key] as number) + (toAdd[key] as number);
      }
    }
  }
};
