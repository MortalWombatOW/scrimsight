import React from 'react';

import {QueryInputContext} from './QueryInputContext';
import {
  DataDisplayContextState,
  DataDisplayContext,
} from './DataDisplayContext';
import {QueryOutputContext} from './QueryOutputContext';

export const DataDisplayContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {fields} = React.useContext(QueryInputContext);
  const {data} = React.useContext(QueryOutputContext);
  console.log('DataDisplayContextProvider', fields, data);

  const contextValue: DataDisplayContextState = {
    fields: fields,
    data: data || [],
  };

  return (
    <DataDisplayContext.Provider value={contextValue}>
      {children}
    </DataDisplayContext.Provider>
  );
};

export const useDataDisplayContext = () => React.useContext(DataDisplayContext);
