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
} from './types';

export class DataManager {
  private graph: ComputationGraph;
  private nodeExecutor: NodeExecutor;
  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
    this.graph = new ComputationGraph();
    this.nodeExecutor = new NodeExecutor(this.graph);
  }

  private addNodeSubscriptions(node: DataNode<any>): void {
    if (isTransformNode(node)) {
      this.pubSub.subscribe(node.source as DataNodeName, () =>
        this.executeNode(node.name),
      );
    } else if (isJoinNode(node)) {
      (node.sources as [DataNodeName, string][]).forEach(([sourceName]) => {
        this.pubSub.subscribe(sourceName, () => this.executeNode(node.name));
      });
    } else if (isObjectStoreNode(node)) {
      this.pubSub.subscribe(node.name as DataNodeName, () =>
        this.executeNode(node.name + '_write_node'),
      );
    } else if (isWriteNode(node)) {
      this.pubSub.subscribe(node.name as DataNodeName, () =>
        this.executeNode(node.outputObjectStore + '_object_store'),
      );
    }
  }

  subscribe(name: DataNodeName, callback: () => void): void {
    this.pubSub.subscribe(name, callback);
  }

  // Method to add a node
  addNode(node: DataNode<any>): void {
    this.graph.addNode(node);
    this.addNodeSubscriptions(node);
  }

  // Method to execute a node
  async executeNode(name: DataNodeName): Promise<void> {
    await this.nodeExecutor.executeNode(name);
    this.pubSub.notify(name);
  }

  // Method to get node data
  getNode(name: DataNodeName): DataNode<any> | undefined {
    const node = this.graph.getNode(name);
    return node ? node : undefined;
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
