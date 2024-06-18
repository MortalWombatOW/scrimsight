import React, {useRef} from 'react';
import AlaSQLQueryBuilder, {JoinCondition, Column, SelectExpression, WhereCondition, OrderByCondition, AlaSQLQueryBuilderInterface} from '../AlaSQLQueryBuilder';

export const useQueryBuilder = (): {
  setSource: (nodeName: string) => void;
  getSource: () => string | undefined;
  addJoin: (joinType: 'JOIN' | 'LEFT JOIN' | 'RIGHT JOIN', nodeName: string, onConditions: JoinCondition[]) => void;
  select: (columns: SelectExpression[]) => void;
  where: (conditions: WhereCondition[]) => void;
  groupBy: (columns: Column[]) => void;
  orderBy: (columns: OrderByCondition[]) => void;
  build: () => string;
  findErrors: () => string[];
  reset: () => void;
} => {
  const queryBuilderRef = useRef<AlaSQLQueryBuilderInterface>(new AlaSQLQueryBuilder());

  return {
    setSource: (nodeName: string) => queryBuilderRef.current.setSource(nodeName),
    getSource: () => queryBuilderRef.current.getSource(),
    addJoin: (joinType: 'JOIN' | 'LEFT JOIN' | 'RIGHT JOIN', nodeName: string, onConditions: JoinCondition[]) => queryBuilderRef.current.addJoin(joinType, nodeName, onConditions),
    select: (columns: SelectExpression[]) => queryBuilderRef.current.select(columns),
    where: (conditions: WhereCondition[]) => queryBuilderRef.current.where(conditions),
    groupBy: (columns: Column[]) => queryBuilderRef.current.groupBy(columns),
    orderBy: (columns: OrderByCondition[]) => queryBuilderRef.current.orderBy(columns),
    build: () => queryBuilderRef.current.build(),
    findErrors: () => queryBuilderRef.current.findErrors(),
    reset: () => {
      queryBuilderRef.current = new AlaSQLQueryBuilder();
    },
  };
};

export default useQueryBuilder;
