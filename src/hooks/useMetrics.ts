import React, {useState} from 'react';
import {useDataManager} from '../WombatDataFramework/DataContext';
import {DataColumn} from '../WombatDataFramework/DataColumn';

// to be displayed like
// 30 eliminations per 10 minutes
// +10% vs all players
interface MetricData {
  column: DataColumn;
  value: number;
  valueLabel: string;
  direction: 'increase' | 'decrease' | 'flat';
  compareValue: number;
  compareValueLabel: string;
  percentChange: number;
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

const getLabelForSlice = (slice: Record<string, string>): string => {
  if (Object.keys(slice).length === 0) {
    return 'overall';
  }
  return Object.entries(slice)
    .map(([group, value]) => {
      return `${getGroupDisplayName(group)} ${value}`;
    })
    .join(', ');
};

const groupsToNodeName = (groups: string[]): string => {
  // sort groups alphabetically
  const sortedGroups = groups.slice().sort();

  return 'player_stat_group_' + sortedGroups.join('_');
};

const getMetricForSlice = (slice: Record<string, string>, columnName: string, data: object[]): number => {
  const matchingRows = data.filter((row) => Object.entries(slice).every(([group, value]) => row[group] === value));
  if (matchingRows.length === 0) {
    return 0;
  }
  return matchingRows.reduce((acc, row) => acc + row[columnName], 0) / matchingRows.length;
};

const useMetric = (columnName: string, slice: Record<string, string>, compareToOther: string[]): MetricData => {
  const groups = Object.keys(slice);
  const dataManager = useDataManager();
  const compareSlice = Object.fromEntries(Object.entries(slice).filter(([group]) => !compareToOther.includes(group)));

  const column = dataManager.getColumnOrDie(columnName);
  const valueLabel = getLabelForSlice(slice);
  const compareValueLabel = getLabelForSlice(compareSlice);

  if (!dataManager.hasNodeOutput(groupsToNodeName(groups))) {
    return {
      column,
      value: 0,
      valueLabel,
      direction: 'flat',
      compareValue: 0,
      compareValueLabel,
      percentChange: 0,
    };
  }
  const data = dataManager.getNodeOutputOrDie(groupsToNodeName(groups));

  const value = getMetricForSlice(slice, columnName, data);
  const compareValue = getMetricForSlice(compareSlice, columnName, data);

  // percent change is the change in value compared to the baseline
  const percentChange = compareValue === 0 ? Infinity : ((value - compareValue) / compareValue) * 100;
  const direction = percentChange > 0 ? 'increase' : 'decrease';

  return {
    column,
    value,
    valueLabel,
    direction,
    compareValue,
    compareValueLabel,
    percentChange,
  };
};

export default useMetric;
