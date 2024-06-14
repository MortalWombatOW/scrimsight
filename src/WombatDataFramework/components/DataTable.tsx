import React, {useMemo} from 'react';
import {DataResult} from './DataFetcher';
import {DataColumn, DataColumnType} from '../DataColumn';
import {Button, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, Tooltip, Typography} from '@mui/material';
import './styles.scss';
import useSortedData from '../hooks/useSortedData';
import usePagination from '../hooks/usePagination';

interface DataTableProps {
  dataResult: DataResult<object>;
}

const DataColumnHeaderCell: React.FC<{column: DataColumn; sorted: 'asc' | 'desc' | undefined; onSelected: () => void}> = ({column, sorted, onSelected}) => {
  const align = column.dataType === 'number' ? 'right' : 'left';
  return (
    <TableCell align={align}>
      <Tooltip title={column.description}>
        <TableSortLabel active={sorted !== undefined} direction={sorted} onClick={onSelected}>
          <Typography variant="subtitle1" className="fit-content">
            {column.displayName}
          </Typography>
        </TableSortLabel>
      </Tooltip>
    </TableCell>
  );
};

const DataRowCell: React.FC<{value: DataColumnType; column: DataColumn; setFilter?: (key: string, value: DataColumnType) => void}> = ({value, column, setFilter}) => {
  const align = column.dataType === 'number' ? 'right' : 'left';
  return (
    <TableCell align={align}>
      <Tooltip title={`Click to filter to ${column.displayName} = ${column.formatter(value)}`}>
        {setFilter === undefined ? (
          <Typography variant="body2">{column.formatter(value)}</Typography>
        ) : (
          <Button variant="text" color="inherit" onClick={() => setFilter(column.name, value)}>
            {column.formatter(value)}
          </Button>
        )}
      </Tooltip>
    </TableCell>
  );
};

const DataTable: React.FC<DataTableProps> = ({dataResult}) => {
  const {data, columns, setFilter} = dataResult;

  const {sortedData, sortColumn, sortDirection, onSortSelection} = useSortedData(data, columns);
  const {pageData, rowsPerPage, page, setRowsPerPage, setPage} = usePagination(sortedData);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <DataColumnHeaderCell key={index} column={column} sorted={sortColumn === column.name ? sortDirection : undefined} onSelected={() => onSortSelection(column.name)} />
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {pageData.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column, index) => (
              <DataRowCell key={index} value={row[column.name]} column={column} setFilter={setFilter} />
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination count={sortedData.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(e, newPage) => setPage(newPage)} onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DataTable;
