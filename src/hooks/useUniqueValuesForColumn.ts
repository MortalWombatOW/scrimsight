import React from 'react';
import { useWombatData, useWombatDataManager } from 'wombat-data-framework';

const useUniqueValuesForColumn = (columnName: string): string[] => {
  const dataManager = useWombatDataManager();

  const column = dataManager.getColumn(columnName);

  const { data } = useWombatData<object>('player_stat_expanded');

  if (!column) {
    throw new Error(`Column ${columnName} not found`);
  }

  if (!dataManager.hasNodeOutput('player_stat_expanded')) {
    return [];
  }

  const uniqueValues = Array.from(new Set(data.map((row) => row[columnName])));

  return uniqueValues;
};

export default useUniqueValuesForColumn;
