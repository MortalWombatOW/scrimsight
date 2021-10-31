/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import {
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import React from 'react';
import { RawEvent } from '../../types';

const DataTable = (props: DataTableProps) => {
  const { events } = props;

  const cols = Object.keys(events[0]).slice(0, 5);

  return (
    <div>
      {/* <div className="tablecontrols"><div>Columns:</div></div> */}
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {cols.map((col, index) => (
              <TableCell key={index}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.events.slice(0, 20).map((row, i) => (
            <TableRow
              key={i}
            >
              <TableCell component="th" scope="row">
                {row.timestamp}
              </TableCell>
              <TableCell align="right">{row.eventType}</TableCell>
              <TableCell align="right">{row.value1}</TableCell>
              <TableCell align="right">{row.value2}</TableCell>
              <TableCell align="right">{row.value3}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface DataTableProps {
  events: Array<RawEvent>
}

export default DataTable;
