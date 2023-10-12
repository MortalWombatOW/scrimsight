import {
  DataNodeName,
  DataNode,
  TransformNode,
  JoinNode,
  ObjectStoreNode,
  WriteNode,
} from './types';

class ComputationGraph {
  private nodes: Map<DataNodeName, DataNode<any>> = new Map();

  addNode(node: DataNode<any>): void {
    this.nodes.set(node.name, node);
  }

  getNode(name: DataNodeName): DataNode<any> | undefined {
    return this.nodes.get(name);
  }

  getNodes(): DataNode<any>[] {
    return Array.from(this.nodes.values());
  }

  getEdges(): [DataNodeName, DataNodeName][] {
    const edges: [DataNodeName, DataNodeName][] = [];
    for (const node of this.getNodes()) {
      if ('source' in node) {
        edges.push([(node as TransformNode<any, any>).source, node.name]);
      } else if ('sources' in node) {
        for (const [sourceName] of (node as JoinNode<any>).sources) {
          edges.push([sourceName, node.name]);
        }
      } else if ('objectStore' in node) {
        edges.push([(node as ObjectStoreNode<any>).objectStore, node.name]);
      } else if ('outputObjectStore' in node) {
        edges.push([(node as WriteNode<any>).outputObjectStore, node.name]);
      }
    }
    return edges;
  }
}

export default ComputationGraph;
