import React from 'react';
import { Dataset } from '../../data';

interface DataTableProps {
    dataset: Dataset;
}

const DataTable = (props: DataTableProps) => {
  const { dataset } = props;
  return (
    <table>
      <thead>
        <tr>
          {dataset.getFields().map((field) => (
            <th key={field.name}>
              {' '}
              { field.name }
              {' '}
            </th>
          ))}
        </tr>
      </thead>
    </table>
  );
};

export default DataTable;
