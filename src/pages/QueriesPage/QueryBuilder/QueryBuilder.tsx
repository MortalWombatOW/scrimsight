import React, {ChangeEvent, useState, useEffect} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {SelectExpression, basicExpr, column, JoinCondition, WhereCondition, OrderByCondition} from '../../../WombatDataFramework/AlaSQLQueryBuilder';
import {useDataManager} from '../../../WombatDataFramework/DataContext';
import {DataNodeName} from '../../../WombatDataFramework/DataNode';
import useQueryBuilder from '../../../WombatDataFramework/hooks/useQueryBuilder';
import DataNodeFactory from '../../../WombatDataFramework/DataNodeFactory';
import {DataColumn} from '../../../WombatDataFramework/DataColumn';
import {MenuItem, TextField, Box, Button, List, ListItem, ListItemText, IconButton, Typography, ButtonGroup} from '../../../WombatUI/WombatUI';
import {format} from 'sql-formatter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';

import './QueryBuilder.scss';
import SelectExpressionBuilder from './SelectConditionBuilder/SelectConditionBuilder';
import {useDeepEffect} from '../../../hooks/useDeepEffect';
import {ListItemAvatar} from '@mui/material';

interface QueryBuilderColumn {
  source: DataNodeName;
  column: DataColumn;
}

