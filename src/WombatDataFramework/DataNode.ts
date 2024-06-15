import {getData, storeObjectInDatabase} from '../lib/data/database';
import alasql from 'alasql';
import {DataColumn, DataColumnType} from './DataColumn';
import {format} from 'sql-formatter';
export type DataNodeName = string;

export interface DataNodeExecutionInProgress {
  startTime: number;
  inputRows: number;
}

export interface DataNodeExecution extends DataNodeExecutionInProgress {
  endTime: number;
  outputRows: number;
  error?: string;
}

const startExecution = (inputRows: number): DataNodeExecutionInProgress => {
  return {
    startTime: Date.now(),
    inputRows,
  };
};

const completeExecution = (execution: DataNodeExecutionInProgress, outputRows: number): DataNodeExecution => {
  return {
    ...execution,
    endTime: Date.now(),
    outputRows,
  };
};

const failExecution = (execution: DataNodeExecutionInProgress, error: string): DataNodeExecution => {
  return {
    ...completeExecution(execution, 0),
    error,
  };
};

export interface DataNodeInit {
  name: DataNodeName;
  displayName: string;
  columnNames: string[];
}

export abstract class DataNode<OutType extends object> {
  private type: 'WriteNode' | 'ObjectStoreNode' | 'AlaSQLNode' | 'FilterNode';
  protected name: DataNodeName;
  protected displayName: string;
  protected columns: DataColumn[];
  private output?: OutType[];
  protected executionInProgress?: DataNodeExecutionInProgress;
  protected executions: DataNodeExecution[] = [];
  protected needsRun = true;

  constructor(name: DataNodeName, displayName: string, columns: DataColumn[], type: 'WriteNode' | 'ObjectStoreNode' | 'AlaSQLNode' | 'FilterNode') {
    this.name = name;
    this.displayName = displayName;
    this.columns = columns;
    this.type = type;
  }

  public getName(): DataNodeName {
    return this.name;
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public getType(): 'WriteNode' | 'ObjectStoreNode' | 'AlaSQLNode' | 'FilterNode' {
    return this.type;
  }

  public getColumns(): DataColumn[] {
    return this.columns;
  }

  public getOutput(): OutType[] | undefined {
    return this.output;
  }

  public getError(): string | undefined {
    return this.executions.find((execution) => execution.error)?.error;
  }

  public getExecutions(): DataNodeExecution[] {
    return this.executions;
  }

  public getLatestExecution(): DataNodeExecution {
    if (this.executions.length === 0) {
      throw new Error('No executions');
    }
    return this.executions[this.executions.length - 1];
  }

  public getExecutionCount(): number {
    return this?.executions.length ?? 0;
  }

  protected setOutput(data: OutType[]): void {
    this.output = data;
  }

  public setNeedsRun(needsRun: boolean): void {
    this.needsRun = needsRun;
  }

  public async run(sourceData?: any[][]): Promise<void> {
    if (this.executionInProgress !== undefined) {
      throw new Error('Execution already in progress');
    }
    this.setNeedsRun(false);
    const sourceDataLength = sourceData ? sourceData.reduce((acc, data) => acc + data.length, 0) : 0;
    this.executionInProgress = startExecution(sourceDataLength);
    console.log(`Running ${this.name}`, sourceData);
    try {
      await this.runInner(sourceData);
      this.validateData();
      this.executions.push(completeExecution(this.executionInProgress, this.output!.length));
    } catch (e) {
      this.executions.push(failExecution(this.executionInProgress, e.message));
      throw e;
    } finally {
      this.executionInProgress = undefined;
    }
  }

  protected abstract runInner(sourceData?: any[]): Promise<void>;
  public abstract getDependencies(): DataNodeName[];
  public abstract hasOutput(): boolean;

  public abstract getDescription(): string;

  public abstract canRun(): boolean;

  public isRunning(): boolean {
    return this.executionInProgress !== undefined;
  }

  public hasError(): boolean {
    return !this.isRunning() && this.executions.some((execution) => execution.error !== undefined);
  }

  public abstract toString(): string;

  private validateData(): void {
    // verify that all of the columns are present
    if (this.output === undefined) {
      return;
    }
    for (const item of this.output) {
      for (const column of this.getColumns().map((column) => column.name)) {
        if (item[column] === undefined) {
          throw new Error(`Column ${String(column)} is undefined for item ${JSON.stringify(item)}`);
        }
      }
      for (const field in item) {
        if (field === 'id') {
          // All objects from an object store have an id field, it isn't used
          continue;
        }
        if (!this.columns.some((column) => column.name === field)) {
          throw new Error(`Field ${field} is not defined in columns for item ${JSON.stringify(item)}`);
        }
      }
    }
  }
}

export interface WriteNodeInit extends DataNodeInit {
  objectStore: string;
}

// This represents a node that writes data to an object store.
export class WriteNode<Type extends object> extends DataNode<Record<string, never>> {
  private data: Type[] = [];
  private objectStore: string;
  constructor(name: DataNodeName, displayName: string, objectStore: string) {
    super(name, displayName, [], 'WriteNode');
    this.objectStore = objectStore;
  }

