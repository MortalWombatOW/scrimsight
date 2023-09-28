import {DataSpec} from '~/lib/data/types';

export type SimpleValue = {
  field: string;
  table: string;
};

export type RenamedValue = {
  value: SimpleValue;
  as: string;
};

export type Value = {
  field: string;
  table: string;
  as?: string;
  function?: string;
  math?: string;
};

export type CompoundValue = {
  left: Value;
  right: Value;
  operator: string;
};

export type Expression = SimpleValue | CompoundValue | RenamedValue;

export type DataSource = {
  table?: string;
  isLiteral?: boolean;
  as?: string;
};

export type Join = {
  left: DataSource;
  right: DataSource;
  type: 'inner' | 'left' | 'right' | 'full';
  on: {
    left: string;
    right: string;
  };
};

export type Filter = {
  field: Value;
  operator: string;
  value: string | number | boolean;
};

export type OrderBy = {
  value: Value;
  order: 'asc' | 'desc';
};

export class QueryBuilder {
  private select_: Value[];
  private from_: DataSource;
  private joins_: Join[];
  private groupBy_?: Value[];
  private filters_?: Filter[];
  private orderBy_: OrderBy[];
  private limit_?: number;
  private offset_?: number;
  constructor() {
    this.select_ = [];
    this.joins_ = [];
    this.groupBy_ = [];
    this.filters_ = [];
    this.orderBy_ = [];
    this.limit_ = 0;
    this.offset_ = 0;
  }

  public getSelect(): Value[] {
    return this.select_;
  }

  public select(select: Value[]): QueryBuilder {
    this.select_ = select;
    return this;
  }

  public getFrom(): DataSource {
    return this.from_;
  }

  public getJoins(): Join[] {
    return this.joins_;
  }

  public from(from: DataSource, joins: Join[] = []): QueryBuilder {
    this.from_ = from;
    this.joins_ = joins;
    return this;
  }

  public getGroupBy(): Value[] | undefined {
    return this.groupBy_;
  }
  public groupBy(groupBy: (Value | string)[] | undefined): QueryBuilder {
    this.groupBy_ = groupBy?.map((value) => {
      if (typeof value === 'string') {
        const val = this.getSelect().find(
          (select) => select.as === value || select.field === value,
        ) as Value;
        const valSansAs = {...val};
        valSansAs.as = undefined;
        return valSansAs;
      }

      return value as Value;
    });

    return this;
  }

  public getFilters(): Filter[] | undefined {
    return this.filters_;
  }

  public where(filters: Filter[] | undefined): QueryBuilder {
    this.filters_ = filters;
    return this;
  }

  public getOrderBy(): OrderBy[] {
    return this.orderBy_;
  }

  public orderBy(orderBy: OrderBy[]): QueryBuilder {
    this.orderBy_ = orderBy;
    return this;
  }

  public getLimit(): number | undefined {
    return this.limit_;
  }

  public limit(limit: number | undefined): QueryBuilder {
    this.limit_ = limit;
    return this;
  }

  public getOffset(): number | undefined {
    return this.offset_;
  }

  public offset(offset: number | undefined): QueryBuilder {
    this.offset_ = offset;
    return this;
  }

  public addAllFromSpec(spec: DataSpec, onLeft?: string, onRight?: string) {
    const baseTable = this.getFrom().table;

    // check that if the base table is set, onLeft and onRight are also set
    if (baseTable && !(onLeft && onRight)) {
      throw new Error('base table is set, but onLeft and onRight are not');
    }

    if (!baseTable) {
      // use as the base table
      this.from({table: spec.key});
    } else {
      this.joins_.push({
        left: {table: baseTable},
        right: {table: spec.key},
        type: 'inner',
        on: {left: onLeft!, right: onRight!},
      });
    }
    for (const field of spec.fields) {
      // check if a field with the same name already exists
      if (this.getSelect().find((select) => select.field === field.name)) {
        console.log(`field ${field.name} already exists in select, skipping`);
        continue;
      }
      this.select_.push({table: spec.key, field: field.name});
    }
    return this;
  }

  public build(): string {
    const select = this.getSelectClause();
    const from = this.getFromClause();
    const where = this.getWhereClause();
    const groupBy = this.getGroupByClause();
    const orderBy = this.getOrderByClause();
    const limit = this.getLimitClause();
    const offset = this.getOffsetClause();
    return `${select} ${from} ${where} ${groupBy} ${orderBy} ${limit} ${offset}`;
  }

  private getSelectClause(): string {
    return `SELECT ${this.getSelect()
      .map((metric) => this.buildMetricString(metric))
      .join(', ')}`;
  }

  private buildMetricString(metric: Value): string {
    return `${this.valueString(metric)}`;
  }

  private getFromClause(): string {
    const from = this.getFrom().isLiteral ? `?` : this.getFrom().table;
    const joinClause =
      this.getJoins().length === 0
        ? ''
        : this.getJoins()
            // .slice(1)
            .map((table) => {
              const left = table.left.isLiteral ? '?' : table.left.table;
              const right = table.right.isLiteral ? '?' : table.right.table;
              return `JOIN ${right} ON ${left}.[${table.on.left}] = ${right}.[${table.on.right}]`;
            })
            .join('\n');

    return `FROM ${from} ${joinClause}`;
  }

  private getWhereClause(): string {
    if (this.getFilters() && this.getFilters()!.length > 0) {
      const filters = this.getFilters()!.map(
        (filter) =>
          `${this.valueString(filter.field)} ${filter.operator} ${
            filter.value
          }`,
      );
      return `WHERE ${filters.join(' AND ')}`;
    } else {
      return '';
    }
  }

  private getGroupByClause(): string {
    if (this.getGroupBy() && this.getGroupBy()!.length > 0) {
      const groupBy = this.getGroupBy()!.map((group) =>
        this.valueString(group),
      );
      return `GROUP BY ${groupBy.join(',\n')}`;
    } else {
      return '';
    }
  }

  private getOrderByClause(): string {
    if (this.getOrderBy() && this.getOrderBy().length > 0) {
      const orderBy = this.getOrderBy().map(
        (order) => `${this.valueString(order.value)} ${order.order}`,
      );
      return `ORDER BY ${orderBy.join(',\n')}`;
    } else {
      return '';
    }
  }

  private getLimitClause(): string {
    if (this.getLimit()) {
      return `LIMIT ${this.getLimit()}`;
    } else {
      return '';
    }
  }

  private getOffsetClause(): string {
    if (this.getOffset()) {
      return `OFFSET ${this.getOffset()}t`;
    } else {
      return '';
    }
  }

  private valueString(value: Value): string {
    const hasFunction = value.function && value.function.length > 0;
    const hasMath = value.math && value.math.length > 0;
    const hasAlias = value.as && value.as.length > 0;

    return `${hasFunction ? `${value.function}(` : ''}${value.table}.[${
      value.field
    }]${hasMath ? ` ${value.math}` : ''}${hasFunction ? ')' : ''}${
      hasAlias ? ` AS [${value.as}]` : ''
    }`;
  }
}
