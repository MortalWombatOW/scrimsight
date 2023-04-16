import {DataSpec} from '~/lib/data/logging/spec';

export type Value = {
  field: string;
  table: string;
};

export type Aggregation = {
  value: Value;
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'array';
  as: string;
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
  private select_: (Value | Aggregation)[];
  private from_: Value[];
  private groupBy_?: Value[];
  private filters_?: Filter[];
  private orderBy_: OrderBy[];
  private limit_?: number;
  private offset_?: number;
  constructor() {
    this.select_ = [];
    this.from_ = [];
    this.groupBy_ = [];
    this.filters_ = [];
    this.orderBy_ = [];
    this.limit_ = 0;
    this.offset_ = 0;
  }

  public getSelect(): (Value | Aggregation)[] {
    return this.select_;
  }

  public select(select: (Value | Aggregation)[]): QueryBuilder {
    this.select_ = select;
    return this;
  }

  public getFrom(): Value[] {
    return this.from_;
  }

  public from(from: Value[]): QueryBuilder {
    this.from_ = from;
    return this;
  }

  public getGroupBy(): Value[] | undefined {
    return this.groupBy_;
  }

  public groupBy(groupBy: Value[] | undefined): QueryBuilder {
    this.groupBy_ = groupBy;
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

  public addAllFromSpec(spec: DataSpec, on: string) {
    this.from_.push({table: spec.key, field: on});
    for (const field of spec.fields) {
      this.select_.push({table: spec.key, field: field.name});
    }
    return this;
  }

  public build(): string {
    let queryStr = 'SELECT\n';

    const metrics = this.getSelect()
      .map((metric) => {
        if (metric['aggregation']) {
          const aggregation = metric as Aggregation;
          console.log(metric);
          return `${aggregation.aggregation}(${aggregation.value.table}.[${aggregation.value.field}]) AS [${aggregation.as}]`;
        } else {
          const value = metric as Value;
          return `\t${value.table}.[${value.field}]`;
        }
      })
      .join(',\n');

    queryStr += metrics;
    queryStr += ' FROM ';

    if (Array.isArray(this.getFrom())) {
      queryStr += this.getFrom()[0].table;
      for (let i = 1; i < this.getFrom().length; i++) {
        queryStr += `\nJOIN ${this.getFrom()[i].table} ON ${
          this.getFrom()[i].table
        }.[${this.getFrom()[i].field}] = ${this.getFrom()[0].table}.[${
          this.getFrom()[0].field
        }]`;
      }
    } else {
      queryStr += this.getFrom();
    }

    if (this.getFilters() && this.getFilters()!.length > 0) {
      queryStr += '\nWHERE\n';
      const filters = this.getFilters()!
        .map(
          (filter) =>
            `\t${filter.field.table}.[${filter.field.field}] ${filter.operator} ${filter.value}`,
        )
        .join('\nAND ');
      queryStr += filters;
    }

    if (this.getGroupBy() && this.getGroupBy()!.length > 0) {
      queryStr += '\nGROUP BY\n';
      const groupBy = this.getGroupBy()!
        .map((group) => `\t${group.table}.[${group.field}]`)
        .join(',\n');
      queryStr += groupBy;
    }

    if (this.getOrderBy() && this.getOrderBy().length > 0) {
      const orderBy = this.getOrderBy()
        .map(
          (order) =>
            `\t${order.value.table}.[${order.value.field}] ${order.order}`,
        )
        .join(',\n');
      queryStr += `\nORDER BY\n${orderBy}`;
    }

    const limit = this.getLimit();
    if (limit) {
      queryStr += `\nLIMIT ${limit}`;
    }
    const offset = this.getOffset();
    if (offset) {
      queryStr += `\nOFFSET ${offset}`;
    }

    console.log('queryStr: ', queryStr);
    console.log(queryStr);
    return queryStr;
  }
}
