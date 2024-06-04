import React from 'react';
import {
  QueryInputContextProvider,
  useQueryInputContext,
} from '../context/QueryInputContextProvider';
import {
  QueryOutputContextProvider,
  useQueryOutputContext,
} from '../context/QueryOutputContextProvider';
import {DataField} from './data/common';
import {DataDisplayContextProvider} from '../context/DataDisplayContextProvider';

interface DataComponentProps {
  fields: DataField[];
  children: React.ReactNode;
}

const ContextualizedDataComponent = ({
  fields,
  children,
}: DataComponentProps) => {
  useQueryInputContext(fields);
  const {data} = useQueryOutputContext();
  console.log('InnerTest', data);

  return <div>{children}</div>;
};

const DataComponent = (props: DataComponentProps) => {
  return (
    <QueryInputContextProvider>
      <QueryOutputContextProvider>
        <DataDisplayContextProvider>
          <ContextualizedDataComponent fields={props.fields}>
            {props.children}
          </ContextualizedDataComponent>
        </DataDisplayContextProvider>
      </QueryOutputContextProvider>
    </QueryInputContextProvider>
  );
};

export default DataComponent;
