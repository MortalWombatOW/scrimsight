import ComputationGraph from './ComputationGraph';
import NodeExecutor from './NodeExecutor';
import PubSub from './PubSub';
import {
  DataNode,
  DataNodeName,
  isObjectStoreNode,
  isWriteNode,
  isAlaSQLNode,
} from './DataTypes';

export class DataManager {
  private graph: ComputationGraph;
  private nodeExecutor: NodeExecutor;
  private pubSub: PubSub;

  constructor() {
    this.graph = new ComputationGraph();
    this.nodeExecutor = new NodeExecutor(this.graph);
    this.pubSub = new PubSub((source) => {
      console.log(`Running ${source} due to dependency update`);
      this.executeNode(source);
    });
  }

  private addNodeSubscriptions(node: DataNode<any>): void {
    if (isWriteNode(node)) {
      this.pubSub.subscribe(
        node.name as DataNodeName,
        node.outputObjectStore + '_object_store',
      );
    } else if (isAlaSQLNode(node)) {
      node.sources.forEach((sourceName) => {
        this.pubSub.subscribe(sourceName as DataNodeName, node.name);
      });
    }
  }

  subscribeFn(name: DataNodeName, callback: () => void): void {
    this.pubSub.subscribeFn(name, callback);
  }

  subscribeAll(callback: () => void): void {
    this.pubSub.subscribeAll(callback);
  }

  // Method to add a node
  addNode<T>(node: DataNode<T>): void {
    if (this.graph.hasNode(node.name)) {
      throw new Error(`Node ${node.name} already exists`);
    }
    this.graph.addNode(node);
    this.addNodeSubscriptions(node);
  }

  // Method to execute a node
  async executeNode(name: DataNodeName): Promise<void> {
    console.group(`DataManager.executeNode(${name})`);

    const nodes = this.graph.getNodesToRun(name);
    if (nodes.length === 0) {
      console.log('No nodes to run');
      console.groupEnd();
      return;
    }

    const nodesToNotify = new Set<DataNodeName>();
    for (const node of nodes) {
      this.getNode(node).state = 'running';
      await this.nodeExecutor.executeNode(node);
      nodesToNotify.add(node);
    }
    console.groupEnd();
    setTimeout(() => {
      nodesToNotify.forEach((node) => this.pubSub.notify(node));
    }, 1000);
    // console.log(this.getNode(name)?.output);
  }

  // Method to get node data
  getNode(name: DataNodeName): typeof node {
    const node = this.graph.getNode(name);
    return node;
  }

  getNodes(): DataNode<any>[] {
    return this.graph.getNodes();
  }

  getEdges(name: DataNodeName): [DataNodeName, DataNodeName][] {
    return this.graph.getEdges(name);
  }

  toString(): string {
    return this.graph.toString();
  }
}
