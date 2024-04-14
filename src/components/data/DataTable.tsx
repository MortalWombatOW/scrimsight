import React from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {useDataDisplayContext} from '../../context/DataDisplayContextProvider';

const DataTable = () => {
  const {data, fields} = useDataDisplayContext();
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{field: 'bold'}}>
            {fields.map((field) => (
              <TableCell
                key={field.id}
                sx={{
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  borderBottomColor: 'info.dark',
                }}>
                <Button variant="text" color="info">
                  <Typography variant="h5">{field.displayName}</Typography>
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((data: any, i: number) => (
            <TableRow key={i}>
              {fields.map((field) => (
                <TableCell
                  key={field.id}
                  sx={{
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderTop: 'none',
                    borderBottomColor: 'info.dark',
                  }}>
                  <Typography variant="h6">
                    {field.formatter
                      ? field.formatter(data[field.id])
                      : data[field.id]}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
