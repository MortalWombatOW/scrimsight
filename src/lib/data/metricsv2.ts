// Metrics logic

import {BaseData, Metric, MetricGroup, MetricValue} from './types';

export type Data = {[key: string]: string | number}[];

export type DataExtractor = (baseData: BaseData) => Data;

// string value of metric value to extractor function
const extractorMap: {[key: string]: DataExtractor} = {
  [MetricValue[MetricValue.damage]]: (baseData: BaseData) =>
    baseData.interactions
      .filter((i) => i.type === 'damage')
      .map((i) => {
        const {player, amount, timestamp, type} = i;
        return {
          player: player,
          value: amount,
          timestamp: timestamp,
          label: type,
        };
      }),
};

function getDataForMetricValue(
  baseData: BaseData,
  metricValue: MetricValue,
): Data {
  const extractor = extractorMap[MetricValue[metricValue]];
  if (!extractor) {
    throw new Error(`No extractor for metric value ${metricValue}`);
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
  forGroups: {[key: string]: string},
  by: 'sum' | 'count',
): Data {
  const resultDatum: {[key: string]: string | number} = {};
  resultDatum.label = MetricValue[value];
  for (const group in forGroups) {
    resultDatum[group] = forGroups[group];
  }

  const filteredData = data.filter((row) => {
    for (const group in forGroups) {
      if (row[group] !== forGroups[group]) {
        return false;
      }
    }
    return true;
  });

  resultDatum.value = filteredData.reduce((acc, row) => {
    return acc + (by === 'sum' ? (row.value as number) : 1);
  }, 0);

  return [resultDatum];
}

// Computes each metric value for each group in the data by the following steps:
// 1. Get the rows for each metric value by calling the extractor for the metric value.
// 2. Compute the group set by finding the unique groups in the rows.
// 3. For each group in the group set, compute the metric value by aggregating the values in the rows for the group.
export function computeMetric(metric: Metric, baseData: BaseData): Data {
  const result: Data = [];
  for (const value of metric.values) {
    const data = getDataForMetricValue(baseData, value);
    const groups = getUniqueGroups(data, metric.groups);
    console.log(data);
    console.log(groups);
    for (const group in groups) {
      const groupItems = groups[group];
      for (const groupItem of groupItems) {
        const groupData = aggregateMetric(
          data,
          value,
          {[group]: groupItem},
          'sum',
        );
        result.push(...groupData);
      }
    }
  }
  return result;
}
