import ComputationGraph from './ComputationGraph';
import NodeExecutor from './NodeExecutor';
import PubSub from './PubSub';
import {
  DataNode,
  DataNodeName,
  isJoinNode,
  isObjectStoreNode,
  isTransformNode,
  isWriteNode,
  isAlaSQLNode,
} from './types';

export class DataManager {
  private graph: ComputationGraph;
  private nodeExecutor: NodeExecutor;
  private pubSub: PubSub;

  constructor() {
    this.graph = new ComputationGraph();
    this.nodeExecutor = new NodeExecutor(this.graph);
    this.pubSub = new PubSub((source) => {
      console.log(`Notified ${source}`);
      this.executeNode(source);
    });
  }

  private addNodeSubscriptions(node: DataNode<any>): void {
    if (isTransformNode(node)) {
      this.pubSub.subscribe(node.source as DataNodeName, node.name);
    } else if (isJoinNode(node)) {
      (node.sources as [DataNodeName, string][]).forEach(([sourceName]) => {
        this.pubSub.subscribe(sourceName, node.name);
      });
    } else if (isWriteNode(node)) {
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
  addNode(node: DataNode<any>): void {
    this.graph.addNode(node);
    this.addNodeSubscriptions(node);
  }

  // Method to execute a node
  async executeNode(name: DataNodeName): Promise<void> {
    const nodes = this.graph.getNodesToRun(name);
    console.log('for node ', name, 'nodes to run are', nodes.join(', '));
    const nodesToNotify = new Set<DataNodeName>();
    for (const node of nodes) {
      await this.nodeExecutor.executeNode(node);
      nodesToNotify.add(node);
    }
    nodesToNotify.forEach((node) => this.pubSub.notify(node));
    console.log(this.getNode(name)?.output);
  }

  // Method to get node data
  getNode(name: DataNodeName): DataNode<any> | undefined {
    return this.graph.getNode(name);
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
