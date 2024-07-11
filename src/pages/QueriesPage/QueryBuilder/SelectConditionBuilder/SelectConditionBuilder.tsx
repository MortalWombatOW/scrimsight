import {Box, TextField, MenuItem, Typography, ButtonGroup, Button} from '@mui/material';
import React, {ChangeEvent, useState} from 'react';
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
  Column,
} from '../../../../WombatDataFramework/AlaSQLQueryBuilder';
import {useDataManager} from '../../../../WombatDataFramework/DataContext';
import {DataNodeName} from '../../../../WombatDataFramework/DataNode';
import {useDeepMemo, useDeepEffect} from '../../../../hooks/useDeepEffect';

interface SelectExpressionBuilderProps {
  // The nodes whose columns are available for selection
  nodes: DataNodeName[];
  outputExpression: (expression: SelectExpression) => void;
  isRequestingOutput: boolean;
  setIsRequestingOutput: (isRequestingOutput: boolean) => void;
  isRequestingReset: boolean;
  setIsRequestingReset: (isRequestingReset: boolean) => void;
  setIsValidExpression: (isValidExpression: boolean) => void;
  disableAggregate?: boolean;
  disableConstant?: boolean;
}

// Rename is not included because it is handled in a different component
type SelectExpressionType = 'basic' | 'aggregate' | 'arithmetic' | 'constant';

