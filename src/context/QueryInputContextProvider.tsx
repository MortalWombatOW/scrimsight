import React from 'react';
import {QueryInputContextState, QueryInputContext} from './QueryInputContext';
import {DataField} from '../components/data/common';

export const QueryInputContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fields, setFields] = React.useState<DataField[]>([]);

  const contextValue: QueryInputContextState = {
    fields,
    setFields,
  };

  return (
    <QueryInputContext.Provider value={contextValue}>
      {children}
    </QueryInputContext.Provider>
  );
};

export const useQueryInputContext = (fields: DataField[]) => {
  const {setFields} = React.useContext(QueryInputContext);
  React.useEffect(() => {
    setFields(fields);
  }, [JSON.stringify(fields)]);
};
