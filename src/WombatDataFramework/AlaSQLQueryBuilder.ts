export interface Column {
  source: string;
  name: string;
}

export interface JoinCondition {
  leftColumn: Column;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
  rightColumn: Column;
}

export interface SelectBasicExpression {
  type: 'basic';
  column: Column;
}

export interface SelectAggregateExpression {
  type: 'aggregate';
  aggregate: 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN';
  column: SelectBasicExpression | SelectArithmeticExpression;
}

export interface SelectConstantExpression {
  type: 'constant';
  value: string | number;
}

export interface SelectArithmeticExpression {
  type: 'arithmetic';
  operator: '+' | '-' | '*' | '/';
  left: SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression;
  right: SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression;
}

// Rename can only be the outermost expression
// This is required for all non-basic expressions so that they can be referenced later
export interface SelectRenameExpression {
  type: 'rename';
  column: SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression;
  name: string;
}

export type SelectExpression = SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression | SelectRenameExpression;

export function column(source: string, name: string): Column {
  return {source, name};
}

export function basicExpr(column: Column): SelectBasicExpression {
  return {type: 'basic', column};
}

export function aggregateExpr(aggregate: 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN', column: SelectBasicExpression | SelectArithmeticExpression): SelectAggregateExpression {
  return {type: 'aggregate', aggregate, column};
}

export function constantExpr(value: string | number): SelectConstantExpression {
  return {type: 'constant', value};
}

export function arithmeticExpr(
  operator: '+' | '-' | '*' | '/',
  left: SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression,
  right: SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression,
): SelectArithmeticExpression {
  return {type: 'arithmetic', operator, left, right};
}

export function renameExpr(column: SelectBasicExpression | SelectAggregateExpression | SelectArithmeticExpression | SelectConstantExpression, name: string): SelectRenameExpression {
  return {type: 'rename', column, name};
}

export interface WhereCondition {
  leftColumn: Column;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
  rightValue: string | number;
}
export interface OrderByCondition {
  column: Column;
  direction: 'ASC' | 'DESC';
}

export interface AlaSQLQueryBuilderInterface {
  setSource(nodeName: string): AlaSQLQueryBuilderInterface;
  getSource(): string | undefined;

  addJoin(joinType: 'JOIN' | 'LEFT JOIN' | 'RIGHT JOIN', nodeName: string, onConditions: JoinCondition[]): AlaSQLQueryBuilderInterface;

  select(columns: SelectExpression[]): AlaSQLQueryBuilderInterface;

  where(conditions: WhereCondition[]): AlaSQLQueryBuilderInterface; // Optional

  groupBy(columns: Column[]): AlaSQLQueryBuilderInterface; // Optional

  orderBy(columns: OrderByCondition[]): AlaSQLQueryBuilderInterface; // Optional

  findErrors(): string[]; // Returns an array of error messages if the query is invalid

  build(): string; // Generates the AlaSQL query string
}

const errorMessages = {
  sourceNodeNotSet: 'Source node is not set.',
  atLeastOneSelectColumn: 'At least one column must be selected.',
  nonAggregatedColumn: 'Non-aggregated column must be included in the GROUP BY clause.',
  nonBasicExpressionWithoutAlias: 'Non-basic expression must have an alias.',
};

export function buildSelectExpression(expression: SelectExpression): string {
  if (expression.type === 'basic') {
    if (!expression.column.source || !expression.column.name) {
      return '';
    }
    return `${expression.column.source}.${expression.column.name}`;
  }
  if (expression.type === 'aggregate') {
    return `${expression.aggregate}(${buildSelectExpression(expression.column)})`;
  }
  if (expression.type === 'constant') {
    if (typeof expression.value === 'string') {
      return `'${expression.value}'`;
    }
    return `${expression.value}`;
  }
  if (expression.type === 'arithmetic') {
    return `${buildSelectExpression(expression.left)} ${expression.operator} ${buildSelectExpression(expression.right)}`;
  }
  if (expression.type === 'rename') {
    return `${buildSelectExpression(expression.column)} AS ${expression.name}`;
  }
  throw new Error('Unknown select expression type');
}

