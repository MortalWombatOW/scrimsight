import {
  ObjectStoreNode,
  TransformNode,
  JoinNode,
  DataNodeName,
  WriteNode,
  isTransformNode,
  isJoinNode,
  isObjectStoreNode,
  isWriteNode,
} from './types';

import {storeObjectInDatabase, getData} from './database';
import ComputationGraph from './ComputationGraph';

class NodeExecutor {
  constructor(private graph: ComputationGraph) {}

  private async handleWriteNode(node: WriteNode<any>): Promise<void> {
    for (const item of node.data) {
      await storeObjectInDatabase(item, node.outputObjectStore);
    }
  }

  private async handleObjectStoreNode(
    node: ObjectStoreNode<any>,
  ): Promise<void> {
    node.output = await getData(node.objectStore);
  }

  private handleTransformNode(node: TransformNode<any, any>): void {
    const sourceNode = this.graph.getNode(node.source);
    if (sourceNode && sourceNode.output) {
      node.output = sourceNode.output.map(node.transform);
    }
  }

  private handleJoinNode(node: JoinNode<any>): void {
    const sourceData: {[name: string]: any[]} = {};

    // Fetch the output data for each source node.
    for (const [sourceName] of node.sources) {
      const sourceNode = this.graph.getNode(sourceName);
      if (sourceNode && sourceNode.output) {
        sourceData[sourceName] = sourceNode.output;
      } else {
        // If the source node doesn't have output data, then the join can't be performed.
        return;
      }
    }

    // Initialize the joined output array.
    const joinedOutput: any[] = [];

    // Perform the inner join.
    // This is a naive nested-loop join for demonstration purposes.
    // It may not be suitable for large datasets.
    if (node.sources.length > 0) {
      const [firstSourceName, firstFieldName] = node.sources[0];
      for (const firstItem of sourceData[firstSourceName]) {
        let joinCandidate = {...firstItem};
        let joinable = true;
        for (let i = 1; i < node.sources.length; i++) {
          const [sourceName, fieldName] = node.sources[i];
          const match = sourceData[sourceName].find(
            (item) => item[fieldName] === firstItem[firstFieldName],
          );
          if (match) {
            joinCandidate = {...joinCandidate, ...match};
          } else {
            joinable = false;
            break;
          }
        }
        if (joinable) {
          joinedOutput.push(joinCandidate);
        }
      }
    }

    // Set the joined output as the output of this node.
    node.output = joinedOutput;
  }

  async executeNode(name: DataNodeName): Promise<void> {
    const node = this.graph.getNode(name);
    if (!node) return;

    node.state = 'running';

    try {
      if (isWriteNode(node)) {
        await this.handleWriteNode(node);
      } else if (isObjectStoreNode(node)) {
        await this.handleObjectStoreNode(node);
      } else if (isTransformNode(node)) {
        this.handleTransformNode(node);
      } else if (isJoinNode(node)) {
        this.handleJoinNode(node);
      }

      node.state = 'done';
    } catch (error) {
      node.state = 'error';
    }

    console.log('node', node);
  }
}

export default NodeExecutor;
