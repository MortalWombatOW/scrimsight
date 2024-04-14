import React from 'react';
import {DataField} from '../components/data/common';

export interface QueryInputContext {
  fields: DataField[];
}

export interface QueryInputContextState {
  fields: DataField[];
  setFields: (fields: DataField[]) => void;
}

const defaultState: QueryInputContextState = {
  fields: [],
  setFields: (fields: DataField[]) => {
    console.error('setFields context not initialized', fields);
  },
};

export const QueryInputContext =
  React.createContext<QueryInputContextState>(defaultState);
