import React from 'react';

export type DataValue = string | number | boolean;

export interface DataFilter {
  field: string;
  value: DataValue;
}

export interface FilterContext {
  filters: DataFilter[];
}

export interface FilterContextState {
  filters: DataFilter[];
  set: (field: string, value: DataValue) => boolean;
  unset: (field: string) => boolean;
  matches: (data: object) => boolean;
}

const defaultState: FilterContextState = {
  filters: [],
  set: (field: string, value: DataValue) => {
    console.error('set filter context not initialized', field, value);
    return false;
  },
  unset: (field: string) => {
    console.error('unset filter context not initialized', field);
    return false;
  },
  matches: (data: object) => {
    console.error('matches filter context not initialized', data);
    return false;
  },
};

export const FilterContext =
  React.createContext<FilterContextState>(defaultState);
