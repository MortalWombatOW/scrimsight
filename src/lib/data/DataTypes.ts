import {node} from 'webpack';
import {getData, storeObjectInDatabase} from './database';
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

// This represents a node in the computation graph.
export abstract class DataNode<OutType> {
  protected name: DataNodeName;
  private output?: OutType[];
  protected metadata?: DataNodeMetadata;
  protected needsRun: boolean;
  constructor(name: DataNodeName) {
    this.name = name;
    this.needsRun = true;
  }
  public getName(): DataNodeName {
    return this.name;
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
}

// This represents a node that writes data to an object store.
export class WriteNode<Type> extends DataNode<void> {
  private data: Type[];
  private objectStore: string;
  constructor(name: DataNodeName, objectStore: string, data: Type[]) {
    super(name);
    this.data = data;
    this.objectStore = objectStore;
  }

  async runInner(sourceData?: any[]): Promise<void> {
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
    return `WriteNode(${this.name})`;
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
export class ObjectStoreNode<OutType> extends DataNode<OutType> {
  private objectStore: string;

  constructor(name: DataNodeName, objectStore: string) {
    super(name);
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
    return `ObjectStoreNode(${this.name})`;
  }
  canRun(): boolean {
    return this.needsRun;
  }
  public hasOutput(): boolean {
    return this.getOutput() !== undefined;
  }
}

// This represents a node that executes an AlaSQL query on the data from the source nodes.
export class AlaSQLNode<OutType> extends DataNode<OutType> {
  private sql: string;
  private sources: DataNodeName[];
  constructor(name: DataNodeName, sql: string, sources: DataNodeName[]) {
    super(name);
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
    return `AlaSQLNode(${this.name})`;
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

export class PartitionNode<T, PartitionFields> extends DataNode<
  T & PartitionFields
> {
  private partitionKey: keyof PartitionFields;
  private hasChange: (data1: T, data2: T) => boolean;
  private source: DataNodeName;

  constructor(
    name: DataNodeName,
    partitionKey: keyof PartitionFields,
    hasChange: (data1: T, data2: T) => boolean,
    source: DataNodeName,
  ) {
    super(name);
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
    return Promise.resolve();
  }

  getDependencies(): DataNodeName[] {
    return [this.source];
  }

  toString(): string {
    return `PartitionNode(${this.name})`;
  }

  canRun(): boolean {
    return this.needsRun;
  }

  public hasOutput(): boolean {
    return this.getOutput() !== undefined;
  }
}
