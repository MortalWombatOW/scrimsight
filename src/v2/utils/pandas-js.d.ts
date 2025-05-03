declare module 'pandas-js' {
  class Series {
    constructor(data: any[]);
    map(fn: (value: any) => any): Series;
    apply(fn: (value: any) => any): Series;
    zipWith(series: Series, fn: (a: any, b: any) => any): Series;
    toArray(): any[];
    toCollection(): any[];
  }

  class DataFrame {
    constructor(data: any[]);
    
    static fromCSV(csv: string): DataFrame;
    
    get(column: string): Series;
    set(column: string, value: any): DataFrame;
    
    filter(predicate: (row: any) => boolean): DataFrame;
    groupBy(columns: string | string[]): GroupedDataFrame;
    
    agg(aggregations: Record<string, string>): DataFrame;
    
    toCollection(): any[];
    toCSV(): string;
  }

  class GroupedDataFrame {
    agg(aggregations: Record<string, string>): DataFrame;
  }

  export {
    Series,
    DataFrame,
    GroupedDataFrame
  };
}