import {Box, TextField, MenuItem, Typography} from '@mui/material';
import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {
  SelectExpression,
  column,
  basicExpr,
  aggregateExpr,
  SelectBasicExpression,
  SelectArithmeticExpression,
  arithmeticExpr,
  SelectAggregateExpression,
  SelectConstantExpression,
  constantExpr,
  renameExpr,
} from '../../../../WombatDataFramework/AlaSQLQueryBuilder';
import {useDataManager} from '../../../../WombatDataFramework/DataContext';
import {DataNodeName} from '../../../../WombatDataFramework/DataNode';
import {DataColumn} from '../../../../WombatDataFramework/DataColumn';

interface QueryBuilderColumn {
  source: DataNodeName;
  column: DataColumn;
}

interface SelectExpressionBuilderProps {
  // The nodes whose columns are available for selection
  nodes: DataNodeName[];
  addSelectExpression: (expression: SelectExpression) => void;
}

const SelectExpressionBuilder: React.FC<SelectExpressionBuilderProps> = ({nodes, addSelectExpression}) => {
  const dataManager = useDataManager();

  const availableColumns = useMemo(() => dataManager.getColumnsForNodes(nodes), [dataManager, JSON.stringify(nodes)]);

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

export default SelectExpressionBuilder;
