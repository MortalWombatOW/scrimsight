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
  isAlaSQLNode,
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
    if (isAlaSQLNode(node)) {
      node.sources.forEach((sourceName) => edges.push([sourceName, node.name]));
    }

    return edges;
  }

  getDirectDependencies(name: DataNodeName): DataNodeName[] {
    const node = this.getNode(name);
    if (!node) throw new Error(`Node ${name} does not exist`);
    if (isTransformNode(node)) {
      return [node.source];
    }
    if (isJoinNode(node)) {
      return node.sources.map(([sourceName]) => sourceName);
    }
    if (isAlaSQLNode(node)) {
      return node.sources;
    }
    return [];
  }

  nodeHasData(name: DataNodeName): boolean {
    const node = this.getNode(name);
    if (!node) throw new Error(`Node ${name} does not exist`);
    return node.output !== undefined;
  }

  getNodesToRun(name: DataNodeName): DataNodeName[] {
    const node = this.getNode(name);
    if (!node) throw new Error(`Node ${name} does not exist`);
    const dependencies = this.getDirectDependencies(name);
    // If the node doesn't have any dependencies, then it is a root node and should be run.
    if (dependencies.length === 0) return [name];
    // If the node has dependencies, then it should be run only if all of its dependencies have data.
    const dependenciesWithoutData = dependencies.filter(
      (dep) => !this.nodeHasData(dep),
    );
    if (dependenciesWithoutData.length === 0) return [name];
    return dependenciesWithoutData.flatMap((dep) => this.getNodesToRun(dep));
  }

  toString(): string {
    let str = '';
    this.nodes.forEach((node) => {
      str += `${node.name}:\n`;
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
      if (isAlaSQLNode(node)) {
        str += `  sources: ${node.sources}\n`;
      }
    });
    return str;
  }
}

export default ComputationGraph;
