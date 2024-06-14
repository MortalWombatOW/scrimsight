import React from 'react';
import {DataResult} from './DataFetcher';
import useFilteredData from '../hooks/useFilteredData';
import {Chip} from '@mui/material';
import {DataColumn, DataColumnType} from '../DataColumn';

const DataFilterChip: React.FC<{column: DataColumn; value: DataColumnType; onDelete: () => void}> = ({column, value, onDelete}) => {
  return <Chip label={`${column.displayName} = ${column.formatter(value)}`} onDelete={onDelete} />;
};

const DataFilterBar: React.FC<{filters: Record<string, DataColumnType>; columns: DataColumn[]; setFilter: (key: string, value: DataColumnType | undefined) => void}> = ({filters, columns, setFilter}) => {
  return (
    <div className="flex flex-wrap flex-start gap-1">
      {Object.entries(filters).map(([key, value]) => {
        const column = columns.find((column) => column.name === key);
        if (!column) {
          throw new Error(`Column ${key} not found`);
        }
        return <DataFilterChip key={key} column={column} value={value} onDelete={() => setFilter(key, undefined)} />;
      })}
    </div>
  );
};

const DataFilter: React.FC<{dataResult: DataResult<object>; renderContent: (dataResult: DataResult<object>) => React.ReactNode}> = ({dataResult, renderContent}) => {
  const {data, columns} = dataResult;
  const {filteredData, filters, setFilter} = useFilteredData(data);

  console.log('DataFilter', {filters});

  return (
    <>
      <DataFilterBar filters={filters} columns={columns} setFilter={setFilter} />
      {renderContent({data: filteredData, columns, setFilter})}
    </>
  );
};

export default DataFilter;
