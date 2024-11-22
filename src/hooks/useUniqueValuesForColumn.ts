import React from 'react';
import { useWombatDataManager } from 'wombat-data-framework';

const useUniqueValuesForColumn = (columnName: string): string[] => {
  const dataManager = useWombatDataManager();

  const column = dataManager.getColumnOrDie(columnName);

  if (!column) {
    throw new Error(`Column ${columnName} not found`);
  }

  if (!dataManager.hasNodeOutput('player_stat_expanded')) {
    return [];
  }

  const data = dataManager.getNode('player_stat_expanded').getOutput<object[]>();

  const uniqueValues = Array.from(new Set(data.map((row) => row[columnName])));

  return uniqueValues;
};

export default useUniqueValuesForColumn;
