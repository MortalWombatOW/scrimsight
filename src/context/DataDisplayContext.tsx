import React from 'react';
import {DataField} from '../components/data/common';

export interface DataDisplayContext {
  fields: DataField[];
  data: object[];
}

export interface DataDisplayContextState {
  fields: DataField[];
  data: object[];
}

const defaultState: DataDisplayContextState = {
  fields: [],
  data: [],
};

export const DataDisplayContext =
  React.createContext<DataDisplayContextState>(defaultState);
