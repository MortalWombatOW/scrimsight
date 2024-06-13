import React from 'react';
import {Card, Typography, Chip, CardContent, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import {DataNode} from '../../WombatDataFramework/DataNode';
import './DisplayNode.scss';
import {DataColumn} from '../../WombatDataFramework/DataColumn';

interface DataNodeProps {
  node: DataNode<object>;
}

function DisplayNode({node}: DataNodeProps) {
  const columns: DataColumn[] = node.getColumns();
  const rows: object[] = node.getOutput() || [];

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
        {node.getExecutions().map((execution, index) => (
          <TableRow key={index}>
            <TableCell>{execution.endTime - execution.startTime}</TableCell>
            <TableCell>{execution.inputRows}</TableCell>
            <TableCell>{execution.outputRows}</TableCell>
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
            <TableCell key={index}>{column.name} </TableCell>
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

        <Executions />
        <QueryOutput />

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
