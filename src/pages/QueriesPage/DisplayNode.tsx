import React from 'react';

import {DataNode, DataNodeMetadata} from '../../WombatDataFramework/DataTypes';

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

interface DataNodeProps {
  node: DataNode<object>;
}

function DisplayNode({node}: DataNodeProps) {
  // Helper function to render execution statistics
  const renderExecutions = (metadata: DataNodeMetadata) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Duration (ms)</TableCell>
          <TableCell>Input Rows</TableCell>
          <TableCell>Output Rows</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {metadata.executions.map((execution, index) => (
          <TableRow key={index}>
            <TableCell>{execution.getDuration()}</TableCell>
            <TableCell>{execution.getInputRows()}</TableCell>
            <TableCell>{execution.getOutputRows()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const columns: string[] = node.getColumns();
  const rows: object[] = node.getOutput() || [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h3">{node.getName()}</Typography>
        {node.isRunning() && <LinearProgress />}
        {node.getMetadata() && (
          <div>
            <Typography variant="subtitle1">Execution Details:</Typography>
            {renderExecutions(node.getMetadata()!)}
            <div>
              <Typography variant="subtitle1">Output:</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell key={index}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column, index) => (
                        <TableCell key={index}>{row[column]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