class AlaSQLQueryBuilder implements AlaSQLQueryBuilderInterface {
  private sourceNode: string | undefined;
  private joins: {joinType: string; nodeName: string; onConditions: JoinCondition[]}[] = [];
  private selectColumns: SelectExpression[] = [];
  private whereConditions: WhereCondition[] = [];
  private groupByColumns: Column[] = [];
  private orderByConditions: OrderByCondition[] = [];

  setSource(nodeName: string): AlaSQLQueryBuilderInterface {
    this.sourceNode = nodeName;
    return this;
  }

  getSource(): string | undefined {
    return this.sourceNode;
  }

  addJoin(joinType: 'JOIN' | 'LEFT JOIN' | 'RIGHT JOIN', nodeName: string, onConditions: JoinCondition[]): AlaSQLQueryBuilderInterface {
    this.joins.push({joinType, nodeName, onConditions});
    return this;
  }

  select(columns: SelectExpression[]): AlaSQLQueryBuilderInterface {
    this.selectColumns = columns;
    return this;
  }

  where(conditions: WhereCondition[]): AlaSQLQueryBuilderInterface {
    this.whereConditions = conditions;
    return this;
  }

  groupBy(columns: Column[]): AlaSQLQueryBuilderInterface {
    this.groupByColumns = columns;
    return this;
  }

  orderBy(columns: OrderByCondition[]): AlaSQLQueryBuilderInterface {
    this.orderByConditions = columns;
    return this;
  }

  findErrors(): string[] {
    const errors: string[] = [];
    if (!this.sourceNode) {
      errors.push(errorMessages.sourceNodeNotSet);
    }
    if (this.selectColumns.length === 0) {
      errors.push(errorMessages.atLeastOneSelectColumn);
    }
    if (this.selectColumns.some((expression) => expression.type !== 'basic' && expression.type !== 'rename')) {
      errors.push(errorMessages.nonBasicExpressionWithoutAlias);
    }

    return errors;
  }

  build(): string {
    const selectClause = this.buildSelectClause();
    const fromClause = this.buildFromClause();
    const whereClause = this.buildWhereClause();
    const groupByClause = this.buildGroupByClause();
    const orderByClause = this.buildOrderByClause();

    let query = `SELECT ${selectClause} ${fromClause}`;

    if (whereClause) {
      query += ` ${whereClause}`;
    }

    if (groupByClause) {
      query += ` ${groupByClause}`;
    }

    if (orderByClause) {
      query += ` ${orderByClause}`;
    }

    return query;
  }

  private buildSelectClause(): string {
    return this.selectColumns.map((column) => buildSelectExpression(column)).join(', ');
  }

  private buildFromClause(): string {
    const joins = this.joins.map((join) => {
      const onConditions = join.onConditions.map((condition) => `${condition.leftColumn.source}.${condition.leftColumn.name} ${condition.operator} ${condition.rightColumn.source}.${condition.rightColumn.name}`).join(' AND ');
      return `${join.joinType} ? AS ${join.nodeName} ON ${onConditions}`;
    });
    let clause = `FROM ? AS ${this.sourceNode}`;
    if (joins.length > 0) {
      clause += ' ' + joins.join(' ');
    }
    return clause;
  }

  private buildWhereClause(): string {
    if (this.whereConditions.length === 0) {
      return '';
    }
    const conditions = this.whereConditions
      .map((condition) => `${condition.leftColumn.source}.${condition.leftColumn.name} ${condition.operator} ${typeof condition.rightValue === 'string' ? `'${condition.rightValue}'` : condition.rightValue}`)
      .join(' AND ');
    return `WHERE ${conditions}`;
  }

  private buildGroupByClause(): string {
    if (this.groupByColumns.length === 0) {
      return '';
    }
    return `GROUP BY ${this.groupByColumns.map((column) => `${column.source}.${column.name}`).join(', ')}`;
  }

  private buildOrderByClause(): string {
    if (this.orderByConditions.length === 0) {
      return '';
    }
    return `ORDER BY ${this.orderByConditions.map((condition) => `${condition.column.source}.${condition.column.name} ${condition.direction}`).join(', ')}`;
  }
}

export default AlaSQLQueryBuilder;