  async runInner(sourceData?: Type[]): Promise<void> {
    for (const item of this.data) {
      await storeObjectInDatabase(item, this.objectStore);
    }
    this.data = [];
  }
  getDependencies(): DataNodeName[] {
    return [];
  }
  getObjectStore(): string {
    return this.objectStore;
  }
  toString(): string {
    return `Write to ${this.objectStore}`;
  }
  addData(data: Type[]) {
    this.data.push(...data);
  }
  canRun(): boolean {
    return this.data.length > 0;
  }
  public hasOutput(): boolean {
    return true;
  }
  public getDescription(): string {
    return `Writes data to the ${this.objectStore} object store.`;
  }
}

export interface ObjectStoreNodeInit extends DataNodeInit {
  objectStore: string;
}

// This represents a node that reads data from an object store.
export class ObjectStoreNode<OutType extends object> extends DataNode<OutType> {
  private objectStore: string;

  constructor(name: DataNodeName, displayName: string, objectStore: string, columns: DataColumn[]) {
    super(name, displayName, columns, 'ObjectStoreNode');
    this.objectStore = objectStore;
  }

  async runInner(sourceData?: any[]): Promise<void> {
    this.setOutput((await getData(this.objectStore)) as OutType[]);
  }

  getDependencies(): DataNodeName[] {
    return [this.objectStore + '_write_node'];
  }
  getObjectStore(): string {
    return this.objectStore;
  }
  toString(): string {
    return `Read from ${this.objectStore}`;
  }
  canRun(): boolean {
    return this.needsRun;
  }
  public hasOutput(): boolean {
    return this.getOutput() !== undefined && this.getOutput()!.length > 0;
  }
  public getDescription(): string {
    return `Reads data from the ${this.objectStore} object store.`;
  }
}

export interface AlaSQLNodeInit extends DataNodeInit {
  sql: string;
  sources: DataNodeName[];
}

// This represents a node that executes an AlaSQL query on the data from the source nodes.
export class AlaSQLNode<OutType extends object> extends DataNode<OutType> {
  private sql: string;
  private sources: DataNodeName[];
  constructor(name: DataNodeName, displayName: string, sql: string, sources: DataNodeName[], columns: DataColumn[]) {
    super(name, displayName, columns, 'AlaSQLNode');
    this.sql = sql;
    this.sources = sources;
  }
  async runInner(sourceData?: any[]): Promise<void> {
    const result = await alasql(this.sql, sourceData);
    this.setOutput(result);
  }
  getDependencies(): DataNodeName[] {
    return this.sources;
  }
  toString(): string {
    return this.displayName;
  }
  canRun(): boolean {
    return this.needsRun;
  }
  changeSql(sql: string) {
    this.sql = sql;
  }
  public hasOutput(): boolean {
    return this.getOutput() !== undefined && this.getOutput()!.length > 0;
  }
  public getDescription(): string {
    console.log('format', format(this.sql, {language: 'sql'}));
    return `${format(this.sql, {language: 'sql'})}`;
  }
}

export interface FilterNodeInit extends DataNodeInit {
  filterKey: string;
  filterValue: DataColumnType;
  source: DataNodeName;
}

export class FilterNode<T extends object> extends DataNode<T> {
  private filterKey: string;
  private filterValue: DataColumnType;
  private source: DataNodeName;

  constructor(name: DataNodeName, displayName: string, filterKey: string, filterValue: DataColumnType, source: DataNodeName, columns: DataColumn[]) {
    super(name, displayName, columns, 'FilterNode');
    this.filterKey = filterKey;
    this.filterValue = filterValue;
    this.source = source;
  }

  runInner(sourceData?: T[]): Promise<void> {
    if (sourceData === undefined) {
      throw new Error('Source data is undefined');
    }

    const output = sourceData.filter((data) => data[this.filterKey] === this.filterValue);
    this.setOutput(output);
    return Promise.resolve();
  }

  getDependencies(): DataNodeName[] {
    return [this.source];
  }

  toString(): string {
    return `Filter by ${String(this.filterKey)} = ${String(this.filterValue)}`;
  }

  canRun(): boolean {
    return this.needsRun;
  }

  public hasOutput(): boolean {
    return this.getOutput() !== undefined;
  }

  public getDescription(): string {
    return `Filters the data where the ${String(this.filterKey)} field is equal to ${String(this.filterValue)}.`;
  }
}
