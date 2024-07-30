import React from 'react';
import {useDataManager} from '../WombatDataFramework/DataContext';

const useUniqueValuesForColumn = (columnName: string): string[] => {
  const dataManager = useDataManager();

  const column = dataManager.getColumnOrDie(columnName);

  if (!column) {
    throw new Error(`Column ${columnName} not found`);
  }

  if (!dataManager.hasNodeOutput('player_stat_expanded')) {
    return [];
  }

  const data = dataManager.getNodeOutputOrDie('player_stat_expanded');

  const uniqueValues = Array.from(new Set(data.map((row) => row[columnName])));

  return uniqueValues;
};

export default useUniqueValuesForColumn;
