/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable no-restricted-syntax */
import {
  Button, MenuItem, Select, ButtonGroup,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { DatasetTransform } from '../../lib/data/data';
import Dataset from '../services/Dataset';
import FieldPopover from './FieldPopover';

interface DataTableProps {
    dataset: Dataset;
    addTransform: (transform: DatasetTransform) => void;
}

const DataTable = (props: DataTableProps) => {
  const { dataset, addTransform } = props;
  const [start, setStart] = useState(0);
  const [numRows, setNumRows] = useState(20);

  const visibleRows = useMemo(
    () => dataset.slice(start, start + numRows), [start, numRows, dataset],
  );

  const headerHTML = useMemo(
    () => {
      const header = [];
      for (const field of visibleRows.getFields()) {
        header.push(
          <FieldPopover
            key={field.name}
            field={field}
            dataset={dataset}
            addTransform={addTransform}
            close={() => {}}
          />,
        );
      }
      return header;
    },
    [visibleRows],
  );

  const rowsHTML = useMemo(
    () => visibleRows.map((row, i) => (
      <tr key={i}>
        {row.map((field, val) => (<td key={`${i}-${field.name}`}>{val}</td>))}
      </tr>
    )),
    [visibleRows],
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
            variant="outlined"
          >
            Previous

          </Button>
          <Button
            onClick={() => setStart(Math.min(dataset.numRows() - numRows, start + numRows))}
            variant="outlined"
          >
            Next

          </Button>
        </ButtonGroup>
        <Select
          value={numRows}
          onChange={(e) => setNumRows(parseInt((e.target.value as string), 10))}
        >
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
