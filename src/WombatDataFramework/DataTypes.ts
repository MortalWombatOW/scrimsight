import {node} from 'webpack';
import {getData, storeObjectInDatabase} from '../lib/data/database';
import alasql from 'alasql';

export type DataNodeName = string;

export class DataNodeExecution {
  private startTime: number;
  private endTime: number;
  private duration: number;
  private completed: boolean;
  private inputRows: number;
  private outputRows: number;
  private error?: string;

  constructor() {
    this.startTime = Date.now();
    this.completed = false;
    this.inputRows = 0;
    this.outputRows = 0;
  }

  public complete(inputRows: number, outputRows: number): void {
    if (this.completed) {
      throw new Error('Execution already completed');
    }
    this.endTime = Date.now();
    this.duration = this.endTime - this.startTime;
    this.completed = true;
    this.inputRows = inputRows;
    this.outputRows = outputRows;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getCompleted(): boolean {
    return this.completed;
  }

  public getInputRows(): number {
    return this.inputRows;
  }

  public getOutputRows(): number {
    return this.outputRows;
  }

  public getError(): string | undefined {
    return this.error;
  }

  public setError(error: string): void {
    this.error = error;
  }

  public toString(): string {
    return `DataNodeExecution(${this.startTime}, ${this.endTime}, ${this.duration}, ${this.completed}, ${this.inputRows}, ${this.outputRows}, ${this.error})`;
  }
}

export interface DataNodeMetadata {
  executions: DataNodeExecution[];
}

export interface DataColumn<T extends object> {
  name: keyof T;
  missingData: boolean;
}

// This represents a node in the computation graph.
export abstract class DataNode<OutType extends object> {
  protected name: DataNodeName;
  protected displayName: string;
  protected columns: DataColumn<OutType>[];
  private output?: OutType[];
  protected metadata?: DataNodeMetadata;
  protected needsRun: boolean;
  constructor(
    name: DataNodeName,
    displayName: string,
    columns: (keyof OutType)[],
  ) {
    this.name = name;
    this.displayName = displayName;
    this.columns = columns.map((column) => ({
      name: column,
      missingData: false,
    }));
    this.needsRun = true;
  }
  public getName(): DataNodeName {
    return this.name;
  }
  public getDisplayName(): string {
    return this.displayName;
  }
  public getColumns(): DataColumn<OutType>[] {
    return this.columns;
  }
  public getOutput(): OutType[] | undefined {
    return this.output;
  }
  public getError(): string | undefined {
    return this.metadata?.executions
      .find((execution) => execution.getError() !== undefined)
      ?.getError();
  }
  public getMetadata(): DataNodeMetadata | undefined {
    return this.metadata;
  }
  public getLatestExecution(): DataNodeExecution {
    if (!this.metadata?.executions) {
      throw new Error('No executions');
    }
    return this.metadata?.executions[this.metadata?.executions.length - 1];
  }
  public getExecutionCount(): number {
    return this.metadata?.executions.length ?? 0;
  }
  protected setOutput(data: OutType[]): void {
    this.output = data;
  }

  public setNeedsRun(needsRun: boolean): void {
    this.needsRun = needsRun;
  }

  // public isTypeOf<T extends DataNode<any>>(
  //   constructor: new (...args: any[]) => T,
  // ): this is T {
  //   return this instanceof constructor;
  //
  public async run(sourceData?: any[]): Promise<void> {
    if (!this.metadata) {
      this.metadata = {
        executions: [],
      };
    } else if (!this.getLatestExecution().getCompleted()) {
      throw new Error('Last execution not completed');
    }
    this.setNeedsRun(false);
    this.metadata.executions.push(new DataNodeExecution());
    await this.runInner(sourceData);
    this.validateData();
  }

  protected abstract runInner(sourceData?: any[]): Promise<void>;
  public abstract getDependencies(): DataNodeName[];
  public abstract hasOutput(): boolean;

  public abstract canRun(): boolean;

  public isRunning(): boolean {
    return (
      this.metadata?.executions.some(
        (execution) => !execution.getCompleted(),
      ) ?? false
    );
  }

