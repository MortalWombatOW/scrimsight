import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, TextField, Box, Button, List, ListItem, ListItemText, IconButton, Typography, Card, CardContent, CardActions} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  SelectExpression,
  basicExpr,
  column,
  aggregateExpr,
  renameExpr,
  arithmeticExpr,
  constantExpr,
  JoinCondition,
  WhereCondition,
  OrderByCondition,
  SelectAggregateExpression,
  SelectArithmeticExpression,
  SelectBasicExpression,
  SelectConstantExpression,
  buildSelectExpression,
} from '../../WombatDataFramework/AlaSQLQueryBuilder';
import {useDataManager} from '../../WombatDataFramework/DataContext';
import {DataNodeName} from '../../WombatDataFramework/DataNode';
import useQueryBuilder from '../../WombatDataFramework/hooks/useQueryBuilder';
import DataNodeFactory from '../../WombatDataFramework/DataNodeFactory';
import {DataColumn} from '../../WombatDataFramework/DataColumn';
import {format} from 'sql-formatter';

import './QueryBuilder.scss';

interface QueryBuilderColumn {
  source: DataNodeName;
  column: DataColumn;
}

function JoinClauseBuilder(props) {
  return (
    <div className="query-builder-form-group">
      <Typography variant="h3">Join Nodes</Typography>
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

      <TextField select id="join-node-select" value={''} onChange={(e) => props.handleAddJoinNode(e.target.value as DataNodeName)} label="Join Node">
        {props.joinableNodes.map((nodeName) => (
          <MenuItem key={nodeName} value={nodeName}>
            {nodeName}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

function SelectClauseBuilder(props) {
  return (
    <div className="query-builder-form-group">
      <Typography variant="h3">Select Expressions</Typography>
      <List>
        {props.selectExpressions.map((selectExpression, index) => (
          <ListItem key={index}>
            <SelectExpressionBuilder
              expression={selectExpression}
              onChange={(newExpression) => {
                const newSelectExpressions = [...props.selectExpressions];
                newSelectExpressions[index] = newExpression;
                props.setSelectExpressions(newSelectExpressions);
              }}
              availableColumns={props.availableColumns}
              getSource={props.getSource}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => props.handleRemoveSelectExpression(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={props.handleAddSelectExpression}>
        Add Select Expression
      </Button>
    </div>
  );
}

function WhereClauseBuilder(props) {
  return (
    <div className="query-builder-form-group">
      <Typography variant="h3">Where Conditions</Typography>
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
      <Typography variant="h3">Group By Columns</Typography>
      <List>
        {props.groupByColumns.map((groupByColumn, index) => (
          <ListItem key={index}>
            <TextField
              select
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
      <Typography variant="h3">Order By Columns</Typography>
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
    // TODO: Implement query building and execution logic
    // For now, just log the query
    const node = factory.makeAlaSQLNode({
      name: 'TODO_name',
      displayName: 'TODO_displayName',
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

              <SelectClauseBuilder
                getSource={getSource}
                selectExpressions={selectExpressions}
                setSelectExpressions={setSelectExpressions}
                availableColumns={availableColumns}
                handleAddSelectExpression={handleAddSelectExpression}
                handleRemoveSelectExpression={handleRemoveSelectExpression}
              />
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

const SelectExpressionBuilder: React.FC<{
  expression: SelectExpression | null;
  onChange: (expression: SelectExpression) => void;
  availableColumns: QueryBuilderColumn[];
  getSource: () => DataNodeName | undefined; // Add getSource prop
}> = ({expression, onChange, availableColumns, getSource}) => {
  const dataManager = useDataManager();
  const defaultExpression: SelectExpression = {
    type: 'basic',
    column: column(getSource()!, dataManager.getNodeOrDie(getSource()!).getColumns()[0].name),
  };

  const expressionOrDefault = expression || defaultExpression;

  const [expressionType, setExpressionType] = useState<string>(expressionOrDefault.type);
  const [expressionColumn, setExpressionColumn] = useState<QueryBuilderColumn>(
    expressionOrDefault.type === 'basic' ? availableColumns.find((c) => c.column.name === expressionOrDefault.column.name) || availableColumns[0] : availableColumns[0],
  );
  const [expressionColumnExpression, setExpressionColumnExpression] = useState<SelectExpression>(expressionOrDefault.type === 'basic' ? expressionOrDefault : defaultExpression);
  const [expressionAggregate, setExpressionAggregate] = useState<string>(expressionOrDefault.type === 'aggregate' ? expressionOrDefault.aggregate : 'SUM');
  const [expressionOperator, setExpressionOperator] = useState<string>(expressionOrDefault.type === 'arithmetic' ? expressionOrDefault.operator : '+');
  const [expressionLeft, setExpressionLeft] = useState<SelectExpression>(expressionOrDefault.type === 'arithmetic' ? expressionOrDefault.left : defaultExpression);
  const [expressionRight, setExpressionRight] = useState<SelectExpression>(expressionOrDefault.type === 'arithmetic' ? expressionOrDefault.right : defaultExpression);
  const [expressionConstant, setExpressionConstant] = useState<string | number>(expressionOrDefault.type === 'constant' ? expressionOrDefault.value : '');
  const [expressionRename, setExpressionRename] = useState<string>(expressionOrDefault.type === 'rename' ? expressionOrDefault.name : '');

  const handleChange = (newExpression: SelectExpression) => {
    onChange(newExpression);
  };

  const handleExpressionTypeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExpressionType(event.target.value);

    // Reset dependent states when expression type changes
    setExpressionColumn(availableColumns[0]);
    setExpressionAggregate('SUM');
    setExpressionOperator('+');
    setExpressionLeft(defaultExpression);
    setExpressionRight(defaultExpression);
    setExpressionConstant('');
    setExpressionRename('');
  };

  const handleExpressionColumnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedColumn = availableColumns.find((column) => column.column.name === event.target.value);
    if (selectedColumn) {
      setExpressionColumn(selectedColumn);
    }
  };

  const handleExpressionColumnExpressionChange = (newExpression: SelectExpression) => {
    setExpressionColumnExpression(newExpression);
  };

  const handleExpressionAggregateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExpressionAggregate(event.target.value);
  };

  const handleExpressionOperatorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExpressionOperator(event.target.value);
  };

  const handleExpressionLeftChange = (newExpression: SelectExpression) => {
    setExpressionLeft(newExpression);
  };

  const handleExpressionRightChange = (newExpression: SelectExpression) => {
    setExpressionRight(newExpression);
  };

  const handleExpressionConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExpressionConstant(event.target.value);
  };

  const handleExpressionRenameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExpressionRename(event.target.value);
  };

  const buildExpression = (): SelectExpression => {
    switch (expressionType) {
      case 'basic':
        if (!expressionColumn) {
          throw new Error('Expression column is null');
        }
        return basicExpr(column(expressionColumn.source, expressionColumn.column.name));
      case 'aggregate':
        if (!expressionColumn) {
          throw new Error('Expression column is null');
        }
        return aggregateExpr(expressionAggregate as 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN', expressionColumnExpression as SelectBasicExpression | SelectArithmeticExpression);
      case 'arithmetic':
        return arithmeticExpr(
          expressionOperator as '+' | '-' | '*' | '/',
          expressionLeft as SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression,
          expressionRight as SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression,
        );
      case 'constant':
        return constantExpr(expressionConstant);
      case 'rename':
        return renameExpr(expressionLeft as SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression, expressionRename);
      default:
        throw new Error('Unknown expression type');
    }
  };

  useEffect(() => {
    const newExpression = buildExpression();
    handleChange(newExpression);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expressionType, expressionColumn, expressionAggregate, expressionOperator, expressionLeft, expressionRight, expressionConstant, expressionRename, expressionColumnExpression]);

  return (
    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
      <TextField select value={expressionType} onChange={handleExpressionTypeChange} label="Expression Type">
        <MenuItem value={'basic'}>Column</MenuItem>
        <MenuItem value={'aggregate'}>Aggregate</MenuItem>
        <MenuItem value={'arithmetic'}>Arithmetic</MenuItem>
        <MenuItem value={'constant'}>Constant</MenuItem>
        <MenuItem value={'rename'}>Rename</MenuItem>
      </TextField>

      {expressionType === 'basic' && (
        <TextField select value={expressionColumn?.column.name || ''} onChange={handleExpressionColumnChange} label="Column">
          {availableColumns.map((qbColumn) => (
            <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
              {`${qbColumn.source}.${qbColumn.column.name}`}
            </MenuItem>
          ))}
        </TextField>
      )}

      {expressionType === 'aggregate' && (
        <>
          <TextField select value={expressionAggregate} onChange={handleExpressionAggregateChange} label="Aggregate">
            <MenuItem value={'SUM'}>SUM</MenuItem>
            <MenuItem value={'AVG'}>AVG</MenuItem>
            <MenuItem value={'COUNT'}>COUNT</MenuItem>
            <MenuItem value={'MAX'}>MAX</MenuItem>
            <MenuItem value={'MIN'}>MIN</MenuItem>
          </TextField>
          <Typography className="select-expression-text" variant="body1">
            (
          </Typography>
          <SelectExpressionBuilder expression={expressionColumnExpression} onChange={handleExpressionColumnExpressionChange} availableColumns={availableColumns} getSource={getSource} />
          <Typography className="select-expression-text" variant="body1">
            )
          </Typography>
        </>
      )}

      {expressionType === 'arithmetic' && (
        <>
          <TextField select value={expressionOperator} onChange={handleExpressionOperatorChange} label="Operator">
            <MenuItem value={'+'}>+</MenuItem>
            <MenuItem value={'-'}>-</MenuItem>
            <MenuItem value={'*'}>*</MenuItem>
            <MenuItem value={'/'}>/</MenuItem>
          </TextField>
          <Typography className="select-expression-text" variant="body1">
            (
          </Typography>
          <SelectExpressionBuilder expression={expressionLeft} onChange={handleExpressionLeftChange} availableColumns={availableColumns} getSource={getSource} />
          <Typography className="select-expression-text" variant="body1">
            {expressionOperator}
          </Typography>
          <SelectExpressionBuilder expression={expressionRight} onChange={handleExpressionRightChange} availableColumns={availableColumns} getSource={getSource} />
          <Typography className="select-expression-text" variant="body1">
            )
          </Typography>
        </>
      )}

      {expressionType === 'constant' && <TextField value={expressionConstant} onChange={handleExpressionConstantChange} />}

      {expressionType === 'rename' && (
        <>
          <SelectExpressionBuilder expression={expressionLeft} onChange={handleExpressionLeftChange} availableColumns={availableColumns} getSource={getSource} />
          <TextField value={expressionRename} onChange={handleExpressionRenameChange} label="AS" />
        </>
      )}
    </Box>
  );
};

const WhereConditionBuilder: React.FC<{condition: WhereCondition; onChange: (condition: WhereCondition) => void; availableColumns: QueryBuilderColumn[]}> = ({condition, onChange, availableColumns}) => {
  const handleChange = (newCondition: WhereCondition) => {
    onChange(newCondition);
  };

  return (
    <Box sx={{display: 'flex', gap: 2}}>
      <TextField select value={condition.leftColumn.name} onChange={(e) => handleChange({...condition, leftColumn: column(condition.leftColumn.source, e.target.value)})} label="Column">
        {availableColumns
          .filter((qbColumn) => qbColumn.source === condition.leftColumn.source)
          .map((qbColumn) => (
            <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
              {`${qbColumn.source}.${qbColumn.column.name}`}
            </MenuItem>
          ))}
      </TextField>
      <TextField select value={condition.operator} onChange={(e) => handleChange({...condition, operator: e.target.value as '=' | '!=' | '>' | '<' | '>=' | '<='})} label="Operator">
        <MenuItem value={'='}>is</MenuItem>
        <MenuItem value={'!='}>is not</MenuItem>
        <MenuItem value={'>'}>is greater than</MenuItem>
        <MenuItem value={'<'}>is less than</MenuItem>
        <MenuItem value={'>='}>is at least</MenuItem>
        <MenuItem value={'<='}>is at most</MenuItem>
      </TextField>
      <TextField value={condition.rightValue} onChange={(e) => handleChange({...condition, rightValue: e.target.value})} label="Value" />
    </Box>
  );
};

const OrderByConditionBuilder: React.FC<{condition: OrderByCondition; onChange: (condition: OrderByCondition) => void; availableColumns: QueryBuilderColumn[]}> = ({condition, onChange, availableColumns}) => {
  const handleChange = (newCondition: OrderByCondition) => {
    onChange(newCondition);
  };

  return (
    <Box sx={{display: 'flex', gap: 2}}>
      <TextField select value={condition.column.name} onChange={(e) => handleChange({...condition, column: column(condition.column.source, e.target.value)})} label="Column">
        {availableColumns.map((qbColumn) => (
          <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
            {`${qbColumn.source}.${qbColumn.column.name}`}
          </MenuItem>
        ))}
      </TextField>
      <TextField select value={condition.direction} onChange={(e) => handleChange({...condition, direction: e.target.value as 'ASC' | 'DESC'})} label="Direction">
        <MenuItem value={'ASC'}>ASC</MenuItem>
        <MenuItem value={'DESC'}>DESC</MenuItem>
      </TextField>
    </Box>
  );
};

export default QueryBuilder;
