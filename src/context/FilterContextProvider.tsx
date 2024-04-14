import React from 'react';
import {DataFilter, FilterContext, FilterContextState} from './FilterContext';

export const FilterContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filters, setFilters] = React.useState<DataFilter[]>([]);

  const {filters: parentFilters} = React.useContext(FilterContext);

  const contextValue: FilterContextState = {
    filters: [...parentFilters, ...filters],
    set: (field: string, value: string | number | boolean) => {
      if (parentFilters.some((f) => f.field === field)) {
        return false;
      }
      if (!filters.some((f) => f.field === field)) {
        setFilters([...filters, {field, value}]);
      } else {
        const newFilters = filters.map((f) => {
          if (f.field === field) {
            return {field, value};
          }
          return f;
        });
        setFilters(newFilters);
      }
      console.log(`setting filter ${field} to ${value}, filters: ${filters}`);
      return true;
    },
    unset: (field: string) => {
      if (parentFilters.some((f) => f.field === field)) {
        return false;
      }
      const newFilters = filters.filter((f) => f.field !== field);
      setFilters(newFilters);
      return true;
    },
    matches: (data: object) => {
      const isMatch =
        filters.every((f) => data[f.field] === f.value) &&
        parentFilters.every((f) => data[f.field] === f.value);
      // console.log('matches', data, isMatch);
      return isMatch;
    },
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => React.useContext(FilterContext);
