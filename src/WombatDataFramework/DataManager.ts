/* eslint-disable @typescript-eslint/no-explicit-any */
import {DataColumn} from './DataColumn';
import {AlaSQLNode, AlaSQLNodeInit, DataNode, DataNodeName, FilterNode, FilterNodeInit, ObjectStoreNode, ObjectStoreNodeInit, WriteNode, WriteNodeInit} from './DataNode';

export class DataManager {
  private nodes: Map<DataNodeName, DataNode<any>>;
  private globalCallbacks: Map<string, () => void>;
  private nodeCallbacks: Map<DataNodeName, () => void>;

  private columns: Map<string, DataColumn>;

  constructor(changeCallback: () => void) {
    this.nodes = new Map();
    this.globalCallbacks = new Map();
    this.globalCallbacks.set('globalChange', changeCallback);
    this.nodeCallbacks = new Map();
    this.columns = new Map();
  }

  public registerGlobalCallback(callback: [string, () => void]): void {
    this.globalCallbacks.set(callback[0], callback[1]);
  }

  public registerColumn(column: DataColumn): void {
    if (this.columns.has(column.name)) {
      throw new Error(`Column ${column.name} already exists`);
    }
    this.columns.set(column.name, column);
  }

  public getColumn(name: string): DataColumn {
    const column = this.columns.get(name);
    if (!column) {
      throw new Error(`Column ${name} does not exist`);
    }
    return column;
  }

  public nodesDependingOn(name: DataNodeName): DataNodeName[] {
    const nodes: DataNodeName[] = [];
    this.nodes.forEach((node) => {
      if (node.getDependencies().includes(name)) {
        nodes.push(node.getName());
      }
    });
    return nodes;
  }

  async executeNode(name: DataNodeName): Promise<void> {
    // console.group(`DataManager.executeNode(${name})`);
    const node = this.nodes.get(name);
    if (!node) {
      throw new Error(`Node ${name} does not exist`);
    }
    if (node.isRunning()) {
      console.log(`Node ${name} is already running`);
      console.groupEnd();
      return;
    }
    const dependencies = node.getDependencies();
    const sourceData = dependencies.map((dep) => {
      if (this.nodes.get(dep)?.isRunning()) {
        throw new Error(`Dependency ${dep} is running, skipping ${name}`);
      }
      return this.nodes.get(dep)?.getOutput() || [];
    });

    try {
      await node.run(sourceData);
    } catch (e) {
      console.error(e);
    } finally {
      console.log(`Node ${name} finished, data:`, node.getOutput());
      this.globalCallbacks.forEach((callback) => callback());
      const callback = this.nodeCallbacks.get(name);
      if (callback !== undefined) {
        console.log(`Executing callback for ${name}`);
        callback();
      }
    }
  }

  private checkForCycles(): void {
    const visited: DataNodeName[] = [];
    const stack: DataNodeName[] = [];

    for (const node of this.nodes.keys()) {
      if (!visited.includes(node)) {
        if (this.isCyclic(node, visited, stack)) {
          throw new Error('Cycle detected');
        }
      }
    }
  }

  private isCyclic(v: DataNodeName, visited: DataNodeName[], stack: DataNodeName[]): boolean {
    if (stack.includes(v)) {
      return true;
    }
    if (visited.includes(v)) {
      return false;
    }
    visited.push(v);
    stack.push(v);

    const node = this.nodes.get(v);
    if (!node) {
      throw new Error(`Node ${v} does not exist`);
    }
    for (const node of this.nodesDependingOn(v)) {
      if (this.isCyclic(node, visited, stack)) {
        return true;
      }
    }
    stack.pop();
    return false;
  }

  public addWriteNode(init: WriteNodeInit): void {
    this.setNode(new WriteNode(init.name, init.displayName, init.objectStore));
  }

  public addObjectStoreNode(init: ObjectStoreNodeInit): void {
    this.setNode(
      new ObjectStoreNode(
        init.name,
        init.displayName,
        init.objectStore,
        init.columnNames.map((name) => this.getColumn(name)),
      ),
    );
  }

  public addAlaSQLNode(init: AlaSQLNodeInit): void {
    this.setNode(
      new AlaSQLNode(
        init.name,
        init.displayName,
        init.sql,
        init.sources,
        init.columnNames.map((name) => this.getColumn(name)),
      ),
    );
  }

  private setNode(node: DataNode<any>): void {
    if (this.nodes.has(node.getName())) {
      console.log(`Node ${node.getName()} already exists`);
      return;
    }
    console.log(`Adding node ${node.getName()}`);
    this.checkForCycles();
    this.nodes.set(node.getName(), node);
  }

  public addNodeCallback(name: DataNodeName, callback: () => void): void {
    this.nodeCallbacks.set(name, callback);
  }

  public getNodesToExecute(): DataNode<any>[] {
    const visited: string[] = [];
    const stack: string[] = [];

    for (const node of this.nodes.keys()) {
      if (!visited.includes(node)) {
        this.topoSort(node, visited, stack);
      }
    }

    return stack.filter((name) => this.getNodeOrDie(name).canRun() && !this.getNodeOrDie(name).isRunning()).map((name) => this.getNodeOrDie(name));
  }

  private topoSort(v: string, visited: string[], stack: string[]): void {
    if (visited.includes(v)) {
      return;
    }
    visited.push(v);
    for (const node of this.getNodeOrDie(v).getDependencies()) {
      if (!visited.includes(node)) {
        this.topoSort(node, visited, stack);
      }
    }
    stack.push(v);
  }

  public async process(): Promise<void> {
    let nodes = this.getNodesToExecute();
    while (nodes.length > 0) {
      for (const node of nodes) {
        await this.executeNode(node.getName());
      }
      nodes = this.getNodesToExecute();
    }
  }

  public markNode(name: DataNodeName): void {
    const node = this.getNodeOrDie(name);
    node.setNeedsRun(true);
    const nodes = this.nodesDependingOn(name);
    nodes.forEach((node) => this.markNode(node));
  }

  public getNodeOrDie(name: DataNodeName): DataNode<any> {
    const node = this.nodes.get(name);
    if (!node) {
      throw new Error(`Node ${name} does not exist`);
    }
    return node;
  }

  public getNodeOutputOrDie(name: DataNodeName): any {
    const node = this.getNodeOrDie(name);
    if (!node.hasOutput()) {
      throw new Error(`Node ${name} has no output`);
    }
    return node.getOutput();
  }

  public getNodeNames(): DataNodeName[] {
    return [...this.nodes.keys()];
  }
}
