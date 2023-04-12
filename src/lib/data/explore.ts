export type Value = {
  field: string;
  table: string;
};


export type Aggregation = {
  value: Value;
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'array';
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

export type QueryBuilder = {
  select: (Value | Aggregation)[];
  from: Value[] | string;
  groupBy?: Value[];
  filters?: Filter[];
  orderBy: OrderBy[];
  limit?: number;
  offset?: number;
};

export function build(query: QueryBuilder): string {
  let queryStr = 'SELECT\n';

  const metrics = query.select.map ((metric) => {
    if (metric['aggregation']) {
      const aggregation = metric as Aggregation;
      console.log(metric);
      return `${aggregation.aggregation}(${aggregation.value.table}.[${aggregation.value.field}])`;
    } else {
      const value = metric as Value;
      return `\t${value.table}.[${value.field}]`;
    }
  }).join(',\n');


  queryStr += metrics;
  queryStr += ' FROM ';
  if (Array.isArray(query.from)) {
    queryStr += query.from[0].table;
    for (let i = 1; i < query.from.length; i++) {
      queryStr += `\nJOIN ${query.from[i].table} ON ${query.from[i].table}.[${query.from[i].field}] = ${query.from[0].table}.[${query.from[0].field}]`;
    }
  } else {
    
    queryStr += query.from;
  }

  if (query.filters && query.filters.length > 0) {
    queryStr += '\nWHERE\n';
  const filters = query.filters.map((filter) => `\t${filter.field.table}.[${filter.field.field}] ${filter.operator} ${filter.value}`).join('\nAND ');
  queryStr += filters;
  }

  if (query.groupBy && query.groupBy.length > 0) {
    queryStr += '\nGROUP BY\n';
  const groupBy = query.groupBy.map((group) => `\t${group.table}.[${group.field}]`).join(',\n');
  queryStr += groupBy;
  }

  if (query.orderBy && query.orderBy.length > 0) {
  const orderBy = query.orderBy.map((order) => `\t${order.value.table}.[${order.value.field}] ${order.order}`).join(',\n');
  queryStr += `\nORDER BY ${orderBy}`;
  }

  const limit = query.limit;
  if (limit) {
    queryStr += `\nLIMIT ${limit}`;
  }
  const offset = query.offset;
  if (offset) {
    queryStr += `\nOFFSET ${offset}`;
  }

  console.log ('queryStr: ', queryStr);
  console.log (queryStr);
  return queryStr;
}