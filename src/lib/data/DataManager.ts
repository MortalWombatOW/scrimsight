import ComputationGraph from './ComputationGraph';
import NodeExecutor from './NodeExecutor';
import PubSub from './PubSub';
import {DataNode, DataNodeName} from './types';

export class DataManager {
  private graph: ComputationGraph;
  private nodeExecutor: NodeExecutor;
  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
    this.graph = new ComputationGraph();
    this.nodeExecutor = new NodeExecutor(this.pubSub, this.graph);
  }

  // Inside DataManager class

  // Method to add a node
  addNode(node: DataNode<any>): void {
    this.graph.addNode(node);
    console.log(`Added node ${node.name}`);
  }

  // Method to execute a node
  async executeNode(name: DataNodeName): Promise<void> {
    await this.nodeExecutor.executeNode(name, this.graph);
  }

  // Method to get node data
  getNode(name: DataNodeName): DataNode<any> | undefined {
    const node = this.graph.getNode(name);
    return node ? node : undefined;
  }

  getNodeNames(): DataNodeName[] {
    return this.graph.getNodes().map((node) => node.name);
  }

  getEdges(): [DataNodeName, DataNodeName][] {
    return this.graph.getEdges();
  }
}
