/**
 * Adapter for pandas-js that implements the key functionality we need
 * instead of trying to import the actual pandas-js library
 */

export class Series {
  private data: any[];

  constructor(data: any[]) {
    this.data = data;
  }

  map(fn: (value: any) => any): Series {
    return new Series(this.data.map(fn));
  }

  apply(fn: (value: any) => any): Series {
    return new Series(this.data.map(fn));
  }

  toArray(): any[] {
    return [...this.data];
  }

  toCollection(): any[] {
    return [...this.data];
  }
}

export class GroupedDataFrame {
  private groups: Map<string, any[]>;
  private groupByColumns: string[];

  constructor(data: any[], groupByColumns: string | string[]) {
    this.groupByColumns = Array.isArray(groupByColumns) ? groupByColumns : [groupByColumns];
    this.groups = new Map();

    // Group the data
    for (const item of data) {
      const key = this.getGroupKey(item);
      if (!this.groups.has(key)) {
        this.groups.set(key, []);
      }
      this.groups.get(key)?.push(item);
    }
  }

  private getGroupKey(item: any): string {
    return this.groupByColumns.map(col => String(item[col])).join('|');
  }

  agg(aggregations: Record<string, string>): DataFrame {
    const result: any[] = [];

    // Process each group
    this.groups.forEach((groupItems, key) => {
      const groupValues = key.split('|');
      const resultItem: any = {};

      // Add group by columns to result
      this.groupByColumns.forEach((col, index) => {
        resultItem[col] = groupValues[index];
      });

      // Perform aggregations
      Object.entries(aggregations).forEach(([field, aggType]) => {
        if (aggType === 'sum') {
          resultItem[field] = groupItems.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
        } else if (aggType === 'mean' || aggType === 'avg') {
          const sum = groupItems.reduce((acc, item) => acc + (Number(item[field]) || 0), 0);
          resultItem[field] = sum / groupItems.length;
        } else if (aggType === 'count') {
          resultItem[field] = groupItems.length;
        } else if (aggType === 'min') {
          resultItem[field] = Math.min(...groupItems.map(item => Number(item[field]) || 0));
        } else if (aggType === 'max') {
          resultItem[field] = Math.max(...groupItems.map(item => Number(item[field]) || 0));
        }
      });

      result.push(resultItem);
    });

    return new DataFrame(result);
  }
}

export class DataFrame {
  private data: any[];

  constructor(data: any[]) {
    this.data = data;
  }

  static fromCSV(csv: string): DataFrame {
    // Simple CSV parser - not as robust as the real thing
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      data.push(row);
    }

    return new DataFrame(data);
  }

  filter(predicate: (row: any) => boolean): DataFrame {
    return new DataFrame(this.data.filter(predicate));
  }

  groupBy(columns: string | string[]): GroupedDataFrame {
    return new GroupedDataFrame(this.data, columns);
  }

  agg(aggregations: Record<string, string>): DataFrame {
    // For non-grouped data, treat everything as one group
    const grouped = new GroupedDataFrame(this.data, []);
    return grouped.agg(aggregations);
  }

  toCollection(): any[] {
    return [...this.data];
  }

  toCSV(): string {
    if (this.data.length === 0) return '';
    
    const headers = Object.keys(this.data[0]);
    const headerRow = headers.join(',');
    const dataRows = this.data.map(row => {
      return headers.map(header => row[header]).join(',');
    });
    
    return [headerRow, ...dataRows].join('\n');
  }
}

// Export a default object that mimics the pandas-js API
export default {
  DataFrame,
  Series,
  GroupedDataFrame
};