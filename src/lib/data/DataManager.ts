import {DataNode, DataNodeName} from './DataTypes';

export class DataManager {
  private nodes: Map<DataNodeName, DataNode<any>>;
  private changeCallback: () => void;
  private nodeCallbacks: Map<DataNodeName, () => void>;

  constructor(nodes: DataNode<any>[], changeCallback: () => void) {
    this.nodes = new Map();
    nodes.forEach((node) => this.nodes.set(node.getName(), node));
    this.changeCallback = changeCallback;
    this.nodeCallbacks = new Map();
  }

  private nodesDependingOn(name: DataNodeName): DataNodeName[] {
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
      if (!this.nodes.get(dep)?.hasOutput()) {
        throw new Error(`Dependency ${dep} is empty, skipping ${name}`);
      }
      if (this.nodes.get(dep)?.isRunning()) {
        throw new Error(`Dependency ${dep} is running, skipping ${name}`);
      }
      return this.nodes.get(dep)?.getOutput();
    });

    try {
      await node.run(sourceData);
    } catch (e) {
      console.error(e);
    } finally {
      console.log(`Node ${name} finished, data:`, node.getOutput());
      // console.groupEnd();
      if (this.nodeCallbacks.has(name)) {
        this.nodeCallbacks.get(name)!();
      }
    }
  }

  addNodeCallback(name: DataNodeName, callback: () => void): void {
    this.nodeCallbacks.set(name, callback);
  }

  getNodeOrDie(name: DataNodeName): DataNode<any> {
    const node = this.nodes.get(name);
    if (!node) {
      throw new Error(`Node ${name} does not exist`);
    }
    return node;
  }

  getNextNodeToExecute(): DataNode<any> | undefined {
    const nodes = this.getNodesToExecute();
    if (nodes.length === 0) {
      return undefined;
    }
    return nodes[0];
  }

  getNodesToExecute(): DataNode<any>[] {
    const visited: string[] = [];
    const stack: string[] = [];

    for (const node of this.nodes.keys()) {
      if (!visited.includes(node)) {
        this.topoSort(node, visited, stack);
      }
    }

    return stack
      .filter(
        (name) =>
          this.getNodeOrDie(name).canRun() &&
          !this.getNodeOrDie(name).isRunning(),
      )
      .map((name) => this.getNodeOrDie(name));
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

  async process(): Promise<void> {
    // let node: DataNode<any> | undefined;
    // while ((node = this.getNextNodeToExecute())) {
    //   console.log('Executing', node.getName());
    //   await this.executeNode(node.getName());
    // }

    let nodes = this.getNodesToExecute();
    while (nodes.length > 0) {
      for (const node of nodes) {
        await this.executeNode(node.getName());
      }
      nodes = this.getNodesToExecute();
    }

    // console.log(
    //   'Nodes executed',
    //   nodes.map((node) => node.getName()),
    // );

    // this.changeCallback();
  }

  markNode(name: DataNodeName): void {
    const node = this.getNodeOrDie(name);
    node.setNeedsRun(true);
    const nodes = this.nodesDependingOn(name);
    nodes.forEach((node) => this.markNode(node));
  }

  getNodeOutputOrDie(name: DataNodeName): any {
    const node = this.getNodeOrDie(name);
    if (!node.hasOutput()) {
      throw new Error(`Node ${name} has no output`);
    }
    return node.getOutput();
  }

  getNodes(): DataNode<any>[] {
    return [...this.nodes.values()];
  }

  // getEdges(name: DataNodeName): [DataNodeName, DataNodeName][] {
  //   return this.graph.getEdgesCreatedByNode(name);
  // }

  // toString(): string {
  //   return this.graph.toString();
  // }
}
