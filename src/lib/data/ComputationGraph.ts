import {
  DataNodeName,
  DataNode,
  TransformNode,
  JoinNode,
  ObjectStoreNode,
  WriteNode,
  isTransformNode,
  isJoinNode,
  isWriteNode,
  isObjectStoreNode,
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

  getEdges(name: DataNodeName): [DataNodeName, DataNodeName][] {
    const edges: [DataNodeName, DataNodeName][] = [];
    const node = this.getNode(name);
    if (!node) return edges;
    if (isTransformNode(node)) {
      edges.push([node.source, node.name]);
    }
    if (isJoinNode(node)) {
      node.sources.forEach(([sourceName]) => {
        edges.push([sourceName, node.name]);
      });
    }
    if (isWriteNode(node)) {
      edges.push([node.name, node.outputObjectStore + '_object_store']);
    }

    return edges;
  }

  toString(): string {
    let str = '';
    this.nodes.forEach((node) => {
      str += `Node ${node.name}:\n`;
      if (isTransformNode(node)) {
        str += `  source: ${node.source}\n`;
      }
      if (isJoinNode(node)) {
        str += `  sources: ${node.sources.map(([name]) => name)}\n`;
      }
      if (isObjectStoreNode(node)) {
        str += `  objectStore: ${node.objectStore}\n`;
      }
      if (isWriteNode(node)) {
        str += `  outputObjectStore: ${node.outputObjectStore}\n`;
      }
    });
    return str;
  }
}

export default ComputationGraph;
