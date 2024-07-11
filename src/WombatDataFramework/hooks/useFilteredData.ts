import React, {useState} from 'react';
import {DataColumnType} from '../DataColumn';
import {useDeepMemo} from '../../hooks/useDeepEffect';

interface FilteredData<T> {
  filteredData: T[];
  filters: Record<string, DataColumnType>;
  setFilter: (key: string, value: DataColumnType | undefined) => void;
}

const useFilteredData = <T>(data: T[]): FilteredData<T> => {
  const [filters, setFilters] = useState<Record<string, DataColumnType>>({});

  const filteredData = useDeepMemo(() => {
    return data.filter((row) => !Object.entries(filters).some(([key, value]) => row[key] !== value));
  }, [data, filters]);

  const setFilter = (key: string, value: DataColumnType | undefined) => {
    setFilters((prevFilters) => {
      if (value === undefined || prevFilters[key] === value) {
        const newFilters = {...prevFilters};
        delete newFilters[key];
        return newFilters;
      }
      return {...prevFilters, [key]: value};
    });
  };

  return {filteredData, filters, setFilter};
};

export default useFilteredData;
