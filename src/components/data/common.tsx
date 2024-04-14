import React from 'react';
import {useDataDisplayContext} from '../../context/DataDisplayContextProvider';

export interface DataField {
  displayName: string;
  id: string;
  type: 'categorical' | 'numerical';
  formatter?: (value: any) => string;
}

export const TemplatedString = ({
  template,
}: {
  template: string;
}): JSX.Element => {
  const {fields, data} = useDataDisplayContext();

  if (fields.length === 0 || data.length === 0) {
    return <></>;
  }

  // template has placeholders like {{field.id}} that need to be replaced with the actual data
  // only the first row of data is used
  let result = template;
  fields.forEach((field) => {
    result = result.replace(`{{${field.id}}}`, data[0][field.id]);
  });

  return <>{result}</>;
};
