import React from 'react';
import {useDataDisplayContext} from '../../context/DataDisplayContextProvider';

export interface DataField {
  displayName: string;
  id: string;
  type: 'categorical' | 'numerical';
  formatter?: (value: any) => string;
  hidden?: boolean;
}

export const TemplatedString = ({
  template,
}: {
  template: string;
}): JSX.Element => {
  const result = useTemplatedString(template);
  return <>{result}</>;
};

export const useTemplatedString = (template: string): string => {
  console.log('useTemplatedString', template);
  const {fields, data} = useDataDisplayContext();

  if (fields.length === 0 || data.length === 0) {
    console.error('Fields or data not found in context', fields, data);
    return template;
  }

  if (data.length > 1) {
    console.error('Data has more than one row', data);
  }

  // template has placeholders like {{field.id}} that need to be replaced with the actual data
  // only the first row of data is used
  let result = template;
  fields.forEach((field) => {
    if (data[0][field.id] === undefined) {
      throw new Error(`Field ${field.id} not found in data`);
    }
    if (!result.includes(`{{${field.id}}}`)) {
      console.error(`Field ${field.id} not found in template`, result);
    }
    result = result.replaceAll(`{{${field.id}}}`, data[0][field.id]);
    console.log(
      'TemplatedString',
      field.id,
      data[0][field.id],
      result,
      template,
    );
  });

  return result;
};
