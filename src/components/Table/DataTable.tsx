/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable no-restricted-syntax */
import {Button, MenuItem, Select, ButtonGroup} from '@mui/material';
import {Dataset} from '../../lib/data/types';
import React, {useMemo, useState} from 'react';
import {sliceDataset} from './../../lib/data/data';

interface DataTableProps {
  dataset: Dataset;
}

const DataTable = (props: DataTableProps) => {
  const {dataset} = props;
  const [start, setStart] = useState(0);
  const [numRows, setNumRows] = useState(20);

  const visibleRows = useMemo(
    () => sliceDataset(dataset, start, start + numRows),
    [start, numRows, dataset.rows.length, dataset.columns.length],
  );

  const headerHTML = useMemo(() => {
    const header = [];
    for (const col of visibleRows.columns) {
      header.push(<th key={col.name}>{col.name}</th>);
    }
    return header;
  }, [visibleRows]);
  console.log(dataset);
  const rowsHTML = useMemo(
    () =>
      visibleRows.rows.map((row, i) => (
        <tr key={i}>
          {row.map((field) => (
            <td key={`${i}-${field}`}>{field}</td>
          ))}
        </tr>
      )),
    [visibleRows, dataset.rows.length, dataset.columns.length],
  );

  return (
    <div>
      <table>
        {headerHTML}
        {rowsHTML}
      </table>
      <div className="DataTable-controls">
        <ButtonGroup>
          <Button
            onClick={() => setStart(Math.max(0, start - numRows))}
            variant="outlined">
            Previous
          </Button>
          <Button
            onClick={() =>
              setStart(Math.min(dataset.rows.length - numRows, start + numRows))
            }
            variant="outlined">
            Next
          </Button>
        </ButtonGroup>
        <Select
          value={numRows}
          onChange={(e) => setNumRows(parseInt(e.target.value as string, 10))}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default DataTable;
