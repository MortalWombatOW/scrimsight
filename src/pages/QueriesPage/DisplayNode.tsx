import React from 'react';
import {
  Card,
  Typography,
  Chip,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  DataNode,
  DataNodeMetadata,
  DataColumn,
} from '../../WombatDataFramework/DataTypes';
import './DisplayNode.scss';

interface DataNodeProps {
  node: DataNode<object>;
}

function DisplayNode({node}: DataNodeProps) {
  const columns: DataColumn<object>[] = node.getColumns();
  const rows: object[] = node.getOutput() || [];
  const metadata: DataNodeMetadata | undefined = node.getMetadata();

  // --- Functional Components ---

  const Executions = () => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={columns.length}>
            <Typography variant="subtitle1">Query execution history</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Duration (ms)</TableCell>
          <TableCell>Input Rows</TableCell>
          <TableCell>Output Rows</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {metadata!.executions.map((execution, index) => (
          <TableRow key={index}>
            <TableCell>{execution.getDuration()}</TableCell>
            <TableCell>{execution.getInputRows()}</TableCell>
            <TableCell>{execution.getOutputRows()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const QueryOutput = () => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={columns.length} className="query-output">
            <Typography variant="subtitle1">Query output</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          {columns.map((column, index) => (
            <TableCell
              key={index}
              className={column.missingData ? 'missing-data' : ''}>
              {column.name}{' '}
              {column.missingData && (
                <Chip label="Missing Data" color="secondary" />
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column, index) => (
              <TableCell key={index}>{row[column.name]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // --- Main Component Render ---

  return (
    <Card>
      <CardContent>
        <Typography variant="h3">{node.getDisplayName()}</Typography>
        <Typography variant="body1">ID: {node.getName()}</Typography>
        <Typography variant="body1">{node.getDescription()}</Typography>

        {node.isRunning() && <LinearProgress />}

        {metadata && (
          <div>
            <Executions />
            <QueryOutput />
          </div>
        )}

        {node.hasError() && (
          <Typography color="error" variant="body2">
            Error: {node.getError()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default DisplayNode;
