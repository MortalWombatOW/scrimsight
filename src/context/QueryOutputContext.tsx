import React from 'react';

export interface QueryOutputContext {
  data: object[];
}

export interface QueryOutputContextState {
  data: object[];
}

const defaultState: QueryOutputContextState = {
  data: [],
};

export const QueryOutputContext =
  React.createContext<QueryOutputContextState>(defaultState);
