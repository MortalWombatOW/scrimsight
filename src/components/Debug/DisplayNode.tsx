import React from 'react';

import {DataNode, DataNodeMetadata} from '../../lib/data/DataTypes';

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

// Props definition for the DataNodeComponent
interface DataNodeProps<OutType> {
  node: DataNode<OutType>;
}

// The DataNodeComponent itself
function DataNodeComponent<OutType>({node}: DataNodeProps<OutType>) {
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

  return (
    <Card raised>
      <CardContent>
        <Typography variant="h6">{node.getName()}</Typography>
        {node.isRunning() && <LinearProgress />}
        {node.getMetadata() && (
          <div>
            <Typography variant="subtitle1">Execution Details:</Typography>
            {renderExecutions(node.getMetadata()!)}
            <div>
              <Typography variant="subtitle1">Output:</Typography>
              <pre>{JSON.stringify(node.getOutput(), null, 2)}</pre>
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

export default DataNodeComponent;
