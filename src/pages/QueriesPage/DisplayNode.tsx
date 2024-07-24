import React from 'react';
import {Card, Typography, CardContent, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import {DataNode} from '../../WombatDataFramework/DataNode';
import './DisplayNode.scss';
import {DataColumn} from '../../WombatDataFramework/DataColumn';
import DataFetcher from '../../WombatDataFramework/components/DataFetcher';
import DataTable from '../../WombatDataFramework/components/DataTable';

interface DataNodeProps {
  node: DataNode<object>;
}

function DisplayNode({node}: DataNodeProps) {
  const columns: DataColumn[] = node.getColumns();
  const rows: object[] = node.getOutput() || [];

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

  return (
    <>
      <Typography variant="h3">{node.getDisplayName()}</Typography>
      <Typography variant="body1">ID: {node.getName()}</Typography>

      {node.isRunning() && <LinearProgress />}

      <Executions />
      <DataFetcher nodeName={node.getName()} renderContent={(dataResult) => <DataTable dataResult={dataResult} />} />

      {node.hasError() && (
        <Typography color="error" variant="body2">
          Error: {node.getError()}
        </Typography>
      )}

      <pre>{node.getDescription()}</pre>
    </>
  );
}

export default DisplayNode;