  public hasError(): boolean {
    return (
      !this.isRunning() &&
      (this.metadata?.executions.some(
        (execution) => execution.getError() !== undefined,
      ) ??
        false)
    );
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
          throw new Error(
            `Column ${String(column)} is undefined for item ${item}`,
          );
        }
      }
      for (const field in item) {
        if (!this.columns.some((column) => column.name === field)) {
          throw new Error(
            `Field ${field} is not defined in columns for item ${item}`,
          );
        }
      }
    }

    this.labelColumnsMissingData();
  }
  private labelColumnsMissingData(): void {
    if (this.output === undefined || this.output.length === 0) {
      return;
    }
    for (const column of this.columns) {
      column.missingData = this.output.some(
        (item) => item[column.name] === undefined,
      );
    }
  }
}

// This represents a node that writes data to an object store.
export class WriteNode<Type extends object> extends DataNode<
  Record<string, never>
> {
  private data: Type[] = [];
  private objectStore: string;
  private inputColumns: (keyof Type)[];
  constructor(
    name: DataNodeName,
    displayName: string,
    objectStore: string,
    columns: (keyof Type)[],
  ) {
    super(name, displayName, []);
    this.objectStore = objectStore;
    this.inputColumns = columns;
  }

  validateInput(data: Type[]): void {
    for (const item of data) {
      for (const column of this.inputColumns) {
        if (item[column] === undefined) {
          throw new Error(`Column ${String(column)} is undefined`);
        }
      }
    }
  }

  async runInner(sourceData?: Type[]): Promise<void> {
    this.validateInput(this.data);
    for (const item of this.data) {
      await storeObjectInDatabase(item, this.objectStore);
    }
    this.getLatestExecution().complete(0, this.data.length);
    this.data = [];
  }
  getDependencies(): DataNodeName[] {
    return [];
  }
  getObjectStore(): string {
    return this.objectStore;
  }
  toString(): string {
    return this.displayName;
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
}

// This represents a node that reads data from an object store.
export class ObjectStoreNode<OutType extends object> extends DataNode<OutType> {
  private objectStore: string;

  constructor(
    name: DataNodeName,
    displayName: string,
    objectStore: string,
    columns: (keyof OutType)[],
  ) {
    super(name, displayName, columns);
    this.objectStore = objectStore;
  }

  async runInner(sourceData?: any[]): Promise<void> {
    this.setOutput((await getData(this.objectStore)) as OutType[]);
    this.getLatestExecution().complete(0, this.getOutput()!.length);
  }

  getDependencies(): DataNodeName[] {
    return [this.objectStore + '_write_node'];
  }
  getObjectStore(): string {
    return this.objectStore;
  }
  toString(): string {
    return this.displayName;
  }
  canRun(): boolean {
    return this.needsRun;
  }
  public hasOutput(): boolean {
    return this.getOutput() !== undefined;
  }
}

// This represents a node that executes an AlaSQL query on the data from the source nodes.
export class AlaSQLNode<OutType extends object> extends DataNode<OutType> {
  private sql: string;
  private sources: DataNodeName[];
  constructor(
    name: DataNodeName,
    displayName: string,
    sql: string,
    sources: DataNodeName[],
    columns: (keyof OutType)[],
  ) {
    super(name, displayName, columns);
    this.sql = sql;
    this.sources = sources;
  }
  async runInner(sourceData?: any[]): Promise<void> {
    const result = await alasql(this.sql, sourceData);
    this.setOutput(result);
    const inputRows = sourceData!.reduce(
      (sum, data) => sum + (data?.length ?? 0),
      0,
    );
    const outputRows = result.length;
    this.getLatestExecution().complete(inputRows, outputRows);
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
    return this.getOutput() !== undefined;
  }
}

export class PartitionNode<
  T extends object,
  PartitionFields extends object,
> extends DataNode<T & PartitionFields> {
  private partitionKey: keyof PartitionFields;
  private hasChange: (data1: T, data2: T) => boolean;
  private source: DataNodeName;

  constructor(
    name: DataNodeName,
    displayName: string,
    partitionKey: keyof PartitionFields,
    hasChange: (data1: T, data2: T) => boolean,
    source: DataNodeName,
    columns: (keyof T & keyof PartitionFields)[],
  ) {
    super(name, displayName, columns);
    this.partitionKey = partitionKey;
    this.hasChange = hasChange;
    this.source = source;
  }

  runInner(sourceData?: T[][]): Promise<void> {
    if (sourceData === undefined) {
      throw new Error('Source data is undefined');
    }

    const output: (T & PartitionFields)[] = [];
    // label the data with the partition key
    let currentId = 0;
    for (const [i, data1] of sourceData[0].entries()) {
      const copy: T & PartitionFields = {
        ...data1,
        [this.partitionKey]: currentId,
      } as T & PartitionFields;
      console.log(copy);
      output.push(copy);
      const data2 = sourceData[0][i + 1];
      if (data2 === undefined) {
        break;
      }
      if (this.hasChange(data1, data2)) {
        currentId++;
      }
    }
    console.log(output);

    this.setOutput(output);
    this.getLatestExecution().complete(sourceData[0].length, output.length);
    return Promise.resolve();
  }

  getDependencies(): DataNodeName[] {
    return [this.source];
  }

  toString(): string {
    return this.displayName;
  }

  canRun(): boolean {
    return this.needsRun;
  }

  public hasOutput(): boolean {
    return this.getOutput() !== undefined;
  }
}

export class FilterNode<T extends object> extends DataNode<T> {
  private filterKey: keyof T;
  private filterValue: any;
  private source: DataNodeName;

  constructor(
    name: DataNodeName,
    displayName: string,
    filterKey: keyof T,
    filterValue: any,
    source: DataNodeName,
    columns: (keyof T)[],
  ) {
    super(name, displayName, columns);
    this.filterKey = filterKey;
    this.filterValue = filterValue;
    this.source = source;
  }

  runInner(sourceData?: T[]): Promise<void> {
    if (sourceData === undefined) {
      throw new Error('Source data is undefined');
    }

    const output = sourceData.filter(
      (data) => data[this.filterKey] === this.filterValue,
    );
    this.setOutput(output);
    this.getLatestExecution().complete(sourceData.length, output.length);
    return Promise.resolve();
  }

  getDependencies(): DataNodeName[] {
    return [this.source];
  }

  toString(): string {
    return this.displayName;
  }

  canRun(): boolean {
    return this.needsRun;
  }

  public hasOutput(): boolean {
    return this.getOutput() !== undefined;
  }
}

export class JoinNode<T1 extends object, T2 extends object> extends DataNode<
  T1 & T2
> {
  private joinKey: keyof T1 & keyof T2;
  private source1: DataNodeName;
  private source2: DataNodeName;

  constructor(
    name: DataNodeName,
    displayName: string,
    joinKey: keyof T1 & keyof T2,
    source1: DataNodeName,
    source2: DataNodeName,
    columns: (keyof T1 & keyof T2)[],
  ) {
    super(name, displayName, columns);
    this.joinKey = joinKey;
    this.source1 = source1;
    this.source2 = source2;
  }

  runInner(sourceData?: [T1[], T2[]]): Promise<void> {
    if (sourceData === undefined) {
      throw new Error('Source data is undefined');
    }

    const output: (T1 & T2)[] = [];
    for (const data1 of sourceData[0]) {
      for (const data2 of sourceData[1]) {
        const val1: any = data1[this.joinKey as keyof T1];
        const val2: any = data2[this.joinKey as keyof T2];
        if (val1 !== undefined && val2 !== undefined && val1 === val2) {
          output.push({...data1, ...data2});
        }
      }
    }

    this.setOutput(output);
    this.getLatestExecution().complete(
      sourceData[0].length + sourceData[1].length,
      output.length,
    );
    return Promise.resolve();
  }

  getDependencies(): DataNodeName[] {
    return [this.source1, this.source2];
  }

  toString(): string {
    return this.displayName;
  }

  canRun(): boolean {
    return this.needsRun;
  }

  public hasOutput(): boolean {
    return this.getOutput() !== undefined;
  }
}
