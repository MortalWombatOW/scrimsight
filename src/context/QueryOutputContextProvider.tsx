import React from 'react';
import {
  QueryOutputContextState,
  QueryOutputContext,
} from './QueryOutputContext';
import {QueryInputContext} from './QueryInputContext';
import {useDataForFields} from '../hooks/useDataForFields';
import {FilterContext} from './FilterContext';

export const QueryOutputContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {fields} = React.useContext(QueryInputContext);
  const {matches} = React.useContext(FilterContext);
  console.log('QueryOutputContextProvider', fields);

  const data = (useDataForFields(fields.map((field) => field.id)) || []).filter(
    matches,
  );

  const contextValue: QueryOutputContextState = {
    data: data || [],
  };

  return (
    <QueryOutputContext.Provider value={contextValue}>
      {children}
    </QueryOutputContext.Provider>
  );
};

export const useQueryOutputContext = () => React.useContext(QueryOutputContext);
