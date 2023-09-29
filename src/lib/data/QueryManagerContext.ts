import React from 'react';
import {QueryManager} from './QueryManager';
export const QueryManagerContext = React.createContext<QueryManager>(
  (null as any) as QueryManager,
);
