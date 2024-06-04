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

const Infobox = () => {
  const {data, fields} = useDataDisplayContext();
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell
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
              <TableCell
                sx={{
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  borderBottomColor: 'info.dark',
                }}>
                <Typography variant="h6">
                  {field.formatter
                    ? field.formatter(data[0]?.[field.id])
                    : data[0]?.[field.id]}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Infobox;
