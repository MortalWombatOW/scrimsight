import React, {useEffect, useMemo, useState} from 'react';
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
import {SelectChangeEvent} from '@mui/material/Select';
import DataNodeFactory from '../../WombatDataFramework/DataNodeFactory';
import {DataColumn} from '../../WombatDataFramework/DataColumn';
import './QueryBuilder.scss';

interface QueryBuilderColumn {
  source: DataNodeName;
  column: DataColumn;
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

  console.log('Query Builder Render');

  console.log('Selected Source Node', selectedSourceNode);
  console.log('Join Nodes', joinNodes);
  console.log('Select Expressions', selectExpressions);
  console.log('Where Conditions', whereConditions);
  console.log('Group By Columns', groupByColumns);
  console.log('Order By Columns', orderByColumns);

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

    setQueryString(build());
    setErrors(findErrors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedSourceNode), JSON.stringify(joinNodes), JSON.stringify(selectExpressions), JSON.stringify(whereConditions), JSON.stringify(groupByColumns), JSON.stringify(orderByColumns)]);

  // Track available columns for selection
  const [availableColumns, setAvailableColumns] = useState<QueryBuilderColumn[]>([]);

  console.log('Available Columns', availableColumns);

  const handleSourceNodeChange = (event: SelectChangeEvent<string>) => {
    const newSourceNode = event.target.value as DataNodeName;
    setSelectedSourceNode(newSourceNode);

    console.log('Source Node', newSourceNode);
    console.log('Columns', dataManager.getNodeOrDie(newSourceNode).getColumns());

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
    console.log(build());
  };

  const nodeNames = dataManager.getNodeNames().filter((nodeName) => dataManager.getNodeOrDie(nodeName).getColumns().length > 0);
  const joinableNodes = selectedSourceNode ? factory.getJoinableNodes([selectedSourceNode, ...joinNodes.map((node) => node.nodeName)]) : [];

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}} id="query-builder">
      <Typography variant="h2">Query Builder</Typography>
      <FormControl fullWidth>
        <InputLabel id="source-node-select-label">Source Node</InputLabel>
        <Select labelId="source-node-select-label" id="source-node-select" value={selectedSourceNode || ''} onChange={handleSourceNodeChange}>
          {nodeNames.map((nodeName) => (
            <MenuItem key={nodeName} value={nodeName}>
              {nodeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedSourceNode && (
        <>
          <Typography variant="h3">Join Nodes</Typography>
          <List>
            {joinNodes.map((joinNode, index) => (
              <ListItem key={index}>
                <ListItemText primary={joinNode.nodeName} />
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveJoinNode(index)}>
                  <DeleteIcon />
                </IconButton>
                <List>
                  {joinNode.conditions.map((condition, conditionIndex) => (
                    <ListItem key={conditionIndex}>
                      <Select
                        value={condition.leftColumn.name}
                        onChange={(e) => {
                          const newJoinNodes = [...joinNodes];
                          newJoinNodes[index].conditions[conditionIndex].leftColumn = column(condition.leftColumn.source, e.target.value);
                          setJoinNodes(newJoinNodes);
                        }}>
                        {availableColumns
                          .filter((qbColumn) => qbColumn.source === condition.leftColumn.source)
                          .map((qbColumn) => (
                            <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
                              {`${qbColumn.source}.${qbColumn.column.name}`}
                            </MenuItem>
                          ))}
                      </Select>
                      <Select
                        value={condition.operator}
                        onChange={(e) => {
                          const newJoinNodes = [...joinNodes];
                          newJoinNodes[index].conditions[conditionIndex].operator = e.target.value as '=' | '!=' | '>' | '<' | '>=' | '<=';
                          setJoinNodes(newJoinNodes);
                        }}>
                        <MenuItem value={'='}>is</MenuItem>
                        <MenuItem value={'!='}>is not</MenuItem>
                        <MenuItem value={'>'}>is greater than</MenuItem>
                        <MenuItem value={'<'}>is less than</MenuItem>
                        <MenuItem value={'>='}>is at least</MenuItem>
                        <MenuItem value={'<='}>is at most</MenuItem>
                      </Select>
                      <Select
                        value={condition.rightColumn.name}
                        onChange={(e) => {
                          const newJoinNodes = [...joinNodes];
                          newJoinNodes[index].conditions[conditionIndex].rightColumn = column(condition.rightColumn.source, e.target.value);
                          setJoinNodes(newJoinNodes);
                        }}>
                        {availableColumns
                          .filter((qbColumn) => qbColumn.source === condition.rightColumn.source)
                          .map((qbColumn) => (
                            <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
                              {`${qbColumn.source}.${qbColumn.column.name}`}
                            </MenuItem>
                          ))}
                      </Select>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveJoinCondition(index, conditionIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddJoinCondition(index)}>
                  Add Join Condition
                </Button>
              </ListItem>
            ))}
          </List>
          <FormControl fullWidth>
            <InputLabel id="join-node-select-label">Join Node</InputLabel>
            <Select labelId="join-node-select-label" id="join-node-select" value={''} onChange={(e) => handleAddJoinNode(e.target.value as DataNodeName)}>
              {joinableNodes.map((nodeName) => (
                <MenuItem key={nodeName} value={nodeName}>
                  {nodeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h3">Select Expressions</Typography>
          <List>
            {selectExpressions.map((selectExpression, index) => (
              <ListItem key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <SelectExpressionBuilder
                      expression={selectExpression}
                      onChange={(newExpression) => {
                        const newSelectExpressions = [...selectExpressions];
                        newSelectExpressions[index] = newExpression;
                        setSelectExpressions(newSelectExpressions);
                      }}
                      availableColumns={availableColumns}
                      getSource={getSource}
                    />
                    <pre>{buildSelectExpression(selectExpression)}</pre>
                  </CardContent>
                  <CardActions>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSelectExpression(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddSelectExpression}>
            Add Select Expression
          </Button>

          <Typography variant="h3">Where Conditions</Typography>
          <List>
            {whereConditions.map((whereCondition, index) => (
              <ListItem key={index}>
                <WhereConditionBuilder
                  condition={whereCondition}
                  onChange={(newCondition) => {
                    const newWhereConditions = [...whereConditions];
                    newWhereConditions[index] = newCondition;
                    setWhereConditions(newWhereConditions);
                  }}
                  availableColumns={availableColumns}
                />
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveWhereCondition(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddWhereCondition}>
            Add Where Condition
          </Button>

          {/* Updated GroupBy Section */}
          <Typography variant="h3">Group By Columns</Typography>
          <List>
            {groupByColumns.map((groupByColumn, index) => (
              <ListItem key={index}>
                <Select
                  value={groupByColumn.column.name}
                  onChange={(e) => {
                    const newGroupByColumns = [...groupByColumns];
                    newGroupByColumns[index] = {source: groupByColumn.source, column: availableColumns.find((c) => c.column.name === e.target.value)?.column as DataColumn};
                    setGroupByColumns(newGroupByColumns);
                  }}>
                  {availableColumns.map((qbColumn) => (
                    <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
                      {`${qbColumn.source}.${qbColumn.column.name}`}
                    </MenuItem>
                  ))}
                </Select>
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveGroupByColumn(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddGroupByColumn}>
            Add Group By Column
          </Button>

          {/* Updated OrderBy Section */}
          <Typography variant="h3">Order By Columns</Typography>
          <List>
            {orderByColumns.map((orderByColumn, index) => (
              <ListItem key={index}>
                <OrderByConditionBuilder
                  condition={orderByColumn}
                  onChange={(newCondition) => {
                    const newOrderByColumns = [...orderByColumns];
                    newOrderByColumns[index] = newCondition;
                    setOrderByColumns(newOrderByColumns);
                  }}
                  availableColumns={availableColumns}
                />
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveOrderByColumn(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddOrderByColumn}>
            Add Order By Column
          </Button>

          <Typography variant="h3">Query</Typography>

          <pre>{queryString}</pre>
        </>
      )}

      {errors.length > 0 && (
        <Typography variant="h3" color="error">
          Errors
        </Typography>
      )}
      <List>
        {errors.map((error) => (
          <ListItem key={error}>
            <ListItemText primary={error} primaryTypographyProps={{color: 'error'}} />
          </ListItem>
        ))}
      </List>

      <Button variant="contained" onClick={handleSubmit} disabled={errors.length > 0}>
        Submit Query
      </Button>
    </Box>
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

  const handleExpressionTypeChange = (event: SelectChangeEvent<string>) => {
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

  const handleExpressionColumnChange = (event: SelectChangeEvent<string>) => {
    const selectedColumn = availableColumns.find((column) => column.column.name === event.target.value);
    if (selectedColumn) {
      setExpressionColumn(selectedColumn);
    }
  };

  const handleExpressionColumnExpressionChange = (newExpression: SelectExpression) => {
    setExpressionColumnExpression(newExpression);
  };

  const handleExpressionAggregateChange = (event: SelectChangeEvent<string>) => {
    setExpressionAggregate(event.target.value);
  };

  const handleExpressionOperatorChange = (event: SelectChangeEvent<string>) => {
    setExpressionOperator(event.target.value);
  };

  const handleExpressionLeftChange = (newExpression: SelectExpression) => {
    setExpressionLeft(newExpression);
  };

  const handleExpressionRightChange = (newExpression: SelectExpression) => {
    setExpressionRight(newExpression);
  };

  const handleExpressionConstantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpressionConstant(event.target.value);
  };

  const handleExpressionRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <Select value={expressionType} onChange={handleExpressionTypeChange}>
        <MenuItem value={'basic'}>Column</MenuItem>
        <MenuItem value={'aggregate'}>Aggregate</MenuItem>
        <MenuItem value={'arithmetic'}>Arithmetic</MenuItem>
        <MenuItem value={'constant'}>Constant</MenuItem>
        <MenuItem value={'rename'}>Rename</MenuItem>
      </Select>

      {expressionType === 'basic' && (
        <Select value={expressionColumn?.column.name || ''} onChange={handleExpressionColumnChange}>
          {availableColumns.map((qbColumn) => (
            <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
              {`${qbColumn.source}.${qbColumn.column.name}`}
            </MenuItem>
          ))}
        </Select>
      )}

      {expressionType === 'aggregate' && (
        <>
          <Select value={expressionAggregate} onChange={handleExpressionAggregateChange}>
            <MenuItem value={'SUM'}>SUM</MenuItem>
            <MenuItem value={'AVG'}>AVG</MenuItem>
            <MenuItem value={'COUNT'}>COUNT</MenuItem>
            <MenuItem value={'MAX'}>MAX</MenuItem>
            <MenuItem value={'MIN'}>MIN</MenuItem>
          </Select>
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
          <Select value={expressionOperator} onChange={handleExpressionOperatorChange}>
            <MenuItem value={'+'}>+</MenuItem>
            <MenuItem value={'-'}>-</MenuItem>
            <MenuItem value={'*'}>*</MenuItem>
            <MenuItem value={'/'}>/</MenuItem>
          </Select>
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
      <Select value={condition.leftColumn.name} onChange={(e) => handleChange({...condition, leftColumn: column(condition.leftColumn.source, e.target.value)})}>
        {availableColumns
          .filter((qbColumn) => qbColumn.source === condition.leftColumn.source)
          .map((qbColumn) => (
            <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
              {`${qbColumn.source}.${qbColumn.column.name}`}
            </MenuItem>
          ))}
      </Select>
      <Select value={condition.operator} onChange={(e) => handleChange({...condition, operator: e.target.value as '=' | '!=' | '>' | '<' | '>=' | '<='})}>
        <MenuItem value={'='}>is</MenuItem>
        <MenuItem value={'!='}>is not</MenuItem>
        <MenuItem value={'>'}>is greater than</MenuItem>
        <MenuItem value={'<'}>is less than</MenuItem>
        <MenuItem value={'>='}>is at least</MenuItem>
        <MenuItem value={'<='}>is at most</MenuItem>
      </Select>
      <TextField value={condition.rightValue} onChange={(e) => handleChange({...condition, rightValue: e.target.value})} />
    </Box>
  );
};

const OrderByConditionBuilder: React.FC<{condition: OrderByCondition; onChange: (condition: OrderByCondition) => void; availableColumns: QueryBuilderColumn[]}> = ({condition, onChange, availableColumns}) => {
  const handleChange = (newCondition: OrderByCondition) => {
    onChange(newCondition);
  };

  return (
    <Box sx={{display: 'flex', gap: 2}}>
      <Select value={condition.column.name} onChange={(e) => handleChange({...condition, column: column(condition.column.source, e.target.value)})}>
        {availableColumns.map((qbColumn) => (
          <MenuItem key={qbColumn.column.name} value={qbColumn.column.name}>
            {`${qbColumn.source}.${qbColumn.column.name}`}
          </MenuItem>
        ))}
      </Select>
      <Select value={condition.direction} onChange={(e) => handleChange({...condition, direction: e.target.value as 'ASC' | 'DESC'})}>
        <MenuItem value={'ASC'}>ASC</MenuItem>
        <MenuItem value={'DESC'}>DESC</MenuItem>
      </Select>
    </Box>
  );
};

export default QueryBuilder;
