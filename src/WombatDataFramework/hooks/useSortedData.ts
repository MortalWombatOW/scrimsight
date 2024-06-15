import React, {useMemo} from 'react';
import {DataColumn} from '../DataColumn';

interface SortedData<T> {
  sortedData: T[];
  sortColumn: string | undefined;
  sortDirection: 'asc' | 'desc' | undefined;
  onSortSelection: (columnName: string) => void;
}

const useSortedData = <T>(data: T[], columns: DataColumn[]): SortedData<T> => {
  const [sortColumn, setSortColumn] = React.useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | undefined>(undefined);
  const onSortSelection = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };
  // if columns changes, reset sortColumn and sortDirection
  React.useEffect(() => {
    setSortColumn(undefined);
    setSortDirection(undefined);
  }, [JSON.stringify(columns)]);

  const sortedData = useMemo(() => {
    if (sortColumn === undefined) {
      return data;
    }
    const c = columns.find((col) => col.name === sortColumn);
    if (!c) {
      throw new Error(`Column ${sortColumn} not found`);
    }
    return data.slice().sort((a, b) => {
      if (sortDirection === 'asc') {
        return c.comparator(a[sortColumn], b[sortColumn]);
      } else {
        return c.comparator(b[sortColumn], a[sortColumn]);
      }
    });
  }, [JSON.stringify(data), sortColumn, sortDirection]);

  return {sortedData, sortColumn, sortDirection, onSortSelection};
};

export default useSortedData;