const SelectExpressionBuilder: React.FC<SelectExpressionBuilderProps> = ({
  nodes,
  outputExpression,
  isRequestingOutput,
  setIsRequestingOutput,
  isRequestingReset,
  setIsRequestingReset,
  setIsValidExpression,
  disableAggregate = false,
  disableConstant = false,
}) => {
  const dataManager = useDataManager();

  const availableColumns = useDeepMemo(() => {
    const columns: Column[] = [];
    for (const node of nodes) {
      const dataNode = dataManager.getNodeOrDie(node);
      for (const column of dataNode.getColumns()) {
        columns.push({source: node, name: column.name});
      }
    }
    return columns;
  }, [dataManager, nodes]);

  // The type of the expression that is being built
  const [expressionType, setExpressionType] = useState<string | undefined>(undefined);

  // used if expressionType is 'basic'
  const [column, setColumn] = useState<Column | undefined>(undefined);

  // used if expressionType is 'aggregate'
  const [expression, setExpression] = useState<SelectBasicExpression | SelectArithmeticExpression | undefined>(undefined);
  const [aggregationType, setAggregationType] = useState<'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN' | undefined>(undefined);

  // used if expressionType is 'arithmetic'
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/' | undefined>(undefined);
  const [leftExpression, setLeftExpression] = useState<SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression | undefined>(undefined);
  const [rightExpression, setRightExpression] = useState<SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression | undefined>(undefined);

  // used if expressionType is 'constant'
  const [constantValue, setConstantValue] = useState<string | number | undefined>(undefined);

  const resetState = () => {
    setExpressionType(undefined);
    setColumn(undefined);
    setAggregationType(undefined);
    setExpression(undefined);
    setOperator(undefined);
    setLeftExpression(undefined);
    setRightExpression(undefined);
    setConstantValue(undefined);
  };

  const buildExpression = (): SelectExpression => {
    switch (expressionType) {
      case 'basic':
        if (!column) {
          throw new Error('Expression column is null');
        }
        return basicExpr(column);
      case 'aggregate':
        if (!aggregationType) {
          throw new Error('Aggregation type is null');
        }
        if (!expression) {
          throw new Error('Expression is null');
        }
        return aggregateExpr(aggregationType, expression);
      case 'arithmetic':
        if (!operator) {
          throw new Error('Operator is null');
        }
        if (!leftExpression) {
          throw new Error('Left expression is null');
        }
        if (!rightExpression) {
          throw new Error('Right expression is null');
        }
        return arithmeticExpr(operator, leftExpression, rightExpression);
      case 'constant':
        if (!constantValue) {
          throw new Error('Constant value is null');
        }
        return constantExpr(constantValue);
      default:
        throw new Error('Unknown expression type');
    }
  };

  // Reset the state when the reset flag is set
  useDeepEffect(() => {
    if (isRequestingReset) {
      resetState();
      setIsRequestingReset(false);
    }
  }, [isRequestingReset]);

  // Output the expression when the output flag is set
  useDeepEffect(() => {
    if (isRequestingOutput) {
      outputExpression(buildExpression());
      setIsRequestingOutput(false);
    }
  }, [isRequestingOutput]);

  return (
    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, minWidth: 'fit-content'}}>
      <ButtonGroup sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <TextField
          select
          size="small"
          fullWidth
          onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            resetState();
            setExpressionType(event.target.value);
          }}
          label="Expression Type">
          <MenuItem value={'basic'}>Column</MenuItem>
          {!disableAggregate && <MenuItem value={'aggregate'}>Aggregate</MenuItem>}
          <MenuItem value={'arithmetic'}>Arithmetic</MenuItem>
          {!disableConstant && <MenuItem value={'constant'}>Constant</MenuItem>}
        </TextField>

        {expressionType === 'basic' && (
          <TextField select size="small" onChange={(e) => setColumn({source: e.target.value.split('.')[0] as DataNodeName, name: e.target.value.split('.')[1]})} label="Column">
            {availableColumns.map((column) => (
              <MenuItem key={column.name} value={`${column.source}.${column.name}`}>
                {`${column.source}.${column.name}`}
              </MenuItem>
            ))}
          </TextField>
        )}

        {expressionType === 'aggregate' && (
          <ButtonGroup sx={{display: 'flex', flexDirection: 'row', gap: 0}}>
            <TextField select size="small" onChange={(e) => setAggregationType(e.target.value as 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN')} label="Aggregation Type">
              <MenuItem value={'SUM'}>SUM</MenuItem>
              <MenuItem value={'AVG'}>AVG</MenuItem>
              <MenuItem value={'COUNT'}>COUNT</MenuItem>
              <MenuItem value={'MAX'}>MAX</MenuItem>
              <MenuItem value={'MIN'}>MIN</MenuItem>
            </TextField>
            <SelectExpressionBuilder
              nodes={nodes}
              outputExpression={(expr) => setExpression(expr as SelectBasicExpression | SelectArithmeticExpression)}
              disableAggregate
              disableConstant
              isRequestingOutput={isRequestingOutput}
              setIsRequestingOutput={setIsRequestingOutput}
              isRequestingReset={false}
              setIsRequestingReset={() => {}}
              setIsValidExpression={setIsValidExpression}
            />
          </ButtonGroup>
        )}

        {expressionType === 'arithmetic' && (
          <ButtonGroup sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
            <SelectExpressionBuilder
              outputExpression={(expr) => setLeftExpression(expr as SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression)}
              nodes={nodes}
              isRequestingOutput={isRequestingOutput}
              setIsRequestingOutput={setIsRequestingOutput}
              isRequestingReset={false}
              setIsRequestingReset={() => {}}
              setIsValidExpression={setIsValidExpression}
            />
            <TextField select size="small" onChange={(e) => setOperator(e.target.value as '+' | '-' | '*' | '/')} label="Operator">
              <MenuItem value={'+'}>+</MenuItem>
              <MenuItem value={'-'}>-</MenuItem>
              <MenuItem value={'*'}>*</MenuItem>
              <MenuItem value={'/'}>/</MenuItem>
            </TextField>

            <SelectExpressionBuilder
              nodes={nodes}
              outputExpression={(expr) => setRightExpression(expr as SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression)}
              isRequestingOutput={isRequestingOutput}
              setIsRequestingOutput={setIsRequestingOutput}
              isRequestingReset={false}
              setIsRequestingReset={() => {}}
              setIsValidExpression={setIsValidExpression}
            />
          </ButtonGroup>
        )}

        {expressionType === 'constant' && <TextField size="small" variant="standard" onChange={(e) => setConstantValue(e.target.value)} />}
      </ButtonGroup>
    </Box>
  );
};

export default SelectExpressionBuilder;