function JoinClauseBuilder(props) {
  return (
    <div className="query-builder-form-group">
      {/* <Typography variant="h3">Join Nodes</Typography> */}
      <List>
        {props.joinNodes.map((joinNode, index) => (
          <ListItem key={index}>
            <ListItemText primary={joinNode.nodeName} />
            <IconButton edge="end" aria-label="delete" onClick={() => props.handleRemoveJoinNode(index)}>
              <DeleteIcon />
            </IconButton>
            <Typography variant="body2" className="query-builder-join-on">
              ON
            </Typography>
            <List>
              {joinNode.conditions.map((condition, conditionIndex) => (
                <ListItem key={conditionIndex}>
                  <TextField
                    select
                    size="small"
                    value={condition.leftColumn.name}
                    onChange={(e) => {
                      const newJoinNodes = [...props.joinNodes];
                      newJoinNodes[index].conditions[conditionIndex].leftColumn = column(condition.leftColumn.source, e.target.value);
                      props.setJoinNodes(newJoinNodes);
                    }}>
                    {props.availableColumns
                      .filter((qbColumn) => qbColumn.source === condition.leftColumn.source)
                      .map((qbColumn) => (
                        <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
                          {`${qbColumn.source}.${qbColumn.column.name}`}
                        </MenuItem>
                      ))}
                  </TextField>
                  <TextField
                    select
                    size="small"
                    value={condition.operator}
                    onChange={(e) => {
                      const newJoinNodes = [...props.joinNodes];
                      newJoinNodes[index].conditions[conditionIndex].operator = e.target.value as '=' | '!=' | '>' | '<' | '>=' | '<=';
                      props.setJoinNodes(newJoinNodes);
                    }}>
                    <MenuItem value={'='}>is</MenuItem>
                    <MenuItem value={'!='}>is not</MenuItem>
                    <MenuItem value={'>'}>is greater than</MenuItem>
                    <MenuItem value={'<'}>is less than</MenuItem>
                    <MenuItem value={'>='}>is at least</MenuItem>
                    <MenuItem value={'<='}>is at most</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    value={condition.rightColumn.name}
                    onChange={(e) => {
                      const newJoinNodes = [...props.joinNodes];
                      newJoinNodes[index].conditions[conditionIndex].rightColumn = column(condition.rightColumn.source, e.target.value);
                      props.setJoinNodes(newJoinNodes);
                    }}>
                    {props.availableColumns
                      .filter((qbColumn) => qbColumn.source === condition.rightColumn.source)
                      .map((qbColumn) => (
                        <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
                          {`${qbColumn.source}.${qbColumn.column.name}`}
                        </MenuItem>
                      ))}
                  </TextField>
                  <IconButton edge="end" aria-label="delete" onClick={() => props.handleRemoveJoinCondition(index, conditionIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>

            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => props.handleAddJoinCondition(index)}>
              Add Join Condition
            </Button>
          </ListItem>
        ))}
      </List>

      <TextField select size="small" id="join-node-select" value={''} onChange={(e) => props.handleAddJoinNode(e.target.value as DataNodeName)} label="Join Node">
        {props.joinableNodes.map((nodeName) => (
          <MenuItem key={nodeName} value={nodeName}>
            {nodeName}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

function SelectClauseBuilder({nodes, selectExpressions, setSelectExpressions}) {
  const [isRequestingOutput, setIsRequestingOutput] = useState<boolean>(false);
  const [isRequestingReset, setIsRequestingReset] = useState<boolean>(false);
  const [isValidExpression, setIsValidExpression] = useState<boolean>(false);

  return (
    <div className="query-builder-form-group">
      {/* <Typography variant="h3">Select Expressions</Typography> */}
      <div className="query-builder-select-expressions">
        <SelectExpressionBuilder
          outputExpression={(newExpression) => {
            const newSelectExpressions = [...selectExpressions, newExpression];
            setSelectExpressions(newSelectExpressions);
          }}
          nodes={nodes}
          isRequestingOutput={isRequestingOutput}
          setIsRequestingOutput={setIsRequestingOutput}
          isRequestingReset={isRequestingReset}
          setIsRequestingReset={setIsRequestingReset}
          setIsValidExpression={setIsValidExpression}
        />
        <ButtonGroup>
          <Button variant="outlined" onClick={() => setIsRequestingReset(true)} disabled={isRequestingOutput || isRequestingReset}>
            <RestartAltIcon />
          </Button>
          <Button variant="outlined" onClick={() => setIsRequestingOutput(true)} disabled={isRequestingOutput || isRequestingReset || !isValidExpression}>
            <CheckIcon />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

function WhereClauseBuilder(props) {
  return (
    <div className="query-builder-form-group">
      {/* <Typography variant="h3">Where Conditions</Typography> */}
      <List>
        {props.whereConditions.map((whereCondition, index) => (
          <ListItem key={index}>
            <WhereConditionBuilder
              condition={whereCondition}
              onChange={(newCondition) => {
                const newWhereConditions = [...props.whereConditions];
                newWhereConditions[index] = newCondition;
                props.setWhereConditions(newWhereConditions);
              }}
              availableColumns={props.availableColumns}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => props.handleRemoveWhereCondition(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={props.handleAddWhereCondition}>
        Add Where Condition
      </Button>
    </div>
  );
}

function GroupByClauseBuilder(props) {
  return (
    <div className="query-builder-form-group">
      {/* <Typography variant="h3">Group By Columns</Typography> */}
      <List>
        {props.groupByColumns.map((groupByColumn, index) => (
          <ListItem key={index}>
            <TextField
              select
              size="small"
              value={groupByColumn.column.name}
              onChange={(e) => {
                const newGroupByColumns = [...props.groupByColumns];
                newGroupByColumns[index] = {
                  source: groupByColumn.source,
                  column: props.availableColumns.find((c) => c.column.name === e.target.value)?.column as DataColumn,
                };
                props.setGroupByColumns(newGroupByColumns);
              }}>
              {props.availableColumns.map((qbColumn) => (
                <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
                  {`${qbColumn.source}.${qbColumn.column.name}`}
                </MenuItem>
              ))}
            </TextField>
            <IconButton edge="end" aria-label="delete" onClick={() => props.handleRemoveGroupByColumn(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={props.handleAddGroupByColumn}>
        Add Group By Column
      </Button>
    </div>
  );
}

function OrderByClauseBuilder(props) {
  return (
    <div className="query-builder-form-group">
      {/* <Typography variant="h3">Order By Columns</Typography> */}
      <List>
        {props.orderByColumns.map((orderByColumn, index) => (
          <ListItem key={index}>
            <OrderByConditionBuilder
              condition={orderByColumn}
              onChange={(newCondition) => {
                const newOrderByColumns = [...props.orderByColumns];
                newOrderByColumns[index] = newCondition;
                props.setOrderByColumns(newOrderByColumns);
              }}
              availableColumns={props.availableColumns}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => props.handleRemoveOrderByColumn(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={props.handleAddOrderByColumn}>
        Add Order By Column
      </Button>
    </div>
  );
}

const QueryBuilder: React.FC = () => {
  const dataManager = useDataManager();
  const factory = new DataNodeFactory(dataManager);
  const {setSource, getSource, addJoin, select, where, groupBy, orderBy, build, findErrors, reset} = useQueryBuilder();

  const [selectedSourceNode, setSelectedSourceNode] = useState<DataNodeName | undefined>(undefined);
  const [joinNodes, setJoinNodes] = useState<{nodeName: DataNodeName; conditions: JoinCondition[]}[]>([]);
  const [selectExpressions, setSelectExpressions] = useState<SelectExpression[]>([]);
  const [whereConditions, setWhereConditions] = useState<WhereCondition[]>([]);
  const [groupByColumns, setGroupByColumns] = useState<QueryBuilderColumn[]>([]); // Updated to store structured data
  const [orderByColumns, setOrderByColumns] = useState<OrderByCondition[]>([]); // Updated to store structured data

  const [queryString, setQueryString] = useState<string>(build());
  const [errors, setErrors] = useState<string[]>(findErrors());

  // New state for node name
  const [nodeName, setNodeName] = useState('');

  useEffect(() => {
    reset();
    if (!selectedSourceNode) {
      return;
    }
    setSource(selectedSourceNode);
    select(selectExpressions);
    joinNodes.forEach((joinNode) => addJoin('JOIN', joinNode.nodeName, joinNode.conditions));
    where(whereConditions);
    groupBy(groupByColumns.map((qbColumn) => column(qbColumn.source, qbColumn.column.name))); // Extract column objects for groupBy
    orderBy(orderByColumns); // Pass directly as it's already structured

    const query = build();
    let formatted: string;
    try {
      formatted = format(query);
    } catch (e) {
      formatted = query;
    }

    setQueryString(formatted);

    setErrors(findErrors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedSourceNode), JSON.stringify(joinNodes), JSON.stringify(selectExpressions), JSON.stringify(whereConditions), JSON.stringify(groupByColumns), JSON.stringify(orderByColumns)]);

  // Track available columns for selection
  const [availableColumns, setAvailableColumns] = useState<QueryBuilderColumn[]>([]);

  const handleSourceNodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSourceNode = event.target.value as DataNodeName;
    setSelectedSourceNode(newSourceNode);

    // Update available columns when source node changes
    setAvailableColumns((availableColumns) => [
      ...availableColumns,
      ...dataManager
        .getNodeOrDie(newSourceNode)
        .getColumns()
        .map((column) => ({source: newSourceNode, column})),
    ]);
  };

  const handleAddJoinNode = (nodeName: DataNodeName) => {
    const sourceNode = getSource()!;
    const sourceColumns = dataManager.getNodeOrDie(sourceNode).getColumns();
    const joinNodeColumns = dataManager.getNodeOrDie(nodeName).getColumns();
    const defaultCondition: JoinCondition = {
      leftColumn: column(sourceNode, sourceColumns[0].name),
      operator: '=',
      rightColumn: column(nodeName, joinNodeColumns[0].name),
    };

    setJoinNodes([...joinNodes, {nodeName, conditions: [defaultCondition]}]); // Add default condition

    // Update available columns when a join node is added
    setAvailableColumns((availableColumns) => [
      ...availableColumns,
      ...dataManager
        .getNodeOrDie(nodeName)
        .getColumns()
        .map((column) => ({source: nodeName, column})),
    ]);
  };

  const handleRemoveJoinNode = (index: number) => {
    const removedNode = joinNodes[index].nodeName;
    setJoinNodes(joinNodes.filter((_, i) => i !== index));

    // Update available columns when a join node is removed
    setAvailableColumns((availableColumns) => availableColumns.filter((qbColumn) => qbColumn.source !== removedNode));
  };

  const handleAddJoinCondition = (joinNodeIndex: number) => {
    const newJoinNodes = [...joinNodes];
    newJoinNodes[joinNodeIndex].conditions.push({leftColumn: column(getSource()!, ''), operator: '=', rightColumn: column(joinNodes[joinNodeIndex].nodeName, '')});
    setJoinNodes(newJoinNodes);
  };

  const handleRemoveJoinCondition = (joinNodeIndex: number, conditionIndex: number) => {
    const newJoinNodes = [...joinNodes];
    newJoinNodes[joinNodeIndex].conditions.splice(conditionIndex, 1);
    setJoinNodes(newJoinNodes);
  };

  const handleAddSelectExpression = () => {
    setSelectExpressions([...selectExpressions, basicExpr(column(getSource()!, ''))]);
  };

  const handleRemoveSelectExpression = (index: number) => {
    setSelectExpressions(selectExpressions.filter((_, i) => i !== index));
  };

  const handleAddWhereCondition = () => {
    setWhereConditions([...whereConditions, {leftColumn: column(getSource()!, ''), operator: '=', rightValue: ''}]);
  };

  const handleRemoveWhereCondition = (index: number) => {
    setWhereConditions(whereConditions.filter((_, i) => i !== index));
  };

  // Updated GroupBy handlers
  const handleAddGroupByColumn = () => {
    setGroupByColumns([...groupByColumns, availableColumns[0]]);
  };

  const handleRemoveGroupByColumn = (index: number) => {
    setGroupByColumns(groupByColumns.filter((_, i) => i !== index));
  };

  const handleAddOrderByColumn = () => {
    setOrderByColumns([...orderByColumns, {column: column(availableColumns[0].source, availableColumns[0].column.name), direction: 'ASC'}]); // Create Column object
  };

  const handleRemoveOrderByColumn = (index: number) => {
    setOrderByColumns(orderByColumns.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Generate node name based on input field
    const generatedNodeName = nodeName.toLowerCase().replace(/\s+/g, '_');

    // TODO: Implement query building and execution logic
    // For now, just log the query
    const node = factory.makeAlaSQLNode({
      name: generatedNodeName, // Use generated node name
      displayName: nodeName, // Use display name from input
      sql: queryString,
      sources: [selectedSourceNode!, ...joinNodes.map((node) => node.nodeName)],
      columnNames: selectExpressions.map((expr) => (expr.type === 'basic' ? expr.column.name : expr.type === 'rename' ? expr.name : 'TODO')),
    });
    dataManager.registerNode(node);
    dataManager.executeNode(node.getName());
    //reset
    setSelectedSourceNode(undefined);
    setJoinNodes([]);
    setSelectExpressions([]);
    setWhereConditions([]);
    setGroupByColumns([]);
    setOrderByColumns([]);
    setAvailableColumns([]);
    setQueryString('');
    setErrors([]);
    setNodeName(''); // Reset node name input
  };

  const nodeNames = dataManager.getNodeNames().filter((nodeName) => dataManager.getNodeOrDie(nodeName).getColumns().length > 0);
  const joinableNodes = selectedSourceNode ? factory.getJoinableNodes([selectedSourceNode, ...joinNodes.map((node) => node.nodeName)]) : [];

  return (
    <div>
      <Typography variant="h2" data-testid="query-builder-title" gutterBottom>
        Query Builder
      </Typography>
      <div className="query-builder-container">
        <div className="query-builder-form">
          <div className="query-builder-form-group">
            <TextField label="Node Name" value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
          </div>
          <div className="query-builder-form-group">
            <Typography variant="h3">Select Source Node</Typography>
            <TextField select id="source-node-select" value={selectedSourceNode || ''} onChange={handleSourceNodeChange} label="Source Node">
              {nodeNames.map((nodeName) => (
                <MenuItem key={nodeName} value={nodeName}>
                  {nodeName}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {selectedSourceNode && (
            <>
              <JoinClauseBuilder
                joinNodes={joinNodes}
                setJoinNodes={setJoinNodes}
                availableColumns={availableColumns}
                handleAddJoinNode={handleAddJoinNode}
                handleRemoveJoinNode={handleRemoveJoinNode}
                handleAddJoinCondition={handleAddJoinCondition}
                handleRemoveJoinCondition={handleRemoveJoinCondition}
                joinableNodes={joinableNodes}
              />

              <SelectClauseBuilder nodes={[selectedSourceNode, ...joinNodes.map((node) => node.nodeName)]} selectExpressions={selectExpressions} setSelectExpressions={setSelectExpressions} />
              <WhereClauseBuilder
                whereConditions={whereConditions}
                setWhereConditions={setWhereConditions}
                availableColumns={availableColumns}
                handleAddWhereCondition={handleAddWhereCondition}
                handleRemoveWhereCondition={handleRemoveWhereCondition}
              />
              <GroupByClauseBuilder
                groupByColumns={groupByColumns}
                setGroupByColumns={setGroupByColumns}
                availableColumns={availableColumns}
                handleAddGroupByColumn={handleAddGroupByColumn}
                handleRemoveGroupByColumn={handleRemoveGroupByColumn}
              />

              <OrderByClauseBuilder
                orderByColumns={orderByColumns}
                setOrderByColumns={setOrderByColumns}
                availableColumns={availableColumns}
                handleAddOrderByColumn={handleAddOrderByColumn}
                handleRemoveOrderByColumn={handleRemoveOrderByColumn}
              />
            </>
          )}

          <Button variant="contained" onClick={handleSubmit} disabled={errors.length > 0}>
            Submit Query
          </Button>
        </div>
        <div className="query-builder-preview">
          {selectedSourceNode && errors.length === 0 && (
            <>
              <Typography variant="h3">Query String</Typography>
              <pre data-testid="query-string">{queryString}</pre>
            </>
          )}

          {errors.length > 0 && (
            <div className="query-builder-errors">
              <Typography variant="h3" color="error">
                Errors
              </Typography>
              <List>
                {errors.map((error) => (
                  <ListItem key={error}>
                    <ListItemText primary={error} primaryTypographyProps={{color: 'error'}} />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WhereConditionBuilder: React.FC<{condition: WhereCondition; onChange: (condition: WhereCondition) => void; availableColumns: QueryBuilderColumn[]}> = ({condition, onChange, availableColumns}) => {
  const handleChange = (newCondition: WhereCondition) => {
    onChange(newCondition);
  };

  return (
    <Box sx={{display: 'flex', gap: 2}}>
      <TextField select size="small" value={condition.leftColumn.name} onChange={(e) => handleChange({...condition, leftColumn: column(condition.leftColumn.source, e.target.value)})} label="Column">
        {availableColumns
          .filter((qbColumn) => qbColumn.source === condition.leftColumn.source)
          .map((qbColumn) => (
            <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
              {`${qbColumn.source}.${qbColumn.column.name}`}
            </MenuItem>
          ))}
      </TextField>
      <TextField select size="small" value={condition.operator} onChange={(e) => handleChange({...condition, operator: e.target.value as '=' | '!=' | '>' | '<' | '>=' | '<='})} label="Operator">
        <MenuItem value={'='}>is</MenuItem>
        <MenuItem value={'!='}>is not</MenuItem>
        <MenuItem value={'>'}>is greater than</MenuItem>
        <MenuItem value={'<'}>is less than</MenuItem>
        <MenuItem value={'>='}>is at least</MenuItem>
        <MenuItem value={'<='}>is at most</MenuItem>
      </TextField>
      <TextField size="small" value={condition.rightValue} onChange={(e) => handleChange({...condition, rightValue: e.target.value})} label="Value" />
    </Box>
  );
};

const OrderByConditionBuilder: React.FC<{condition: OrderByCondition; onChange: (condition: OrderByCondition) => void; availableColumns: QueryBuilderColumn[]}> = ({condition, onChange, availableColumns}) => {
  const handleChange = (newCondition: OrderByCondition) => {
    onChange(newCondition);
  };

  return (
    <Box sx={{display: 'flex', gap: 2}}>
      <TextField select size="small" value={condition.column.name} onChange={(e) => handleChange({...condition, column: column(condition.column.source, e.target.value)})} label="Column">
        {availableColumns.map((qbColumn) => (
          <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
            {`${qbColumn.source}.${qbColumn.column.name}`}
          </MenuItem>
        ))}
      </TextField>
      <TextField select size="small" value={condition.direction} onChange={(e) => handleChange({...condition, direction: e.target.value as 'ASC' | 'DESC'})} label="Direction">
        <MenuItem value={'ASC'}>ASC</MenuItem>
        <MenuItem value={'DESC'}>DESC</MenuItem>
      </TextField>
    </Box>
  );
};

export default QueryBuilder;
