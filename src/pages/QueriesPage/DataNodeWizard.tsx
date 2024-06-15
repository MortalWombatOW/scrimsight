import React, {useEffect, useMemo, useState} from 'react';
import {useDataManager} from '../../WombatDataFramework/DataContext';
import DataManager from '../../WombatDataFramework/DataManager';
import DataNodeFactory from '../../WombatDataFramework/DataNodeFactory';
import {Autocomplete, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from '@mui/material';
import './DataNodeWizard.scss';
const DataNodeSelector = ({dataManager, factory, selectedNodes, setSelectedNodes}: {dataManager: DataManager; factory: DataNodeFactory; selectedNodes: string[]; setSelectedNodes: (nodes: string[]) => void}) => {
  const allNodes = dataManager.getNodeList(true);

  const options =
    selectedNodes.length === 0
      ? allNodes.map((node) => {
          return {
            label: node.getDisplayName(),
            id: node.getName(),
          };
        })
      : factory.getJoinableNodes(selectedNodes).map((node) => {
          return {
            label: dataManager.getNodeOrDie(node).getDisplayName(),
            id: node,
          };
        });
  return (
    <div className="data-node-selector">
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.label}
        value={allNodes.filter((node) => selectedNodes.includes(node.getName())).map((node) => ({label: node.getDisplayName(), id: node.getName()}))}
        onChange={(_, newValue) => {
          console.log('New value is: ', newValue);
          setSelectedNodes(newValue.map((node) => node.id));
        }}
        renderInput={(params) => <TextField className="data-node-selector-input" {...params} label="Data Nodes" />}
      />
    </div>
  );
};

const SelectedSources = ({
  selectedNodesNames,
  factory,
  joinColumns,
  setJoinColumns,
  selectedColumns,
  setSelectedColumns,
}: {
  selectedNodesNames: string[];
  factory: DataNodeFactory;
  joinColumns: string[];
  setJoinColumns: (columns: string[]) => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
}) => {
  const dataManager = useDataManager();
  const selectedNodes = selectedNodesNames.map((name) => dataManager.getNodeOrDie(name));

  const sharedColumns = useMemo(() => factory.getSharedColumns(selectedNodesNames), [factory, selectedNodesNames]);

  const maxColumns = selectedNodes.reduce((acc, node) => Math.max(acc, node.getColumns().length), 0) - sharedColumns.length;

  const nonSharedColumnsPerNode: Record<string, string[]> = selectedNodes.reduce((acc, node) => {
    acc[node.getName()] = node
      .getColumns()
      .filter((column) => !sharedColumns.includes(column))
      .map((column) => column.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          {selectedNodes.map((node, index) => (
            <TableCell key={index}>{node.getDisplayName()}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {sharedColumns.map((column, index) => (
          <TableRow key={index}>
            <TableCell>
              <Button
                onClick={() => {
                  if (joinColumns.includes(column.name)) {
                    setJoinColumns(joinColumns.filter((name) => name !== column.name));
                  } else {
                    setJoinColumns([...joinColumns, column.name]);
                  }
                }}
                variant="contained"
                color="primary">
                {joinColumns.includes(column.name) ? 'Remove from join' : 'Add to join'}
              </Button>
            </TableCell>
            {selectedNodes.map((node, nodeIndex) => (
              <TableCell key={nodeIndex} className="shared-column">
                {sharedColumns[index].name}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {Array.from({length: maxColumns}).map((_, index) => (
          <TableRow key={index}>
            <TableCell>Click to select</TableCell>
            {selectedNodes.map((node, nodeIndex) => (
              <TableCell key={nodeIndex}>{nonSharedColumnsPerNode[node.getName()][index]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const DataNodeWizard = () => {
  const dataManager = useDataManager();
  const factory = useMemo(() => new DataNodeFactory(dataManager), [dataManager]);

  const [sourceNodes, setSourceNodes] = useState<string[]>([]);
  const [joinColumns, setJoinColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  return (
    <>
      <Typography variant="h3">Add query</Typography>
      <Typography variant="body1">{sourceNodes.length === 0 ? 'Select the source data nodes.' : 'Add data nodes to join.'}</Typography>
      <DataNodeSelector dataManager={dataManager} factory={factory} selectedNodes={sourceNodes} setSelectedNodes={setSourceNodes} />
      <SelectedSources selectedNodesNames={sourceNodes} factory={factory} joinColumns={joinColumns} setJoinColumns={setJoinColumns} selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} />
    </>
  );
};

export default DataNodeWizard;
