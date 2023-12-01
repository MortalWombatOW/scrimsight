import {
  DataNodeName,
  DataNode,
  ObjectStoreNode,
  WriteNode,
  isWriteNode,
  isObjectStoreNode,
  isAlaSQLNode,
} from './DataTypes';

class ComputationGraph {
  private nodes: Map<DataNodeName, DataNode<any>> = new Map();

  addNode(node: DataNode<any>): void {
    this.nodes.set(node.name, node);
  }

  hasNode(name: DataNodeName): boolean {
    return this.nodes.has(name);
  }

  getNode(name: DataNodeName): DataNode<any> {
    if (!this.nodes.has(name)) throw new Error(`Node ${name} does not exist`);
    return this.nodes.get(name)!;
  }

  getNodes(): DataNode<any>[] {
    return Array.from(this.nodes.values());
  }

  getEdges(name: DataNodeName): [DataNodeName, DataNodeName][] {
    const edges: [DataNodeName, DataNodeName][] = [];
    const node = this.getNode(name);
    if (!node) return edges;
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
    if (isAlaSQLNode(node)) {
      return node.sources;
    }
    return [];
  }

  nodeHasData(name: DataNodeName): boolean {
    const node = this.getNode(name);
    return node.output !== undefined;
  }

  nodeIsRunning(name: DataNodeName): boolean {
    const node = this.getNode(name);
    return node.state === 'running';
  }

  getNodesToRun(name: DataNodeName): DataNodeName[] {
    // const node = this.getNode(name);
    const dependencies = this.getDirectDependencies(name);
    // If the node doesn't have any dependencies, then it is a root node and should be run.
    if (dependencies.length === 0) return [name];
    // If the node has dependencies, then it should be run only if all of its dependencies have data.
    const dependenciesWithoutData = dependencies.filter(
      (dep) => !this.nodeHasData(dep) && !this.nodeIsRunning(dep),
    );
    if (dependenciesWithoutData.length > 0) {
      return [
        ...new Set(
          dependenciesWithoutData.flatMap((dep) => this.getNodesToRun(dep)),
        ),
      ];
    }
    if (!this.nodeIsRunning(name) && !this.nodeHasData(name)) {
      return [name];
    }
    return [];
  }

  toString(): string {
    let str = '';
    this.nodes.forEach((node) => {
      str += `${node.name}:\n`;
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
