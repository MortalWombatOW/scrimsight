import React from 'react';

import {
  AlaSQLNode,
  DataNode,
  DataNodeMetadata,
  JoinNode,
  NodeState,
  ObjectStoreNode,
  TransformNode,
  WriteNode,
} from '../../lib/data/types';

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
            <TableCell>{execution.duration}</TableCell>
            <TableCell>{execution.inputRows}</TableCell>
            <TableCell>{execution.outputRows}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Function to determine the color of the state chip based on the node state
  const stateColor = (
    state: NodeState,
  ): 'default' | 'warning' | 'info' | 'success' | 'error' => {
    switch (state) {
      case 'pending':
        return 'warning';
      case 'running':
        return 'info';
      case 'done':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card raised>
      <CardContent>
        <Typography variant="h6">{node.name}</Typography>
        <Chip label={node.state} color={stateColor(node.state)} />
        {node.state === 'running' && <LinearProgress />}
        {node.metadata && (
          <div>
            <Typography variant="subtitle1">Execution Details:</Typography>
            {renderExecutions(node.metadata)}
            <div>
              <Typography variant="subtitle1">Output:</Typography>
              <pre>{JSON.stringify(node.output, null, 2)}</pre>
            </div>
          </div>
        )}
        {node.error && (
          <Typography color="error" variant="body2">
            Error: {node.error}
          </Typography>
        )}
        {/* You can further expand this component based on the specific properties of different node types */}
      </CardContent>
    </Card>
  );
}

export default DataNodeComponent;
